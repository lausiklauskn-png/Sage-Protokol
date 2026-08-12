// Beweis: das 🎤 im „Mit dem Netz verbinden"-Feld hört die Sprache, die
// GESPROCHEN wird — nicht immer Deutsch.
//
// Vorher stand in onVoiceClick:
//     var lang = (langs[0] || ["de-DE"])[0];
// IMMER der erste Eintrag der Liste, also immer Deutsch, und niemand konnte
// etwas daran ändern. Dieses 🎤 sitzt in JEDER App mit Modul 23 (Rezeptbuch,
// Mixarium, Muttis, Tomys Hub, BookLedgerPro, family-project, Kimboard …) —
// für alle, die kein Deutsch sprechen, war es damit unbrauchbar.
// Klaus 2026-08-11: „wenn ich in Arabisch etwas hineinspreche, muss auch
// Arabisch als Text herauskommen."
//
// GEPRÜFT WIRD DIE TAT, NICHT DER WORTLAUT: das echte Modul 21 wird geladen
// (mit einem gesetzten `navigator`), und ein eingehängter Erkenner schreibt
// mit, welches `lang` das Panel WIRKLICH übergibt. Ein Blick in den Quelltext
// („steht da `voiceLang()`?") würde auch dann grün melden, wenn der Aufruf nie
// stattfindet.
//
// Sabotage-Probe gemacht: `var lang = voiceLang()` zurück auf `langs[0][0]` →
// vier Proben rot.
//
// Lauf: node tests/smoke_bau23_sprachwahl.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- Minimal-DOM-Stub (createElement-basiert, parst KEIN innerHTML) ----
function makeEl(tag, doc) {
  const e = {
    tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", type: "", title: "",
    children: [], parentNode: null, _listeners: {},
  };
  // style mit cssText-Parsing (setzt einzelne Eigenschaften wie ein echter Browser).
  const _style = {};
  Object.defineProperty(_style, "cssText", {
    get() { return _style._raw || ""; },
    set(v) {
      _style._raw = String(v);
      String(v).split(";").forEach((decl) => {
        const i = decl.indexOf(":");
        if (i < 0) return;
        const prop = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (prop && prop !== "_raw") _style[prop] = decl.slice(i + 1).trim();
      });
    },
  });
  e.style = _style;
  e.appendChild = (c) => { if (c.parentNode) { const i = c.parentNode.children.indexOf(c); if (i >= 0) c.parentNode.children.splice(i, 1); } e.children.push(c); c.parentNode = e; return c; };
  e.removeChild = (c) => { const i = e.children.indexOf(c); if (i >= 0) { e.children.splice(i, 1); c.parentNode = null; } return c; };
  Object.defineProperty(e, "firstChild", { get: () => e.children[0] || null });
  e.addEventListener = (t, cb) => { (e._listeners[t] = e._listeners[t] || []).push(cb); };
  e.click = () => (e._listeners.click || []).slice().forEach((cb) => cb({ type: "click" }));
  e.querySelector = (sel) => find(e, sel);
  // Attribute (2026-08-03): der Stub kannte nur Eigenschaften. Modul 23 UI setzt
  // seit der Beruehrungsziel-Runde `data-ecke-unten` am 🌐-Knopf — ohne diese
  // beiden Methoden warf der Smoke "setAttribute is not a function".
  e._attrs = {};
  e.setAttribute = (k, v) => { e._attrs[k] = String(v); };
  e.getAttribute = (k) => (k in e._attrs ? e._attrs[k] : null);
  e.removeAttribute = (k) => { delete e._attrs[k]; };
  return e;
}
function find(root, sel) {
  let out = null;
  (function walk(n) { if (out) return; for (const c of n.children) { if (matches(c, sel)) { out = c; return; } walk(c); } })(root);
  return out;
}
function matches(el, sel) {
  if (sel.startsWith("#")) return el.id === sel.slice(1);
  return el.tagName === sel.toUpperCase();
}
function makeDoc() {
  const doc = { nodeType: 9, readyState: "complete" };
  doc.createElement = (t) => makeEl(t, doc);
  doc.body = makeEl("body", doc);
  doc.head = makeEl("head", doc);
  doc.addEventListener = () => {};
  doc.querySelector = (sel) => find(doc.body, sel);
  // getElementById braucht das Modul, um sein Stylesheet nur EINMAL einzuhaengen.
  doc.getElementById = (id) => find(doc.body, "#" + id) || find(doc.head, "#" + id);
  return doc;
}

