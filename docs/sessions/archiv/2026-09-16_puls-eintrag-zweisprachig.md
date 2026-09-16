# Ausgelagerter PULS-Eintrag — 2026-09-16 (Zweisprachigkeit Mycel-Fenster)

> Ausgelagert am 2026-09-16, weil `docs/PULS.md` die 3000-Zeilen-Grenze erreichte.
> **Nichts gekürzt** — der Eintrag steht hier wortgleich, wie er in PULS.md stand.

---

## 2026-09-16 · Das Fenster hinter der englischen Lampe war deutsch

**Klaus' Bitte:** *„verliere das Ziel Übersetzung in Mycel / Mit dem
Knotennetz verbinden und Siegel nicht aus dem Auge. Es wurde in der
Vorgängersitzung entwickelt."*

### Zuerst gemessen, wo die Übersetzung wirklich steht

| Modul | T()-Aufrufe | Einträge `TEXTE.en` | ohne englische Fassung |
|---|---|---|---|
| 16b Andock-Wizard | 83 | 83 | **0** |
| 23 UI Verbinden-Fenster | 239 | 239 | **0** |
| 16 Siegel · 17 Lampen | über Daten-Tafeln | 57 · 28 | **0** |
| **15 Membran** | — | **keine Tabelle** | **alles** |

⚠ **MEIN ERSTES MESSWERKZEUG WAR DAS BLINDE, NICHT DIE ÜBERSETZUNG.** Es
suchte `T("…")` als Literal und hielt 39 Einträge in Modul 16 für tot. Modul 16
übersetzt aber **Daten** an der Anzeige-Stelle — `T(a.aspect)`, `T(m.name)`,
`T(WAPPEN_TEXTE[i])`. Der vorhandene Wächter deckt das längst ab; meins nicht.
*Eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten hinsehen
musst* — hier gab sie mir unrecht, und das war genauso falsch.

### Der Befund: eine halb übersetzte Tafel, in einem Pflicht-Modul

Das **Fremdzugriff-Fenster** von Modul 15 hängt an der **FREMD-Lampe von Modul
17** — und die spricht seit dem 2026-09-14 Englisch. Wer dort klickte, bekam ein
vollständig deutsches Fenster. Gemessen über alle Träger: **0 von 20** zeigten
das Fenster auf Englisch, **20 von 20** die Leiste darüber.

Modul 15 ist eines der **dreizehn Pflicht-Module** eines arbeitenden Knotens.
`INTERFACES.md` behauptete seit dem 2026-09-14: *„Ein Voll-Knoten ist damit
durchgehend zweisprachig."* **Der Satz war falsch, und zwar genau um dieses
Fenster.** Ersetzt, nicht stillschweigend getauscht.

### Was gebaut wurde

Verfahren byte-gleich mit 16, 17 und 23 UI: schlüssellos, Rangfolge
`init({lang})` → `<html lang>` → `de`, fail-soft. **31 Einträge.** OHNE
EINSTELLUNG ÄNDERT SICH NICHTS.

⚠ **DIE KLARTEXT-ZEILE IST IN GANZEN SÄTZEN ÜBERSETZT, nicht in Stücken.**
`entryErklaerung()` baute sie aus Fragmenten zusammen — *„Kam 3.4 s nach dem
Laden der Seite"* + *„, während der Tab vorn war."*. Auf Deutsch ließ sich das
am Komma zerschneiden; im Englischen steht die Zeitangabe an anderer Stelle im
Satz. Jede Variante ist jetzt ein **eigener** Eintrag mit Platzhaltern.

⚠ **DIE ZÄHL-ZEILE STAND AN DREI STELLEN** als eigener Zusammenbau. Beim
Übersetzen wären das drei Schlüssel gewesen, von denen zwei still deutsch
geblieben wären. Jetzt `zaehlText()`.

⚠ **NICHT ÜBERSETZT:** die Spaltenköpfe `kind`/`origin`/`endpoint`/`decision`
und ihre Werte (`ignored`, `membrane-postmessage`). Das sind Feldnamen und
Feldwerte des Protokolls — wer einen Befund meldet, soll in beiden Sprachen
dasselbe Wort nennen können. Ein eigener Wächter besteht in beide Richtungen
darauf.

⚠ **KEIN `ZERTIFIKAT_ASPEKTE`-EINTRAG**, obwohl 15 ein Schutz-Modul ist —
dieselbe Begründung wie bei Modul 16: eine Übersetzung ist Render-Schicht.

### Drei eigene Fehler, keinen hat das Nachdenken gefunden

| Was | Wie es sich zeigte |
|---|---|
| **`escapeHtmlText()` gibt es in Modul 15 gar nicht** | wäre beim ersten Öffnen des Fensters abgestürzt. `node --check` schweigt dazu — es prüft Syntax, nicht ob ein Name existiert |
| **Der neue Abschnitt maß beim ersten Lauf NICHTS** | ohne `#lamp-fremd` hängt das Modul keinen Klick-Hörer an, das Fenster blieb **zu**, die Tabellenzeilen entstanden nie — und die zehn „steht auf Englisch nicht mehr da"-Zeilen waren **trivial grün**. Der Vorbedingungs-Wächter hat es gefangen |
| **`innerHTML` war im DOM-Stub eine reine Zeichenkette** | also gab es kein `<tbody>` zum Befüllen. Der Stub liest jetzt einfaches Markup; 16 und 17 blieben dabei **gemessen** bei 99 grün, 0 rot |

### Und der größere Fund: Modul 15 liegt netzweit in FÜNF Fassungen

Beim Rollout-Blick gemessen, auf `origin/main`, nicht auf Arbeitsbäumen:

