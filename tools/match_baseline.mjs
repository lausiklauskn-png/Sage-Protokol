/* Match-Boden-Analyse — empirischer Beleg für die e5-small-Anisotropie.
 *
 * Liest die echten domainVector der bekannten Knoten (aus den Inbox-Kopien +
 * Sages eigener Spore) und zeigt, dass der ROHE Cosinus einen hohen „Boden"
 * (~0.79) hat: zwei unverwandte Domänen liegen schon nahe 0.80. Nach Abzug
 * des Mittelwert-Vektors (Zentrierung ≈ Whitening-light) bricht das Signal auf,
 * und nur echte Verwandtschaft bleibt positiv.
 *
 * KEIN Embedding nötig (nutzt vorhandene, real eingebettete Vektoren) → läuft
 * headless. Für einen Boden aus ECHTEN Zufallstexten (nicht-Domänen-Stil)
 * braucht es ein Browser-Embedding (siehe docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md).
 *
 * Lauf:  node tools/match_baseline.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = {
  Sage: "sbkim/spore.json",
  Rezeptbuch: "sbkim/rezeptbuch_inbox.json",
  Mixarium: "sbkim/mixarium_inbox.json",
  Point: "sbkim/point_inbox.json",
  Jason: "sbkim/jason_inbox.json",
  MeinTresor: "sbkim/meintresor_inbox.json",
  BookLedger: "sbkim/bookledgerpro_inbox.json",
};
// Bekannte ECHTE Verwandtschaften (zur Trennung Signal vs. Boden).
const RELATED = new Set(["Jason/MeinTresor", "Mixarium/Rezeptbuch"]);

const V = {};
for (const [k, f] of Object.entries(SOURCES)) {
  try {
    const j = JSON.parse(readFileSync(join(ROOT, f), "utf8"));
    if (Array.isArray(j.domainVector) && j.domainVector.length === 384) V[k] = j.domainVector;
  } catch { /* fehlt → überspringen */ }
}
const keys = Object.keys(V);
const norm = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
const cos = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) d += a[i] * b[i]; return d / (norm(a) * norm(b)); };
const pairKey = (a, b) => [a, b].sort().join("/");

console.log("Match-Boden-Analyse — " + keys.length + " Vektoren: " + keys.join(", ") + "\n");

function pairs(vecOf) {
  const out = [];
  for (let i = 0; i < keys.length; i++)
    for (let j = i + 1; j < keys.length; j++)
      out.push([pairKey(keys[i], keys[j]), cos(vecOf(keys[i]), vecOf(keys[j]))]);
  return out.sort((x, y) => y[1] - x[1]);
}
function stats(list) {
  const xs = list.map((p) => p[1]);
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length);
  return { mean, sd, min: Math.min(...xs), max: Math.max(...xs) };
}

// 1) ROH
const raw = pairs((k) => V[k]);
console.log("=== ROH-Cosinus (aktuelles Modul-04-Verfahren) ===");
raw.forEach((p) => console.log("  " + p[0].padEnd(24) + p[1].toFixed(4) + (RELATED.has(p[0]) ? "   <- echte Verwandtschaft" : "")));
const rawCross = raw.filter((p) => !RELATED.has(p[0]));
const rs = stats(rawCross);
console.log("\n  Unverwandte Paare (Boden): mean " + rs.mean.toFixed(4) + " · sd " + rs.sd.toFixed(4) +
  " · Spanne " + rs.min.toFixed(4) + "–" + rs.max.toFixed(4));
console.log("  -> Schwelle 0.80 liegt im Boden (mean+1sd = " + (rs.mean + rs.sd).toFixed(4) + ").");
console.log("  -> empirisch fairere Schwelle ~ mean+2sd = " + (rs.mean + 2 * rs.sd).toFixed(4));

// 2) ZENTRIERT (Mean abziehen = Anisotropie raus, Whitening-light)
const dim = 384, mean = new Array(dim).fill(0);
keys.forEach((k) => { for (let i = 0; i < dim; i++) mean[i] += V[k][i] / keys.length; });
const C = {}; keys.forEach((k) => { C[k] = V[k].map((x, i) => x - mean[i]); });
const cen = pairs((k) => C[k]);
console.log("\n=== ZENTRIERT (Mean-Abzug ≈ Whitening-light) ===");
cen.forEach((p) => console.log("  " + p[0].padEnd(24) + p[1].toFixed(4) + (RELATED.has(p[0]) ? "   <- echte Verwandtschaft" : "")));
console.log("\nFazit: roh ist alles ~0.79–0.85 (Boden); zentriert bleiben nur die echten");
console.log("Verwandtschaften positiv, der Rest fällt auf ~0 oder negativ. Der hohe Roh-Wert");
console.log("misst die Modell-Anisotropie, nicht die Themen-Nähe. Caveat: Boden aus 7 Domänen-");
console.log("Vektoren ist illustrativ; sauberes Whitening braucht ein größeres Referenz-Korpus.");