// ---- Mock-SbkimRendezvous ----
function makeMockRdv() {
  const calls = { configure: [], announce: 0, connect: 0, discover: 0, handshake: [], ask: [], fetch: [] };
  let discoverCards = [];
  let connectImpl = async () => ({ ok: true, created: false, nodeId: "OWN" });
  let askResult = { ok: false, pending: true, qid: "q-mock-1", reason: "Noch keine Antwort." };
  let fetchResult = { ok: true, answers: [] };
  return {
    configure(o) { calls.configure.push(o); },
    announce: async () => { calls.announce++; return { ok: true, nodeId: "OWN" }; },
    connectAndAnnounce: async (o) => { calls.connect++; calls._lastConnectOpts = o; return connectImpl(o); },
    discover: async () => { calls.discover++; return { ok: true, cards: discoverCards }; },
    handshakeCard: async (card) => { calls.handshake.push(card); return { outcome: "established", score: 0.9 }; },
    // A11: nach Frage-Passung ranken — Mock sortiert nach dem je-Karte gesetzten
    // `_fit` (absteigend) und hängt queryFit an (wie der echte rankCardsByQuery).
    rankCardsByQuery: (cards, qv) => {
      calls.rank = (calls.rank || 0) + 1; calls.lastRankQv = qv;
      const list = (Array.isArray(cards) ? cards : []).map((c) => Object.assign({}, c, { queryFit: (typeof c._fit === "number" ? c._fit : null) }));
      list.sort((a, b) => (b.queryFit == null ? -Infinity : b.queryFit) - (a.queryFit == null ? -Infinity : a.queryFit));
      return list;
    },
    askNode: async (card, text) => { calls.ask.push({ card, text }); return askResult; },
    fetchAnswers: async (qids) => { calls.fetch.push(qids); return fetchResult; },
    _calls: calls,
    _setDiscover(cards) { discoverCards = cards; },
    _setConnect(fn) { connectImpl = fn; },
    _setAsk(r) { askResult = r; },
    _setFetch(r) { fetchResult = r; },
  };
}


const results = [];
const record = (probe, exp, act, ok) => results.push({ probe, exp, act, ok });

const UI_SRC = readFileSync(resolve(repoRoot, "src/modules/23_rendezvous_ui.js"), "utf8");
const SPEECH_SRC = readFileSync(resolve(repoRoot, "src/modules/21_spracheingabe.js"), "utf8");

/* Eine frische Bühne je Probe: eigenes Dokument, eigener Speicher, eigene
 * Geräte-Sprache. Sonst trägt eine Probe ihre gemerkte Wahl in die nächste —
 * und genau das wollen wir ja getrennt messen. */
