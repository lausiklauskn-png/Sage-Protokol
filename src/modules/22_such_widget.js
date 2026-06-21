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

    // EU-Politik-Chip (Klick wechselt frei ↔ bindend — sichtbarer Schalter).
    euChipEl = doc.createElement("button");
    euChipEl.type = "button";
    euChipEl.className = "sbkim-sw-euchip";
    euChipEl.addEventListener("click", function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      setEuPolicy(optEuPolicy === "frei" ? "bindend" : "frei");
    });
    panelEl.appendChild(euChipEl);

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
    return runSearch(text);
  }

  function runSearch(text) {
    var match = global.SbkimMatch;
    if (!match || typeof match.queryLocal !== "function") {
      lastSearchMode = "modul-04-fehlt";
      return Promise.resolve({ mode: lastSearchMode, treffer: [],
        reason: "Modul 04 (Match) nicht geladen — Suche nicht verfügbar." });
    }
    if (typeof text !== "string" || text.trim().length === 0) {
      lastSearchMode = "vorfilter-leer";
      return Promise.resolve({ mode: lastSearchMode, treffer: [] });
    }
    var query = text.trim();
    var corpusOpt = (localCorpus != null) ? { corpus: localCorpus } : undefined;

    return Promise.resolve()
      .then(function () { return match.queryLocal(query, optK, corpusOpt); })
      .then(function (prelim) {
        prelim = prelim || [];
        if (prelim.length === 0) {
          lastSearchMode = "vorfilter-leer";
          return { mode: lastSearchMode, treffer: [] };
        }
        // Ohne Schlüssel: server-loser Default — Vorfilter ist das Ergebnis.
        if (!optApiKey || typeof match.hybridMatch !== "function") {
          lastSearchMode = "nur-vorfilter";
          return { mode: lastSearchMode, treffer: prelim };
        }
        // Kandidaten für den Richter aufbereiten (Bedeutungs-Text dazuholen).
        var byKey = {};
        if (Array.isArray(localCorpus)) {
          for (var i = 0; i < localCorpus.length; i++) {
            var c = localCorpus[i];
            byKey[c.anchorId || c.label] = c;
          }
        }
        var candidates = prelim.map(function (r) {
          var src = byKey[r.anchorId || r.label] || {};
          return { label: r.label, text: src.text || r.label, cosine: r.score, anchorId: r.anchorId };
        });
        return Promise.resolve()
          .then(function () {
            return match.hybridMatch(
              { text: query, label: optQueryLabel || null },
              candidates,
              { apiKey: optApiKey, provider: optProvider, euOnly: euOnlyForPolicy() },
            );
          })
          .then(function (judgment) {
            if (!judgment || !judgment.available) {
              lastSearchMode = "fail-soft-vorfilter";
              return { mode: lastSearchMode, reason: judgment && judgment.reason, treffer: prelim };
            }
            var treffer = (judgment.verdicts || [])
              .filter(function (v) { return v.passt; })
              .sort(function (a, b) { return b.score - a.score; });
            lastSearchMode = "richter";
            return { mode: lastSearchMode, treffer: treffer, attestation: judgment.attestation };
          })
          .catch(function (err) {
            // Richter warf trotz Fail-soft-Vertrag → defensiv Vorfilter.
            lastSearchMode = "fail-soft-vorfilter";
            return { mode: lastSearchMode, reason: (err && err.message) || String(err), treffer: prelim };
          });
      })
      .catch(function (err) {
        // queryLocal warf (z.B. Modul 03 fehlt / Empty/TooLong) → fail-soft.
        lastSearchMode = "vorfilter-fehler";
        return { mode: lastSearchMode, treffer: [], reason: (err && err.message) || String(err) };
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
    return runSearch(text).then(function (res) {
      renderResults(res);
      return res;
    }).catch(function (err) {
      setHint("Suche fehlgeschlagen — bitte erneut versuchen.");
      warn("runAndRender unerwartet", err);
    });
  }

  function renderResults(res) {
    if (!resultsEl) return;
    // Treffer-Liste neu zeichnen — berührt das Textfeld NICHT (UX-Erhalt).
    resultsEl.innerHTML = "";
    var modeHint = {
      "modul-04-fehlt": "Modul 04 nicht geladen.",
      "vorfilter-fehler": "Vorfilter-Fehler: " + (res.reason || ""),
      "vorfilter-leer": "Keine Treffer.",
      "nur-vorfilter": "Vorfilter (kein Richter-Schlüssel).",
      "fail-soft-vorfilter": "Richter nicht erreichbar — Vorfilter gilt" + (res.reason ? " (" + res.reason + ")" : "") + ".",
      "richter": "Richter-Urteil.",
    };
    setHint(modeHint[res.mode] || "");
    var treffer = res.treffer || [];
    var doc = global.document;
    for (var i = 0; i < treffer.length; i++) {
      var t = treffer[i];
      var el = doc.createElement("div");
      el.className = "sbkim-sw-result";
      var score = (typeof t.score === "number") ? t.score.toFixed(2) : "";
      var html = "<div><span>" + esc(t.label) + "</span> " +
        (score ? "<span class=\"sbkim-sw-score\">" + score + "</span>" : "") + "</div>";
      if (t.begruendung) html += "<div class=\"sbkim-sw-reason\">" + esc(t.begruendung) + "</div>";
      el.innerHTML = html;
      resultsEl.appendChild(el);
    }
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
    if (!target || !target.classList) return false;
    return target.classList.contains("sbkim-sw-input") ||
      target.classList.contains("sbkim-sw-btn") ||
      target.classList.contains("sbkim-sw-iconbtn") ||
      target.classList.contains("sbkim-sw-euchip") ||
      target.classList.contains("sbkim-sw-result");
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
    if (moved) persistPosition();
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
    _meta: {
      get euPolicy() { return optEuPolicy; },
      get corpusSize() { return Array.isArray(localCorpus) ? localCorpus.length : 0; },
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
