# Übergabeprotokoll — 2026-07-30 (späte Nacht): die halbe Kennung heißt jetzt so

**Rolle:** Bau-Sitzung (Fortsetzung der 0b-Kette, selbe Sitzung)
**Branch:** `claude/halbe-kennung-benennen` (überall gleich)
**Gemergt:** Sage #759 · Kimboard #64 · Kimseek #51 · BookLedgerPro #294 ·
Mein-Tresor #86 · Jasons-Tresor #144 · family-project #129 ·
Mein-Rezeptbuch #355 · Muttis-Rezeptbuch #168 · Mein-Mixarium #169 ·
Tomys-Hub #132

---

## 1. Der Auslöser

Klaus' Bilder von 18:54 und 18:55. Drei Stellen der Oberfläche gaben **drei
verschiedene Antworten auf dieselbe Frage** — habe ich hier eine Kennung?

| Stelle | Aussage |
|---|---|
| Statuszeile | `Meine Kennung: noch keine (erst verbinden)` |
| Einspielen | „In diesem Browser liegt schon eine Kennung. Einspielen ERSETZT sie." |
| Sicherung | erst **nach** dem Passwort: „Identität 'main' hat noch keine Spore" |

Das sieht nach drei Fehlern aus. Es ist keiner.

## 2. Was wirklich los war

Es gibt einen **Zwischenzustand**, den bis dahin niemand benannt hatte: der
**Schlüssel** liegt im Browser (Modul 02 hat ein Fach `main` angelegt), aber die
**Visitenkarte** — die signierte Spore — fehlt noch. Sie entsteht erst beim
ersten Verbinden bzw. über Schritt 2 des Andock-Wizards.

Jede der drei Stellen fragte etwas anderes ab:

- die Statuszeile fragte nach der **nodeId aus der Spore** → keine Spore, also
  „noch keine";
- das Einspielen fragte nach dem **belegten Fach** → belegt, also „liegt schon
  eine";
- die Sicherung fragte nach **beidem** → und meldete den Mangel erst, als sie
  ihn tatsächlich brauchte: **nach** der doppelten Passwort-Eingabe.

Der Nutzer erlebt das als Widerspruch. Zu Recht.

## 3. Was gebaut wurde

Alles in `src/modules/23_rendezvous_ui.js` (Kanon), byte-1:1 kopiert nach
`sbkim-bundle/modules/` und in die zehn Apps. Neuer Kanon-sha:
`f2cf79c9defb7120270af8ade992cc6748e00ce8f9f2e97f490d1a62de4b24f1`.

1. **`readIdentityState()`** liest zusätzlich `getOwnSpore()` → neues Feld
   `hasSpore`. Fail-soft: fehlt die Funktion oder wirft sie, gilt `false`.
