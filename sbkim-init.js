/*
 * SBKIM — Sage-Page Init-Kette (Bau Sage-Page-Refactor 2026-05-21).
 *
 * Volle init()-Kette aller SBKIM-Module für die Sage-Page als dritter
 * Endknoten (Brief 01 V1-Sage-Hybrid). Reihenfolge analog Karte 09
 * § Schritt 2 — Modul 03 (Embedding) wird lazy geladen, d.h. nicht
 * im Boot, sondern erst beim ersten `embedPassage()`-Aufruf des
 * Andock-Wizards.
 *
 * Fail-soft pro Modul: ein fehlschlagender init() bricht die Kette
 * NICHT — `console.warn`, Sage-Page bleibt als Doku-Hub ladbar (Klaus'
 * primärer Use-Case). Volle Andockbarkeit setzt aber alle init()s grün
 * voraus.
 *
 * IndexedDB-Suffix `sbkim_sage` (Brief § IndexedDB-Suffix + INTERFACES
 * § 6.1) — analog `sbkim_rezeptbuch` / `sbkim_mixarium`, keine Origin-
 * Kollision wenn Sage-Page parallel zu den anderen Endknoten installiert.
 *
 * Service-Worker: Variante 3a (Sage-Page-Root `sbkim-sw.js`, kein App-SW
 * vorhanden). Registrierung erfolgt am Ende der Kette.
 */
