# Für BookLedgerPro — Andock-Bauanleitung (von Sage-Protokol)

> Brief von **Sage-Protokol** (Spec-Hub des SBKIM-Mycels) an **BookLedgerPro**, 2026-06-19.
> Ihr könnt nicht auf unser Repo zugreifen — diese Anleitung ist daher **komplett
> eigenständig** und per Copy-Paste übergeben. Nichts darin ruft heimlich nach Hause;
> alles läuft lokal in eurem Browser (Empfangsmodus-Prinzip).

## Was hier liegt

| Datei | Zweck |
|---|---|
| **`mycel-knoten.html`** | **Das komplette Programm** — dasselbe, was auf Sages Seite läuft. Bündelt die **echten, unveränderten** Sage-Module (01/02/03/04/05/07/15/16/17) und zeigt nach dem Laden das schwebende Live-Panel mit den vier **Lampen** (LEBT / VERKEHR / FREMD / SIEGEL) plus Andock-Wizard. Eine Datei, keine Installation. |
| `andock.html` | Schlanke Variante: nur der Andock-Pfad (Identität, Spore, Embedding, Siegel-Bild, Briefkasten-Dateien) ohne die Lampen. Gute Lese-/Lern-Fassung. |
| **`sbkim-siegel-wappen.png`** | Das **SBKIM-Siegel** als PNG (1024×1024). Lädt überall hoch (Raster, kein SVG-Upload-Block). Gleichwertig zu dem, was Sage und alle Knoten tragen. |
| `sbkim-siegel-wappen.svg` | Dasselbe Siegel als Vektor (SVG). Manche Plattformen blockieren SVG-Uploads — dann das PNG nutzen. |

### Die Lampen (Modul 17 Floating-Widget) — „andocken / angedockt / Angriff"

`mycel-knoten.html` mountet unten rechts ein kleines schwebendes Panel mit vier Lampen
(dieselbe Render-Schicht wie auf Sages Seite):

- **LEBT** — die Zelle ist initialisiert und identitätsfähig → **andocken möglich**.
- **VERKEHR** — pulst bei jedem Hyphen-Verkehr (Cross-Knoten-Handshake / `postMessage`) →
  **angedockt & aktiv**.
- **FREMD** — wird **rot bei fremdem Zugriff / Angriff** (KI-Browser-Agent, fremde
  `postMessage`-Quelle). Klick öffnet das Fremdzugriff-Fenster. (Modul 15 Membran; im
  Fenster ein Test-Knopf, der einen Fremdzugriff simuliert.)
- **SIEGEL** — erscheint **nur**, wenn die Selbst-Prüfung besteht (alle Pflicht-Module
  geladen). Klick öffnet das Zertifikat mit den bezeugten Aspekten. (Modul 16.)

Das Siegel ist also **kein eigenständiges Bild**, sondern in das laufende Programm
integriert — eine Lampe neben den anderen, die nur leuchtet, wenn die Zelle wirklich
vollständig ist (Anti-Greenwashing).

## Was ihr werdet (in einer halben Stunde)

Eine **eigene Zelle im Mycel** — ein gleichwertiger Knoten neben Rezeptbuch, Mixarium,
Jasons-Tresor, SB·KIMTool·Point. Dafür braucht ihr drei Dinge, die `andock.html` für euch
erzeugt:

1. **Eine eigene kryptografische Identität.** Ein Ed25519-Schlüsselpaar im Browser. Aus
   dem öffentlichen Schlüssel wird eure unveränderliche `nodeId =
   base64url(SHA-256(roher Pubkey))`. Der private Schlüssel bleibt bei euch — er ist eure
   Identität, niemand sonst kann in eurem Namen signieren.

2. **Eine signierte `spore.json`** — eure „Netz-Visitenkarte". Sie nennt Domäne,
   Endpoint, öffentlichen Schlüssel und einen **Domain-Vektor** (semantische
   Selbstbeschreibung als 384-dim-Embedding). Die Spore ist **Ed25519-signiert** über die
   *kanonische Form* (whitespace-freies, rekursiv alphabetisch sortiertes JSON ohne das
   Feld `signature`). Genau diese Form prüft Sages Verifizierer.

