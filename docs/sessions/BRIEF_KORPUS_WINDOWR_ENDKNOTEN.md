# BRIEF — Rezept-/Drink-Korpus + `window.R`-Fix in Rezeptbuch UND Mixarium

**Stand (2026-07-02):** Der A1/A4-Rollout ist in beiden Endknoten in den Cross-Knoten-
Antwort-Empfänger (`op:"query"` in `15_membran.js`) verdrahtet und gemergt (Mixarium PR #89,
Rezeptbuch PR #279). Modul 04 ist in beiden byte-1:1 auf Sage-Stand (hybrid/queryLocalMulti/
expandQuerySimple). **Aber der Empfänger antwortet live mit leerer Liste**, weil der lokale
**Korpus zur Laufzeit leer** ist — zwei Ursachen:

1. **`window.R`-Lücke (beide Apps):** Der Rezept-/Drink-State ist ein **top-level `let R`** —
   der hängt **nicht** am `window`-Objekt. Trotzdem lesen mehrere Stellen `window.R`
   (Mixariums Korpus-Provider `buildMixariumQueryCorpus`; Rezeptbuchs Domänen-Vektor
   `sampleContent` + weitere `(window.R||[])`-Leser). → `window.R` ist `undefined` → alle
   diese Leser bekommen `[]`.
2. **Rezeptbuch hat noch KEINEN Korpus-Provider:** `sbkim-init.js` ruft nie
   `SbkimMatch.setLocalCorpus(...)` (anders als Mixarium, das den Provider hat — aber wegen
   (1) leer läuft).

## Aufgabe

**Beide Apps live funktionsfähig machen** für die Cross-Knoten-Bedeutungs-Antwort.

### Schritt 1 — `window.R` sauber exponieren (beide Apps)
`let R` wird an mehreren Stellen **reassigned** (`R=[]` beim Laden, dann befüllt) → ein
einmaliges `window.R = R` **verpufft**. Nötig ist ein Zugriff, der **immer das aktuelle R**
liefert. Empfehlung: in der QC/im Haupt-Script (dort, wo `R` im lexikalischen Scope liegt)
einen **Live-Getter** definieren, der die Bindung schließt:
```js
window.__sbkimGetRecipes = function(){ return R; };   // schließt über let R → immer aktuell
```
- **Mixarium:** `QC_Mixarium_20_04_26.html` bearbeiten → `index.html` **byte-identisch spiegeln**
  (`cp` / md5-Vergleich; kein build.py). SW `SW_VERSION` bumpen.
- **Rezeptbuch:** `QC_MeinRezb_24_04_26.html` (neueste QC) bearbeiten → `python3 build.py`
  (deterministisch verifiziert). `app-sw.js` `CACHE` bumpen.
- Alternativ (falls sauberer): die bestehenden `window.R`-Leser auf den Getter umstellen ODER
  `window.R` nach **jedem** Reassignment synchron halten — Getter ist der geringste Eingriff.

### Schritt 2 — Rezept-Korpus-Provider in Rezeptbuch (`sbkim-init.js`)
Mixariums `buildMixariumQueryCorpus` als Vorlage (in `Mein-Mixarium/sbkim/sbkim-init.js`),
auf die Rezept-Domäne angepasst: pro Rezept `{label: name, passageVec: embedPassage(passage),
text: passage, anchorId}`, wobei `passage` = Name + Kategorie + Zutaten (`r.ings[].name`) +
Tags. **`text`-Feld ist Pflicht** (A1 BM25). Deckel gegen Embedding-Kosten (z.B. ≤80). Lazy,
fail-soft (kein R / kein Embedding → `[]`). Korpus über `window.__sbkimGetRecipes()` lesen.

### Schritt 3 — Mixarium-Korpus auf den Getter umstellen
`buildMixariumQueryCorpus` liest aktuell `window.R` → auf `window.__sbkimGetRecipes()`
umstellen, damit der Korpus live echte Drinks sieht. `text`-Feld ist seit PR #89 schon drin.

### Schritt 4 — Verifikation
- Headless: die bestehenden `smoke_rollout_a1a4.mjs` (beide Repos) bleiben grün.
- **Browser-Sichttest (Klaus, Pflicht):** von einem Knoten (Sage/Rendezvous) eine cross-
  phrased Frage an Mixarium/Rezeptbuch stellen, prüfen ob echte Drinks/Rezepte zurückkommen.
  Ohne diesen Test bleibt Schritt 1–3 „ungeprüft, wartet auf Klaus' Browser-Lauf".

## Leitplanken (unverändert)
`PROVIDER_MIN_MATCH` (0.80) / Andock-Riegel (Modul 05) unberührt, kein PROTOCOL_VERSION-Bump,
kein PII (nur Rezept-/Drink-Namen + Zutaten, öffentlicher Inhalt), kein Netz/LLM im Korpus-Bau.
Mixarium: `index.html`==QC md5. Rezeptbuch: QC→build.py, CACHE bumpen. Beide: **immer gegen
`main` prüfen** (Rezeptbuch-Default-Branch ist ein toter Decoy — siehe `Mein-Rezeptbuch/CLAUDE.md`).

## Pflichtlektüre
CLAUDE.md · docs/PULS.md (oberster Eintrag) · `Mein-Mixarium/sbkim/sbkim-init.js`
(`buildMixariumQueryCorpus`) · `Mein-Rezeptbuch/sbkim/sbkim-init.js` · beide `15_membran.js`
(`queryWithInclusion`) · docs/components/04_match.md.
