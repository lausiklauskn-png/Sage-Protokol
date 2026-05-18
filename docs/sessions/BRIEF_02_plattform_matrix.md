# Brief 02 — Spec-Sitzung Plattform-Matrix · zweite Etappe der V1-Sammelspec-Kaskade

**Strang 2 von 4** der V1-Sammelspec, kaskadiert in PR der
Meta-Pflege 2026-05-18 (siehe `docs/PULS.md` § Archiv-Index
„Meta-Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" plus
Übergabeprotokoll `docs/sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md`).
Quell-Spec ist `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md` § STRANG
4; dieser Brief schneidet den Strang heraus und liefert die Etappe
als eigenständige Sitzung. Brief 01 (V1 Sage-Hybrid) wurde in der
vorausgegangenen Sitzung erledigt und ist Voraussetzung. Brief 03
(Anker 9 M04-Erweiterung) und Brief 04 (Anker 6 Multi-Identität)
folgen als weitere Etappen.

Dieser Brief geht in den **ersten Prompt** der nächsten Spec-Sitzung
als Codeblock.

---

```
Du bist eine Spec-Sitzung in Sage-Protokol — Brief 02 der V1-
Sammelspec-Kaskade.

Branch: claude/spec-v1-plattform-matrix   (vom main aus anlegen,
        NACHDEM Brief-01-PR gemerged ist — siehe Konsistenz-Prüfung)

Sitzungs-Rolle: Spec (kein Code, kein Modul-Eingriff). Du
realisierst STRANG 4 der V1-Sammelspec — Plattform-Matrix neben der
Endknoten-Liste in INTERFACES, mit Plattform-Ehrlichkeits-Klausel
und Querverweisen zu den Vision-Ankern (Königin / Extension / Mini-
Browser). Die anderen zwei Stränge (M04-Erweiterung, Multi-
Identität) laufen in Brief 03 und Brief 04. INTERFACES.md ist die
heilige Tafel — ziehst du sie ZUERST, dann Karte 09 und CLAUDE.md
(beide nur lesen, nicht editieren in diesem Brief — Brief 01 hat
sie auf den Endknoten-Stand gebracht).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (Sitzungs-Disziplin, Pflicht am Sitzungs-Ende,
   Konventionen — § „Was dieses Repo ist" steht seit Brief 01 auf
   „Hub und Knoten zugleich", Sage ist dritter Endknoten)
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Spec — V1 Sage-Hybrid
     (Brief 01 der V1-Sammelspec-Kaskade)" als unmittelbarer
     Vorgänger
   - § Archiv-Index: „Meta-Pflege · V1-Sammelspec als Brief-Kaskade
     sequenziert" (sechs heilige Tafeln) plus Übergabeprotokoll
   - § Vision-Anker
     - „2026-05-17 · Sage als Hybrid-Knoten (Variante I)" (Anker 1
       § Status nach Brief 01 auf „Strang 1 realisiert")
     - „2026-05-17 · Königin-Relay (Modul 13?) — Mailbox für
       offline-Geschwister" (Anker 4 — Hintergrund-Empfangs-Bezug
       der Plattform-Matrix)
     - „2026-05-18 · SBKIM-Browser-Extension — „Lampe in der
       Toolbar"" (Anker 7 — Extension-Spalte der Matrix)
     - „2026-05-18 · Eigener Mini-Browser — Tauri-App als
       dedizierter Knoten" (Anker 8 — Mini-Browser-Spalte der
       Matrix)
3. docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md § STRANG 4 (Detail-
   Vorlage für die vier Punkte a–d dieses Strangs plus
   Querverweis-Matrix)
4. docs/sessions/BRIEF_01_v1_sage_hybrid.md (Vorgänger-Brief, lies
   die Pflicht-am-Ende-Sektion — Brief 02 erbt deren Bauplan)
5. docs/sessions/BRIEF_02_plattform_matrix.md (dieser Brief)
6. docs/INTERFACES.md (vollständig — heilige Tafel, du editierst
   sie; § 6 Endknoten-Liste + § 6.1 Sage-Endknoten — Sage-Page-
   Architektur kamen in Brief 01; die Plattform-Matrix kommt als
   § 6.2 daneben, NICHT als separater Top-Level-Block)
7. docs/components/09_einbau_pwa.md (nur lesen — Brief 01 hat
   Schritt 1 um Sage-als-Endknoten erweitert; in Brief 02 nicht
   anfassen)

Was du NICHT liest: andere Komponenten-Karten, Modul-Code in src/,
Sage-Page index.html, sbkim-paper-en.html, BRIEF_SPEC_M04 (Brief 03-
Vorlage, nicht hier).

Heilige Tafeln (Kaskaden- und Strang-spezifisch):

- **INTERFACES verbindlich** — wenn du eine Schnittstelle änderst,
  ZUERST dort, DANN andere Tafeln. Brief 02 editiert primär nur
  INTERFACES; CLAUDE.md / Karte 09 / status.json bleiben
  unangetastet (Brief 01 hat sie auf den Endknoten-Stand gebracht
  — die Plattform-Matrix lebt rein in INTERFACES).

- **PROTOCOL_VERSION-Disziplin:** Strang 4 ist additiv — die
  Plattform-Matrix ist ein dokumentarischer Block in INTERFACES,
  kein Spore-Schema-Feld, kein neuer Pflicht-Pfad. Erwartung:
  bleibt `"0.1"`. Falls du beim Editieren entdeckst, dass die
  Matrix einen impliziten Pflicht-Hop nötig macht (z.B. weil ein
  Plattform-Profil eine neue Spore-Eigenschaft erzwingt), HALT AN
  und schreib die offene Frage in PULS § Vision-Anker 1 — nicht
  selbstständig auf 0.2 bumpen.

- **Plattform-Ehrlichkeits-Klausel als heilige Tafel der Matrix:**
  Kein Endknoten gibt vor, mehr zu können als seine Plattform
  erlaubt. Jede Spore trägt implizit ihre Plattform — kein Knoten
  lügt. (Klaus' Sorge aus den Pages-Live-Tests 2026-05-17, Lehre 1
  Browser-Instanzen-Trennung). Diese Klausel ist VERBINDLICH und
  bekommt einen eigenen Absatz.

- **Anti-Vorgriff auf Anker 4 / 5 / 7 / 8:** Die Matrix VERWEIST
  auf diese Vision-Anker, sie SPEZIFIZIERT sie nicht. Königin-
  Relay (V4), Identitäts-Container (V5), Extension (V7) und Mini-
  Browser (V8) haben eigene Spec-Sitzungen (oder bleiben Vision).
  Brief 02 nimmt nur die Schnittstellen-Eckdaten in die Matrix.

- **Privatheit:** Anker 9 § Sorge ums Freigeben bleibt offen — die
  Plattform-Matrix lässt die Lizenz-Frage unberührt.

Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):

1. Prüfe, dass der Brief-01-PR (Spec V1 Sage-Hybrid — Strang 1 der
   V1-Sammelspec-Kaskade) gemerged ist. Wenn nicht: HALT AN,
   schreib die offene Frage in PULS § Vision-Anker 1, ende die
   Sitzung. Brief 02 setzt Sage als dritten Endknoten in
   INTERFACES § 6 voraus — ohne das hängt die Plattform-Matrix-
   Zeile für Sage in der Luft.

2. Prüfe INTERFACES § 6 Endknoten-Liste auf den Stand nach Brief
   01: drei Endknoten (Rezeptbuch, Mixarium, Sage), Sage-Domäne
   `Mycel-Bibliothek`, Stamm/Gast disjunkt, domainVector-Slot
   null. § 6.1 Sage-Endknoten — Sage-Page-Architektur muss
   existieren (IndexedDB-Suffix `sbkim_sage`, App-SW Variante 3a,
   volle init()-Kette, Andock-Geste). § 7 Änderungsprotokoll muss
   den Brief-01-Eintrag haben.

3. **Spiegele den V1-Endknoten-Eintrag aus Brief 01 in der
   Plattform-Matrix-Zeile.** Sage ist ein GitHub-Pages-PWA-Profil
   („nur Tab offen", kein Hintergrund-Empfang, browser-SW oder
   App-SW Variante 3a beim Andocken) — die Matrix muss diese
   Eigenschaften korrekt reflektieren, NICHT konstruieren.

4. Falls Korrekturen am Brief-01-Eintrag nötig sind (z.B. weil
   ein Plattform-Profil eine bisher übersehene Eigenschaft
   verlangt): erst Brief 01 korrigieren in einem separaten
   Commit auf demselben Branch, dann eigenen Strang einbauen.
   Niemals Brief 01-Schäden ohne Vermerk hineinmischen.

5. **PR #89 (Karte 15 Membran als Stub).** Wenn beim Brief-02-
   Sitzungs-Start PR #89 noch offen ist oder zwischenzeitlich
   gemerged wurde, INTERFACES.md auf den `main`-Stand prüfen.
   Karte 15 Membran berührt Modul-15-Block (nach Modul 09) und
   sollte mit der Plattform-Matrix (§ 6.2 neben § 6 Endknoten-
   Liste) nicht kollidieren — sofern Brief 02 die Matrix nicht
   versehentlich in den Modul-15-Block hineinschreibt.

Deine Aufgabe heute — STRANG 4, vier Punkte a–d:

a) docs/INTERFACES.md § 6.2 Plattform-Matrix (neuer Block neben
   § 6.1 Sage-Endknoten):

   Tabelle mit fünf Plattform-Profilen und sechs Spalten
   (vorgegeben von BRIEF_SPEC_V1_SAMMELSPEC § STRANG 4 § a, plus
   Spalte „Beispiel-Knoten" als sechste, damit jede Zeile einen
   konkreten Ankerpunkt zu den drei Bestands-/Spec-Endknoten oder
   den Vision-Ankern bekommt):

   ```
   Plattform           IndexedDB   SW              Spore-Empfang        Identitäts-Backup    Stufe B    Beispiel-Knoten
   ------------------------------------------------------------------------------------------------------------------------
   Desktop-Browser     pro Profil  browser-SW      nur Tab offen        optional Container   ja         (heute Klaus' Sage-Page-Test)
   DeX-Tablet          pro Profil  browser-SW      nur Tab offen        optional Container   ja         (heute Mein-Mixarium / Mein-Rezeptbuch DeX-Setup)
   PWA-installiert     pro Profil  App-SW          Tab fest, längere    optional Container   ja         Mein-Mixarium + Mein-Rezeptbuch (Variante 3b)
                                                    Lebenszeit
   Mini-Browser (V8)   eigene DB   App-eigener     Tray-Modus,          Datei-System         ja (Key    Vision-Anker 8 (Tauri-App, noch nicht gebaut)
                       (App-Dir)                    Hintergrund-OK                              im App-
                                                                                                Dir)
   Extension (V7)      Browser-DB  Background-     Popup-Trigger,       keine eigene,        ja im      Vision-Anker 7 („Lampe in der Toolbar", noch
                       geteilt     Service-W.       begrenzt              nutzt PWA-Container   Popup      nicht gebaut)
                       mit PWA
   ```

   Für Sage als dritten Endknoten (Brief 01) gilt heute das Profil
   „Desktop-Browser" bzw. „PWA-installiert nach Andocken". Halte
   das in einer Sage-spezifischen Anmerkung unter der Matrix fest
   (NICHT als eigene Zeile in der Tabelle — Sage liegt auf
   Plattform GitHub Pages und nimmt damit das PWA-Profil ein,
   sobald Klaus die Page installiert; davor das Desktop-Browser-
   Profil).

b) docs/INTERFACES.md § 6.3 Plattform-Ehrlichkeits-Klausel (neuer
   Block, direkt nach der Matrix in § 6.2):

   Verbindliche Spec-Klausel — kein Endknoten gibt vor, mehr zu
   können als seine Plattform erlaubt. Wortlaut-Vorschlag (du
   formulierst final aus):

   > „Sporen-Verhalten ist plattform-ehrlich: jede Spore trägt
   > implizit ihre Plattform (durch ihren `endpoint` und das
   > beobachtete Empfangs-Verhalten), kein Knoten lügt über
   > Hintergrund-Empfang oder Schlüssel-Sicherheit. Plattformen
   > mit ‚nur Tab offen' (Desktop-Browser, DeX-Tablet) oder
   > ‚Popup-Trigger' (Extension) sind ehrlich offline-anfällig
   > — Hintergrund-Empfang ist Vision-Anker 4 (Königin-Relay)
   > vorbehalten und kein Pflicht-Bestandteil des Protokolls."

   Begründung in einem zweiten Absatz: Klaus' Lehre 1 (Browser-
   Instanzen-Trennung, Pages-Live-Tests 2026-05-17, PULS § Anker
   1 Bezugs-Block).

c) docs/INTERFACES.md § 6.4 Vision-Bezüge (neuer Block, direkt
   nach § 6.3 Plattform-Ehrlichkeit):

   Querverweis-Matrix zwischen den V1-Sammelspec-relevanten
   Vision-Ankern (V1 / V4 / V5 / V6 / V7 / V8 / V9, sieben
   Anker). Vorgabe aus BRIEF_SPEC_V1_SAMMELSPEC § STRANG 4 § c:

   ```
   V1 (Sage-Hybrid) | V9 (M04) | V6 (Multi-Id.) | V7 (Extension) | V8 (Mini-Browser) | V4 (Königin) | V5 (Container)
   Träger           | Stufe-B-Ort | Persona-Quelle | Toolbar-Lampe | Tray-Träger     | Mailbox      | Key-Speicher
   ```

   Format: kurze Erklär-Tabelle (zwei Zeilen, sieben Spalten)
   plus ein Absatz Begründung pro Anker, der die Rolle des Ankers
   im Plattform-Matrix-Kontext nennt. KEINE Spec der Anker selbst —
   nur die Schnittstelle Plattform ↔ Anker. Anker 4 / 5 / 7 / 8 /
   9 / 6 haben eigene Spec-Sitzungen (oder bleiben Vision).

d) docs/INTERFACES.md § 7 Änderungsprotokoll: neuer Eintrag
   „2026-05-XX · Spec-Sitzung Plattform-Matrix (Brief 02)" mit den
   drei Punkten a–c sowie Verweis auf den Brief-01-PR als
   Vorgänger und auf den hier entstehenden Brief 03.

Was du NICHT tust:

- Kein Modul-Code in src/. Spec geht der Implementierung voraus.
- Keine Sage-Page-Änderung (index.html). Sage-Page-Refactor ist
  Bau-Sitzung nach Kaskaden-Abschluss (BRIEF_99-Liste).
- Keine M04-Erweiterung (Spore-Schema, Match-API, Brücken-Feld) —
  das ist Brief 03. Karte 04 und Karte 02 bleiben unangetastet.
- Keine Multi-Identität-Spec (sbkim_keys-Multi-Slots, active-
  identity-Marker) — das ist Brief 04.
- Keine Königin-Relay-Spec (Anker 4 hat eigene Spec-Sitzung,
  bedingt Anker 13). Plattform-Matrix verweist nur.
- Keine Identitäts-Container-Spec (Anker 5). Matrix-Spalte
  „Identitäts-Backup" referenziert „Container" nur als Verweis.
- Keine Extension- oder Mini-Browser-Spec (Anker 7 / 8). Matrix-
  Zeilen referenzieren die Anker — Bau-Sitzungen kommen später.
- Keine CLAUDE.md-Änderung (Brief 01 hat sie auf „Hub und Knoten
  zugleich" umgeschrieben). Keine Karte-09-Änderung (Brief 01 hat
  § Schritt 1 erweitert). Keine status.json-Änderung (Brief 01
  hat Sage als endknoten[]-Eintrag aufgenommen). Brief 02 lebt
  rein in INTERFACES.
- KEINE Sage-Page-Karte-Erweiterung um eine „Plattform-Matrix"-
  Visualisierung — Sage-Page-Karten gehören zu Bau-Sitzungen.
- Kein update_puls_pie.py-Aufruf (kein status.json-Score-Wechsel).
  Wenn du beim INTERFACES-Editieren feststellst, dass die Matrix
  ein neues Pflicht-Feld in Spore-JSON oder status.json erzeugt,
  HALT AN und schreib die offene Frage in PULS § Vision-Anker 1.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am
   Sitzungsende:
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „2026-05-XX ·
     Spec — Plattform-Matrix (Brief 02 der V1-Sammelspec-Kaskade)"
     mit den vier Punkten a–d, Verweis auf den Brief-01-PR als
     Vorgänger und auf den hier entstehenden Brief 03.
   - Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern
     (Konvention). Der vorletzte wird nach diesem Brief der
     Brief-01-Sitzungs-Eintrag sein. PULS-Zeilen-Status prüfen —
     wenn nahe 3000, mehrere Einträge auslagern; nicht kürzen.
   - Vision-Anker 1 § Status nicht erneut anfassen (Brief 01 hat
     den Status auf „Strang 1 realisiert" gesetzt) — nur falls
     in dieser Sitzung ein konkreter Befund Sage betrifft,
     ergänze einen Sub-Punkt unter Vision-Anker 1 (Brief-02-
     Bezug). Vision-Anker 4 / 7 / 8 bleiben unangetastet
     (Matrix verweist, spezifiziert nicht).
   - Übergabeprotokoll in
     docs/sessions/archiv/2026-05-XX_spec-plattform-matrix.md
     (Format BRIEFING_TEMPLATE.md). Die zwei Strang-3/2-Aufgaben
     im § „Nächster sinnvoller Schritt" als „nicht in dieser
     Sitzung" markieren.
   - Commit + Push auf claude/spec-v1-plattform-matrix.
   - Draft-PR „Spec: Plattform-Matrix — Strang 2 der V1-
     Sammelspec-Kaskade".

2. Schreibe als letzte Datei-Aktion docs/sessions/BRIEF_03_m04_erweiterung.md
   für die nächste Folge-Sitzung. Inhalt: Strang 2 aus
   BRIEF_SPEC_V1_SAMMELSPEC herausgeschnitten + dieselbe Bauplan-
   Struktur wie Brief 01 / Brief 02. Pflichtleseliste
   aktualisieren (eigener PR + INTERFACES-Stand nach Brief 02 +
   Karten 02 / 04 / 06 nach Brief 02 + Briefe 01 und 02 als
   Vorgänger-Belege + relevante PULS-Anker-Querverweise: V9 M04-
   Erweiterung als Haupt-Anker, plus V4 / V6 / V7 / V8 als
   Bezugs-Anker plus die M04-Spezifika aus BRIEF_SPEC_V1_SAMMELSPEC
   § STRANG 2). Kaskaden-Konvention 5 (Vorgänger-Konsistenz-
   Prüfung) explizit erwähnen: Brief-03-Sitzung muss prüfen,
   dass keine Korrekturen an Brief 01 (Endknoten-Liste) oder
   Brief 02 (Plattform-Matrix) nötig sind, bevor M04-Spore-
   Schema und Match-API erweitert werden.
   Brief 03 erbt die PROTOCOL_VERSION-Disziplin — bleibt 0.1,
   solange `embeddingNeeds` und die neuen Match-Funktionen
   ADDITIV sind. Sollte M04 ein altes Feld zur Pflicht erheben
   (z.B. embedding → embeddingCapabilities als Pflicht-Rename),
   bumpt Brief 03 auf 0.2 und nennt das EXPLIZIT.

3. **Kaskaden-Konvention 6 (Auslöser-Befehl im Chat, nicht Brief-
   Volltext):** Gib am Sitzungs-Ende einen kurzen, kopierbaren
   Auslöser-Befehl (3–5 Zeilen) als Codeblock direkt in der Chat-
   Antwort aus. Der Auslöser nennt die Brief-Datei, den Branch
   und den Kaskaden-Kontext; die Folge-Sitzung liest den Brief
   selbst aus der Datei. Wortlaut (anpassen an deinen Brief-
   Namen + Branch):

   ```
   Lies docs/sessions/BRIEF_03_m04_erweiterung.md vollständig und
   führe den Brief als nächste Sitzung in der V1-Sammelspec-
   Kaskade aus. Konventionen siehe PULS § Archiv-Index „Meta-
   Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
   heilige Tafeln). Branch laut Brief (claude/spec-v1-m04-
   erweiterung oder ähnlich, vom main aus anlegen).
   ```

   Brief-Volltext im Chat ausdrücklich NICHT gewünscht — Datei
   im Repo ist die einzige Wahrheits-Quelle des Briefes, der
   Auslöser-Befehl ist nur der Sprung-Anker. Die Regel
   propagiert: dein BRIEF_03 muss in seinem „Pflicht am Ende"
   denselben Auslöser-Mechanismus für die Brief-04-Sitzung
   formulieren, und so weiter bis BRIEF_99_SAMMELSPEC_ABSCHLUSS.

4. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): erster Schritt verweist
   auf den Auslöser-Befehl aus Punkt 3 als Start-Trigger der
   nächsten Sitzung. Zweiter Schritt als alternative Auslöser-
   Option (z.B. PR mergen + die Bau-Sitzung Sage-Page-Refactor
   schon vorab planen — nur falls Klaus die Kaskade pausieren
   will). Reihenfolge-Hinweis: Brief 03 setzt diesen PR #<nummer>
   als gemerged voraus.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Vision-Anker 1
  ans Ende oder in den hier entstehenden Sitzungs-Eintrag „Was
  offen blieb". Klaus klärt in der nächsten Sitzung. Eine andere
  Sitzung mit frischem Kontext löst es schneller, als wenn du
  dich festbeißt und Tokens verbrennst.

Zeitschätzung: 2–3 Stunden für Strang 4 allein (knapper als
Brief 01, weil keine status.json- / CLAUDE.md- / Karte-09-
Pflege nötig — alles lebt rein in INTERFACES).
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Kaskaden-Konvention 1 (ein Strang = ein PR) ist heilig.** Wenn
  die Brief-02-Sitzung mid-Sitzung versucht, M04-Erweiterung oder
  Sage-Page-Refactor in derselben PR mitzunehmen, abbrechen und in
  PULS dokumentieren. Mehrere Stränge in einem PR brechen den
  Reviewer-Rhythmus.

- **Kaskaden-Konvention 2 (Brief als Datei, nicht im Chat).** Die
  Brief-02-Sitzung MUSS BRIEF_03_m04_erweiterung.md als letzte
  Datei-Aktion anlegen — der Auftrag der nächsten Sitzung darf
  nicht nur im Chat-Tab leben.

- **BRIEF_SPEC_M04_ERWEITERUNG bleibt als Vorlage.** Falls die
  Brief-02-Sitzung Hand-Anlegen am M04-Strang erwägt (z.B. weil
  ein Punkt aus Strang 4 die Match-API implizit berührt), STOP:
  M04 ist Brief 03 in der Kaskade. Der engere Bruder-Brief liegt
  nur noch als Stil-/Detail-Vorlage; als alleinstehende Sitzung
  wird er nicht mehr gezogen.

- **Vorgänger-Sage-Eintrag spiegeln, nicht neu erfinden.** Sage
  steht seit Brief 01 mit konkreten Eigenschaften in INTERFACES
  § 6 / § 6.1 (Domäne `Mycel-Bibliothek`, IndexedDB-Suffix
  `sbkim_sage`, App-SW Variante 3a, keine Hintergrund-Empfangs-
  Modus). Brief 02 ordnet Sage in die Plattform-Matrix ein, ohne
  diese Spec zu ändern. Wenn ein Plattform-Profil ergibt, dass
  Brief 01 eine Eigenschaft falsch gesetzt hat, dann KORRIGIERST
  du Brief 01 separat (eigener Commit) und vermerkst das im
  Brief-02-PULS-Eintrag — niemals heimlich mitziehen.

- **Sage-Page-Refactor bleibt NACH der Kaskade.** Erst wenn Brief
  99 (Sammelspec-Abschluss) steht und die Bau-Brief-Liste die
  Sage-Page-Refactor-Bau-Sitzung benennt, beginnt dort der
  eigentliche index.html-Eingriff. Bis dahin ist die Plattform-
  Matrix-Zeile für Sage rein dokumentarisch.

- **Paralleler offener PR #89 (Karte 15 Membran).** Wenn beim
  Brief-02-Sitzungs-Start PR #89 noch offen ist, INTERFACES.md
  vor dem Editieren auf den `main`-Stand prüfen. Karte 15
  Membran berührt den Modul-15-Block (nach Modul 09) und sollte
  mit § 6.2 Plattform-Matrix (in § 6 daneben) nicht kollidieren.
