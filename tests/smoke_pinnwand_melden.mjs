#!/usr/bin/env node
/*
 * Smoke — Melde-Weg in der Pinnwand (`pinnwand/index.html`), Art. 16 DSA.
 *
 * WOZU: Bis zum 2026-08-19 gab es an der Pinnwand gegen FREMDE Inhalte gar
 * nichts. Das ✕ blendet nur beim Melder aus, und das Zurückziehen (NIP-09) kann
 * nur der Verfasser für seinen eigenen Zettel. Dabei ist es DASSELBE Brett wie
 * Kimboard, wo der Knopf seit dem 2026-08-17 hängt — dieselbe Wand, zwei
 * Regeln, und dieselbe Melde- und Abhilfepflicht für den Betreiber.
 *
 * WAS HIER GEMESSEN WIRD — und wie:
 * Der Melde-Block liegt inline in `index.html`, nicht als eigene Datei. Diese
 * Probe SCHNEIDET IHN HERAUS und lässt ihn wirklich laufen. Sie prüft damit den
 * Code, der ausgeliefert wird — nicht eine Nachbildung davon.
 *
 *   1. DER BOT-RIEGEL WIRD WIRKLICH ABGEWARTET, und die gemeldete Ausfüllzeit
 *      ist die ECHTE. Genau hier lag in Kimboard der teuerste Fehler: dort
 *      stand `Math.max(1700, …)`, was dem Dienst 1700 ms meldete, auch wenn nur
 *      200 vergangen waren — der Riegel des Dienstes wäre von unserer Seite
 *      ausgehebelt gewesen. Beides wird gemessen, nicht geglaubt.
 *   2. DER INHALT WIRD NICHT MITGESCHICKT. Nur Kennungen. Ihn mitzusenden
 *      hieße, ihn ein weiteres Mal zu verbreiten.
 *   3. GEMELDET HEISST GEMELDET — und nur dann. Antwortet der Dienst mit einem
 *      Fehler, sagt die App das, statt einen Haken zu zeigen.
 *   4. FAIL-SOFT: ohne Dienst der Mail-Vordruck, ohne beides eine ehrliche
 *      Absage statt eines toten Knopfes.
 *   5. AUSGEBLENDET BLEIBT AUSGEBLENDET — auch bei einer ANTWORT. Ohne die
 *      `hidden`-Prüfung in `renderAnswer` wäre der Haken „bei mir gleich
 *      ausblenden" eine Behauptung: weg bis zum nächsten Laden.
 *   6. DIE VERDRAHTUNG STIMMT: das Fähnchen hängt an Frage UND Antwort.
 *
 * Aufruf: node tests/smoke_pinnwand_melden.mjs   ·   Exit 0 = grün.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HIER = dirname(fileURLToPath(import.meta.url));
const SEITE = resolve(HIER, '..', 'pinnwand', 'index.html');
const quelle = readFileSync(SEITE, 'utf8');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('  FAIL ' + m); } };

console.log('== Pinnwand · Melde-Weg (Art. 16 DSA) ==');

/* ─── Den echten Block herausschneiden ─────────────────────────────────────
   Nicht nachbauen: was hier läuft, ist Zeile für Zeile das, was im Browser
   läuft. Findet der Schnitt seine Marken nicht, ist das ein Fehler und keine
   Kleinigkeit — dann misst die Probe nichts und darf nicht grün werden. */
const START = '// ---- Melde-Weg (Art. 16 DSA) ---';
const ENDE = '// ---- Bedeutungs-Sortierung';
const i = quelle.indexOf(START), j = quelle.indexOf(ENDE);
ok(i > 0 && j > i, 'der Melde-Block ist in index.html auffindbar');
if (i < 0 || j <= i) {
  console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
  process.exit(1);
}
const block = quelle.slice(i, j);

/* Der Block braucht `document`, `fetch`, `qViews`, `hidden`, `saveHidden`,
   `hideQuestion`, `toast`, `navigator` aus seiner Umgebung — die reichen wir
   hinein. Alles andere ist sein eigener Code. Die Konstanten oben lassen sich
   überschreiben, damit auch die Fälle „kein Dienst" und „gar nichts" messbar
   sind, ohne die ausgelieferte Datei anzufassen. */
