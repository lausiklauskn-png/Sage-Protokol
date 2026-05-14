# Übergabeprotokoll · 2026-05-14 · Spec-Sitzung Modul 01 Storage + Modul 03 Embedding

**Sitzungs-Rolle:** Spec-Sitzung (beide Module in einer Sitzung — Klaus
hat ausdrücklich so beauftragt, weil die Plan-Vorarbeit bereits beide
APIs festgezurrt hatte und der Querschnitt minimal ist)
**Branch:** `claude/semantic-agent-network-Y03Vg`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B
**Vorgänger-Sitzung:** `docs/sessions/archiv/2026-05-14_plan-spec-01-storage-und-03-embedding.md`

---

## Auftrag

Aus der Plan-Sitzung vom selben Tag standen vier Plan-Entscheidungen
fest, die diese Spec-Sitzung umzusetzen hatte:

1. **Modul 03 API:** vier Funktionen `embedQuery` / `embedPassage` /
   `embedQueryBatch` / `embedPassageBatch` statt eines `mode`-Parameters.
2. **Folgekontrakt Modul 04:** `match(queryVec, passageVec)` modus-frei
   (gehört in spätere Spec-Sitzung 04, hier nur als Garantie an Modul 04
   in den Karten erwähnt).
3. **Selbstcheck via `console.info`** beim Laden (Storage) bzw. nach
   `init()`-Erfolg (Embedding), einheitliches Format
   `MODUL XX <NAME> bereit, Funktionen: ...`.
4. **Neues Liefer-Artefakt `docs/WEGWEISER.md`** — Einstiegs-Anleitung
   mit nummerierten Checkbox-Schritten 1–9 plus Stand-Block am Ende.

Klaus hat beim Sitzungsstart zwei Ergänzungen aufgenommen:

