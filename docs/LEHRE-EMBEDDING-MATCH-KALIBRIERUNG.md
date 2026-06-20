# Lehre — Embedding-Anisotropie & Match-Kalibrierung (Whitening-Konzept)

> **Status:** Architektur-Befund 2026-06-20 (Tafel-Evolutions-Klausel). Auslöser:
> Klaus' Skepsis, warum eine Buchhaltungs-App (BookLedgerPro) einen Cosinus von
> 0.81 zur Mycel-Bibliothek (Sage) erzielt, obwohl beide inhaltlich nichts gemein
> haben. **Doku für nachfolgende Bauten** — verbindlich zu lesen, bevor jemand die
> Match-Schwelle (`PROVIDER_MIN_MATCH = 0.80`) oder Modul 04 anfasst.

## Der Befund in einem Satz

Der **rohe Cosinus** von `multilingual-e5-small` hat einen **hohen Boden**: zwei
unverwandte deutsche Domänen-Texte liegen schon bei **~0.82 im Mittel**. Die aktuelle
Schwelle `0.80` liegt damit **unter** dem Rauschboden — fast jedes Paar „matcht".

## Belege (echte Knoten-Vektoren, 2026-06-20)

Reproduzierbar: `node tools/match_baseline.mjs` (nutzt die vorhandenen `domainVector`,
kein Embedding nötig).

**Roh-Cosinus, unverwandte Paare (= Boden):** mean **0.8215** · sd 0.0223 · Spanne 0.787–0.854.

