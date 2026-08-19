/*
 * Pinnwand — Service-Worker (Standalone-PWA).
 *
 * Macht die Seite installierbar (Chrome verlangt einen fetch-Handler) und cacht
 * die App-Schale (dieser Ordner), damit die Pinnwand offline startet.
 *
 * Strategie:
 *   - Eigene App-Schale (same-origin, in diesem Scope): CACHE-FIRST, dann Netz.
 *   - Navigationen offline: Fallback auf ./index.html.
 *   - Alles andere (Nostr-Relays via WebSocket, CDN-Embedding-Modell,
 *     WebLLM-Bibliothek/Gewichte, KI-API): DURCHREICHEN, nicht cachen — gehört
 *     nicht in den SW-Cache (WebSockets fängt der SW ohnehin nicht ab; Modelle
 *     sind zu groß; Schlüssel/Antworten haben im Cache nichts verloren).
 *
 * Bei einer Änderung der App-Schale CACHE_VERSION erhöhen (Cache-Bust).
 *
 * ── Was beim ERSTEN Besuch über die Leitung geht (Messung 2026-08-02) ──────
 * An Kimboard gemessen, das dieselbe Schale fährt; die Pinnwand hatte die
 * beiden gleichen Stellen. Gemessen wurde mit einem Server, der sich wie
 * GitHub Pages verhält (Cache-Control max-age + ETag) — das ist wichtig, siehe
 * ganz unten.
 *
 * 1. DIE SYMBOLE. Der Vorrat holte icon-192 (77 KiB) UND icon-512 (474 KiB),
 *    obwohl die Seite keines von beiden zeigt — sie zeigt seit heute icon-128
 *    (37 KiB) für Tab-Symbol und Logo zugleich. Beide großen Dateien stehen
 *    deshalb ABSICHTLICH nicht mehr in der Liste: sie gehören ins Manifest,
 *    und dort holt das Betriebssystem sie beim Installieren — da ist man
 *    ohnehin online. Wird eines doch angefragt, legt der fetch-Handler unten
 *    es ganz normal ab.
 *
 * 2. DAS DOKUMENT. Es kam DREIMAL: als Navigation auf "/", plus "./" und
 *    "./index.html" im Vorrat. Für den Cache sind das drei Adressen, obwohl es
 *    dieselbe Datei ist — der Browser kann da nichts zusammenlegen. Jetzt
 *    steht keine der beiden Schreibweisen mehr im Vorrat; der navigate-Zweig
 *    unten legt die Seite unter ihrer eigenen Adresse ab und sucht beim
 *    Rückfall der Reihe nach "./index.html" UND "./".
 *
 * Merksatz für die nächste Messung: einen Prüf-Server ohne Cache-Kopfzeilen
 * zu benutzen, misst nicht die Seite, sondern den Prüf-Server. Genau daran
 * wäre hier fast eine überflüssige Verzögerung eingebaut worden (Kimboard,
 * PR #83) — gegen einen Pages-ähnlichen Server war ihr Nutzen exakt null.
 */
"use strict";

var CACHE_VERSION = "sbkim-pinnwand-v21";

// Absichtlich NICHT enthalten: "./" und "./index.html" (dieselbe Datei wie die
// Navigation, nur unter anderer Adresse) sowie icon-192/icon-512 (holt das
// Betriebssystem beim Installieren). Siehe Kopf.
var APP_SHELL = [
  "./manifest.json",
  "./impressum.html",
  "./icon-128.png",
  "./modules/noble-secp256k1.js",
  "./modules/03_embedding.js",
  "./modules/dm_crypto.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return Promise.all(APP_SHELL.map(function (url) {
        return cache.add(url).catch(function (err) {
          console.warn("[pinnwand-sw] Precache übersprungen:", url, err);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (_e) { return; }

  // Fremd-Origin (Relays, CDN-Modell, WebLLM, KI-API): durchreichen, nicht cachen.
  if (url.origin !== self.location.origin) return;

  // Navigationen (die Seite selbst): NETZ ZUERST → immer der frische Stand,
  // offline Fallback auf den Cache. Verhindert, dass eine alte App-Schale
  // hängenbleibt (Bauphasen-Lehre 2026-06-24).
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Offline: erst die angefragte Adresse, dann die beiden Schreibweisen
        // derselben Datei. "/" und "/index.html" sind für den Cache zwei
        // Adressen — gespeichert ist immer nur die, über die man gekommen ist.
        return caches.match(req)
          .then(function (c) { return c || caches.match("./index.html"); })
          .then(function (c) { return c || caches.match("./"); });
      })
    );
    return;
  }

  // Übrige App-Schale (Skripte/Icons/Manifest): CACHE-FIRST, dann Netz.
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
