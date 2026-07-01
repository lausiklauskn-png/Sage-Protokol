# Lehre — Embedding-Anisotropie & Match-Kalibrierung (Whitening-Konzept)

> **Status:** Architektur-Befund 2026-06-20 (Tafel-Evolutions-Klausel). Auslöser:
> Klaus' Skepsis, warum eine Buchhaltungs-App (BookLedgerPro) einen Cosinus von
> 0.81 zur Mycel-Bibliothek (Sage) erzielt, obwohl beide inhaltlich nichts gemein
> haben. **Doku für nachfolgende Bauten** — verbindlich zu lesen, bevor jemand die
> Match-Schwelle (`PROVIDER_MIN_MATCH = 0.80`) oder Modul 04 anfasst.

## Stand 2026-07-01 — A3: Contextual Chunking gebaut (additiv), Trennungs-Nutzen wartet auf Browser-Messung

**Kurz:** Strang A, Hebel A3. `embedContentVector` (Modul 03) bekommt einen
**additiven** Kontext-Vorspann: jedem Inhalts-Schnipsel wird VOR dem Einbetten ein
kurzer Domänen-/Dokument-Kontext vorangestellt (Anthropic „Contextual Retrieval",
deterministisch/offline/gratis), dann wie bisher gemittelt. Ziel: den gemittelten
Domänen-Zentroid domänen-treuer und zwischen Domänen besser trennbar machen — der
Hebel, der die in dieser Lehre dokumentierte **Anisotropie/Mittelungs-Aufblähung**
angreift, **ohne** den Datenvertrag zu brechen (anders als der „Schnipsel-Mittel"-Lead,
der Schnipsel-Vektoren in die Spore legen + alle Knoten neu signieren müsste).

**Ehrlich offen (nicht behauptet):** OB der Vorspann die Trennung real verbessert, ist
**headless nicht messbar** (transformers.js lädt nur im Browser; das Fake-Modell im Smoke
hasht Text → Zufalls-Vektor, beweist nur die Chunking-Mechanik, nicht die Semantik).
Darum wird **kein %-Gewinn** behauptet. Der Trennungs-Delta wird im Browser gemessen:

- **Panel 04 „A3-NACHMESSUNG"** (neuer Knopf): vergleicht Baseline (ohne Kontext) vs.
  A3 (mit Domänen-Vorspann) über dieselbe Mittelung + denselben zentrierten Cosinus
  (`relatedness`, v1); zeigt die Lücke (min verwandt − max unverwandt) je Verfahren und
  ihr Delta. Positives Δ = A3 trennt besser. **Reine Messung, setzt keine Konstante.**
- Zuerst `KALIBRIER-BODEN` / `SCHWELLEN-ANALYSE` als Baseline laufen (Schritt 0), dann A3.

**Leitplanken gewahrt:** gatet nichts, `PROVIDER_MIN_MATCH = 0.80`/Andock-Riegel (Modul 05)
unberührt, kein PROTOCOL_VERSION-/DB_VERSION-Bump, kein Spore-Feld. Ohne Kontext ist das
Verhalten byte-gleich zu vorher. Headless `tests/smoke_a3_contextual_chunking.mjs` 20/20,
Rückwärts-Kompat `smoke_inhaltstreuer_domainvektor.mjs` 25/25, Drift-Guards (such-tool/
sbkim-bundle/pinnwand) byte-1:1 grün. **Browser-Sichttest wartet auf Klaus.**

Falls A3 im Browser die Lücke NICHT vergrößert, ist das ein **ehrlicher Negativ-Befund**
(wie beim v2-Center) — dann bleibt der Vorspann als opt-in-Werkzeug liegen, ohne netzweit
verdrahtet zu werden. „Erst messen, dann behaupten."

---

## Stand 2026-06-28 (tiefe Nacht) — Kalibrier-Abschluss: das „verwandt"-Maß qualifiziert sich für den KI-Richter (Browser-Messreihe + Klaus' Richtungs-Entscheid)

**Kurz:** Eine vierteilige Browser-Messreihe (Klaus' Galaxy-Tab, `tests/manual_check.html`
Panel 04, mit echten transformers.js-Inhalts-Vektoren) hat die Frage „kann der **gratis,
server-lose** zentrierte Cosinus die Knoten zuverlässig in *verwandt/unverwandt* trennen?"
**empirisch verneint** — und damit den `RELATEDNESS_CENTER`-v2-Rollout aus
`BRIEF_KALIBRIERUNG_ROLLOUT_DREI_KNOTEN.md` (Schritt 1) **gestoppt, bevor** irgendeine
netzweite Konstante verteilt wurde. **Entscheid Klaus (2026-06-28):** der Cosinus bleibt der
gratis/offline **„verbunden"-Vorfilter** (ehrliche **Rangfolge**, kein Wahrheits-Stempel),
das echte **„verwandt"** liefert der **KI-Richter** (Modul 04 `hybridMatch`, opt-in/BYOK) —
zurück zur Ur-Idee **„Semantisches Bidirektionales KI-Matching"**. Evolutions-Klausel
gelebt: *der bessere Weg qualifiziert sich, nicht das Dogma.*

