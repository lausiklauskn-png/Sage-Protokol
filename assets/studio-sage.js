/* Sage-Protokol — Studio-Zugang (S5b Teil 2, Klaus 2026-10-16).
 *
 * LANGER DRUCK (1,5 s) auf die Fußzeile mit dem © öffnet das Studio, so wie
 * in PWA Toolpoint und family-projekt.de. In Sage ist das Studio nur die
 * Netz-Verwaltung (Modul 23b) auf einer EIGENEN Seite, netz-verwaltung.html
 * (Klaus 2026-10-16: „vom Umfang viel zu groß, um einzeln im Studio
 * aufzutauchen"). Dort unterschreibt Sage-Protokol als Netzadmin des offenen
 * Mycels (Bürgen für die Märkte, Sperren, Lösen).
 * Benannt: das Verstecken hält Besucher fern, es schützt nichts. Geschützt
 * ist das Ändern durch die Unterschrift (Schlüssel nur in Klaus' Browser).
 * Ein Wischen bricht ab, sonst löste jedes Scrollen das Studio aus.
 */
(function () {
  "use strict";
  var LANGE_MS = 1500;
  function oeffnen() {
    // Im selben Tab: ein window.open aus dem Zeitgeber sperrt Chrome am Tablet
    // als Popup (ein Fingerdruck gibt erst beim Loslassen die Erlaubnis).
    try { window.location.href = "netz-verwaltung.html"; } catch (_e) { /* fail-soft */ }
  }

  function verdrahten() {
    var ziel = null, liste = document.querySelectorAll(".legal-line");
    for (var i = 0; i < liste.length; i++) { if (/©/.test(liste[i].textContent || "")) { ziel = liste[i]; break; } }
    if (!ziel) return;
    var uhr = null, sx = 0, sy = 0, ausgeloest = false;
    var stop = function () { if (uhr) { clearTimeout(uhr); uhr = null; } };
    ziel.addEventListener("pointerdown", function (ev) {
      sx = ev.clientX; sy = ev.clientY; stop(); ausgeloest = false;
      uhr = setTimeout(function () { uhr = null; ausgeloest = true; oeffnen(); }, LANGE_MS);
    });
    ziel.addEventListener("pointermove", function (ev) {
      if (uhr && (Math.abs(ev.clientX - sx) > 10 || Math.abs(ev.clientY - sy) > 10)) stop();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (n) { ziel.addEventListener(n, stop); });
    // Nach dem langen Druck kein Klick auf den Impressum-Link, kein Kontextmenü.
    ziel.addEventListener("click", function (ev) { if (ausgeloest) { ev.preventDefault(); ausgeloest = false; } }, true);
    ziel.addEventListener("contextmenu", function (ev) { if (uhr || ausgeloest) ev.preventDefault(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", verdrahten);
  else verdrahten();
})();
