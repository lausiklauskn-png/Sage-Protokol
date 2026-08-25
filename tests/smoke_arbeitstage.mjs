/* smoke_arbeitstage.mjs — bewacht die tägliche Dokumentation der Arbeitstage.
 *
 * Lauf:  node tests/smoke_arbeitstage.mjs
 * Der Browser-Teil braucht `playwright-core`. Fehlt es, läuft der Rest
 * trotzdem, und was ungeprüft blieb, wird benannt statt übergangen.
 *
 * ── DIE ZUSICHERUNG, DIE HIER AM MEISTEN WIEGT ─────────────────────────────
 *
 * Das Blatt kann einer Behörde vorgelegt werden. Es muss deshalb zweierlei
 * aushalten:
 *
 *   1. **Keine Spalte behauptet mehr, als sie misst.** Keine Überschrift heißt
 *      „gearbeitet". Eine Aufstellung, die aus Zeitstempeln „19,9 Stunden
 *      gearbeitet" macht, fällt bei der ersten Rückfrage um, und dann fallen
 *      auch die richtigen Zeilen mit.
 *   2. **Die zeitgesteuerten Läufe sind heraus.** Ein „erster Eintrag 03:04"
 *      von einem Dienst ist der eine Fund, der die ganze Aufstellung erledigt.
 *
 * ── WIE HIER GEPRÜFT WIRD, UND WARUM NICHT ANDERS ──────────────────────────
 *
 * Eine Probe, die die Rechnung NACHBAUT, prüft ihre eigene Rechnung. Sie wäre
 * grün, wenn beide denselben Denkfehler machen. Deshalb zwei getrennte Teile:
 *
 *   A · Das Rechen-Modul wird an **erfundenen Tagen** geprüft, bei denen die
 *       Antwort von Hand bekannt ist. Dort werden die Regeln selbst gemessen,
 *       einschließlich der Grenzfälle genau auf der Lücken-Schwelle.
 *   B · Das Blatt wird gegen **dasselbe Modul** geprüft: es darf keine Zahl
 *       zeigen, die das Modul nicht hergibt.
 *
 * So misst A die Regel und B die Wiedergabe. Keiner der beiden Teile könnte
 * den Fehler des anderen decken.
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { LUECKE_MIN, VORLAUF_MIN, istAutomatik, rechneTage }
  from '../tools/arbeitstage-rechnen.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);
const HTML = P('docs/historie/arbeitstage.html');
const CSV_TAGE = P('docs/historie/arbeitstage-tage.csv');
const CSV_TAET = P('docs/historie/arbeitstage-taetigkeiten.csv');
const HISTORIE = P('docs/historie/historie.html');

let rot = 0, ungeprueft = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

/* ═══ A · Die Regeln, an erfundenen Tagen mit bekannter Antwort ═══════════ */

const c = (datum, zeit, autor = 'Klaus', repo = 'X') =>
  ({ datum, zeit, autor, repo, betreff: 'Probe', plus: 1, minus: 0 });

