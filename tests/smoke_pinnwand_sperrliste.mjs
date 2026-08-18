#!/usr/bin/env node
/*
 * Smoke — Sperr-Liste in der Pinnwand (`pinnwand/index.html`).
 *
 * WOZU: Die Pinnwand schreibt auf DASSELBE Brett wie Kimboard — gleicher Tag
 * (`sbkim-frage-antwort-test`), gleiches Relais (Klaus' eigener Server). Bis
 * zum 2026-08-18 filterte nur Kimboard: ein dort gesperrter Zettel war hier
 * weiter voll sichtbar. Dieselbe Wand, zwei Regeln.
 *
 * WAS HIER GEMESSEN WIRD — und wie:
 * Der Sperr-Block liegt inline in `index.html`, nicht als eigene Datei. Diese
 * Probe SCHNEIDET IHN HERAUS und lässt ihn wirklich laufen (mit echtem
 * WebCrypto und dem echten noble-secp256k1). Sie prüft damit den Code, der
 * ausgeliefert wird — nicht eine Nachbildung davon.
 *
 *   1. EINE ECHT SIGNIERTE LISTE WIRD ANGENOMMEN.
 *   2. EINE VERBOGENE WIRD ABGELEHNT — Inhalt geändert, Signatur getauscht,
 *      fremder Absender. Ohne diese drei wäre die Prüfung Zierde: eine Liste,
 *      der man nicht ansieht, von wem sie stammt, ist keine.
 *   3. UNSINN LANDET NICHT LEISE IN DER LISTE. Kennungen, die keine 64 Hex
 *      sind, werden verworfen — sonst zählte die App Sperren, die keine sind.
 *   4. FAIL-SOFT: kein Netz, kein JSON, kein Schlüssel → das Brett läuft.
 *   5. DIE VERDRAHTUNG STIMMT. Der Filter sitzt GANZ OBEN in `dispatch()`,
 *      vor dem Entschlüsseln — ein Filter weiter unten hätte den Inhalt schon
 *      in der Hand. Und die Liste wird beim Start wirklich geholt.
 *
 * Aufruf: node tests/smoke_pinnwand_sperrliste.mjs   ·   Exit 0 = grün.
 */
import { webcrypto, createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

if (!globalThis.crypto) globalThis.crypto = webcrypto;
/* noble-secp256k1 erkennt seinen Zufalls- und Hash-Geber über `self.crypto`
   (Browser-Muster) BEIM LADEN. Fehlt das in Node, wirft jede Hash-Berechnung —
   und `schnorr.verify` schluckt den Wurf zu einem schlichten `false`. Ein
   „ungültig", das in Wahrheit „konnte gar nicht rechnen" heißt. Deshalb steht
   diese Zeile VOR dem Import, und die Gegenprobe unten beweist, dass sie
   wirkt. */
if (typeof globalThis.self === 'undefined') globalThis.self = globalThis;

const HIER = dirname(fileURLToPath(import.meta.url));
const SEITE = resolve(HIER, '..', 'pinnwand', 'index.html');
const quelle = readFileSync(SEITE, 'utf8');

const { schnorr } = await import('../pinnwand/modules/noble-secp256k1.js');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('  FAIL ' + m); } };

