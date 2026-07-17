#!/usr/bin/env node
/*
 * Smoke — B1b: exportBackup verlangt die Spore („Weg A", Klaus-Entscheid 2026-07-17).
 *
 * Der Kern-Befund: importBackup verlangt je Identität eine Spore, exportBackup
 * erlaubte sie fehlend → ein Backup, das man anlegen, aber nie zurückspielen kann.
 * Weg A macht exportBackup symmetrisch: fehlt die Spore, wirft es VOR der
 * Verschlüsselung einen klaren SporeMissingError, statt ein unbrauchbares Backup
 * zu erzeugen.
 *
 * Beweist mit ECHTEN Modulen 01+02 (fake-indexeddb + node:crypto WebCrypto):
 *   - OHNE Spore: exportBackup -> SporeMissingError (nichts verschlüsselt).
 *   - MIT Spore:  exportBackup -> gültiger Blob, importBackup -> restored:true (Round-Trip).
 *
 * Aufruf: npm install --no-save fake-indexeddb && node tests/smoke_bau02_b1b_export_spore.mjs
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
const { SbkimStorage, SbkimSpore } = globalThis;

let pass = 0, fail = 0;
function ok(cond, name) { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name); } }

console.log("== B1b — exportBackup verlangt Spore (Weg A) ==");

const PW = "b1b-export-passwort-2026";

await SbkimStorage.init();
if (SbkimSpore.init) await SbkimSpore.init();
await SbkimSpore.getOrCreateIdentity();

// --- OHNE Spore: exportBackup muss klar scheitern (kein unbrauchbares Backup) ---
ok(!(await SbkimSpore.getOwnSpore()), "Ausgangslage: Identität ohne Spore");
let threw = null;
try { await SbkimSpore.exportBackup(PW); } catch (e) { threw = e; }
ok(threw && threw.name === "SporeMissingError", "exportBackup ohne Spore -> SporeMissingError");
ok(threw && /Spore/.test(threw.message || ""), "Fehlermeldung nennt die fehlende Spore");

// --- MIT Spore: Round-Trip export -> import ---
await SbkimSpore.generateOwnSpore({ domain: "B1b-Domäne", endpoint: "https://b1b.local/", nodeType: "hybrid" });
ok(!!(await SbkimSpore.getOwnSpore()), "Spore erzeugt");

const blob = await SbkimSpore.exportBackup(PW);
ok(blob && typeof blob.ciphertext === "string" && blob.version >= 1, "exportBackup MIT Spore -> gültiger Blob");

const nodeIdBefore = await SbkimSpore.getNodeId();
const imp = await SbkimSpore.importBackup(blob, PW, { force: true });
ok(imp && imp.restored === true, "importBackup(force) -> restored:true (Round-Trip)");
ok((await SbkimSpore.getNodeId()) === nodeIdBefore, "nodeId nach Round-Trip unverändert");

// Falsches Passwort bleibt fail-soft (Sammel-Klasse), kein SporeMissingError-Nebeneffekt
let decErr = null;
try { await SbkimSpore.importBackup(blob, "falsch-falsch", { force: true }); } catch (e) { decErr = e; }
ok(decErr && decErr.name === "BackupDecryptError", "importBackup falsches Passwort -> BackupDecryptError");

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail === 0 ? 0 : 1);
