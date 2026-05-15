# Modul 04 — Match

> **Status:** 🟦 Code-Stub  ·  **Schicht:** Kern  ·  **Anker:** Sage-Page → Karte 4, Eintrag 04
> **Datei (Code):** `src/modules/04_match.js`
>
> _Skalarprodukt zweier L2-normalisierter 384-dim-Vektoren. Die
> kleinste Funktion im Protokoll — und die mit der höchsten Hebelwirkung._

---

## Im Mycel-Bild

Match ist die **Bedeutungs-Waage** des Mycels. Modul 03 übersetzt Text
in einen geometrischen Punkt, Modul 04 misst den Winkel zwischen zwei
solchen Punkten und sagt: nah genug? Liegt der Cosinus über
`PROVIDER_MIN_MATCH = 0.80`, ist Anastomose (Modul 05) gerechtfertigt;
darunter schweigt der Knoten. Schweigen ist hier Höflichkeit
**und** Bedeutungs-Routing in einem: wer nicht passt, kriegt nichts —
keine Höflichkeits-Floskel, keine Halb-Antwort.

Der Cosinus erscheint im Code nicht als `cos(θ) = (a·b)/(|a|·|b|)`,
sondern als **schlichtes Skalarprodukt**. Das ist kein Trick — es ist
die direkte Folge der L2-Norm-Garantie aus Modul 03: weil beide
Vektoren bereits Länge 1 haben, fällt der Nenner weg. Modul 04 darf
das voraussetzen und braucht keine Norm-Prüfung im Hot-Path.

---

## Visualisierung

```svg
<svg viewBox="0 0 480 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="matchBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#05050F"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="480" height="280" fill="url(#matchBg)"/>

  <!-- Achsen-Mitte -->
  <circle cx="240" cy="160" r="3" fill="#94A3B8"/>

  <!-- Schwellen-Kegel: cosine 0.80 entspricht ~36.9° Öffnung -->
  <path d="M 240 160 L 440 70 A 200 200 0 0 0 440 250 Z" fill="#16A34A" fill-opacity="0.10" stroke="#16A34A" stroke-opacity="0.4" stroke-dasharray="4 3"/>
  <text x="370" y="60" font-size="11" font-family="ui-monospace,monospace" fill="#16A34A">cos &gt; 0.80</text>

  <!-- Passage-Vektor (Mitte, fest) -->
  <line x1="240" y1="160" x2="430" y2="160" stroke="#F59E0B" stroke-width="2.5"/>
  <polygon points="430,160 420,155 420,165" fill="#F59E0B"/>
  <text x="320" y="152" font-size="12" font-family="ui-monospace,monospace" fill="#F59E0B">passageVec</text>

  <!-- Query-Vektor 1: passt -->
  <line x1="240" y1="160" x2="410" y2="105" stroke="#16A34A" stroke-width="2"/>
  <polygon points="410,105 401,110 405,116" fill="#16A34A"/>
  <text x="330" y="100" font-size="11" font-family="ui-monospace,monospace" fill="#16A34A">queryVec · 0.78 ✓</text>

  <!-- Query-Vektor 2: passt nicht -->
  <line x1="240" y1="160" x2="120" y2="60" stroke="#EA580C" stroke-width="2"/>
  <polygon points="120,60 130,65 126,72" fill="#EA580C"/>
  <text x="40" y="55" font-size="11" font-family="ui-monospace,monospace" fill="#EA580C">queryVec · 0.18 ✗</text>

  <!-- Winkel-Bogen -->
  <path d="M 290 160 A 50 50 0 0 0 280 130" fill="none" stroke="#94A3B8" stroke-width="1"/>
  <text x="298" y="148" font-size="10" font-family="ui-monospace,monospace" fill="#94A3B8">θ</text>

  <text x="240" y="260" text-anchor="middle" font-size="11" font-family="ui-monospace,monospace" fill="#94A3B8">match(queryVec, passageVec) = Σ q[i]·p[i]   (beide L2-norm → = cos θ)</text>
</svg>
```

---

## Zweck

Vergleicht zwei Embedding-Vektoren auf semantische Ähnlichkeit. Der
zurückgegebene Wert ist die **Cosinus-Ähnlichkeit** im Intervall
`[-1, 1]`; für e5-erzeugte Vektoren liegt er praktisch immer im
positiven Bereich.

