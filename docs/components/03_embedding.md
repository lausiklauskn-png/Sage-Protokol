# Modul 03 — Embedding (Text → semantischer Vektor)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/03_embedding.js`
**Abhängigkeiten:** keine (lädt eigenes Modell von HuggingFace bei init)

---

## Zweck

Wandelt Texte in 384-dimensionale Vektoren (Float32Array). Ähnlich
bedeutende Texte erzeugen ähnliche Vektoren — die Grundlage des
semantischen Matchings.

Modell: `Xenova/multilingual-e5-small` (mehrsprachig, kompakt,
~30 MB Download, läuft im Browser via transformers.js / WebAssembly).

---

## Verantwortung

**Macht:**
- Lazy-Init des Modells beim ersten `embedText()`-Aufruf
- Tokenisierung + Mean-Pooling (nach Konvention von e5-small)
- Float32Array(384) zurückgeben
- Modell-Cache nutzen, damit zweite Sitzung nicht neu lädt

**Macht nicht:**
- Kein eigenes Storage (das Modell-Cache verwaltet transformers.js selbst)
- Keine Sprachenerkennung (das Modell ist mehrsprachig)
- Keine Klassifikation (nur Encoding)

---

## Schnittstelle

*(noch zu spezifizieren)*

Skizze:

```
init() → Promise<void>
  // lädt das Modell ggf. herunter, setzt isReady=true

isReady() → boolean

embedText(text: string) → Promise<Float32Array>  // Länge 384
embedBatch(texts: string[]) → Promise<Float32Array[]>
```

---

## Konfigurationswerte

```
EMBEDDING_MODEL = "Xenova/multilingual-e5-small"
EMBEDDING_DIM   = 384
```

---

## Manueller Test

1. `tests/manual_check.html`: Knopf "Embedding init".
   Erwartung: nach erstem Lauf "Modell geladen" + Cache-Hinweis.
2. Knopf "Embedding round-trip": Text "Käsekuchen mit Quark" → Array
   der Länge 384, alle Werte Float32.
3. Knopf "Cosine zwischen 'Käsekuchen' und 'Käsetorte'": > 0.7.
4. Knopf "Cosine zwischen 'Käsekuchen' und 'Auspuffrohr'": < 0.4.

(Schritt 3+4 nutzt Modul 04 — gehört in dessen manuellen Test, sobald
04 existiert.)

---

## Risiken / Edge Cases

- Erster Lauf benötigt Internet zum Modelldownload. Offline danach OK.
- Speicherbedarf des Modells: ~30 MB im Browser-Cache.
- Sehr lange Texte: bei e5-small Input-Limit ca. 512 Tokens. Längere
  Texte abschneiden (Spec entscheidet, ob warnen oder still abschneiden).
- Vektor-Norm: e5-Modelle benötigen Prefix `"query: "` bzw. `"passage: "`
  für besten Match. → Spec klärt, ob wir das anwenden.

---

## Querverweise

- `sbkim_integration.md` §4.1 (Default-Modell)
- transformers.js Dokumentation (extern)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
