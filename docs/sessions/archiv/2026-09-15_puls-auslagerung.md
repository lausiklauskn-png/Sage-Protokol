# PULS-Auslagerung — eine Sitzung vom 2026-09-14 (spät)

**Ausgelagert am 2026-09-15.** `docs/PULS.md` stand bei 3.013 von 3.000
Zeilen. **Ausgelagert, nicht gekürzt** — der Wortlaut steht hier vollständig
und unverändert.

---

## Stand 2026-09-14 (Haupt-Sitzung, spät) · ✅ SIEGEL UND LAMPEN SPRECHEN ENGLISCH — 19 APPS

**Rolle:** Haupt-Sitzung, Fortsetzung des Sprach-Haken-Rollouts. Modul 23 UI
sprach seit dem Morgen Deutsch und Englisch; Modul **16** (Siegel) und **17**
(Lampen) nicht. Ein Voll-Knoten war damit gemischtsprachig.

### Die Tafel kam diesmal ZUERST

`docs/INTERFACES.md` trägt seit heute je einen `SPRACHE`-Absatz für 16 und 17,
**geschrieben bevor eine Zeile Code entstand**. Bei Modul 23 lief es umgekehrt,
und es ist niemandem aufgefallen: die Schnittstelle war vier Tage lang breiter
als ihre Beschreibung. Gefunden hat das nicht eine Probe, sondern Klaus' Frage
nach den Bauplänen.

### Was gebaut wurde

Verfahren byte-gleich mit 23 UI: **schlüssellos, der deutsche Satz IST der
Schlüssel.** Rangfolge `cfg.lang` → `<html lang>` → `de`; jeder andere Wert
fällt fail-soft auf Deutsch.

| Modul | Einträge | was übersetzt wird |
|---|---|---|
| **16** | 55 | Modal, Aspekte, Badge-Etiketten, Andock-Block |
| **17** | 28 | die vier Lampen-Etiketten, Tooltips, beide Fenster |

**Die Lampen-Etiketten sind die sichtbarste deutsche Stelle des ganzen Netzes.**
Sie stehen auf jeder Seite dauerhaft da, bevor irgendjemand ein Fenster öffnet —
genau deshalb fiel Klaus „SIEGEL" zwischen englischen Zeilen auf.

⚠ **Die ZERTIFIKAT_ASPEKTE bleiben deutsch IM CODE.** Übersetzt wird erst an der
Anzeige-Stelle (`T(a.aspect)`). Die Liste ist netzweiter Protokoll-Bestand; ihr
deutscher Wortlaut ist die Urkunde.

⚠ **KEIN ZERTIFIKAT_ASPEKTE-Eintrag**, obwohl 16 ein Schutz-Modul ist und die
Konvention sonst greift: eine Übersetzung ist Render-Schicht. Ein Eintrag
„spricht jetzt Englisch" behauptete einen Sicherheits-Fortschritt, den es nicht
gibt — und verwässerte die Liste, die Sicherheits-Updates sichtbar machen soll.

⚠ **`lang` geht an DREI Aufrufe, nicht an einen.** `SbkimConnect.init({lang})`
reicht ihn nur ans Verbinden-Fenster durch. Über `<html lang>` entfällt das.

### Die Gegenprobe hat DREI eigene Fehler entlarvt

Keiner davon wäre beim Nachdenken aufgefallen:

| Was | Warum es nichts mass |
|---|---|
| der Wächter fand sein **eigenes `T("…")` im Erklär-Kommentar** | er nagelte Prosa fest statt Code |
| drei Schlüssel waren **Konkatenationen** | der zusammengesetzte Satz steht nirgends als Zeichenkette in der Datei |
| der Laufzeit-Teil mass eine **LEERE Zeichenkette** | niemand hatte das Modal geöffnet — er war trivial grün |

**Und der mitkopierte CSS-Filter ist herausgeflogen.** Abgeschaltet meldet die
Probe **0 vor und 0 nach**: in 16/17 entsteht CSS über `style.cssText`-Arrays,
also auf Zeilen, die der Vorfilter gar nicht durchlässt. Ein Riegel, den keine
Gegenprobe von seinem Fehlen unterscheiden kann, ist eine Behauptung.

**Neu dazugekommen ist ein Wächter auf die DATEN-Tabellen.** Ein **neu
angehängter** Aspekt ohne Übersetzung taucht in keiner der beiden Mengen von
Abschnitt 1 auf — und genau das wird passieren, weil jede Schutz-Modul-Sitzung
einen anhängen muss.

**Gemessen:** `tests/smoke_bau1617_sprache.mjs` **64 grün** ·
`tests/gegenprobe_bau1617_sprache.sh` **25 gefangen, 0 durchgerutscht, 0 tote
Anker** · voller Lauf **102 Proben grün, 0 rot, 0 nicht lauffähig**.

### Der Rollout — 19 Repos, nicht 18

**Privat-Brain kam dazu**: es trägt 16/17, aber kein 23-UI, war beim letzten
Rollout also nicht dabei.

**Alle 19 trugen EINE Generation, byte-genau die Fassung vor dieser Änderung.**
Der Diff ist damit reiner Kanon-Fortschritt — keine repo-eigene Zeile betroffen.
Kanon: 16 `7589f18d59dc` · 17 `3f757b35cea5`.