| sha | Zeilen | Träger |
|---|---|---|
| `f88b5d04bc08` (aktuell) | 1662 | **8** |
| `fbf9f42d8a27` | 1317 | **8** |
| `0f8a3f69de61` | 1314 | 2 |
| `33d6fe0c5057` | 1313 | 1 |
| `8a07567f98ce` | 1558 | 1 (family-project) |

**Zwölf Träger auf einer älteren Generation, bis zu 349 Zeilen zurück — in
einem Schutz-Modul.** Der Brief nannte family-project als „eine Generation
zurück"; es sind zwölf Repos, und family-project ist nicht einmal das
entfernteste.

⚠ **DER VERTEILER KONNTE DAS NICHT ZEIGEN, und ich habe seine Ausgabe prompt
falsch gelesen.** Er meldete „19 hängen zurück" mit Abständen von 225 bis 657
Zeilen — daraus liest man „überall fehlt dieselbe Änderung". Der Abstand je
Datei beantwortet *wie weit ist DIESE zurück*, nicht *wie viele Stände liegen
draußen*. Er zählt sie jetzt, **nach dem sha des Trägers, nicht nach dem
Abstand**: zwei Dateien können gleich weit zurückhängen und trotzdem
verschiedene Fassungen sein.

### Und ein stilles Überspringen mit gemessener Ursache

**BookLedgerPros Klon im Behälter steht 302 Commits / drei Monate zurück**
(HEAD 2026-06-14, origin/main 2026-09-16) — als einziges der 33 Repos. Sein
Sitzungs-Zweig wurde aus dem alten Klon abgezweigt, und der Sitzungsstart-Hook
fasst einen Nicht-Standard-Zweig **zu Recht** nicht an.

Der Verteiler liest den **Arbeitsbaum**. Dort gab es `sbkim/15_membran.js` noch
gar nicht — also keine Marke, kein Träger, kein Eintrag: *„19 Repos tragen
Kanon-Dateien"*, während auf `origin/main` **zwanzig** eine Kopie tragen. **Das
Repo fiel aus dem Lauf, ohne dass eine Zeile darüber stand.**

Das ist die Schwester der Lehre *„eine gefundene Liste schützt vor einer
veralteten Kopie, nicht vor einer fehlenden"* — nur ist die Kopie hier nicht
fehlend, sondern **unsichtbar**. Der Verteiler meldet es jetzt und **fasst
nichts an**: ein Automat, der fremde Arbeitsbäume bewegt, könnte ungepushte
Arbeit überfahren.

⚠ **Der Befund der Vorgängersitzung hält trotzdem** — unabhängig auf
`origin/main` nachgeprüft: BookLedgerPro trägt dort wirklich kein
`sbkim-andock-wizard.js`, und `siegel-inhalt.js` hat 479 Zeilen.

### Wer sein Verbinden-Fenster selbst malt, erreicht der Kanon nicht

Gemessen: **Private Brain** hat kein `23_rendezvous_ui.js`, sondern
`modules/net-widget.js` — 838 Zeilen, app-eigen, bewusst nativ gebaut, **0
Treffer auf `TEXTE`**. Dazu die zwei längst benannten: family-project
(`assets/status-widget.js`, ruft `SbkimWidget.hide()`) und PWA-Toolpoints
Startseite. *Eine Kette mit `lang=en` beweist nicht, dass der Nutzer Englisch
sieht.* Steht jetzt in `INTERFACES.md` statt nur in der SIGNAL-Historie.

### Gemessen

| | |
|---|---|
| `node tests/run_alle.mjs` | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |
| `smoke_bau1617_sprache.mjs` | **141 grün** (vorher 83) |
| `smoke_kanon_verteilen.mjs` | **35 grün** (vorher 25) |
| `gegenprobe_bau1617_sprache.sh` | **41 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `gegenprobe_kanon_verteilen.sh` | **13 gefangen · 0 durchgerutscht · 0 tote Anker** |

Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. Vor jedem Commit die
**Dateiliste** angesehen, nicht nur den Diff.

⚠ **Die Zahlen davor bleiben daneben stehen, weil sie die Funde gemacht haben:**
die Sprach-Gegenprobe meldete zuerst **40 gefangen · 1 toter Anker**, und zwei
Fälle fielen am **Nachbar**-Wächter statt an ihrem eigenen. Bei der
Verteiler-Gegenprobe war es dasselbe: zwei Sabotagen ließen das Werkzeug
**abstürzen**, und dann meldete die erste Zusicherung des Laufs.

### Was offen bleibt

- **Der Rollout von Modul 15 ist NICHT gefahren** — und das ist eine
  Entscheidung, keine Auslassung. Acht Träger bekämen einen reinen Nachtrag,
  **zwölf einen Generationen-Sprung in einem Schutz-Modul**, und der braucht
  laut Verfassung einen Probenlauf im Ziel-Repo. Beides in einer Bewegung wäre
  genau das Vermischen, vor dem die Tafel warnt. **Klaus entscheidet.**
- **BookLedgerPro** (Wizard-Kanon **und** der veraltete Klon), **Privat-Brains
  4** und **SB-KIMTool-Points 2** vorbestehende rote Zeilen, und der
  Rezept-Export trägt die Spore nicht.
- **Klaus' Browser-Sichttest** — ob das Fenster auf einer englischen Seite
  wirklich englisch dasteht, sieht nur er.
- **Mein WorkFlohs `sampleContent()`-Gerüst bleibt ausgeschaltet.**

**Nächster sinnvoller Schritt:** die Rollout-Frage entscheiden (acht jetzt,
zwölf mit Probenlauf) — davon hängt ab, ob das Fenster bei den Nutzern ankommt.
