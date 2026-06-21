# Hybrid-Match — Einbau-Anleitung (kopierbar für jeden Knoten)

> **Status:** Einbau-Anleitung 2026-06-20 (Folge zu Bau 04.D). **Anleitung,
> kein neues Modul** — der Richter selbst lebt in `src/modules/04_match.js`
> (`SbkimMatch.hybridMatch`). Diese Datei zeigt, wie ein Endknoten den
> Richter mit **seinem eigenen** API-Schlüssel (BYOK) ans Such-Feld hängt.
> Erster Pilot: **BookLedgerPro (BLP)** (EU-Knoten, Mistral-Schlüssel vorhanden).
>
> Querverweise: [`HYBRID-MATCH-KONZEPT.md`](HYBRID-MATCH-KONZEPT.md) ·
> [`components/04_match.md`](components/04_match.md) § Hybrid-Match-Schicht ·
> [`INTERFACES.md`](INTERFACES.md) § 1 Modul 04 + § 7.1.

---

## In einem Satz

Der Knoten hat **schon** einen KI-Schlüssel (BLP: Mistral). Diese Anleitung
reicht ihn an `SbkimMatch.hybridMatch` weiter — **mehr ist nicht nötig**.
Kein separates KI-Tool, keine neue API-Anbindung. Nur Code, der den
vorhandenen Schlüssel benutzt.

## Das Drei-Stufen-Bild (zur Erinnerung)

```
1. VORFILTER (lokal, server-los, IMMER):
   Modul 03 Embedding + Modul 04 queryLocal → grobe Kandidaten (Cosinus).
   Braucht KEINEN Schlüssel. Läuft offline.
2. RICHTER (opt-in, mit dem App-eigenen Mistral-Schlüssel):
   SbkimMatch.hybridMatch(query, candidates, {apiKey, provider:"mistral"})
   → echtes Urteil pro Kandidat (passt / passt-nicht + Begründung + Score).
3. FAIL-SOFT:
   Kein Schlüssel ODER Mistral nicht erreichbar → Vorfilter-Ergebnis gilt.
   Kein Stillstand, kein Fehler.
```

---

## Voraussetzungen im Endknoten

1. **Module geladen** (wie bei jedem SBKIM-Andock, Anleitung 09):
   `01_storage.js` → `02_spore.js` → `03_embedding.js` → `04_match.js`.
   (`hybridMatch` braucht zur Laufzeit nur Modul 03 für den Vorfilter; der
   Richter selbst hat keine SBKIM-Abhängigkeit.)
2. **Ein lokaler Vektor-Korpus** mit pre-computed `passageVec` pro Eintrag —
   das ist das, was der Knoten durchsuchbar machen will. Bei BLP z.B. die
   Buchungs-Kategorien / Konten-Beschreibungen; bei Mein-Rezeptbuch die
   Rezepte. Schema pro Eintrag:

   ```js
   { label: "anzeigbarer Titel",
     text:  "Bedeutungs-Text, den der Richter liest",   // Pflicht für Stufe 2
     passageVec: Float32Array(384),                      // via SbkimEmbedding.embedPassage
     anchorId: "opake-id" }                              // optional
   ```

   `passageVec` füttert den lokalen Vorfilter; `text` füttert den Richter.
3. **Der vorhandene API-Schlüssel** des Knotens (BLP: Mistral). Liegt **nicht
   im Code** — der Knoten reicht ihn zur Laufzeit durch (BYOK).

---

## Der kopierbare Einbau-Helfer

Eine vollständige Funktion. In den Knopf-Handler des Such-Felds kopieren
(oder in `sbkim/sbkim-hybrid-search.js` ablegen und einbinden):

