# Mycel-Geschenkbox — was eine fremde App zum Andocken mitbekommt

**Zweck (Klaus 2026-07-30):** Wenn ein Fremder seine App im
`family-projekt.de`-Marktplatz einreicht und — **nach Klaus' Prüfung** — Teil des
Mycels werden will, soll er **nichts suchen müssen**. Er bekommt eine fertige
Kiste, die er nur **auspackt**: ein Ordner, ein paar `<script>`-Zeilen, ein
`init()`. Diese Datei sagt, **was in die Kiste gehört** und **in welcher
Reihenfolge** es eingebaut wird.

> **Zwei Kisten-Größen.** Nicht jeder braucht alles. Deshalb zwei Stufen:
> **Stufe 1 „Verbinden"** (existiert schon, `sbkim-bundle/`) und **Stufe 2
> „Voll-Knoten"** (Verbinden + Siegel + Schutz + Suche + Andock-Wizard).

---

## Vor dem Auspacken — Klaus' Prüfung (der Andock-Riegel bleibt Klaus)

Die Kiste macht das Andocken **technisch** leicht. Die **Aufnahme ins Netz**
bleibt Klaus' Entscheidung — das ist gewollt (Empfangsmodus, kein offener
Beitritt):

1. **Einreichung** über das Marktplatz-Formular „Zur Prüfung einreichen"
   (`family-project/markt.html`): App-Name, Beschreibung (in eigenen Worten,
   mit Synonymen), Link, Bild.
2. **Klaus prüft** (liegt ein Geheimnis im Repo? passt die Domäne? seriös?) und
   listet die App im Marktplatz — oder nicht.
3. Der **0.80-Andock-Riegel** (Modul 05, `PROVIDER_MIN_MATCH`) bleibt
   **unberührt**: er entscheidet automatisch, welche Knoten sich fachlich
   verbinden. Die Kiste umgeht ihn nicht.

**Wichtig (Marktplatz-Brille):** Der selbst-gewählte App-Name ist ein **Hinweis,
kein Beweis** — jede App zeigt ihren Namen **mit** der kryptografischen Kennung
(nodeId), und die Kartenechtheit (Stufe 2b, Modul 23) prüft jede Karte im Raum
per Ed25519. Niemand kann sich unter fremder Identität ins Brett hängen.

---

## Stufe 1 — die „Verbinden"-Kiste (existiert: `sbkim-bundle/`)

**Das ist die Minimal-Kiste, heute schon fertig und aktuell** (byte-1:1 mit dem
Kanon, inkl. des gehärteten Modul 23 mit Kartenechtheit). Sie bringt: eigene
Ed25519-Identität, Bedeutungs-Match, server-losen Handshake über ein
Nostr-Relais und den gemeinsamen Raum mit dem Knopf **„🌐 Mit dem Netz
verbinden"**.

| Datei | Rolle |
|---|---|
| `modules/01_storage.js` | lokaler Speicher (IndexedDB, app-eigene Schublade) |
| `modules/02_spore.js` | Identität + Spore (Ed25519 signieren/prüfen) |
| `modules/03_embedding.js` | Bedeutungs-Vektor der Beschreibung |
| `modules/04_match.js` | Bedeutungs-Match (Cosinus + Richter-Fläche) |
| `modules/05_anastomose.js` | Handshake (0.80-Riegel) |
| `modules/05b_nostr_relay.js` | server-loser Transport (Relais) |
| `modules/23_rendezvous.js` | gemeinsamer Raum + **Kartenechtheit + Flut-Deckel** |
| `modules/23_rendezvous_ui.js` | „Wer ist im Raum?"-Oberfläche |
| `modules/noble-secp256k1.js` | Krypto-Baustein (lokal, kein CDN) |
| `sbkim-connect.js` | ein `init()` verdrahtet alles |
| `beispiel.html` | Vorlage: so wird's eingebaut |
| `README.md` | 2-Schritt-Anleitung |

**Einbau:** Ordner kopieren → `<script>`-Tags + ein `SbkimConnect.init({…})`.
Fertig. Abhängigkeitsfrei, offline-tauglich.

---

## Stufe 2 — die „Voll-Knoten"-Kiste (Vorschlag, noch zu bauen)

Wer nicht nur verbinden, sondern **das volle Vertrauens-Gesicht** will (Siegel-
Badge, Schutz-Lampen, eigene semantische Suche, Andock-Wizard, Schlüssel-Safe),
bekommt zusätzlich diese Bausteine. **Alle byte-1:1 aus dem Kanon**, mit
Drift-Guard (SHA-256) — reift ein Modul in Sage, wird neu kopiert, nicht
abgewandelt.

