/*
 * Gegenprobe zu `smoke_mitschnitt.mjs`.
 *
 * Jeder Fall baut GENAU EINEN Fehler ein, und jeder MUSS die Probe umwerfen.
 *
 * ⚠ EINE SPORE LÄSST SICH NICHT VON HAND VERBIEGEN. Jedes Feld steht unter der
 * Signatur — wer eine Zahl ändert, bricht zuerst den Signatur-Wächter, und der
 * Fall wäre „gefangen", ohne den gemeinten Wächter je erreicht zu haben.
 * Deshalb wird mit einem FRISCHEN Schlüsselpaar neu unterschrieben, das nur im
 * Arbeitsspeicher lebt: danach ist die Spore in sich tadellos, und genau ein
 * Wächter fällt um. Dieselbe Bauart wie `kim-hub-company/tests/gegenprobe-spore.mjs`.
 *
 * ⚠ GEARBEITET WIRD AN EINER KOPIE, mit eigenem git-Verzeichnis: die Probe
 * fragt `git ls-files`, und ein Verweis auf das echte `.git` liesse sie den
 * Index des ORIGINALS lesen, während ihre Auskunft von der Kopie handelte.
 *
 * Lauf: node tests/gegenprobe_mitschnitt.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync, sign, createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = "tests/smoke_mitschnitt.mjs";
const SPORE = "sbkim/spore.json";

const canon = (v) => v === null ? null : Array.isArray(v) ? v.map(canon)
  : (typeof v === "object" ? Object.keys(v).sort().reduce((o, k) => (o[k] = canon(v[k]), o), {}) : v);
const b64u = (b) => Buffer.from(b).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/* Unterschreibt eine veränderte Spore mit einem frischen Paar neu, damit sie
   in sich stimmig ist.
     `kennung`  "neu"  → id = SHA256 des frischen Schlüssels (stimmig)
                "alt"  → id bleibt stehen (für den Fall, der GENAU das misst)
     `jwkExtra` wird in den öffentlichen Schlüssel gemischt, NACH der
                Kennungs-Rechnung und VOR dem Unterschreiben — damit ein
                Privatteil drinsteht, ohne die Kennung zu verstellen.
   Gibt Spore UND Kennung zurück, weil ein Fall beides braucht. */
