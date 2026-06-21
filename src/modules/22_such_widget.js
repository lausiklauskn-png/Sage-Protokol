/*
 * SBKIM — Modul 22 — Such-Widget (Floating Search-Tool)
 *
 * Schritt 2 des SBKIM-Such-Werkzeugs (nach Modul 21 Spracheingabe). Ein
 * SEPARATES, frei bewegliches Floating-Such-Tool, self-mountend in <body>.
 * Klein im Ruhezustand (Blase mit 🔍), wächst NUR bei Interaktion zu einem
 * Eingabe-Panel mit eigenem Textfeld. Leicht transparent. Komponiert vorhandene
 * Module — baut keine eigene Such-Logik:
 *
 *   1. SPRACHE   — Modul 21 SbkimSpeech (Sprach-Knopf → Text ins Feld).
 *   2. VORFILTER — Modul 04 queryLocal + Modul 03 Embedding (lokal, server-los).
 *   3. RICHTER   — Modul 04 hybridMatch (opt-in, BYOK).
 *   4. FAIL-SOFT — kein Schlüssel/Richter → Vorfilter gilt. Nie Eintritts-Barriere.
 *
 * EU-Politik einheitlich für Sprach-Engine UND Richter (Klaus 2026-06-21):
 *   - "frei"    (Default) — beide Sprach-Engines, Richter euOnly wählbar.
 *   - "bindend" — nur EU-Sprach-Engine, Richter euOnly:true erzwungen.
 *
 * Drag-/Self-Mount-/X-/Persistenz-Mechanik aus Modul 17 wiederverwendet
 * (Pointer-Events, 5 px Threshold, MutationObserver-Mount-Fallback,
 * localStorage-UX-Preferences). Modul 17 selbst bleibt unangetastet.
 *
 * UX-Lehre „Eingabe-Erhalt" (BLP/Modul 21): das Textfeld wird EINMAL angelegt
 * und NIE mit value:'' neu gebaut; erkannter Sprach-Text wird angehängt.
 *
 * Increment 1 (diese Sitzung): Widget-Shell + komponierte Suche.
 * Increment 2 (Folge-Sitzung): PWA-/Suchfeld-Kopplung über Modul 15 Membran —
 * Host lesen + aus dem Suchfeld interagieren. Host-Inhalt = untrusted external
 * data. In Increment 1 ist _meta.coupled === false, keine Kopplungs-API.
 *
 * Public surface (registered on window.SbkimSearchWidget):
 *   init(options?)   -> Promise<void>   (idempotent)
 *   show() / hide() / isVisible()
 *   expand() / collapse() / isExpanded()
 *   getPosition()    -> PositionSnapshot
 *   setCorpus(corpus)-> void
 *   search(text)     -> Promise<SearchResult>
 *   _meta            -> Read-Only-Anker
 *
 * Strikte Tabus: keine eigene Identität/Krypto/Signatur, kein IndexedDB,
 * kein Crawler/Pulsation/Eigenanfrage ins Netz, kein Umbau fremder Module,
 * kein PROTOCOL_VERSION-Bump. Fail-soft überall; einziger Sync-Throw:
 * ungültige euPolicy in init().
 *
 * Self-check: emits a console.info line on script load (synchronous).
 * Spec: docs/components/22_such_widget.md · INTERFACES.md § 1 Modul 22.
 */
