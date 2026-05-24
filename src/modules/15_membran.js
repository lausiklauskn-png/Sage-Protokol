/*
 * SBKIM — Modul 15 — Membran
 *
 * Außenhülle zwischen PWA-Zelle und Browser-Umgebung. Bau-Sitzung 15
 * (2026-05-24) implementiert:
 *
 *   Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe — vollständig
 *     (Ringbuffer RAM-only, Listener-Liste, Lampen-Toggle, Modal-Mount,
 *      Click-Handler, BroadcastChannel-Subscription für SW-endpoint-probes)
 *   Sub (a) read() — Skelett (fail-soft Snapshot aus optionalen Quellen)
 *   Sub (b) postMessage-Listener — Skelett (Allowlist-Filter + Sub-(e)-Eintrag,
 *      KEIN Antwort-Pfad — Bedienung wartet auf Spec-Sitzung 15.B)
 *
 * Modul 15 ist NICHT protokoll-aktiv: kein Netz, keine Signatur, kein
 * Embedding, keine Spore-Erzeugung. Sub (e) ist rein beobachtend; KEINE
 * benannten Error-Klassen — alle Fehlerpfade fail-soft mit console.warn.
 *
 * Public surface (registered on window.SbkimMembrane):
 *   init(options?)                                    -> Promise<void>
 *   read()                                            -> Promise<MembraneSnapshot>
 *   fremdzugriff.list()                               -> FremdzugriffEntry[]   (sync, defensive Kopie, älteste zuerst)
 *   fremdzugriff.subscribe(cb)                        -> unsubscribeFn         (sync)
 *   fremdzugriff.clear()                              -> void
 *   fremdzugriff._recordForTest(entry)                -> void                  (Test-Brücke)
 *
 * options-Form (init):
 *   { bufferMax?: number,           // Default MEMBRANE_FREMDZUGRIFF_BUFFER_MAX = 50
 *     lampSelector?: string,        // Default '#lamp-fremd'
 *     mountModal?: boolean,         // Default true
 *     allowedOrigins?: string[] }   // Default [] (alle Cross-Origin → rejected-allowlist)
 *
 * Self-check: emits a console.info line on script load (synchronous,
 * before any call). Siehe INTERFACES.md §1 Modul 15 und
 * docs/components/15_membran.md.
 */