```js
// SBKIM Hybrid-Suche — Vorfilter (lokal) + Richter (opt-in) + Fail-soft.
// Rückgabe: { mode, treffer[], reason?, attestation? }
//   mode: "vorfilter-leer" | "nur-vorfilter" | "fail-soft-vorfilter" | "richter"
async function sbkimHybridSearch(text, corpus, opts) {
  opts = opts || {};
  const k = opts.k || 5;

  // 1. VORFILTER (lokal, server-los) — grobe Kandidaten via Modul 04.
  const prelim = await window.SbkimMatch.queryLocal(text, k, { corpus });
  if (prelim.length === 0) {
    return { mode: "vorfilter-leer", treffer: [] };
  }

  // Ohne Schlüssel: server-loser Default — Vorfilter ist das Ergebnis.
  if (!opts.apiKey) {
    return { mode: "nur-vorfilter", treffer: prelim };
  }

  // 2. Kandidaten für den Richter aufbereiten (Bedeutungs-Text dazuholen).
  //    Map per anchorId (eindeutig), Fallback label.
  const byKey = new Map();
  for (const c of corpus) byKey.set(c.anchorId || c.label, c);
  const candidates = prelim.map((r) => {
    const src = byKey.get(r.anchorId || r.label) || {};
    return {
      label: r.label,
      text: src.text || r.label,   // Richter braucht Bedeutungs-Text
      cosine: r.score,
      anchorId: r.anchorId,
    };
  });

  // 3. RICHTER (opt-in) — mit dem App-eigenen Schlüssel.
  const judgment = await window.SbkimMatch.hybridMatch(
    { text: text, label: opts.queryLabel || null },
    candidates,
    {
      apiKey: opts.apiKey,
      provider: opts.provider || "mistral",   // BLP: EU-Anbieter
      euOnly: opts.euOnly !== false,           // DSGVO-Default an
    },
  );

  // 4. FAIL-SOFT — Richter nicht verfügbar → Vorfilter gilt weiter.
  if (!judgment.available) {
    return { mode: "fail-soft-vorfilter", reason: judgment.reason, treffer: prelim };
  }

  // 5. Richter-Urteil — nur passende Kandidaten, nach Score sortiert.
  const treffer = judgment.verdicts
    .filter((v) => v.passt)
    .sort((a, b) => b.score - a.score);
  return { mode: "richter", treffer: treffer, attestation: judgment.attestation };
}
```

### Aufruf am Such-Feld (BLP-Beispiel)

```js
// corpus + mistralKey kommen aus dem Knoten (nicht aus dem Code).
const ergebnis = await sbkimHybridSearch(sucheingabe, corpus, {
  apiKey: mistralKey,        // BLPs vorhandener Mistral-Schlüssel
  provider: "mistral",
  euOnly: true,              // BLP ist EU-Knoten
  queryLabel: "BookLedgerPro",
});

// Anzeige je nach mode:
//   "richter"            → ergebnis.treffer mit v.begruendung anzeigen (echtes Urteil)
//   "fail-soft-vorfilter"→ ergebnis.treffer (Cosinus) + dezenter Hinweis ergebnis.reason
//   "nur-vorfilter"      → ergebnis.treffer (Cosinus), kein Schlüssel hinterlegt
//   "vorfilter-leer"     → "keine Treffer"
```

**Wichtig:** Egal welcher `mode` — der Nutzer bekommt **immer** etwas
Sinnvolles. Der Richter verbessert das Ergebnis, ist aber **nie** eine
Eintritts-Barriere. Genau das ist das Fail-soft-Versprechen.

---

## Bezeugung (optional — Signier-Helfer ist Folge-Arbeit)

Bei `mode === "richter"` liefert `ergebnis.attestation` ein **signierbares**
Urteil-Objekt (Anbieter-Marker + Datum + Verdicts) — fertig serialisierbar,
um eine Match-Tat zu bezeugen:

```js
if (ergebnis.attestation) {
  // ergebnis.attestation ist ein reines JSON-Objekt:
  // { kind:"sbkim-hybrid-match-judgment", version:1, judgedAt, provider,
  //   model, region, queryLabel, verdicts:[{label,anchorId,passt,score,begruendung}] }
  // → mit der eigenen Identität signieren und in die Inbox legen.
}
```

**Ehrlicher Stand:** Modul 04 signiert **nie selbst** (kein Schlüssel-
Zugriff) — die Signatur ist bewusst Aufrufer-Sache. **Aber:** Modul 02 hat
heute **keine** öffentliche „signiere-beliebiges-Objekt"-Funktion; das
Signieren lebt aktuell nur intern in `generateOwnSpore`. Eine kleine
Folge-Sitzung muss in Modul 02 einen öffentlichen Signier-Helfer
(`SbkimSpore.signPayload(obj)` o.ä.) ergänzen, bevor die Bezeugung als
Einzeiler funktioniert. Bis dahin: das `attestation`-Objekt **roh**
(unsigniert) ablegen oder die Bezeugung zurückstellen — der Richter
funktioniert auch ohne Signatur voll.

