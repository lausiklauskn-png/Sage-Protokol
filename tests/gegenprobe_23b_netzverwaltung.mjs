// Gegenprobe Modul 23b „Netz-Verwaltung" — jeder Riegel wird in einer
// WEGWERF-KOPIE einzeln weggenommen; tests/smoke_23b_netzverwaltung.mjs muss
// dann rot werden, und die erste rote Zeile muss den Namen der Zusicherung tragen.
// Der echte Baum wird nie angefasst (LEHREN § 10).
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft.
// NUR_FALL="…" → nur Fälle, deren Name das enthält.
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NV = "src/modules/23b_netzverwaltung.js";
const FAELLE = [
  { name: "Rolle: jeder gilt als Netzadmin",
    alt: "isAdmin: !!(own && admin && own === admin)", neu: "isAdmin: !!own", rot: "R1" },
  { name: "Bürgen gibt keinen Text zum Weitergeben",
    alt: "return { ok: true, zettel: x.zettel, text: JSON.stringify(weiter), stored: m.ok };", neu: "return { ok: true, zettel: x.zettel, text: \"[]\", stored: m.ok };", rot: "V1" },
  { name: "Bürgschaft wird nicht abgelegt",
    alt: "    var m = ablageMerken(x.zettel);\n", neu: "    var m = { ok: true };\n", rot: "V2" },
  { name: "„läuft bald ab“ fehlt",
    alt: "bald: z.exp - jetzt <= NV_WARN_SEC, zettel: z });", neu: "bald: false, zettel: z });", rot: "V3" },
  { name: "nicht nach Ablauf sortiert",
    alt: "return aus.sort(function (a, b) { return a.exp - b.exp; });", neu: "return aus;", rot: "V4" },
  { name: "Verlängern übersieht die neuere Bürgschaft",
    alt: "}).sort(function (a, b) { return (b.ts - a.ts) || (b.exp - a.exp); });", neu: "});", rot: "V5b" },
  { name: "Ablage wird nicht neu geprüft (untergeschobene Zettel zählen)",
    alt: "if (!v || v.status !== \"verbuergt\" || !v.by || v.by[v.by.length - 1] !== me) continue;", neu: "", rot: "V6" },
  { name: "Kandidat wird nicht einzeln geprüft (falscher Zettel stellt den Ablauf)",
    alt: "var g = await r.vouchTrust([{ nodeId: z.subject }], { anchors: [me], vouches: [z].concat(widerrufe), contacts: [] });", neu: "var g = await r.vouchTrust([{ nodeId: z.subject }], { anchors: [me], vouches: alle, contacts: [] });", rot: "V7b" },
  { name: "Kennung wird nicht geprüft",
    alt: "    if (typeof nodeId !== \"string\" || !NV_ID_MUSTER.test(nodeId)) return { ok: false, reason: T(\"Keine gültige Kennung.\") };\n    var x = await r.createVouch(nodeId, opts || {});",
    neu: "    var x = await r.createVouch(nodeId, opts || {});", rot: "V8" },
  { name: "ohne dbSuffix wird doch abgelegt",
    alt: "function ablageSchluessel() { var s = suffix(); return s ? NV_STORE_PREFIX + s : null; }", neu: "function ablageSchluessel() { var s = suffix(); return NV_STORE_PREFIX + (s || \"\"); }", rot: "V10" },
  { name: "Widerruf wird nicht mitgetragen",
    alt: "var c = typeof r.addCarried === \"function\" ? await r.addCarried(x.zettel) : { ok: false, reason: \"addCarried fehlt\" };", neu: "var c = { ok: true };", rot: "W4" },
  { name: "eigener Widerruf fehlt in der Liste",
    alt: "    ablageMerken(x.zettel);\n    return { ok: true, zettel: x.zettel };", neu: "    return { ok: true, zettel: x.zettel };", rot: "W3" },
  { name: "gesehene Widerrufe fehlen",
    alt: "var gesehen = typeof r.loadSeenRevocations === \"function\" ? r.loadSeenRevocations() : [];", neu: "var gesehen = [];", rot: "W5" },
  { name: "jeder Widerruf gilt als eigener",
    alt: "eigen: !!(me && z.voucher === me) });", neu: "eigen: true });", rot: "W5" },
  { name: "eigene Bürgschaft wird nicht angezeigt",
    alt: "else if (mein) { st = \"verbuergt-eigen\"; by = ro.ownId ? [ro.ownId] : []; }", neu: "", rot: "W7" },
  { name: "Eintrag ohne Kennung verschwindet",
    alt: "if (!id) { aus.push({ nodeId: null, label: label, imRaum: false, status: \"ohne-kennung\", by: [], exp: null, bald: false }); return; }", neu: "if (!id) return;", rot: "Z2" },
  { name: "Netzadmin nicht erkannt",
    alt: "else if (ro.admin && id === ro.admin) st = \"netzadmin\";", neu: "", rot: "Z3" },
  { name: "Raum wird nicht dazugenommen",
    alt: "    Object.keys(raum).forEach(function (id) { zeile(id, \"\"); });\n", neu: "", rot: "Z4" },
  { name: "„im Raum“ immer an",
    alt: "imRaum: !!c, status: st,", neu: "imRaum: true, status: st,", rot: "Z5" },
  { name: "doppelte Kennungen",
    alt: "if (schon[id]) return; schon[id] = true;", neu: "", rot: "Z6" },
  { name: "Sperren ohne Rollen-Prüfung (widerruft vorher)",
    alt: "    if (!ro.isAdmin) return { ok: false, reason: \"Sperren kann nur der Netzadmin dieses Netzes.\" };\n", neu: "", rot: "S1" },
  { name: "Sperren bricht beim gescheiterten Widerruf nicht ab",
    alt: "if (!w.ok) return { ok: false, reason: \"Widerruf fehlgeschlagen, nicht gesperrt: \" + (w.reason || \"?\") };", neu: "", rot: "S2" },
  { name: "Sperren widerruft nicht zuerst",
    alt: "    if (meine.length) {\n      var w = await revoke(nodeId, reason);", neu: "    if (false) {\n      var w = await revoke(nodeId, reason);", rot: "S2" },
  { name: "gesperrt wird nicht angezeigt",
    alt: "if (r && typeof r.isBlocked === \"function\" && r.isBlocked(id)) st = \"gesperrt\";\n      else ", neu: "", rot: "S4" },
  { name: "Lösen löst alle",
    alt: "return await r.createBlocklist(b.ids.filter(function (x) { return x !== nodeId; }));", neu: "return await r.createBlocklist([]);", rot: "S6" },
  { name: "Spore: Kennung wird nicht verglichen",
    alt: "if (expectedId && spore.id !== expectedId) return", neu: "if (false) return", rot: "F2" },
  { name: "Spore: Unterschrift wird nicht geprüft",
    alt: "if (!(v === true || (v && v.valid === true))) return { ok: false, reason: \"Unterschrift der Spore ungültig.\", status: \"falsch\" };", neu: "", rot: "F3" },
  { name: "Spore: auch http",
    alt: "!/^https:\\/\\//i.test(url.trim())", neu: "!/^https?:\\/\\//i.test(url.trim())", rot: "F4" },
  { name: "eigener Widerruf wird in Liste (a) nicht gezeigt",
    alt: "      else if (mapWid[id]) st = \"widerrufen-eigen\";\n", neu: "", rot: "W6" },
  { name: "Zurücknehmen wartet die Sekunde nicht ab (Widerruf gilt weiter)",
    alt: "    while (letzter && nowSec() <= letzter) await new Promise(function (r) { setTimeout(r, 250); });\n", neu: "", rot: "W7" },
  { name: "Oberfläche schreibt fremde Namen als HTML",
    alt: "    if (text != null) n.textContent = String(text);", neu: "    if (text != null) n.innerHTML = String(text);", rot: "L2" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
const quelle = readFileSync(join(root, NV), "utf8");
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gp23b-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, NV), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_23b_netzverwaltung.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot + " ")) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n").slice(0, 3).join(" | "))); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
