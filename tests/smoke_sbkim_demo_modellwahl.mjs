/* Probe: die SBKIM-Demo darf keine feste Modell-Nummer mehr tragen.
 *
 * ── WARUM ES DIESE PROBE GIBT (Klaus 2026-08-15) ──────────────────────────
 *
 * Klaus' Befund: „Da ist das, wo die [Kanten]stärke gemessen wird, ist immer
 * null null, weil die Agenten, die geladen werden, nicht echt sind."
 *
 * Die Beobachtung stimmte, die Erklärung nicht. Die drei Beispiel-Agenten
 * sind völlig in Ordnung — sie sind ja nur Beschreibungen, mehr braucht ein
 * Matching nicht. Kaputt war etwas anderes: in vier Dateien stand eine
 * **feste Modell-Nummer** (`claude-sonnet-4-20250514`, `claude-sonnet-4-6`)
 * aus dem Frühjahr 2025. Modelle werden abgekündigt. Ab dem Tag, an dem das
 * geschieht, antwortet die API auf JEDE Anfrage mit 404 — und der `catch` in
 * `runAllPairs` machte daraus brav ein Ergebnis:
 *
 *     { overall: 0, empfehlung: 'Nicht geeignet', summary: 'Analyse fehlgeschlagen' }
 *
 * Damit stand auf dem Bildschirm ein **Urteil** über drei Systeme, die nie
 * geprüft worden waren. Das ist der schlimmste Fehler, den eine Seite machen
 * kann, die mit gemessenen Werten wirbt: ein Ausfall, der aussieht wie ein
 * Ergebnis. Genau deshalb ist er auch monatelang niemandem aufgefallen —
 * 0 % sah plausibel aus.
 *
 * Zwei Dinge hält diese Probe darum fest, und beide brauchen einander:
 *
 *   1  KEINE FESTE MODELL-NUMMER. Das Konto wird gefragt, welche Modelle es
 *      hat (dasselbe Muster wie beim Gemini-Anbieter in Modul 04, „404-fest").
 *      Sonst verrottet die Demo bei der nächsten Abkündigung wieder still.
 *   2  EIN AUSFALL BLEIBT EIN AUSFALL. Kein `overall: 0`, kein
 *      „Nicht geeignet" — ein nicht geprüftes Paar sagt, dass es nicht
 *      geprüft wurde, und nennt den Grund.
 *
 * Die Modell-Wahl selbst wird hier mit einem **gefälschten `fetch`** befragt.
 * Ein Wächter, der nur „in echt" läuft, wird nie geprüft — und diese Probe
 * soll gerade dann etwas sagen, wenn kein Schlüssel und kein Netz da ist.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const DEMO = join(HIER, "..", "sbkim-demo");
const lies = (f) => readFileSync(join(DEMO, f), "utf8");

let fehler = 0;
const ok = (name, wahr, hinweis = "") => {
  console.log((wahr ? "  ✓ " : "  ✗ ") + name + (wahr || !hinweis ? "" : ` — ${hinweis}`));
  if (!wahr) fehler++;
};

const DATEIEN = ["demo.html", "sbkim-network.html", "USP_SBKIM.html", "protocol/sbkim-node.html"];

console.log("\n── Keine feste Modell-Nummer ──");
for (const f of DATEIEN) {
  const h = lies(f);
  const treffer = h.match(/model:\s*['"]claude-[^'"]*['"]/g) || [];
  ok(`${f} nennt kein festes Modell`, treffer.length === 0, treffer.join(", "));
  ok(`${f} fragt stattdessen das Konto`, /await waehleModell\(/.test(h));
}

console.log("\n── Die Wahl selbst (gefälschter fetch) ──");
{
  const h = lies("sbkim-network.html");
  const a = h.indexOf("const MODELL_ERSATZ");
  const e = h.indexOf("\n}", h.indexOf("async function waehleModell")) + 2;
  const quelle = h.slice(a, e);
  ok("die Wahl-Funktion ist auffindbar", a > 0 && e > a);

  const lauf = (fakeFetch) =>
    new Function("fetch", quelle + '\nreturn waehleModell("sk-test");')(fakeFetch);
  const konto = (data) => async () => ({ ok: true, json: async () => ({ data }) });

  ok("nimmt das neueste Haiku aus dem Konto",
     (await lauf(konto([
       { id: "claude-haiku-4-5-20251001", created_at: "2025-10-01" },
       { id: "claude-haiku-9-20260701", created_at: "2026-07-01" },
       { id: "claude-opus-5", created_at: "2026-06-01" }
     ]))) === "claude-haiku-9-20260701");

  ok("ohne Haiku das neueste Modell überhaupt",
     (await lauf(konto([
       { id: "claude-opus-5", created_at: "2026-06-01" },
       { id: "claude-alt", created_at: "2024-01-01" }
     ]))) === "claude-opus-5");

  /* Drei Wege, auf denen die Auskunft ausbleiben kann — auf keinem davon
     darf die Demo stehenbleiben. Ein Besucher mit altem Schlüssel soll die
     Sache trotzdem sehen. */
  const ERSATZ = "claude-haiku-4-5-20251001";
  ok("HTTP-Fehler → Ersatz statt Absturz",
     (await lauf(async () => ({ ok: false, json: async () => ({}) }))) === ERSATZ);
  ok("kein Netz → Ersatz statt Absturz",
     (await lauf(async () => { throw new Error("offline"); })) === ERSATZ);
  ok("leere Liste → Ersatz statt Absturz",
     (await lauf(konto([]))) === ERSATZ);
}

