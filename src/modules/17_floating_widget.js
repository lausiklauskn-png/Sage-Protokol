/*
 * SBKIM — Modul 17 — Floating-Widget
 *
 * Vier-Slot-Live-Status-Dashboard als Endknoten-Standard-Render-Schicht
 * für die Pflicht-Module 02 (LEBT) / 05 + 15 Sub (b) (VERKEHR) /
 * 15 Sub (e) (FREMD) / 16 (SIEGEL). Bau-Sitzung 17 vom 2026-05-25
 * implementiert die Karte 17 § Vier-Slot-Layout + § Event-Bus-Schema.
 *
 *   - Self-mountende Pille in document.body (kein Shadow-DOM in Stufe 1).
 *   - Standalone-CSS via <style>-Element bei init() ans Ende von <head>.
 *   - Vier Slots LEBT/VERKEHR/FREMD/SIEGEL (SIEGEL nur wenn isCertified()).
 *   - Drag via Pointer-Events (Touch + Maus), 5 px Threshold; X-Knopf.
 *   - localStorage-persistierte Visible + Position (UX-Preferences).
 *   - Fünf Event-Listener auf window:
 *       sbkim:alive            → LEBT pulsiert
 *       sbkim:handshake        → VERKEHR pulst + Mini-Log (FIFO 10)
 *       sbkim:postmessage      → VERKEHR pulst + Mini-Log
 *       sbkim:fremd-alert      → FREMD dauer-rot + Puls
 *       sbkim:siegel-certified → SIEGEL ins DOM mounten, First-Boot-Animation
 *   - Modal-Bridge für FREMD/SIEGEL via Proxy-Click auf #lamp-fremd /
 *     #sbkim-siegel-badge (Option 1 aus Brief, „Proxy-DOM-Element im
 *     Widget"). Widget erzeugt diese IDs unsichtbar in seinem Inneren —
 *     Modul 15/16 müssen ihre Click-Handler dort attachen, daher MUSS
 *     SbkimWidget.init() VOR SbkimMembrane.init() / SbkimSiegel.init()
 *     im Endknoten-Andocker stehen.
 *   - LEBT- und VERKEHR-Modals baut Modul 17 selbst (eigenständige Modals
 *     in document.body, kein Modul-15-/16-Reuse).
 *   - KEINE benannten Error-Klassen — Render-Schicht, fail-soft via
 *     console.warn (analog Modul 15/16).
 *   - KEIN IndexedDB-Schreiber, KEIN Netz-Pfad, KEIN Protokoll-Bump.
 *
 * Public surface (registered on window.SbkimWidget):
 *   init(options?)      -> Promise<void>   (idempotent)
 *   show()              -> void            (sync)
 *   hide()              -> void            (sync)
 *   isVisible()         -> boolean         (sync, aus DOM-State)
 *   getPosition()       -> PositionSnapshot (sync, defensive Kopie)
 *
 * options-Form siehe Karte 17 § Schnittstelle + INTERFACES.md § 1 Modul 17.
 *
 * Self-check: emits a console.info line on script load (synchronous,
 * before any call). Siehe INTERFACES.md §1 Modul 17 und
 * docs/components/17_floating_widget.md.
 */
