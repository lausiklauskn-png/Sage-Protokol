/*
 * SBKIM-Verbinden-Bundle — sbkim-connect.js (Ein-Aufruf-Glue)
 *
 * Macht aus „eine PWA ins Mycel bringen" einen EINZIGEN Aufruf. Statt pro App
 * eine eigene sbkim-init.js zu schreiben, lädt die App die Bundle-Module (siehe
 * README) und ruft genau einmal:
 *
 *   SbkimConnect.init({
 *     dbSuffix:          "meineapp",          // eigener IndexedDB-Suffix (Pflicht-empfohlen)
 *     nodeName:          "Meine App",         // Anzeigename der Visitenkarte im Raum
 *     endpoint:          "https://.../",       // öffentliche URL der App
 *     domain:            "meine-domaene",     // kurzer Domänen-Schlüssel
 *     domainDescription: "Was die App ist …", // 3–8 Sätze, je konkreter desto besser
 *     domainKeywords:    ["Stichwort", "…"],  // Themen/Stichworte
 *     // optional: stammCategories, guestCategories, nodeType ("hybrid"),
 *     //           corner ("bl"|"br"|"tl"|"tr"), allowedOrigins:[…]
 *   });
 *
 * Was init() tut (alles fail-soft, nichts wirft):
 *   1. Storage (01) initialisieren.
 *   2. Spore (02) bereitstellen — erzeugt KEINE Identität beim Laden.
 *   3. Anastomose (05) initialisieren (Handshake-Empfänger).
 *   4. Auto-Lauschen am Nostr-Relais (Empfangsmodus MIT Antwortrecht): der
 *      Knoten antwortet nur auf eingehende Handshakes, initiiert NIE von selbst
 *      (kein Crawler, keine Pulsation). Wartet kurz auf das deferred 05b-Modul.
 *   5. Öffentlicher Rendezvous-Knopf „🌐 Mit dem Netz verbinden" (Modul 23 UI),
 *      UNABHÄNGIG von der Init-Kette gemountet (soll immer sichtbar sein). Der
 *      Knopf erzeugt die Identität bei Bedarf selbst (createIdentity aus deiner
 *      Konfig: Modul 03 Embedding + Modul 02 generateOwnSpore).
 *
 * Verfassungstreu: alle Netz-Aktionen sind NUTZER-AUSGELÖST (Knöpfe). init()
 * baut keine Verbindung auf außer dem Empfangsmodus-Lauschen.
 *
 * Identität & Schlüssel bleiben lokal (IndexedDB); nur die ÖFFENTLICHE Spore
 * (Visitenkarte) erscheint im Raum. Kein PII, nichts verlässt das Gerät außer
 * der öffentlichen Spore + den Handshake-Hüllen.
 *
 * Public surface: window.SbkimConnect = { init(config) -> Promise<void>, _meta }
 */