const toHex = (b) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
const fromHex = (h) => {
  const a = new Uint8Array(h.length / 2);
  for (let i = 0; i < a.length; i++) a[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return a;
};

console.log('== Pinnwand · Sperr-Liste ==');

/* ─── Den echten Block herausschneiden ─────────────────────────────────────
   Nicht nachbauen: was hier läuft, ist Zeile für Zeile das, was im Browser
   läuft. Findet der Schnitt seine Marken nicht, ist das ein Fehler und keine
   Kleinigkeit — dann misst die Probe nichts und darf nicht grün werden. */
const START = '// ---- Sperr-Liste (Moderation) ---';
const ENDE = '// ---- Gerätename';
const i = quelle.indexOf(START), j = quelle.indexOf(ENDE);
ok(i > 0 && j > i, 'der Sperr-Block ist in index.html auffindbar');
if (i < 0 || j <= i) {
  console.log(`\n== Ergebnis: ${pass} ok, ${fail + 1} FAIL ==`);
  process.exit(1);
}
const block = quelle.slice(i, j);

/* Der Block braucht `toHex`, `fromHex`, `schnorr`, `crypto`, `fetch` und
   `qViews` aus seiner Umgebung — die reichen wir hinein. Alles andere ist
   sein eigener Code. */
function baue(fetchStub, qViews) {
  const f = new Function('toHex', 'fromHex', 'schnorr', 'fetch', 'qViews',
    block + '\nreturn { istGesperrt, ladeSperrliste, wischeGesperrte, gesperrteZettel, gesperrteAbsender, SPERR_QUELLE, SPERR_SCHLUESSEL };');
  return f(toHex, fromHex, schnorr, fetchStub, qViews);
}

async function signiere(inhalt, priv) {
  const pub = toHex(schnorr.getPublicKey(priv));
  const ev = { pubkey: pub, created_at: 1787087777, kind: 30078,
               tags: [['d', 'kimboard-sperrliste']], content: inhalt };
  ev.id = createHash('sha256')
    .update(JSON.stringify([0, ev.pubkey, ev.created_at, ev.kind, ev.tags, ev.content]))
    .digest('hex');
  ev.sig = toHex(await schnorr.sign(fromHex(ev.id), priv));
  return ev;
}
const antwort = (obj) => async () => ({ ok: true, json: async () => obj });

const ZETTEL = createHash('sha256').update('zettel-1').digest('hex');
const ABSENDER = createHash('sha256').update('boeser').digest('hex');
const INHALT = JSON.stringify({
  fassung: 1, stand: '2026-08-18',
  ereignisse: { [ZETTEL]: { grund: 'Testsperrung', seit: '2026-08-18' } },
  absender: { [ABSENDER]: { grund: 'Wiederholung', seit: '2026-08-18' } }
});

try {
  /* ═══ 1. Echt signiert → wird angenommen ═══
     Der Schlüssel des Betreibers steht als Konstante im Block. Wir signieren
     mit GENAU dem — dafür brauchen wir seinen privaten Teil nicht: wir bauen
     den Block ein zweites Mal mit einem eigenen Schlüsselpaar und prüfen die
     Ablehnung; die Annahme messen wir, indem wir den erwarteten Schlüssel als
     Absender ausgeben und die Signatur passend erzeugen. */
  {
    /* Ein eigenes Paar — und der Block bekommt dessen öffentlichen Teil als
       erwarteten Schlüssel untergeschoben, indem wir die Konstante ersetzen.
       Das ist der einzige Weg, die ANNAHME zu messen, ohne Klaus' privaten
       Schlüssel zu haben (den es hier zu Recht nicht gibt). */
    const priv = Uint8Array.from(randomBytes(32));
    const pub = toHex(schnorr.getPublicKey(priv));
    const ev = await signiere(INHALT, priv);
    const eigenerBlock = block.replace(
      /const SPERR_SCHLUESSEL = '[0-9a-f]{64}';/,
      "const SPERR_SCHLUESSEL = '" + pub + "';");
    ok(eigenerBlock !== block, 'der Betreiber-Schlüssel steht als 64-Hex-Konstante im Block');
    const f = new Function('toHex', 'fromHex', 'schnorr', 'fetch', 'qViews',
      eigenerBlock + '\nreturn { istGesperrt, ladeSperrliste, gesperrteZettel, gesperrteAbsender };');
    const M = f(toHex, fromHex, schnorr, antwort(ev), new Map());

    const n = await M.ladeSperrliste();
    ok(n === 2, 'eine ECHT SIGNIERTE Liste wird angenommen (2 Einträge)');
    ok(M.istGesperrt({ id: ZETTEL, pubkey: 'x' }), '…ein gesperrter Zettel gilt als gesperrt');
    ok(M.istGesperrt({ id: 'y', pubkey: ABSENDER }), '…ein gesperrter Absender ebenso');
    ok(!M.istGesperrt({ id: 'y', pubkey: 'x' }), '…und alles andere NICHT');

    /* Gegenprobe zum Prüfweg selbst: derselbe Aufbau, aber am Inhalt gedreht.
       Bliebe das grün, prüfte die Signatur gar nichts. */
    const verbogen = { ...ev, content: INHALT.replace('Testsperrung', 'Harmlos') };
    const M2 = f(toHex, fromHex, schnorr, antwort(verbogen), new Map());
    ok(await M2.ladeSperrliste() === 0, 'am INHALT gedreht → abgelehnt');

    const falscheSig = { ...ev, sig: '00' + ev.sig.slice(2) };
    const M3 = f(toHex, fromHex, schnorr, antwort(falscheSig), new Map());
    ok(await M3.ladeSperrliste() === 0, 'SIGNATUR getauscht → abgelehnt');
  }

  /* ═══ 2. Fremder Absender → abgelehnt, auch mit gültiger Signatur ═══
     Das ist der Angriff, den man leicht übersieht: die Liste ist tadellos
     signiert — nur eben von jemand anderem. */
  {
    const fremd = Uint8Array.from(randomBytes(32));
    const ev = await signiere(INHALT, fremd);
    const M = baue(antwort(ev), new Map());
    ok(await M.ladeSperrliste() === 0,
      'FREMDER ABSENDER wird abgelehnt, obwohl die Signatur stimmt');
    ok(M.gesperrteZettel.size === 0, '…und es landet nichts in der Liste');
  }

  /* ═══ 3. Unsinn landet nicht leise in der Liste ═══ */
  {
    const priv = Uint8Array.from(randomBytes(32));
    const pub = toHex(schnorr.getPublicKey(priv));
    const müll = JSON.stringify({
      fassung: 1, stand: '2026-08-18',
      ereignisse: { 'kein-hex': { grund: 1 }, '0815': {} },
      absender: { 'auch-nicht': {} }
    });
    const ev = await signiere(müll, priv);
    const eigenerBlock = block.replace(
      /const SPERR_SCHLUESSEL = '[0-9a-f]{64}';/,
      "const SPERR_SCHLUESSEL = '" + pub + "';");
    const f = new Function('toHex', 'fromHex', 'schnorr', 'fetch', 'qViews',
      eigenerBlock + '\nreturn { ladeSperrliste, gesperrteZettel, gesperrteAbsender };');
    const M = f(toHex, fromHex, schnorr, antwort(ev), new Map());
    ok(await M.ladeSperrliste() === 0, 'unsinnige Kennungen zählen nicht');
    ok(M.gesperrteZettel.size === 0 && M.gesperrteAbsender.size === 0,
      '…und landen NICHT leise in der Liste');
  }

  /* ═══ 4. Fail-soft — das Brett läuft in jedem Fall weiter ═══ */
  {
    for (const [name, stub] of [
      ['kein Netz', async () => { throw new Error('offline'); }],
      ['HTTP-Fehler', async () => ({ ok: false, status: 404 })],
      ['kein JSON', async () => ({ ok: true, json: async () => { throw new Error('kaputt'); } })],
      ['kein Ereignis, nur ein Objekt', antwort({ irgendwas: 1 })],
      ['leere Antwort', antwort(null)]
    ]) {
      const M = baue(stub, new Map());
      let geworfen = false, n = -1;
      try { n = await M.ladeSperrliste(); } catch { geworfen = true; }
      ok(!geworfen && n === 0, 'FAIL-SOFT bei „' + name + '": kein Wurf, keine Sperren');
    }
  }

  /* ═══ 5. Nachwischen nimmt Gesperrtes vom Brett ═══
     Die Liste kommt übers Netz und damit später als die ersten Zettel. Ohne
     das Nachwischen wirkte sie erst nach einem Neuladen. */
  {
    const priv = Uint8Array.from(randomBytes(32));
    const pub = toHex(schnorr.getPublicKey(priv));
    const ev = await signiere(INHALT, priv);
    const eigenerBlock = block.replace(
      /const SPERR_SCHLUESSEL = '[0-9a-f]{64}';/,
      "const SPERR_SCHLUESSEL = '" + pub + "';");

    const weg = [];
    const macheLi = (marke) => ({ parentNode: { removeChild: () => weg.push(marke) } });
    const qViews = new Map([
      ['a', { qEv: { id: ZETTEL, pubkey: 'x' }, li: macheLi('gesperrter-zettel'), answers: [], answerIds: new Set() }],
      ['b', { qEv: { id: 'harmlos', pubkey: 'x' }, li: macheLi('harmlose-frage'),
              answerIds: new Set(['antw']),
              answers: [{ ev: { id: 'antw', pubkey: ABSENDER }, li: macheLi('antwort-vom-gesperrten') }] }]
    ]);
    const f = new Function('toHex', 'fromHex', 'schnorr', 'fetch', 'qViews',
      eigenerBlock + '\nreturn { ladeSperrliste, wischeGesperrte };');
    const M = f(toHex, fromHex, schnorr, antwort(ev), qViews);
    await M.ladeSperrliste();
    M.wischeGesperrte();

    ok(weg.includes('gesperrter-zettel'), 'ein schon gezeichneter gesperrter Zettel wird entfernt');
    ok(weg.includes('antwort-vom-gesperrten'), '…und eine Antwort eines gesperrten Absenders auch');
    ok(!weg.includes('harmlose-frage'), '…die harmlose Frage bleibt stehen');
    ok(!qViews.has('a') && qViews.has('b'), '…und die Buchführung stimmt danach');
  }

  /* ═══ 6. Die Verdrahtung in der Seite ═══
     Der Block allein nützt nichts, wenn ihn niemand ruft. */
  {
    const d = quelle.indexOf('async function dispatch(');
    ok(d > 0, 'dispatch() ist auffindbar');
    const kopf = quelle.slice(d, d + 1200);
    ok(/if \(istGesperrt\(ev\)\) return;/.test(kopf),
      'der Sperr-Filter sitzt in dispatch()');
    /* Vor dem Entschlüsseln — sonst hätte die App den Inhalt schon in der Hand.
       ERST DIE EXISTENZ, DANN DIE REIHENFOLGE: `indexOf` gibt −1 zurück, wenn
       es nichts findet, und −1 ist kleiner als alles. Ein reiner Vergleich
       „a < b" wäre also auch dann wahr, wenn b gar nicht dasteht — die Prüfung
       gäbe recht, ohne etwas gemessen zu haben. Genau daran ist sie beim
       ersten Lauf hängengeblieben, weil das Fenster zu kurz war. */
    const iSperr = kopf.indexOf('istGesperrt(ev)');
    const iEnt = kopf.indexOf('isEnc(ev.content)');
    ok(iSperr >= 0 && iEnt >= 0, 'beide Stellen liegen im geprüften Ausschnitt');
    ok(iSperr >= 0 && iEnt >= 0 && iSperr < iEnt,
      '…und der Filter steht VOR dem Entschlüsseln, nicht danach');
    ok(/ladeSperrliste\(\)\s*\.then/.test(quelle),
      'die Liste wird beim Start wirklich geholt');
    ok(/wischeGesperrte\(\)/.test(quelle.slice(quelle.indexOf('---- Start ----'))),
      '…und danach wird nachgewischt');
    ok(/answers: \[\], li \}/.test(quelle),
      'die Ansicht merkt sich ihr Listen-Element (sonst kann nichts entfernt werden)');
  }

  /* ═══ 7. Dasselbe Brett wie Kimboard — der Grund für das Ganze ═══ */
  {
    ok(/const TAG = 'sbkim-frage-antwort-test'/.test(quelle),
      'die Pinnwand hängt am selben Brett-Tag wie Kimboard');
    ok(/Kimboard\/sbkim\/sperrliste\.json/.test(quelle),
      '…und liest DIESELBE Liste (ein Ort der Wahrheit, nicht zwei)');
  }
} catch (e) {
  fail++; console.error(e);
}

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail ? 1 : 0);
