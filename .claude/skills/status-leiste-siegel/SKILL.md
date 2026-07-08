---
name: status-leiste-siegel
description: Kanonische Reihenfolge, um eine SBKIM-PWA/Seite mit der immer sichtbaren Status-Lampen-Leiste (Flying-Widget, Modul 17 — LEBT/VERKEHR/FREMD/SIEGEL) + dem Selbst-Siegel (Modul 16, Bronze/Gold) + dem Wächter (Modul 15 Membran, FREMD-Erkennung) auszustatten. Anwenden, wenn eine von Klaus' PWAs oder Pages (Kim-Bell, Mixarium, Rezeptbuch, SB-KIMTool-Point, Sage-Page, family-project, künftige Tools) den vollen Status-/Vertrauens-Anzeiger bekommen soll — ODER wenn der Status nur im Siegel steckt (man müsste es jedesmal öffnen) statt dauerhaft sichtbar zu sein. Sichert die verbindliche Lade-/Init-Reihenfolge (Widget VOR Membran/Siegel), das automatische Bronze/Gold-Siegel und die ehrliche Lampen-Semantik.
---

# Status-Lampen-Leiste + Selbst-Siegel (SBKIM Flying-Widget)

Die feste Reihenfolge, mit der eine SBKIM-PWA oder -Seite die **dauerhaft
sichtbare Status-Lampen-Leiste** (Modul 17) plus **Selbst-Siegel** (Modul 16) und
**Wächter** (Modul 15 Membran) bekommt. Wird **eingebaut, nicht jedes Mal neu
erfunden** — Modul-Dateien werden **byte-1:1 kopiert** (Drift-Guard im Smoke).

## Was das Werkzeug ist

Eine kleine, selbst-mountende, verschiebbare **Lampen-Pille** (Eruda-Stil,
`position:fixed`), die den Live-Zustand des Knotens zeigt — **immer sichtbar,
nicht im Siegel-Modal versteckt**:

| Lampe | Bedeutung | Quelle (Event) |
|---|---|---|
| **LEBT** | Der Knoten lebt (Spore aktiv seit `init()`). | Modul 02 → `sbkim:alive` (+ Self-Heartbeat) |
| **VERKEHR** | **Grün, solange am Relais gelauscht wird** (verbunden); **pulst** bei Handshakes/postMessages. | Modul 05/23 → `sbkim:nostr-listening {active}` · `sbkim:handshake` · `sbkim:postmessage` |
| **FREMD** | Rot, wenn ein Fremdzugriff im Puffer liegt (Browser-KI-Agent / App-Brücke). | Modul 15 → `sbkim:fremd-alert` |
| **SIEGEL** | Erscheint, sobald der Knoten **zertifiziert** ist; Bronze → Gold. | Modul 16 → `sbkim:siegel-certified` |

Klick auf eine Lampe öffnet ihr Modal (LEBT/VERKEHR baut Modul 17 selbst;
FREMD/SIEGEL brücken zu Modul 15/16 über Proxy-Spans im Widget-Inneren).

## Wann das Siegel kommt (automatisch, ohne Zutun)

- **Bronze — beim Start:** sobald die **7 Pflicht-Module** geladen sind
  (Selbst-Prüfung, Surface-Check): **01** Storage · **02** Spore · **03**
  Embedding · **04** Match · **05** Anastomose · **07** Apoptose · **15** Membran.
  Fehlt eines, gibt es **kein** Siegel (Anti-Greenwashing — kein Siegel ohne
  erfüllte Selbst-Prüfung).
- **Gold — nach dem ersten Handshake:** sobald `sbkim:handshake outcome:"established"`
  gefeuert hat (Mycel-Verbindung etabliert). Idempotent, mit 600-ms-Stufenwechsel.

Merke: Das Siegel hängt **nicht** an „Embedding + Handshake", sondern an
**7-Module-vorhanden** (Bronze) und **Handshake-established** (Gold). Embedding
ist nur **eines** der sieben.

## Die verbindliche Reihenfolge (nicht vertauschen)

Der Knackpunkt: **Modul 17 (Widget) MUSS VOR Modul 15 (Membran) und Modul 16
(Siegel) inited werden.** Das Widget legt in seinem Inneren die **Proxy-Spans**
`#lamp-fremd` + `#sbkim-siegel-badge` an — Membran (FREMD-Lampe) und Siegel
(Badge) hängen sich daran. Ohne diese Reihenfolge bleiben FREMD/SIEGEL stumm.

```
1. SbkimStorage.init({ dbSuffix: "<app-suffix>" })   // eigene Schublade zuerst
2. await SbkimWidget.init({ allowedOrigins, repoUrl })   // 17 — legt Proxy-Spans an
3. SbkimMembrane.init({ allowedOrigins })                // 15 — Wächter/FREMD
4. SbkimSiegel.init({ badgeSelector:"#sbkim-siegel-badge", repoUrl })  // 16 — Bronze/Gold
5. SbkimApoptose.init()                                   // 07 — eines der 7 Pflicht-Module
```

Die übrigen Pflicht-Module (02/03/04/05) werden ohnehin für die App geladen; sie
müssen nur **als Skript vorhanden** sein, wenn Siegel seine Selbst-Prüfung macht.