- **Branch-Sync zuerst:** `git fetch origin && git merge origin/main`
  (PR #7 und #8 waren in `main`).
- **Pie-Block in PULS.md nicht von Hand:** stattdessen
  `python3 scripts/update_puls_pie.py` nach jeder `status.json`-Änderung.
  Steht inzwischen auch in CLAUDE.md.

---

## Was getan wurde

### 1. Branch-Sync

`git fetch origin && git merge origin/main` lief als Fast-Forward
(2a94199..e1c2f40). Aus `main` kamen: `scripts/update_puls_pie.py`,
Hinweis-Kommentar oben im Pie-Block der PULS.md, plus CLAUDE.md-Eintrag
über die Pie-Pflicht.

### 2. Komponenten-Karte 01 (Storage) gefüllt

`docs/components/01_storage.md` von leerer Schablone auf vollständige
Spec gebracht. Status-Badge im Hero auf 🟨 Spec fertig.

- **API:** sieben öffentliche Funktionen
  (`init` / `getStore` / `get` / `put` / `del` / `all` / `clear`), alle
  Promise-basiert außer `getStore` (synchrone Handle-Rückgabe).
- **Stores-Tabelle:** verbindliche Liste der sechs Stores
  (`sbkim_keys`, `sbkim_spore`, `sbkim_siblings`, `sbkim_anastomosis_log`,
  `sbkim_legacy_inbox`, `sbkim_doku_meta`) mit Schlüsseltyp + Wert-Form +
  Schreiber/Leser.
- **Plan-offene Frage „Suchhistorie / Embedding-Cache" entschieden:**
  bewusst **kein** zusätzlicher Store. Suchhistorie ist personenbezogen
  (CLAUDE.md-Verbot); Embedding-Cache wird von `transformers.js` selbst
  im Browser-Cache gehalten. Falls Performance-Messung später einen
  Vektor-Cache braucht, kann das eine spätere Spec-Sitzung additiv
  ergänzen (DB-Version hochziehen).
- **Versionsmigration:** additiv, `DB_VERSION` hochziehen pro Spec-
  Änderung. Niemals `deleteObjectStore` ohne expliziten Spec-Vermerk
  mit Datenverlust-Pfad.
- **Fehlertabelle:** fünf benannte Error-Typen
  (`StorageUnavailableError`, `UnknownStoreError`, `QuotaExceededError`,
  `DataCloneError`, `StorageOpenError`). Alle mit deutschsprachiger
  `message`.
- **Selbstcheck-Format:** beim **Skript-Laden** (synchron),
  `console.info("MODUL 01 STORAGE bereit, Funktionen: ...")`.
- **Manueller Test:** drei Stub-Knöpfe (`init` / `roundtrip` /
  `selfcheck`) — Bewertung kommt in die Bauzustand-Tabelle.

### 3. Komponenten-Karte 03 (Embedding) gefüllt

`docs/components/03_embedding.md` ebenfalls auf vollständige Spec, Status
auf 🟨 Spec fertig.

- **API:** sechs öffentliche Funktionen, davon vier Embed-Funktionen
  ohne `mode`-Parameter. Begründung für das Design im Karten-Abschnitt
  „Warum vier Funktionen statt eines `mode`-Parameters" ausführlich.
- **e5-Rollen-Prefix** wird intern angewandt
  (`"query: "` / `"passage: "`). Aufrufer geben nur den Rohtext.
- **L2-Norm-Garantie** gegen Modul 04: alle Vektoren normalisiert,
  Cosinus reduziert sich auf Skalarprodukt. Steht auch in INTERFACES.md
  als „Garantien für Modul 04" festgeschrieben.
- **Truncate-Strategie:** still abschneiden auf 512 Tokens
  (e5-small-Limit), beim ersten Truncate pro Sitzung `console.warn`,
  danach Schweige-Modus. Begründung: Suche darf nicht an einer langen
  Eingabe scheitern, aber der Bauende soll einmal sehen, dass es passiert.
- **Selbstcheck-Format:** **nach `init()`**, einmalig (nicht beim
  Skript-Laden, weil der Modell-Download asynchron ist und sonst
  „bereit" verfälschen würde).
- **Manueller Test:** vier Stub-Knöpfe (`init` / `roundtrip` /
  `query-vs-passage` / `selfcheck`). Der Sinn-Vergleich
  „Käsekuchen vs. Auspuffrohr" bleibt explizit aus dieser Spec heraus
  — gehört in den manuellen Test von Modul 04, weil er eine Cosinus-
  Funktion braucht.

### 4. INTERFACES.md — erste Vertrag-Sektionen

Beide Modul-Sektionen (01, 03) von der Platzhalter-Form auf
vollständige Vertrag-Sektionen umgestellt:

- **Status:** auf `spec`.
- **Bietet (öffentlich):** vollständige Signaturen.
- **Storage:** für 01 die ganze Stores-Tabelle, für 03 explizit
  „kein SBKIM-Store".
- **Events:** beide „keine" — keine Pub/Sub-Schicht.
- **Selbstcheck:** mit dem genauen `console.info`-String.
- **Fehlerverhalten:** mit allen benannten Error-Typen.
- **Garantien für Modul 04** (nur 03): Vektoren sind Float32Array(384),
  L2-normalisiert.
- **Geprüft:** 2026-05-14.

Änderungsprotokoll (§6) um eine Zeile für diese Sitzung erweitert.

### 5. status.json

- `lastUpdated`: 2026-05-10 → 2026-05-14.
- Modul 01: `score` von `schablone` auf `spec`, `siegel` auf
  „Spec fertig".
- Modul 03: dasselbe.

Direkt danach `python3 scripts/update_puls_pie.py` aufgerufen.
Pie regeneriert: Schablone 10 / Werkstatt 1 / Spec 2 / Stub 0 / Fertig 0.

### 6. `docs/WEGWEISER.md` neu angelegt

Aus Plan-Brief Punkt 8:

- **Worum geht es überhaupt?** — Kurzer Einstieg in einfacher Sprache
  (was SBKIM ist, was Sage-Protokol ist, Mycel-Bild).
- **Neun Schritte** als Markdown-Checkbox-Liste (`- [ ]`): von „diese
  Datei lesen" über Pflichtleseliste, Rolle klären, Komponenten-Karte
  lesen, Arbeit machen, bis zur Sitzungs-End-Pflicht.
- **Mini-Glossar in einfacher Sprache** — bewusst nicht das volle
  `GLOSSAR.md`, sondern eine reduzierte Variante für Einsteiger
  (Sitzung, Modul, Komponenten-Karte, Spec, Code, Embedding,
  Selbstcheck, Endknoten, Mycel, Andocken, PULS, Bau-DAG, status.json).
- **Stand-Block** mit einer Beispielzeile (von dieser Sitzung).
  Neueste Zeile **unten** — anders als PULS.md, wo der neueste
  Eintrag oben steht. Im WEGWEISER ist der Stand eine Wanderung
  (Linie), kein Stapel.

### 7. `tests/manual_check.html`

- Panel 01 und Panel 03 von `idle`-Status auf `warn`-Status
  („Spec fertig, Code ausstehend").
- Stub-Knöpfe ergänzt:
  - 01: `init` · `roundtrip` · `selfcheck`
  - 03: `init` · `roundtrip` · `query-vs-passage` · `selfcheck`
- **Stub-Handler-Skript** unten ergänzt: alle `button[data-stub]`-
  Elemente bekommen einen generischen Click-Handler, der ins Log
  schreibt:
  - bei `action === "selfcheck"`: Anleitung mit dem exakten
    `console.info`-Such-String, nach dem in DevTools zu suchen ist.
  - sonst: Hinweis „Modul spezifiziert, aber noch nicht implementiert
    — Bau-Sitzung ersetzt diesen Handler".
- Kommentar-Block unten aktualisiert: „Spec-Stub-Knöpfe können entfernt
  werden, sobald die echten Knöpfe registriert sind."

### 8. PULS.md

- **Pie-Block** automatisch regeneriert (siehe Punkt 5).
- **„Als nächstes ✨"** umgebaut: 01 und 03 wandern von „Schablone, zum
  Anpacken" zu „Spec fertig, bereit für die Bau-Sitzung". 00 und 09
  bleiben als ✨-Module für Spec-Sitzungen. Empfehlung der Hauptsitzung:
  zwei parallele **Bau**-Sitzungen 01 + 03 plus Spec-Sitzung 09.
- **Schnellüberblicks-Tabelle** für 01 und 03 auf „Spec fertig
  (2026-05-14)" gesetzt.
- **Neuer Sitzungs-Eintrag** oben mit Getan / Offen / Nächster Schritt.

---

## Was offen blieb

- **Bau-Sitzung Modul 01** und **Bau-Sitzung Modul 03** stehen aus.
  Können parallel laufen — die Module sind unabhängig, jede Bau-Sitzung
  kennt nur ihre Karte.
- **Spec-Sitzung Modul 09 (Einbau-PWA)** weiterhin als dependenz-freie
  parallele Sitzung empfohlen.
- **A1–B3-Synthese:** unverändert offen als Querschnitts-Frage,
  Auflösung in Spec-Sitzung Modul 04.
- **Voll-Glossar (`docs/GLOSSAR.md`)** noch unvollständig (Atemkreis,
  Werkstatt, Hop-TTL, Override). Reine Doku-Aufgabe, eigene Sitzung.
- **`favicon.ico`-Fallback** (aus Site-Echo-Sitzung) unverändert offen.

---

## Nächster sinnvoller Schritt

1. **Frische Bau-Sitzung Modul 01** starten. Briefing aus
   `docs/sessions/BRIEFING_TEMPLATE.md` §C. Sitzung kennt:
   `CLAUDE.md` · `docs/PULS.md` (Schnellüberblick) ·
   `docs/INTERFACES.md` · `docs/components/01_storage.md`. Implementiert
   `src/modules/01_storage.js` exakt nach Spec, ersetzt die Stub-Knöpfe
   in `tests/manual_check.html` durch echte Aufrufe, manueller Sichttest.
2. **Parallel: Bau-Sitzung Modul 03** mit denselben Pflicht-Lesungen
   plus `docs/components/03_embedding.md`. Beachte den Lazy-Init und
   den Selbstcheck-Zeitpunkt (nach `init`, nicht beim Skript-Laden).
3. **Optional parallel: Spec-Sitzung Modul 09 Einbau-PWA.**

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/PULS.md` aktualisiert (Sitzungs-Eintrag oben, Pie via Skript,
       „Als nächstes"-Liste umgebaut, Tabelle 01+03 auf „Spec fertig")
- [x] Übergabeprotokoll (diese Datei) unter
       `docs/sessions/archiv/2026-05-14_spec-01-storage-und-03-embedding.md`
- [x] `status.json` geändert → `python3 scripts/update_puls_pie.py`
       ausgeführt, Pie regeneriert
- [x] `tests/manual_check.html` geändert → Datei lädt im Browser
       (Stub-Handler ist reines Vanilla-JS, keine Module-Imports;
       wird beim ersten echten Modul-Code von der Bau-Sitzung neu
       verifiziert)
- [x] WEGWEISER.md angelegt mit Stand-Eintrag dieser Sitzung
- [ ] Commit + Push auf `claude/semantic-agent-network-Y03Vg` (folgt)
- [ ] Draft-PR prüfen / anlegen (folgt)