{
  /* Zwei Einträge, eine Stunde auseinander: Spanne 1 h, aktiv 1 h + Vorlauf. */
  const { tage } = rechneTage([c('2026-01-01', '09:00'), c('2026-01-01', '10:00')]);
  gut(tage[0].spanne === 1, 'Spanne ist der Abstand erster bis letzter Eintrag',
    'gerechnet: ' + tage[0].spanne);
  gut(Math.abs(tage[0].aktiv - (1 + VORLAUF_MIN / 60)) < 1e-9,
    'aktive Zeit zählt den Abstand plus einen Vorlauf',
    'gerechnet: ' + tage[0].aktiv);
  gut(tage[0].abschnitte === 1, 'ein Abschnitt, solange die Lücke klein bleibt');
}
{
  /* Genau AUF der Schwelle zählt noch als Arbeit, eine Minute darüber nicht.
     Ein Grenzfall, den ein Wächter ohne beide Seiten nie bemerkt. */
  const auf = rechneTage([c('2026-01-01', '09:00'),
    c('2026-01-01', String(9 + Math.floor(LUECKE_MIN / 60)).padStart(2, '0')
      + ':' + String(LUECKE_MIN % 60).padStart(2, '0'))]).tage[0];
  gut(auf.abschnitte === 1,
    'eine Lücke von genau ' + LUECKE_MIN + ' Minuten bleibt derselbe Abschnitt');
  const drueber = rechneTage([c('2026-01-01', '09:00'), c('2026-01-01', '12:00')]).tage[0];
  gut(drueber.abschnitte === 2,
    'eine Lücke von drei Stunden beginnt einen neuen Abschnitt');
  gut(Math.abs(drueber.aktiv - 2 * VORLAUF_MIN / 60) < 1e-9,
    'dann zählt nur der Vorlauf beider Abschnitte, nicht die Pause',
    'gerechnet: ' + drueber.aktiv);
}
{
  /* Die Automatik darf die Zeiten nicht verschieben. */
  const mensch = [c('2026-01-01', '09:00'), c('2026-01-01', '17:00')];
  const bot = c('2026-01-01', '03:04', 'github-actions[bot]');
  const ohne = rechneTage(mensch).tage[0];
  const mit = rechneTage([bot, ...mensch]).tage[0];
  gut(istAutomatik(bot) && !istAutomatik(mensch[0]),
    'ein Dienst wird an der Autoren-Kennung erkannt, nicht am Betreff');
  gut(mit.erster === '09:00' && mit.spanne === ohne.spanne,
    'ein nächtlicher Dienst verschiebt weder Anfang noch Spanne',
    'erster: ' + mit.erster + ', Spanne: ' + mit.spanne);
  gut(mit.automatik === 1 && mit.eintraege === 2,
    'er wird gezählt, aber nicht mitgerechnet');
  const nurBot = rechneTage([bot]).tage[0];
  gut(nurBot.ohneArbeit === true && nurBot.spanne === 0 && nurBot.aktiv === 0,
    'ein Tag mit ausschliesslich Dienst-Einträgen hat keine Arbeitszeit');
}

/* ═══ B · Das Blatt gibt genau das wieder, was das Modul rechnet ══════════ */

gut(existsSync(HTML), 'das Blatt liegt vor');
gut(existsSync(CSV_TAGE) && existsSync(CSV_TAET), 'beide Tabellenblätter liegen vor');

const d = JSON.parse(readFileSync(P('docs/historie/historie.json'), 'utf-8'));
const { tage, summe: g } = rechneTage(d.commits);
const html = readFileSync(HTML, 'utf-8');
const st = (n) => n.toFixed(1).replace('.', ',');

/* Der BOM. Ohne ihn rät Androids Betrachter bei einer heruntergeladenen Datei
   Latin-1, und aus jedem Umlaut werden zwei Zeichen. Gemessen an den BYTES. */
for (const [pfad, name] of [[HTML, 'das Blatt'], [CSV_TAGE, 'die Tages-Tabelle'],
  [CSV_TAET, 'die Tätigkeits-Tabelle'], [HISTORIE, 'die Historie']]) {
  const b = readFileSync(pfad);
  gut(b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF,
    name + ' beginnt mit einem BOM');
}