2. **Die Statuszeile nennt den Zustand:** „⚠ Angefangene Kennung: der Schlüssel
   liegt hier, die Visitenkarte (Spore) fehlt noch." — **mit dem Ausweg**
   (einmal „🌐 Mit dem Knotennetz verbinden", oder im Siegel Schritt 2
   „Spore erzeugen").
3. **`openBackupForm()` prüft VOR der Passwort-Eingabe.** Der Rumpf wanderte in
   `buildBackupForm(s)`; davor steht jetzt eine Zustandsprüfung. Im halben
   Zustand erscheint **gar kein Passwort-Feld**, sondern der Hinweis.

### Abgrenzung

REINE UI-Schicht über die **öffentlichen** Flächen von Modul 02. Kern-Module
01/02/05/05b/23 **unangetastet**, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump,
0.80-Andock-Riegel unberührt, fail-soft ohne Modul 02.

## 4. Beweis

| Lauf | Ergebnis |
|---|---|
| `tests/smoke_bau23_0b_identitaet.mjs` | **49/49 grün** (vier neue Proben `0b/8`) |
| **GEGENPROBE (neu)** `SBKIM_0B_SABOTAGE_HALF=1` | **45/49 — genau die vier neuen fallen** |
| GEGENPROBE `SBKIM_0B_SABOTAGE=1` | 45/49 (unverändert) |
| GEGENPROBE `SBKIM_0B_SABOTAGE_WATCH=1` | 47/49 (unverändert) |
| `smoke_bau23_rendezvous_ui.mjs` | 87/87 |
| `smoke_bau23_rendezvous.mjs` | 59/59 |
| `smoke_bau23c_ki_richter.mjs` | 28/28 |
| `smoke_bundle_connect.mjs` | 21/21 (Drift-Guard) |
| Kimboard · Kimseek | 6/6 · 11/11 (sha-Pins nachgezogen) |
| **GEGENPROBE Drift-Guard** — eine Zeile an die Kimboard-Kopie angehängt | **5/6 — er beißt** |
| BookLedgerPro | 2153/0 |
| Mein-Tresor · Jasons-Tresor · Mein-Rezeptbuch | 53/0 · 59/0 · 7/0 |
| Mein-Mixarium (4 Suiten einzeln) | 8 · 11 · 14 · 7 |
| Tomys-Hub (8 Suiten einzeln) | 35 · 38 · 19 · 15 · 9 · 16 · 31 · 11 |

Die dritte Gegenprobe bog `hasSpore: !!(r[1] && r[1].id)` auf `hasSpore: true`
zurück — also genau die Erkennung, die diese Runde eingeführt hat. Fällt sie,
fallen die vier neuen Proben und **nur** sie.

### Netzweite Nachprüfung auf `main`

Die Lehre aus dem Nachzug-Fehler vom Abend (ein Auftrag, der eine App-Liste
nennt, ist keine Erlaubnis, den Rest stehen zu lassen) wurde angewandt: **alle
Träger** wurden gegen den Kanon geprüft, nicht nur die im Kopf.

- **12 Träger** der UI-Datei stehen auf `f2cf79c9defb` — Sage `src/modules/` +
  `sbkim-bundle/modules/` und die zehn Apps.
- **Company-Brain, Privat-Brain, SB-KIMTool-Point, Mein-WorkFloh** wurden
  ausdrücklich mitgeprüft und tragen die UI-Datei **nicht** (0 Kopien). Das ist
  ein geprüftes Ergebnis, keine Auslassung.

**Zusätzliche Gegenprobe gegen Überschreiben:** parallel zu dieser Runde lief
der Stufe-2b-Rollout (Sage PR #760). Geprüft, dass er unversehrt blieb —
`23_rendezvous.js` = `3caa0bb1fbe7` und `16_siegel.js` = `4e11ef0d0390` stehen
in allen Apps unverändert auf `main`.

### Nicht geprüft — ehrliche Grenzen

- **Muttis-Rezeptbuch** hat keine Test-Suite.
- **family-project** `tests/smoke_all.mjs` braucht `playwright-core`; ohne
  `package.json` in dieser Umgebung nicht installierbar.
  Beide tragen eine per sha256 gegen den Kanon geprüfte byte-identische Kopie.
- **Tomys-Hub `smoke-spore-download.cjs`** fällt (Playwright-Timeout).
  **Vorbestehend** — in der vorigen Runde gegengeprüft, indem die Änderung
  weggestasht und der Test auf blankem `origin/main` gelaufen ist.
- **Der echte Browser-Pfad** — wartet auf Klaus. Headless ersetzt ihn nicht.

## 5. Klaus' 0b-Sichttest ist grün

Sein Bild von 18:57 schließt den offenen Sichttest aus dem Nachmittag positiv ab:

- `Meine Kennung: zmNI_S_bB7BimoGBTmd8l_FCOAqdNRDxiKnaEt3o2B0`
- `Letzte Sicherung: 2026-07-30`
- `✓ Sicherung erzeugt: sbkim-sicherung-kimboard-2026-07-30.json`
- Chrome: „Datei heruntergeladen (25,42 KB)"
- **kein Aufräum-Knopf** — bei einem Fach bleibt er weg, genau wie gebaut

Der Dateiname trägt den Repo-Namen, wie Klaus es sich gewünscht hatte („damit
ich sie nicht jedes Mal neu benennen muss"). Offen bleibt nur noch der zweite
Halbschritt: **📥 Sicherung einspielen** mit genau dieser Datei.

## 6. Nächster sinnvoller Schritt

1. **Klaus: 📥 Sicherung einspielen** mit `sbkim-sicherung-kimboard-2026-07-30.json`.
   Das ist die eine Hälfte von 0b, die noch keinen Live-Beleg hat — und die
   entscheidende (ohne sie ist die Sicherung eine unbewiesene Zusage).
2. **Stufe 3 — Bekannte bevorzugen.** 2b liegt netzweit; der Plan sieht als
   nächstes vor, schon einmal erfolgreich angedockte Knoten im Raum
   vorzuziehen. Eigener Brief nötig.
3. Sage fehlt `sicherheit.html`; Sages `assets/siegel-inhalt.js` ist hinter
   Mein-Tresor (Wizard-Init-Heilung vom 2026-07-19, 13 Zeilen).
4. **PULS-Archivierung** — die Datei wächst weiter gegen die 3000er-Klausel.
   Auslagern statt kürzen, eigene Sitzung.
