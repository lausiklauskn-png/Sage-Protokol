# Übergabeprotokoll · 2026-05-14 · Spec+Bau-Sitzung Modul 04 Match

**Sitzungs-Rolle:** Spec+Bau-Sitzung (eine Sitzung, zwei Phasen —
Modul 04 ist klein genug, dass beides in einem Lauf geht).
**Branch:** `claude/spec-bau-04-match-2pu6K`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B + §C
**Modul:** 04_match

---

## Auftrag

Drei verschränkte Aufgaben in einer Sitzung:

1. **Phase A — Spec:** Komponenten-Karte 04 vollständig füllen,
   Schnittstelle in `INTERFACES.md` spiegeln, und die in der Plan-
   Sitzung 2026-05-14 als Querschnitts-Frage notierte „A1–B3-Notations-
   Überlappung Sage ↔ Mixarium" innerhalb der Karte lösen (kein eigenes
   Mapping-Dokument davor).
2. **Phase B — Bau:** `src/modules/04_match.js` schreiben (gleiche
   Bauart wie 01 und 03 — IIFE, klassisches `<script>`-Tag,
   `window.SbkimMatch`, synchroner Selbstcheck beim Skript-Laden,
   `node --check` grün), Panel 04 in `tests/manual_check.html` von
   „noch nicht gebaut" auf „Code-Stub" stellen mit mindestens den
   beiden Sinn-Vergleichen (Käsekuchen/Käsetorte > 0.70,
   Käsekuchen/Auspuffrohr < 0.40) plus Selbstcheck-Hinweisknopf,
   `status.json` auf `stub` setzen und Pie regenerieren.
3. **Sitzungs-Abschluss:** PULS-Eintrag (beide Phasen), Übergabe-
   protokoll (diese Datei), WEGWEISER-Stand-Block-Zeile, Branch pushen,
   Draft-PR gegen main, danach merge.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Modus-freie Signatur:** `match(queryVec, passageVec) → number`
  (Skalarprodukt zweier L2-normalisierter `Float32Array(384)` =
  Cosinus). Kein `mode`-Parameter; Parameter-Namen sind reine
  Lese-Hilfe.
- **L2-Norm-Vertrauen:** Modul 03 garantiert L2-Normalisierung; Modul 04
  prüft die Norm im Hot-Path nicht (jeder zusätzliche `Math.sqrt` wäre
  in Schleifen Verschwendung).
- **`PROVIDER_MIN_MATCH = 0.55`** steht in INTERFACES.md §0; Modul 04
  spiegelt den Wert auf `window.SbkimMatch.PROVIDER_MIN_MATCH` und
  erfindet ihn nicht neu.
- **Selbstcheck-Format:**
  `console.info("MODUL 04 MATCH bereit, Funktionen: ...")` — synchron
  beim Skript-Laden (wie 01, anders als 03 — Modul 04 hat keinen
  asynchronen Lade-Schritt).

---

## Was getan wurde

### Phase A — Spec

#### 1. Komponenten-Karte 04 vollständig gefüllt

Die alte Site-Echo-Skizze (mit `cosineSim`, `computeDomainVector`,
`matchAgainstDomain`, `getDomainVector`) wurde **gestrichen**. Die
neue Schnittstelle ist auf das Minimum reduziert, weil die Plan-
Entscheidung „modus-frei" Modul 04 in eine reine Vergleichsfunktion
verwandelt — Domänen-Vektor-Verwaltung gehört in den Andock-Schritt
(Modul 02 Spore / Modul 09 Einbau-PWA), nicht in Modul 04.

Neue Schnittstelle:

```
match(queryVec: Float32Array, passageVec: Float32Array) → number    (sync; [-1, 1] für L2-norm Eingaben)
isAboveProviderThreshold(score: number) → boolean                   (sync; score >= 0.55)
PROVIDER_MIN_MATCH: number                                          (0.55, aus §0)
```

Karte 04 enthält jetzt: Hero, „Im Mycel-Bild" mit Skalarprodukt-
Argumentation, Visualisierungs-SVG (Schwellen-Kegel + Vektor-
Diagramm), Zweck, Verantwortlichkeiten (mit „Macht nicht" als ehrliche
Streichliste — kein eigenes Embedding, keine Norm-Prüfung im Hot-Path,
keine Domänen-Vektor-Verwaltung, keine Anastomose-Entscheidung, kein
async), Schnittstelle mit Selbstcheck-Format, A1–B3-Synthese-Abschnitt
(siehe unten), Fehlerverhalten-Tabelle (sechs Lagen), manueller Test
(sechs Knöpfe), Risiken (Norm-Vertrauen, Schwellwert-Tuning, Modell-
Drift, Performance, A1–B3 gelöst), Bauzustand-Tabelle, Querverweise.