/* Jeder Tag genau einmal, als Zeile UND als Block. */
const zeilen = (html.match(/<tr data-tag="/g) || []).length;
const bloecke = (html.match(/<div class="tag" id="t/g) || []).length;
gut(zeilen === tage.length, 'jeder der ' + tage.length + ' Tage hat eine Zeile',
  'gezählt: ' + zeilen);
gut(bloecke === tage.length, 'und jeder einen eigenen Tagesblock',
  'gezählt: ' + bloecke);

/* Die Summen. Eine Summe, die nicht aus den Zeilen folgt, ist der teuerste
   Fehler in einer Aufstellung: sie sieht gerechnet aus. */
for (const [feld, wert] of [['spanne', st(g.spanne)], ['aktiv', st(g.aktiv)]]) {
  gut(html.includes('data-summe="' + feld + '">' + wert + '<'),
    'die Summe „' + feld + '" nennt den gerechneten Wert ' + wert,
    'erwartet: ' + wert);
}
gut(html.includes('data-summe="eintraege">' + g.eintraege.toLocaleString('de-DE') + '<'),
  'die Summe der Einträge stimmt (' + g.eintraege + ')');

/* Stichproben aus den Tageszeilen: fünf über das Jahr verteilt. */
for (const i of [0, Math.floor(tage.length / 4), Math.floor(tage.length / 2),
  Math.floor(tage.length * 3 / 4), tage.length - 1]) {
  const t = tage[i];
  const muster = new RegExp('data-tag="' + t.datum + '">.*?</tr>', 's');
  const zeile = (html.match(muster) || [''])[0];
  gut(zeile.includes('>' + st(t.spanne) + '<') && zeile.includes('>' + st(t.aktiv) + '<')
    && (t.ohneArbeit || zeile.includes('>' + t.erster + '<')),
    'die Zeile zum ' + t.datum + ' zeigt die gerechneten Werte',
    'Spanne ' + st(t.spanne) + ', aktiv ' + st(t.aktiv) + ', erster ' + t.erster);
}

/* KEINE Spalte behauptet „gearbeitet". Gemessen wird im Tabellenkopf. */
const kopf = (html.match(/<thead>.*?<\/thead>/s) || [''])[0];
gut(!/gearbeitet|Arbeitszeit/i.test(kopf),
  'keine Spaltenüberschrift behauptet „gearbeitet"',
  kopf.slice(0, 160));
for (const sp of ['erster', 'letzter', 'spanne', 'aktiv', 'eintraege']) {
  gut(kopf.includes('data-spalte="' + sp + '"'),
    'die Spalte „' + sp + '" ist als solche gekennzeichnet');
}
gut(/Spanne<small>erster bis letzter<\/small>/.test(kopf),
  'die Spalte „Spanne" sagt in der Überschrift, was sie misst');

/* Die drei Sätze, ohne die das Blatt genauer aussieht, als es ist.
   Sie hängen an Marken, nicht an Wörtern: ein Wächter, der die Formulierung
   festnagelt, verbietet das Richtigstellen. */
const absatz = (marke) => (html.match(new RegExp('<p ' + marke + '[^>]*>(.*?)</p>', 's'))
  || [, ''])[1];
gut(/vergibt das System/.test(absatz('data-erklaerung') + html),
  'das Blatt sagt, dass die Uhrzeiten vom System stammen');
gut(/herausgerechnet|nicht.*mit/i.test(absatz('data-automatik')),
  'das Blatt sagt, dass die zeitgesteuerten Läufe heraus sind');
gut(absatz('data-automatik').includes(String(g.automatik)),
  'und nennt dabei die gemessene Zahl ' + g.automatik);
gut(/zu niedrig/.test(absatz('data-untergrenze')),
  'das Blatt sagt, dass die Werte eher zu niedrig sind');

/* Die Regelzahlen werden AUS dem Modul genannt, nicht danebengeschrieben. */
gut(html.includes('Abstände bis ' + LUECKE_MIN + ' Minuten'),
  'die Lücken-Grenze im Text ist die des Moduls (' + LUECKE_MIN + ')');
gut(html.includes(VORLAUF_MIN + ' Minuten Vorlauf'),
  'der Vorlauf im Text ist der des Moduls (' + VORLAUF_MIN + ')');

/* Nichts gekürzt: jeder gezählte Eintrag steht als Zeile im Tagesblock. */
const punkte = (html.match(/<li><span class="uhr">/g) || []).length;
gut(punkte === g.eintraege,
  'alle ' + g.eintraege.toLocaleString('de-DE') + ' Tätigkeiten stehen einzeln da',
  'gezählt: ' + punkte);

/* ═══ C · Die Tabellenblätter ═════════════════════════════════════════════ */

const csvT = readFileSync(CSV_TAGE, 'utf-8');
const csvZ = csvT.trim().split('\r\n');
gut(csvZ.length === tage.length + 2,
  'die Tages-Tabelle hat Kopf, ' + tage.length + ' Tage und eine Summenzeile',
  'Zeilen: ' + csvZ.length);
gut(csvZ[0].split(';').length === 9 && csvZ[0].includes('Spanne in Stunden'),
  'ihr Kopf benennt die Einheit');
gut(!/gearbeitet/i.test(csvZ[0]), 'auch dort behauptet keine Spalte „gearbeitet"');
gut(csvZ[csvZ.length - 1].includes(st(g.spanne))
  && csvZ[csvZ.length - 1].includes(st(g.aktiv)),
  'ihre Summenzeile trägt dieselben Summen wie das Blatt');
gut(/;\d+,\d;/.test(csvT),
  'die Stunden stehen mit Komma, damit ein deutsches Excel sie als Zahl liest');

const csvA = readFileSync(CSV_TAET, 'utf-8').trim().split('\r\n');
gut(csvA.length === g.eintraege + 1,
  'die Tätigkeits-Tabelle hat eine Zeile je gezähltem Eintrag',
  'Zeilen: ' + (csvA.length - 1) + ', erwartet ' + g.eintraege);
gut(!csvA.some((z) => z.includes('[bot]')),
  'kein zeitgesteuerter Eintrag steht darin');

/* ═══ D · Der Abschnitt in der Historie ═══════════════════════════════════ */

if (gut(existsSync(HISTORIE), 'die Historie liegt vor')) {
  const hist = readFileSync(HISTORIE, 'utf-8');
  gut(hist.includes('id="arbeitszeit"'), 'die Historie hat einen Abschnitt zur Arbeitszeit');
  gut(hist.includes('<b>' + st(g.spanne) + ' h</b>')
    && hist.includes('<b>' + st(g.aktiv) + ' h</b>'),
    'er nennt dieselben Summen wie das Blatt',
    'erwartet ' + st(g.spanne) + ' h und ' + st(g.aktiv) + ' h');
  gut(/arbeitstage\.html/.test(hist) && /arbeitstage\.pdf/.test(hist)
    && /arbeitstage-tage\.csv/.test(hist),
    'und verweist auf Blatt, PDF und Tabellenblatt');
}

/* ═══ E · Das PDF ═════════════════════════════════════════════════════════ */

const PDF = P('docs/historie/arbeitstage.pdf');
if (!existsSync(PDF)) {
  console.log('  ⊘    das PDF ist NICHT GEPRÜFT (noch nicht gebaut)');
  ungeprueft++;
} else {
  const b = readFileSync(PDF);
  gut(b.slice(0, 5).toString('latin1') === '%PDF-', 'das PDF ist ein echtes PDF');
  gut(b.length > 200 * 1024,
    'es ist nicht die leere Hülle eines fehlgeschlagenen Laufs',
    Math.round(b.length / 1024) + ' KB');
}

/* ═══ F · Das Blatt läuft wirklich ════════════════════════════════════════ */

let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { chromium = null; }

if (!chromium) {
  console.log('  ⊘    der Browser-Teil ist NICHT GEPRÜFT (playwright-core fehlt)');
  ungeprueft++;
} else {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await browser.newPage();
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(pathToFileURL(HTML).href);
  await p.waitForSelector('tfoot [data-summe="spanne"]');
  gut(fehler.length === 0, 'das Blatt lädt ohne Skriptfehler', fehler[0]);

  /* Die Umlaute kommen an. Gemessen am gezeichneten Text, nicht an den Bytes:
     ein Wächter auf die Datei sähe nicht, was der Browser daraus macht. */
  const text = await p.evaluate(() => document.body.innerText);
  gut(/Tätigkeit|Einträge|Spanne/.test(text) && !/Ã¤|Ã¼|Ã¶|�/.test(text),
    'die Umlaute erscheinen richtig, kein Fragezeichen und kein Ã');

  /* Der Sprung von der Übersicht in den Tagesblock trägt wirklich. */
  const ziel = tage[Math.floor(tage.length / 2)].datum;
  const sichtbar = await p.evaluate((dat) => {
    const a = document.querySelector('a[href="#t' + dat + '"]');
    const b = document.getElementById('t' + dat);
    return !!a && !!b && b.offsetHeight > 0;
  }, ziel);
  gut(sichtbar, 'der Verweis aus der Übersicht findet seinen Tagesblock (' + ziel + ')');

  /* Die Tabelle bricht nicht seitlich aus. */
  const quer = await p.evaluate(() => {
    /* AUFRAEUMEN NICHT VERGESSEN. Diese Zeile setzt eine Inline-Breite am
       Wurzelelement, und die bleibt stehen. Der Druck-Wächter darunter hat
       dadurch beim ersten Lauf 599 statt 703 px gemessen: er maß ein
       Dokument, das diese Prüfung schmal gemacht hatte. Eine Probe, die der
       nächsten die Ausgangslage umlegt, ist ein Fehler, auch wenn sie selbst
       grün bleibt. */
    document.documentElement.style.width = '380px';
    const passt = document.body.scrollWidth <= document.documentElement.clientWidth + 2;
    document.documentElement.style.width = '';
    return passt;
  });
  gut(quer, 'bei 380 px Breite läuft die Seite nicht seitlich über');

  /* ── DIE TABELLE MUSS AUFS PAPIER PASSEN ────────────────────────────────
     Befund vom 2026-08-25 an Klaus' Gerät: im PDF fehlten die zwei rechten
     Spalten. Gemessen 802 px Tabelle auf 703 px Papier.

     DER PRÜFPUNKT DARÜBER HAT DAS NICHT GEFANGEN, und das ist die Lehre:
     er misst den SCHIRM bei 380 px, wo `overflow-x:auto` zum Scrollen
     einlädt und alles in Ordnung aussieht. Auf Papier kann man nicht
     scrollen, dort schneidet dieselbe Regel ab, und zwar STILL.

     Gemessen wird deshalb im Druck-Medium und gegen die echte Seitenbreite:
     A4 hoch (210 mm) minus 2 × 12 mm Rand aus `arbeitstage-pdf.mjs`, also
     186 mm = 703 px bei 96 dpi. Wer den Rand dort ändert, ändert ihn hier. */
  const A4_INNEN_PX = 703;
  await p.emulateMedia({ media: 'print' });
  await p.setViewportSize({ width: A4_INNEN_PX, height: 1000 });
  /* Frisch laden, statt auf das Aufräumen darüber zu vertrauen. Zwei Riegel,
     die einander decken: fasst jemand die Zeile oben wieder an, misst dieser
     Wächter trotzdem das Richtige. */
  await p.reload({ waitUntil: 'load' });
  const druck = await p.evaluate(() => {
    const t = document.querySelector('.rahmen table');
    const r = t.closest('.rahmen');
    return {
      breite: Math.round(t.getBoundingClientRect().width),
      scroll: t.scrollWidth,
      overflow: getComputedStyle(r).overflowX,
    };
  });
  gut(Math.max(druck.breite, druck.scroll) <= A4_INNEN_PX,
    'die Tabelle passt im Druck auf A4 hoch (' + druck.breite + ' von '
    + A4_INNEN_PX + ' px)',
    'zu breit um ' + (Math.max(druck.breite, druck.scroll) - A4_INNEN_PX)
    + ' px. Im PDF fehlen dann rechts Spalten, ohne dass es auffällt.');

  /* Zweiter Riegel, und er deckt den ersten: passte die Tabelle, aber der
     Überhang würde weggeschnitten, wäre ein künftiger Zuwachs wieder still.
     Auf Papier gibt es kein Scrollen, also darf dort nichts clippen. */
  gut(druck.overflow === 'visible',
    'im Druck wird ein Überhang sichtbar statt abgeschnitten',
    'overflow-x ist "' + druck.overflow + '" — das clippt auf Papier lautlos');

  await browser.close();
}

console.log('\nsmoke_arbeitstage: ' + (rot === 0 ? 'alles grün' : rot + ' ROT')
  + (ungeprueft ? ' · ' + ungeprueft + ' ungeprüft' : '')
  + ' · Blatt ' + Math.round(statSync(HTML).size / 1024) + ' KB');
process.exit(rot === 0 ? 0 : 1);
