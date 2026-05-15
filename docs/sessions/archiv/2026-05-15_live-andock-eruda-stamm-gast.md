# Übergabeprotokoll · 2026-05-15 · Live Andock Iteration 2 — Eruda + Stamm/Gast

**Sitzungs-Rolle:** Bau-Sitzung Modul 09 (Live-Andock-Versuch,
zweite Iteration), mit Klaus am Tablet, **nicht headless**. Die
geplante reine Bau-Sitzung (Schritte 1–9 aus Karte 09 in beiden
Endknoten ausführen) hat sich beim ersten Schritt auf zwei Stränge
aufgeteilt: (a) Eruda-Vorbereitung über Termux (statt github.dev,
das auf DeX-Tablet beim Speichern hängenblieb) und (b) eine
Architektur-Erkenntnis aus der ersten Eruda-Sichtkontrolle in
Mixarium, die zum Konzept **Stamm- und Gast-Kategorien** geführt
hat. Schritte 1–9 wurden absichtlich **nicht** ausgeführt — sie
gehören jetzt in Iteration 3, nachdem die Spec-Sitzung „Stamm/Gast-
Felder in Spore-JSON" die Spore-Erweiterung festgelegt hat.

**Branch:** `claude/bau-09-live-andock-iteration-2-31ml4`

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C
(Bau-Sitzung) — mit der Abweichung, dass diese Sitzung keinen
JS-Modul-Code geschrieben hat (Live-Andock-Pfad in fremden Repos
plus Konzept-Anlage in den heiligen Tafeln).

**Modul:** 09 (Live-Andock), plus ARCHITEKTUR.md § 8 (Konzept-
Anlage Stamm/Gast).

---

## Auftrag

Eine Sitzung, zwei Stränge:

1. **Eruda als Tablet-Sichtkontrolle live in beide Endknoten
   einbauen** — als Vorbereitung für die eigentliche Bau-Sitzung
   Modul 09 (Schritte 1–9 aus Karte 09). Klaus' Setup: Galaxy
   Tab S6 + DeX, Android-Chrome. Ohne Desktop-DevTools muss
   Eruda als in-Page-Polyfill rein.
2. **Beim ersten Sicht-Lauf identifizierte Datenhygiene-Erkenntnis
   sauber dokumentieren** — wenn die Sichtkontrolle echte
   Datenbefunde liefert, gehören sie in PULS und (falls
   konzeptionell) ins Sage-Protokol-Modell.

Der zweite Strang ist innerhalb der Sitzung gewachsen — er stand
nicht im ursprünglichen Brief.

---

## Was getan wurde

### 1. Eruda-Einbau in beiden Endknoten

**Mein-Mixarium (`main`-Branch):**

- Versuch über github.dev: Speichern hängte mehrere Minuten ohne
  Rückmeldung. Wahrscheinlich Auth- oder Netzwerk-Aussetzer auf
  DeX. Wechsel zu Termux war stabiler.
- Termux-Pfad: `gh auth status` zeigte bereits Login als
  `lausiklauskn-png` mit `repo` und `workflow` scopes. Repo lag
  schon lokal aus früherer Sitzung. `git status` sauber, `main`
  synchron mit Remote.
- Einbau per `sed`:
  ```bash
  sed -i '0,/<head>/s#<head>#<head>\n  <script src="https://cdn.jsdelivr.net/npm/eruda@3"></script>\n  <script>eruda.init();</script>#' index.html
  ```
  Zwei Zeilen direkt nach `<head>`, jsdelivr-CDN, Major-Version
  `eruda@3` gepinnt — exakt das Snippet aus Karte 09 § Tablet-
  Sichtkontrolle.
- Commit `60b04a4` „Eruda temporär für SBKIM-Andock-Sichtkontrolle".
- Push wurde im ersten Versuch mit `[rejected] main -> main (fetch
  first)` abgewiesen — Remote hatte Commits aus paralleler Claude-
  Sitzungs-Aktivität. `git pull --rebase && git push` löste das
  sauber: `1a7fdaf..b792576  main -> main`.

**Mein-Rezeptbuch (`main`-Branch):**

- Repo war noch nicht lokal in Termux. Frisch geklont mit
  `gh repo clone lausiklauskn-png/Mein-Rezeptbuch`.
