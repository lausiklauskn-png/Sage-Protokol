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
