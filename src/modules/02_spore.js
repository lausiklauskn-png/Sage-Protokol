/*
 * SBKIM — Modul 02 — Spore
 *
 * Singleton Ed25519 identity per PWA. Generates / persists the keypair
 * via window.SbkimStorage (key "main" in sbkim_keys), derives the
 * node_id as base64url(sha256(rawPublicKey)) without padding, builds
 * and signs the spore JSON, verifies foreign spores. No multi-identity,
 * no polyfill, no direct IndexedDB access.
 *
 * Public surface (registered on window.SbkimSpore):
 *   init() -> Promise<void>
 *   getOrCreateIdentity() -> Promise<{ nodeId, publicKeyJwk }>
 *   getNodeId() -> Promise<string>
 *   getPublicKeyJwk() -> Promise<JsonWebKey>
 *   generateOwnSpore(meta) -> Promise<SporeJson>
 *   getOwnSpore() -> Promise<SporeJson | null>
 *   verifyForeignSpore(spore) -> Promise<{ valid, reason? }>
 *   resetIdentityCache() -> void
 *   exportBackup(password) -> Promise<SbkimBackupBlob>
 *   importBackup(blob, password, options?) -> Promise<{ restored, reason? }>
 *
 * Self-check: emits a console.info line on script load (synchronous,
 * before any call). Key generation is lazy and happens on the first
 * getOrCreateIdentity() call. See INTERFACES.md and
 * docs/components/02_spore.md for the binding spec.
 *
 * Bau 02.X Backup-Export (2026-05-16): additive Erweiterung um
 * passwort-verschlüsseltes Snapshot-Format (PBKDF2-SHA256 + AES-GCM-256).
 * Code-Folge zur Spec-Sitzung Backup-Export Stufe 2 (PR #52); drei
 * Pflicht-Fragen verbindlich entschieden: Backup-Inhalt = Identität +
 * Geschwister (Variante b), Iterations = 600 000 (OWASP 2023+),
 * Import-Überschreibung defensiv per Default (Variante a). Bestehende
 * sieben + resetIdentityCache-Funktionen unverändert; die kanonische
 * Sort-Disziplin (canonicalize/canonicalJsonBytes) und der base64url-
 * Pfad werden für die Backup-Schicht wiederverwendet. Fünf neue
 * Error-Klassen, drei modul-lokale Konstanten + drei §0-Konstanten
 * gespiegelt, drei Helper (canonicalJsonBytes/base64url* reuse +
 * derivePbkdf2AesGcmKey neu).
 */
