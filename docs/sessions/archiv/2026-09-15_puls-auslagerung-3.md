# Ausgelagert aus docs/PULS.md — 2026-09-15 (dritte Auslagerung)

**Warum.** `docs/PULS.md` stand bei **3.017** von 3.000 Zeilen. Die Verfassung
sagt dazu: **auslagern statt kürzen** — die Grenze wird nicht herabgesetzt und
kein Satz gestrichen. Der Eintrag unten steht hier **wortwörtlich**, nichts
daran ist gekürzt oder umformuliert.

**Warum GERADE dieser.** Es ist der älteste noch vollständig in `PULS.md`
stehende Eintrag. Die beiden Auslagerungen davor
(`2026-09-15_puls-auslagerung.md`, `…-2.md`) haben die jüngeren genommen; der
Eintrag, der die dritte SBKIM-Auflösung als Befund festhält, bleibt in `PULS.md`
stehen — `tests/smoke_sbkim_name.mjs` besteht ausdrücklich darauf, und das ist
die Gegenrichtung, die verhindert, dass die Aufzeichnung stillschweigend
verschwindet.

---

## Stand 2026-09-14 (Haupt-Sitzung, Nacht) · ✅ DAS WAPPEN SPRICHT MIT — 20 TRÄGER, NICHT 19

**Rolle:** Haupt-Sitzung, Fortsetzung. Klaus hat die Frage aus der Nachlese
darüber entschieden: **das Wappen spricht mit.** Aufgabe 2 (Andock-Werkzeug)
bleibt unberührt — Klaus' Weg dafür steht fest (erst zusammenführen, dann
übersetzen) und ist eine eigene Sitzung.

### Was gebaut wurde

| | |
|---|---|
| `OFFIZIELLE BESTÄTIGUNG` | → `OFFICIAL ATTESTATION` |
| `SIEGEL` | → `SEAL` (abgestimmt mit Modul 17, dort heißt der Slot ebenso) |
| `SBKIM` | bleibt — Eigenname |
| `ribbonText` | bleibt — den graviert der Host |

**Neuer Kanon: 16 = `d84fa539e76e`** · 17 unverändert `3f757b35cea5`.

`renderWappenSvg()` ist die einzige Ausgabestelle und führt die zwei Texte
durch `T()`. **Auf Deutsch gibt `T()` den Satz unverändert zurück, die
Ersetzung entfällt, das SVG bleibt byte-identisch** — dieselbe Bauart, die der
`ribbonText` seit jeher hat. Damit gilt *OHNE EINSTELLUNG ÄNDERT SICH NICHTS*
auch hier.

⚠ **Gesucht wird `>TEXT<`, nicht der Text allein.** Beide Wörter kommen im SVG
ein zweites Mal außerhalb eines Textknotens vor; eine Ersetzung am bloßen Wort
träfe Markup statt Anzeige.

### Der Rollout — 20 Träger, und warum es nicht 19 sind

**BookLedgerPro kam dazu.** Es hing schon vor diesem Rollout **eine Generation
zurück** (kein Sprach-Haken) und fiel deshalb aus dem Raster, das nach der
*erwarteten* Vorgänger-Fassung suchte. Gemessen: seine 35 abweichenden Zeilen
waren **genau die**, die der Kanon durch `T()` ersetzt — kein repo-eigener
Code, reiner Rückstand.

> **Ein Rollout, der nur die zählt, die die erwartete Vorgänger-Fassung tragen,
> übersieht die, die noch weiter zurückhängen.** Verwandt mit „ein Drift-Guard
> sagt *unverändert*, nicht *aktuell*" — hier von der anderen Seite.

⚠ **UND BOOKLEDGERPRO PINNTE SEINEN EIGENEN sha**, nicht den von Sage
(`3e17f6474fc7f96f`). Meine Pin-Suche lief über alle drei Längen des
**Sage**-sha und konnte ihn nicht finden. Gefunden hat ihn die Probe des Repos
selbst: **2181/1, `✗ 16_siegel.js unverändert`.** Der Drift-Guard hat getan,
wofür er da ist.

⚠ **11 von 20 brauchten einen `CACHE_VERSION`-Bump**, gemessen statt geraten —
und jeder **+1 gegen `origin/main`** geprüft, nicht gegen die eigene Datei
(die Kollisionsfalle vom 2026-09-07, als zwei Sitzungen unabhängig `v26`
vergaben). Beim ersten Messversuch hatte `head -1` in zwei Repos den
**falschen** Service-Worker erwischt; neu gemessen über alle Worker je Repo.

### Der Wächter — und warum Abschnitt 4 allein nicht genügt

**Abschnitt 4** gleicht das Wappen gegen die Tafel ab (jeder Text benannt,
jeder `WAPPEN_TEXTE`-Eintrag mit englischer Fassung, jeder genau einmal als
`>Text<` im SVG). **Abschnitt 4b ist neu und misst das WIRKLICH GERENDERTE
Badge** — denn 4 liest nur den Quelltext und fände die Zeilen auch dann
tadellos, wenn `renderWappenSvg()` gar nicht mehr gerufen würde. *Ein Wächter,
der eine Datei liest, misst nicht, ob sie läuft.*

⚠ **ZWEI GEGENPROBE-FÄLLE FINGEN AUS DEM FALSCHEN GRUND.** Beide benannten
einen Wörterbuch-Schlüssel um — damit verlor er zugleich seine Fundstelle im
Code, und **Abschnitt 1 feuerte zuerst**. Gefangen waren sie, gemessen hatten
sie den Nachbarn. Geschärft über `SBKIM` (steht im Wappen, hat mit Absicht
keinen Eintrag) und `Pflicht-Module` (hat einen Eintrag, steht nicht im
Wappen) — jetzt fällt je genau der gemeinte Wächter.

⚠ **KEIN FALL zur Abbruch-Bedingung, und das ist eine benannte Grenze statt
einer Lücke:** nimmt man sie weg, läuft auf Deutsch ein `replace(">X<", ">X<")`
— byte-genau dasselbe. Der Fall wäre **immer** „nicht gefangen", ohne dass der
Wächter etwas falsch macht. *Ein Fall, der nichts messen kann, sieht aus wie
Deckung.*

**Gemessen:** `smoke_bau1617_sprache.mjs` **83 grün** (vorher 64) ·
`gegenprobe_bau1617_sprache.sh` **30 gefangen, 0 durchgerutscht, 0 tote Anker**
· voller Sage-Lauf **103 grün, 0 rot** · alle 20 Träger nach dem Rollout grün,
darunter family-project **110/110** und BookLedgerPro **2182/0**.

⚠ **EIN `exit=0` KAM VOM `echo`, NICHT VOM `node`** — die `| tail`-Falle in
einem neuen Kostüm. family-project meldete zuerst „grün", während die Probe in
Wahrheit mit `ERR_MODULE_NOT_FOUND` abbrach: `playwright-core` fehlte, also
**nicht lauffähig, nicht grün**. Nachinstalliert und wirklich gemessen.