function buehne(opts) {
  const o = opts || {};
  const stub = {};
  stub.document = makeDoc();
  stub.console = console;
  stub.SbkimRendezvous = makeMockRdv();
  stub.SbkimEmbedding = { embedQuery: async () => [0.1, 0.2, 0.3] };
  const bus = {};
  stub.addEventListener = (t, cb) => { (bus[t] = bus[t] || []).push(cb); };
  stub.removeEventListener = () => {};
  stub.dispatchEvent = (ev) => { (bus[ev.type] || []).slice().forEach((cb) => cb(ev)); return true; };
  const ls = Object.assign({}, o.storage || {});
  stub.localStorage = {
    getItem: (k) => (k in ls ? ls[k] : null),
    setItem: (k, v) => { ls[k] = String(v); },
    removeItem: (k) => { delete ls[k]; },
  };
  stub._ls = ls;
  if (o.geraet) stub.navigator = { languages: o.geraet };

  // Der eingehängte Erkenner: schreibt mit, mit welchem `lang` gestartet wurde,
  // und kann auf Wunsch ein Ergebnis liefern.
  stub.gehoert = [];
  if (o.speech !== false) {
    stub.SpeechRecognition = function () {
      const self = this;
      /* Das Ergebnis kommt NICHT sofort aus start(). Das Panel setzt seine
       * Notiz („🎤 Sprich jetzt …") ERST NACH `start()` — käme das Ergebnis
       * synchron, überschriebe das Panel den Hinweis im selben Wimpernschlag
       * und die Probe wäre fälschlich rot. Genau diese Falle hat heute schon
       * einmal zugeschnappt. */
      this.start = function () {
        stub.gehoert.push(self.lang);
        if (self.onstart) self.onstart();
        if (stub.ergebnis != null && self.onresult) {
          const t = stub.ergebnis;
          setTimeout(function () {
            self.onresult({ results: [[{ transcript: t }]], resultIndex: 0 });
          }, 0);
        }
      };
      this.stop = function () {};
      this.abort = function () {};
    };
    new Function("global", "window", "globalThis", "console", SPEECH_SRC)(stub, stub, stub, console);
  }
  new Function("window", "globalThis", "console", "document", UI_SRC)(stub, stub, console, stub.document);
  return stub;
}

async function mounte(stub, cfg) {
  const UI = stub.SbkimRendezvousUI;
  await UI.init(Object.assign({ nodeName: "Probe-Knoten", dbSuffix: "probe" }, cfg || {}));
  UI.show();
  return UI;
}

// Der 🎤-Knopf ist der einzige Knopf mit genau diesem Text.
function finde(stub, text) {
  let out = null;
  (function walk(n) {
    if (out) return;
    for (const c of n.children) { if (c.textContent === text) { out = c; return; } walk(c); }
  })(stub.document.body);
  return out;
}
function feuere(el, typ) { (el._listeners[typ] || []).slice().forEach((cb) => cb({ type: typ })); }

