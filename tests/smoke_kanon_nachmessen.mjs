/* smoke_kanon_nachmessen.mjs — misst das Werkzeug, das den Kanon nachmisst.
 *
 * WARUM ES DIESE PROBE GIBT. `tools/kanon-nachmessen.mjs` beantwortet die
 * Frage, an der drei Drift-Guards in einer Woche vorbeigesehen haben („der
 * Guard sagt unverändert, nicht aktuell"). Ein Werkzeug, das eine Antwort auf
 * eine bisher unbeantwortete Frage gibt, ist genau die Sorte, der man glaubt —
 * und deshalb muss es selbst gemessen werden.
 *
 * Gemessen wird an einer AUFGEBAUTEN Lage, nicht an der echten Nachbarschaft:
 * die echte ändert sich mit jedem Merge, und eine Probe, die sich auf sie
 * verlässt, misst irgendwann die Nachbarschaft statt das Werkzeug. Die
 * Wegwerf-Depots hier tragen bekannte Inhalte, also ist jede Zahl vorhersagbar.
 *
 * Kein Netz: der Kanon liegt im Depot, die Kopien liegen daneben. Genau das ist
 * die Zusicherung, die das Werkzeug überhaupt erst möglich macht.
 *
 * Lauf:  node tests/smoke_kanon_nachmessen.mjs
 */
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const WERKZEUG = join(HIER, "..", "tools", "kanon-nachmessen.mjs");

let gruen = 0, rot = 0;
const ok = (was, bedingung, hinweis) => {
  if (bedingung) { gruen++; console.log(`  ✓ ${was}`); }
  else { rot++; console.log(`  ✗ ROT: ${was}${hinweis ? "  — " + hinweis : ""}`); }
};

const buehne = mkdtempSync(join(tmpdir(), "kanon-"));
const git = (repo, ...a) => execFileSync("git", ["-C", repo, ...a],
  { stdio: ["ignore", "pipe", "pipe"] });

/* Ein Wegwerf-Depot mit genau einer Datei, und ein origin/main darauf.
   `update-ref` legt die Fernverfolgung ohne Netz an — die Probe braucht
   keinen Server, nur die Form, die das Werkzeug liest. */
function depot(name, pfad, inhalt) {
  const r = join(buehne, name);
  mkdirSync(join(r, dirname(pfad)), { recursive: true });
  writeFileSync(join(r, pfad), inhalt);
  git(r === r ? r : r, "init", "-q", "-b", "main");
  git(r, "config", "user.email", "probe@example.invalid");
  git(r, "config", "user.name", "Probe");
  git(r, "add", "-A");
  git(r, "commit", "-q", "-m", "Wegwerf");
  git(r, "update-ref", "refs/remotes/origin/main", "HEAD");
  return r;
}

/* Der Kanon der Bühne: zwei Module mit bekanntem Inhalt. */
const sage = join(buehne, "Sage-Fix");
mkdirSync(join(sage, "src", "modules"), { recursive: true });
mkdirSync(join(sage, "tools"), { recursive: true });
writeFileSync(join(sage, "src", "modules", "A.js"), "kanon-A\n");
writeFileSync(join(sage, "src", "modules", "B.js"), "kanon-B\n");
copyFileSync(WERKZEUG, join(sage, "tools", "kanon-nachmessen.mjs"));

depot("Traegt",   "modules/A.js", "kanon-A\n");        // trägt den Kanon
depot("Alt-eins", "sbkim/A.js",   "alte-fassung\n");   // weicht ab
depot("Alt-zwei", "modules/A.js", "alte-fassung\n");   // dieselbe Abweichung
depot("Fremd",    "modules/X.js", "gehoert-nicht-zum-kanon\n");
/* Ein Depot OHNE origin/main — es darf nicht als „grün" durchgehen. */
const ohne = join(buehne, "Ohne-Main");
mkdirSync(join(ohne, "modules"), { recursive: true });
writeFileSync(join(ohne, "modules", "A.js"), "kanon-A\n");
git(ohne, "init", "-q", "-b", "main");
git(ohne, "config", "user.email", "probe@example.invalid");
git(ohne, "config", "user.name", "Probe");
git(ohne, "add", "-A"); git(ohne, "commit", "-q", "-m", "ohne Fernverfolgung");