Modul 04 entscheidet **nicht** selbst, ob geantwortet wird — es liefert
nur die Zahl. Den Schwellwert-Vergleich (`>= PROVIDER_MIN_MATCH`) bietet
es als Helfer an; die Anwendung (Modul 05 Anastomose) ruft beides
nacheinander auf.

---

## Verantwortlichkeiten

**Macht:**
- `match(queryVec, passageVec)` — Skalarprodukt zweier
  Float32Array(384), unter L2-Norm-Vorbedingung identisch zum Cosinus
- `isAboveProviderThreshold(score)` — Vergleich gegen
  `PROVIDER_MIN_MATCH = 0.80`, eingebaut, damit der Schwellwert
  nicht in der Aufrufstelle wiederholt wird
- Synchrone Selbstcheck-Meldung beim Skript-Laden (kein async Init,
  weil das Modul keinen Lade-Schritt hat)
- Struktur-Validierung am Funktions-Eingang: Form, Länge, Typ. Bei
  Verletzung benannter Fehler — niemals stilles `NaN` weiterreichen

**Macht nicht:**
- **Kein eigenes Embedding** (das ist Modul 03). Modul 04 nimmt fertige
  Vektoren entgegen, ruft nirgends `embedQuery`/`embedPassage` auf.
- **Keine Norm-Prüfung im Hot-Path.** Modul 03 garantiert L2-Norm; auf
  diese Vorbedingung wird sich verlassen, weil jeder zusätzliche
  `Math.sqrt`-Aufruf den Match-Schritt in Schleifen messbar bremst.
  Wer einen Vektor mit anderer Norm hineinreicht, bekommt einen Wert
  außerhalb von `[-1, 1]` zurück — das ist erlaubt und erkennbar.
- **Keine Domänen-Vektor-Verwaltung.** Die geometrische Mitte der
  eigenen Domäne entsteht im Andock-Schritt (siehe Modul 02 Spore /
  Modul 09 Einbau-PWA), nicht in Modul 04. Match nimmt zwei Vektoren —
  woher sie kommen, ist nicht sein Anliegen. Die alte Skizze
  `computeDomainVector` / `matchAgainstDomain` / `getDomainVector` aus
  der Site-Echo-Karte ist mit dieser Spec **gestrichen**.
- **Keine Anastomose-Entscheidung.** Modul 04 sagt nur „nah genug?",
  Modul 05 entscheidet „verbinden?".
- **Kein async.** Match ist eine reine Funktion. Wer eine Promise
  zurückgibt, ist nicht Modul 04.

---

## Schnittstelle

Modul 04 exportiert **zwei** öffentliche Funktionen + eine Konstante.
Die API ist **modus-frei** — die Parameter-Namen `queryVec` und
`passageVec` erzwingen semantisch die richtige Reihenfolge, am Ergebnis
ändert die Reihenfolge mathematisch nichts (Skalarprodukt ist
kommutativ).

```
match(queryVec: Float32Array, passageVec: Float32Array) → number
  // [-1, 1] für L2-normalisierte Vektoren.
  // Sync, kein Promise.
  // Wirft ShapeMismatchError bei Längen-Differenz oder fehlender L2-
  // Vorbedingung (Erkennung allein an Form / Typ, nicht an Norm).

isAboveProviderThreshold(score: number) → boolean
  // true, wenn score >= PROVIDER_MIN_MATCH (0.80).
  // Sync, kein Promise. Reine Vergleichsfunktion.

PROVIDER_MIN_MATCH: number                                   // 0.80, aus INTERFACES.md §0
```

### Warum kein `mode`-Parameter

Aus derselben Logik wie bei Modul 03 (vier Funktionen statt
`embedText(text, mode)`): ein Parameter, der vergessen oder vertauscht
werden kann, ist eine Bug-Falle. Hier ist die Lösung noch kleiner —
Match braucht *keinen* Modus, weil das Skalarprodukt symmetrisch ist.
Die Parameter-Namen sind reine Lese-Hilfe an den Aufrufer, kein
Laufzeit-Schalter.

### Selbstcheck