| Paar | roh | zentriert (Mean-Abzug) | echte Verwandtschaft? |
|---|---|---|---|
| Jason ⟷ Mein-Tresor | 1.0000 | 1.0000 | ✔ (wortgleiche Schwestern) |
| Mixarium ⟷ Rezeptbuch | 0.9544 | 0.6985 | ✔ (Essen/Trinken) |
| Point ⟷ Sage | 0.8485 | −0.0205 | nein (Boden) |
| BookLedger ⟷ Sage | **0.8106** | **−0.1585** | nein (Boden) |
| Rezeptbuch ⟷ Sage | 0.8241 | −0.2524 | nein (Boden) |
| Mixarium ⟷ Sage | 0.8060 | −0.2277 | nein (Boden) |
| Mixarium ⟷ Tresore | 0.7884 | −0.5748 | nein (dokumentiertes „kein Match") |

**Lesart:** Roh ist alles in der schmalen Spanne 0.79–0.85 gequetscht. Nach **Abzug des
Mittelwert-Vektors** (Zentrierung ≈ Whitening-light) bleibt **nur echte Verwandtschaft
positiv** (Schwestern 1.0, Essen/Trinken 0.70); **alle Sage↔Endknoten-Paare werden negativ**.
Sages Domäne (Mycel-Bibliothek) ist inhaltlich von allen Endknoten verschieden — der hohe
Roh-Wert war Modell-Artefakt, kein Themen-Bezug. BookLedger↔Sage (0.811) liegt sogar **unter**
dem Boden-Mittel (0.8215).

## Warum (die Ursache)

**Anisotropie.** Transformer-Satz-Embeddings (BERT-Familie, e5) verteilen ihre Vektoren
nicht gleichmäßig über die Einheitskugel, sondern in einem **engen Kegel** mit einer
dominanten gemeinsamen Richtung. Folge: alle Vektoren haben eine große gemeinsame
Komponente → hoher Roh-Cosinus zwischen beliebigen Texten. Verstärkt durch:
- **gleiche Sprache** (alles Deutsch),
- **gleicher Stil/Register** (alles kurze „X verwaltet/ist Y"-Domänen-Beschreibungen),
- **gleicher `passage:`-Präfix** (e5-Konvention, schiebt alle Passagen zusammen).

Die Intuition „0 = nichts gemein, 1 = identisch" gilt für rohe e5-Cosinus **nicht**.

## Konsequenz für bestehende Stempel

Mehrere `verified-match`-Stempel der **Sage↔X**-Paare sind **schwach** (Boden-nah):
Point 0.849, Rezeptbuch 0.824, Tresore 0.848, Mixarium 0.806, BookLedger 0.811. **Echt**
sind nur die Schwestern-Identität (Jason/Mein-Tresor) und Rezeptbuch↔Mixarium. Das ist
**kein Fehler der Knoten**, sondern des Mess-Verfahrens. **Nicht stillschweigend** umstempeln
— erst Verfahren + Schwelle bewusst neu setzen (Klaus' Entscheidung, netzweit).

## Fix-Konzept (für die Bau-Sitzung „Modul 04 Whitening")

Drei Stufen, additiv und netz-koordiniert:

### 1. Schwelle empirisch kalibrieren (schnell, kein Code-Bruch)
Boden mit **echten Zufallstexten** (nicht-Domänen-Stil) messen → Schwelle = `mean + 2·sd`
des Bodens. Aus den Domänen-Vektoren allein wäre das ~0.866; mit Zufallstexten neu messen
(Browser, siehe unten). `PROVIDER_MIN_MATCH` von 0.80 auf den gemessenen Wert heben.

### 2. Whitening in Modul 04 (der eigentliche Fix)
Vor dem Cosinus den **Mittelwert-Vektor abziehen** (optional: Kovarianz-Whitening). Dann
heißt 0 wieder „unverwandt", und die Schwelle wird stabil + modell-unabhängig.

Referenz-Implementierung (Konzept, additiv — ändert `matchDimensions`/`queryLocal` NICHT):

```js
// Modul 04 — Konzept: gewichteter (whitened) Cosinus.
// MEAN_VECTOR = über ein Referenz-Korpus vorab gemittelter, L2-normierter e5-Vektor
// (einmal berechnet, als Konstante mitgeliefert — KEIN Live-Embedding nötig).
function whiten(v, mean) {
  const w = v.map((x, i) => x - mean[i]);
  const n = Math.sqrt(w.reduce((s, x) => s + x * x, 0)) || 1;
  return w.map((x) => x / n);
}
function matchWhitened(a, b, mean) {           // a,b: rohe e5-Vektoren (L2=1)
  const wa = whiten(a, mean), wb = whiten(b, mean);
  let d = 0; for (let i = 0; i < wa.length; i++) d += wa[i] * wb[i];
  return d;                                     // jetzt: ~0 = unverwandt, hoch = verwandt
}
```

**Netzweit:** `MEAN_VECTOR` + die neue Schwelle müssen für ALLE Knoten identisch sein
(sonst rechnen Knoten verschieden). Daher: als Konstante in Modul 04 + `status.json`
`config` versioniert ausliefern, Versions-Bump ankündigen (SIGNAL), Knoten ziehen nach.

### 3. Alle Matches einmal sauber neu rechnen
Nach Stufe 2 alle Paare neu bewerten, `status.json`/`NETZ-STAND` ehrlich aktualisieren
(echte Matches bleiben, Boden-Stempel fallen auf „kein Match — andere Domäne").

## Boden aus ECHTEN Zufallstexten messen (Browser-Instrument)

Headless im Container nicht möglich (transformers.js lädt nur im Browser). In einer Seite
mit Modul 03 geladen (z.B. `tests/manual_check.html` oder `andock.html`):

```js
const ctrl = ["Das Wetter wird morgen wechselhaft mit Schauern.",
              "Die Quantenmechanik beschreibt subatomare Teilchen.",
              "Ein Fahrradreifen braucht regelmäßig Luftdruck."];
const vs = await Promise.all(ctrl.map(t => SbkimEmbedding.embedPassage(t)));
const cos = (a,b)=>{let d=0,na=0,nb=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}return d/Math.sqrt(na*nb);};
// paarweise Cosinus der Kontrolltexte = echter Boden (erwartet ~0.78–0.85)
```

## Querverweise

- Mess-Werkzeug: `tools/match_baseline.mjs`
- Modul 04 (Match): `docs/components/04_match.md` · `src/modules/04_match.js`
- Schwelle: `status.json` → `config.PROVIDER_MIN_MATCH`
- Netz-Stand „Offene Hebel": `sbkim/NETZ-STAND.md`

> **Disziplin:** Diese Lehre verbietet das Anheben/Absenken der Schwelle nicht — sie
> verlangt, es **bewusst + netzweit + dokumentiert** zu tun. Wer Modul 04 baut, liest
> das hier zuerst.
