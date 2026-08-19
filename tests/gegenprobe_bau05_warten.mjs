// Gegenprobe zum Warte-Verhalten in `smoke_bau05_nostr.mjs`.
//
// ANLASS (2026-08-19). Die Probe fiel in einem vollen `run_alle.mjs`-Lauf mit
// genau 5 roten Prüfungen um — Probe 2 vollständig. Einzeln war sie 25 von 25
// Mal grün, auch unter CPU- und Browser-Last; reproduzieren ließ es sich
// nicht. Sie stand auf fünf festen `sleep(50)`, während der Empfänger echte
// Ed25519-Krypto rechnet.
//
// Genau das ist die Lage, in der man sich am leichtesten selbst betrügt: „geht
// ja wieder" ist kein Beweis, und ein Fix, dessen Wirkung man nicht zeigen
// kann, ist nur eine Meinung. Diese Datei zeigt sie — an einer KOPIE der
// Probe, die absichtlich falsch gemacht wird.
//
// Zwei Fälle, und sie zeigen GEGENTEILIGES:
//
//   Fall 1 — die Antwort kommt langsam (Sorte A: auf ein Ereignis warten).
//            Die feste Frist meldet einen Modul-Fehler, wo keiner ist.
//            → falsches ROT. Laut, aber irreführend.
//
//   Fall 2 — die verbotene zweite Antwort kommt verspätet (Sorte B: auf ein
//            Ausbleiben warten). Die zu kurze Frist sieht sie nicht.
//            → falsches GRÜN. Das ist die gefährlichere Hälfte: der
//              Replay-Schutz wäre kaputt und niemand wüsste es.
//
// Beide Fälle laufen zweimal: mit der heutigen Fassung und mit der alten
// festen Frist. Erst der Unterschied ist der Beweis.
//
// Die echte Probe wird NICHT angefasst — es wird in eine Wegwerf-Kopie unter
// tests/ geschrieben (der relative Import auf ../src muss stimmen) und die am
// Ende gelöscht, auch bei Abbruch.
//
// BEIDE Schwester-Proben werden geprüft: `smoke_bau05_nostr.mjs` (Handshake)
// und `smoke_query_ueber_relais.mjs` (Frage/Antwort). Sie standen auf
// derselben Bauart fester Fristen. Nur eine davon zu belegen hieße, die
// Hälfte des Befunds für erledigt zu erklären.
//
// Lauf:  node tests/gegenprobe_bau05_warten.mjs

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const KOPIE = resolve(HIER, '_wegwerf_bau05_warten.mjs');

// Je Probe: wie der Replay-Schritt aussieht und wie ein zweiter Reply hiesse.
const PROBEN = [
  {
    datei: 'smoke_bau05_nostr.mjs',
    replayAnker: '  await relay.publish(evP4);       // identischer Replay (gleiche nonce)',
    replyTag: 'sbkim-anastomosis-reply',
    ziel: 'alt4.nodeId',
    nonce: 'reqP4.nonce',
  },
  {
    datei: 'smoke_query_ueber_relais.mjs',
    replayAnker: '  await relay.publish(ev4);   // identischer Replay',
    replyTag: 'sbkim-query-reply',
    ziel: 'FAKE_ASKER',
    nonce: 'nonce4',
  },
];

// Die Zustellung des Mock-Relais künstlich verzögern.
const ZUSTELLUNG_SOFORT = 'Promise.resolve().then(() => { try { s.onEvent(ev); } catch (e) {} });';
function zustellungVerzoegern(text, ms) {
  const neu = `setTimeout(() => { try { s.onEvent(ev); } catch (e) {} }, ${ms});`;
  if (!text.includes(ZUSTELLUNG_SOFORT)) throw new Error('Anker Zustellung nicht gefunden');
  return text.replace(ZUSTELLUNG_SOFORT, neu);
}

// Zurück auf die alte feste Frist — beide Sorten auf einmal.
function alteFesteFrist(text) {
  let t = text
    .replace(/await warteBis\([^\n]*\);/g, 'await sleep(50);')
    .replace(/await sleep\(RUHE_MS\);/g, 'await sleep(50);');
  if (t.includes('warteBis(') === false && t === text) throw new Error('nichts zurückgedreht');
  return t;
}

// Eine verspätete ZWEITE Antwort einschleusen: der Replay-Schutz hat versagt,
// nur langsam. Kein Eingriff ins Modul — es wird derselbe Weg benutzt, den
// auch eine echte zweite Antwort nähme.
function verspaeteterZweitReply(text, ms, p) {
  if (!text.includes(p.replayAnker)) throw new Error('Anker Replay nicht gefunden: ' + p.datei);
  return text.replace(p.replayAnker, p.replayAnker + `
  setTimeout(() => { relay.publish({
    kind: 1, created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "${p.replyTag}"], ["d", ${p.ziel}], ["x", ${p.nonce}]],
    content: "{}",
  }); }, ${ms});`);
}

function lauf(text, name) {
  writeFileSync(KOPIE, text, 'utf-8');
  try {
    const aus = execFileSync('node', [KOPIE], { encoding: 'utf-8', timeout: 120000 });
    return { rot: false, aus };
  } catch (e) {
    return { rot: true, aus: String(e.stdout || '') + String(e.stderr || '') };
  }
}

const ergebnisse = [];
function pruefe(name, istRot, sollRot, warum) {
  const ok = istRot === sollRot;
  ergebnisse.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  console.log(`    erwartet: ${sollRot ? 'ROT' : 'grün'} · bekommen: ${istRot ? 'ROT' : 'grün'}`);
  console.log(`    ${warum}`);
}

try {
  for (const p of PROBEN) {
    const quelle = readFileSync(resolve(HIER, p.datei), 'utf-8');
    console.log(`\n════ ${p.datei} ════`);

    console.log('\n── Fall 1: die Antwort kommt langsam (120 ms) ──\n');
    const langsam = zustellungVerzoegern(quelle, 120);

    pruefe(`${p.datei} — heute (warteBis) übersteht eine langsame Antwort`,
           lauf(langsam).rot, false,
           'warteBis kehrt zurück, sobald die Antwort da ist — Frist nur als Obergrenze.');

    pruefe(`${p.datei} — mit fester kurzer Frist fällt sie um`,
           lauf(alteFesteFrist(langsam)).rot, true,
           'Bliebe sie auch hier grün, hätte der Fix nichts behoben.');

    console.log('\n── Fall 2: die verbotene zweite Antwort kommt nach 150 ms ──\n');
    const zweit = verspaeteterZweitReply(quelle, 150, p);

    pruefe(`${p.datei} — heute (RUHE_MS) FÄNGT die verspätete zweite Antwort`,
           lauf(zweit).rot, true,
           'Der Replay-Schutz ist hier künstlich gebrochen — die Probe MUSS das merken.');

    pruefe(`${p.datei} — mit kurzer Frist bleibt sie blind (falsches Grün)`,
           lauf(alteFesteFrist(zweit)).rot, false,
           'Genau diese Lücke schließt die längere Ruhe-Frist. Sie ist der eigentliche Gewinn.');
  }
} finally {
  if (existsSync(KOPIE)) unlinkSync(KOPIE);
}

const rot = ergebnisse.filter((e) => !e.ok);
console.log(`\nSumme: ${ergebnisse.length - rot.length} wie erwartet, ${rot.length} NICHT`);
if (rot.length) {
  console.log('Ein Fall lief anders als erwartet — der Wächter misst nicht, was er zu messen glaubt.');
}
process.exit(rot.length ? 1 : 0);
