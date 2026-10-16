// Gegenprobe S5b „Bürgen für fremde Apps in den Märkten" Teil 1 — jeder Riegel
// wird in einer WEGWERF-KOPIE einzeln weggenommen; tests/smoke_s5b_buergen_maerkte.mjs
// muss dann rot werden, und die erste rote Zeile muss den Namen der Zusicherung tragen.
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft (Sekunden).
// NUR_FALL="…" → nur Fälle, deren Name das enthält.
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const M23 = "src/modules/23_rendezvous.js";
const UI = "src/modules/23_rendezvous_ui.js";
const FAELLE = [
  { name: "die auffällige App behält ihre Bürgschaft", datei: M23,
    alt: "var kanten = k.kanten.filter(function (b) { return aufgefallen.indexOf(b.subject) === -1; });", neu: "var kanten = k.kanten;", rot: "H1" },
  { name: "der Bürge haftet wieder für alle seine Bürgschaften", datei: M23,
    alt: "var kanten = k.kanten.filter(function (b) { return aufgefallen.indexOf(b.subject) === -1; });",
    neu: "var haftet = {}; k.kanten.forEach(function (b) { if (aufgefallen.indexOf(b.subject) !== -1) haftet[b.voucher] = true; }); var kanten = k.kanten.filter(function (b) { return !haftet[b.voucher]; });", rot: "H2" },
  { name: "Frist wieder 365 Tage", datei: M23,
    alt: "var RDV_VOUCH_TTL_SEC = 180 * 24 * 3600;", neu: "var RDV_VOUCH_TTL_SEC = 365 * 24 * 3600;", rot: "T2" },
  { name: "Widerruf ohne Grund zählt", datei: M23,
    alt: "if (istR && !widerrufGrundOk(z.reason)) return \"falsch\";", neu: "", rot: "W3" },
  { name: "createRevocation ohne Grund", datei: M23,
    alt: "if (!widerrufGrundOk(grund)) return { ok: false,", neu: "if (false) return { ok: false,", rot: "W1" },
  { name: "Grund beliebig lang", datei: M23,
    alt: "g.trim().length > 0 && g.length <= RDV_REVOKE_REASON_MAX;", neu: "g.trim().length > 0;", rot: "W1" },
  { name: "Grund steht nicht im Zettel", datei: M23,
    alt: "z.reason = grund;", neu: "", rot: "W2" },
  { name: "gespeicherte Widerrufe werden nicht gelesen", datei: M23,
    alt: "var k = await vouchKanten(zettel, jetzt, widerrufeLesen());", neu: "var k = await vouchKanten(zettel, jetzt, []);", rot: "P1" },
  { name: "gesehene Widerrufe werden nicht gespeichert", datei: M23,
    alt: "widerrufeMerken(k.revokes);", neu: "", rot: "P1" },
  { name: "gespeicherte Widerrufe ohne eigenes Budget", datei: M23,
    alt: ".concat((Array.isArray(zettel) ? zettel : []).slice(0, RDV_VOUCH_SEEN_MAX));",
    neu: "; liste = (Array.isArray(zettel) ? zettel : []).concat(liste).slice(0, RDV_VOUCH_SEEN_MAX);", rot: "P7" },
  { name: "veraltete Widerrufe werden mitgespeichert", datei: M23,
    alt: "if (typeof z.ts !== \"number\" || z.ts + RDV_VOUCH_TTL_SEC < jetzt) return;", neu: "if (typeof z.ts !== \"number\") return;", rot: "P6" },
  { name: "Widerrufe auch ohne dbSuffix gespeichert", datei: M23,
    alt: "return cfg.dbSuffix ? WIDERRUF_SPEICHER_PRAEFIX + cfg.dbSuffix : null;", neu: "return WIDERRUF_SPEICHER_PRAEFIX + (cfg.dbSuffix || \"\");", rot: "P5" },
  { name: "Ablauf-Hinweis auch für fremde Bürgschaften", datei: M23,
    alt: "z.subject !== own.id || typeof z.voucher", neu: "typeof z.voucher", rot: "E1" },
  { name: "Ablauf-Hinweis ohne Zeitfenster", datei: M23,
    alt: ".filter(function (x) { return x.exp - jetzt <= fenster; })", neu: "", rot: "E1" },
  { name: "Ablauf-Hinweis übersieht die Verlängerung", datei: M23,
    alt: "if (!je[z.voucher] || z.exp > je[z.voucher].exp)", neu: "if (!je[z.voucher])", rot: "E2" },
  { name: "Frage trägt keine Bürgschaften", datei: M23,
    alt: "if (mitV.length) frage.vouches = mitV;", neu: "", rot: "N1" },
  { name: "Antworter liest die Bürgschaften der Frage nicht", datei: M23,
    alt: "var mit = (Array.isArray(q.vouches) ? q.vouches : []).slice(0, RDV_QUERY_VOUCH_MAX);", neu: "var mit = [];", rot: "N2" },
  { name: "„antworte nur Verbürgten“ antwortet trotzdem", datei: M23,
    alt: "if (!darf) { fragenNichtVerbuergt++; return; }", neu: "if (!darf) { fragenNichtVerbuergt++; }", rot: "N3" },
  { name: "Einstellung wird nicht gespeichert", datei: M23,
    alt: "onlyVouched: o.onlyVouched === true,", neu: "onlyVouched: false,", rot: "N8" },
  { name: "ungeprüfter Absender zählt als Kontakt", datei: M23,
    alt: "if (stand === \"bestaetigt\") { try { darf = await absenderVerbuergt(q); }", neu: "if (true) { try { darf = await absenderVerbuergt(q); }", rot: "N11" },
  { name: "Oberfläche: Name im Ablauf-Hinweis als HTML", datei: UI,
    alt: "        buergAblaufEl.appendChild(z);", neu: "        z.innerHTML = z.textContent; buergAblaufEl.appendChild(z);", rot: "U1" },
  { name: "Oberfläche widerruft ohne Grund", datei: UI,
    alt: "if (!g) { msg.textContent = T(\"Ein Widerruf braucht einen Grund.\"); return; }", neu: "", rot: "U2" },
  { name: "Oberfläche: Schalter speichert nicht", datei: UI,
    alt: "var x = r.setAnswerOnlyVouched(buergNurEl.checked);", neu: "var x = { ok: true };", rot: "U4" },
  { name: "Siegel-Aspekt S5b fehlt", datei: "src/modules/16_siegel.js",
    alt: "aspect:      \"Bürgen für fremde Apps: befristet, mit Grund, je App (S5b)\",", neu: "aspect:      \"S5b\",", rot: "Z1" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps5b-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  cpSync(join(root, "docs/INTERFACES.md"), join(kopie, "docs/INTERFACES.md"));   // Z3 liest die Tafel
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s5b_buergen_maerkte.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
