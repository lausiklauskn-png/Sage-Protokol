# Übergabeprotokoll · 2026-05-28 · Pflege Modul 18 Sub (a) Match-Schritt — Embedding-Pflicht-Aufruf

**Branch:** `claude/pflege-modul-18-match-embed-6XM5l`
**Sitzungs-Rolle:** Pflege-Sitzung. Wurzel-Fix Modul 18 Sub (a)
Vorab Match-Schritt — Embedding-Pflicht-Aufruf vor `matchDimensions`
+ Lade-Hinweis für 30-MB-Modell.
**Auslöser:** Klaus' Live-Sichttest 2026-05-28 nach PR #198 (Andock-
Wizard öffnet jetzt sauber). In Schritt 3 (Match-Check) warf Modul 18:
„Match-Berechnung warf: Parameter 'queryVec' muss Float32Array sein,
war: String." Reproduzierbar in Sage-Page UND Mein-Rezeptbuch
(1:1-Sync) → Wurzel im Sage-Quellcode.

---

## Wurzel-Diagnose (Bug-Kette)

1. `computeAndRenderMatch` in `src/modules/18_tool_pwa.js`
   (Z. ~951–963) baut vier Textblobs über `textBlob(keywords,
   categories)` → diese liefern **Strings** (`parts.join(" · ")`)
   oder `null`.
2. Der Aufruf (Z. ~966–967 alt) reichte diese Strings direkt an
   `matchMod.matchDimensions(ownCap, ownNeeds, foreignCap,
   foreignNeeds)`.
3. `matchDimensions` → `assertVector` (`src/modules/04_match.js`
   Z. 145) prüft `vec instanceof Float32Array` → wirft synchron
   `InvalidVectorError` mit genau Klaus' Fehlertext.
4. **Kern des Bugs:** Modul 18 hat das Embedding (Modul 03) zwar
   lazy initialisiert (`embMod.init()` im Lazy-Load-Pfad Z. ~917),
   aber die vier Textblobs **nie zu Vektoren gemacht** — der
   `embedQueryBatch`-Aufruf fehlte komplett. Init lädt nur das
   Modell, produziert aber keine Vektoren.

Klaus' Intuition „30 MB lädt nicht durch, Timeout zu kurz" war zur
Hälfte richtig: die Embedding-Lade-Zeit IST das eigentliche UX-
Hindernis, sobald der Aufruf repariert ist. Aber aktuell wurde das
Embedding für den Match gar nicht zu Vektoren verarbeitet.

---

## Was getan

### Eingriff A — `src/modules/18_tool_pwa.js` `computeAndRenderMatch`

`matchDimensions`-Aufruf ersetzt durch Embedding-First-Pfad:

- **Verfügbarkeits-Check:** fehlt `SbkimEmbedding.embedQueryBatch`
  → Fehlermeldung + return.
- **Lade-Hinweis sofort:** „Embedding-Modell wird geladen (ca. 30 MB
  beim ersten Aufruf, kann auf langsamer Verbindung mehrere Minuten
  dauern). Bitte nicht abbrechen."
- **Null-Safe-Mapping:** nur nicht-null Textblobs gehen in
  `embedQueryBatch`; Vektoren danach an ihre Spalten-Position
  zurückgemappt. Alle vier null → Vorab-Fehlermeldung („keine
  Domain-Stichworte auf beiden Seiten"), ohne `matchDimensions`
  (das sonst `DimensionsAllNullError` würfe).
- **Embedding → Match:** `embedQueryBatch(nonNullTexts).then` →
  „Embedding fertig — Match wird berechnet …" →
  `matchDimensions(out[0..3])` → bestehende Score-Auswertung +
  Drei-Bars-Render (in `handleMatchResult` ausgelagert) +
  bestehender catch (`handleMatchError`).
- **KEIN künstlicher Timeout** (kein `Promise.race` mit
  `setTimeout`) — das Modell lädt so lange wie das Netz braucht,
  der Wizard hat zum Abbrechen das Schließen-X.

### Eingriff B — `docs/components/18_tool_pwa.md`

- § Sub (a) § Match-Schritt: neuer Block „Embedding-Pflicht-Aufruf
  vor `matchDimensions`" mit Ablauf (Lade-Hinweis-Text + Null-Safe-
  Mapping + Begründung Klaus' Live-Befund).
- § Bauzustand: neue Zeile „Pflege Match-embedQueryBatch-Pflicht —
  2026-05-28" am Listen-Ende (vor Sichttest-grün-Zeile) mit voller
  Bug-Wurzel + Fix-Kern + Live-Befund.

### Test — `tests/smoke_bau18_sub_a_vorab.mjs`

Probe 15 additiv verschärft: Mock `SbkimEmbedding` bekommt
`embedQueryBatch` (gibt `Float32Array(384)` pro Input zurück),
Mock `SbkimMatch.matchDimensions` prüft, dass jede nicht-null Spalte
`Float32Array` ist. Neue Assertion: `embedQueryBatch(Strings)` läuft
VOR `matchDimensions`, `matchDimensions` bekommt nur Vektoren/null.
Das ist genau der Wächter, den der alte Mock (String-Args) nicht
hatte. **17/17 grün.**

---

## Tests

- `node --check src/modules/18_tool_pwa.js` → grün.
- `node --check src/modules/04_match.js` → grün (Regression-Garantie).
- `tests/smoke_bau18_sub_a_vorab.mjs` → 17/17 grün.
- Regression: `smoke_bau15b_membran` 31/31, `smoke_bau16_sub_e_bronze`
  16/16, `smoke_bau17_floating_widget` 36/36 grün.

---

## Strikte Tabus eingehalten

- KEIN Eingriff in Modul 03 (Embedding-Surface unverändert).
- KEIN Eingriff in Modul 04 (Match-Surface unverändert — die
  Float32Array-Pflicht ist korrekt, der Bug war Modul-18-seitig).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege).
- KEIN externer Repo-Eingriff (MR + MM ziehen die neue Modul-18-
  Datei in eigener Sync-Sitzung nach Sichttest grün).
- KEIN Refactoring anderer Modul-18-Funktionen.

---

## Sichttest-Status

**Ungeprüft — wartet auf Klaus' Galaxy-Tab-S6-Browser-Lauf.**
Headless-Smoke bestätigt die Vektor-Pflicht-Kette, aber der echte
30-MB-Modell-Download + Match-Render zeigt sich erst am Tablet.

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest** (siehe Brief unten) — der erste echte Match-
   Lauf mit 30-MB-Embedding-Download. Blockiert die MR/MM-Sync.
2. **MR + MM Sync-Sitzungen** (extern, je eigener PR) — die neue
   Modul-18-Datei 1:1 in Mein-Rezeptbuch + Mein-Mixarium ziehen,
   NACH Sichttest grün im Sage-Repo.
