/* smoke_antragsmappe_markieren.mjs — die Markier-Schicht wird wirklich benutzt.
 *
 * Lauf:  node tests/smoke_antragsmappe_markieren.mjs
 * Braucht `playwright-core` (npm install). Fehlt es, ist diese Probe
 * **nicht lauffähig, nicht rot** — der Läufer unterscheidet das.
 *
 * ── DIE ZUSICHERUNG, DIE HIER AM MEISTEN WIEGT ─────────────────────────────
 *
 * Nicht „man kann etwas gelb machen", sondern: **eine Markierung kommt weder
 * in den Ausdruck noch in den Download.** Die Einreich-Abteilung geht zur
 * Behörde. Ein Dokument, das mit „das muss geändert werden"-Streifen dort
 * ankommt, ist schlimmer als eines ohne jede Markierhilfe — und der Fehler
 * fiele niemandem auf, bis er draußen ist.
 *
 * Gemessen wird deshalb an den **Bytes der heruntergeladenen Datei** und an
 * der **Hintergrundfarbe im Druck-Medium**, nicht an einer CSS-Regel im
 * Quelltext. Eine Regel kann dastehen und von einer späteren überschrieben
 * werden; die gemessene Farbe kann das nicht.
 *
 * Dazu die zweite Hälfte, ohne die das Werkzeug nichts wert wäre: die
 * Markierungen müssen einen **Neubau der Mappe überstehen** (sie sind am Text
 * verankert, nicht an der Stelle) — und was sich nicht mehr findet, muss sich
 * als **verwaist** melden statt lautlos zu verschwinden.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAPPE = resolve(WURZEL, 'docs/antragsmappe.html');

let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const sitzung = await browser.newContext({ acceptDownloads: true });
const p = await sitzung.newPage();

const fehler = [];
p.on('pageerror', (e) => fehler.push(String(e)));

await p.goto(pathToFileURL(MAPPE).href);
await p.waitForFunction(() => !!window.__mk);
gut(fehler.length === 0, 'die Markier-Schicht lädt ohne Skriptfehler', fehler.join(' · '));

/* ── 0 · Man muss ERKENNEN, was ein Knopf bedeutet ────────────────────────
   Klaus am 2026-08-24, beim ersten Ausprobieren: „Du hast da stehen nur
   Zahlen, deswegen konnte ich nicht erkennen, was du damit meinst."
   Zwei eigene Fehler steckten darin:
     · die Bedeutung stand nur im `title` — auf einem Tablet gibt es KEIN
       Hover, dort ist ein Tooltip unerreichbar;
     · die Farbe wurde als EMOJI geschrieben. Ein Emoji haengt an der
       Schrift des Geraets; fehlt sie, bleibt ein Kaestchen oder nichts
       uebrig, und aus „🟩 1 · 🟨 1 · 🟥 1" wird „1 · 1 · 1".
   Gemessen wird deshalb beides: jeder Farbknopf traegt ein WORT, und der
   Farbtupfen ist eine gezeichnete Flaeche mit Groesse und Grundfarbe —
   kein Zeichen aus einer Schriftart. */

const erkennbar = await p.evaluate(() => {
  const raus = { knoepfe: [], tupfen: [], legende: 0 };
  /* Erst aufklappen, dann messen. Eine zugeklappte Leiste ist 0 px hoch —
     und ein Waechter, der das fuer „zu klein" haelt, misst den falschen
     Zustand. Gemessen werden soll, was Klaus SIEHT, wenn sie offen ist. */
  document.querySelector('[data-mk-leiste]').setAttribute('data-offen', 'ja');
  for (const f of ['gruen', 'gelb', 'rot']) {
    const k = document.querySelector('[data-mk-leiste] [data-mk-tun="' + f + '"]');
    raus.knoepfe.push({
      farbe: f,
      wort: (k.textContent || '').replace(/\s+/g, ' ').trim(),
      hoehe: Math.round(k.getBoundingClientRect().height),
    });
    const t = k.querySelector('.mk-tupf');
    const st = t ? getComputedStyle(t) : null;
    raus.tupfen.push({
      farbe: f,
      breite: t ? Math.round(t.getBoundingClientRect().width) : 0,
      grund: st ? st.backgroundColor : '',
    });
  }
  const leg = document.querySelector('[data-mk-legende]');
  document.querySelector('[data-mk-tafel]').setAttribute('data-offen', 'ja');
  raus.legende = leg ? Math.round(leg.getBoundingClientRect().height) : 0;
  raus.legendeText = leg ? leg.textContent.replace(/\s+/g, ' ').trim() : '';
  document.querySelector('[data-mk-tafel]').setAttribute('data-offen', 'nein');
  document.querySelector('[data-mk-leiste]').setAttribute('data-offen', 'nein');
  return raus;
});

