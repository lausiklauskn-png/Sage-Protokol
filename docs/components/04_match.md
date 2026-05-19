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

Modul 04 exportiert seit Spec-Sitzung M04-Erweiterung (Brief 03 der
V1-Sammelspec-Kaskade, 2026-05-19) **vier** öffentliche Funktionen +
zwei Konstanten. Die zwei ursprünglichen Funktionen (`match`,
`isAboveProviderThreshold`) bleiben unverändert (Vertrag aus Spec+Bau
04 2026-05-14) — `matchDimensions` und `explainMatchLLM` sind additiv,
und PROTOCOL_VERSION bleibt `"0.1"`. Die API ist weiterhin **modus-
frei** — die Parameter-Namen `queryVec` / `passageVec` und `queryCap`
/ `queryNeeds` / `passageCap` / `passageNeeds` erzwingen semantisch
die richtige Reihenfolge.

```
match(queryVec: Float32Array, passageVec: Float32Array) → number
  // [-1, 1] für L2-normalisierte Vektoren.
  // Sync, kein Promise.
  // Wirft ShapeMismatchError bei Längen-Differenz oder fehlender L2-
  // Vorbedingung (Erkennung allein an Form / Typ, nicht an Norm).

isAboveProviderThreshold(score: number) → boolean
  // true, wenn score >= PROVIDER_MIN_MATCH (0.80).
  // Sync, kein Promise. Reine Vergleichsfunktion.

matchDimensions(queryCap:    Float32Array | null,
                queryNeeds:  Float32Array | null,
                passageCap:  Float32Array | null,
                passageNeeds:Float32Array | null) → MatchDimensionsResult
  // NEU additiv aus Spec-Sitzung M04-Erweiterung (Brief 03).
  // Sync, kein Promise. Liefert drei orthogonale Schicht-Scores
  // (fachlich / prozess / skalierung) + overall + availableLanes.
  // Null-Vektoren signalisieren „nur Anbieter-Modus" — siehe
  // § Drei-Schichten-Modell unten und INTERFACES.md §1 Modul 04
  // § Drei-Schichten-Modell § Nur-Anbieter-Modus.
  // Wirft DimensionsAllNullError sync, wenn alle vier Vektoren null
  // sind (Aufrufer hätte das vorher prüfen müssen). Andere Form-/
  // Längen-Fehler werfen InvalidVectorError bzw. ShapeMismatchError
  // analog zu match().

explainMatchLLM(matchResult: MatchDimensionsResult,
                apiKey:      string,
                options?:    { model?: string,
                               maxTokens?: number,
                               abortSignal?: AbortSignal }) → Promise<ExplainResult>
  // NEU additiv aus Spec-Sitzung M04-Erweiterung (Brief 03).
  // Async, der EINZIGE Netz-/async-Pfad in Modul 04. Stufe-B-LLM-
  // Call, opt-in pro Knoten (siehe INTERFACES.md §7 LLM-Stufe-B-
  // Ehrlichkeits-Klausel). Fehlertolerant — scheitert nie throw,
  // resolved mit ExplainResult{ available:false, reason, fallbackScore }
  // bei HTTP-/Schema-/Netz-/Abort-Fehlern. Aufrufer fällt dann auf
  // matchResult zurück; UI zeigt „Erklärung nicht verfügbar".

PROVIDER_MIN_MATCH: number                                   // 0.80, aus INTERFACES.md §0
SCHICHT_MIN_MATCH:  number                                   // 0.60, aus INTERFACES.md §0 (NEU aus Brief 03)
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

### Drei-Schichten-Modell (M04-Erweiterung, Brief 03)

Spec-Sitzung M04-Erweiterung (Brief 03 der V1-Sammelspec-Kaskade,
2026-05-19) führt die drei orthogonalen Schichten aus dem ursprünglichen
SBKIM-Paper (`docs/papers/sbkim-paper-en.html` § 3.3 „The Three
Dimensions" / `docs/papers/sbkim-paper-de.html` § 3.3) in die
Mycel-Form ein. Diese Schicht steht **orthogonal zur Stamm/Gast-
Klassifikation** (siehe Sub-Block unten — Stamm/Gast bleibt UI-Ebene
und berührt Modul 04 nicht).

**Drei Achsen (orthogonal):**

| Achse | Paper-Name (EN) | Frage |
|---|---|---|
| `fachlich` | `domain` | Was kannst du / was suchst du inhaltlich? |
| `prozess` | `process` | Wie arbeitest du? Rhythmus, Methodik, Verbindlichkeit. |
| `skalierung` | `scale` | Auf welcher Größenebene? Einzelner Knoten / Cluster / Netz. |

Orthogonal heißt: ein hoher Score in einer Achse impliziert keinen
hohen Score in einer anderen. Das erlaubt **teil-kompatible Treffer**
und macht Brücken-Vorschläge (siehe nächster Block) erst sinnvoll.

**`matchDimensions`-Rückgabe (`MatchDimensionsResult`):**

```jsonc
{
  "fachlich":       0.91 | null,       // [-1, 1] oder null wenn nicht berechenbar
  "prozess":        0.62 | null,
  "skalierung":     0.88 | null,
  "overall":        0.80 | null,       // gewichteter Mittelwert der nicht-null Schichten
  "availableLanes": 0 | 1 | 2          // wie viele Cap×Needs-Richtungen gerechnet wurden
                                       //   0 = Nur-Anbieter-Modus auf beiden Seiten
                                       //   1 = einseitig (eine Seite hat keinen needs-Vektor)
                                       //   2 = volle Bidirektionalität
}
```

**Berechnung pro Lane:** wenn `queryCap` und `passageNeeds` beide
nicht-null sind, ist Lane 1 berechenbar (A bietet → B sucht); wenn
`queryNeeds` und `passageCap` beide nicht-null sind, ist Lane 2
berechenbar (A sucht ← B bietet). Pro Lane wird `match(cap, needs)`
ausgeführt. Wenn beide Lanes berechenbar sind, ist die Schicht-Score
der Mittelwert beider Lane-Cosinus; wenn nur eine Lane berechenbar
ist, der Single-Lane-Wert; wenn keine berechenbar, `null`.

**Aufteilung in drei Schichten (Spec-Entscheidung).** Da heute jeder
Spore-Vektor (`domainVector` / `embeddingCapabilities` / `embeddingNeeds`)
ein einziges 384-dim Domain-Embedding trägt — kein separater Prozess-
oder Skalierungs-Vektor —, ist die Drei-Schichten-Aufteilung in der
Stufe-A-Pipeline eine **Heuristik über demselben Embedding-Raum**: die
Initial-Implementation rechnet drei identische Lane-Cosinus pro Schicht
(`fachlich = prozess = skalierung = Lane-Cosinus`). **Die echte
Schichten-Differenzierung passiert in Stufe B** (siehe `explainMatchLLM`-
Block) — der LLM-Pass liefert semantisch reichere Schicht-Zahlen, die
die Stufe-A-Heuristik für UI-Zwecke übersteuern können.

Spätere Pflege-Sitzungen dürfen die Schicht-Projektion verfeinern (z.B.
separate `embeddingProcessNeeds` / `embeddingScaleNeeds`-Felder
einführen, sobald empirische Daten zeigen, dass das nötig ist); das
wäre ein additiver Eingriff am Spore-Schema (heute optional, künftig
möglicherweise Pflicht → dann PROTOCOL_VERSION-Bump).

**Overall-Berechnung: gewichteter Mittelwert, nicht Min.** `overall`
ist `(fachlich + prozess + skalierung) / 3` über die nicht-null
Schichten. Min wäre zu hart — eine einzige schwache Dimension würde
Anastomose verhindern, obwohl genau diese Lücke der Anlass für aktive
Vermittlung sein könnte. Die harte Apoptose-Grenze (2+ Dimensionen unter
`SCHICHT_MIN_MATCH = 0.60`) liegt separat im Schwellen-Vertrag — Schicht-
Schwelle dominiert dann den `overall`-Wert.

**Nur-Anbieter-Modus:** Wenn beide Knoten kein `embeddingNeeds` haben
(heute der Default), liefert `matchDimensions` alle Schichten als
`null` und `availableLanes:0`. Aufrufer fallen dann auf den
Single-Vector-Pfad `match(domainVectorA, domainVectorB)` mit
`isAboveProviderThreshold` zurück — **vollständig rückwärts-kompatibel**
zum heutigen Modul-05-Verhalten.

### Brücken-Feld-Spec (M04-Erweiterung, Brief 03)

Brücken-Vorschlag = das Element in der Match-Antwort, das sagt: „was
würde diese Verbindung vollständig machen?" Anlass: A und B matchen
in zwei Schichten gut, in der dritten aber schlecht — der
Brücken-Vorschlag nennt einen abstrakten Knoten-C, der die Lücke
schließen könnte. Brücken-Vorschläge entstehen **ausschließlich** in
Stufe B (`explainMatchLLM`) — die Stufe-A-Pipeline rechnet keine
Brücken-Empfehlungen.

```jsonc
BridgeProposal = {
  "needed":         "<deutscher Klartext, ≤300 Zeichen, was fehlt>",
  "lookingFor":     "<deutscher Klartext, ≤300 Zeichen, was gesucht wird> | null",
  "candidateScope": "lokal" | "mailbox" | "netz"
}
```

**`candidateScope`-Werte** (verbindlich, siehe INTERFACES.md §1 Modul 04
§ Brücken-Feld-Spec):

- `"lokal"` — Anzeige nur im Knoten, kein Netz-Schritt. **Heute der
  einzige produktiv aktivierbare Wert.**
- `"mailbox"` — Anker an Modul 13 (Königin-Relay, Vision-Anker 4 in PULS).
  Brücken-Vorschlag wird in die Königin-Mailbox gelegt, sobald Modul 13
  gebaut ist. Vor Modul 13 nicht aktivierbar — wer ihn setzt, wird vom
  Aufrufer ignoriert.
- `"netz"` — **FORMAL NICHT AKTIVIERBAR bis Anker 10/11/12** (Reputation /
  Rate-Limit / Blocklist, alle Schutz-Backlog). Modul 04 korrigiert eine
  Stufe-B-LLM-Antwort mit `candidateScope:"netz"` still auf `"lokal"`
  (defensive Wahl, kein Throw). Diese Korrektur entfällt erst, wenn
  Anker 10-12 implementiert und freigegeben sind.

Siehe INTERFACES.md §8 Anti-Missbrauch-Klausel.

### Schwellen-Vertrag (M04-Erweiterung, Brief 03)

```
PROVIDER_MIN_MATCH = 0.80     // bleibt für `overall` (alte Pipeline + neue)
SCHICHT_MIN_MATCH  = 0.60     // pro Dimension (NEU, §0)
```

**Auswertungs-Regeln** (in dieser Reihenfolge, identisch zu
INTERFACES.md §1 Modul 04 § Schwellen-Vertrag):

1. **`availableLanes === 0`** (Nur-Anbieter-Modus): Aufrufer nutzt
   `match()` + `isAboveProviderThreshold()` wie bisher.
2. **`overall < PROVIDER_MIN_MATCH`:** Apoptose-Vorbedingung wie bisher.
3. **≥ 2 Schicht-Scores unter `SCHICHT_MIN_MATCH`:** Apoptose-Vorbedingung
   (dominiert auch hohen `overall` — zwei strukturelle Lücken sind kein
   tragfähiges Match).
4. **Genau eine Schicht unter `SCHICHT_MIN_MATCH` UND `overall >=
   PROVIDER_MIN_MATCH`:** Match gilt als **brücken-tauglich**. Aufrufer
   kann optional `explainMatchLLM` rufen, um einen Brücken-Vorschlag zu
   erhalten. Ohne Stufe B bleibt der Match einfach als „established mit
   Lücke" — Aufrufer entscheidet, ob er die Lücke ignoriert.
5. **Alle Schichten ≥ `SCHICHT_MIN_MATCH` UND `overall >=
   PROVIDER_MIN_MATCH`:** voller Match. Stufe B nur für Erklär-/UI-Zwecke
   nützlich.

**Stufe-B-Übersteuerung:** `explainMatchLLM` darf eine Dimensions-Schwelle
übersteuern, wenn die Begründung im Brücken-Vorschlag semantisch reicher
ist als die Zahl (z.B. „die niedrige Skalierungs-Schicht ist hier
irrelevant, weil A explizit nach kleinem Maßstab sucht"). In dem Fall
liefert `explainMatchLLM` `overrideRecommendation: "established" |
"established-with-bridge" | "rejected"` mit Begründung — Aufrufer kann
folgen oder bei der Stufe-A-Heuristik bleiben. **Modul 04 ist nicht
weisungsbefugt** — die Entscheidung bleibt beim Aufrufer.

### Stufe-B-Vertrag (`explainMatchLLM`) — M04-Erweiterung, Brief 03

Stufe B ist ein **opt-in** LLM-Pass über das Match-Resultat aus Stufe A.
Pattern-Quelle: Layer-1-Demo der SBKIM-Plattform-`index.html` (im
Paper-Repo, **nicht** in diesem Repo — die Pattern-Form wird hier
spezifiziert, der konkrete Prompt ist Bau-Detail).

**Vertrag (verbindlich):**

| Aspekt | Wert |
|---|---|
| Modell | `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` aus §0; aufrufer-überschreibbar via `options.model` (z.B. Nachfolge-Modell `"claude-sonnet-4-6"` / `"claude-opus-4-7"`). Modul 04 hartcodiert keine Modell-ID. |
| `max_tokens` | `STUFE_B_MAX_TOKENS = 1024` aus §0; aufrufer-überschreibbar via `options.maxTokens`. |
| Output-Form | **JSON-only.** Prompt setzt explizit „Antworte ausschließlich mit JSON nach dem unten gezeigten Schema, kein Prosa-Text drumherum". Antworten ohne valides JSON werden verworfen. |
| Validierung | **Strikt** gegen das Antwort-Schema (unten). Schema-Mismatch → `ExplainResult.available:false` mit `reason:"Antwort entsprach nicht dem Schema"`. |
| Fehlertoleranz | Scheitert nie throw. Resolved mit `{available:false, reason, fallbackScore}` bei HTTP-4xx/5xx, Timeout, Netz-Fehler, Schema-Mismatch. Aufrufer fällt auf Stufe-A-Resultat zurück. |
| Rate-Limit | Modul 04 fügt **keine eigene Drossel** ein. Aufrufer (Modul 06 / 08 / 00) drosselt selbst — Empfehlung: max. 1 Stufe-B-Call/s/Knoten bei Anthropic-API-Standard-Quota. |
| User-Key | `apiKey` kommt aus dem Identitäts-Container (Vision-Anker 5, PULS) — **niemals plain aus IndexedDB**. Plattform-Matrix §6.2 Spalte „Stufe B" listet die vier Key-Lokalisations-Varianten Plattform-agnostisch. Modul 04 konsumiert den Key als opaque String. |
| Abort | `options.abortSignal` durchgereicht. `AbortError` wird **nicht** abgefangen — Aufrufer fängt selbst. |

**Antwort-JSON-Schema** (Modul 04 validiert strikt):

```jsonc
{
  "schichten": {
    "fachlich":   { "score": <number, [-1,1]>, "begruendung": "<deutsch, ≤200 Zeichen>" },
    "prozess":    { "score": <number, [-1,1]>, "begruendung": "<deutsch, ≤200 Zeichen>" },
    "skalierung": { "score": <number, [-1,1]>, "begruendung": "<deutsch, ≤200 Zeichen>" }
  },
  "bruecke": {                           // optional — null wenn kein Brücken-Vorschlag
    "needed":         "<deutscher Klartext, ≤300 Zeichen>",
    "lookingFor":     "<deutscher Klartext, ≤300 Zeichen> | null",
    "candidateScope": "lokal" | "mailbox" | "netz"
                     // Modul 04 korrigiert "netz" still auf "lokal", bis
                     //   Anker 10-12 da sind (siehe § Brücken-Feld-Spec).
  },
  "erklaerung":              "<deutscher Klartext, ≤600 Zeichen, fasst das Match zusammen>",
  "overrideRecommendation":  "established" | "established-with-bridge" | "rejected" | null
                             // null = keine Stufe-B-Übersteuerung; Stufe-A-Schwellen gelten.
}
```

**Rückgabe (`ExplainResult`)** — Modul 04 verpackt das LLM-Ergebnis:

```jsonc
{
  "available":              true | false,
  "schichten":              { /* wie oben */ } | null,
  "bruecke":                BridgeProposal | null,
  "erklaerung":             "<string>" | null,
  "overrideRecommendation": "established" | "established-with-bridge" | "rejected" | null,
  "fallbackScore":          0.83,                            // = matchResult.overall (Stufe-A-Resultat)
  "reason":                 "<deutscher Grund bei available:false>" | null,
                                                              // z.B. "API HTTP 429 (Rate-Limit)",
                                                              //      "Antwort entsprach nicht dem Schema",
                                                              //      "Netz nicht erreichbar"
  "model":                  "claude-sonnet-4",                // verwendetes Modell
  "tokensUsed":             421 | null                        // input+output, fail-soft wenn API es nicht liefert
}
```

**Beispiel-Output für eine Match-Sitzung mit zwei Personas** (Brücke
zu Brief 04 Multi-Identität — die zwei Personas hier sind zwei
unabhängige Identitäts-Slots im selben IndexedDB-Schema aus Anker 6):

```jsonc
// Persona A („Klaus privat — Kochrezepte"):
//   embeddingCapabilities = domainVector der Rezeptbuch-Spore
//   embeddingNeeds        = Vektor für „Wein-Empfehlungen, die zu Hauptgang passen"
//
// Persona B („Klaus beruflich — Wein-Verkostungen"):
//   embeddingCapabilities = Vektor für „Wein-Verkostungs-Notizen"
//   embeddingNeeds        = null   ← reiner Anbieter, Persona B sucht nichts
//
// matchDimensions(A.cap, A.needs, B.cap, B.needs)
//   Lane 1 (A.cap × B.needs): nicht berechenbar (B.needs=null) → übersprungen
//   Lane 2 (A.needs × B.cap): cosinus(A.Wein-Suche × B.Wein-Verkostung) = 0.83
//   availableLanes = 1
//   Schichten: fachlich = prozess = skalierung = 0.83 (gleicher Lane-Wert,
//                                                       Stufe-A-Heuristik)
//   overall = 0.83
//
// explainMatchLLM(matchResult, apiKey) liefert:
{
  "available": true,
  "schichten": {
    "fachlich":   { "score": 0.91, "begruendung": "Wein-Verkostungs-Notizen passen direkt zu Wein-Empfehlungen für Hauptgang" },
    "prozess":    { "score": 0.62, "begruendung": "Persona A pflegt täglich, Persona B nur wenn neue Verkostung — Prozess-Mismatch" },
    "skalierung": { "score": 0.88, "begruendung": "Beide Single-Knoten ohne Cluster-Ambition" }
  },
  "bruecke": null,                            // kein Brücken-Vorschlag nötig
  "erklaerung": "Anbieter-Sucher-Match auf Wein-Domain; Prozess-Lücke (kontinuierlich vs. ereignisbasiert) verhindert vollen Match nicht, weil A explizit nach Verkostungs-Wissen sucht.",
  "overrideRecommendation": "established",
  "fallbackScore": 0.83,
  "reason": null,
  "model": "claude-sonnet-4",
  "tokensUsed": 421
}
```

Persona-Quelle für die zwei Vektor-Slots pro Persona ist Brief 04
(Multi-Identität — `sbkim_keys["main"]` / `["beruflich"]` / `["test"]`
+ `sbkim_meta["active-identity"]`-Marker). Brief 03 spezifiziert nur,
dass Modul 04 die zwei Vektor-Slots **pro Persona unabhängig**
konsumiert; die Mehr-Slot-Logik selbst liegt in Brief 04.

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
| `matchDimensions(qCap, qNeeds, pCap, pNeeds)` alle vier Vektoren null | wirft `DimensionsAllNullError` sync. Keine Schicht berechenbar; Aufrufer hätte vorher prüfen müssen. |
| `matchDimensions` mit einer Seite vollständig null (z.B. `queryCap=null` UND `queryNeeds=null`) | **kein** Throw. Alle Schichten und `overall` sind `null`, `availableLanes:0`. Aufrufer entscheidet (typisch: Single-Vector-Pfad `match()`). |
| `matchDimensions` mit Längen-Differenz oder Nicht-Float32Array in einem nicht-null Vektor | wirft `InvalidVectorError` bzw. `ShapeMismatchError` analog `match()`. |
| `explainMatchLLM(matchResult, apiKey)` mit leerem `apiKey` oder kein String | wirft `InvalidApiKeyError` sync, vor Netz-Aufruf. Stufe B ist opt-in (siehe INTERFACES.md §7). |
| `explainMatchLLM` mit fehlerhaftem `matchResult` (kein `MatchDimensionsResult`) | wirft `InvalidMatchResultError` sync, vor Netz-Aufruf. |
| `explainMatchLLM` LLM-API HTTP-Fehler (4xx/5xx), Timeout, Netz-Fehler | **kein** Throw. Resolved mit `{available:false, reason:"<deutsch>", fallbackScore:overall}`. Aufrufer fällt auf Stufe-A-Resultat zurück; UI zeigt „Erklärung nicht verfügbar". |
| `explainMatchLLM` LLM-Antwort kein valides JSON oder Schema-Mismatch | **kein** Throw. Resolved mit `{available:false, reason:"Antwort entsprach nicht dem Schema", fallbackScore:overall}`. Modul 04 verwirft die LLM-Antwort still — kein Halb-Resultat. |
| `explainMatchLLM` `abortSignal` triggert | `AbortError` (Standard-DOM-Verhalten, durchgereicht). Aufrufer fängt selbst. |

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
   `MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/matchDimensions, Schwellen: PROVIDER_MIN_MATCH=0.80, SCHICHT_MIN_MATCH=0.60`
   zu suchen (erscheint **beim Laden**, vor jedem Klick; Bau-04.A-
   Format mit drei Funktionen und zwei Schwellen).
7. **`matchDimensions` bidirektional** (Bau 04.A, 2026-05-19) — vier
   384-dim-Float32Arrays (`qCap`/`qNeeds`/`pCap`/`pNeeds`) via
   deterministischem LCG erzeugt + L2-normalisiert (KEIN
   SbkimEmbedding-Lade, kein Modell-Overhead beim Test). Aufruf
   `SbkimMatch.matchDimensions(qCap, qNeeds, pCap, pNeeds)`. Erwartung:
   `availableLanes: 2`, alle drei Schichten gleich (Stufe-A-Heuristik —
   echte Differenzierung kommt in Bau 04.B via `explainMatchLLM`),
   `overall === Schicht-Score`, `bruecke: null`.
8. **`matchDimensions` Nur-Anbieter-Modus** (Bau 04.A) — eine Seite
   vollständig null (`queryCap === null && queryNeeds === null`).
   Erwartung: alle Schichten null, `availableLanes: 0`, KEIN Throw —
   Aufrufer fällt auf `match(domainVectorA, domainVectorB)` zurück.
9. **`matchDimensions` alle vier null (Fehler erwartet)** (Bau 04.A) —
   Aufruf mit `(null, null, null, null)`. Erwartung:
   `DimensionsAllNullError` **synchron** geworfen, sprechende Message
   in deutsch. Aufrufer hätte vor dem Aufruf prüfen müssen (siehe
   § Fehlerverhalten).

Die Schwellwerte 0.92 / 0.90 / 0.80 sind die im Sichttest 2026-05-14
empirisch ermittelten Trennlinien — siehe Beleg-Block unten. Sie
ersetzen die früheren Erst-Schätzungen 0.70 / 0.40 / 0.55, die im
selben Sichttest Schwellen-Drift offenbarten (Auspuffrohr 0.8967
statt < 0.40; Tarantino 0.7737 statt < 0.55). Knöpfe 7–9 nutzen
deterministische LCG-Vektoren statt SbkimEmbedding, weil
`matchDimensions` zustandslos + reine Funktion ist und kein
Modell-Lade braucht.

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
| Spec M04-Erweiterung (Brief 03) | 2026-05-19 | Spec M04-Erweiterung | Strang 2 der V1-Sammelspec-Kaskade (Brief 03; Brief 01-PR #96 + Brief 02-PR #97 als gemerged vorausgesetzt). Karte 04 additiv erweitert: § Schnittstelle um zwei neue Funktionen `matchDimensions(qCap, qNeeds, pCap, pNeeds) → MatchDimensionsResult` (sync, drei Cosinus-Aufrufe + gewichteter `overall`, `availableLanes` 0/1/2) und `explainMatchLLM(matchResult, apiKey, options?) → Promise<ExplainResult>` (async, einziger Netz-/async-Pfad, fehlertolerant — scheitert nie throw, resolved mit `available:false` bei API-/Schema-Fehlern) plus neue Konstante `SCHICHT_MIN_MATCH = 0.60`; § Schnittstelle-Einleitung von „zwei Funktionen + eine Konstante" auf „vier Funktionen + zwei Konstanten" angepasst. Vier neue Sub-Blöcke nach § Konfigurationswerte: § Drei-Schichten-Modell (orthogonal `fachlich` / `prozess` / `skalierung`, Tabelle Paper-Name-Korrespondenz, Lane-Berechnung, Mittelwert-vs-Min-Begründung, Nur-Anbieter-Modus mit Rückwärts-Kompatibilität), § Brücken-Feld-Spec (`BridgeProposal` mit `needed` / `lookingFor` / `candidateScope`; drei Werte mit Verfügbarkeits-Hinweis — `lokal` heute, `mailbox` bedingt Modul 13, `netz` formal nicht aktivierbar bis Anker 10-12), § Schwellen-Vertrag (`PROVIDER_MIN_MATCH=0.80` für `overall`, `SCHICHT_MIN_MATCH=0.60` pro Dimension, 5 Auswertungs-Regeln, Stufe-B-Übersteuerung), § Stufe-B-Vertrag (Modell + max_tokens + JSON-only-Output + Antwort-Schema + `ExplainResult` + Fehlertoleranz + Rate-Limit-Awareness + User-Key-Handling Plattform-agnostisch + Beispiel-Output mit zwei Personas als Brücke zu Brief 04). § Stamm/Gast-Klassifikation-Hinweis-Block **unverändert** (Schichten sind orthogonale Schicht zur Stamm/Gast-Klassifikation; explizit beide bleiben getrennt). § Fehlerverhalten um sieben neue Zeilen erweitert (DimensionsAllNullError, einseitig-null = kein Throw, Längen-/Form-Fehler analog `match()`, InvalidApiKeyError, InvalidMatchResultError, LLM-HTTP-/Schema-/Abort-Fälle fehlertolerant). **PROTOCOL_VERSION bleibt `"0.1"`** — beide neuen Funktionen sind additiv, `match` und `isAboveProviderThreshold` bleiben wortwörtlich erhalten, alte Aufrufer brechen nicht. INTERFACES.md §0 (drei neue Konstanten: `SCHICHT_MIN_MATCH=0.60`, `STUFE_B_DEFAULT_MODEL`, `STUFE_B_MAX_TOKENS`), §1 Modul 04 (Bietet-Block erweitert + vier neue Sub-Blöcke + Fehlerverhalten + Garantien), §7 (LLM-Stufe-B-Ehrlichkeits-Klausel neu), §8 (Anti-Missbrauch-Klausel neu), §9 (Änderungsprotokoll, war §7) nachgezogen. **`status.json` unverändert** — Modul 04 bleibt `score:"stub"` (additive Spec-Erweiterung am Karten-Vertrag, kein Code-Bau, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Kein Code** in `src/modules/04_match.js` — Bau-Folge-Sitzungen (Stufe A erweitert ~2-3 h, Stufe B ~5-8 h) folgen als eigene Phasen. **Keine `tests/manual_check.html`-Änderung** — Panel 04 wartet auf Bau. Manueller-Test-Block in Karte 04 bleibt auf der heutigen 6-Knöpfe-Form (Stufe-A-only); Bau-Folge-Sitzungen ergänzen ihn um die neuen Pfade. |
| Bau 04.A `matchDimensions` sync | 2026-05-19 | Bau 04.A `matchDimensions` synchron in Modul 04 | Erste Bau-Sitzung der M04-Erweiterung aus Brief 03. Brief BAU_04A_MATCH_DIMENSIONS (PR #109 gemerged 2026-05-19, `main` `ae98842`) als Spec-Vorlage. **Code in `src/modules/04_match.js` additiv** (kein Refactoring der bestehenden `match` / `isAboveProviderThreshold`): neue Konstante `SCHICHT_MIN_MATCH = 0.60` (modul-lokal gespiegelt aus § 0); neue Fehler-Factory `DimensionsAllNullError` (sync, von `matchDimensions` bei allen vier null); Closure-Helper `cosineSafe(a, b)` (intern, null-safe wrapper um `match`); neue Funktion `matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)` sync gemäß Karte 04 § Drei-Schichten-Modell — Lane-Berechnung (Lane 1 = queryCap × passageNeeds, Lane 2 = queryNeeds × passageCap), `availableLanes ∈ {0,1,2}`, Schicht-Score = Mittelwert berechenbarer Lanes, **Stufe-A-Heuristik:** alle drei Schichten (fachlich/prozess/skalierung) ergeben denselben Lane-Cosinus (echte Differenzierung kommt in Stufe B / Bau 04.B), `overall = Mittelwert der nicht-null Schichten` (in Stufe A === Schicht-Score), `bruecke: null` (Bau 04.B füllt das via `explainMatchLLM`), `DimensionsAllNullError` SYNCHRON bei allen vier null, Nur-Anbieter-Modus (eine Seite vollständig null) → alle Schichten null + `availableLanes:0` + kein Throw. **Selbstcheck-Zeile auf drei Funktionen erweitert** (`match/isAboveProviderThreshold/matchDimensions`); Schwellen-Block nennt jetzt beide (`PROVIDER_MIN_MATCH=0.80`, `SCHICHT_MIN_MATCH=0.60`). `_meta` um `schichtMinMatch` + `matchDimensionsLanes` Read-Anker erweitert. **Karte 04** § Manueller Test um drei neue Knöpfe (7 bidirektional / 8 Nur-Anbieter / 9 alle-vier-null), Knopf-6-Selbstcheck-Format-Zeile auf neuen Stand; § Bauzustand neue Zeile. **Panel 04** in `tests/manual_check.html` um drei Knöpfe erweitert (deterministische LCG-Vektoren statt SbkimEmbedding — `matchDimensions` zustandslos, kein Modell-Lade nötig). **Smoke-Test** `tests/smoke_bau04a_match_dimensions.mjs` als reine Funktions-Probe in Node 22 (kein fake-indexeddb): 19 Sub-Proben, 19 grün, 0 rot. Regression-Smoke-Tests Bau-02.Y 33/33 + Pflege-01 8/8 weiterhin grün. **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`**. KEIN Modul-01/02/03/05/06/07/08-Eingriff, KEIN `explainMatchLLM` (Bau 04.B kommt mit eigenem Brief), KEIN `BridgeProposal`-Code, KEINE Sage-Page-Änderung, KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 04 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen). `node --check src/modules/04_match.js` grün; alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. |
| Sichttest (Bau 04.A) | 2026-05-19 | Bau 04.A `matchDimensions` synchron in Modul 04 | **ungeprüft, weil headless gebaut — wartet auf Klaus' Browser-Lauf** der drei neuen Panel-04-Knöpfe (7 bidirektional / 8 Nur-Anbieter / 9 DimensionsAllNullError). |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 03 (Embedding) — liefert L2-normalisierte Vektoren
- **Wird genutzt von:** Modul 05 (Anastomose) — entscheidet anhand des Scores; Modul 07 (Apoptose) — markiert Pfade unterhalb der Schwelle für die Selbstlöschung
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview), Eintrag 04 · [Karte 11 · Wanderung](../../index.html#screen-overview) (A1–B3-Pfade)
- **Glossar:** [Cosine-Sim](../GLOSSAR.md), [Domänen-Vektor](../GLOSSAR.md), [Schwellwert](../GLOSSAR.md)
- **Integration:** `sbkim_integration.md` §6 (Bewertungsfunktion)
- **Interfaces:** [`INTERFACES.md` §1 → Modul 04_match](../INTERFACES.md)