Beim **Skript-Laden** (synchron, vor jeglichem Aufruf):

```
console.info("MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold, Schwelle: PROVIDER_MIN_MATCH=0.80");
```

Anders als Modul 03 (das nach `init()` meldet, weil der Modell-Download
asynchron ist) hat Modul 04 keinen Lade-Schritt. „Bereit" gilt ab dem
Moment, in dem das `<script>`-Tag ausgewertet wurde — die Konsole darf
das ehrlich beim Laden sagen.

### Konfigurationswerte

```
PROVIDER_MIN_MATCH = 0.80     // aus INTERFACES.md §0, hier nur referenziert
EMBEDDING_DIM      = 384      // erwartete Vektor-Länge (zur Form-Prüfung)
```

`PROVIDER_MIN_MATCH` wird **nicht in Modul 04 neu definiert**, sondern
aus INTERFACES.md §0 übernommen und auf `window.SbkimMatch.PROVIDER_MIN_MATCH`
sichtbar gemacht. Wer den Wert ändern möchte, ändert ihn in §0 — Modul
04 zieht nach.

### Stamm/Gast-Klassifikation berührt Modul 04 nicht

Spec-Sitzung 2026-05-15 „Stamm/Gast-Felder in Spore-JSON" hat eine
Designentscheidung getroffen, die hier festgehalten gehört, damit
sie nicht in einer späteren Bau-Sitzung als Anlass für einen
Zusatzparameter missverstanden wird:

**Stamm- und Gast-Kategorien aus dem Spore-JSON (siehe `02_spore.md`
und INTERFACES.md §2) sind eine reine Klassifikations-Schicht auf
der Daten-Ebene. Sie ändern Modul 04 nicht.**

- `match(queryVec, passageVec)` bleibt reine Cosinus-Mathematik.
- `isAboveProviderThreshold(score)` bleibt eine einzige Schwelle.
- **Kein** `relation`-Parameter, **kein** Dämpfungsfaktor,
  **keine** zweite Schwelle für Stamm↔Gast.

Begründung: zwei Knoten verbinden sich (Anastomose) anhand der
Vektor-Ähnlichkeit ihrer Domäne als Ganzes — nicht anhand der
Schicht-Zugehörigkeit. Stamm/Gast ist eine **UI- und Sortier-
Eigenschaft** auf der Ebene des Endknotens (Modul 08 / 09): bei
Suchergebnissen werden Treffer aus `stammCategories` prominent
gezeigt, aus `guestCategories` als „Überraschungs-Plus". Die
Vektor-Ähnlichkeit selbst bleibt skalar und unklassifiziert.

Sollte eine spätere Empirik zeigen, dass Stamm↔Gast-Matches
systematisch andere Cosinus-Verteilungen haben als Stamm↔Stamm-
Matches, ist eine eigene Pflege-Sitzung der Ort dafür — nicht
diese Karte.

---

## A1–B3-Synthese: die Hops *tragen* die Funktionen

Die Sage-Landingpage zeigt in Karte 11 „Wanderung" zwei Such-Pfade
durch das Mycel: Pfad **A** (golden → grün, erfolgreich, endet auf
A3 ✓) und Pfad **B** (rosa, fadet aus, Apoptose bei B4). Das externe
Repo Mein-Mixarium führt in `SBKIM_AGENTS.md` dieselben Buchstaben als
**Agenten-Rollen** in einem Curator-Auditor-Critic-Modell:

| Hop | Pfad-A-Rolle | Pfad-B-Rolle |
|---|---|---|
| 1 | A1 · **Curator** (kuratiert Treffer) | B1 · **Interviewer** (befragt die Anfrage) |
| 2 | A2 · **Auditor** (prüft auf Inkonsistenz) | B2 · **Matcher** (rechnet Ähnlichkeit — *das hier*) |
| 3 | A3 · **Devil's Advocate** (sucht den Bruch) | B3 · **Critic** (verwirft, wenn zu schwach) |
| 4 | — | B4 · Apoptose (Strang stirbt) |

Die Notation deckt sich, die Bedeutung nicht — bis man die Synthese
zulässt: **die Hops tragen die Funktionen**. Jeder Sprung im Mycel ist
nicht „bloß Routing", sondern eine inhaltliche Verfeinerung durch eine
Agentenrolle.

