/*
 * SBKIM Such-Werkzeug — Service-Worker (Standalone-PWA).
 *
 * Macht die Seite installierbar (Chrome verlangt einen fetch-Handler) und
 * cacht die App-Schale (dieser Ordner), damit das Tool offline startet.
 *
 * Strategie:
 *   - Eigene App-Schale (same-origin, in diesem Scope): CACHE-FIRST, dann Netz.
 *   - Navigationen offline: Fallback auf ./index.html.
 *   - Alles andere (CDN-Embedding-Modell, KI-/Sprach-API): DURCHREICHEN, nicht
 *     cachen — Schlüssel/Antworten gehören nicht in den SW-Cache, das Modell
 *     ist zu groß.
 *
 * Bei einer Änderung der App-Schale CACHE_VERSION erhöhen (Cache-Bust).
 */
"use strict";

var CACHE_VERSION = "sbkim-such-tool-v3";

// Relativ zum SW-Scope (diesem Ordner) — funktioniert in Sage (/such-tool/)
// genauso wie in einem eigenen Repo-Root.
var APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./impressum.html",
  "./icon-192.png",
  "./icon-512.png",
  "./modules/03_embedding.js",
  "./modules/04_match.js",
  "./modules/21_spracheingabe.js",
  "./modules/22_such_widget.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // addAll bricht hart ab, wenn EINE Datei fehlt — einzeln + fail-soft.
      return Promise.all(APP_SHELL.map(function (url) {
        return cache.add(url).catch(function (err) {
          console.warn("[such-tool-sw] Precache übersprungen:", url, err);
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
  if (req.method !== "GET") return; // nur GET cachen

  var url;
  try { url = new URL(req.url); } catch (_e) { return; }

  // Fremd-Origin (CDN-Modell, KI-/Sprach-API): durchreichen, nicht cachen.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        // Erfolgreiche same-origin GETs der App-Schale nachcachen.
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Offline + Navigation → App-Schale liefern.
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