function baue(umgebung) {
  const u = umgebung || {};
  const roh = block
    .replace(/const MELDE_ENDPUNKT = '[^']*';/, 'const MELDE_ENDPUNKT = __ENDPUNKT;')
    .replace(/const MELDE_MAIL = '[^']*';/, 'const MELDE_MAIL = __MAIL;');
  ok(roh !== block, 'die beiden Adressen sind als eigene Konstanten austauschbar');
  const f = new Function(
    'document', 'fetch', 'qViews', 'hidden', 'saveHidden', 'hideQuestion', 'toast',
    'navigator', '__ENDPUNKT', '__MAIL',
    roh + '\nreturn { sendeMeldung, openMeldeDialog, meldeKnopf, meldeAusblenden, meldeKonfig, MELDE_GRUENDE };');
  return f(
    u.document || minidom(), u.fetch || (() => { throw new Error('kein Netz'); }),
    u.qViews || new Map(), u.hidden || new Set(), u.saveHidden || (() => {}),
    u.hideQuestion || (() => {}), u.toast || (() => {}), u.navigator || {},
    'endpunkt' in u ? u.endpunkt : 'https://dienst.test/einreichung.php',
    'mail' in u ? u.mail : 'melde@test.example');
}

/* Ein Miniatur-DOM. Nur so viel, wie der Block wirklich anfasst — mehr wäre
   eine Nachbildung, die irgendwann etwas anderes misst als der Browser. */
function minidom() {
  const mach = (tag) => {
    const el = {
      tagName: String(tag).toUpperCase(), children: [], style: { cssText: '' },
      dataset: {}, _text: '', className: '', attrs: {}, _ev: {},
      appendChild(c) { this.children.push(c); return c; },
      append(...xs) { for (const x of xs) this.children.push(x); },
      after() { /* im Test ohne Elternteil */ },
      addEventListener(n, h) { this._ev[n] = h; },
      setAttribute(n, v) { this.attrs[n] = v; },
      querySelector() { return null; },
      get textContent() { return this._text; },
      set textContent(v) { this._text = String(v); this.children.length = 0; }
    };
    return el;
  };
  const body = mach('body');
  return { createElement: mach, body,
    querySelector: () => null,
    addEventListener: () => {} };
}

/* ─── 1. Der Bot-Riegel: wirklich warten, ehrlich melden ──────────────────── */
{
  let gesehen = null;
  const api = baue({ fetch: async (url, o) => { gesehen = { url, body: JSON.parse(o.body) };
    return { ok: true, status: 200, json: async () => ({ ok: true }) }; } });

  const start = Date.now();
  const ev = { id: 'a'.repeat(64), pubkey: 'b'.repeat(64), content: 'GEHEIMER TEXT' };
  const erg = await api.sendeMeldung(ev, 'hass', 'bitte ansehen', Date.now());
  const gebraucht = Date.now() - start;

  ok(erg.weg === 'dienst', 'eine angenommene Meldung meldet den Dienst-Weg');
  ok(gebraucht >= 1650, `der 1,5-s-Riegel des Dienstes wird abgewartet (${gebraucht} ms)`);
  ok(gesehen && gesehen.body.fp_elapsed >= 1650,
    'die gemeldete Ausfüllzeit ist die ECHTE, keine behauptete');
  ok(gesehen && Math.abs(gesehen.body.fp_elapsed - gebraucht) < 400,
    '…und sie passt zur wirklich vergangenen Zeit');

  /* Und ein Wächter über den QUELLTEXT, weil das Messen hier an eine Grenze
     stößt: SOLANGE DIE WARTEZEIT DASTEHT, ändert ein `Math.max(1700, …)` gar
     nichts — beim Absenden sind dann ohnehin 1700 ms vergangen, echte und
     behauptete Zahl sind gleich, und kein Messaufbau kann sie unterscheiden.
     Gefährlich wird es in KOMBINATION: nimmt später jemand die Wartezeit
     heraus, meldet die App eine Zahl, die sie nie gemessen hat — und die
     Prüfung oben bliebe grün, weil die Zahl ja stimmt. Genau so ist es in
     Kimboard passiert. Was man nicht messen kann, schreibt man fest. */
  ok(/fp_elapsed: Date\.now\(\) - offenSeit/.test(block),
    'die Ausfüllzeit ist die SCHLICHTE Differenz — kein Math.max, keine Untergrenze');
  ok(!/fp_elapsed:[^,\n]*Math\.(max|min)/.test(block),
    '…damit ein späterer Ausbau der Wartezeit nicht still zu einer Lüge wird');
  ok(gesehen && gesehen.body.zweck === 'meldung', 'der Dienst bekommt zweck=meldung');
  ok(gesehen && gesehen.body.eintrag_id === ev.id, '…und die Kennung des Zettels');
  ok(gesehen && String(gesehen.body.nachricht).includes(ev.pubkey),
    '…und die Kennung des Absenders');
  ok(gesehen && gesehen.body.grund === 'hass' && /Hassrede/.test(gesehen.body.grund_text),
    '…und den gewählten Grund im Klartext');

  /* Der beanstandete Text darf NIRGENDS im Paket stehen. */
  ok(!JSON.stringify(gesehen.body).includes('GEHEIMER TEXT'),
    'DER BEANSTANDETE INHALT WIRD NICHT MITGESCHICKT');
  ok(String(gesehen.body.nachricht).includes('bitte ansehen'),
    'der Freitext des Melders aber schon');
}

