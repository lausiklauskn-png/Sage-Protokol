/*
 * SBKIM — Modul 01 — Storage
 *
 * IndexedDB wrapper for all sbkim_* stores. Promise-based API, no
 * callbacks. Default database name: "sbkim", current version: 4
 * (additive migrations: v=2 Bau-Sitzung 06 added `sbkim_hetero_inbox`,
 * v=3 Pflege Bau 06.1 added `sbkim_hetero_outbox` — Spec-Sitzung 08
 * specified the store; Pflege Bau 06.1 follows up the code anmelden;
 * v=4 Bau 01.Y 2026-05-19 opens the dynamic-store path via
 * `ensureStore` — no new mandatory stores in v=4, `STORES_V4 = []`).
 *
 * Bau 01.Y (2026-05-19) — `ensureStore(name) → Promise<void>` als
 *   öffentlicher Helfer (INTERFACES.md § 9.5 Option A). Modul 01 kennt
 *   Identität NICHT — der Aufrufer (Bau 02.Y Folge-Sitzung in Modul 02)
 *   liefert den identitäts-spezifischen `_<key>`-Suffix. Pattern-Check
 *   synchron via STORE_NAME_PATTERN (^sbkim_[a-z0-9_]+$); Idempotenz
 *   via `db.objectStoreNames.contains(name)` vor jedem Versions-Bump;
 *   Versions-Bump-Choreografie linear über `db.version + 1` (entkoppelt
 *   von der Build-Konstante DB_VERSION, damit zwei parallele
 *   ensureStore-Aufrufe sich nicht in die Versionssequenz schreiben);
 *   onversionchange-Handler auf der NEUEN Verbindung fail-soft
 *   schließen, damit ein Folge-Bump im selben Tab durchgeht.
 *

 * Pflege PWA-Suffix (2026-05-16) — additive Konfig im init-Pfad:
 *   init({ dbSuffix }) öffnet die DB als "sbkim_<dbSuffix>" statt der
 *   Default-DB "sbkim". Pflicht-Anwendungsfall: GitHub-Pages-Project-
 *   Sites teilen Origin und damit IndexedDB; ohne Suffix kollidieren
 *   zwei Endknoten unter `lausiklauskn-png.github.io` auf der DB
 *   `sbkim` und teilen sich die Identität (siehe Übergabeprotokoll
 *   2026-05-16 Andock Mein-Rezeptbuch). Aufruf-Pflicht VOR dem ersten
 *   anderen init()-Aufruf (Modul 05, 06, 07, 00 rufen Storage.init()
 *   intern; idempotent — wer dbSuffix setzen will, muss zuerst).
 *
 * Pflege Storage-Persist (2026-05-16) — Stufe (1) der drei-stufigen
 *   Identitäts-Persistenz-Architektur (PULS § Offene Querschnitts-
 *   Fragen „Identitäts-Persistenz"). Nach erfolgreichem DB-Open ruft
 *   Modul 01 navigator.storage.persist() auf (fail-soft):
 *     - API nicht verfügbar           → _meta.storagePersisted = null
 *     - persist() resolved true|false → _meta.storagePersisted = bool
 *     - persist() rejected            → _meta.storagePersisted = null
 *   Persist-Verweigerung ist KEIN SBKIM-Bruchgrund — Knoten läuft auch
 *   bei false weiter; persist() ist eine Bitte an den Browser,
 *   IndexedDB beim normalen Aufräumen nicht zu löschen. Chrome
 *   gewährt es bei installierten PWAs automatisch; Firefox prompted;
 *   Safari ist restriktiv. Idempotenz beim Re-Init: dbPromise-Cache
 *   deckt das ab — persist() wird automatisch nur einmal pro Tab-
 *   Session gerufen.
 *
 * Public surface (registered on window.SbkimStorage):
 *   init(options?) -> Promise<void>
 *     options-Form: { dbSuffix?: string }   (^[a-z0-9_-]+$, sonst InvalidDbSuffixError sync)
 *   getStore(name) -> StoreHandle   (sync; throws UnknownStoreError)
 *   get(name, key) -> Promise<any | undefined>
 *   put(name, key, value) -> Promise<void>
 *   del(name, key) -> Promise<void>
 *   all(name) -> Promise<Array<{key, value}>>
 *   clear(name) -> Promise<void>
 *   ensureStore(name) -> Promise<void>   (Bau 01.Y; sync InvalidStoreNameError bei Pattern-Verstoß; async EnsureStoreError bei Bump-Fehler)
 *
 * Self-check: emits a console.info line on script load. See INTERFACES.md
 * and docs/components/01_storage.md for the binding spec.
 */
