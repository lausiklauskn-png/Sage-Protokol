// Smoke — Bau 23.D: Identitäts-Isolierung in Modus B (repairAndReconnect)
// + ensureIdentity (Modus A). Beweis für die Härtung 2026-07-11:
//   Alt-Fall (Identität nur im geteilten Topf `sbkim`, eigene Schublade leer)
//   wird jetzt AUFGELÖST statt nur geschützt — die Identität wird via
//   storage.migrateIdentityFrom in die eigene Schublade MIGRIERT, DANN der
//   Topf gelöscht. Scheitert die Migration (oder fehlt der Pfad), bleibt der
//   reine Schutz (Topf stehen lassen) als Fallback.
//
// Headless mit Mock-IndexedDB (live Identity-Set) + Mock-Storage
// (steuerbares migrateIdentityFrom) + Mock-Relais/Spore/Anastomose.
// Kern-Module 01/02/05 werden NICHT geladen — nur die Modul-23-Fläche.

let pass = 0, fail = 0;
function rec(name, exp, got, ok) {
  if (ok) { pass++; console.log("✓ " + name); }
  else { fail++; console.log("✗ " + name + "  (erwartet " + exp + ", bekam " + got + ")"); }
}

// Live-Set der DB-Namen mit nicht-leerer Identität; deleteDatabase entfernt.
function makeFakeIDB(identitySet) {
  return {
    _deleted: [],
    open(name) {
      const req = {};
      queueMicrotask(() => {
        const exists = identitySet.has(name);
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
      identitySet.delete(name);
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
  const state = { id: nodeId };
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

// storageMode: "migrate-ok" | "migrate-noop" | "migrate-throw" | "no-migrate"
function mkStorage(identitySet, suffix, mode, spy) {
  const base = { init: async () => {} };
  if (mode === "no-migrate") return base;
  base.migrateIdentityFrom = async (old) => {
    spy.calls.push(old);
    if (mode === "migrate-throw") throw new Error("boom");
    if (mode === "migrate-ok" && identitySet.has(old)) {
      identitySet.add("sbkim_" + suffix); // Kopie simuliert: Ziel trägt jetzt Identität
      return { ok: true, copied: 1 };
    }
    return { ok: true, copied: 0 }; // migrate-noop: Ziel bleibt leer
  };
  return base;
}

async function scenarioRepair(name, { have, suffix, nodeId, mode }) {
  const identitySet = new Set(have);
  const idb = makeFakeIDB(identitySet);
  globalThis.indexedDB = idb;
  const spy = { calls: [] };
  const storage = mkStorage(identitySet, suffix, mode, spy);
  globalThis.SbkimStorage = storage;
  globalThis.SbkimNostrRelay = mkRelay();
  globalThis.SbkimAnastomose = mkAna();
  globalThis.SbkimSpore = mkSpore(nodeId);
  const createIdentity = async () => { await globalThis.SbkimSpore.getOrCreateIdentity(); };
  R.configure({ nodeName: name, dbSuffix: suffix, relayClient: globalThis.SbkimNostrRelay,
                anastomose: globalThis.SbkimAnastomose, spore: globalThis.SbkimSpore,
                storage, createIdentity });
  const res = await R.repairAndReconnect({});
  return { res, deleted: idb._deleted, spy };
}

// ---- Fall A: Alt-Fall, Migration erfolgreich → MIGRIEREN + Topf löschen ----
{
  const { res, deleted, spy } = await scenarioRepair("A", { have: ["sbkim"], suffix: "app", nodeId: "OLD", mode: "migrate-ok" });
  rec("A — migrateIdentityFrom('sbkim') gerufen", "1x sbkim", spy.calls.join(",") || "(keins)", spy.calls.length === 1 && spy.calls[0] === "sbkim");
  rec("A — migratedIdentity:true", "true", String(res.migratedIdentity), res.migratedIdentity === true);
  rec("A — protectedIdentity:false", "false", String(res.protectedIdentity), res.protectedIdentity === false);
  rec("A — geteilte DB `sbkim` GELÖSCHT (Kollision aufgelöst)", "sbkim gelöscht", deleted.join(",") || "(keins)", deleted.includes("sbkim"));
  rec("A — ok:true (angemeldet)", "true", String(res.ok), res.ok === true);
}

// ---- Fall B: Alt-Fall, Migration bleibt wirkungslos → Fallback SCHÜTZEN ----
{
  const { res, deleted } = await scenarioRepair("B", { have: ["sbkim"], suffix: "app", nodeId: "OLD", mode: "migrate-noop" });
  rec("B — migratedIdentity:false", "false", String(res.migratedIdentity), res.migratedIdentity === false);
  rec("B — protectedIdentity:true (Fallback-Schutz)", "true", String(res.protectedIdentity), res.protectedIdentity === true);
  rec("B — geteilte DB NICHT gelöscht", "kein sbkim-Delete", deleted.join(",") || "(keins)", !deleted.includes("sbkim"));
}

// ---- Fall C: Alt-Fall, Migration wirft → Fallback SCHÜTZEN ----
{
  const { res, deleted } = await scenarioRepair("C", { have: ["sbkim"], suffix: "app", nodeId: "OLD", mode: "migrate-throw" });
  rec("C — protectedIdentity:true (Wurf abgefangen)", "true", String(res.protectedIdentity), res.protectedIdentity === true);
  rec("C — migratedIdentity:false", "false", String(res.migratedIdentity), res.migratedIdentity === false);
  rec("C — geteilte DB NICHT gelöscht", "kein sbkim-Delete", deleted.join(",") || "(keins)", !deleted.includes("sbkim"));
}

// ---- Fall D: älteres Storage-Modul ohne migrateIdentityFrom → reiner Schutz ----
{
  const { res, deleted } = await scenarioRepair("D", { have: ["sbkim"], suffix: "app", nodeId: "OLD", mode: "no-migrate" });
  rec("D — protectedIdentity:true (kein Migrations-Pfad)", "true", String(res.protectedIdentity), res.protectedIdentity === true);
  rec("D — migratedIdentity:false", "false", String(res.migratedIdentity), res.migratedIdentity === false);
  rec("D — geteilte DB NICHT gelöscht", "kein sbkim-Delete", deleted.join(",") || "(keins)", !deleted.includes("sbkim"));
}

// ---- Fall E: eigene Schublade trägt schon Identität → keine Migration nötig ----
{
  const { res, deleted, spy } = await scenarioRepair("E", { have: ["sbkim_app"], suffix: "app", nodeId: "MY", mode: "migrate-ok" });
  rec("E — migrateIdentityFrom NICHT gerufen (Schublade trägt Identität)", "0", String(spy.calls.length), spy.calls.length === 0);
  rec("E — protectedIdentity:false, migratedIdentity:false", "false/false", res.protectedIdentity + "/" + res.migratedIdentity, res.protectedIdentity === false && res.migratedIdentity === false);
  rec("E — geteilte DB `sbkim` gelöscht", "sbkim gelöscht", deleted.join(",") || "(keins)", deleted.includes("sbkim"));
}

// ---- Fall F: ensureIdentity (Modus A) migriert vor getOrCreateIdentity ----
{
  const identitySet = new Set(["sbkim"]);       // Identität nur im geteilten Topf
  const idb = makeFakeIDB(identitySet);
  globalThis.indexedDB = idb;
  const spy = { calls: [] };
  const storage = mkStorage(identitySet, "app", "migrate-ok", spy);
  globalThis.SbkimStorage = storage;
  globalThis.SbkimSpore = mkSpore("OLD");        // vorhandene Identität → created:false erwartet
  R.configure({ dbSuffix: "app", storage, spore: globalThis.SbkimSpore });
  const r = await R.ensureIdentity();
  rec("F — ensureIdentity ruft migrateIdentityFrom('sbkim')", "1x sbkim", spy.calls.join(",") || "(keins)", spy.calls.length === 1 && spy.calls[0] === "sbkim");
  rec("F — ensureIdentity ok:true", "true", String(r.ok), r.ok === true);
  rec("F — created:false (Alt-Identität behalten, nicht neu)", "false", String(r.created), r.created === false);
}

// ---- Fall G: _meta.hasMigrate spiegelt den Storage-Pfad ----
{
  globalThis.SbkimStorage = { init: async () => {}, migrateIdentityFrom: async () => ({ ok: true }) };
  R.configure({ storage: globalThis.SbkimStorage });
  rec("G — _meta.hasMigrate:true bei Storage mit Migration", "true", String(R._meta.hasMigrate), R._meta.hasMigrate === true);
  globalThis.SbkimStorage = { init: async () => {} };
  R.configure({ storage: globalThis.SbkimStorage });
  rec("G — _meta.hasMigrate:false bei altem Storage", "false", String(R._meta.hasMigrate), R._meta.hasMigrate === false);
}

console.log("\nSumme: " + pass + " grün, " + fail + " rot · " + (pass + fail) + " insgesamt");
if (fail > 0) process.exit(1);
