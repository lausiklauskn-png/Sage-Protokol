# 2026-09-16 · Die Ordner-Zählung, die englische Tafel und ein zu enger Bump

**Rolle:** Haupt-Sitzung (Fortsetzung der Sitzung vom 2026-09-15).
**Zweige:** `claude/andock-wizard-merge-gokcps` in 21 Repos.

---

## Stundennachweis

**Gemessen, nicht geschätzt** — die Spanne vom ersten bis zum letzten Commit
dieser Sitzung:

| | |
|---|---|
| erster Commit | 2026-09-16 01:48 (Mein Rezeptbuch, Ordner-Zählung) |
| letzter Commit | siehe Git-Historie dieses Zweigs |

⚠ **Was das NICHT enthält:** die Zeit vor dem ersten Commit hinterlässt keine
Spur und wird deshalb nicht mitgezählt. **Und die Spanne dieser Sitzung ist
nicht Klaus' Arbeitszeit** — beide überschneiden sich, sind aber nicht dasselbe.

---

## 1 · Zwei Stellen zählten dieselbe Sache verschieden

Klaus mit zwei Bildern:

> *„Sushi steht in den Ordnern mit null Rezepten, obwohl mindestens sechs drin
> sind. Oben in der Kategorie-Leiste in dem oberen Bereich bei Rezepte steht
> Sushi mit sechs."*

**Beide Zahlen waren richtig gerechnet — sie rechneten aus verschiedenen
Quellen:**

| | fragte | Sushi |
|---|---|---|
| Kategorie-Leiste (`renderCatNav`) | `katVonRezept(r)` | **6** |
| Ordner-Baum (`renderFolders`) | das **rohe** Feld `r.cat` | **0** |

Dieselbe Lücke traf **„Ohne Kategorie"**: der Reiter zählte zwei, der
Ordner-Eintrag null.

⚠ **Eine Zeile tiefer dasselbe noch einmal.** Die Ordner-Gruppe zählte
`r.folder===…`, die Ordner-Pille `r.folder ODER r.cat==='fld_…'`. Ein Rezept,
das nur über `r.cat` in einem Ordner liegt, fiel im Baum heraus.

**Geändert** (alle drei Apps): der Ordner-Baum (Kategorie- und Ordner-Gruppe) ·
der Ordner-Zähler im Reiter-Abzeichen · in Mein Rezeptbuch zusätzlich die
Gruppen des KI-Buchs und die Lieblingsrezept-Auswahl · die Ordner-Pille in
Mixarium und Muttis.

⚠ **Der Wächter misst die ÜBEREINSTIMMUNG, nicht eine Zahl.** „Der Ordner zeigt
6" wäre blind, sobald sich die Leiste bewegt. Gemessen wird Gruppe für Gruppe,
dass beide Ansichten dieselbe Zahl nennen — plus die Gegenrichtung, dass
überhaupt eine mitgebrachte Kategorie mit Inhalt dabei ist (sonst wären alle
Zahlen 0 und stimmten trivial überein).

**Benannte Grenze im Mixarium:** die Leiste zählt mit `alcAllowed`. Bei
eingeschaltetem Alkohol-Filter zeigt sie mit Absicht weniger als der Ordner —
das ist keine Abweichung, sondern die Zusicherung dieses Filters. Die Probe
schaltet ihn vor der Messung ausdrücklich aus.

**Gemessen:**

| App | Probe | Gegenprobe |
|---|---|---|
| Mein Rezeptbuch | 46 grün · 0 ROT (vorher 43) | 29 gefangen · 0 · 0 · 0 |
| Mein Mixarium | 56 grün · 0 ROT | 31 gefangen · 0 · 0 · 0 |
| Muttis Rezeptbuch | 49 grün · 0 ROT | 29 gefangen · 0 · 0 · 0 |

---

## 2 · `TEXTE.en` — 83 von 83 Einträgen

Die Übersetzung des Andock-Wizards stand seit dem 2026-09-14 offen.

⚠ **TAFEL-EVOLUTIONS-KLAUSEL, AUSDRÜCKLICH BENANNT.** Die alte Zusicherung hieß
**„OHNE EINSTELLUNG ÄNDERT SICH NICHTS"** und meinte: es gibt keine Tabelle,
also bleibt überall Deutsch — auch bei `<html lang="en">`. Sie ist **ersetzt,
nicht stillschweigend getauscht**:

| | vorher | nachher |
|---|---|---|
| `lang` fehlt / `de` | Deutsch | **Deutsch, Zeichen für Zeichen** |
| `lang="en"` | Deutsch | **Englisch** |
| Satz **ohne** Eintrag | — | fällt weiter **fail-soft auf Deutsch** zurück |

⚠ **Eine halb übersetzte Tafel ist die schlimmere Sorte** — sie sieht aus wie
eine englische Oberfläche und streut deutsche Sätze dazwischen. Vier Wächter:
jeder Eintrag hat eine englische Fassung (83/83) · keine ist **wortgleich** mit
der deutschen (Ausnahme: `nodeId: {0}`, ein Feldname) · keine Übersetzung ohne
deutschen Satz · **die Platzhalter stimmen überein** (ein fehlendes `{0}`
verschluckt die nodeId, und das sieht aus wie ein leeres Feld).

