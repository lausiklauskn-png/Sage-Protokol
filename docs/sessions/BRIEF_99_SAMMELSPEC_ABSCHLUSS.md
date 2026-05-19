# Brief 99 — Sammelspec-Abschluss · letzte Etappe der V1-Sammelspec-Kaskade

**Abschluss-Sitzung** der V1-Sammelspec-Kaskade nach Brief 01 (V1
Sage-Hybrid), Brief 02 (Plattform-Matrix), Brief 03 (M04-Erweiterung)
und Brief 04 (Multi-Identität). Diese Sitzung schließt die Kaskade
und benennt die Bau-Sitzungs-Brief-Pipeline für die nächste Welle.

Dieser Brief geht in den **ersten Prompt** der Abschluss-Sitzung als
Codeblock.

---

```
Du bist eine Abschluss-Sitzung in Sage-Protokol — Brief 99 der V1-
Sammelspec-Kaskade (Sammelspec-Abschluss).

Branch: claude/spec-v1-abschluss     (vom main aus anlegen, NACHDEM
        Brief-04-PR gemerged ist — siehe Konsistenz-Prüfung)

Sitzungs-Rolle: Abschluss (kein neuer Spec-Strang, kein Code, kein
Modul-Eingriff). Du bündelst die vier Stränge der V1-Sammelspec zur
Bau-Brief-Pipeline. INTERFACES.md ist die heilige Tafel — du fügst
einen Änderungsprotokoll-Eintrag „Sammelspec-Abschluss (Brief 99)"
ein, mehr nicht. CLAUDE.md / Karte 09 / status.json / Sage-Page
bleiben unangetastet.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (Sitzungs-Disziplin, Konventionen)
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Spec — Multi-Identität
     (Brief 04 der V1-Sammelspec-Kaskade)" als unmittelbarer Vorgänger
   - § Archiv-Index: vier Strang-Einträge (Brief 01-04) plus „Meta-
     Pflege · V1-Sammelspec als Brief-Kaskade sequenziert"
   - § Vision-Anker: V1 / V6 / V9 § Status auf „Strang X realisiert"
     für die jeweiligen Stränge; V4 / V5 / V7 / V8 unverändert als
     Vision
3. docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md (Quell-Spec, vollständig
   gelesen — du fertigst die finale Abschluss-Übersicht)
4. docs/sessions/BRIEF_01_v1_sage_hybrid.md +
   docs/sessions/BRIEF_02_plattform_matrix.md +
   docs/sessions/BRIEF_03_m04_erweiterung.md +
   docs/sessions/BRIEF_04_multi_identitaet.md (alle vier Strang-Briefe,
   um die Stränge sauber zu bündeln)
5. docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md (dieser Brief)
6. docs/INTERFACES.md (§ 9 Änderungsprotokoll wurde in Brief 04 auf
   § 10 nachnummeriert — du fügst einen Brief-99-Eintrag in § 10 ein;
   sonst LIES nur, verändere nichts)

Was du NICHT liest: andere Komponenten-Karten als die in § 4
auf dem Lese-Index der Vorgänger genannten; Modul-Code in src/;
Sage-Page index.html; andere Vision-Anker als die V1 / V4 / V5 / V6 /
V7 / V8 / V9.

Heilige Tafeln (Kaskaden-Abschluss-spezifisch):

- **Kaskaden-Konvention 1: ein Strang = ein PR.** Brief 99 ist KEIN
  Strang — er ist Abschluss. Trotzdem: ein eigener PR mit den
  Abschluss-Artefakten (Änderungsprotokoll-Eintrag, Bau-Brief-
  Pipeline-Notiz, eventuelle Korrekturen an Brief 01-04 — letzteres
  nur bei nachweisbarem Bedarf, sonst NICHT).

- **Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):**
  1. Prüfe, dass alle vier Strang-PRs gemerged sind (Brief 01 PR #96,
     Brief 02 PR #97, Brief 03 PR #98, Brief 04 PR #?? — Brief 04
     muss vor Brief 99 gemerged sein). Wenn nicht: HALT AN, schreib
     die offene Frage in PULS § Sitzungs-Eintrag „Brief 99 abgebrochen",
     ende die Sitzung. Sammelspec-Abschluss setzt alle vier Stränge
     als gemerged voraus.
  2. Prüfe INTERFACES § 0 / § 1 / § 2 / § 6 / § 7 / § 8 / § 9 / § 10
     auf den Stand nach Brief 04: drei §0-Konstanten aus Brief 03,
     fünf neue API-Funktionen in Modul 02 aus Brief 04, identitäts-
     spezifische Slot-Pattern in 05/06/07, § 6.1-§ 6.4 aus Brief
     01+02, § 7 LLM-Ehrlichkeits-Klausel aus Brief 03, § 8 Anti-
     Missbrauch-Klausel aus Brief 03, § 9 Identitäts-Map aus Brief
     04, § 10 Änderungsprotokoll mit Brief-01/02/03/04-Einträgen.
  3. PROTOCOL_VERSION-Status-Snapshot prüfen: bleibt `"0.1"`?
     Strategie A (Brief 04) gewählt, keine alte Felder zur Pflicht
     erhoben (Brief 03), keine Spore-Schema-Eingriffe (Brief 01+02).
     Brief 99 dokumentiert das Snapshot-Ergebnis als verbindliche
     Aussage.

- **PROTOCOL_VERSION-Status-Snapshot.** Erwartung: `"0.1"`. Sollte
  bei Prüfung in Schritt 3 (Konsistenz) eine Diskrepanz auftauchen
  (z.B. weil eine Folge-Pflege heimlich gebumpt hätte), HALT AN
  und stelle die Pflicht-Entscheidung in PULS § Vision-Anker — die
  Sammelspec-Abschluss-Sitzung darf den Bump NICHT heimlich
  weiterführen.

Deine Aufgabe heute — Abschluss in fünf Punkten a–e:

a) **docs/INTERFACES.md § 10 Änderungsprotokoll** um eine
   Abschluss-Zeile ergänzen:

   - Datum: 2026-05-XX (Sitzungsdatum)
   - Sitzung: „Sammelspec-Abschluss (Brief 99)"
   - Änderung: Verweis auf die vier Strang-Einträge (Brief 01-04)
     plus Status-Snapshot („alle vier Stränge gemerged, PROTOCOL_VERSION
     bleibt `"0.1"`, BACKUP_FORMAT_VERSION bleibt `1` bis Bau-Folge-
     Sitzung 02.Y, die Multi-Identitäts-Backup-Bump-Entscheidung aus
     Brief 04 § 9.6 hält"). KEINE neuen §-Inhalte — Abschluss-Zeile
     dokumentiert nur den Stand.

b) **docs/PULS.md § Sitzungs-Einträge** neuer Top-Eintrag „2026-05-XX ·
   Abschluss — V1-Sammelspec-Kaskade (Brief 99)" mit:

   - Zusammenfassung aller vier Stränge in einem Absatz:
     - Brief 01: Sage als dritter Endknoten, § 6 / § 6.1, CLAUDE.md
       auf „Hub und Knoten zugleich".
     - Brief 02: Plattform-Matrix § 6.2 mit fünf Profilen × sechs
       Spalten, § 6.3 Ehrlichkeits-Klausel, § 6.4 Vision-Bezüge.
     - Brief 03: M04-Erweiterung § 0 (drei Konstanten) / § 1 Modul 02 /
       § 1 Modul 04 (vier Sub-Blöcke) / § 2 Spore-JSON / § 7 / § 8.
     - Brief 04: Multi-Identität § 1 Modul 02 / 05 / 06 / 07 / § 2 / § 9.
   - Bau-Sitzungs-Brief-Pipeline (Liste, in vorgeschlagener
     Reihenfolge):
     1. **Bau Sage-Page-Refactor** (volle init()-Kette aller SBKIM-
        Module + Andock-Wizard an der Schwarz-Loch-Karte + Schichten-
        Lampen für M04-Erweiterung + Identitäts-Wechsler-UX).
        Geschätzt ~6-10 h.
     2. **Bau 01.Y `ensureStore`** in Modul 01 (Option A aus § 9.5
        Dynamische Store-Erzeugung; Versions-Bump-Choreografie für
        v=3 → v=4). Geschätzt ~2-3 h.
     3. **Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump** in
        Modul 02. Geschätzt ~5-8 h.
     4. **Bau 04.A Stufe A erweitert** in Modul 04 (matchDimensions
        sync). Geschätzt ~2-3 h.
     5. **Bau 04.B Stufe B** in Modul 04 (explainMatchLLM + User-Key-
        Verwaltung). Geschätzt ~5-8 h.
     6. **Bau 05.Y / 06.Y / 07.Y transparenter Slot-Pfad** in den
        Konsumenten (über `getActiveIdentityKey()` + Receiver-Map
        nodeId→key). Je Modul ~2-3 h.
     7. **Bau Multi-Identitäts-Migration der Endknoten** in
        Mein-Mixarium / Mein-Rezeptbuch (additive Andock-Wizard-
        Erweiterung). Geschätzt ~2 h.
   - Konsistenz-Prüfungs-Pflicht: alle vier Strang-PRs gemerged
     (Brief 01 PR #96, Brief 02 PR #97, Brief 03 PR #98, Brief 04
     PR #??).
   - PROTOCOL_VERSION-Status-Snapshot: bleibt `"0.1"`.

c) **Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern** —
   nach diesem Brief wird das der Brief-04-Sitzungs-Eintrag sein.
   Konvention pro Sitzung. PULS-Zeilen-Status prüfen — wenn nahe
   3000, mehrere Einträge auslagern; nicht kürzen.

d) **PULS § Vision-Anker 1 / 6 / 9 § Status** auf „Strang X
   realisiert + Sammelspec-Abschluss (Brief 99) abgeschlossen"
   nachziehen. Anker 4 / 5 / 7 / 8 bleiben unangetastet (eigene
   Spec-Sitzungen außerhalb der Kaskade).

e) **Übergabeprotokoll in
   `docs/sessions/archiv/2026-05-XX_abschluss-v1-sammelspec.md`**
   (Format BRIEFING_TEMPLATE.md). Inhalt: alle fünf Punkte a–e plus
   Heilige-Tafeln-Eingehalten-Block plus „Was NICHT angefasst"-Block
   plus „Nächster sinnvoller Schritt"-Block mit Verweis auf die
   Bau-Brief-Pipeline (Klaus entscheidet, welcher Bau zuerst startet).

Was du NICHT tust:

- Kein Modul-Code in src/. Abschluss ist Doku-Pflege.
- Keine Sage-Page-Änderung (index.html). Sage-Page-Refactor ist
  Bau-Sitzung nach Kaskaden-Abschluss (siehe Bau-Brief-Pipeline).
- Keine inhaltliche Änderung an Brief 01-04. Wenn ein Detail-
  Befund auffällt, dokumentiere ihn als „Folge-Pflege-Empfehlung"
  in PULS § Offene Querschnitts-Fragen, aber KORRIGIERE die alten
  Briefe NICHT in dieser Sitzung (das wäre ein neuer Strang).
- Keine Königin-Relay-Spec (V4 eigene Spec). Keine Identitäts-
  Container-Spec (V5 eigene Spec). Keine Extension- oder Mini-
  Browser-Spec (V7 / V8).
- Keine CLAUDE.md-Änderung. Keine Karte-09-Änderung. Keine
  `status.json`-Änderung.
- Kein update_puls_pie.py-Aufruf (kein status.json-Score-Wechsel).

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende:
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag (siehe Punkt b).
   - Vorletzten Sitzungs-Eintrag (Brief 04) ins Archiv-Index
     auslagern (siehe Punkt c).
   - Vision-Anker 1 / 6 / 9 § Status nachziehen (siehe Punkt d).
   - Übergabeprotokoll (siehe Punkt e).
   - Commit + Push auf claude/spec-v1-abschluss.
   - Draft-PR „Sammelspec-Abschluss — Brief 99 der V1-Sammelspec-
     Kaskade".

2. **Kaskaden-Konvention 6 (Auslöser-Befehl im Chat):** Da BRIEF_99
   die Kaskade SCHLIESST, gibt es **keinen Folge-Brief**. Der
   „Vorgeschlagene nächste Schritte"-Block (CLAUDE.md § Pflicht 5)
   verweist stattdessen auf die Bau-Brief-Pipeline aus Punkt b §
   Bau-Sitzungs-Brief-Pipeline — Klaus entscheidet, welcher Bau
   zuerst startet.

3. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): zwei bis vier priorisierte
   Bau-Sitzungs-Trigger als Markdown-Liste mit ein-Satz-Begründung
   und Reihenfolge-Hinweis. Empfehlung: Sage-Page-Refactor als
   erster Bau (sichtbares Ergebnis für Klaus), gefolgt von 01.Y +
   02.Y Multi-Identitäts-Migration (Infrastruktur-Hebel für alle
   weiteren Bauten).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Brief 99 abgebrochen" ans Ende. Klaus klärt in der nächsten
  Sitzung.

Zeitschätzung: 1–2 Stunden für den Abschluss-Block (reine Doku-
Aggregation; keine Spec-Detail-Arbeit). Brief 99 ist deutlich
schlanker als die Strang-Briefe.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Kaskaden-Konvention 1 (ein Strang = ein PR) bleibt heilig.**
  Auch wenn BRIEF_99 kein Strang ist, ist er ein eigener PR mit
  klar abgegrenztem Inhalt (Änderungsprotokoll-Abschluss-Zeile +
  PULS-Aggregation + Bau-Brief-Pipeline-Notiz).

- **Kaskaden-Konvention 2 (Brief als Datei) bleibt heilig.** BRIEF_99
  liegt im Repo (dieser Brief). Der Auslöser-Befehl ist nur der
  Sprung-Anker; der Brief-Volltext ist nicht im Chat.

- **PROTOCOL_VERSION-Disziplin als bewusste Entscheidung.** Erwartung
  ist `"0.1"`; Brief 99 dokumentiert das Snapshot-Ergebnis. Bei
  Diskrepanz: HALT AN.

- **Vorgänger-Sage-/Plattform-/M04-/Multi-Identitäts-Stand spiegeln,
  nicht neu erfinden.** Brief 99 fasst nur zusammen — keine inhaltliche
  Änderung an Brief 01-04.

- **Sage-Page-Refactor bleibt NACH der Kaskade.** Die Bau-Brief-
  Pipeline (Punkt b) benennt den Sage-Page-Refactor als ersten Bau —
  er beginnt NACH Merge der Brief-99-PR.

- **Paralleler offener PR #89 (Karte 15 Membran).** Wenn beim Brief-
  99-Sitzungs-Start PR #89 noch offen ist, INTERFACES.md vor dem
  Edit auf den `main`-Stand prüfen. Karte 15 Membran berührt den
  Modul-15-Block nach Modul 09 und sollte mit Brief 99's
  Änderungsprotokoll-Abschluss-Zeile nicht kollidieren — sofern
  Brief 99 nicht versehentlich die Membran-Zeilen mit-bearbeitet.

- **Was NACH Brief 99 kommt:** die Bau-Brief-Pipeline (Sage-Page-
  Refactor + 01.Y + 02.Y + 04.A + 04.B + 05.Y/06.Y/07.Y + Endknoten-
  Migration) ist die nächste Welle. Sie ist KEINE Spec-Kaskade —
  jeder Bau-Brief ist eine eigenständige Bau-Sitzung mit eigenem PR.
  Reihenfolge: Klaus entscheidet, welche Bau-Sitzung zuerst startet.
  Empfehlung in Brief 99's „Nächster sinnvoller Schritt": Sage-Page-
  Refactor als erster Bau (sichtbares Ergebnis), gefolgt von
  Infrastruktur-Bauten (01.Y, 02.Y, dann transparente Slot-Pfade in
  05.Y/06.Y/07.Y, dann Endknoten-Migration).