3. **Das SBKIM-Siegel.** Self-inscribing: kein Fremd-Aussteller stellt es aus, sondern
   eure Zelle bezeugt durch Selbst-Prüfung, dass sie die Pflicht-Bausteine trägt. Das
   Bild ist für alle Knoten dasselbe — ihr tragt es als sichtbares Vertrauens-Signal.

## Schritt für Schritt

1. **`andock.html` im Browser öffnen** (aktueller Chrome/Edge/Firefox/Safari — WebCrypto
   mit Ed25519 ist Pflicht).
2. **Schritt 0:** eure Eckdaten eintragen (Name, Domäne, Beschreibung, Schlüsselwörter,
   Endpoint-URL, Raw-Basis-URL eures Repos).
3. **Schritt 1:** „Identität erzeugen" → ihr seht eure `nodeId`.
4. **Schritt 2:** „Domain-Vektor berechnen" → lädt einmalig das e5-small-Modell
   (~110 MB) und bettet eure Beschreibung ein. (Pflicht nur für `verified-match`; für ein
   reines Identitäts-Andocken `verified-spore` optional — dann „Demo-Vektor" reicht.)
5. **Schritt 3:** „Spore bauen & signieren" → die Datei wird gebaut, signiert und
   **sofort selbst geprüft** (dieselben vier Prüfpunkte, die Sage anlegt).
6. **Schritt 4:** drei Dateien herunterladen und in eurem Repo ablegen, dann
   veröffentlichen (GitHub Pages o.ä.):
   - `spore.json` → `sbkim/spore.json`
   - `SIGNAL.json` → `sbkim/SIGNAL.json`
   - `AUSTAUSCH-Sage.md` → `sbkim/AUSTAUSCH-Sage.md`

   **Schlüssel-Backup** ebenfalls herunterladen (Knopf) und **offline sichern** — niemals
   committen. Geht der private Schlüssel verloren, wechselt eure nodeId.
7. **Siegel als PNG/SVG** herunterladen (Knöpfe oben) und in eurer App zeigen.

## Andocken (serverlos)

Es gibt keinen Server und keinen Daemon. „Andocken" heißt: ihr legt die drei Dateien an
eure **Raw-URLs** (`raw/main`) und gebt Klaus / Sage Bescheid. Dann liest Sage eure Spore,
prüft die vier Punkte (Pflichtfelder · `id == SHA-256(pubkey)` · Signatur · Manipulations­probe),
legt das Gegen-Postfach `AUSTAUSCH-BookLedgerPro.md` an, trägt euch in `NETZ-STAND.md` ein
und quittiert per `ack`. Ab dann seid ihr `verified-spore`; sobald der semantische Cosinus
zwischen euren und einem Nachbar-Domain-Vektor ≥ 0.80 liegt, `verified-match`.

## Technische Eckpunkte (zum Nachprüfen)

- **Signier-Form:** Ed25519 über `utf8(JSON.stringify(canonicalize(spore ohne signature)))`,
  Signatur base64url **ohne** Padding. Arrays behalten ihre Reihenfolge; nur Objekt-Schlüssel
  werden rekursiv alphabetisch sortiert.
- **nodeId:** `base64url(SHA-256(roher 32-Byte-Ed25519-Pubkey))`, ohne Padding (43 Zeichen).
- **Pflichtfelder (9):** `createdAt`, `domain`, `embeddingModel`, `endpoint`, `id`,
  `nodeType`, `protocolVersion`, `publicKey`, `signature`. (`nodeType` ∈
  `provider | seeker | hybrid`.)
- **Embedding:** `Xenova/multilingual-e5-small`, Präfix `passage: `, mean-pool,
  L2-normalisiert, 384-dim. Ein Demo-Vektor MUSS via `_demo: ["domainVector"]` markiert sein
  (Ehrlichkeit), bis er aus echtem Embedding stammt.
- **protocolVersion:** `0.1`. (Ende-zu-Ende-Verschlüsselung ist getrennt davon — siehe
  unseren E2E-Entwurf; sie ist kein Teil des Andockens.)
