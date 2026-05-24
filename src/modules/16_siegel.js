/*
 * SBKIM — Modul 16 — SBKIM-Siegel
 *
 * Self-inscribing-Selbst-Zertifikat einer PWA-Zelle. Bau-Sitzung 16
 * (2026-05-24) implementiert alle vier Sub-Bereiche aus Spec-Sitzung 16:
 *
 *   Sub (a) Selbst-Prüfung — Surface-Check für sieben Pflicht-Module
 *           (01/02/03/04/05/07/15) via typeof globalThis[globalName] +
 *           typeof ns[surfaceFn]==="function". Vier Status-Werte:
 *           "ok" / "deferred" / "missing" / "broken". Snapshot zur
 *           init()-Zeit, gecacht. Re-Init no-op.
 *   Sub (b) Badge-Rendering — rundes 40-px-Medaillon Edel-Gold auf
 *           Bronze-Ink, drei Hyphen-Bögen + Knoten-Punkt-Glyph,
 *           600 ms First-Boot-Animation einmalig pro Session.
 *           Anti-Greenwashing binär: Element wird gar nicht im DOM
 *           angelegt, wenn isCertified()===false.
 *   Sub (c) Erklärungs-Modal — eigenständig in document.body (analog
 *           Modul 15), Titel "SBKIM-Siegel — was bedeutet das?",
 *           Datum + Modul-Liste + Aspekte + zwei Zeilen Aussteller-
 *           Klärung. Backdrop/Esc/✕ schließen.
 *   Sub (d) ZERTIFIKAT_ASPEKTE — Start-Eintrag „Grund-Siegel-Bezeugung
 *           2026-05-24" verbindlich; künftige Sicherheits-Module
 *           ergänzen ihre Aspekt-Einträge per Pflege-PR.
 *
 * DOM-Mount-Variante: Option β (Bau-Sitzung-16-Entscheidung). Der
 * `badgeSelector` zeigt auf einen CONTAINER (Default `.lamps`); der
 * Badge-Span wird via JS darin erzeugt, ausschließlich wenn
 * isCertified()===true. Damit ist die Anti-Greenwashing-Klausel
 * binär erfüllt: kein DOM-Element überhaupt im Negativ-Fall. Wenn
 * der Selektor ein bereits-bestehendes Element matcht (z.B.
 * `#sbkim-siegel-badge` vor-injiziert), wird dieses Element als
 * Anker genutzt; sonst wird darin der Badge-Span erzeugt.
 *
 * Modul 16 ist NICHT protokoll-aktiv: kein Netz, keine Signatur, kein
 * Embedding, kein Handshake. Rein lokales Render-Modul. KEINE
 * benannten Error-Klassen — alle Fehlerpfade fail-soft via
 * console.warn (analog Modul 15).
 *
 * Public surface (registered on window.SbkimSiegel):
 *   init(options?)             -> Promise<void>
 *   isCertified()              -> boolean             (sync)
 *   getExplanation()           -> ExplanationSnapshot (sync, defensive Kopie)
 *   getCertifiedModules()      -> string[]            (sync, defensive Kopie)
 *   getAspects()               -> Aspect[]            (sync, defensive Kopie)
 *   _meta                      -> Read-Anker für Tests
 *
 * options-Form (init):
 *   { badgeSelector?: string,     // Default '.lamps' (Container, Option β)
 *     visible?: "visible"|"hidden", // Default "visible"
 *     mountModal?: boolean,        // Default true
 *     repoUrl?: string | null }    // Default null → Auto-Erkennung
 *
 * Self-check: emits a console.info line on script load (synchronous,
 * before any call). Siehe INTERFACES.md §1 Modul 16 und
 * docs/components/16_siegel.md.
 */