(function (global) {
  "use strict";

  var DB_NAME_DEFAULT = "sbkim";
  var DB_VERSION = 4;
  var SBKIM_STORE_PREFIX = "sbkim_";
  var DB_SUFFIX_PATTERN = /^[a-z0-9_-]+$/;

  // Bau 01.Y (2026-05-19): Modul-01-Pattern für ensureStore-Namen.
  // Strenger als DB_SUFFIX_PATTERN: Store-Namen tragen den sbkim_-Präfix
  // und dürfen kein '-' enthalten (Trenner-Konvention bleibt '_').
  var STORE_NAME_PATTERN = /^sbkim_[a-z0-9_]+$/;

  // Stores, die der initiale Migration-Pfad (v=1) anlegt.
  var STORES_V1 = [
    "sbkim_keys",
    "sbkim_spore",
    "sbkim_siblings",
    "sbkim_anastomosis_log",
    "sbkim_legacy_inbox",
    "sbkim_doku_meta",
  ];

  // Stores, die in v=2 additiv hinzukommen (Bau-Sitzung 06).
  var STORES_V2 = [
    "sbkim_hetero_inbox",
  ];

  // Stores, die in v=3 additiv hinzukommen (Spec-Sitzung 08 spezifiziert,
  // Pflege Bau 06.1 meldet den Store im Code an — Modul 08 ist Schreiber,
  // Modul 06 ist Leser über den Outbox-Lese-Pfad).
  var STORES_V3 = [
    "sbkim_hetero_outbox",
  ];

  // Bau 01.Y (2026-05-19): v=4 öffnet den Pfad „dynamische Stores via
  // ensureStore" (INTERFACES.md § 9.5 Option A). KEINE festen Pflicht-
  // Stores in v=4 — die identitäts-spezifischen Stores entstehen erst
  // durch ensureStore-Aufrufe aus den späteren Bau-Sitzungen (02.Y /
  // 05.Y / 06.Y / 07.Y). Liste bleibt leer; applyMigration(db, 4) ist
  // ein no-op-Marker.
  var STORES_V4 = [];

  // KNOWN_STORES wird ab Bau 01.Y zur Laufzeit erweitert (jeder
  // erfolgreiche ensureStore-Aufruf pusht den neuen Namen hinten an).
  // Die initiale Pflicht-Liste sind die Pflicht-Stores aus v=1/v=2/v=3.
  var KNOWN_STORES = STORES_V1.concat(STORES_V2).concat(STORES_V3).concat(STORES_V4);

  function makeError(name, message, cause) {
    var e = new Error(message);
    e.name = name;
    if (cause !== undefined) e.cause = cause;
    return e;
  }

  // Bau 01.Y (2026-05-19): Fehler-Factories für den ensureStore-Pfad,
  // Factory-Stil analog Modul 02 / 08. Auf window.SbkimStorage.<Error>
  // exportiert; intern bevorzugt makeError("Name", ...) für sprechende
  // cause-Pfade.
  function InvalidStoreNameError(message) { return makeError("InvalidStoreNameError", message); }
  function EnsureStoreError(message, cause) { return makeError("EnsureStoreError", message, cause); }

  function assertKnownStore(storeName) {
    if (KNOWN_STORES.indexOf(storeName) === -1) {
      throw makeError(
        "UnknownStoreError",
        "Unbekannter Store: '" + storeName + "'. Erlaubt sind: " + KNOWN_STORES.join(", ") + ".",
      );
    }
  }

  function applyMigration(db, version) {
    if (version === 1) {
      for (var i = 0; i < STORES_V1.length; i++) {
        var name = STORES_V1[i];
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name);
        }
      }
      return;
    }
    if (version === 2) {
      // Bau-Sitzung 06: sbkim_hetero_inbox additiv.
      // Schlüssel-Form: "<peerNodeId>|<ts>" (Komposit, Drift-Spur).
      for (var j = 0; j < STORES_V2.length; j++) {
        var name2 = STORES_V2[j];
        if (!db.objectStoreNames.contains(name2)) {
          db.createObjectStore(name2);
        }
      }
      return;
    }
    if (version === 3) {
      // Pflege Bau 06.1 (2026-05-15): sbkim_hetero_outbox additiv.
      // Schlüssel-Form: `label` (string ≤ 64 Zeichen).
      // Schreiber: Modul 08 (UI-Demo). Leser: Modul 06 (Heterokaryose).
      for (var k = 0; k < STORES_V3.length; k++) {
        var name3 = STORES_V3[k];
        if (!db.objectStoreNames.contains(name3)) {
          db.createObjectStore(name3);
        }
      }
      return;
    }
    if (version === 4) {
      // Bau 01.Y (2026-05-19): v=4 öffnet den Pfad „dynamische Stores
      // via ensureStore" (INTERFACES.md § 9.5 Option A). STORES_V4 ist
      // leer — kein Pflicht-Store wird in v=4 additiv angelegt; der
      // Sprung v=3 → v=4 ist ein reiner Marker für bestehende PWAs.
      // Dynamische Stores entstehen erst durch ensureStore-Aufrufe aus
      // den späteren Bau-Sitzungen, die linear weiter bumpen
      // (db.version + 1 pro neuem Store).
      for (var m = 0; m < STORES_V4.length; m++) {
        var name4 = STORES_V4[m];
        if (!db.objectStoreNames.contains(name4)) {
          db.createObjectStore(name4);
        }
      }
      return;
    }
    // Future migrations: branch on `version` and add stores additively.
    // Never deleteObjectStore here without an explicit spec update.
  }

  var dbPromise = null;
  var dbNameInUse = DB_NAME_DEFAULT;
  // currentDb (Bau 01.Y 2026-05-19): sync-lesbarer Anker auf die aktuelle
  // IDBDatabase-Verbindung. Wird in req.onsuccess (init) und in
  // openReq.onsuccess (ensureStore) gesetzt, in onversionchange auf null
  // zurückgesetzt. Trägt _meta.dbVersion als Live-Zustand (statt der
  // Build-Konstante DB_VERSION).
  var currentDb = null;
  // navigator.storage.persist()-Status nach init. Werte:
  //   null  — vor init / API nicht verfügbar / persist() rejected (fail-soft)
  //   true  — Browser hat den Speicher als persistent markiert
  //   false — Browser hat verweigert (z.B. Safari restriktiv)
  // Knoten bleibt in allen drei Fällen lauffähig.
  var storagePersisted = null;

  // Bau 01.Y (2026-05-19): gemeinsamer onversionchange-Handler für jede
  // frisch geöffnete Verbindung. Wird ein Versions-Bump auf einer
  // ANDEREN Verbindung derselben DB ausgelöst (anderer Tab oder ein
  // ensureStore-Folgeruf im selben Tab — siehe brackets im ensureStore-
  // Pfad, wo wir db.close() vor dem Bump explizit selbst rufen),
  // schließt dieser Handler fail-soft die alte Verbindung. dbPromise
  // wird invalidiert, damit nachfolgende init()-Aufrufe eine frische
  // Verbindung mit der neuen Version aufbauen.
  function attachVersionChangeHandler(db) {
    db.onversionchange = function () {
      try { db.close(); } catch (e) { /* ignore — fail-soft */ }
      if (currentDb === db) {
        currentDb = null;
        dbPromise = null;
      }
    };
  }

  function requestStoragePersist() {
    if (
      typeof navigator === "undefined" ||
      !navigator.storage ||
      typeof navigator.storage.persist !== "function"
    ) {
      storagePersisted = null;
      if (typeof console !== "undefined" && console.info) {
        console.info(
          "Storage persist-Status: navigator.storage.persist nicht verfuegbar, fail-soft (null).",
        );
      }
      return Promise.resolve(null);
    }
    var persistPromise;
    try {
      persistPromise = navigator.storage.persist();
    } catch (e) {
      storagePersisted = null;
      if (typeof console !== "undefined" && console.info) {
        console.info(
          "Storage persist-Status: persist() warf synchron, fail-soft (null).",
        );
      }
      return Promise.resolve(null);
    }
    return Promise.resolve(persistPromise).then(
      function (result) {
        if (result === true) {
          storagePersisted = true;
        } else if (result === false) {
          storagePersisted = false;
        } else {
          storagePersisted = null;
        }
        if (typeof console !== "undefined" && console.info) {
          console.info("Storage persist-Status: " + storagePersisted);
        }
        return storagePersisted;
      },
      function () {
        // Persist-Rejection ist kein SBKIM-Bruchgrund — fail-soft.
        storagePersisted = null;
        if (typeof console !== "undefined" && console.info) {
          console.info(
            "Storage persist-Status: persist-Promise rejected, fail-soft (null).",
          );
        }
        return null;
      },
    );
  }

  function init(options) {
    // dbSuffix muss synchron, VOR dem Promise-Aufbau geprüft werden — sonst
    // verschluckt das Promise einen Programmier-Fehler bis zur ersten
    // `await SbkimStorage.init(...)`-Auswertung.
    var explicitSuffix = null;
    if (options && options.dbSuffix !== undefined && options.dbSuffix !== null) {
      var suffix = options.dbSuffix;
      if (typeof suffix !== "string" || !DB_SUFFIX_PATTERN.test(suffix)) {
        throw makeError(
          "InvalidDbSuffixError",
          "Ungueltiger dbSuffix: '" + suffix + "'. Erlaubt sind nur Kleinbuchstaben, Ziffern, '_' und '-' (Pattern ^[a-z0-9_-]+$).",
        );
      }
      explicitSuffix = SBKIM_STORE_PREFIX + suffix;
    }
    if (dbPromise) {
      // Idempotenz: zweite init()-Aufrufe geben die gleiche DB-Promise zurück.
      // Konflikt-Wurf nur, wenn der Folge-Aufruf EXPLIZIT einen abweichenden
      // dbSuffix mitgibt — sonst (ohne Optionen, Module 05/06/07/00 rufen so
      // intern nach) bleibt der zuerst gesetzte DB-Name aktiv. Wer den
      // PWA-Suffix setzen will, muss zuerst kommen — das ist genau der
      // Andocker-Pfad in Karte 09 Schritt 4.
      if (explicitSuffix !== null && explicitSuffix !== dbNameInUse) {
        return Promise.reject(makeError(
          "InvalidDbSuffixError",
          "Storage.init bereits mit DB-Namen '" + dbNameInUse +
            "' geoeffnet — Folgeaufruf mit '" + explicitSuffix +
            "' wuerde stillschweigend ignoriert. dbSuffix muss beim ERSTEN init-Aufruf gesetzt werden.",
        ));
      }
      return dbPromise;
    }
    dbNameInUse = explicitSuffix !== null ? explicitSuffix : DB_NAME_DEFAULT;
    dbPromise = new Promise(function (resolve, reject) {
      if (typeof indexedDB === "undefined" || indexedDB === null) {
        reject(makeError(
          "StorageUnavailableError",
          "IndexedDB ist in dieser Umgebung nicht verfuegbar (Privatmodus / blockiert).",
        ));
        return;
      }
      var req;
      try {
        req = indexedDB.open(dbNameInUse, DB_VERSION);
      } catch (err) {
        reject(makeError(
          "StorageOpenError",
          "IndexedDB.open() warf synchron: " + (err && err.message),
          err,
        ));
        return;
      }
      req.onupgradeneeded = function (ev) {
        var db = req.result;
        var oldV = ev.oldVersion || 0;
        var newV = ev.newVersion || DB_VERSION;
        for (var v = oldV + 1; v <= newV; v++) {
          applyMigration(db, v);
        }
      };
      req.onsuccess = function () {
        var db = req.result;
        currentDb = db;
        // Bau 01.Y (2026-05-19): fail-soft onversionchange-Handler
        // installieren, damit ein späterer ensureStore-Bump (oder ein
        // Bump aus einem anderen Tab) unsere Verbindung sauber schließen
        // kann statt in onblocked zu hängen.
        attachVersionChangeHandler(db);
        // Pflege Storage-Persist (2026-05-16): persist()-Bitte nach
        // erfolgreichem DB-Open, fail-soft. requestStoragePersist
        // resolved IMMER (kein Throw, kein Reject) — Knoten bleibt
        // lauffähig auch bei Verweigerung oder fehlender API.
        requestStoragePersist().then(function () {
          resolve(db);
        });
      };
      req.onerror = function () {
        var err = req.error;
        reject(makeError(
          "StorageOpenError",
          "IndexedDB-Open scheiterte: " + (err && err.message),
          err,
        ));
      };
      req.onblocked = function () {
        reject(makeError(
          "StorageOpenError",
          "IndexedDB-Open blockiert (andere Tabs der App offen?).",
        ));
      };
    });
    return dbPromise;
  }

  function wrapRequest(req, opLabel) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () {
        var err = req.error;
        var name = (err && err.name) || "StorageOpenError";
        if (name === "QuotaExceededError") {
          reject(makeError(
            "QuotaExceededError",
            "Speicher-Quota ueberschritten bei " + opLabel + ".",
            err,
          ));
        } else if (name === "DataCloneError") {
          reject(makeError(
            "DataCloneError",
            "Wert nicht strukturiert klonbar bei " + opLabel + ".",
            err,
          ));
        } else {
          reject(makeError(
            "StorageOpenError",
            opLabel + " scheiterte: " + (err && err.message),
            err,
          ));
        }
      };
    });
  }

  function get(storeName, key) {
    assertKnownStore(storeName);
    return init().then(function (db) {
      var tx = db.transaction(storeName, "readonly");
      var store = tx.objectStore(storeName);
      return wrapRequest(store.get(key), "get(" + storeName + ", " + key + ")");
    });
  }

  function put(storeName, key, value) {
    assertKnownStore(storeName);
    return init().then(function (db) {
      var tx = db.transaction(storeName, "readwrite");
      var store = tx.objectStore(storeName);
      var req;
      try {
        req = store.put(value, key);
      } catch (err) {
        if (err && err.name === "DataCloneError") {
          return Promise.reject(makeError(
            "DataCloneError",
            "Wert nicht strukturiert klonbar bei put(" + storeName + ", " + key + ").",
            err,
          ));
        }
        return Promise.reject(makeError(
          "StorageOpenError",
          "put(" + storeName + ", " + key + ") warf synchron: " + (err && err.message),
          err,
        ));
      }
      return wrapRequest(req, "put(" + storeName + ", " + key + ")").then(function () { /* void */ });
    });
  }

  function del(storeName, key) {
    assertKnownStore(storeName);
    return init().then(function (db) {
      var tx = db.transaction(storeName, "readwrite");
      var store = tx.objectStore(storeName);
      return wrapRequest(store.delete(key), "del(" + storeName + ", " + key + ")").then(function () { /* void */ });
    });
  }

  function all(storeName) {
    assertKnownStore(storeName);
    return init().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(storeName, "readonly");
        var store = tx.objectStore(storeName);
        var results = [];
        var cursorReq = store.openCursor();
        cursorReq.onsuccess = function () {
          var cursor = cursorReq.result;
          if (cursor) {
            results.push({ key: cursor.key, value: cursor.value });
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        cursorReq.onerror = function () {
          var err = cursorReq.error;
          reject(makeError(
            "StorageOpenError",
            "all(" + storeName + ") scheiterte: " + (err && err.message),
            err,
          ));
        };
      });
    });
  }

  function clear(storeName) {
    assertKnownStore(storeName);
    return init().then(function (db) {
      var tx = db.transaction(storeName, "readwrite");
      var store = tx.objectStore(storeName);
      return wrapRequest(store.clear(), "clear(" + storeName + ")").then(function () { /* void */ });
    });
  }

  // Bau 01.Y (2026-05-19) — INTERFACES.md § 9.5 Option A: dynamische
  // Store-Erzeugung ab DB-Version 4. Aufrufer (Bau 02.Y in Modul 02)
  // liefert den identitäts-spezifischen Store-Namen; Modul 01 kennt
  // Identität NICHT und prüft nur das Modul-01-Pattern. Idempotent:
  // existierender Store → no-op. KEINE Datenmigration alter Stores.
  function ensureStore(storeName) {
    // Pattern-Check SYNCHRON — vor jedem Promise-Aufbau, damit ein
    // Programmier-Fehler nicht erst beim ersten await sichtbar wird.
    if (typeof storeName !== "string" || !STORE_NAME_PATTERN.test(storeName)) {
      throw makeError(
        "InvalidStoreNameError",
        "Ungueltiger Store-Name: '" + storeName +
          "'. Erlaubt sind nur Kleinbuchstaben, Ziffern und '_' nach dem 'sbkim_'-Praefix (Pattern ^sbkim_[a-z0-9_]+$).",
      );
    }
    return init().then(function (db) {
      // Idempotenz: existierender Store → no-op-Promise. Kein Versions-
      // Bump, keine Resource-Leakage. Falls der Store schon in der DB
      // ist (z.B. von einem anderen Tab dynamisch angelegt), aber noch
      // nicht in KNOWN_STORES, ziehen wir die Allow-List synchron nach,
      // damit get/put/del/all/clear ihn akzeptieren.
      if (db.objectStoreNames.contains(storeName)) {
        if (KNOWN_STORES.indexOf(storeName) === -1) {
          KNOWN_STORES.push(storeName);
        }
        return undefined;
      }
      return new Promise(function (resolve, reject) {
        if (typeof indexedDB === "undefined" || indexedDB === null) {
          reject(makeError(
            "EnsureStoreError",
            "IndexedDB nicht verfuegbar fuer ensureStore('" + storeName + "').",
          ));
          return;
        }
        var newVersion = db.version + 1;
        // Aktuelle Verbindung schließen, damit der Versions-Bump
        // durchgehen kann. dbPromise invalidieren, damit nachfolgende
        // init()-Aufrufe auf der neuen Verbindung landen.
        try { db.close(); } catch (e) { /* ignore — Verbindung war in seltsamem Zustand */ }
        if (currentDb === db) currentDb = null;
        dbPromise = null;
        var openReq;
        try {
          openReq = indexedDB.open(dbNameInUse, newVersion);
        } catch (err) {
          reject(makeError(
            "EnsureStoreError",
            "indexedDB.open() warf synchron beim Versions-Bump fuer ensureStore('" + storeName + "'): " + (err && err.message),
            err,
          ));
          return;
        }
        openReq.onupgradeneeded = function () {
          var upDb = openReq.result;
          // Nur den einen neuen Store anlegen — strict additiv. KEINE
          // Schemata-Migration alter Stores, KEINE neuen Indices auf
          // bestehenden Stores.
          if (!upDb.objectStoreNames.contains(storeName)) {
            upDb.createObjectStore(storeName);
          }
        };
        openReq.onsuccess = function () {
          var newDb = openReq.result;
          // Fail-soft onversionchange-Handler auf der NEUEN Verbindung,
          // damit ein Folge-Bump (weiterer ensureStore-Aufruf, anderer
          // Tab) durchgeht statt in onblocked zu hängen.
          attachVersionChangeHandler(newDb);
          currentDb = newDb;
          dbPromise = Promise.resolve(newDb);
          if (KNOWN_STORES.indexOf(storeName) === -1) {
            KNOWN_STORES.push(storeName);
          }
          resolve(undefined);
        };
        openReq.onerror = function () {
          var err = openReq.error;
          reject(makeError(
            "EnsureStoreError",
            "ensureStore('" + storeName + "') Versions-Bump scheiterte: " + (err && err.message),
            err,
          ));
        };
        openReq.onblocked = function () {
          reject(makeError(
            "EnsureStoreError",
            "ensureStore('" + storeName + "') Versions-Bump blockiert — ein anderer Tab haelt die DB offen und ignoriert onversionchange.",
          ));
        };
      });
    });
  }

  function getStore(storeName) {
    assertKnownStore(storeName);
    return {
      get: function (key) { return get(storeName, key); },
      put: function (key, value) { return put(storeName, key, value); },
      del: function (key) { return del(storeName, key); },
      all: function () { return all(storeName); },
      clear: function () { return clear(storeName); },
    };
  }

  var SbkimStorage = {
    init: init,
    getStore: getStore,
    get: get,
    put: put,
    del: del,
    all: all,
    clear: clear,
    ensureStore: ensureStore,
    // Bau 01.Y (2026-05-19): Fehler-Factories als Export, analog Modul
    // 02 / 08. Tests können sowohl `err.name === "InvalidStoreNameError"`
    // als auch `err instanceof SbkimStorage.InvalidStoreNameError`-artige
    // Vergleiche fahren — die Factory liefert Error-Instanzen mit
    // sprechendem `name`-Feld.
    InvalidStoreNameError: InvalidStoreNameError,
    EnsureStoreError: EnsureStoreError,
    _meta: {
      // dbName: Live-Zustand. Vor dem ersten init()-Aufruf identisch mit
      // dem Default; nach init({dbSuffix}) zeigt das Getter den effektiv
      // verwendeten Namen ("sbkim_<dbSuffix>").
      get dbName() { return dbNameInUse; },
      dbNameDefault: DB_NAME_DEFAULT,
      // Bau 01.Y (2026-05-19): dbVersion als Getter — Live-Zustand statt
      // Build-Konstante. Kann nach ensureStore-Aufrufen > DB_VERSION
      // sein (db.version + 1 pro neuem Store).
      get dbVersion() { return currentDb ? currentDb.version : DB_VERSION; },
      dbVersionInitial: DB_VERSION,
      storePrefix: SBKIM_STORE_PREFIX,
      // Bau 01.Y (2026-05-19): knownStores als Getter — KNOWN_STORES
      // wird zur Laufzeit erweitert (jeder erfolgreiche ensureStore-
      // Aufruf pusht den neuen Namen hinten an). Snapshot pro Lese-
      // Aufruf.
      get knownStores() { return KNOWN_STORES.slice(); },
      // Bau 01.Y (2026-05-19): Pattern als Read-Anker für Tests.
      ensureStorePattern: STORE_NAME_PATTERN,
      // storagePersisted: null vor init bzw. wenn navigator.storage.persist
      // nicht verfügbar / Promise rejected (fail-soft). true|false zeigt
      // den Browser-Entscheid (Chrome auto-bei-PWA, Firefox prompt, Safari
      // restriktiv). Pflege Storage-Persist 2026-05-16.
      get storagePersisted() { return storagePersisted; },
    },
  };

  global.SbkimStorage = SbkimStorage;

  // Self-check: emitted on script load (synchronous, before init()).
  // Format is uniform across all SBKIM modules — see INTERFACES.md.
  if (typeof console !== "undefined" && console.info) {
    console.info("MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear/ensureStore");
  }
})(typeof window !== "undefined" ? window : globalThis);
