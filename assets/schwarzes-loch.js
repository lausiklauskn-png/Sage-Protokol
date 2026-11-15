/* Sage-Protokol — Schwarzes Loch, live gerechnet.
 *
 * A real-time gravitational-lensing renderer (WebGL2 fragment shader):
 * light rays are bent on Schwarzschild geodesics, the accretion disk is
 * Doppler-beamed, the image behind the hole appears above and below it.
 *
 * Fail-soft by design (Galaxy Tab S6 is the reference device):
 *   1. live + adaptive  — render resolution follows the measured frame time
 *   2. recording        — if even the smallest resolution stutters, a
 *                         pre-rendered loop (video) takes over
 *   3. untouched        — no WebGL2 and no video: the host page keeps
 *                         whatever it showed before (CSS fallback)
 *
 * No dependencies, no network requests besides the optional recording.
 * Usage:  SchwarzesLoch.einbauen(sceneElement, { knopf, video, poster })
 * Test switches (URL):  ?sl=video  force the recording · ?sl=live  never fall back
 */
(function () {
  'use strict';

  var VERT = '#version 300 es\nin vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';

  // ---- scene pass: geodesic ray march ------------------------------------
  var FRAG_SCENE = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 o;',
    'uniform vec2 uRes; uniform float uTime; uniform vec3 uCam; uniform mat3 uBasis;',
    'uniform float uFov, uOuter, uTemp, uRot, uDoppler, uCompress;',
    'uniform int uSteps;',
    'const float RIN = 2.6;',
    'float h11(float n){ return fract(sin(n)*43758.5453123); }',
    'vec3 h33(vec3 p){ p = fract(p*vec3(.1031,.1030,.0973)); p += dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }',
    'float vnoise(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f); float n=i.x+i.y*57.+i.z*113.;',
    '  return mix(mix(mix(h11(n),h11(n+1.),f.x),mix(h11(n+57.),h11(n+58.),f.x),f.y),',
    '             mix(mix(h11(n+113.),h11(n+114.),f.x),mix(h11(n+170.),h11(n+171.),f.x),f.y),f.z); }',
    // black-body colour (fit after T. Helland), T in Kelvin
    'vec3 bb(float T){ float t=clamp(T,1000.,40000.)/100.; vec3 c;',
    '  c.r = t<=66. ? 1. : clamp(1.2929*pow(t-60.,-.1332),0.,1.);',
    '  c.g = t<=66. ? clamp(.3901*log(t)-.6318,0.,1.) : clamp(1.1299*pow(t-60.,-.0755),0.,1.);',
    '  c.b = t>=66. ? 1. : (t<=19. ? 0. : clamp(.5432*log(t-10.)-1.1963,0.,1.));',
    '  return c*c; }',
    // one layer of point stars on the sky sphere
    'vec3 stars(vec3 d, float S, float thr){ vec3 q=d*S, c=floor(q); vec3 col=vec3(0.);',
    '  vec3 r=h33(c); vec3 sp=c+.15+.7*r; float dist=length(q-sp);',
    '  float m=step(thr,r.x*.6+r.y*.4); float b=pow(h11(dot(c,vec3(1.,57.,113.))),6.)*3.+.25;',
    '  float core=smoothstep(.16,0.,dist); col+=m*b*core*core*mix(vec3(1.,.82,.62),vec3(.68,.82,1.),r.z);',
    '  return col; }',
    'vec3 sky(vec3 d){',
    '  vec3 c = stars(d,46.,.52)*1.4 + stars(d.zxy,95.,.45)*.8 + stars(d.yzx,170.,.4)*.45;',
    '  vec3 ax=normalize(vec3(.35,.9,.22)); float band=exp(-pow(dot(d,ax)*3.2,2.));',
    '  float n=vnoise(d*3.1)*.6+vnoise(d*7.3+4.)*.3+vnoise(d*17.+9.)*.1;',
    '  c += band*n*n*vec3(.10,.075,.11)*.9 + band*.012*vec3(.9,.7,.6);',
    '  float g=vnoise(d*1.7+20.); c += smoothstep(.62,.95,g)*vec3(.035,.02,.05);',
    '  return c; }',
    // accretion disk: emission (rgb) and opacity (a) at a plane crossing
    'vec4 disk(vec3 hit, vec3 v){',
    '  float r=length(hit.xz); if(r<RIN||r>uOuter) return vec4(0.);',
    '  float rr=(r-RIN)/(uOuter-RIN);',
    '  float dens=smoothstep(0.,.07,rr)*pow(1.-rr,1.35);',
    '  float ang=atan(hit.z,hit.x); float om=uRot*2.4*pow(r,-1.5);',
    '  float n=0.;',
    '  for(int k=0;k<2;k++){ float ph=fract(uTime*.045+float(k)*.5); float w=1.-abs(2.*ph-1.);',
    '    float a=ang+om*(ph-.5)*22.+float(k)*1.7; vec3 q=vec3(cos(a)*1.6,sin(a)*1.6,r*1.9+float(k)*7.);',
    '    float f=vnoise(q)*.55+vnoise(q*vec3(2.1,2.1,2.6)+3.)*.3+vnoise(q*vec3(4.3,4.3,6.1)+8.)*.15; n+=w*f; }',
    '  float streak=smoothstep(.18,.85,n);',
    '  float beta=sqrt(.5/r); vec3 vd=normalize(vec3(-hit.z,0.,hit.x));',
    '  float D=sqrt(1.-beta*beta)/(1.-beta*dot(vd,-normalize(v)));',
    '  float s=mix(1.,D*sqrt(1.-1./r),uDoppler);',
    '  float T=uTemp*pow(RIN/r,.75)*s;',
    '  float I=pow(RIN/r,2.1)*pow(s,3.6)*(.25+1.6*streak)*5.5;',
    '  float a=clamp(dens*(.35+.9*streak),0.,1.);',
    '  return vec4(bb(T)*I*a, a); }',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);',
    '  vec3 v=normalize(uBasis*vec3(uv*uFov,1.)); vec3 p=uCam;',
    '  vec3 hv=cross(p,v); float h2=dot(hv,hv);',
    '  vec3 col=vec3(0.); float A=0.; bool escaped=false;',
    '  for(int i=0;i<220;i++){ if(i>=uSteps) break;',
    '    float r2=dot(p,p); if(r2<1.02) break;',
    '    if(r2>1600.&&dot(p,v)>0.){ escaped=true; break; }',
    '    float r=sqrt(r2); float dt=clamp(r*.16,.05,3.)*min(1.,.35+abs(p.y)*1.2+max(0.,r-uOuter)*.2);',
    '    dt=max(dt*mix(.45,1.,smoothstep(1.6,4.,r)),.04);',
    '    v+=-1.5*h2*p/(r2*r2*r)*dt; vec3 pn=p+v*dt;',
    '    if(p.y*pn.y<0.){ vec3 hit=mix(p,pn,p.y/(p.y-pn.y)); vec4 d=disk(hit,v);',
    '      col+=(1.-A)*d.rgb; A+=(1.-A)*d.a; if(A>.985) break; }',
    '    p=pn; }',
    '  if(escaped) col+=(1.-A)*sky(normalize(v));',
    '  if(uCompress>.5) col=col/(1.+col);',
    '  o=vec4(col,1.); }'
  ].join('\n');

  // ---- composite pass: bloom from the mip chain, tone map, grain ---------
  var FRAG_POST = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 o; uniform sampler2D uTex; uniform vec2 uRes; uniform float uTime, uCompress, uEdge;',
    'vec3 get(vec2 uv,float l){ vec3 c=textureLod(uTex,uv,l).rgb; if(uCompress>.5) c=c/max(1.-c,.02); return c; }',
    'vec3 wide(vec2 uv,float l){ vec2 t=exp2(l)*.5/vec2(textureSize(uTex,0)); return (get(uv+t,l)+get(uv-t,l)+get(uv+vec2(t.x,-t.y),l)+get(uv+vec2(-t.x,t.y),l))*.25; }',
    'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }',
    'void main(){ vec2 uv=gl_FragCoord.xy/uRes;',
    '  vec3 c=get(uv,0.);',
    '  vec3 b=get(uv,2.)*.30+get(uv,3.)*.26+wide(uv,4.)*.2+wide(uv,5.)*.15+wide(uv,6.)*.1;',
    '  c+=b*.55; c=aces(c*.9); c=pow(c,vec3(1./2.2));',
    '  vec2 q=uv-.5; c*=1.-.35*dot(q,q);',
    '  c+=(fract(sin(dot(gl_FragCoord.xy+uTime,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;',
    // soft round edge for the small in-page stage: nothing ends on a hard line
    '  float e=mix(1.,smoothstep(.5,.34,length(q)),uEdge);',
    '  o=vec4(c*e,e); }'
  ].join('\n');

  var TEXTE = {
    de: { titel: 'Singularität', unter: 'Gekrümmtes Licht · live im Browser gerechnet', regler: 'Regler',
          groesse: 'Scheibengröße', temp: 'Temperatur', rot: 'Rotation', doppler: 'Doppler-Stärke', qual: 'Qualität',
          schritte: 'Schritte', flug: 'Kinoflug', zurueck: 'Ansicht zurücksetzen', zu: 'Schließen',
          hilfe: 'Ziehen: Umlauf · Zwei Finger oder Mausrad: Zoom · Doppeltipp: zurück',
          knopf: 'Selbst steuern', aufl: 'Auflösung', aufnahme: 'Aufnahme' },
    en: { titel: 'Singularity', unter: 'Bent light · computed live in your browser', regler: 'Controls',
          groesse: 'Disk size', temp: 'Temperature', rot: 'Rotation', doppler: 'Doppler strength', qual: 'Quality',
          schritte: 'steps', flug: 'Cinema flight', zurueck: 'Reset view', zu: 'Close',
          hilfe: 'Drag: orbit · Two fingers or wheel: zoom · Double tap: reset',
          knopf: 'Steer it yourself', aufl: 'resolution', aufnahme: 'Recording' }
  };
  function T() { return TEXTE[(document.documentElement.lang || 'de').slice(0, 2)] || TEXTE.de; }

  var CSS = [
    '.sl-canvas,.sl-video{position:absolute;inset:-22%;width:144%;height:144%;display:block;pointer-events:auto;touch-action:pan-y;cursor:grab;border-radius:50%;}',
    '.sl-video{object-fit:cover;-webkit-mask-image:radial-gradient(circle,#000 52%,transparent 70%);mask-image:radial-gradient(circle,#000 52%,transparent 70%);cursor:pointer;}',
    '.sl-canvas.sl-zieht{cursor:grabbing;}',
    '.sl-aktiv>.bh-disk,.sl-aktiv>.bh-horizon,.sl-aktiv>.bh-core{display:none;}',
    '.sl-buehne{position:fixed;inset:0;z-index:2147483000;background:#000;opacity:0;transition:opacity .45s ease;overscroll-behavior:contain;}',
    '.sl-buehne.sl-da{opacity:1;}',
    '.sl-buehne .sl-canvas{inset:0;width:100%;height:100%;border-radius:0;touch-action:none;}',
    '.sl-kopf{position:absolute;left:max(1.1rem,env(safe-area-inset-left));top:max(1rem,env(safe-area-inset-top));color:#f3ead9;pointer-events:none;text-shadow:0 1px 12px rgba(0,0,0,.8);}',
    '.sl-kopf b{display:block;font:500 clamp(.95rem,2.2vw,1.25rem)/1.2 "Geist","Inter",system-ui,sans-serif;letter-spacing:.42em;text-transform:uppercase;}',
    '.sl-kopf span{display:block;margin-top:.35rem;font:400 .62rem/1.3 "Geist Mono",ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(243,234,217,.55);}',
    '.sl-tafel{position:absolute;right:max(1rem,env(safe-area-inset-right));top:max(1rem,env(safe-area-inset-top));width:min(15.5rem,62vw);padding:.85rem .95rem .8rem;border-radius:18px;background:rgba(14,10,8,.46);border:1px solid rgba(255,226,180,.14);backdrop-filter:blur(14px) saturate(1.2);-webkit-backdrop-filter:blur(14px) saturate(1.2);color:#eadfcb;font:400 .7rem/1.3 "Geist","Inter",system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.5);transition:opacity .4s ease,transform .4s ease;}',
    '.sl-tafel.sl-ruhe{opacity:.0;transform:translateY(-6px);pointer-events:none;}',
    '.sl-tafel h4{margin:0 0 .55rem;font:500 .6rem/1 "Geist Mono",ui-monospace,monospace;letter-spacing:.24em;text-transform:uppercase;color:rgba(234,223,203,.55);}',
    '.sl-tafel label{display:grid;grid-template-columns:1fr auto;gap:.1rem .5rem;margin:.5rem 0 0;}',
    '.sl-tafel label i{font-style:normal;color:rgba(234,223,203,.6);font-variant-numeric:tabular-nums;}',
    '.sl-tafel input[type=range]{grid-column:1/-1;width:100%;height:22px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;}',
    '.sl-tafel input[type=range]::-webkit-slider-runnable-track{height:2px;border-radius:2px;background:linear-gradient(90deg,#f1c98a,rgba(241,201,138,.18));}',
    '.sl-tafel input[type=range]::-moz-range-track{height:2px;border-radius:2px;background:linear-gradient(90deg,#f1c98a,rgba(241,201,138,.18));}',
    '.sl-tafel input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;margin-top:-7px;border-radius:50%;background:#fff5e2;box-shadow:0 0 0 4px rgba(241,201,138,.18),0 0 14px rgba(255,214,150,.7);}',
    '.sl-tafel input[type=range]::-moz-range-thumb{width:16px;height:16px;border:0;border-radius:50%;background:#fff5e2;box-shadow:0 0 0 4px rgba(241,201,138,.18),0 0 14px rgba(255,214,150,.7);}',
    '.sl-reihe{display:flex;gap:.45rem;margin-top:.8rem;}',
    '.sl-reihe button,.sl-zu,.sl-oeffnen{font:500 .72rem/1 "Geist","Inter",system-ui,sans-serif;color:#f3ead9;background:rgba(255,226,180,.07);border:1px solid rgba(255,226,180,.22);border-radius:999px;padding:.55rem .8rem;cursor:pointer;transition:background .25s ease,border-color .25s ease,transform .25s ease;}',
    '.sl-reihe button{flex:1;}',
    '.sl-reihe button[aria-pressed=true]{background:linear-gradient(120deg,rgba(241,201,138,.9),rgba(214,140,84,.9));color:#1c1108;border-color:transparent;}',
    '.sl-reihe button:hover,.sl-zu:hover,.sl-oeffnen:hover{background:rgba(255,226,180,.16);}',
    '.sl-reihe button:focus-visible,.sl-zu:focus-visible,.sl-oeffnen:focus-visible{outline:2px solid #f1c98a;outline-offset:2px;}',
    '.sl-mess{margin-top:.6rem;font:400 .58rem/1.3 "Geist Mono",ui-monospace,monospace;letter-spacing:.06em;color:rgba(234,223,203,.4);font-variant-numeric:tabular-nums;}',
    '.sl-zu{position:absolute;left:max(1.1rem,env(safe-area-inset-left));bottom:max(1.1rem,env(safe-area-inset-bottom));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:.7rem 1.05rem;}',
    '.sl-hilfe{position:absolute;right:max(1.1rem,env(safe-area-inset-right));bottom:max(1.2rem,env(safe-area-inset-bottom));max-width:60vw;text-align:right;font:400 .6rem/1.5 "Geist Mono",ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(243,234,217,.42);pointer-events:none;}',
    '.sl-oeffnen{display:inline-flex;align-items:center;gap:.5rem;font-size:.86rem;padding:.6rem 1rem;}',
    '.sl-oeffnen[hidden]{display:none;}',
    '.sl-oeffnen::before{content:"";width:.7rem;height:.7rem;border-radius:50%;background:radial-gradient(circle,#000 38%,#ffe2b4 44%,#d68c54 70%,transparent 72%);}',
    '@media (max-width:560px){.sl-hilfe{display:none;}.sl-tafel{width:min(13.5rem,58vw);padding:.7rem .8rem;}}',
    '@media (prefers-reduced-motion:reduce){.sl-buehne,.sl-tafel{transition:none;}}'
  ].join('\n');

  function styleEinmal() {
    if (document.getElementById('sl-style')) return;
    var s = document.createElement('style'); s.id = 'sl-style'; s.textContent = CSS; document.head.appendChild(s);
  }

  function shader(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  }
  function programm(gl, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); }
    return { p: p, u: u };
  }

  function einbauen(szene, opt) {
    opt = opt || {};
    if (!szene || szene.__sl) return szene && szene.__sl;
    styleEinmal();
    var modus = (/[?&]sl=(video|live)\b/.exec(location.search) || [])[1] || '';
    var ruhig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var knopf = opt.knopf || null;

    var st = { az: 0.6, el: 0.2, dist: 17, vaz: 0, vel: 0, outer: 12, temp: 8500, rot: 1, doppler: 1, steps: 110,
               flug: false, flugT: 0, scale: 0.7, zeit: 0 };
    var HEIM = { az: 0.6, el: 0.2, dist: 17 };
    var api = { zustand: 'aus', st: st };
    szene.__sl = api;

    // ---------- recording fallback ----------
    function aufnahme() {
      api.zustand = 'aus';
      if (knopf) knopf.hidden = true;
      if (!opt.video) return;
      var v = document.createElement('video');
      v.className = 'sl-video'; v.muted = true; v.loop = true; v.autoplay = !ruhig; v.playsInline = true;
      v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.preload = 'metadata';
      if (opt.poster) v.poster = opt.poster;
      v.addEventListener('loadeddata', function () { szene.classList.add('sl-aktiv'); api.zustand = 'aufnahme'; });
      v.addEventListener('error', function () { v.remove(); szene.classList.remove('sl-aktiv'); });
      v.src = opt.video;
      szene.insertBefore(v, szene.firstChild);
    }
    if (modus === 'video') { aufnahme(); return api; }

    // ---------- WebGL2 ----------
    var canvas = document.createElement('canvas');
    canvas.className = 'sl-canvas'; canvas.setAttribute('aria-hidden', 'true');
    var gl = null, pScene, pPost, fbo, tex, halb = false, texW = 0, texH = 0;
    try {
      gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false,
                                         premultipliedAlpha: true, powerPreference: 'high-performance' });
      if (!gl) throw new Error('no webgl2');
      pScene = programm(gl, FRAG_SCENE); pPost = programm(gl, FRAG_POST);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      halb = !!gl.getExtension('EXT_color_buffer_float') || !!gl.getExtension('EXT_color_buffer_half_float');
      tex = gl.createTexture(); fbo = gl.createFramebuffer();
    } catch (e) {
      if (window.console) console.warn('[schwarzes-loch] live nicht möglich:', e && e.message);
      aufnahme(); return api;
    }

    function ziel(w, h) {
      if (w === texW && h === texH) return;
      texW = w; texH = h;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (halb) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (halb && gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        halb = false; texW = 0; ziel(w, h);
      }
    }

    szene.insertBefore(canvas, szene.firstChild);
    szene.classList.add('sl-aktiv');
    api.zustand = 'live';
    if (knopf) { knopf.hidden = false; knopf.textContent = T().knopf; }

    var gross = false, sichtbar = true, laeuft = false, raf = 0, letzte = 0, schmutz = true;
    var dtMittel = 16, sperreBis = 0, sperrDauer = 3000, lahmSeit = 0, bilder = 0, start = performance.now();

    function zeichne(jetzt) {
      raf = 0;
      if (!laeuft) return;
      var dt = Math.min(100, jetzt - (letzte || jetzt)); letzte = jetzt;
      if (!ruhig) st.zeit += dt / 1000;

      // camera
      if (st.flug) {
        st.flugT += dt / 1000; var f = st.flugT;
        st.az += dt / 1000 * (0.16 + 0.08 * Math.sin(f * 0.21));
        st.el = 0.02 + 0.42 * (0.5 + 0.5 * Math.sin(f * 0.17 - 1.2)) * Math.sign(Math.sin(f * 0.085) + 0.6);
        st.dist = 11 + 8 * (0.5 + 0.5 * Math.cos(f * 0.13));
      } else {
        st.az += st.vaz; st.el += st.vel; st.vaz *= 0.93; st.vel *= 0.93;
        if (!ziehen && !ruhig) st.az += dt / 1000 * 0.035;
      }
      st.el = Math.max(-1.45, Math.min(1.45, st.el));
      st.dist = Math.max(4.2, Math.min(34, st.dist));

      var css = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, gross ? 1.5 : 2);
      var W = Math.max(2, Math.round(css.width * dpr)), H = Math.max(2, Math.round(css.height * dpr));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      var w = Math.max(2, Math.round(W * st.scale)), h = Math.max(2, Math.round(H * st.scale));
      ziel(w, h);

      var ce = Math.cos(st.el), se = Math.sin(st.el), ca = Math.cos(st.az), sa = Math.sin(st.az);
      var cam = [st.dist * ce * ca, st.dist * se, st.dist * ce * sa];
      var fw = [-ce * ca, -se, -ce * sa];
      // slight roll, so the disk never sits dead level
      var roll = gross ? 0.0 : 0.22;
      var rt = [sa, 0, -ca];
      var up = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
      var cr = Math.cos(roll), sr = Math.sin(roll);
      var r2 = [rt[0] * cr + up[0] * sr, rt[1] * cr + up[1] * sr, rt[2] * cr + up[2] * sr];
      var u2 = [up[0] * cr - rt[0] * sr, up[1] * cr - rt[1] * sr, up[2] * cr - rt[2] * sr];

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.viewport(0, 0, w, h);
      gl.useProgram(pScene.p); var u = pScene.u;
      gl.uniform2f(u.uRes, w, h); gl.uniform1f(u.uTime, st.zeit);
      gl.uniform3fv(u.uCam, cam); gl.uniformMatrix3fv(u.uBasis, false, r2.concat(u2, fw));
      gl.uniform1f(u.uFov, gross ? 1.15 : 1.75);
      gl.uniform1f(u.uOuter, st.outer); gl.uniform1f(u.uTemp, st.temp); gl.uniform1f(u.uRot, st.rot);
      gl.uniform1f(u.uDoppler, st.doppler); gl.uniform1f(u.uCompress, halb ? 0 : 1); gl.uniform1i(u.uSteps, st.steps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindTexture(gl.TEXTURE_2D, tex); gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
      gl.useProgram(pPost.p); u = pPost.u;
      gl.uniform2f(u.uRes, W, H); gl.uniform1f(u.uTime, st.zeit % 10); gl.uniform1f(u.uCompress, halb ? 0 : 1);
      gl.uniform1f(u.uEdge, gross ? 0 : 1); gl.uniform1i(u.uTex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      bilder++;

      // adaptive resolution, then (last resort) the recording
      dtMittel += (dt - dtMittel) * 0.08;
      if (bilder > 12 && !ruhig && !st.fest) {
        var unten = gross ? 0.22 : 0.3, oben = 1;
        if (dtMittel > 25 && st.scale > unten) {
          st.scale = Math.max(unten, st.scale * (dtMittel > 45 ? 0.72 : 0.88));
          sperrDauer = Math.min(60000, sperrDauer * 1.6); sperreBis = jetzt + sperrDauer; dtMittel = 18;
        } else if (dtMittel < 18.5 && st.scale < oben && jetzt > sperreBis) {
          st.scale = Math.min(oben, st.scale * 1.07); sperreBis = jetzt + 900;
        }
        if (st.scale <= unten + 0.001 && dtMittel > 70 && modus !== 'live') {
          if (!lahmSeit) lahmSeit = jetzt;
          else if (jetzt - lahmSeit > 2500) { aufgeben(); return; }
        } else lahmSeit = 0;
      }
      if (mess && bilder % 20 === 0) {
        mess.textContent = Math.round(1000 / dtMittel) + ' fps · ' + Math.round(st.scale * 100) + ' % ' + T().aufl + ' · ' + w + '×' + h;
      }
      var bewegt = st.flug || !ruhig || ziehen || Math.abs(st.vaz) + Math.abs(st.vel) > 1e-4 || schmutz;
      schmutz = false;
      if (bewegt) raf = requestAnimationFrame(zeichne);
    }
    function anstoss() { schmutz = true; if (laeuft && !raf) { letzte = 0; raf = requestAnimationFrame(zeichne); } }
    function pruefeLauf() {
      var soll = (gross || sichtbar) && !document.hidden;
      if (soll && !laeuft) { laeuft = true; letzte = 0; dtMittel = 16; raf = requestAnimationFrame(zeichne); }
      else if (!soll && laeuft) { laeuft = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    }
    function aufgeben() {
      laeuft = false; if (gross) schliessen();
      try { var x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } catch (_e) {}
      canvas.remove(); szene.classList.remove('sl-aktiv');
      aufnahme();
    }
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); if (api.zustand === 'live') aufgeben(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { sichtbar = es[0].isIntersecting; pruefeLauf(); }, { rootMargin: '80px' }).observe(szene);
    }
    document.addEventListener('visibilitychange', pruefeLauf);
    window.addEventListener('resize', anstoss);

    // ---------- pointer: orbit, pinch, wheel ----------
    var ziehen = false, zeiger = {}, gezogen = false, startX = 0, startY = 0, pinch = 0, tipp = 0;
    canvas.addEventListener('pointerdown', function (e) {
      zeiger[e.pointerId] = { x: e.clientX, y: e.clientY };
      startX = e.clientX; startY = e.clientY; gezogen = false; ziehen = true; pinch = 0;
      st.vaz = st.vel = 0;
      try { canvas.setPointerCapture(e.pointerId); } catch (_e) {}
      canvas.classList.add('sl-zieht'); anstoss();
    });
    canvas.addEventListener('pointermove', function (e) {
      var z = zeiger[e.pointerId]; if (!z) return;
      var ids = Object.keys(zeiger);
      if (ids.length >= 2 && gross) {
        z.x = e.clientX; z.y = e.clientY;
        var a = zeiger[ids[0]], b = zeiger[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) st.dist *= pinch / Math.max(20, d);
        pinch = d; gezogen = true; anstoss(); return;
      }
      var dx = e.clientX - z.x, dy = e.clientY - z.y; z.x = e.clientX; z.y = e.clientY;
      if (!gezogen && Math.hypot(e.clientX - startX, e.clientY - startY) > 7) { gezogen = true; if (st.flug) flugSetzen(false); }
      if (!gezogen) return;
      var k = 0.0052 * (gross ? 1 : 1.5);
      st.vaz = dx * k; st.az += st.vaz;
      if (gross || e.pointerType === 'mouse') { st.vel = dy * k; st.el += st.vel; }
      anstoss();
    });
    function los(e) {
      delete zeiger[e.pointerId]; pinch = 0;
      if (!Object.keys(zeiger).length) { ziehen = false; canvas.classList.remove('sl-zieht'); }
      if (!gezogen && gross && e.type === 'pointerup') {
        var jetzt = performance.now();
        if (jetzt - tipp < 320) heim();
        tipp = jetzt;
      }
    }
    canvas.addEventListener('pointerup', los); canvas.addEventListener('pointercancel', los);
    // a drag must not count as a click on the surrounding link
    szene.addEventListener('click', function (e) {
      if (gezogen) { e.preventDefault(); e.stopPropagation(); gezogen = false; }
    }, true);
    canvas.addEventListener('wheel', function (e) {
      if (!gross) return; e.preventDefault();
      st.dist *= Math.exp(e.deltaY * 0.0012); if (st.flug) flugSetzen(false); anstoss();
    }, { passive: false });
    function heim() { flugSetzen(false); st.az = HEIM.az; st.el = HEIM.el; st.dist = HEIM.dist; st.vaz = st.vel = 0; anstoss(); }

    // ---------- full-screen stage with controls ----------
    var buehne = null, mess = null, flugKnopf = null, platz = null, vorScale = 0.7, ruheTimer = 0, tafel = null;
    function flugSetzen(an) {
      st.flug = an; st.flugT = 0;
      if (flugKnopf) flugKnopf.setAttribute('aria-pressed', an ? 'true' : 'false');
      if (an) anstoss();
    }
    function regler(eltern, name, min, max, step, wert, fmt, setz) {
      var l = document.createElement('label'), s = document.createElement('span'), i = document.createElement('i'),
          r = document.createElement('input');
      s.textContent = name; r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = wert;
      i.textContent = fmt(wert);
      r.addEventListener('input', function () { var v = parseFloat(r.value); i.textContent = fmt(v); setz(v); anstoss(); wach(); });
      l.appendChild(s); l.appendChild(i); l.appendChild(r); eltern.appendChild(l);
    }
    function wach() {
      if (!tafel) return; tafel.classList.remove('sl-ruhe'); clearTimeout(ruheTimer);
      if (st.flug) ruheTimer = setTimeout(function () { if (st.flug && tafel) tafel.classList.add('sl-ruhe'); }, 4500);
    }
    function oeffnen() {
      if (gross || api.zustand !== 'live') return;
      var t = T(), nf = function (v) { return v.toLocaleString(document.documentElement.lang || 'de'); };
      buehne = document.createElement('div'); buehne.className = 'sl-buehne';
      buehne.setAttribute('role', 'dialog'); buehne.setAttribute('aria-modal', 'true'); buehne.setAttribute('aria-label', t.titel);
      var kopf = document.createElement('div'); kopf.className = 'sl-kopf';
      var kb = document.createElement('b'), ks = document.createElement('span'); kb.textContent = t.titel; ks.textContent = t.unter;
      kopf.appendChild(kb); kopf.appendChild(ks);
      tafel = document.createElement('div'); tafel.className = 'sl-tafel';
      var h = document.createElement('h4'); h.textContent = t.regler; tafel.appendChild(h);
      regler(tafel, t.groesse, 6, 20, 0.5, st.outer, function (v) { return nf(v) + ' rₛ'; }, function (v) { st.outer = v; });
      regler(tafel, t.temp, 3000, 16000, 100, st.temp, function (v) { return nf(v) + ' K'; }, function (v) { st.temp = v; });
      regler(tafel, t.rot, 0, 3, 0.05, st.rot, function (v) { return nf(v) + '×'; }, function (v) { st.rot = v; });
      regler(tafel, t.doppler, 0, 1, 0.01, st.doppler, function (v) { return Math.round(v * 100) + ' %'; }, function (v) { st.doppler = v; });
      regler(tafel, t.qual, 50, 220, 10, st.steps, function (v) { return v + ' ' + t.schritte; }, function (v) { st.steps = v; });
      var reihe = document.createElement('div'); reihe.className = 'sl-reihe';
      flugKnopf = document.createElement('button'); flugKnopf.type = 'button'; flugKnopf.textContent = t.flug;
      flugKnopf.setAttribute('aria-pressed', 'false');
      flugKnopf.addEventListener('click', function () { flugSetzen(!st.flug); wach(); });
      var rk = document.createElement('button'); rk.type = 'button'; rk.textContent = '↺'; rk.title = t.zurueck;
      rk.setAttribute('aria-label', t.zurueck); rk.style.flex = '0 0 auto'; rk.addEventListener('click', heim);
      reihe.appendChild(flugKnopf); reihe.appendChild(rk); tafel.appendChild(reihe);
      mess = document.createElement('div'); mess.className = 'sl-mess'; mess.textContent = ' '; tafel.appendChild(mess);
      var zu = document.createElement('button'); zu.type = 'button'; zu.className = 'sl-zu'; zu.textContent = '← ' + t.zu;
      zu.addEventListener('click', schliessen);
      var hilfe = document.createElement('div'); hilfe.className = 'sl-hilfe'; hilfe.textContent = t.hilfe;

      platz = document.createComment('sl'); canvas.parentNode.insertBefore(platz, canvas);
      buehne.appendChild(canvas); buehne.appendChild(kopf); buehne.appendChild(tafel); buehne.appendChild(zu); buehne.appendChild(hilfe);
      document.body.appendChild(buehne);
      buehne.addEventListener('pointermove', wach); buehne.addEventListener('pointerdown', wach);
      vorScale = st.scale; st.scale = Math.min(st.scale, 0.5); sperreBis = 0; sperrDauer = 3000; bilder = 0;
      gross = true; st.dist = Math.max(st.dist, 15);
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(function () { buehne.classList.add('sl-da'); });
      document.addEventListener('keydown', taste);
      pruefeLauf(); anstoss(); zu.focus({ preventScroll: true });
    }
    function schliessen() {
      if (!gross) return;
      gross = false; flugSetzen(false); clearTimeout(ruheTimer);
      document.removeEventListener('keydown', taste);
      document.documentElement.style.overflow = '';
      if (platz && platz.parentNode) { platz.parentNode.insertBefore(canvas, platz); platz.remove(); }
      var b = buehne; buehne = null; mess = null; flugKnopf = null; tafel = null;
      if (b) b.remove();
      st.scale = vorScale; heim(); bilder = 0; pruefeLauf(); anstoss();
      if (knopf) knopf.focus({ preventScroll: true });
    }
    function taste(e) { if (e.key === 'Escape') schliessen(); }
    if (knopf) knopf.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); oeffnen(); });

    api.oeffnen = oeffnen; api.schliessen = schliessen; api.flug = flugSetzen; api.anstoss = anstoss;
    api.messung = function () { return { fps: 1000 / dtMittel, scale: st.scale, bilder: bilder, halb: halb, sekunden: (performance.now() - start) / 1000 }; };
    pruefeLauf();
    return api;
  }

  window.SchwarzesLoch = { einbauen: einbauen };
})();