async function run() {
  // ── 1) Die Auswahl ist da, und sie trägt alle zwölf Sprachen ──────────────
  {
    const stub = buehne({ geraet: ["de-DE"] });
    await mounte(stub);
    const sel = stub.document.querySelector("#sbkim-rdv-miclang");
    record("Sprachwahl im Panel vorhanden", "vorhanden", sel ? "vorhanden" : "fehlt", !!sel);
    record("zwölf Sprachen zur Wahl", "12", sel ? String(sel.children.length) : "0",
      !!sel && sel.children.length === 12);
    record("Paschtu ist dabei", "ja",
      sel && sel.children.some((o) => o.value === "ps-AF") ? "ja" : "nein",
      !!sel && sel.children.some((o) => o.value === "ps-AF"));
    record("Dari ist dabei", "ja",
      sel && sel.children.some((o) => o.value === "fa-IR") ? "ja" : "nein",
      !!sel && sel.children.some((o) => o.value === "fa-IR"));
  }

  // ── 2) OHNE Modul 21 erscheint KEINE Auswahl ──────────────────────────────
  //    Fremdnutzer-Brille: ein Wähler ohne Spracheingabe wäre ein toter Knopf.
  //    Fail-soft heißt „das Feature verschwindet still", nicht „es steht da und
  //    tut nichts". Das Frage-Feld muss voll nutzbar bleiben.
  {
    const stub = buehne({ geraet: ["de-DE"], speech: false });
    await mounte(stub);
    record("ohne Modul 21: keine Sprachwahl", "keine",
      stub.document.querySelector("#sbkim-rdv-miclang") ? "doch eine" : "keine",
      !stub.document.querySelector("#sbkim-rdv-miclang"));
    record("ohne Modul 21: Frage-Feld trotzdem da", "vorhanden",
      stub.document.querySelector("#sbkim-rdv-q") ? "vorhanden" : "fehlt",
      !!stub.document.querySelector("#sbkim-rdv-q"));
    const mic = finde(stub, "🎤");
    let warf = false;
    try { mic.click(); } catch (_e) { warf = true; }
    record("ohne Modul 21: 🎤 wirft nicht", "kein Wurf", warf ? "geworfen" : "kein Wurf", !warf);
  }

  // ── 3) Die GERÄTE-Sprache entscheidet vor — ohne Einstellung ──────────────
  //    Der Fall, der zählt: wer erst eine Einstellung finden muss, um
  //    verstanden zu werden, benutzt das Mikrofon nicht.
  for (const [geraet, erwartet] of [[["de-DE"], "de-DE"], [["ar-EG", "de"], "ar-SA"],
                                    [["ps-AF"], "ps-AF"], [["ru-RU"], "ru-RU"],
                                    [["ja-JP"], "de-DE"]]) {
    const stub = buehne({ geraet });
    await mounte(stub);
    finde(stub, "🎤").click();
    record(`Gerät ${geraet[0]} → Mikrofon hört ${stub.gehoert[0]}`, erwartet,
      String(stub.gehoert[0]), stub.gehoert[0] === erwartet);
  }

  // ── 4) Umschalten wirkt ab dem nächsten Antippen ──────────────────────────
  {
    const stub = buehne({ geraet: ["de-DE"] });
    await mounte(stub);
    const mic = finde(stub, "🎤");
    mic.click();
    const sel = stub.document.querySelector("#sbkim-rdv-miclang");
    sel.value = "ar-SA"; feuere(sel, "change");
    mic.click();
    record("nach dem Umschalten hört das Mikrofon Arabisch", "de-DE,ar-SA",
      stub.gehoert.join(","), stub.gehoert.join(",") === "de-DE,ar-SA");
    record("die Wahl wird gemerkt", "ar-SA",
      String(stub._ls["sbkim_rdv_miclang_probe"]), stub._ls["sbkim_rdv_miclang_probe"] === "ar-SA");
  }

  // ── 5) Die Wahl überlebt den nächsten Besuch ──────────────────────────────
  {
    const stub = buehne({ geraet: ["de-DE"], storage: { "sbkim_rdv_miclang_probe": "ps-AF" } });
    await mounte(stub);
    finde(stub, "🎤").click();
    record("gemerkte Wahl gilt beim nächsten Öffnen", "ps-AF",
      String(stub.gehoert[0]), stub.gehoert[0] === "ps-AF");
  }

  // ── 6) Der Speicher-Name trägt den App-Namen ──────────────────────────────
  //    Geschwister-Apps teilen sich auf GitHub Pages EINEN Origin. Ohne eigenen
  //    Namen stellte eine App der anderen die Sprache um.
  {
    const a = buehne({ geraet: ["de-DE"] });
    await mounte(a, { dbSuffix: "rezeptbuch" });
    const selA = a.document.querySelector("#sbkim-rdv-miclang");
    selA.value = "tr-TR"; feuere(selA, "change");
    record("Speicher-Name trägt den App-Namen", "sbkim_rdv_miclang_rezeptbuch",
      Object.keys(a._ls).filter((k) => k.indexOf("miclang") >= 0).join(","),
      a._ls["sbkim_rdv_miclang_rezeptbuch"] === "tr-TR");
    // Dieselbe gemerkte Wahl darf eine ANDERE App nicht erreichen.
    const b = buehne({ geraet: ["de-DE"], storage: { "sbkim_rdv_miclang_rezeptbuch": "tr-TR" } });
    await mounte(b, { dbSuffix: "mixarium" });
    finde(b, "🎤").click();
    record("die Nachbar-App bleibt unberührt", "de-DE",
      String(b.gehoert[0]), b.gehoert[0] === "de-DE");
  }

  // ── 7) Das Frage-Feld liest nach Inhalt (dir=auto) ────────────────────────
  {
    const stub = buehne({ geraet: ["ar-EG"] });
    await mounte(stub);
    finde(stub, "🎤").click();
    const q = stub.document.querySelector("#sbkim-rdv-q");
    record("Frage-Feld liest nach Inhalt (dir=auto)", "auto",
      String(q.getAttribute("dir")), q.getAttribute("dir") === "auto");
    record("Frage-Feld nennt die Sprache", "ar", String(q.getAttribute("lang")), q.getAttribute("lang") === "ar");
  }

  // ── 8) Der STILLE Fehlschlag (Klaus' Sichttest 2026-08-11) ────────────────
  //    Paschtu kam als „Salaam" in LATEINISCHEN Buchstaben zurück, ganz OHNE
  //    Fehler. Ein Fehler-Hinweis kann da nicht greifen — also die Schrift.
  //    Und die Kontrolle muss schweigen, wenn die Schrift stimmt.
  {
    const stub = buehne({ geraet: ["de-DE"] });
    await mounte(stub);
    const mic = finde(stub, "🎤");
    const sel = stub.document.querySelector("#sbkim-rdv-miclang");
    const notiz = () => {
      const q = stub.document.querySelector("#sbkim-rdv-q");
      // Die Notiz landet im Ausgabe-Bereich des Panels (setVoiceHint).
      let out = null;
      (function walk(n) {
        if (out) return;
        for (const c of n.children) {
          if (typeof c.textContent === "string" && /🎤|Erkannt/.test(c.textContent)) { out = c; return; }
          walk(c);
        }
      })(stub.document.body);
      return out ? out.textContent : "";
    };

    const sprich = async (code, gesagt) => {
      sel.value = code; feuere(sel, "change");
      stub.ergebnis = gesagt; mic.click();
      await new Promise((r) => setTimeout(r, 5));   // Ergebnis kommt verzögert
      return notiz();
    };

    const schief = await sprich("ps-AF", "Salaam");
    record("Hinweis beim stillen Fehlschlag (Paschtu → lateinischer Text)", "Hinweis",
      schief, /پښتو/.test(schief) && /lateinischer Schrift/.test(schief));

    /* Die beiden Gegenproben verlangen ausdrücklich die ERKANNT-Notiz mit dem
     * gesprochenen Text. „Enthält nicht 'lateinischer Schrift'" allein wäre
     * wertlos — das ist auch auf „🎤 Sprich jetzt …" wahr, also auf einem Lauf,
     * in dem gar nichts erkannt wurde. Genau so eine Prüfung hat heute schon
     * einmal grün gemeldet, ohne etwas zu messen. */
    const passt = await sprich("ar-SA", "سلام عليكم");
    record("kein falscher Alarm, wenn die Schrift stimmt (Arabisch)", "Erkannt: سلام عليكم …",
      passt, /Erkannt: سلام عليكم/.test(passt) && !/lateinischer Schrift/.test(passt));

    const deutsch = await sprich("de-DE", "Guten Tag");
    record("kein falscher Alarm bei Deutsch", "Erkannt: Guten Tag …",
      deutsch, /Erkannt: Guten Tag/.test(deutsch) && !/lateinischer Schrift/.test(deutsch));
  }

  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    console.log(`${r.ok ? "✓" : "✗"} ${r.probe}`);
    if (!r.ok) { console.log(`   erwartet: ${r.exp}`); console.log(`   erhalten: ${r.act}`); }
  }
  console.log(`\nSumme: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  process.exit(fail > 0 ? 1 : 0);
}
run().catch((e) => { console.error("Smoke gescheitert:", e); process.exit(1); });