for (const k of erkennbar.knoepfe) {
  gut(/[a-zä-ü]{4,}/i.test(k.wort),
    'der Knopf „' + k.farbe + '" sagt mit einem WORT, was er tut: „' + k.wort + '"');
}
/* Die Leiste wird mit dem Finger bedient — 44 px ist die Untergrenze, unter
   der man daneben trifft. */
gut(erkennbar.knoepfe.every((k) => k.hoehe >= 44),
  'die Farbknöpfe sind fingerbreit (mindestens 44 px hoch)',
  erkennbar.knoepfe.map((k) => k.farbe + ' ' + k.hoehe).join(' · '));
for (const t of erkennbar.tupfen) {
  gut(t.breite > 0 && t.grund !== 'rgba(0, 0, 0, 0)',
    'der Farbtupfen „' + t.farbe + '" ist gezeichnet, nicht geschrieben '
    + '(' + t.breite + ' px, ' + t.grund + ')');
}
gut(erkennbar.legende > 0,
  'die Tafel trägt eine sichtbare Legende — nicht nur einen Tooltip',
  'Höhe: ' + erkennbar.legende + ' px');
gut(/bleibt/.test(erkennbar.legendeText) && /weg/.test(erkennbar.legendeText),
  'und die Legende nennt beide Richtungen: bleiben und weg');

/* ── 1 · Mit der Maus ziehen, dann eine Farbe wählen ──────────────────── */

const gezogen = await p.evaluate(async () => {
  window.__mk.leeren();
  // Einen Absatz in der Einreich-Abteilung wirklich auswählen — nicht über
  // den Test-Haken, sondern wie ein Mensch: ein Bereich über echtem Text.
  const art = document.querySelector('[data-quelle="docs/papers/ENTSTEHUNG.md"]');
  /* NICHT das erste <p> — das ist die Herkunftszeile „Quelle: …", 33
     Zeichen lang. Die erste Fassung markierte genau die und behauptete
     dabei, echten Text zu markieren; aufgefallen ist es erst, als der
     Laengen-Vergleich am Ende darueber stolperte. Eine Probe, die die
     falsche Stelle nimmt, misst nicht, was sie zu messen glaubt. */
  const p1 = art.querySelector('p:not(.herkunft)');
  const r = document.createRange();
  r.selectNodeContents(p1);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(r);
  document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  await new Promise((f) => setTimeout(f, 60));
  const leiste = document.querySelector('[data-mk-leiste]');
  return {
    leisteOffen: leiste.getAttribute('data-offen'),
    text: r.toString().replace(/\s+/g, ' ').trim().slice(0, 40),
  };
});
gut(gezogen.leisteOffen === 'ja',
  'nach dem Ziehen erscheint die Farbleiste', 'data-offen: ' + gezogen.leisteOffen);

const nachKlick = await p.evaluate(() => {
  document.querySelector('[data-mk-leiste] [data-mk-tun="rot"]').click();
  const mk = document.querySelector('mark.mk[data-farbe="rot"]');
  return {
    anzahl: window.__mk.marken().length,
    steht: !!mk,
    farbe: mk ? getComputedStyle(mk).backgroundColor : '',
    schrift: mk ? getComputedStyle(mk).color : '',
  };
});
gut(nachKlick.anzahl === 1, 'der Klick auf Rot legt genau eine Markierung an',
  'gezählt: ' + nachKlick.anzahl);