## Bauform (kopieren, nicht klonen)

### 1. Modul-Dateien byte-1:1 kopieren
In den `modules/`- bzw. `sbkim/`-Ordner der App (kanonische Quelle: Sage
`src/modules/` bzw. eine bereits ausgestattete App wie **Kim-Bell** /
**SB-KIMTool-Point**):

- `sbkim-floating-widget.js` (Modul 17)
- `sbkim-membran.js` (Modul 15)
- `sbkim-siegel.js` (Modul 16)
- `sbkim-apoptose.js` (Modul 07)
- (die übrigen Pflicht-Module 01/02/03/04/05 sind bei einem Netz-Knoten schon da)

**Drift-Guard:** die sha256 jeder Kopie im Smoke-Test festhalten (wie
`Kim-Bell/test/smoke.test.js`), damit „kopieren, nicht klonen" nachprüfbar bleibt.

### 2. Skripte laden (Reihenfolge im HTML)
```html
<script src="./modules/sbkim-floating-widget.js"></script>
<script src="./modules/sbkim-apoptose.js"></script>
<script src="./modules/sbkim-membran.js"></script>
<script src="./modules/sbkim-siegel.js"></script>
<!-- … Rendezvous/Relais/Spore-Stack … -->
<script src="./assets/schutz-init.js"></script>   <!-- die Init-Kette -->
```

### 3. Init-Kette (app-eigen, nur 2 Werte anpassen)
Vorlage 1:1 aus **`Kim-Bell/assets/schutz-init.js`** kopieren — dort nur
`ALLOWED_ORIGINS` (die Origin der App, z.B. `https://lausiklauskn-png.github.io`)
und `REPO_URL` anpassen. Die Kette macht Widget → Membran → Siegel (+ Apoptose)
in der Pflicht-Reihenfolge, fail-soft. Alternativ das Muster aus
**`Mein-Mixarium/sbkim/sbkim-init.js`** (Z. 15–29).

### 4. Service-Worker
Die neuen Dateien in die `APP_SHELL`-Liste des SW aufnehmen und `CACHE_VERSION`
erhöhen (Cache-Bust), sonst liefert der SW die alte Schale.

## Schlank vs. voll (bewusste Entscheidung)

- **Schlanke Tools** (reines Netz-Werkzeug, das nur verbinden soll) dürfen die
  Leiste **ohne** Membran/Siegel fahren — dann leuchten nur **LEBT** + **VERKEHR**,
  FREMD/SIEGEL bleiben aus. Das ist **ehrlich**, kein Fehler.
- **Volle Knoten** (Endknoten mit Inhalt) laden alle 7 Pflicht-Module + 15/16 →
  bekommen FREMD + SIEGEL (Bronze/Gold) automatisch.
- Ein schlankes Tool nachträglich „voll" machen = die 07/15/16-Dateien + die
  Init-Kette ergänzen (siehe Kim-Bell PR-Historie 2026-07-08).

## Verfassungs-Treue (Leitplanken)

- **Immer sichtbar, nicht im Siegel vergraben.** Die Leiste ist der dauerhafte
  Anzeiger; das Siegel-Modal ist nur der Detail-Klick. (Klaus 2026-07-08: „im
  Siegel ist es automatisch mit drin, aber dann muss man jedesmal das Siegel
  öffnen".)
- **Ehrliche Lampen.** Eine Lampe leuchtet nur, wenn ihr Modul wirklich geladen
  ist und ihr Event feuert. Kein Fake-Grün, kein Siegel ohne erfüllte Selbst-Prüfung.
- **Kopieren, nicht klonen.** Modul-Dateien byte-1:1, Drift-Guard im Smoke.
- **TABU unberührt:** `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel), `DB_VERSION`,
  `PROTOCOL_VERSION`. Kern-Module werden benutzt, nicht umgebaut.
- **Sicherheits-Module pflegen Aspekte.** Wer Modul 15/16 berührt, trägt einen
  `ZERTIFIKAT_ASPEKTE`-Eintrag im Siegel-Modul nach (Datum + Modul-ID + ein Satz).
- **Reihenfolge ist Pflicht:** Widget (17) vor Membran (15)/Siegel (16).

## Referenz-Implementierungen

- **Kim-Bell** — voller Knoten als schlankes Netz-Tool: `assets/schutz-init.js`
  (Init-Kette), `index.html` (Lade-Reihenfolge), `test/smoke.test.js` (Drift-Guard).
- **Mein-Mixarium** — Endknoten mit Inhalt: `sbkim/sbkim-init.js` (Z. 15–29 Init-Kette
  + Siegel-Modal-Host-Injektion darunter).
- Konzept-Karten in Sage: `docs/components/17_floating_widget.md` · `16_siegel.md` ·
  `15_membran.md`.

## Kurz-Merksatz

**Erst das Widget (17), dann Membran (15) + Siegel (16).** Sieben Pflicht-Module
da → Bronze automatisch; Handshake „established" → Gold. VERKEHR ist grün, solange
gelauscht wird. Byte-1:1 kopieren, Drift-Guard, ehrliche Lampen.