### Die Messreihe (reproduzierbar, Panel 04)

Vier Knöpfe, je reine Messung (setzen **keine** Konstante):

1. **`RELATEDNESS_CENTER v2 messen`** → v2-Kandidat-Literal aus 32 breit gestreuten Texten
   ist **stabil** über mehrere Läufe, aber `freigabeReif: false`: unter den gemittelten
   Inhalts-Vektoren liegen verwandte UND unverwandte Paare alle bei ~0.70 zentriert
   (`hubEndNichtVerwandt_v2: false`). Der v2-Center **verbessert die Trennung nicht**.
2. **`SCHWELLEN-ANALYSE` (volle Matrix v1+v2)** → **keine** einzige Schwelle trennt: bei v1
   `min(verwandt) 0.8014 < max(unverwandt) 0.8149`, bei v2 `0.7728 < 0.7782` — **negative
   Lücke = Überlappung**. Konkret schlägt das **unverwandte** `tresor↔point` (0.8149) das
   **verwandte** `rezept↔mix` (0.8014). Kein Tuning rettet das.
3. **`KALIBRIER-BODEN`** → Kontrast-Beleg: **einzelne** Zufallstexte zentriert mean **−0.14**
   (max +0.04), aber **gemittelte** Domänen-Vektoren ~0.70. ⇒ **Das Mitteln mehrerer
   Schnipsel zu einem Knoten-Vektor bläht den zentrierten Cosinus auf** (Anisotropie + die
   Mittelung schiebt alle Domänen-Vektoren zur gemeinsamen Richtung).
4. **`VERFAHREN-VERGLEICH`** (mitteln vs. Schnipsel-Max vs. Schnipsel-Mittel) → bestätigt die
   Ursache und findet die Grenze des Gratis-Wegs:

   | Verfahren | min(verwandt) | max(unverwandt) | Lücke | trennt? |
   |---|---|---|---|---|
   | **mitteln** (heute, Bau 04.E) | 0.8014 | 0.8149 | −0.0135 | nein |
   | **Schnipsel-Max** | 0.7303 | 0.7413 | −0.0110 | nein (ein einzelner Zufalls-Treffer hebt Fremde) |
   | **Schnipsel-Mittel** | 0.5617 | 0.5429 | **+0.0188** | **ja** (Schwelle ~0.55) |

   `Schnipsel-Mittel` (Schnipsel **nicht** mitteln, sondern alle Paar-Cosinus mitteln) trennt
   die 3 echten Verwandt-Paare sauber auf die Plätze 1–3 — aber die **Marge ist winzig
   (0.0188)** an nur 3 Verwandt-Paaren / 7 synthetischen Knoten / 4 kurzen Schnipseln.

### Warum nicht der freie Schnipsel-Mittel-Weg (jetzt)

Zwei Gründe, **dokumentiert statt stillschweigend** umgangen:
- **Dünne, ungesicherte Marge** (0.0188) — Hinweis, kein Stabilitäts-Beweis bei echtem Maßstab.
- **Datenvertrag-Eingriff:** das Raum-Badge (Modul 23) vergleicht **Spore↔Spore**, und eine
  Spore trägt **einen** gemittelten `domainVector`, nicht die Schnipsel. „Schnipsel-Mittel"
  netzweit hieße: Schnipsel-Vektoren in die Spore legen (Modul 02) **+ alle Knoten neu
  signieren**. Großer Eingriff für ein **reines Anzeige-Maß**.

Der `Schnipsel-Mittel`-Befund bleibt als **Lead** festgehalten (falls das „verwandt" später
doch gratis werden soll — dann erst an mehr echten Knoten absichern).

### Konsequenz (verbindlich, netzweit)

- **`RELATEDNESS_CENTER` bleibt v1.** Der v2-Kandidat ist **verworfen** (durch eigene
  Freigabe-Prüfung gefallen). **Keine** netzweite Konstante geändert ⇒ **kein** SIGNAL/
  Rollout nötig (Brief-Schritte 2+3 entfallen, weil keine neue Konstante).