gut(nachKlick.steht, 'die Markierung steht wirklich im Text');
gut(nachKlick.farbe !== 'rgba(0, 0, 0, 0)' && nachKlick.farbe !== 'transparent',
  'sie hat einen sichtbaren Grund (' + nachKlick.farbe + ')');
/* LESBAR IN BEIDEN THEMEN — und das wird in beiden GEMESSEN.
   Die erste Fassung verglich nur, ob Schrift und Grund verschieden sind,
   und lief dabei allein im hellen Thema. Dort ist geerbte Schrift dunkel,
   also verschieden — der Waechter war gruen, waehrend im dunklen Thema
   nahezu weisse Schrift auf hellgruenem Grund gestanden haette. Die
   Gegenprobe hat ihn dabei erwischt.
   Gemessen wird jetzt der Kontrast nach WCAG, in hell UND dunkel. Damit
   haengt die Pruefung an der Zusicherung (man kann es lesen) statt an
   einer CSS-Zeile. */
async function kontrastMessen(schema) {
  await p.emulateMedia({ colorScheme: schema });
  return p.evaluate(() => {
    const zahl = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const kanal = (v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    const leucht = (rgb) =>
      0.2126 * kanal(rgb[0]) + 0.7152 * kanal(rgb[1]) + 0.0722 * kanal(rgb[2]);
    const raus = {};
    for (const f of ['gruen', 'gelb', 'rot']) {
      const mk = document.querySelector('mark.mk[data-farbe="' + f + '"]');
      if (!mk) continue;
      const st = getComputedStyle(mk);
      const a = leucht(zahl(st.backgroundColor)) + 0.05;
      const b = leucht(zahl(st.color)) + 0.05;
      raus[f] = Math.round((Math.max(a, b) / Math.min(a, b)) * 10) / 10;
    }
    return raus;
  });
}

const kHell = await kontrastMessen('light');
gut((kHell.rot || 0) >= 4.5,
  'im hellen Thema ist die Markierung lesbar (Kontrast ' + kHell.rot + ':1)');

/* ── 2 · Drei Farben, und eine Notiz dazu ─────────────────────────────── */

const drei = await p.evaluate(() => {
  window.__mk.setzen('docs/FORSCHUNGSKORPUS.md',
    document.querySelector('[data-quelle="docs/FORSCHUNGSKORPUS.md"] p:not(.herkunft)').textContent,
    'gruen');
  const id = window.__mk.setzen('docs/werkstatt/grundsaetze.md',
    document.querySelector('[data-quelle="docs/werkstatt/grundsaetze.md"] p:not(.herkunft)').textContent,
    'gelb', 'hier fehlt eine Zahl');
  return {
    anzahl: window.__mk.marken().length,
    farben: [...document.querySelectorAll('mark.mk')].map((m) => m.dataset.farbe),
    notizId: id,
    notizSteht: !!document.querySelector('mark.mk[data-notiz]'),
  };
});
gut(drei.anzahl === 3, 'drei Markierungen liegen vor', 'gezählt: ' + drei.anzahl);
for (const f of ['rot', 'gruen', 'gelb']) {
  gut(drei.farben.includes(f), 'die Farbe „' + f + '" ist im Text zu sehen');
}
gut(drei.notizSteht, 'eine Markierung mit Notiz ist als solche gekennzeichnet');

const kAlleHell = await kontrastMessen('light');
const kAlleDunkel = await kontrastMessen('dark');
await p.emulateMedia({ colorScheme: null });
for (const f of ['gruen', 'gelb', 'rot']) {
  gut((kAlleHell[f] || 0) >= 4.5 && (kAlleDunkel[f] || 0) >= 4.5,
    '„' + f + '" ist in BEIDEN Themen lesbar',
    'hell ' + kAlleHell[f] + ':1 · dunkel ' + kAlleDunkel[f] + ':1');
}

/* ── 3 · Der Riegel: nicht im Ausdruck ────────────────────────────────── */

await p.emulateMedia({ media: 'print' });
const imDruck = await p.evaluate(() => {
  const mk = document.querySelector('mark.mk');
  const s = getComputedStyle(mk);
  const leiste = document.querySelector('[data-mk-leiste]');
  const tafel = document.querySelector('[data-mk-tafel]');
  tafel.setAttribute('data-offen', 'ja');
  return {
    grund: s.backgroundColor,
    text: mk.textContent.length,
    leiste: leiste.getBoundingClientRect().height,
    tafel: tafel.getBoundingClientRect().height,
  };
});
await p.emulateMedia({ media: 'screen' });
/* Die Tafel wurde oben aufgeklappt, um sie im Druck zu messen. Bliebe
   sie offen, deckte sie den Download-Knopf zu — und der naechste
   Abschnitt waere rot aus einem Grund, der mit seiner Zusicherung
   nichts zu tun hat. */
await p.evaluate(() => document.querySelector('[data-mk-tafel]')
  .setAttribute('data-offen', 'nein'));

gut(imDruck.grund === 'rgba(0, 0, 0, 0)' || imDruck.grund === 'transparent',
  'im AUSDRUCK hat die Markierung KEINEN Grund mehr',
  'gemessen: ' + imDruck.grund);
gut(imDruck.text > 0, 'der markierte Text selbst steht im Ausdruck weiter da');
gut(imDruck.leiste === 0, 'die Farbleiste wird nicht mitgedruckt',
  'Höhe: ' + imDruck.leiste + ' px');
gut(imDruck.tafel === 0, 'die Tafel wird nicht mitgedruckt — auch offen nicht',
  'Höhe: ' + imDruck.tafel + ' px');

/* ── 4 · Der Riegel: nicht im Download ────────────────────────────────── */

for (const abt of ['einreichbar', 'privat']) {
  const [dl] = await Promise.all([
    p.waitForEvent('download', { timeout: 15000 }),
    p.click('[data-tun="laden"][data-fuer="' + abt + '"]'),
  ]);
  const text = readFileSync(await dl.path(), 'utf-8');
  gut(!/<mark\b/.test(text),
    'Download „' + abt + '" trägt KEINE Markierung');
  gut(!text.includes('data-mk-leiste') && !text.includes('data-mk-tafel'),
    'Download „' + abt + '" trägt weder Leiste noch Tafel');
  /* Und die Gegenrichtung, ohne die der Riegel auch dann grün wäre, wenn er
     den Text gleich mit weggeworfen hätte. */
  gut(text.includes('Klaus Nitzsche'),
    'Download „' + abt + '" ist trotzdem vollständig');
}

/* ── 5 · Der Neubau: verankert am Text, nicht an der Stelle ───────────── */

const bericht1 = await p.evaluate(() => window.__mk.bericht());
gut(/3 Markierungen/.test(bericht1), 'die Auslese nennt die Anzahl');
gut(/hier fehlt eine Zahl/.test(bericht1), 'die Auslese trägt die Notiz mit');
gut(/ROT|GELB|GRUEN/.test(bericht1), 'die Auslese trennt nach Farben');
gut(/kann komplett weg/.test(bericht1) && /soll bleiben/.test(bericht1),
  'die Auslese sagt, was die Farben BEDEUTEN — sie reist ohne diesen Chat');
gut(/lieber bleiben als weg/i.test(bericht1),
  'und trägt den Grundsatz mit: im Zweifel bleiben');
gut(/Zeichen/.test(bericht1),
  'sie nennt, wie VIEL je Farbe betroffen ist — nicht nur wie viele Stellen');
gut(/docs\/papers\/ENTSTEHUNG\.md/.test(bericht1),
  'die Auslese nennt die Quelldatei — sonst weiß niemand, wo die Stelle steht');

/* Neu laden ist der einfachste echte Neubau-Ersatz: dieselbe Datei, frischer
   DOM, die Markierungen müssen sich aus dem Speicher zurückfinden. */
await p.reload();
await p.waitForFunction(() => !!window.__mk);
const nachNeuladen = await p.evaluate(() => ({
  anzahl: window.__mk.marken().length,
  imText: document.querySelectorAll('mark.mk[data-mk]').length > 0,
  verwaist: window.__mk.verwaist().length,
}));
gut(nachNeuladen.anzahl === 3, 'nach dem Neuladen sind alle drei wieder da',
  'gezählt: ' + nachNeuladen.anzahl);
gut(nachNeuladen.imText, 'und sie stehen wieder im Text, nicht nur in der Liste');
gut(nachNeuladen.verwaist === 0, 'keine ist dabei verwaist',
  'verwaist: ' + nachNeuladen.verwaist);

/* ── 6 · Verwaist wird GEMELDET, nicht verschwiegen ───────────────────── */

const verwaist = await p.evaluate(async () => {
  const roh = JSON.parse(localStorage.getItem('sage-antragsmappe-markierungen-v1'));
  roh.marken.push({
    id: 'mtot', quelle: 'docs/FORSCHUNGSKORPUS.md', farbe: 'rot',
    text: 'diesen Satz gibt es in der Mappe nicht', nth: 0, notiz: '', wann: '2026-08-24',
  });
  localStorage.setItem('sage-antragsmappe-markierungen-v1', JSON.stringify(roh));
  return true;
});
void verwaist;
await p.reload();
await p.waitForFunction(() => !!window.__mk);
const gemeldet = await p.evaluate(() => {
  const w = document.querySelector('[data-mk-warnung]');
  return {
    anzahl: window.__mk.verwaist().length,
    warnungSichtbar: w.getBoundingClientRect().height > 0,
    warnungText: w.textContent.replace(/\s+/g, ' ').trim().slice(0, 120),
    imBericht: /verwaist/i.test(window.__mk.bericht()),
  };
});
gut(gemeldet.anzahl === 1, 'eine nicht mehr auffindbare Markierung wird erkannt',
  'gezählt: ' + gemeldet.anzahl);
gut(gemeldet.warnungSichtbar,
  'und sie wird SICHTBAR gemeldet — gemessen an der Höhe, nicht am Attribut',
  'Text: ' + gemeldet.warnungText);
gut(gemeldet.imBericht, 'die Auslese führt sie mit auf, statt sie fallen zu lassen');

/* ── 7 · Aufräumen: entfernen geht wirklich ───────────────────────────── */

const geleert = await p.evaluate(() => {
  const wahl = '[data-quelle="docs/papers/ENTSTEHUNG.md"] p:not(.herkunft)';
  /* Gegen den Text VORHER vergleichen, nicht gegen eine gesetzte Zahl. Ein
     Schwellwert wie „mehr als 40 Zeichen" misst die Laenge des Absatzes,
     nicht die Zusicherung — und faellt um, sobald jemand die Quelle
     umschreibt. */
  const vorher = document.querySelector(wahl).textContent;
  window.__mk.leeren();
  return {
    anzahl: window.__mk.marken().length,
    imText: document.querySelectorAll('mark.mk').length,
    gleich: document.querySelector(wahl).textContent === vorher,
    laenge: vorher.trim().length,
  };
});
gut(geleert.anzahl === 0 && geleert.imText === 0, 'Entfernen nimmt die Hülle weg');
gut(geleert.gleich,
  'und lässt den Text Zeichen für Zeichen stehen (' + geleert.laenge + ')');

await browser.close();

console.log(rot === 0
  ? '\nsmoke_antragsmappe_markieren: alles grün'
  : '\nsmoke_antragsmappe_markieren: ' + rot + ' ROT');
process.exit(rot === 0 ? 0 : 1);
