/* smoke_laeufer_nachbar.mjs — `vorrat_wirkung.mjs` steht im Läufer, und ein
 * fehlender Nachbar-Klon ist dort „nicht lauffähig", nicht ROT.
 *
 * ⚠ DER ANLASS (PFLEGE-LISTE § 11, gemessen 2026-09-28): `run_alle.mjs`
 * sammelte nur `smoke_*`, und `vorrat_wirkung.mjs` lief nie — es lief nur,
 * wer es beim Namen rief. Aufnehmen ging nicht nebenbei: ohne die Nachbar-
 * Klone `mycel-karte` und `Kuechenzettel` warf die Probe, und der Läufer kennt
 * „nicht lauffähig" bis dahin nur für fehlende Pakete.
 *
 * Gemessen wird in VIER Teilen, und keiner ersetzt einen anderen:
 *   1. die echte Probe sagt bei fehlenden Nachbarn „⊘ NACHBAR FEHLT" mit 3
 *      — und nennt GENAU die fehlenden, nicht alle
 *   2. der echte Läufer sammelt sie ein und zählt sie als nicht lauffähig
 *   3. der Läufer ist ENG: Code 3 ohne Zeile ist ROT, Zeile ohne Code 3 ROT
 *      (an einer Kopie des Läufers mit gestellten Proben)
 *   4. die Gegenrichtung: eine gestellte Probe, die grün endet, ist grün —
 *      sonst wäre Teil 3 auch dann erfüllt, wenn die Kopie alles rot meldet
 *
 * ⚠ OHNE BROWSER. Teil 1 und 2 enden vor dem ersten Browser-Start; ob die
 * Probe MIT Nachbarn misst, sagt sie selbst, wenn sie im Läufer mitläuft.
 *
 * Lauf: node tests/smoke_laeufer_nachbar.mjs
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
let rot = 0, gruen = 0;
const ok = (was, gut) => {
  console.log(`  ${gut ? "✓" : "✗ ROT:"} ${was}`);
  gut ? gruen++ : rot++;
};
const fahre = (datei, env = {}, cwd = HIER) => {
  const r = spawnSync("node", [datei], { cwd, encoding: "utf8", timeout: 60000,
    env: { ...process.env, ...env } });
  return { code: r.status, text: String(r.stdout || "") + String(r.stderr || "") };
};

const tmp = mkdtempSync(join(tmpdir(), "laeufer-nachbar-"));
try {
  /* ── 1 · die echte Probe ── */
  const leer = join(tmp, "netz-leer");
  mkdirSync(leer);
  const r1 = fahre(join(HIER, "vorrat_wirkung.mjs"), { VORRAT_NETZ: leer, ARBEITSKOPIE: "" });
  ok(`ohne Nachbarn endet vorrat_wirkung mit 3 (gemessen: ${r1.code})`, r1.code === 3);
  ok("… und sagt „⊘ NACHBAR FEHLT“ mit beiden Namen",
    /^⊘ NACHBAR FEHLT: mycel-karte, Kuechenzettel —/m.test(r1.text));

  const halb = join(tmp, "netz-halb");
  mkdirSync(join(halb, "mycel-karte", ".git"), { recursive: true });
  const r2 = fahre(join(HIER, "vorrat_wirkung.mjs"), { VORRAT_NETZ: halb, ARBEITSKOPIE: "" });
  ok("mit nur einem Nachbarn nennt sie GENAU den fehlenden",
    r2.code === 3 && /^⊘ NACHBAR FEHLT: Kuechenzettel —/m.test(r2.text));

  /* ── 2 · der echte Läufer ── */
  const r3b = spawnSync("node", [join(HIER, "run_alle.mjs"), "vorrat_wirkung"],
    { encoding: "utf8", timeout: 60000, env: { ...process.env, VORRAT_NETZ: leer, ARBEITSKOPIE: "" } });
  const t3 = String(r3b.stdout || "") + String(r3b.stderr || "");
  ok("der Läufer sammelt vorrat_wirkung ein (1 Probe unter dem Filter)",
    /\n1 Proben \(Filter: vorrat_wirkung\)/.test(t3));
  ok("… und zählt sie ohne Nachbarn als NICHT LAUFFÄHIG, nicht rot",
    /0 grün, 0 rot, 1 nicht lauffähig/.test(t3) && r3b.status === 0);
  ok("… mit dem Grund „Nachbar-Klon …“", /Nachbar-Klon mycel-karte, Kuechenzettel fehlt/.test(t3));

  /* ── 3 + 4 · der Läufer ist eng (an einer Kopie) ── */
  const k = join(tmp, "kopie", "tests");
  mkdirSync(k, { recursive: true });
  copyFileSync(join(HIER, "run_alle.mjs"), join(k, "run_alle.mjs"));
  const stelle = (name, rumpf) => writeFileSync(join(k, name), rumpf);
  const fall = (rumpf) => {
    stelle("vorrat_wirkung.mjs", rumpf);
    const r = spawnSync("node", [join(k, "run_alle.mjs"), "vorrat_wirkung"], { encoding: "utf8", timeout: 60000 });
    return String(r.stdout || "") + String(r.stderr || "");
  };
  ok("Code 3 MIT der Zeile → nicht lauffähig",
    /0 grün, 0 rot, 1 nicht lauffähig/.test(fall(
      'console.log("⊘ NACHBAR FEHLT: x — y"); process.exit(3);')));
  ok("Code 3 OHNE die Zeile → ROT",
    /0 grün, 1 rot, 0 nicht lauffähig/.test(fall('process.exit(3);')));
  ok("die Zeile mit Code 1 → ROT",
    /0 grün, 1 rot, 0 nicht lauffähig/.test(fall(
      'console.log("⊘ NACHBAR FEHLT: x — y"); process.exit(1);')));
  ok("die Zeile NICHT am Zeilenanfang, Code 3 → ROT",
    /0 grün, 1 rot, 0 nicht lauffähig/.test(fall(
      'console.log("  ✗ ROT: ⊘ NACHBAR FEHLT: x — y"); process.exit(3);')));
  ok("Gegenrichtung: eine Probe, die grün endet, ist grün",
    /1 grün, 0 rot, 0 nicht lauffähig/.test(fall('process.exit(0);')));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n${gruen} grün · ${rot} ROT`);
process.exit(rot ? 1 : 0);