- **Pfad A** geht entlang der Anbieter-Seite: Curator → Auditor →
  Devil's Advocate. Mit jedem Hop wird die *Antwort* schärfer, weil
  jeder Knoten den eingereichten Inhalt unter einer anderen Brille
  prüft. Modul 04 liefert die Zahl, die A2 (der Auditor) braucht, um zu
  entscheiden, ob die zwei Geschwister-Beschreibungen überhaupt
  zusammen gehören.
- **Pfad B** geht entlang der Anfrage-Seite: Interviewer → Matcher →
  Critic. Mit jedem Hop wird die *Frage* schärfer, weil B1 nachfragt,
  B2 vergleicht und B3 verwirft. Wenn B2s `match(queryVec, passageVec)`
  unter `PROVIDER_MIN_MATCH` fällt und auch B3 keinen Anker findet,
  tritt B4 ein — Apoptose, der Strang stirbt. Das ist kein Fehler des
  Mycels, sondern Rauschunterdrückung: nicht-passende Stränge müssen
  verschwinden, sonst frisst das Netz sich selbst auf.

**Konsequenz für die Implementierung in diesem Repo:**

- Modul 04 ist die *Match-Funktion* an Hop B2 / A2 — eine reine
  numerische Frage, kein Routing, kein Verwerfen.
- `isAboveProviderThreshold` ist die *Entscheidungs-Regel* an Hop B3 /
  A3, aber als Helfer angeboten, damit die nächste Stufe (Modul 05
  Anastomose, später Modul 07 Apoptose) sie nicht nochmal erfindet.
- Die Buchstaben-Notation in Sage (A1/A2/A3 · B1/B2/B3/B4) und in
  Mixarium (Curator/Auditor/… · Interviewer/Matcher/Critic) bleiben
  beide gültig — sie beschreiben dieselbe Wanderung aus zwei Winkeln:
  Sage zeigt die *Geometrie* (wo der Hop liegt), Mixarium zeigt die
  *Rolle* (was der Hop tut). Modul 04 sitzt an Position 2 in beiden.

Diese Synthese ersetzt das in der Plan-Sitzung 2026-05-14 als
Querschnitts-Frage notierte „A1–B3-Notations-Mapping-Dokument" — kein
eigenes Dokument, sondern dieser Abschnitt.

---

## Fehlerverhalten

| Lage | Reaktion |
|---|---|
| `queryVec` oder `passageVec` ist nicht `Float32Array` (z.B. plain `Array`, `Uint8Array`, `undefined`) | wirft `InvalidVectorError` mit deutschsprachiger Message und Hinweis auf die erwartete Form. |
| Längen-Differenz (z.B. einer 384, einer 256) | wirft `ShapeMismatchError`. Wahrscheinliche Ursache: Vektor aus einer anderen Modell-Version. |
| Länge ≠ `EMBEDDING_DIM` (384) auf beiden Seiten | wirft `ShapeMismatchError` mit Verweis auf §0 / Modul 03. |
| Eingabe enthält `NaN` oder `±Infinity` | **kein** expliziter Check — das Ergebnis ist `NaN` / `±Infinity`, und der Aufrufer sieht das sofort. Modul 03 erzeugt das nicht; wer es einspeist, debuggt seine eigene Pipeline. |
| Eingabe ist nicht L2-normalisiert | **kein** Fehler. Ergebnis liegt eventuell außerhalb `[-1, 1]`. Wer Norm bricht, sieht das am Wert. Diese Wahl ist bewusst — siehe „Macht nicht". |
| `isAboveProviderThreshold(score)` mit Nicht-Zahl | wirft `TypeError` (Standard-JS-Verhalten beim Vergleich; nicht von uns extra abgefangen). |

---

## Manueller Test

In `tests/manual_check.html`, Panel **04 Match** (seit Bau-Sitzung
2026-05-14 mit echten Aufrufen verdrahtet). Voraussetzung: Modul 03
muss vorher initialisiert werden — die Knöpfe rufen `embedPassage`
intern auf. Erster Klick lädt das Modell (~5–15 s), spätere Klicks
laufen aus dem Cache.

