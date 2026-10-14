// tests/gegenprobe_bau04j_24r.mjs — Prüfung vor dem KI-Richter (04.J) und Reinigung vor der
// Texterkennung (24.R), Klaus 2026-10-14. Jeder eingebaute Fehler muss seine EIGENE rote Zeile werfen.
//
//   node tests/gegenprobe_bau04j_24r.mjs              # alle Fälle (Wegwerf-Kopie unter /tmp)
//   NUR_ANKER=1 node tests/gegenprobe_bau04j_24r.mjs  # nur: trifft jeder Anker genau einmal?
//   NUR_FALL="OCR:" node tests/gegenprobe_bau04j_24r.mjs
//
// Ausgänge: gefangen · DURCHGERUTSCHT (blinder Wächter) · STOLPERT (Absturz oder fremder Name
// in der ersten roten Zeile) · TOTER ANKER (der Eingriff ändert nichts).
// ⚠ Gearbeitet wird NIE im echten Baum. Die Kopie liegt als <tmp>/Sage-Protokol, daneben ein
//   Verweis auf ../Workflow-PDF — sonst wäre die Browser-Probe „nicht lauffähig" und jeder ihrer
//   Fälle blind. ⚠ Während des Laufs die Datei hier nicht anfassen.

import { cp, readFile, writeFile, rm, mkdtemp, symlink, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = {
  richter: "tests/smoke_bau04j_pruefung_vor_richter.mjs",
  widget: "tests/smoke_bau22_such_widget.mjs",
  pinnwand: "pinnwand/_smoke.mjs",
  ocr: "tests/smoke_bau24_ocr_eingabe.mjs",
  browser: "tests/smoke_bau24r_reinigung_browser.mjs",
};

// [Name, Datei, Anker, Ersatz, Probe, erwartete erste rote Zeile]
const FAELLE = [
  ["RICHTER: ohne Prüfliste läuft der Richter doch", "src/modules/04_match.js",
    "if (!liste) {", "if (false) {", "richter", "der Grund nennt die fehlende Prüfliste"],
  ["RICHTER: Fund in der Frage wird übergangen", "src/modules/04_match.js",
    "if (frageFunde.length) {", "if (false) {", "richter", "Frage mit Anweisung: Richter aus"],
  ["RICHTER: Kandidat mit Anweisung geht an die KI", "src/modules/04_match.js",
    "ausgeschlossen.push(cf.length ? cf : null);\n      if (!cf.length) zumRichter.push(candidates[ci]);",
    "ausgeschlossen.push(null);\n      zumRichter.push(candidates[ci]);", "richter", "die Anweisung steht NICHT im Prompt"],
  ["RICHTER: der Ausgeschlossene verschwindet still", "src/modules/04_match.js",
    "alleUrteile.push(ausgeschlossen[ui]\n        ? ausgeschlossenesUrteil(candidates[ui], ausgeschlossen[ui])\n        : schemaCheck.result[ki++]);",
    "if (!ausgeschlossen[ui]) alleUrteile.push(schemaCheck.result[ki++]);", "richter", "drei Urteile, in der Reihenfolge der Kandidaten"],
  ["RICHTER: unsichtbare Zeichen sperren nicht", "src/modules/04_match.js",
    'var PRUEF_SPERRT = ["KI-ANWEISUNG", "UNSICHTBARE-ZEICHEN", "VERSTECKTER-TEXT"];',
    'var PRUEF_SPERRT = ["KI-ANWEISUNG", "VERSTECKTER-TEXT"];', "richter", "unsichtbare Zeichen: ausgeschlossen"],
  ["KANON: Prüfliste abgewandelt", "assets/pruefer-mail.js",
    '_meta: { herkunft: "PWA Toolpoint 2026-09-09", fassung: "1", zwilling: false }',
    '_meta: { herkunft: "PWA Toolpoint 2026-09-09", fassung: "1b", zwilling: false }', "richter", "assets/pruefer-mail.js unverändert (Pin)"],
  ["WIDGET: der Ausgeschlossene verschwindet aus der Liste", "src/modules/22_such_widget.js",
    "treffer: treffer.concat(ausgeschlossen)", "treffer: treffer", "widget", "Probe 12b: der ausgeschlossene verschwindet NICHT"],
  ["PINNWAND: Antwort mit Anweisung geht an die KI", "pinnwand/index.html",
    "antworten.forEach((a, i) => (richterSperrt(a) ? ausgeschlossen : senden).push(i));",
    "antworten.forEach((a, i) => (richterSperrt(a) && !window.PrueferMail ? ausgeschlossen : senden).push(i));", "pinnwand", "Probe 9: die Antwort mit Anweisung wird ausgeschlossen"],
  ["PINNWAND: Prüfliste nicht im Offline-Vorrat", "pinnwand/sw.js",
    '  "./modules/pruefer-mail.js",\n', "", "pinnwand", "Probe 9: die Prüfliste steht im Offline-Vorrat"],
  ["OCR: das Foto geht als Original", "src/modules/24_ocr_eingabe.js",
    "    var u8 = b64ZuBytes(b64);\n",
    "    return { bilder: [b64], mime: mime, liste: [], seiten: 1, gesamt: 1 };\n", "ocr", "das NEU GEZEICHNETE Bild"],
  ["OCR: PDF wieder mit niedriger Auflösung", "src/modules/24_ocr_eingabe.js",
    "var PDF_DPI = 300;", "var PDF_DPI = 170;", "ocr", "A4 hoch: 300 dpi"],
  ["OCR: versteckter Text wird nicht zugedeckt", "src/modules/24_ocr_eingabe.js",
    "if (g) { liste.push({ seite: i, text: t.str, grund: g }); RE.zudecken(img, st, vp.scale); zu++; }",
    "if (g) { liste.push({ seite: i, text: t.str, grund: g }); zu++; }", "ocr", "versteckter Text: zugedeckt in der Kopie"],
  ["OCR: „Abbrechen\" sendet doch", "src/modules/24_ocr_eingabe.js",
    "if (!weiter) return {", "if (false) return {", "ocr", "NICHTS gesendet"],
  ["OCR: eine Anweisung im erkannten Text wird nicht gemeldet", "src/modules/24_ocr_eingabe.js",
    "if (TEXT_SPERRT.indexOf(st.kennung) === -1) return;", "return;", "ocr", "mit Prüfliste: die Anweisung wird gemeldet"],
  ["OCR: pdf.js mit eval", "src/modules/24_ocr_eingabe.js",
    "isEvalSupported: false", "isEvalSupported: true", "ocr", "pdf.js läuft ohne eval"],
  ["BROWSER: Angehängtes hinter dem Bildende geht mit", "src/modules/24_ocr_eingabe.js",
    "      bytes = bytes.subarray(0, ende);\n", "", "browser", "OHNE Angehängtes, Byte für Byte"],
  ["BROWSER: Metadaten bleiben im JPEG", "src/modules/24_ocr_eingabe.js",
    "    var r = RE.jpegOhneMeta(u8);", "    var r = { bytes: u8, entfernt: [], geprueft: true };", "browser", "OHNE Metadaten"],
];

const nurAnker = process.env.NUR_ANKER === "1";
const nurFall = process.env.NUR_FALL || "";
const faelle = FAELLE.filter((f) => !nurFall || f[0].startsWith(nurFall) || f[0].includes(nurFall));
const zaehle = (s, a) => s.split(a).length - 1;

let tot = 0;
for (const [name, datei, anker] of faelle) {
  const n = zaehle(await readFile(join(WURZEL, datei), "utf8"), anker);
  if (n !== 1) { tot++; console.log(`TOTER ANKER (${n}×): ${name} — ${datei}`); }
}
if (nurAnker) { console.log(`\n${faelle.length - tot} leben · ${tot} tot`); process.exit(tot ? 1 : 0); }

const wfpdf = resolve(WURZEL, "../Workflow-PDF");
let gefangen = 0, durch = 0, stolpert = 0;
for (const [name, datei, anker, ersatz, probe, erwartet] of faelle) {
  const basis = await mkdtemp(join(tmpdir(), "sage-gp-"));
  const kopie = join(basis, "Sage-Protokol");
  await mkdir(kopie);
  await cp(WURZEL, kopie, { recursive: true, filter: (q) => !/[\\/](\.git|node_modules)([\\/]|$)/.test(q.slice(WURZEL.length)) });
  if (existsSync(join(WURZEL, "node_modules"))) await symlink(join(WURZEL, "node_modules"), join(kopie, "node_modules"));
  if (existsSync(wfpdf)) await symlink(wfpdf, join(basis, "Workflow-PDF"));
  const ziel = join(kopie, datei);
  const alt = await readFile(ziel, "utf8");
  if (zaehle(alt, anker) !== 1) { tot++; console.log(`TOTER ANKER: ${name}`); await rm(basis, { recursive: true, force: true }); continue; }
  const neu = alt.replace(anker, ersatz);
  if (neu === alt) { tot++; console.log(`TOTER ANKER (ändert nichts): ${name}`); await rm(basis, { recursive: true, force: true }); continue; }
  await writeFile(ziel, neu);
  const r = spawnSync(process.execPath, [PROBE[probe]], { cwd: kopie, encoding: "utf8", timeout: 900000 });
  const aus = (r.stdout || "") + (r.stderr || "");
  const ersteRot = (aus.split("\n").find((z) => /✗|\[FAIL\]/.test(z)) || "").trim();
  if (r.status === 0) { durch++; console.log(`DURCHGERUTSCHT: ${name}`); }
  else if (r.status === 1 && ersteRot.includes(erwartet)) { gefangen++; console.log(`gefangen: ${name}\n    ${ersteRot}`); }
  else { stolpert++; console.log(`STOLPERT: ${name} (Rückgabe ${r.status})\n    erwartet: ${erwartet}\n    erste rote Zeile: ${ersteRot || "—"}`); }
  await rm(basis, { recursive: true, force: true });
}
console.log(`\n${gefangen} gefangen · ${durch} durchgerutscht · ${stolpert} gestolpert · ${tot} tote Anker`);
process.exit(durch || stolpert || tot ? 1 : 0);
