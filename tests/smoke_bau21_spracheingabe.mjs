// Headless smoke test für Bau 21 Spracheingabe (Modul 21, window.SbkimSpeech).
// Run mit `node tests/smoke_bau21_spracheingabe.mjs`. KEIN echtes Mikrofon /
// Netz — die Browser-Engine (Web Speech) und MediaRecorder sind im Node-Lauf
// nicht vorhanden (fail-soft-Pfad wird geprüft); recognizeEU läuft gegen einen
// fetch-Stub. Geprüft werden die reinen Logik-Eigenschaften:
//   - Sprach-Array + alternativeLanguageCodes,
//   - EU-Politik (frei → beide Engines, bindend → nur EU), pickEngine,
//   - fail-soft überall (kein Throw bei fehlendem Browser/Mic/Key/Netz),
//   - recognizeEU Happy-Path + Request-Form + HTTP-/Netz-Fehler,
//   - init() setzt die Laufzeit-EU-Politik.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
const src = readFileSync(resolve(repoRoot, "src/modules/21_spracheingabe.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(
  globalThis, globalThis, globalThis, console,
);

const S = globalThis.SbkimSpeech;

// ---- fetch-Stub für recognizeEU ----
let euBehavior = "ok";
let lastReq = null;
globalThis.fetch = async (url, init) => {
  lastReq = { url, init, body: init && init.body ? JSON.parse(init.body) : null };
  if (euBehavior === "network") throw new Error("getaddrinfo ENOTFOUND");
  if (euBehavior === "http403") return { ok: false, status: 403, json: async () => ({}) };
  if (euBehavior === "empty") return { ok: true, status: 200, json: async () => ({ results: [] }) };
  return {
    ok: true, status: 200,
    json: async () => ({ results: [{ alternatives: [{ transcript: "hallo welt" }] }] }),
  };
};

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}
function arrEq(a, b) { return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]); }