(function (global) {
  "use strict";

  // ---- Konstanten ----
  // Querschnitts-Konstante MEMBRANE_FREMDZUGRIFF_BUFFER_MAX steht in
  // §0 INTERFACES.md. Modul-lokale Konstanten gespiegelt aus Karte 15.

  var MEMBRANE_FREMDZUGRIFF_BUFFER_MAX = 50;
  var AGENT_HINT_MAX_LEN = 64;
  var MEMBRANE_MESSAGE_TYPE = "sbkim/membrane/v1";
  var BROADCAST_CHANNEL_NAME = "sbkim-membrane";
  var SW_PROBE_MESSAGE_TYPE = "SBKIM_MEMBRANE_PROBE";
  var LAMP_PULSE_MS = 600;

  var VALID_KINDS = { "membrane-read": 1, "membrane-postmessage": 1, "endpoint-probe": 1 };
  var VALID_DECISIONS = { "accepted": 1, "ignored": 1, "rejected-allowlist": 1 };

  // ---- Modul-Zustand (Closure) ----

  var ready = false;
  var bufferMax = MEMBRANE_FREMDZUGRIFF_BUFFER_MAX;
  var buffer = [];
  var listeners = [];
  var allowedOrigins = [];
  var lampSelector = "#lamp-fremd";
  var lampElement = null;
  var modalMounted = false;
  var modalRoot = null;
  var modalOpen = false;
  var modalUnsubscribe = null;
  var modalKeydownHandler = null;
  var postMessageListener = null;
  var broadcastChannel = null;

  // ---- Hilfsfunktionen ----

  function nowIso() { return new Date().toISOString(); }

  function warn(message, cause) {
    if (typeof console !== "undefined" && console.warn) {
      if (cause !== undefined) console.warn("[SbkimMembrane] " + message, cause);
      else console.warn("[SbkimMembrane] " + message);
    }
  }

  function safeUserAgentHint() {
    try {
      var nav = global.navigator;
      if (!nav || typeof nav.userAgent !== "string") return null;
      return nav.userAgent.slice(0, AGENT_HINT_MAX_LEN);
    } catch (_e) {
      return null;
    }
  }

  function isValidEntry(entry) {
    if (!entry || typeof entry !== "object") return false;
    if (typeof entry.kind !== "string" || !VALID_KINDS[entry.kind]) return false;
    if (typeof entry.decision !== "string" || !VALID_DECISIONS[entry.decision]) return false;
    return true;
  }

  function normalizeEntry(raw) {
    // Defensive Kopie + Defaults für optionale Felder.
    var entry = {
      at: typeof raw.at === "string" ? raw.at : nowIso(),
      kind: raw.kind,
      origin: typeof raw.origin === "string" ? raw.origin : null,
      agentHint: typeof raw.agentHint === "string" ? raw.agentHint.slice(0, AGENT_HINT_MAX_LEN) : null,
      endpoint: typeof raw.endpoint === "string" ? raw.endpoint : null,
      decision: raw.decision,
      details: raw.details && typeof raw.details === "object" ? raw.details : {},
    };
    return entry;
  }

  // ---- Lampen-Steuerung ----

  function resolveLampElement() {
    if (!lampSelector || typeof lampSelector !== "string") return null;
    try {
      var doc = global.document;
      if (!doc || typeof doc.querySelector !== "function") return null;
      return doc.querySelector(lampSelector);
    } catch (err) {
      warn("lampSelector ist kein gültiger CSS-Selektor: " + lampSelector, err);
      return null;
    }
  }

  function updateLampAlertState() {
    if (!lampElement) return;
    try {
      if (buffer.length > 0) {
        if (!lampElement.classList.contains("fremd-alert")) {
          lampElement.classList.add("fremd-alert");
        }
      } else {
        lampElement.classList.remove("fremd-alert");
      }
    } catch (err) {
      warn("Lampen-Toggle fehlgeschlagen", err);
    }
  }

  function pulseLamp() {
    if (!lampElement) return;
    try {
      lampElement.classList.remove("fremd-pulse");
      // Force reflow, damit die Animation neu startet (analog
      // index.html .traffic-pulse-Pattern).
      void lampElement.offsetWidth;
      lampElement.classList.add("fremd-pulse");
      // Klasse nach Pulse-Dauer wieder abnehmen, damit jeder neue
      // Eintrag erneut pulst.
      setTimeout(function () {
        if (lampElement) {
          try { lampElement.classList.remove("fremd-pulse"); } catch (_e) { /* nb */ }
        }
      }, LAMP_PULSE_MS);
    } catch (err) {
      warn("Lampen-Puls fehlgeschlagen", err);
    }
  }

  // ---- Ringbuffer ----

  function recordEntry(rawEntry) {
    if (!isValidEntry(rawEntry)) {
      warn("Ignoriere ungültigen Eintrag (kind/decision fehlt oder unbekannt).", rawEntry);
      return;
    }
    var entry = normalizeEntry(rawEntry);
    buffer.push(entry);
    if (buffer.length > bufferMax) {
      buffer.splice(0, buffer.length - bufferMax);
    }
    updateLampAlertState();
    pulseLamp();
    notifyListeners(entry);
    notifyModal(entry);
  }

  function notifyListeners(entry) {
    // Defensive Kopie der Listener-Liste, damit Listener-Abmeldung
    // während des Loops keine Schäden anrichtet.
    var snapshot = listeners.slice();
    for (var i = 0; i < snapshot.length; i++) {
      var cb = snapshot[i];
      try {
        cb(entry);
      } catch (err) {
        warn("subscribe-Listener hat geworfen — Throw still verworfen.", err);
      }
    }
  }

  // ---- Öffentliche fremdzugriff-API ----

  function listFremdzugriff() {
    // Defensive Kopie. Modul 15 schützt seinen internen Zustand;
    // Mutation am Rückgabe-Array berührt buffer nicht.
    var copy = new Array(buffer.length);
    for (var i = 0; i < buffer.length; i++) {
      copy[i] = buffer[i];
    }
    return copy;
  }

  function subscribeFremdzugriff(cb) {
    if (typeof cb !== "function") {
      warn("subscribe(cb): cb ist keine Funktion — no-op.");
      return function noopUnsubscribe() { /* no-op */ };
    }
    listeners.push(cb);
    var removed = false;
    return function unsubscribe() {
      if (removed) return;
      removed = true;
      var idx = listeners.indexOf(cb);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }

  function clearFremdzugriff() {
    if (buffer.length === 0) {
      // Lampe trotzdem konsistent halten (falls aus irgendeinem Grund
      // die Klasse hängen geblieben ist).
      updateLampAlertState();
      return;
    }
    buffer.length = 0;
    updateLampAlertState();
    notifyModal(null);
  }

  function recordForTest(entry) {
    recordEntry(entry);
  }

  // ---- Sub (b) postMessage-Listener ----

  function handlePostMessage(event) {
    try {
      var sameOrigin = false;
      try {
        sameOrigin = event.origin === global.location.origin;
      } catch (_e) { /* nb */ }
      if (sameOrigin) return; // Same-Origin gilt nicht als Fremdzugriff (Karte 15 § Fremd-Definition).

      var data = event.data;
      var op = (data && typeof data.op === "string") ? data.op : null;
      var nonce = (data && typeof data.nonce === "string") ? data.nonce : null;
      var type = (data && typeof data.type === "string") ? data.type : null;

      var decision;
      if (allowedOrigins.indexOf(event.origin) < 0) {
        decision = "rejected-allowlist";
      } else if (type !== MEMBRANE_MESSAGE_TYPE) {
        decision = "ignored";
      } else {
        // Allowlist-OK + korrekter Type: Stufe 1 erfasst nur, Bedienung
        // ist Spec-Sitzung 15.B (siehe Karte 15 § Sub (b)). Wir markieren
        // den Eintrag als "ignored", weil keine Antwort gesendet wird —
        // sobald 15.B den Bedien-Pfad spezifiziert, wechselt das auf
        // "accepted".
        decision = "ignored";
      }

      recordEntry({
        kind: "membrane-postmessage",
        origin: typeof event.origin === "string" ? event.origin : null,
        agentHint: safeUserAgentHint(),
        endpoint: null,
        decision: decision,
        details: { op: op, nonce: nonce },
      });
    } catch (err) {
      warn("postMessage-Handler hat geworfen — fail-soft.", err);
    }
  }

  // ---- BroadcastChannel-Subscription für SW-endpoint-probes ----

  function subscribeBroadcastChannel() {
    if (broadcastChannel) return; // idempotent
    if (typeof global.BroadcastChannel !== "function") {
      // Kein Throw — manche Browser (alte Safari-Versionen) haben kein
      // BroadcastChannel; Sub (e) bleibt dann ohne SW-Probe-Pfad
      // (postMessage + read() funktionieren weiterhin).
      return;
    }
    try {
      broadcastChannel = new global.BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannel.addEventListener("message", function (event) {
        try {
          var data = event && event.data;
          if (!data || data.type !== SW_PROBE_MESSAGE_TYPE) return;
          var probeEntry = data.entry;
          if (!probeEntry || typeof probeEntry !== "object") return;
          // SW hat den Eintrag bereits als endpoint-probe geformt; wir
          // erzwingen den kind-Wert defensiv.
          probeEntry.kind = "endpoint-probe";
          recordEntry(probeEntry);
        } catch (err) {
          warn("BroadcastChannel-Message-Handler hat geworfen — fail-soft.", err);
        }
      });
    } catch (err) {
      warn("BroadcastChannel-Subscription fehlgeschlagen — endpoint-probe-Pfad inaktiv.", err);
      broadcastChannel = null;
    }
  }

  // ---- Modal-Mount + Click-Handler ----
  //
  // Eigenständiges Modal in document.body (kein Modul-00-Reuse —
  // Karte 15 § Fremdzugriff-Fenster Wahl-Begründung).

  function mountFremdzugriffModal() {
    if (modalMounted) return;
    var doc = global.document;
    if (!doc || !doc.body) return;

    var root = doc.createElement("div");
    root.id = "sbkim-membran-modal";
    root.setAttribute("aria-hidden", "true");
    root.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:99999",
      "display:none",
      "align-items:center",
      "justify-content:center",
      "font-family:system-ui,sans-serif",
    ].join(";");

    var backdrop = doc.createElement("div");
    backdrop.setAttribute("data-membran-backdrop", "");
    backdrop.style.cssText = [
      "position:absolute",
      "inset:0",
      "background:rgba(0,0,0,0.62)",
    ].join(";");

    var panel = doc.createElement("div");
    panel.style.cssText = [
      "position:relative",
      "background:#10102A",
      "color:#F5F5FF",
      "border:1px solid rgba(255,255,255,0.18)",
      "border-radius:16px",
      "padding:1.2rem 1.4rem",
      "max-width:min(720px, 92vw)",
      "max-height:80vh",
      "overflow:auto",
      "box-shadow:0 24px 64px rgba(0,0,0,0.6)",
    ].join(";");

    var header = doc.createElement("div");
    header.style.cssText = "display:flex;align-items:center;gap:0.8rem;margin-bottom:0.8rem;";

    var title = doc.createElement("h2");
    title.textContent = "Fremdzugriff-Fenster";
    title.style.cssText = "margin:0;font-size:1.1rem;font-weight:600;flex:1;";

    var closeBtn = doc.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("data-membran-close", "");
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", "Schließen");
    closeBtn.style.cssText = [
      "background:transparent",
      "color:#F5F5FF",
      "border:1px solid rgba(255,255,255,0.18)",
      "border-radius:8px",
      "padding:0.25rem 0.6rem",
      "cursor:pointer",
      "font-size:1rem",
    ].join(";");

    header.appendChild(title);
    header.appendChild(closeBtn);

    var summary = doc.createElement("div");
    summary.setAttribute("data-membran-summary", "");
    summary.style.cssText = "display:flex;align-items:center;gap:0.8rem;margin-bottom:0.8rem;font-size:0.86rem;color:rgba(245,245,255,0.78);";

    var count = doc.createElement("span");
    count.setAttribute("data-membran-count", "");
    count.textContent = "0 Einträge im Ringbuffer (max " + bufferMax + ")";

    var clearBtn = doc.createElement("button");
    clearBtn.type = "button";
    clearBtn.setAttribute("data-membran-clear", "");
    clearBtn.textContent = "Aufräumen";
    clearBtn.style.cssText = [
      "background:rgba(220,38,38,0.18)",
      "color:#F5F5FF",
      "border:1px solid rgba(220,38,38,0.45)",
      "border-radius:8px",
      "padding:0.3rem 0.7rem",
      "cursor:pointer",
      "font-size:0.86rem",
    ].join(";");

    summary.appendChild(count);
    summary.appendChild(clearBtn);

    var table = doc.createElement("table");
    table.style.cssText = "width:100%;border-collapse:collapse;font-size:0.8rem;font-family:'Geist Mono',ui-monospace,monospace;";
    table.innerHTML =
      "<thead><tr>" +
      "<th style=\"text-align:left;padding:0.35rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.18);\">Zeit</th>" +
      "<th style=\"text-align:left;padding:0.35rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.18);\">kind</th>" +
      "<th style=\"text-align:left;padding:0.35rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.18);\">origin</th>" +
      "<th style=\"text-align:left;padding:0.35rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.18);\">endpoint</th>" +
      "<th style=\"text-align:left;padding:0.35rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.18);\">decision</th>" +
      "</tr></thead><tbody data-membran-tbody></tbody>";

    var tip = doc.createElement("p");
    tip.style.cssText = "margin:0.9rem 0 0;font-size:0.78rem;color:rgba(245,245,255,0.55);";
    tip.textContent = "Tipp: leere Tabelle = Lampe geht aus.";

    panel.appendChild(header);
    panel.appendChild(summary);
    panel.appendChild(table);
    panel.appendChild(tip);

    root.appendChild(backdrop);
    root.appendChild(panel);
    doc.body.appendChild(root);

    backdrop.addEventListener("click", closeFremdzugriffModal);
    closeBtn.addEventListener("click", closeFremdzugriffModal);
    clearBtn.addEventListener("click", function () {
      clearFremdzugriff();
    });

    modalRoot = root;
    modalMounted = true;
  }

  function renderModalRow(entry) {
    var doc = global.document;
    var tr = doc.createElement("tr");
    var origin = entry.origin === null ? "(lokal)" : entry.origin;
    var endpoint = entry.endpoint === null ? "—" : entry.endpoint;
    tr.innerHTML =
      "<td style=\"padding:0.3rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.06);\"></td>" +
      "<td style=\"padding:0.3rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.06);\"></td>" +
      "<td style=\"padding:0.3rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.06);\"></td>" +
      "<td style=\"padding:0.3rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.06);\"></td>" +
      "<td style=\"padding:0.3rem 0.4rem;border-bottom:1px solid rgba(255,255,255,0.06);\"></td>";
    // textContent statt innerHTML, damit fremde Strings nie als HTML
    // interpretiert werden (origin/endpoint/agentHint kommen aus
    // postMessage und SW-Probe — Vorsicht vor XSS).
    tr.children[0].textContent = entry.at;
    tr.children[1].textContent = entry.kind;
    tr.children[2].textContent = origin;
    tr.children[3].textContent = endpoint;
    tr.children[4].textContent = entry.decision;
    return tr;
  }

  function renderModalContents() {
    if (!modalRoot) return;
    var tbody = modalRoot.querySelector("[data-membran-tbody]");
    var countEl = modalRoot.querySelector("[data-membran-count]");
    if (!tbody || !countEl) return;
    tbody.textContent = "";
    var snapshot = listFremdzugriff();
    for (var i = 0; i < snapshot.length; i++) {
      tbody.appendChild(renderModalRow(snapshot[i]));
    }
    countEl.textContent = snapshot.length + " Einträge im Ringbuffer (max " + bufferMax + ")";
    // Auto-Scroll nach unten — chronologische Lesart (Karte 15
    // § Fremdzugriff-Fenster Bau-Hinweis).
    if (modalRoot.scrollTop !== undefined) {
      modalRoot.scrollTop = modalRoot.scrollHeight;
    }
  }

  function notifyModal(entry) {
    if (!modalOpen || !modalRoot) return;
    if (entry === null) {
      // clear()-Signal — Tabelle leeren, Lampe schon aus.
      renderModalContents();
      return;
    }
    var tbody = modalRoot.querySelector("[data-membran-tbody]");
    var countEl = modalRoot.querySelector("[data-membran-count]");
    if (!tbody || !countEl) return;
    tbody.appendChild(renderModalRow(entry));
    countEl.textContent = buffer.length + " Einträge im Ringbuffer (max " + bufferMax + ")";
  }

  function openFremdzugriffModal() {
    if (!modalMounted) mountFremdzugriffModal();
    if (!modalRoot) return;
    modalRoot.style.display = "flex";
    modalRoot.setAttribute("aria-hidden", "false");
    modalOpen = true;
    renderModalContents();
    // Live-Updates via subscribe — wir benutzen denselben Listener-Pfad,
    // damit der Modal-Re-Render exakt mit dem Buffer mitläuft.
    if (!modalUnsubscribe) {
      modalUnsubscribe = subscribeFremdzugriff(function (_entry) {
        // Re-Render: ein einzelner Eintrag ist schon via notifyModal
        // gerendert. subscribe-Listener nutzen wir hier NICHT für UI-
        // Updates, weil notifyModal das bereits effizient erledigt.
        // Trotzdem registrieren wir den Listener, um Listener-Pfad
        // einheitlich zu prüfen.
      });
    }
    if (!modalKeydownHandler) {
      modalKeydownHandler = function (event) {
        if (event && event.key === "Escape" && modalOpen) {
          closeFremdzugriffModal();
        }
      };
      try { global.document.addEventListener("keydown", modalKeydownHandler); }
      catch (_e) { /* nb */ }
    }
  }

  function closeFremdzugriffModal() {
    if (!modalOpen) return;
    if (modalRoot) {
      modalRoot.style.display = "none";
      modalRoot.setAttribute("aria-hidden", "true");
    }
    modalOpen = false;
    if (modalUnsubscribe) {
      try { modalUnsubscribe(); } catch (_e) { /* nb */ }
      modalUnsubscribe = null;
    }
    if (modalKeydownHandler) {
      try { global.document.removeEventListener("keydown", modalKeydownHandler); }
      catch (_e) { /* nb */ }
      modalKeydownHandler = null;
    }
  }

  // ---- Sub (a) read() — Skelett ----
  //
  // Karte 15 § Sub (a) Anker-Form: protocolVersion, nodeId, domain,
  // sporeUrl, siblings[], storage{quotaWarningLevel, storagePersisted}.
  // Finale Feld-Liste ist Spec-Sitzung 15.B vorbehalten — Bau-Sitzung 15
  // baut nur das Skelett, fail-soft pro Quelle.

  async function readSnapshot() {
    var snapshot = {
      protocolVersion: null,
      nodeId: null,
      domain: null,
      sporeUrl: null,
      siblings: [],
      storage: {
        quotaWarningLevel: "none",
        storagePersisted: null,
      },
    };

    // Spore: nodeId + domain + sporeUrl (fail-soft pro Feld).
    try {
      var spore = global.SbkimSpore;
      if (spore) {
        try {
          if (typeof spore.getNodeId === "function") {
            var nodeId = await spore.getNodeId();
            if (typeof nodeId === "string") snapshot.nodeId = nodeId;
          }
        } catch (_e) { /* nb */ }
        try {
          if (typeof spore.getOwnSpore === "function") {
            var own = await spore.getOwnSpore();
            if (own && typeof own === "object") {
              if (typeof own.protocolVersion === "string") snapshot.protocolVersion = own.protocolVersion;
              if (typeof own.domain === "string") snapshot.domain = own.domain;
              if (typeof own.endpoint === "string") {
                var ep = own.endpoint.replace(/\/+$/, "");
                snapshot.sporeUrl = ep + "/sbkim/spore.json";
              }
            }
          }
        } catch (_e) { /* nb */ }
      }
    } catch (_e) { /* nb */ }

    // Anastomose: siblings ANONYMISIERT (nodeIdHash via base64url-sha256).
    try {
      var anast = global.SbkimAnastomose;
      if (anast && typeof anast.listSiblings === "function") {
        var rows = await anast.listSiblings();
        if (Array.isArray(rows)) {
          var anonymized = [];
          for (var i = 0; i < rows.length; i++) {
            var sib = rows[i];
            if (!sib || typeof sib.nodeId !== "string") continue;
            try {
              var hash = await hashNodeIdToBase64url(sib.nodeId);
              anonymized.push({
                nodeIdHash: hash,
                since: typeof sib.since === "string" ? sib.since : null,
                status: typeof sib.status === "string" ? sib.status : null,
              });
            } catch (_e) { /* nb — Hash schlug fehl, Eintrag überspringen */ }
          }
          snapshot.siblings = anonymized;
        }
      }
    } catch (_e) { /* nb */ }

    // Storage._meta.storagePersisted: Modul-01-Getter, fail-soft.
    try {
      var storage = global.SbkimStorage;
      if (storage && storage._meta && Object.prototype.hasOwnProperty.call(storage._meta, "storagePersisted")) {
        var persisted = storage._meta.storagePersisted;
        if (typeof persisted === "boolean" || persisted === null) {
          snapshot.storage.storagePersisted = persisted;
        }
      }
    } catch (_e) { /* nb */ }

    // Quota: navigator.storage.estimate() → grob in "none"/"ratio"/"bytes"/"both".
    try {
      var nav = global.navigator;
      if (nav && nav.storage && typeof nav.storage.estimate === "function") {
        var est = await nav.storage.estimate();
        snapshot.storage.quotaWarningLevel = computeQuotaWarningLevel(est);
      }
    } catch (_e) { /* nb */ }

    // Sub-(e)-Hook: jeder read() schreibt einen Eintrag (Karte 15
    // § Architektur-Trennung Detektions-Schicht Pfad 1).
    recordEntry({
      kind: "membrane-read",
      origin: null,
      agentHint: safeUserAgentHint(),
      endpoint: null,
      decision: "accepted",
      details: { fieldsRequested: null },
    });

    return snapshot;
  }

  // Quota-Schwellen-Mapping analog Modul 00 § getStatusSnapshot.
  // Doppelschwelle: ratio > 80 % ODER freeBytes < 50 MiB.
  function computeQuotaWarningLevel(est) {
    if (!est || typeof est !== "object") return "none";
    var usage = typeof est.usage === "number" ? est.usage : 0;
    var quota = typeof est.quota === "number" ? est.quota : 0;
    if (quota <= 0) return "none";
    var ratioOver = (usage / quota) > 0.8;
    var bytesLow = (quota - usage) < (50 * 1024 * 1024);
    if (ratioOver && bytesLow) return "both";
    if (ratioOver) return "ratio";
    if (bytesLow) return "bytes";
    return "none";
  }

  // base64url-sha256 (Modul-02-Pattern); Web-Crypto fail-soft.
  async function hashNodeIdToBase64url(nodeId) {
    if (!global.crypto || !global.crypto.subtle || typeof TextEncoder !== "function") {
      throw new Error("WebCrypto nicht verfügbar");
    }
    var bytes = new TextEncoder().encode(nodeId);
    var hashBuf = await global.crypto.subtle.digest("SHA-256", bytes);
    var arr = new Uint8Array(hashBuf);
    var bin = "";
    for (var i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
    var b64 = global.btoa(bin);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // ---- init() ----

  async function init(options) {
    // Optionen
    var opts = (options && typeof options === "object") ? options : {};
    if (typeof opts.bufferMax === "number" && opts.bufferMax > 0) {
      bufferMax = opts.bufferMax;
      // Falls bestehender Buffer größer als neue Grenze — verdrängen.
      if (buffer.length > bufferMax) {
        buffer.splice(0, buffer.length - bufferMax);
      }
    }
    if (typeof opts.lampSelector === "string" && opts.lampSelector.length > 0) {
      lampSelector = opts.lampSelector;
    }
    if (Array.isArray(opts.allowedOrigins)) {
      allowedOrigins = opts.allowedOrigins.filter(function (o) { return typeof o === "string"; });
    }
    var mountModal = opts.mountModal !== false; // default true

    if (ready) {
      // Idempotenz: lampSelector neu auflösen falls Page-DOM inzwischen
      // vorhanden ist. Listener werden NICHT doppelt registriert.
      var maybeLamp = resolveLampElement();
      if (maybeLamp) {
        lampElement = maybeLamp;
        updateLampAlertState();
      }
      return;
    }

    // Lampen-Element auflösen (kein Throw bei Miss — re-try beim DOMContentLoaded).
    lampElement = resolveLampElement();
    if (!lampElement) {
      var doc = global.document;
      if (doc && typeof doc.addEventListener === "function" && doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", function () {
          lampElement = resolveLampElement();
          updateLampAlertState();
          if (mountModal && !modalMounted) mountFremdzugriffModal();
          attachLampClickHandler();
        }, { once: true });
      } else {
        warn("lampSelector matcht aktuell kein Element: " + lampSelector + " (Lampen-Toggle übersprungen).");
      }
    } else {
      updateLampAlertState();
    }

    // Modal-Mount + Click-Handler (default true).
    if (mountModal) {
      try { mountFremdzugriffModal(); } catch (err) { warn("Modal-Mount fehlgeschlagen", err); }
    }
    attachLampClickHandler();

    // postMessage-Listener (Sub (b) Skelett).
    try {
      postMessageListener = handlePostMessage;
      global.addEventListener("message", postMessageListener);
    } catch (err) {
      warn("postMessage-Listener-Registrierung fehlgeschlagen", err);
    }

    // BroadcastChannel für SW-endpoint-probes (Sub (e) Pfad 3).
    subscribeBroadcastChannel();

    ready = true;
  }

  function attachLampClickHandler() {
    if (!lampElement) return;
    if (lampElement.__sbkimMembranClickAttached) return;
    try {
      lampElement.addEventListener("click", function () {
        if (modalOpen) closeFremdzugriffModal();
        else openFremdzugriffModal();
      });
      lampElement.style.cursor = "pointer";
      lampElement.__sbkimMembranClickAttached = true;
    } catch (err) {
      warn("Lampen-Click-Handler konnte nicht registriert werden.", err);
    }
  }

  // ---- public surface ----

  var SbkimMembrane = {
    init: init,
    read: readSnapshot,
    fremdzugriff: {
      list: listFremdzugriff,
      subscribe: subscribeFremdzugriff,
      clear: clearFremdzugriff,
      _recordForTest: recordForTest,
    },
    _meta: {
      bufferMax: MEMBRANE_FREMDZUGRIFF_BUFFER_MAX,
      agentHintMaxLen: AGENT_HINT_MAX_LEN,
      messageType: MEMBRANE_MESSAGE_TYPE,
      broadcastChannelName: BROADCAST_CHANNEL_NAME,
      swProbeMessageType: SW_PROBE_MESSAGE_TYPE,
      get bufferLength() { return buffer.length; },
      get listenerCount() { return listeners.length; },
      get modalMounted() { return modalMounted; },
      get modalOpen() { return modalOpen; },
      get ready() { return ready; },
      get allowedOrigins() { return allowedOrigins.slice(); },
    },
  };

  global.SbkimMembrane = SbkimMembrane;

  // Self-check (synchron, beim Skript-Laden — vor jedem Aufruf).
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 15 MEMBRAN bereit, Funktionen: init/read/fremdzugriff.{list,subscribe,clear,_recordForTest}",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
