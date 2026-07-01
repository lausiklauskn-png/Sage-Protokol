// Headless smoke test für Modul 24 — OCR-/Bild-Eingabe (Strang B1).
// Run: `node tests/smoke_bau24_ocr_eingabe.mjs`. KEIN echter Netz-Aufruf —
// global.fetch wird gestubbt (Mistral- + Google-Form). Prüft Anbieter-
// Abstraktion, EU-Politik, BYOK/fail-soft, Request-Bau, Extraktion.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
const src = readFileSync(resolve(repoRoot, "src/modules/24_ocr_eingabe.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(
  globalThis, globalThis, globalThis, console,
);
const O = globalThis.SbkimOcr;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra !== undefined ? "  →  " + extra : "")); }
}

// ---- fetch-Stub ----
let stub = "mistral-ok";
let lastReq = null;
globalThis.fetch = async (url, init) => {
  lastReq = { url, init };
  if (stub === "network-error") throw new Error("failed to fetch (Mock)");
  if (stub === "http-500") return { ok: false, status: 500, json: async () => ({}) };
  if (stub === "mistral-ok") {
    return { ok: true, status: 200, json: async () => ({ pages: [{ markdown: "Zeile eins" }, { markdown: "Zeile zwei" }] }) };
  }
  if (stub === "google-ok") {
    return { ok: true, status: 200, json: async () => ({ responses: [{ fullTextAnnotation: { text: "Erkannter Text" } }] }) };
  }
  return { ok: true, status: 200, json: async () => ({}) };
};

// ---- Probe 1: Export/Meta ----
console.log("Probe 1: Export/Meta");
ok("recognize exportiert", typeof O.recognize === "function");
ok("favoriteProvider = mistral", O._meta.favoriteProvider === "mistral");
ok("drei Anbieter", O.getProviders().length === 3);
ok("supportedMime enthält application/pdf", O._meta.supportedMime.indexOf("application/pdf") !== -1);

// ---- Probe 2: EU-Politik + pickProvider ----
console.log("Probe 2: EU-Politik + pickProvider");
ok("frei → 3 Anbieter", O.availableProviders("frei").length === 3);
ok("bindend → nur EU (mistral,google)", JSON.stringify(O.availableProviders("bindend")) === JSON.stringify(["mistral", "google"]));
ok("pick frei = mistral (Favorit)", O.pickProvider("frei") === "mistral");
ok("pick bindend, browser bevorzugt → mistral (browser raus)", O.pickProvider("bindend", "browser") === "mistral");
ok("pick frei, google bevorzugt → google", O.pickProvider("frei", "google") === "google");

// ---- Probe 3: isFileSupported ----
console.log("Probe 3: isFileSupported");
ok("image/png ja", O.isFileSupported("image/png") === true);
ok("IMAGE/JPEG (case) ja", O.isFileSupported("IMAGE/JPEG") === true);
ok("text/plain nein", O.isFileSupported("text/plain") === false);
ok("non-string nein", O.isFileSupported(null) === false);

// ---- Probe 4: Mistral Happy-Path + Request-Bau ----
console.log("Probe 4: Mistral Happy-Path");
{
  stub = "mistral-ok";
  const r = await O.recognize("QUJD", { apiKey: "sk-mistral", mimeType: "image/png" });
  ok("available:true", r.available === true);
  ok("provider mistral", r.provider === "mistral");
  ok("Text aus pages zusammengesetzt", r.text === "Zeile eins\n\nZeile zwei", JSON.stringify(r.text));
  ok("Request an Mistral-URL", lastReq.url === O._meta.mistralOcrUrl);
  ok("Bearer-Header BYOK", lastReq.init.headers["Authorization"] === "Bearer sk-mistral");
  const body = JSON.parse(lastReq.init.body);
  ok("model mistral-ocr-latest", body.model === "mistral-ocr-latest");
  ok("document image_url als data-URL", body.document.image_url === "data:image/png;base64,QUJD");
}