/* ─── 2. Wer schon lange offen hat, wartet nicht noch einmal ─────────────── */
{
  const api = baue({ fetch: async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }) });
  const start = Date.now();
  await api.sendeMeldung({ id: 'c'.repeat(64), pubkey: 'd'.repeat(64) }, 'spam', '', Date.now() - 9000);
  ok(Date.now() - start < 400, 'ein lange offenes Fenster wird nicht künstlich aufgehalten');
}

/* ─── 3. Nicht durchgekommen heißt nicht durchgekommen ────────────────────── */
{
  const abgelehnt = baue({ fetch: async () => ({ ok: false, status: 429, json: async () => ({ error: 'zu schnell' }) }) });
  const e1 = await abgelehnt.sendeMeldung({ id: 'e'.repeat(64), pubkey: 'f'.repeat(64) }, 'spam', '', Date.now() - 9000);
  ok(e1.weg === 'fehler', 'eine abgelehnte Meldung wird NICHT als Erfolg verkauft');
  ok(e1.grund === 'zu schnell', '…und der Grund des Dienstes wird durchgereicht');

  /* Der Fall, den Kimboard teuer bezahlt hat: HTTP 200 mit ok:false. Der Dienst
     antwortet freundlich, angekommen ist trotzdem nichts. */
  const freundlich = baue({ fetch: async () => ({ ok: true, status: 200, json: async () => ({ ok: false, error: 'bot' }) }) });
  const e2 = await freundlich.sendeMeldung({ id: '0'.repeat(64), pubkey: '1'.repeat(64) }, 'hass', '', Date.now() - 9000);
  ok(e2.weg === 'fehler', 'ein freundliches „200" mit ok:false gilt NICHT als gemeldet');

  const kaputt = baue({ fetch: async () => { throw new Error('kein Netz'); } });
  const e3 = await kaputt.sendeMeldung({ id: '2'.repeat(64), pubkey: '3'.repeat(64) }, 'hass', '', Date.now() - 9000);
  ok(e3.weg === 'fehler' && /kein Netz/.test(e3.grund), 'ein Netzfehler wird gemeldet, nicht verschluckt');
}

/* ─── 4. Fail-soft: ohne Dienst, ohne alles ──────────────────────────────── */
{
  const nurMail = baue({ endpunkt: '' });
  const m = await nurMail.sendeMeldung({ id: '4'.repeat(64), pubkey: '5'.repeat(64) }, 'jugend', 'Kinder', Date.now());
  ok(m.weg === 'mail', 'ohne Dienst gibt es einen Mail-Vordruck');
  ok(m.mailto.startsWith('mailto:melde@test.example'), '…an die hinterlegte Adresse');
  ok(m.mailto.includes(encodeURIComponent('4'.repeat(64))), '…mit der Kennung des Zettels darin');
  ok(m.mailto.includes(encodeURIComponent('Kinder')), '…und dem Freitext');
  ok(m.mailto.includes(encodeURIComponent('5'.repeat(64))), '…und der Kennung des Absenders');

  const garnichts = baue({ endpunkt: '', mail: '' });
  const g = await garnichts.sendeMeldung({ id: '6'.repeat(64), pubkey: '7'.repeat(64) }, 'sonst', '', Date.now());
  ok(g.weg === 'keiner', 'ohne beides sagt es ehrlich „keiner" statt still zu senden');
  ok(!('mailto' in g), '…und tut auch nicht so, als gäbe es einen Weg');

  /* Ein Forker, der beides leert, darf keinen toten Knopf bekommen: das
     Ausblenden muss weiterhin gehen. */
  const gemerkt = new Set();
  const leer = baue({ endpunkt: '', mail: '', hidden: gemerkt });
  leer.meldeAusblenden({ id: '8'.repeat(64) });
  ok(gemerkt.has('8'.repeat(64)), 'auch ohne Melde-Weg blendet es lokal aus');
}