⚠ **SB-KIMTool-Point pinnt mit 16 Zeichen** — eine Suche nach dem vollen
64-Zeichen-sha findet ihn NICHT. Gesucht wurde in allen drei Längen; danach kein
alter sha-Rest in keinem Repo. Und dort liegen **drei** Siegel-Dateien: gemessen
(`grep ZERTIFIKAT_ASPEKTE`) ist `assets/sbkim-siegel.js` der Loader (0 Treffer),
`sandbox/16_siegel.js` die Fassung des Modells (2), und nur
`web/tools/sbkim-siegel.js` die Modul-Kopie (11). Nur die wurde ersetzt.

⚠ **CACHE_VERSION erst gemessen, dann gebumpt.** In **10** Repos steht das Modul
wirklich im **Installations**-Vorrat → erhöht. In **9** nicht → **kein Bump**,
weil er dort nichts bewegt (Messung vom Morgen bestätigt). Der erste Fund war ein
Fehlalarm: mein Muster traf `assets/sbkim-siegel-wappen.svg`.

**Zwei rote Proben, beide per Gegenprobe auf blankem `origin/main` als
vorbestehend belegt:** SB-KIMTool-Point 130/2 (dieselben zwei ohne meine
Änderung) · Tomys-Hub `smoke-verbund.cjs` — der Ausgangs-Proxy dieser Sitzung
sperrt `wss://relay.family-projekt.de`.

### Die Anleitungen und die Kiste

Die drei Sage-Anleitungen (`status-leiste-siegel`, `saubere-netz-anmeldung`,
`netz-karte-fenster`) hatten **null Treffer** auf lang/Sprache/Englisch. Sie
tragen jetzt je einen Abschnitt — samt der drei Browser-Übersetzer-Fälle und des
**1,5 s langen Drucks** auf den Sprachknopf, der versteckt ist und nur im
Vorlese-Namen steht.

**PWA-Toolpoint und SB-KIMTool-Point** hatten die Anleitung gar nicht im Repo (0
Dateien, gemessen). Sie bekommen je zwei **Zeiger** nach Sage — keine Kopie,
dasselbe Muster wie family-project seit dem 2026-08-22.

Voll-Kiste, `PFLICHT_MODULE.md`, `MYCEL-GESCHENKBOX.md` und beide
`sbkim-connect.js` sagen nicht mehr „gemischtsprachig" — überall mit dem alten
Satz daneben, weil er beschreibt, was ein Forker in einer älteren Kopie findet.

### ⚠ NEBENBEFUND: zwei Panels in `manual_check.html` liefen seit ELF TAGEN NICHT

Gefunden beim Abarbeiten von CLAUDE.md § Pflicht am Sitzungsende Punkt 3 — die
Pflicht hat gearbeitet, wofür sie da ist.

In zwei Zeichenketten stand hinten ein **gerades** Anführungszeichen statt des
schließenden deutschen: `"Jetzt „👥 discover" drücken."`. Das gerade `"` beendet
die JS-Zeichenkette, und der Rest des Blocks ist Syntaxfehler. Betroffen war ein
ganzer `<script>`-Block (Panel 23); im Browser stand das Panel **tot** da. Seit
Commit `6015af1` vom **2026-09-03**.

**Dasselbe Muster wie `\n` statt einer echten Zeile und wie `$` mit m-Flag:** ein
Zeichen, das der Schreibende als Text meint und der Parser als Syntax liest. Man
sieht es nicht — man misst es.

Dagegen steht jetzt `tests/smoke_manual_check_syntax.mjs` (`node --check` über
jeden Inline-Block, mit Zeilennummer in der roten Zeile). Er trägt seine
Gegenrichtung selbst und nagelt das Zeichen fest. **Benannte Grenze:** er prüft
die Syntax, nicht ob die Panels das Richtige tun. Voller Lauf danach: **103
Proben grün.**

### 🔴 NEU AUFGEMACHT, Entscheidung von Klaus

**Das Andock-Werkzeug IM Siegel ist app-eigener Klebstoff und vom Rollout nicht
erreichbar.** Gemessen über alle 19 Repos: **20 Dateien** (`siegel-inhalt.js` /
`pruefer-siegel-inhalt.js` / `assets/sbkim-siegel.js`) mit je **41–52 deutschen
Texten**. Dieselbe Lage wie beim Gerätenamen, nur größer.

⚠ **Und sie sind bereits auseinandergelaufen:** Alis-Moderaum 533 Zeilen,
Kimseek 407, Mein-Tresor 492, PWA-Toolpoint 540 — **272 Zeilen gemeinsam**. Ein
„in den Kanon ziehen" ist damit nicht der kleine Handgriff, nach dem es aussieht.

**Was NICHT geprüft ist:** Klaus' Browser-Sichttest. Und: nach einem Deploy
liefert das erste Laden noch die alte Fassung, das zweite die neue.

**Nächster sinnvoller Schritt:** Sichttest am Tablet — eine Seite auf Englisch
stellen und nachsehen, ob die Lampen mitziehen.

---
