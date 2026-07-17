#!/usr/bin/env node
/*
 * Smoke — Modul 20 Schlüssel-Safe mit ECHTER Krypto + ECHTEM Storage-Round-Trip.
 *
 * Warum dieser Smoke zusätzlich zu smoke_bau20_safe.mjs existiert:
 * Der bestehende Smoke MOCKT Modul 02 (exportBackup/importBackup) + Storage
 * (In-Memory). Dadurch blieb ein realer Bug UNENTDECKT (Klaus' Browser-Sichttest
 * B1, 2026-07-17): `createVault` gelang, aber `unlock` mit korrektem Passwort gab
 * `false` — weil die Identität KEINE Spore hatte und `importBackup` je Identität
 * eine Spore verlangt (Asymmetrie zu `exportBackup`, das sie fehlend erlaubt).
 *
 * Dieser Smoke fährt die ECHTEN Module 01+02+20 gegen fake-indexeddb (echte
 * structured-clone-Semantik) + node:crypto WebCrypto und deckt beide Pfade ab:
 *   - OHNE Spore: createVault wirft NoSporeError (Fremdnutzer-Schutz, klarer Fehler
 *     statt stillem unlock-Fehlschlag).
 *   - MIT Spore: createVault -> lock -> unlock(korrekt)=true, unlock(falsch)=false,
 *     recoverPassword aus 2/3 Anteilen == Passwort.
 *
 * Aufruf:  npm install --no-save fake-indexeddb && node tests/smoke_bau20_safe_real.mjs
 *          Exit 0 = grün.
 */
import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.btoa) globalThis.btoa = (s) => Buffer.from(s, "binary").toString("base64");
if (!globalThis.atob) globalThis.atob = (s) => Buffer.from(s, "base64").toString("binary");

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
function loadModule(rel) { (0, eval)(readFileSync(resolve(repoRoot, rel), "utf8")); }
loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
loadModule("src/modules/20_schluessel_safe.js");
const { SbkimStorage, SbkimSpore, SbkimSafe } = globalThis;

let pass = 0, fail = 0;
function ok(cond, name) { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name); } }

console.log("== Modul 20 — Schlüssel-Safe (ECHTE Krypto + Storage) ==");

const PW = "safe-test-passwort-2026";

await SbkimStorage.init();
if (SbkimSpore.init) await SbkimSpore.init();
await SbkimSpore.getOrCreateIdentity();
await SbkimSafe.init({ autoPrompt: false });

// --- Pfad B: OHNE Spore -> createVault muss klar scheitern (kein stiller Fehler) ---
ok(!(await SbkimSpore.getOwnSpore()), "B1 Ausgangslage: noch keine Spore");
let threw = null;
try { await SbkimSafe.createVault(PW); } catch (e) { threw = e; }
ok(threw && threw.name === "NoSporeError", "B2 createVault ohne Spore -> NoSporeError (Fremdnutzer-Schutz)");
ok((await SbkimSafe.hasVault()) === false, "B3 kein halber Safe angelegt");

// --- Spore erzeugen wie eine echte App (Andock-Wizard) ---
await SbkimSpore.generateOwnSpore({ domain: "Smoke-Domäne", endpoint: "https://smoke.local/", nodeType: "hybrid" });
ok(!!(await SbkimSpore.getOwnSpore()), "S1 Spore erzeugt");

// --- Pfad A: MIT Spore -> voller Round-Trip ---
const res = await SbkimSafe.createVault(PW);
ok(Array.isArray(res.shares) && res.shares.length === 3, "A1 createVault -> 3 Anteile");
ok(SbkimSafe.isUnlocked() === true, "A2 nach createVault: entsperrt");
ok((await SbkimSafe.hasVault()) === true, "A3 Safe persistiert");

SbkimSafe.lock();
ok(SbkimSafe.isUnlocked() === false, "A4 lock() sperrt");

const okCorrect = await SbkimSafe.unlock(PW);
ok(okCorrect === true, "A5 unlock(korrektes Passwort) === true  ← DER BUG aus B1");
ok(SbkimSafe.isUnlocked() === true, "A6 danach entsperrt");

SbkimSafe.lock();
const okWrong = await SbkimSafe.unlock("falsch-falsch-falsch");
ok(okWrong === false, "A7 unlock(falsches Passwort) === false (kein Leck)");
ok(SbkimSafe.isUnlocked() === false, "A8 bleibt gesperrt");

const rec = SbkimSafe.recoverPassword([res.shares[0], res.shares[2]]);
ok(rec === PW, "A9 recoverPassword aus 2/3 Anteilen == Passwort");
ok(SbkimSafe.recoverPassword([res.shares[1]]) === null, "A10 ein Anteil reicht nicht");

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail === 0 ? 0 : 1);
