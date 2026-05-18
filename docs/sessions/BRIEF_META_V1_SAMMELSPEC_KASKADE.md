# Brief — Meta-Sitzung · V1-Sammelspec als Brief-Kaskade

**Klaus' Disziplin:** keine Marathon-Spec-Sitzung. Statt die V1-
Sammelspec in 10-15 Stunden über mehrere Tage in EINER Sitzung zu
führen, wird sie in eine **Brief-Kaskade** zerlegt — jede Folge-
Sitzung erledigt EINEN Strang und endet mit dem **fertigen Brief für
die nächste Folge-Sitzung**. Bis alle Punkte abgearbeitet sind.

Diese Meta-Sitzung legt die Kaskade fest und schreibt den **ersten**
Strang-Brief. Sie selbst speccet noch nichts.

Dieser Meta-Brief geht in den **ersten Prompt** einer neuen Sitzung
als Codeblock.

---

```
Du bist eine Meta-Sitzung in Sage-Protokol.

Branch: claude/pflege-meta-v1-sammelspec-kaskade   (vom main aus
anlegen)

Sitzungs-Rolle: Mini-Pflege (keine Modul-Spec, kein Code-Eingriff).
Du zerlegst die geplante V1-Sammelspec in eine Brief-Kaskade von
Folge-Sitzungen, dokumentierst die Konvention dieser Kaskade in
PULS, und schreibst den Brief für die ERSTE Folge-Sitzung als
fertige Datei im Repo. Du speccst noch nichts. Du briefst nur.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (Sitzungs-Disziplin, Pflicht am Sitzungs-Ende)
2. docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md (das ist die Quelle —
   vier Stränge: V1 Sage-Hybrid, Anker 9 M04-Erweiterung, Anker 6
   Multi-Identität, Plattform-Matrix; mit Etappierungs-Vorschlag)
3. docs/sessions/BRIEF_SPEC_M04_ERWEITERUNG.md (engerer Bruder-Brief
   für Strang 2 — wird als Vorlage für den Strang-Brief-Stil
   referenziert, NICHT als alleinstehende Sitzung; im Kaskaden-Modell
   ist Strang 2 ein eigener Folge-Brief, der den engeren Brief
   ablöst)
4. docs/PULS.md § Vision-Anker:
   - Anker 1 (Z. 555-598, Sage als Hybrid-Knoten)
   - Anker 9 (Z. 1229-1357, M04-Erweiterung)
   - Anker 6 (Z. 898-977, Multi-Identität)
   plus den Sitzungs-Eintrag der M04-Erweiterungs-Pflege
   (2026-05-18) als Brainstorming-Kontext
5. docs/sessions/BRIEFING_TEMPLATE.md (Format für Übergabeprotokolle)
6. docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md (als Stil-Referenz —
   wie ein Brief im Repo aussieht: Pflichtleseliste, heilige Tafeln,
   Aufgaben-Schnitt, "Was du NICHT tust", "Pflicht am Ende",
   Hinweise-außerhalb-des-Briefes-Block)

Was du NICHT liest: INTERFACES.md, Modul-Karten, Modul-Code, Sage-
Page. Du briefst, du speccst nicht. Diese Quellen kommen in die
Folge-Sitzungen.

Heilige Tafeln (Konvention der Kaskade):

1. **Eine Folge-Sitzung = ein Strang = ein PR.** Keine Sammelfahrten.
   Wenn ein Strang zu groß wird, teilt er sich in zwei Folge-Sitzungen
   (z.B. „Strang 2a Spore-Schema + Schichten" und „Strang 2b
   Brücken-Feld + Stufe B"). Der Brief der vorausgehenden Sitzung
   entscheidet, ob geteilt wird.

2. **Jede Folge-Sitzung endet mit dem fertigen Brief für die nächste
   Sitzung — als Datei im Repo unter `docs/sessions/BRIEF_<NN>_
   <NAME>.md`.** Nicht im Chat-Tab. Briefe im Chat-Tab gehen verloren,
   wie es Klaus bei der M04-Brainstorming-Pflege passiert ist (siehe
   PR #91 Rekonstruktion).

3. **Brief-Datei-Schema:**
   - `BRIEF_<NN>_<NAME>.md` mit `<NN>` als zweistellige laufende
     Nummer in der Kaskade (`01`, `02`, …) und `<NAME>` als kurzer
     Strang-Name (z.B. `01_v1_sage_hybrid`).
   - Jeder Brief enthält denselben Bauplan wie BRIEF_BAU_SONNEN_GALAXIE
     und BRIEF_SPEC_V1_SAMMELSPEC: Pflichtleseliste, heilige Tafeln
     (PROTOCOL_VERSION-Disziplin, Anti-Missbrauch, Plattform-Ehrlichkeit
     je nach Strang), Aufgaben-Schnitt mit konkreten Editier-Punkten,
     „Was du NICHT tust", „Pflicht am Ende", Blockier-Klausel, Hinweise
     außerhalb des Briefes.

4. **Letzte Sitzung schließt die Kaskade.** Die finale Folge-Sitzung
   (die den letzten Strang erledigt) schreibt KEINEN neuen Brief,
   sondern einen `BRIEF_99_SAMMELSPEC_ABSCHLUSS.md` oder einen PULS-
   Eintrag „Sammelspec abgeschlossen, bereit für Bau-Sitzungen" mit
   Auflistung der dann anstehenden Bau-Briefe als nächste Kaskade.

5. **Konsistenz-Prüfung verteilt, nicht zentral.** Jede Folge-Sitzung
   liest VOR ihrem Eingriff den Stand von INTERFACES.md und der
   relevanten Modul-Karten und prüft, ob die vorausgegangenen Stränge
   widerspruchsfrei stehen. Wenn ein Vorgänger-Strang in der eigenen
   Arbeit angepasst werden muss, dann ZUERST den Vorgänger nachziehen,
   DANN den neuen Strang einbauen. Der Brief der eigenen Sitzung nennt
   das explizit, wenn Vorgänger-Korrekturen wahrscheinlich werden.

6. **PROTOCOL_VERSION-Disziplin:** Bleibt 0.1, solange alle Strang-
   Erweiterungen ADDITIV sind und alte Sporen weiterhin gültig bleiben.
   Erst der Strang, der ein altes Feld zur Pflicht erhebt, bumpt auf
   0.2. Jeder Brief nennt seine PROTOCOL_VERSION-Erwartung explizit.

Deine Aufgabe heute (Meta-Sitzung):

Phase 1 — Lesen (siehe Pflichtleseliste).

Phase 2 — Kurz erklären, was die Kaskade macht.

Nach dem Lesen schreibst du IN DEN CHAT (nicht in eine Datei) einen
knappen Absatz von 5-8 Sätzen, der erklärt:
- was die V1-Sammelspec inhaltlich tut (vier Stränge in einem Satz
  jeder)
- warum Kaskade statt Marathon
- welche Reihenfolge der Stränge du wählst, mit Begründung
- wo die Briefe abgelegt werden (Schema BRIEF_<NN>_<NAME>.md)
- wann die Kaskade endet (letzter Strang schließt mit Abschluss-Brief
  oder PULS-Eintrag)

Phase 3 — Konvention in PULS dokumentieren.

In `docs/PULS.md` § Sitzungs-Einträge einen neuen Top-Eintrag anlegen:
„2026-05-XX · Meta-Pflege — V1-Sammelspec als Brief-Kaskade
sequenziert". Der Eintrag enthält:
- die fünf heiligen Tafeln aus diesem Brief (oben), wortgleich oder
  sinngemäß
- die gewählte Strang-Reihenfolge mit Begründung
- die Brief-Datei-Liste (geplante Namen, z.B. `BRIEF_01_…`,
  `BRIEF_02_…`, …) — als Auftragsliste für die folgenden Sitzungen
- Verweis auf BRIEF_SPEC_V1_SAMMELSPEC als Quell-Spec

Beachte CLAUDE.md-Konvention zur PULS-Pflege (3000-Zeilen-Schutz-
Klausel, Pie-Block nicht von Hand bearbeiten, ggf. älteren Sitzungs-
Eintrag ins Archiv-Index auslagern wenn nötig).

Phase 4 — Brief für die erste Folge-Sitzung schreiben.

Lege `docs/sessions/BRIEF_01_<NAME>.md` an. `<NAME>` richtet sich nach
deiner gewählten Strang-Reihenfolge. Vorschlag (du darfst abweichen
mit Begründung):

- **Wenn du V1 zuerst nimmst:** `BRIEF_01_v1_sage_hybrid.md`
- **Wenn du Anker 9 Stufe A zuerst nimmst** (weil sie ohne V1 ziehbar
  ist und schnellster Mycel-Wert): `BRIEF_01_m04_stufe_a.md`

Inhaltlich übernimmt der Brief den Strang aus BRIEF_SPEC_V1_SAMMELSPEC
und konzentriert sich auf NUR diesen einen Strang — mit denselben
Editier-Punkten, aber ohne die anderen Stränge zu spezifizieren.

WICHTIG: Der Brief MUSS am Ende eine Sektion „Pflicht am Ende deiner
Sitzung" enthalten, die der nächsten Sitzung sagt:
1. Übliche PULS-Pflege + Übergabeprotokoll + Commit + Push + Draft-PR.
2. **Schreibe als letzte Datei-Aktion** `docs/sessions/BRIEF_02_
   <NAME>.md` für die nächste Folge-Sitzung. Pflichtleseliste aktuali-
   sieren (eigener PR + INTERFACES-Stand). Konvention gleich.
3. Die übliche „Vorgeschlagene nächste Schritte"-Liste verweist auf
   diesen Brief 02 als ersten Schritt.

Phase 5 — Übergabe + PR.

- Übergabeprotokoll in
  `docs/sessions/archiv/2026-05-XX_meta-pflege-v1-sammelspec-kaskade.md`
  (Vorlage: BRIEFING_TEMPLATE.md).
- Commit + Push auf claude/pflege-meta-v1-sammelspec-kaskade.
- Draft-PR mit Titel „Mini-Pflege: V1-Sammelspec als Brief-Kaskade
  sequenziert (Meta)" und Body, der die Kaskade, die heiligen Tafeln
  und die Brief-Datei-Liste auflistet.
- „Vorgeschlagene nächste Schritte"-Block am Sitzungs-Ende:
  1. PR mergen (damit Brief 01 auf main liegt).
  2. Neue Sitzung mit BRIEF_01_<NAME>.md im ersten Prompt auslösen.
  3. (Optional) Anker-Status in PULS nachziehen, falls Folge-Sitzungen
     verzögert werden.

Was du NICHT tust:

- Keine Modul-Code-Änderung in `src/`.
- Keine INTERFACES.md-Änderung. Du briefst, du speccst nicht.
- Keine Modul-Karten-Änderung. Folge-Sitzungen tun das.
- Keine `data/status.json`-Änderung. Folge-Sitzungen tun das.
- Keine Sage-Page-Änderung. Bau-Sitzungen tun das nach dem Spec-Block.
- Kein Aufruf von `update_puls_pie.py` (kein Modul-Status-Wechsel).
- Keine eigene Spec-Erfindung jenseits der drei reifen Anker (1, 6, 9)
  + Plattform-Matrix. Wenn du eine zusätzliche Lücke siehst, schreibst
  du das als offene Frage in PULS § Anker, nicht als Spec.

Pflicht am Ende:

- Chat-Erklärung Phase 2 (5-8 Sätze).
- PULS-Eintrag (Phase 3).
- Brief 01 als Datei (Phase 4).
- Übergabeprotokoll (Phase 5).
- Commit + Push + Draft-PR.
- „Vorgeschlagene nächste Schritte"-Block im Chat am Sitzungs-Ende.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende des
  betroffenen Ankers (1, 6, 9) oder in den neuen Meta-Sitzungs-Eintrag.
  Klaus klärt in der nächsten Sitzung.

Zeitschätzung: 1.5-2.5 Stunden für die Meta-Sitzung allein. Folge-
Sitzungen schätzen ihren eigenen Aufwand im jeweiligen Brief.
```

