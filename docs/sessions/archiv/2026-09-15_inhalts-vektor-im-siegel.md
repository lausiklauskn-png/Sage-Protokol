# Übergabeprotokoll · 2026-09-15 — Der Inhalt gewinnt im Siegel

**Rolle:** Haupt-Sitzung, vierter Teil. **Zweig:** `claude/andock-wizard-merge-gokcps`.
**Umfang:** 21 Depots, alle gemergt.

---

## Die Frage, die dazu geführt hat

Klaus, 2026-09-15: *„es geht nur um andere Nutzer, die Mein Rezeptbuch benutzen,
um andere Inhalte zu erzeugen — damit würde eine Vektorsuche, die auf Inhalte
ausgerichtet ist, wichtiger als eine reine Funktionsbeschreibung der App."*

Geltungsbereich, wörtlich: **Mein Rezeptbuch · Muttis Rezeptbuch · Mein
Mixarium.** Ausgeschlossen **BookLedgerPro** (Buchhaltung) und **vorerst
Mein-WorkFloh** — *„es sei denn, dieser würde firmenintern genutzt."*

---

## Der Befund

**Zwei Wege zur Spore, zwei verschiedene Einbettungen:**

| Weg | bettet ein | `embeddingSource` |
|---|---|---|
| stille Erst-Anmeldung (`sbkim-connect.js:88-103`) | `embedContentVector(sampleContent())` | `"content"` |
| Siegel, „neu signieren" (`16b_andock_wizard.js:353`) | `embedPassage(beschreibung)` | *(nicht gesetzt)* |

Ein fremder Nutzer wurde also zuerst richtig eingebettet und **verlor seinen
Inhalts-Vektor in dem Moment, in dem er im Siegel neu signierte.**

**Der Bestand passte schon zu Klaus' Liste** (gemessen):

| App | `sampleContent()` liefert |
|---|---|
| Rezeptbuch · Muttis · Mixarium | bis 32 × „Kategorie Name" der **echten** Einträge aus `window.R` |
| BookLedgerPro | `STANDARD_KONTO_LABELS` — **feste** Etiketten, bei jedem Nutzer gleich |
| Mein-WorkFloh | **gar keine** |

**Es brauchte deshalb keine Sperre.** Eine Sperre, die nichts sperrt, sieht aus
wie Schutz.

---

## Was gebaut wurde

| | Was | Wo |
|---|---|---|
| **1** | Schritt 1 des Wizards fasste hart `"main"` an, Schritt 2 das **aktive** Fach — nach einem Wechsel zwei Identitäten in einem Fenster. Dasselbe im Neu-Signier-Weg. Und der Semantik-Block zog nicht nach | `16b_andock_wizard.js` |
| **2** | Der Dateiname nennt **Kennung** und sortierbares Datum, ebenso die zwei Sicherungs-Namen | `16b`, `23_rendezvous_ui.js` |
| **3** | Der Siegel-Weg rechnet aus dem **Inhalt**, wenn `cfg.sampleContent` welchen liefert, und setzt `embeddingSource` | `16b` |
| **4** | Wer zuletzt **selbst** geschrieben hat, behält sein Wort im Textfeld | `16b` |
| **5** | `sampleContent()` auf Datei-Ebene gehoben, `siegel-inhalt.js` verweist **spät aufgelöst** darauf | die drei Inhalts-Apps |

**Tafel:** `docs/INTERFACES.md` §2 trägt jetzt `embeddingSource` und
`embeddingVersion` — beide standen nicht dort, obwohl Modul 02 sie seit v0.2 in
die **signierte** Spore schreibt.

---

## Was dabei schiefging

**Ein blinder Wächter von mir**, von der Gegenprobe entlarvt: „wirft
`sampleContent`, bleibt es still (fail-soft)" fragte nur, ob die Vektor-Zeile
fehlt. Nimmt man das `try/catch` heraus, entsteht der **ganze Semantik-Block**
nicht mehr — **genau das hätte der Wächter „fail-soft" genannt.** Gefunden beim
Nachstellen von Hand.

**Eine Zusicherung musste an drei Stellen geschärft werden** (Sage,
PWA-Toolpoint zweimal, kim-hub-company): „genau **eine** Zuweisung an `ta.value`
im Lade-Pfad" — das Zählen ist seit Punkt 4 das falsche Maß. Gemessen wird die
**Bedingung** und die **Gegenrichtung**. Tafel-Evolutions-Klausel, benannt.

