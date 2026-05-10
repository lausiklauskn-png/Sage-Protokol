# Modul 04 — Match

> **Status:** 🟫 Schablone  ·  **Schicht:** Kern  ·  **Anker:** Sage-Page → Karte 4, Eintrag 04
> **Datei (Code):** `src/modules/04_match.js`
>
> _Cosine-Sim zwischen Anfrage-Vektor und Domänen-Vektor — die
> Bedeutungs-Türsteher-Funktion: passt das in meine Domäne?_

---

## Im Mycel-Bild

Match ist die **Domänen-Türsteher-Funktion** des Knotens. Eine Anfrage
trägt einen Vektor (von Modul 03). Der Knoten hat seinen eigenen
Domänen-Vektor — die geometrische Mitte dessen, worüber er Auskunft
geben kann. Der Cosine zwischen beiden Vektoren ist der Türschlüssel:
liegt er über `PROVIDER_MIN_MATCH = 0.55`, antwortet der Knoten;
darunter schweigt er. Kein Schweigen ist Höflichkeit, sondern
Bedeutungs-Routing: wer nicht passt, kriegt nichts.

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

  <!-- Schwellen-Kegel: cosine 0.55 entspricht ~56.6° Öffnung -->
  <path d="M 240 160 L 440 70 A 200 200 0 0 0 440 250 Z" fill="#16A34A" fill-opacity="0.10" stroke="#16A34A" stroke-opacity="0.4" stroke-dasharray="4 3"/>
  <text x="370" y="60" font-size="11" font-family="ui-monospace,monospace" fill="#16A34A">cos &gt; 0.55</text>

  <!-- Domain-Vektor (Mitte, fest) -->
  <line x1="240" y1="160" x2="430" y2="160" stroke="#F59E0B" stroke-width="2.5"/>
  <polygon points="430,160 420,155 420,165" fill="#F59E0B"/>
  <text x="320" y="152" font-size="12" font-family="ui-monospace,monospace" fill="#F59E0B">Domänen-Vektor</text>

  <!-- Query-Vektor 1: passt -->
  <line x1="240" y1="160" x2="410" y2="105" stroke="#16A34A" stroke-width="2"/>
  <polygon points="410,105 401,110 405,116" fill="#16A34A"/>
  <text x="330" y="100" font-size="11" font-family="ui-monospace,monospace" fill="#16A34A">"Hefeteig" · 0.78 ✓</text>

  <!-- Query-Vektor 2: passt nicht -->
  <line x1="240" y1="160" x2="120" y2="60" stroke="#EA580C" stroke-width="2"/>
  <polygon points="120,60 130,65 126,72" fill="#EA580C"/>
  <text x="40" y="55" font-size="11" font-family="ui-monospace,monospace" fill="#EA580C">"Tarantino" · 0.18 ✗</text>

  <!-- Winkel-Bogen -->
  <path d="M 290 160 A 50 50 0 0 0 280 130" fill="none" stroke="#94A3B8" stroke-width="1"/>
  <text x="298" y="148" font-size="10" font-family="ui-monospace,monospace" fill="#94A3B8">θ</text>

  <text x="240" y="260" text-anchor="middle" font-size="11" font-family="ui-monospace,monospace" fill="#94A3B8">cos(θ) = (Domain · Query) / (|Domain| · |Query|)</text>
</svg>
```

---

## Zweck

Vergleicht zwei Embedding-Vektoren auf Ähnlichkeit (Cosine-Sim) und
verwaltet den **Domänen-Vektor** des eigenen Knotens — also die Frage:
"Passt diese Anfrage in meine Domäne?"

Der Domänen-Vektor entsteht aus Beschreibung + Stichworten der eigenen
Domäne und wird einmalig berechnet.

---

## Verantwortlichkeiten

**Macht:**
- `cosineSim(a, b)` für Float32Arrays gleicher Länge
- `computeDomainVector(description, keywords)` einmalig erzeugen,
  speichern, beim Init laden
- `matchAgainstDomain(queryEmbedding)` → Score 0..1
- Schwellwert-Helfer: `isAboveProviderThreshold(score)`

**Macht nicht:**
- Kein eigenes Embedding (delegiert an Modul 03)
- Keine Antwort-Erzeugung (das macht Modul 05)

---

## Schnittstelle

*(noch zu spezifizieren)* — Skizze:

```
init({
  domainDescription: string,
  domainKeywords: string[],
}) → Promise<void>
  // berechnet/lädt Domänen-Vektor

cosineSim(a: Float32Array, b: Float32Array) → number   // [-1, 1]
matchAgainstDomain(embedding: Float32Array) → number   // [0, 1] normiert
isAboveProviderThreshold(score: number) → boolean
getDomainVector() → Float32Array
```

### Konfigurationswerte

```
PROVIDER_MIN_MATCH = 0.55     // Antwort-Schwelle
```

---

## Manueller Test

1. `tests/manual_check.html`: "Match init" mit Domain "Kochrezepte" +
   Stichworten "Backen, Kuchen, Brot, Kochen, Saucen".
2. Knopf "Test: Anfrage 'Tipps für Hefeteig'": Score > 0.55, gibt true
   bei Threshold-Check.
3. Knopf "Test: Anfrage 'Drehbuch von Tarantino'": Score < 0.55, false.
4. Knopf "Test: Anfrage 'Cocktail mit Wodka'": Score-Grenzfall — beide
   Tests zeigen, dass Schwelle vernünftig liegt.

---

## Risiken & offene Punkte

- Vektor-Norm: cosineSim erwartet (a·b) / (|a||b|). Bei Vektoren mit
  Länge 0 → Score 0 (nicht NaN).
- Domain-Vektor-Persistenz: speichern in `sbkim_spore` zusammen mit der
  Spore? Oder eigener Store? → Spec klärt.
- Mehrsprachige Domänen-Beschreibungen → e5-Modell verträgt das.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Vektor-SVG, Querverweise |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 03 (Embedding)
- **Wird genutzt von:** Modul 05 (Anastomose)
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview), Eintrag 04
- **Glossar:** [Cosine-Sim](../GLOSSAR.md), [Domänen-Vektor](../GLOSSAR.md)
- **Integration:** `sbkim_integration.md` §6 (Bewertungsfunktion)
