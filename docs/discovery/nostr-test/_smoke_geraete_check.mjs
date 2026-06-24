// Headless-Smoke für den Geräte-Check (geraete-check.html).
// Run mit `node docs/discovery/nostr-test/_smoke_geraete_check.mjs`.
// Prüft Struktur + dass die echten Geräte-APIs abgefragt werden. Die Messung
// selbst läuft NUR im Browser auf Klaus' Gerät — headless kann sie nicht geben.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = __dirname;
const results = [];
const ok = (probe, cond) => results.push({ probe, ok: !!cond });

ok("Probe 1: geraete-check.html existiert", existsSync(resolve(dir, "geraete-check.html")));
const html = readFileSync(resolve(dir, "geraete-check.html"), "utf8");
ok("Probe 2: kein Runtime-CDN / extern", !/(src|href)\s*=\s*['"]https?:\/\//.test(html));
ok("Probe 3: fragt WebGPU-Adapter ab (nicht nur Präsenz)", /navigator\.gpu/.test(html) && /requestAdapter/.test(html));
ok("Probe 4: liest Arbeitsspeicher (deviceMemory)", /navigator\.deviceMemory/.test(html));
ok("Probe 5: liest CPU-Kerne (hardwareConcurrency)", /navigator\.hardwareConcurrency/.test(html));
ok("Probe 6: schätzt Speicher (storage.estimate)", /navigator\.storage/.test(html) && /estimate\(/.test(html));
ok("Probe 7: Verdikt je Stufe (1/Cloud/WebLLM)", /Stufe 1/.test(html) && /Cloud-Richter/.test(html) && /WebLLM/.test(html));
ok("Probe 8: ehrlich — Werte sind Näherungen", /Näherung/.test(html) && /freilöschen/.test(html));
ok("Probe 9: Rück-Link zur Frage→Antwort-Seite", /href="\.\/frage-antwort\.html"/.test(html));
const fa = readFileSync(resolve(dir, "frage-antwort.html"), "utf8");
ok("Probe 10: frage-antwort.html verlinkt den Geräte-Check", /href="\.\/geraete-check\.html"/.test(fa));

let pass = 0;
for (const r of results) { console.log(`[${r.ok ? "OK " : "FAIL"}] ${r.probe}`); if (r.ok) pass++; }
console.log(`\n${pass}/${results.length} Proben grün`);
if (pass !== results.length) process.exit(1);