| Datei | Rolle | Kanon-sha (12) |
|---|---|---|
| `modules/07_apoptose.js` | **sauberer Rückzug — und Siegel-Pflicht** (siehe Kasten unten) |
| `modules/15_membran.js` | Außenhülle: Fremdzugriff-Detektor | `fbf9f42d8a27` |
| `modules/16_siegel.js` | SBKIM-Siegel (Bronze→Gold), Aspekte-Liste | `4e11ef0d0390` |
| `modules/siegel-inhalt.js` | Inhalt des Siegel-Modals (Andock-Werkzeug) | (Kanon prüfen) |
| `modules/17_floating_widget.js` | Status-Lampen LEBT/VERKEHR/FREMD/SIEGEL | (Kanon prüfen) |
| `modules/19_andock_wizard.js` | Andock-Assistent (Identität/Spore/Backup) | `976c4ba35…` |
| `modules/20_schluessel_safe.js` | verschlüsselter Schlüssel-Safe (BYOK) | `e7e25c907…` |
| `modules/21_spracheingabe.js` | Spracheingabe (Mikro → Text, EU-Politik, 12 Sprachen) | `020ca26ff…` |
| `modules/22_such_widget.js` | frei bewegliches Such-Widget (optional) | `45f42a54e…` |
| `modules/24_ocr_eingabe.js` | Bild/Handschrift → Text (optional) | `c0d616ff7…` |
| `sbkim-sw.js` + `manifest.json` | PWA-Schale (installierbar, offline) | — |
| App-Kleber (frei) | `rendezvous-init.js` + Panel „🌐 Mit dem Netz verbinden" | app-eigen |

> **⚠ Modul 07 stand hier bis zum 2026-08-16 NICHT — und fehlte deshalb auch
> in der Kiste.** Das ist keine Kleinigkeit: Modul 16 prüft für sein Siegel
> **sieben** Module (01 · 02 · 03 · 04 · 05 · **07** · 15). Fehlt eines, stellt
> sich die App **kein Siegel aus — und zwar stumm**: keine Meldung, kein Fehler,
> das Abzeichen bleibt einfach weg. Ein Forker hätte die Stufe-2-Kiste
> ausgepackt, alles richtig gemacht und sich gefragt, warum nichts kommt.
> `tests/smoke_bauvorlagen.mjs` prüft seitdem **Rezept und Kiste gegeneinander**.

**Reihenfolge beim Einbau (wichtig):**
`01 → 02 → 03 → 04 → 05 → 05b → 23/23_ui` (Verbinden), dann
`07 (Apoptose)`, dann `17 (Widget) VOR 15 (Membran) VOR 16 (Siegel)` — das Widget legt die Lampen an,
bevor Membran/Siegel sie bedienen. `19/20/21/22/24` sind additiv, fail-soft
(fehlt eins, läuft die App weiter).

**Fremdnutzer-Regeln, die in jede Kiste gehören:**
- **Fail-soft für Fehlendes** — ohne Schlüssel/Mikro/Modul X bleibt die App voll
  nutzbar; das Feature degradiert still, kein toter Knopf, kein Crash.
- **Klar benennen, was passiert** — Kosten (eigener KI-Schlüssel), Daten-Abfluss
  (an welchen EU-KI-Anbieter), wo der Schlüssel bleibt (nur im Browser).
- **Geteilte-Origin-Falle** — DB-/Storage-Schlüssel app-spezifisch (Suffix),
  damit Geschwister-Apps auf derselben Adresse sich nicht stören.
- **Kein PII, kein privater Schlüssel** im ausgelieferten Repo.

---

## Was heute schon steht / was fehlt

- ✅ **Stufe 1 „Verbinden"** ist fertig und aktuell (`sbkim-bundle/`), inkl.
  Kartenechtheit (Modul 23 sha `3caa0bb1`).
- ✅ **Marktplatz-Einreichung** steht (`family-project/markt.html`, „Zur Prüfung
  einreichen") + die Werkzeug-Seiten `family-project/werkzeuge/andock-werkzeug.html`,
  `knoten-werkzeug.html`, `such-werkzeug.html`.
- ✅ **Siegel-Bau-Rezept** als Skill: `.claude/skills/status-leiste-siegel`.
- ✅ **Stufe 2 „Voll-Knoten"-Kiste** existiert jetzt als EIN Ordner:
  [`sbkim-bundle-voll/`](../sbkim-bundle-voll/) — 18 Module byte-1:1 aus dem
  Kanon (inkl. gehärtetem Modul 23 + Siegel-Aspekt), `sbkim-connect.js`,
  `README.md` (Einbau in 3 Schritten, Ladereihenfolge 17→15→16),
  `beispiel-voll.html` (lauffähiges Vorbild) und ein Drift-Guard
  (`tests/smoke_vollbundle.mjs`, 42/42 grün). Gebaut 2026-07-30.

---

## Fahrplan, wenn Klaus „Voll-Box bauen" sagt

1. Ordner `sbkim-bundle-voll/` (oder Erweiterung des bestehenden) anlegen.
2. Module byte-1:1 aus `src/modules/` kopieren (Liste oben), Drift-Guard-Test
   ergänzen (SHA-256 gegen den Kanon — wie im Skill `netzweiter-modul-rollout`).
3. `README.md` mit der Einbau-Reihenfolge + `beispiel.html` (Voll-Knoten).
4. Als Klick-und-Kopier-Pfad in die **Observatoriums-Vorteilspack-Truhe**
   (Sage-Page) hängen, damit Forker per Knopf statt git-clone nehmen können.
5. Sichttest durch Klaus (Installation als PWA + Andock im Raum).
