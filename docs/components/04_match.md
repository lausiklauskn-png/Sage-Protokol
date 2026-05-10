# Modul 04 — Match (Vektorvergleich, Domänen-Vektor)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/04_match.js`
**Abhängigkeiten:** Modul 03 (Embedding)

---

## Zweck

Vergleicht zwei Embedding-Vektoren auf Ähnlichkeit (Cosine-Sim) und
verwaltet den **Domänen-Vektor** des eigenen Knotens — also die Frage:
"Passt diese Anfrage in meine Domäne?"

Der Domänen-Vektor entsteht aus Beschreibung + Stichworten der eigenen
Domäne und wird einmalig berechnet.

---

## Verantwortung

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

*(noch zu spezifizieren)*

Skizze:

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

---

## Konfigurationswerte

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

## Risiken / Edge Cases

- Vektor-Norm: cosineSim erwartet (a·b) / (|a||b|). Bei Vektoren mit
  Länge 0 → Score 0 (nicht NaN).
- Domain-Vektor-Persistenz: speichern in `sbkim_spore` zusammen mit der
  Spore? Oder eigener Store? → Spec klärt.
- Mehrsprachige Domänen-Beschreibungen → e5-Modell verträgt das.

---

## Querverweise

- `sbkim_integration.md` §6 (Bewertungsfunktion)
- Modul 03 (liefert die Embeddings)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
