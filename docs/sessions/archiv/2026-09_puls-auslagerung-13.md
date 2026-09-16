# PULS-Auslagerung 13 — ausgelagert am 2026-09-16

Wortgleich aus `docs/PULS.md` genommen, damit die Datei unter ihrer
3000-Zeilen-Grenze bleibt. **Nichts gekürzt** — nur verschoben.

## Stand 2026-09-14 (Haupt-Sitzung, Nacht) · ✅ DER ROLLOUT VERTEILT SICH SELBST — UND 44 DATEIEN HÄNGEN ZURÜCK

**Rolle:** Haupt-Sitzung. Klaus hat nach dem Ziel gefragt, gemerkt, dass sich
die Sitzungen aneinanderreihen, und daraufhin **den automatischen Rollout
beauftragt** — statt der nächsten Übersetzung.

**Der Anlass, in einer Zahl:** am selben Tag kostete eine Kanon-Änderung
**23 Pull Requests für zwei übersetzte Wörter**. Nicht die Änderung war teuer,
sondern das Verteilen — und der Preis fiel bei jeder weiteren wieder an.

### Was gebaut wurde

`tools/kanon-verteilen.mjs` — findet die Träger selbst, vergleicht Prüfsummen,
zieht nach, was zurückhängt, samt sha-Pins (alle drei Längen) und
`CACHE_VERSION` nur dort, wo das Modul wirklich im Vorrat steht.

⚠ **DIE LISTE WIRD GEFUNDEN, NICHT GEPFLEGT.** Das ist die eine Entscheidung,
an der alles hängt, und sie folgt aus dem Schaden vom selben Tag:
**BookLedgerPro fiel aus dem Rollout**, weil nach der *erwarteten*
Vorgänger-Fassung gesucht wurde. Eine gepflegte Liste hätte denselben Fehler
gemacht, nur dauerhaft. Eine neue App ist dabei, **sobald sie ein Modul trägt**
— Apps und Internetseiten gleichermaßen (gemessen: Mein-Workfloh-Page trägt 13
Kanon-Dateien und ist damit genauso betroffen wie eine App).

⚠ **ERKANNT WIRD AM INHALT.** Jedes Modul trägt `SBKIM — Modul NN` im Kopf.
Damit lösen sich die drei Siegel-Dateien von SB-KIMTool-Point von selbst
auseinander — die Kopie trägt die Marke, der Loader und die Fassung des Modells
nicht. Eine Namens-Suche hätte alle drei getroffen. **Der Automat wäre heute
nicht in die Falle gelaufen, in die ich fast gelaufen wäre.**

### ⚠ Der gefährlichste Fund kam beim Bauen

Die erste Fassung verteilte **`siegel-inhalt.js` mit** — und die trägt die
**komplette App-Identität**: `nodeName`, `domainDescription`, `domainKeywords`,
`stammCategories`, `backupPrefix`. Ein Überschreiben hätte **jeder App Sages
Namen und Sages Bedeutungs-Vektor gegeben** — der Schaden vom 2026-08-16 in
Alis Moderaum, nur zwanzigfach und ohne dass jemand hinsieht.

Gefunden hat es nicht das Nachdenken, sondern **ein Diff zweier Repos**, bevor
das Werkzeug zum ersten Mal schreiben durfte. Sie steht jetzt in `NIE_VERTEILEN`
und ist durch zwei Riegel gedeckt.

### Der Befund: 44 Dateien im Netz hängen zurück

| | |
|---|---|
| Repos mit Kanon-Dateien | **22** |
| Kopien schon gleich | **282** |
| **hängen zurück** | **44** |

Einzelne um über 300 Zeilen (`15_membran.js` in Tomys-Hub und Privat-Brain:
361 · `03_embedding.js` in SB-KIMTool-Point: 367). **Das hat vorher niemand
gesehen** — der Drift-Guard sagt „unverändert", nicht „aktuell".

⚠ Ein Generationen-Sprung wird deshalb **als solcher benannt** (ab 50 Zeilen).
Eine Meldung, die zwei und zweihundert Zeilen gleich schreibt, lädt dazu ein,
beides gleich zu behandeln — und ein Sprung braucht einen Probenlauf im
Ziel-Repo.

### ⚠ VIER VON FÜNF GEGENPROBE-FÄLLEN RUTSCHTEN BEIM ERSTEN LAUF DURCH

Und keiner davon war ein Fehler im Werkzeug — **alle vier waren Lücken im
Wegwerf-Netz der Probe**:

| Fall | warum er nichts maß |
|---|---|
| Sperrliste ausgebaut | die Identitäts-Datei lag außerhalb des Kanon-Pfades — der Riegel kam nie dran |
| zweiter Riegel ausgebaut | der erste deckte ihn |
| Doppelpunkt-Marke verengt | im Test-Netz gab es kein Modul mit `:` (Modul 20 hat eins) |
| Vorrat-Prüfung ausgebaut | es gab nur **einen** Worker, und die Datei stand drin |

Das Netz trägt jetzt ein Modul mit Doppelpunkt, eine Ziel-Datei **mit** Marke,
die Identitäts-Datei **im** Kanon-Pfad und einen zweiten Worker **ohne** die
Datei im Vorrat. Danach fangen alle.

⚠ **Und ein Fall ist ersatzlos entfallen, als benannte Grenze:** beide Riegel
lesen dieselbe Liste, der erste Fall nimmt sie weg und fängt damit beide. Ein
Fall nur für den zweiten blieb zu Recht grün — *er hätte bewiesen, was er nicht
misst.* Dieselbe Lehre wie bei `umask` + `chmod` im Schlüssel-Ablagefach.

⚠ **Ein gerades Anführungszeichen hat die Probe zerlegt** — dieselbe Falle wie
in `manual_check.html`, wo zwei Panels elf Tage lang tot dastanden.

**Gemessen:** `smoke_kanon_verteilen.mjs` **20 grün** (fährt das echte Werkzeug
an einem Wegwerf-Netz, liest es nicht) · `gegenprobe_kanon_verteilen.sh`
**4 gefangen, 0 durchgerutscht, 0 tote Anker** · voller Lauf **104 Proben grün,
0 rot, 0 nicht lauffähig**.

### Was offen bleibt

- **Die 44 Rückstände sind nicht nachgezogen.** Das Werkzeug meldet sie; das
  Nachziehen ist eine bewusste Entscheidung mit Probenlauf je Repo — besonders
  bei den Generationen-Sprüngen.
- **Der Automat öffnet keine PRs.** Er tut die Datei-Arbeit; Branch, Commit und
  PR bleiben ein eigener Schritt. Eine GitHub Action, die ihn zeitgesteuert
  ruft, bräuchte ein Token mit Schreibrecht auf alle Repos — **Klaus'
  Entscheidung, nicht meine.**
- **A18** (Wizard zusammenführen, dann übersetzen) unberührt.

---