(function (global) {
  "use strict";

  // ---- Pflicht-Modul-Liste (Karte 16 § Sub (a), INTERFACES § 1 Modul 16) ----
  //
  // Sieben Pflicht-Einträge. Code-versioniert, KEINE Runtime-API zum
  // Setzen (Karte 16 § Strikte Tabus). Aktualisierung NUR per Pflege-PR.

  var PFLICHT_MODULE = [
    { id: "01", name: "Storage",    globalName: "SbkimStorage",    surfaceFn: "init",                lazy: false },
    { id: "02", name: "Spore",      globalName: "SbkimSpore",      surfaceFn: "getOwnSpore",         lazy: false },
    { id: "03", name: "Embedding",  globalName: "SbkimEmbedding",  surfaceFn: "embedPassage",        lazy: true  },
    { id: "04", name: "Match",      globalName: "SbkimMatch",      surfaceFn: "match",               lazy: false },
    { id: "05", name: "Anastomose", globalName: "SbkimAnastomose", surfaceFn: "handshake",           lazy: false },
    { id: "07", name: "Apoptose",   globalName: "SbkimApoptose",   surfaceFn: "prepareSelfApoptose", lazy: false },
    { id: "15", name: "Membran",    globalName: "SbkimMembrane",   surfaceFn: "init",                lazy: false },
  ];

  // ---- Aspekte-Liste (Karte 16 § Sub (d), INTERFACES § 1 Modul 16) ----
  //
  // Code-versioniert. Jedes spätere Sicherheits-Modul (10/11/12/14/
  // künftige 15.B-Erweiterungen) MUSS in seiner Bau-/Pflege-Sitzung
  // hier einen Eintrag am Listen-Ende ergänzen (aktuelles Datum +
  // Modul-ID + ein-Satz-Beschreibung; siehe Karte 16 § Sub (d)
  // Pflicht-Konvention).

  var ZERTIFIKAT_ASPEKTE = [
    {
      since:       "2026-05-24",
      module:      "16",
      aspect:      "Grund-Siegel-Bezeugung",
      description: "Diese App bestätigt durch Selbst-Prüfung beim Boot, dass die SBKIM-Pflicht-Module 01/02/03/04/05/07/15 geladen sind.",
    },
  ];

  // ---- Konstanten ----

  var DEFAULT_BADGE_SELECTOR = ".lamps";      // Container; Option β
  var BADGE_ID = "sbkim-siegel-badge";
  var MODAL_ID = "sbkim-siegel-modal";
  var MODAL_TITLE = "SBKIM-Siegel — was bedeutet das?";
  var FIRST_BOOT_ANIMATION_MS = 600;
  var MOUNT_OBSERVER_TIMEOUT_MS = 10000;

  // ---- Modul-Zustand (Closure) ----

  var ready = false;
  var badgeSelector = DEFAULT_BADGE_SELECTOR;
  var visibleMode = "visible";
  var mountModalFlag = true;
  var repoUrlOverride = null;

  var moduleStatuses = null;        // Array<{id, name, globalName, surfaceFn, lazy, status}>
  var certifiedFlag = false;
  var certifiedAt = null;
  var firstBootShown = false;

  var badgeElement = null;
  var badgeCreatedByModule = false;
  var badgeClickHandler = null;

  var modalRoot = null;
  var modalMounted = false;
  var modalOpen = false;
  var modalKeydownHandler = null;

  var mountObserver = null;
  var mountObserverTimeoutId = null;

  // ---- Hilfsfunktionen ----

  function warn(message, cause) {
    if (typeof console !== "undefined" && console.warn) {
      if (cause !== undefined) console.warn("[SbkimSiegel] " + message, cause);
      else console.warn("[SbkimSiegel] " + message);
    }
  }

  function nowIso() { return new Date().toISOString(); }

  function escapeAttr(str) {
    // Modal/Badge-Title-Strings sind statisch oder kommen aus
    // ZERTIFIKAT_ASPEKTE / PFLICHT_MODULE — beide code-versioniert.
    // textContent reicht im Modal; für `title`-Attribute genügt es,
    // potenzielle Doublequotes als &quot; auszugeben.
    if (typeof str !== "string") return "";
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---- Surface-Check (Karte 16 § Sub (a) Surface-Check-Form) ----

  function checkModuleSurface(entry) {
    var ns;
    try {
      ns = global[entry.globalName];
    } catch (_e) {
      ns = undefined;
    }
    if (ns === undefined) {
      return entry.lazy ? "deferred" : "missing";
    }
    if (ns === null || typeof ns !== "object") {
      return "broken";
    }
    if (typeof ns[entry.surfaceFn] !== "function") {
      return "broken";
    }
    return "ok";
  }

  function buildModuleStatuses() {
    var out = [];
    for (var i = 0; i < PFLICHT_MODULE.length; i++) {
      var entry = PFLICHT_MODULE[i];
      out.push({
        id:         entry.id,
        name:       entry.name,
        globalName: entry.globalName,
        surfaceFn:  entry.surfaceFn,
        lazy:       entry.lazy,
        status:     checkModuleSurface(entry),
      });
    }
    return out;
  }

  function deriveCertified(statuses) {
    if (!statuses || statuses.length === 0) return false;
    for (var i = 0; i < statuses.length; i++) {
      var s = statuses[i].status;
      if (s !== "ok" && s !== "deferred") return false;
    }
    return true;
  }

  function collectFailedIds(statuses) {
    var failed = [];
    for (var i = 0; i < statuses.length; i++) {
      var s = statuses[i].status;
      if (s === "missing" || s === "broken") {
        failed.push(statuses[i].id + " (" + s + ")");
      }
    }
    return failed;
  }

  // ---- Repo-URL (Karte 16 § Sub (c) Repo-URL-Quelle) ----

  function defaultRepoUrl() {
    var origin = "";
    var path = "/";
    try {
      if (global.location && typeof global.location.origin === "string") {
        origin = global.location.origin;
      }
      if (global.location && typeof global.location.pathname === "string") {
        path = global.location.pathname;
      }
    } catch (_e) { /* nb */ }
    var segments = path.split("/");
    var firstSegment = null;
    for (var i = 0; i < segments.length; i++) {
      if (segments[i].length > 0) { firstSegment = segments[i]; break; }
    }
    if (firstSegment) return origin + "/" + firstSegment + "/";
    return origin + "/";
  }

  function resolveRepoUrl() {
    if (typeof repoUrlOverride === "string" && repoUrlOverride.length > 0) {
      // Sanity-Check: muss mit http(s):// oder / anfangen, sonst
      // fail-soft auf Auto-Erkennung.
      if (/^(https?:\/\/|\/)/.test(repoUrlOverride)) {
        return repoUrlOverride;
      }
      warn("repoUrl-Override ist keine gültige URL — Auto-Erkennung als Fallback: " + repoUrlOverride);
    }
    return defaultRepoUrl();
  }

  // ---- Snapshot-Bau (defensive Kopie pro Aufruf) ----

  function buildExplanationSnapshot() {
    var modulesCopy = [];
    if (moduleStatuses) {
      for (var i = 0; i < moduleStatuses.length; i++) {
        var m = moduleStatuses[i];
        modulesCopy.push({
          id:         m.id,
          name:       m.name,
          globalName: m.globalName,
          surfaceFn:  m.surfaceFn,
          lazy:       m.lazy,
          status:     m.status,
        });
      }
    }
    var certifiedIds = [];
    for (var j = 0; j < modulesCopy.length; j++) {
      if (modulesCopy[j].status === "ok" || modulesCopy[j].status === "deferred") {
        certifiedIds.push(modulesCopy[j].id);
      }
    }
    var aspectsCopy = [];
    for (var k = 0; k < ZERTIFIKAT_ASPEKTE.length; k++) {
      var a = ZERTIFIKAT_ASPEKTE[k];
      aspectsCopy.push({
        since:       a.since,
        module:      a.module,
        aspect:      a.aspect,
        description: a.description,
      });
    }
    return {
      certifiedAt:      certifiedAt,
      isCertified:      certifiedFlag,
      repoUrl:          resolveRepoUrl(),
      modules:          modulesCopy,
      certifiedModules: certifiedIds,
      aspects:          aspectsCopy,
    };
  }

  function emptySnapshot() {
    return {
      certifiedAt:      null,
      isCertified:      false,
      repoUrl:          resolveRepoUrl(),
      modules:          [],
      certifiedModules: [],
      aspects:          [],
    };
  }

  // ---- Badge-Mount (Option β) ----

  function resolveBadgeAnchor() {
    if (!badgeSelector || typeof badgeSelector !== "string") return null;
    try {
      var doc = global.document;
      if (!doc || typeof doc.querySelector !== "function") return null;
      return doc.querySelector(badgeSelector);
    } catch (err) {
      warn("badgeSelector ist kein gültiger CSS-Selektor: " + badgeSelector, err);
      return null;
    }
  }

  function buildBadgeElement() {
    var doc = global.document;
    var span = doc.createElement("span");
    span.id = BADGE_ID;
    span.setAttribute("role", "button");
    span.setAttribute("tabindex", "0");
    span.setAttribute("aria-label", "SBKIM-Siegel öffnen");
    span.setAttribute("title", "SBKIM-Siegel — klick für Details");
    // SVG-Wappen: drei Hyphen-Bögen + zentraler Knoten-Punkt (Karte 16
    // § Sub (b) Wappen-Element, Skelett aus Spec). Pfade liegen in
    // viewBox 40×40, Stroke-Farbe Bronze-Ink statisch — die :root-
    // Variable steuert nur den Badge-Untergrund. aria-hidden, weil
    // das Wappen rein dekorativ ist; der `title` am Span trägt das
    // a11y-Label.
    span.innerHTML =
      '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
        '<g fill="none" stroke="#1A1306" stroke-width="1.4" stroke-linecap="round">' +
          '<path d="M10 14 Q 20 8, 30 14"/>' +
          '<path d="M14 26 Q 20 32, 26 26"/>' +
          '<path d="M12 20 Q 24 14, 28 22"/>' +
        '</g>' +
        '<circle cx="20" cy="20" r="1.6" fill="#1A1306"/>' +
      '</svg>';
    return span;
  }

  function mountBadge() {
    // Option β: kein Render bei not-certified, kein DOM-Element.
    if (!certifiedFlag) return;
    if (visibleMode === "hidden") return;
    if (badgeElement) return; // idempotent

    var anchor = resolveBadgeAnchor();
    if (!anchor) {
      setupBadgeMountObserver();
      return;
    }

    var doc = global.document;
    if (!doc) return;

    // Wenn der Selektor bereits ein Element mit BADGE_ID gematcht
    // hat (vor-injiziert), benutzen wir dieses Element direkt.
    // Sonst (Standardfall: Container wie `.lamps`) erzeugen wir
    // den Badge-Span darin.
    if (anchor.id === BADGE_ID) {
      badgeElement = anchor;
      badgeCreatedByModule = false;
      // Wenn das bereits-bestehende Element leer ist, füllen wir
      // das Wappen nach; sonst lassen wir den Inhalt unangetastet.
      if (!anchor.firstChild) {
        anchor.innerHTML = buildBadgeElement().innerHTML;
      }
      if (!anchor.getAttribute("role")) anchor.setAttribute("role", "button");
      if (!anchor.getAttribute("tabindex")) anchor.setAttribute("tabindex", "0");
      if (!anchor.getAttribute("aria-label")) anchor.setAttribute("aria-label", "SBKIM-Siegel öffnen");
      if (!anchor.getAttribute("title")) anchor.setAttribute("title", "SBKIM-Siegel — klick für Details");
    } else {
      var span = buildBadgeElement();
      anchor.appendChild(span);
      badgeElement = span;
      badgeCreatedByModule = true;
    }

    attachBadgeClickHandler();
    playFirstBootAnimation();
  }

  function setupBadgeMountObserver() {
    if (mountObserver) return;
    var doc = global.document;
    if (!doc || typeof MutationObserver === "undefined") return;
    if (!doc.body) {
      if (typeof doc.addEventListener === "function") {
        var onReady = function () {
          doc.removeEventListener("DOMContentLoaded", onReady);
          mountBadge();
        };
        doc.addEventListener("DOMContentLoaded", onReady);
      }
      return;
    }
    mountObserver = new MutationObserver(function () {
      var anchor = resolveBadgeAnchor();
      if (anchor) {
        disconnectMountObserver();
        mountBadge();
      }
    });
    try {
      mountObserver.observe(doc.body, { childList: true, subtree: true });
    } catch (err) {
      warn("MutationObserver konnte nicht starten — späten Badge-Mount aufgeben.", err);
      mountObserver = null;
      return;
    }
    mountObserverTimeoutId = setTimeout(function () {
      if (mountObserver) {
        disconnectMountObserver();
        warn(
          'badgeSelector "' + badgeSelector + '" auch nach ' +
          MOUNT_OBSERVER_TIMEOUT_MS + ' ms nicht gefunden — Badge-Mount übersprungen.',
        );
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

  function attachBadgeClickHandler() {
    if (!badgeElement) return;
    if (badgeClickHandler) return; // idempotent
    badgeClickHandler = function () {
      if (!mountModalFlag) return;
      if (modalOpen) closeModal(); else openModal();
    };
    try {
      badgeElement.addEventListener("click", badgeClickHandler);
      // Tastatur-A11y: Enter / Space am fokussierten Badge öffnet das Modal.
      badgeElement.addEventListener("keydown", function (ev) {
        if (!mountModalFlag) return;
        if (ev && (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar")) {
          ev.preventDefault();
          if (modalOpen) closeModal(); else openModal();
        }
      });
    } catch (err) {
      warn("Badge-Click-Handler konnte nicht registriert werden.", err);
    }
  }

  function playFirstBootAnimation() {
    if (firstBootShown) return;
    if (!badgeElement) return;
    try {
      badgeElement.classList.add("first-boot");
      setTimeout(function () {
        if (badgeElement) {
          try { badgeElement.classList.remove("first-boot"); } catch (_e) { /* nb */ }
        }
      }, FIRST_BOOT_ANIMATION_MS);
    } catch (err) {
      warn("First-Boot-Animation konnte nicht starten.", err);
    }
    firstBootShown = true;
  }

  // ---- Modal-Mount (Karte 16 § Sub (c)) ----

  function mountSiegelModal() {
    if (modalMounted) return;
    if (!mountModalFlag) return;
    if (!certifiedFlag) return; // Modal nur wenn Bezeugung grün
    var doc = global.document;
    if (!doc || !doc.body) return;

    var root = doc.createElement("div");
    root.id = MODAL_ID;
    root.setAttribute("aria-hidden", "true");
    root.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:99998",          // unter Modul-15-Modal-z-Index (99999), Reihenfolge ist konventionsfrei
      "display:none",
      "align-items:center",
      "justify-content:center",
    ].join(";");

    var backdrop = doc.createElement("div");
    backdrop.setAttribute("data-siegel-backdrop", "");
    backdrop.style.cssText = [
      "position:absolute",
      "inset:0",
      "background:rgba(0,0,0,0.62)",
    ].join(";");

    var panel = doc.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", MODAL_ID + "-title");
    // Bronze-Ink-Untergrund + Edel-Gold-Rahmen (Karte 16 § Sub (c) Modal-Form).
    panel.style.cssText = [
      "position:relative",
      "background:var(--siegel-ink, #1A1306)",
      "color:#F5F5FF",
      "border:1px solid var(--siegel-line, rgba(201,169,97,0.45))",
      "border-radius:10px",
      "padding:1.4rem 1.6rem",
      "min-width:320px",
      "max-width:min(560px, 92vw)",
      "max-height:80vh",
      "overflow:auto",
      "box-shadow:0 24px 64px rgba(0,0,0,0.7)",
      "font-family:'Geist', system-ui, sans-serif",
    ].join(";");

    var header = doc.createElement("div");
    header.style.cssText = "display:flex;align-items:center;gap:0.8rem;margin-bottom:1rem;";

    var title = doc.createElement("h2");
    title.id = MODAL_ID + "-title";
    title.textContent = MODAL_TITLE;
    // Serif für Titel (Karte 16 § Sub (c) wertigere Typografie).
    title.style.cssText = [
      "margin:0",
      "font-family:'Spectral','Georgia','Times New Roman',serif",
      "font-size:1.25rem",
      "font-weight:500",
      "letter-spacing:0.01em",
      "color:var(--siegel-gold, #C9A961)",
      "flex:1",
    ].join(";");

    var closeBtn = doc.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("data-siegel-close", "");
    closeBtn.setAttribute("aria-label", "Schließen");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = [
      "background:transparent",
      "color:#F5F5FF",
      "border:1px solid var(--siegel-line, rgba(201,169,97,0.45))",
      "border-radius:8px",
      "padding:0.25rem 0.6rem",
      "cursor:pointer",
      "font-size:1rem",
    ].join(";");

    header.appendChild(title);
    header.appendChild(closeBtn);

    var dateLine = doc.createElement("p");
    dateLine.setAttribute("data-siegel-date", "");
    dateLine.style.cssText = "margin:0 0 1rem;font-size:0.86rem;color:rgba(245,245,255,0.78);";

    var modulesHeader = doc.createElement("h3");
    modulesHeader.textContent = "Pflicht-Module";
    modulesHeader.style.cssText = [
      "margin:0 0 0.5rem",
      "font-family:'Geist', system-ui, sans-serif",
      "font-size:0.92rem",
      "font-weight:500",
      "color:rgba(245,245,255,0.78)",
      "text-transform:uppercase",
      "letter-spacing:0.06em",
    ].join(";");

    var modulesList = doc.createElement("ul");
    modulesList.setAttribute("data-siegel-modules", "");
    modulesList.style.cssText = [
      "list-style:none",
      "padding:0",
      "margin:0 0 1.2rem",
      "font-family:'Geist', system-ui, sans-serif",
      "font-size:0.86rem",
    ].join(";");

    var aspectsHeader = doc.createElement("h3");
    aspectsHeader.textContent = "Aspekte (lebendes Dokument)";
    aspectsHeader.style.cssText = modulesHeader.style.cssText;

    var aspectsList = doc.createElement("ul");
    aspectsList.setAttribute("data-siegel-aspects", "");
    aspectsList.style.cssText = [
      "list-style:none",
      "padding:0",
      "margin:0 0 1.2rem",
      "font-family:'Geist', system-ui, sans-serif",
      "font-size:0.86rem",
    ].join(";");

    var ausstellerBlock = doc.createElement("div");
    ausstellerBlock.setAttribute("data-siegel-aussteller", "");
    // Serif für die Aussteller-Klärung (Karte 16 § Sub (c)).
    ausstellerBlock.style.cssText = [
      "padding-top:0.9rem",
      "border-top:1px solid var(--siegel-line, rgba(201,169,97,0.45))",
      "font-family:'Spectral','Georgia','Times New Roman',serif",
      "font-size:0.92rem",
      "line-height:1.55",
      "color:rgba(245,245,255,0.86)",
    ].join(";");

    panel.appendChild(header);
    panel.appendChild(dateLine);
    panel.appendChild(modulesHeader);
    panel.appendChild(modulesList);
    panel.appendChild(aspectsHeader);
    panel.appendChild(aspectsList);
    panel.appendChild(ausstellerBlock);

    root.appendChild(backdrop);
    root.appendChild(panel);
    doc.body.appendChild(root);

    backdrop.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);

    modalRoot = root;
    modalMounted = true;
  }

  function statusMarkerDot(status) {
    var color;
    if (status === "ok")         color = "#16A34A";
    else if (status === "deferred") color = "var(--siegel-gold, #C9A961)";
    else                          color = "#DC2626";
    return (
      '<span aria-hidden="true" style="display:inline-block;width:8px;height:8px;border-radius:50%;' +
      'background:' + color + ';margin-right:0.55rem;vertical-align:middle;"></span>'
    );
  }

  function statusLabel(status) {
    if (status === "ok")       return "bereit";
    if (status === "deferred") return "bereit (lazy)";
    if (status === "missing")  return "fehlt";
    if (status === "broken")   return "defekt";
    return status;
  }

  function renderModalContents() {
    if (!modalRoot) return;
    var doc = global.document;
    var snap = buildExplanationSnapshot();

    var dateLine = modalRoot.querySelector("[data-siegel-date]");
    if (dateLine) {
      if (snap.certifiedAt) {
        // ISO "2026-05-24T18:42:31.123Z" → "2026-05-24 HH:MM" lokal.
        var date = new Date(snap.certifiedAt);
        var iso = isNaN(date.getTime()) ? snap.certifiedAt : date.toISOString();
        var datePart = iso.slice(0, 10);
        var timePart = iso.slice(11, 16);
        dateLine.textContent = "Bezeugt seit " + datePart + ", " + timePart + " Uhr.";
      } else {
        dateLine.textContent = "Bezeugt: —";
      }
    }

    var modulesList = modalRoot.querySelector("[data-siegel-modules]");
    if (modulesList) {
      modulesList.textContent = "";
      for (var i = 0; i < snap.modules.length; i++) {
        var m = snap.modules[i];
        var li = doc.createElement("li");
        li.style.cssText = "padding:0.32rem 0;border-bottom:1px solid rgba(255,255,255,0.05);";
        // Status-Punkt + ID/Name + Status-Label. Punkt-HTML ist
        // module-eigen und statisch — kein User-Input.
        li.innerHTML = statusMarkerDot(m.status) +
          '<span style="font-family:\'Geist Mono\',ui-monospace,monospace;color:rgba(245,245,255,0.86);">' +
          escapeAttr(m.id) + '</span>' +
          ' <span style="margin:0 0.5rem;color:rgba(245,245,255,0.45);">·</span> ' +
          '<span style="color:#F5F5FF;">' + escapeAttr(m.name) + '</span>' +
          ' <span style="margin:0 0.5rem;color:rgba(245,245,255,0.45);">·</span> ' +
          '<span style="color:rgba(245,245,255,0.62);">' + escapeAttr(statusLabel(m.status)) + '</span>';
        modulesList.appendChild(li);
      }
    }

    var aspectsList = modalRoot.querySelector("[data-siegel-aspects]");
    if (aspectsList) {
      aspectsList.textContent = "";
      // Chronologisch aufsteigend, Tie-Breaker module-ID aufsteigend
      // (Karte 16 § Sub (d) Reihenfolge).
      var sorted = snap.aspects.slice().sort(function (a, b) {
        if (a.since < b.since) return -1;
        if (a.since > b.since) return 1;
        if (a.module < b.module) return -1;
        if (a.module > b.module) return 1;
        return 0;
      });
      for (var k = 0; k < sorted.length; k++) {
        var a = sorted[k];
        var aLi = doc.createElement("li");
        aLi.style.cssText = "padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);";
        var head = doc.createElement("div");
        head.style.cssText = "display:flex;gap:0.5rem;align-items:baseline;margin-bottom:0.2rem;";
        var since = doc.createElement("span");
        since.textContent = a.since;
        since.style.cssText = "font-family:'Geist Mono',ui-monospace,monospace;color:var(--siegel-gold, #C9A961);font-size:0.82rem;";
        var moduleId = doc.createElement("span");
        moduleId.textContent = "· " + a.module;
        moduleId.style.cssText = "font-family:'Geist Mono',ui-monospace,monospace;color:rgba(245,245,255,0.62);font-size:0.82rem;";
        var aspect = doc.createElement("span");
        aspect.textContent = "· " + a.aspect;
        aspect.style.cssText = "color:#F5F5FF;font-size:0.9rem;flex:1;";
        head.appendChild(since);
        head.appendChild(moduleId);
        head.appendChild(aspect);
        var desc = doc.createElement("p");
        desc.textContent = a.description;
        desc.style.cssText = "margin:0;font-size:0.82rem;color:rgba(245,245,255,0.7);line-height:1.5;";
        aLi.appendChild(head);
        aLi.appendChild(desc);
        aspectsList.appendChild(aLi);
      }
    }

    var ausstellerBlock = modalRoot.querySelector("[data-siegel-aussteller]");
    if (ausstellerBlock) {
      ausstellerBlock.textContent = "";
      var doc2 = global.document;
      var p1 = doc2.createElement("p");
      p1.style.cssText = "margin:0 0 0.4rem;";
      // Verbindlicher Wortlaut (Karte 16 § Sub (c) Aussteller-Klärung).
      // textContent statt innerHTML → KEINE HTML-Interpretation, dafür
      // "self-inscribing" als Wort, das im Text betont aussieht durch
      // den Serif-Font des umgebenden Blocks.
      p1.appendChild(doc2.createTextNode("Dieses Siegel ist "));
      var strong = doc2.createElement("strong");
      strong.textContent = "self-inscribing";
      strong.style.cssText = "font-weight:500;color:var(--siegel-gold, #C9A961);";
      p1.appendChild(strong);
      p1.appendChild(doc2.createTextNode(": die App hat sich beim Boot selbst geprüft."));

      var p2 = doc2.createElement("p");
      p2.style.cssText = "margin:0;";
      p2.appendChild(doc2.createTextNode("Vertrauen kommt vom Repo, in dem sie gehostet ist: "));
      var link = doc2.createElement("a");
      link.href = snap.repoUrl;
      link.textContent = snap.repoUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.cssText = "color:var(--siegel-gold, #C9A961);text-decoration:underline;";
      p2.appendChild(link);
      p2.appendChild(doc2.createTextNode("."));

      ausstellerBlock.appendChild(p1);
      ausstellerBlock.appendChild(p2);
    }
  }

  function openModal() {
    if (!mountModalFlag) return;
    if (!certifiedFlag) return;
    if (!modalMounted) mountSiegelModal();
    if (!modalRoot) return;
    renderModalContents();
    modalRoot.style.display = "flex";
    modalRoot.setAttribute("aria-hidden", "false");
    modalOpen = true;
    if (!modalKeydownHandler) {
      modalKeydownHandler = function (event) {
        if (event && event.key === "Escape" && modalOpen) {
          closeModal();
        }
      };
      try { global.document.addEventListener("keydown", modalKeydownHandler); }
      catch (_e) { /* nb */ }
    }
  }

  function closeModal() {
    if (!modalOpen) return;
    if (modalRoot) {
      modalRoot.style.display = "none";
      modalRoot.setAttribute("aria-hidden", "true");
    }
    modalOpen = false;
    if (modalKeydownHandler) {
      try { global.document.removeEventListener("keydown", modalKeydownHandler); }
      catch (_e) { /* nb */ }
      modalKeydownHandler = null;
    }
  }

  // ---- init() ----

  async function init(options) {
    if (ready) {
      // Idempotent: keine Re-Check, kein Re-Mount, kein Doppel-Listener.
      // Wenn der Selektor erst nach init() im DOM erscheint, kann ein
      // Aufrufer `mountBadge()` indirekt via wiederholten init() NICHT
      // erzwingen — das ist Karte 16 § Sub (a) "idempotent" verbindlich.
      return;
    }

    var opts = (options && typeof options === "object") ? options : {};
    if (typeof opts.badgeSelector === "string" && opts.badgeSelector.length > 0) {
      badgeSelector = opts.badgeSelector;
    }
    if (opts.visible === "hidden") {
      visibleMode = "hidden";
    } else if (opts.visible === "visible") {
      visibleMode = "visible";
    }
    mountModalFlag = (opts.mountModal !== false);
    if (typeof opts.repoUrl === "string" && opts.repoUrl.length > 0) {
      repoUrlOverride = opts.repoUrl;
    } else if (opts.repoUrl === null) {
      repoUrlOverride = null;
    }

    // Surface-Check: Snapshot zur init()-Zeit.
    moduleStatuses = buildModuleStatuses();
    certifiedFlag = deriveCertified(moduleStatuses);

    if (!certifiedFlag) {
      // Fail-Modus binär (Karte 16 § Sub (a) Fail-Modus):
      // EINE console.warn-Zeile mit ID-Liste; KEIN Badge, KEIN Modal.
      var failed = collectFailedIds(moduleStatuses);
      warn(
        "kein Render: Pflicht-Module fehlen/defekt — " + failed.join(", ") +
        ". Siehe docs/components/16_siegel.md § Sub (a).",
      );
      ready = true;
      return;
    }

    certifiedAt = nowIso();

    // Badge-Mount (Option β: kein DOM-Element bei not-certified).
    if (visibleMode !== "hidden") {
      mountBadge();
    }

    // Modal-Mount (default true). Modal hängt unabhängig vom Badge —
    // bei `visible:"hidden"` UND `mountModal:true` ist das Modal trotzdem
    // ansprechbar, aber ohne Click-Trigger (Aufrufer öffnet via JS).
    if (mountModalFlag) {
      try { mountSiegelModal(); } catch (err) { warn("Modal-Mount fehlgeschlagen", err); }
    }

    ready = true;
  }

  // ---- Öffentliche API ----

  function isCertified() {
    return certifiedFlag === true;
  }

  function getExplanation() {
    if (!ready) return emptySnapshot();
    return buildExplanationSnapshot();
  }

  function getCertifiedModules() {
    if (!ready || !moduleStatuses) return [];
    var out = [];
    for (var i = 0; i < moduleStatuses.length; i++) {
      var s = moduleStatuses[i].status;
      if (s === "ok" || s === "deferred") out.push(moduleStatuses[i].id);
    }
    return out;
  }

  function getAspects() {
    var out = [];
    for (var i = 0; i < ZERTIFIKAT_ASPEKTE.length; i++) {
      var a = ZERTIFIKAT_ASPEKTE[i];
      out.push({
        since:       a.since,
        module:      a.module,
        aspect:      a.aspect,
        description: a.description,
      });
    }
    return out;
  }

  // PFLICHT_MODULE-Spec-Kopie für _meta (defensive Kopie zur Skript-Lade-
  // Zeit; KEINE Runtime-Mutation, KEINE Aufrufer-Manipulation).
  function snapshotPflichtModuleSpec() {
    var out = [];
    for (var i = 0; i < PFLICHT_MODULE.length; i++) {
      var e = PFLICHT_MODULE[i];
      out.push({
        id:         e.id,
        name:       e.name,
        globalName: e.globalName,
        surfaceFn:  e.surfaceFn,
        lazy:       e.lazy,
      });
    }
    return out;
  }

  var SbkimSiegel = {
    init:                init,
    isCertified:         isCertified,
    getExplanation:      getExplanation,
    getCertifiedModules: getCertifiedModules,
    getAspects:          getAspects,
    _meta: {
      badgeId:           BADGE_ID,
      modalId:           MODAL_ID,
      defaultSelector:   DEFAULT_BADGE_SELECTOR,
      get ready()             { return ready; },
      get firstBootShown()    { return firstBootShown; },
      get certifiedAt()       { return certifiedAt; },
      get pflichtModuleSpec() { return snapshotPflichtModuleSpec(); },
      get badgeMounted()      { return badgeElement !== null; },
      get badgeCreatedByModule() { return badgeCreatedByModule; },
      get modalMounted()      { return modalMounted; },
      get modalOpen()         { return modalOpen; },
      get visibleMode()       { return visibleMode; },
      get mountModalFlag()    { return mountModalFlag; },
      get badgeSelector()     { return badgeSelector; },
    },
  };

  global.SbkimSiegel = SbkimSiegel;

  // Self-check (synchron, beim Skript-Laden — vor jedem Aufruf).
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 16 SIEGEL bereit, Funktionen: init/isCertified/getExplanation/getCertifiedModules/getAspects",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