(function (global) {
  "use strict";

  var VERSION = "0.1";

  function info(m) { try { if (global.console && console.info) console.info("[SBKIM-Connect] " + m); } catch (e) {} }
  function warn(m, e) { try { if (global.console && console.warn) console.warn("[SBKIM-Connect] " + m, e || ""); } catch (_e) {} }

  // App-eigener Identitäts-Erzeuger, aus der Konfig gebaut — wird dem
  // Rendezvous-Knopf als createIdentity übergeben. Erst beim ersten „Verbinden"
  // aufgerufen (lädt dann Modul 03, ~30 MB Modell einmalig).
  function buildCreateIdentity(cfg) {
    return async function () {
      if (!global.SbkimEmbedding || !global.SbkimSpore) {
        throw new Error("Module 02/03 nicht geladen — Identität kann nicht erzeugt werden.");
      }
      await global.SbkimEmbedding.init();
      var desc = (typeof cfg.domainDescription === "string" && cfg.domainDescription.length)
        ? cfg.domainDescription
        : ((cfg.nodeName || "SBKIM-Knoten") + " — ein Knoten im SBKIM-Mycel.");
      var kw = Array.isArray(cfg.domainKeywords) ? cfg.domainKeywords : [];
      var passage = desc + (kw.length ? ". " + kw.join(", ") : "");
      var vec = await global.SbkimEmbedding.embedPassage(passage);
      await global.SbkimSpore.generateOwnSpore({
        domain: cfg.domain || cfg.endpoint || "sbkim-knoten",
        endpoint: cfg.endpoint || "",
        nodeType: cfg.nodeType || "hybrid",
        nodeName: cfg.nodeName || "SBKIM-Knoten",
        domainDescription: desc,
        domainKeywords: kw,
        domainVector: Array.from(vec),
        stammCategories: cfg.stammCategories,
        guestCategories: cfg.guestCategories,
      });
    };
  }

  async function init(cfg) {
    cfg = (cfg && typeof cfg === "object") ? cfg : {};
    if (!global.SbkimStorage) {
      warn("SBKIM-Module nicht geladen — Andock übersprungen (Script-Tags prüfen, siehe README).");
      return;
    }

    try {
      await global.SbkimStorage.init(cfg.dbSuffix ? { dbSuffix: cfg.dbSuffix } : undefined);
    } catch (e) { warn("Storage.init", e); }

    try { if (global.SbkimSpore && global.SbkimSpore.init) await global.SbkimSpore.init(); } catch (e) { warn("Spore.init", e); }

    try {
      if (global.SbkimAnastomose && global.SbkimAnastomose.init) await global.SbkimAnastomose.init();
    } catch (e) { warn("Anastomose.init", e); }

    // Auto-Lauschen (Empfangsmodus): kurz auf das deferred 05b-Modul warten
    // (type=module wird nach den klassischen Skripten ausgeführt). Nicht-
    // blockierend + fail-soft: ohne Relais-Client passiert schlicht nichts.
    (async function () {
      for (var i = 0; i < 25 && !global.SbkimNostrRelay; i++) {
        await new Promise(function (r) { setTimeout(r, 80); });
      }
      if (global.SbkimAnastomose &&
          typeof global.SbkimAnastomose.listenNostr === "function" &&
          global.SbkimNostrRelay) {
        try {
          global.SbkimAnastomose.listenNostr()
            .then(function () {
              info("Auto-Lauschen aktiv (Empfangsmodus mit Antwortrecht).");
              try { global.dispatchEvent(new global.CustomEvent("sbkim:nostr-listening", { detail: { active: true } })); } catch (e) {}
            })
            .catch(function (e) { warn("Auto-Lauschen übersprungen", e); });
        } catch (e) { warn("Auto-Lauschen übersprungen", e); }
      }
    })();

    // Öffentlicher Rendezvous-Knopf — UNABHÄNGIG von der Init-Kette gemountet
    // (Klaus' Festlegung: sofort öffentlich, eigener kleiner Floating-Knopf;
    // soll immer erscheinen, auch wenn die Kette oben mal stolpert).
    if (global.SbkimRendezvousUI) {
      try {
        global.SbkimRendezvousUI.init({
          nodeName: cfg.nodeName || "SBKIM-Knoten",
          corner: cfg.corner || "bl",
          createIdentity: buildCreateIdentity(cfg),
        });
        info("Rendezvous-UI gemountet (öffentlicher 🌐-Knopf).");
      } catch (e) { warn("Rendezvous-UI", e); }
    } else {
      warn("SbkimRendezvousUI nicht geladen — 23_rendezvous_ui.js fehlt? (siehe README)");
    }

    info("Andock bereit (nodeName=" + (cfg.nodeName || "?") + ").");
  }

  global.SbkimConnect = {
    init: init,
    _meta: { version: VERSION },
  };

  if (global.console && console.info) {
    console.info("SBKIM-CONNECT bereit — SbkimConnect.init({ nodeName, endpoint, domain, domainDescription, domainKeywords, … }).");
  }
})(typeof window !== "undefined" ? window : globalThis);