(function () {
  "use strict";

  var DB_SUFFIX = "sage";
  var SAGE_INIT_FLAG = "__sbkimSageInitDone";

  function warn(modul, err) {
    if (typeof console !== "undefined" && console.warn) {
      console.warn(
        "SBKIM-Sage-Init: " + modul + " fehlgeschlagen — Sage-Page bleibt " +
          "als Doku-Hub ladbar, aber Andock-Wizard-Pfad ist degradiert. " +
          (err && err.message ? err.message : err),
      );
    }
  }

  function info(msg) {
    if (typeof console !== "undefined" && console.info) {
      console.info("SBKIM-Sage-Init: " + msg);
    }
  }

  async function initModule(name, fn) {
    if (typeof fn !== "function") {
      warn(name, new Error(name + " nicht auf window — script-Tag fehlt?"));
      return false;
    }
    try {
      await fn();
      return true;
    } catch (err) {
      warn(name, err);
      return false;
    }
  }

  // Lazy-Korpus-Builder für das Such-Widget (Modul 22). Nimmt die rohen
  // Korpus-Einträge (window.SAGE_SUCHKORPUS, {label,text,anchorId}) und erzeugt
  // pro Eintrag einen passageVec via Modul 03 (embedPassageBatch — löst den
  // einmaligen Modell-Download aus). Wird vom Widget beim ersten Gebrauch
  // gerufen (prepareCorpus). Fail-soft: wirft, wenn Modul 03 oder der Korpus
  // fehlt — das Widget fängt das ab und zeigt einen Hinweis (kein Page-Bruch).
  async function sageBuildSuchkorpus() {
    var raw = window.SAGE_SUCHKORPUS || [];
    if (!raw.length) {
      throw new Error("SAGE_SUCHKORPUS leer oder nicht geladen (sbkim/sage-suchkorpus.js?).");
    }
    var embedding = window.SbkimEmbedding;
    if (!embedding || typeof embedding.embedPassageBatch !== "function") {
      throw new Error("Modul 03 (Embedding) nicht geladen — Suchindex kann nicht gebaut werden.");
    }
    var texts = raw.map(function (e) { return e.text; });
    var vecs = await embedding.embedPassageBatch(texts);
    return raw.map(function (e, i) {
      return { label: e.label, text: e.text, anchorId: e.anchorId, nodeId: e.nodeId || null, passageVec: vecs[i] };
    });
  }

  // Lazy-Builder für den Knoten-Bereich (verbundene Mycel-Knoten). Analog zum
  // App-Korpus, Quelle window.SAGE_KNOTEN_KORPUS. Rein lokale Daten (bekannte
  // Nachbar-Sporen) — keine Netz-Anfrage.
  async function sageBuildKnotenKorpus() {
    var raw = window.SAGE_KNOTEN_KORPUS || [];
    if (!raw.length) {
      throw new Error("SAGE_KNOTEN_KORPUS leer oder nicht geladen (sbkim/sage-knoten-korpus.js?).");
    }
    var embedding = window.SbkimEmbedding;
    if (!embedding || typeof embedding.embedPassageBatch !== "function") {
      throw new Error("Modul 03 (Embedding) nicht geladen — Knoten-Index kann nicht gebaut werden.");
    }
    var texts = raw.map(function (e) { return e.text; });
    var vecs = await embedding.embedPassageBatch(texts);
    return raw.map(function (e, i) {
      return { label: e.label, text: e.text, anchorId: e.anchorId, nodeId: e.nodeId || null, passageVec: vecs[i] };
    });
  }

  // Live-Cross-Knoten-Frage übers Relais (Bau Query-über-Relais 2026-06-28).
  // Wird Modul 22 als options.queryNode übergeben: der Knoten-Bereich des
  // Such-Widgets fragt den top-rangierten Nachbarn LIVE übers Brett und mischt
  // dessen echte Inhalts-Treffer dazu. BEWUSSTE Nutzer-Aktion (Suche = Pilz-
  // Schicht-Egress), kein Crawler. Fail-soft: ohne Modul 05/Relais oder bei
  // Timeout → leere Liste, der lokale Knoten-Spiegel-Treffer bleibt.
  async function sageQueryNode(nodeId, text) {
    try {
      if (!window.SbkimAnastomose || typeof window.SbkimAnastomose.queryNostr !== "function") return [];
      // 5 min OBERGRENZE: die Frist löst SOFORT aus, sobald die Antwort kommt —
      // sie hängt nur so lange, wie der Nachbar wirklich braucht. Aus Erfahrung
      // dauert das erste, KALTE Laden des Embedding-Modells (~30 MB, einmalig
      // pro Gerät/Browser, danach gecacht) realistisch bis zu ~5 min auf dem
      // Tablet. Danach (warm) kommt die Antwort in Sekunden. Fail-soft bleibt.
      var res = await window.SbkimAnastomose.queryNostr(nodeId, text, { timeoutMs: 300000 });
      if (res && res.outcome === "answered" && Array.isArray(res.results)) return res.results;
      return [];
    } catch (e) {
      return [];
    }
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      warn("ServiceWorker", new Error("navigator.serviceWorker fehlt — Browser zu alt."));
      return;
    }
    try {
      var reg = await navigator.serviceWorker.register("sbkim-sw.js");
      info("Service-Worker registriert, Scope: " + reg.scope);
    } catch (err) {
      warn("ServiceWorker.register", err);
    }
  }

  async function runInitChain() {
    if (window[SAGE_INIT_FLAG]) return;
    window[SAGE_INIT_FLAG] = true;

    // 01 Storage — Pflicht-Erstes, weil alle anderen Module darauf bauen.
    var storageOk = await initModule("SbkimStorage", function () {
      return window.SbkimStorage && window.SbkimStorage.init({ dbSuffix: DB_SUFFIX });
    });
    if (!storageOk) {
      warn("Sage-Init", new Error("Modul 01 Storage nicht initialisiert — Folge-Module übersprungen."));
      return;
    }

    // 02 Spore — Identitäts-Schicht. KEIN getOrCreateIdentity hier;
    // der Andock-Wizard ruft das explizit auf Klaus' Klick, damit das
    // Erst-Andocken sichtbar ist (UX-Pflicht aus Brief § Andock-Geste).
    await initModule("SbkimSpore", function () {
      return window.SbkimSpore && window.SbkimSpore.init();
    });

    // 03 Embedding bewusst NICHT — lazy, ~30 MB Modell-Download wird
    // erst beim ersten Andock-Klick im Wizard ausgelöst.

    // 05 Anastomose — registriert SW-Message-Listener + BroadcastChannel-
    // Bridge. Setzt 02 voraus.
    await initModule("SbkimAnastomose", function () {
      return window.SbkimAnastomose && window.SbkimAnastomose.init();
    });

    // 05b Relais — Auto-Lauschen am Nostr-Relais beim Öffnen (Klaus 2026-06-27:
    // „Lauschen in allen Repos"). Empfangsmodus MIT Antwortrecht: der Knoten hört
    // auf eingehende Handshakes und ANTWORTET nur; er initiiert NIE von sich aus
    // (kein Crawler, keine Eigenanfrage). Nicht-blockierend + fail-soft: ohne
    // Relais-Client (05b, type=module) oder bei Netz-Fehler passiert nichts.
    // Echter Verkehr sichtbar machen: bei jedem Handschlag (sbkim:handshake)
    // die Navleisten-Lampe „verkehr" kurz pulsen lassen — nicht nur bei
    // status.json-Abrufen. So zeigt die Lampe ehrlich an, wenn wirklich ein
    // Cross-Knoten-Handschlag passiert ist. Einmalig registriert, fail-soft.
    try {
      window.addEventListener("sbkim:handshake", function () {
        try {
          var t = document.getElementById("lamp-traffic");
          if (!t) return;
          t.classList.remove("traffic-pulse");
          void t.offsetWidth; // reflow -> Animation neu starten
          t.classList.add("traffic-pulse");
        } catch (e) {}
      });
    } catch (e) {}

    if (window.SbkimAnastomose && typeof window.SbkimAnastomose.listenNostr === "function" && window.SbkimNostrRelay) {
      try {
        window.SbkimAnastomose.listenNostr()
          .then(function () {
            info("Auto-Lauschen aktiv (Empfangsmodus mit Antwortrecht).");
            // Sichtbar machen: kanonisches Event (Modul 17 Floating-Widget) +
            // Sage-Navleisten-Lampe „verkehr" ruhig grün (= am Relais verbunden,
            // lauscht). Beides fail-soft.
            try { window.dispatchEvent(new CustomEvent("sbkim:nostr-listening", { detail: { active: true } })); } catch (e) {}
            try {
              var lt = document.getElementById("lamp-traffic");
              if (lt) {
                lt.classList.add("alive");
                lt.title = "Verkehr — grün: am Relais verbunden, lauscht (Empfangsmodus, antwortet nur). Pulst bei echtem Verkehr.";
              }
            } catch (e) {}
          })
          .catch(function (e) { warn("Auto-Lauschen", e); });
      } catch (e) { warn("Auto-Lauschen", e); }
    }

    // 06 Heterokaryose.
    await initModule("SbkimHeterokaryose", function () {
      return window.SbkimHeterokaryose && window.SbkimHeterokaryose.init();
    });

    // 07 Apoptose — Vermächtnis-Empfang.
    await initModule("SbkimApoptose", function () {
      return window.SbkimApoptose && window.SbkimApoptose.init();
    });

    // 08 UI-Demo — Outbox-Pflege.
    await initModule("SbkimUiDemo", function () {
      return window.SbkimUiDemo && window.SbkimUiDemo.init();
    });

    // 15 Membran — Fremdzugriff-Detektor + Navleisten-Lampe (Sub (e)).
    // Sub (e) hat KEINE Pflicht-Modul-Abhängigkeiten (Karte 15 § Nutzt) —
    // Buffer + Lampe + Modal laufen auch ohne Storage/Spore. Sub (a)
    // read() liest Spore/Anastomose/Storage fail-soft.
    await initModule("SbkimMembrane", function () {
      return window.SbkimMembrane && window.SbkimMembrane.init({
        lampSelector: "#lamp-fremd",
        // Sage-Page-only Sichttest-Knopf im Fremdzugriff-Modal (Pflege
        // 2026-05-24). Endknoten setzen das NICHT — der Knopf erscheint
        // ausschließlich in der Sage-Page für Klaus' Lampen-Sichttest,
        // weil die drei Endknoten same-origin sind und ein echter
        // Cross-Origin-Trigger schwer reproduzierbar ist.
        enableTestButton: true,
      });
    });

    // 16 SBKIM-Siegel — Self-Inscribing-Selbst-Zertifikat. Surface-Check
    // gegen sieben Pflicht-Module (01/02/03/04/05/07/15); Modul 03 ist
    // `lazy:true` (Sage-Page-spezifisch, ~30 MB Modell), Status
    // "deferred" gilt als bestanden. Option β: badgeSelector zeigt auf
    // den `.lamps`-Container, Badge-Span wird darin als vierte Plakette
    // nach #lamp-fremd erzeugt — und zwar NUR wenn `isCertified()===true`
    // (Anti-Greenwashing-Klausel binär). repoUrl bleibt Auto-Erkennung:
    // `https://lausiklauskn-png.github.io/Sage-Protokol/`.
    //
    // andockTool:true (2026-06-20, Klaus): optionaler „🔌 Fremden Knoten
    // andocken"-Knopf im Siegel-Modal — KI-unabhängiger Handshake über den
    // Modul-18-Wizard (SbkimToolPwa.openAndockTab, unten initialisiert).
    // Der „🔑"-Identitäts-Pfad bleibt daneben unberührt (zwei Richtungen:
    // 🔑 = eigene Spore erzeugen, 🔌 = fremden Knoten verbinden).
    await initModule("SbkimSiegel", function () {
      return window.SbkimSiegel && window.SbkimSiegel.init({
        badgeSelector: ".lamps",
        andockTool: true,
        // Explizit, weil Sages Band die Marke „SAGE OBSERVATORIUM" trägt —
        // ohne diesen Wert würde die neue Auto-Ableitung den Repo-Namen
        // („SAGE-PROTOKOL") ins Band schreiben. Forker OHNE ribbonText
        // bekommen automatisch ihren eigenen Repo-/Pages-Namen.
        ribbonText: "SAGE OBSERVATORIUM",
      });
    });

    // 18 Tool-PWA (Sub a Vorab) — Andock-Wizard für SIEGEL-Bronze-Klick.
    // Pflege 2026-05-28 (Sage-Page-init-Modul-18): Sage ist Hybrid-Endknoten
    // (spore.json `nodeType:"hybrid"`), Modul 18 muss daher auch hier
    // initialisiert sein, sonst wirft `openAndockTab()` ToolPwaNotReadyError
    // beim Bronze-Klick. Werte aus eigener Sage-spore.json (domain
    // „Mycel-Bibliothek", sechs Domain-Stichworte). externalHubUrl
    // weggelassen — Read-Anker für Sub (i) Spore-Discovery.
    await initModule("SbkimToolPwa", function () {
      return window.SbkimToolPwa && window.SbkimToolPwa.init({
        endpoint:       "https://lausiklauskn-png.github.io/Sage-Protokol/",
        domain:         "Mycel-Bibliothek",
        domainKeywords: [
          "SBKIM-Glossar",
          "Mycel-Vokabular",
          "Protokoll-Doku",
          "Heilige Tafeln",
          "Karten",
          "Schwesternetz-Beobachtungen",
        ],
        stammCategories: [
          "Protokoll-Doku",
          "Mycel-Vokabular",
          "Heilige Tafeln",
          "Karten",
          "INTERFACES",
          "ARCHITEKTUR",
        ],
        guestCategories: [
          "Glossar-Wartung",
          "Schwesternetz-Beobachtungen",
          "Sitzungs-Briefe",
          "Übergabeprotokolle",
        ],
        repoUrl: "https://github.com/lausiklauskn-png/Sage-Protokol",
      });
    });

    // 00 Doku-Fenster zuletzt — liest die anderen Module als optionale
    // Quellen. Sage-Page hat aktuell KEIN sichtbares Such-Symbol (das ist
    // ein Endknoten-PWA-UI-Element). Wir versuchen mehrere Selektoren;
    // wenn keiner trifft, läuft Modul 00 trotzdem (MutationObserver-Re-Try
    // gibt nach 10 s auf). Andock-Wizard ist Sage-spezifischer Eingang.
    await initModule("SbkimDoku", function () {
      return window.SbkimDoku && window.SbkimDoku.init({
        searchIconSelector: "#sage-search-icon",
      });
    });

    // 22 Such-Widget — frei bewegliches Floating-Such-Tool (Bau 22, Klaus'
    // Vision 2026-06-21). Self-mountet die 🔍-Blase unten rechts; klein im
    // Ruhezustand, wächst nur bei Interaktion. Korpus = SBKIM-Werkzeug-
    // Bibliothek (window.SAGE_SUCHKORPUS, Module 00–22). LAZY: die Vektoren
    // werden erst beim ersten Gebrauch via Modul 03 erzeugt (prepareCorpus),
    // damit der Seitenstart leicht bleibt (kein ~30-MB-Modell im Boot). EU-
    // Politik "frei" (EU wählbar). KEIN Richter-Schlüssel hier — reiner
    // lokaler Vorfilter (server-los); ein Endknoten mit BYOK-Schlüssel
    // reicht ihn über init({apiKey}) durch.
    await initModule("SbkimSearchWidget", function () {
      if (!window.SbkimSearchWidget) return false;
      return window.SbkimSearchWidget.init({
        euPolicy: "frei",
        queryLabel: "Sage",
        prepareCorpus: sageBuildSuchkorpus,       // App-Bereich = Werkzeug-Bibliothek
        prepareNodeCorpus: sageBuildKnotenKorpus, // Knoten-Bereich = verbundene Knoten
        queryNode: sageQueryNode,                 // Knoten-Bereich LIVE übers Relais (Modul 05 queryNostr)
        // Richter Default aus (gratis). Internet-Bereich: ohne SearXNG-URL
        // = neuer Tab; Klaus kann später eine eigene Instanz eintragen.
      });
    });

    // Service-Worker zum Schluss — Page-Brücke + same-origin BroadcastChannel
    // sind schon registriert, der SW fängt nur eingehende HTTP-POSTs ab.
    await registerServiceWorker();

    info("Init-Kette abgeschlossen (dbSuffix=" + DB_SUFFIX + ").");

    // Custom-Event für die Sage-Page-spezifische Logik (Andock-Wizard,
    // Schichten-Lampen-Refresh, Identitäts-Wechsler) — sie hören darauf
    // statt selbst zu pollen.
    try {
      window.dispatchEvent(new CustomEvent("sbkim-sage-ready"));
    } catch (_e) { /* nb */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInitChain, { once: true });
  } else {
    runInitChain();
  }
})();
