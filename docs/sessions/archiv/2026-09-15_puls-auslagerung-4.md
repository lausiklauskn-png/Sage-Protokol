# Ausgelagert aus docs/PULS.md — 2026-09-15 (vierte Auslagerung)

**Warum.** `docs/PULS.md` stand bei **3.033** von 3.000 Zeilen. Die Verfassung
sagt: **auslagern statt kürzen** — die Grenze wird nicht herabgesetzt und kein
Satz gestrichen. Der Eintrag unten steht hier **wortwörtlich**.

**Warum GERADE dieser.** Es ist der älteste noch vollständig in `PULS.md`
stehende Eintrag. Der Eintrag, der die dritte SBKIM-Auflösung als Befund
festhält, bleibt dort stehen — `tests/smoke_sbkim_name.mjs` besteht ausdrücklich
darauf, und das ist die Gegenrichtung, die verhindert, dass die Aufzeichnung
stillschweigend verschwindet.

> ⚠ Der Eintrag endet mit dem Satz, `PULS.md` stehe „bei rund 2.980 Zeilen" und
> die nächste Sitzung solle auslagern, **bevor** sie schreibt. Sie hat zuerst
> geschrieben und danach ausgelagert — das Ergebnis ist dasselbe, der Rat war
> trotzdem der bessere.

---

## Stand 2026-09-14 (Haupt-Sitzung, Nacht, Abschluss) · ✅ DIE LAMPEN DER ZWEI MARKTPLÄTZE SPRECHEN MIT

**Rolle:** Haupt-Sitzung, dritte und letzte Entscheidung aus der Nachlese.
Klaus: *„Ja, beide — klein und sichtbar."*

### Was gebaut wurde

Der Befund der Nachlese war: auf den zwei Seiten, die Klaus ansehen wollte,
malt **nicht Modul 17** die Lampen, sondern app-eigener Klebstoff. Beide sind
jetzt nachgezogen — mit dem, was jedes Repo **schon hat**, statt mit einem
zweiten System:

| Repo | wo | wie |
|---|---|---|
| **family-project** | `assets/status-widget.js` | eigenes schlüsselloses `T()`, Rangfolge nur `<html lang>` (dieses Widget hat kein `init({lang})`) |
| **PWA-Toolpoint** | `index.html` + `assets/sprache.js` | über das **vorhandene** `data-i18n`-System |

⚠ **Die Begriffe sind mit Modul 17 abgestimmt** (`alive`/`traffic`/`foreign`/
`seal`). Zwei Fassungen desselben Wortes liefen auseinander — und dann hieße
dieselbe Lampe im Widget anders als im Modul-Fenster daneben.

**Gemessen, beide Richtungen, headless an drei Seiten:**

| | `lang=en` | `lang=de` |
|---|---|---|
| family-projekt.de | **ALIVE · TRAFFIC · FOREIGN · SEAL** | LEBT · VERKEHR · FREMD · SIEGEL |
| pwa-toolpoint.de | **alive · traffic · foreign** | lebt · verkehr · fremd |
| …/auslieferungspruefer | ALIVE · TRAFFIC · FOREIGN · SEAL | LEBT · VERKEHR · FREMD · SIEGEL |

Dazu im Wappen: `OFFICIAL ATTESTATION` / `SEAL` gegen `OFFIZIELLE BESTÄTIGUNG`
/ `SIEGEL`. **Auf Deutsch ändert sich nirgends etwas** — die tragende
Zusicherung gilt in beide Richtungen, und sie ist gemessen, nicht behauptet.

### ⚠ UND TOOLPOINTS WÄCHTER SCHRIEB DAS WÖRTERBUCH AB, STATT ES ABZULESEN

In `tests/smoke.mjs` stand eine **fest verdrahtete Liste** von neun
BASIS-Schlüsseln — eine zweite Fassung dessen, was in `assets/sprache.js`
steht. Sie ist prompt auseinandergelaufen: die sechs neuen Lampen-Schlüssel
standen im Wörterbuch, und der Wächter meldete sie trotzdem als fehlend
(**860/861**).

**Die Lehre stand in Toolpoints eigener Verfassung schon** — *„die Relais
werden ABGELESEN, NICHT ABGESCHRIEBEN: zwei Listen derselben Poststellen
laufen auseinander"* —, nur an einer anderen Tür. Behoben wurde die
**Ursache**, nicht der Einzelfall: der Wächter liest die Liste jetzt aus
`sprache.js`.

⚠ **Er wird dadurch nicht schwächer** — er fragt „steht der benutzte Schlüssel
im Wörterbuch?", und BASIS *ist* das Wörterbuch. Und er hat einen **eigenen
Riegel**, der meldet, wenn das Ablesen selbst bricht: von Hand nachgestellt
meldet er `nur 0 gefunden`, **bevor** die Folgemeldungen kommen. Ohne ihn wäre
ein gebrochener Ableser still zu streng oder still zu lasch.

**Gemessen:** Toolpoint `npm test` **862/862** · family-project
`tests/smoke_all.mjs` **110/110** · zwei Gegenprobe-Fälle ergänzt, **beide von
Hand in einer Wegwerf-Kopie nachgestellt** (der Arbeitsbaum bleibt unberührt,
wie die dortige Verfassung es verlangt).

### Was diese Sitzung insgesamt hinterlässt

| | |
|---|---|
| **Aufgabe 1** (Nachlese) | erledigt — drei Befunde, alle gemessen |
| **Wappen** | entschieden, gebaut, in **20 Trägern** ausgerollt |
| **Lampen** | entschieden, gebaut, in beiden Marktplätzen |
| **Aufgabe 2** (Andock-Werkzeug) | **unberührt** — Klaus' Weg steht fest: *erst zusammenführen, dann übersetzen* |

⚠ **`docs/PULS.md` steht bei rund 2.980 Zeilen.** Die nächste Sitzung lagert
aus, **bevor** sie schreibt — auslagern statt kürzen, die Schutz-Klausel oben
gilt.
