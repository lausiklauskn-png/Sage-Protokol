#!/usr/bin/env node
/*
 * Smoke — Modul 20 Schlüssel-Tresor: Shamir (2 von 3) + Tresor-Logik.
 *
 * Prüft die sicherheitskritische Kern-Logik headless:
 *  - Shamir split/combine über GF(256): k=2 von N=3, jede 2er-Teilmenge
 *    rekonstruiert das Geheimnis; 1 Anteil reicht NICHT.
 *  - Tresor create/unlock/recover mit gemocktem SbkimSpore (exportBackup/
 *    importBackup) + In-Memory-SbkimStorage.
 *
 * Aufruf:  node tests/smoke_bau20_tresor.mjs   ·   Exit 0 = grün.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { webcrypto } from "node:crypto";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name); }
}

// In-Memory-Storage-Mock (Modul-01-Form).
const mem = {};
globalThis.SbkimStorage = {
  ensureStore: async () => {},
  get: async (store, key) => (mem[store] && key in mem[store]) ? mem[store][key] : undefined,
  put: async (store, key, value) => { (mem[store] = mem[store] || {})[key] = value; },
  clear: async (store) => { mem[store] = {}; },
};

// Spore-Mock: exportBackup verschlüsselt "symbolisch" (prüft nur Passwort).
globalThis.SbkimSpore = {
  exportBackup: async (password) => {
    if (typeof password !== "string" || password.length < 8) throw new Error("InvalidBackupPasswordError");
    return { version: 2, _pw: password, payload: "verschluesselte-identitaet" };
  },
  importBackup: async (blob, password) => {
    if (!blob || blob._pw !== password) throw new Error("BackupDecryptError: falsches Passwort");
    return true;
  },
};

const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/20_schluessel_tresor.js"));
const V = globalThis.SbkimVault;

function eqBytes(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

async function main() {
  ok(!!V, "Modul 20 geladen");
  await V.init({ autoPrompt: false });   // headless: kein UI
  ok(V._meta.shamirN === 3 && V._meta.shamirK === 2, "Default Shamir 2 von 3");

  // ---- Shamir-Kern ----
  const secret = new TextEncoder().encode("Mein-Geheimes-Passwort-123!äöü");
  const shareObjs = V._shamirSplitBytes(secret, 3, 2);
  ok(shareObjs.length === 3, "split → 3 Anteile");

  // jede 2er-Teilmenge rekonstruiert
  const pairs = [[0,1],[0,2],[1,2]];
  let allPairsOk = true;
  for (const [a, b] of pairs) {
    const rec = V._shamirCombineBytes([shareObjs[a], shareObjs[b]]);
    if (!eqBytes(rec, secret)) allPairsOk = false;
  }
  ok(allPairsOk, "jede 2-von-3-Teilmenge rekonstruiert das Geheimnis");

  // alle 3 zusammen rekonstruieren ebenfalls
  ok(eqBytes(V._shamirCombineBytes(shareObjs), secret), "alle 3 Anteile rekonstruieren");

  // 1 Anteil reicht NICHT (darf das Geheimnis nicht ergeben)
  const one = V._shamirCombineBytes([shareObjs[0]]);
  ok(!eqBytes(one, secret), "1 Anteil reicht NICHT (kein Geheimnis)");

  // Encode/Decode-Round-Trip
  const enc = V._encodeShare(shareObjs[0]);
  const dec = V._decodeShare(enc);
  ok(dec.x === shareObjs[0].x && eqBytes(dec.bytes, shareObjs[0].bytes), "Anteil encode→decode round-trip");

  // ---- Tresor-Logik ----
  ok((await V.hasVault()) === false, "vor createVault: kein Tresor");
  const pw = "tresor-pw-2026";
  const res = await V.createVault(pw);
  ok(Array.isArray(res.shares) && res.shares.length === 3, "createVault → 3 Anteile");
  ok((await V.hasVault()) === true, "nach createVault: Tresor vorhanden");
  ok(V.isUnlocked() === true, "nach createVault: entsperrt");

  V.lock();
  ok(V.isUnlocked() === false, "lock() sperrt");

  ok((await V.unlock("falsch-falsch")) === false, "unlock mit falschem Passwort → false");
  ok(V.isUnlocked() === false, "nach Fehlversuch weiterhin gesperrt");
  ok((await V.unlock(pw)) === true, "unlock mit richtigem Passwort → true");
  ok(V.isUnlocked() === true, "nach unlock entsperrt");

  // Recovery: 2 der 3 Anteile rekonstruieren das Passwort
  const recPw = V.recoverPassword([res.shares[0], res.shares[2]]);
  ok(recPw === pw, "recoverPassword (2 von 3) liefert das Passwort");
  ok(V.recoverPassword([res.shares[1]]) === null, "recoverPassword mit 1 Anteil → null");
  // und mit dem wiederhergestellten Passwort lässt sich entsperren
  V.lock();
  ok((await V.unlock(recPw)) === true, "unlock mit wiederhergestelltem Passwort → true");

  console.log("\n  " + pass + "/" + (pass + fail) + " grün" + (fail ? " — " + fail + " FEHLER" : ""));
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
