# PULS-Eintrag 2026-09-16 · Der Zähler zählte nicht, und der Satz war halb wahr

> **Ausgelagert am 2026-09-16 aus `docs/PULS.md`** (Briefkasten-Runde). Die Datei stand
> bei 2.964 von 3.000 Zeilen. **Ausgelagert, nicht gekürzt** — hier steht der Wortlaut
> vollständig und Zeichen für Zeichen so, wie er im PULS stand (119 Zeilen).

---

## 2026-09-16 · Der Zähler zählte nicht, und der Satz war halb wahr

**Klaus' Bitte:** *„Ja, beide Spore-Befunde umsetzen."* Beide stammen aus der
Prüfung einer echten Spore, die er geschickt hatte.

### Befund 1 · `embeddingVersion` blieb beim Siegel-Weg leer

Gemessen im Code, nicht geraten: `generateOwnSpore(meta)` setzt das Feld
**nur, wenn der Aufrufer es mitgibt** (`02_spore.js`), `regenerateOwnSpore`
rechnet es dagegen selbst (`02_spore.js:827-834`). Der Andock-Wizard gab es
**nie** mit — jede über das Siegel signierte Spore trug `embeddingVersion:
undefined`.

`naechsteEmbeddingVersion(neuerVektor)` in `src/modules/16b_andock_wizard.js`
holt die alte Spore, vergleicht den `domainVector` Stelle für Stelle und zählt
**nur bei einer echten Änderung** hoch. Eingesetzt an **beiden** Signier-Pfaden
(mit und ohne Inhalts-Vektor).

| Ausgangslage | Ergebnis |
|---|---|
| keine alte Spore | `1` |
| gleicher Vektor, alt war 7 | **bleibt 7** |
| anderer Vektor, alt war 7 | **8** |
| alte Spore nicht lesbar | `1`, fail-soft |

⚠ **EIN PFAD ALLEIN HÄTTE ZWEI ZÄHLUNGEN ERGEBEN.** Beide `generateOwnSpore`-
Aufrufstellen im Wizard sind nachgezogen; wer nur die Inhalts-Stelle bedient
hätte, bekäme je nach gewähltem Weg eine andere Zahl für denselben Stand.

### Befund 2 · Der Herkunfts-Satz verschwieg die Schnipsel

Der Satz sagte, der Vektor komme aus den eigenen Inhalten. Gemessen:
`snippetVectors` entstehen weiter aus `embedSnippets(beschreibung)`, auch wenn
der `domainVector` aus dem Inhalt kommt. **Beides ist richtig und gehört
nebeneinander** — der Satz nennt jetzt beide Hälften (Deutsch 3×, Englisch 1×).

`docs/INTERFACES.md`: die `embeddingVersion`-Zeile nennt seitdem beide Pfade und
die Regel „nur bei einer echten Änderung".

### Der Automat zieht die `?v=` mit — gemessen, nicht pauschal

Anlass war ein Schaden **dieses Werkzeugs**: der Lauf davor hat PWA-Toolpoint
(v55→v56) und family-project (v115→v116) gebumpt und ihre Asset-Adressen stehen
lassen. Beide Bäume waren danach rot, und in family-project fiel es nicht auf,
weil `smoke_all.mjs` die anderen Proben nicht ruft.

`tools/kanon-verteilen.mjs` zieht `?v=` und `ASSET_V` jetzt nach jedem Bump mit,
**aber nur dort, wo die Zahl vorher schon auf der alten Cache-Nummer stand**.

⚠ **DIE WICHTIGERE RICHTUNG IST DIE GEGENRICHTUNG.** `?v=` bedeutet netzweit
**zwei verschiedene Sachen**: in PWA-Toolpoint und family-project hängt es an
der `CACHE_VERSION`, in Mein Rezeptbuch, Muttis Rezeptbuch und Mein Mixarium ist
es der **Icon-Zähler**. Ein Werkzeug, das jedes `?v=` mitzieht, schreibt dort
eine Zahl um, die eine ganz andere Sache zählt. Der Riegel ist die Messung
„stand es vorher schon auf der Cache-Nummer?"; ein Gegenprobe-Fall nimmt genau
sie weg.