#### 2. INTERFACES.md gespiegelt

Modul-04-Sektion von „schablone / noch zu spezifizieren" auf `entwurf`
mit voller Vertrag-Sektion gehoben: Signaturen, Selbstcheck-Format,
Fehlertabelle, expliziter Block „Garantien für Modul 05 / 07"
(Determinismus, Wertebereich, harte Schwelle ohne Hysterese).
Änderungsprotokoll fortgeschrieben.

#### 3. A1–B3-Notations-Synthese gelöst

Neuer Abschnitt in Karte 04 „§ A1–B3-Synthese: die Hops *tragen* die
Funktionen". Die Notation aus Sage-Page Karte 11 „Wanderung"
(A1/A2/A3 als Hop-Positionen auf Pfad A; B1/B2/B3/B4 auf Pfad B mit
Apoptose am Ende) und die Notation aus dem externen Repo
Mein-Mixarium `SBKIM_AGENTS.md` (A1 Curator, A2 Auditor, A3 Devil's
Advocate · B1 Interviewer, B2 Matcher, B3 Critic) decken sich nicht
zufällig: die Hops *tragen* die Funktionen. Sage zeigt die Geometrie
der Hop-Position, Mixarium zeigt die Rolle.

- **Pfad A** geht entlang der Anbieter-Seite: jeder Hop verfeinert die
  *Antwort*. A2 (der Auditor) braucht die Match-Zahl von Modul 04,
  um zu entscheiden, ob zwei Geschwister-Beschreibungen
  zusammen gehören.
- **Pfad B** geht entlang der Anfrage-Seite: jeder Hop verfeinert die
  *Frage*. B2 (der Matcher) ist Modul 04 in Aktion. Wenn der Score
  unter die Schwelle fällt und auch B3 (Critic) nichts mehr rettet,
  tritt B4 ein — Apoptose, der Strang stirbt.

In PULS.md ist die Querschnitts-Frage entsprechend gestrichen
(Strikethrough + Verweis auf Karte 04). Kein eigenes Mapping-
Dokument nötig.

### Phase B — Bau

#### 4. `src/modules/04_match.js` geschrieben

IIFE-Modul wie 01 (klassisches `<script>`-Tag, kein ESM-Import),
exportiert `window.SbkimMatch` mit den drei öffentlichen Surface-
Einträgen aus der Spec: `match`, `isAboveProviderThreshold`,
`PROVIDER_MIN_MATCH`.

Implementierung:

- `match(queryVec, passageVec)`: einfaches Skalarprodukt in einer
  Schleife. Vorher Form-Check via `assertVector`: muss `Float32Array`
  sein (`InvalidVectorError` sonst), muss Länge 384 haben
  (`ShapeMismatchError` sonst). Längen-Differenz wird zusätzlich
  geprüft (technisch redundant, weil beide auf 384 geprüft sind, aber
  schützt gegen späteres Drift der `EMBEDDING_DIM`-Konstante zwischen
  Modulen).
- `isAboveProviderThreshold(score)`: ein-Zeiler, `score >= PROVIDER_MIN_MATCH`.
- Selbstcheck synchron am Skript-Ende:
  `console.info("MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold, Schwelle: PROVIDER_MIN_MATCH=0.55")`.
- `_meta`-Objekt mit `embeddingDim` und `providerMinMatch` (zur
  Inspektion in DevTools, wie 01 und 03).

Bewusst weggelassen:

- **Keine NaN/Infinity-Checks im Hot-Path.** Modul 03 erzeugt das nicht;
  wer es einspeist, sieht `NaN` als Rückgabewert sofort.
- **Keine Norm-Prüfung.** L2-Norm-Vertrauen ist die Spec-Vorbedingung.
- **Keine SIMD/WebGPU-Vektorisierung.** 384 Multiplikationen pro
  Aufruf sind auf Mobil ~1 µs; das reicht mit fünf Größenordnungen
  Reserve.

JS-Syntax mit `node --check src/modules/04_match.js` validiert (grün).

#### 5. `tests/manual_check.html` Panel 04 verdrahtet

Panel-Status von „noch nicht gebaut" auf „Code-Stub". Sechs echte
Knöpfe via `SbkimUI.addButton`:

1. **Ähnlich: Käsekuchen vs. Käsetorte** — beide als Passage embedded
   (Batch), `match(v1, v2)`. Pass-Kriterium: `> 0.70`.
2. **Fern: Käsekuchen vs. Auspuffrohr** — beide als Passage embedded,
   `match(v1, v2)`. Pass-Kriterium: `< 0.40`.
