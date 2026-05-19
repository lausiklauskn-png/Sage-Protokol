# Übergabeprotokoll — Meta-Pflege Tafel-Evolutions-Klausel + Modul-01-init-Folge-Pipeline

**Datum:** 2026-05-19
**Sitzungs-Rolle:** Meta-Pflege (keine Spec, kein Bau, kein Code).
**Branch:** `claude/pflege-tafel-evolution-und-modul-01-pipeline`.
Direkte Folge auf den Merge von PR #104 (Bau 02.Y, `main` `63e8fd1`,
gemerged 2026-05-19).

**Auslöser:** Klaus' Anweisung 2026-05-19 nach dem Bau-02.Y-Merge:

> „hebe wenn Logisch bestimmte Regeln oder Aussagen aus der heilige
> Tafel auf, wenn sie im Wiederspruch zu notwendigen änderungen
> stehen. Wenn in der Vergangenheit gesagt wurde Fasse 1 nicht an
> aber bei neueren Arbeiten könnten bestimmte Projekte oder
> Projektteile nicht umgesetzt werden Weise mich darauf hin das die
> Anpassung der Heiligen Tafel Notwendig und Vorteilhaft wäre."

---

## Kern (drei Sätze)

Klaus' Bau-02.Y-Sichttest 2026-05-19 hat einen echten Architektur-Bug
in Modul 01 freigelegt (`init()` ist nicht versions-fail-soft), den
die Bau-Sitzung selbst nicht beheben durfte (Tafel „KEIN
Modul-01-Eingriff" aus Brief 02.Y „Was du nicht tust"). Die Tafel war
**scope-disziplin** für genau diese Bau-Sitzung, kein absolutes Verbot
— eine **eigene Pflege-Sitzung Modul 01** ist die saubere Anpassung,
und Klaus hat die Konvention auf eine generelle Regel gehoben: heilige
Tafeln sind verbindlich aber nicht ewig, bei Konflikt zwischen alter
Tafel und neuer notwendiger Arbeit muss ich Klaus EXPLIZIT auf
Anpassungs-Bedarf hinweisen. Diese Meta-Pflege verankert die
Konvention in CLAUDE.md, dokumentiert den Folge-Befund in
INTERFACES.md § 9.5 und vermerkt die nächste Folge-Pflege im PULS.

---

## Drei Punkte

### 1) CLAUDE.md § Heilige Tafeln — neue Sub-Sektion „Tafel-Evolutions-Klausel"

Eingefügt zwischen dem bestehenden „INTERFACES.md ist verbindlich"-
Absatz und „## Pflicht am Sitzungsende".

Inhalt:

- **Kernsatz:** „Heilige Tafeln sind verbindlich, **aber nicht ewig**.
  Eine Tafel gilt, bis eine neuere Erkenntnis sie widerlegt — z.B.
  ein Sichttest-Befund, ein Live-Andock-Beweis, ein Architektur-
  Schluss aus einer Folge-Spec, oder einfach Klaus' Lehre aus dem
  praktischen Einsatz."
- **Disziplin für jede Sitzung** (drei Regeln):
  - Nicht stoisch befolgen — Tafel als absolute Aussage zu lesen, wo
    sie scope-spezifisch gemeint war, blockiert legitime Arbeit.
  - Nicht stillschweigend umgehen — Workaround ohne Spannung-Benennen
    hinterlässt vergiftete Doku-Lage.
  - Stattdessen: Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen.
    Konkret benennen: welche Tafel, welche neue Erkenntnis, welche
    Anpassung vorgeschlagen, warum notwendig + vorteilhaft. Klaus
    entscheidet.
- **Bezeichnungs-Konvention:** „Diese-Sitzung-nicht"-Tafeln (z.B.
  „KEIN Modul-01-Eingriff in Bau 02.Y") sind scope-disziplin, **kein**
  absolutes Verbot — sie erlauben eine eigene Folge-Pflege-Sitzung
  mit eigenem Brief, eigenem PR.
- **Bezugs-Beispiel:** der Befund 2026-05-19 aus Klaus' Bau-02.Y-
  Sichttest (Modul 01 `init()` ist nicht versions-fail-soft); die
  Tafel „KEIN Modul-01-Eingriff" war scope-bezogen für genau diese
  Bau-Sitzung; eine eigene Pflege-Sitzung Modul 01 ist die saubere
  Anpassung und wird als Folge-Sitzung in der Brief-99-Pipeline
  nachgezogen.

### 2) INTERFACES.md § 9.5 — Folge-Befund 2026-05-19

Erweitert den bestehenden „Stand 2026-05-19" (Bau 01.Y-Stand-Hinweis)
um einen neuen Absatz „Folge-Befund 2026-05-19 (Klaus' Bau-02.Y-
Sichttest, DeX-Chrome auf Galaxy Tab S6)":

- **Befund:** Modul 01 `init()` ruft hartkodiert
  `indexedDB.open(name, DB_VERSION)` mit der Build-Konstante; nach
  `ensureStore`-Bumps aus früheren Sitzungen ist die DB-Version >
  `DB_VERSION`, und der nächste init scheitert mit `VersionError`.
  Klaus muss bei jedem Sichttest Browserdaten löschen oder den
  Cleanup-Workaround „Panel 01 ‚Storage init' klicken" fahren.