(function (global) {
  "use strict";

  // ---- Konstanten ----

  var WIDGET_ID = "sbkim-widget";
  var STYLE_ID = "sbkim-widget-style";
  var LEBT_MODAL_ID = "sbkim-widget-lebt-modal";
  var VERKEHR_MODAL_ID = "sbkim-widget-verkehr-modal";

  var DEFAULT_Z_INDEX = 9990;
  var DEFAULT_CORNER = "bottom-right";
  var DEFAULT_OFFSET = { x: 16, y: 16 };
  var DRAG_THRESHOLD_PX = 5;
  var FIRST_BOOT_ANIMATION_MS = 600;
  var VERKEHR_PULSE_MS = 600;
  var FREMD_PULSE_MS = 600;
  var TRAFFIC_LOG_MAX = 10;
  var MOUNT_OBSERVER_TIMEOUT_MS = 10000;
  var SHOW_WARN_THROTTLE_MS = 60000;

  // localStorage-Schlüssel (Karte 17 § Persistenz / § localStorage-Schema).
  var LS_KEY_VISIBLE = "sbkim_widget_visible";
  var LS_KEY_POSITION = "sbkim_widget_position";

  // Custom-Event-Namen (Karte 17 § Event-Bus-Schema).
  var EVENT_ALIVE = "sbkim:alive";
  var EVENT_HANDSHAKE = "sbkim:handshake";
  var EVENT_POSTMESSAGE = "sbkim:postmessage";
  var EVENT_FREMD_ALERT = "sbkim:fremd-alert";
  var EVENT_SIEGEL_CERTIFIED = "sbkim:siegel-certified";

  // Slot-IDs (Karte 17 § Vier-Slot-Layout).
  var ALL_SLOTS = ["lebt", "verkehr", "fremd", "siegel"];
  var SLOT_LABELS = {
    lebt:    "LEBT",
    verkehr: "VERKEHR",
    fremd:   "FREMD",
    siegel:  "SIEGEL",
  };

  // Proxy-IDs für Modal-Bridge (Brief § Modal-Bridge Option 1).
  var PROXY_LAMP_FREMD_ID = "lamp-fremd";
  var PROXY_SIEGEL_BADGE_ID = "sbkim-siegel-badge";

  // Erlaubte Corner-Werte (Karte 17 § Schnittstelle).
  var ALLOWED_CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"];
  var ALLOWED_THEMES = ["auto", "dark", "light"];

  // ---- Modul-Zustand (Closure) ----

  var ready = false;
  var widgetRoot = null;
  var styleElement = null;
  var enabledSlots = ALL_SLOTS.slice();
  var slotElements = {};       // slotId → DOM-Element (oder null)
  var siegelMounted = false;
  var firstBootShown = false;

  // Position + Sichtbarkeit (localStorage-persistiert).
  var currentCorner = DEFAULT_CORNER;
  var currentOffsetX = DEFAULT_OFFSET.x;
  var currentOffsetY = DEFAULT_OFFSET.y;
  var currentFreeX = null;     // wenn Free-Drag aktiv: abs. px von links
  var currentFreeY = null;     // wenn Free-Drag aktiv: abs. px von oben
  var visibleFlag = true;

  // Options aus init().
  var optAllowClose = true;
  var optAllowDrag = true;
  var optRememberHidden = true;
  var optZIndex = DEFAULT_Z_INDEX;
  var optTheme = "auto";

  // VERKEHR-Mini-Log (RAM-only FIFO 10).
  var trafficLog = [];

  // Event-Counts (für _meta-Anker).
  var eventCounts = {
    alive: 0,
    handshake: 0,
    postmessage: 0,
    fremdAlert: 0,
    siegelCertified: 0,
  };

  // Listener-Referenzen (für sauberes Re-Init).
  var listeners = {};
  var pulseTimers = {};        // slotId → setTimeout-Handle
  var dragState = null;        // {pointerId, startX, startY, origX, origY, moved}
  var verkehrModalEl = null;
  var lebtModalEl = null;
  var lebtUptimeTimer = null;
  var lastShowWarnAt = 0;
  var mountObserver = null;
  var mountObserverTimeoutId = null;
  var lebtSince = null;        // ISO-String, aus sbkim:alive
  var lebtNodeIdPrefix = null; // Erste 12 Zeichen
  var siegelCertifiedAt = null;
  var siegelRepoUrl = null;
  var fremdBufferSize = 0;

  // ---- Hilfsfunktionen ----

  function warn(message, cause) {
    if (typeof console !== "undefined" && console.warn) {
      if (cause !== undefined) console.warn("[SbkimWidget] " + message, cause);
      else console.warn("[SbkimWidget] " + message);
    }
  }

  function safeGetLocalStorage() {
    try {
      return global.localStorage || null;
    } catch (_e) {
      return null;
    }
  }

  function lsGet(key) {
    var ls = safeGetLocalStorage();
    if (!ls) return null;
    try { return ls.getItem(key); }
    catch (_e) { return null; }
  }

  function lsSet(key, value) {
    var ls = safeGetLocalStorage();
    if (!ls) return;
    try { ls.setItem(key, value); }
    catch (_e) { /* fail-soft (Quota, Inkognito) */ }
  }

  function loadVisibleFromLs() {
    if (!optRememberHidden) {
      visibleFlag = true;
      return;
    }
    var raw = lsGet(LS_KEY_VISIBLE);
    if (raw === "false") visibleFlag = false;
    else visibleFlag = true;
  }

  function persistVisible() {
    if (!optRememberHidden) return;
    lsSet(LS_KEY_VISIBLE, visibleFlag ? "true" : "false");
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
    } catch (_e) {
      /* fail-soft — defekter localStorage-Eintrag, Defaults bleiben */
    }
  }

  function persistPosition() {
    var snap = buildPositionSnapshot();
    try {
      lsSet(LS_KEY_POSITION, JSON.stringify(snap));
    } catch (_e) { /* fail-soft */ }
  }

  function buildPositionSnapshot() {
    return {
      corner:  currentCorner,
      offsetX: currentOffsetX,
      offsetY: currentOffsetY,
      x:       currentFreeX,
      y:       currentFreeY,
    };
  }

  function applyPositionToRoot() {
    if (!widgetRoot) return;
    // Reset alle Position-Properties zuerst.
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
    if (corner === "top-left")     { widgetRoot.style.top = oy + "px"; widgetRoot.style.left = ox + "px"; }
    else if (corner === "top-right")    { widgetRoot.style.top = oy + "px"; widgetRoot.style.right = ox + "px"; }
    else if (corner === "bottom-left")  { widgetRoot.style.bottom = oy + "px"; widgetRoot.style.left = ox + "px"; }
    else                                { widgetRoot.style.bottom = oy + "px"; widgetRoot.style.right = ox + "px"; }
  }

  // ---- CSS-Injektion ----

  function buildCss() {
    return [
      "/* SBKIM Modul 17 Floating-Widget — Standalone-CSS (Bau-Sitzung 17). */",
      ":root, .sbkim-widget {",
      "  --sbkim-widget-bg: rgba(20, 20, 30, 0.85);",
      "  --sbkim-widget-fg: #F5F5FF;",
      "  --sbkim-widget-fg-dim: rgba(245, 245, 255, 0.55);",
      "  --sbkim-widget-line: rgba(255, 255, 255, 0.18);",
      "  --sbkim-widget-accent-green: #16A34A;",
      "  --sbkim-widget-accent-gold: #C9A961;",
      "  --sbkim-widget-accent-red: #DC2626;",
      "  --sbkim-widget-slot-bg: rgba(255, 255, 255, 0.05);",
      "  --sbkim-widget-pulse-ms: 600ms;",
      "}",
      "#" + WIDGET_ID + " {",
      "  position: fixed;",
      "  z-index: " + optZIndex + ";",
      "  background: var(--sbkim-widget-bg);",
      "  color: var(--sbkim-widget-fg);",
      "  border: 1px solid var(--sbkim-widget-line);",
      "  border-radius: 12px;",
      "  padding: 8px 8px 8px 8px;",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 4px;",
      "  font-family: 'Geist', system-ui, sans-serif;",
      "  font-size: 0.78rem;",
      "  user-select: none;",
      "  -webkit-user-select: none;",
      "  touch-action: none;",
      "  backdrop-filter: blur(8px);",
      "  -webkit-backdrop-filter: blur(8px);",
      "  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);",
      "}",
      "#" + WIDGET_ID + ".sbkim-widget-hidden { display: none; }",
      "#" + WIDGET_ID + ".sbkim-widget-dragging {",
      "  cursor: grabbing;",
      "  transform: scale(1.03);",
      "  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);",
      "}",
      "#" + WIDGET_ID + " .sbkim-widget-proxy {",
      "  position: absolute;",
      "  width: 1px;",
      "  height: 1px;",
      "  visibility: hidden;",
      "  pointer-events: none;",
      "  overflow: hidden;",
      "}",
      ".sbkim-widget-slot {",
      "  width: 40px;",
      "  height: 40px;",
      "  border-radius: 50%;",
      "  background: var(--sbkim-widget-slot-bg);",
      "  border: 1px solid var(--sbkim-widget-line);",
      "  color: var(--sbkim-widget-fg-dim);",
      "  cursor: pointer;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  font-size: 0.62rem;",
      "  font-weight: 500;",
      "  font-family: 'Geist Mono', ui-monospace, monospace;",
      "  letter-spacing: 0.02em;",
      "  padding: 0;",
      "  outline: none;",
      "  transition: background 0.18s, color 0.18s, transform 0.12s;",
      "}",
      ".sbkim-widget-slot:hover { transform: scale(1.06); }",
      ".sbkim-widget-slot:focus-visible { outline: 1px solid var(--sbkim-widget-accent-gold); outline-offset: 2px; }",
      ".sbkim-widget-slot.lebt.active {",
      "  background: rgba(22, 163, 74, 0.18);",
      "  color: var(--sbkim-widget-accent-green);",
      "  border-color: rgba(22, 163, 74, 0.55);",
      "  animation: sbkim-widget-lebt-pulse 2.2s ease-in-out infinite;",
      "}",
      ".sbkim-widget-slot.verkehr.active {",
      "  background: rgba(201, 169, 97, 0.10);",
      "  color: var(--sbkim-widget-accent-gold);",
      "  border-color: rgba(201, 169, 97, 0.45);",
      "}",
      ".sbkim-widget-slot.verkehr.verkehr-pulse {",
      "  animation: sbkim-widget-verkehr-pulse var(--sbkim-widget-pulse-ms) ease-out;",
      "}",
      ".sbkim-widget-slot.fremd.active, .sbkim-widget-slot.fremd.fremd-alert {",
      "  background: rgba(220, 38, 38, 0.18);",
      "  color: var(--sbkim-widget-accent-red);",
      "  border-color: rgba(220, 38, 38, 0.55);",
      "  box-shadow: 0 0 8px rgba(220, 38, 38, 0.5);",
      "}",
      ".sbkim-widget-slot.fremd.fremd-pulse {",
      "  animation: sbkim-widget-fremd-pulse var(--sbkim-widget-pulse-ms) ease-out;",
      "}",
      ".sbkim-widget-slot.siegel {",
      "  background: linear-gradient(180deg, #FFE066 0%, #C9A961 50%, #A67C00 100%);",
      "  color: #1A1306;",
      "  border-color: rgba(201, 169, 97, 0.75);",
      "  font-weight: 600;",
      "}",
      ".sbkim-widget-slot.siegel.siegel-first-boot {",
      "  animation: sbkim-widget-siegel-first-boot 600ms ease-out;",
      "}",
      "@keyframes sbkim-widget-lebt-pulse {",
      "  0%, 100% { opacity: 1; }",
      "  50% { opacity: 0.62; }",
      "}",
      "@keyframes sbkim-widget-verkehr-pulse {",
      "  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(201, 169, 97, 0.7); }",
      "  100% { transform: scale(1); box-shadow: 0 0 0 12px rgba(201, 169, 97, 0); }",
      "}",
      "@keyframes sbkim-widget-fremd-pulse {",
      "  0% { box-shadow: 0 0 8px rgba(220, 38, 38, 0.5); }",
      "  50% { box-shadow: 0 0 18px rgba(220, 38, 38, 0.9); }",
      "  100% { box-shadow: 0 0 8px rgba(220, 38, 38, 0.5); }",
      "}",
      "@keyframes sbkim-widget-siegel-first-boot {",
      "  0% { transform: scale(0.7); opacity: 0; }",
      "  60% { transform: scale(1.15); opacity: 1; }",
      "  100% { transform: scale(1); opacity: 1; }",
      "}",
      "#" + WIDGET_ID + " .sbkim-widget-close {",
      "  position: absolute;",
      "  top: -8px;",
      "  right: -8px;",
      "  width: 18px;",
      "  height: 18px;",
      "  border-radius: 50%;",
      "  background: rgba(40, 40, 50, 0.95);",
      "  color: var(--sbkim-widget-fg);",
      "  border: 1px solid var(--sbkim-widget-line);",
      "  cursor: pointer;",
      "  font-size: 0.6rem;",
      "  line-height: 1;",
      "  padding: 0;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  opacity: 0.6;",
      "  transition: opacity 0.18s;",
      "}",
      "#" + WIDGET_ID + " .sbkim-widget-close:hover { opacity: 1; }",
      ".sbkim-widget-modal {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 9999;",
      "  display: none;",
      "  align-items: center;",
      "  justify-content: center;",
      "  font-family: 'Geist', system-ui, sans-serif;",
      "}",
      ".sbkim-widget-modal[data-open=\"true\"] { display: flex; }",
      ".sbkim-widget-modal-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "  background: rgba(0, 0, 0, 0.62);",
      "}",
      ".sbkim-widget-modal-panel {",
      "  position: relative;",
      "  background: #10102A;",
      "  color: #F5F5FF;",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  border-radius: 12px;",
      "  padding: 1.2rem 1.4rem;",
      "  max-width: min(540px, 92vw);",
      "  max-height: 80vh;",
      "  overflow: auto;",
      "  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);",
      "}",
      ".sbkim-widget-modal-header {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 0.8rem;",
      "  margin-bottom: 0.9rem;",
      "}",
      ".sbkim-widget-modal-title {",
      "  margin: 0;",
      "  font-size: 1rem;",
      "  font-weight: 600;",
      "  flex: 1;",
      "}",
      ".sbkim-widget-modal-close {",
      "  background: transparent;",
      "  color: #F5F5FF;",
      "  border: 1px solid rgba(255, 255, 255, 0.18);",
      "  border-radius: 8px;",
      "  padding: 0.25rem 0.6rem;",
      "  cursor: pointer;",
      "}",
      ".sbkim-widget-traffic-table {",
      "  width: 100%;",
      "  border-collapse: collapse;",
      "  font-size: 0.78rem;",
      "  font-family: 'Geist Mono', ui-monospace, monospace;",
      "}",
      ".sbkim-widget-traffic-table th,",
      ".sbkim-widget-traffic-table td {",
      "  text-align: left;",
      "  padding: 0.3rem 0.4rem;",
      "  border-bottom: 1px solid rgba(255, 255, 255, 0.08);",
      "}",
      ".sbkim-widget-lebt-grid {",
      "  display: grid;",
      "  grid-template-columns: max-content 1fr;",
      "  gap: 0.4rem 0.9rem;",
      "  font-size: 0.86rem;",
      "  font-family: 'Geist Mono', ui-monospace, monospace;",
      "}",
      ".sbkim-widget-lebt-grid dt { color: var(--sbkim-widget-fg-dim, rgba(245,245,255,0.55)); }",
      ".sbkim-widget-lebt-grid dd { margin: 0; }",
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

  function buildSlotButton(doc, slotId) {
    var btn = doc.createElement("button");
    btn.type = "button";
    btn.id = "sbkim-widget-slot-" + slotId;
    btn.className = "sbkim-widget-slot " + slotId;
    btn.setAttribute("data-slot", slotId);
    btn.setAttribute("aria-label", SLOT_LABELS[slotId] + "-Slot");
    btn.title = SLOT_LABELS[slotId];
    btn.textContent = SLOT_LABELS[slotId].slice(0, 3); // erste drei Buchstaben als Glyph
    return btn;
  }

  function buildProxyContainer(doc) {
    var proxy = doc.createElement("div");
    proxy.className = "sbkim-widget-proxy";
    proxy.setAttribute("aria-hidden", "true");
    // Brief § Modal-Bridge Option 1: Widget legt unsichtbare Spans
    // <span id="lamp-fremd"> + <span id="sbkim-siegel-badge"> in seinem
    // Inneren an. Modul 15/16 attachen ihre Click-Handler dort, sobald
    // ihre init() läuft. Voraussetzung: SbkimWidget.init() läuft VOR
    // SbkimMembrane.init() / SbkimSiegel.init() im Endknoten.
    var fremdSpan = doc.createElement("span");
    fremdSpan.id = PROXY_LAMP_FREMD_ID;
    proxy.appendChild(fremdSpan);
    var siegelSpan = doc.createElement("span");
    siegelSpan.id = PROXY_SIEGEL_BADGE_ID;
    proxy.appendChild(siegelSpan);
    return proxy;
  }

  function buildWidget(doc) {
    var root = doc.createElement("div");
    root.id = WIDGET_ID;
    root.className = "sbkim-widget";
    root.setAttribute("role", "complementary");
    root.setAttribute("aria-label", "SBKIM Live-Status-Widget");

    // X-Knopf (nur wenn optAllowClose).
    if (optAllowClose) {
      var closeBtn = doc.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "sbkim-widget-close";
      closeBtn.setAttribute("aria-label", "Widget schließen");
      closeBtn.title = "Schließen — wiederherstellbar via SbkimWidget.show()";
      closeBtn.textContent = "✕";
      closeBtn.addEventListener("click", function (ev) {
        if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
        hide();
      });
      root.appendChild(closeBtn);
    }

    // Slots in der Reihenfolge ALL_SLOTS, gefiltert via enabledSlots.
    slotElements = {};
    for (var i = 0; i < ALL_SLOTS.length; i++) {
      var slotId = ALL_SLOTS[i];
      if (enabledSlots.indexOf(slotId) < 0) {
        slotElements[slotId] = null;
        continue;
      }
      // SIEGEL nur, wenn schon zertifiziert beim init-Zeitpunkt.
      // Sonst wartet siegel auf sbkim:siegel-certified-Event.
      if (slotId === "siegel") {
        if (!isSiegelCertifiedNow()) {
          slotElements[slotId] = null;
          continue;
        }
        var siegelBtn = buildSlotButton(doc, slotId);
        attachSlotClick(siegelBtn, slotId);
        root.appendChild(siegelBtn);
        slotElements[slotId] = siegelBtn;
        siegelMounted = true;
        continue;
      }
      var btn = buildSlotButton(doc, slotId);
      attachSlotClick(btn, slotId);
      root.appendChild(btn);
      slotElements[slotId] = btn;
    }

    // Proxy-Container für #lamp-fremd / #sbkim-siegel-badge.
    root.appendChild(buildProxyContainer(doc));

    // Drag-Handler (wenn allowDrag).
    if (optAllowDrag) {
      attachDragHandlers(root);
    }

    return root;
  }

  function attachSlotClick(btn, slotId) {
    btn.addEventListener("click", function (ev) {
      // Drag-Threshold: wenn ein Drag stattfand, NICHT als Click werten.
      if (dragState && dragState.moved) return;
      if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
      handleSlotClick(slotId);
    });
  }

  // ---- Slot-Klick-Verhalten ----

  function handleSlotClick(slotId) {
    if (slotId === "lebt") {
      openLebtModal();
      return;
    }
    if (slotId === "verkehr") {
      openVerkehrModal();
      return;
    }
    if (slotId === "fremd") {
      proxyClickModalBridge(PROXY_LAMP_FREMD_ID, "Modul 15 (Fremdzugriff)");
      return;
    }
    if (slotId === "siegel") {
      proxyClickModalBridge(PROXY_SIEGEL_BADGE_ID, "Modul 16 (SBKIM-Siegel)");
      return;
    }
  }

  function proxyClickModalBridge(elementId, moduleHint) {
    var doc = global.document;
    if (!doc || typeof doc.querySelectorAll !== "function") {
      warn("document fehlt — Modal-Bridge no-op.");
      return;
    }
    // Suche das #-Element. Bevorzuge ein Element AUSSERHALB des Widgets
    // (echte Sage-Page-Lampe / Modul-15-Modal-Anker), fall back auf das
    // Widget-interne Proxy-Element. So funktioniert die Bridge sowohl
    // im Sage-Page-Setup (echtes #lamp-fremd in Navleiste) als auch im
    // Endknoten-Setup (Proxy-Span im Widget, Modul 15 hat dort
    // Click-Handler attached).
    var candidates = doc.querySelectorAll("#" + elementId);
    var target = null;
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (widgetRoot && widgetRoot.contains(c)) continue;
      target = c;
      break;
    }
    if (!target) {
      // Fallback: Widget-internes Proxy-Element.
      target = doc.getElementById(elementId);
    }
    if (!target) {
      warn("Modal-Bridge no-op: #" + elementId + " nicht im DOM (" + moduleHint + " nicht gemountet?).");
      return;
    }
    try {
      if (typeof target.click === "function") {
        target.click();
      } else if (doc.createEvent) {
        var ev = doc.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        target.dispatchEvent(ev);
      }
    } catch (err) {
      warn("Modal-Bridge click fehlgeschlagen für #" + elementId, err);
    }
  }

  // ---- Drag-Mechanik ----

  function attachDragHandlers(root) {
    // Pointer-Events: Touch + Maus vereinheitlicht.
    root.addEventListener("pointerdown", onPointerDown);
  }

  function onPointerDown(ev) {
    if (!optAllowDrag || !widgetRoot) return;
    // Drag nur, wenn der Klick AUSSERHALB der Slots landet (Klaus-
    // Entscheidung Bau-Sitzung 17: gesamte Pille drag-fähig außerhalb
    // der Slots, weniger DOM-Komplexität als eigener Drag-Griff).
    var target = ev.target;
    if (target && (target.classList && target.classList.contains("sbkim-widget-slot"))) {
      return;
    }
    if (target && target.classList && target.classList.contains("sbkim-widget-close")) {
      return;
    }
    var rect = widgetRoot.getBoundingClientRect();
    dragState = {
      pointerId: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      origLeft: rect.left,
      origTop: rect.top,
      moved: false,
    };
    try { widgetRoot.setPointerCapture(ev.pointerId); }
    catch (_e) { /* fail-soft: manche Browser werfen */ }
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
      try { widgetRoot.classList.add("sbkim-widget-dragging"); }
      catch (_e) { /* nb */ }
    }
    try {
      var newX = dragState.origLeft + dx;
      var newY = dragState.origTop + dy;
      // Verhindern, dass das Widget komplett aus dem Viewport rutscht.
      var vw = global.innerWidth || 1024;
      var vh = global.innerHeight || 768;
      var rect = widgetRoot.getBoundingClientRect();
      var minX = -rect.width + 24;          // 24 px immer sichtbar
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
      // Drag-Pointer-Event-Fehler (Karte 17 § Fehlerverhalten): Drag
      // abbrechen, Position springt zurück zur Last-Known-Good (durch
      // den nächsten applyPositionToRoot-Aufruf in onPointerUp).
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
      try { widgetRoot.classList.remove("sbkim-widget-dragging"); }
      catch (_e) { /* nb */ }
      widgetRoot.removeEventListener("pointermove", onPointerMove);
      widgetRoot.removeEventListener("pointerup", onPointerUp);
      widgetRoot.removeEventListener("pointercancel", onPointerUp);
    }
    if (moved) {
      persistPosition();
    }
    // Nach kurzer Verzögerung dragState zurücksetzen, damit der pending
    // Click-Handler den `moved`-Flag noch lesen kann.
    var consumed = dragState;
    setTimeout(function () {
      if (dragState === consumed) dragState = null;
    }, 0);
  }

  // ---- Mount in body (mit MutationObserver-Fallback analog Modul 00/16) ----

  function mountWidget() {
    var doc = global.document;
    if (!doc) {
      warn("document fehlt — Widget kann nicht gemountet werden.");
      return;
    }
    injectStyle(doc);
    if (!doc.body) {
      setupMountObserver(doc);
      return;
    }
    if (widgetRoot && widgetRoot.parentNode === doc.body) return; // idempotent
    if (widgetRoot && widgetRoot.parentNode) {
      try { widgetRoot.parentNode.removeChild(widgetRoot); }
      catch (_e) { /* nb */ }
    }
    widgetRoot = buildWidget(doc);
    doc.body.appendChild(widgetRoot);
    applyPositionToRoot();
    applyVisibility();
    applySlotActiveStatesFromCounts();
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
      if (doc.body) {
        disconnectMountObserver();
        mountWidget();
      }
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
        warn("document.body auch nach " + MOUNT_OBSERVER_TIMEOUT_MS + " ms nicht erschienen — Widget-Mount übersprungen.");
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
    if (visibleFlag) widgetRoot.classList.remove("sbkim-widget-hidden");
    else widgetRoot.classList.add("sbkim-widget-hidden");
  }

  function applySlotActiveStatesFromCounts() {
    // Wenn Widget nach init() neu gemountet wird (z.B. via show() nach
    // hide()), zeigt die aktuelle counts-Map welche Slots aktiv sind.
    if (eventCounts.alive > 0) setSlotActive("lebt", true);
    if (eventCounts.handshake + eventCounts.postmessage > 0) setSlotActive("verkehr", true);
    if (fremdBufferSize > 0) setSlotActive("fremd", true);
  }

  function setSlotActive(slotId, active) {
    var el = slotElements[slotId];
    if (!el) return;
    if (active) el.classList.add("active");
    else el.classList.remove("active");
  }

  function pulseSlot(slotId, pulseClass, durationMs) {
    var el = slotElements[slotId];
    if (!el) return;
    try {
      el.classList.remove(pulseClass);
      void el.offsetWidth; // reflow → Animation neu starten
      el.classList.add(pulseClass);
      if (pulseTimers[slotId]) clearTimeout(pulseTimers[slotId]);
      pulseTimers[slotId] = setTimeout(function () {
        if (el && el.classList) {
          try { el.classList.remove(pulseClass); }
          catch (_e) { /* nb */ }
        }
        pulseTimers[slotId] = null;
      }, durationMs);
    } catch (err) {
      warn("pulseSlot fehlgeschlagen (" + slotId + ").", err);
    }
  }

  // ---- Event-Listener (window) ----

  function registerEventListeners() {
    if (listeners.alive) return; // idempotent
    listeners.alive = function (ev) { onAlive(ev); };
    listeners.handshake = function (ev) { onHandshake(ev); };
    listeners.postmessage = function (ev) { onPostmessage(ev); };
    listeners.fremdAlert = function (ev) { onFremdAlert(ev); };
    listeners.siegelCertified = function (ev) { onSiegelCertified(ev); };
    try {
      global.addEventListener(EVENT_ALIVE, listeners.alive);
      global.addEventListener(EVENT_HANDSHAKE, listeners.handshake);
      global.addEventListener(EVENT_POSTMESSAGE, listeners.postmessage);
      global.addEventListener(EVENT_FREMD_ALERT, listeners.fremdAlert);
      global.addEventListener(EVENT_SIEGEL_CERTIFIED, listeners.siegelCertified);
    } catch (err) {
      warn("Event-Listener-Registrierung fehlgeschlagen — Widget bleibt passiv.", err);
    }
  }

  function onAlive(ev) {
    eventCounts.alive += 1;
    var detail = (ev && ev.detail) || {};
    if (typeof detail.since === "string") lebtSince = detail.since;
    if (typeof detail.nodeId === "string") lebtNodeIdPrefix = detail.nodeId.slice(0, 12);
    setSlotActive("lebt", true);
  }

  function onHandshake(ev) {
    eventCounts.handshake += 1;
    var detail = (ev && ev.detail) || {};
    var entry = {
      at:        nowIso(),
      source:    "handshake",
      direction: typeof detail.direction === "string" ? detail.direction : "outgoing",
      decision:  typeof detail.outcome === "string" ? detail.outcome : "",
    };
    pushTrafficLog(entry);
    setSlotActive("verkehr", true);
    pulseSlot("verkehr", "verkehr-pulse", VERKEHR_PULSE_MS);
    refreshVerkehrModalIfOpen();
  }

  function onPostmessage(ev) {
    eventCounts.postmessage += 1;
    var detail = (ev && ev.detail) || {};
    var entry = {
      at:        nowIso(),
      source:    "postmessage",
      direction: typeof detail.direction === "string" ? detail.direction : "incoming",
      decision:  typeof detail.decision === "string" ? detail.decision : "",
    };
    pushTrafficLog(entry);
    setSlotActive("verkehr", true);
    pulseSlot("verkehr", "verkehr-pulse", VERKEHR_PULSE_MS);
    refreshVerkehrModalIfOpen();
  }

  function onFremdAlert(ev) {
    eventCounts.fremdAlert += 1;
    var detail = (ev && ev.detail) || {};
    if (typeof detail.bufferSize === "number" && isFinite(detail.bufferSize)) {
      fremdBufferSize = detail.bufferSize;
    } else {
      // Schema-Check fail-soft: ohne bufferSize-Feld bleibt der Slot grau.
      // (Karte 17 § Fehlerverhalten "fremd-alert ohne bufferSize → Slot
      // bleibt grau".) Wir zählen den Event trotzdem.
      return;
    }
    if (fremdBufferSize > 0) {
      setSlotActive("fremd", true);
      pulseSlot("fremd", "fremd-pulse", FREMD_PULSE_MS);
    } else {
      setSlotActive("fremd", false);
    }
  }

  function onSiegelCertified(ev) {
    var detail = (ev && ev.detail) || {};
    // Anti-Greenwashing binär: erst prüfen, ob das Modul 16 wirklich
    // certified meldet (defensive Doppel-Prüfung — Spec-Mandat).
    var siegel = global.SbkimSiegel;
    if (!siegel || typeof siegel.isCertified !== "function" || siegel.isCertified() !== true) {
      warn("sbkim:siegel-certified empfangen, aber SbkimSiegel.isCertified()!==true — Anti-Greenwashing-Klausel: kein DOM-Render.");
      return;
    }
    eventCounts.siegelCertified += 1;
    if (typeof detail.certifiedAt === "string") siegelCertifiedAt = detail.certifiedAt;
    if (typeof detail.repoUrl === "string") siegelRepoUrl = detail.repoUrl;
    mountSiegelSlot();
  }

  function mountSiegelSlot() {
    if (siegelMounted) return;
    if (enabledSlots.indexOf("siegel") < 0) return;
    if (!widgetRoot) return;
    var doc = global.document;
    if (!doc) return;
    var btn = buildSlotButton(doc, "siegel");
    attachSlotClick(btn, "siegel");
    // Einfügen vor dem Proxy-Container (am Ende der Slot-Reihe).
    var proxy = widgetRoot.querySelector(".sbkim-widget-proxy");
    if (proxy && proxy.parentNode === widgetRoot) {
      widgetRoot.insertBefore(btn, proxy);
    } else {
      widgetRoot.appendChild(btn);
    }
    slotElements.siegel = btn;
    siegelMounted = true;
    // First-Boot-Animation (analog Modul 16 § Sub (b)).
    if (!firstBootShown) {
      try {
        btn.classList.add("siegel-first-boot");
        setTimeout(function () {
          try { btn.classList.remove("siegel-first-boot"); }
          catch (_e) { /* nb */ }
        }, FIRST_BOOT_ANIMATION_MS);
      } catch (err) {
        warn("Siegel-First-Boot-Animation fehlgeschlagen.", err);
      }
      firstBootShown = true;
    }
  }

  function isSiegelCertifiedNow() {
    var siegel = global.SbkimSiegel;
    if (!siegel || typeof siegel.isCertified !== "function") return false;
    try { return siegel.isCertified() === true; }
    catch (_e) { return false; }
  }

  function nowIso() { return new Date().toISOString(); }

  function pushTrafficLog(entry) {
    trafficLog.push(entry);
    if (trafficLog.length > TRAFFIC_LOG_MAX) {
      trafficLog.splice(0, trafficLog.length - TRAFFIC_LOG_MAX);
    }
  }

  // ---- LEBT-Modal ----

  function ensureLebtModal() {
    var doc = global.document;
    if (!doc || !doc.body) return null;
    if (lebtModalEl && lebtModalEl.parentNode) return lebtModalEl;

    var root = doc.createElement("div");
    root.id = LEBT_MODAL_ID;
    root.className = "sbkim-widget-modal";
    root.setAttribute("aria-hidden", "true");
    root.style.zIndex = String(optZIndex + 9);

    var backdrop = doc.createElement("div");
    backdrop.className = "sbkim-widget-modal-backdrop";
    backdrop.addEventListener("click", closeLebtModal);

    var panel = doc.createElement("div");
    panel.className = "sbkim-widget-modal-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    var header = doc.createElement("div");
    header.className = "sbkim-widget-modal-header";
    var title = doc.createElement("h2");
    title.className = "sbkim-widget-modal-title";
    title.textContent = "LEBT — Page-Status";
    var closeBtn = doc.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "sbkim-widget-modal-close";
    closeBtn.setAttribute("aria-label", "Schließen");
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", closeLebtModal);
    header.appendChild(title);
    header.appendChild(closeBtn);

    var grid = doc.createElement("dl");
    grid.className = "sbkim-widget-lebt-grid";
    grid.setAttribute("data-widget-lebt-grid", "");

    panel.appendChild(header);
    panel.appendChild(grid);

    root.appendChild(backdrop);
    root.appendChild(panel);
    doc.body.appendChild(root);

    lebtModalEl = root;
    return root;
  }

  function openLebtModal() {
    var modal = ensureLebtModal();
    if (!modal) { warn("LEBT-Modal-Mount fehlgeschlagen (document.body fehlt)."); return; }
    renderLebtModalContents();
    modal.setAttribute("data-open", "true");
    modal.setAttribute("aria-hidden", "false");
    // Uptime-Counter aktualisiert jede Sekunde.
    if (lebtUptimeTimer) clearInterval(lebtUptimeTimer);
    lebtUptimeTimer = setInterval(renderLebtModalContents, 1000);
  }

  function closeLebtModal() {
    if (!lebtModalEl) return;
    lebtModalEl.removeAttribute("data-open");
    lebtModalEl.setAttribute("aria-hidden", "true");
    if (lebtUptimeTimer) { clearInterval(lebtUptimeTimer); lebtUptimeTimer = null; }
  }

  function renderLebtModalContents() {
    if (!lebtModalEl) return;
    var doc = global.document;
    var grid = lebtModalEl.querySelector("[data-widget-lebt-grid]");
    if (!grid) return;
    grid.textContent = "";
    var spore = global.SbkimSpore;
    var moduleReady = !!(spore && spore._meta && typeof spore._meta === "object");
    var uptimeText = "—";
    if (lebtSince) {
      try {
        var start = new Date(lebtSince).getTime();
        var now = Date.now();
        if (isFinite(start) && now >= start) {
          uptimeText = formatUptime(now - start);
        }
      } catch (_e) { /* nb */ }
    }
    var rows = [
      ["Uptime",          uptimeText],
      ["Modul-02 init",   moduleReady ? "ja" : "nein"],
      ["nodeId-Präfix",   lebtNodeIdPrefix || "—"],
      ["Events:alive",    String(eventCounts.alive)],
      ["since (ISO)",     lebtSince || "—"],
    ];
    for (var i = 0; i < rows.length; i++) {
      var dt = doc.createElement("dt");
      dt.textContent = rows[i][0];
      var dd = doc.createElement("dd");
      dd.textContent = rows[i][1];
      grid.appendChild(dt);
      grid.appendChild(dd);
    }
  }

  function formatUptime(ms) {
    var sec = Math.floor(ms / 1000);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    if (h > 0) return h + "h " + pad(m) + "m " + pad(s) + "s";
    if (m > 0) return m + "m " + pad(s) + "s";
    return s + "s";
  }

  // ---- VERKEHR-Modal ----

  function ensureVerkehrModal() {
    var doc = global.document;
    if (!doc || !doc.body) return null;
    if (verkehrModalEl && verkehrModalEl.parentNode) return verkehrModalEl;

    var root = doc.createElement("div");
    root.id = VERKEHR_MODAL_ID;
    root.className = "sbkim-widget-modal";
    root.setAttribute("aria-hidden", "true");
    root.style.zIndex = String(optZIndex + 9);

    var backdrop = doc.createElement("div");
    backdrop.className = "sbkim-widget-modal-backdrop";
    backdrop.addEventListener("click", closeVerkehrModal);

    var panel = doc.createElement("div");
    panel.className = "sbkim-widget-modal-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    var header = doc.createElement("div");
    header.className = "sbkim-widget-modal-header";
    var title = doc.createElement("h2");
    title.className = "sbkim-widget-modal-title";
    title.textContent = "VERKEHR — letzte " + TRAFFIC_LOG_MAX + " Events";
    var closeBtn = doc.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "sbkim-widget-modal-close";
    closeBtn.setAttribute("aria-label", "Schließen");
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", closeVerkehrModal);
    header.appendChild(title);
    header.appendChild(closeBtn);

    var table = doc.createElement("table");
    table.className = "sbkim-widget-traffic-table";
    table.innerHTML =
      "<thead><tr>" +
      "<th>Zeit</th><th>Quelle</th><th>Richtung</th><th>Entscheidung</th>" +
      "</tr></thead><tbody data-widget-verkehr-tbody></tbody>";

    var tip = doc.createElement("p");
    tip.textContent = "RAM-only FIFO — Tab-Reload leert die Liste.";
    tip.style.cssText = "margin: 0.9rem 0 0; font-size: 0.78rem; color: rgba(245,245,255,0.55);";

    panel.appendChild(header);
    panel.appendChild(table);
    panel.appendChild(tip);

    root.appendChild(backdrop);
    root.appendChild(panel);
    doc.body.appendChild(root);

    verkehrModalEl = root;
    return root;
  }

  function openVerkehrModal() {
    var modal = ensureVerkehrModal();
    if (!modal) { warn("VERKEHR-Modal-Mount fehlgeschlagen (document.body fehlt)."); return; }
    renderVerkehrModalContents();
    modal.setAttribute("data-open", "true");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeVerkehrModal() {
    if (!verkehrModalEl) return;
    verkehrModalEl.removeAttribute("data-open");
    verkehrModalEl.setAttribute("aria-hidden", "true");
  }

  function refreshVerkehrModalIfOpen() {
    if (!verkehrModalEl) return;
    if (verkehrModalEl.getAttribute("data-open") !== "true") return;
    renderVerkehrModalContents();
  }

  function renderVerkehrModalContents() {
    if (!verkehrModalEl) return;
    var doc = global.document;
    var tbody = verkehrModalEl.querySelector("[data-widget-verkehr-tbody]");
    if (!tbody) return;
    tbody.textContent = "";
    for (var i = 0; i < trafficLog.length; i++) {
      var entry = trafficLog[i];
      var tr = doc.createElement("tr");
      var cells = [entry.at, entry.source, entry.direction, entry.decision];
      for (var c = 0; c < cells.length; c++) {
        var td = doc.createElement("td");
        td.textContent = cells[c];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }

  // Globaler Esc-Handler — schließt alle offenen Widget-Modals.
  function onGlobalKeydown(ev) {
    if (!ev || ev.key !== "Escape") return;
    if (lebtModalEl && lebtModalEl.getAttribute("data-open") === "true") closeLebtModal();
    if (verkehrModalEl && verkehrModalEl.getAttribute("data-open") === "true") closeVerkehrModal();
  }

  // ---- init / show / hide ----

  function parseOptions(options) {
    var opts = (options && typeof options === "object") ? options : {};

    if (typeof opts.zIndex === "number" && isFinite(opts.zIndex)) {
      optZIndex = opts.zIndex;
    }
    if (opts.allowClose === false) optAllowClose = false;
    else optAllowClose = true;
    if (opts.allowDrag === false) optAllowDrag = false;
    else optAllowDrag = true;
    if (opts.rememberHidden === false) optRememberHidden = false;
    else optRememberHidden = true;

    if (typeof opts.theme === "string" && ALLOWED_THEMES.indexOf(opts.theme) >= 0) {
      optTheme = opts.theme;
    }

    if (Array.isArray(opts.slots) && opts.slots.length > 0) {
      var filtered = [];
      for (var i = 0; i < opts.slots.length; i++) {
        var s = opts.slots[i];
        if (typeof s === "string" && ALL_SLOTS.indexOf(s) >= 0 && filtered.indexOf(s) < 0) {
          filtered.push(s);
        }
      }
      if (filtered.length > 0) enabledSlots = filtered;
    } else {
      enabledSlots = ALL_SLOTS.slice();
    }

    // Default-Position aus options übernehmen (wenn kein localStorage-Wert).
    if (typeof opts.defaultCorner === "string" && ALLOWED_CORNERS.indexOf(opts.defaultCorner) >= 0) {
      currentCorner = opts.defaultCorner;
    }
    if (opts.defaultOffset && typeof opts.defaultOffset === "object") {
      if (typeof opts.defaultOffset.x === "number") currentOffsetX = opts.defaultOffset.x;
      if (typeof opts.defaultOffset.y === "number") currentOffsetY = opts.defaultOffset.y;
    }
    // allowedOrigins + repoUrl sind reine Doku-Spiegelung (Karte 17 §
    // Schnittstelle): NICHT durchgereicht an Modul 15/16; Andocker
    // initialisiert die Backends explizit.
  }

  function init(options) {
    if (ready) {
      // Idempotenz: zweiter Aufruf no-op (Karte 17 § Fehlerverhalten).
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      try {
        parseOptions(options);
        loadVisibleFromLs();
        loadPositionFromLs();

        mountWidget();
        registerEventListeners();
        try { global.addEventListener("keydown", onGlobalKeydown); }
        catch (_e) { /* nb */ }

        ready = true;
      } catch (err) {
        warn("init fehlgeschlagen — Widget bleibt unmontiert.", err);
      }
      resolve();
    });
  }

  function show() {
    if (!ready) {
      var now = Date.now();
      if (now - lastShowWarnAt > SHOW_WARN_THROTTLE_MS) {
        lastShowWarnAt = now;
        warn("show() vor init() — no-op. Erst SbkimWidget.init() aufrufen.");
      }
      return;
    }
    visibleFlag = true;
    persistVisible();
    applyVisibility();
  }

  function hide() {
    if (!ready) {
      var now = Date.now();
      if (now - lastShowWarnAt > SHOW_WARN_THROTTLE_MS) {
        lastShowWarnAt = now;
        warn("hide() vor init() — no-op. Erst SbkimWidget.init() aufrufen.");
      }
      return;
    }
    visibleFlag = false;
    persistVisible();
    applyVisibility();
  }

  function isVisible() {
    if (!widgetRoot) return false;
    try {
      // DOM-State-Wahrheit: Klasse sbkim-widget-hidden steuert display:none.
      return !widgetRoot.classList.contains("sbkim-widget-hidden");
    } catch (_e) {
      return false;
    }
  }

  function getPosition() {
    return buildPositionSnapshot();
  }

  // ---- Public Surface ----

  var SbkimWidget = {
    init:        init,
    show:        show,
    hide:        hide,
    isVisible:   isVisible,
    getPosition: getPosition,
    _meta: {
      widgetId:        WIDGET_ID,
      styleId:         STYLE_ID,
      trafficLogMax:   TRAFFIC_LOG_MAX,
      dragThresholdPx: DRAG_THRESHOLD_PX,
      defaultZIndex:   DEFAULT_Z_INDEX,
      lsKeyVisible:    LS_KEY_VISIBLE,
      lsKeyPosition:   LS_KEY_POSITION,
      events: {
        alive:           EVENT_ALIVE,
        handshake:       EVENT_HANDSHAKE,
        postmessage:     EVENT_POSTMESSAGE,
        fremdAlert:      EVENT_FREMD_ALERT,
        siegelCertified: EVENT_SIEGEL_CERTIFIED,
      },
      get ready()          { return ready; },
      get widgetMounted()  { return !!(widgetRoot && widgetRoot.parentNode); },
      get firstBootShown() { return firstBootShown; },
      get siegelMounted()  { return siegelMounted; },
      get slots()          { return enabledSlots.slice(); },
      get eventCounts()    {
        return {
          alive:           eventCounts.alive,
          handshake:       eventCounts.handshake,
          postmessage:     eventCounts.postmessage,
          fremdAlert:      eventCounts.fremdAlert,
          siegelCertified: eventCounts.siegelCertified,
        };
      },
      get trafficLogSize() { return trafficLog.length; },
      get trafficLogSnapshot() {
        var copy = [];
        for (var i = 0; i < trafficLog.length; i++) {
          copy.push({
            at:        trafficLog[i].at,
            source:    trafficLog[i].source,
            direction: trafficLog[i].direction,
            decision:  trafficLog[i].decision,
          });
        }
        return copy;
      },
      get fremdBufferSize()    { return fremdBufferSize; },
      get lebtSince()          { return lebtSince; },
      get lebtNodeIdPrefix()   { return lebtNodeIdPrefix; },
      get siegelCertifiedAt()  { return siegelCertifiedAt; },
      get siegelRepoUrl()      { return siegelRepoUrl; },
      get visibleFlag()        { return visibleFlag; },
      get optAllowClose()      { return optAllowClose; },
      get optAllowDrag()       { return optAllowDrag; },
      get optRememberHidden()  { return optRememberHidden; },
      get optTheme()           { return optTheme; },
      get zIndex()             { return optZIndex; },
    },
  };

  global.SbkimWidget = SbkimWidget;

  // Self-check (synchron, beim Skript-Laden — vor jedem Aufruf).
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 17 FLOATING-WIDGET bereit, Funktionen: init/show/hide/isVisible/getPosition",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
