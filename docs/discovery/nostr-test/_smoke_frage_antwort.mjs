// Headless-Smoke für den Frage→Antwort-Test (frage-antwort.html).
// Run mit `node docs/discovery/nostr-test/_smoke_frage_antwort.mjs`.
//
// EHRLICH: prüft offline das Fundament — die NIP-01-Reply-Mechanik (Antwort
// trägt ein e-Tag auf die Frage-id) ist kryptographisch korrekt, und die Seite
// ist self-contained mit allen UI-Ankern. Der eigentliche geräteübergreifende
// Frage→Antwort-Beweis (Browser A fragt, Browser B antwortet) läuft in Klaus'
// Browsern — headless ersetzt das nicht. Kein Relay-Round-Trip vorausgesetzt.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = __dirname;
const results = [];
function ok(probe, cond) { results.push({ probe, ok: !!cond }); }
function eq(probe, expected, actual) { results.push({ probe, ok: expected === actual, expected, actual }); }

// ---- Probe 1: Seite existiert + teilt die vendorierte Krypto ----
ok("Probe 1: frage-antwort.html existiert", existsSync(resolve(dir, "frage-antwort.html")));
ok("Probe 1: noble-secp256k1.js (geteilt) existiert", existsSync(resolve(dir, "noble-secp256k1.js")));

// ---- Probe 2: NIP-01-Reply-Mechanik kryptographisch korrekt (Frage + Antwort) ----
globalThis.self = globalThis; // Browser-Shim für noble crypto.web
const { schnorr, utils } = await import(resolve(dir, "noble-secp256k1.js"));
const toHex = (b) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
const TAG = "sbkim-frage-antwort-test";
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return toHex(new Uint8Array(buf));
}
async function build(priv, pubHex, content, extraTags = []) {
  const created_at = 1700000000, kind = 1;
  const tags = [["t", TAG], ...extraTags];
  const id = await sha256Hex(JSON.stringify([0, pubHex, created_at, kind, tags, content]));
  const sig = await schnorr.sign(Uint8Array.from(id.match(/../g).map((h) => parseInt(h, 16))), priv);
  return { id, pubkey: pubHex, created_at, kind, tags, content, sig: toHex(sig) };
}
const refOf = (ev) => { const e = (ev.tags || []).find((t) => t[0] === "e"); return e ? e[1] : null; };

// Frager
const privA = utils.randomPrivateKey(); const pubA = toHex(schnorr.getPublicKey(privA));
const frage = await build(privA, pubA, "Was ist ein leichtes Sommeressen?");
// Antworter (andere Identität)
const privB = utils.randomPrivateKey(); const pubB = toHex(schnorr.getPublicKey(privB));
const antwort = await build(privB, pubB, "Ein Salat.", [["e", frage.id]]);

const idBytes = (h) => Uint8Array.from(h.match(/../g).map((x) => parseInt(x, 16)));
ok("Probe 2: Frage hat KEIN e-Tag (= Top-Level)", refOf(frage) === null);
eq("Probe 2: Antwort referenziert die Frage-id (e-Tag)", frage.id, refOf(antwort));
ok("Probe 2: Frage-Signatur verifiziert", await schnorr.verify(idBytes(frage.sig), idBytes(frage.id), idBytes(pubA)));
ok("Probe 2: Antwort-Signatur verifiziert", await schnorr.verify(idBytes(antwort.sig), idBytes(antwort.id), idBytes(pubB)));
ok("Probe 2: Frager und Antworter sind verschiedene Identitäten", pubA !== pubB);

// ---- Probe 3: Seite self-contained + UI-Anker + Konfiguration ----
const html = readFileSync(resolve(dir, "frage-antwort.html"), "utf8");
ok("Probe 3: bindet ./noble-secp256k1.js lokal ein", /from ['"]\.\/noble-secp256k1\.js['"]/.test(html));
ok("Probe 3: kein Runtime-CDN", !/(src|from)\s*=?\s*['"]https?:\/\//.test(html));
for (const id of ["me", "selftest", "qmsg", "ask", "threads", "relays"]) {
  ok("Probe 3: UI-Anker #" + id, new RegExp('id="' + id + '"').test(html));
}
ok("Probe 3: Tag sbkim-frage-antwort-test", html.includes(TAG));
ok("Probe 3: Antwort trägt e-Tag (Reply-Bezug)", /\['e', ev\.id\]|\["e", ev\.id\]/.test(html));
ok("Probe 3: partitioniert per refOf (e-Tag)", /function refOf/.test(html) && /renderQuestion/.test(html) && /renderAnswer/.test(html));
ok("Probe 3: puffert verwaiste Antworten", /pendingAnswers/.test(html));
ok("Probe 3: teilt Identität mit Pinnwand (sbkim_nostr_test_priv)", /sbkim_nostr_test_priv/.test(html));
ok("Probe 3: Rück-Link zum Pinnwand-Test", /href="\.\/index\.html"/.test(html));
ok("Probe 3: ehrlicher Footer (öffentlich + keine Bedeutungs-Sortierung)",
  /öffentlich/.test(html) && /Bedeutungs-Sortierung/.test(html));

// Gegenprobe in index.html: Vorwärts-Link gesetzt.
const indexHtml = readFileSync(resolve(dir, "index.html"), "utf8");
ok("Probe 3: index.html verlinkt auf frage-antwort.html", /href="\.\/frage-antwort\.html"/.test(indexHtml));

// ---- Auswertung ----
let pass = 0;
for (const r of results) {
  const extra = r.ok ? "" : (r.expected !== undefined ? ` (erwartet ${r.expected}, war ${r.actual})` : "");
  console.log(`[${r.ok ? "OK " : "FAIL"}] ${r.probe}${extra}`);
  if (r.ok) pass++;
}
console.log(`\n${pass}/${results.length} Proben grün`);
if (pass !== results.length) process.exit(1);
