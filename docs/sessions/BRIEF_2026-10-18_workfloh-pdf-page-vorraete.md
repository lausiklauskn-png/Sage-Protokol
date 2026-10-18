# Brief · Workfloh-PDF-Page: der Service-Worker löscht fremde Vorräte

Stand: 2026-10-18, aus der Sitzung „Installieren-Knopf in jede App“ (Übergabe:
`docs/sessions/archiv/2026-10-18_installieren-knopf.md`). Klaus' Wort am Ende:
*„für die neue Sitzung wäre dann nur noch Workflow PDF Page. Der Service Worker,
dass er nicht die anderen Apps löscht … oder die Vorräte.“*

## Der Befund (gelesen auf `origin/main`, nicht gemessen)

`Workfloh-PDF-Page/sw.js`, Fassung `workfloh-pdf-page-v14`:

```js
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))…
```

`caches.keys()` liefert **alle** Vorräte des Ursprungs. Auf
`lausiklauskn-png.github.io` teilen sich rund 30 Apps diesen Ursprung. Jede
Aktivierung einer neuen Fassung dieser Seite löscht damit die Offline-Vorräte
**aller** anderen Apps (Workflow PDF, Mixarium, Rezeptbücher, WorkFlohs …).
Deren Daten in IndexedDB/localStorage bleiben, aber die Apps laufen bis zum
nächsten Online-Besuch nicht mehr offline.

## Was zu tun ist

1. Aufräumen nur mit eigenem Präfix: `k.startsWith('workfloh-pdf-page-') && k !== CACHE_VERSION`.
2. `CACHE_VERSION` erhöhen (v15), alle `?v=` wie bisher.
3. Eine Probe in `tests/seite.mjs` (die Seite hat `npm test`): einen fremden
   Vorrat (`fremd-app-v1`) anlegen, den Worker aktivieren, der fremde Vorrat
   muss bleiben, ein alter eigener (`workfloh-pdf-page-v1`) muss weg.
   Gegenprobe von Hand: mit der alten Zeile wird genau diese Zeile rot.
4. **Netzweit nachsehen**, ob noch ein Worker so aufräumt — Suche nach
   `k !== CACHE` / `filter(k => k !==` in allen Repos auf github.io. Bekannt
   richtig: Kim-sync (`^kimsync-v`), SB·KIMTool·Point (`kimtool-point-`),
   In-and-Out-Book (`inout-*`). Fund melden, nicht stillschweigend mitreparieren,
   wenn es nicht Workfloh-PDF-Page ist (Klaus' Auftrag nennt nur diese Seite).
5. Vermerk in `Workfloh-PDF-Page/CLAUDE.md`, PR, Selbst-Merge, danach
   „pages build and deployment“ ansehen.

## Benannte Grenze

Was ein früherer Lauf schon gelöscht hat, kommt nicht zurück; die anderen Apps
füllen ihren Vorrat beim nächsten Online-Besuch selbst wieder. Am Tablet nicht
messbar.
