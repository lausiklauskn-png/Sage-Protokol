/*
 * SBKIM — Modul 06 — Heterokaryose
 *
 * Composes Modul 01 (Storage) and Modul 02 (Spore) into the third
 * protocol composition (after Modul 05 and 07): Pull-based domain-anchor
 * exchange between already-anastomosed siblings. Modul 06 itself never
 * computes a cosine, never embeds, never calls SbkimAnastomose.handshake
 * — it orchestrates the explicit Heterokaryose-Pull against the legacy
 * POST endpoint /sbkim/heterokaryosis.
 *
 * Public surface (registered on window.SbkimHeterokaryose):
 *   init() -> Promise<void>
 *   requestHeterokaryosis(peerNodeId) -> Promise<HeterokaryoseResult>
 *   receiveHeterokaryosis(incomingRequest) -> Promise<HeterokaryosisResponse>   // wirft NIEMALS
 *   listHeterokaryosis() -> Promise<Array<{ peerNodeId, ts, anchorCount, receivedAt }>>
 *   forgetHeterokaryosis(peerNodeId, ts) -> Promise<void>                       // idempotent
 *
 * Inoffiziell (Unterstrich-Präfix, nur für tests/manual_check.html):
 *   _invokeReceiveHeterokaryosisDirect(request)  -> alias auf receiveHeterokaryosis
 *   _buildSignedHeterokaryosisRequest(toNodeId)  -> Build + Sign ohne Versand
 *   _verifyResponseSignature(resp, jwk)          -> Test-Brücke für Sender-Verify
 *   _addPseudoSibling({nodeId,domain,endpoint,
 *                       pubKey,since,heterokaryosisOptIn})
 *                                                -> schreibt direkt in
 *                                                   sbkim_siblings; akzeptiert
 *                                                   das additive Opt-In-Flag
 *                                                   (Spec-Sitzung 06).
 *                                                   Per Convention nur Tests.
 *   _clearPseudoSiblings()                       -> löscht alle pseudo-Einträge
 *                                                   aus sbkim_siblings.
 *   _setReceiverHttpStatus(status|null)          -> Override für den nächsten
 *                                                   ausgehenden POST: simuliert
 *                                                   eine HTTP-Antwort mit dem
 *                                                   übergebenen Status, ohne
 *                                                   das Netz zu berühren.
 *                                                   Erlaubt Test 12 (404 →
 *                                                   endpoint_unsupported)
 *                                                   headless.
 *   _canonicalize / _base64urlEncode / _base64urlDecode
 *   _signEnvelope / _verifyEnvelope              -> Krypto-Helfer (Panel)
 *
 * Self-check: emits a console.info line on script load (synchronous,
 * before any call). See INTERFACES.md §1 Modul 06, §2 Heterokaryose (Pull),
 * §3 (heterokaryosis: /sbkim/heterokaryosis) und
 * docs/components/06_heterokaryose.md für den verbindlichen Vertrag.
 *
 * Krypto-Pfad (canonicalize, base64url, sign, verify) ist bewusst aus
 * Modul 02 / 05 / 07 dupliziert — Single-File-PWA-Stil, keine geteilte
 * Library, kein Eingriff in 02/05/07. Wer das zusammenführen will,
 * hebt eine Pflege-Sitzung.
 *
 * Anker-Quelle in dieser Bau-Iteration: ausschließlich Spore-Single-
 * Anker-Fallback. Wenn die eigene Spore ein domainVector-Feld hat, wird
 * EIN Anker mit label="(domain)" zurückgegeben; sonst ein leeres
 * anchors:[]-Array (Degraded-Modus, outcome:"shared" bleibt). Der
 * spec-vorgesehene sbkim_hetero_outbox-Store wird in dieser Iteration
 * NICHT implementiert — das gehört in Spec-Sitzung 08 oder eine Pflege
 * Modul 02.
 */