- Erster Commit-Versuch scheiterte an `fatal: unable to auto-detect
  email address (got 'u0_a936@localhost.(none)')` — Git-Identität
  war global nicht gesetzt (in Mixarium-Repo war sie aus früherer
  Sitzung vorhanden, im frisch geklonten Rezeptbuch nicht).
- Identität global gesetzt:
  ```bash
  git config --global user.email "lausiklauskn-png@users.noreply.github.com"
  git config --global user.name  "lausiklauskn-png"
  ```
  GitHub-Noreply-Adresse statt echter Email — keine echte Adresse
  im öffentlichen Commit-Verlauf.
- Eruda-Einbau analog zu Mixarium. Commit `d92929ec`, Push
  `7396026..d9292ec  main -> main`, beim ersten Versuch sofort
  sauber durch.

**Sichtprüfung nach Pages-Build (1–2 Min):**

- Beide PWAs (`https://lausiklauskn-png.github.io/Mein-Mixarium/`
  und `…/Mein-Rezeptbuch/`) zeigen den schwebenden Eruda-Button.
- Mixarium-Console gab beim Reload eine echte App-Warnung aus
  (siehe nächster Abschnitt).
- Rezeptbuch-Console blieb leer — keine Warnungen im Eigen-Code
  der App, Eruda läuft aber.

### 2. Datenbefund Mixarium → Konzept Stamm/Gast

**Befund Eruda-Console Mixarium:**

```
[Mixarium] 6 Orphan-Drink(s) — haben Namen aber keine bekannte Kategorie:
  (6) [{...}, {...}, {...}, {...}, {...}, {...}]
```

Aufklappen der sechs Objekte zeigte identische `cat`-ID
`fid_17763323516422` für alle, mit Namen:

```
0  Salmon Sushi Roll mit Avocado
1  Crispy Sushi Roll mit Lachs und Avocado
2  Sushi Roll mit Tempura
3  Ebi Tempura
4  Sushi Platte
5  Sushi Tempura
```

Klaus' Hintergrund: diese Items waren ehemals einer Mixarium-
Kategorie „Sushi" / „Fingerfood" zugeordnet, die er irgendwann
gelöscht hat. Die Items blieben in der Datenbank, ihre `cat`-ID
zeigt auf eine Kategorie, die im Code nicht mehr existiert. Im
Rezeptbuch sind dieselben Sushi-Items parallel vorhanden — sie
sind also nicht verloren, nur im falschen Knoten falsch
kategorisiert.

**Klaus' Eigen-Vorschlag** (zentral für das, was als nächstes
passiert ist): „Essen im Rezeptbuch favorisieren, Getränke im
Mixarium favorisieren, der Rest ist Überraschungs-Plus. Es gibt
zum Beispiel auch Anbieter von Schrauben, die auch Werkzeug
verkaufen, siehe Würth."

Diskussion mit ihm:

- Erste Antwort meinerseits („scharfe Trennung halten, Sushi
  raus aus Mixarium, denn Sage-Protokol-Knoten brauchen klar
  umrissene Domänen") war konzeptionell sauber, aber **nicht**
  praxisgerecht. Klaus' Würth-Analogie zeigt: in der realen Welt
  haben Anbieter Kerngebiete plus thematisch verbundene
  Nebenpfade. Die Schärfe muss nicht auf der Daten-Ebene
  liegen, sie kann auf der **Gewichts**-Ebene liegen.
- Begriffswahl: erste Variante „Wirt" / „Gast" (gastronomisch,
  klassisches Gegensatzpaar) → Klaus' berechtigter Einwand:
  „Wirt" trägt im SBKIM-Mycel-Kontext die Biologie-Konnotation
  „Wirtsorganismus, in dem ein Parasit lebt". Iteration über
  Alternativen (Kern / Haus / Stamm) — Entscheidung
  **„Stamm"**: Stammkunde, Stammgeschäft, plus die Pilzstamm-
  Resonanz im Mycel-Bild. Klaus' UI-Begriff
  **„Überraschungs-Plus"** bleibt für die App-UI verbindlich;
  technisch im Sage-Protokol heißt es `gast`.

### 3. Doku-Eingriffe in den heiligen Tafeln

**`docs/ARCHITEKTUR.md`:**

- Neuer **§ 8 „Stamm- und Gast-Kategorien (Domänen-Schichtung)"**
  am Ende der Datei mit:
  - Status-Block (Konzept festgelegt, Spec-Sitzung steht aus).
  - „Worum es geht" — Begründung mit den 6 Sushi-Items als
    konkretem Anlass, Beispielen für Stamm- und Gast-Kategorien
    in beiden Endknoten, Würth-Analogie als Praxis-Erdung.
  - Konsequenzen-Tabelle für sechs Module: 02 Spore (zwei
    optionale Felder, signaturpflichtig), 03 Embedding (Stamm
    /Gast getrennt vektorisiert), 04 Match (Stamm↔Stamm voller
    Score, Stamm↔Gast mit Dämpfungsfaktor, Default-Vorschlag
    `0.5`), 05 Anastomose (Handshake unverändert, Klassifikation
    in 04), 00/08/09 (UI mit Stamm prominent / Gast als
    sekundärer Tab „+ überraschend dazu").
  - Sekundäre Konsequenzen für 06 Heterokaryose, 07 Apoptose,
    14 Diffusion.
  - Vier offene Fragen für die Folge-Spec-Sitzung:
    1. Feld-Benennung deutsch (`stammCategories` /
       `guestCategories`) vs. englischer Stil.
    2. Match-Dämpfungsfaktor verbindlich (Default-Vorschlag
       `0.5`).
    3. Einzelner `domainVector` (Gesamt) vs. separate
       `stammVector` / `guestVector`.
    4. UI-Label-Verbindlichkeit „Überraschungs-Plus" oder
       knapper.
  - Tabelle „technischer Begriff vs. UI-Begriff" (`gast` vs.
    „Überraschungs-Plus"; `stamm` vs. Stamm-Kategorie).
- **§ 1 Gesamtbild** bekommt einen Querverweis-Absatz: die
  Domänen-Beschriftung Rezeptbuch/Mixarium ist jetzt
  Stamm-Kategorie, Knoten dürfen zusätzliche Gast-Kategorien
  führen, Verweis auf § 8.

**`docs/INTERFACES.md`:**

- **§ 6 Änderungsprotokoll** Zeile am Ende (Konvention neueste
  unten): „2026-05-15 | Live Andock Iteration 2 — Eruda + Stamm/
  Gast | Konzept-Eintrag, keine §1/§2-Vertragsänderung. …
  `docs/ARCHITEKTUR.md` § 8 angelegt …"
- **§ 1 Verträge pro Modul** **unverändert** — die optionalen
  Spore-Felder kommen in der Folge-Spec-Sitzung additiv.
- **§ 2 Datenformate (Spore-JSON, Handshake, Legacy,
  Heterokaryose)** **unverändert** — `stammCategories` /
  `guestCategories` sind nur als Vorschlag im ARCHITEKTUR-§8
  formuliert, nicht im verbindlichen Schema.
- **§ 3 Endpunkt-Pfade, § 4 Versionierungs-Regeln, § 5 Status-
  Farb-Mapping** **unverändert**.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.

**`docs/PULS.md`:**

- **§ Empfehlung Hauptsitzung** komplett umformuliert: neuer Top-
  Schritt ist die Spec-Sitzung Stamm/Gast, gefolgt von Bau-09
  Iteration 3.
- **§ Endknoten-Tabelle**: Domänen-Spalte jetzt mit
  Stamm/Gast-Aufteilung; SBKIM-Stand-Spalte vermerkt Eruda-Einbau
  mit Datum (2026-05-15) und konkretem Pfad
  (zwei Zeilen nach `<head>`, jsdelivr `eruda@3`), plus für
  Mixarium die Notiz zu den 6 Sushi-Einträgen.
- **§ Sitzungs-Einträge** rotiert: bisheriger oberster Eintrag
  „Pflege Karte 09 App-SW-Koexistenz + Tablet-Sichtkontrolle" als
  Index-Zeile im Archiv-Index, dieser neue Eintrag oben
  ausführlich.

---

## Was bewusst nicht geändert wurde

- **Karte 09 (`docs/components/09_einbau_pwa.md`)** unverändert
  — die Sitzung hat die Karte nicht bearbeitet, sondern angewendet.
  Die Eruda-Variante aus § Tablet-Sichtkontrolle ist jetzt live
  durchgezogen worden, was die vorherige Pflege-Sitzung Karte 09
  praktisch nachträglich abschließt. Wenn die Bau-Sitzung 09
  Iteration 3 weitere Karten-Lücken aufdeckt, kommen die in eine
  eigene Pflege-Sitzung.
- **Modul-Karten 02 / 03 / 04** unverändert — die kommen in der
  Folge-Spec-Sitzung dran.
- **`src/modules/*`** unverändert. **`tests/manual_check.html`**
  unverändert. **`index.html`** (Sage-Page) unverändert.
- **`status.json`** unverändert — kein Modul-Score-Wechsel, keine
  Modul-Anlage. **`update_puls_pie.py` nicht aufgerufen** (keine
  Daten-Änderung im Pie-Bereich).
- **`docs/GLOSSAR.md`** unverändert. Falls in der Folge-Spec-
  Sitzung die finalen Feldnamen `stammCategories` /
  `guestCategories` (oder Alternativen) verbindlich werden,
  gehören sie ins Glossar — diese Sitzung hält noch Stand.
- **Keine Datei in den Endknoten-Repos** außerhalb der zwei
  Eruda-Zeilen in `index.html` (Mein-Mixarium + Mein-Rezeptbuch).
  Insbesondere **kein** SBKIM-Modul-Einbau (kein
  `sbkim-sw.js`-Register, kein `spore.json`-Anlegen, kein
  Schritte 1–9 aus Karte 09).

---

## Validierung

- **Eruda live in beiden PWAs** verifiziert: schwebender Button
  in beiden, Tab-Wechsel (Console / Elements / Resources / etc.)
  funktioniert. Mixarium-Console lieferte die Orphan-Drink-Warnung
  als Beleg, dass Application-Code-Logs durchkommen.
- **Push-Pfad** in beiden Endknoten-Repos sauber: Mixarium nach
  `pull --rebase` konflikt-frei, Rezeptbuch erstmalig direkt
  durch. Beide `main -> main` ohne Fast-Forward-Bruch.
- **Doku-Querverweise sichtgeprüft**: ARCHITEKTUR.md § 8 verweist
  korrekt auf INTERFACES.md § 2 (Pfad relativ), § 1 Gesamtbild
  hat den Anker-Link `#8-stamm--und-gast-kategorien-domänen-
  schichtung` (Markdown-Default-Anker-Konvention; falls Renderer
  den Anker anders erzeugt, sind die Verweise als Text immer noch
  klar).
- **`git status` im Sage-Protokol-Repo** vor Commit sauber, alle
  Änderungen gezielt (drei Dateien angefasst plus eine neu
  angelegt).

---

## Was offen blieb

### Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON"

Eingaben:

- `docs/ARCHITEKTUR.md` § 8 (vier offene Fragen explizit
  formuliert).
- `docs/components/02_spore.md` und `docs/INTERFACES.md` § 2
  Spore-JSON (Schema, dem die Felder additiv hinzugefügt
  werden müssen).
- `docs/components/04_match.md` (Match-Dämpfungsfaktor und
  Schwellwert-Logik).

Ergebnis-Erwartung:

- INTERFACES.md § 2 Spore-JSON um zwei optionale Felder
  erweitert: `stammCategories: string[]` (oder englischer
  Variante) und `guestCategories: string[]`. Signaturpflichtig
  wenn vorhanden, wie die übrigen Optionalen.
- Karte 02 Spore um den Hinweis erweitert (Sign-Pfad bleibt
  identisch — kanonisches JSON deckt die Felder ohne
  Sonderbehandlung).
- Karte 04 Match um den Stamm↔Gast-Dämpfungs-Pfad: Match-
  Funktion bekommt einen optionalen `relation`-Parameter
  (`stamm-stamm` | `stamm-gast` | `gast-gast`), Default
  `stamm-stamm`. Bei `stamm-gast`: Score × `0.5` (oder
  Spec-finaler Wert) vor Vergleich gegen `PROVIDER_MIN_MATCH`.
- `PROTOCOL_VERSION` bleibt `"0.1"` — additive Änderung.

### Bau-Sitzung 09 Iteration 3

Nach der Spec-Sitzung. Trägt Stamm- (und optional Gast-)
Kategorien in die ersten realen `/sbkim/spore.json` der
Endknoten ein.

Pfad: Variante 3b aus Karte 09 (`importScripts('./sbkim-sw.js')`
im bestehenden App-SW), weil beide Endknoten einen App-SW
führen.

### Endknoten-Mini-Pflege „Sushi-Kategorie sichtbar machen"

Entkoppelt. Klaus entscheidet selbst, ob:

- Die ehemals existierende „Sushi"-/„Fingerfood"-Kategorie in
  Mixarium reaktiviert wird (dann werden die 6 Items in der App
  wieder sichtbar als Gast-Kategorie nach dem neuen Konzept) —
  technisch ein Eintrag in der Mixarium-Kategorienliste in
  `index.html` mit der ID `fid_17763323516422`.
- Oder die 6 Items in der Mixarium-Datenbank gelöscht werden,
  weil sie im Rezeptbuch parallel existieren — dann sind sie
  „nur" Stamm-Items des Rezeptbuchs.

Beide Wege sind kein Sage-Protokol-Eingriff; sie passieren in
den Endknoten-Repos.

### Eruda-Rückbau

Sobald die Sicht-Phase rum ist, die zwei Eruda-Zeilen aus
beiden `index.html` wieder entfernen. Ein `sed`-Befehl pro
Repo:

```bash
sed -i '/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/eruda@3"><\/script>/d; /<script>eruda\.init();<\/script>/d' index.html
```

Plus Commit und Push.

---

## Nächster sinnvoller Schritt

1. **Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON"** —
   *headless möglich*. Klärt die vier offenen Fragen aus
   ARCHITEKTUR.md § 8 und erweitert INTERFACES.md § 2 + Karten
   02 / 04 additiv.
2. **Bau-Sitzung 09 Iteration 3** mit Klaus am Live-Andock-
   Versuch, nach Schritt 1.
3. **Endknoten-Mini-Pflege „Sushi-Kategorie sichtbar machen"**
   in Mein-Mixarium — parallel zu Schritt 1 möglich.
4. **Klaus' Sichttest Panel 06** (Heterokaryose, 14 Knöpfe),
   weiterhin offen aus früheren Sitzungen.

---

## Material aus der Sitzung (zur Nachvollziehbarkeit)

**Klaus' Hardware-Setup:** Samsung Galaxy Tab S6 mit DeX
(Multi-Window-Modus), Android-Chrome, physische Tastatur via
DeX, Termux als Linux-Schicht. Status-Leiste in github.dev nicht
durchgehend sichtbar (DeX-Layout schneidet teilweise ab),
deshalb der Wechsel zum direkten URL-Pfad
`https://github.dev/<owner>/<repo>/blob/main/index.html` und
später zu Termux.

**Termux-Pakete am Ende der Sitzung:** `gh`, `git`, Standard-
Termux-Pakete. `gh auth status` bestätigte Login als
`lausiklauskn-png` mit `repo`, `workflow`, `gist`, `read:org`
scopes.

**Eruda-Snippet (exakt eingesetzt):**

```html
  <script src="https://cdn.jsdelivr.net/npm/eruda@3"></script>
  <script>eruda.init();</script>
```

Direkt nach `<head>` (zweite und dritte Zeile innerhalb des
Head-Blocks). Major-Version `eruda@3` ist Karte-09-Standard.

**Würth-Analogie (Klaus' Eigenargument für Stamm/Gast):**

> „Es gibt zum Beispiel auch Anbieter von Schrauben, die auch
> Werkzeug verkaufen, siehe Würth."

Übertragen: Würth = Stamm „Befestigungstechnik", Gast
„Werkzeug / Arbeitsschutz / Chemie" — thematisch verbunden
zur Stamm-Domäne, aber keine Lebensmittel oder
Kinderspielzeug. Mixarium analog: Stamm „Drinks", Gast
„Knabbereien / Fingerfood / Sushi", aber kein Stamm-Sortiment
Hauptgerichte.

**Begriffsentscheidung Wort für „Wirt":**

| Vorschlag | Resonanz | Schwäche |
|---|---|---|
| Wirt | Restaurant-Gastronomie | Biologie: Wirtsorganismus, Parasit (im SBKIM-Mycel-Kontext irritierend) |
| Kern | Kerngeschäft, Kernkompetenz | klingt technisch |
| Haus | Hauskategorie, Hausmarke | Restaurant-eng |
| **Stamm** | **Stammkunde + Pilzstamm** | leichte „uralt"-Assoziation |

Entschieden: **Stamm**.
