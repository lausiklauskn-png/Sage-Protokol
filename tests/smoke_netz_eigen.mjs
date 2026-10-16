// Probe: Eigenes Netz (Schritt 1, 2026-10-13) — Modul 05b + 23.
//   node tests/smoke_netz_eigen.mjs
//
// Brief docs/BRIEF_2026-10-13_eigenes-netz.md verlangt sechs Zusicherungen:
//   A  ohne Einstellung byte-gleiches Verhalten (gegen origin/main gemessen)
//   B  mit Code eine andere Marke
//   C  zwei Codes sehen einander nicht
//   D  ohne Code kein Klartext im Ereignis
//   E  falscher Code liest nichts
//   F  ungültige Relais-Adresse (nur wss://) abgewiesen
// Dazu: ein ungültiger Code fällt NIE still ins öffentliche Netz zurück (G),
// Fragen und Antworten laufen im eigenen Netz wirklich (H), Speicher je App (I),
// 05b schließt Verbindungen, die nicht mehr in der Liste stehen (J).
//
// Byte-Gleichheit (A) wird nicht behauptet, sondern gemessen: dieselbe Folge
// (anmelden, antworten, fragen) läuft gegen die Fassung von origin/main und
// gegen diese, mit eingefrorener Uhr und eingefrorenem Zufall; die publizierten
// Ereignisse müssen Zeichen für Zeichen gleich sein. Fehlt git oder origin/main,
// sagt die Probe das (⊘) statt grün zu melden.

import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";
import { tmpdir } from "node:os";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const QUELLE_23 = readFileSync(join(WURZEL, "src/modules/23_rendezvous.js"), "utf8");

