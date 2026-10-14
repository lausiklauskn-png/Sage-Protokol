// Smoke — Mycel-Karte: fremder Text im Ereignis-Protokoll ist Text, kein HTML.
//
// Befund 2026-10-14 (docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md):
// logEvent() setzt `div.innerHTML = html`; ein Kartenname aus einem FREMDEN
// Presence-Event (gekappt auf 28 Zeichen) und ein fremdes `outcome` gingen roh
// hinein. Diese Probe ruft den echten Empfangsweg (handleRelayEvent) im
// Browser mit erfundenen Ereignissen und besteht darauf, dass nichts ausgeführt
// wird und der Text wörtlich dasteht. Kein Netz: die Ereignisse werden direkt
// übergeben, das Lauschen wird nie eingeschaltet.
// Braucht `playwright-core`. Fehlt es: nicht lauffähig, nicht rot.
import { existsSync, readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let gruen = 0, rot = 0;
const ok = (n, b, x) => { if (b) { gruen++; console.log("✓ " + n); } else { rot++; console.log("✗ ROT: " + n + (x ? " — " + x : "")); } };

function chrom() {
  if (existsSync("/opt/pw-browsers/chromium")) return "/opt/pw-browsers/chromium";
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    for (const n of readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      for (const u of ["chrome-linux", "chrome-linux64"]) { const w = join(heim, n, u, "chrome"); if (existsSync(w)) return w; }
    }
  } catch {}
  return join(heim, "chromium", "chrome-linux", "chrome");
}

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("⊘ nicht lauffähig: playwright-core fehlt (npm install)"); process.exit(0); }

const PORT = 9060 + (process.pid % 30);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: wurzel, stdio: "ignore" });
for (let i = 0; i < 120; i++) {
  try { const a = await fetch(`http://127.0.0.1:${PORT}/mycel-karte/index.html`); if (a.ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 50));
}
const browser = await chromium.launch({ executablePath: chrom() });
try {
  const seite = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  // Nichts darf ins Netz: jeder Abruf außerhalb des eigenen Servers wird abgewiesen.
  await seite.route(/^(?!http:\/\/127\.0\.0\.1).*/, (r) => r.abort());
  await seite.goto(`http://127.0.0.1:${PORT}/mycel-karte/index.html`);
  await seite.waitForFunction(() => typeof handleRelayEvent === "function");
  const NAME = "<img src=x onerror=__xss=1>";       // 27 Zeichen, passt unter den 28er-Deckel
  const OUT = "<svg/onload=__xss2=1>";
  const r = await seite.evaluate(({ NAME, OUT }) => {
    const id = "live_" + "A".repeat(40);
    handleRelayEvent({ id: "e1", tags: [["t", "sbkim-rdv"]],
      content: JSON.stringify({ kind: "sbkim-presence", nodeId: id, nodeName: NAME, spore: null }) });
    handleRelayEvent({ id: "e2", tags: [["t", "sbkim-anastomosis-reply"], ["d", id]],
      content: JSON.stringify({ outcome: OUT }) });
    return new Promise((res) => setTimeout(() => {
      const log = document.querySelectorAll("#log .e, .e");
      const texte = Array.from(log).map((d) => d.textContent);
      res({ xss: typeof window.__xss, xss2: typeof window.__xss2,
            img: document.querySelectorAll(".e img, .e svg").length,
            name: texte.some((t) => t.includes(NAME)), out: texte.some((t) => t.includes(OUT)) });
    }, 300));
  }, { NAME, OUT });
  ok("Kartenname aus einem fremden Ereignis wird nicht ausgeführt", r.xss === "undefined" && r.img === 0, JSON.stringify(r));
  ok("fremdes outcome wird nicht ausgeführt", r.xss2 === "undefined", JSON.stringify(r));
  ok("der Kartenname steht wörtlich im Protokoll", r.name === true);
  ok("das outcome steht wörtlich im Protokoll", r.out === true);
} finally {
  await browser.close(); server.kill();
}
console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exit(rot ? 1 : 0);
