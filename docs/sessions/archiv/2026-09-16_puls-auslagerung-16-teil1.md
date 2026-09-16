# PULS-Auslagerung — zwei Sitzungen vom 2026-09-16

**Ausgelagert am 2026-09-16**, weil `docs/PULS.md` an der 3000-Zeilen-Grenze
stand und der Abschluss-Eintrag des Modul-15-Rollouts anstand. **Nichts wurde
gekürzt** — beide Einträge stehen unten wortgleich so, wie sie im PULS standen.

Die Grenze wird ausgelagert, nicht herabgesetzt (Schutz-Klausel 2026-05-17).

---

## 2026-09-16 · Eine Kennung, eine Spore — und die Zahl, die kein Vertrag war

**Klaus' Bitte:** *„Entweder signierst du im Mycel in diesem Knotennetz
verbinden oder du signierst im Siegel. Du musst nicht in beiden signieren. Also
die Spore."* Dazu: der Nutzer soll begreifen, dass im Siegel „eine andere
Adresse" gilt — auf Rückfrage bestimmt als **„die Bedeutung"**, also ein anderes
Thema, nicht eine andere nodeId.

**1 · Die Prämisse war messbar, und sie stimmte nicht.** `generateOwnSpore(meta,
key)` setzt `slotKey = key || await getActiveIdentityKey()` — beide Wege landen
im **selben Fach** und erzeugen **dieselbe nodeId**. Modul 23 UI signiert dabei
gar nicht (kein `generateOwnSpore`); im Verbinden-Weg signiert der App-Klebstoff
(`sbkim-init.js` / `sbkim-connect.js`) beim ersten Verbinden. Es sind also nicht
zwei Adressen, sondern eine — und genau dieser Satz hat gefehlt.

**2 · Gebaut wurden vier Sätze, kein Umbau.** Kanon `16b_andock_wizard.js`:
Schritt 2 *„Dieselbe Spore wie im Verbinden-Fenster: eine Kennung, ein Eintrag im
Netz. Du signierst hier ODER dort, nicht in beiden."*, Schritt 3 *„Dieselbe
Sicherung wie im Verbinden-Fenster: zweimal drücken ergibt zwei Dateien mit
gleichem Inhalt."* — je an drei Stellen (EN-Tabelle, `TEXTE_DE`, Aufrufstelle).
Kanon `23_rendezvous_ui.js`: *„Eine Kennung, eine Spore: im Siegel signierst du
dieselbe. Einmal genügt."* (nur mit vorhandener Kennung) und in der
Sicherungs-Meldung *„Das ist dieselbe Sicherung wie im Siegel — eine Datei
genügt."* Dazu entfiel `„Erzeuge domainVector (384) …"` aus beiden Tabellen: den
Aufruf gibt es seit dem Inhalts-Vektor nicht mehr.

**Gemessen:** `smoke_kanon_wizard.mjs` **80 grün · 0 ROT** (9 neue Wächter),
`smoke_bau23_0b_identitaet.mjs` **60 grün · 0 rot** (4 neue, davon 1
Gegenrichtung), `node tests/run_alle.mjs` **107 Proben · 107 grün · 0 rot**.
Rückgabewerte direkt gelesen, nicht hinter einer Pipe.

⚠ **Gemessen wird der GRIFF, nicht der Quelltext:** die Probe klickt `#sbwiz-s2`
und liest, was `generateOwnSpore` entgegengenommen hat.

⚠ **Zwei Gegenprobe-Fälle waren aus dem falschen Grund gefangen** — sie tauschten
nur den englischen Tabellen-Eintrag, also fielen die Übersetzungs-Wächter statt
des gemeinten. Neu gestellt (Satz überall ersetzt), danach fiel jeder mit dem
Namen seiner eigenen Zusicherung. Ein dritter meldete „NICHT GEFANGEN" wegen
eines mehrzeiligen Ankers, der meinen Auswerte-Parser brach. **Benannte Grenze:**
die sechs Fälle sind von Hand nachgestellt und **nicht** als Datei abgelegt.