// ---- Probe 5: data-URL-Input wird entpackt ----
console.log("Probe 5: data-URL-Input");
{
  stub = "mistral-ok";
  await O.recognize("data:image/jpeg;base64,ZZZ", { apiKey: "sk", });
  const body = JSON.parse(lastReq.init.body);
  ok("data-URL → reiner base64 im image_url", body.document.image_url === "data:image/jpeg;base64,ZZZ", body.document.image_url);
}

// ---- Probe 6: Google Happy-Path ----
console.log("Probe 6: Google Happy-Path");
{
  stub = "google-ok";
  const r = await O.recognize("QUJD", { provider: "google", apiKey: "g-key" });
  ok("available:true", r.available === true);
  ok("provider google", r.provider === "google");
  ok("fullTextAnnotation extrahiert", r.text === "Erkannter Text");
  ok("URL mit ?key=", lastReq.url === O._meta.googleEuVisionUrl + "?key=g-key");
  const body = JSON.parse(lastReq.init.body);
  ok("DOCUMENT_TEXT_DETECTION", body.requests[0].features[0].type === "DOCUMENT_TEXT_DETECTION");
  ok("image.content base64", body.requests[0].image.content === "QUJD");
}

// ---- Probe 7: Fail-soft ----
console.log("Probe 7: Fail-soft");
{
  stub = "mistral-ok";
  const noKey = await O.recognize("QUJD", { provider: "mistral" });
  ok("kein Schlüssel → available:false", noKey.available === false && /Schlüssel/.test(noKey.reason));
  const noImg = await O.recognize(null, { provider: "mistral", apiKey: "sk" });
  ok("kein Bild → available:false", noImg.available === false && /Bild-Daten/.test(noImg.reason));
  stub = "http-500";
  const http = await O.recognize("QUJD", { provider: "mistral", apiKey: "sk" });
  ok("HTTP 500 → available:false", http.available === false && /HTTP 500/.test(http.reason));
  stub = "network-error";
  const net = await O.recognize("QUJD", { provider: "mistral", apiKey: "sk" });
  ok("Netz-Fehler → available:false + reason", net.available === false && typeof net.reason === "string");
}

// ---- Probe 8: EU-Politik bindend schließt browser aus ----
console.log("Probe 8: EU-Politik bindend");
{
  const r = await O.recognize("QUJD", { provider: "browser", euPolicy: "bindend" });
  ok("browser bei bindend → available:false + Hinweis", r.available === false && /nicht erlaubt/.test(r.reason), JSON.stringify(r));
}

// ---- Probe 9: InvalidEuPolicyError sync ----
console.log("Probe 9: InvalidEuPolicyError");
{
  let threw = false;
  try { O.availableProviders("quatsch"); } catch (e) { threw = e && e.name === "InvalidEuPolicyError"; }
  ok("ungültige euPolicy → InvalidEuPolicyError", threw);
}

// ---- Probe 10: ocrErrorHint ----
console.log("Probe 10: ocrErrorHint");
{
  ok("AbortError-Hinweis", /zu lange/.test(O.ocrErrorHint({ name: "AbortError" })));
  ok("401-Hinweis", /Schlüssel/.test(O.ocrErrorHint({ message: "HTTP 401 unauthorized" })));
  ok("Fallback-Hinweis", /tippen/.test(O.ocrErrorHint("irgendwas")));
  let threw = false;
  try { O.ocrErrorHint(null); } catch (e) { threw = true; }
  ok("ocrErrorHint wirft nie", threw === false);
}

// ---- Probe 11: browser fail-soft ohne TextDetector ----
console.log("Probe 11: Browser fail-soft");
{
  ok("isBrowserOcrSupported false ohne TextDetector", O.isBrowserOcrSupported() === false);
  const r = await O.recognizeBrowser("egal", {});
  ok("recognizeBrowser fail-soft", r.available === false && /nicht verfügbar/.test(r.reason));
}

// ---- Probe 12: init setzt euPolicy ----
console.log("Probe 12: init euPolicy");
{
  O.init({ euPolicy: "bindend" });
  ok("init bindend → _meta.euPolicy", O._meta.euPolicy === "bindend");
  ok("Default-Anbieter jetzt EU-only", O.availableProviders().indexOf("browser") === -1);
  O.init({ euPolicy: "frei" }); // reset
}

console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
process.exit(fail === 0 ? 0 : 1);