3. **Schwelle positiv: Hefeteig vs. Kochrezepte** —
   `embedQuery("Hefeteig kneten")` vs.
   `embedPassage("Kochrezepte: Backen, Kuchen, Brot")`, dann
   `match(...)` und `isAboveProviderThreshold(score)`. Pass-Kriterium:
   Score > 0.55, Helfer liefert `true`.
4. **Schwelle negativ: Tarantino vs. Kochrezepte** — dieselbe Passage,
   andere Query (`"Drehbuch von Tarantino"`). Pass-Kriterium: Score
   unter 0.55, Helfer liefert `false`. Das ist der Apoptose-Trigger
   aus der A1–B3-Synthese (Hop B4).
5. **Form-Fehler: Längen-Differenz** —
   `match(new Float32Array(384), new Float32Array(256))`. Erwartet:
   `ShapeMismatchError`.
6. **Selbstcheck Konsole prüfen** — Hinweisknopf ohne Aktion: Tester
   öffnet DevTools → Konsole und sucht die Selbstcheck-Zeile (wird
   beim Laden ausgegeben, vor jedem Klick).

Skript-Tag-Einbindung folgt dem Muster von 01 und 03:
`<script src="../src/modules/04_match.js"></script>` direkt vor dem
Initialisierungs-IIFE.

#### 6. `status.json` + PULS-Pie aktualisiert

Modul 04 von `score: "schablone"` auf `score: "stub"`, `siegel` auf
„Code-Stub", `kurz` auf „Cosine-Sim als Skalarprodukt (modus-frei)".
`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 10 → 9
- Werkstatt: 1 → 1
- Spec fertig: 0 → 0
- Code-Stub: 2 → 3
- Fertig: 0 → 0

#### 7. PULS-Schnellüberblick + „Als nächstes ✨" aktualisiert

- Schnellüberblicks-Zeile für Modul 04: `Spec fertig (2026-05-14)` /
  `Code-Stub (2026-05-14)` / `ungeprüft (Sitzung headless)` /
  `Vektorvergleich, modus-frei`.
- „Als nächstes ✨" um Modul 04 in der Code-Stub-Liste ergänzt;
  Empfehlungs-Text auf „Klaus klickt 01 + 03 + 04 im Browser durch,
  danach Spec-Sitzung Modul 02 Spore oder Modul 05 Anastomose"
  aktualisiert.

#### 8. WEGWEISER-Stand-Block-Zeile

Eine Zeile unten im Stand-Block ergänzt (Wanderung, nicht Stapel —
neueste Zeile unten, wie das Format vorschreibt).

---

## Was offen blieb

- **Sichttest im Browser** durch Klaus — sechs Knöpfe in Panel 04.
  Voraussetzung: Modul 03 wird beim ersten Klick mitgeladen (~5–15 s).
  Erwartungen: Käsekuchen/Käsetorte > 0.70; Käsekuchen/Auspuffrohr
  < 0.40; positiver Schwelle-Test über 0.55, negativer unter; Form-
  Fehler `ShapeMismatchError`; Selbstcheck beim Laden.
- **Sichttests 01 + 03** weiterhin offen, kommen im selben Browser-
  Klick-Durchlauf mit, weil Panel 04 das 03-Modell mitlädt.

---

## Nächster sinnvoller Schritt

1. Klaus klickt 01, 03 und 04 im Browser durch und trägt die Sichttest-
   Zeilen in den drei Karten nach.
2. **Spec-Sitzung Modul 02 Spore** starten (blockiert sonst 05
   Anastomose und 07 Apoptose). Alternativ:
   **Spec-Sitzung Modul 05 Anastomose** — drei von vier
   Vorbedingungen (01, 03, 04) stehen als Stub; nur 02 Spore fehlt
   für die Identitäts-Felder.
3. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** oder
   **Modul 09 (Einbau-PWA)** — beide ohne Abhängigkeiten.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/04_match.md` vollständig gefüllt (Phase A)
- [x] `docs/INTERFACES.md` Modul 04 auf `entwurf` mit Vertrag-Sektion
- [x] PULS-Querschnitts-Frage „A1–B3-Notations-Überlappung" gestrichen
      (Strikethrough + Verweis auf Karte 04)
- [x] `src/modules/04_match.js` (Phase B), JS-Syntax via `node --check` grün
- [x] `tests/manual_check.html` Panel 04 auf „Code-Stub" mit sechs Knöpfen
- [x] `status.json` 04 auf `stub` + Pie regeneriert
- [x] `docs/PULS.md` Sitzungs-Eintrag (Phase A + Phase B)
- [x] Übergabeprotokoll (diese Datei)
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile ergänzt
- [ ] Manueller Sichttest in `tests/manual_check.html` — explizit als
      „ungeprüft, weil Sitzung headless" markiert; Klaus klickt im Browser
- [ ] Commit + Push auf `claude/spec-bau-04-match-2pu6K` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
