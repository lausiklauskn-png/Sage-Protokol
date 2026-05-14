/*
 * SBKIM — Service-Worker für statisch gehostete Endknoten
 *
 * Variante A · Page-Hosted via MessageChannel.
 *
 * Fängt eingehende POST /sbkim/anastomosis (Modul 05) und POST
 * /sbkim/legacy (Modul 07) ab und leitet den Body via postMessage an
 * die aktive Page weiter. Die Page hält die Krypto und den State
 * (window.SbkimAnastomose, window.SbkimApoptose); der SW bleibt dünn
 * und blind. Beide Pfade nutzen denselben fetch-Listener (gemeinsamer
 * Einstieg, leichter erweiterbar für Modul 06 / 11).
 *
 * Vertrag (siehe INTERFACES.md §3, docs/components/05_anastomose.md
 * § "Service-Worker-Hinweis" und docs/components/07_apoptose.md):
 *
 *   - POST /sbkim/anastomosis  → SBKIM_ANASTOMOSIS_REQUEST
 *   - POST /sbkim/legacy       → SBKIM_LEGACY_REQUEST
 *   - Content-Type: application/json
 *   - Body ≤ 64 KiB
 *   - andere Methode → 405
 *   - falscher Content-Type → 415
 *   - Body zu groß → 413
 *   - keine Page-Instanz aktiv → 503
 *   - Page antwortet nicht binnen QUERY_TIMEOUT_MS → 503
 *
 * Diese Datei ist KEIN ES-Modul — sie wird mit
 *   navigator.serviceWorker.register("/sbkim-sw.js")
 * registriert (Pfad im jeweiligen Endknoten-Repo passend setzen). Der
 * Einbau-Schritt in eine Endknoten-PWA gehört in Modul 09.
 *
 * Bewusst weggelassen (für eine Folge-Pflege-Sitzung):
 *   - Caching/Offline-Strategien: der SW dient hier ausschließlich der
 *     SBKIM-Brücke, nicht der App-Performance.
 *   - Wake-Lock / Auto-Tab-Öffnen: "Wer nicht da ist, schweigt" ist
 *     Teil der Spec.
 *   - Replay-Cache (nonce-Wiederholungserkennung) — Modul 11.
 */
"use strict";

const ANASTOMOSIS_PATH = "/sbkim/anastomosis";
const LEGACY_PATH = "/sbkim/legacy";
const MAX_BODY_BYTES = 64 * 1024;
const PAGE_TIMEOUT_MS = 4000;
const ANASTOMOSIS_REQUEST_TYPE = "SBKIM_ANASTOMOSIS_REQUEST";
const LEGACY_REQUEST_TYPE = "SBKIM_LEGACY_REQUEST";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Ein gemeinsamer fetch-Listener für alle SBKIM-Endpunkte. Neue Pfade
// (z.B. /sbkim/heterokaryosis für Modul 06) reihen sich hier ein, statt
// einen eigenen Listener anzulegen.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (isPathSuffix(url.pathname, ANASTOMOSIS_PATH)) {
    event.respondWith(handleBridge(event.request, event.clientId, ANASTOMOSIS_REQUEST_TYPE));
    return;
  }
  if (isPathSuffix(url.pathname, LEGACY_PATH)) {
    event.respondWith(handleBridge(event.request, event.clientId, LEGACY_REQUEST_TYPE));
    return;
  }
  // sonst: nicht unsere Sache — Default-Network-Pfad lassen.
});

function isPathSuffix(pathname, endpointPath) {
  // Erlaubt sowohl exakt /sbkim/<endpoint> als auch <scope>/sbkim/<endpoint>
  // (z.B. /rezeptbuch/sbkim/legacy bei GitHub-Pages-Project-Sites).
  if (pathname === endpointPath) return true;
  return pathname.endsWith(endpointPath);
}

async function handleBridge(request, originatingClientId, messageType) {
  if (request.method !== "POST") {
    return jsonError(405, "Method Not Allowed", { Allow: "POST" });
  }

  const ct = (request.headers.get("content-type") || "").toLowerCase();
  if (!ct.startsWith("application/json")) {
    return jsonError(415, "Unsupported Media Type — application/json erwartet.");
  }

  let raw;
  try {
    raw = await request.text();
  } catch (err) {
    return jsonError(400, "Bad Request: Body nicht lesbar.");
  }

  // Body-Längen-Schutz. Wir messen nach UTF-8-Byte-Länge, weil 64 KiB
  // sich auf Bytes auf der Leitung bezieht.
  const bodyBytes = new TextEncoder().encode(raw).length;
  if (bodyBytes > MAX_BODY_BYTES) {
    return jsonError(413, "Payload Too Large — Body > " + MAX_BODY_BYTES + " Bytes.");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return jsonError(400, "Bad Request: kein gültiges JSON.");
  }

  // Aktive Clients suchen. Bevorzugt den Tab, der den Request ausgelöst hat;
  // wenn das (typisch Cross-Tab-POST) nicht klappt, irgendein offener.
  const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  if (clientList.length === 0) {
    return jsonError(503, "Service Unavailable — keine aktive Page-Instanz.");
  }
  const target = clientList.find((c) => c.id === originatingClientId) || clientList[0];

  let pageResponse;
  try {
    pageResponse = await askPage(target, parsed, messageType);
  } catch (err) {
    return jsonError(503, "Service Unavailable — Page hat nicht geantwortet (" + (err && err.message ? err.message : err) + ").");
  }

  return new Response(JSON.stringify(pageResponse), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function askPage(client, sbkimRequest, messageType) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeoutId = setTimeout(() => {
      try { channel.port1.close(); } catch (e) { /* schon zu */ }
      reject(new Error("page-timeout"));
    }, PAGE_TIMEOUT_MS);

    channel.port1.onmessage = (event) => {
      clearTimeout(timeoutId);
      try { channel.port1.close(); } catch (e) { /* nb */ }
      resolve(event.data);
    };

    try {
      client.postMessage(
        { type: messageType, request: sbkimRequest },
        [channel.port2],
      );
    } catch (err) {
      clearTimeout(timeoutId);
      reject(err);
    }
  });
}

function jsonError(status, reason, extraHeaders) {
  const headers = Object.assign(
    { "Content-Type": "application/json" },
    extraHeaders || {},
  );
  const body = JSON.stringify({ outcome: "rejected", reason: reason });
  return new Response(body, { status: status, headers: headers });
}