/* ─── 5. Ausgeblendet bleibt ausgeblendet — Frage UND Antwort ─────────────── */
{
  /* Frage: geht über `hideQuestion`, damit auch die Anzeige aufräumt. */
  let gerufen = null;
  const qid = '9'.repeat(64);
  const views = new Map([[qid, { li: { marke: 'frage-li' }, answers: [], answerIds: new Set() }]]);
  const api = baue({ qViews: views, hideQuestion: (id, li) => { gerufen = { id, li }; } });
  api.meldeAusblenden({ id: qid });
  ok(gerufen && gerufen.id === qid, 'eine gemeldete FRAGE geht über hideQuestion');
  ok(gerufen && gerufen.li && gerufen.li.marke === 'frage-li', '…mitsamt ihrer Zeile');

  /* Antwort: kommt in dieselbe `hidden`-Liste und verschwindet aus der Ansicht. */
  const aid = 'ab'.repeat(32);
  const eltern = { children: ['x'], removeChild() { this.entfernt = true; } };
  const eintrag = { ev: { id: aid }, li: { parentNode: eltern } };
  const view2 = { li: {}, answers: [eintrag], answerIds: new Set([aid]) };
  const merker = new Set();
  let gespeichert = false;
  const api2 = baue({ qViews: new Map([[qid, view2]]), hidden: merker,
    saveHidden: () => { gespeichert = true; },
    hideQuestion: () => { throw new Error('eine Antwort ist keine Frage'); } });
  api2.meldeAusblenden({ id: aid });
  ok(merker.has(aid), 'eine gemeldete ANTWORT landet in der hidden-Liste');
  ok(gespeichert, '…und wird dauerhaft gemerkt (überlebt das Neuladen)');
  ok(view2.answers.length === 0, '…verschwindet aus der Antwort-Liste');
  ok(!view2.answerIds.has(aid), '…auch aus den bekannten Kennungen');
  ok(eltern.entfernt === true, '…und aus der Anzeige');
}

/* ─── 6. Die Verdrahtung in der Seite ────────────────────────────────────── */
{
  ok(/card\.appendChild\(meldeKnopf\(ev, 'q-melden'\)\)/.test(quelle),
    'das Fähnchen hängt an der Frage-Karte');
  ok(/head\.appendChild\(meldeKnopf\(ev, 'a-melden'\)\)/.test(quelle),
    'das Fähnchen hängt auch an jeder Antwort');

  /* Ohne diese Zeile käme eine gemeldete Antwort beim nächsten Laden zurück —
     der Haken im Melde-Fenster wäre dann eine Behauptung. Geprüft wird die
     Stelle IN renderAnswer, nicht irgendein Vorkommen im ganzen Dokument. */
  const ra = quelle.indexOf('function renderAnswer(');
  const rb = quelle.indexOf('\n// ---- Melde-Weg', ra);
  ok(ra > 0 && rb > ra, 'renderAnswer ist auffindbar');
  const rumpf = quelle.slice(ra, rb > ra ? rb : ra + 3000);
  ok(/if \(hidden\.has\(ev\.id\)\) return;/.test(rumpf),
    'renderAnswer überspringt ausgeblendete Antworten');
  ok(rumpf.indexOf('if (hidden.has(ev.id)) return;') < rumpf.indexOf('view.answersUl.appendChild'),
    '…und zwar BEVOR sie gezeichnet wird');

  ok(/\.q-melden \{/.test(quelle) && /\.a-melden \{/.test(quelle),
    'beide Fähnchen haben eine eigene Gestaltung');

  /* Kein zweiter Sperr-Weg: gesperrt wird in Kimboard, damit es einen Ort der
     Wahrheit gibt. Der Betreiber-Bereich reicht nur Kennungen heraus. */
  const mb = quelle.slice(i, j);
  ok(/Gesperrt wird in Kimboard/.test(mb),
    'der Betreiber-Bereich sagt, dass in Kimboard gesperrt wird');
  ok(!/gesperrteZettel\.add|gesperrteAbsender\.add/.test(mb),
    'DER MELDE-BLOCK SPERRT NICHTS SELBST (kein zweiter Ort der Wahrheit)');

  /* Der Impressum-Verweis muss auch wirklich irgendwo hinführen. */
  ok(/const MELDE_BESCHWERDEWEG = 'impressum\.html'/.test(mb),
    'der Beschwerdeweg zeigt auf das Impressum');
  /* …und das Impressum muss es wirklich geben. Ein Verweis auf eine Seite, die
     nicht existiert, wäre schlimmer als keiner: Art. 16 Abs. 5 DSA verlangt den
     Hinweis auf Rechtsbehelfe, und ein 404 ist kein Hinweis. */
  ok(existsSync(resolve(HIER, '..', 'pinnwand', 'impressum.html')),
    '…und diese Seite liegt wirklich neben der App');
}

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail ? 1 : 0);
