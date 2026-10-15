/* ============================================================================
 * SBKIM-Demo — SBKIM-Andock (Klebstoff zwischen Seite und Modulen).
 * Sage Sammel-Brief 2026-10-15, Schritt 4b (Klaus: die öffentliche Demo
 * unter Sage-Protokol/sbkim-demo/ dockt an, nicht das private Repo
 * semantic-match-demo).
 *
 * Kopiert von `Kuechenzettel/assets/sbkim-init.js` (feste Lampen-Leiste, KEIN
 * Modul 17). Abweichung: die Demo liegt IM Sage-Depot und lädt die Module
 * DIREKT aus dem Kanon (`../src/modules/`) — es gibt keine Kopien, die
 * zurückhängen könnten. Eigene Schublade `sbkimdemo` (steht zusätzlich im
 * <head>, weil Modul 01 den Wert beim Laden liest), getrennt von Sage selbst.
 *
 *  - Modul 05b steht NICHT in der Kette, sondern als eigene
 *    `<script type="module">`-Zeile in index.html (PFLICHT_MODULE, Falle 2).
 *  - Die Demo hat keinen Service-Worker: kein Vorrat, kein Cache-Bump.
 *
 * ALLES FAIL-SOFT: fehlt ein Modul, fehlen Lampen und Siegel — die Seite
 * bleibt lesbar. ⚠ BEIM LADEN BAUT DER KNOTEN KEINE VERBINDUNG AUF.
 * ========================================================================== */