- **`PROVIDER_MIN_MATCH = 0.80` unverändert** (Andock-Boden, Modul 05; war nie Teil dieses
  Entscheids).
- **„verbunden" (grob) = roher/zentrierter Cosinus**, gratis/offline, ehrliche **Rangfolge**
  (Back-Paar oben, blp↔mix unten) — **kein** Ja/Nein-Wahrheits-Stempel.
- **„verwandt" (genau) = KI-Richter** (`hybridMatch`, opt-in, BYOK, schon im Such-Widget +
  Pinnwand). Bidirektionales KI-Matching nach **Bedeutung** — die Rolle, für die der rohe
  e5-Cosinus prinzipiell zu schwach ist (Form ≠ Bedeutung).
- **Reine Anzeige bleibt reine Anzeige:** `relatedness()` gatet weiter **nichts**; der
  0.80-Andock-Riegel ist unberührt. Das Zwei-Maß-UI (Bau 22e/23) bleibt gültig — nur die
  Lesart ist jetzt ehrlich geschärft (Cosinus = Rangfolge, KI-Richter = Wahrheit).

### Mess-Instrumente (bleiben in Panel 04, reproduzierbar)
`RELATEDNESS_CENTER v2 messen` · `SCHWELLEN-ANALYSE` · `VERFAHREN-VERGLEICH` — alle reine
Messung, dokumentieren die obige Kette. Cache-Bust an den Modul-03/04-Skript-Tags
(`?v=kal-20260628`) sorgt für frische Module beim Browser-Lauf.