(function (global) {
  "use strict";

  var PROTOCOL_VERSION = "0.1";
  var EMBEDDING_MODEL = "Xenova/multilingual-e5-small";
  var IDENTITY_KEY = "main";
  var KEYS_STORE = "sbkim_keys";
  var SPORE_STORE = "sbkim_spore";
  var SIBLINGS_STORE = "sbkim_siblings";
  var VALID_NODE_TYPES = ["provider", "seeker", "hybrid"];
  var REQUIRED_SPORE_FIELDS = [
    "createdAt",
    "domain",
    "embeddingModel",
    "endpoint",
    "id",
    "nodeType",
    "protocolVersion",
    "publicKey",
    "signature",
  ];

  // §0-Konstanten, hier gespiegelt (Sage-Protokol hat noch kein
  // konfig-Modul-System — INTERFACES.md §0 trägt den „sobald
  // angelegt"-Hinweis; Spec-Sitzung Backup-Export Stufe 2 hat diesen
  // Konvention-Kompromiss respektiert).
  var BACKUP_FORMAT_VERSION = 1;
  var BACKUP_KDF_ITERATIONS = 600000;
  var BACKUP_PASSWORD_MIN_LEN = 8;

  // Modul-lokale Backup-Konstanten (Karte 02 § Konfigurationswerte,
  // WebCrypto-Konventionen ohne Querschnitts-Relevanz).
  var BACKUP_PAYLOAD_SCHEMA_VERSION = 1;
  var BACKUP_KDF_SALT_BYTES = 16;
  var BACKUP_CIPHER_IV_BYTES = 12;

  function makeError(name, message, cause) {
    var e = new Error(message);
    e.name = name;
    if (cause !== undefined) e.cause = cause;
    return e;
  }

  // Fünf benannte Error-Klassen für den Backup-Pfad (Factory-Stil wie
  // Modul 00 / 08). Auf window.SbkimSpore.<Error> exportiert; intern
  // bevorzugt makeError("Name", ...) für sprechende cause-Pfade.
  function InvalidBackupPasswordError(message) { return makeError("InvalidBackupPasswordError", message); }
  function BackupDecryptError(message, cause) { return makeError("BackupDecryptError", message, cause); }
  function BackupVersionMismatchError(message) { return makeError("BackupVersionMismatchError", message); }
  function BackupSchemaError(message) { return makeError("BackupSchemaError", message); }
  function BackupOverwriteError(message) { return makeError("BackupOverwriteError", message); }

  function getSubtle() {
    var c = global.crypto || (typeof crypto !== "undefined" ? crypto : null);
    if (!c || !c.subtle) {
      throw makeError(
        "CryptoUnavailableError",
        "WebCrypto (crypto.subtle) ist nicht verfügbar. Modul 02 braucht moderne Browser " +
          "(Chrome ≥ 113, Firefox ≥ 130, Safari ≥ 17). Kein Polyfill.",
      );
    }
    return c.subtle;
  }

  function getStorage() {
    if (!global.SbkimStorage) {
      throw makeError(
        "StorageUnavailableError",
        "window.SbkimStorage nicht geladen. Modul 02 persistiert ausschließlich über Modul 01 — " +
          "lade src/modules/01_storage.js vor 02_spore.js.",
      );
    }
    return global.SbkimStorage;
  }

  // base64url ohne Padding (RFC 4648 §5).
  function base64urlEncode(bytes) {
    var bin = "";
    var view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    for (var i = 0; i < view.length; i++) bin += String.fromCharCode(view[i]);
    var b64 = (global.btoa || btoa)(bin);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function base64urlDecode(str) {
    var pad = str.length % 4 === 0 ? "" : "====".slice(str.length % 4);
    var b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
    var bin = (global.atob || atob)(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function utf8Encode(str) {
    return new TextEncoder().encode(str);
  }

  // Backup-Pfad: leitet den AES-GCM-Key aus dem Passwort ab. KDF-Pfad
  // verbindlich aus Karte 02 § Datenformat „Backup-Format" — PBKDF2-
  // SHA-256 mit BACKUP_KDF_ITERATIONS Runden gegen einen 16-Byte-Salt.
  async function derivePbkdf2AesGcmKey(password, salt, iterations) {
    var subtle = getSubtle();
    var material = utf8Encode(password);
    var baseKey = await subtle.importKey(
      "raw",
      material,
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    );
    return await subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  // Recursive lexicographic key sort. Returns a new object so the
  // caller's input is never mutated.
  function canonicalize(value) {
    if (value === null) return null;
    if (Array.isArray(value)) return value.map(canonicalize);
    if (typeof value === "object") {
      var keys = Object.keys(value).sort();
      var out = {};
      for (var i = 0; i < keys.length; i++) out[keys[i]] = canonicalize(value[keys[i]]);
      return out;
    }
    return value;
  }

  function canonicalJsonBytes(obj) {
    return utf8Encode(JSON.stringify(canonicalize(obj)));
  }

  // node_id = base64url(sha256(rawPublicKey)) without padding.
  // The same derivation is what foreign nodes use to verify
  // spore.id against spore.publicKey — see verifyForeignSpore.
  async function deriveNodeIdFromPublicKey(publicKey) {
    var subtle = getSubtle();
    var raw = await subtle.exportKey("raw", publicKey);
    var hash = await subtle.digest("SHA-256", raw);
    return base64urlEncode(hash);
  }

  async function deriveNodeIdFromJwk(publicJwk) {
    var subtle = getSubtle();
    var pub = await subtle.importKey(
      "jwk",
      publicJwk,
      { name: "Ed25519" },
      true,
      ["verify"],
    );
    return await deriveNodeIdFromPublicKey(pub);
  }

  // ---- module state (lazy) ----

  var ready = false;
  var identityCache = null; // { nodeId, publicKeyJwk, privateKey, publicKey }

  async function init() {
    // Probe WebCrypto and storage but do not generate keys.
    getSubtle();
    var storage = getStorage();
    await storage.init();
    ready = true;
  }

  async function ensureReady() {
    if (!ready) await init();
  }

  async function loadIdentity() {
    if (identityCache) return identityCache;
    await ensureReady();
    var storage = getStorage();
    var subtle = getSubtle();
    var stored = await storage.get(KEYS_STORE, IDENTITY_KEY);
    if (!stored) return null;

    // Re-import the persisted JWKs so the actual sign/verify keys are
    // CryptoKey instances again. JWK survives structured clone, the
    // bound CryptoKey itself does not.
    var privateKey = await subtle.importKey(
      "jwk",
      stored.privateKey,
      { name: "Ed25519" },
      true,
      ["sign"],
    );
    var publicKey = await subtle.importKey(
      "jwk",
      stored.publicKey,
      { name: "Ed25519" },
      true,
      ["verify"],
    );
    var nodeId = await deriveNodeIdFromPublicKey(publicKey);
    identityCache = {
      nodeId: nodeId,
      publicKeyJwk: stored.publicKey,
      privateKey: privateKey,
      publicKey: publicKey,
    };
    return identityCache;
  }

  async function getOrCreateIdentity() {
    var existing = await loadIdentity();
    if (existing) {
      return { nodeId: existing.nodeId, publicKeyJwk: existing.publicKeyJwk };
    }

    var subtle = getSubtle();
    var keyPair;
    try {
      keyPair = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
    } catch (err) {
      throw makeError(
        "CryptoUnavailableError",
        "Ed25519-Schlüsselerzeugung fehlgeschlagen: " + (err && err.message ? err.message : err) +
          ". Modul 02 braucht moderne WebCrypto-Unterstützung. Kein Polyfill.",
        err,
      );
    }

    var privateKeyJwk = await subtle.exportKey("jwk", keyPair.privateKey);
    var publicKeyJwk = await subtle.exportKey("jwk", keyPair.publicKey);
    var nodeId = await deriveNodeIdFromPublicKey(keyPair.publicKey);

    var storage = getStorage();
    await storage.put(KEYS_STORE, IDENTITY_KEY, {
      keyId: nodeId,
      privateKey: privateKeyJwk,
      publicKey: publicKeyJwk,
    });

    identityCache = {
      nodeId: nodeId,
      publicKeyJwk: publicKeyJwk,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    };
    return { nodeId: nodeId, publicKeyJwk: publicKeyJwk };
  }

  async function getNodeId() {
    var id = await loadIdentity();
    if (!id) {
      throw makeError(
        "NoIdentityError",
        "Es existiert noch keine Identität. Erst getOrCreateIdentity() aufrufen.",
      );
    }
    return id.nodeId;
  }

  async function getPublicKeyJwk() {
    var id = await loadIdentity();
    if (!id) {
      throw makeError(
        "NoIdentityError",
        "Es existiert noch keine Identität. Erst getOrCreateIdentity() aufrufen.",
      );
    }
    return id.publicKeyJwk;
  }

  function validateSporeMeta(meta) {
    var missing = [];
    if (!meta || typeof meta !== "object") {
      throw makeError("InvalidSporeMetaError", "meta-Objekt fehlt oder ist kein Objekt.");
    }
    if (typeof meta.domain !== "string" || meta.domain.length === 0) missing.push("domain");
    if (typeof meta.endpoint !== "string" || meta.endpoint.length === 0) missing.push("endpoint");
    if (typeof meta.nodeType !== "string") missing.push("nodeType");
    if (missing.length > 0) {
      throw makeError(
        "InvalidSporeMetaError",
        "Pflichtfelder fehlen oder leer: " + missing.join(", ") + ".",
      );
    }
    if (VALID_NODE_TYPES.indexOf(meta.nodeType) === -1) {
      throw makeError(
        "InvalidSporeMetaError",
        "nodeType '" + meta.nodeType + "' ungültig. Erlaubt: " + VALID_NODE_TYPES.join(", ") + ".",
      );
    }
  }

  async function generateOwnSpore(meta) {
    validateSporeMeta(meta);
    var identity = await loadIdentity();
    if (!identity) {
      identity = await loadIdentityAfterCreate();
    }

    var unsigned = {
      createdAt: new Date().toISOString(),
      domain: meta.domain,
      embeddingModel: typeof meta.embeddingModel === "string" ? meta.embeddingModel : EMBEDDING_MODEL,
      endpoint: meta.endpoint,
      id: identity.nodeId,
      nodeType: meta.nodeType,
      protocolVersion: typeof meta.protocolVersion === "string" ? meta.protocolVersion : PROTOCOL_VERSION,
      publicKey: identity.publicKeyJwk,
    };
    if (typeof meta.nodeName === "string") unsigned.nodeName = meta.nodeName;
    if (typeof meta.domainDescription === "string") unsigned.domainDescription = meta.domainDescription;
    if (Array.isArray(meta.domainKeywords)) unsigned.domainKeywords = meta.domainKeywords.slice();
    if (Array.isArray(meta.domainVector)) unsigned.domainVector = meta.domainVector.slice();
    if (Array.isArray(meta.stammCategories)) unsigned.stammCategories = meta.stammCategories.slice();
    if (Array.isArray(meta.guestCategories)) unsigned.guestCategories = meta.guestCategories.slice();
    if (meta.endpointPaths && typeof meta.endpointPaths === "object") {
      unsigned.endpointPaths = meta.endpointPaths;
    }

    var subtle = getSubtle();
    var bytes = canonicalJsonBytes(unsigned);
    var sigBuf = await subtle.sign({ name: "Ed25519" }, identity.privateKey, bytes);
    var signature = base64urlEncode(sigBuf);

    var spore = canonicalize(unsigned);
    spore.signature = signature;
    spore = canonicalize(spore);

    var storage = getStorage();
    await storage.put(SPORE_STORE, IDENTITY_KEY, {
      nodeId: identity.nodeId,
      sporeJson: spore,
      signature: signature,
    });
    return spore;
  }

  // Helper used by generateOwnSpore: ensures an identity exists,
  // returns the cache entry. Avoids two storage round-trips when the
  // caller did not run getOrCreateIdentity first.
  async function loadIdentityAfterCreate() {
    await getOrCreateIdentity();
    return await loadIdentity();
  }

  async function getOwnSpore() {
    await ensureReady();
    var storage = getStorage();
    var stored = await storage.get(SPORE_STORE, IDENTITY_KEY);
    if (!stored) return null;
    return stored.sporeJson || null;
  }

  function checkRequiredFields(spore) {
    for (var i = 0; i < REQUIRED_SPORE_FIELDS.length; i++) {
      var f = REQUIRED_SPORE_FIELDS[i];
      if (spore[f] === undefined || spore[f] === null) return f;
    }
    return null;
  }

  function majorVersion(v) {
    if (typeof v !== "string") return null;
    var dot = v.indexOf(".");
    return dot === -1 ? v : v.slice(0, dot);
  }

  async function verifyForeignSpore(spore) {
    try {
      if (!spore || typeof spore !== "object") {
        return { valid: false, reason: "Spore ist kein Objekt." };
      }
      var missing = checkRequiredFields(spore);
      if (missing) return { valid: false, reason: "Pflichtfeld fehlt: " + missing };

      var ourMajor = majorVersion(PROTOCOL_VERSION);
      var theirMajor = majorVersion(spore.protocolVersion);
      if (ourMajor !== theirMajor) {
        return {
          valid: false,
          reason: "Inkompatible Hauptversion: " + spore.protocolVersion + " (wir: " + PROTOCOL_VERSION + ")",
        };
      }

      if (VALID_NODE_TYPES.indexOf(spore.nodeType) === -1) {
        return { valid: false, reason: "nodeType ungültig: " + spore.nodeType };
      }

      var derivedId;
      try {
        derivedId = await deriveNodeIdFromJwk(spore.publicKey);
      } catch (err) {
        return { valid: false, reason: "publicKey nicht importierbar: " + (err && err.message ? err.message : err) };
      }
      if (derivedId !== spore.id) {
        return { valid: false, reason: "nodeId stimmt nicht zum Public Key" };
      }

      var subtle = getSubtle();
      var pub = await subtle.importKey("jwk", spore.publicKey, { name: "Ed25519" }, true, ["verify"]);

      var unsigned = {};
      var keys = Object.keys(spore);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === "signature") continue;
        unsigned[keys[i]] = spore[keys[i]];
      }
      var bytes = canonicalJsonBytes(unsigned);

      var sigBytes;
      try {
        sigBytes = base64urlDecode(spore.signature);
      } catch (err) {
        return { valid: false, reason: "Signatur nicht dekodierbar (kein base64url)" };
      }

      var ok = await subtle.verify({ name: "Ed25519" }, pub, sigBytes, bytes);
      if (!ok) return { valid: false, reason: "Signatur ungültig" };
      return { valid: true };
    } catch (err) {
      return { valid: false, reason: "Verifikationsfehler: " + (err && err.message ? err.message : err) };
    }
  }

  // Sync, idempotent. Leert den In-Memory-identityCache, ohne den
  // Storage anzufassen. Pflicht-Aufruf für Module, die sbkim_keys/
  // sbkim_spore von außen leeren (z.B. Modul 07 confirmSelfApoptose).
  // Ohne diesen Aufruf liefert getNodeId/getPublicKeyJwk weiter die
  // alte Identität aus dem Cache, trotz leerem Storage.
  // Pflege-Sitzung 2026-05-15 (Klaus' Sichttest-Befund Modul 07
  // Test 6: getNodeId_wirft_NoIdentityError war false trotz
  // stores_alle_leer:true).
  function resetIdentityCache() {
    identityCache = null;
  }

  // ---- Backup-Pfad (Bau 02.X, 2026-05-16) ----
  //
  // exportBackup: liest sbkim_keys["main"] + sbkim_spore["main"] direkt
  // aus dem Storage (Roh-JWK-Form), liest sbkim_siblings fail-soft,
  // baut den Klartext-Payload kanonisch, verschlüsselt mit PBKDF2 +
  // AES-GCM-256 und liefert die SbkimBackupBlob-Wrapper-Form. Die
  // §0-Konstante BACKUP_KDF_ITERATIONS wird beim Export verwendet; der
  // Wert wandert in den Blob (kdf.iterations), damit später erhöhte
  // §0-Konstanten alte Backups weiter importieren können (Spec-Sitzung
  // Backup-Export Stufe 2, Pflicht-Frage 2 „Hinweis zur Kompatibilität").

  async function exportBackup(password) {
    if (typeof password !== "string" || password.length < BACKUP_PASSWORD_MIN_LEN) {
      throw makeError(
        "InvalidBackupPasswordError",
        "Passwort muss mindestens " + BACKUP_PASSWORD_MIN_LEN + " Zeichen lang sein.",
      );
    }

    // Sicherstellen, dass eine Identität existiert. getOrCreateIdentity
    // wirft NoIdentityError nicht — es legt fehlende Identität an. Das
    // ist hier OK: Klaus' UI ruft exportBackup nach einem manuellen
    // Setup-Schritt, ein frisches Backup einer frisch erzeugten
    // Identität ist gültiger Use-Case.
    var identity = await getOrCreateIdentity();

    var storage = getStorage();
    var keys = await storage.get(KEYS_STORE, IDENTITY_KEY);
    var sporeWrap = await storage.get(SPORE_STORE, IDENTITY_KEY);
    if (!keys || !sporeWrap) {
      // Defensive: getOrCreateIdentity hat oben sbkim_keys garantiert,
      // sbkim_spore kann fehlen (generateOwnSpore ist eigener Schritt).
      // Karte 02 § Schnittstelle: exportBackup wirft NoIdentityError
      // im Identitäts-Pfad; eine fehlende Spore ist hier kein Backup-
      // Verbot — wir backuppen die Schlüssel ohne Spore-Block, wenn
      // das überhaupt vorkommen sollte. Behandlung: spore = null,
      // payload.spore wird leer-Objekt; der Import-Schema-Check würde
      // das später fangen. Praktisch: getOrCreateIdentity legt nur
      // sbkim_keys an, sbkim_spore wird erst beim ersten
      // generateOwnSpore geschrieben.
      if (!keys) {
        throw makeError(
          "NoIdentityError",
          "Es existiert noch keine Identität. Erst getOrCreateIdentity() aufrufen.",
        );
      }
    }

    var siblingValues = [];
    try {
      var rows = await storage.all(SIBLINGS_STORE);
      if (Array.isArray(rows)) {
        siblingValues = rows.map(function (r) { return r.value; });
      }
    } catch (e) {
      // Fail-soft: UnknownStoreError oder Cursor-Fehler. Karte 02
      // § Storage „Backup-Inhalt" — siblings ist fail-soft beim Export.
      siblingValues = [];
    }

    var payload = {
      createdAt: new Date().toISOString(),
      keys: {
        keyId: "main",
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
      },
      nodeId: identity.nodeId,
      siblings: siblingValues,
      spore: sporeWrap && sporeWrap.sporeJson ? sporeWrap.sporeJson : null,
    };

    var subtle = getSubtle();
    var plaintext = canonicalJsonBytes(payload);
    var salt = global.crypto.getRandomValues(new Uint8Array(BACKUP_KDF_SALT_BYTES));
    var iv = global.crypto.getRandomValues(new Uint8Array(BACKUP_CIPHER_IV_BYTES));
    var aesKey = await derivePbkdf2AesGcmKey(password, salt, BACKUP_KDF_ITERATIONS);
    var cipherBuf = await subtle.encrypt({ name: "AES-GCM", iv: iv }, aesKey, plaintext);

    return {
      version: BACKUP_FORMAT_VERSION,
      kdf: {
        algorithm: "PBKDF2",
        hash: "SHA-256",
        iterations: BACKUP_KDF_ITERATIONS,
        salt: base64urlEncode(salt),
      },
      cipher: {
        algorithm: "AES-GCM-256",
        iv: base64urlEncode(iv),
      },
      ciphertext: base64urlEncode(new Uint8Array(cipherBuf)),
      "payload-schema-version": BACKUP_PAYLOAD_SCHEMA_VERSION,
    };
  }

  // importBackup: defensiv per Default (Pflicht-Frage 3 Variante a).
  // Vor-Checks (Mindest-Länge, Wrapper-Version, Force-Schwelle) laufen
  // VOR dem teuren Crypto-Aufruf. iterations wird aus blob.kdf.iterations
  // gelesen, NICHT aus §0 — damit ältere Backups mit niedrigeren
  // Iterations weiter funktionieren (Pflicht-Frage 2 „Hinweis zur
  // Kompatibilität"). Nach erfolgreichem Schreiben ruft die Funktion
  // resetIdentityCache(), sonst liefert getNodeId weiter den alten
  // Cache trotz frisch geschriebener Identität.
  async function importBackup(blob, password, options) {
    var opts = options || {};
    var force = opts.force === true;

    if (typeof password !== "string" || password.length < BACKUP_PASSWORD_MIN_LEN) {
      throw makeError(
        "InvalidBackupPasswordError",
        "Passwort muss mindestens " + BACKUP_PASSWORD_MIN_LEN + " Zeichen lang sein.",
      );
    }
    if (!blob || typeof blob !== "object") {
      throw makeError("BackupSchemaError", "Backup-Blob fehlt oder ist kein Objekt.");
    }
    if (blob.version !== BACKUP_FORMAT_VERSION) {
      throw makeError(
        "BackupVersionMismatchError",
        "Backup-Hauptversion " + blob.version + " unbekannt (Modul 02 versteht " +
          BACKUP_FORMAT_VERSION + ").",
      );
    }
    if (!blob.kdf || !blob.cipher || typeof blob.ciphertext !== "string") {
      throw makeError(
        "BackupSchemaError",
        "Backup-Pflichtfeld fehlt im Wrapper: kdf / cipher / ciphertext.",
      );
    }

    await ensureReady();
    var storage = getStorage();

    var existingKeys = await storage.get(KEYS_STORE, IDENTITY_KEY);
    if (existingKeys && !force) {
      throw makeError(
        "BackupOverwriteError",
        "Bestehende Identität in sbkim_keys[main]. {force:true} setzen, um sie bewusst zu " +
          "ersetzen — die alte nodeId wird damit verworfen, Geschwister behandeln den Knoten " +
          "danach als unbekannt.",
      );
    }

    var iterations = blob.kdf.iterations;
    if (typeof iterations !== "number" || !(iterations > 0)) {
      throw makeError("BackupSchemaError", "Backup-kdf.iterations ungültig.");
    }

    var payload;
    try {
      var salt = base64urlDecode(blob.kdf.salt);
      var iv = base64urlDecode(blob.cipher.iv);
      var ct = base64urlDecode(blob.ciphertext);
      var aesKey = await derivePbkdf2AesGcmKey(password, salt, iterations);
      var subtle = getSubtle();
      var plainBuf = await subtle.decrypt({ name: "AES-GCM", iv: iv }, aesKey, ct);
      var plainText = new TextDecoder().decode(plainBuf);
      payload = JSON.parse(plainText);
    } catch (e) {
      // Sammel-Klasse — Karte 02 § Fehlerverhalten: Modul 02 verrät
      // bewusst nicht, ob Passwort falsch oder Datei beschädigt
      // (kein Oracle für Angreifer).
      throw makeError(
        "BackupDecryptError",
        "Falsches Passwort oder korruptes Backup.",
        e,
      );
    }

    var payloadSchemaVersion = blob["payload-schema-version"];
    if (typeof payloadSchemaVersion === "number" && payloadSchemaVersion > BACKUP_PAYLOAD_SCHEMA_VERSION) {
      throw makeError(
        "BackupSchemaError",
        "Payload-Schema-Version " + payloadSchemaVersion + " ist neuer als Modul 02 kennt (" +
          BACKUP_PAYLOAD_SCHEMA_VERSION + ").",
      );
    }
    if (!payload || typeof payload !== "object") {
      throw makeError("BackupSchemaError", "Backup-Klartext-Payload ist kein Objekt.");
    }
    if (typeof payload.nodeId !== "string" || payload.nodeId.length === 0) {
      throw makeError("BackupSchemaError", "Payload-Pflichtfeld fehlt: nodeId.");
    }
    if (!payload.keys || typeof payload.keys !== "object") {
      throw makeError("BackupSchemaError", "Payload-Pflichtfeld fehlt: keys.");
    }
    if (!payload.keys.privateKey || typeof payload.keys.privateKey !== "object") {
      throw makeError("BackupSchemaError", "Payload-Pflichtfeld fehlt: keys.privateKey.");
    }
    if (!payload.keys.publicKey || typeof payload.keys.publicKey !== "object") {
      throw makeError("BackupSchemaError", "Payload-Pflichtfeld fehlt: keys.publicKey.");
    }
    if (!payload.spore || typeof payload.spore !== "object") {
      throw makeError("BackupSchemaError", "Payload-Pflichtfeld fehlt: spore.");
    }

    await storage.put(KEYS_STORE, IDENTITY_KEY, {
      keyId: "main",
      privateKey: payload.keys.privateKey,
      publicKey: payload.keys.publicKey,
    });
    await storage.put(SPORE_STORE, IDENTITY_KEY, {
      nodeId: payload.nodeId,
      sporeJson: payload.spore,
      signature: payload.spore.signature,
    });

    var siblings = Array.isArray(payload.siblings) ? payload.siblings : [];
    for (var i = 0; i < siblings.length; i++) {
      var s = siblings[i];
      if (!s || typeof s !== "object" || typeof s.nodeId !== "string" || s.nodeId.length === 0) continue;
      await storage.put(SIBLINGS_STORE, s.nodeId, s);
    }

    resetIdentityCache();
    return { restored: true };
  }

  var SbkimSpore = {
    init: init,
    getOrCreateIdentity: getOrCreateIdentity,
    getNodeId: getNodeId,
    getPublicKeyJwk: getPublicKeyJwk,
    generateOwnSpore: generateOwnSpore,
    getOwnSpore: getOwnSpore,
    verifyForeignSpore: verifyForeignSpore,
    resetIdentityCache: resetIdentityCache,
    exportBackup: exportBackup,
    importBackup: importBackup,
    InvalidBackupPasswordError: InvalidBackupPasswordError,
    BackupDecryptError: BackupDecryptError,
    BackupVersionMismatchError: BackupVersionMismatchError,
    BackupSchemaError: BackupSchemaError,
    BackupOverwriteError: BackupOverwriteError,
    _meta: {
      protocolVersion: PROTOCOL_VERSION,
      identityKey: IDENTITY_KEY,
      keysStore: KEYS_STORE,
      sporeStore: SPORE_STORE,
      siblingsStore: SIBLINGS_STORE,
      requiredSporeFields: REQUIRED_SPORE_FIELDS.slice(),
      backupFormatVersion: BACKUP_FORMAT_VERSION,
      backupKdfIterations: BACKUP_KDF_ITERATIONS,
      backupPasswordMinLen: BACKUP_PASSWORD_MIN_LEN,
      backupPayloadSchemaVersion: BACKUP_PAYLOAD_SCHEMA_VERSION,
    },
  };

  global.SbkimSpore = SbkimSpore;

  // Self-check: emitted on script load (synchronous, no async load step).
  // Format is uniform across all SBKIM modules — see INTERFACES.md.
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 02 SPORE bereit, Funktionen: " +
        "init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache/exportBackup/importBackup",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