let gruen = 0, rot = 0, stumm = 0;
const sage = (ok, t, ist) => {
  ok ? gruen++ : rot++;
  console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${t}${ok || ist === undefined ? "" : `\n        ist: ${ist}`}`);
};
const kopf = (t) => console.log(`\n── ${t}`);

const CODE_1 = "K7QM-3XRA-WP9T-ZL4N-BV2H";
const CODE_2 = "H2VB-N4LZ-T9PW-AXR3-MQ7K";

// ---- gemeinsames Mock-Relais (zwei „Browser" teilen es) ----
function mockRelais() {
  const stored = [];
  const subs = [];
  let seq = 0;
  function passt(f, ev) {
    if (f.kinds && !f.kinds.includes(ev.kind)) return false;
    if (f["#t"]) {
      const tags = (ev.tags || []).filter((t) => t[0] === "t").map((t) => t[1]);
      if (!f["#t"].some((x) => tags.includes(x))) return false;
    }
    if (typeof f.since === "number" && ev.created_at < f.since) return false;
    return true;
  }
  return {
    published: [],
    stored,
    async publish(body) {
      const ev = { id: "ev" + (++seq), pubkey: "pk", kind: body.kind, created_at: body.created_at, tags: body.tags, content: body.content };
      this.published.push(body);
      stored.push(ev);
      for (const s of subs.slice()) if (passt(s.f, ev)) setTimeout(() => { try { s.cb(ev); } catch (_e) {} }, 0);
    },
    einwerfen(ev) { // fremdes Ereignis direkt ins Relais legen
      stored.push(ev);
      for (const s of subs.slice()) if (passt(s.f, ev)) setTimeout(() => { try { s.cb(ev); } catch (_e) {} }, 0);
    },
    subscribe(f, cb) {
      const s = { f, cb };
      subs.push(s);
      setTimeout(() => { for (const ev of stored.slice()) if (passt(f, ev)) { try { cb(ev); } catch (_e) {} } }, 0);
      return () => { const i = subs.indexOf(s); if (i !== -1) subs.splice(i, 1); };
    },
  };
}

// ---- eine Modul-Instanz je „Browser", optional mit eingefrorener Zeit ----
function knoten(name, quelle, opt = {}) {
  const ctx = {
    console: { info() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, JSON, Promise, Uint8Array, Object, Array, String, Number, Error,
    crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob,
    Math: opt.frieren ? Object.assign(Object.create(Math), { random: (() => { let i = 0; return () => ((i++ * 0.37) % 1); })() }) : Math,
    Date: opt.frieren ? (class extends Date { constructor(...a) { a.length ? super(...a) : super(opt.frieren); } static now() { return opt.frieren; } }) : Date,
    localStorage: opt.store || undefined,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(quelle, ctx, { filename: name + "/23_rendezvous.js" });
  return ctx.SbkimRendezvous;
}
const spore = (id) => ({ async getOwnSpore() { return id ? { id, domain: id + ".example", domainVector: null } : null; } });
const treffer = { relatedness() { return 0; }, async queryLocal(t, k) { return [{ label: "Eierschecke", score: 0.9, anchorId: "r7" }].slice(0, k); } };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

// Dieselbe Folge in jedem Netz: B lauscht, A meldet sich an, A fragt B.
async function folge(A, B, relais) {
  await B.enableAnswering();
  await A.announce();
  const antwort = await A.askNode("node-B", "Kuchen mit Pudding", { timeoutMs: 1500 });
  await warte(30);
  return antwort;
}

async function main() {
  // ── A · ohne Einstellung byte-gleich ──────────────────────────────────────
  kopf("A · ohne Einstellung: dieselben Ereignisse wie die Fassung VOR dem eigenen Netz");
  // Verglichen wird mit einer FESTEN Fassung (der letzten ohne Netz-Block,
  // 5f50263), nicht mit origin/main: nach dem Merge trüge origin/main die neue
  // Fassung, und der Vergleich mäße die Datei gegen sich selbst — grün, ohne
  // etwas zu messen. Ein Selbst-Riegel besteht darauf, dass die Vergleichs-
  // Fassung den Netz-Block wirklich NICHT trägt.
  const VOR_NETZ = "5f5026360a52a7f1aa9ca7555d698d4c6ecb21dc";
  let alt = null;
  // NETZ_ALT: Pfad zur alten Fassung — für die Gegenprobe, deren Kopie kein git hat.
  if (process.env.NETZ_ALT) { try { alt = readFileSync(process.env.NETZ_ALT, "utf8"); } catch (_e) { alt = null; } }
  else try {
    alt = execFileSync("git", ["-C", WURZEL, "show", VOR_NETZ + ":src/modules/23_rendezvous.js"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch (_e) { alt = null; }
  if (!alt) {
    stumm++;
    console.log("  ⊘ nicht messbar — " + VOR_NETZ.slice(0, 7) + ":src/modules/23_rendezvous.js nicht lesbar (kein git oder zu flacher Klon?)");
  } else if (/setNetwork|netAbleiten/.test(alt)) {
    sage(false, "die Vergleichs-Fassung trägt den Netz-Block NICHT (sonst misst A die Datei gegen sich selbst)");
  } else {
    const T = Date.UTC(2026, 9, 13, 12, 0, 0);
    const lauf = async (quelle) => {
      const r = mockRelais();
      const A = knoten("A", quelle, { frieren: T });
      const B = knoten("B", quelle, { frieren: T });
      await A.init({ nodeName: "Knoten A", relayClient: r, spore: spore("node-A"), listenMs: 40 });
      await B.init({ nodeName: "Knoten B", relayClient: r, spore: spore("node-B"), match: treffer, listenMs: 40 });
      const ant = await folge(A, B, r);
      const karten = await A.discover({ listenMs: 40 });
      return { ereignisse: JSON.stringify(r.published), ant: JSON.stringify(ant), karten: JSON.stringify(karten), meta: [A._meta.tag, A._meta.queryTag] };
    };
    const vorher = await lauf(alt);
    const nachher = await lauf(QUELLE_23);
    sage(vorher.ereignisse.length > 200, "Selbst-Riegel: der Vergleichslauf hat überhaupt Ereignisse erzeugt", vorher.ereignisse.length);
    // S3 (2026-10-16, Tafel-Evolution benannt): Karte und Frage tragen zusätzlich
    // `pow` (Rechenaufwand). Verglichen wird ohne das Feld, und das Feld selbst wird
    // ausdrücklich verlangt — in Karte UND Frage, nicht in der Antwort.
    const ohnePow = (j) => JSON.stringify(JSON.parse(j).map((e) => {
      let c; try { c = JSON.parse(e.content); } catch (_e) { return e; }
      delete c.pow; return { ...e, content: JSON.stringify(c) };
    }));
    const mitPow = JSON.parse(nachher.ereignisse).map((e) => { try { return JSON.parse(e.content); } catch (_e) { return {}; } });
    sage(mitPow.filter((c) => c.kind === "sbkim-presence" || c.kind === "sbkim-query").every((c) => typeof c.pow === "string")
      && mitPow.some((c) => c.kind === "sbkim-query") && mitPow.filter((c) => c.kind === "sbkim-query-res").every((c) => c.pow === undefined),
      "Karte und Frage tragen pow, die Antwort nicht (S3)", nachher.ereignisse.slice(0, 300));
    vorher.ereignisse = ohnePow(vorher.ereignisse);
    nachher.ereignisse = ohnePow(nachher.ereignisse);
    sage(vorher.ereignisse === nachher.ereignisse, "publizierte Ereignisse Zeichen für Zeichen gleich (Karte, Frage, Antwort; ohne das neue Feld pow)",
      `vorher ${vorher.ereignisse.slice(0, 160)}…\n        nachher ${nachher.ereignisse.slice(0, 160)}…`);
    // Bau 23.R (2026-10-14, Tafel-Evolution benannt): die Antwort trägt zusätzlich
    // `bestaetigt`. Die gestellte Spore hier kann nicht unterschreiben → false. Verglichen
    // wird ohne das neue Feld, und das Feld selbst wird ausdrücklich verlangt — sonst
    // wäre ein stiller Wegfall der Bindung von „gleich" nicht zu unterscheiden.
    const ohneBest = (j) => JSON.stringify(JSON.parse(j), (k, v) => (k === "bestaetigt" ? undefined : v));
    sage(ohneBest(vorher.ant) === ohneBest(nachher.ant), "die Antwort auf die Frage ist gleich (ohne das neue Feld bestaetigt)", nachher.ant);
    sage(/"bestaetigt":false/.test(nachher.ant), "die Antwort sagt bestaetigt:false (gestellte Spore ohne Unterschrift)", nachher.ant);
    // S2 (2026-10-15, Tafel-Evolution benannt): jede Karte trägt zusätzlich `meaning`.
    // Ohne Modul 03 heißt das „nicht-geprueft". Verglichen wird ohne das neue Feld,
    // und das Feld selbst wird ausdrücklich verlangt (wie `bestaetigt` oben).
    // S5 (2026-10-15, ebenso benannt): jede Karte trägt zusätzlich `vouch`.
    // S3: das Ergebnis von discover trägt zusätzlich `verdraengt` (hier 0, ausdrücklich verlangt).
    const ohneMeaning = (j) => JSON.stringify(JSON.parse(j), (k, v) => (k === "meaning" || k === "vouch" || k === "verdraengt" ? undefined : v));
    sage(ohneMeaning(vorher.karten) === ohneMeaning(nachher.karten), "discover liefert dieselben Karten (ohne die neuen Felder meaning, vouch, verdraengt)", nachher.karten);
    sage(/"verdraengt":0/.test(nachher.karten), "discover sagt verdraengt: 0 (Raum nicht voll, S3)", nachher.karten);
    sage(/"vouch":\{"status":"unverbuergt"/.test(nachher.karten), "jede Karte sagt vouch: unverbuergt (kein Anker, keine Bürgschaft)", nachher.karten);
    sage(/"meaning":\{"status":"nicht-geprueft"/.test(nachher.karten), "jede Karte sagt meaning: nicht-geprueft (kein Modul 03 gestellt)", nachher.karten);
    sage(nachher.meta[0] === "sbkim-rdv" && nachher.meta[1] === "sbkim-qry", "_meta nennt sbkim-rdv / sbkim-qry", nachher.meta.join(" / "));
  }

  // ── B, C, D, H · zwei Knoten mit Code 1, einer mit Code 2, einer öffentlich
  kopf("B · mit Code eine andere Marke");
  const r = mockRelais();
  const A = knoten("A", QUELLE_23), B = knoten("B", QUELLE_23), X = knoten("X", QUELLE_23), P = knoten("P", QUELLE_23);
  await A.init({ nodeName: "Knoten A", relayClient: r, spore: spore("node-A"), listenMs: 60, netCode: CODE_1 });
  await B.init({ nodeName: "Knoten B", relayClient: r, spore: spore("node-B"), match: treffer, listenMs: 60, netCode: CODE_1.toLowerCase().replace(/-/g, " ") });
  await X.init({ nodeName: "Knoten X", relayClient: r, spore: spore("node-X"), match: treffer, listenMs: 60, netCode: CODE_2 });
  await P.init({ nodeName: "Knoten P", relayClient: r, spore: spore("node-P"), listenMs: 60 });
  sage(A._meta.network === "eigen" && A._meta.encrypted === true, "_meta: network eigen, encrypted", `${A._meta.network} ${A._meta.encrypted}`);
  sage(/^sbkim-netz-[0-9a-f]{32}$/.test(A._meta.tag) && /^sbkim-netzq-[0-9a-f]{32}$/.test(A._meta.queryTag), "Raum- und Fragen-Marke aus dem Code abgeleitet", `${A._meta.tag} / ${A._meta.queryTag}`);
  sage(A._meta.tag === B._meta.tag, "derselbe Code (anders geschrieben: klein, Leerzeichen) → dieselbe Marke", `${A._meta.tag} ⟷ ${B._meta.tag}`);
  sage(A._meta.tag !== X._meta.tag && A._meta.queryTag !== X._meta.queryTag, "ein anderer Code → eine andere Marke", `${A._meta.tag} ⟷ ${X._meta.tag}`);
  sage(P._meta.tag === "sbkim-rdv" && P._meta.network === "oeffentlich", "ohne Code bleibt der öffentliche Raum", P._meta.tag);

  kopf("H · Fragen und Antworten im eigenen Netz");
  const antH = await folge(A, B, r);
  sage(antH && antH.ok === true && antH.results && antH.results[0] && antH.results[0].label === "Eierschecke", "A fragt B, B antwortet, A liest die Antwort", JSON.stringify(antH));
  const spaet = await A.fetchAnswers([antH && antH.qid], { waitMs: 80 });
  sage(spaet.ok && spaet.answers.length === 1 && spaet.answers[0].results[0].label === "Eierschecke", "fetchAnswers liest die Antwort aus dem Briefkasten nach", JSON.stringify(spaet));
  await X.enableAnswering();
  await X.announce();
  await P.announce();

  kopf("D · ohne Code kein Klartext im Ereignis");
  const eigene = r.published.filter((e) => (e.tags || []).some((t) => /^sbkim-netzq?-/.test(t[1])));
  sage(eigene.length >= 4, "Selbst-Riegel: es gibt Ereignisse im eigenen Netz (Karten, Frage, Antwort)", eigene.length);
  // Nur Wörter ab 5 Zeichen: der verschlüsselte Inhalt ist Base64, und ein
  // kurzes Wort wie die Treffer-Kennung „r7" steht darin zufällig (gemessen:
  // 2 von 5 Läufen rot, ohne dass etwas im Klartext stand).
  const verraeter = ["Knoten A", "Knoten B", "node-A", "node-B", "sbkim-presence", "Kuchen", "Pudding", "Eierschecke"];
  const lecks = [];
  for (const e of eigene) for (const w of verraeter) if (e.content.includes(w)) lecks.push(w + " in " + e.tags[0][1]);
  sage(lecks.length === 0, "kein Name, keine Kennung, keine Frage, keine Antwort im Klartext", lecks.join(", "));
  let umschlag = true;
  for (const e of eigene) { try { const u = JSON.parse(e.content); if (!(u.v === 1 && typeof u.iv === "string" && typeof u.ct === "string" && Object.keys(u).length === 3)) umschlag = false; } catch (_e) { umschlag = false; } }
  sage(umschlag, "jedes Ereignis im eigenen Netz ist ein Umschlag {v, iv, ct}");
  const ivs = eigene.map((e) => JSON.parse(e.content).iv);
  sage(new Set(ivs).size === ivs.length, "jeder Umschlag hat einen eigenen IV", ivs.length + " / " + new Set(ivs).size);

  kopf("C · zwei Codes sehen einander nicht");
  const kA = await A.discover({ listenMs: 80 });
  const kX = await X.discover({ listenMs: 80 });
  const kP = await P.discover({ listenMs: 80 });
  const ids = (k) => (k.cards || []).map((c) => c.nodeId).sort().join(",");
  sage(ids(kA) === "node-B", "Code 1 sieht nur Code 1 (B)", ids(kA));
  sage(ids(kX) === "", "Code 2 sieht niemanden aus Code 1", ids(kX));
  sage(!/node-[ABX]/.test(ids(kP)), "das öffentliche Netz sieht keinen aus einem eigenen Netz", ids(kP));
  const frageX = await A.askNode("node-X", "Kuchen", { timeoutMs: 300 });
  sage(frageX.ok === false && frageX.pending === true, "eine Frage aus Code 1 erreicht X (Code 2) nicht", JSON.stringify(frageX));

  kopf("E · falscher Code liest nichts");
  const fremdeKarte = r.stored.find((e) => e.tags[0][1] === X._meta.tag);
  const vorE = (await A.discover({ listenMs: 60 })).cards.length;
  // X' Umschlag (Schlüssel 2) unter A's Marke: falscher Schlüssel, falsche Zusatzdaten
  r.einwerfen({ ...fremdeKarte, id: "fremd1", tags: [["t", A._meta.tag]], created_at: Math.floor(Date.now() / 1000) });
  // Klartext-Karte unter A's Marke: im eigenen Netz wird Klartext nicht geglaubt
  r.einwerfen({ id: "fremd2", pubkey: "pk2", kind: 1, created_at: Math.floor(Date.now() / 1000), tags: [["t", A._meta.tag]],
    content: JSON.stringify({ kind: "sbkim-presence", nodeId: "node-Z", nodeName: "Z", spore: { id: "node-Z" }, ts: Math.floor(Date.now() / 1000) }) });
  // A's eigener Umschlag aus dem Raum unter die Fragen-Marke: Zusatzdaten passen nicht
  const eigeneKarte = r.stored.find((e) => e.tags[0][1] === A._meta.tag && e.id.startsWith("ev"));
  r.einwerfen({ ...eigeneKarte, id: "fremd3", tags: [["t", A._meta.queryTag]] });
  const nachE = await A.discover({ listenMs: 80 });
  sage(nachE.ok === true && nachE.cards.length === vorE && !nachE.cards.some((c) => c.nodeId === "node-Z" || c.nodeId === "node-X"),
    "Umschlag mit fremdem Schlüssel und Klartext-Karte werden still verworfen", ids(nachE));
  const P2 = knoten("P2", QUELLE_23);
  await P2.init({ nodeName: "P2", relayClient: r, spore: spore("node-P2"), listenMs: 60, roomTag: A._meta.tag });
  const kP2 = await P2.discover({ listenMs: 80 });
  sage(P2._meta.network === "raum" && kP2.ok && (kP2.cards || []).every((c) => c.nodeId === "node-Z"),
    "wer nur die Marke kennt (ohne Code), liest keine einzige verschlüsselte Karte", ids(kP2));
  const W = knoten("W", QUELLE_23);
  await W.init({ nodeName: "W", relayClient: r, spore: spore("node-W"), listenMs: 60, netCode: "ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ" });
  const kW = await W.discover({ listenMs: 80 });
  sage(kW.ok && kW.cards.length === 0, "ein falscher Code sieht niemanden", ids(kW));

  kopf("F · ungültige Relais-Adresse abgewiesen (nur wss://)");
  for (const url of ["ws://relay.example", "https://relay.example", "wss://", "wss://a b", "javascript:alert(1)", "wss://relay.example\n"]) {
    const c = A.checkNetSetting({ relay: url, code: CODE_1 });
    sage(c.ok === false && /Relais/.test(c.reason), "checkNetSetting weist ab: " + JSON.stringify(url), JSON.stringify(c));
  }
  const gut = A.checkNetSetting({ name: "intern Family Project", relay: "wss://intern.example:8443/nostr", code: CODE_1 });
  sage(gut.ok === true && gut.setting.auto === true && gut.setting.name === "intern Family Project", "eine wss-Adresse mit Port und Pfad wird angenommen, auto ist Vorgabe", JSON.stringify(gut));
  const rF = mockRelais();
  const konfiguriert = [];
  rF.configure = (o) => { konfiguriert.push(o); return { ok: true, relays: o.relays || ["(vorgabe)"] }; };
  const F = knoten("F", QUELLE_23);
  await F.init({ nodeName: "F", relayClient: rF, spore: spore("node-F"), listenMs: 40 });
  const apF = await F.applyNetwork({ relay: "ws://unsicher.example", code: CODE_1 });
  sage(apF.ok === false && apF.network === "ungueltig" && konfiguriert.length === 0, "applyNetwork mit ws:// → ungültig, das Relais wird NICHT umgestellt", JSON.stringify(apF));
  const anF = await F.announce();
  sage(anF.ok === false && rF.published.length === 0, "… und danach geht nichts hinaus (kein Rückfall ins öffentliche Netz)", JSON.stringify(anF));
  const apF2 = await F.applyNetwork({ relay: "wss://intern.example", code: CODE_1 });
  sage(apF2.ok === true && apF2.network === "eigen" && konfiguriert.length === 1 && konfiguriert[0].relays[0] === "wss://intern.example", "eine gültige Einstellung setzt Relais UND Code", JSON.stringify(apF2));
  const apF3 = await F.applyNetwork(null);
  sage(apF3.ok === true && apF3.network === "oeffentlich" && konfiguriert[1] && konfiguriert[1].reset === true && F._meta.tag === "sbkim-rdv",
    "applyNetwork(null) → zurück ins öffentliche Netz, Relais zurückgesetzt", JSON.stringify(apF3));

  kopf("G · ungültiger Code: nie still öffentlich");
  const rG = mockRelais();
  const G = knoten("G", QUELLE_23);
  await G.init({ nodeName: "G", relayClient: rG, spore: spore("node-G"), match: treffer, listenMs: 40 });
  const sG = await G.setNetwork({ code: "ZU-KURZ" });
  sage(sG.ok === false && G._meta.network === "ungueltig" && /Netz-Code/.test(G._meta.networkReason || ""), "ein zu kurzer Code ist ungültig und sagt warum", JSON.stringify(sG));
  const sG2 = await G.setNetwork({ code: "ÄÖÜ-ÄÖÜ-ÄÖÜ-ÄÖÜ" });
  sage(sG2.ok === false, "Zeichen außerhalb A–Z/0–9 sind ungültig", JSON.stringify(sG2));
  const alle = [await G.announce(), await G.connectAndAnnounce(), await G.discover(), await G.enableAnswering(), await G.askNode("x", "y"), await G.fetchAnswers(["q1"])];
  sage(alle.every((x) => x && x.ok === false), "announce · connectAndAnnounce · discover · enableAnswering · askNode · fetchAnswers antworten ok:false", JSON.stringify(alle.map((x) => x && x.ok)));
  sage(rG.published.length === 0, "… und nichts wurde publiziert", rG.published.length);
  const sG3 = await G.setNetwork({ roomTag: "Gross Und Leer" });
  sage(sG3.ok === false && G._meta.network === "ungueltig", "eine ungültige Raum-Marke ist ebenfalls kein Rückfall", JSON.stringify(sG3));
  const sG4 = await G.setNetwork({ code: CODE_1, roomTag: "firma-x" });
  sage(sG4.ok && G._meta.network === "eigen" && G._meta.tag !== "firma-x", "Code und roomTag zugleich: der Code gewinnt", G._meta.tag);
  await G.setNetwork(null);
  sage(G._meta.network === "oeffentlich" && G._meta.tag === "sbkim-rdv" && G._meta.encrypted === false, "setNetwork(null) → öffentlich, unverschlüsselt", `${G._meta.network} ${G._meta.tag}`);
  await G.enableAnswering();
  await G.setNetwork({ code: CODE_1 });
  sage(G._meta.answering === false, "ein Netzwechsel beendet den Antwort-Lauscher der alten Marke", G._meta.answering);

  kopf("Neuer Code");
  const codes = new Set();
  let formOk = true;
  for (let i = 0; i < 200; i++) { const c = A.newNetCode(); codes.add(c); if (!/^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){4}$/.test(c)) formOk = false; }
  sage(formOk, "newNetCode: fünf Vierergruppen, ohne 0/O/1/I", A.newNetCode());
  sage(codes.size === 200, "200 Codes, 200 verschiedene", codes.size);
  const neu = A.newNetCode();
  sage((await G.setNetwork({ code: neu })).ok === true, "ein erzeugter Code ist gültig");

  kopf("I · Speicher je App");
  const mapStore = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m }; };
  const st = mapStore();
  const S1 = knoten("S1", QUELLE_23);
  await S1.init({ nodeName: "S1", relayClient: mockRelais(), spore: spore("node-S1") });
  const ohneSuffix = S1.saveNetwork({ relay: "wss://intern.example", code: CODE_1 }, st);
  sage(ohneSuffix.ok === false && st.m.size === 0, "ohne dbSuffix wird nicht gespeichert", JSON.stringify(ohneSuffix));
  S1.configure({ dbSuffix: "sendepruefer" });
  const sv = S1.saveNetwork({ name: "intern Family Project", relay: "wss://intern.example", code: CODE_1 }, st);
  sage(sv.ok && st.m.has("sbkim_netz_sendepruefer") && st.m.size === 1, "gespeichert unter sbkim_netz_<dbSuffix>", [...st.m.keys()].join(","));
  const S2 = knoten("S2", QUELLE_23);
  await S2.init({ nodeName: "S2", relayClient: mockRelais(), spore: spore("node-S2"), dbSuffix: "rezeptbuch" });
  sage(S2.loadNetwork(st) === null, "eine andere App (anderer dbSuffix) liest die Einstellung nicht");
  const geladen = S1.loadNetwork(st);
  sage(geladen && geladen.code === CODE_1 && geladen.relay === "wss://intern.example" && geladen.v === 1, "loadNetwork gibt die geprüfte Einstellung zurück", JSON.stringify(geladen));
  st.setItem("sbkim_netz_sendepruefer", JSON.stringify({ v: 1, relay: "ws://x", code: CODE_1 }));
  sage(S1.loadNetwork(st) === null, "eine verdorbene Einstellung im Speicher wird nicht geglaubt");
  st.setItem("sbkim_netz_sendepruefer", "{kaputt");
  sage(S1.loadNetwork(st) === null, "kaputtes JSON im Speicher → null, kein Wurf");
  S1.clearNetwork(st);
  sage(st.m.size === 0, "clearNetwork entfernt die Einstellung");
  const kein = S1.saveNetwork({ relay: "wss://intern.example", code: "kurz" }, st);
  sage(kein.ok === false && st.m.size === 0, "eine ungültige Einstellung wird nicht gespeichert", JSON.stringify(kein));

  // ── J · Modul 05b ─────────────────────────────────────────────────────────
  kopf("J · Modul 05b: Relais-Liste");
  const tmp = mkdtempSync(join(tmpdir(), "netz05b-"));
  try {
    writeFileSync(join(tmp, "noble-secp256k1.mjs"), readFileSync(join(WURZEL, "src/modules/noble-secp256k1.js"), "utf8"));
    writeFileSync(join(tmp, "05b.mjs"), readFileSync(join(WURZEL, "src/modules/05b_nostr_relay.js"), "utf8").replace('"./noble-secp256k1.js"', '"./noble-secp256k1.mjs"'));
    const geschlossen = [];
    globalThis.WebSocket = class { constructor(url) { this.url = url; this.readyState = 0; } send() {} close() { geschlossen.push(this.url); this.readyState = 3; } };
    const hatteSelf = "self" in globalThis;
    if (!hatteSelf) globalThis.self = globalThis; // noble liest self.crypto
    const origInfo = console.info; console.info = () => {};
    await import(pathToFileURL(join(tmp, "05b.mjs")).href);
    console.info = origInfo;
    const R = globalThis.SbkimNostrRelay;
    sage(JSON.stringify(R._meta.relays) === '["wss://relay.family-projekt.de"]', "ohne Einstellung: relay.family-projekt.de", JSON.stringify(R._meta.relays));
    sage(JSON.stringify(R._meta.defaultRelays) === '["wss://relay.family-projekt.de"]', "_meta.defaultRelays nennt die Vorgabe");
    for (const bad of [["ws://x.example"], ["wss://ok.example", "http://x.example"], [""], [42]]) {
      const c = R.configure({ relays: bad });
      sage(c.ok === false && JSON.stringify(R._meta.relays) === '["wss://relay.family-projekt.de"]', "configure weist die ganze Liste ab: " + JSON.stringify(bad), JSON.stringify(c));
    }
    const leer = R.configure({ relays: [] });
    sage(leer.ok === false && R._meta.relays.length === 1, "leere Liste → ok:false, nicht ohne Relais", JSON.stringify(leer));
    R.subscribe({ kinds: [1], "#t": ["sbkim-rdv"] }, () => {});
    await warte(5);
    const c1 = R.configure({ relays: ["wss://intern.example"] });
    sage(c1.ok && JSON.stringify(R._meta.relays) === '["wss://intern.example"]', "eine wss-Liste wird übernommen", JSON.stringify(c1));
    sage(geschlossen.includes("wss://relay.family-projekt.de"), "die Verbindung zum alten Relais wird geschlossen", JSON.stringify(geschlossen));
    const c2 = R.configure({ reset: true });
    sage(c2.ok && JSON.stringify(R._meta.relays) === '["wss://relay.family-projekt.de"]', "configure({reset:true}) → zurück zur Vorgabe", JSON.stringify(c2));
  } catch (e) {
    sage(false, "Modul 05b ließ sich in der Probe nicht laden", e && e.message);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
    delete globalThis.WebSocket;
  }

  console.log(`\nSumme: ${gruen} grün, ${rot} rot${stumm ? `, ${stumm} nicht messbar` : ""} · ${gruen + rot} insgesamt`);
  process.exitCode = rot ? 1 : 0;
}

main().catch((e) => { console.log("  ✗ ROT Probe gestolpert: " + (e && e.stack || e)); console.log(`\nSumme: ${gruen} grün, ${rot + 1} rot`); process.exitCode = 1; });