### Umsetzung (Folge-Bau 2026-06-28, Modul 22 „verwandt · KI")
Der Entscheid ist verdrahtet: das Such-Widget (Modul 22) hat im „verwandt"-Modus einen
opt-in-Schalter **„· KI"**, der das Verwandtschafts-Maß vom **KI-Richter** (`hybridMatch`,
BYOK) liefern lässt statt vom zentrierten Cosinus. Gratis „verwandt" bleibt der Cosinus,
jetzt ehrlich als **Rangfolge** beschriftet. **Reine Anzeige** — gatet nichts, kein
Eingriff in Modul 04/05, keine netzweite Konstante geändert. **Modul 23 (Raum-Badge)**
bleibt bewusst beim gratis Cosinus (Klaus' Entscheid: kurze Domänen-Texte, Kosten je Karte).
**Schnipsel-Mittel** bleibt als notierter Lead liegen (erst nur KI-Richter). Details:
`docs/components/22_such_widget.md` § „verwandt · KI". Headless `smoke_bau22e_waehlen.mjs`
45/45. Browser-Sichttest (KI-Schlüssel live) wartet auf Klaus.

---

## Stand 2026-06-28 (Abend) — Kalibrierung abgeschlossen: 0.80 bleibt Andock-Boden, zentrierter Cosinus als Verwandtschafts-Score (Bau 04.E)

**Entscheidung Klaus 2026-06-28:** „zentrierten Cosinus jetzt als Bau bauen (Modul 04)".

**Messung (headless, `node tools/match_baseline.mjs`, reproduzierbar):** Roh-Cosinus-
Boden über 7 echte Knoten-Vektoren = **mean 0.8214 · sd 0.0236 · Spanne 0.7725–0.8537**.
Echte Verwandtschaft nur Jason↔Mein-Tresor 1.0 und Mixarium↔Rezeptbuch 0.954.

**Schlüssel-Befund (warum die Schwelle NICHT angehoben wurde):** `PROVIDER_MIN_MATCH`
(0.80) ist **dieselbe** Schwelle, die der **Andock-Handshake** benutzt (Modul 05
`isAboveProviderThreshold` → `rejected-local`). Eine Anhebung auf mean+2sd (≈0.87)
würde **jeden Hub↔Endknoten-Handshake ablehnen** (alle liegen roh 0.79–0.85), inkl.
des am selben Tag live bewiesenen BLP↔Sage-Andocks. Der rohe e5-Cosinus **kann fremde
von verwandten Domänen nicht trennen** — 0.80 ist also ein **Andock-Boden** (Identitäts-/
Peer-Tor), **kein** Verwandtschafts-Maß.

**Gebaut (Bau 04.E, additiv, gatet NICHTS):**
- `relatedness(aVec, bVec)` in Modul 04 — **zentrierter (whitened-light) Cosinus**:
  Mittelwert-Vektor `RELATEDNESS_CENTER` (L2-normierter Mittel über die 7 Referenz-
  Vektoren, v1 illustrativ) abziehen, re-normalisieren, dann Cosinus. `isRelated(score)`
  gegen `RELATEDNESS_MIN = 0.30`.
- `match()` / `isAboveProviderThreshold()` / `PROVIDER_MIN_MATCH = 0.80` **unverändert** —
  der Andock-/Provider-Gate-Pfad ist nicht berührt (Smoke beweist: alle Hub↔Endknoten
  bleiben roh ≥0.80).
- Headless `tests/smoke_bau04e_relatedness.mjs` **29/29 grün**: echt verwandt zentriert
  0.72–1.0, Boden −0.20…0.002 — klarer Spalt (min echt 0.72 > max Boden 0.002).
  Drift-Guard-Kopien `such-tool/` + `sbkim-bundle/` byte-1:1 nachgezogen.

**Ehrliche Konsequenz für die Stempel:** Die boden-nahen `verified-match`-Werte
(Sage↔Rezeptbuch 0.824, ↔Mixarium 0.806, ↔Point 0.849, ↔Tresore 0.848, ↔BookLedger 0.814)
sind **Andock-Boden-Treffer**, **keine** Domänen-Verwandtschaft — zentriert fallen sie auf
~0/negativ. **Echt** verwandt sind nur Jason↔Mein-Tresor (Schwestern) und Mixarium↔Rezeptbuch
(Essen/Trinken). Das ist **kein Fehler der Knoten**, sondern die Modell-Anisotropie. Die
Stempel bleiben gültig als **Andock-Beleg** (die Knoten verbinden sich real); der
zentrierte Score ist ab jetzt das ehrliche **Verwandtschafts-Maß** (Anzeige/Ranking).

**Offen (eigene Folge-Sitzung):** `RELATEDNESS_CENTER` ist v1 aus nur 7 Domänen-Vektoren
(LEHRE-Caveat) — additiv durch einen Mittelwert aus größerem Referenz-Korpus ersetzbar,
ohne Vertrag/PROTOCOL_VERSION zu brechen. Optionale Verdrahtung des `relatedness`-Scores
in UI/Ranking (Such-Widget, Andock-Anzeige) ebenfalls Folge-Schritt. **Browser-Live-Match
wartet auf Klaus** (zentrierter Score in einer echten Andock-Anzeige).

---

## Stand 2026-06-28 (Nacht) — Zwei-Maß-Verdrahtung in der Anzeige: Modul 23 (Raum) + Befund Pinnwand

Der zentrierte Score (Bau 04.E) ist jetzt an einem **zweiten** Anzeige-Ort
verdrahtet (nach dem Such-Widget Modul 22) — **reine Anzeige, gatet weiter
nichts**:

- **Modul 23 (Rendezvous-Raum) — gebaut.** `discover()` reicht je Karte einen
  zentrierten Verwandtschafts-Score durch (`relatednessForCards(cards,
  ownSpore)`, Modul 04 `relatedness`/`isRelated`). Das UI zeigt pro Knoten ein
  Badge („🧬 verwandt 0.72" vs „· verbunden …") + einen „🧬 nur
  verwandte"-Schalter. Modul 04 ist **optionale** Anzeige-Abhängigkeit
  (fail-soft ohne sie). Der 0.80-Andock-Riegel (Modul 05) ist **unberührt** —
  Smoke beweist: Hub↔Endknoten-`match()` bleibt ≥ 0.80, der Score sortiert nur
  die Karten. Tests: `smoke_bau23_rendezvous.mjs` 55/55 (echte Knoten-Vektoren:
  Schwester Rezeptbuch `isRelated`, Hub Sage/BookLedger `isRelated:false`),
  `smoke_bau23_rendezvous_ui.mjs` 32/32.

- **Pinnwand (Nostr-Q&A-Brett) — Befund: zentriert ist schon drin, der
  netzweite `RELATEDNESS_CENTER` wäre hier FALSCH.** Die Pinnwand
  (`pinnwand/index.html`) sortiert die Antworten eines Threads bereits nach
  **zentriertem** Cosinus (`relevance(qVec, aVec, mean)` → `whiten()`-Abzug, der
  LEHRE-Kern-Fix). Der Unterschied zum Such-Widget/Raum: die Pinnwand mittelt
  den Schwerpunkt aus einem **wachsenden, seiten-lokalen** Korpus (`accumulate`
  / `meanVec`, ab ≥ 3 Texten) — **nicht** aus der netzweiten Konstante
  `RELATEDNESS_CENTER`. Das ist hier **korrekt und besser**: die Pinnwand-Texte
  sind **beliebige Q&A-Antworten**, nicht Domänen-Beschreibungen.
  `RELATEDNESS_CENTER` ist aber genau ein Mittel über **7 Knoten-Domänen-
  Vektoren** — der falsche Schwerpunkt für freien Antworttext. Den netzweiten
  Mittelwert hier aufzudrücken würde den Boden-Abzug **verschlechtern**. Der
  KI-Richter ist dort ebenfalls schon **opt-in** (Anbieter-Dropdown + Schlüssel
  + Knopf, Default aus). **Konsequenz: an der Pinnwand bewusst KEIN
  struktureller Eingriff** (der Brief erlaubt das ausdrücklich: „nur anwenden,
  wenn es dort wirklich besser wird"). Sauber dokumentiert statt
  stillschweigend umgangen.

  - **Folge (2026-06-28, tiefe Nacht Folge²) — ehrliche Beschriftung
    nachgezogen.** Der Brief `BRIEF_PINNWAND_VERWANDT_KI.md` hat den Befund
    re-geprüft; Klaus' Entscheid (AskUserQuestion): **kein neuer „· KI"-Schalter**
    (redundant zum schon-opt-in-Richter), aber die **Beschriftung geschärft** —
    der gratis Cosinus heißt jetzt auch in der Pinnwand-UI explizit
    **Rangfolge** („Nähe zur Frage, kein Verwandt-Urteil — das liefert der
    ⚖️ KI-Richter"), Footer um den Cosinus=Rangfolge-vs-Richter=Urteil-Kontrast
    ergänzt. Damit trägt der zweite Anzeige-Ort (Pinnwand) dieselbe ehrlich
    geschärfte Lesart wie Such-Widget (Modul 22) + Raum (Modul 23): **Cosinus =
    Rangfolge, KI-Richter = Wahrheit.** Reine Anzeige, kein Kontrakt berührt.
    Nebenbei den vorbestehenden Drift-Guard `pinnwand/modules/03_embedding.js`
    (hinter PR #477 zurück) byte-1:1 geheilt (`_smoke.mjs` 58/58). **✅ Klaus-
    Sichttest GRÜN (2026-06-29):** live in der Pinnwand sortiert der gratis
    Cosinus „… echte Alkoholcocktails" (0.16) ÜBER harmlose alkoholfreie Treffer
    — der sichtbare Beweis, dass der Cosinus eine Rangfolge ist und kein
    Absichts-Urteil. Damit ist die geschärfte Lesart an allen drei Anzeige-Orten
    (Modul 22 / 23 / Pinnwand) auch praktisch belegt.

---

## Stand 2026-06-28 — Kalibrier-Instrument gebaut, Schwelle wartet auf Browser-Messung

Die netzweite Umstellung auf **Inhalts-Vektoren** (Meilenstein „Von der Hülle zum
Inhalt") hat begonnen: Mixarium (PR #80) + Mein-Rezeptbuch (PR #269) als
Draft-Rollouts, Re-Sign im Browser ist Klaus' Schritt. Damit muss die
0.80-Schwelle **bewusst neu kalibriert** werden (dieser Brief).

- **Instrument gebaut:** `tests/manual_check.html` → Panel „Modul 04 — Match" →
  Knopf **„KALIBRIER-BODEN messen (Zufallstexte → Schwellen-Empfehlung)"**. Er
  misst im Browser den ROH-Boden + ZENTRIERTEN Boden aus 8 unverwandten
  Zufallstexten und gibt eine Schwellen-Empfehlung `mean + 2·sd` aus (genau die
  Messung, die § „Boden aus ECHTEN Zufallstexten messen" unten verlangt).
- **Noch offen (wartet auf Klaus' Browser-Lauf):** den Knopf laufen lassen, die
  Zahlen ablesen, dann `status.json` → `config.PROVIDER_MIN_MATCH` **bewusst**
  setzen. Headless nicht messbar (transformers.js lädt nur im Browser) — diese
  Sitzung setzt die Schwelle daher **nicht blind**.
- **Verfahrens-Wahl (Klaus' Entscheid):** entweder (1) absolute Schwelle =
  gemessenes `mean+2·sd` (nur `status.json`, kein Code-Bruch) **oder** (2)
  zentrierter Cosinus in Modul 04 (netzweiter `MEAN_VECTOR`, größerer Eingriff).
  Der Knopf liefert die Zahlen für beide Wege. Empfehlung dieser Sitzung: erst
  messen, dann mit Klaus den Weg festlegen.
- **Vorher/Nachher pro Knoten:** sobald ein Knoten mit Inhalts-Vektor re-signt
  ist, den Cosinus gegen Sage neu rechnen (alte Beschreibungs-Werte: Rezeptbuch
  0.824068, Mixarium 0.806030) und in `NETZ-STAND` ehrlich gegenüberstellen.

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
