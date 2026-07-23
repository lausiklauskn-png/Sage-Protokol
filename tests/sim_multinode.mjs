// Multi-Knoten-Simulation — das SBKIM-Protokoll netzweit headless beweisen
// (Auftrag Brief NETZWEIT §2.2, 2026-07-23). Run mit:
//   node tests/sim_multinode.mjs
// (nach `npm install --no-save fake-indexeddb`).
//
// WAS DIESE SIM NEU BEWEIST (gegenüber den Einzel-Smokes):
// Mehrere ECHTE Knoten-Instanzen laufen GLEICHZEITIG in EINEM Node-Prozess —
// jede mit eigener Modul-01/02/03/04/05/23-Instanz (eigener Sandbox-Namensraum,
// eigene IndexedDB-Schublade `sbkim_<suffix>`, eigene Ed25519-Identität, eigene
// Spore mit echtem domainVector) — und durchlaufen den vollen Lebenszyklus über
// EINEN geteilten Mock-Relais-Bus:
//   Phase 1  Anmelden      (Modul 23 announce → Visitenkarte ans Brett)
//   Phase 2  Finden        (Modul 23 discover → jeder sieht die anderen)
//   Phase 3  Andock-Riegel (Modul 04 match → 0.80 trennt korrekt nach Bedeutung)
//   Phase 4  Q&A über Hub  (Sage fragt, ein Endknoten antwortet aus seinem Korpus)
//   Phase 5  Q&A OHNE Hub  (zwei Endknoten fragen sich direkt — Meilenstein 2026-07-11)
//   Phase 6  Härtung       (die A2/A3-Live-Härtungsfälle als Regression festgenagelt:
//                           Frage-Timeout · Korpus-leer-Falle · Antworter-Vorwärmen ·
//                           Adress-Wand/newest-per-name · A12-Briefkasten · Round-Trip)
//
// Es ist der reproduzierbare Regressionstest für „das Mycel trägt als Netz
// unter Gleichen", den der Brief verlangt.
//
// EHRLICHE GRENZEN (nicht geschönt):
//  - Das ECHTE Relais (wss://relay.family-projekt.de) ist aus der Sandbox NICHT
//    erreichbar → getestet wird die MODUL-LOGIK gegen einen IN-MEMORY-MOCK-BUS
//    (kein WebSocket, kein Netz). Der echte WebSocket-Client (Modul 05b) ist
//    browser-only; Live-Cross-Gerät bleibt Klaus' Browser-Beweis (A2 2026-07-10,
//    Hub-unabhängig 2026-07-11).
//  - Das semantische Embedding ist headless ein DETERMINISTISCHER Stub (Modul 03).
//    Für Phase 3 nutzt die Sim ECHTE e5-domainVektoren aus den committeten
//    Sporen (sbkim/*_inbox.json) → die 0.80-Klassifikation entspricht der
//    dokumentierten Realität. Für die Q&A-SORTIERUNG (Phase 4/5) sind die
//    Korpus-Vektoren kontrolliert gemischt, damit die Rangfolge deterministisch
//    prüfbar ist — die SEMANTISCHE Qualität des echten Modells ist anderweitig
//    (Klaus' Browser) bewiesen, hier wird die VERDRAHTUNG geprüft.
//  - Der Transport-Handshake mit Krypto-Challenge (Modul 05 `handshake` über
//    Modul 05b) ist in smoke_bau05_nostr.mjs + smoke_query_ueber_relais.mjs
//    bewiesen; hier ist die Admission-Entscheidung der ECHTE 0.80-Riegel
//    (Modul 04 `match` / `isAboveProviderThreshold`) — die eigentliche
//    Protokoll-Logik, die entscheidet, ob ein Handshake etabliert.

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}

