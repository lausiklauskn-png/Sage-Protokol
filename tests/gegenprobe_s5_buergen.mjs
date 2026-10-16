// Gegenprobe S5 „Bürgen" Teil 1 und 2 — jeder Riegel wird in einer WEGWERF-KOPIE
// einzeln weggenommen; tests/smoke_s5_buergen.mjs muss dann rot werden, und die
// erste rote Zeile muss den Namen der Zusicherung tragen.
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
  { name: "Kette länger als 2 Schritte", datei: M23,
    alt: "for (var schritt = 1; schritt <= RDV_VOUCH_CHAIN_MAX; schritt++)", neu: "for (var schritt = 1; schritt <= 3; schritt++)", rot: "K4" },
  { name: "Unterschrift der Bürgschaft nicht geprüft", datei: M23,
    alt: "var ok = await v.verifyDetached(antwortOhneSig(z), z.sig, z.spore.publicKey);", neu: "var ok = true;", rot: "G1" },
  { name: "Spore nicht an den Bürgen gebunden", datei: M23,
    alt: "if (z.spore.id !== z.voucher) return \"falsch\";", neu: "", rot: "G2" },
  { name: "abgelaufene Bürgschaft zählt", datei: M23,
    alt: "if (z.exp <= jetzt) return \"falsch\";", neu: "", rot: "G4" },
  { name: "Frist über 180 Tage zählt", datei: M23,
    alt: "|| z.exp - z.ts > RDV_VOUCH_TTL_SEC) return \"falsch\";", neu: ") return \"falsch\";", rot: "G5" },
  { name: "Zeitstempel in der Zukunft zählt", datei: M23,
    alt: "|| z.ts > jetzt + RDV_VOUCH_SKEW_SEC) return \"falsch\";", neu: ") return \"falsch\";", rot: "G6" },
  { name: "Widerruf wirkt nicht", datei: M23,
    alt: "return !revokes.some(", neu: "return true || !revokes.some(", rot: "W1" },
  { name: "jeder Widerruf zählt, egal von wem", datei: M23,
    alt: "return w.voucher === b.voucher && w.subject === b.subject", neu: "return w.subject === b.subject", rot: "W3" },
  { name: "eine aufgefallene Kennung behält ihre Bürgschaft", datei: M23,
    alt: "var kanten = k.kanten.filter(function (b) { return aufgefallen.indexOf(b.subject) === -1; });", neu: "var kanten = k.kanten;", rot: "H2" },
  { name: "Vorrat nimmt ungeprüfte Zettel", datei: M23,
    alt: "if (st !== \"gueltig\") return { ok: false, reason: st === \"nicht-pruefbar\"", neu: "if (false) return { ok: false, reason: st === \"nicht-pruefbar\"", rot: "R2" },
  { name: "Karte trägt die Bürgschaft nicht", datei: M23,
    alt: "if (mit.vouches.length) card.vouches = mit.vouches;", neu: "", rot: "R3" },
  { name: "Widerrufe nur aus der neuesten Karte", datei: M23,
    alt: "if (Array.isArray(card.revocations)) vouchZettel = vouchZettel.concat(", neu: "if (false) vouchZettel = vouchZettel.concat(", rot: "R5" },
  { name: "ohne Prüf-Modul still verbürgt", datei: M23,
    alt: "if (!v || typeof v.verifyDetached !== \"function\") return \"nicht-pruefbar\";", neu: "if (!v || typeof v.verifyDetached !== \"function\") return \"gueltig\";", rot: "R8" },
  { name: "Anzeige nennt den Namen aus der Karte statt aus den Kontakten", datei: UI,
    alt: "if (k.nodeId === vonId && k.name) vonName = k.name;", neu: "if (k.name) vonName = k.name;", rot: "B1" },
  // ── Teil 2 ──
  { name: "Netzadmin des offenen Mycels gilt auch im eigenen Netz", datei: M23,
    alt: "var anker = idListe([currentNetAdmin()])", neu: "var anker = idListe([currentNetAdmin(), RDV_OPEN_MYCEL_ADMIN[0]])", rot: "N5" },
  { name: "Netzadmin aus der Einstellung wird ignoriert", datei: M23,
    alt: "netzAdmin = (typeof opts.admin === \"string\" && NETZ_ADMIN_MUSTER.test(opts.admin)) ? opts.admin : null;", neu: "netzAdmin = null;", rot: "N4" },
  { name: "setNetwork nimmt jede Netzadmin-Kennung", datei: M23,
    alt: "netzAdmin = (typeof opts.admin === \"string\" && NETZ_ADMIN_MUSTER.test(opts.admin)) ? opts.admin : null;", neu: "netzAdmin = (typeof opts.admin === \"string\" && opts.admin) ? opts.admin : null;", rot: "N8" },
  { name: "Netz-Einstellung prüft die Netzadmin-Kennung nicht", datei: M23,
    alt: "if (!NETZ_ADMIN_MUSTER.test(admin)) return { ok: false,", neu: "if (false) return { ok: false,", rot: "N9" },
  { name: "applyNetwork reicht den Netzadmin nicht durch", datei: M23,
    alt: "setNetwork({ code: chk.setting.code, admin: chk.setting.admin })", neu: "setNetwork({ code: chk.setting.code })", rot: "N10" },
  { name: "kein Vorrang für Verbürgte", datei: M23,
    alt: "if (va !== vb) return va ? -1 : 1;", neu: "", rot: "V1" },
  { name: "„passt nicht“ rückt mit Bürgschaft nach vorn", datei: M23,
    alt: "if (ma !== mb) return ma ? 1 : -1;\n      var va", neu: "var va", rot: "V1" },
  { name: "Sicherheitsnummer nicht symmetrisch", datei: M23,
    alt: "var paar = [pubE, pubF].sort();", neu: "var paar = [pubE, pubF];", rot: "S1" },
  { name: "Sicherheitsnummer auch für die eigene Karte", datei: M23,
    alt: "if (pubE === pubF) return { ok: false, reason: \"Das ist die eigene Karte.\" };", neu: "", rot: "S3" },
  { name: "Weitergeben ohne die eigenen mitgetragenen Bürgschaften", datei: M23,
    alt: "cardCarried().vouches.forEach(function (x) { if (!z || x.sig !== z.sig) liste.push(x); });", neu: "", rot: "P1" },
  { name: "Oberfläche unterschreibt ohne Haken", datei: UI,
    alt: "if (!hak.checked) { msg.textContent = T(\"Erst die Sicherheitsnummer vergleichen und den Haken setzen.\"); return; }\n      if (!r || typeof r.createVouch", neu: "if (!r || typeof r.createVouch", rot: "U2" },
  { name: "Oberfläche merkt Kontakt ohne Haken", datei: UI,
    alt: "if (!hak.checked) { msg.textContent = T(\"Erst die Sicherheitsnummer vergleichen und den Haken setzen.\"); return; }\n      if (!r || typeof r.saveVouchContacts", neu: "if (!r || typeof r.saveVouchContacts", rot: "U2" },
  { name: "Kontaktname als HTML", datei: UI,
    alt: "if (k.name) { t.appendChild(el(\"b\", null, k.name)); t.appendChild(el(\"br\")); }", neu: "if (k.name) { var bb = el(\"b\"); bb.innerHTML = k.name; t.appendChild(bb); t.appendChild(el(\"br\")); }", rot: "U4" },
  { name: "Widerruf geht nicht in den eigenen Vorrat", datei: UI,
    alt: "return r.addCarried(x.zettel).then(function (y) {", neu: "return Promise.resolve({ ok: true }).then(function (y) {", rot: "U5" },
  { name: "Einfügen zählt Ungültiges als übernommen", datei: UI,
    alt: "if (x && x.ok) gut++; else schlecht++;", neu: "gut++;", rot: "U7" },
  { name: "Siegel-Aspekt S5 fehlt", datei: "src/modules/16_siegel.js",
    alt: "aspect:      \"Knoten können füreinander bürgen (S5)\",", neu: "aspect:      \"S5\",", rot: "Z1" },
  { name: "Netz-Link ohne Netzadmin", datei: UI,
    alt: "if (setting.admin) o.a = setting.admin;", neu: "", rot: "U9" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps5-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s5_buergen.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
