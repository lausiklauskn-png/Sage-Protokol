// Headless-Smoke für den Nostr-Pinnwand-Test (docs/discovery/nostr-test/).
// Run mit `node docs/discovery/nostr-test/_smoke.mjs`.
//
// EHRLICH: Dieser Smoke beweist NUR das Medium-Fundament offline:
//   - die vendorierte Krypto lädt dependency-frei (kein Bare-Import) und
//     leistet die volle Nostr-Kette (x-only pubkey, sha256-Event-id,
//     Schnorr sign + verify),
//   - die Seite ist self-contained und trägt alle UI-Anker + die Relay-/Tag-
//     Konfiguration aus dem Brief.
// Der Relay-Round-Trip (Zettel A -> Browser B) wird NICHT vorausgesetzt —
// headless hat evtl. kein Netz zu den Relays, und der eigentliche Boden-Beweis
// läuft gerätegreifend in Klaus' Browser. Das Repo nutzt keine Browser-Engine
// (Playwright nicht installiert) — daher prüfen wir Seite + Krypto + UI per
// Datei-Analyse und echtem Modul-Import, nicht den DOM-Lauf.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = __dirname;

const results = [];
function ok(probe, cond) { results.push({ probe, ok: !!cond }); }
function eq(probe, expected, actual) { results.push({ probe, ok: expected === actual, expected, actual }); }

// ---- Probe 1: Pflicht-Dateien existieren ----
for (const f of ["index.html", "noble-secp256k1.js", "_smoke.mjs"]) {
  ok("Probe 1: existiert " + f, existsSync(resolve(dir, f)));
}

// ---- Probe 2: Krypto dependency-frei (kein Bare-Import, browser-tauglich) ----
const noble = readFileSync(resolve(dir, "noble-secp256k1.js"), "utf8");
// Kein echter Import einer Bare-Spezifizierung (außerhalb des Kopf-Kommentars).
const codeOnly = noble.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
ok("Probe 2: kein Bare-Import 'crypto'", !/\bimport\b[^\n]*\bfrom\s*['"]crypto['"]/.test(codeOnly));
ok("Probe 2: kein require(", !/\brequire\s*\(/.test(codeOnly));
ok("Probe 2: schnorr wird exportiert", /export const schnorr/.test(noble));
ok("Probe 2: Node-Zweig deaktiviert (node: undefined)", /node:\s*undefined/.test(noble));

// ---- Probe 3: echter Krypto-Roundtrip (die Nostr-Kette, offline) ----
globalThis.self = globalThis; // Browser-Shim: noble nutzt crypto.web = self.crypto
const { schnorr, utils } = await import(resolve(dir, "noble-secp256k1.js"));
const toHex = (b) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
const priv = utils.randomPrivateKey();
const pub = schnorr.getPublicKey(priv);
eq("Probe 3: privater Schlüssel 32 Byte", 32, priv.length);
eq("Probe 3: pubkey x-only 32 Byte", 32, pub.length);
const pubHex = toHex(pub);
const created_at = 1700000000, kind = 1, tags = [["t", "sbkim-pinnwand-test"]], content = "Salate";
const ser = JSON.stringify([0, pubHex, created_at, kind, tags, content]);
const idBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ser));
const id = new Uint8Array(idBuf);
eq("Probe 3: Event-id 32 Byte (sha256)", 32, id.length);
const sig = await schnorr.sign(id, priv);
eq("Probe 3: Schnorr-Signatur 64 Byte", 64, sig.length);
ok("Probe 3: Schnorr verify (selbst signiert)", await schnorr.verify(sig, id, pub));
// Negativ: manipulierte id verifiziert NICHT.
const bad = new Uint8Array(id); bad[0] ^= 0xff;
ok("Probe 3: verify schlägt fehl bei manipulierter id", !(await schnorr.verify(sig, bad, pub)));

// ---- Probe 4: Seite self-contained + UI-Anker + Konfiguration ----
const html = readFileSync(resolve(dir, "index.html"), "utf8");
ok("Probe 4: bindet ./noble-secp256k1.js lokal ein", /from ['"]\.\/noble-secp256k1\.js['"]/.test(html));
ok("Probe 4: kein Runtime-CDN (http im script/src)", !/(src|from)\s*=?\s*['"]https?:\/\//.test(html));
for (const id of ["me", "selftest", "msg", "post", "board", "relays"]) {
  ok("Probe 4: UI-Anker #" + id, new RegExp('id="' + id + '"').test(html));
}
ok("Probe 4: Tag sbkim-pinnwand-test gesetzt", /sbkim-pinnwand-test/.test(html));
for (const r of ["relay.damus.io", "nos.lol", "relay.nostr.band"]) {
  ok("Probe 4: Relay " + r, html.includes(r));
}
ok("Probe 4: sendet EVENT", /\['EVENT', ev\]|\["EVENT", ev\]/.test(html));
ok("Probe 4: abonniert REQ", /'REQ'|"REQ"/.test(html));
ok("Probe 4: Krypto-Selbsttest beim Laden", /schnorr\.verify/.test(html));
ok("Probe 4: Auto-Reconnect (scheduleReconnect)", /scheduleReconnect/.test(html));
ok("Probe 4: Reconnect bei Tab-Sichtbarkeit", /visibilitychange/.test(html));
ok("Probe 4: ehrlicher Footer (öffentlich/kein Spam-Schutz)", /öffentlich/.test(html) && /Spam-Schutz/.test(html));

// ---- Auswertung ----
let pass = 0;
for (const r of results) {
  const tag = r.ok ? "OK " : "FAIL";
  const extra = r.ok ? "" : (r.expected !== undefined ? ` (erwartet ${r.expected}, war ${r.actual})` : "");
  console.log(`[${tag}] ${r.probe}${extra}`);
  if (r.ok) pass++;
}
console.log(`\n${pass}/${results.length} Proben grün`);
if (pass !== results.length) process.exit(1);
