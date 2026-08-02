// Headless-Smoke für die Pinnwand-PWA (pinnwand/).
// Run mit `node pinnwand/_smoke.mjs`. Prüft Installierbarkeit + dass die
// Modul-Kopien NICHT abdriften (Drift-Guard). Der echte Lauf (Relays, Krypto,
// Embedding, Richter) ist im Browser bewiesen — headless prüft Struktur.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = __dirname;
const repoRoot = resolve(dir, "..");
const results = [];
const ok = (probe, cond) => results.push({ probe, ok: !!cond });
const eq = (probe, a, b) => results.push({ probe, ok: a === b });

// ---- Probe 1: Pflicht-Dateien ----
const REQUIRED = [
  "index.html", "manifest.json", "sw.js", "impressum.html",
  "icon-192.png", "icon-512.png",
  "modules/noble-secp256k1.js", "modules/03_embedding.js", "modules/24_ocr_eingabe.js",
];
for (const f of REQUIRED) ok("Probe 1: existiert " + f, existsSync(resolve(dir, f)));

// ---- Probe 2: Drift-Guard (Modul-Kopien byte-identisch) ----
ok("Probe 2: noble-secp256k1.js identisch zu nostr-test",
  readFileSync(resolve(repoRoot, "docs/discovery/nostr-test/noble-secp256k1.js"))
    .equals(readFileSync(resolve(dir, "modules/noble-secp256k1.js"))));
ok("Probe 2: 03_embedding.js identisch zu src/modules",
  readFileSync(resolve(repoRoot, "src/modules/03_embedding.js"))
    .equals(readFileSync(resolve(dir, "modules/03_embedding.js"))));
ok("Probe 2: 24_ocr_eingabe.js identisch zu src/modules",
  readFileSync(resolve(repoRoot, "src/modules/24_ocr_eingabe.js"))
    .equals(readFileSync(resolve(dir, "modules/24_ocr_eingabe.js"))));