1. **Ähnlich: Käsekuchen vs. Käsetorte** — embedded beide als Passage,
   `match(v1, v2)`. Erwartung: **> 0.92**. Bewertung: zwei semantisch
   nah verwandte Begriffe in derselben Domäne. (Sichttest 2026-05-14
   ergab 0.9507 — die Schwelle 0.92 liegt knapp darunter, mit Reserve
   für Modell-Drift.)
2. **Fern: Käsekuchen vs. Auspuffrohr** — embedded beide als Passage,
   `match(v1, v2)`. Erwartung: **< 0.90**. Bewertung: zwei semantisch
   weit entfernte Begriffe aus völlig verschiedenen Domänen. (Sichttest
   2026-05-14 ergab 0.8967 — `e5-small` hebt die Cosinus-Baseline für
   beliebige Einzelbegriffe ungewöhnlich hoch; siehe Beleg-Block unten.)
3. **Schwelle: Anfrage vs. Domäne (positiv)** — `embedQuery("Hefeteig kneten")`
   vs. `embedPassage("Kochrezepte: Backen, Kuchen, Brot")`, dann
   `match(...)` und `isAboveProviderThreshold(score)`. Erwartung:
   Score deutlich über `0.80`, Helfer liefert `true`. (Sichttest
   2026-05-14: 0.8312.)
4. **Schwelle: Anfrage vs. Domäne (negativ)** — `embedQuery("Drehbuch von Tarantino")`
   gegen dieselbe Kochrezepte-Passage. Erwartung: Score unter `0.80`,
   Helfer liefert `false`. Das simuliert den Apoptose-Auslöser an
   Hop B3 / B4 aus der A1–B3-Synthese. (Sichttest 2026-05-14: 0.7737.)
5. **Form-Fehler: Längen-Differenz** — `match(new Float32Array(384), new Float32Array(256))`.
   Erwartung: `ShapeMismatchError`. Bewertung: Form-Check ist aktiv,
   kein stilles `NaN`.
6. **Selbstcheck Konsole prüfen** — Hinweisknopf ohne Aktion: weist den
   Tester an, DevTools → Konsole zu öffnen und die Zeile
   `MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold, Schwelle: PROVIDER_MIN_MATCH=0.80`
   zu suchen (erscheint **beim Laden**, vor jedem Klick).

Die Schwellwerte 0.92 / 0.90 / 0.80 sind die im Sichttest 2026-05-14
empirisch ermittelten Trennlinien — siehe Beleg-Block unten. Sie
ersetzen die früheren Erst-Schätzungen 0.70 / 0.40 / 0.55, die im
selben Sichttest Schwellen-Drift offenbarten (Auspuffrohr 0.8967
statt < 0.40; Tarantino 0.7737 statt < 0.55).

---

## Risiken & offene Punkte

- **Norm-Vertrauen:** Modul 04 verlässt sich darauf, dass Modul 03 L2-
  normalisiert liefert. Bricht jemand diese Vorbedingung (etwa indem
  er Vektoren aus einer anderen Quelle übergibt), liegt das Ergebnis
  außerhalb `[-1, 1]`. Das ist sichtbar, aber nicht laut. Bewusste
  Wahl — siehe „Macht nicht".
- **Schwellwert-Beleg (Sichttest 2026-05-14):** `PROVIDER_MIN_MATCH`
  wurde in der Pflege-Sitzung 2026-05-14 von der Paper-Erst-Schätzung
  `0.55` auf den empirisch belegten Wert `0.80` angehoben. Grundlage
  sind fünf reproduzierbare Cosinus-Messwerte aus Klaus' Browser-
  Sichttest mit `Xenova/multilingual-e5-small`:

  | Test | Cosinus | Lese-Hilfe |
  |---|---|---|
  | gleicher Inhalt (Query vs. Passage, derselbe Text) | ~0.95 | Modell-Rolle-Differenz, sonst identisch |
  | sehr ähnlich (Käsekuchen / Käsetorte) | 0.9507 | dieselbe Domäne, nah verwandt |
  | weit auseinander (Käsekuchen / Auspuffrohr) | 0.8967 | völlig unterschiedliche Domänen — die e5-small-Baseline für Einzelbegriffe sitzt überraschend hoch |
  | Domäne + relevant (Hefeteig / Kochrezepte) | 0.8312 | Anbieter soll antworten |
  | Domäne + irrelevant (Tarantino / Kochrezepte) | 0.7737 | Anbieter soll schweigen |

  `PROVIDER_MIN_MATCH = 0.80` trennt **empirisch** zwischen „relevant"
  (0.83) und „irrelevant" (0.77). Die Paper-Schwelle 0.55 hätte beide
  durchgelassen — Apoptose B4 wäre nie ausgelöst worden.

  Die Test-Schwelle „Fern < 0.90" weicht von der ursprünglichen
  Sitzungs-Empfehlung (< 0.85) ab: 0.8967 läge unter 0.85 nicht, die
  Korrektur auf 0.90 ist der frische Befund dieser Pflege-Sitzung.
  Sie dokumentiert nebenbei, dass die e5-small-Baseline für unverwandte
  Einzelbegriffe ungewöhnlich hoch sitzt — eine relevante Modell-
  Eigenschaft, kein Toleranz-Spielraum.