(function (global) {
  "use strict";

  // ---- Konstanten (gespiegelt aus INTERFACES.md §0 / §3) ----

  var PROTOCOL_VERSION = "0.1";
  var QUERY_TIMEOUT_MS = 4000;
  var HETERO_MAX_ANCHORS = 5;
  var ENDPOINT_HETEROKARYOSIS = "/sbkim/heterokaryosis";
  var NONCE_BYTES = 16;

  var SIBLINGS_STORE = "sbkim_siblings";
  var LOG_STORE = "sbkim_anastomosis_log";
  var INBOX_STORE = "sbkim_hetero_inbox";

  var REQUEST_REQUIRED_FIELDS = [
    "fromNodeId",
    "nonce",
    "protocolVersion",
    "senderSpore",
    "signature",
    "timestamp",
    "toNodeId",
  ];

  // ---- Fehler-Erzeugung ----

  function makeError(name, message, cause) {
    var e = new Error(message);
    e.name = name;
    if (cause !== undefined) e.cause = cause;
    return e;
  }

  // ---- Dependency-Probes ----

  function getSubtle() {
    var c = global.crypto || (typeof crypto !== "undefined" ? crypto : null);
    if (!c || !c.subtle) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "WebCrypto (crypto.subtle) ist nicht verfügbar. Modul 06 braucht moderne Browser " +
          "(Chrome ≥ 113, Firefox ≥ 130, Safari ≥ 17). Kein Polyfill.",
      );
    }
    return c.subtle;
  }

  function probeDependencies() {
    var missing = [];
    if (!global.SbkimStorage) missing.push("SbkimStorage (Modul 01)");
    if (!global.SbkimSpore) missing.push("SbkimSpore (Modul 02)");
    if (missing.length > 0) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "Fehlende Modul-Abhängigkeiten: " + missing.join(", ") + ". " +
          "Lade 01_storage.js und 02_spore.js vor 06_heterokaryose.js.",
      );
    }
  }

  function getStorage() { return global.SbkimStorage; }
  function getSpore() { return global.SbkimSpore; }

  // ---- base64url ohne Padding (RFC 4648 §5, dupliziert aus Modul 02/05/07) ----

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

  // Recursive lexicographic key sort. Returns a new object, never mutates.
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

  function canonicalJsonBytesWithoutSignature(envelopeLike) {
    var unsigned = {};
    var keys = Object.keys(envelopeLike);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === "signature") continue;
      unsigned[keys[i]] = envelopeLike[keys[i]];
    }
    return utf8Encode(JSON.stringify(canonicalize(unsigned)));
  }

  // ---- Sign / Verify auf Envelope-Ebene ----

  async function signEnvelope(unsigned, privateKey) {
    var bytes = utf8Encode(JSON.stringify(canonicalize(unsigned)));
    var sigBuf = await getSubtle().sign({ name: "Ed25519" }, privateKey, bytes);
    return base64urlEncode(sigBuf);
  }

  async function verifyEnvelope(envelope, publicKeyJwk) {
    if (!envelope || typeof envelope.signature !== "string") return false;
    var subtle = getSubtle();
    var pub;
    try {
      pub = await subtle.importKey("jwk", publicKeyJwk, { name: "Ed25519" }, true, ["verify"]);
    } catch (err) {
      return false;
    }
    var sigBytes;
    try {
      sigBytes = base64urlDecode(envelope.signature);
    } catch (err) {
      return false;
    }
    var bytes = canonicalJsonBytesWithoutSignature(envelope);
    try {
      return await subtle.verify({ name: "Ed25519" }, pub, sigBytes, bytes);
    } catch (err) {
      return false;
    }
  }

  // ---- Helfer ----

  function randomBytesB64(n) {
    var c = global.crypto || (typeof crypto !== "undefined" ? crypto : null);
    if (!c || !c.getRandomValues) {
      throw makeError("HeterokaryoseDependenciesError", "crypto.getRandomValues fehlt — Modul 06 braucht WebCrypto.");
    }
    var buf = new Uint8Array(n);
    c.getRandomValues(buf);
    return base64urlEncode(buf);
  }

  function majorVersion(v) {
    if (typeof v !== "string") return null;
    var dot = v.indexOf(".");
    return dot === -1 ? v : v.slice(0, dot);
  }

  function nowIso() { return new Date().toISOString(); }

  // Re-entry-friendly log key: ein Counter pro Millisekunde, damit zwei
  // schnell aufeinanderfolgende Log-Zeilen einander nicht überschreiben
  // (dieselbe Konvention wie Modul 05).
  var lastLogTs = "";
  var logSubCounter = 0;
  function nextLogKey() {
    var ts = nowIso();
    var key;
    if (ts === lastLogTs) {
      logSubCounter += 1;
      key = ts + "+" + logSubCounter;
    } else {
      lastLogTs = ts;
      logSubCounter = 0;
      key = ts;
    }
    return { key: key, ts: ts };
  }

  async function logEntry(peerId, outcome) {
    try {
      var k = nextLogKey();
      await getStorage().put(LOG_STORE, k.key, {
        ts: k.ts,
        peerId: peerId,
        outcome: outcome,
      });
    } catch (err) {
      // Log-Fehler dürfen den Pfad nicht abbrechen — Apoptose/Anastomose
      // protokollieren, aber stoßen den Hauptpfad nicht um.
      if (typeof console !== "undefined" && console.error) {
        console.error("MODUL 06 HETEROKARYOSE: Log-Schreibfehler (" + outcome + "):", err);
      }
    }
  }

  // ---- Modul-Zustand ----

  var ready = false;
  var bridgeRegistered = false;
  var ownPrivateKeyCache = null;
  var receiverHttpStatusOverride = null;   // Test-Bridge für 404-Pfad

  // ---- init() ----

  async function init() {
    probeDependencies();
    getSubtle();
    await getStorage().init();
    await getSpore().init();
    setupServiceWorkerBridge();
    ready = true;
    // Spec: kein Selbst-Sweep, keine Pulsation, kein Auto-Pull beim
    // Skript-Laden. init() registriert nur den Listener und prüft
    // Abhängigkeiten.
  }

  async function ensureReady() {
    if (!ready) await init();
  }

  async function loadOwnPrivateKey() {
    if (ownPrivateKeyCache) return ownPrivateKeyCache;
    var storage = getStorage();
    var stored = await storage.get("sbkim_keys", "main");
    if (!stored || !stored.privateKey) {
      throw makeError(
        "NoIdentityError",
        "Keine Identität in sbkim_keys[\"main\"] — getOrCreateIdentity wurde nicht ausgeführt.",
      );
    }
    var subtle = getSubtle();
    var priv;
    try {
      priv = await subtle.importKey("jwk", stored.privateKey, { name: "Ed25519" }, true, ["sign"]);
    } catch (err) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "Privatschlüssel nicht importierbar: " + (err && err.message ? err.message : err),
        err,
      );
    }
    ownPrivateKeyCache = priv;
    return priv;
  }

  // ---- Service-Worker-Brücke (Variante A: Page-Hosted via MessageChannel) ----

  function setupServiceWorkerBridge() {
    if (bridgeRegistered) return;
    if (typeof navigator === "undefined" || !navigator.serviceWorker) return;
    try {
      navigator.serviceWorker.addEventListener("message", async function (event) {
        if (!event || !event.data || event.data.type !== "SBKIM_HETEROKARYOSIS_REQUEST") return;
        if (!event.ports || event.ports.length === 0) return;
        var port = event.ports[0];
        var response;
        try {
          response = await receiveHeterokaryosis(event.data.request);
        } catch (err) {
          // receiveHeterokaryosis wirft per Spec niemals. Verteidigt sicherheitshalber.
          response = { outcome: "rejected", reason: "Interner Fehler: " + (err && err.message ? err.message : err) };
        }
        try { port.postMessage(response); } catch (e2) { /* port already closed */ }
      });
      bridgeRegistered = true;
    } catch (err) {
      bridgeRegistered = false;
    }
  }

  // ---- fetch-Wrapper mit Test-Bridge-Hook ----

  async function doFetch(url, options) {
    if (receiverHttpStatusOverride !== null) {
      var statusOverride = receiverHttpStatusOverride;
      receiverHttpStatusOverride = null;
      return {
        ok: statusOverride >= 200 && statusOverride < 300,
        status: statusOverride,
        statusText: "Override Test-Status",
        async json() { return {}; },
      };
    }
    return await fetch(url, options);
  }

  // ---- Anker-Quelle (Spore-Single-Anker-Fallback) ----
  //
  // Bau-Iteration 06: ausschließlich der Spore-Single-Anker. Wenn die
  // eigene Spore ein domainVector-Feld hat, ein Anker; sonst leeres
  // Array (Degraded-Modus). Der spec-vorgesehene sbkim_hetero_outbox-
  // Store wird hier NICHT gelesen — das ist Spec-Sitzung 08.

  async function readOwnAnchors() {
    var ownSpore = await getSpore().getOwnSpore();
    if (!ownSpore) return [];
    if (!Array.isArray(ownSpore.domainVector) || ownSpore.domainVector.length === 0) {
      return [];
    }
    var anchor = { label: "(domain)", vector: ownSpore.domainVector.slice() };
    return [anchor];
  }

  // ---- requestHeterokaryosis() ----

  async function requestHeterokaryosis(peerNodeId) {
    await ensureReady();
    var storage = getStorage();
    var spore = getSpore();

    if (typeof peerNodeId !== "string" || peerNodeId.length === 0) {
      throw makeError(
        "UnknownSiblingError",
        "peerNodeId fehlt oder ist leer — bitte die nodeId eines bekannten Geschwisters angeben.",
      );
    }

    // 1. Sibling-Lookup
    var sibling = await storage.get(SIBLINGS_STORE, peerNodeId);
    if (!sibling) {
      throw makeError(
        "UnknownSiblingError",
        "Unbekannter Geschwister-Knoten: " + peerNodeId + ". Vorher anastomosieren (Modul 05).",
      );
    }

    // 2. Lokale Opt-In-Vorprüfung (fail-soft: Feld fehlt → false)
    if (sibling.heterokaryosisOptIn !== true) {
      await logEntry(peerNodeId, "hetero-opt-out-local");
      return { outcome: "opt-out-local" };
    }

    // 3. Eigene Identität + Spore laden
    var ownSpore = await spore.getOwnSpore();
    if (!ownSpore) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "Eigene Spore fehlt — SbkimSpore.generateOwnSpore(meta) zuerst.",
      );
    }
    var privKey = await loadOwnPrivateKey();
    var ownNodeId = await spore.getNodeId();

    // 4. HeterokaryosisRequest bauen + signieren
    var unsigned = {
      fromNodeId: ownNodeId,
      nonce: randomBytesB64(NONCE_BYTES),
      protocolVersion: PROTOCOL_VERSION,
      senderSpore: ownSpore,
      timestamp: nowIso(),
      toNodeId: peerNodeId,
    };
    var sig = await signEnvelope(unsigned, privKey);
    var request = canonicalize(Object.assign({}, unsigned, { signature: sig }));

    // 5. POST mit Abort-Timeout (oder Test-Bridge-Override)
    if (typeof sibling.endpoint !== "string" || sibling.endpoint.length === 0) {
      throw makeError(
        "HeterokaryoseNetworkError",
        "Geschwister-Eintrag hat kein endpoint-Feld — kann nicht pullen.",
      );
    }
    var url = String(sibling.endpoint).replace(/\/$/, "") + ENDPOINT_HETEROKARYOSIS;
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, QUERY_TIMEOUT_MS);
    var response;
    try {
      response = await doFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err && err.name === "AbortError") {
        await logEntry(peerNodeId, "hetero-timeout");
        throw makeError(
          "HeterokaryoseTimeoutError",
          "Heterokaryose-POST > " + QUERY_TIMEOUT_MS + " ms abgebrochen: " + url,
          err,
        );
      }
      throw makeError(
        "HeterokaryoseNetworkError",
        "Netz-Fehler bei " + url + ": " + (err && err.message ? err.message : err),
        err,
      );
    }
    clearTimeout(timeoutId);

    // 5a. HTTP 404 → endpoint_unsupported (KEIN Throw)
    if (response.status === 404) {
      await logEntry(peerNodeId, "hetero-endpoint-unsupported");
      return { outcome: "endpoint_unsupported" };
    }

    if (!response.ok) {
      throw makeError(
        "HeterokaryoseNetworkError",
        "HTTP " + response.status + " " + response.statusText + " bei " + url + ".",
      );
    }

    var responseJson;
    try {
      responseJson = await response.json();
    } catch (err) {
      throw makeError(
        "HeterokaryoseNetworkError",
        "Antwort kein gültiges JSON: " + (err && err.message ? err.message : err),
        err,
      );
    }

    return await consumeResponse(peerNodeId, responseJson);
  }

  async function consumeResponse(peerNodeId, responseJson) {
    if (!responseJson || typeof responseJson !== "object") {
      throw makeError("HeterokaryoseNetworkError", "Antwort ist kein Objekt.");
    }
    if (typeof responseJson.outcome !== "string") {
      throw makeError("HeterokaryoseNetworkError", "Antwort ohne outcome-Feld.");
    }

    var spore = getSpore();
    var verifyReceiver = await spore.verifyForeignSpore(responseJson.receiverSpore);
    if (!verifyReceiver.valid) {
      await logEntry(peerNodeId, "hetero-rejected");
      throw makeError(
        "HeterokaryoseSignatureInvalidError",
        "receiverSpore ungültig: " + (verifyReceiver.reason || "?"),
      );
    }

    var sigOk = await verifyEnvelope(responseJson, responseJson.receiverSpore.publicKey);
    if (!sigOk) {
      await logEntry(peerNodeId, "hetero-rejected");
      throw makeError(
        "HeterokaryoseSignatureInvalidError",
        "Response-Signatur gegen receiverSpore.publicKey ungültig.",
      );
    }

    if (responseJson.outcome === "shared") {
      var anchors = Array.isArray(responseJson.anchors) ? responseJson.anchors : [];
      var ts = typeof responseJson.timestamp === "string" ? responseJson.timestamp : nowIso();
      var receivedAt = nowIso();
      try {
        await getStorage().put(INBOX_STORE, peerNodeId + "|" + ts, {
          peerNodeId: peerNodeId,
          ts: ts,
          anchors: anchors,
          signature: responseJson.signature,
          receivedAt: receivedAt,
        });
      } catch (storageErr) {
        if (typeof console !== "undefined" && console.error) {
          console.error("MODUL 06 HETEROKARYOSE: Inbox-Schreibfehler:", storageErr);
        }
        throw makeError(
          "HeterokaryoseNetworkError",
          "Inbox-Schreibfehler: " + (storageErr && storageErr.message ? storageErr.message : storageErr),
          storageErr,
        );
      }
      await logEntry(peerNodeId, "hetero-pulled");
      return {
        outcome: "shared",
        anchorCount: anchors.length,
        peerNodeId: peerNodeId,
        ts: ts,
      };
    }

    if (responseJson.outcome === "opt-out") {
      await logEntry(peerNodeId, "hetero-opt-out");
      return { outcome: "opt-out" };
    }

    // outcome:"rejected" oder unbekannt → als rejected behandeln
    await logEntry(peerNodeId, "hetero-rejected");
    return {
      outcome: "rejected",
      reason: typeof responseJson.reason === "string" ? responseJson.reason : "(kein Grund mitgeschickt)",
    };
  }

  // ---- receiveHeterokaryosis() — wirft NIEMALS ----

  async function receiveHeterokaryosis(incomingRequest) {
    try {
      await ensureReady();
      var spore = getSpore();
      var storage = getStorage();

      // 1. Form-Check
      var missing = checkRequestFields(incomingRequest);
      if (missing) {
        return await buildResponse({ outcome: "rejected", reason: "Form ungültig: " + missing }, incomingRequest);
      }

      // 2. Sender-Spore
      var verifySender = await spore.verifyForeignSpore(incomingRequest.senderSpore);
      if (!verifySender.valid) {
        return await buildResponse(
          { outcome: "rejected", reason: verifySender.reason || "senderSpore ungültig" },
          incomingRequest,
        );
      }

      // 3. Hauptversion
      if (majorVersion(incomingRequest.protocolVersion) !== majorVersion(PROTOCOL_VERSION)) {
        return await buildResponse(
          { outcome: "rejected", reason: "Inkompatible Hauptversion: " + incomingRequest.protocolVersion },
          incomingRequest,
        );
      }

      // 4. Request-Signatur
      var sigOk = await verifyEnvelope(incomingRequest, incomingRequest.senderSpore.publicKey);
      if (!sigOk) {
        return await buildResponse(
          { outcome: "rejected", reason: "Request-Signatur ungültig" },
          incomingRequest,
        );
      }

      // 5. toNodeId-Check (Pflicht in HeterokaryosisRequest)
      var myNodeId = await spore.getNodeId();
      if (typeof incomingRequest.toNodeId !== "string" || incomingRequest.toNodeId !== myNodeId) {
        return await buildResponse(
          { outcome: "rejected", reason: "toNodeId stimmt nicht zum Empfänger" },
          incomingRequest,
        );
      }

      // 6. Sibling-Filter (Sender muss in unserer sbkim_siblings stehen)
      var senderId = incomingRequest.senderSpore.id;
      var siblingEntry;
      try {
        siblingEntry = await storage.get(SIBLINGS_STORE, senderId);
      } catch (storageErr) {
        if (typeof console !== "undefined" && console.error) {
          console.error("MODUL 06 HETEROKARYOSE: Sibling-Lookup-Fehler:", storageErr);
        }
        return await buildResponse(
          { outcome: "rejected", reason: "interner Speicherfehler" },
          incomingRequest,
        );
      }
      if (!siblingEntry) {
        return await buildResponse(
          { outcome: "rejected", reason: "Sender ist kein Geschwister" },
          incomingRequest,
        );
      }

      // 7. Opt-In-Filter (fail-soft, fehlend → false)
      if (siblingEntry.heterokaryosisOptIn !== true) {
        await logEntry(senderId, "hetero-opt-out");
        return await buildResponse({ outcome: "opt-out" }, incomingRequest);
      }

      // 8. Anker-Quelle lesen, max. HETERO_MAX_ANCHORS, Response bauen
      var anchors;
      try {
        anchors = await readOwnAnchors();
      } catch (err) {
        if (typeof console !== "undefined" && console.error) {
          console.error("MODUL 06 HETEROKARYOSE: Anker-Quelle-Fehler:", err);
        }
        anchors = [];
      }
      if (anchors.length > HETERO_MAX_ANCHORS) {
        anchors = anchors.slice(0, HETERO_MAX_ANCHORS);
      }
      await logEntry(senderId, "hetero-served");
      return await buildResponse(
        { outcome: "shared", anchors: anchors },
        incomingRequest,
      );
    } catch (err) {
      // Spec: receiveHeterokaryosis wirft niemals. Wenn doch (z.B. Build-
      // Response scheitert), schicken wir eine unsignierte Notbremse —
      // der Sender wird die unsignierte Variante über verifyEnvelope
      // ablehnen, was richtig ist (bei totalem Empfänger-Ausfall darf
      // nichts „valide" antworten).
      try {
        return await buildResponse(
          { outcome: "rejected", reason: "Interner Fehler: " + (err && err.message ? err.message : err) },
          incomingRequest || {},
        );
      } catch (err2) {
        return {
          fromNodeId: "",
          nonceEcho: (incomingRequest && typeof incomingRequest.nonce === "string") ? incomingRequest.nonce : "",
          outcome: "rejected",
          protocolVersion: PROTOCOL_VERSION,
          reason: "Interner Fehler ohne Signatur: " + (err2 && err2.message ? err2.message : err2),
          timestamp: nowIso(),
          toNodeId: (incomingRequest && typeof incomingRequest.fromNodeId === "string") ? incomingRequest.fromNodeId : "",
        };
      }
    }
  }

  function checkRequestFields(req) {
    if (!req || typeof req !== "object") return "Request ist kein Objekt";
    for (var i = 0; i < REQUEST_REQUIRED_FIELDS.length; i++) {
      var f = REQUEST_REQUIRED_FIELDS[i];
      if (req[f] === undefined || req[f] === null) return "Pflichtfeld fehlt: " + f;
    }
    if (typeof req.senderSpore !== "object") return "senderSpore kein Objekt";
    return null;
  }

  async function buildResponse(extra, incomingRequest) {
    var spore = getSpore();
    var ownSpore = await spore.getOwnSpore();
    if (!ownSpore) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "Eigene Spore fehlt — HeterokaryosisResponse kann nicht signiert werden.",
      );
    }
    var privKey = await loadOwnPrivateKey();
    var ownNodeId = await spore.getNodeId();

    var unsigned = {
      fromNodeId: ownNodeId,
      nonceEcho: (incomingRequest && typeof incomingRequest.nonce === "string") ? incomingRequest.nonce : "",
      outcome: extra.outcome,
      protocolVersion: PROTOCOL_VERSION,
      receiverSpore: ownSpore,
      timestamp: nowIso(),
      toNodeId: (incomingRequest && typeof incomingRequest.fromNodeId === "string") ? incomingRequest.fromNodeId : "",
    };
    if (extra.reason !== undefined) unsigned.reason = extra.reason;
    if (extra.anchors !== undefined) unsigned.anchors = extra.anchors;

    var sig = await signEnvelope(unsigned, privKey);
    return canonicalize(Object.assign({}, unsigned, { signature: sig }));
  }

  // ---- listHeterokaryosis() ----

  async function listHeterokaryosis() {
    await ensureReady();
    var rows = await getStorage().all(INBOX_STORE);
    return rows.map(function (r) {
      return {
        peerNodeId: r.value.peerNodeId,
        ts: r.value.ts,
        anchorCount: Array.isArray(r.value.anchors) ? r.value.anchors.length : 0,
        receivedAt: r.value.receivedAt,
      };
    });
  }

  // ---- forgetHeterokaryosis(peerNodeId, ts) ----

  async function forgetHeterokaryosis(peerNodeId, ts) {
    if (typeof peerNodeId !== "string" || peerNodeId.length === 0) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "forgetHeterokaryosis: peerNodeId fehlt oder ist leer.",
      );
    }
    if (typeof ts !== "string" || ts.length === 0) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "forgetHeterokaryosis: ts fehlt oder ist leer.",
      );
    }
    await ensureReady();
    // Idempotent: del wirft nicht, wenn der Schlüssel fehlt (Modul 01-Vertrag).
    await getStorage().del(INBOX_STORE, peerNodeId + "|" + ts);
  }

  // ---- Test-Brücken (Unterstrich-Präfix, inoffiziell) ----

  // Baut einen signierten HeterokaryosisRequest mit der lokalen Identität.
  // toNodeId muss extern übergeben werden (in Panel 06 typischerweise die
  // eigene nodeId, weil Singleton ≈ Selbst-Sender).
  async function _buildSignedHeterokaryosisRequest(toNodeId) {
    await ensureReady();
    if (typeof toNodeId !== "string" || toNodeId.length === 0) {
      throw makeError("HeterokaryoseDependenciesError", "toNodeId fehlt.");
    }
    var spore = getSpore();
    var ownSpore = await spore.getOwnSpore();
    if (!ownSpore) {
      throw makeError("HeterokaryoseDependenciesError", "Eigene Spore fehlt — generateOwnSpore(meta) zuerst.");
    }
    var ownNodeId = await spore.getNodeId();
    var privKey = await loadOwnPrivateKey();
    var unsigned = {
      fromNodeId: ownNodeId,
      nonce: randomBytesB64(NONCE_BYTES),
      protocolVersion: PROTOCOL_VERSION,
      senderSpore: ownSpore,
      timestamp: nowIso(),
      toNodeId: toNodeId,
    };
    var sig = await signEnvelope(unsigned, privKey);
    return canonicalize(Object.assign({}, unsigned, { signature: sig }));
  }

  async function _verifyResponseSignature(response, receiverPublicKeyJwk) {
    return await verifyEnvelope(response, receiverPublicKeyJwk);
  }

  // Pseudo-Sibling-Pattern für Panel 06: schreibt direkt in sbkim_siblings,
  // damit Storage-basierte Lookups in request/receive den Eintrag finden.
  // Anders als Modul 07's _addPseudoSibling (in-memory-Versand-Override),
  // weil Modul 06 ausschließlich Storage liest.
  var pseudoSiblingIds = [];

  async function _addPseudoSibling(sib) {
    if (!sib || typeof sib.nodeId !== "string" || typeof sib.endpoint !== "string") {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "_addPseudoSibling erwartet {nodeId, domain, endpoint, pubKey, since, heterokaryosisOptIn}.",
      );
    }
    await ensureReady();
    var entry = {
      nodeId: sib.nodeId,
      domain: sib.domain || "",
      endpoint: sib.endpoint,
      pubKey: sib.pubKey || null,
      since: sib.since || nowIso(),
    };
    if (sib.heterokaryosisOptIn === true) {
      entry.heterokaryosisOptIn = true;
    } else if (sib.heterokaryosisOptIn === false) {
      entry.heterokaryosisOptIn = false;
    }
    await getStorage().put(SIBLINGS_STORE, sib.nodeId, entry);
    if (pseudoSiblingIds.indexOf(sib.nodeId) === -1) {
      pseudoSiblingIds.push(sib.nodeId);
    }
  }

  async function _clearPseudoSiblings() {
    await ensureReady();
    var storage = getStorage();
    for (var i = 0; i < pseudoSiblingIds.length; i++) {
      try { await storage.del(SIBLINGS_STORE, pseudoSiblingIds[i]); } catch (e) { /* nb */ }
    }
    pseudoSiblingIds = [];
  }

  function _setReceiverHttpStatus(status) {
    if (status === null || status === undefined) {
      receiverHttpStatusOverride = null;
      return;
    }
    if (typeof status !== "number" || !isFinite(status)) {
      throw makeError(
        "HeterokaryoseDependenciesError",
        "_setReceiverHttpStatus erwartet eine Zahl oder null.",
      );
    }
    receiverHttpStatusOverride = status;
  }

  // ---- public surface ----

  var SbkimHeterokaryose = {
    init: init,
    requestHeterokaryosis: requestHeterokaryosis,
    receiveHeterokaryosis: receiveHeterokaryosis,
    listHeterokaryosis: listHeterokaryosis,
    forgetHeterokaryosis: forgetHeterokaryosis,

    // Test-Brücken
    _invokeReceiveHeterokaryosisDirect: receiveHeterokaryosis,
    _buildSignedHeterokaryosisRequest: _buildSignedHeterokaryosisRequest,
    _verifyResponseSignature: _verifyResponseSignature,
    _addPseudoSibling: _addPseudoSibling,
    _clearPseudoSiblings: _clearPseudoSiblings,
    _setReceiverHttpStatus: _setReceiverHttpStatus,
    _canonicalize: canonicalize,
    _base64urlEncode: base64urlEncode,
    _base64urlDecode: base64urlDecode,
    _signEnvelope: signEnvelope,
    _verifyEnvelope: verifyEnvelope,

    _meta: {
      protocolVersion: PROTOCOL_VERSION,
      queryTimeoutMs: QUERY_TIMEOUT_MS,
      heteroMaxAnchors: HETERO_MAX_ANCHORS,
      endpointHeterokaryosis: ENDPOINT_HETEROKARYOSIS,
      inboxStore: INBOX_STORE,
      siblingsStore: SIBLINGS_STORE,
      logStore: LOG_STORE,
      requestRequiredFields: REQUEST_REQUIRED_FIELDS.slice(),
    },
  };

  global.SbkimHeterokaryose = SbkimHeterokaryose;

  // Self-check: synchronous on script load. Format uniform across SBKIM —
  // see INTERFACES.md §1 Modul 06.
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 06 HETEROKARYOSE bereit, Funktionen: " +
        "init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
