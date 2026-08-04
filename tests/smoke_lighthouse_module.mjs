/* Wächter für die zwei Lighthouse-Befunde an den GETEILTEN Modulen (2026-08-01).
 *   node tests/smoke_lighthouse_module.mjs
 *
 * Beide Befunde kamen aus der Lighthouse-Runde an den drei Küchen-Apps. Sie
 * gehören nicht den Apps, sondern der Quelle hier — in einer Kopie geflickt wären
 * sie Klonen statt Kopieren, und beim nächsten Rollout wieder da.
 *
 * ── Befund 1 · Modul 17: Beschriftung zu blass ──────────────────────────────
 * `--sbkim-widget-bg` stand auf `rgba(0, 0, 0, 0.45)` — dem Wert der DUNKLEN
 * Sage-Page. In einer hellen PWA kippt die Rechnung: 45 % Schwarz über Weiß ist
 * ein Mittelgrau, und darauf steht helle Schrift. Nachgerechnet über die relative
 * Leuchtdichte, nicht geschätzt:
 *
 *              Untergrund      helle Schrift   abgeblendete
 *   vorher     helle Seite      3,09:1          1,97:1    <- beide unter der Norm
 *   vorher     dunkle Seite    18,58:1          5,86:1
 *   nachher    helle Seite     11,57:1          7,27:1
 *   nachher    dunkle Seite    17,33:1          9,96:1
 *
 * Warum der Test die Farben aus dem MODUL liest statt sie hier zu wiederholen:
 * eine zweite Liste von Zahlen wäre eine zweite Wahrheit, die auseinanderläuft.
 * Der Test rechnet mit dem, was das Modul wirklich ausliefert.
 *
 * ── Befund 2 · Modul 23 UI: Link ohne Adresse ───────────────────────────────
 * Der „🔑 Schlüssel holen"-Link wurde ohne `href` erzeugt und bekam eine Adresse
 * erst, wenn er sichtbar wurde. Solange er verborgen war, stand ein Link ins
 * Nichts im Dokument — für Suchmaschinen und für Vorlesewerkzeuge (Lighthouse
 * `crawlable-anchors`).
 *
 * ── Gegenproben beim Bauen, beide einzeln rot bekommen ──────────────────────
 *   1. `--sbkim-widget-bg` auf `rgba(0, 0, 0, 0.45)` zurückgesetzt
 *      → Teil 1 fiel durch: „helle Seite, helle Schrift 3.09:1 (Soll 4.5)".
 *   2. Die neue `href`-Zeile in Modul 23 UI entfernt
 *      → Teil 2 fiel durch: „Link trägt eine Adresse".
 * Ohne den Fix fällt die Probe — das ist der Standard dieser Reihe.
 *
 * Grenze, ehrlich: Gerechnet wird die Farbe, die im Stilblock steht. Ob das
 * Widget auf Klaus' Tablet gut AUSSIEHT, sagt nur Klaus' Browser-Lauf. Und der
 * `backdrop-filter` ist in der Rechnung nicht enthalten — er macht den Grund
 * eher dunkler, also die Werte eher besser, nie schlechter.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m); } };

/* ---- WCAG-Kontrast, gerechnet statt geschätzt ------------------------------ */
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const leucht = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
function kontrast(a, b) {
  const l1 = leucht(a), l2 = leucht(b);
  const [hell, dunkel] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hell + 0.05) / (dunkel + 0.05);
}
/* Eine Farbe mit Deckkraft über einen Untergrund legen. */
const ueber = ([r, g, b, a], u) => [r * a + u[0] * (1 - a), g * a + u[1] * (1 - a), b * a + u[2] * (1 - a)];

/* Liest "rgba(18, 18, 24, 0.86)" oder "#F5F5FF" als [r,g,b,a]. */
function farbe(s) {
  s = String(s).trim();
  const m = /^rgba?\(([^)]+)\)$/.exec(s);
  if (m) {
    const t = m[1].split(",").map((x) => parseFloat(x.trim()));
    return [t[0], t[1], t[2], t.length > 3 ? t[3] : 1];
  }
  const h = /^#([0-9a-f]{6})$/i.exec(s);
  if (h) return [parseInt(h[1].slice(0, 2), 16), parseInt(h[1].slice(2, 4), 16), parseInt(h[1].slice(4, 6), 16), 1];
  return null;
}

const NORM = 4.5;          // WCAG AA für normalen Text
const WEISS = [255, 255, 255];
const DUNKEL = [11, 13, 20];   // der Grundton der Sage-Page

