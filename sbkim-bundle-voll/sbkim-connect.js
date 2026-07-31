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
 *     // optional: sampleContent: async () => [ "Inhalt 1", {label, text}, … ]
 *     //           — liefert echte lokale Inhalts-Schnipsel; der domainVector
 *     //           entsteht dann INHALTS-TREU (Modul 03 embedContentVector)
 *     //           statt aus der Selbstbeschreibung. Fail-soft Fallback auf
 *     //           die Beschreibung, wenn leer/Fehler. NUR unkritische, nicht-
 *     //           personenbezogene Labels sampeln (kein PII, keine Geheimnisse).
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

      // Inhalts-treuer Domänen-Vektor (2026-06-28): wenn die App einen
      // sampleContent()-Callback mitgibt (liefert echte lokale Inhalts-
      // Schnipsel — Rezepte / Cocktails / unkritische Fach-Labels), entscheidet
      // der INHALT statt der Selbstbeschreibung („Hülle"). Fail-soft: kein
      // Callback / keine Inhalte / Fehler → Fallback auf den Beschreibungs-
      // Vektor (leerer/neuer Knoten). embeddingSource markiert, was passierte.
      var vec = null;
      var source = "description";
      if (typeof cfg.sampleContent === "function") {
        try {
          var samples = await cfg.sampleContent();
          if (Array.isArray(samples) && samples.length &&
              typeof global.SbkimEmbedding.embedContentVector === "function") {
            var res = await global.SbkimEmbedding.embedContentVector(samples);
            if (res && res.vector) { vec = res.vector; source = "content"; }
          }
        } catch (e) { warn("sampleContent/embedContentVector — Fallback auf Beschreibung", e); }
      }
      if (!vec) {
        var passage = desc + (kw.length ? ". " + kw.join(", ") : "");
        vec = await global.SbkimEmbedding.embedPassage(passage);
        source = "description";
      }

      await global.SbkimSpore.generateOwnSpore({
        domain: cfg.domain || cfg.endpoint || "sbkim-knoten",
        endpoint: cfg.endpoint || "",
        nodeType: cfg.nodeType || "hybrid",
        nodeName: cfg.nodeName || "SBKIM-Knoten",
        domainDescription: desc,
        domainKeywords: kw,
        domainVector: Array.from(vec),
        embeddingSource: source,
        embeddingVersion: 1,
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
