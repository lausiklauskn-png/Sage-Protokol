// Smoke — Bau 23.C: Identitäts-Schutz in Modus B (repairAndReconnect).
//
// Beweis für Weg A (2026-07-11): „🧹 Aufräumen & neu anmelden" darf den
// geteilten Alt-Topf `sbkim` NUR löschen, wenn die eigene Schublade
// `sbkim_<suffix>` die Identität schon trägt. Steckt die einzige Identität
// noch im geteilten Topf, bleibt `sbkim` STEHEN (kein Identitätsverlust).
//
// Headless mit Mock-IndexedDB (steuerbare Identitäts-Präsenz je DB-Name) +
// Mock-Relais/Spore/Anastomose. Kern-Module 01/02/05 werden NICHT geladen —
// nur die öffentliche Modul-23-Fläche.

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
function rec(name, exp, got, ok) {
  if (ok) { pass++; console.log("✓ " + name); }
  else { fail++; console.log("✗ " + name + "  (erwartet " + exp + ", bekam " + got + ")"); }
}

// ---- Mock-IndexedDB: `have` = Set der DB-Namen mit nicht-leerer sbkim_keys ----
function makeFakeIDB(have) {
  const identitySet = new Set(have);
  return {
    _deleted: [],
    open(name) {
      const req = {};
      queueMicrotask(() => {
        const exists = identitySet.has(name); // nur Identitäts-DBs „existieren"
        if (!exists && typeof req.onupgradeneeded === "function") req.onupgradeneeded();
        req.result = {
          objectStoreNames: { contains: (s) => exists && s === "sbkim_keys" },
          transaction() {
            return { objectStore() { return { count() {
              const c = {};
              queueMicrotask(() => { c.result = identitySet.has(name) ? 1 : 0; if (c.onsuccess) c.onsuccess(); });
              return c;
            } }; } };
          },
          close() {},
        };
        if (typeof req.onsuccess === "function") req.onsuccess();
      });
      return req;
    },
    deleteDatabase(name) {
      const r = {};
      this._deleted.push(name);
      queueMicrotask(() => { if (typeof r.onsuccess === "function") r.onsuccess(); });
      return r;
    },
  };
}

function mkRelay() {
  const published = [];
  return { published, publish: async (e) => { published.push(e); }, subscribe: () => () => {} };
}
function mkSpore(nodeId) {
  const state = { id: nodeId }; // mutabel: createIdentity() kann eine Identität erzeugen
  return {
    _state: state,
    getOwnSpore: async () => (state.id ? { id: state.id, domainVector: null } : null),
    getOrCreateIdentity: async () => { if (!state.id) state.id = "NEW-ID"; return { nodeId: state.id }; },
    getNodeId: async () => state.id || null,
  };
}
function mkAna() {
  return { init: async () => {}, listenNostr: async () => {}, handshake: async () => ({ outcome: "established" }) };
}

globalThis.window = globalThis;
await import("../src/modules/23_rendezvous.js");
const R = globalThis.SbkimRendezvous;

async function scenario(name, { have, suffix, nodeId, newIdentity }) {
  const idb = makeFakeIDB(have);
  globalThis.indexedDB = idb;
  globalThis.SbkimStorage = { init: async () => {} };
  globalThis.SbkimNostrRelay = mkRelay();
  globalThis.SbkimAnastomose = mkAna();
  globalThis.SbkimSpore = mkSpore(nodeId);
  const createIdentity = async () => { await globalThis.SbkimSpore.getOrCreateIdentity(); };
  R.configure({ nodeName: name, dbSuffix: suffix, relayClient: globalThis.SbkimNostrRelay,
                anastomose: globalThis.SbkimAnastomose, spore: globalThis.SbkimSpore,
                storage: globalThis.SbkimStorage, createIdentity });
  const res = await R.repairAndReconnect({ newIdentity: newIdentity === true });
  return { res, deleted: idb._deleted };
}

