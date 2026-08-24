# PULS-Auslagerung August 2026 (5): der Wizard-Umbau vom 17.08.

Ausgelagert am **2026-08-24** aus `docs/PULS.md` (Schutz-Klausel: 3000 Zeilen,
auslagern statt kürzen; die Datei stand bei 3.011). Wortwörtlich übernommen,
nichts gekürzt.

---

## Stand 2026-08-17 (Pflege/Bau) — 🧭 Ein Wizard, der sich selbst widersprach · 18 Repos · Karte auf 19 Knoten

**Rolle:** Hauptsitzung, Fortsetzung des Gerätenamen-Tages. Zwanzig PRs, alle
gemergt.

### Der Auslöser: ein Bildschirmfoto mit zwei Wahrheiten

Klaus' Andock-Fenster in Perfect Skin Beauty zeigte **gleichzeitig**: oben
„nodeId: jtpnxZSxv1c…" (Schritt 1), in der Mitte „Fehler: Keine Identitäten in
sbkim_keys" (Schritt 3), unten „Noch keine Identität — oben zuerst eine
anlegen" (Schritt 5). Wer das liest, glaubt eher der Fehlermeldung.

**Die Modul-Logik war die ganze Zeit im Recht.** Headless nachgestellt mit den
App-eigenen Kopien und `fake-indexeddb`: `getOrCreateIdentity` → `listIdentities`
liefert `["main"]`, `exportBackup` scheitert nur mit `SporeMissingError`. Der
Fehler saß in der **Anzeige**: `refreshWizardIdentities()` lief nur beim Öffnen
des Fensters und nach einem Identitäts-Wechsel — nie nach Schritt 1 oder 2. Die
Liste stand also auf dem Stand von **vor** dem Klick, und die rote Zeile war die
Quittung eines Klicks, der gemacht wurde, **bevor** es eine Identität gab.
Beide Meldungen waren echt, nur veraltet.

### Netzweiter Nachzug — 18 Repos, nicht von Hand

Ein Patcher mit harten Ankern (schreibt gar nichts, wenn ein Anker nicht genau
einmal passt) hat es gesetzt. **Die Gegenprobe ist der eigentliche Beweis:** aus
dem Vorher-Stand von Perfect Skin Beauty erzeugt er **byte-exakt** dessen
gemergte Fassung — also genau das, was Klaus im Browser bestätigt hat.

Der erste Wächter im Patcher war **blind**: er sah direkt hinter dem Anker nach
`refreshWizardIdentities`, wo nach dem Patch sechs Kommentarzeilen stehen, und
hätte doppelt eingefügt. Aufgefallen beim Idempotenz-Test, nicht beim Lesen.

| Gruppe | Repos | was fehlte |
|---|---|---|
| alte Fassung | PSB · PS-Fashion · Alis · Kimboard · WorkFloh-Page | Auffrischung nach Schritt **1 und 2** |
| neuere Fassung | 11 Repos + Sage-Kanon | Auffrischung nach Schritt **2** |
| ohne Wechsler | Kimseek · Privat-Brain | nur die alte Fehlerzeile geheilt |

**Sage hat ZWEI Dateien:** `assets/siegel-inhalt.js` ist Kanon,
`sbkim-bundle-voll/modules/siegel-inhalt.js` muss byte-gleich sein — der
Drift-Guard zeigt auf `ASSETS`, nicht auf `CANON`. Wer nur den Kanon anfasst,
lässt die Geschenkbox mit dem Fehler zurück. Beide auf `c0a275d75071`.

**Acht Cache-Bumps**, jeder nachgemessen. Tomys-Hub aus einem anderen Grund als
die übrigen: die Datei steht dort **nicht** im Vorrat, aber der Service-Worker
bedient statische Dateien **cache-first** — einmal geholt, bliebe sie ohne Bump
dauerhaft alt.

⚠ **Zwei Fallen, in die diese Sitzung fast gelaufen wäre:** (1) eine
Parallel-Sitzung mergte PSB #50 mitten hinein; mein erster Zweig saß auf dem
Stand davor und hätte sie zurückgedreht — aufgefallen beim Vergleich
`origin/main` gegen den Zweig, nicht beim Committen. (2) Ein Vorrats-Check lief
im falschen Verzeichnis und meldete „kein Service-Worker" für vier Repos, die
alle einen haben.

### Perfect Skin Beauty ist der 19. Knoten

Spore von Klaus geschickt, reziprok geprüft (`✔ VALID`, 9/9 Pflichtfelder,
384 Floats). `matchScore` **0.7824 gegen Sage — unter dem Riegel**, und das ist
richtig: Kosmetikstudio und Protokoll-Bibliothek haben fachlich nichts
miteinander. Partner ist **Perfect Skin Fashion mit 0.8612**. Darum
`verified-spore`, nicht `verified-match`.

Zwei Besonderheiten: `sporeUrl` zeigt auf die **eigene** Adresse
(perfectskinbeauty.de) — das Repo ist als einziges der jungen fünf mit `CNAME`.
Und `previousNodeIds` hält `jtpnxZSxv1c…` fest.

