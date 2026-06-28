// Headless smoke — Inhalts-treuer Domänen-Vektor (2026-06-28).
// Run with `node tests/smoke_inhaltstreuer_domainvektor.mjs`
// after `npm install --no-save fake-indexeddb`.
//
// Beweist die Modul-Logik des „beschreibe den Knoten durch seinen INHALT
// statt durch seine Hülle"-Baus:
//   A) Modul 03 embedContentVector — Schwerpunkt-Vektor aus Inhalts-
//      Schnipseln (384-dim, L2-normalisiert, Deckel, fail-soft).
//   B) Modul 02 regenerateOwnSpore — gleiche nodeId, neu signiert,
//      embeddingSource/embeddingVersion in der signierten Spore, Felder
//      bleiben erhalten, verifyForeignSpore weiter gültig.
//   C) Demonstration — zwei Knoten mit IDENTISCHER Beschreibung, aber
//      verschiedenem Inhalt (Kuchen vs. Sushi) bekommen UNTERSCHIEDLICHE
//      Vektoren; aus der Beschreibung allein wären sie identisch.
//
// Das echte e5-Modell läuft nur im Browser (~30 MB Download). Hier wird
// ein DETERMINISTISCHES Fake-Modell per data:-URL eingespielt (jeder Text
// → reproduzierbarer Einheits-Vektor), damit die Vektor-Mathematik + die
// Spore-Verdrahtung headless beweisbar sind. Der echte Live-Match wartet
// auf Klaus' Browser-Lauf.

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}

// Deterministisches Fake-Modell als data:-URL-Modul. Liefert pro Text einen
// reproduzierbaren, L2-normalisierten 384-Vektor (FNV-Hash → LCG-Zufall).
const FAKE_MODEL = `
export function pipeline(){
  return async function(texts){
    const dim=384;const data=new Float32Array(texts.length*dim);
    for(let i=0;i<texts.length;i++){
      let h=2166136261;const s=String(texts[i]);
      for(let c=0;c<s.length;c++){h^=s.charCodeAt(c);h=Math.imul(h,16777619);}
      let seed=h>>>0;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
      let n=0;const base=i*dim;
      for(let d=0;d<dim;d++){const v=rnd()-0.5;data[base+d]=v;n+=v*v;}
      n=Math.sqrt(n)||1;for(let d=0;d<dim;d++)data[base+d]/=n;
    }
    return {data};
  };
}
export const env={};
`;
const FAKE_URL = "data:text/javascript," + encodeURIComponent(FAKE_MODEL);

function loadModule(relPath, transform) {
  let src = readFileSync(resolve(repoRoot, relPath), "utf8");
  if (transform) src = transform(src);
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
    "TextEncoder", "TextDecoder", "indexedDB", src
  )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
    globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB);
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
// Modul 03 mit Fake-Modell statt CDN laden.
loadModule("src/modules/03_embedding.js", (src) =>
  src.replace(
    '"https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"',
    JSON.stringify(FAKE_URL)
  ));

const SbkimSpore = globalThis.SbkimSpore;
const SbkimEmbedding = globalThis.SbkimEmbedding;

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });

function l2(v) { let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i]; return Math.sqrt(s); }
function cos(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }

async function run() {
  // ---- A) embedContentVector ----
  record("Modul 03 — embedContentVector exportiert", "function",
    typeof SbkimEmbedding.embedContentVector, typeof SbkimEmbedding.embedContentVector === "function");

  const cakeSamples = [
    "Käsekuchen mit Quark und Vanille",
    "Apfelkuchen mit Streuseln",
    "Schokoladentorte dreistöckig",
    { label: "Marmorkuchen", text: "Rührteig mit Kakao-Marmorierung" },
  ];
  const resCake = await SbkimEmbedding.embedContentVector(cakeSamples);
  record("embedContentVector — Vektor Länge 384", "384", String(resCake.vector.length), resCake.vector.length === 384);
  record("embedContentVector — L2-Norm ≈ 1.0", "≈1.0", l2(resCake.vector).toFixed(5),
    Math.abs(l2(resCake.vector) - 1) < 1e-4);
  record("embedContentVector — count = 4", "4", String(resCake.count), resCake.count === 4);
  record("embedContentVector — source 'content'", "content", resCake.source, resCake.source === "content");

  // Deckel: opts.max begrenzt die Anzahl gesampelter Schnipsel.
  const many = Array.from({ length: 50 }, (_, i) => "Eintrag Nummer " + i);
  const capped = await SbkimEmbedding.embedContentVector(many, { max: 8 });
  record("embedContentVector — Deckel max=8 greift", "8", String(capped.count), capped.count === 8);

  // Fail-soft: leere/whitespace-Einträge werden übersprungen, nicht-leere bleiben.
  const mixed = await SbkimEmbedding.embedContentVector(["", "   ", "Echter Inhalt", null, { foo: 1 }]);
  record("embedContentVector — leere Einträge fail-soft übersprungen", "1", String(mixed.count), mixed.count === 1);

  // Alle leer → EmptyInputError.
  let threwEmpty = false;
  try { await SbkimEmbedding.embedContentVector(["", "  "]); } catch (e) { threwEmpty = e && e.name === "EmptyInputError"; }
  record("embedContentVector — alle leer → EmptyInputError", "true", String(threwEmpty), threwEmpty);

  // Kein Array → EmbeddingError.
  let threwType = false;
  try { await SbkimEmbedding.embedContentVector("kein array"); } catch (e) { threwType = e && e.name === "EmbeddingError"; }
  record("embedContentVector — Nicht-Array → EmbeddingError", "true", String(threwType), threwType);

  // ---- B) regenerateOwnSpore ----
  record("Modul 02 — regenerateOwnSpore exportiert", "function",
    typeof SbkimSpore.regenerateOwnSpore, typeof SbkimSpore.regenerateOwnSpore === "function");

  await SbkimSpore.init();
  const descVec = await SbkimEmbedding.embedPassage("Mycel-Bibliothek: SBKIM-Glossar und Protokoll-Doku");
  const spore1 = await SbkimSpore.generateOwnSpore({
    domain: "sage.example",
    nodeType: "hybrid",
    endpoint: "https://example.org/sage/",
    nodeName: "Sage",
    domainDescription: "Die Mycel-Bibliothek.",
    domainKeywords: ["Glossar", "Protokoll"],
    domainVector: Array.from(descVec),
    embeddingNeeds: Array.from(descVec),
    embeddingSource: "description",
    embeddingVersion: 1,
  });
  record("generateOwnSpore — embeddingSource signiert", "description", spore1.embeddingSource, spore1.embeddingSource === "description");
  record("generateOwnSpore — embeddingVersion signiert", "1", String(spore1.embeddingVersion), spore1.embeddingVersion === 1);
  record("generateOwnSpore — embeddingNeeds in Allow-List", "384",
    String(Array.isArray(spore1.embeddingNeeds) ? spore1.embeddingNeeds.length : "fehlt"),
    Array.isArray(spore1.embeddingNeeds) && spore1.embeddingNeeds.length === 384);

  const v1 = await SbkimSpore.verifyForeignSpore(spore1);
  record("Spore 1 — signatur gültig", "valid", v1.valid ? "valid" : ("invalid: " + v1.reason), v1.valid === true);

  // Re-Embedding: inhalts-treuen Vektor herein, gleiche Identität neu signieren.
  const spore2 = await SbkimSpore.regenerateOwnSpore({
    domainVector: Array.from(resCake.vector),
    embeddingSource: "content",
  });
  record("regenerateOwnSpore — nodeId stabil (gleiche Identität)", spore1.id, spore2.id, spore2.id === spore1.id);
  record("regenerateOwnSpore — embeddingSource -> content", "content", spore2.embeddingSource, spore2.embeddingSource === "content");
  record("regenerateOwnSpore — embeddingVersion hochgezählt", "2", String(spore2.embeddingVersion), spore2.embeddingVersion === 2);
  record("regenerateOwnSpore — nodeName erhalten", "Sage", spore2.nodeName, spore2.nodeName === "Sage");
  record("regenerateOwnSpore — embeddingNeeds erhalten", "384",
    String(Array.isArray(spore2.embeddingNeeds) ? spore2.embeddingNeeds.length : "fehlt"),
    Array.isArray(spore2.embeddingNeeds) && spore2.embeddingNeeds.length === 384);
  record("regenerateOwnSpore — domainVector ersetzt",
    "content-Vektor", spore2.domainVector[0] === spore1.domainVector[0] ? "unverändert" : "ersetzt",
    spore2.domainVector[0] !== spore1.domainVector[0]);

  const v2 = await SbkimSpore.verifyForeignSpore(spore2);
  record("Spore 2 — signatur gültig nach Re-Sign", "valid", v2.valid ? "valid" : ("invalid: " + v2.reason), v2.valid === true);

  // regenerateOwnSpore ohne Vektor-Änderung: Version bleibt, Felder bleiben.
  const spore3 = await SbkimSpore.regenerateOwnSpore({ nodeName: "Sage (neu benannt)" });
  record("regenerateOwnSpore — ohne Vektor-Änderung: Version stabil", "2", String(spore3.embeddingVersion), spore3.embeddingVersion === 2);
  record("regenerateOwnSpore — Teil-Update überschreibt nodeName", "Sage (neu benannt)", spore3.nodeName, spore3.nodeName === "Sage (neu benannt)");

  // ---- C) Demonstration: Hülle gleich, Inhalt verschieden → Vektor verschieden ----
  const sushiSamples = [
    "Maki-Rolle mit Lachs und Avocado",
    "Nigiri mit Thunfisch",
    "Sashimi-Platte gemischt",
    { label: "California Roll", text: "Inside-Out mit Surimi und Gurke" },
  ];
  const resSushi = await SbkimEmbedding.embedContentVector(sushiSamples);

  // Beide „Knoten" hätten dieselbe Beschreibung („Ein Rezeptbuch.") → gleicher
  // Beschreibungs-Vektor. Der INHALT trennt sie.
  const sharedDescVec = await SbkimEmbedding.embedPassage("Ein Rezeptbuch.");
  const descCos = cos(sharedDescVec, sharedDescVec);
  const contentCos = cos(resCake.vector, resSushi.vector);
  record("Demo — gleiche Beschreibung: Beschreibungs-Cosinus = 1.0", "1.0", descCos.toFixed(4), Math.abs(descCos - 1) < 1e-4);
  record("Demo — Kuchen vs. Sushi: Inhalts-Vektoren UNTERSCHIEDLICH (cos < 0.99)",
    "< 0.99", contentCos.toFixed(4), contentCos < 0.99);

  // Print
  let green = 0;
  for (const r of results) { if (r.ok) green++; }
  console.log("\n  Probe | erwartet | erhalten | ok");
  console.log("  ------|----------|----------|----");
  for (const r of results) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.probe} | ${r.expected} | ${r.actual}`);
  }
  console.log(`\nTotal: ${results.length} Proben, ${green} grün, ${results.length - green} rot.`);
  if (green !== results.length) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