/* ===================================================== Teil 1 — Modul 17 ==== */
console.log("\nTeil 1 — Modul 17: Beschriftung lesbar auf heller UND dunkler Seite");
{
  const src = readFileSync(resolve(repoRoot, "src/modules/17_floating_widget.js"), "utf8");
  const hole = (name) => {
    const m = new RegExp('"\\s*' + name + ':\\s*([^";]+);?\\s*"').exec(src);
    return m ? farbe(m[1]) : null;
  };
  const bg = hole("--sbkim-widget-bg");
  const fg = hole("--sbkim-widget-fg");
  const dim = hole("--sbkim-widget-fg-dim");

  ok(!!bg, `--sbkim-widget-bg aus dem Modul gelesen (${bg && bg.join(",")})`);
  ok(!!fg, `--sbkim-widget-fg aus dem Modul gelesen (${fg && fg.join(",")})`);
  ok(!!dim, `--sbkim-widget-fg-dim aus dem Modul gelesen (${dim && dim.join(",")})`);

  if (bg && fg && dim) {
    for (const [name, unten] of [["helle Seite", WEISS], ["dunkle Seite", DUNKEL]]) {
      const grund = ueber(bg, unten);
      const kHell = kontrast(fg.slice(0, 3), grund);
      const kDim = kontrast(ueber(dim, grund), grund);
      ok(kHell >= NORM, `${name}, helle Schrift ${kHell.toFixed(2)}:1 (Soll ${NORM})`);
      ok(kDim >= NORM, `${name}, abgeblendete Schrift ${kDim.toFixed(2)}:1 (Soll ${NORM})`);
    }
  }

  /* Der Ersatzwert in der var()-Schreibweise muss dieselbe Rechnung tragen.
   * Ein simples Suchen-und-Ersetzen der Variablen erfasst ihn NICHT — das ist
   * die Falle, die in der Lighthouse-Runde an anderer Stelle zugeschlagen hat. */
  const ersatz = /var\(--sbkim-widget-fg-dim,\s*(rgba?\([^)]+\))\s*\)/.exec(src);
  if (ersatz) {
    const e = farbe(ersatz[1]);
    ok(e && dim && Math.abs(e[3] - dim[3]) < 0.001,
      `Ersatzwert in var(…) trägt dieselbe Deckkraft wie die Variable (${e && e[3]} = ${dim && dim[3]})`);
  } else {
    ok(true, "kein var()-Ersatzwert für fg-dim vorhanden — nichts nachzuziehen");
  }

  /* Das helle Widget-Theme rechnet eigenständig — auch das muss stimmen, und
   * zwar an seiner SCHWÄCHSTEN Stelle. Ein erster Entwurf maß hier nur die
   * Hauptschrift (#1A1A1A, 17,4:1) und stand damit beruhigend grün daneben,
   * während die blassere Beschriftung daneben ungeprüft blieb. Gemessen wird
   * deshalb beides. */
  const hellBg = /data-theme=\\"light\\"\] \{\s*background:\s*(rgba?\([^)]+\))[^"]*color:\s*(#[0-9a-fA-F]{6})/.exec(src);
  const hellLabel = /data-theme=\\"light\\"\] \.sbkim-widget-label \{\s*color:\s*(rgba?\([^)]+\))/.exec(src);
  ok(!!hellBg, "helles Widget-Theme gefunden");
  if (hellBg) {
    const grund = ueber(farbe(hellBg[1]), WEISS);
    const k = kontrast(farbe(hellBg[2]).slice(0, 3), grund);
    ok(k >= NORM, `helles Widget-Theme, Hauptschrift ${k.toFixed(2)}:1 (Soll ${NORM})`);
    ok(!!hellLabel, "helles Widget-Theme: eigene Beschriftungsfarbe gefunden");
    if (hellLabel) {
      const kl = kontrast(ueber(farbe(hellLabel[1]), grund), grund);
      ok(kl >= NORM, `helles Widget-Theme, Beschriftung ${kl.toFixed(2)}:1 (Soll ${NORM})`);
    }
  }
}

