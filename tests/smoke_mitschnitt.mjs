/*
 * Probe: die Mitschnitte der Mycel-Karte — das einzige Belegmaterial darüber,
 * wie ein Knoten im Raum WIRKLICH auftritt.
 *
 * ── WARUM ES DIESE PROBE GIBT ───────────────────────────────────────────────
 *
 * Sages eigene Tafel sagt: „Die Spore im Netz ist nicht die Spore im Depot."
 * Am 2026-09-10 wurde zum ersten Mal gemessen, dass sie es für Sage DOCH ist —
 * gleiche Kennung, gleicher Zeitstempel, `domainVector` byte-gleich. Auf dieser
 * einen Messung ruht der Maßstab, gegen den alle zwanzig `matchScore` im
 * Register gerechnet sind.
 *
 * ⚠ EIN GEMESSENER SATZ, DEN KEINE PROBE NACHRECHNET, IST WIEDER EINE
 * BEHAUPTUNG — spätestens beim nächsten Signieren. Genau dann fällt die
 * Übereinstimmung auseinander, und zwar still: das Register sähe unverändert
 * aus, während seine Zahlen gegen einen Knoten messen, dem im Raum niemand
 * begegnet. Diese Probe rechnet es bei jedem Lauf nach.
 *
 * ⚠ SIE MISST DEN NEUESTEN MITSCHNITT, nicht alle. Ältere Mitschnitte sind
 * Aufzeichnungen eines vergangenen Zustands; von ihnen zu verlangen, dass sie
 * zur heutigen Spore passen, hiesse, Geschichte für einen Fehler zu halten.
 *
 * Lauf: node tests/smoke_mitschnitt.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createPublicKey, verify, createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORDNER = join(WURZEL, "sbkim", "mitschnitte");

let gruen = 0, rot = 0;
const ok = (was, bedingung) => {
  if (bedingung) { gruen++; console.log(`  ✓ ${was}`); }
  else { rot++; console.log(`  ✗ ROT — ${was}`); }
};

console.log("\n── Mitschnitte der Mycel-Karte ──\n");

/* ── 1 · Es gibt überhaupt Belegmaterial, und git führt es ────────────────── */
const gefuehrt = new Set(
  execFileSync("git", ["ls-files", "-z", "sbkim/mitschnitte"], { cwd: WURZEL })
    .toString("utf8").split("\0").filter(Boolean));

const dateien = existsSync(ORDNER)
  ? readdirSync(ORDNER).filter((f) => f.endsWith(".json")).sort()
  : [];

ok("es liegt mindestens ein Mitschnitt da", dateien.length > 0);

/* Ein Beleg, den git nicht führt, liegt nur auf DIESER Maschine — und ein
   Forschungsdatensatz ist nur etwas wert, wenn er mitreist. */
const ungefuehrt = dateien.filter((f) => !gefuehrt.has(`sbkim/mitschnitte/${f}`));
ok(`git führt jeden abgelegten Mitschnitt${
  ungefuehrt.length ? " — nicht geführt: " + ungefuehrt.join(", ") : ""}`,
  dateien.length > 0 && ungefuehrt.length === 0);

if (dateien.length === 0) {
  console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
  process.exit(rot > 0 ? 1 : 0);
}

/* ⚠ DER NEUESTE WIRD AM INHALT ERKANNT, NICHT AM NAMEN. Die erste Fassung
   nahm den letzten Dateinamen der Sortierung — und lag falsch: `T` (0x54)
   sortiert VOR `_` (0x5F), also galt „2026-09-10T1433_…" als älter als
   „2026-09-10_…". Die Probe verglich die heutige Spore mit einem Mitschnitt
   von zwei Stunden davor und wurde zu Recht rot, aber aus dem falschen Grund.
   Gefragt wird jetzt die Datei selbst: jeder Mitschnitt trägt `beendet`. */
const geordnet = dateien
  .map((f) => {
    let inhalt = null;
    try { inhalt = JSON.parse(readFileSync(join(ORDNER, f), "utf8")); } catch { /* gleich als rot gemeldet */ }
    return { f, inhalt, ende: inhalt && (inhalt.beendet || inhalt.gestartet) || "" };
  })
  .sort((a, b) => String(a.ende).localeCompare(String(b.ende)));

