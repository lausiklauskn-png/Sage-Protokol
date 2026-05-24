# 2026-05-24 · Bau-Sitzung 15.SW — Membran Sub (e) SW-Probe-Detektor

**Sitzungs-Rolle:** Bau-Sitzung. Branch
`claude/bau-15sw-membran-sw-probe`. Anschluss-Sitzung an Bau-Sitzung 15
vom selben Tag (Brief `docs/sessions/BRIEF_BAU_15SW_MEMBRAN_SW_PROBE.md`).

## Auftrag

`src/sbkim-sw.js` additiv um einen vorgezogenen Sub-(e)-Probe-Hook
erweitern, der eingehende Fetches auf SBKIM-Endpunkte fail-soft als
„fremd" bzw. „same-origin" klassifiziert und Fremd-Versuche via
`BroadcastChannel('sbkim-membrane')` an die Page-Membran-Schicht
postet (Empfänger ist `subscribeBroadcastChannel`-Closure in
`src/modules/15_membran.js` aus Bau 15).

KEIN Eingriff in die drei bestehenden `handleBridge`-Pfade
ANASTOMOSIS/LEGACY/HETEROKARYOSIS, KEIN `respondWith`, Probe-Hook ist
passiv-beobachtend (Spec-Wille Sub (e) ist Beobachtung + Anzeige,
kein Filter).

## Geänderte Dateien