---

## Hinweise außerhalb des Briefes (Hauptsitzung-Kontext)

- **Quelle vorhanden, Sitzung muss nicht raten.** Die Meta-Sitzung
  findet das volle inhaltliche Material in
  `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md` (vier Stränge im Detail).
  Ihre Aufgabe ist Sequenzierung + Brief-01-Konkretion, nicht eine
  zweite Spec-Erfindung.

- **Bruder-Brief darf weiterleben.** `BRIEF_SPEC_M04_ERWEITERUNG.md`
  bleibt als alleinstehende Spec-Variante bestehen (PR #91), falls die
  Kaskade später entgleist und Klaus die M04-Erweiterung notabschalten
  will. Die Meta-Sitzung darf ihn nicht löschen, aber sollte in PULS
  notieren, dass die Kaskaden-Variante (`BRIEF_01_…` ff.) den
  Bruder-Brief vorranggestellt hat.

- **Disziplin gegen verlorene Briefe.** Klaus' M04-Brainstorming-Pflege
  hat den Großbrief nur im Chat-Tab abgelegt — er ging verloren, PR
  #91 musste ihn rekonstruieren. Die Brief-Kaskade als Datei-Schema
  fängt dieses Risiko strukturell ab: jeder nächste Brief liegt im
  Repo, bevor die Sitzung schließt.

- **Konsistenz im Verteilten.** INTERFACES.md kann nach mehreren
  Folge-Sitzungen Widersprüche tragen, wenn ein späterer Strang einen
  früheren übersieht. Die heilige Tafel 5 (verteilte Konsistenz-
  Prüfung) zwingt jede Folge-Sitzung, den aktuellen INTERFACES-Stand
  zu lesen, bevor sie schreibt. Wenn nötig: Vorgänger nachziehen, dann
  selbst schreiben.

- **Kaskaden-Ende.** Die letzte Folge-Sitzung schließt mit einem
  Abschluss-Brief (z.B. `BRIEF_99_SAMMELSPEC_ABSCHLUSS.md`) oder einem
  PULS-Eintrag, der die nun anstehenden Bau-Sitzungen als zweite
  Kaskade auflistet (typisch: V1-Bau Sage-Page-Refactor, Anker 9
  Stufe A Bau, Anker 6 Bau, Anker 9 Stufe B Bau). Diese Bau-Kaskade
  ist Klaus' nächste Meta-Entscheidung, nicht Sache dieser Spec-
  Kaskade.