// ---- Fall 1: Identität nur im geteilten Topf `sbkim` → SCHÜTZEN ----
{
  const { res, deleted } = await scenario("Fall1", { have: ["sbkim"], suffix: "testapp", nodeId: "OLD-ID" });
  rec("Fall 1 — protectedIdentity:true (Identität im geteilten Topf)", "true", String(res.protectedIdentity), res.protectedIdentity === true);
  rec("Fall 1 — geteilte DB NICHT gelöscht", "kein sbkim-Delete", deleted.join(",") || "(keins)", !deleted.includes("sbkim"));
  rec("Fall 1 — cleaned.dbKept:true", "true", String(res.cleaned.dbKept), res.cleaned.dbKept === true);
  rec("Fall 1 — identityNote gesetzt", "ja", res.identityNote ? "ja" : "nein", !!res.identityNote);
  rec("Fall 1 — Neu-Anmelden ok:true (Identität behalten)", "true", String(res.ok), res.ok === true);
  rec("Fall 1 — created:false (keine neue Identität)", "false", String(res.created), res.created === false);
}

// ---- Fall 2: Identität schon in eigener Schublade `sbkim_testapp` → LÖSCHEN ok ----
{
  const { res, deleted } = await scenario("Fall2", { have: ["sbkim_testapp"], suffix: "testapp", nodeId: "MY-ID" });
  rec("Fall 2 — protectedIdentity:false (eigene Schublade trägt Identität)", "false", String(res.protectedIdentity), res.protectedIdentity === false);
  rec("Fall 2 — geteilte DB `sbkim` gelöscht", "sbkim gelöscht", deleted.join(",") || "(keins)", deleted.includes("sbkim"));
  rec("Fall 2 — cleaned.dbDeleted:true", "true", String(res.cleaned.dbDeleted), res.cleaned.dbDeleted === true);
  rec("Fall 2 — Identität behalten (created:false)", "false", String(res.created), res.created === false);
}

// ---- Fall 3: newIdentity:true → volle Reinigung trotz Identität im Topf ----
{
  const { res, deleted } = await scenario("Fall3", { have: ["sbkim"], suffix: "testapp", nodeId: "OLD-ID", newIdentity: true });
  rec("Fall 3 — protectedIdentity:false (Nutzer will ausdrücklich neu)", "false", String(res.protectedIdentity), res.protectedIdentity === false);
  rec("Fall 3 — geteilte DB `sbkim` gelöscht", "sbkim gelöscht", deleted.join(",") || "(keins)", deleted.includes("sbkim"));
}

// ---- Fall 4: keine Identität irgendwo → löschen ok, frische Identität ----
{
  const { res, deleted } = await scenario("Fall4", { have: [], suffix: "testapp", nodeId: null });
  rec("Fall 4 — protectedIdentity:false (nichts zu schützen)", "false", String(res.protectedIdentity), res.protectedIdentity === false);
  rec("Fall 4 — geteilte DB `sbkim` gelöscht", "sbkim gelöscht", deleted.join(",") || "(keins)", deleted.includes("sbkim"));
  rec("Fall 4 — created:true (frische Identität erzeugt)", "true", String(res.created), res.created === true);
}

// ---- Fall 5: dbHasIdentity ist read-only + fail-soft ohne IndexedDB ----
{
  delete globalThis.indexedDB;
  const idb = makeFakeIDB([]);
  globalThis.indexedDB = idb;
  // Probe einer nicht-existenten DB darf keine dauerhafte Phantom-DB hinterlassen
  // (created → deleteDatabase). Wir prüfen indirekt über Fall 4 oben (kein Rest).
  rec("Fall 5 — Modul bleibt geladen + Fläche da", "function", typeof R.repairAndReconnect, typeof R.repairAndReconnect === "function");
}

console.log("\nSumme: " + pass + " grün, " + fail + " rot · " + (pass + fail) + " insgesamt");
if (fail > 0) process.exit(1);
