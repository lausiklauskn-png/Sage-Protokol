#!/usr/bin/env node
/*
 * Smoke — Modul 20 Geheimnis-Ablage (putSecret/getSecret), Bau 2026-07-11.
 *
 * Beweist die sicherheitskritische Kern-Logik headless (echtes WebCrypto):
 *  - Round-trip: putSecret -> getSecret gibt den Klartext zurück.
 *  - FALSCHES Passwort -> null (kein Klartext-Leck).
 *  - Manipulierter Chiffretext -> null (AES-GCM erkennt Manipulation).
 *  - Kein Klartext im Storage-Blob (nur salt/iv/ct).
 *  - Frisches Salt/IV pro Ablage (zwei putSecret desselben Werts -> andere Blobs).
 *  - hasSecret / removeSecret / fehlend -> null.
 *  - Aufrufer-Fehler werfen (leerer Name/Wert, zu kurzes Passwort).
 *  - Unabhängig vom Identitäts-Vault (kein createVault nötig).
 *
 * Aufruf:  node tests/smoke_bau20_secret.mjs   ·   Exit 0 = grün.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { webcrypto } from "node:crypto";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

let pass = 0, fail = 0;
function ok(cond, name) { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name); } }

// In-Memory-Storage-Mock (Modul-01-Form) inkl. del.
const mem = {};
globalThis.SbkimStorage = {
  ensureStore: async () => {},
  get: async (store, key) => (mem[store] && key in mem[store]) ? mem[store][key] : undefined,
  put: async (store, key, value) => { (mem[store] = mem[store] || {})[key] = value; },
  del: async (store, key) => { if (mem[store]) delete mem[store][key]; },
  clear: async (store) => { mem[store] = {}; },
};
// KEIN SbkimSpore nötig — Geheimnisse hängen nicht am Identitäts-Vault.

const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/20_schluessel_safe.js"));
const V = globalThis.SbkimSafe;

async function main() {
  const KEY = "ki_richter_key:mistral";
  const SECRET = "sk-abc123-geheim";
  const PW = "mein-tresor-pw";

  // Round-trip
  await V.putSecret(KEY, SECRET, PW);
  ok((await V.getSecret(KEY, PW)) === SECRET, "Round-trip: putSecret -> getSecret == Klartext");

  // hasSecret
  ok((await V.hasSecret(KEY)) === true, "hasSecret true nach putSecret");
  ok((await V.hasSecret("gibts-nicht")) === false, "hasSecret false für Unbekanntes");

  // Falsches Passwort -> null
  ok((await V.getSecret(KEY, "falsch")) === null, "falsches Passwort -> null (kein Leck)");

  // Kein Klartext im Blob
  const blob = mem["sbkim_safe"]["secret:" + KEY];
  const raw = JSON.stringify(blob);
  ok(raw.indexOf(SECRET) < 0 && !!blob.salt && !!blob.iv && !!blob.ct, "Blob enthält KEINEN Klartext (nur salt/iv/ct)");

  // Merkhilfe (hint): unverschlüsselt, ohne Passwort lesbar, ersetzt NIE das Geheimnis
  await V.putSecret("mitHint", SECRET, PW, { hint: "erstes Haustier" });
  ok((await V.getSecretHint("mitHint")) === "erstes Haustier", "getSecretHint gibt Merkhilfe OHNE Passwort zurück");
  ok((await V.getSecret("mitHint", PW)) === SECRET, "Merkhilfe stört Geheimnis-Entschlüsselung nicht");
  ok((await V.getSecretHint(KEY)) === null, "getSecretHint null, wenn keine Merkhilfe hinterlegt");
  ok((await V.getSecretHint("gibts-nicht")) === null, "getSecretHint null für unbekanntes Geheimnis");
  // Merkhilfe wird gekappt (kein Aufsatz)
  await V.putSecret("langHint", SECRET, PW, { hint: "x".repeat(300) });
  ok((await V.getSecretHint("langHint")).length === 140, "Merkhilfe wird auf 140 Zeichen gekappt");
  // Leere/whitespace Merkhilfe -> kein hint-Feld
  await V.putSecret("leerHint", SECRET, PW, { hint: "   " });
  ok((await V.getSecretHint("leerHint")) === null, "leere/whitespace Merkhilfe -> kein hint gespeichert");

  // Manipulierter Chiffretext -> null
  const tampered = Object.assign({}, blob, { ct: (blob.ct[0] === "A" ? "B" : "A") + blob.ct.slice(1) });
  mem["sbkim_safe"]["secret:tamper"] = tampered;
  ok((await V.getSecret("tamper", PW)) === null, "manipulierter Chiffretext -> null (AES-GCM erkennt Manipulation)");

  // Frisches Salt/IV -> andere Blobs für denselben Wert
  await V.putSecret("k2", SECRET, PW);
  const b2 = mem["sbkim_safe"]["secret:k2"];
  ok(b2.salt !== blob.salt && b2.iv !== blob.iv && b2.ct !== blob.ct, "frisches Salt/IV -> unterschiedliche Blobs");

  // removeSecret
  await V.removeSecret(KEY);
  ok((await V.hasSecret(KEY)) === false && (await V.getSecret(KEY, PW)) === null, "removeSecret entfernt das Geheimnis");

  // fehlend -> null
  ok((await V.getSecret("nie-abgelegt", PW)) === null, "fehlendes Geheimnis -> null");

  // Aufrufer-Fehler werfen
  let threw = false;
  try { await V.putSecret("", SECRET, PW); } catch (e) { threw = e.name === "InvalidSecretNameError"; }
  ok(threw, "leerer Name -> InvalidSecretNameError");
  threw = false;
  try { await V.putSecret("x", "", PW); } catch (e) { threw = e.name === "InvalidSecretValueError"; }
  ok(threw, "leerer Wert -> InvalidSecretValueError");
  threw = false;
  try { await V.putSecret("x", SECRET, "kurz"); } catch (e) { threw = e.name === "WeakPasswordError"; }
  ok(threw, "zu kurzes Passwort -> WeakPasswordError");

  console.log(`\n${pass}/${pass + fail} Proben grün`);
  if (fail) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