ok("jeder Mitschnitt ist lesbares JSON und sagt selbst, wann er endete",
  geordnet.every((g) => g.inhalt && g.ende));

const { f: neuester, inhalt: mit } = geordnet[geordnet.length - 1];
console.log(`     neuester: ${neuester} (beendet ${geordnet[geordnet.length - 1].ende})`);

/* ── 2 · Die Sporen im Raum ─────────────────────────────────────────────── */
const raum = new Map();
for (const e of mit.ereignisse || []) {
  if (e.kind !== "sbkim-rdv") continue;
  const c = e.data?.content || {};
  if (c.nodeId && c.spore?.domainVector && !raum.has(c.nodeId)) raum.set(c.nodeId, c.spore);
}
ok("der Mitschnitt trägt Sporen aus dem Rendezvous-Raum", raum.size > 0);

const canon = (v) => v === null ? null : Array.isArray(v) ? v.map(canon)
  : (typeof v === "object" ? Object.keys(v).sort().reduce((o, k) => (o[k] = canon(v[k]), o), {}) : v);
const b64u = (b) => Buffer.from(b).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/* ⚠ IDENTITÄT VOR INHALT. Ein Mitschnitt ist `untrusted external data` — er
   kommt aus einem Browser und liegt als Datei im Depot. Bevor irgendeine Zahl
   daraus gilt, muss jede Spore darin für sich selbst geradestehen. */
const kaputt = [], mitPrivat = [], falscheId = [];
for (const [nid, sp] of raum) {
  const { signature, ...unsigned } = sp;
  const jwk = sp.publicKey || {};
  if ("d" in jwk) mitPrivat.push(nid);
  try {
    const key = createPublicKey({ key: jwk, format: "jwk" });
    const bytes = Buffer.from(JSON.stringify(canon(unsigned)), "utf8");
    const sig = Buffer.from(String(signature).replace(/-/g, "+").replace(/_/g, "/"), "base64");
    if (!verify(null, bytes, key, sig)) kaputt.push(nid);
    const roh = Buffer.from(String(jwk.x).replace(/-/g, "+").replace(/_/g, "/"), "base64");
    if (b64u(createHash("sha256").update(roh).digest()) !== nid) falscheId.push(nid);
  } catch { kaputt.push(nid); }
}
ok(`jede Spore im Mitschnitt verifiziert gegen ihren eigenen Schlüssel (${raum.size})`,
  kaputt.length === 0);
ok("… und jede Kennung ist base64url(SHA256(rawPub))", falscheId.length === 0);

/* Ein privater Schlüsselteil in einer abgelegten Datei wäre ein Geheimnis im
   öffentlichen Depot — der eine Fehler, den dieses Netz sich nicht leisten kann. */
ok("KEIN privater Schlüsselteil ('d') in irgendeiner Spore des Mitschnitts",
  mitPrivat.length === 0);

/* ── 3 · Sage im Raum IST Sage im Depot ──────────────────────────────────── */
const depot = JSON.parse(readFileSync(join(WURZEL, "sbkim", "spore.json"), "utf8"));
const SAGE = depot.id || depot.nodeId;
const sageRaum = raum.get(SAGE);

ok(`Sage tritt im neuesten Mitschnitt unter der abgelegten Kennung auf (${String(SAGE).slice(0, 12)}…)`,
  !!sageRaum);

if (sageRaum) {
  /* Der Vektor ist die Sache, an der es hängt: er IST der Maßstab. Ein
     Vergleich der Texte allein wäre zu wenig — zwei gleiche Texte haben in
     diesem Netz schon verschiedene Vektoren ergeben (fünfmal, gemessen am
     2026-09-10). */
  const dv = depot.domainVector || [], rv = sageRaum.domainVector || [];
  ok("… mit byte-gleichem domainVector — der Maßstab des Registers stimmt",
    dv.length > 0 && dv.length === rv.length && dv.every((x, i) => x === rv[i]));
  ok("… und mit wortgleicher Bedeutungs-Beschreibung",
    String(depot.domainDescription || "").trim() === String(sageRaum.domainDescription || "").trim());
}

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
