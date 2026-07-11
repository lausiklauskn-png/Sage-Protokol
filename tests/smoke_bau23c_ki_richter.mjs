// Headless smoke — KI-Richter im Netz-Q&A-Panel (Modul 23 UI, A4/B3, opt-in).
// Run with `node tests/smoke_bau23c_ki_richter.mjs`.
//
// Beweist die opt-in-Verdrahtung des KI-Richters (Modul 04 hybridMatch) in die
// Rendezvous-UI — Fremdnutzer-sicher:
//   1. KI-Richter AUS (Default) → rohe Cosinus-Reihenfolge, hybridMatch NICHT gerufen.
//   2. KI-Richter AN + Schlüssel → hybridMatch mit (frage, kandidaten, {apiKey,provider,euOnly})
//      gerufen; Ausgabe nach KI-Score sortiert + Begründung.
//   3. KEIN Schlüssel → gratis Cosinus (hybridMatch nicht gerufen).
//   4. Fail-soft: hybridMatch {available:false} und Throw → rohe Reihenfolge bleibt.
//   5. EU-Politik: euOnly:true → nur EU-Anbieter in der Auswahl.
//   6. Datenschutz-Wortlaut steht in der KI-Ausgabe (Schlüssel bleibt im Browser).
// Kein echtes DOM/Netz — deterministisch.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

function makeEl(tag) {
  const e = { tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", value: "", type: "", title: "",
    placeholder: "", autocomplete: "", innerHTML: "", children: [], parentNode: null, _listeners: {} };
  const _style = {};
  Object.defineProperty(_style, "cssText", { get() { return _style._raw || ""; }, set(v) { _style._raw = String(v); } });
  e.style = _style;
  e.setAttribute = (k, v) => { e[k] = v; };
  e.appendChild = (c) => { e.children.push(c); c.parentNode = e; return c; };
  e.removeChild = (c) => { const i = e.children.indexOf(c); if (i >= 0) e.children.splice(i, 1); return c; };
  Object.defineProperty(e, "firstChild", { get: () => e.children[0] || null });
  e.addEventListener = (t, cb) => { (e._listeners[t] = e._listeners[t] || []).push(cb); };
  e.click = () => (e._listeners.click || []).slice().forEach((cb) => cb({ type: "click" }));
  e.querySelector = () => null;
  return e;
}
function makeDoc() {
  const doc = { nodeType: 9, readyState: "complete" };
  doc.createElement = (t) => makeEl(t);
  doc.body = makeEl("body"); doc.head = makeEl("head");
  doc.addEventListener = () => {}; doc.querySelector = () => null;
  return doc;
}

const results = [];
const record = (name, ok, extra) => results.push({ name, ok: !!ok, extra: extra || "" });

// Mock-Rendezvous (nur was die UI beim Mount/Init braucht).
const mockRdv = {
  configure() {}, announce: async () => ({ ok: true }), connectAndAnnounce: async () => ({ ok: true, nodeId: "OWN" }),
  discover: async () => ({ ok: true, cards: [] }), askNode: async () => ({ ok: true, results: [] }),
  enableAnswering() {}, disableAnswering() {}, _meta: { answering: false },
};