function lauf(...args) {
  try {
    return { code: 0, text: execFileSync("node",
      [join(sage, "tools", "kanon-nachmessen.mjs"), ...args],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) };
  } catch (e) { return { code: e.status, text: (e.stdout || "") + (e.stderr || "") }; }
}

console.log("── kanon-nachmessen: misst es, was es zu messen behauptet? ──");
const r = lauf();

ok("es zählt die Kopie, die den Kanon trägt", /A\.js.*1\/3 Kopien tragen ihn/.test(r.text),
   (r.text.match(/A\.js[^\n]*/) || [""])[0]);
ok("… und die zwei Abweichler als EINE Fassung, nicht als zwei",
   /≠ ANDERS[^\n]*\(\s*2\)/.test(r.text));
ok("… und nennt beide beim Namen",
   /≠ ANDERS[^\n]*Alt-eins Alt-zwei/.test(r.text));
ok("es findet Kopien in `modules/` UND in `sbkim/`",
   /Alt-eins/.test(r.text) && /Traegt/.test(r.text));
ok("ein Modul, das nirgends kopiert ist, erzeugt keinen Befund",
   !/^B\.js/m.test(r.text));
ok("eine Datei ausserhalb des Kanons wird nicht mitgezählt",
   !/Fremd/.test(r.text));
ok("ein Depot ohne origin/main wird BENANNT, nicht als grün verbucht",
   /⊘[^\n]*Ohne-Main/.test(r.text) && !/✓ Kanon[^\n]*Ohne-Main/.test(r.text));
ok("die Schlussrechnung stimmt (1 trägt, 2 weichen ab)",
   /1 tragen den Kanon · 2 weichen ab/.test(r.text), (r.text.match(/\d+ tragen den Kanon[^\n]*/) || [""])[0]);
ok("mehr als eine Fassung im Umlauf wird ausdrücklich gemeldet",
   /Mehr als eine Fassung im Umlauf bei 1 Modul/.test(r.text));
ok("es sagt NICHT „veraltet“, wo es das nicht wissen kann",
   /„Weicht ab" heißt NICHT „ist veraltet"/.test(r.text));

/* Die Rückgabewerte — die eigentliche Zusicherung des Werkzeugs. */
ok("ein Lauf mit Abweichungen ist trotzdem KEIN Fehlschlag (Auskunft, kein Riegel)",
   r.code === 0, `code=${r.code}`);
ok("… mit --streng aber schon", lauf("--streng").code === 1);
ok("ein Filter auf ein Modul ohne Kopien meldet keine Abweichung und ist grün",
   (() => { const b = lauf("B.js", "--streng"); return b.code === 0 && /0 weichen ab/.test(b.text); })());

/* Und die Gegenprobe zum Wichtigsten: erkennt es eine Übereinstimmung
   überhaupt, oder meldet es immer „weicht ab"? Ein Werkzeug, das nur klagen
   kann, ist von einem kaputten nicht zu unterscheiden. */
writeFileSync(join(sage, "src", "modules", "A.js"), "alte-fassung\n");
const r2 = lauf("A.js");
ok("zieht der Kanon nach, tragen ihn plötzlich zwei und einer weicht ab",
   /2 tragen den Kanon · 1 weichen ab/.test(r2.text),
   (r2.text.match(/\d+ tragen den Kanon[^\n]*/) || [""])[0]);
ok("… und mit --streng ist auch dieser Lauf noch rot (es weicht ja einer ab)",
   lauf("A.js", "--streng").code === 1);

rmSync(buehne, { recursive: true, force: true });
console.log(`\n${gruen} grün, ${rot} ROT`);
process.exit(rot ? 1 : 0);