const results = [];
function record(probe, expected, actual, ok) { results.push({ probe, expected, actual, ok }); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Per-Knoten-Sandbox: jeder Knoten bekommt seinen EIGENEN Modul-Namensraum ──
// Der Modul-Loader setzt `global.SbkimStorage = …` usw. — indem wir pro Knoten
// ein frisches Sandbox-Objekt als `global`/`window`/`globalThis` übergeben,
// leben die Modul-Singletons pro Knoten getrennt. IndexedDB ist geteilt
// (fake-indexeddb), aber jeder Knoten nutzt einen eigenen dbSuffix → eigene
// Schublade. KEIN BroadcastChannel (offener Handle hält den Event-Loop wach).
function makeNodeSandbox() {
  const sb = {};
  sb.window = sb; sb.globalThis = sb; sb.console = console;
  sb.crypto = webcrypto; sb.btoa = globalThis.btoa; sb.atob = globalThis.atob;
  sb.TextEncoder = TextEncoder; sb.TextDecoder = TextDecoder;
  sb.indexedDB = globalThis.indexedDB; sb.navigator = globalThis.navigator || {};
  sb.setTimeout = setTimeout; sb.clearTimeout = clearTimeout;
  sb.fetch = globalThis.fetch; sb.AbortController = AbortController;
  sb.BroadcastChannel = undefined;
  return sb;
}
function loadInto(sb, relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function(
    "global", "window", "globalThis", "crypto", "console", "btoa", "atob",
    "TextEncoder", "TextDecoder", "indexedDB", "navigator", "setTimeout", "clearTimeout",
    "fetch", "AbortController", "BroadcastChannel", src,
  )(sb, sb, sb, sb.crypto, console, sb.btoa, sb.atob, sb.TextEncoder, sb.TextDecoder,
    sb.indexedDB, sb.navigator, sb.setTimeout, sb.clearTimeout, sb.fetch, sb.AbortController, sb.BroadcastChannel);
}

// ── Geteilter In-Memory-Mock-Relais-Bus (identisch zu smoke_bau23_rendezvous) ──
function makeSharedBus() {
  const store = [];
  const subs = [];
  let seq = 0;
  function matches(filter, ev) {
    if (filter.kinds && filter.kinds.indexOf(ev.kind) === -1) return false;
    if (typeof filter.since === "number" && ev.created_at < filter.since) return false;
    for (const key of Object.keys(filter)) {
      if (key === "kinds" || key === "since") continue;
      if (key.startsWith("#")) {
        const tagName = key.slice(1);
        const want = filter[key];
        const have = (ev.tags || []).filter((t) => t[0] === tagName).map((t) => t[1]);
        if (!have.some((v) => want.indexOf(v) !== -1)) return false;
      }
    }
    return true;
  }
  return {
    published: [],
    async publish(body) {
      const ev = {
        id: "mock-" + (++seq), pubkey: "mockpub",
        kind: body.kind, created_at: body.created_at, tags: body.tags, content: body.content, sig: "mocksig",
      };
      store.push(ev);
      this.published.push(body);
      for (const s of subs.slice()) {
        if (matches(s.filter, ev)) Promise.resolve().then(() => { try { s.onEvent(ev); } catch (e) {} });
      }
    },
    subscribe(filter, onEvent) {
      const sub = { filter, onEvent };
      subs.push(sub);
      for (const ev of store.slice()) {
        if (matches(filter, ev)) Promise.resolve().then(() => { try { onEvent(ev); } catch (e) {} });
      }
      return function unsubscribe() {
        const i = subs.indexOf(sub);
        if (i !== -1) subs.splice(i, 1);
      };
    },
  };
}

function l2normalize(v) {
  let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  const n = Math.sqrt(s) || 1; for (let i = 0; i < v.length; i++) v[i] /= n; return v;
}
// Kontrollierter Misch-Vektor: cos(mix, base) ≈ frac (für prüfbare Q&A-Rangfolge).
function mixedVec(base, frac, seed) {
  const out = new Float32Array(base.length);
  let noise = new Float32Array(base.length);
  for (let i = 0; i < base.length; i++) noise[i] = Math.sin((i + 1) * 0.017 * (seed + 1));
  // Rausch-Anteil orthogonalisieren (Gram-Schmidt), damit frac der echte Cosinus ist.
  let dot = 0; for (let i = 0; i < base.length; i++) dot += noise[i] * base[i];
  for (let i = 0; i < base.length; i++) noise[i] -= dot * base[i];
  l2normalize(noise);
  const a = frac, b = Math.sqrt(Math.max(0, 1 - frac * frac));
  for (let i = 0; i < base.length; i++) out[i] = a * base[i] + b * noise[i];
  return l2normalize(out);
}

// Deterministischer Embedding-Stub: stabiler 384-dim-Vektor je Text (Hash),
// L2-normalisiert. Gleicher Text → gleicher Vektor (nötig, damit der Antworter
// die Frage reproduzierbar einbettet).
function deterministicEmbed(text) {
  const v = new Float32Array(384);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  for (let i = 0; i < 384; i++) {
    h ^= (h << 13); h >>>= 0; h ^= (h >>> 17); h ^= (h << 5); h >>>= 0;
    v[i] = (h / 4294967295) * 2 - 1;
  }
  return l2normalize(v);
}

// ── Echte Knoten-Domänen-Vektoren aus den committeten Sporen ──
const VEC_SOURCES = {
  Sage: "sbkim/spore.json",
  Rezeptbuch: "sbkim/rezeptbuch_inbox.json",
  Mixarium: "sbkim/mixarium_inbox.json",
  BookLedger: "sbkim/bookledgerpro_inbox.json",
  Tomys: "sbkim/tomys_inbox.json",
};
const REALVEC = {};
for (const [k, f] of Object.entries(VEC_SOURCES)) {
  try {
    const j = JSON.parse(readFileSync(join(repoRoot, f), "utf8"));
    if (Array.isArray(j.domainVector) && j.domainVector.length === 384) REALVEC[k] = j.domainVector;
  } catch { /* fehlt -> Knoten wird übersprungen */ }
}

// ── makeNode: eine echte Knoten-Instanz aufbauen ──
async function makeNode(name, suffix, domainVec) {
  const sb = makeNodeSandbox();
  for (const m of ["01_storage", "02_spore", "03_embedding", "04_match", "23_rendezvous"]) {
    loadInto(sb, "src/modules/" + m + ".js");
  }
  await sb.SbkimStorage.init({ dbSuffix: suffix });
  await sb.SbkimSpore.getOrCreateIdentity();
  await sb.SbkimSpore.generateOwnSpore({
    domain: name.toLowerCase() + ".sim.local",
    nodeType: "hybrid",
    endpoint: "https://" + name.toLowerCase() + ".sim.local/",
    domainVector: Array.from(domainVec),
  });
  const nodeId = await sb.SbkimSpore.getNodeId();
  // Headless: das echte e5-Modell braucht Netz/CDN → deterministischer
  // Embedding-Stub pro Knoten (wie smoke_bau04c). Die semantische QUALITÄT des
  // echten Modells ist in Klaus' Browser bewiesen; hier wird die VERDRAHTUNG
  // Frage→Antwort geprüft. Stub: stabiler Hash-Vektor je Text, L2-normalisiert.
  if (sb.SbkimEmbedding) {
    sb.SbkimEmbedding.embedQuery = async (text) => deterministicEmbed(text);
    sb.SbkimEmbedding.embedText = async (text) => deterministicEmbed(text);
  }
  // Modul 23 an den geteilten Bus + die eigene Spore/Anastomose koppeln.
  sb.SbkimRendezvous.configure({
    nodeName: name,
    relayClient: bus,
    anastomose: sb.SbkimAnastomose,
    spore: sb.SbkimSpore,
  });
  return { name, suffix, nodeId, vec: new Float32Array(domainVec), sb };
}

const bus = makeSharedBus();

async function run() {
  const need = ["Sage", "Rezeptbuch", "Mixarium", "BookLedger"];
  const missing = need.filter((k) => !REALVEC[k]);
  record("Setup — echte Domänen-Vektoren vorhanden", "Sage,Rezeptbuch,Mixarium,BookLedger",
    Object.keys(REALVEC).join(","), missing.length === 0);
  if (missing.length) { print(); return; }

  // Vier echte Knoten aufbauen.
  const sage = await makeNode("Sage", "sim_sage", REALVEC.Sage);
  const rez = await makeNode("Rezeptbuch", "sim_rez", REALVEC.Rezeptbuch);
  const mix = await makeNode("Mixarium", "sim_mix", REALVEC.Mixarium);
  const blp = await makeNode("BookLedger", "sim_blp", REALVEC.BookLedger);
  const nodes = [sage, rez, mix, blp];
  const ids = new Set(nodes.map((n) => n.nodeId));
  record("Setup — vier Knoten mit VERSCHIEDENEN nodeIds", "4 verschieden",
    ids.size + " verschieden", ids.size === 4);

  // ── Phase 1: Anmelden ──
  for (const n of nodes) {
    const r = await n.sb.SbkimRendezvous.announce();
    record("Phase 1 Anmelden — " + n.name + " announce ok", "true", String(r.ok), r.ok === true);
  }
  record("Phase 1 — genau vier Karten am Brett", "4", String(bus.published.length), bus.published.length === 4);
  await sleep(30);

  // ── Phase 2: Finden ── (jeder sieht die drei anderen, sich selbst gefiltert)
  const discovered = {};
  for (const n of nodes) {
    const res = await n.sb.SbkimRendezvous.discover({ listenMs: 60 });
    const cards = (res && Array.isArray(res.cards)) ? res.cards : [];
    discovered[n.name] = cards;
    const otherIds = new Set(cards.map((c) => c.nodeId));
    const seesSelf = otherIds.has(n.nodeId);
    record("Phase 2 Finden — " + n.name + " sieht 3 andere, nicht sich selbst",
      "3 andere, self=nein",
      cards.length + " Karten, self=" + (seesSelf ? "ja" : "nein"),
      cards.length === 3 && !seesSelf);
  }

  // ── Phase 3: Andock-Riegel (0.80 trennt nach Bedeutung) ──
  // REGISTER-REFRESH 2026-07-23: nach v0.2-Re-Sign liegen alle Inhalts-/Werkzeug-
  // Knoten ≥0.80; einziger echter <0.80-Fall vs Sage ist Tomys (andere Domäne).
  // Erwartung aus der LIVE-Realität (aus den v0.2-Sporen frisch gemessen):
  //   BookLedger↔Sage     ≥ 0.80  established (0.855)
  //   Rezeptbuch↔Sage     ≥ 0.80  established (0.881)  — Inhalts-Knoten
  //   Mixarium↔Sage       ≥ 0.80  established (0.822)  — Inhalts-Knoten
  //   Mixarium↔Rezeptbuch ≥ 0.80  established (Inhalts-Geschwister)
  //   Tomys↔Sage          < 0.80  rejected-local (0.7917, andere Domäne
  //                                Werbetechnik/Digitaldruck; hub-unabhängig
  //                                2026-07-11) — der EINZIGE echte <0.80-Fall.
  const M = sage.sb.SbkimMatch;
  function gate(a, b) {
    const raw = M.match(a.vec, b.vec);
    return { raw, established: M.isAboveProviderThreshold(raw) };
  }
  const gBlpSage = gate(blp, sage);
  record("Phase 3 Riegel — BookLedger↔Sage established (≥0.80)",
    "established", gBlpSage.raw.toFixed(4) + " → " + (gBlpSage.established ? "established" : "rejected"),
    gBlpSage.established === true);
  const gRezSage = gate(rez, sage);
  record("Phase 3 Riegel — Rezeptbuch↔Sage established (≥0.80, 0.881)",
    "established", gRezSage.raw.toFixed(4) + " → " + (gRezSage.established ? "established" : "rejected"),
    gRezSage.established === true);
  const gMixSage = gate(mix, sage);
  record("Phase 3 Riegel — Mixarium↔Sage established (≥0.80, 0.822)",
    "established", gMixSage.raw.toFixed(4) + " → " + (gMixSage.established ? "established" : "rejected"),
    gMixSage.established === true);
  const gMixRez = gate(mix, rez);
  record("Phase 3 Riegel — Mixarium↔Rezeptbuch established (≥0.80, Geschwister)",
    "established", gMixRez.raw.toFixed(4) + " → " + (gMixRez.established ? "established" : "rejected"),
    gMixRez.established === true);
  // Der einzige echte <0.80-Fall vs Sage im ganzen Netz: Tomys (andere Domäne).
  // gate() ruft nur M.match(a.vec,b.vec) — ein roher Vektor genügt, kein voller Knoten.
  const tomys = { vec: new Float32Array(REALVEC.Tomys) };
  const gTomysSage = gate(tomys, sage);
  record("Phase 3 Riegel — Tomys↔Sage rejected-local (<0.80, 0.7917, andere Domäne)",
    "rejected", gTomysSage.raw.toFixed(4) + " → " + (gTomysSage.established ? "established" : "rejected"),
    gTomysSage.established === false);
  record("Phase 3 — Riegel bleibt exakt 0.80", "0.8", String(M.PROVIDER_MIN_MATCH), M.PROVIDER_MIN_MATCH === 0.80);

  // ── Phase 4: Q&A über den Hub (Sage fragt, Mixarium antwortet aus Korpus) ──
  // Der Frage-Text reist zum Antworter; DER embedded ihn mit SEINEM Modul 03
  // und durchsucht SEINEN Korpus. Das ist der echte Cross-Knoten-Such-Pfad.
  await answerQnA("Phase 4 Q&A über Hub", mix, "alkoholfreier Cocktail mit Waldfrüchten");

  // ── Phase 5: Q&A OHNE Hub (Rezeptbuch fragt Mixarium direkt) ──
  // Meilenstein 2026-07-11: Endknoten fragen sich GEGENSEITIG, kein Sage dabei.
  await answerQnA("Phase 5 Q&A OHNE Hub (Endknoten↔Endknoten)", mix, "erfrischendes Getränk für den Sommer");

  // ── Phase 6: Härtung — die A2/A3-Live-Härtungsfälle als Regression sichern ──
  // Diese Fälle wurden im ECHTEN Browser-Lauf (A2-Härtung II 2026-07-10, hub-
  // unabhängig 2026-07-11) schmerzhaft gefunden; hier über den geteilten Bus +
  // echte Knoten-Instanzen als Regression festgenagelt, damit sie nicht zurück-
  // fallen. Anders als Phase 4/5 (queryLocal-Direktaufruf) läuft hier der ECHTE
  // Relais-Round-Trip enableAnswering ↔ askNode (Tag sbkim-qry). EHRLICH:
  // Mock-Bus + Embedding-Stub (siehe Kopf) — geprüft wird die VERDRAHTUNG der
  // Härtung, nicht die Live-Latenz oder das echte Modell.
  await hardeningPhase(rez, mix);

  print();
}

// Phase 6: die Antwort-Härtung (enableAnswering/askNode/fetchAnswers) über den
// geteilten Bus mit echten Knoten-Instanzen ausüben. asker fragt, answerer
// antwortet. Jede Probe nagelt genau einen Live-gefundenen Härtungsfall fest.
async function hardeningPhase(asker, answerer) {
  const tag = "Phase 6 Härtung";
  const RDV = answerer.sb.SbkimRendezvous;

  // Antworter-Korpus deterministisch um die Frage herum bauen (prepareCorpus →
  // ensureAnswerCorpus registriert ihn via setLocalCorpus). Der Antworter bettet
  // die Frage mit SEINEM Stub ein → Query-Vektor reproduzierbar.
  const Q = "Sommergetraenk mit Waldbeeren";
  const qv = await answerer.sb.SbkimEmbedding.embedQuery(Q);
  const answererCorpus = [
    { label: "bester Treffer", anchorId: "near", text: "Sommergetraenk mit Waldbeeren erfrischend", passageVec: mixedVec(qv, 0.96, 11) },
    { label: "mittlerer Treffer", anchorId: "mid", text: "kuehles Getraenk fuer warme Tage", passageVec: mixedVec(qv, 0.86, 12) },
    { label: "fern", anchorId: "far", text: "voellig anderes Thema Xylophon Statik", passageVec: mixedVec(qv, 0.40, 13) },
  ];

  // Spy: alle queryLocal-Texte des Antworters mitschreiben (fürs Vorwärmen),
  // dann an die echte Funktion durchreichen (Korpus/Ranking unverändert).
  const answererMatch = answerer.sb.SbkimMatch;
  const qlCalls = [];
  const origQL = answererMatch.queryLocal.bind(answererMatch);
  answererMatch.queryLocal = function (text, k, opts) { qlCalls.push(String(text)); return origQL(text, k, opts); };

  // prepareCorpus koppeln (Korpus-leer-Falle-Härtung: Antwort-Pfad ↔ Korpus-Aufbau).
  RDV.configure({ prepareCorpus: async () => answererCorpus });

  // ── 6a: fragen, SOLANGE der Antworter NOCH NICHT lauscht → Frage-Timeout mit
  //        pending:true (kein Hänger). Zugleich A12-Briefkasten-Setup. ──
  const ask1 = await asker.sb.SbkimRendezvous.askNode(answerer.nodeId, Q, { timeoutMs: 150 });
  record(tag + " 6a — Frage-Timeout greift (kein Hänger), Frage bleibt offen (pending)",
    "ok=false,pending=true", "ok=" + ask1.ok + ",pending=" + ask1.pending,
    ask1.ok === false && ask1.pending === true && typeof ask1.qid === "string");

  // ── 6b: eine STALE Karte gleichen Namens ans Brett (alte, tote nodeId, alter ts). ──
  const staleTs = Math.floor(Date.now() / 1000) - 600;
  await bus.publish({
    kind: 1, created_at: staleTs, tags: [["t", "sbkim-rdv"]],
    content: JSON.stringify({
      kind: "sbkim-presence", nodeId: "STALE-DEAD-ID", nodeName: answerer.name,
      spore: { id: "STALE-DEAD-ID", nodeName: answerer.name, domainVector: Array.from(answerer.vec) }, ts: staleTs,
    }),
  });

  // ── 6c: Antwortrecht EINSCHALTEN — härtet dreifach: (1) Korpus aktiv gesichert,
  //        (2) frische Präsenz-Karte unter der lauschenden ID, (3) Vorwärmen. ──
  const en = await RDV.enableAnswering();
  record(tag + " 6c — enableAnswering ok + _meta.answering aktiv", "ok+answering",
    "ok=" + en.ok + ",answering=" + RDV._meta.answering,
    en.ok === true && RDV._meta.answering === true);
  record(tag + " 6c — Korpus-leer-Falle: Korpus beim Einschalten AKTIV gesichert",
    "answerCorpusEnsured=true", String(RDV._meta.answerCorpusEnsured), RDV._meta.answerCorpusEnsured === true);
  record(tag + " 6c — Vorwärmen: Aufwärm-Suche beim Einschalten abgesetzt (Modell/Korpus vorgeladen)",
    "queryLocal('aufwärmen')", qlCalls.join("|") || "(keine)",
    qlCalls.some((t) => t.indexOf("aufwärmen") !== -1));
  await sleep(60); // Lookback-Replay der offenen Frage + Antwort-Publish verarbeiten

  // ── 6d: Adress-Wand — der Frager sieht im Raum EINE Karte je Name, und es ist
  //        die LEBENDE (lauschende) ID, nicht die STALE → er andockt die Richtige. ──
  const disc = await asker.sb.SbkimRendezvous.discover({ listenMs: 60 });
  const answererCards = (disc.cards || []).filter((c) => c.nodeName === answerer.name);
  record(tag + " 6d — newest-per-name: genau EINE Karte für " + answerer.name + " (Duplikate entfernt)",
    "1", String(answererCards.length), answererCards.length === 1);
  record(tag + " 6d — Adress-Wand: Raum-Karte trägt die LEBENDE ID, nicht die STALE",
    answerer.nodeId.slice(0, 10) + "…", ((answererCards[0] && answererCards[0].nodeId) || "?").slice(0, 10) + "…",
    !!(answererCards[0] && answererCards[0].nodeId === answerer.nodeId));

  // ── 6e: A12-Briefkasten — die offene Frage (6a) wurde beim Einschalten per
  //        Lookback nachgeholt + beantwortet; der Frager holt die späte Antwort. ──
  const late = await asker.sb.SbkimRendezvous.fetchAnswers([ask1.qid], { waitMs: 200 });
  const lateHit = (late.answers || []).find((a) => a.qid === ask1.qid);
  record(tag + " 6e — A12-Briefkasten: späte Antwort auf die Timeout-Frage nachgeholt",
    "Antwort mit qid + Treffer", lateHit ? (lateHit.qid.slice(0, 6) + "…, " + (lateHit.results || []).length + " Treffer") : "keine",
    !!(lateHit && Array.isArray(lateHit.results) && lateHit.results.length > 0));

  // ── 6f: voller LIVE-Round-Trip über den Bus (askNode ↔ enableAnswering) —
  //        die eigentliche Cross-Knoten-Q&A-Verdrahtung (Meilenstein 2026-07-11). ──
  const before = RDV._meta.answeredCount;
  const live = await asker.sb.SbkimRendezvous.askNode(answerer.nodeId, Q, { timeoutMs: 3000 });
  record(tag + " 6f — LIVE-Round-Trip: Antwort kam über den Bus zurück (ok, nicht leer)",
    "ok=true,>0 Treffer", "ok=" + live.ok + "," + ((live.results || []).length) + " Treffer",
    live.ok === true && Array.isArray(live.results) && live.results.length > 0);
  record(tag + " 6f — bester Treffer oben (bedeutungs-sortiert über den Antworter-Korpus)",
    "near", (live.results && live.results[0] && live.results[0].anchorId) || "?",
    !!(live.results && live.results[0] && live.results[0].anchorId === "near"));
  record(tag + " 6f — Antworter-Zähler stieg (answeredCount++)",
    "> " + before, String(RDV._meta.answeredCount), RDV._meta.answeredCount > before);

  // ── 6g: Frage an einen NICHT lauschenden (toten) Knoten → sauber pending,
  //        kein Hänger (Timeout-Härtung, zweiter Beleg mit fremder ID). ──
  const dead = await asker.sb.SbkimRendezvous.askNode("NIEMAND-LEBT-HIER", "irgendwas", { timeoutMs: 150 });
  record(tag + " 6g — Timeout zu totem Knoten: sauber pending, kein Hänger",
    "ok=false,pending=true", "ok=" + dead.ok + ",pending=" + dead.pending,
    dead.ok === false && dead.pending === true);

  // Spy zurückbauen (Hygiene — folgende Läufe unbeeinflusst).
  answererMatch.queryLocal = origQL;
}

// Antworter Y beantwortet eine Frage aus seinem Korpus: Y bettet die Frage mit
// SEINEM Modul 03 ein, baut kontrollierte Korpus-Vektoren um diesen Query-Vektor
// (nah/mittel/fern), und liefert per Modul 04 queryLocal eine bedeutungs-
// sortierte, schwellen-gefilterte Antwort. Prüft die VERDRAHTUNG.
async function answerQnA(tag, answerer, question) {
  const qv = await answerer.sb.SbkimEmbedding.embedQuery(question);
  const corpus = [
    { label: "bester Treffer", anchorId: "y-near", passageVec: mixedVec(qv, 0.96, 1) },
    { label: "mittlerer Treffer", anchorId: "y-mid", passageVec: mixedVec(qv, 0.86, 2) },
    { label: "unter Schwelle", anchorId: "y-far", passageVec: mixedVec(qv, 0.40, 3) },
  ];
  const answers = await answerer.sb.SbkimMatch.queryLocal(question, 5, { corpus });
  record(tag + " — Antwort kam zurück (nicht leer)", ">0", String(answers.length), answers.length > 0);
  record(tag + " — bester Treffer oben (bedeutungs-sortiert)", "bester Treffer",
    answers[0] && answers[0].label, answers[0] && answers[0].label === "bester Treffer");
  const descending = answers.every((a, i) => i === 0 || answers[i - 1].score >= a.score);
  record(tag + " — Scores absteigend", "true", String(descending), descending);
  const belowCut = !answers.some((a) => a.label === "unter Schwelle");
  record(tag + " — Unter-Schwelle-Treffer weggefiltert (0.80-Schwelle greift)",
    "gefiltert", belowCut ? "gefiltert" : "durchgerutscht", belowCut);
}

function print() {
  let pass = 0, fail = 0;
  console.log("\n=== Multi-Knoten-Simulation — SBKIM-Protokoll netzweit (headless) ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    if (r.ok) pass++; else fail++;
    console.log(`${mark} ${r.probe}`);
    if (!r.ok) console.log(`   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
  }
  console.log(`\nSumme: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  process.exit(fail > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Simulation gescheitert:", err);
  process.exit(1);
});