- `src/sbkim-sw.js` (273 → 396 Zeilen, additiv)
- `tests/manual_check.html` (Panel 15, sieben → neun Knöpfe)
- `docs/components/15_membran.md` (§ Bauzustand-Tabelle: Sichttest-
  Zeile erweitert, neue Zeile „Code geschrieben (SW-Seite)")
- `docs/INTERFACES.md` (§ 1 Modul 15 Storage-Block:
  BroadcastChannel-Doppel-Schreiber-Hinweis)
- `status.json` (membranBacklog[0]: `siegel` + `kurz` ergänzt,
  `score:"stub"` UNVERÄNDERT)
- `docs/PULS.md` (Tabellenzeile 15 in Schnellüberblick + Sitzungs-
  Eintrag oben)

## Eingriffe im Detail

### `src/sbkim-sw.js`

**Konstanten am Modul-Anfang ergänzt:**

```js
const MEMBRANE_PROBE_CHANNEL = "sbkim-membrane";
const MEMBRANE_PROBE_MESSAGE_TYPE = "SBKIM_MEMBRANE_PROBE";
const SBKIM_ENDPOINT_PATHS = [
  "/sbkim/spore.json",
  ANASTOMOSIS_PATH,
  LEGACY_PATH,
  HETEROKARYOSIS_PATH,
];
```

`/sbkim/query` bewusst weggelassen — Modul 04.C Search-API
serverseitig noch nicht da, der Detektor würde sonst für noch nicht
existierende Endpunkte feuern.

**fetch-Listener-Erweiterung:**

```js
self.addEventListener("fetch", (event) => {
  // Sub-(e)-Hook ZUERST: beobachtet jeden Request auf einen SBKIM-
  // Endpunkt synchron + fail-soft (kein await, kein respondWith).
  // Die drei Bridge-Branches unten bleiben unberührt.
  maybeRecordMembraneProbe(event.request);

  const url = new URL(event.request.url);
  if (isOwnEndpoint(url.pathname, ANASTOMOSIS_PATH)) { ... }
  ...
});
```

**Drei neue Hilfsfunktionen am Datei-Ende:**

- `maybeRecordMembraneProbe(request)` — Pfad-Filter → Fremd-Bewertung
  → Entry bauen → Broadcast posten, alles try/catch-gekapselt.
- `pathMatchesSbkimEndpoint(pathname)` — iteriert `SBKIM_ENDPOINT_PATHS`
  und nutzt die bestehende `isOwnEndpoint(pathname, p)`-Funktion
  (scope-aware, gleicher Pfad-Pattern wie die drei Bridge-Branches).
- `classifyOrigin(url, secFetchSite, referer)` — exakt nach Karte 15
  § Fremd-Definition Reihenfolge 1→4:
  1. `url.origin !== self.location.origin` → Fremd, `origin =
     url.origin`.
  2. `Sec-Fetch-Site ∈ {"cross-site", "same-site"}` → Fremd,
     `origin` aus Referer.
  3. `Sec-Fetch-Site === "same-origin"` ODER `"none"` ODER fehlend
     → same-origin (kein Eintrag), **Ausnahme**: wenn `Sec-Fetch-Site`
     ganz fehlt UND `Referer`-Origin auf eine fremde Origin zeigt
     (alte Browser, Cross-Origin-Iframes ohne Sec-Fetch-Site-Header)
     → Fremd (Schritt 4 Fallback).
- `postProbeViaBroadcastChannel(entry)` — pro Probe neue Channel-
  Instanz (open → postMessage → close), try/catch/finally fail-soft.
  Long-lived Channel im SW braucht eigene Lebenszyklus-Logik (idle-
  Tear-Down, Reactivation nach Suspension) — Per-Probe-Channel ist
  die einfache, thread-sichere Variante, BroadcastChannel ist billig.
  Folge-Pflege kann auf long-lived umstellen, falls Probe-Volumen je
  zum Bottleneck wird (vermutlich nie).

**`FremdzugriffEntry`-Form (aus dem SW):**

```js
{
  at: new Date().toISOString(),
  kind: "endpoint-probe",
  origin: <Schema+Host+Port von URL oder Referer oder null>,
  agentHint: null,            // SW hat keinen zuverlässigen UA
  endpoint: url.pathname,
  decision: "accepted",       // SW erkennt nur, bedient nicht
  details: {
    method: request.method,
    secFetchSite: request.headers.get('Sec-Fetch-Site') || null,
  },
}
```

`agentHint:null` bewusst — der Cross-Origin-Fetcher sendet in der
Regel keinen `User-Agent`-Header an Sub-Resources, der SW kann ihn
ohnehin nicht zuverlässig auslesen. Die Page-Schicht setzt nicht nach
(Schema-konform). `decision:"accepted"` heißt: aus Sicht der Membran
wurde der Versuch wahrgenommen und an die Page durchgelassen — die
Bridge-Branches (Modul 05/06/07) entscheiden später, was sie tun
(z.B. „toNodeId stimmt nicht zum Empfänger"-`rejected`-Antwort), das
wird hier nicht widergespiegelt.

### `tests/manual_check.html` Panel 15

**Knopf 8 „SW-Probe-Simulation via BroadcastChannel"** (neu):
testet den End-to-End-Pfad SW→Page ohne SW-Lauf via direktem
`new BroadcastChannel("sbkim-membrane").postMessage({type:
"SBKIM_MEMBRANE_PROBE", entry:{...}})`. Erwartet einen Eintrag mit
`kind:"endpoint-probe"`, `details.method:"GET"`,
`details.secFetchSite:"cross-site"` + Lampe trägt `fremd-alert`.
BroadcastChannel ist asynchron im Browser — Test wartet 30 ms vor
der `list()`-Probe (typisch < 5 ms intra-process, 30 ms ist
großzügig dosiert). `channel.close()` am Ende im `finally`-Block.

**Knopf 9 „Live-SW-Probe-Auslöser (Hinweis)"** (neu): kein
automatischer Test — instruiert Klaus per `<pre>`-Output, dass ein
echter SW-Probe-Test eine zweite Origin braucht (z.B. von Mein-
Mixarium-PWA auf
`https://lausiklauskn-png.github.io/Sage-Protokol/sbkim/spore.json`
fetchen) und in der Sage-Page-Lampe `#lamp-fremd` rot wird; in
`tests/manual_check.html` allein nicht reproduzierbar.

## Validierung

- `node --check src/sbkim-sw.js` grün.
- Alle 11 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  syntaktisch grün (Python-Skript extrahiert und ruft `node --check`
  pro Block).
- **Headless-Smoke-Test 21/21 grün** (Node `vm.createContext` mit
  `self`-/`BroadcastChannel`-Stub, ad-hoc):
  - Cross-site Sec-Fetch-Site → 1 probe (alle 9 Felder geprüft).
  - Same-origin Sec-Fetch-Site → 0 probes.
  - Sec-Fetch-Site:none → 0 probes.
  - Non-SBKIM-Endpoint → 0 probes.
  - URL-Origin direkt fremd (Schritt 1, kein Sec-Fetch-Site nötig)
    → 1 probe mit `origin = url.origin`.
  - same-site Sec-Fetch-Site → fremd mit `origin` aus Referer
    (Subdomain-Pfad).
  - Sec-Fetch-Site fehlt + Referer fremd → fremd (Fallback Schritt 4).
  - `/sbkim/query` NICHT gefiltert → 0 probes.
  - Kein Sec-Fetch-Site + kein Referer → 0 probes (defensiv als
    same-origin gewertet).

## Sichttest

**Ungeprüft — wartet auf Klaus' Browser-Lauf:**

- Panel 15 Knopf 8 SW-Probe-Simulation via BroadcastChannel in
  `tests/manual_check.html` (DeX-Chrome auf Galaxy Tab S6, Hard-Reload
  nach Pull). Erwartung: ein Eintrag mit `kind:endpoint-probe` +
  `details.method:GET` + Lampe `fremd-alert` an Fake-Lampe.
- Panel 15 Knopf 9 ist nur Klaus-Hinweis — kein automatischer Test.
- **Echter Live-Cross-Origin-Test braucht zwei Origins** und ist
  headless nicht reproduzierbar — Anleitung steht im Knopf-9-Output.

## Disziplin / Tabus eingehalten

- KEIN Eingriff in die drei bestehenden `handleBridge`-Pfade (05/07/06).
- KEIN `respondWith()` im Probe-Hook (Sub (e) ist passiv-beobachtend,
  Spec-Wille).
- KEIN Eingriff in das Empfangsmodus-Prinzip — SW-Sender postet nur
  an die BroadcastChannel-Subscriber (Page-Sub-(e)-Schicht), antwortet
  nicht ins Netz.
- KEIN Storage-Eingriff, KEIN `DB_VERSION`-Bump, KEIN
  `PROTOCOL_VERSION`-Bump.
- KEIN neuer Storage-Store, KEIN neues `MEMBRANE_*`-§0-Konstanten-
  Bump (`SW`-spezifische Konstanten sind alle modul-lokal in
  `src/sbkim-sw.js`).
- KEIN Replay-/Dedupe-Schutz im Probe-Pfad (Sub (e) ist Beobachtung,
  jeder Probe-Versuch sehenswert; Modul 11 Rate-Limit kann später
  hooken).
- KEIN long-lived BroadcastChannel-Instanz im SW (Lebenszyklus-Logik
  hier nicht nötig — Per-Probe-Channel reicht).
- `/sbkim/query` NICHT in den Pfad-Filter (Modul 04.C Search-API noch
  nicht da serverseitig).
- KEINE Karten-10/11/12-Änderung (Schutz-Backlog unangetastet —
  kommen erst NACH Sub (a)+(b) finalem Bau).
- KEINE Endknoten-Migration (Karte 09 § Schritt 10 wartet auf
  Sub (b)-Spec).

## status.json

- `membranBacklog[0].score`: bleibt `"stub"` (Sub (a)+(b)+(c) noch offen).
- `membranBacklog[0].siegel`: `"Code-Stub (Bau-Sitzung 15 Sub (e)
  2026-05-24 + SW-Probe-Detektor Bau 15.SW 2026-05-24), Priorität
  hoch (Auslöser Gemini 3.5 Flash)"`.
- `membranBacklog[0].kurz`: um Bau-15.SW-Block erweitert (Hook-Position,
  vier Endpunkte mit `/sbkim/query`-Ausnahme, Fremd-Bewertungs-
  Reihenfolge 1→4, Per-Probe-Channel-Strategie).
- `lastUpdated`: bleibt `2026-05-24` (heutiges Datum, konsistent).
- `update_puls_pie.py` aufgerufen — Pie unverändert („PULS-Pie ist
  bereits aktuell").

## Vorgemerkt — Folge-Sitzungen

- **Spec-Sitzung 15.B** für Sub (a) Read-API + Sub (b) postMessage-
  Bedienungs-Pfad finalisieren.
- **Endknoten-Migration Karte 09 § Schritt 10** (Membran-Allowlist +
  Lampe in PWA-Header anhängen) — eigene Folge-Pflege, blockiert
  durch Sub (b) finale Spec.
- **`/sbkim/query`-Endpunkt im Pfad-Filter** ergänzen, sobald
  Modul 04.C Search-API serverseitig steht.
- **Long-lived BroadcastChannel-Instanz im SW** mit Lebenszyklus-
  Logik nur dann, wenn Probe-Volumen so hoch wird, dass Per-Probe-
  Channel-Open zum Bottleneck wird (vermutlich nie).
- **Karten 10 / 11 / 12 (Schutz-Backlog)** — kommen erst NACH Sub (a)+(b)
  finalem Bau.

## Nächster sinnvoller Schritt

Klaus' Browser-Sichttest in Panel 15 Knopf 8 + 9 (DeX-Chrome auf
Galaxy Tab S6, Hard-Reload nach Pull). Danach Spec-Sitzung 15.B
für Sub (a) Read-API + Sub (b) postMessage-Bedienungs-Pfad — Klaus
triggert mit `Befehl schreiben`.
