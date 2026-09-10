# PULS-Einträge vom 2026-09-08 — ausgelagert aus `docs/PULS.md`

> **Wortlaut, unverändert.** Diese drei Einträge standen bis zum 2026-09-10 in
> `docs/PULS.md`. Die Datei stand bei 2.991 von 3.000 Zeilen; **ausgelagert, nicht
> gekürzt** — die Grenze wird nach der Verfassung nicht herabgesetzt, sondern es
> wird ausgelagert. Nichts ist verloren: der Wortlaut steht hier, die Git-Historie
> hat ihn ohnehin.

---

## Stand 2026-09-08 (Haupt-Sitzung, spät) · ✅ DER GETEILTE VORRAT IST BEI NULL — die letzte Stelle ist zu

**Anschluss an die Bau-Sitzung vom Abend (Eintrag darunter).** Deren einzige
bewusst offene Stelle war `ansicht.js` in **Kimhub und kim-hub-company** — ein ⟳
ohne Filter, byte-gepinnt in beiden Depots, zurückgestellt wegen einer
Parallel-Sitzung. Die ist gemergt (Kimhub #159–#164), die Stelle ist repariert.

### Der Abschluss-Scan

| | |
|---|---|
| `node tools/vorrat-scan.mjs`, geteilter Ursprung | **0 von 30 Depots** |
| eigene CNAME (PWA-Toolpoint ×2, Perfect-Skin-Beauty ×1) | 3 Stellen, **nicht angefasst** |

Bericht: `docs/BEFUND_geteilter-vorrat_nachher.md`. Die Zahlen der beiden
früheren Läufe stehen dort daneben, nicht ersetzt — eine Reparatur ersetzt
ihren Befund nicht.

### Der Präfix kommt vom Wirt, nicht aus der Datei

`ansicht.js` ist in beiden Depots byte-1:1 dieselbe Datei und **kann** den
eigenen Präfix nicht kennen. Ein dort eingetragener Name wäre für eine der
beiden Apps falsch — still, denn gelöscht würde trotzdem. Der Wirt setzt ihn
im `<head>`, wie Modul 22 und wie `__WERKSTATT_DB` daneben:

- Kimhub `index.html` → `window.SBKIM_VORRAT_PRAEFIX = "kimhub-werkstatt-"`
- `tools/company-schale-bauen.mjs` tauscht ihn beim Ableiten auf `"kim-hub-company-"`
- ohne Marke wird **nichts** gelöscht (fail-soft); der ⟳ wirkt über die
  geänderte Adresse trotzdem

**Der Name ist die netzweite Marke, nicht Kimhubs eigene.** Kimhub trägt kein
SBKIM-Modul; ein zweiter Name für dieselbe Sache liefe auseinander, und
`tools/vorrat-scan.mjs` stufte die Stelle als „unklar" ein — was nach der
eigenen Regel dieses Netzes nicht „ok" heisst.

### Was der Auftrag nannte und die Messung nicht hergab

Der Brief nannte `getRegistration()` statt `getRegistrations()`. Gemessen:
die Stelle meldet **gar keinen** Worker ab — `unregister` kommt in `ansicht.js`
nicht vor. Es gab dort nichts zu ersetzen; einen Abmelde-Pfad zu ergänzen wäre
neues Verhalten ohne Auftrag gewesen.

### Klaus' Sichttest ist gelaufen

Auf die Frage vom Abend: **beide Rezeptbücher einmal online geöffnet, danach
offline gegengeprüft, alles startet normal.** Damit ist die Reparatur der
Sorten A und B nicht mehr nur headless belegt. Der Sichttest der heutigen
Änderung (Werkstatt, Company, Muster-Seite) steht aus.

### Mein-Workfloh-Page — Klaus hat entschieden

Gefragt: echte Betreiber-Angaben oder benannte Ausnahme? **Antwort: benannter
Hinweis auf der Seite**, die Vorlage bleibt firmenneutral. Ein Band im Kopf
sagt jetzt, dass Name, Anschrift, Telefon, Preise und Referenzen erfunden
sind. Es steht als echtes HTML im Dokument (ein nachgetragenes Band schöbe
die Seite) und ist nicht wegklickbar.

**Und das Impressum sagte etwas Falsches:** die Angaben würden „vor
Veröffentlichung ergänzt". Der Satz war richtig, solange die Seite ein Entwurf
war — sie ist seit langem veröffentlicht und im Marktplatz gelistet. Eine
Zusage auf einen Zeitpunkt, der vorbei ist, liest sich wie eine Auskunft.
Richtiggestellt in Impressum und Datenschutz.

### Zwei eigene blinde Wächter, beide beim Nachstellen gefunden

- **Der Betreiber-Daten-Wächter prüfte nur die erste Fundstelle.** Er fragte,
  ob der Name **vor** `<html>` steht, und wäre für jede weitere Stelle dahinter
  grün geblieben — auch für eine im Impressum, also genau dort, wo es zählt.
  Misst jetzt jede Stelle; erlaubt sind zwei (Kopf-Kommentar, `_CR`-Block).
- **Der Company-Wächter auf `version.json` hat mich erwischt**, und zwar zu
  Recht: Fingerabdrücke nachgezogen, Stand vergessen. Rot statt still falsch —
  genau der Fall, für den er am 2026-09-06 gebaut wurde.

### Proben (je Depot die eigene Suite, ein Depot ein PR)

| Depot | Probe | Ausgangslage | nachher |
|---|---|---|---|
| **Kimhub** (#165) | `node tests/alle.mjs` | 2071 grün · 0 rot | **2075 grün · 0 rot** |
| | 4 neue Gegenprobe-Fälle | — | **4 gefangen · 0 durch** |
| **kim-hub-company** (#44) | `npm test` | — | **23 grün · 0 rot** |
| **Mein-Workfloh-Page** (#19) | `npm test` | — | **82 grün · 0 rot** |
| | `muster_hinweis.gegenprobe.mjs` | — | **8 gefangen · 0 durch** |

Gemessen wird bei den Vorrats-Wächtern, **was nach dem Druck wirklich im
Vorrat liegt** — nicht, ob im Quelltext ein `startsWith` steht. Und in beide
Richtungen: „der fremde Vorrat bleibt" allein wäre auch dann grün, wenn der ⟳
gar nichts mehr löscht. Prüfsummen der sechs angefassten Kimhub-Dateien vor
und nach dem Gegenprobe-Lauf gleich (unberührter Baum).

Cache-Bumps mit Grund, jeder gegen `origin/main` geprüft: Kimhub v41→v42,
Company v43→v44, Workfloh-Page v9→v10. Alle drei geänderten Dateien liegen im
Offline-Vorrat; ohne Bump käme keine der Reparaturen an.

### ⚠ Bewusst offen

- **Klaus' Sichttest der heutigen Änderungen.** Werkstatt und Company nach dem
  ⟳, und wie das Muster-Band am Tablet aussieht — ein Band über der Kopfleiste
  ist die Sorte Änderung, die auf schmalem Schirm anders wirkt als gedacht.
- **Die drei Stellen auf eigener CNAME** (PWA-Toolpoint, Perfect-Skin-Beauty).
  Kein Befund, solange sie dort liegen; wer eines der Depots auf den geteilten
  Ursprung zieht, zieht die Stelle mit.
- Unverändert aus dem Eintrag darunter: **zwei offene Tabs** überschreiben
  einander die Stechuhr still · **Kimhubs eigenes Impressum** · der
  Toolpoint-Eigenschaften-Lauf kennt „Impressum erreichbar" nicht als Merkmal.

### Nachtrag am selben Abend · die offenen PRs durchgesehen

Klaus' Frage: welche der offenen PRs lassen sich mergen? **Keiner.** Und es waren
nicht die der Parallel-Sitzung — deren Arbeit ist vollständig gemergt (Kimhub
#159–#166). Offen standen fünf **Entwürfe** vom 5. Juni bis 27. Juli, alle
gemessen gegen den heutigen `main`, nicht nach PR-Text beurteilt.

| PR | Befund | erledigt |
|---|---|---|
| **SB-KIMTool-Point #84** | `main` steht auf `Stand: 2026-06-27`, der Zweig auf `2026-06-21` — ein Merge drehte die Doku **zurück** und fügte einen überholten Brief ein („der neueste Brief gilt") | geschlossen |
| **Jasons-Tresor #65** | das Tarnfach ist längst auf `main`, besser gebaut (`openVault` + `rec.decoy`, `test/decoy.test.js` 6 Fälle grün). Zweig: `openVault` **0×**, `main` 3× | geschlossen |
| **family-project #19** | Begründung entfallen — WorkFloh ist seit 2026-07-25 öffentlich gelistet (`listings.js`). Übrig bliebe ein **leerer Knopf ohne Namen** in jeder Fußzeile | geschlossen |
| **Alis-Moderaum #35** | GitHub-Zugang im **Klartext** in `localStorage['sbbild_gh_token']` — `localStorage` gehört dem Ursprung, dort liegen ~30 Apps. Schlüssel-Name obendrein aus einer fremden App | geschlossen |
| **ISD-Page-Entwurf #13** | echte Fremd-PII auf `main` (Namen mit Funktion, Anschrift, Instagram, Maps): 51× „ISD", 17× „Seevetal", 5× „Brunskamp" | **offen — Klaus lässt es vorerst** |

Jeder geschlossene PR trägt einen Kommentar mit dem Grund. **Die Zweige bleiben
stehen**, nichts ist verloren — geschlossen wurde, damit keine spätere Sitzung
einen alten Entwurf für unerledigte Arbeit hält und mergt.

**Zwei davon sind mehr als Aufräumen und stehen als Befund:**

- **Ein Geheimnis im Klartext auf geteilter Adresse.** Alis-Moderaum#35 hätte
  einen GitHub-Schlüssel **mit Schreibrecht** dorthin gelegt, wo jede der ~30
  Apps ihn lesen kann — unter einem Namen, der aus einer anderen App stammt.
  Derselbe Fehler wie ein übernommener DB-Suffix, eine Ebene höher. Der
  Abgleich selbst ist gut gebaut (`mergeState` rein und testbar, 22 Prüfungen);
  wer ihn neu aufsetzt, führt den Zugang über den Tresor (Skill
  `verschluesselter-schluessel-tresor`), nicht über `localStorage`.
- **Fremd-PII in ISD-Page-Entwurf.** Das Depot steht **privat** (gemessen: 404
  ohne Anmeldung), es liest also gerade niemand. Klaus lässt es vorerst so.
  ⚠ **Ein Merge von #13 würde die Daten NICHT aus der Historie nehmen** — er
  macht nur den aktuellen Stand neutral. Und die neutrale Vorlage gibt es schon:
  Mein-Workfloh-Page ist dieselbe „Muster Werbetechnik". Wer das wirklich
  auflösen will, löscht oder archiviert das Depot; das entscheidet Klaus.
  Erinnerung aus Kimhubs Verfassung: **privat stellen ist ein halber Schritt**,
  und die Historie behält alles, was je darin lag.

**Protokoll:** `docs/sessions/archiv/2026-09-08_vorrat-letzte-stelle.md`.

---

## Stand 2026-09-08 (Bau-Sitzung, abends) · 🧹 DER GETEILTE VORRAT IST REPARIERT — netzweit, Sorte A und B

**Anschluss an die Mess-Sitzung vom Vormittag (Eintrag darunter).** Klaus hat
den Plan freigegeben; Auflage unverändert: *„allerhöchste Vorsicht, keine App
darf gelöscht werden."* Es wurde nichts gelöscht, keine App entfernt, keine
Funktion weggenommen.

### Was repariert ist (alles gemergt, gegen `origin/main` gemessen)

| | vorher (Vormittag) | nachher (abends) |
|---|---|---|
| **Sorte A** — Service-Worker `activate` löscht fremde Vorräte | 23 Depots, 27 Stellen | **0** auf dem geteilten Ursprung |
| **Sorte B** — ⟳-Knopf meldet alle Worker ab und löscht alle Vorräte | 22 Depots, 36 Stellen | **2 Stellen**, bewusst offen (unten) |
| richtig gefiltert | 4 Depots, 8 Stellen | **63 Stellen** in 27 Depots |

Der Filter ist überall derselbe: `k.startsWith(VORRAT_PRAEFIX) && k !== CACHE`
(Präfix aus der Vorrats-Konstante **abgelesen**, nicht geraten) und für den
Worker `getRegistration()` (Einzahl — der eine, der DIESE Seite steuert) statt
`getRegistrations()`. Jede Stelle in beide Richtungen gemessen
(`tests/vorrat_wirkung.mjs`): fremder Vorrat bleibt · eigener alter geht ·
fremder Worker bleibt registriert.

**Kanon:** `src/modules/22_such_widget.js` (neue sha `052eb5f8…`) kennt jetzt
`window.SBKIM_VORRAT_PRAEFIX` (String oder Liste, vom Wirt im `<head>` gesetzt
wie `SBKIM_DB_SUFFIX`); ohne die Marke löscht der ⟳ des Widgets **nichts**
(fail-soft). Ausgerollt in alle sechs Kopien (Sage ×3, Kimseek, SB-KIMTool ×2),
Drift-Pins nachgezogen. Privat-Brains `pinnwand-widget.js` ist app-eigen und
direkt repariert.

**Die Rezeptbücher** (Klaus: *„sollen separat bleiben und sich nicht gegenseitig
aufräumen"*) tragen eigene Namen: `meinrezeptbuch-v63` und `muttisrezeptbuch-v14`
statt beide `mrz-`. Preis: je einmal die Schale online neu laden; Rezepte liegen
nicht im Vorrat (gemessen). Die alten `mrz-*` räumt niemand automatisch weg —
das träfe die Schwester; dafür gibt es `tools/speicher.html`.

**Modell-Ausputzer** (Kimboard, Pinnwand, Privat-Brain): `!k.startsWith(Schale)`
löschte alles *außer* der eigenen Schale — jetzt positiv `/webllm|mlc/i`.

**Drei Depots, die erst abends auffielen:** `Kimhub/company-sw.js` (Zwilling von
`kim-hub-company/sw.js`, in Kimhub von niemandem registriert — gemessen) ·
`Muttis-Rezeptbuch/sw.js` (`handbuch-v1`, ebenfalls unregistriert, aber
ausgeliefert) · **`New-Perfect-Skin-Beauty-`** liegt laut Pages-Beleg auf dem
geteilten Ursprung, hat **keinen** Service-Worker und löschte per ⟳
ausschließlich fremde Vorräte — jetzt löscht es keinen. Die Schwester
`Perfect-Skin-Beauty` trägt dieselbe Zeile auf eigener CNAME und bleibt.

### Pflichtangaben (Klaus: *„Copyright und Impressum nicht vergessen"*)

Alle 30 Toolpoint-Einträge plus ausgelieferte Unterseiten geprüft. Nachgezogen
nach dem Toolpoint-Muster (`impressum.html`, `datenschutz.html`, Fußzeilen-Link,
im Offline-Vorrat, Cache-Bump): **kim-hub-company** (beide Seiten, über
Kimhubs Ableiter `tools/company-schale-bauen.mjs`, Drift-Pin neu), **mycel-karte**,
**BookLedgerPro**, **Alis-Moderaum** `warehouse.html`, **Küchenzettel**
(Platzhalter ersetzt), Tomys `bookledger/`, Sages `mycel-karte/`-Kopie.

### Kimhub ⟷ kim-hub-company — Klaus' drei Fragen, gemessen

Stechuhr **ist geteilt** (gleicher `localStorage`-Schlüssel auf gleichem
Ursprung, nur in diesem Browser) · Buchhaltung/Belege getrennt (IndexedDB) ·
im Depot liegt nichts Privates (`.gitignore`, `git ls-tree`) · Copyright ja,
Impressum **fehlte** — nachgezogen (oben). ⚠ Ich hatte zuerst „getrennt"
geantwortet, weil ich nur `__WERKSTATT_DB` gemessen hatte; korrigiert.

### Der Scanner urteilte nach der Reparatur falsch — 44 Fehlurteile

`tools/vorrat-scan.mjs` kannte nur String-Literale. Nach der Reparatur meldete
er weiter **25 von 33** Depots als „löscht alles": Konstanten
(`startsWith(VORRAT_PRAEFIX)`), positives `includes`, gezielter Regex und die
Wirt-Marke von Modul 22 fielen alle auf das `!==` dahinter durch. **Eine zu hohe
Zahl ist derselbe Fehler wie eine zu niedrige.** Jetzt wird die Konstante in der
Datei nachgeschlagen; nicht auflösbar heißt **„unklar"**, nicht „ok"; Depots mit
eigener CNAME zählen nicht mehr in der Kopfzahl. Neue Probe
`tests/smoke_vorrat_scan.mjs` (23 Haken, beide Richtungen) — und der Schnipsel
darin war grün, während die **echte** Modul-22-Datei „unklar" blieb: die Marke
lag außerhalb des 400-Zeichen-Fensters. Die Probe misst jetzt die Datei.
Abschluss-Lauf: `docs/BEFUND_geteilter-vorrat_nachher.md`.

### ⚠ Bewusst offen

- **`ansicht.js:4232`** in Kimhub **und** kim-hub-company (byte-gepinnt, ein ⟳
  ohne Filter): eine Parallel-Sitzung baut dort gerade Tresor und Buchhaltung
  Karte 4 um (Klaus' Warnung). Zwei Stellen, ein Fix, nach deren Merge.
- **Zwei offene Tabs** (Kimhub + Company) überschreiben einander die Stechuhr
  still — `schreib("stechuhr")` ersetzt die ganze Liste. Nicht gebaut, benannt.
- **Kimhubs eigenes Impressum** (`index.html`, privat gestellt, Pages läuft) ·
  **Mein-Workfloh-Page** trägt Platzhalter mit Absicht, ist aber live gelistet —
  **Klaus entscheidet** · der Toolpoint-Eigenschaften-Lauf kennt „Impressum
  erreichbar" nicht als Merkmal (Wächter fehlt).
- **Klaus' Sichttest** — headless beweist, dass Vorräte bleiben; ob die Apps am
  Tablet normal starten und offline laufen, sieht nur er. Beide Rezeptbücher
  **einmal online öffnen**, danach offline gegenprüfen.

**Proben:** Sage `npm test` → **94 grün, 0 rot, 0 nicht lauffähig**; je Depot
die eigene Suite grün oder als vorbestehend rot belegt (Übergabeprotokoll).
**Protokoll:** `docs/sessions/archiv/2026-09-08_geteilter-vorrat-reparatur.md`.

---

## Stand 2026-09-08 (Mess-Sitzung) · 🧹 DER GETEILTE VORRAT — die Apps löschen einander die Offline-Vorräte

**Kein Code an einer App geändert.** Klaus' Entscheidung: erst messen, dann
entscheiden. Zwei neue Werkzeuge, ein Bericht.

**Anlass:** ein zehnter Befund am Bündel-Prüfer in `kim-hub-company` (2026-09-08)
— sein Service-Worker löscht in `activate` jeden Vorrat, der nicht seiner ist.
`caches` gehört dem **Ursprung**, nicht dem Pfad.

### Gemessen (Wirkung, echte Apps, headless)

| | |
|---|---|
| `Kuechenzettel` **nur öffnen** | Vorrat `mycel-karte-v17` **ist weg** |
| dasselbe mit Präfix-Filter (Gegenprobe) | Vorrat **bleibt** |
| ⟳ in `mycel-karte` klicken (Sorte A stillgelegt, Kontrolle grün) | `kuechenzettel-v1` **ist weg** |

### Gemessen (Verbreitung, gegen `origin/main`, 33 Depots)

**Sorte A** (Service-Worker, läuft von allein): **23 Depots, 27 Stellen.**
**Sorte B** (⟳-Knopf): **22 Depots, 36 Stellen.**
Richtig gefiltert: 4 Depots, 8 Stellen — `Tomys-Hub` macht es als einziges
durchgehend richtig (`startsWith` statt `!==`).

### ⚠ Was NICHT gemessen wurde

**Welche Apps wirklich denselben Ursprung teilen.** Der Egress-Proxy sperrt
`github.io`, die Pages-Einstellung ist von hier nicht lesbar. Belegt sind
**3 von 33** (CNAME); die übrigen **30 stehen als „ungeprüft"**, nicht als
„geteilt". Eine fehlende CNAME beweist nichts — `Company-Brain` und
`family-project` liefern über eigene Adressen aus und haben keine.

### Zwei Fehler im eigenen Messwerkzeug, beide behoben

Die erste Fassung **riet die Auslieferung aus Prosa** und lag in beide
Richtungen daneben: zu eng (`Company-Brain` galt als „geteilt", weil dort
„eigen**en** Adresse" steht und der Ausdruck „eigene Adresse" suchte) und zu
weit (`Kimhub`/`Sage` galten als „ungeprüft", weil ihre CLAUDE.md das Wort
*Hetzner* enthält). Seitdem wird **zitiert statt geschlossen**.

**Bericht:** `docs/BEFUND_geteilter-vorrat.md` + `…_tabelle.md`
**Werkzeuge:** `tools/vorrat-scan.mjs` · `tests/vorrat_wirkung.mjs`
**Proben:** `npm test` → 93 grün, 0 rot, 0 nicht lauffähig (Rückgabewert 0).

**Offen — für Klaus:** welche der 30 ungeprüften Apps liegen auf
`lausiklauskn-png.github.io`? **Offen — für eine Bau-Sitzung:** die Reparatur
(Präfix-Filter aus Tomys-Hub kopieren), je Repo ein PR mit Gegenprobe.

---
