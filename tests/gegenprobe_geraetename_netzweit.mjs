/*
 * Gegenprobe zu `smoke_geraetename_netzweit.mjs`.
 *
 * Baut die drei Zustände nach, die am 2026-08-16 wirklich vorlagen — jeder MUSS
 * die Probe umwerfen. Ohne diese Gegenprobe wäre der Wächter nur ein grüner
 * Haken: er liefe genauso grün, wenn er gar nichts prüfte.
 *
 * Die Fehler werden in eine KOPIE geschrieben und danach zurückgenommen; bricht
 * der Lauf ab, stellt der finally-Zweig alles wieder her.
 *
 * Lauf: node tests/gegenprobe_geraetename_netzweit.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HEIM = resolve(WURZEL, "..");

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [join(WURZEL, "tests/smoke_geraetename_netzweit.mjs")],
                 { cwd: WURZEL, stdio: "pipe" });
    return true;
  } catch { return false; }
}

// Die Datei suchen, in der das Feld eines Repos wirklich steht.
function feldDatei(repo) {
  const wurzel = join(HEIM, repo);
  const raus = [];
  (function geh(d) {
    let e; try { e = readdirSync(d); } catch { return; }
    for (const n of e) {
      if (n === ".git" || n === "node_modules") continue;
      const p = join(d, n);
      let s; try { s = statSync(p); } catch { continue; }
      if (s.isDirectory()) geh(p);
      else if (/\.(html?|js|mjs)$/i.test(n)) {
        let t; try { t = readFileSync(p, "utf-8"); } catch { continue; }
        if (/sbkim-geraetename/.test(t)) raus.push(p);
      }
    }
  })(wurzel);
  return raus;
}

const FAELLE = [
  {
    was: "PWA Toolpoint verliert sein Feld (Zustand vor dem 2026-08-16)",
    repo: "PWA-Toolpoint",
    kaputt: (t) => t.replace(/sbkim-geraetename/g, "sbkim-irgendwas"),
  },
  {
    was: "Perfect Skin Beauty behält die Verdrahtung, verliert das Feld — der stille Fall",
    repo: "Perfect-Skin-Beauty",
    // Nur die Kennung des Feldes zerstören, displayNodeName stehen lassen:
    // genau so sah es aus, und im Code sah alles vollständig aus.
    kaputt: (t) => t.replace(/id\s*=\s*(["'])sbkim-geraetename\1/g, "id=$1sbkim-nichts$1"),
  },
  {
    was: "Company Brain verliert die Durchreichung an die Anmeldung",
    repo: "Company-Brain",
    kaputt: (t) => t.replace(/displayNodeName/g, "irgendEinName"),
  },
];

let blind = 0;
const sicherung = new Map();

console.log("\n=== Gegenprobe · Gerätename netzweit ===\n");

try {
  if (!probeLaeuftDurch()) {
    console.error("✗ Die Probe ist schon vor der Gegenprobe rot. Erst das in Ordnung bringen.");
    process.exit(1);
  }
  console.log("  Ausgangslage: Probe grün.\n");

  for (const f of FAELLE) {
    const dateien = feldDatei(f.repo);
    if (!dateien.length) {
      console.log(`  ⊘ ${f.repo}: keine Datei mit der Feld-Kennung gefunden — Fall nicht prüfbar`);
      blind++;
      continue;
    }
    for (const p of dateien) {
      if (!sicherung.has(p)) sicherung.set(p, readFileSync(p, "utf-8"));
      writeFileSync(p, f.kaputt(readFileSync(p, "utf-8")), "utf-8");
    }
    const bemerkt = !probeLaeuftDurch();
    if (bemerkt) console.log(`  ✓ bemerkt: ${f.was}`);
    else { blind++; console.log(`  ✗ BLIND — nicht bemerkt: ${f.was}`); }
    for (const [p, t] of sicherung) writeFileSync(p, t, "utf-8");
    sicherung.clear();
  }
} finally {
  for (const [p, t] of sicherung) { if (existsSync(p)) writeFileSync(p, t, "utf-8"); }
}

console.log(`\n${FAELLE.length - blind} von ${FAELLE.length} Fehlern bemerkt.` +
  (blind ? `  ${blind} BLINDE STELLE(N).\n` : "  Kein blinder Fleck.\n"));
process.exit(blind ? 1 : 0);