**Klaus' Frage dazu, hier festgehalten:** eine neue Spore ändert die Kennung
**nicht** — sie wird mit dem vorhandenen Schlüssel signiert, die `nodeId` kommt
aus dem öffentlichen Schlüssel. „Identität erzeugen" legt nur an, **wenn das
Fach leer ist**. Die Kennung wechselte, weil PR #45 der App ihre **eigene
Schublade** gab; die alte lag im geteilten Topf.

### Mycel-Karte: 13 → 19 Knoten

In der Aufzeichnung erschien PSB als **loser** Knoten `live_q-sW…` neben den
Pillen — die Karte hatte keinen Samen für ihn. Folge: sechs Knoten waren nur
sichtbar, **solange ihre App lief**.

Nachgezogen mit Alias und Adresse (Muster Werbetechnik hatte gar keine).
**Muttis Rezeptbuch bekam eine eigene Pille** — es lag als Alias auf „Mein
Rezeptbuch", und zwei Betreiber sahen wie einer aus.

**Die Fäden hängen nicht alle an Sage.** Nur Muttis (0.8766) und WorkFloh
(0.9063) liegen darüber; die vier anderen (0.78–0.79) bekommen den Faden zu dem
Knoten, mit dem sie **wirklich** über dem Riegel liegen. Vier ehrliche statt
sechs bequeme. Zwei neue Wächter auf die **Kopplung** (jeder Samen braucht Alias
+ Adresse; kein Faden unter dem Riegel), vier neue Gegenproben — **8 von 8
bemerkt**.

**Nebenbefund aus der Aufzeichnung:** der Gerätename läuft live — „Kimboard ·
Klaus Tablet" und „Sage-Protokoll · Klaus Tablet" standen im Raum, Kimboard mit
zwei Kennungen unter einer Pille, einzeln aufgeschlüsselt.

### Einladung: die Rolle statt des Klarnamens

Klaus' Entscheidung. Statt „… ist Klaus Nitzsche allein" jetzt „… liegen allein
beim Betreiber (siehe Impressum)" — in allen vier Sprachen, HTML + Markdown +
PDF. **Rechtlich ändert sich nichts:** Urhebervermutung und CC-BY-Nennung
hängen an `impressum.html` (ohnehin Pflicht), `RECHTE.md`, `LICENSE` und der
Git-Historie.

### ⚠ Befund: der PDF-Leser hat eine Blindstelle — und sie ist begrenzt

Beim Belegen meldete `sbkim-demo/papiere/_pdf_text.mjs` **0 Treffer** für den
Namen. Die Null war wertlos: er holt aus 34 Seiten **1819 Zeichen** (nur die
Kopfzeile) und meldet einen ungeöffneten Strom. Aufgefallen an der Gegenfrage —
**er fand auch den neuen Satz nicht**, den ich gerade hineingeschrieben hatte.

Beweis kam von einem zweiten, unabhängigen Leser (pdf.js): 26.456 Zeichen,
Kontrollwörter alle gefunden, „Nitzsche" 0 in beiden Lesarten, Stelle im
Klartext nachgelesen.

**Nachgemessen (2026-08-17), und das ist die Entwarnung:**

| PDF | Haus-Leser | pdf.js | verschlossene Ströme |
|---|---|---|---|
| Konzept PWA Marktplatz | 9.036 | 9.036 | 0 |
| Marktanalyse PWA Plattform | 17.525 | 17.525 | 0 |
| USP Bidirektionales Matching | 6.759 | 6.759 | 0 |
| **Einladung** | **1.819** | **20.314** | **1** |

`tests/smoke_papiere_bereinigt.mjs` bewacht also **zuverlässig**, was es
bewachen soll — die Blindstelle betrifft nur die Einladungs-PDF (eigene
mitgelieferte Schriften). **Klaus-Entscheid: kein Wächter dafür.** Begründung:
die PDF wird erzeugt, nicht bearbeitet; der eigene Name auf der eigenen Seite
wäre kein Vorfall, sondern eine Geschmacksfrage; und ein Wächter über etwas, das
nicht wehtut, ist nur ein weiterer grüner Haken.

### Offen / als Nächstes

- **Klaus' Browser-Sichttest** — Wizard (18 Repos), Karte mit 19 Pillen
  (v17, Hard-Reload), Einladung. Nichts davon ist headless prüfbar.
- **Company Brain** fehlt noch in `status.json` (keine Spore geschickt).
- **Preis-Frage, Klaus' Auftrag für die nächste Sitzung:** wie kommen die
  Unkosten wieder herein — 1–2 € je App, Spenden-Link, Auswahl bei Google Play?
  Vorarbeit steht in [`PLAN_PILZ_WIRTSCHAFT.md`](PLAN_PILZ_WIRTSCHAFT.md)
  (① Auftragsarbeit ② Fach-App mit Wartung ③ Provision zuletzt). **Zu
  bedenken:** bei 1–2 € frisst die feste Gebühr je Buchung den Ertrag, und
  „Spende" heißt nur dann Spende, wenn es **keine Gegenleistung** gibt.