function neuSignieren(spore, { kennung = "neu", jwkExtra = null } = {}) {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const jwk = publicKey.export({ format: "jwk" });
  jwk.key_ops = ["verify"];
  jwk.ext = true;
  const roh = Buffer.from(String(jwk.x).replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const frisch = b64u(createHash("sha256").update(roh).digest());
  const { signature, ...rest } = spore;
  const unsigned = { ...rest, publicKey: jwkExtra ? { ...jwk, ...jwkExtra } : jwk };
  if (kennung === "neu") unsigned.id = frisch;
  const sig = sign(null, Buffer.from(JSON.stringify(canon(unsigned)), "utf8"), privateKey);
  return { spore: { ...canon(unsigned), signature: b64u(sig) }, kennung: frisch };
}

/* Jeder Fall bekommt den geparsten Mitschnitt und gibt ihn verändert zurück;
   `datei` sagt, was danach geschrieben wird. */
const FAELLE = [
  { was: "der neueste Mitschnitt wird nicht mehr von git gefuehrt",
    git: ["rm", "--cached", "-q", "--"] },

  { was: "ein Mitschnitt ist kaputtes JSON",
    roh: () => "{ das ist kein JSON" },

  { was: "eine Spore im Mitschnitt ist nicht mehr gueltig signiert",
    mit: (m, sageId) => { ersteEreignis(m, sageId).data.content.spore.signature = b64u(Buffer.alloc(64)); return m; } },

  { was: "eine Kennung im Mitschnitt ist nicht SHA256 ihres Schluessels",
    mit: (m, sageId) => {
      const e = ersteEreignis(m, sageId);
      /* neu unterschrieben, Kennung stehen gelassen: NUR sie passt nicht */
      e.data.content.spore = neuSignieren(e.data.content.spore, { kennung: "alt" }).spore;
      return m;
    } },

  /* ⚠ DIESER FALL WAR ZUERST BLIND, und die Handprobe hat es gezeigt: er hing
     ein `d` an den Schlüssel und unterschrieb DANACH mit einem frischen Paar —
     das den Schlüssel samt `d` wieder ersetzte. Umgeworfen wurde der
     Kennungs-Wächter, der Privatteil-Wächter kam nie dran und hätte blind sein
     können. `jwkExtra` mischt den Privatteil jetzt NACH der Kennungs-Rechnung
     hinein: Kennung stimmt, Signatur stimmt, nur `d` steht da, wo es nie
     stehen darf. */
  { was: "eine Spore im Mitschnitt traegt einen PRIVATEN Schluesselteil",
    mit: (m, sageId) => {
      const e = ersteEreignis(m, sageId);
      const neu = neuSignieren(e.data.content.spore, { jwkExtra: { d: "Zm9vYmFy" } });
      e.data.content.spore = neu.spore;
      e.data.content.nodeId = neu.kennung;
      return m;
    } },

  /* ⚠ DIE SABOTAGE MUSS DEN MITSCHNITT TREFFEN, IN DEM SAGE STEHT — nicht den
     neuesten. Seit dem 2026-09-10 misst die Probe am juengsten Mitschnitt MIT
     Sage; ein Eingriff in einen Ein-Knoten-Mitschnitt daneben aendert nichts
     und saehe wie eine bestandene Pruefung aus. */
  { was: "KEIN Mitschnitt traegt Sage mehr unter der abgelegten Kennung",
    alleMitSage: true,
    mit: (m, sageId) => {
      for (const e of m.ereignisse) {
        if (e.kind === "sbkim-rdv" && e.data?.content?.nodeId === sageId) {
          const neu = neuSignieren(e.data.content.spore);
          e.data.content.spore = neu.spore;
          e.data.content.nodeId = neu.kennung;
        }
      }
      return m;
    } },

  { was: "Sages Vektor im Raum weicht vom abgelegten ab",
    mit: (m, sageId) => {
      const e = sageEreignis(m, sageId);
      const sp = { ...e.data.content.spore, domainVector: e.data.content.spore.domainVector.slice() };
      sp.domainVector[0] = sp.domainVector[0] + 0.05;
      const neu = neuSignieren(sp);
      e.data.content.spore = neu.spore;
      e.data.content.nodeId = neu.kennung;
      return m;
    },
    depotId: true },

  { was: "Sages Text im Raum weicht vom abgelegten ab",
    mit: (m, sageId) => {
      const e = sageEreignis(m, sageId);
      const neu = neuSignieren({ ...e.data.content.spore, domainDescription: "Ein ganz anderer Text." });
      e.data.content.spore = neu.spore;
      e.data.content.nodeId = neu.kennung;
      return m;
    },
    depotId: true },
];


/* ⚠ NICHT DAS ERSTE EREIGNIS — das erste im Raum ist Sage selbst, und ein
   Eingriff daran wirft die drei Sage-Wächter gleich mit um. Ein Fall, der
   nebenbei einen Nachbarn trifft, beweist über den gemeinten Wächter weniger,
   als seine rote Zeile verspricht. Genommen wird die erste FREMDE Spore. */
const ersteEreignis = (m, sageId) =>
  m.ereignisse.find((e) => e.kind === "sbkim-rdv" && e.data?.content?.nodeId !== sageId);
const erste = (m) => ersteEreignis(m).data.content.spore;
const sageEreignis = (m, id) =>
  m.ereignisse.find((e) => e.kind === "sbkim-rdv" && e.data?.content?.nodeId === id);

let gefangen = 0, durch = 0;
console.log("\nGEGENPROBE — Mitschnitte der Mycel-Karte\n");

const kopie = mkdtempSync(join(tmpdir(), "sage-mitschnitt-"));
try {
  const gefuehrt = execFileSync("git", ["ls-files", "-z", "sbkim/mitschnitte", SPORE], { cwd: WURZEL })
    .toString("utf8").split("\0").filter(Boolean);
  for (const p of gefuehrt) {
    mkdirSync(join(kopie, dirname(p)), { recursive: true });
    cpSync(join(WURZEL, p), join(kopie, p));
  }
  mkdirSync(join(kopie, "tests"), { recursive: true });
  cpSync(join(WURZEL, PROBE), join(kopie, PROBE));
  const git = (...a) => execFileSync("git", a, { cwd: kopie, stdio: "pipe" });
  git("init", "-q"); git("add", "-A");

  const laeuft = () => {
    try { execFileSync(process.execPath, [join(kopie, PROBE)], { cwd: kopie, stdio: "pipe" }); return true; }
    catch { return false; }
  };

  /* ⚠ OHNE DIESE ZEILE MISST KEIN EINZIGER FALL ETWAS. */
  if (!laeuft()) {
    console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT. Kein Fall misst etwas.\n");
    process.exit(2);
  }
  console.log("  ✓ unveraendert ist die Probe gruen\n");

  /* Der neueste Mitschnitt, am Inhalt erkannt — wie die Probe selbst. */
  const namen = gefuehrt.filter((p) => p.startsWith("sbkim/mitschnitte/"));
  const sporeRein = readFileSync(join(kopie, SPORE), "utf8");
  const sageId = JSON.parse(sporeRein).id;
  /* ⚠ DER MITSCHNITT MIT SAGE, nicht der neueste. Die Probe misst dort, und ein
     Eingriff woanders aendert nichts — er saehe wie eine bestandene Pruefung aus. */
  const traegtSage = (p) => (JSON.parse(readFileSync(join(kopie, p), "utf8")).ereignisse || [])
    .some((e) => e.kind === "sbkim-rdv" && e.data?.content?.nodeId === sageId);
  const kandidaten = namen
    .map((p) => ({ p, ende: JSON.parse(readFileSync(join(kopie, p), "utf8")).beendet || "" }))
    .sort((a, b) => a.ende.localeCompare(b.ende));
  const mitSage = kandidaten.filter((k) => traegtSage(k.p));
  if (!mitSage.length) {
    console.log("⚠ ABBRUCH: kein Mitschnitt traegt Sage. Kein Fall misst etwas.\n");
    process.exit(2);
  }
  const neuester = mitSage[mitSage.length - 1].p;
  const rein = readFileSync(join(kopie, neuester), "utf8");

  for (const f of FAELLE) {
    if (f.git) {
      git(...f.git, neuester);
      if (laeuft()) { console.log("  ✗ NICHT GEFANGEN: " + f.was); durch++; }
      else { console.log("  ✓ gefangen: " + f.was); gefangen++; }
      git("reset", "-q"); git("add", "-A");
      continue;
    }
    if (f.alleMitSage) {
      const sicher = mitSage.map((k) => [k.p, readFileSync(join(kopie, k.p), "utf8")]);
      for (const [pfad, inh] of sicher) {
        writeFileSync(join(kopie, pfad), JSON.stringify(f.mit(JSON.parse(inh), sageId)), "utf8");
      }
      if (laeuft()) { console.log("  ✗ NICHT GEFANGEN: " + f.was); durch++; }
      else { console.log("  ✓ gefangen: " + f.was); gefangen++; }
      for (const [pfad, inh] of sicher) writeFileSync(join(kopie, pfad), inh, "utf8");
      continue;
    }
    const gebaut = f.roh ? null : f.mit(JSON.parse(rein), sageId);
    const inhalt = f.roh ? f.roh() : JSON.stringify(gebaut);
    if (inhalt === rein) { console.log("  ⚠ OHNE WIRKUNG — misst nichts: " + f.was); durch++; continue; }
    writeFileSync(join(kopie, neuester), inhalt, "utf8");
    /* Die Kennung der abgelegten Spore mitziehen, damit der Kennungs-Wächter
       nicht stellvertretend umfällt (siehe Kommentar bei den Fällen). */
    if (f.depotId) {
      const d = JSON.parse(sporeRein);
      d.id = sageEreignis(gebaut, null)?.data.content.nodeId
        || gebaut.ereignisse.find((e) => e.kind === "sbkim-rdv" && e.data?.content?.spore?.domain === d.domain).data.content.nodeId;
      writeFileSync(join(kopie, SPORE), JSON.stringify(d), "utf8");
    }
    if (laeuft()) { console.log("  ✗ NICHT GEFANGEN: " + f.was); durch++; }
    else { console.log("  ✓ gefangen: " + f.was); gefangen++; }
    writeFileSync(join(kopie, neuester), rein, "utf8");
    if (f.depotId) writeFileSync(join(kopie, SPORE), sporeRein, "utf8");
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }

console.log(`\n— ${gefangen} gefangen, ${durch} durchgerutscht —\n`);
process.exit(durch > 0 ? 1 : 0);
