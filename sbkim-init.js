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

  // Ein Skript NACH dem Laden holen, statt es in den kritischen Pfad zu stellen.
  // Wartet auf eine Ruhepause — oder auf die erste Berührung/Taste/Rollbewegung,
  // je nachdem, was zuerst kommt. Wer die Seite sofort benutzt, wartet also
  // nicht auf die Ruhepause; wer nur liest, bekommt den Text früher.
  // Fail-soft: schlägt der Abruf fehl, geht es ohne das Modul weiter.
  function ladeSpaeter(pfad, globalName) {
    if (globalName && window[globalName]) return Promise.resolve(true);
    return new Promise(function (fertig) {
      var los = false;
      function starten() {
        if (los) return; los = true;
        ["pointerdown", "keydown", "scroll"].forEach(function (e) {
          window.removeEventListener(e, starten, true);
        });
        var s = document.createElement("script");
        s.src = pfad;
        s.async = true;
        s.onload  = function () { fertig(true); };
        s.onerror = function () { warn(globalName || pfad, new Error("konnte " + pfad + " nicht nachladen")); fertig(false); };
        document.head.appendChild(s);
      }
      ["pointerdown", "keydown", "scroll"].forEach(function (e) {
        window.addEventListener(e, starten, { capture: true, once: true, passive: true });
      });
      if (window.requestIdleCallback) requestIdleCallback(starten, { timeout: 3000 });
      else setTimeout(starten, 1200);
    });
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

  // Gecachter App-Korpus-Provider (Bau 23.B-Härtung 2026-07-10): baut den
  // Such-Korpus HÖCHSTENS EINMAL (memoisiert) und teilt das Ergebnis zwischen
  // dem Such-Widget (Modul 22) UND dem Rendezvous-Antwort-Pfad (Modul 23). So
  // löst enableAnswering() die Korpus-leer-Falle (Antworten AN, aber nie
  // gesucht → leere Liste), ohne das ~30-MB-Modell doppelt zu laden. Fail-soft:
  // ein Fehler wird durchgereicht (Konsumenten fangen ihn ab), der Cache bleibt
  // leer und ein späterer Aufruf darf neu bauen.
  var _suchkorpusCache = null;
  var _suchkorpusPromise = null;
  function sageEnsureSuchkorpus() {
    if (_suchkorpusCache) return Promise.resolve(_suchkorpusCache);
    if (_suchkorpusPromise) return _suchkorpusPromise;
    _suchkorpusPromise = Promise.resolve().then(sageBuildSuchkorpus).then(function (arr) {
      _suchkorpusCache = arr;
      _suchkorpusPromise = null;
      return arr;
    }).catch(function (err) {
      _suchkorpusPromise = null;
      throw err;
    });
    return _suchkorpusPromise;
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
      // 5 min OBERGRENZE — bewusst großzügig (Klaus 2026-06-28): das erste, KALTE
      // Laden des Embedding-Modells beim Nachbarn (~30 MB, einmalig pro Gerät) kann
      // auf schwachem Netz / langsamem Tablet realistisch bis ~5 min dauern; danach
      // (warm) kommt die Antwort in Sekunden. Das blockiert die Suche NICHT mehr:
      // Modul 22 zeigt die lokalen Knoten-Treffer sofort und reicht diese Live-
      // Antwort progressiv nach, sobald sie kommt (onLive). Die Frist löst sofort
      // aus, wenn die Antwort da ist; sie wartet nur so lange, wie der Nachbar braucht.
      var res = await window.SbkimAnastomose.queryNostr(nodeId, text, { timeoutMs: 300000 });
      if (res && res.outcome === "answered" && Array.isArray(res.results)) return res.results;
      return [];
    } catch (e) {
      return [];
    }
  }

  // A11B-Inc-3 — Verbinden aus dem Such-Widget: wird Modul 22 als
  // options.connectNode(nodeId) übergeben. Liest den Raum (Modul 23 discover),
  // findet die LEBENDE Visitenkarte zum nodeId und handshaked sie
  // (handshakeCard → Modul 05, der 0.80-Andock-Riegel entscheidet UNVERÄNDERT).
  // BEWUSSTE Nutzer-Aktion (Knopf erscheint erst NACH einer Antwort). Fail-soft:
  // ohne Modul 23 / Karte nicht im Raum → ehrliche Meldung, kein Bruch.
  async function sageConnectNode(nodeId) {
    try {
      if (!window.SbkimRendezvous || typeof window.SbkimRendezvous.discover !== "function"
          || typeof window.SbkimRendezvous.handshakeCard !== "function") {
        return { ok: false, reason: "Verbinden hier nicht verfügbar (Modul 23 fehlt)." };
      }
      var d = await window.SbkimRendezvous.discover({});
      var cards = (d && Array.isArray(d.cards)) ? d.cards : (Array.isArray(d) ? d : []);
      var card = null;
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        var cid = c && (c.nodeId || (c.spore && c.spore.id));
        if (cid === nodeId) { card = c; break; }
      }
      if (!card) {
        return { ok: false, reason: "Dieser Knoten ist gerade nicht im Raum (keine frische Visitenkarte). Bitte den Gegenknoten „🌐 Mit dem Netz verbinden“ drücken lassen und erneut versuchen." };
      }
      var r = await window.SbkimRendezvous.handshakeCard(card);
      var oc = r && r.outcome;
      return {
        ok: oc === "established",
        outcome: oc,
        score: (r && typeof r.score === "number") ? r.score : undefined,
        reason: r && r.reason,
        nodeName: card.nodeName || null,
      };
    } catch (e) {
      return { ok: false, reason: (e && e.message) ? e.message : String(e) };
    }
  }

  // createIdentity-Callback für Modul 23 (Rendezvous): erzeugt die LEBENDE
  // Sage-Spore, falls im aktuellen Browser noch keine da ist — gleiche CONFIG
  // wie der Andock-Wizard (window-lexikalisch geteiltes SBKIM_SEMANTIK_CONFIG,
  // mit Fallback). Wird nur aufgerufen, wenn getOwnSpore() leer ist; sonst
  // meldet sich der Knoten mit der vorhandenen Identität an. Modul 03 lädt dabei
  // einmalig das ~30-MB-Embedding-Modell.
  async function sageCreateRendezvousIdentity() {
    if (!window.SbkimEmbedding || !window.SbkimSpore) {
      throw new Error("Module 02/03 nicht geladen — Identität kann nicht erzeugt werden.");
    }
    var C = (typeof SBKIM_SEMANTIK_CONFIG !== "undefined" && SBKIM_SEMANTIK_CONFIG) || {
      domain: "Mycel-Bibliothek",
      endpoint: "https://lausiklauskn-png.github.io/Sage-Protokol/",
      nodeType: "hybrid",
      nodeName: "Sage",
      domainKeywords: ["SBKIM-Glossar", "Mycel-Vokabular", "Protokoll-Doku", "Heilige Tafeln", "Karten", "Schwesternetz-Beobachtungen"],
      defaultDomainDescription: "Lebendiges SBKIM-Vokabular und Protokoll-Doku: Glossar, INTERFACES, ARCHITEKTUR, Karten, PULS.",
    };
    await window.SbkimEmbedding.init();
    var desc = C.defaultDomainDescription || "Sage-Protokoll — SBKIM-Mycel-Bibliothek.";
    var vec = await window.SbkimEmbedding.embedPassage(desc + ". " + (C.domainKeywords || []).join(", "));
    await window.SbkimSpore.generateOwnSpore({
      domain: C.domain,
      endpoint: C.endpoint,
      nodeType: C.nodeType,
      nodeName: C.nodeName,
      domainDescription: desc,
      domainKeywords: C.domainKeywords,
      domainVector: Array.from(vec),
      stammCategories: C.stammCategories,
      guestCategories: C.guestCategories,
    });
  }

  // Gerätename (frei wählbarer Anzeige-Name, lokal, kein PII): NUR an die Anzeige/
  // Anmeldung hängen — NICHT an generateOwnSpore (kein Spore-Re-Sign). Sicherheit:
  // nur Hinweis, die Kennung im Raum bleibt daneben. Skill: geraetename.
  function geraetename() { try { return (localStorage.getItem("sbkim_geraetename") || "").trim().slice(0, 40); } catch (_e) { return ""; } }
  function displayNodeName(base) { var g = geraetename(); return g ? (base + " · " + g) : base; }
  // Namensfeld per Glue ins geteilte Rendezvous-Panel (#sbkim-rdv-panel, byte-1:1)
  // injizieren — kein index.html-Eingriff nötig.
  function injectGeraetenameField() {
    function tryInject() {
      var panel = document.getElementById("sbkim-rdv-panel");
      if (!panel || document.getElementById("sbkim-geraetename")) return false;
      var wrap = document.createElement("div");
      wrap.style.cssText = "margin:8px 0;display:flex;gap:6px;align-items:center;flex-wrap:wrap";
      var lab = document.createElement("span"); lab.textContent = "🏷️ Gerätename:"; lab.style.cssText = "color:#9aa7b6;font-size:.85rem";
      var inp = document.createElement("input"); inp.id = "sbkim-geraetename"; inp.type = "text"; inp.maxLength = 40;
      inp.placeholder = "z. B. Klaus-Handy (frei wählbar)"; inp.value = geraetename();
      inp.style.cssText = "flex:1;min-width:120px;padding:4px 6px;border-radius:6px;border:1px solid #33414f;background:#0d1520;color:#dfeaf2;font:inherit";
      inp.title = "Nur ein Anzeige-Hinweis, kein Vertrauens-Beweis — die Kennung bleibt daneben.";
      inp.addEventListener("input", function () {
        try { localStorage.setItem("sbkim_geraetename", String(inp.value || "").trim().slice(0, 40)); } catch (_e) {}
        try { window.dispatchEvent(new CustomEvent("sbkim:geraetename-changed")); } catch (_e) {}
      });
      wrap.appendChild(lab); wrap.appendChild(inp);
      panel.insertBefore(wrap, panel.children[1] || null);
      return true;
    }
    if (tryInject()) return;
    try { var mo = new MutationObserver(function () { if (tryInject()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); } catch (_e) {}
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
        // Zeigt auf den LEEREN Platz-Anker, der in index.html schon im
        // `.lamps`-Container steht (Modul 16 Option β, Zweig "vor-injiziert").
        // Frueher stand hier ".lamps"; das Badge entstand dann erst nach dem
        // ganzen Modul-Stapel und liess die Topbar um eine Zeile wachsen —
        // CLS 0,326 (gemessen 2026-08-04). Anti-Greenwashing unveraendert:
        // ohne isCertified() fuellt Modul 16 den Anker nicht.
        badgeSelector: "#sbkim-siegel-badge",
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
    //
    // NACHGELADEN, nicht mitgeladen (Klaus' Entscheidung 2026-08-09).
    // `22_such_widget.js` ist mit 62 KiB die größte Einzeldatei der Seite, und
    // laut PageSpeed sind davon 34 KiB beim Seitenstart ungenutzt. Gebraucht
    // wird sie erst, wenn jemand sucht. Sie kommt jetzt in einer Ruhepause NACH
    // dem Laden dazu (oder sofort, wenn vorher jemand die Seite anfasst) — die
    // 🔍-Blase erscheint dadurch einen Wimpernschlag später, der Text davor
    // dafür früher. Fail-soft: kommt die Datei nicht, fehlt nur die Suche.
    await ladeSpaeter("src/modules/22_such_widget.js", "SbkimSearchWidget");
    await initModule("SbkimSearchWidget", function () {
      if (!window.SbkimSearchWidget) return false;
      return window.SbkimSearchWidget.init({
        euPolicy: "frei",
        queryLabel: "Sage",
        prepareCorpus: sageEnsureSuchkorpus,      // App-Bereich = Werkzeug-Bibliothek (gecacht, geteilt mit Modul 23)
        prepareNodeCorpus: sageBuildKnotenKorpus, // Knoten-Bereich = verbundene Knoten
        queryNode: sageQueryNode,                 // Knoten-Bereich LIVE übers Relais (Modul 05 queryNostr)
        connectNode: sageConnectNode,             // A11B-Inc-3: „🤝 verbinden" nach der Antwort (Modul 23 handshakeCard)
        // Richter Default aus (gratis). Internet-Bereich: ohne SearXNG-URL
        // = neuer Tab; Klaus kann später eine eigene Instanz eintragen.
      });
    });

    // 23 Rendezvous — öffentlicher Floating-Knopf „🌐 Mit dem Netz verbinden"
    // (Klaus' Festlegung 2026-06-28: sofort öffentlich, eigener kleiner
    // Floating-Knopf). Sage ist Hybrid (Hub UND Knoten) und matcht sowohl
    // family (0.829) als auch Mixarium (0.806) >= 0.80 — damit kann Sage der
    // Gegenpart für einen GRÜNEN Cross-App-„ETABLIERT"-Test sein. Das geteilte
    // UI-Modul (SbkimRendezvousUI) mountet den Knopf; die Mechanik liegt in
    // Modul 23 (SbkimRendezvous), das Relais/Anastomose/Spore lazy zur Klick-
    // Zeit auflöst. createIdentity reicht Sages eigene generateOwnSpore-Geste
    // durch. Verfassungstreu: nutzer-ausgelöst, init mountet nur den Knopf.
    await initModule("SbkimRendezvousUI", function () {
      if (!window.SbkimRendezvousUI) return false;
      return window.SbkimRendezvousUI.init({
        nodeName: displayNodeName("Sage-Protokoll"),
        dbSuffix: DB_SUFFIX,
        createIdentity: sageCreateRendezvousIdentity,
        // Korpus-Kopplung (Bau 23.B-Härtung): „💬 Antworten AN" stellt damit
        // aktiv den lokalen Such-Korpus sicher (geteilt/gecacht mit Modul 22),
        // gegen die Korpus-leer-Falle. Fail-soft ohne Modul 03/Korpus.
        prepareCorpus: sageEnsureSuchkorpus,
        corner: "tr",
      });
    });

    // Sage-Page-lokale Anfangs-Position der „🌐 Mycel"-Pille: knapp unter die
    // Kopfzeile (Briefkasten/Datum), OHNE die vertikale Drag-Bewegung zu
    // blockieren. Früher via CSS `top:4rem !important` — das nagelte die Pille
    // vertikal fest (nur horizontal ziehbar, Klaus 2026-07-24). Jetzt inline +
    // NUR beim ersten Mal (keine gespeicherte Position): sobald der Nutzer
    // zieht, gewinnt die gezogene/gespeicherte Position (Flying-Widget).
    try {
      var hasSavedRdvPos = false;
      try { hasSavedRdvPos = !!window.localStorage.getItem("sbkim_rdv_ui_pos"); } catch (_e) {}
      if (!hasSavedRdvPos) {
        var placeRdvBubble = function () {
          var b = document.getElementById("sbkim-rdv-btn");
          if (!b) return false;
          b.style.top = (window.innerWidth <= 640 ? "4.7rem" : "4rem");
          return true;
        };
        if (!placeRdvBubble()) { try { requestAnimationFrame(placeRdvBubble); } catch (_e) {} }
      }
    } catch (_e) {}

    // Gerätename-Feld ins Panel injizieren + Kopplung (Namenswechsel → Anzeige neu).
    injectGeraetenameField();
    try {
      window.addEventListener("sbkim:geraetename-changed", function () {
        try { if (window.SbkimRendezvous && window.SbkimRendezvous.configure) window.SbkimRendezvous.configure({ nodeName: displayNodeName("Sage-Protokoll") }); } catch (_e) {}
      });
    } catch (_e) {}

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