async function run() {
  // ---- Probe 1: Export-Anker + _meta ----
  for (const fn of ["init", "getLanguages", "alternativeCodes", "availableEngines",
    "pickEngine", "isBrowserSupported", "makeBrowserRecognizer", "startRecording",
    "recognizeEU", "speechErrorHint", "InvalidEuPolicyError"]) {
    record("Probe 1: " + fn + " exportiert", "function", typeof S[fn], typeof S[fn] === "function");
  }
  // Zwoelf seit 2026-08-12 (Klaus: „wenn ich in Arabisch etwas hineinspreche,
  // muss auch Arabisch als Text herauskommen"). Geprueft wird die ZAHL und die
  // REIHENFOLGE des ersten Eintrags: Aufrufer, die ohne eigene Wahl einfach
  // getLanguages()[0] nehmen, muessen sich unveraendert verhalten.
  record("Probe 1: _meta.languages (12)", "12", String(S._meta.languages.length), S._meta.languages.length === 12);
  record("Probe 1: Deutsch bleibt der erste Eintrag", "de-DE", S._meta.languages[0][0], S._meta.languages[0][0] === "de-DE");
  record("Probe 1: Paschtu ist dabei", "true",
    String(S._meta.languages.some((p) => p[0] === "ps-AF")), S._meta.languages.some((p) => p[0] === "ps-AF"));
  record("Probe 1: Dari ist dabei", "true",
    String(S._meta.languages.some((p) => p[0] === "fa-IR")), S._meta.languages.some((p) => p[0] === "fa-IR"));
  record("Probe 1: _meta.euPolicyDefault", "frei", S._meta.euPolicyDefault, S._meta.euPolicyDefault === "frei");
  record("Probe 1: _meta.engines (2)", "2", String(S._meta.engines.length), S._meta.engines.length === 2);

  // ---- Probe 2: getLanguages liefert Kopie (keine Mutation nach innen) ----
  const langs = S.getLanguages();
  langs.push(["xx-XX", "Hack"]);
  record("Probe 2: getLanguages ist Kopie", "12", String(S.getLanguages().length), S.getLanguages().length === 12);

  // ---- Probe 3: alternativeCodes ----
  // GEDECKELT AUF DREI: Google Cloud Speech-to-Text nimmt in
  // alternativeLanguageCodes hoechstens drei Eintraege. Solange die Liste drei
  // Sprachen lang war, fiel das nicht auf — mit zwoelf haette jede EU-Anfrage
  // abgelehnt werden koennen. Die Probe haelt den Deckel fest.
  record("Probe 3: alternativeCodes(de-DE) — hoechstens drei", "en-US,ru-RU,ar-SA",
    S.alternativeCodes("de-DE").join(","), arrEq(S.alternativeCodes("de-DE"), ["en-US", "ru-RU", "ar-SA"]));
  record("Probe 3: der gewaehlte Code ist nie dabei", "true",
    String(S.alternativeCodes("ar-SA").indexOf("ar-SA") === -1), S.alternativeCodes("ar-SA").indexOf("ar-SA") === -1);

  // ---- Probe 4: EU-Politik → Engines ----
  record("Probe 4: availableEngines(frei)", "browser,eu",
    S.availableEngines("frei").join(","), arrEq(S.availableEngines("frei"), ["browser", "eu"]));
  record("Probe 4: availableEngines(bindend)", "eu",
    S.availableEngines("bindend").join(","), arrEq(S.availableEngines("bindend"), ["eu"]));
  record("Probe 4: availableEngines() default=frei", "browser,eu",
    S.availableEngines().join(","), arrEq(S.availableEngines(), ["browser", "eu"]));

  // ---- Probe 5: pickEngine ----
  record("Probe 5: pickEngine(frei, eu)", "eu", S.pickEngine("frei", "eu"), S.pickEngine("frei", "eu") === "eu");
  record("Probe 5: pickEngine(bindend, browser)→eu", "eu",
    S.pickEngine("bindend", "browser"), S.pickEngine("bindend", "browser") === "eu");
  record("Probe 5: pickEngine(frei) default browser", "browser",
    S.pickEngine("frei"), S.pickEngine("frei") === "browser");

  // ---- Probe 6: ungültige euPolicy → sync Throw ----
  let threw = false;
  try { S.availableEngines("quatsch"); } catch (e) { threw = e.name === "InvalidEuPolicyError"; }
  record("Probe 6: availableEngines('quatsch') wirft InvalidEuPolicyError", "true", String(threw), threw === true);

  // ---- Probe 7: kein Browser-Support in Node ----
  record("Probe 7: isBrowserSupported() false in Node", "false",
    String(S.isBrowserSupported()), S.isBrowserSupported() === false);

  // ---- Probe 8: makeBrowserRecognizer fail-soft (kein Throw) ----
  let errHint = null;
  const recz = S.makeBrowserRecognizer({ onError: (h) => { errHint = h; } });
  record("Probe 8: recognizer.supported false", "false", String(recz.supported), recz.supported === false);
  let startThrew = false;
  try { recz.start(); } catch (e) { startThrew = true; }
  record("Probe 8: start() wirft nicht", "false", String(startThrew), startThrew === false);
  record("Probe 8: onError liefert Hinweis", "true", String(typeof errHint === "string" && errHint.length > 0),
    typeof errHint === "string" && errHint.length > 0);

  // ---- Probe 9: recognizeEU ohne Key → fail-soft ----
  const noKey = await S.recognizeEU("base64audio", {});
  record("Probe 9: recognizeEU ohne Key available:false", "false", String(noKey.available), noKey.available === false);
  record("Probe 9: reason gesetzt", "true", String(!!noKey.reason), !!noKey.reason);

  // ---- Probe 10: recognizeEU Happy-Path + Request-Form ----
  euBehavior = "ok";
  const okEU = await S.recognizeEU("base64audio", { apiKey: "k", languageCode: "de-DE" });
  record("Probe 10: available:true", "true", String(okEU.available), okEU.available === true);
  record("Probe 10: transcript", "hallo welt", okEU.transcript, okEU.transcript === "hallo welt");
  record("Probe 10: Request languageCode", "de-DE",
    lastReq.body.config.languageCode, lastReq.body.config.languageCode === "de-DE");
  record("Probe 10: Request alternativeLanguageCodes (hoechstens drei)", "en-US,ru-RU,ar-SA",
    (lastReq.body.config.alternativeLanguageCodes || []).join(","),
    arrEq(lastReq.body.config.alternativeLanguageCodes, ["en-US", "ru-RU", "ar-SA"]));
  record("Probe 10: Request audio.content", "base64audio",
    lastReq.body.audio.content, lastReq.body.audio.content === "base64audio");
  record("Probe 10: URL trägt key", "true",
    String(lastReq.url.indexOf("key=k") !== -1), lastReq.url.indexOf("key=k") !== -1);

  // ---- Probe 11: recognizeEU Netz-Fehler → fail-soft (kein Throw) ----
  euBehavior = "network";
  let netThrew = false; let netOut = null;
  try { netOut = await S.recognizeEU("base64audio", { apiKey: "k" }); } catch (e) { netThrew = true; }
  record("Probe 11: Netz-Fehler wirft nicht", "false", String(netThrew), netThrew === false);
  record("Probe 11: available:false", "false", String(netOut && netOut.available), netOut && netOut.available === false);

  // ---- Probe 12: recognizeEU HTTP 403 → fail-soft ----
  euBehavior = "http403";
  const http = await S.recognizeEU("base64audio", { apiKey: "k" });
  record("Probe 12: HTTP 403 available:false", "false", String(http.available), http.available === false);

  // ---- Probe 13: speechErrorHint deutsch + kein Throw ----
  record("Probe 13: not-allowed Hinweis", "true",
    String(/Mikrofon/.test(S.speechErrorHint({ name: "not-allowed" }))),
    /Mikrofon/.test(S.speechErrorHint({ name: "not-allowed" })));
  record("Probe 13: no-speech Hinweis", "true",
    String(/erkannt/.test(S.speechErrorHint({ error: "no-speech" }))),
    /erkannt/.test(S.speechErrorHint({ error: "no-speech" })));

  // ---- Probe 14: startRecording fail-soft ohne Mikrofon ----
  const rec = await S.startRecording();
  record("Probe 14: startRecording ohne Mic available:false", "false", String(rec.available), rec.available === false);

  // ---- Probe 15: init() setzt Laufzeit-EU-Politik ----
  S.init({ euPolicy: "bindend" });
  record("Probe 15: init bindend → _meta.euPolicy", "bindend", S._meta.euPolicy, S._meta.euPolicy === "bindend");
  record("Probe 15: availableEngines() jetzt nur eu", "eu",
    S.availableEngines().join(","), arrEq(S.availableEngines(), ["eu"]));
  S.init({ euPolicy: "frei" }); // zurücksetzen
  record("Probe 15: init frei zurückgesetzt", "frei", S._meta.euPolicy, S._meta.euPolicy === "frei");

  // ---- Probe 16: init mit ungültiger euPolicy → sync Throw ----
  let initThrew = false;
  try { S.init({ euPolicy: "halbeu" }); } catch (e) { initThrew = e.name === "InvalidEuPolicyError"; }
  record("Probe 16: init('halbeu') wirft InvalidEuPolicyError", "true", String(initThrew), initThrew === true);

  // ---- Probe 17: languageLabel / isRtl ----
  record("Probe 17: languageLabel(ar-SA)", "العربية", S.languageLabel("ar-SA"), S.languageLabel("ar-SA") === "العربية");
  record("Probe 17: languageLabel(unbekannt) → der Code selbst", "zz-ZZ",
    S.languageLabel("zz-ZZ"), S.languageLabel("zz-ZZ") === "zz-ZZ");
  record("Probe 17: isRtl(ps-AF)", "true", String(S.isRtl("ps-AF")), S.isRtl("ps-AF") === true);
  record("Probe 17: isRtl(de-DE)", "false", String(S.isRtl("de-DE")), S.isRtl("de-DE") === false);

  // ---- Probe 18: der STILLE Fehlschlag (Klaus' Sichttest 2026-08-11) ----
  // Paschtu kam als „Salaam" in LATEINISCHEN Buchstaben zurück, ganz OHNE
  // Fehler. speechErrorHint kann da nicht greifen, weil es keinen Fehler gibt.
  // Geprüft wird beides: dass die Kontrolle anschlägt UND dass sie schweigt,
  // wenn die Schrift stimmt — sonst wäre sie nur lästig.
  const schief = S.scriptMismatchHint("Salaam", "ps-AF");
  record("Probe 18: Paschtu + lateinischer Text → Hinweis", "true",
    String(!!schief && /پښتو/.test(schief) && /lateinischer Schrift/.test(schief)),
    !!schief && /پښتو/.test(schief) && /lateinischer Schrift/.test(schief));
  record("Probe 18: Arabisch + arabischer Text → still", "null",
    String(S.scriptMismatchHint("سلام عليكم", "ar-SA")), S.scriptMismatchHint("سلام عليكم", "ar-SA") === null);
  record("Probe 18: Russisch + kyrillischer Text → still", "null",
    String(S.scriptMismatchHint("Здравствуйте", "ru-RU")), S.scriptMismatchHint("Здравствуйте", "ru-RU") === null);
  record("Probe 18: Russisch + lateinischer Text → Hinweis", "true",
    String(!!S.scriptMismatchHint("Zdravstvuyte", "ru-RU")), !!S.scriptMismatchHint("Zdravstvuyte", "ru-RU"));
  record("Probe 18: Deutsch → nie ein Vorwurf", "null",
    String(S.scriptMismatchHint("Guten Tag zusammen", "de-DE")), S.scriptMismatchHint("Guten Tag zusammen", "de-DE") === null);
  record("Probe 18: zu kurz für ein Urteil (< 4 Zeichen)", "null",
    String(S.scriptMismatchHint("ok", "ps-AF")), S.scriptMismatchHint("ok", "ps-AF") === null);

  // ---- Probe 19: die Geräte-Sprache entscheidet vor ----
  // Das ist der Fall, der zählt: wer erst eine Einstellung finden muss, um
  // verstanden zu werden, benutzt das Mikrofon nicht. Das Modul wird dafür mit
  // einem eigenen `navigator` neu geladen — in Node ist globalThis.navigator
  // eingebaut und lässt sich nicht einfach überschreiben.
  const mitGeraet = (languages) => {
    const fake = { navigator: { languages }, console };
    new Function("global", "window", "globalThis", "console", src)(fake, fake, fake, console);
    return fake.SbkimSpeech;
  };
  record("Probe 19: Gerät arabisch → ar-SA", "ar-SA",
    mitGeraet(["ar-EG", "de-DE"]).preferredLanguage(null), mitGeraet(["ar-EG", "de-DE"]).preferredLanguage(null) === "ar-SA");
  record("Probe 19: Gerät Paschtu → ps-AF", "ps-AF",
    mitGeraet(["ps-AF"]).preferredLanguage(null), mitGeraet(["ps-AF"]).preferredLanguage(null) === "ps-AF");
  // Sprache nicht in der Liste → ehrliche Vorgabe statt Raten.
  record("Probe 19: Gerät japanisch → bleibt bei Deutsch", "de-DE",
    mitGeraet(["ja-JP"]).preferredLanguage(null), mitGeraet(["ja-JP"]).preferredLanguage(null) === "de-DE");
  // Eine getroffene Wahl schlägt die Geräte-Sprache — sonst wäre sie wertlos.
  record("Probe 19: getroffene Wahl schlägt das Gerät", "ru-RU",
    mitGeraet(["ar-EG"]).preferredLanguage("ru-RU"), mitGeraet(["ar-EG"]).preferredLanguage("ru-RU") === "ru-RU");
  // Müll im Speicher darf nicht durchschlagen.
  record("Probe 19: unbekannte gemerkte Wahl wird verworfen", "ar-SA",
    mitGeraet(["ar-EG"]).preferredLanguage("xx-XX"), mitGeraet(["ar-EG"]).preferredLanguage("xx-XX") === "ar-SA");
  // Kein navigator (alter Browser, Node) → kein Absturz.
  const ohne = (() => { const f = { console }; new Function("global","window","globalThis","console",src)(f,f,f,console); return f.SbkimSpeech; })();
  record("Probe 19: ohne navigator → fail-soft Deutsch", "de-DE",
    ohne.preferredLanguage(null), ohne.preferredLanguage(null) === "de-DE");
}

const finalize = () => {
  let allOk = true;
  console.log("\n=== Bau 21 Spracheingabe Smoke-Test ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
    if (!r.ok) allOk = false;
  }
  console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
  if (!allOk) process.exit(1);
};

run().then(finalize).catch((err) => {
  console.error("Smoke-Test-Runner hat unerwartet geworfen:", err);
  process.exit(1);
});