// Stub-Global + Modul-04-Stub (hybridMatch).
function freshStub(hybridImpl, providers) {
  const stub = {};
  stub.window = stub; stub.document = makeDoc();
  stub.localStorage = { _d: {}, getItem(k) { return k in this._d ? this._d[k] : null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };
  stub.SbkimRendezvous = mockRdv;
  stub.SbkimMatch = { hybridMatch: hybridImpl, _meta: { hybridProviders: providers } };
  return stub;
}
function loadUI(stub) {
  const src = readFileSync(resolve(repoRoot, "src/modules/23_rendezvous_ui.js"), "utf8");
  new Function("window", "globalThis", "console", "document", src)(stub, stub, console, stub.document);
  return stub.SbkimRendezvousUI;
}

const PROVIDERS = [
  { id: "claude", label: "Claude (Anthropic)", region: "us" },
  { id: "mistral", label: "Mistral (EU)", region: "eu" },
  { id: "gemini", label: "Gemini", region: "us" },
];
const ANSWER = { ok: true, tookMs: 300, results: [
  { label: "Tasse 11oz bedruckt", score: 0.84 },
  { label: "Handtuch bedruckt", score: 0.80 },
] };
const CARD = { nodeName: "Tomys Hub", nodeId: "s2-abc" };

async function run() {
  // ---- 1. KI AUS (Default): Cosinus, kein hybridMatch ----
  {
    let called = 0;
    const stub = freshStub(async () => { called++; return { available: false, reason: "x" }; }, PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    const out = UI._test.renderAnswer(CARD, ANSWER, "bedruckte Tassen?");
    record("KI aus → Cosinus-Reihenfolge, hybridMatch NICHT gerufen",
      called === 0 && /Tasse 11oz bedruckt\s+\(0\.84\)/.test(out) && !/KI-Richter/.test(out), `called=${called}`);
    record("KI aus → _meta.kiRichter.on=false", UI._meta.kiRichter.on === false);
  }

  // ---- 2. KI AN + Schlüssel: hybridMatch gerufen, nach KI-Score sortiert ----
  {
    let seen = null;
    const hybrid = async (query, candidates, opts) => {
      seen = { query, candidates, opts };
      return { available: true, provider: opts.provider || "mistral", region: "eu", verdicts: [
        { label: "Handtuch bedruckt", passt: true, score: 0.91, begruendung: "passt gut" },
        { label: "Tasse 11oz bedruckt", passt: false, score: 0.40, begruendung: "eher nicht" },
      ] };
    };
    const stub = freshStub(hybrid, PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.setKi({ on: true, key: "sk-test", provider: "mistral" });
    UI._test.renderAnswer(CARD, ANSWER, "bedruckte Tassen?");
    await new Promise((r) => setTimeout(r, 0)); // hybridMatch-Promise auflösen lassen
    const out = UI._test.outText();
    record("KI an+Schlüssel → hybridMatch gerufen mit Frage+Kandidaten",
      !!seen && seen.query === "bedruckte Tassen?" && seen.candidates.length === 2 && seen.candidates[0].label === "Tasse 11oz bedruckt");
    record("hybridMatch bekam apiKey (BYOK) + provider", !!seen && seen.opts.apiKey === "sk-test" && seen.opts.provider === "mistral");
    record("Ausgabe nach KI-Score sortiert (Handtuch 0.91 zuerst)",
      /1\..*Handtuch bedruckt\s+\(0\.91\)/.test(out) && /2\..*Tasse 11oz bedruckt\s+\(0\.40\)/.test(out), out.split("\n").slice(0,4).join(" | "));
    record("Begründung angezeigt", /passt gut/.test(out) && /eher nicht/.test(out));
    record("Datenschutz benannt (Schlüssel bleibt im Browser)", /Schlüssel blieb im Browser/.test(out));
  }

  // ---- 3. KI AN, KEIN Schlüssel → gratis Cosinus, kein hybridMatch ----
  {
    let called = 0;
    const stub = freshStub(async () => { called++; return { available: true, verdicts: [] }; }, PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.setKi({ on: true, key: "", provider: "mistral" });
    const out = UI._test.renderAnswer(CARD, ANSWER, "frage");
    record("KI an ohne Schlüssel → Cosinus, hybridMatch NICHT gerufen",
      called === 0 && !/KI-Richter \(/.test(out), `called=${called}`);
  }

  // ---- 4. Fail-soft: {available:false} + Throw → rohe Reihenfolge ----
  {
    const stub = freshStub(async () => ({ available: false, reason: "kein Netz" }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.setKi({ on: true, key: "k", provider: "mistral" });
    UI._test.renderAnswer(CARD, ANSWER, "frage");
    await new Promise((r) => setTimeout(r, 0));
    const out = UI._test.outText();
    record("Fail-soft {available:false} → Cosinus bleibt + ehrliche Notiz",
      /Tasse 11oz bedruckt\s+\(0\.84\)/.test(out) && /kein Urteil.*kein Netz/.test(out));
  }
  {
    const stub = freshStub(async () => { throw new Error("boom"); }, PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.setKi({ on: true, key: "k", provider: "mistral" });
    UI._test.renderAnswer(CARD, ANSWER, "frage");
    await new Promise((r) => setTimeout(r, 0));
    const out = UI._test.outText();
    record("Fail-soft Throw → Cosinus bleibt + Fehler benannt", /Tasse 11oz bedruckt/.test(out) && /KI-Richter-Fehler: boom/.test(out));
  }

  // ---- 5. EU-Politik: euOnly:true → nur EU-Anbieter ----
  {
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "BookLedgerPro", euOnly: true });
    const provs = UI._test.providers();
    record("euOnly:true → nur EU-Anbieter (mistral), kein us", provs.length === 1 && provs[0].id === "mistral", provs.map((p) => p.id).join(","));
    record("_meta.euOnly durchgereicht", UI._meta.euOnly === true);
  }
  {
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    record("euOnly false (Default) → alle Anbieter", UI._test.providers().length === 3);
  }

  // ---- 6. Ohne Modul 04 (Fremdnutzer ohne Match-Modul) → nie Crash, Cosinus ----
  {
    const stub = freshStub(undefined, undefined); // kein hybridMatch
    stub.SbkimMatch = null;
    const UI = loadUI(stub); await UI.init({ nodeName: "Fork" });
    UI._test.setKi({ on: true, key: "k" });
    const out = UI._test.renderAnswer(CARD, ANSWER, "frage");
    record("Ohne Modul 04 → kein Crash, Cosinus", /Tasse 11oz bedruckt/.test(out) && !/KI-Richter \(/.test(out));
  }

  // ---- 7. 🎤 Spracheingabe (Modul 21) ----
  {
    // Ohne Modul 21 → ehrliche Notiz, kein Crash (Fork-sicher).
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Fork" });
    const hint = UI._test.voiceClick();
    record("🎤 ohne Modul 21 → ehrliche Notiz, kein Crash", /nicht geladen.*tippen/.test(hint || ""));
  }
  {
    // Mit Modul-21-Stub (Browser-Engine) → erkannter Text landet im Frage-Feld.
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    stub.SbkimSpeech = {
      pickEngine: () => "browser",
      isBrowserSupported: () => true,
      getLanguages: () => [["de-DE", "Deutsch"]],
      speechErrorHint: (e) => "hint:" + e,
      makeBrowserRecognizer: (o) => ({ start: () => { o.onResult("wer verkauft tassen"); o.onEnd(); } }),
    };
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.voiceClick();
    record("🎤 Browser-Engine → erkannter Text landet im Frage-Feld", UI._test.askValue() === "wer verkauft tassen", UI._test.askValue());
  }

  // ---- 8. „🔑 Schlüssel holen"-Direktlink (Fremdnutzer-Hilfe) ----
  {
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.toggleKi();                 // KI an → Anbieter = claude (erster), noch kein Schlüssel
    const l1 = UI._test.keyLink();
    record("KI an ohne Schlüssel → Link sichtbar mit Anbieter-URL",
      l1 && l1.visible && /anthropic\.com/.test(l1.href || ""), l1 && l1.href);
    UI._test.setKeyInput("sk-123");      // Schlüssel getippt → Link weg
    const l2 = UI._test.keyLink();
    record("KI an MIT Schlüssel → Link verborgen", l2 && !l2.visible);
  }
  {
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "BLP", euOnly: true });
    UI._test.toggleKi();                 // euOnly → Anbieter = mistral (EU)
    const l = UI._test.keyLink();
    record("euOnly → Link zeigt auf EU-Anbieter (mistral)", l && l.visible && /mistral\.ai/.test(l.href || ""), l && l.href);
  }

  // ---- 9. Tresor: KI-Schlüssel merken/entsperren (Modul 20 Safe) ----
  {
    const store = {};
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    stub.SbkimSafe = {
      putSecret: async (name, val, pw) => { if (!pw || pw.length < 8) throw Object.assign(new Error("kurz"), { name: "WeakPasswordError" }); store[name] = { val, pw }; return true; },
      getSecret: async (name, pw) => (store[name] && store[name].pw === pw) ? store[name].val : null,
      hasSecret: async (name) => !!store[name],
    };
    let promptReply = "tresor-pw-123";
    stub.prompt = () => promptReply;
    const UI = loadUI(stub); await UI.init({ nodeName: "Rezeptbuch" });
    UI._test.setKi({ on: true, key: "sk-geheim", provider: "mistral" });
    UI._test.toggleKi(); UI._test.toggleKi();   // an → aus → an, damit Buttons aktualisieren
    // KI an + Schlüssel → „merken" sichtbar, „entsperren" nicht
    UI._test.setKeyInput ? null : null;
    const b1 = UI._test.vaultBtns();
    record("Tresor: KI an + Schlüssel → 'merken' sichtbar", b1.save === true && b1.unlock === false, JSON.stringify(b1));
    UI._test.saveToVault();
    await new Promise((r) => setTimeout(r, 0));
    record("Tresor: putSecret abgelegt (verschlüsselt via Modul 20)", !!store[UI._test.kiSecretName()]);
    // Schlüssel leeren → „entsperren" sichtbar
    UI._test.setKeyInput("");
    const b2 = UI._test.vaultBtns();
    record("Tresor: KI an ohne Schlüssel → 'entsperren' sichtbar", b2.unlock === true && b2.save === false, JSON.stringify(b2));
    // Entsperren mit richtigem Passwort → Schlüssel wieder da
    UI._test.unlockFromVault();
    await new Promise((r) => setTimeout(r, 0));
    record("Tresor: entsperren (richtiges PW) → Schlüssel gefüllt", UI._meta.kiRichter.hasKey === true);
    // Falsches Passwort → nicht gefüllt
    UI._test.setKeyInput("");
    promptReply = "falsch";
    UI._test.unlockFromVault();
    await new Promise((r) => setTimeout(r, 0));
    record("Tresor: falsches PW → Schlüssel bleibt leer (fail-soft)", UI._meta.kiRichter.hasKey === false);
  }
  {
    // Ohne Modul 20 (Forker) → keine Tresor-Knöpfe, kein Crash
    const stub = freshStub(async () => ({ available: true, verdicts: [] }), PROVIDERS);
    const UI = loadUI(stub); await UI.init({ nodeName: "Fork" });
    UI._test.setKi({ on: true, key: "x", provider: "mistral" });
    UI._test.toggleKi(); UI._test.toggleKi();
    const b = UI._test.vaultBtns();
    record("Ohne Modul 20 → keine Tresor-Knöpfe (fail-soft)", b.save === false && b.unlock === false);
  }

  let pass = 0;
  for (const r of results) { if (r.ok) pass++; console.log(`[${r.ok ? "OK  " : "FAIL"}] ${r.name}` + (r.ok ? "" : `  → ${r.extra}`)); }
  console.log(`\n${pass}/${results.length} Proben grün`);
  if (pass !== results.length) process.exit(1);
}
run();
