# Abschluss · Prüf-Reihe Sitzung 6 (2026-10-14 bis 2026-10-15)

**Rolle:** Hauptsitzung. **Ausgangsbrief:** `docs/sessions/BRIEF_2026-10-14_plan_angriffsflaeche_mycel.md`.
**Frage:** Ist das Mycel selbst ein Angriffspunkt für Texte, die eine KI irreführen?
**Befund:** `docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md` (samt Proben N1–N3).

> **Kimhub:** Klaus hat am 2026-10-15 gemeldet, dass die Gegenprobe auf dem Server durch ist,
> und die fehlenden Forschungseinträge freigegeben. Diese Sitzung konnte Kimhub **nicht**
> einbinden (der Zugriff wurde abgelehnt) und hat dort nichts geändert. Die Einträge stehen
> unten als Material für die Kimhub-Sitzung.

---

## 1. Was gemessen wurde (Befund vom 2026-10-14)

| # | Befund | Beleg |
|---|---|---|
| 1 | Die Echtheitsprüfung im Raum (Modul 23) war wirkungslos: `!== false` gegen `{valid:false}` — gefälschte und veränderte Sporen galten als echt. Dieselbe Zeile in mindestens sieben Apps. | N2, N2b |
| 2 | Ein Namensvetter verdrängte den echten Knoten (`collapseByName` vor der Prüfung), mit kaputter und mit gültiger Spore. | N2 a/b |
| 3 | Antworten waren nicht an den Gefragten gebunden: eine gefälschte Antwort ging an den KI-Richter und stand als „✓ Antwort von …" da. | N1 |
| 4 | Der Bedeutungs-Vektor ist nicht an den Text gebunden: kopiert ergab er dieselbe Verwandtschaft (0.504 = 0.504) und am Andock-Riegel 1.000. | N2 b/c |
| 5 | Die Prüfliste vor dem Richter fängt klassische Wendungen DE/EN; umformuliert, Französisch, kyrillisches „і" gehen durch. | N1 |
| 6 | `javascript:` aus einer eingefügten KI-Antwort lief über die Modul-Wege nicht — weil Chromium es so tut, nicht weil das Modul prüft. | N3 (headless) |
| 7 | Mycel-Karte und Kimboard setzten fremden Text als HTML ein; ein Skript lief. | Probe alt 3 ROT |
| 8 | Die Signatur prüft Herkunft, keinen Inhalt (4360 Zeichen, HTML, `javascript:`-Endpoint: gültig). | N2 |
| 9 | Browser mit eingebauter KI: von der App aus nicht schützbar. | **vermutet** |

## 2. Was gebaut wurde (Klaus: Punkte 1–4 freigegeben)

- **Bau 23.R** (Sage #1087): Echtheit über `.valid`; Prüfung vor dem Zusammenfassen nach Namen,
  „derselbe Name noch N×"; Antworten signiert (Modul 02 `signDetached`/`verifyDetached`), nur
  der Gefragte zählt, unsigniert → „unbestätigt" und kein Richter; `label` gekappt auf 200.
  Probe 18 grün, Gegenprobe 10 gefangen · 0 durchgerutscht.
- **HTML-Stellen** escapt: mycel-karte #32, Kimboard #152.
- **Rollout** in 13 Träger, auf `main` nachgezählt: Auslieferung-Pruefer #53, BookLedgerPro #335,
  Mein-Mixarium #249, Mein-Rezeptbuch #438, Muttis-Rezeptbuch #243, Tomys-Hub #246, Kimboard #152,
  Mein-WorkFloh #267, Privat-Brain #105, Sende-Pruefer #80, Workflow-Calculate #21,
  Workflow-Needs #18, Workflow-PDF #115.
- **Pläne:** `docs/PLAN_MYCEL_SCHICHTEN.md` (S1–S7, Bürgen als S5, #1088) und
  `docs/papers/PLAN_PAPER_KNOTENNETZ.md` (Paper S).

## 3. Was beim Arbeiten schieflief (Belegmaterial)

- **Ein Gegenprobe-Fall war zweimal durchgerutscht** („unbestätigt überschreibt bestätigt"):
  die unsignierte Fälschung wurde schneller geprüft und kam zuerst. Erst eine Fälschung, die
  während des Abholens nachkommt, plus ein Selbst-Riegel, ließ ihn rot werden.
- **Die alte Probe zur Kartenechtheit war grün und maß nichts**: sie stellte einen Prüfer, der
  `true/false` lieferte, der echte liefert ein Objekt.
- **Ein Commit ging durch `checkout -B` verloren** (Kimboard) und wurde per cherry-pick
  zurückgeholt.
- **Der Verteiler erhöht nur `CACHE_VERSION`**: Workflow-Calculate und Workflow-Needs waren
  danach rot, bis `node tools/cache-stand.mjs` lief.
- **Ein Flattern, das schon auf `main` war:** Workflow-PDF `tests/chrome.mjs` (Dialog im Tab
  bleibt aus) — 1 von 5 auf `main`, 2 von 9 auf dem Zweig. Ursache nicht gesucht.

## 4. Klaus' Gedanken aus dem Gespräch (für Paper S)

- Artgrenzen der Natur als mehrstufiges Muster; die Natur als bewährte Gegenprobe „durch
  Erhaltung der Arten".
- Schlüssel: selbst gemacht (Echtheit) gegen vergeben (Firmennetz) — und Bürgen dazwischen.
- Einwand: „Man kann sich auch selber einen Bürgen ausstellen" → Regel: zählt nur über eigenes
  Vertrauen.
- Lesart: Viren, Autoimmunität, Mischlinge, Stürme als Prüfmechanismen, die Instabilität
  anzeigen. Im Plan als seine Lesart gekennzeichnet (Biologie kennt keinen Planer).

## 5. Forschungseinträge für Kimhub (Material, nicht eingetragen)

Für `Kimhub/forschung/sitzungen.json`, in dessen Format zu übertragen. Dauer nicht gemessen.

| Datum | Sitzung | Befunde | Kurz |
|---|---|---|---|
| 2026-10-14 | Prüf-Reihe Sitzung 6, Planmodus: Angriffsfläche Mycel | 9 (8 gemessen, 1 vermutet) | Echtheit wirkungslos, Namensverdrängung, Antwort-Fälschung, Vektor-Kopie, Wortliste durchlässig, Browser-Schutz statt Modul-Prüfung, HTML in zwei Apps, Signatur ohne Inhaltsprüfung, Browser-KI |
| 2026-10-14 | Prüf-Reihe Sitzung 6, Bau 1–4 und Rollout | 5 Prozess-Befunde (Abschnitt 3) | Bau 23.R + Escape, 13 Träger, zwei blinde Prüfungen, ein verlorener Commit, Cache-Stand-Lücke im Verteiler, vorbestehendes Flattern |
| 2026-10-15 | Plan Schutzschichten + Paper S | 0 Messungen | Natur-Muster übertragen, Bürgen mit Sybil-Regel, Paper-Gerüst |

## 6. Offen

- S1–S7 außer dem Planpunkt S5 warten auf Klaus' Freigabe.
- Nicht ausgerollt: PWA-Toolpoint, Kimseek, SB-KIMTool-Point, family-project, Kim-Bell;
  `docs/observatorium/tools/mycelknoten.html` (02/16 eingebettet) nicht nachgezogen.
- Fragen unsigniert; Vektor ungebunden; Wortliste; Browser-KI.
- Nichts am Tablet gemessen.
- `kanon-verteilen` sollte `cache-stand.mjs` mitrufen, wo es eins gibt (PFLEGE-LISTE).