⚠ **Und Wächter 3 wäre daran umgefallen, ohne dass eine Zusicherung fiel.** Er
prüft „geht JEDER Anzeigetext durch `T()`?" und schnitt bisher nur `TEXTE_DE`
aus dem gemessenen Code. Die englische Tafel stand danach als 83 Sätze da, die
nicht durch `T()` gehen. **Beide Tafeln müssen heraus.**

---

## 3 · Der Bump-Riegel des Verteil-Automaten war zu eng

Er bumpte nur, **wo die Datei im Installations-Vorrat steht**. Ein Worker, der
gleich-ursprüngliche GETs **cache-first** beantwortet, legt sie aber beim ersten
Abruf **selbst** ab und liefert danach die alte Fassung weiter.

**Gemessen an drei Repos — PWA-Toolpoint, Tomys-Hub, family-project:**
`sbkim-andock-wizard.js` steht dort in keinem Vorrat und wurde trotzdem aus dem
Speicher bedient. Ein Sicherheits-Update, das still nicht ankommt.

**Es wird nicht geraten, ob ein Pfad cache-first läuft** — das ist aus dem
Quelltext nicht verlässlich zu lesen, und eine geratene Erkennung wäre genau der
stille Fehler, den sie verhindern soll. Gebumpt wird, sobald der Worker `fetch`
abfängt **und** die Cache-API benutzt **und** sein Geltungsbereich die Datei
erreicht. Die Kosten sind einseitig: ein überflüssiger Bump kostet einmal die
Schale neu laden, ein ausgelassener ein Update, das niemand bemerkt.

⚠ **Drei Schärfungen kamen erst durchs Messen, nicht durchs Nachdenken:**

| Erste Fassung | Befund |
|---|---|
| ohne Geltungsbereich | bumpte in **Tomys-Hub fünf** Unter-Apps, von denen keine den Wizard je sieht |
| ohne Gedächtnis | **PWA-Toolpoint** hat zwei Kopien und bumpte **zweimal** |
| Muster ohne `SW_VERSION` | **Mein Mixarium** bekam gar keinen Bump — „kein Bump möglich", und der Lauf ging weiter |

⚠ **Und `const schonGebumpt` stand zuerst UNTER seiner Verwendung.** Tote Zone:
der Lauf starb mit `Cannot access 'schonGebumpt' before initialization` —
**nachdem er bereits eine Datei geschrieben hatte.**

⚠ **Ein fetch-Listener allein ist kein Vorrat.** `sbkim/sbkim-sw.js` fängt POSTs
ab und leitet sie an die Seite weiter — es legt nichts ab. Ohne diese Bedingung
meldete der Automat dort dreimal „kein Bump möglich": *eine Warnung, die immer
kommt, verdeckt die eine, auf die es ankommt.*

---

## 4 · Ein toter Anker

Der Gegenprobe-Fall „eine App-Adresse steht im Kanon" zeigte auf
`return base + "_spore_" + stamp + ".json"`. Seit **Stufe 2** (2026-09-15) steht
dort zusätzlich `kennungsTeil(nodeId)`. Er meldete „ANKER NICHT GEFUNDEN" und
maß seitdem nichts. Nachgezogen.

---

## Gemessen

```
node tests/run_alle.mjs                 107 grün · 0 rot · 0 nicht lauffähig  (Rückgabewert 0, ohne Pipe)
node tests/smoke_kanon_wizard.mjs        62 grün · 0 ROT
bash tests/gegenprobe_kanon_wizard.sh    29 gefangen · 0 durchgerutscht · 0 tote Anker
bash tests/gegenprobe_kanon_verteilen.sh  7 gefangen · 0 durchgerutscht · 0 tote Anker
node tools/wizard-laedt-pruefen.mjs      alle 21 nicht ausgenommenen Seiten liefern Konfiguration UND Kanon
node tools/kanon-verteilen.mjs --nur 16b --schreiben   19 Kopien in 18 Repos · 16 Cache-Bumps
```

Eine ehrliche Meldung bleibt stehen: **Muttis `sw.js`** trägt `CACHE_NAME` statt
`CACHE`/`CACHE_VERSION` und bekommt keinen Bump. Die Datei wird von keiner Seite
registriert (gemessen 2026-09-08) — der Automat sagt es trotzdem, statt zu
schweigen.

## Nicht gemessen

- **Ob es am Tablet richtig aussieht.** Klaus' Browser-Sichttest ist nicht
  ersetzbar — weder für die Ordner-Zählung noch für die englische Oberfläche.
- **Der Drift-Hinweis** („dein Inhalt hat sich von deiner Spore entfernt"). Seine
  Schwelle wäre zu **raten**: das Einbettungs-Modell ist in dieser Umgebung ein
  16K-Platzhalter, huggingface antwortet mit HTTP 000. Unverändert offen.
