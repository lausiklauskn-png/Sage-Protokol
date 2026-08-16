/* Aktualisieren-Knopf — ein Griff, der wirklich neu lädt.
 *
 * ── WARUM (Klaus 2026-08-15) ───────────────────────────────────────────────
 *
 * Klaus: „Mach bitte noch 'n Aktualisierungs-Button und dass man das vom Handy
 * leichter aktualisieren kann."
 *
 * Am Tablet ist „Cache leeren und neu laden" drei Menü-Ebenen tief; am Handy
 * gibt es den Punkt gar nicht. Und `location.reload()` genügt nicht — der
 * HTTP-Cache liefert dieselbe Adresse weiter aus, und `reload(true)` ignorieren
 * die Browser seit Jahren. Deshalb dieselbe Reihenfolge wie in PWA Toolpoint,
 * die dort seit dem 2026-08-09 läuft:
 *
 *   1  jeden Vorrat wegwerfen (Cache-Speicher)
 *   2  den Service-Worker abmelden
 *   3  mit GEÄNDERTER Adresse neu laden — nur eine andere Adresse ist für den
 *      HTTP-Cache eine andere Datei
 *   4  das Anhängsel beim nächsten Start wieder aus der Adresszeile putzen,
 *      damit niemand `?frisch=…` weitergibt
 *
 * Der Knopf SCHWEBT unten rechts, nicht oben in der Kopfzeile. Grund: die Seite
 * ist lang (rund 4800 px), und wer unten steht, müsste sonst erst ganz nach
 * oben scrollen, um neu zu laden — genau die Mühe, die abgenommen werden soll.
 * Unten rechts liegt der Daumen.
 *
 * FAIL-SOFT in beide Richtungen: kann der Browser einen Schritt nicht, wird
 * trotzdem geladen. Ein Aktualisieren-Knopf, der bei einem Fehler gar nichts
 * tut, wäre schlimmer als keiner.
 *
 * EHRLICH DAZU: Schritt 2 meldet die Service-Worker dieser ganzen Adresse ab,
 * nicht nur den dieser Seite. Beim nächsten Besuch einer Seite, die einen
 * mitbringt, meldet er sich wieder an. Das ist gewollt — „wirklich neu laden"
 * heißt genau das.
 *
 * EINE Datei für alle drei Seiten. Drei Kopien liefen auseinander, und die
 * Abweichung fiele erst auf, wenn eine davon nicht mehr aktualisiert.
 */
(function () {
  "use strict";

  var STIL =
    '.frisch-knopf{' +
      'position:fixed;right:16px;bottom:16px;z-index:2147483000;' +
      'right:max(16px,env(safe-area-inset-right));' +
      'bottom:max(16px,env(safe-area-inset-bottom));' +
      'display:inline-flex;align-items:center;justify-content:center;gap:8px;' +
      /* 52 px: Daumen-tauglich. Unter 44 px trifft man auf dem Handy daneben. */
      'min-width:52px;height:52px;padding:0 16px;border-radius:26px;' +
      'border:1px solid rgba(255,255,255,.22);background:rgba(14,14,36,.92);' +
      'color:#F5F5FF;font:600 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
      'cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);' +
      'box-shadow:0 4px 18px rgba(0,0,0,.45);' +
    '}' +
    '.frisch-knopf:hover{border-color:#6EE7D3;background:rgba(20,20,48,.96)}' +
    '.frisch-knopf:disabled{opacity:.6;cursor:progress}' +
    '.frisch-knopf .zeichen{font-size:19px;line-height:1}' +
    /* Auf schmalen Schirmen nur das Zeichen — der Text kostet dort Platz,
       den die Seite braucht, und das Zeichen ist eindeutig genug. */
    '@media(max-width:520px){.frisch-knopf .wort{display:none}.frisch-knopf{padding:0;width:52px}}' +
    '@media(prefers-reduced-motion:no-preference){.frisch-knopf{transition:border-color .18s,background .18s}}';

  function stilEinhaengen() {
    if (document.getElementById("frisch-stil")) return;
    var s = document.createElement("style");
    s.id = "frisch-stil";
    s.textContent = STIL;
    document.head.appendChild(s);
  }

  async function aktualisieren(knopf) {
    if (knopf) {
      knopf.disabled = true;
      knopf.innerHTML = '<span class="zeichen">⟳</span><span class="wort">lädt …</span>';
    }
    try {
      if (window.caches && caches.keys) {
        var namen = await caches.keys();
        await Promise.all(namen.map(function (n) { return caches.delete(n); }));
      }
    } catch (_e) {}
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        var regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(function (r) { return r.unregister(); }));
      }
    } catch (_e) {}
    location.replace(location.pathname + "?frisch=" + Date.now());
  }

  /* Das Anhängsel wieder wegnehmen — ohne neu zu laden. */
  function adresseAufraeumen() {
    try {
      if (!/[?&]frisch=/.test(location.search)) return;
      if (!window.history || !history.replaceState) return;
      history.replaceState(null, "", location.pathname + location.hash);
    } catch (_e) {}
  }

  function start() {
    adresseAufraeumen();
    stilEinhaengen();

    var k = document.createElement("button");
    k.type = "button";
    k.className = "frisch-knopf";
    k.id = "frischKnopf";
    k.title = "Aktualisieren — Vorrat wegwerfen und wirklich neu laden";
    k.setAttribute("aria-label", "Aktualisieren — Vorrat wegwerfen und wirklich neu laden");
    k.innerHTML = '<span class="zeichen" aria-hidden="true">⟳</span><span class="wort">Neu laden</span>';
    k.addEventListener("click", function () { aktualisieren(k); });
    document.body.appendChild(k);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