---

## Was du NICHT tun musst

- **Kein separates KI-Tool installieren.** Der Richter ist eine Funktion.
- **Keine neue API-Anbindung.** Der vorhandene Mistral-Schlüssel reicht.
- **Den Schlüssel nicht in den Code schreiben.** BYOK — zur Laufzeit
  durchreichen (z.B. aus dem App-Einstellungs-Feld / Identitäts-Container).
- **Den Vorfilter nicht abschalten.** Er bleibt das server-lose Rückgrat;
  der Richter sitzt obendrauf.

---

## Welche Anbieter taugen als Richter — und welche NICHT

Der Richter braucht ein **Sprach-Reasoning-Modell**: es liest die
Kandidaten-Texte und fällt ein begründetes Urteil (`passt` / `passt-nicht`
+ `score` + Begründung). Genau dafür ist die Anbieter-Liste gedacht:

| Anbieter | Region | Als Richter? |
|---|---|---|
| `claude` (Anthropic) | US | ✅ Reasoning-LLM |
| `mistral` (EU) | EU | ✅ Reasoning-LLM — EU-Default (BLP) |
| `openai` | US | ✅ Reasoning-LLM |
| `local` (selbst-gehostet, OpenAI-kompatibel) | lokal | ✅ Reasoning-LLM |

**Google Vision gehört NICHT in diese Liste.** Vision ist eine **Bild-API**
(OCR + Bild-Labels), kein Text-Urteiler — es kann „passt/passt-nicht mit
Begründung" gar nicht liefern und würde an der Richter-Schnittstelle nichts
Brauchbares zurückgeben. Auch das Sortieren fertiger Vektoren macht Vision
nicht (das machen Modul 03 Embedding + Cosinus).

**Wo Vision RICHTIG stark ist: die OCR-Vorstufe — vor Modul 03, nicht im
Richter.** Besonders für BLP (Beleg-/Rechnungsfotos):

```
[Beleg-Foto] → Google Vision (OCR: Bild → Text)
             → Modul 03 Embedding (Text → Vektor)
             → Richter Mistral (urteilt: passt der Beleg zur Kategorie?)
```

Vision = Augen (Bild → Text), Richter = Verstand (Text → Urteil). Eine
mögliche OCR-Vorstufe ist eine **eigene, spätere Spec** (BLP-getrieben),
**nicht** Teil von Modul 04. (Klaus' Befund 2026-06-21.)

---

## Übertragung in andere Knoten / Sitzungen

Diese Anleitung ist knoten-unabhängig. Pro Knoten ändert sich nur:

| Knoten | `provider` | `euOnly` | Korpus |
|---|---|---|---|
| **BookLedgerPro** | `"mistral"` | `true` | Konten / Kategorien-Beschreibungen |
| Mein-Rezeptbuch | `"mistral"` oder `"claude"` | je nach Schlüssel | Rezepte |
| Mein-Mixarium | `"mistral"` oder `"claude"` | je nach Schlüssel | Cocktails / Drinks |
| Sage-Protokol | `"claude"` | `false` | Modul-Karten / Doku |

Der Helfer `sbkimHybridSearch` selbst bleibt **wortwörtlich gleich** — nur
das `opts`-Objekt am Aufruf wird pro Knoten angepasst. Das ist die
„kopierbare Version".

---

## Reihenfolge (verbindlich, Klaus 2026-06-20)

1. **Sage-Sichttest** Panel 04 Knöpfe 16–19 (Mock-LLM, kein Schlüssel) —
   beweist, dass der Richter sauber läuft. **Erst grün, dann einbauen.**
2. **BLP-Pilot** mit echtem Mistral-Schlüssel — erster echter Richter-Lauf.
3. **Andere Knoten** (Rezeptbuch / Mixarium) per Copy-Paste nachziehen.