**3 · Eine Zahl in einer Prüfung ist kein Vertrag.** Mein Verifikations-Maß
(„mindestens 2 Dateien mit `markBackupMade` je Repo") meldete BookLedgerPro,
Privat-Brain und SB-KIMTool-Point als rot — **alle drei sind vollständig**, sie
tragen nur eine der beiden Kanon-Dateien. Ersetzt durch den sha-Vergleich jeder
`.js`-Datei gegen die zwei Kanon-shas: **43 byte-gleiche Kopien.** Ein
Marker-Regex lieferte dabei überall „0 Treffer" — statt das zu glauben, wurde
gewechselt.

**4 · Die englische Tafel hat 6/8 Leerzeichen, nicht 4.** Mein Eintrag zerbrach
den eigenen **und den folgenden** Schlüssel; gefangen hat es
`smoke_bau23_sprache.mjs` mit zwei Zeilen zugleich („2 ohne englische Fassung",
„236 von 237 als Paar lesbar").

**5 · Rollout, zwei Wellen, beide vollständig:** Stempel „Letzte Sicherung" (21
PRs) und „Eine Kennung, eine Spore" (21 PRs), je **43 byte-gleiche Kopien auf
`main` nachgezählt, bevor die Zweige gehoben wurden**. Neue Kanon-shas: 16b
`0fbef6d8bcfc` (vorher `119d12cd1817`), 23 UI `7de463462ae5` (vorher
`e8694ae55261`); kein alter sha blieb im Netz. Sages **eigene drei Kopien** trägt
der Verteiler nicht — von Hand nachgezogen. `assets/siegel-inhalt.js` traf die
Suche mit und wurde bewusst nicht angefasst.

**Drei rote Suiten, alle als vorbestehend belegt:** SB-KIMTool-Point 2
(wortgleich auf blankem `origin/main`), Privat-Brain 4 (`diff` der roten Zeilen
leer), PWA-Toolpoint 2 (`?v=` gegen `CACHE_VERSION`, auf `main` schon 53 zu 50).
`fake-indexeddb` fehlte zunächst — **nicht rot, sondern nicht lauffähig**.

**Offen:** (1) PWA-Toolpoints `?v=` zieht nicht auf die Cache-Nummer nach —
gemessen 55 zu 50 nach meinem Bump, 64 Fundstellen, **bewusst nicht behoben** und
im PR benannt; offene Frage, ob der Verteiler das künftig selbst tun soll.
(2) Ob Mein WorkFloh ein `sampleContent()` bekommt — Auftragsdaten sind fremde
Kundendaten, **Klaus' Entscheidung**. (3) ✅ **erledigt am selben Tag** — die Gegenprobe-Fälle sind abgelegt,
siehe den Nachtrag unten. (4) `docs/PULS.md` stand mit diesem Eintrag bei genau 3000 Zeilen; die drei
ältesten vollen Einträge (A18, 2026-09-14) sind **wortgleich** nach
`sessions/archiv/2026-09_puls-auslagerung-14.md` ausgelagert — Stand danach
2818 Zeilen. **Ausgelagert, nicht gekürzt.**

Protokoll: [`docs/sessions/archiv/2026-09-16_eine-kennung-eine-spore.md`](sessions/archiv/2026-09-16_eine-kennung-eine-spore.md).

**Nachtrag desselben Tages · die Fälle sind jetzt abgelegt.** Eine Prüfung, die
nur im Kopf einer Sitzung stattgefunden hat, ist bei der nächsten Änderung nicht
mehr da. **Fünf Fälle**, jeder einzeln gefahren:

| Datei | Fälle | Ergebnis |
|---|---|---|
| `tests/gegenprobe_kanon_wizard.sh` (Abschnitt F) | 2 — die Hinweise auf die EINE Spore und die EINE Sicherung | **31 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `tests/gegenprobe_bau23_0b_identitaet.sh` (**neu**) | 3 — der Satz in der Box, der Zusatz in der Erfolgsmeldung, und die **Gegenrichtung** (ohne Kennung steht er NICHT da) | **3 gefangen · 0 durchgerutscht · 0 tote Anker** |

⚠ **EIN SATZ STEHT VIERMAL DA**, und deshalb gibt es jetzt `saboten_paar`:
dreimal deutsch (Schlüssel der englischen Tafel, `TEXTE_DE`, Aufrufstelle) und
einmal englisch. Wer nur die englische Fassung tauscht, bringt die
**Übersetzungs**-Wächter zu Fall statt des gemeinten; wer nur die deutschen
tauscht, lässt eine Übersetzung ohne deutschen Satz zurück. *Rot ist es beides
Mal — nur trägt die rote Zeile den falschen Namen.*

⚠ **UND ZWEI FEHLER STECKTEN IM PRÜFWERKZEUG, keiner im Code.** Beide beim
ersten Lauf der neuen Datei gefunden, beide nicht durch Nachdenken:

- **Ein gerades `"` in einem Fall-Label beendet die bash-Zeichenkette.** Das
  Label lautete `„eine Kennung, eine Spore"` mit geradem Schlusszeichen; die
  Argumente verrutschten und **ein Fall verschwand ganz** — gemeldet wurden 2
  statt 3, mit einer leeren roten Zeile daneben. Gefunden hat es **die Zahl, die
  nicht stimmte**.
- **Der Helfer übersetzt `\n` in einen echten Umbruch** (damit sich Zeilen
  einfügen lassen) — im Quelltext steht dort aber ein **wörtliches**
  Backslash-n in einer JS-Zeichenkette. Der Fall meldete „ANKER NICHT GEFUNDEN"
  und maß nichts. Neu gestellt **ohne** `\n` im Anker, und der Satz wird gegen
  einen anderen harmlosen getauscht statt gegen nichts.

Gemessen danach: `node tests/run_alle.mjs` → **107 Proben · 107 grün · 0 rot**.

## 2026-09-16 · Die Ordner-Zählung, die englische Tafel und ein zu enger Bump

**1 · Zwei Stellen zählten dieselbe Sache verschieden.** Klaus mit Bild: *„Sushi
steht in den Ordnern mit null Rezepten, obwohl mindestens sechs drin sind. Oben
in der Kategorie-Leiste bei Rezepte steht Sushi mit sechs."* Beide Zahlen waren
richtig gerechnet — die Leiste über `katVonRezept`, der Ordner-Baum über das
**rohe** Feld `r.cat`. Dieselbe Lücke traf „Ohne Kategorie". Eine Zeile tiefer
dasselbe: die Ordner-Gruppe zählte nur `r.folder`, die Ordner-Pille
`r.folder ODER r.cat==='fld_…'`.

Umgestellt in allen drei Apps; der Wächter misst die **Übereinstimmung** beider
Ansichten Gruppe für Gruppe, nicht eine feste Zahl. Gemessen:
**Mein Rezeptbuch 46 grün · Mein Mixarium 56 · Muttis 49**, je `0 ROT`;
Gegenproben **29 / 31 / 29 gefangen**, je `0 durchgerutscht · 0 falsch · 0 tot`.
Benannte Grenze im Mixarium: die Leiste zählt mit `alcAllowed`, bei
eingeschaltetem Alkohol-Filter zeigt sie mit Absicht weniger.

**2 · `TEXTE.en` — 83 von 83 Einträgen.** Die alte Zusicherung „OHNE EINSTELLUNG
ÄNDERT SICH NICHTS" ist **ersetzt, nicht stillschweigend getauscht**: ohne
`lang`-Angabe bleibt alles Deutsch, bei `lang="en"` kommt Englisch, ein Satz
ohne Eintrag fällt weiter fail-soft auf Deutsch zurück. Vier neue Wächter
(Vollständigkeit · nicht wortgleich · keine tote Übersetzung · **Platzhalter
stimmen überein**), fünf Gegenprobe-Fälle, jeder einzeln nachgestellt.

**3 · Der Bump-Riegel des Verteil-Automaten war zu eng.** Er bumpte nur, wo die
Datei im Installations-Vorrat steht. **Gemessen an drei Repos — PWA-Toolpoint,
Tomys-Hub, family-project —** liegt der Wizard dort in keinem Vorrat und wird
trotzdem **cache-first** aus dem Speicher bedient: ein Update, das still nicht
ankommt. Gebumpt wird jetzt, sobald der Worker `fetch` abfängt, die Cache-API
benutzt und sein **Geltungsbereich** die Datei erreicht — einmal je Worker je
Lauf, und `SW_VERSION` gehört ins Muster.

Drei Schärfungen kamen erst durchs Messen: die erste Fassung bumpte in
Tomys-Hub **fünf** fremde Unter-Apps · PWA-Toolpoint bumpte **zweimal** ·
Mein Mixarium bekam **gar keinen** Bump („kein Bump möglich", weil es
`SW_VERSION` heißt).

**Gemessen.** Sage `node tests/run_alle.mjs` → **107 grün · 0 rot · 0 nicht
lauffähig**, Rückgabewert 0 (ohne Pipe gelesen) · `smoke_kanon_wizard` **62 grün
· 0 ROT** · `gegenprobe_kanon_wizard` **29 gefangen · 0 durchgerutscht · 0 tote
Anker** · `gegenprobe_kanon_verteilen` **7 gefangen · 0 · 0** ·
`wizard-laedt-pruefen` → alle **21** Seiten liefern Konfiguration UND Kanon aus.
Verteilt: **19 Kopien in 18 Repos**, 16 Cache-Bumps.

⚠ **Ein toter Anker gefunden und nachgezogen:** der Gegenprobe-Fall „eine
App-Adresse steht im Kanon" zeigte seit Stufe 2 auf eine Zeile, die es so nicht
mehr gab — er meldete „ANKER NICHT GEFUNDEN" und maß nichts.

**Nächster Schritt.** Klaus' Sichttest im Siegel von Mein Rezeptbuch: steht dort
die Zeile „Dein Vektor kommt aus deinen eigenen Inhalten (N Einträge)"? — und,
neu, die Ordner-Liste: steht Sushi dort jetzt mit derselben Zahl wie oben?

---