**Zwei Proben waren nicht rot, sondern nicht lauffähig.** Kimboard meldete „21
von 31 ROT", Privat-Brain brach ab — beide Male fehlte `playwright-core`.
Nachinstalliert: Kimboard **31/31 grün**.

**Zwei Zweige ließen sich nicht pushen** („stale info"). Ursache war nicht die
Fernseite, sondern ein **veralteter lokaler Verweis**: die Zweige existierten
dort gar nicht mehr. `--prune`, dann normal gepusht. Vorher belegt, dass der
alte BookLedgerPro-Zweig **null** Commits trug, die `main` nicht hat.

---

## Gemessen

| | |
|---|---|
| `node tests/run_alle.mjs` | **107 grün · 0 rot · 0 nicht lauffähig**, Rückgabewert **0** (ohne Pipe) |
| `node tools/wizard-laedt-pruefen.mjs` | alle **21** Seiten liefern Konfiguration **und** Kanon aus, 2 benannte Ausnahmen |
| `node tests/smoke_service_worker_parst.mjs` | 3 grün · 0 rot |
| Gegenproben | **sieben von Hand nachgestellt**, alle gefangen, jede mit dem Namen ihrer Zusicherung in der roten Zeile |
| Die Kette in den echten App-Dateien | im Browser gemessen: `sampleContent` kommt im Wizard an, die Zeile nennt die richtige Anzahl, Marke `data-vektor="content"` |
| PWA-Toolpoint | **871/871** (erster Lauf 867/869) |
| kim-hub-company | **69 grün · 0 ROT** |
| family-project | **110/110** |
| BookLedgerPro | **2182 bestanden** — Generationen-Sprung von 1.179 Zeilen |
| Kimboard | **31/31** nach dem Nachinstallieren |
| Alis-Moderaum · Perfect-Skin-Beauty · Kim-Bell · Kimseek · Jasons-Tresor · Mein-Tresor · Mein-Workfloh-Page · Perfect-Skin-Fashion | grün |
| Privat-Brain | **12 bestanden, 4 fehlgeschlagen** — ⚠ **vorbestehend**, `origin/main` ergibt dieselben vier Zeilen Wort für Wort |

---

## Was NICHT gebaut wurde, und warum

**Der Drift-Hinweis** („dein Inhalt hat sich von deiner Spore entfernt"). Seine
Schwelle wäre zu **raten** gewesen: das Einbettungs-Modell ist in dieser
Umgebung ein **16K-Platzhalter**, huggingface antwortet mit **HTTP 000**. Eine
geratene Schwelle erzeugt entweder eine Warnung, die man nicht mehr los wird,
oder eine, die nie kommt.

**`contentDigest`**, ein Hash über den Bestand in der Spore — jede Änderung am
Inhalt machte die Signatur ungültig.

**Ein Freigabe-Verfahren für fremde Sporen.** Der Raum braucht keins und hatte
nie eins: `announce()` schickt die aktuelle Spore aufs Relais, und Klaus' Register
ist die Liste **seiner eigenen** Apps, kein Verzeichnis aller Nutzer.

**Die Module einfrieren** (Klaus' Vorschlag). Sein eigenes Beispiel widerlegt es:
kämen Schutz-Module dazu, bliebe jede ausgelieferte App für immer ungeschützt.
Modul 16 ist ausdrücklich **nicht protokoll-aktiv** und fasst die Spore nie an —
ein Schutz-Modul kostet kein Neu-Signieren.

---

## Offen

- **Der Drift-Hinweis** — braucht Klaus' Browser, um die Schwelle zu messen
- **Die Übersetzung** (`TEXTE.en`, 76 Einträge) — der eigentliche Auftrag des Briefes
- **`sbkim/15_membran.js` in family-project** hängt eine Generation zurück (188 Zeilen)
- **Privat-Brains vier vorbestehende rote Zeilen** — das Siegel injiziert dort nichts
- **Der Rezept-Export trägt die Spore nicht mit** — zwei getrennte Sicherungen,
  und wer nur die Rezepte sichert, verliert beim Gerätewechsel die Identität
- **`docs/VORSCHLAG_IDENTITAETS-KETTE.md`** — sechs Punkte, Klaus' Entscheidung