(function (global) {
  "use strict";

  // ---- Konstanten ----

  var WIDGET_ID = "sbkim-search-widget";
  var STYLE_ID = "sbkim-search-widget-style";

  var LS_KEY_VISIBLE = "sbkim_search_widget_visible";
  var LS_KEY_POSITION = "sbkim_search_widget_position";
  var LS_KEY_STATE = "sbkim_search_widget_state"; // "collapsed" | "expanded"
  var LS_KEY_ENGINE = "sbkim_search_widget_engine"; // gewählte Web-Suchmaschine

  // Frei wählbare Web-Suchmaschinen für den Internet-Neuer-Tab-Weg (Klaus
  // 2026-06-21: DuckDuckGo ODER eine andere). Query wird angehängt (URL-encoded).
  var WEB_ENGINES = [
    { id: "duckduckgo", label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
    { id: "startpage",  label: "Startpage",  url: "https://www.startpage.com/sp/search?query=" },
    { id: "ecosia",     label: "Ecosia",     url: "https://www.ecosia.org/search?q=" },
    { id: "brave",      label: "Brave",      url: "https://search.brave.com/search?q=" },
    { id: "google",     label: "Google",     url: "https://www.google.com/search?q=" },
    { id: "bing",       label: "Bing",       url: "https://www.bing.com/search?q=" },
    { id: "searxng",    label: "SearXNG",    url: "https://searx.be/search?q=" },
  ];
  // Öffentliche Standard-SearXNG-Instanz für den Neuer-Tab-Weg; durch eine
  // im SearXNG-Feld gesetzte eigene Instanz überschrieben (siehe webSearchUrl).
  var SEARXNG_PUBLIC_DEFAULT = "https://searx.be";

  var DRAG_THRESHOLD_PX = 5;
  var DEFAULT_CORNER = "bottom-right";
  var DEFAULT_OFFSET = { x: 16, y: 16 };
  // Unter Modul 17 (9990) und Modals (9999), damit beide Floating-Tools
  // koexistieren.
  var DEFAULT_Z_INDEX = 9985;
  var DEFAULT_K = 5;
  var MOUNT_OBSERVER_TIMEOUT_MS = 10000;

  var EU_POLICIES = ["frei", "bindend"];
  var EU_POLICY_DEFAULT = "frei";
  var DEFAULT_PROVIDER = "mistral";

  var ALLOWED_CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"];

  // ---- Modul-Zustand (Closure) ----

  var ready = false;
  var widgetRoot = null;
  var styleElement = null;
  var bubbleEl = null;
  var panelEl = null;
  var inputEl = null;          // EINMAL angelegt, nie mit value:'' neu gebaut
  var resultsEl = null;
  var hintEl = null;
  var voiceBtnEl = null;
  var searchBtnEl = null;
  var euChipEl = null;
  var areaRowEl = null;        // Bereichs-Checkboxen (App/Knoten/Internet)
  var richterToggleEl = null;  // KI-Richter an/aus
  var searxngFieldEl = null;   // SearXNG-URL-Feld (für Web-Treffer im Widget)
  var engineSelectEl = null;   // Web-Suchmaschine-Auswahl (Neuer-Tab-Weg)
  var aiSelectEl = null;       // KI-Anbieter-Auswahl (KI-Such-Brücke Stufe A)
  var aiPromptBtnEl = null;    // „Prompt → KI"-Knopf (kopiert + öffnet Anbieter)
  var aiPasteEl = null;        // Einfüge-Feld für die KI-Antwort (JSON)
  var aiSortBtnEl = null;      // „Antwort sortieren"-Knopf
  var internetCheckboxEl = null; // Referenz auf die Internet-Bereichs-Checkbox

  // Position + Sichtbarkeit (localStorage-persistiert).
  var currentCorner = DEFAULT_CORNER;
  var currentOffsetX = DEFAULT_OFFSET.x;
  var currentOffsetY = DEFAULT_OFFSET.y;
  var currentFreeX = null;
  var currentFreeY = null;
  var visibleFlag = true;
  var expandedFlag = false;

  // Eingabe-Zustand (RAM-only, UX-Erhalt). NICHT persistiert.
  var queryValue = "";

  // Options aus init().
  var optEuPolicy = EU_POLICY_DEFAULT;
  var optApiKey = null;
  var optProvider = DEFAULT_PROVIDER;
  var optEuOnly = false;       // nur bei euPolicy:"frei" relevant
  var optQueryLabel = null;
  var optK = DEFAULT_K;
  var optAllowDrag = true;
  var optRememberHidden = true;
  var optZIndex = DEFAULT_Z_INDEX;

  // Korpus (lokal gehalten; an SbkimMatch durchgereicht).
  var localCorpus = null;
  // Lazy-Korpus-Vorbereitung (z.B. Embedding via Modul 03 beim ersten Gebrauch).
  // corpusPreparer: async () => Array<corpusEntry mit passageVec>. Wird EINMAL
  // ausgeführt (beim ersten expand() oder bei der ersten Suche), danach gecacht.
  // So bleibt die Host-Seite leicht beim Start (kein Modell-Download im Boot).
  var corpusPreparer = null;
  var corpusReady = false;
  var corpusPrepPromise = null;

  // ---- Mehrfach-Suche (Bau 22 Mehrfach 2026-06-21, Klaus' Vision) ----
  // Drei getrennt wählbare Such-Bereiche, mehrere zugleich ankreuzbar. Alle drei
  // münden in dieselbe Sortiermaschine (Modul 03 Embedding + Modul 04 Matcher) —
  // dasselbe Zwei-Stufen-Muster wie BLP (Eingang teils KI → in-App-Matcher).
  //   app      — lokaler Korpus / Host-Inhalt (gratis, server-los).
  //   knoten   — verbundene Mycel-Knoten (deren Sporen, lokal bekannt; KEINE
  //              Netz-Anfrage → Empfangsmodus gewahrt).
  //   internet — Web-Treffer. PILZ-Schicht (Werkzeug, kein Mycel-Knoten): bewusst
  //              nutzer-ausgelöste Eigen-Anfrage ins Netz, daher KEIN Widerspruch
  //              zum Empfangsmodus (CLAUDE.md § Vier-Schichten-Lesart Schicht 2).
  var areas = {
    app:      { enabled: true,  label: "App" },
    knoten:   { enabled: true,  label: "Knoten" },
    internet: { enabled: false, label: "Netz" },
  };
  // KI-Richter an/aus. DEFAULT AUS (gratis: reine semantische Cosinus-Suche „über
  // die Bedeutung"). AN nur sinnvoll mit BYOK-Schlüssel — dann urteilt die KI
  // zusätzlich. So kostet niemand ungewollt Geld (Klaus 2026-06-21).
  var richterOn = false;
  // SearXNG-Instanz-URL (optional). Gesetzt → Web-Treffer werden geholt + im
  // Widget semantisch sortiert (Re-Ranker). Leer → Internet-Bereich = „↗ Im Netz
  // suchen"-Karte (neuer Tab, kein Fetch). Öffentliche Instanzen blocken JSON/CORS
  // meist → praktisch die eigene SearXNG-Instanz (Pilz-Server).
  var searxngUrl = "";
  var optWebEngine = "duckduckgo";  // gewählte Web-Suchmaschine (Neuer-Tab-Weg)
  var optAiProvider = "chatgpt";    // gewählter KI-Anbieter (KI-Such-Brücke)
  var pastedAiText = "";            // zuletzt eingefügte KI-Antwort (RAM-only, nie persistiert)
  // Knoten-Korpus (verbundene Knoten) — analog localCorpus, eigene Lazy-Prep.
  var nodeCorpus = null;
  var nodeCorpusPreparer = null;
  var nodeCorpusReady = false;
  var nodeCorpusPrepPromise = null;
  var SEARXNG_MAX_RESULTS = 50;   // wie viele Roh-Treffer wir holen + sortieren

  // Drag + Mount.
  var dragState = null;
  var mountObserver = null;
  var mountObserverTimeoutId = null;

  // Diagnose-Anker für _meta.
  var lastSearchMode = null;
  var searchCount = 0;
  var activeRecognizer = null;

  // ---- Hilfsfunktionen ----

  function warn(message, cause) {
    if (typeof console !== "undefined" && console.warn) {
      if (cause !== undefined) console.warn("[SbkimSearchWidget] " + message, cause);
      else console.warn("[SbkimSearchWidget] " + message);
    }
  }

  function makeError(name, message) {
    var e = new Error(message);
    e.name = name;
    return e;
  }

  // Sync-Throw nur bei klarem Aufrufer-Konfig-Fehler (ungültige euPolicy).
  function normalizeEuPolicy(p) {
    if (p === undefined || p === null) return optEuPolicy;
    if (EU_POLICIES.indexOf(p) === -1) {
      throw makeError(
        "InvalidEuPolicyError",
        "euPolicy muss 'frei' oder 'bindend' sein, war: " + JSON.stringify(p),
      );
    }
    return p;
  }

  function safeGetLocalStorage() {
    try { return global.localStorage || null; }
    catch (_e) { return null; }
  }

  function lsGet(key) {
    var ls = safeGetLocalStorage();
    if (!ls) return null;
    try { return ls.getItem(key); } catch (_e) { return null; }
  }

  function lsSet(key, value) {
    var ls = safeGetLocalStorage();
    if (!ls) return;
    try { ls.setItem(key, value); } catch (_e) { /* fail-soft (Quota/Inkognito) */ }
  }

  function loadVisibleFromLs() {
    if (!optRememberHidden) { visibleFlag = true; return; }
    visibleFlag = (lsGet(LS_KEY_VISIBLE) !== "false");
  }

  function persistVisible() {
    if (!optRememberHidden) return;
    lsSet(LS_KEY_VISIBLE, visibleFlag ? "true" : "false");
  }

  function loadStateFromLs() {
    expandedFlag = (lsGet(LS_KEY_STATE) === "expanded");
  }

  function persistState() {
    lsSet(LS_KEY_STATE, expandedFlag ? "expanded" : "collapsed");
  }

  function loadPositionFromLs() {
    var raw = lsGet(LS_KEY_POSITION);
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      if (typeof parsed.x === "number" && typeof parsed.y === "number" &&
          isFinite(parsed.x) && isFinite(parsed.y)) {
        currentFreeX = parsed.x;
        currentFreeY = parsed.y;
        currentCorner = null;
      } else if (typeof parsed.corner === "string" &&
                 ALLOWED_CORNERS.indexOf(parsed.corner) >= 0) {
        currentCorner = parsed.corner;
        if (typeof parsed.offsetX === "number") currentOffsetX = parsed.offsetX;
        if (typeof parsed.offsetY === "number") currentOffsetY = parsed.offsetY;
      }
    } catch (_e) { /* fail-soft — Defaults bleiben */ }
  }

  function buildPositionSnapshot() {
    return {
      corner: currentCorner,
      offsetX: currentOffsetX,
      offsetY: currentOffsetY,
      x: currentFreeX,
      y: currentFreeY,
    };
  }

  function persistPosition() {
    try { lsSet(LS_KEY_POSITION, JSON.stringify(buildPositionSnapshot())); }
    catch (_e) { /* fail-soft */ }
  }

  function applyPositionToRoot() {
    if (!widgetRoot) return;
    widgetRoot.style.top = "";
    widgetRoot.style.bottom = "";
    widgetRoot.style.left = "";
    widgetRoot.style.right = "";
    if (currentFreeX !== null && currentFreeY !== null) {
      widgetRoot.style.left = currentFreeX + "px";
      widgetRoot.style.top = currentFreeY + "px";
      return;
    }
    var corner = currentCorner || DEFAULT_CORNER;
    var ox = currentOffsetX;
    var oy = currentOffsetY;
    if (corner === "top-left")          { widgetRoot.style.top = oy + "px"; widgetRoot.style.left = ox + "px"; }
    else if (corner === "top-right")    { widgetRoot.style.top = oy + "px"; widgetRoot.style.right = ox + "px"; }
    else if (corner === "bottom-left")  { widgetRoot.style.bottom = oy + "px"; widgetRoot.style.left = ox + "px"; }
    else                                { widgetRoot.style.bottom = oy + "px"; widgetRoot.style.right = ox + "px"; }
  }

  // ---- CSS-Injektion ----

  function buildCss() {
    return [
      "/* SBKIM Modul 22 Such-Widget — leicht transparent, klein→groß. */",
      "#" + WIDGET_ID + " {",
      "  position: fixed;",
      "  z-index: " + optZIndex + ";",
      "  font-family: 'Geist', system-ui, sans-serif;",
      "  color: #F5F5FF;",
      "  user-select: none;",
      "  -webkit-user-select: none;",
      "  touch-action: none;",
      "}",
      "#" + WIDGET_ID + ".sbkim-sw-hidden { display: none; }",
      "#" + WIDGET_ID + ".sbkim-sw-dragging .sbkim-sw-bubble,",
      "#" + WIDGET_ID + ".sbkim-sw-dragging .sbkim-sw-panel {",
      "  cursor: grabbing;",
      "  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);",
      "}",
      // Ruhezustand: Blase (collapsed). Leicht transparent.
      "#" + WIDGET_ID + " .sbkim-sw-bubble {",
      "  width: 44px;",
      "  height: 44px;",
      "  border-radius: 50%;",
      "  background: rgba(16, 16, 42, 0.90);",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  backdrop-filter: blur(6px);",
      "  -webkit-backdrop-filter: blur(6px);",
      "  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  font-size: 1.2rem;",
      "  cursor: pointer;",
      "  color: #F5F5FF;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-bubble:hover { background: rgba(24, 24, 58, 0.94); }",
      // Interaktions-Zustand: Panel (expanded). Leicht transparent.
      "#" + WIDGET_ID + " .sbkim-sw-panel {",
      "  width: min(320px, 88vw);",
      "  background: rgba(16, 16, 42, 0.92);",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  border-radius: 14px;",
      "  backdrop-filter: blur(8px);",
      "  -webkit-backdrop-filter: blur(8px);",
      "  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.42);",
      "  padding: 0.55rem 0.65rem 0.7rem;",
      "}",
      // Zustand-Umschaltung via data-state.
      "#" + WIDGET_ID + "[data-state=\"collapsed\"] .sbkim-sw-panel { display: none; }",
      "#" + WIDGET_ID + "[data-state=\"expanded\"] .sbkim-sw-bubble { display: none; }",
      // Kopfzeile: Drag-Griff + Knöpfe.
      "#" + WIDGET_ID + " .sbkim-sw-head {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 0.4rem;",
      "  margin-bottom: 0.45rem;",
      "  cursor: grab;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-title {",
      "  flex: 1;",
      "  font-size: 0.72rem;",
      "  letter-spacing: 0.04em;",
      "  text-transform: uppercase;",
      "  color: rgba(245, 245, 255, 0.6);",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-btn {",
      "  width: 20px;",
      "  height: 20px;",
      "  border-radius: 50%;",
      "  background: rgba(255, 255, 255, 0.08);",
      "  color: #F5F5FF;",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  cursor: pointer;",
      "  font-size: 0.7rem;",
      "  line-height: 1;",
      "  padding: 0;",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  opacity: 0.7;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-btn:hover { opacity: 1; background: rgba(255, 255, 255, 0.16); }",
      // Bereichs-Auswahl + Optionen-Zeile (Checkbox-Pillen).
      "#" + WIDGET_ID + " .sbkim-sw-areas, #" + WIDGET_ID + " .sbkim-sw-optrow {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 0.35rem;",
      "  flex-wrap: wrap;",
      "  margin-top: 0.4rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-check {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  gap: 0.25rem;",
      "  font-size: 0.66rem;",
      "  color: rgba(245, 245, 255, 0.7);",
      "  cursor: pointer;",
      "  border: 1px solid rgba(255, 255, 255, 0.14);",
      "  border-radius: 999px;",
      "  padding: 0.1rem 0.45rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-check input { margin: 0; cursor: pointer; accent-color: #6EE7D3; }",
      "#" + WIDGET_ID + " .sbkim-sw-searxng {",
      "  width: 100%;",
      "  box-sizing: border-box;",
      "  margin-top: 0.4rem;",
      "  background: rgba(0, 0, 0, 0.24);",
      "  border: 1px solid rgba(255, 255, 255, 0.14);",
      "  border-radius: 8px;",
      "  color: #F5F5FF;",
      "  font-size: 0.72rem;",
      "  padding: 0.3rem 0.45rem;",
      "  outline: none;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-engine {",
      "  width: 100%;",
      "  box-sizing: border-box;",
      "  margin-top: 0.35rem;",
      "  background: rgba(0, 0, 0, 0.24);",
      "  border: 1px solid rgba(255, 255, 255, 0.14);",
      "  border-radius: 8px;",
      "  color: #F5F5FF;",
      "  font-size: 0.72rem;",
      "  padding: 0.3rem 0.45rem;",
      "  outline: none;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-engine option { color: #1A1A1A; }",
      "#" + WIDGET_ID + " .sbkim-sw-ai {",
      "  width: 100%;",
      "  box-sizing: border-box;",
      "  margin-top: 0.35rem;",
      "  background: rgba(0, 0, 0, 0.24);",
      "  border: 1px solid rgba(167, 139, 250, 0.35);",
      "  border-radius: 8px;",
      "  color: #F5F5FF;",
      "  font-size: 0.72rem;",
      "  padding: 0.3rem 0.45rem;",
      "  outline: none;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-ai option { color: #1A1A1A; }",
      "#" + WIDGET_ID + " .sbkim-sw-aibtn {",
      "  width: 100%;",
      "  box-sizing: border-box;",
      "  margin-top: 0.35rem;",
      "  background: rgba(167, 139, 250, 0.18);",
      "  border: 1px solid rgba(167, 139, 250, 0.4);",
      "  border-radius: 8px;",
      "  color: #EDE9FE;",
      "  font-size: 0.72rem;",
      "  padding: 0.34rem 0.45rem;",
      "  cursor: pointer;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-aibtn:hover { background: rgba(167, 139, 250, 0.28); }",
      "#" + WIDGET_ID + " .sbkim-sw-aipaste {",
      "  width: 100%;",
      "  box-sizing: border-box;",
      "  margin-top: 0.35rem;",
      "  background: rgba(0, 0, 0, 0.28);",
      "  border: 1px solid rgba(255, 255, 255, 0.14);",
      "  border-radius: 8px;",
      "  color: #F5F5FF;",
      "  font-size: 0.7rem;",
      "  padding: 0.35rem 0.45rem;",
      "  resize: vertical;",
      "  outline: none;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-result .sbkim-sw-badge {",
      "  display: inline-block;",
      "  font-size: 0.58rem;",
      "  text-transform: uppercase;",
      "  letter-spacing: 0.04em;",
      "  color: #0B0B1A;",
      "  background: rgba(110, 231, 211, 0.85);",
      "  border-radius: 4px;",
      "  padding: 0 0.3rem;",
      "  margin-right: 0.3rem;",
      "  vertical-align: middle;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-result .sbkim-sw-badge.knoten { background: rgba(244, 180, 53, 0.85); }",
      "#" + WIDGET_ID + " .sbkim-sw-result .sbkim-sw-badge.internet { background: rgba(167, 139, 250, 0.9); color: #0B0B1A; }",
      "#" + WIDGET_ID + " a.sbkim-sw-result-link { color: #8EE7FF; text-decoration: none; }",
      "#" + WIDGET_ID + " a.sbkim-sw-result-link:hover { text-decoration: underline; }",
      // Eingabe-Zeile.
      "#" + WIDGET_ID + " .sbkim-sw-inrow {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 0.35rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-input {",
      "  flex: 1;",
      "  min-width: 0;",
      "  background: rgba(0, 0, 0, 0.28);",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  border-radius: 8px;",
      "  color: #F5F5FF;",
      "  font-size: 0.86rem;",
      "  padding: 0.4rem 0.5rem;",
      "  outline: none;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-input::placeholder { color: rgba(245, 245, 255, 0.4); }",
      "#" + WIDGET_ID + " .sbkim-sw-iconbtn {",
      "  flex-shrink: 0;",
      "  width: 32px;",
      "  height: 32px;",
      "  border-radius: 8px;",
      "  background: rgba(255, 255, 255, 0.08);",
      "  color: #F5F5FF;",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  cursor: pointer;",
      "  font-size: 0.95rem;",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-iconbtn:hover { background: rgba(255, 255, 255, 0.16); }",
      // EU-Politik-Chip.
      "#" + WIDGET_ID + " .sbkim-sw-euchip {",
      "  display: inline-block;",
      "  margin-top: 0.4rem;",
      "  font-size: 0.64rem;",
      "  letter-spacing: 0.03em;",
      "  color: rgba(245, 245, 255, 0.55);",
      "  cursor: pointer;",
      "  border: 1px solid rgba(255, 255, 255, 0.14);",
      "  border-radius: 999px;",
      "  padding: 0.12rem 0.5rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-euchip:hover { color: #F5F5FF; }",
      // Hinweis-Zeile (fail-soft Hinweise).
      "#" + WIDGET_ID + " .sbkim-sw-hint {",
      "  margin-top: 0.4rem;",
      "  font-size: 0.7rem;",
      "  color: #F4B435;",
      "  min-height: 0.9rem;",
      "}",
      // Treffer-Liste.
      "#" + WIDGET_ID + " .sbkim-sw-results {",
      "  margin-top: 0.5rem;",
      "  max-height: 40vh;",
      "  overflow: auto;",
      "  display: flex;",
      "  flex-direction: column;",
      "  gap: 0.3rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-result {",
      "  background: rgba(255, 255, 255, 0.05);",
      "  border: 1px solid rgba(255, 255, 255, 0.1);",
      "  border-radius: 8px;",
      "  padding: 0.35rem 0.5rem;",
      "  font-size: 0.8rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-result .sbkim-sw-score {",
      "  color: rgba(110, 231, 211, 0.85);",
      "  font-family: 'Geist Mono', ui-monospace, monospace;",
      "  font-size: 0.68rem;",
      "}",
      "#" + WIDGET_ID + " .sbkim-sw-result .sbkim-sw-reason {",
      "  color: rgba(245, 245, 255, 0.6);",
      "  font-size: 0.7rem;",
      "  margin-top: 0.15rem;",
      "}",
    ].join("\n");
  }

  function injectStyle(doc) {
    if (styleElement && styleElement.parentNode) return;
    if (!doc || !doc.head) return;
    var existing = doc.getElementById(STYLE_ID);
    if (existing) { styleElement = existing; return; }
    styleElement = doc.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = buildCss();
    doc.head.appendChild(styleElement);
  }

  // ---- DOM-Bau ----

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function makeBtn(doc, cls, label, ariaLabel) {
    var b = doc.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.setAttribute("aria-label", ariaLabel || label);
    return b;
  }

  // Checkbox + Label als eine kleine Pille. onChange(checked) bei Klick.
  function makeCheckbox(doc, id, labelText, checked, onChange) {
    var wrap = doc.createElement("label");
    wrap.className = "sbkim-sw-check";
    wrap.setAttribute("for", id);
    var input = doc.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.checked = !!checked;
    input.addEventListener("change", function () { onChange(!!input.checked); });
    // Klick auf das Label (nicht die Box) togglet ebenfalls; stopPropagation,
    // damit der Drag-Mechanismus nicht anspringt.
    wrap.addEventListener("pointerdown", function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); });
    var span = doc.createElement("span");
    span.textContent = labelText;
    wrap.appendChild(input);
    wrap.appendChild(span);
    wrap._input = input;
    return wrap;
  }

  function updateSearxngFieldVisibility() {
    var show = areas.internet.enabled ? "block" : "none";
    if (searxngFieldEl) searxngFieldEl.style.display = show;
    if (engineSelectEl) engineSelectEl.style.display = show;
    if (aiSelectEl) aiSelectEl.style.display = show;
    if (aiPromptBtnEl) aiPromptBtnEl.style.display = show;
    if (aiPasteEl) aiPasteEl.style.display = show;
    if (aiSortBtnEl) aiSortBtnEl.style.display = show;
  }

  function buildWidget(doc) {
    var root = doc.createElement("div");
    root.id = WIDGET_ID;
    root.className = "sbkim-search-widget";
    root.setAttribute("role", "search");
    root.setAttribute("aria-label", "SBKIM Such-Widget");
    root.setAttribute("data-state", expandedFlag ? "expanded" : "collapsed");

    // --- Ruhezustand: Blase ---
    bubbleEl = doc.createElement("div");
    bubbleEl.className = "sbkim-sw-bubble";
    bubbleEl.setAttribute("role", "button");
    bubbleEl.setAttribute("tabindex", "0");
    bubbleEl.setAttribute("aria-label", "SBKIM-Suche öffnen");
    bubbleEl.textContent = "🔍";
    bubbleEl.addEventListener("click", function () {
      if (dragState && dragState.moved) return; // Drag, kein Tap
      expand();
    });
    root.appendChild(bubbleEl);

    // --- Interaktions-Zustand: Panel ---
    panelEl = doc.createElement("div");
    panelEl.className = "sbkim-sw-panel";

    // Kopfzeile (Drag-Griff + Minimieren + X).
    var head = doc.createElement("div");
    head.className = "sbkim-sw-head";
    var title = doc.createElement("span");
    title.className = "sbkim-sw-title";
    title.textContent = "SBKIM-Suche";
    head.appendChild(title);
    var minBtn = makeBtn(doc, "sbkim-sw-btn sbkim-sw-min", "–", "Minimieren — zurück zur Such-Blase");
    minBtn.addEventListener("click", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      collapse();
    });
    head.appendChild(minBtn);
    var closeBtn = makeBtn(doc, "sbkim-sw-btn sbkim-sw-close", "✕", "Schließen — wiederherstellbar via SbkimSearchWidget.show()");
    closeBtn.addEventListener("click", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      hide();
    });
    head.appendChild(closeBtn);
    panelEl.appendChild(head);

    // Eingabe-Zeile: Textfeld + Sprach-Knopf + Such-Knopf.
    var inrow = doc.createElement("div");
    inrow.className = "sbkim-sw-inrow";
    inputEl = doc.createElement("input");
    inputEl.type = "text";
    inputEl.className = "sbkim-sw-input";
    inputEl.setAttribute("placeholder", "Suchen oder sprechen …");
    inputEl.setAttribute("aria-label", "Such-Eingabe");
    // UX-Erhalt: Wert lebt zusätzlich in queryValue; Feld wird nie neu gebaut.
    inputEl.value = queryValue;
    inputEl.addEventListener("input", function () { queryValue = inputEl.value; });
    inputEl.addEventListener("keydown", function (ev) {
      if (ev && ev.key === "Enter") { ev.preventDefault(); runAndRender(); }
    });
    inrow.appendChild(inputEl);

    voiceBtnEl = makeBtn(doc, "sbkim-sw-iconbtn sbkim-sw-voice", "🎤", "Spracheingabe (Modul 21)");
    voiceBtnEl.addEventListener("click", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      onVoiceClick();
    });
    inrow.appendChild(voiceBtnEl);

    searchBtnEl = makeBtn(doc, "sbkim-sw-iconbtn sbkim-sw-search", "🔍", "Suchen");
    searchBtnEl.addEventListener("click", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      runAndRender();
    });
    inrow.appendChild(searchBtnEl);
    panelEl.appendChild(inrow);

    // Bereichs-Auswahl (Mehrfach ankreuzbar): App · Knoten · Internet.
    areaRowEl = doc.createElement("div");
    areaRowEl.className = "sbkim-sw-areas";
    var areaIds = ["app", "knoten", "internet"];
    for (var ai = 0; ai < areaIds.length; ai++) {
      (function (id) {
        var box = makeCheckbox(doc, "sbkim-sw-area-" + id, areas[id].label, areas[id].enabled,
          function (checked) {
            areas[id].enabled = checked;
            updateSearxngFieldVisibility();
          });
        if (id === "internet") internetCheckboxEl = box;
        areaRowEl.appendChild(box);
      })(areaIds[ai]);
    }
    panelEl.appendChild(areaRowEl);

    // Optionen-Zeile: KI-Richter-Schalter + EU-Politik-Chip.
    var optRow = doc.createElement("div");
    optRow.className = "sbkim-sw-optrow";
    richterToggleEl = makeCheckbox(doc, "sbkim-sw-richter", "KI-Richter", richterOn,
      function (checked) { richterOn = checked; });
    richterToggleEl.setAttribute("title", "KI-Richter an: urteilt zusätzlich (braucht Schlüssel, kostet). Aus: gratis, rein semantisch.");
    optRow.appendChild(richterToggleEl);

    euChipEl = doc.createElement("button");
    euChipEl.type = "button";
    euChipEl.className = "sbkim-sw-euchip";
    euChipEl.addEventListener("click", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      setEuPolicy(optEuPolicy === "frei" ? "bindend" : "frei");
    });
    optRow.appendChild(euChipEl);
    panelEl.appendChild(optRow);

    // SearXNG-URL-Feld (nur sichtbar, wenn Internet-Bereich aktiv). Leer →
    // Internet = neuer Tab; gesetzt → semantischer Web-Re-Ranker.
    searxngFieldEl = doc.createElement("input");
    searxngFieldEl.type = "text";
    searxngFieldEl.className = "sbkim-sw-searxng";
    searxngFieldEl.setAttribute("placeholder", "SearXNG-URL (optional, für Web-Treffer im Widget)");
    searxngFieldEl.setAttribute("aria-label", "SearXNG-Instanz-URL für die Internet-Suche");
    searxngFieldEl.value = searxngUrl;
    searxngFieldEl.addEventListener("input", function () { searxngUrl = searxngFieldEl.value.trim(); });
    panelEl.appendChild(searxngFieldEl);

    // Web-Suchmaschine frei wählbar (Neuer-Tab-Weg). Nur sichtbar, wenn Internet
    // aktiv ist (gemeinsam mit dem SearXNG-Feld).
    engineSelectEl = doc.createElement("select");
    engineSelectEl.className = "sbkim-sw-engine";
    engineSelectEl.setAttribute("aria-label", "Web-Suchmaschine für den Internet-Bereich");
    for (var ei = 0; ei < WEB_ENGINES.length; ei++) {
      var opt = doc.createElement("option");
      opt.value = WEB_ENGINES[ei].id;
      opt.textContent = "Suchmaschine: " + WEB_ENGINES[ei].label;
      if (WEB_ENGINES[ei].id === optWebEngine) opt.selected = true;
      engineSelectEl.appendChild(opt);
    }
    engineSelectEl.addEventListener("change", function () {
      optWebEngine = engineSelectEl.value;
      persistEngine();
    });
    engineSelectEl.addEventListener("pointerdown", function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); });
    panelEl.appendChild(engineSelectEl);

    // ---- KI-Such-Brücke Stufe A: Anbieter-Wahl + Prompt-Knopf + Einfüge-Feld ----
    aiSelectEl = doc.createElement("select");
    aiSelectEl.className = "sbkim-sw-ai";
    aiSelectEl.setAttribute("aria-label", "KI-Anbieter für die Internet-Suche");
    rebuildAiProviderOptions();
    aiSelectEl.addEventListener("change", function () { optAiProvider = aiSelectEl.value; });
    aiSelectEl.addEventListener("pointerdown", function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); });
    panelEl.appendChild(aiSelectEl);

    aiPromptBtnEl = makeBtn(doc, "sbkim-sw-aibtn", "🤖 Prompt → KI", "Prompt bauen, kopieren und KI öffnen");
    aiPromptBtnEl.addEventListener("click", function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      handleAiPromptClick();
    });
    panelEl.appendChild(aiPromptBtnEl);

    aiPasteEl = doc.createElement("textarea");
    aiPasteEl.className = "sbkim-sw-aipaste";
    aiPasteEl.setAttribute("rows", "3");
    aiPasteEl.setAttribute("placeholder", "KI-Antwort (JSON) hier einfügen …");
    aiPasteEl.setAttribute("aria-label", "KI-Antwort einfügen");
    aiPasteEl.addEventListener("pointerdown", function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); });
    panelEl.appendChild(aiPasteEl);

    aiSortBtnEl = makeBtn(doc, "sbkim-sw-aibtn", "↓ Antwort sortieren", "KI-Antwort übernehmen und semantisch sortieren");
    aiSortBtnEl.addEventListener("click", function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      handleAiSortClick();
    });
    panelEl.appendChild(aiSortBtnEl);

    // Hinweis-Zeile + Treffer-Liste.
    hintEl = doc.createElement("div");
    hintEl.className = "sbkim-sw-hint";
    panelEl.appendChild(hintEl);
    resultsEl = doc.createElement("div");
    resultsEl.className = "sbkim-sw-results";
    panelEl.appendChild(resultsEl);

    root.appendChild(panelEl);

    if (optAllowDrag) attachDragHandlers(root);
    updateEuChip();
    updateSearxngFieldVisibility();
    return root;
  }

  function updateEuChip() {
    if (!euChipEl) return;
    var label = optEuPolicy === "bindend"
      ? "EU-Politik: bindend (nur EU)"
      : "EU-Politik: frei (EU wählbar)";
    euChipEl.textContent = label;
    euChipEl.setAttribute("aria-label", label + " — Klick wechselt");
  }

  function setHint(text) {
    if (hintEl) hintEl.textContent = text || "";
  }

  function appendToInput(text) {
    if (!text) return;
    // UX-Erhalt: an den LIVE-Feldwert anhängen (nicht nur an den RAM-Spiegel),
    // damit programmatisch oder per Tastatur gesetzter Text nicht verloren geht.
    var base = inputEl ? inputEl.value : queryValue;
    queryValue = (base ? base + " " : "") + text;
    if (inputEl) inputEl.value = queryValue;
  }

  // ---- EU-Politik ----

  function setEuPolicy(p) {
    optEuPolicy = normalizeEuPolicy(p);
    updateEuChip();
    rebuildAiProviderOptions(); // EU-bindend → nur EU-KI-Anbieter (DSGVO)
  }

  // bindend → euOnly:true erzwungen; frei → optEuOnly (Default false, EU wählbar).
  function euOnlyForPolicy() {
    return optEuPolicy === "bindend" ? true : !!optEuOnly;
  }

  // ---- Spracheingabe (Modul 21) ----

  function onVoiceClick() {
    var speech = global.SbkimSpeech;
    if (!speech || typeof speech.pickEngine !== "function") {
      setHint("Modul 21 (Spracheingabe) nicht geladen — bitte tippen.");
      return;
    }
    var engine;
    try { engine = speech.pickEngine(optEuPolicy); }
    catch (e) { setHint(speech.speechErrorHint ? speech.speechErrorHint(e) : "Spracheingabe nicht möglich — bitte tippen."); return; }

    if (engine === "browser" && typeof speech.isBrowserSupported === "function" &&
        speech.isBrowserSupported()) {
      var lang = (speech.getLanguages()[0] || ["de-DE"])[0];
      try {
        activeRecognizer = speech.makeBrowserRecognizer({
          lang: lang,
          onResult: function (t) { appendToInput(t); setHint("Erkannt: " + t); },
          onError: function (h) { setHint(h); },
          onEnd: function () { activeRecognizer = null; },
        });
        activeRecognizer.start();
        setHint("Sprich jetzt …");
      } catch (e) {
        setHint(speech.speechErrorHint ? speech.speechErrorHint(e) : "Spracheingabe nicht möglich — bitte tippen.");
      }
      return;
    }
    // EU-Engine braucht Schlüssel + Aufnahme — in Increment 1 fail-soft.
    setHint("Sprach-Engine '" + engine + "' braucht einen EU-Schlüssel — bitte tippen.");
  }

  // ---- Komponierte Suche (Vorfilter → Richter → Fail-soft) ----
  // Spiegelung des Helfers sbkimHybridSearch aus HYBRID-MATCH-EINBAU.md.

  function search(text) {
    return runMultiSearch(text);
  }

  // Lazy-Korpus-Vorbereitung: führt corpusPreparer EINMAL aus (Embedding etc.),
  // setzt den Korpus und cacht das Ergebnis. Parallele Aufrufe teilen sich eine
  // in-flight-Promise. Fehler lassen corpusReady false (nächster Versuch darf neu
  // vorbereiten). Zeigt während der Vorbereitung einen Hinweis.
  function ensureCorpusPrepared() {
    if (corpusReady) return Promise.resolve();
    if (typeof corpusPreparer !== "function") return Promise.resolve();
    if (corpusPrepPromise) return corpusPrepPromise;
    setHint("Suchindex wird vorbereitet … (einmalig, kann etwas dauern)");
    corpusPrepPromise = Promise.resolve()
      .then(function () { return corpusPreparer(); })
      .then(function (prepared) {
        if (Array.isArray(prepared)) setCorpus(prepared);
        corpusReady = true;
        corpusPrepPromise = null;
        setHint("");
      })
      .catch(function (err) {
        corpusPrepPromise = null;
        throw err;
      });
    return corpusPrepPromise;
  }

  // Lazy-Vorbereitung des Knoten-Korpus (verbundene Mycel-Knoten), analog
  // ensureCorpusPrepared für den App-Korpus.
  function ensureNodeCorpusPrepared() {
    if (nodeCorpusReady) return Promise.resolve();
    if (typeof nodeCorpusPreparer !== "function") return Promise.resolve();
    if (nodeCorpusPrepPromise) return nodeCorpusPrepPromise;
    nodeCorpusPrepPromise = Promise.resolve()
      .then(function () { return nodeCorpusPreparer(); })
      .then(function (prepared) {
        if (Array.isArray(prepared)) nodeCorpus = prepared.slice();
        nodeCorpusReady = true;
        nodeCorpusPrepPromise = null;
      })
      .catch(function (err) { nodeCorpusPrepPromise = null; throw err; });
    return nodeCorpusPrepPromise;
  }

  function activeAreaIds() {
    var out = [];
    if (areas.app.enabled) out.push("app");
    if (areas.knoten.enabled) out.push("knoten");
    if (areas.internet.enabled) out.push("internet");
    return out;
  }

  function engineById(id) {
    for (var i = 0; i < WEB_ENGINES.length; i++) { if (WEB_ENGINES[i].id === id) return WEB_ENGINES[i]; }
    return WEB_ENGINES[0]; // DuckDuckGo-Fallback
  }

  // Web-Suchmaschine frei wählbar (Klaus 2026-06-21); DuckDuckGo Default.
  // SearXNG nimmt die eigene Instanz aus dem SearXNG-Feld, sonst öffentliche.
  function webSearchUrl(query) {
    if (optWebEngine === "searxng") {
      var base = (searxngUrl ? searxngUrl : SEARXNG_PUBLIC_DEFAULT).replace(/\/+$/, "");
      return base + "/search?q=" + encodeURIComponent(query);
    }
    return engineById(optWebEngine).url + encodeURIComponent(query);
  }

  function loadEngineFromLs() {
    var raw = lsGet(LS_KEY_ENGINE);
    if (raw) { for (var i = 0; i < WEB_ENGINES.length; i++) { if (WEB_ENGINES[i].id === raw) { optWebEngine = raw; return; } } }
  }

  function persistEngine() { lsSet(LS_KEY_ENGINE, optWebEngine); }

  // ---- KI-Such-Brücke (Increment 2 Stufe A — Gratis-Kopier-Pfad) ----
  // Der Nutzer fragt eine KI mit Websuche; deren JSON-Quellen werden eingefügt
  // und semantisch sortiert. KEIN Schlüssel hier (Stufe A); Stufe B (Tresor +
  // automatischer API-Aufruf) ist eine eigene Folge-Sitzung. openUrl bettet den
  // Prompt best-effort in die Such-URL des Anbieters ein (Clipboard bleibt die
  // verlässliche Quelle). euBased = im EU-Raum gehostet (DSGVO).
  var AI_PROVIDERS = [
    { id: "chatgpt",    label: "ChatGPT (OpenAI)",      openUrl: "https://chatgpt.com/?q=",              euBased: false, webSearch: true },
    { id: "claude",     label: "Claude (Anthropic)",    openUrl: "https://claude.ai/new?q=",             euBased: false, webSearch: true },
    { id: "perplexity", label: "Perplexity",            openUrl: "https://www.perplexity.ai/search?q=",  euBased: false, webSearch: true },
    { id: "mistral",    label: "Le Chat (Mistral · EU)", openUrl: "https://chat.mistral.ai/chat?q=",      euBased: true,  webSearch: true },
    { id: "alephalpha", label: "Aleph Alpha (DE · EU)",  openUrl: "https://app.aleph-alpha.com/?q=",      euBased: true,  webSearch: false },
  ];

  function aiProviderById(id) {
    for (var i = 0; i < AI_PROVIDERS.length; i++) { if (AI_PROVIDERS[i].id === id) return AI_PROVIDERS[i]; }
    return AI_PROVIDERS[0];
  }
  // Bei EU-bindender Politik nur EU-gehostete Anbieter (DSGVO-Kopplung an Modul 21/22).
  function aiProvidersForPolicy() {
    return optEuPolicy === "bindend"
      ? AI_PROVIDERS.filter(function (p) { return p.euBased; })
      : AI_PROVIDERS.slice();
  }

  // Prompt aus der Such-Frage bauen. Code-Block-Regel → ChatGPT zeigt einen
  // „Copy"-Knopf UND liefert saubere URLs (keine Zitat-Artefakte).
  function buildAiPrompt(query) {
    var q = (typeof query === "string" ? query : "").trim();
    return [
      "Suche im Internet zu meiner Frage und gib mir möglichst viele ECHTE, verschiedene Quellseiten.",
      "",
      "Meine Frage: " + q,
      "",
      "WICHTIG für die Ausgabe:",
      "- Lege die Antwort in EINEN Code-Block (```), damit ich sie mit einem Klick kopieren kann.",
      "- Im Code-Block NUR gültiges JSON, sonst nichts.",
      "- Erfinde KEINE URLs, nur echte Treffer. Keine Dubletten.",
      "- Format pro Eintrag:",
      '  {"titel": "...", "url": "https://...", "quelle": "domain.de", "text": "ein bis zwei Sätze"}',
      "- So viele echte Einträge wie möglich (Ziel bis 50).",
    ].join("\n");
  }

  // URL-Müll säubern: ChatGPT hängt im Render manchmal unsichtbare Zitat-Zeichen
  // ans URL-Ende (im Test 2026-06-21 gesehen). Nur bis zum ersten Whitespace/
  // Anführungszeichen nehmen, dann hinten alles abschneiden, was nicht URL ist.
  function cleanUrl(u) {
    if (typeof u !== "string") return "";
    var s = u.trim().split(/[\s"'<>]/)[0];
    s = s.replace(/[^A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]+$/g, "");
    return s;
  }

  // Eingefügte KI-Antwort → saubere Eintrags-Liste. Verträgt Code-Fences
  // (```json … ```), Text drumherum und gesäuberte URLs. [] wenn kein Array.
  function parseAiAnswer(text) {
    if (typeof text !== "string" || !text.trim()) return [];
    var raw = text.trim();
    var fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) raw = fence[1].trim();
    var start = raw.indexOf("[");
    var end = raw.lastIndexOf("]");
    if (start < 0 || end <= start) return [];
    var arr;
    try { arr = JSON.parse(raw.slice(start, end + 1)); }
    catch (e) { return []; }
    if (!Array.isArray(arr)) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var it = arr[i] || {};
      var url = cleanUrl(it.url || it.link || "");
      var titel = String(it.titel || it.title || it.quelle || url || "").trim();
      var quelle = String(it.quelle || it.source || "").trim();
      var txt = String(it.text || it.snippet || it.beschreibung || "").trim();
      if (!titel && !url) continue;
      out.push({ titel: titel || url, url: url, quelle: quelle, text: txt });
    }
    return out;
  }

  function hasPastedAi() { return !!(pastedAiText && parseAiAnswer(pastedAiText).length); }

  // Anbieter-Dropdown nach EU-Politik (neu) befüllen; gewählten Eintrag halten.
  function rebuildAiProviderOptions() {
    if (!aiSelectEl) return;
    var d = global.document;
    var list = aiProvidersForPolicy();
    var keep = optAiProvider;
    var stillThere = false;
    while (aiSelectEl.children.length) aiSelectEl.removeChild(aiSelectEl.children[0]);
    for (var i = 0; i < list.length; i++) {
      var o = d.createElement("option");
      o.value = list[i].id;
      o.textContent = "KI: " + list[i].label + (list[i].webSearch ? "" : " (ohne Websuche)");
      if (list[i].id === keep) { o.selected = true; stillThere = true; }
      aiSelectEl.appendChild(o);
    }
    if (!stillThere && list.length) { optAiProvider = list[0].id; aiSelectEl.children[0].selected = true; }
  }

  function copyToClipboard(text) {
    try {
      if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
        return Promise.resolve(global.navigator.clipboard.writeText(text)).then(function () { return true; })
          .catch(function () { return false; });
      }
    } catch (_e) { /* nb */ }
    return Promise.resolve(false);
  }

  // „Prompt → KI": Prompt aus der aktuellen Frage bauen, in die Zwischenablage
  // kopieren, gewählten Anbieter best-effort mit Prompt öffnen.
  function handleAiPromptClick() {
    var query = (inputEl ? inputEl.value : queryValue) || "";
    query = String(query).trim();
    if (!query) { setHint("Erst eine Frage eintippen, dann den KI-Knopf nutzen."); return; }
    var prompt = buildAiPrompt(query);
    var prov = aiProviderById(optAiProvider);
    copyToClipboard(prompt).then(function (ok) {
      setHint(ok
        ? "Prompt kopiert → bei " + prov.label + " einfügen, Antwort hierher zurück."
        : "Prompt im Feld unten — manuell kopieren, bei " + prov.label + " einfügen.");
      if (!ok && aiPasteEl) { /* Sichtbar machen, falls Clipboard verboten ist. */ }
    });
    try {
      if (typeof global.open === "function") {
        global.open(prov.openUrl + encodeURIComponent(prompt), "_blank", "noopener");
      }
    } catch (_e) { /* nb — Clipboard reicht als verlässlicher Weg */ }
  }

  // „Antwort sortieren": eingefügte KI-Antwort übernehmen und Suche auslösen.
  function handleAiSortClick() {
    var txt = aiPasteEl ? aiPasteEl.value : "";
    var entries = parseAiAnswer(txt);
    if (!entries.length) {
      setHint("Keine gültige KI-Antwort erkannt — JSON-Liste mit url/titel einfügen.");
      return;
    }
    pastedAiText = txt;
    if (!areas.internet.enabled) {
      areas.internet.enabled = true;
      if (internetCheckboxEl && internetCheckboxEl._input) internetCheckboxEl._input.checked = true;
      updateSearxngFieldVisibility();
    }
    setHint(entries.length + " KI-Quellen erkannt — sortiere …");
    runAndRender();
  }

  // Eingefügte KI-Quellen → einbetten (Modul 03) → Korpus, damit die
  // Sortiermaschine sie semantisch ranken kann (wie App/Knoten/SearXNG).
  function buildAiCorpus() {
    var entries = parseAiAnswer(pastedAiText);
    if (!entries.length) return Promise.resolve([]);
    var embedding = global.SbkimEmbedding;
    if (!embedding || typeof embedding.embedPassageBatch !== "function") {
      return Promise.reject(new Error("Modul 03 (Embedding) nicht geladen — KI-Treffer können nicht sortiert werden."));
    }
    var texts = entries.map(function (e) { return e.titel + (e.text ? " — " + e.text : ""); });
    return Promise.resolve(embedding.embedPassageBatch(texts)).then(function (vecs) {
      return entries.map(function (e, i) {
        return { label: e.titel, text: texts[i], anchorId: e.url || e.titel, url: e.url || null, passageVec: vecs[i] };
      });
    });
  }

  // Stufe 2 (Sortiermaschine): Modul 04 queryLocal-Cosinus über EINEN Korpus,
  // Treffer mit Quelle (source) + Bedeutungs-Text + URL angereichert.
  function queryCorpus(query, corpus, source) {
    var match = global.SbkimMatch;
    if (!match || typeof match.queryLocal !== "function") return Promise.resolve([]);
    if (!Array.isArray(corpus) || corpus.length === 0) return Promise.resolve([]);
    return Promise.resolve(match.queryLocal(query, optK, { corpus: corpus })).then(function (res) {
      res = res || [];
      var byKey = {};
      for (var i = 0; i < corpus.length; i++) { var c = corpus[i]; byKey[c.anchorId || c.label] = c; }
      return res.map(function (r) {
        var src = byKey[r.anchorId || r.label] || {};
        return {
          label: r.label, score: r.score, anchorId: r.anchorId, source: source,
          text: src.text || r.label, url: src.url || null,
        };
      });
    });
  }

  // Stufe 1 (Eingang) für den Internet-Bereich: SearXNG-Roh-Treffer holen.
  function fetchSearxngResults(query) {
    if (typeof global.fetch !== "function") return Promise.reject(new Error("fetch nicht verfügbar."));
    var base = String(searxngUrl).replace(/\/+$/, "");
    var url = base + "/search?q=" + encodeURIComponent(query) + "&format=json";
    return Promise.resolve(global.fetch(url, { headers: { "Accept": "application/json" } }))
      .then(function (resp) {
        if (!resp || !resp.ok) throw new Error("SearXNG HTTP " + (resp && resp.status));
        return resp.json();
      })
      .then(function (data) {
        var arr = (data && Array.isArray(data.results)) ? data.results : [];
        return arr.slice(0, SEARXNG_MAX_RESULTS).map(function (r) {
          return { title: r.title || r.url || "", url: r.url || "", content: r.content || "" };
        }).filter(function (r) { return r.url; });
      });
  }

  // Internet-Roh-Treffer → einbetten (Modul 03) → Korpus mit passageVec, damit
  // die Sortiermaschine sie semantisch ranken kann (genau wie App/Knoten).
  function buildInternetCorpus(query) {
    if (!searxngUrl) return Promise.resolve([]);
    var embedding = global.SbkimEmbedding;
    return fetchSearxngResults(query).then(function (raw) {
      if (!raw.length) return [];
      if (!embedding || typeof embedding.embedPassageBatch !== "function") {
        throw new Error("Modul 03 (Embedding) nicht geladen — Web-Treffer können nicht sortiert werden.");
      }
      var texts = raw.map(function (r) { return r.title + (r.content ? " — " + r.content : ""); });
      return Promise.resolve(embedding.embedPassageBatch(texts)).then(function (vecs) {
        return raw.map(function (r, i) {
          return { label: r.title, text: texts[i], anchorId: r.url, url: r.url, passageVec: vecs[i] };
        });
      });
    });
  }

  function areaCandidates(area, query) {
    if (area === "app") {
      return ensureCorpusPrepared().then(function () { return queryCorpus(query, localCorpus, "app"); })
        .catch(function (err) { warn("App-Bereich-Suche fehlgeschlagen.", err); return []; });
    }
    if (area === "knoten") {
      return ensureNodeCorpusPrepared().then(function () { return queryCorpus(query, nodeCorpus, "knoten"); })
        .catch(function (err) { warn("Knoten-Bereich-Suche fehlgeschlagen.", err); return []; });
    }
    return Promise.resolve([]);
  }

  // KI-Richter über die zusammengeführten besten Kandidaten (ein Aufruf), nur
  // wenn richterOn UND ein Schlüssel da ist. Behält die Quelle pro Treffer.
  function richterRerank(query, candidates) {
    var match = global.SbkimMatch;
    var forJudge = candidates.map(function (c) {
      return { label: c.label, text: c.text || c.label, cosine: c.score, anchorId: c.anchorId };
    });
    return Promise.resolve(match.hybridMatch(
        { text: query, label: optQueryLabel || null }, forJudge,
        { apiKey: optApiKey, provider: optProvider, euOnly: euOnlyForPolicy() }))
      .then(function (judgment) {
        if (!judgment || !judgment.available) {
          return { mode: "semantisch", treffer: candidates, reason: judgment && judgment.reason };
        }
        var byKey = {};
        candidates.forEach(function (c) { byKey[c.anchorId || c.label] = c; });
        var treffer = (judgment.verdicts || []).filter(function (v) { return v.passt; })
          .map(function (v) {
            var c = byKey[v.anchorId || v.label] || {};
            return { label: v.label, score: v.score, anchorId: v.anchorId, source: c.source,
                     text: c.text, url: c.url, begruendung: v.begruendung };
          })
          .sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
        return { mode: "richter", treffer: treffer, attestation: judgment.attestation };
      })
      .catch(function (err) {
        return { mode: "semantisch", treffer: candidates, reason: (err && err.message) || String(err) };
      });
  }

  // Mehrfach-Suche: gewählte Bereiche → je Cosinus-Kandidaten → zusammenführen →
  // optional KI-Richter → gerankte Treffer mit Quellen-Badge. Internet ohne
  // SearXNG-URL → Neuer-Tab-Karte (webLink) statt Inline-Treffer.
  function runMultiSearch(text) {
    if (typeof text !== "string" || text.trim().length === 0) {
      lastSearchMode = "leer";
      return Promise.resolve({ mode: "leer", treffer: [], webLink: null });
    }
    var query = text.trim();
    var enabled = activeAreaIds();
    if (enabled.length === 0) {
      lastSearchMode = "leer";
      return Promise.resolve({ mode: "leer", treffer: [], webLink: null,
        reason: "Kein Such-Bereich gewählt — App, Knoten oder Internet ankreuzen." });
    }
    var match = global.SbkimMatch;
    var aiReady = hasPastedAi();
    var needsMatch = areas.app.enabled || areas.knoten.enabled ||
      (areas.internet.enabled && (!!searxngUrl || aiReady));
    if (needsMatch && (!match || typeof match.queryLocal !== "function")) {
      // App/Knoten/Internet-Re-Ranker brauchen Modul 04. Internet-Neuer-Tab geht
      // trotzdem (kein Matcher nötig).
      if (areas.internet.enabled && !searxngUrl) {
        lastSearchMode = "semantisch";
        return Promise.resolve({ mode: "semantisch", treffer: [],
          webLink: { query: query, url: webSearchUrl(query) } });
      }
      lastSearchMode = "modul-04-fehlt";
      return Promise.resolve({ mode: "modul-04-fehlt", treffer: [], webLink: null,
        reason: "Modul 04 (Match) nicht geladen — Suche nicht verfügbar." });
    }

    var tasks = [];
    if (areas.app.enabled) tasks.push(areaCandidates("app", query));
    if (areas.knoten.enabled) tasks.push(areaCandidates("knoten", query));

    // Internet-Bereich separat (kann Kandidaten ODER einen webLink liefern).
    var internetP = Promise.resolve({ candidates: [], webLink: null });
    if (areas.internet.enabled) {
      if (aiReady) {
        // Eingefügte KI-Antwort hat Vorrang vor SearXNG/Neuer-Tab — sie ist die
        // bewusst geholte Quelle, die das Vektor-Sortieren zündet.
        internetP = buildAiCorpus()
          .then(function (corpus) { return queryCorpus(query, corpus, "internet"); })
          .then(function (c) {
            return { candidates: c, webLink: c.length ? null : { query: query, url: webSearchUrl(query) } };
          })
          .catch(function (err) {
            warn("KI-Antwort-Sortierung fehlgeschlagen — Neuer-Tab-Weg angeboten.", err);
            return { candidates: [], webLink: { query: query, url: webSearchUrl(query) } };
          });
      } else if (searxngUrl) {
        internetP = buildInternetCorpus(query)
          .then(function (corpus) { return queryCorpus(query, corpus, "internet"); })
          .then(function (c) {
            return { candidates: c, webLink: c.length ? null : { query: query, url: webSearchUrl(query) } };
          })
          .catch(function (err) {
            warn("Internet-Re-Ranker fehlgeschlagen — Neuer-Tab-Weg angeboten.", err);
            return { candidates: [], webLink: { query: query, url: webSearchUrl(query) } };
          });
      } else {
        internetP = Promise.resolve({ candidates: [], webLink: { query: query, url: webSearchUrl(query) } });
      }
    }

    return Promise.all([Promise.all(tasks), internetP]).then(function (both) {
      var lists = both[0];
      var internet = both[1];
      var all = [];
      lists.forEach(function (l) { if (Array.isArray(l)) all = all.concat(l); });
      if (Array.isArray(internet.candidates)) all = all.concat(internet.candidates);
      all.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
      var top = all.slice(0, Math.max(optK, 8));
      var webLink = internet.webLink;

      if (top.length === 0) {
        lastSearchMode = webLink ? "semantisch" : "leer";
        return { mode: lastSearchMode, treffer: [], webLink: webLink };
      }
      if (richterOn && optApiKey && match && typeof match.hybridMatch === "function") {
        return richterRerank(query, top).then(function (judged) {
          lastSearchMode = judged.mode;
          return { mode: judged.mode, treffer: judged.treffer, webLink: webLink,
                   reason: judged.reason, attestation: judged.attestation };
        });
      }
      lastSearchMode = "semantisch";
      return { mode: "semantisch", treffer: top, webLink: webLink };
    }).catch(function (err) {
      lastSearchMode = "fehler";
      return { mode: "fehler", treffer: [], webLink: null, reason: (err && err.message) || String(err) };
    });
  }

  function runAndRender() {
    if (activeRecognizer && typeof activeRecognizer.stop === "function") {
      try { activeRecognizer.stop(); } catch (_e) { /* idempotent */ }
      activeRecognizer = null;
    }
    var text = inputEl ? inputEl.value : queryValue;
    queryValue = text;
    setHint("Suche läuft …");
    searchCount++;
    expand(); // Ergebnis ist da bzw. kommt — Widget wächst.
    return runMultiSearch(text).then(function (res) {
      renderResults(res);
      return res;
    }).catch(function (err) {
      setHint("Suche fehlgeschlagen — bitte erneut versuchen.");
      warn("runAndRender unerwartet", err);
    });
  }

  var SOURCE_LABELS = { app: "App", knoten: "Knoten", internet: "Netz" };

  // Neuen Tab öffnen — explizit, weil ein <a target="_blank"> auf Touch durch
  // setPointerCapture verschluckt werden kann. window.open im click-Handler
  // gilt als Nutzer-Geste (kein Popup-Block).
  function openUrl(url) {
    if (!url) return;
    try {
      var w = global.open ? global.open(url, "_blank", "noopener,noreferrer") : null;
      if (!w && global.location) { /* Fallback nur, wenn open blockiert wäre */ }
    } catch (e) { warn("Konnte Link nicht öffnen: " + url, e); }
  }

  function makeBadge(doc, srcKey) {
    var badge = doc.createElement("span");
    badge.className = "sbkim-sw-badge " + srcKey;
    badge.textContent = SOURCE_LABELS[srcKey] || srcKey;
    return badge;
  }

  function renderResults(res) {
    if (!resultsEl) return;
    var doc = global.document;
    // Treffer-Liste neu zeichnen (createElement, kein innerHTML) — berührt das
    // Textfeld NICHT (UX-Erhalt).
    while (resultsEl.firstChild) resultsEl.removeChild(resultsEl.firstChild);
    var treffer = res.treffer || [];
    var modeHint = {
      "modul-04-fehlt": "Modul 04 (Match) nicht geladen.",
      "fehler": "Suche fehlgeschlagen" + (res.reason ? " (" + res.reason + ")" : "") + ".",
      "leer": res.reason || "Keine Treffer.",
      "semantisch": treffer.length
        ? "Semantische Suche" + (richterOn && !optApiKey ? " (Richter aus — kein Schlüssel)." : ".")
        : (res.webLink ? "Im Netz weitersuchen:" : "Keine Treffer."),
      "richter": "KI-Richter-Urteil." + (res.reason ? " (Hinweis: " + res.reason + ")" : ""),
    };
    setHint(modeHint[res.mode] || "");

    // Erst die echten Treffer (Klaus-Politur 2026-06-21: Web-Karte ans Ende).
    for (var i = 0; i < treffer.length; i++) {
      var t = treffer[i];
      var el = doc.createElement("div");
      el.className = "sbkim-sw-result";
      var line = doc.createElement("div");
      line.appendChild(makeBadge(doc, t.source || "app"));

      var titleEl;
      if (t.url) {
        titleEl = doc.createElement("a");
        titleEl.className = "sbkim-sw-result-link";
        titleEl.href = t.url;
        titleEl.target = "_blank";
        titleEl.rel = "noopener noreferrer";
        titleEl.textContent = t.label;
        attachOpenHandler(titleEl, t.url);
      } else {
        titleEl = doc.createElement("span");
        titleEl.textContent = t.label;
      }
      line.appendChild(titleEl);

      if (typeof t.score === "number") {
        line.appendChild(doc.createTextNode(" "));
        var scoreEl = doc.createElement("span");
        scoreEl.className = "sbkim-sw-score";
        scoreEl.textContent = t.score.toFixed(2);
        line.appendChild(scoreEl);
      }
      el.appendChild(line);
      if (t.begruendung) {
        var reasonEl = doc.createElement("div");
        reasonEl.className = "sbkim-sw-reason";
        reasonEl.textContent = t.begruendung;
        el.appendChild(reasonEl);
      }
      resultsEl.appendChild(el);
    }

    // Web-Karte (Internet ohne SearXNG-URL / Fallback) ans ENDE.
    if (res.webLink && res.webLink.url) {
      var linkEl = doc.createElement("div");
      linkEl.className = "sbkim-sw-result";
      linkEl.appendChild(makeBadge(doc, "internet"));
      var a = doc.createElement("a");
      a.className = "sbkim-sw-result-link";
      a.href = res.webLink.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "↗ Im Netz suchen: " + (res.webLink.query || "");
      attachOpenHandler(a, res.webLink.url);
      linkEl.appendChild(a);
      resultsEl.appendChild(linkEl);
    }
  }

  // Klick/Tap auf einen Link: Drag verhindern + explizit öffnen (Touch-fest).
  function attachOpenHandler(linkEl, url) {
    linkEl.addEventListener("pointerdown", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
    });
    linkEl.addEventListener("click", function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      if (ev && ev.stopPropagation) ev.stopPropagation();
      openUrl(url);
    });
  }

  // ---- Korpus ----

  function setCorpus(corpus) {
    if (corpus == null) { localCorpus = null; return; }
    if (!Array.isArray(corpus)) {
      warn("setCorpus erwartet ein Array — ignoriert.");
      return;
    }
    localCorpus = corpus.slice();
    // An Modul 04 durchreichen (fail-soft, wenn Modul 04 fehlt).
    var match = global.SbkimMatch;
    if (match && typeof match.setLocalCorpus === "function") {
      try { match.setLocalCorpus(localCorpus); }
      catch (e) { warn("SbkimMatch.setLocalCorpus warf — Korpus bleibt lokal gehalten.", e); }
    }
  }

  // ---- Drag-Mechanik (Pattern aus Modul 17) ----

  function attachDragHandlers(root) {
    root.addEventListener("pointerdown", onPointerDown);
  }

  function isInteractiveTarget(target) {
    // Bis zum Widget-Root hochlaufen: jeder Tap innerhalb eines Treffers, Links,
    // einer Checkbox oder eines Knopfs ist Bedienung, kein Drag. Wichtig gegen
    // setPointerCapture, das sonst auf Touch den Link-/Button-Klick frisst
    // (Klaus' Befund 2026-06-21: Netz-Link ließ sich nicht öffnen).
    var el = target;
    var depth = 0;
    while (el && el !== widgetRoot && depth < 10) {
      if (el.tagName === "A" || el.tagName === "INPUT" || el.tagName === "BUTTON" ||
          el.tagName === "LABEL" || el.tagName === "SELECT" || el.tagName === "OPTION" ||
          el.tagName === "TEXTAREA") return true;
      if (el.classList && (
          el.classList.contains("sbkim-sw-input") ||
          el.classList.contains("sbkim-sw-btn") ||
          el.classList.contains("sbkim-sw-iconbtn") ||
          el.classList.contains("sbkim-sw-euchip") ||
          el.classList.contains("sbkim-sw-result") ||
          el.classList.contains("sbkim-sw-result-link") ||
          el.classList.contains("sbkim-sw-check") ||
          el.classList.contains("sbkim-sw-searxng"))) return true;
      el = el.parentNode;
      depth++;
    }
    return false;
  }

  function onPointerDown(ev) {
    if (!optAllowDrag || !widgetRoot) return;
    if (isInteractiveTarget(ev.target)) return; // Controls bedienen, nicht draggen
    var rect = widgetRoot.getBoundingClientRect();
    dragState = {
      pointerId: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      origLeft: rect.left,
      origTop: rect.top,
      moved: false,
    };
    try { widgetRoot.setPointerCapture(ev.pointerId); } catch (_e) { /* fail-soft */ }
    widgetRoot.addEventListener("pointermove", onPointerMove);
    widgetRoot.addEventListener("pointerup", onPointerUp);
    widgetRoot.addEventListener("pointercancel", onPointerUp);
  }

  function onPointerMove(ev) {
    if (!dragState) return;
    var dx = ev.clientX - dragState.startX;
    var dy = ev.clientY - dragState.startY;
    if (!dragState.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX && Math.abs(dy) < DRAG_THRESHOLD_PX) return;
      dragState.moved = true;
      try { widgetRoot.classList.add("sbkim-sw-dragging"); } catch (_e) { /* nb */ }
    }
    try {
      var newX = dragState.origLeft + dx;
      var newY = dragState.origTop + dy;
      var vw = global.innerWidth || 1024;
      var vh = global.innerHeight || 768;
      var rect = widgetRoot.getBoundingClientRect();
      var minX = -rect.width + 24;
      var maxX = vw - 24;
      var minY = 0;
      var maxY = vh - 24;
      if (newX < minX) newX = minX;
      if (newX > maxX) newX = maxX;
      if (newY < minY) newY = minY;
      if (newY > maxY) newY = maxY;
      currentFreeX = newX;
      currentFreeY = newY;
      currentCorner = null;
      applyPositionToRoot();
    } catch (err) {
      warn("Drag-Pointer-Fehler — Drag abgebrochen.", err);
      onPointerUp(ev);
    }
  }

  function onPointerUp(ev) {
    if (!dragState) return;
    var moved = dragState.moved;
    try {
      if (widgetRoot && typeof widgetRoot.releasePointerCapture === "function" &&
          dragState.pointerId !== undefined) {
        widgetRoot.releasePointerCapture(dragState.pointerId);
      }
    } catch (_e) { /* nb */ }
    if (widgetRoot) {
      try { widgetRoot.classList.remove("sbkim-sw-dragging"); } catch (_e) { /* nb */ }
      widgetRoot.removeEventListener("pointermove", onPointerMove);
      widgetRoot.removeEventListener("pointerup", onPointerUp);
      widgetRoot.removeEventListener("pointercancel", onPointerUp);
    }
    if (moved) {
      persistPosition();
    } else if (!expandedFlag && (!ev || ev.type !== "pointercancel")) {
      // Tap ohne Bewegung im Ruhezustand → öffnen. Direkt hier statt im
      // click-Handler, weil setPointerCapture auf Touch-Geräten das
      // synthetische click-Event der Blase unterdrücken kann (Klaus' Befund
      // 2026-06-21: Blase ließ sich minimieren, aber nicht wieder antippen).
      expand();
    }
    var consumed = dragState;
    setTimeout(function () { if (dragState === consumed) dragState = null; }, 0);
  }

  // ---- Mount (mit MutationObserver-Fallback, Pattern aus Modul 17) ----

  function mountWidget() {
    var doc = global.document;
    if (!doc) { warn("document fehlt — Widget kann nicht gemountet werden."); return; }
    injectStyle(doc);
    if (!doc.body) { setupMountObserver(doc); return; }
    if (widgetRoot && widgetRoot.parentNode === doc.body) return; // idempotent
    if (widgetRoot && widgetRoot.parentNode) {
      try { widgetRoot.parentNode.removeChild(widgetRoot); } catch (_e) { /* nb */ }
    }
    widgetRoot = buildWidget(doc);
    doc.body.appendChild(widgetRoot);
    applyPositionToRoot();
    applyVisibility();
    applyState();
  }

  function setupMountObserver(doc) {
    if (mountObserver) return;
    if (typeof MutationObserver === "undefined") {
      if (typeof doc.addEventListener === "function") {
        doc.addEventListener("DOMContentLoaded", function () { mountWidget(); }, { once: true });
      }
      return;
    }
    var docElement = doc.documentElement;
    if (!docElement) return;
    mountObserver = new MutationObserver(function () {
      if (doc.body) { disconnectMountObserver(); mountWidget(); }
    });
    try {
      mountObserver.observe(docElement, { childList: true, subtree: true });
    } catch (err) {
      warn("MutationObserver für Widget-Mount konnte nicht starten.", err);
      mountObserver = null;
      return;
    }
    mountObserverTimeoutId = setTimeout(function () {
      if (mountObserver) {
        disconnectMountObserver();
        warn("document.body auch nach " + MOUNT_OBSERVER_TIMEOUT_MS + " ms nicht erschienen — Mount übersprungen.");
      }
    }, MOUNT_OBSERVER_TIMEOUT_MS);
  }

  function disconnectMountObserver() {
    if (mountObserver) {
      try { mountObserver.disconnect(); } catch (_e) { /* nb */ }
      mountObserver = null;
    }
    if (mountObserverTimeoutId !== null) {
      clearTimeout(mountObserverTimeoutId);
      mountObserverTimeoutId = null;
    }
  }

  function applyVisibility() {
    if (!widgetRoot) return;
    if (visibleFlag) widgetRoot.classList.remove("sbkim-sw-hidden");
    else widgetRoot.classList.add("sbkim-sw-hidden");
  }

  function applyState() {
    if (!widgetRoot) return;
    widgetRoot.setAttribute("data-state", expandedFlag ? "expanded" : "collapsed");
    if (expandedFlag && inputEl && typeof inputEl.focus === "function") {
      try { inputEl.focus(); } catch (_e) { /* nb */ }
    }
  }

  // ---- Öffentliche Sync-Methoden ----

  function show() {
    if (!ready) { warn("show() vor init() — no-op."); return; }
    visibleFlag = true;
    persistVisible();
    applyVisibility();
  }

  function hide() {
    if (!ready) { warn("hide() vor init() — no-op."); return; }
    visibleFlag = false;
    persistVisible();
    applyVisibility();
  }

  function isVisible() {
    if (!widgetRoot) return false;
    return !widgetRoot.classList.contains("sbkim-sw-hidden");
  }

  function expand() {
    if (!ready) { warn("expand() vor init() — no-op."); return; }
    expandedFlag = true;
    persistState();
    applyState();
    // Korpus vorwärmen, damit die Suche beim ersten Tippen bereit ist
    // (fire-and-forget; der Hinweis zeigt einen evtl. Fehler).
    if (typeof corpusPreparer === "function" && !corpusReady) {
      ensureCorpusPrepared().catch(function (err) {
        setHint("Suchindex-Vorbereitung fehlgeschlagen — bitte erneut versuchen.");
        warn("Korpus-Vorbereitung (expand-Warmup) fehlgeschlagen.", err);
      });
    }
  }

  function collapse() {
    if (!ready) { warn("collapse() vor init() — no-op."); return; }
    expandedFlag = false;
    persistState();
    applyState();
  }

  function isExpanded() { return !!expandedFlag; }

  function getPosition() {
    if (!ready) {
      return { corner: DEFAULT_CORNER, offsetX: DEFAULT_OFFSET.x, offsetY: DEFAULT_OFFSET.y, x: null, y: null };
    }
    return buildPositionSnapshot();
  }

  // ---- Init ----

  function init(options) {
    options = options || {};

    // euPolicy validieren (einziger Sync-Throw-Pfad).
    if (options.euPolicy !== undefined && options.euPolicy !== null) {
      optEuPolicy = normalizeEuPolicy(options.euPolicy);
    }

    if (typeof options.apiKey === "string" && options.apiKey.length > 0) optApiKey = options.apiKey;
    if (typeof options.provider === "string" && options.provider.length > 0) optProvider = options.provider;
    if (options.euOnly !== undefined) optEuOnly = !!options.euOnly;
    if (typeof options.queryLabel === "string") optQueryLabel = options.queryLabel;
    if (typeof options.k === "number" && isFinite(options.k) && options.k >= 1) optK = Math.floor(options.k);
    if (options.allowDrag !== undefined) optAllowDrag = !!options.allowDrag;
    if (options.rememberHidden !== undefined) optRememberHidden = !!options.rememberHidden;
    if (typeof options.zIndex === "number" && isFinite(options.zIndex)) optZIndex = options.zIndex;

    if (options.corpus !== undefined) setCorpus(options.corpus);
    if (typeof options.prepareCorpus === "function") corpusPreparer = options.prepareCorpus;

    // Mehrfach-Suche: Knoten-Korpus + SearXNG + Bereiche + Richter-Default.
    if (Array.isArray(options.nodeCorpus)) { nodeCorpus = options.nodeCorpus.slice(); nodeCorpusReady = true; }
    if (typeof options.prepareNodeCorpus === "function") nodeCorpusPreparer = options.prepareNodeCorpus;
    if (typeof options.searxngUrl === "string") searxngUrl = options.searxngUrl.trim();
    if (typeof options.webSearchEngine === "string") {
      for (var wi = 0; wi < WEB_ENGINES.length; wi++) {
        if (WEB_ENGINES[wi].id === options.webSearchEngine) { optWebEngine = options.webSearchEngine; break; }
      }
    }
    if (typeof options.aiProvider === "string") {
      for (var pj = 0; pj < AI_PROVIDERS.length; pj++) {
        if (AI_PROVIDERS[pj].id === options.aiProvider) { optAiProvider = options.aiProvider; break; }
      }
    }
    if (options.richter !== undefined) richterOn = !!options.richter;
    if (options.areas && typeof options.areas === "object") {
      ["app", "knoten", "internet"].forEach(function (id) {
        if (typeof options.areas[id] === "boolean") areas[id].enabled = options.areas[id];
      });
    }

    if (options.defaultCorner !== undefined &&
        ALLOWED_CORNERS.indexOf(options.defaultCorner) >= 0) {
      currentCorner = options.defaultCorner;
    }
    if (options.defaultOffset && typeof options.defaultOffset.x === "number" &&
        typeof options.defaultOffset.y === "number") {
      currentOffsetX = options.defaultOffset.x;
      currentOffsetY = options.defaultOffset.y;
    }

    // localStorage-Preferences laden (überschreibt Defaults, NICHT Position
    // wenn options.defaultCorner explizit gesetzt? — localStorage ist
    // User-Wahl und hat Vorrang, analog Modul 17).
    loadVisibleFromLs();
    loadStateFromLs();
    loadPositionFromLs();
    loadEngineFromLs();   // persistierte Suchmaschinen-Wahl (User-Wahl heilig)
    if (options.startExpanded === true) expandedFlag = true;

    if (ready) {
      // Idempotent: re-applizieren statt neu mounten.
      if (styleElement) { /* CSS bleibt */ }
      applyPositionToRoot();
      applyVisibility();
      applyState();
      updateEuChip();
      return Promise.resolve();
    }

    ready = true;
    mountWidget();
    return Promise.resolve();
  }

  // ---- Public surface ----

  var SbkimSearchWidget = {
    init: init,
    show: show,
    hide: hide,
    isVisible: isVisible,
    expand: expand,
    collapse: collapse,
    isExpanded: isExpanded,
    getPosition: getPosition,
    setCorpus: setCorpus,
    search: search,
    buildPrompt: buildAiPrompt,
    parseAiAnswer: parseAiAnswer,
    setAiAnswer: function (text) { pastedAiText = (typeof text === "string" ? text : ""); return hasPastedAi(); },
    _meta: {
      get euPolicy() { return optEuPolicy; },
      get corpusSize() { return Array.isArray(localCorpus) ? localCorpus.length : 0; },
      get corpusReady() { return corpusReady; },
      get nodeCorpusSize() { return Array.isArray(nodeCorpus) ? nodeCorpus.length : 0; },
      get areas() { return { app: areas.app.enabled, knoten: areas.knoten.enabled, internet: areas.internet.enabled }; },
      get richterOn() { return richterOn; },
      get hasSearxng() { return !!searxngUrl; },
      get webEngine() { return optWebEngine; },
      get aiProvider() { return optAiProvider; },
      get aiProviders() { return aiProvidersForPolicy().map(function (p) { return p.id; }); },
      get hasPastedAi() { return hasPastedAi(); },
      get visible() { return isVisible(); },
      get expanded() { return !!expandedFlag; },
      get widgetMounted() { return !!(widgetRoot && widgetRoot.parentNode); },
      get lastSearchMode() { return lastSearchMode; },
      get searchCount() { return searchCount; },
      get hasApiKey() { return !!optApiKey; },
      coupled: false, // Increment 2 — bleibt false in Increment 1
    },
  };

  global.SbkimSearchWidget = SbkimSearchWidget;

  // Self-check: emitted on script load (synchronous). Uniform format — see INTERFACES.md.
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 22 SUCH-WIDGET bereit, Funktionen: init/show/hide/expand/collapse/setCorpus/search, " +
        "komponiert Modul 21 (Sprache) + Modul 04 (queryLocal/hybridMatch), EU-Politik-Default: " +
        EU_POLICY_DEFAULT + " (KEIN Auto-Init — init() mountet).",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
