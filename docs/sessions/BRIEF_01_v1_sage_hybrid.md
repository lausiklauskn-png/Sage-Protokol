# Brief 01 — Spec-Sitzung V1 Sage-Hybrid · erste Etappe der V1-Sammelspec-Kaskade

**Strang 1 von 4** der V1-Sammelspec, kaskadiert in PR der
Meta-Pflege 2026-05-18 (siehe `docs/PULS.md` § Sitzungs-Einträge
„Meta-Pflege — V1-Sammelspec als Brief-Kaskade sequenziert"). Quell-
Spec ist `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md` § Strang 1;
dieser Brief schneidet den Strang heraus und liefert die Etappe als
eigenständige Sitzung. Die anderen drei Stränge laufen in Brief 02
(Plattform-Matrix), Brief 03 (Anker 9 M04-Erweiterung) und Brief 04
(Anker 6 Multi-Identität).

Dieser Brief geht in den **ersten Prompt** der nächsten Spec-Sitzung
als Codeblock.

---

```
Du bist eine Spec-Sitzung in Sage-Protokol — Brief 01 der V1-
Sammelspec-Kaskade.

Branch: claude/spec-v1-sage-hybrid   (vom main aus anlegen)

Sitzungs-Rolle: Spec (kein Code, kein Modul-Eingriff). Du
realisierst STRANG 1 der V1-Sammelspec — Sage als dritter Endknoten
neben Mein-Rezeptbuch und Mein-Mixarium. Die drei anderen Stränge
(Plattform-Matrix, M04-Erweiterung, Multi-Identität) laufen in
Folge-Sitzungen mit eigenen Briefen. INTERFACES.md ist die heilige
Tafel — ziehst du sie ZUERST, dann status.json, CLAUDE.md und
Karte 09.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (Sitzungs-Disziplin, Pflicht am Sitzungs-Ende,
   Konventionen — Knotentyp „hybrid" steht schon im Footer und
   wird mit dieser Spec endlich wahr)
2. docs/PULS.md § Vision-Anker
   - „2026-05-17 · Sage als Hybrid-Knoten (Variante I)" (Anker 1,
     vollständig — CLAUDE.md-Umschrift, INTERFACES-Eintrag, status.
     json-Erweiterung, Sage-Page volle init()-Kette, Domäne-
     Vorschläge, IndexedDB-Suffix sbkim_sage, App-SW-Variante 3a,
     Andock-Geste an der Schwarz-Loch-Karte)
   und § Sitzungs-Einträge
   - „2026-05-18 · Meta-Pflege — V1-Sammelspec als Brief-Kaskade
     sequenziert" (Kaskaden-Konvention, fünf heilige Tafeln, Brief-
     Datei-Liste, PROTOCOL_VERSION-Disziplin)
3. docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md § STRANG 1 (Detail-
   Vorlage für die fünf Punkte a–e dieses Strangs)
4. docs/sessions/BRIEF_01_v1_sage_hybrid.md (dieser Brief)
5. docs/INTERFACES.md (vollständig — heilige Tafel, du editierst sie;
   bei der Pflicht-Prüfung Konvention 5 der Kaskade läuft die
   Konsistenz-Prüfung hier)
6. docs/components/09_einbau_pwa.md (Schritt 1 wird erweitert)
7. data/status.json (Sage-Endknoten-Eintrag kommt hier rein)

Was du NICHT liest: andere Komponenten-Karten, Modul-Code in src/,
Sage-Page index.html, sbkim-paper-en.html. Sage-Page-Refactor (volle
init()-Kette aller SBKIM-Module, Andock-Wizard an der Schwarz-Loch-
Karte) ist eine spätere Bau-Sitzung — nicht hier.

Heilige Tafeln (Kaskaden- und Strang-spezifisch):

- INTERFACES verbindlich — wenn du eine Schnittstelle änderst,
  ZUERST dort, DANN Modul-Karte 09 + status.json + CLAUDE.md.
  Andersrum produziert Widersprüche.

- PROTOCOL_VERSION-Disziplin: Strang 1 ist additiv (Sage kommt
  zusätzlich in die Endknoten-Liste, kein bestehendes Feld wird
  zur Pflicht erhoben). Erwartung: bleibt `"0.1"`. Falls du beim
  Editieren entdeckst, dass die Endknoten-Liste implizit eine
  bisher optionale Spore-Eigenschaft zur Pflicht erhebt, halte an
  und schreib die offene Frage in PULS § Vision-Anker 1 — nicht
  selbstständig auf 0.2 bumpen.

- Plattform-Ehrlichkeit (Vorgriff auf Brief 02): Sage liegt auf
  GitHub Pages — statisch, kein Hintergrund-Empfang, nur „Tab offen"-
  Modus. Halte das beim domain-Feld und beim pingStatus ehrlich
  fest, ohne der Plattform-Matrix vorzugreifen.

- Privatheit: Sage ist heute privat (siehe PULS § Anker 9 § Sorge
  ums Freigeben). Diese Spec lässt die Lizenz-Frage unberührt.

Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5): Es
gibt noch keine vorausgegangenen Strang-Sitzungen — Brief 01 ist
der erste. Du prüfst nur, dass INTERFACES.md, Karte 09 und CLAUDE.md
beim Stand sind, den PR #91 (Brief-Rekonstruktion) und die Meta-
Pflege 2026-05-18 hinterlassen haben. Wenn der `main`-Stand
abweicht (z.B. weil parallel PR #89 Membran-Karte 15 gemerged
wurde), lies die abweichende Stelle, bevor du den Strang einbaust.

Deine Aufgabe heute — STRANG 1, fünf Punkte a–e:

a) docs/INTERFACES.md § Endknoten-Liste: Sage als dritten Endknoten
   neben Mein-Rezeptbuch und Mein-Mixarium aufnehmen. Felder:
   - id, domain, domainDescription, domainKeywords, domainVector
   - Sage-Domäne entscheiden und begründen. Vorschläge aus Anker 1:
     „Mycel-Bibliothek" / „SBKIM-Glossar" / „Sage-Observatorium".
     Wähle eine, begründe die Wahl in einem Satz.
   - Stamm/Gast-Kategorien für Sage: Stamm = Protokoll-Doku /
     Mycel-Vokabular; Gast = Glossar-Wartung / Schwesternetz-
     Beobachtungen. (Vorgaben aus Anker 1, Disjunktheit als
     Hosting-Pflicht beibehalten — siehe Karte 02 § Stamm/Gast.)
   - Sage-Page-Architektur dokumentieren (in INTERFACES § Sage-
     Endknoten, NICHT in der Sage-Page selbst — die Sage-Page wird
     in einer späteren Bau-Sitzung angepasst):
     · IndexedDB-Suffix sbkim_sage (analog sbkim_rezeptbuch /
       sbkim_mixarium aus Pflege Karten 01+09 PWA-Suffix)
     · App-SW: Variante 3a (Standalone sbkim-sw.js im Sage-Page-
       Root, weil aktuell kein App-SW existiert)
     · Volle init()-Kette aller SBKIM-Module beim ersten Andocken;
       Modul 03 Embedding (~30 MB) lädt lazy + UX-Vorwarnung
     · Andock-Geste an der Schwarz-Loch-Karte: Klick öffnet
       künftig einen Andock-Wizard für Sages eigene Spore-
       Erzeugung. (Spec-Hinweis, kein Bau-Detail — verweist auf
       Folge-Bau-Sitzung Sage-Page-Refactor.)

b) data/status.json § endknoten: sage-Eintrag mit eigener Domäne
   (gleicher Wert wie in INTERFACES § Endknoten-Liste), nodeId-Slot
   (leer / null bis zum ersten Andocken; Pflege-Konvention der zwei
   Bestands-Endknoten beibehalten), pingStatus mit ehrlichem
   Initialwert (Vorschlag: `"pending-first-andock"` oder analog zur
   Mixarium/Rezeptbuch-Konvention — am bestehenden Schema halten,
   nicht eigenes Vokabular erfinden). KEIN Score-Schub für Module
   02/04/05 wegen dieses Eintrags — Spec-Reife hebt den Score
   nicht; Bau-Sitzungen heben.

c) CLAUDE.md umschreiben (§ „Was dieses Repo ist"):
   - Satz „Es ist kein Endknoten." entfernen.
   - Sage als „Hub und Knoten zugleich" einführen — Spec-Hub für
     SBKIM-Verträge plus eigener Endknoten mit Sage-Domäne.
   - Die drei Endknoten (Rezeptbuch / Mixarium / Sage) gleichwertig
     listen.
   - Konventionen § Knotentyp („hybrid") bleibt — wird mit dieser
     Spec wahr und braucht keine Änderung.
   Eine knappe Pflege; nicht den ganzen Disziplin-Block neu
   schreiben. CLAUDE.md ist die Sitzungs-Tafel, jede Zeile zählt.

d) docs/components/09_einbau_pwa.md § Schritt 1 erweitern: ein
   ergänzender Satz „Sage-Observatorium selbst ist auch ein
   Endknoten — wer sich am Sage-Mycel andockt, bekommt es als
   Geschwister." plus Hinweis, dass Sages eigene init()-Kette und
   Andock-Geste in einer Folge-Bau-Sitzung gebaut werden (Verweis
   auf BRIEF_99_SAMMELSPEC_ABSCHLUSS-Liste, sobald die Kaskade
   schließt). Karten-Schichten Bauzustand / Manueller Test bleiben
   unangetastet — nur § Schritt 1.

e) PULS-Pflege + Übergabe (siehe „Pflicht am Ende"). Vision-Anker 1
   § Status nachziehen: „Reif für Spec-Sitzung" → „Strang 1 der
   V1-Sammelspec realisiert in PR #<nummer>; restliche Stränge
   laufen in Brief 02–04, Bau-Sitzungen folgen über
   BRIEF_99_SAMMELSPEC_ABSCHLUSS."

Was du NICHT tust:

- Kein Modul-Code in src/. Spec geht der Implementierung voraus.
- Keine Sage-Page-Änderung (index.html). Die volle init()-Kette,
  die Andock-Geste an der Schwarz-Loch-Karte und der Andock-Wizard
  sind eine eigene Bau-Sitzung nach Kaskaden-Abschluss.
- Keine Plattform-Matrix-Erweiterung in INTERFACES — das ist Brief
  02. Lass den Block leer / nicht vorhanden, oder setze einen
  Verweis-Stub „Plattform-Matrix folgt in Brief 02", nicht den
  Block selbst.
- Keine M04-Erweiterung (Spore-Schema, Match-API, Brücken-Feld) —
  das ist Brief 03. Karte 04 und Karte 02 bleiben unangetastet.
- Keine Multi-Identität-Spec (sbkim_keys-Multi-Slots, active-
  identity-Marker) — das ist Brief 04.
- Kein domainVector-Wert eintragen, falls noch nicht berechnet —
  Slot anlegen, Wert kann in der Bau-Sitzung Sage-Page-Refactor
  von Sages eigenem Embedding-Modul gesetzt werden. Konvention:
  null / leer ist OK, Sage-Page-Bau füllt nach.
- KEINE Sage-Page-Karte-Erweiterung um eine „dritter Endknoten"-
  Visualisierung — Sage-Page-Karten gehören zu Bau-Sitzungen, nicht
  zu Spec-Sitzungen.
- Kein update_puls_pie.py-Aufruf, weil kein status.json-Score-
  Wechsel. Wenn du beim status.json-Editieren feststellst, dass das
  Schema einen neuen Pflicht-Pflege-Aufruf nötig macht (z.B. weil
  pool um endknoten erweitert wird), HALT AN und schreib die
  offene Frage in PULS § Vision-Anker 1.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am
   Sitzungsende:
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „2026-05-XX ·
     Spec — V1 Sage-Hybrid (Brief 01 der V1-Sammelspec-Kaskade)"
     mit den fünf Punkten a–e, Verweis auf den Meta-Pflege-Eintrag
     mit der Kaskaden-Konvention und auf den hier entstehenden
     Brief 02.
   - Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern
     (Konvention). PULS-Zeilen-Status prüfen — wenn nahe 3000,
     mehrere Einträge auslagern; nicht kürzen.
   - Vision-Anker 1 § Status auf realisiert-für-Strang-1 ziehen
     (Wortlaut siehe Punkt e oben).
   - Übergabeprotokoll in
     docs/sessions/archiv/2026-05-XX_spec-v1-sage-hybrid.md
     (Format BRIEFING_TEMPLATE.md). Die vier Strang-2/3/4-Aufgaben
     im § „Nächster sinnvoller Schritt" als „nicht in dieser
     Sitzung" markieren.
   - Commit + Push auf claude/spec-v1-sage-hybrid.
   - Draft-PR „Spec: V1 Sage-Hybrid — Strang 1 der V1-Sammelspec-
     Kaskade".

2. Schreibe als letzte Datei-Aktion docs/sessions/BRIEF_02_plattform_matrix.md
   für die nächste Folge-Sitzung. Inhalt: Strang 4 aus
   BRIEF_SPEC_V1_SAMMELSPEC herausgeschnitten + dieselbe Bauplan-
   Struktur wie dieser Brief 01. Pflichtleseliste aktualisieren
   (eigener PR + INTERFACES-Stand nach Brief 01 + Karte 09 nach
   Brief 01 + dieser Brief 01 als Vorgänger-Beleg + sechs PULS-
   Anker-Querverweise: V1 / V4 Königin-Hintergrund / V7 Extension /
   V8 Mini-Browser plus die Plattform-Matrix-Spezifika aus
   BRIEF_SPEC_V1_SAMMELSPEC). Kaskaden-Konvention 5 (Vorgänger-
   Konsistenz-Prüfung) explizit erwähnen: Brief-02-Sitzung muss
   den V1-Endknoten-Eintrag aus Brief 01 in der Plattform-Matrix-
   Zeile spiegeln und Stand prüfen, dass keine Korrekturen am
   Brief-01-Eintrag nötig sind. Brief 02 erbt die PROTOCOL_VERSION-
   Disziplin (bleibt 0.1, additiv).

3. **Kaskaden-Konvention 6 (Brief-Auslieferungs-Regel — Pflicht in
   jeder Folge-Sitzung):** Gib BRIEF_02_plattform_matrix.md zusätzlich
   zur Datei-Anlage am Sitzungs-Ende AUCH als kopierbaren
   Codeblock direkt in der Chat-Antwort aus. Klaus startet die
   Folge-Sitzung per Copy-Paste aus dem Chat-Tab; eine reine Datei-
   Ablage zwingt ihn zum Datei-Öffnen-Umweg. Der Codeblock im Chat
   ist identisch zum Datei-Inhalt (kein Auszug, keine
   Zusammenfassung — der vollständige erster-Prompt-taugliche Brief).
   Diese Regel propagiert: dein BRIEF_02 muss seinerseits dieselbe
   Pflicht für die Brief-03-Sitzung formulieren, und so weiter bis
   BRIEF_99_SAMMELSPEC_ABSCHLUSS.

4. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): verweise als ersten
   Schritt auf BRIEF_02 als Auslöser der nächsten Sitzung — mit
   Hinweis „Brief 02 steht weiter unten in dieser Chat-Antwort als
   Codeblock". Zweiter Schritt als alternative Auslöser-Option
   (z.B. PR mergen + Sage-Page-Refactor schon vorab planen — nur
   falls Klaus die Kaskade pausieren will). Reihenfolge-Hinweis:
   Brief 02 setzt diesen PR #<nummer> als gemerged voraus.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Vision-Anker 1 ans
  Ende oder in den hier entstehenden Sitzungs-Eintrag „Was offen
  blieb". Klaus klärt in der nächsten Sitzung. Eine andere Sitzung
  mit frischem Kontext löst es schneller, als wenn du dich
  festbeißt.

Zeitschätzung: 2–4 Stunden für Strang 1 allein (deutlich knapper
als die Etappe-1-Schätzung im Großbrief, weil Plattform-Matrix
hier explizit ausgeklammert ist und in Brief 02 läuft).
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Kaskaden-Konvention 1 (ein Strang = ein PR) ist heilig.** Wenn
  die Brief-01-Sitzung mid-Sitzung versucht, Plattform-Matrix oder
  Sage-Page-Refactor in derselben PR mitzunehmen, abbrechen und in
  PULS dokumentieren. Mehrere Stränge in einem PR brechen den
  Reviewer-Rhythmus, den Klaus mit dieser Kaskade gerade einführt.

- **Kaskaden-Konvention 2 (Brief als Datei, nicht im Chat).** Die
  Brief-01-Sitzung MUSS BRIEF_02_plattform_matrix.md als letzte
  Datei-Aktion anlegen — der Auftrag der nächsten Sitzung darf
  nicht nur im Chat-Tab leben. Klaus' Lehre aus PR #91 (M04-
  Brainstorming-Brief im Chat-Tab verloren) ist hier der konkrete
  Anlass.

- **BRIEF_SPEC_M04_ERWEITERUNG bleibt als Vorlage.** Falls die
  Brief-01-Sitzung Hand-Anlegen am M04-Strang erwägt (z.B. weil
  ein Punkt aus Strang 1 die Spore-Schicht implizit berührt),
  STOP: M04 ist Brief 03 in der Kaskade. Der engere Bruder-Brief
  liegt nur noch als Stil-/Detail-Vorlage; als alleinstehende
  Sitzung wird er nicht mehr gezogen.

- **Paralleler PR #89 (Karte 15 Membran).** Wenn beim Brief-01-
  Sitzungs-Start PR #89 noch offen ist, INTERFACES.md vor dem
  Editieren auf den `main`-Stand prüfen. Karte 15 Membran berührt
  INTERFACES § Modul-15-Block (nach Modul 09) und sollte mit
  Strang 1 nicht kollidieren — sofern Brief 01 nicht versehentlich
  Karte 09-Schritt-1 dort hineinschreibt.

- **Sage-Page-Refactor ist NACH der Kaskade.** Erst wenn Brief 99
  (Sammelspec-Abschluss) steht und die Bau-Brief-Liste die Sage-
  Page-Refactor-Bau-Sitzung benennt, beginnt dort der eigentliche
  index.html-Eingriff. Bis dahin ist die Sage-Page als „kennt sich
  selbst als dritten Endknoten" nur spezifiziert, nicht gebaut.