// ---- Probe 3: manifest.json installierbar-tauglich ----
const manifest = JSON.parse(readFileSync(resolve(dir, "manifest.json"), "utf8"));
ok("Probe 3: name gesetzt", !!manifest.name);
eq("Probe 3: display standalone", "standalone", manifest.display);
ok("Probe 3: start_url + scope", !!manifest.start_url && !!manifest.scope);
const sizes = (manifest.icons || []).map((i) => i.sizes);
ok("Probe 3: Icon 192", sizes.includes("192x192"));
ok("Probe 3: Icon 512", sizes.includes("512x512"));
ok("Probe 3: maskable-Icon", (manifest.icons || []).some((i) => /maskable/.test(i.purpose || "")));
for (const ic of manifest.icons || []) {
  ok("Probe 3: Icon-Datei da " + ic.src, existsSync(resolve(dir, ic.src.replace(/^\.\//, ""))));
}

// ---- Probe 4: Service-Worker korrekt + APP_SHELL-Dateien existieren ----
const sw = readFileSync(resolve(dir, "sw.js"), "utf8");
ok("Probe 4: SW fetch-Listener (Installierbarkeit)", /addEventListener\(\s*["']fetch["']/.test(sw));
ok("Probe 4: SW install-Listener", /addEventListener\(\s*["']install["']/.test(sw));
ok("Probe 4: SW reicht Fremd-Origin durch (Relays/CDN/API)", /url\.origin !== self\.location\.origin/.test(sw));
ok("Probe 4: Navigation NETZ-ZUERST (kein Hängenbleiben alter Schale)", /req\.mode === "navigate"/.test(sw) && /NETZ ZUERST/.test(sw));
const shell = sw.match(/var APP_SHELL = \[([\s\S]*?)\];/);
ok("Probe 4: APP_SHELL-Liste gefunden", !!shell);
if (shell) {
  for (const m of shell[1].matchAll(/"\.\/([^"]*)"/g)) {
    if (m[1] === "") continue; // "./" = Verzeichnis
    ok("Probe 4: APP_SHELL-Datei da " + m[1], existsSync(resolve(dir, m[1])));
  }
}

// ---- Probe 5: index.html bindet lokal ein + registriert SW + kein CDN in der Schale ----
const html = readFileSync(resolve(dir, "index.html"), "utf8");
ok("Probe 5: lädt ./modules/noble-secp256k1.js", /from ['"]\.\/modules\/noble-secp256k1\.js['"]/.test(html));
ok("Probe 5: lädt ./modules/03_embedding.js", /src=["']\.\/modules\/03_embedding\.js["']/.test(html));
ok("Probe 5: registriert ./sw.js", /serviceWorker\.register\(\s*["']\.\/sw\.js["']/.test(html));
ok("Probe 5: bindet manifest ein", /rel="manifest" href="\.\/manifest\.json"/.test(html));
// Boot-Schale lokal: kein Remote-<script src> und kein STATISCHER Remote-Import.
// (Erlaubt + gewollt: Anthropic-Schlüssel-Link, WebLLM-Import via import() auf
//  Knopfdruck, Richter-/Modell-Egress zur Laufzeit — benannt + nutzer-ausgelöst.)
ok("Probe 5: kein Remote-<script src>", !/<script[^>]+src=["']https?:\/\//.test(html));
ok("Probe 5: kein statischer Remote-Import", !/\bfrom\s+["']https?:\/\//.test(html));
// Engine ist mitgekommen.
ok("Probe 5: Nostr-Tag + EVENT/REQ", /sbkim-frage-antwort-test/.test(html) && /'EVENT'/.test(html) && /'REQ'/.test(html));
ok("Probe 5: Whitening (Inhalt statt Hülle)", /function whiten\(/.test(html));
ok("Probe 5: Richter steckbar (claude + webllm)", /function getVerdicts/.test(html) && /callWebllmJudge/.test(html));
ok("Probe 5: ehrlich öffentlich", /öffentlich/.test(html));

// ---- Probe 6: neue Bedien-Funktionen (Klaus' Wünsche) ----
ok("Probe 6: Suchen lokal löschbar (hideQuestion + localStorage)", /function hideQuestion/.test(html) && /sbkim_pinnwand_hidden/.test(html));
ok("Probe 6: ausgeblendete bleiben weg (hidden.has Filter in renderQuestion)", /if \(hidden\.has\(ev\.id\)\) return;/.test(html));
ok("Probe 6: Brett leeren (clearBoard + Knopf)", /function clearBoard/.test(html) && /id="board-clear"/.test(html));
ok("Probe 6: Löschen-Kreuz pro Frage", /class="q-del"/.test(html) || /'q-del'/.test(html));
ok("Probe 6: Vergrößern-Knopf (data-scale, 3 Stufen)", /id="tb-zoom"/.test(html) && /data-scale/.test(html));
ok("Probe 6: Vollbild-Knopf (requestFullscreen)", /id="tb-full"/.test(html) && /requestFullscreen/.test(html));
ok("Probe 6: Hard-Reload-Knopf (SW unregister + caches leeren)", /id="tb-reload"/.test(html) && /getRegistrations/.test(html) && /caches\.delete/.test(html));
ok("Probe 6: Mikrofon-Knopf (Spracheingabe, fail-soft)", /id="mic"/.test(html) && /SpeechRecognition/.test(html) && /lang = 'de-DE'/.test(html));
ok("Probe 6: Mikrofon auch an Antwort-Feldern (attachMic)", /function attachMic/.test(html) && /attachMic\(amic, ta/.test(html));
ok("Probe 6: KI-Modelle löschbar (Cache außer App-Schale)", /id="webllm-clear"/.test(html) && /!k\.startsWith\('sbkim-pinnwand-'\)/.test(html));
ok("Probe 6: mehrere Richter-Anbieter (claude/gemini/openrouter)", /gemini:/.test(html) && /openrouter:/.test(html) && /CLOUD_PROVIDERS/.test(html));
ok("Probe 6: OpenRouter Gratis-Modelle live ladbar", /id="orFree"/.test(html) && /openrouter\.ai\/api\/v1\/models/.test(html) && /String\(pr\.prompt\) === '0'/.test(html));
ok("Probe 6: Schlüssel pro Anbieter gemerkt (keys-Map)", /store\.keys\[p\]/.test(html));
ok("Probe 6: mehrere wählbare Relays (Pool + Toggle, breit gestreut)", /RELAY_POOL/.test(html) && /function toggleRelay/.test(html) && /relay\.primal\.net/.test(html) && /sbkim_pinnwand_relays/.test(html));
ok("Probe 6: privates Brett verschlüsselt (AES-GCM + PBKDF2, Schlüssel nur im Speicher)",
  /id="boardkey"/.test(html) && /deriveBoardKey/.test(html) && /AES-GCM/.test(html) && /PBKDF2/.test(html) && !/localStorage\.[gs]etItem\([^)]*boardkey/.test(html));
ok("Probe 6: verschlüsselte Notiz ohne Schlüssel wird übersprungen", /if \(isEnc\(ev\.content\)\)/.test(html) && /if \(!boardKey\) return;/.test(html));
ok("Probe 6: Multi-Query A5b (expandQuery + bestRelevance über Frage-Varianten)", /function expandQuery/.test(html) && /function bestRelevance/.test(html) && /view\.qVecs/.test(html));

// ---- Probe 7: vorgezeichnetes HTML gegen den Code ----
// WARUM: Die Relais-Leiste steht seit 2026-08-02 fertig im HTML, statt erst von
// relayPills() gefüllt zu werden. Grund war ein Layout-Sprung — die Karte war
// sekundenlang zu kurz, dann rutschte alles darunter weg (an Kimboard gemessen:
// 0,433; gut ist unter 0,1). Das ist wirksam, hat aber einen Preis: dieselbe
// Liste steht jetzt an ZWEI Stellen. Wer eine ändert und die andere vergisst,
// baut eine stille Lüge in die Seite — sie zeigte beim Start etwas anderes als
// eine Sekunde später. Diese Probe ist der Preis für die Lösung.
{
  const poolRoh = /const RELAY_POOL = \[([\s\S]*?)\];/.exec(html);
  const pool = poolRoh ? Array.from(poolRoh[1].matchAll(/'(wss:\/\/[^']+)'/g)).map((m) => m[1]) : [];
  ok("Probe 7: RELAY_POOL gefunden", pool.length > 0);

  const sliceRoh = /activeRelays = RELAY_POOL\.slice\(0,\s*(\d+)\)/.exec(html);
  const anZahl = sliceRoh ? Number(sliceRoh[1]) : null;
  ok("Probe 7: Voreinstellung im Code gefunden (die ersten N sind an)", anZahl !== null);

  const block = /<div class="row" id="relays"[^>]*>([\s\S]*?)<\/div>/.exec(html);
  const pillen = block
    ? Array.from(block[1].matchAll(/<span class="pill"[^>]*opacity:([\d.]+);"[^>]*>\s*<span class="dot([^"]*)"><\/span>([^<]*)<\/span>/g))
        .map((m) => ({ deckkraft: Number(m[1]), punkt: m[2].trim(), text: m[3] }))
    : [];
  eq("Probe 7: gleich viele vorgezeichnete Pillen wie Relais", pillen.length, pool.length);

  let textOk = true, zustandOk = true;
  pool.forEach((url, i) => {
    const pi = pillen[i];
    if (!pi) { textOk = zustandOk = false; return; }
    const an = i < anZahl;
    if (pi.text !== (an ? "" : "+ ") + url.replace("wss://", "")) textOk = false;
    if (an ? !(pi.deckkraft === 1 && pi.punkt === "try") : !(pi.deckkraft < 1 && pi.punkt === "")) zustandOk = false;
  });
  ok("Probe 7: Beschriftung + Reihenfolge stimmen mit RELAY_POOL überein", textOk);
  ok("Probe 7: die ersten " + anZahl + " sind als »an« gezeichnet, der Rest als »aus«", zustandOk);

  // Und die Breiten-Reservierung, die den zweiten Teil des Sprungs beseitigt:
  // #me wächst von „…" (1 Zeichen) auf short(pubHex) (13 Zeichen).
  ok("Probe 7: Breite für die Kennung ist freigehalten (#me min-width)",
    /#me \{[^}]*min-width:\s*13ch/.test(html));
  ok("Probe 7: die Seite hat einen <main>-Bereich", /<main>/.test(html) && /<\/main>/.test(html));
}

// ---- Auswertung ----
let pass = 0;
for (const r of results) { console.log(`[${r.ok ? "OK " : "FAIL"}] ${r.probe}`); if (r.ok) pass++; }
console.log(`\n${pass}/${results.length} Proben grün`);
if (pass !== results.length) process.exit(1);