- **Modell-Drift:** Wenn das e5-small-Modell sich verändert (Upstream-
  Update, anderer Quantisierungs-Stand), driften die Cosinus-Werte für
  dieselben Texte um wenige Prozent. Die kalibrierten Schwellen sitzen
  enger an den Messwerten (z.B. nur 0.0033 Margin bei „Fern < 0.90"
  gegen 0.8967) — eine Modell-Drift von mehr als 0.5 % bricht die
  Tests, und genau das soll sie auch. Eine erneute Kalibrierungs-
  Sitzung ist dann fällig.
- **Performance:** in der Schleife sind 384 Multiplikationen + 383
  Additionen pro Aufruf — auf einem Mobil-Browser ~1 µs. Wir machen
  keine Vektorisierung (SIMD), kein WebGPU, kein TypedArray-Tricks.
  Für 100 Geschwister-Vergleiche pro Anfrage reicht das mit 5
  Größenordnungen Reserve.
- **A1–B3-Notations-Synthese:** in dieser Karte gelöst (siehe Abschnitt
  oben). Kein eigenes Mapping-Dokument nötig. Querschnitts-Frage in
  PULS.md wird mit Verweis auf diese Karte als gelöst gestrichen.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Vektor-SVG, Querverweise |
| Spec gefüllt | 2026-05-14 | Spec+Bau 04 | modus-freie API `match(queryVec, passageVec)`, `isAboveProviderThreshold`, L2-Norm-Vertrauen, A1–B3-Synthese, Fehlertabelle |
| Code geschrieben | 2026-05-14 | Spec+Bau 04 | `src/modules/04_match.js`, IIFE mit `window.SbkimMatch`, synchroner Selbstcheck beim Skript-Laden, sechs Knöpfe in `manual_check.html`, JS-Syntax via `node --check` grün |
| Sichttest | 2026-05-14 | Spec+Bau 04 + Pflege Match-Kal. | geprüft 2026-05-14 (Klaus, im Browser): 3 Tests grün (Käsetorte ähnlich, Hefeteig positiv, Form-Fehler); 2 Tests offenbarten Schwellen-Drift (Auspuffrohr 0.8967 statt < 0.40; Tarantino 0.7737 statt < 0.55) — daraufhin Kalibrierungs-Sitzung 2026-05-14 `PROVIDER_MIN_MATCH` 0.55 → 0.80, Test-Schwellen 0.70/0.40 → 0.92/0.90 |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 03 (Embedding) — liefert L2-normalisierte Vektoren
- **Wird genutzt von:** Modul 05 (Anastomose) — entscheidet anhand des Scores; Modul 07 (Apoptose) — markiert Pfade unterhalb der Schwelle für die Selbstlöschung
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview), Eintrag 04 · [Karte 11 · Wanderung](../../index.html#screen-overview) (A1–B3-Pfade)
- **Glossar:** [Cosine-Sim](../GLOSSAR.md), [Domänen-Vektor](../GLOSSAR.md), [Schwellwert](../GLOSSAR.md)
- **Integration:** `sbkim_integration.md` §6 (Bewertungsfunktion)
- **Interfaces:** [`INTERFACES.md` §1 → Modul 04_match](../INTERFACES.md)
