/* sequenz.js — a short silent clip that teaches in steps ("Stationen").
 *
 * Markup (works without this script: the list stays readable as plain text):
 *
 *   <figure class="sequenz" data-video="assets/video/x.mp4" data-poster="assets/video/x.webp">
 *     <ol class="sequenz-stationen">
 *       <li><strong>Title.</strong> One or two sentences.</li>
 *       …
 *     </ol>
 *   </figure>
 *
 * Behaviour:
 *   · the clip loads only when the figure scrolls into view (nothing is fetched before)
 *   · each run of the clip shows one station; at the end it holds, then the next station starts
 *   · it stops when scrolled away, and there is always a pause button
 *   · prefers-reduced-motion / Save-Data: no autoplay, the still image and a play button instead
 *   · a clip that cannot load leaves the still image; a missing still leaves the text
 *
 * No dependencies, no storage, no network beyond the two files named in the markup.
 */
(function () {
  'use strict';
  if (window.SageSequenz) return;

  var CSS = [
    '.sequenz{margin:2rem 0;padding:0;border:1px solid var(--sequenz-linie,rgba(255,255,255,.14));',
    'border-radius:16px;overflow:hidden;background:var(--sequenz-grund,rgba(8,8,26,.72));color:var(--sequenz-text,#f5f5ff)}',
    '.sequenz-buehne{position:relative;aspect-ratio:16/9;background:#05050f center/cover no-repeat}',
    '.sequenz-buehne video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}',
    '.sequenz-knopf{position:absolute;right:10px;bottom:10px;min-width:44px;min-height:44px;border-radius:999px;',
    'border:1px solid rgba(255,255,255,.35);background:rgba(5,5,15,.62);color:#fff;font:600 1rem system-ui,sans-serif;',
    'cursor:pointer;padding:0 14px;backdrop-filter:blur(6px)}',
    '.sequenz-knopf:hover,.sequenz-knopf:focus-visible{background:rgba(5,5,15,.85);border-color:var(--sequenz-akzent,#F4B435);outline:none}',
    '.sequenz-lauf{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--sequenz-akzent,#F4B435)}',
    '.sequenz-text{padding:1rem 1.2rem 1.1rem}',
    '.sequenz.bereit .sequenz-stationen{list-style:none;margin:0;padding:0;display:grid}',
    '.sequenz.bereit .sequenz-stationen>li{grid-area:1/1;opacity:0;visibility:hidden;transition:opacity .5s;line-height:1.5}',
    '.sequenz.bereit .sequenz-stationen>li.aktiv{opacity:1;visibility:visible}',
    '.sequenz-stationen strong{color:var(--sequenz-akzent,#F4B435)}',
    '.sequenz-punkte{display:flex;gap:4px;align-items:center;margin-top:.5rem}',
    '.sequenz-punkte button{width:32px;height:32px;padding:0;border:0;background:none;cursor:pointer;display:grid;place-items:center}',
    '.sequenz-punkte button::before{content:"";width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.28);transition:background .2s,transform .2s}',
    '.sequenz-punkte button[aria-current="true"]::before{background:var(--sequenz-akzent,#F4B435);transform:scale(1.3)}',
    '.sequenz-punkte button:focus-visible{outline:2px solid var(--sequenz-akzent,#F4B435);border-radius:8px}',
    '.sequenz-zaehler{margin-left:.6rem;font:.8rem ui-monospace,monospace;opacity:.6}',
    '@media print{.sequenz-buehne,.sequenz-punkte{display:none}.sequenz.bereit .sequenz-stationen>li{opacity:1;visibility:visible;grid-area:auto}}'
  ].join('');

  function stil() {
    if (document.getElementById('sequenz-stil')) return;
    var s = document.createElement('style');
    s.id = 'sequenz-stil';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var ruhig = false;
  try {
    ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !!(navigator.connection && navigator.connection.saveData);
  } catch (_e) { /* keep autoplay */ }

  var HALT_MS = 1600;   // hold on the last frame before the next station

  function bauen(fig) {
    if (fig.dataset.sequenzBereit) return;
    var src = fig.getAttribute('data-video');
    var liste = fig.querySelector('.sequenz-stationen');
    if (!src || !liste) return;
    var punkteTexte = [].slice.call(liste.children);
    if (!punkteTexte.length) return;
    fig.dataset.sequenzBereit = '1';
    var en = (fig.closest('[lang]') || document.documentElement).lang.slice(0, 2) === 'en';
    var T = en ? { play: 'Play', pause: 'Pause', station: 'Step' }
               : { play: 'Abspielen', pause: 'Anhalten', station: 'Station' };

    var buehne = document.createElement('div');
    buehne.className = 'sequenz-buehne';
    var poster = fig.getAttribute('data-poster');
    if (poster) buehne.style.backgroundImage = 'url("' + poster + '")';

    var video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'none';
    if (poster) video.poster = poster;

    var knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.className = 'sequenz-knopf';
    var lauf = document.createElement('div');
    lauf.className = 'sequenz-lauf';
    buehne.appendChild(video);
    buehne.appendChild(lauf);
    buehne.appendChild(knopf);

    var text = document.createElement('div');
    text.className = 'sequenz-text';
    var punkte = document.createElement('div');
    punkte.className = 'sequenz-punkte';
    var zaehler = document.createElement('span');
    zaehler.className = 'sequenz-zaehler';
    liste.setAttribute('aria-live', 'polite');

    fig.insertBefore(buehne, fig.firstChild);
    liste.parentNode.insertBefore(text, liste);
    text.appendChild(liste);
    text.appendChild(punkte);

    var aktiv = 0, sichtbar = false, gewollt = !ruhig, geladen = false, kaputt = false, haltTimer = 0;

    function zeigen(i) {
      aktiv = (i + punkteTexte.length) % punkteTexte.length;
      punkteTexte.forEach(function (li, n) { li.classList.toggle('aktiv', n === aktiv); });
      [].forEach.call(punkte.querySelectorAll('button'), function (b, n) {
        b.setAttribute('aria-current', n === aktiv ? 'true' : 'false');
      });
      zaehler.textContent = (aktiv + 1) + ' / ' + punkteTexte.length;
    }
    function beschriften() {
      var laeuft = gewollt && !kaputt;
      knopf.textContent = laeuft ? '❚❚' : '▶';
      knopf.setAttribute('aria-label', laeuft ? T.pause : T.play);
    }
    function laden() {
      if (geladen || kaputt) return;
      geladen = true;
      video.src = src;
    }
    function abspielen() {
      if (kaputt) return;
      laden();
      var p = video.play();
      if (p && p.catch) p.catch(function () { gewollt = false; beschriften(); });
    }
    function abgleichen() {
      clearTimeout(haltTimer);
      if (gewollt && sichtbar) abspielen(); else video.pause();
      beschriften();
    }

    punkteTexte.forEach(function (_li, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', T.station + ' ' + (n + 1));
      b.addEventListener('click', function () {
        zeigen(n);
        if (geladen && !kaputt) { try { video.currentTime = 0; } catch (_e) { /* not seekable yet */ } }
        abgleichen();
      });
      punkte.appendChild(b);
    });
    punkte.appendChild(zaehler);

    knopf.addEventListener('click', function () { gewollt = !gewollt; abgleichen(); });
    video.addEventListener('timeupdate', function () {
      if (video.duration) lauf.style.width = (100 * video.currentTime / video.duration) + '%';
    });
    video.addEventListener('ended', function () {
      haltTimer = setTimeout(function () {
        zeigen(aktiv + 1);
        if (gewollt && sichtbar) { video.currentTime = 0; abspielen(); }
      }, HALT_MS);
    });
    video.addEventListener('error', function () {
      // fail-soft: the still image and the text stay, the dead button goes
      kaputt = true;
      video.remove(); knopf.remove(); lauf.remove();
    });

    fig.classList.add('bereit');
    zeigen(0);
    beschriften();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        sichtbar = e[0].isIntersecting;
        abgleichen();
      }, { threshold: 0.35 }).observe(buehne);
    } else {
      sichtbar = true;
      abgleichen();
    }
  }

  function alle(wurzel) {
    stil();
    [].forEach.call((wurzel || document).querySelectorAll('figure.sequenz'), bauen);
  }

  window.SageSequenz = { bauen: alle };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { alle(); });
  else alle();
})();