(function () {
  "use strict";

  var NETZ = {
    dbSuffix: "sbkimdemo",
    nodeName: "SBKIM-Demo",
    repoUrl: "https://github.com/lausiklauskn-png/Sage-Protokol",
    /* Fremde Seiten, die per postMessage mit diesem Knoten reden dürfen:
       KEINE. Alles andere weist Modul 15 ab und meldet es an der FREMD-Lampe. */
    allowedOrigins: []
  };
  window.DEMO_NETZ = NETZ;

  /* ---- Gerätename (INTERFACES § 11.7) — ins Verbinden-Panel, nie in die
     byte-kopierte Panel-Datei. Derselbe Schlüssel wie netzweit: es ist
     dasselbe Gerät. ------------------------------------------------------- */
  var LS_GERAETENAME = "sbkim_geraetename";
  function geraetename() {
    try { return (localStorage.getItem(LS_GERAETENAME) || "").trim().slice(0, 40); } catch (_e) { return ""; }
  }
  function anzeigeName() { var g = geraetename(); return g ? (NETZ.nodeName + " · " + g) : NETZ.nodeName; }
  function namensfelderAbgleichen() {
    try {
      var wert = geraetename(), liste = document.querySelectorAll("[data-sbkim-geraetename]");
      for (var i = 0; i < liste.length; i++) { if (liste[i].value !== wert) liste[i].value = wert; }
    } catch (_e) {}
  }
  function geraetenameFeldEinhaengen() {
    function versuch() {
      var panel = document.getElementById("sbkim-rdv-panel");
      if (!panel) return false;
      if (panel.querySelector("[data-sbkim-geraetename]")) return true;
      var zeile = document.createElement("div");
      zeile.style.cssText = "margin:8px 0;display:flex;gap:6px;align-items:center;flex-wrap:wrap";
      var beschriftung = document.createElement("label");
      beschriftung.setAttribute("for", "sbkim-geraetename");
      beschriftung.textContent = "🏷️ Gerätename:";
      beschriftung.style.cssText = "color:#9aa7b6;font-size:.85rem";
      var feld = document.createElement("input");
      feld.id = "sbkim-geraetename"; feld.type = "text"; feld.maxLength = 40;
      feld.setAttribute("data-sbkim-geraetename", "1");
      feld.placeholder = "z. B. Klaus-Handy (frei wählbar)";
      feld.value = geraetename();
      feld.title = "Nur ein Anzeige-Hinweis, kein Vertrauens-Beweis — die Kennung steht daneben.";
      feld.style.cssText = "flex:1;min-width:120px;padding:4px 6px;border-radius:6px;border:1px solid #33414f;background:#0d1520;color:#dfeaf2;font:inherit";
      feld.addEventListener("input", function () {
        try { localStorage.setItem(LS_GERAETENAME, String(feld.value || "").trim().slice(0, 40)); } catch (_e) {}
        try { window.dispatchEvent(new CustomEvent("sbkim:geraetename-changed")); } catch (_e) {}
      });
      zeile.appendChild(beschriftung); zeile.appendChild(feld);
      panel.insertBefore(zeile, panel.children[1] || null);
      return true;
    }
    if (versuch()) return;
    try {
      var beobachter = new MutationObserver(function () { if (versuch()) beobachter.disconnect(); });
      beobachter.observe(document.body, { childList: true, subtree: true });
    } catch (_e) {}
  }

  /* Sprachmodell vom eigenen Server (Klaus 2026-10-13, Weg A: die App setzt die
   * Adresse, Modul 03 bleibt neutral). Wie im Sende-Prüfer, in Workflow-Needs und im In-and-Out-Book. Modul 03 liest den Wert erst beim
   * Laden — und es wird erst in der Kette darunter geladen. Antwortet der
   * Server nicht, nimmt Modul 03 Hugging Face. */
  if (!window.SBKIM_MODEL_ROOT) window.SBKIM_MODEL_ROOT = "https://family-projekt.de/models/";

  /* ---- Die Kette, kanonische Reihenfolge (Sage docs/PFLICHT_MODULE.md) ---- */
  var V = "";   // keine ?v=: kein Service-Worker, kein Vorrat (Kanon-Dateien direkt)
  var KANON = [
    ["",       "../src/modules/01_storage.js" + V],
    ["",       "../src/modules/02_spore.js" + V],
    ["",       "../src/modules/03_embedding.js" + V],
    ["",       "../src/modules/04_match.js" + V],
    ["",       "../src/modules/05_anastomose.js" + V],
    ["",       "../src/modules/07_apoptose.js" + V],
    ["",       "../src/modules/15_membran.js" + V],
    ["",       "../src/modules/16_siegel.js" + V],
    ["",       "../src/modules/23_rendezvous.js" + V],
    ["",       "../src/modules/23_rendezvous_ui.js" + V],
    ["",       "siegel-inhalt.js" + V],        // die Identität dieses Knotens
    ["",       "../src/modules/16b_andock_wizard.js" + V]    // Andock-Werkzeug IM Siegel
  ];
  window.DEMO_KETTE = KANON.map(function (k) { return k[1]; });

  function pause(f) {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(f, { timeout: 500 });
    else setTimeout(f, 16);
  }
  function naechste(i, fertig) {
    if (i >= KANON.length) { fertig(); return; }
    var s = document.createElement("script");
    if (KANON[i][0]) s.type = KANON[i][0];
    s.src = KANON[i][1];
    /* onerror wie onload: eine fehlende Datei darf die Kette nicht anhalten. */
    s.onload = s.onerror = function () { pause(function () { naechste(i + 1, fertig); }); };
    document.body.appendChild(s);
  }

  /* ---- Lampen: echte Ereignisse, nie ein geschätzter Zustand ------------- */
  /* Jede Lampe hat eine Kopie mit Namen im aufgeklappten Feld (am Handy
     stehen im Knopf nur die Punkte) — beide bekommen denselben Zustand. */
  function lampe(id, klasse) {
    var alle = [document.getElementById(id)].concat([].slice.call(document.querySelectorAll('[data-lampe-kopie="' + id + '"]')));
    alle.forEach(function (el) {
      if (!el) return;
      el.classList.remove("on", "warn", "bad");
      if (klasse) el.classList.add(klasse);
    });
  }
  function pulsSetzen(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add("puls");
    setTimeout(function () { el.classList.remove("puls"); }, 950);
  }
  function lampenVerdrahten() {
    window.addEventListener("sbkim:alive", function () { lampe("lamp-alive", "on"); });
    window.addEventListener("sbkim:nostr-listening", function (e) {
      lampe("lamp-traffic", (e && e.detail && e.detail.active) ? "on" : null);
    });
    window.addEventListener("sbkim:handshake",   function () { pulsSetzen("lamp-traffic"); });
    window.addEventListener("sbkim:postmessage", function () { pulsSetzen("lamp-traffic"); });
    /* FREMD — rot nur bei einem Fremdzugriff (Modul 15: fremde Nachricht). */
    window.addEventListener("sbkim:fremd-alert", function () { lampe("lamp-fremd", "bad"); });
  }

  /* ---- Auf- und Zuklappen der Leiste (am Handy nur die Lampen) ----------- */
  function leisteVerdrahten() {
    var knopf = document.getElementById("lampen"), leiste = document.getElementById("netzleiste");
    if (!knopf || !leiste) return;
    function setze(offen) {
      leiste.setAttribute("data-offen", offen ? "1" : "0");
      knopf.setAttribute("aria-expanded", String(offen));
    }
    knopf.addEventListener("click", function () { setze(leiste.getAttribute("data-offen") !== "1"); });
    /* Ein Tipp daneben klappt wieder zu — aber nicht, wenn er IN der Leiste
       landet (Siegel, Mycel-Blase) oder in einem Fenster, das sie geöffnet hat. */
    document.addEventListener("click", function (e) {
      if (leiste.getAttribute("data-offen") !== "1") return;
      var t = e.target;
      if (!document.contains(t) || leiste.contains(t)) return;
      if (t.closest && t.closest("[id^='sbkim-'],[class*='sbkim-']")) return;
      setze(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setze(false); });
  }

  /* ---- Start-Kette: Storage → Membran → Siegel → Apoptose → Anastomose →
     Rendezvous (Rezept „status-leiste-siegel", ohne Modul 17). ------------ */
  async function starten() {
    try {
      if (!window.SbkimStorage) return;
      await window.SbkimStorage.init({ dbSuffix: NETZ.dbSuffix });

      if (window.SbkimMembrane) {
        await window.SbkimMembrane.init({ allowedOrigins: NETZ.allowedOrigins, lampSelector: "#lamp-fremd" });
      }
      if (window.SbkimSiegel) {
        /* `ribbonText` ist Pflicht — ohne ihn bleibt das Band im Wappen leer. */
        window.SbkimSiegel.init({ badgeSelector: "#siegel-platz", mountModal: true, repoUrl: NETZ.repoUrl, ribbonText: "SBKIM-DEMO" });
      }
      if (window.SbkimApoptose) { try { await window.SbkimApoptose.init(); } catch (_e) {} }
      if (window.SbkimAnastomose) { try { await window.SbkimAnastomose.init(); } catch (_e) {} }

      /* Rendezvous: `init()` baut NICHTS auf und ruft NICHTS. Angemeldet wird
         erst auf Klick. `ensureIdentity` ABSICHTLICH NICHT (netzweite Stufe 0b). */
      if (window.SbkimRendezvous) { try { window.SbkimRendezvous.init({ nodeName: anzeigeName(), dbSuffix: NETZ.dbSuffix }); } catch (_e) {} }
      if (window.SbkimRendezvousUI) { try { window.SbkimRendezvousUI.init({ nodeName: anzeigeName(), dbSuffix: NETZ.dbSuffix }); } catch (_e) {} }

      geraetenameFeldEinhaengen();
      window.addEventListener("sbkim:geraetename-changed", function () {
        namensfelderAbgleichen();
        try { if (window.SbkimRendezvous && window.SbkimRendezvous.configure) window.SbkimRendezvous.configure({ nodeName: anzeigeName() }); } catch (_e) {}
      });
    } catch (e) {
      if (window.console && console.warn) console.warn("[SBKIM-Demo] Andock übersprungen:", e);
    } finally {
      window.DEMO_KNOTEN_BEREIT = true;
    }
  }

  lampenVerdrahten();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", leisteVerdrahten);
  else leisteVerdrahten();
  if (document.readyState === "complete") pause(function () { naechste(0, starten); });
  else window.addEventListener("load", function () { pause(function () { naechste(0, starten); }); });
})();