### Gemessen

| | |
|---|---|
| Sage, `node tests/run_alle.mjs` | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |
| `tests/gegenprobe_kanon_wizard.sh` | **35 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `tests/gegenprobe_kanon_verteilen.sh` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| Kanon-sha `16b_andock_wizard.js` | `0fbef6d8bcfc` → **`c415eafdb1b6`** |
| Kopien auf `main`, byte-gleich mit dem Kanon | **20 von 20** (19 verteilte + Sages eigene) |

Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. Vor jedem Commit die
**Dateiliste** angesehen, nicht nur den Diff.

### Vorbestehende rote Zeilen, durch Gegenprobe belegt

Beide wurden **auf unberührtem `origin/main`** wiederholt und fallen dort
wortgleich — sie stammen nicht aus diesem Rollout:

- **Privat-Brain**, 4 Zeilen: der Wizard wird im headless Lauf nicht ins
  Siegel-Modal injiziert (🔑-Knopf, Semantik-Block, Schutz-Block, Dialog).
- **family-project**, 2 Zeilen: der Egress-Proxy dieser Sitzung sperrt
  `wss://relay.family-projekt.de` (Tunnel-Fehler), und `MycelBg.setTheme`
  (three.js/WebGL) kommt headless nicht hoch.

### ⚠ BookLedgerPro FÄLLT ZUM ZWEITEN MAL AUS EINEM ROLLOUT — und der Automat schweigt dazu

Gemessen am 2026-09-16 auf `origin/main`: BookLedgerPro trägt **kein**
`sbkim-andock-wizard.js`. Sein `sbkim/siegel-inhalt.js` hat **479 Zeilen** und
trägt den Wizard weiter **inline** — die Fassung von **vor** der A18-Trennung
(2026-09-14). Zum Vergleich: in jeder anderen App sind es 32 Zeilen.

**Daraus folgt, was dort fehlt:** `embeddingVersion` (dieser Befund) ·
`embeddingSource`/`sampleContent` (Inhalts-Vektor, 2026-09-15) · der
Identitäts-Wechsler-Nachzug · die Übersetzungs-Tabelle. Vier Generationen.

⚠ **DER AUTOMAT KONNTE ES NICHT MELDEN, UND DAS IST DER EIGENTLICHE BEFUND.**
Er erkennt Träger am **Inhalt** (`SBKIM — Modul NN` im Kopf) und findet deshalb
nur, **was da ist**. Eine App ohne Kopie hat keine Marke, taucht in keiner
Fundliste auf und wird stillschweigend übersprungen — die Meldung lautete
„19 Kopien geschrieben", nicht „eine App trägt gar keine". *Eine gefundene
Liste schützt vor einer veralteten Kopie, nicht vor einer fehlenden.*

**Nicht in diesem Vorgang nachgezogen**, und zwar ausdrücklich: das ist ein
Generationen-Sprung (Ladekette umbauen, `siegel-inhalt.js` auf das WIZ-Objekt
kürzen, Cache-Bump, Probenlauf im Ziel-Repo), kein Zwei-Zeilen-Nachtrag. Klaus
entscheidet, ob BookLedgerPro den Wizard-Kanon bekommt.

### Was offen bleibt

- **Klaus' Browser-Sichttest** — ob der Zähler im Siegel richtig aussieht und
  der Knoten mit dem neuen Vektor im Raum auftaucht, sieht nur er.
- **BookLedgerPro** (siehe oben), **Privat-Brains 4** und **SB-KIMTool-Points 2**
  vorbestehende rote Zeilen, `sbkim/15_membran.js` in family-project eine
  Generation zurück, und der Rezept-Export trägt die Spore nicht.
- **Mein WorkFlohs `sampleContent()`-Gerüst bleibt ausgeschaltet**, bis Klaus
  etwas anderes sagt.

**Nächster sinnvoller Schritt:** Klaus' Sichttest im Siegel abwarten; danach die
BookLedgerPro-Frage entscheiden.