console.log("\n── Ein Ausfall sieht nicht aus wie ein Urteil ──");
{
  const h = lies("sbkim-network.html");
  /* Die alte Zeile ist der eigentliche Befund. Sie darf nicht zurückkehren:
     ein `overall: 0` mit `empfehlung` im Fang IST die Behauptung. */
  ok("kein 0-%-Urteil mehr im Fang",
     !/catch\s*\([\s\S]{0,400}?empfehlung:\s*'Nicht geeignet'/.test(h));
  ok("der Fang merkt sich stattdessen den Grund",
     /catch\s*\([\s\S]{0,600}?fehler:\s*\(e && e\.message\)/.test(h));
  ok("die Matrix zeigt ein Fragezeichen, keine Zahl",
     /zelle\.fehler[\s\S]{0,200}?ms-err/.test(h));
  ok("… mit dem Grund am Feld", /title="nicht analysiert: \$\{esc\(zelle\.fehler\)\}"/.test(h));
  ok("die Paar-Karte sagt „nicht analysiert“",
     /r\.fehler[\s\S]{0,900}?nicht analysiert/.test(h));
  ok("… und nennt den Grund im Klartext",
     /Grund: \$\{esc\(r\.fehler\)\}/.test(h));
  ok("die Fehler-Optik ist grau, nicht rot",
     /\.ms-err\{background:rgba\(148,163,184/.test(h) &&
     /\.rec-err\{background:rgba\(148,163,184/.test(h));
}

console.log("\n── Die drei Beispiel-Agenten sind da (sie waren nie das Problem) ──");
{
  const h = lies("sbkim-network.html");
  for (const name of ["Beispiel CRM", "Analyse-Engine", "Kunden-Portal"]) {
    ok(`Agent „${name}“ wird geladen`, new RegExp(`name: '${name}'`).test(h));
  }
  ok("und die Demo braucht dafür kein zweites Gerät",
     /kein zweites Ger(ä|&auml;)t n(ö|&ouml;)tig/.test(h));
}

console.log(fehler ? `\n${fehler} Prüfung(en) ROT` : "\nalle Prüfungen grün");
process.exit(fehler ? 1 : 0);