/* ================================================== Teil 2 — Modul 23 UI ==== */
console.log("\nTeil 2 — Modul 23 UI: der Schlüssel-Link ist nie ein Link ins Nichts");
{
  const src = readFileSync(resolve(repoRoot, "src/modules/23_rendezvous_ui.js"), "utf8");

  /* Der Ausschnitt zwischen Erzeugung und dem nächsten Element. Geprüft wird,
   * dass in DIESEM Ausschnitt eine href-Zuweisung steht — nicht irgendwo sonst
   * in der Datei, denn updateKiKeyLink() setzt sie ohnehin, nur eben zu spät. */
  const von = src.indexOf('kiKeyLinkEl = doc().createElement("a")');
  const bis = src.indexOf("kiRow.appendChild(kiKeyLinkEl)", von);
  ok(von > -1, "Erzeugung des Schlüssel-Links gefunden");
  ok(bis > von, "Einhängen des Schlüssel-Links gefunden");
  const block = von > -1 && bis > von ? src.slice(von, bis) : "";
  ok(/kiKeyLinkEl\.href\s*=/.test(block),
    "Link trägt eine Adresse, sobald er erzeugt wird (nicht erst beim Sichtbarwerden)");

  /* Die Adresse muss aus der gepflegten Liste stammen, nicht aus einer zweiten
   * hartcodierten Fassung, die beim nächsten Anbieter-Wechsel veraltet. */
  ok(/KI_KEY_URLS\s*\[/.test(block),
    "die Anfangs-Adresse kommt aus KI_KEY_URLS, nicht aus einer zweiten Liste");

  /* Und die Sichtbarkeit muss unberührt an der echten Kenntnis hängen: ein
   * unbekannter Anbieter zeigt weiter KEINEN Link (fail-soft). Sonst hätte der
   * Fix eine Verhaltensänderung eingeschleppt, die niemand bestellt hat. */
  const upd = src.slice(src.indexOf("function updateKiKeyLink()"));
  const kopf = upd.slice(0, upd.indexOf("\n  }"));
  ok(/var url = KI_KEY_URLS\[kiProvider\];/.test(kopf) && /!!url/.test(kopf),
    "Sichtbarkeit hängt weiterhin an der echten Anbieter-Kenntnis (fail-soft unberührt)");
}

/* ── Befund 3 · die Sage-Page selbst: `--dim` zu blass (2026-08-04) ─────────
 * Der Wächter oben rechnet über `--sbkim-widget-fg-dim` — die Variable des
 * WIDGET-MODULS. Die Seite hat eine eigene, gleichnamige Idee (`--dim` in
 * index.html), und die war nie gedeckt. Lighthouse fand sie: 21 von 26
 * Kontrast-Beanstandungen kamen aus dieser einen Zeile (`.card-tag`,
 * `.mod-num`, `.module-list-divider`).
 *
 * Gemessen bei 0.36: 3,08:1 gegen den Seitengrund #08081A. Verlangt 4,5:1.
 * Nötig wären 0.47; gesetzt ist 0.50, damit etwas Luft bleibt.
 *
 * Gegenprobe beim Bauen: `--dim` auf 0.36 zurückgesetzt → diese Probe fiel
 * durch mit „abgeblendete Seiten-Schrift 3.08:1 (Soll 4.5)".
 *
 * Gerechnet wird mit dem, was in index.html WIRKLICH steht — nicht mit einer
 * hier wiederholten Zahl. Eine zweite Liste wäre eine zweite Wahrheit. */
{
  const seite = readFileSync(resolve(repoRoot, "index.html"), "utf8");
  const holeVar = (name) => {
    const m = new RegExp("--" + name + "\\s*:\\s*([^;]+);").exec(seite);
    return m ? farbe(m[1].trim()) : null;
  };
  const grund = holeVar("bg");
  const dim = holeVar("dim");
  const muted = holeVar("muted");
  ok(!!grund, `Seiten-Grund --bg aus index.html gelesen (${grund && grund.slice(0,3).join(",")})`);
  ok(!!dim, `Seiten-Variable --dim gelesen (Deckkraft ${dim && dim[3]})`);
  ok(!!muted, `Seiten-Variable --muted gelesen (Deckkraft ${muted && muted[3]})`);
  if (grund && dim && muted) {
    const g = grund.slice(0, 3);
    const kDim = kontrast(ueber(dim, g), g);
    const kMuted = kontrast(ueber(muted, g), g);
    ok(kDim >= NORM, `abgeblendete Seiten-Schrift ${kDim.toFixed(2)}:1 (Soll ${NORM})`);
    ok(kMuted >= NORM, `gedämpfte Seiten-Schrift ${kMuted.toFixed(2)}:1 (Soll ${NORM})`);
    /* Die Abstufung muss erhalten bleiben — sonst „repariert" eine spätere
     * Sitzung den Kontrast, indem sie beide auf denselben Wert zieht, und die
     * Seite verliert ihre Tiefe. */
    ok(dim[3] < muted[3], `--dim bleibt leichter als --muted (${dim[3]} < ${muted[3]})`);
  }
}

/* ── Befund 4 · Status-Farben als Badge-SCHRIFT (2026-08-04) ────────────────
 * Nach dem `--dim`-Fix blieben vier Beanstandungen übrig, alle an `.badge`.
 * Der Grund: die Status-Farben (INTERFACES §5) tragen zwei Rollen — Füllung
 * von Punkt/Lampe/Mermaid-Knoten UND *Schrift* im Badge. Als Schrift auf
 * `rgba(0,0,0,0.5)` über `--bg` fielen die zwei dunkelsten durch
 * (schablone 2,88:1 · stub 3,95:1). Beide sind aufgehellt worden.
 *
 * Dieser Wächter liest die sechs Werte AUS index.html und rechnet sie nach —
 * eine hier wiederholte Liste wäre eine zweite Wahrheit. Er prüft drei Dinge:
 *   1. jede Farbe ≥ 4,5:1 als Badge-Schrift,
 *   2. die CSS-Variable und die JS-Karte STATUS_META sagen dasselbe
 *      (sie stehen 2000 Zeilen auseinander und driften sonst lautlos),
 *   3. schablone und werkstatt bleiben unterscheidbar — sonst „repariert"
 *      eine spätere Sitzung das Braun, indem sie es zu Orange macht.
 *
 * Gegenprobe beim Bauen: --status-schablone auf #92400E zurückgesetzt →
 * Probe 1 fiel mit 2,88:1, Probe 2 meldete zusätzlich die Abweichung zur
 * JS-Karte. Beide Richtungen greifen also wirklich. */
{
  const seite = readFileSync(resolve(repoRoot, "index.html"), "utf8");
  const NAMEN = ["schablone", "werkstatt", "spec", "stub", "fertig"];
  const hexZuRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  /* Der Badge-Grund ist rgba(0,0,0,0.5) über der Seitenfarbe. */
  const bgTreffer = /--bg\s*:\s*([^;]+);/.exec(seite);
  const seitenGrund = bgTreffer ? farbe(bgTreffer[1].trim()).slice(0, 3) : null;
  const badgeGrund = seitenGrund && ueber([0, 0, 0, 0.5], seitenGrund);
  ok(!!badgeGrund, `Badge-Grund gerechnet (${badgeGrund && badgeGrund.join(",")})`);

  /* Abstand im Lab-Raum — reicht, um „ist das noch Braun oder schon Orange?"
   * zu beantworten; eine volle CIEDE2000 braucht es dafür nicht. */
  const lab = ([r, g, b]) => {
    const L = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const R = L(r), G = L(g), B = L(b);
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const x = f((0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047);
    const y = f(0.2126 * R + 0.7152 * G + 0.0722 * B);
    const z = f((0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };
  const abstand = (a, b) => { const A = lab(a), B = lab(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };

  const gelesen = {};
  for (const name of NAMEN) {
    const cssTreffer = new RegExp("--status-" + name + "\\s*:\\s*(#[0-9A-Fa-f]{6})\\s*;").exec(seite);
    const jsTreffer = new RegExp(name + "\\s*:\\s*\\{[^}]*color:\\s*'(#[0-9A-Fa-f]{6})'").exec(seite);
    ok(!!cssTreffer, `--status-${name} aus index.html gelesen (${cssTreffer && cssTreffer[1]})`);
    ok(!!(cssTreffer && jsTreffer) && cssTreffer[1].toUpperCase() === jsTreffer[1].toUpperCase(),
      `CSS-Variable und STATUS_META sagen dasselbe für ${name} (${cssTreffer && cssTreffer[1]} = ${jsTreffer && jsTreffer[1]})`);
    if (cssTreffer) gelesen[name] = hexZuRgb(cssTreffer[1]);
  }

  if (badgeGrund) {
    for (const name of NAMEN) {
      if (!gelesen[name]) continue;
      const k = kontrast(gelesen[name], badgeGrund);
      ok(k >= NORM, `Status-Farbe ${name} als Badge-Schrift ${k.toFixed(2)}:1 (Soll ${NORM})`);
    }
  }

  if (gelesen.schablone && gelesen.werkstatt) {
    const d = abstand(gelesen.schablone, gelesen.werkstatt);
    ok(d >= 25, `schablone bleibt von werkstatt unterscheidbar (ΔE ${d.toFixed(1)}, Soll ≥ 25)`);
  }
}

console.log(`\n${fail === 0 ? "✓" : "✗"} smoke_lighthouse_module: ${pass} grün, ${fail} rot`);
process.exit(fail === 0 ? 0 : 1);
