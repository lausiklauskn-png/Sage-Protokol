/* Headless-Smoke — Modul 19 Andock-Wizard (kopierbar).
 *
 * Prüft die reinen Funktionen (Pages-URL-Ableitung, Spore-Vorlage,
 * status.json-Zeile, PR-Link, generate). KEIN DOM nötig — mount() ist
 * Browser-only und wird hier nicht ausgeführt.
 *
 * Lauf:  node tests/smoke_bau19_andock_wizard.mjs   (erwartet alle grün)
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AW = require(join(ROOT, "src/modules/19_andock_wizard.js"));

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra ? "  — " + extra : "")); }
}

console.log("Smoke: Modul 19 Andock-Wizard");

// Pages-URL-Ableitung
ok("repoToPagesUrl github.com → owner.github.io/name/",
  AW.repoToPagesUrl("https://github.com/lausiklauskn-png/Mein-Rezeptbuch")
    === "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/");
ok("repoToPagesUrl mit Trailing-Slash",
  AW.repoToPagesUrl("https://github.com/user/repo/")
    === "https://user.github.io/repo/");
ok("repoToPagesUrl Nicht-GitHub bleibt unverändert",
  AW.repoToPagesUrl("https://example.org/foo") === "https://example.org/foo");

// Knoten-Name
ok("repoToNodeName kapitalisiert letztes Segment",
  AW.repoToNodeName("https://github.com/user/mein-knoten") === "Mein-knoten");
ok("repoToNodeName Fallback auf Domain",
  AW.repoToNodeName("kaputt", "Kochrezepte") === "Kochrezepte");

// Spore-Vorlage
const spore = AW.buildSporeTemplate({
  repo: "https://github.com/user/repo", domain: "Kochrezepte", nodeType: "hybrid",
  id: "fixed-id", createdAt: "2026-06-20T00:00:00.000Z"
});
ok("Spore hat alle Pflichtfelder",
  spore.schemaVersion === 1 && spore.protocolVersion === "0.1" &&
  spore.id === "fixed-id" && spore.domain === "Kochrezepte" &&
  spore.nodeType === "hybrid" && spore.endpoint === "https://user.github.io/repo/" &&
  spore.embeddingModel === "Xenova/multilingual-e5-small" &&
  spore.createdAt === "2026-06-20T00:00:00.000Z",
  JSON.stringify(spore));
ok("Spore ist UNSIGNIERT (kein sig/pubKey-Feld)",
  !("sig" in spore) && !("signature" in spore) && !("pubKey" in spore));
ok("ungültiger nodeType fällt auf hybrid zurück",
  AW.buildSporeTemplate({ repo: "x", domain: "d", nodeType: "boese" }).nodeType === "hybrid");
ok("ohne id wird eine erzeugt",
  typeof AW.buildSporeTemplate({ repo: "x", domain: "d" }).id === "string" &&
  AW.buildSporeTemplate({ repo: "x", domain: "d" }).id.length >= 8);

// status.json-Zeile
ok("buildStatusLine erzeugt valides JSON-Fragment",
  AW.buildStatusLine({ name: "Repo", domain: "Kochrezepte", url: "https://u.github.io/r/" })
    === '    { "name": "Repo", "domain": "Kochrezepte", "integrated": true, "url": "https://u.github.io/r/" }');

// PR-URL
const pr = AW.buildPrUrl({ name: "Repo", domain: "Kochrezepte", nodeType: "hybrid", pagesUrl: "https://u.github.io/r/" });
ok("buildPrUrl zeigt auf status.json-edit + quick_pull",
  pr.indexOf("/edit/main/status.json?quick_pull=1") >= 0 &&
  pr.indexOf("message=") >= 0 && pr.indexOf("description=") >= 0, pr);
ok("buildPrUrl respektiert eigenen statusRepoUrl",
  AW.buildPrUrl({ statusRepoUrl: "https://github.com/o/r", name: "X" })
    .indexOf("https://github.com/o/r/edit/main/status.json") === 0);

// generate (Bündel)
const g = AW.generate({ repo: "https://github.com/user/repo", domain: "Kochrezepte", nodeType: "provider", id: "id2", createdAt: "2026-06-20T00:00:00.000Z" });
ok("generate liefert spore + statusLine + prUrl + pagesUrl + name",
  g.spore && g.statusLine && g.prUrl && g.pagesUrl === "https://user.github.io/repo/" && g.name === "Repo");
ok("generate-Spore übernimmt nodeType",
  g.spore.nodeType === "provider");

// _meta
ok("_meta listet die drei Knotentypen",
  Array.isArray(AW._meta.nodeTypes) && AW._meta.nodeTypes.length === 3);

console.log("\nErgebnis: " + pass + "/" + (pass + fail) + " grün");
if (fail > 0) process.exit(1);