- **Lösungs-Skizze (für die Folge-Pflege):** `init()` öffnet die DB
  erst ohne Version-Param (liefert existing Version), prüft Pflicht-
  Stores aus `STORES_V1/V2/V3` sync, bumpt nur bei fehlenden Stores
  mit `existing.version + 1`-Inkrement. Strikt additiv, kein DB-
  Schema-Eingriff, kein Vertrags-Drift jenseits einer Garantien-
  Block-Erweiterung.
- **Tafel-Evolutions-Notiz** im Sinne der neuen CLAUDE.md-Klausel:
  die Brief-02.Y-Tafel „KEIN Modul-01-Eingriff" war scope-disziplin,
  erlaubt eigene Pflege-Sitzung mit eigenem Brief und eigenem PR.

§ 10 Änderungsprotokoll um eine neue Zeile „2026-05-19 · Pflege Tafel-
Evolutions-Klausel + Modul-01-init-Folge-Pipeline" erweitert.

### 3) PULS.md

- **§ Vision-Anker 6 § Status** um neuen Absatz „Folge-Pflege Modul 01
  `init()` versions-fail-soft als nächste Pipeline-Etappe vorgemerkt"
  erweitert (direkt nach dem Bau-02.Y-Abschluss-Absatz).
- **§ Sitzungs-Einträge** neuer Top-Eintrag „2026-05-19 · Meta-Pflege
  Tafel-Evolutions-Klausel + Modul-01-init-Folge-Pipeline" mit allen
  drei Punkten, Heilige-Tafeln-Eingehalten-Block, Was-NICHT-
  angefasst-Block, Nächster-sinnvoller-Schritt-Block.

---

## Heilige Tafeln eingehalten

- **Reihenfolge INTERFACES → Karte → Code.** Hier kein Code, kein
  Karten-Eingriff — reine Meta-Pflege auf CLAUDE.md + INTERFACES.md +
  PULS.md.
- **CLAUDE.md selbst ist eine Tafel.** Die Erweiterung um die Tafel-
  Evolutions-Klausel ist eine bewusste, von Klaus angeordnete
  Anpassung der Meta-Tafel — kein Schlauch-Spruch, sondern verankert
  durch Klaus' direkte Anweisung 2026-05-19.
- **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `4`,
  `BACKUP_FORMAT_VERSION` bleibt `2`.** Reine Doku-Pflege.
- **Konvention pro Sitzung:** vorletzten Sitzungs-Eintrag ins
  Archiv-Index auslagern — hier NICHT nötig, weil der Bau-02.Y-
  Eintrag direkt darunter steht und für die nächste Sitzung als
  unmittelbarer Kontext sinnvoll bleibt. (Optional in einer
  Folge-Pflege-Sitzung auslagern.)

---

## Was NICHT angefasst

- **Modul-Code in `src/`.** Die eigentliche Modul-01-Pflege
  `init()` versions-fail-soft ist eine eigene Folge-Sitzung mit
  eigenem Brief + eigenem PR.
- **Modul-Karten 00–15.** Karte 01 bleibt unverändert — der Befund
  geht über INTERFACES § 9.5 + PULS § Vision-Anker 6, nicht über die
  Karte (die Karte würde in der Folge-Bau-Sitzung Modul 01 nachgezogen).
- **Sage-Page (`index.html`).**
- **`status.json` + `update_puls_pie.py`.** Kein Score-Wechsel — Modul
  01 bleibt `score:"fertig"`, die Pflege ist additive Klauen-Freundlichkeit,
  kein neuer Pflicht-Pfad.
- **Brief 99 / Brief 04 / Brief 02.Y / Brief 01.Y inhaltlich
  unverändert.** Die Briefe sind historische Dokumente; die Tafel-
  Evolution lebt in CLAUDE.md + INTERFACES, nicht in den Briefen
  selbst.

---

## Nächster sinnvoller Schritt

**Brief BAU_PFLEGE_01_INIT_FAIL_SOFT** schreiben (Meta-Pflege, ~30–45
min). Brief für die nächste Sitzung, die `init()` versions-fail-soft
macht (additiv, kein DB-Schema-Eingriff, kein Vertrags-Drift auf § 1
Modul 01 jenseits einer Garantien-Block-Erweiterung). Bauauftrag dann
separat triggern.

**Parallel möglich (unabhängig):** Brief BAU_04A schreiben für
`matchDimensions` synchron (Brief 03 M04-Erweiterung). Zwei Folge-
Pflege-Briefe in einer Meta-Pflege-Sitzung möglich, beide klein.

---

## PR

Branch: `claude/pflege-tafel-evolution-und-modul-01-pipeline`.
Draft-PR „Pflege Tafel-Evolutions-Klausel + Modul-01-init-Folge-
Pipeline" mit Verweis auf den Brief-02.Y-Sichttest-Befund als
Auslöser.
