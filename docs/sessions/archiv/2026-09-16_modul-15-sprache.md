# Übergabeprotokoll · 2026-09-16 · Das Fenster hinter der englischen Lampe war deutsch

**Rolle:** Hauptsitzung · **Zweig:** `claude/sage-protokol-session-vcrt0p`
**Auftrag (Klaus):** *„verliere das Ziel Übersetzung in Mycel / Mit dem
Knotennetz verbinden und Siegel nicht aus dem Auge. Es wurde in der
Vorgängersitzung entwickelt."*

---

## Was getan wurde

### Kanon · `src/modules/15_membran.js`

Sprach-Haken nach dem Verfahren von 16, 17 und 23 UI: schlüssellos, `TEXTE.en`,
`T()`/`Tf()`, `sprache()`, Rangfolge `init({lang})` → `<html lang>` → `de`.
**31 Einträge.** `_meta.lang` und `_meta.langKeys` als Lese-Fläche, damit die
Proben messen können statt zu lesen.

Umgestellt: Fenstertitel, Schließen-Etikett, Zähl-Zeile, „Aufräumen", der
Sichttest-Knopf samt Tooltip, der Spaltenkopf „Zeit", der Tipp, `(lokal)`,
`GRUND_TEXT` (5), `ABSENDER_TEXT` (5) und die zusammengesetzte Klartext-Zeile.

Drei Stellen, die kein Übersetzungs-Auftrag waren und trotzdem dazugehörten:

- **`zaehlText()`** — die Zähl-Zeile stand dreimal als eigener Zusammenbau.
- **Ganze Sätze statt Fragmente** in `entryErklaerung()`.
- **Der Spaltenkopf geht über `textContent`** statt im Markup zu stehen — wie
  jede andere Zelle in diesem Modul.

`sbkim-bundle-voll/modules/15_membran.js` nachgezogen.
Neue Kanon-sha: **`829a5bc01976`** (vorher `f88b5d04bc08`).

### Tafel · `docs/INTERFACES.md`

§ **Modul 15 SPRACHE** neu. `lang` in der `init`-options-Form. Und die
Zusicherung *„Ein Voll-Knoten ist damit durchgehend zweisprachig"* (2026-09-14)
**ersetzt, nicht stillschweigend getauscht** — samt dem Zusatz, dass app-eigene
Lampen und Verbinden-Fenster vom Kanon gar nicht erreicht werden.

### Werkzeug · `tools/kanon-verteilen.mjs`

Zwei Zusätze, beide an einem Schaden dieses Laufs gemessen: die **Übersicht der
Fassungen im Netz** (gruppiert nach dem sha des Trägers) und die Meldung
**„Arbeitsbaum älter als das Depot"**.

### Proben und Gegenproben

| Datei | was dazukam |
|---|---|
| `tests/smoke_bau1617_sprache.mjs` | Modul 15 in die `MODULE`-Liste (dieselben zwei generischen Wächter) · `GRUND_TEXT`/`ABSENDER_TEXT` als Daten-Tafeln · Markup-Filter · `innerHTML`-Leser im Stub · **Abschnitt 5**, der das Fenster rendert |
| `tests/gegenprobe_bau1617_sprache.sh` | Modul 15 in die Positivliste · **Abschnitt F**, 11 Fälle |
| `tests/smoke_kanon_verteilen.mjs` | App-Vier (zweite alte Fassung) · 5 Wächter zu den Fassungen · 5 zum veralteten Arbeitsbaum, mit **echten** Depots |
| `tests/gegenprobe_kanon_verteilen.sh` | 4 Fälle, je Zusatz einer je Richtung |

---

## Was gemessen wurde

| | |
|---|---|
| `node tests/run_alle.mjs` | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |
| `smoke_bau1617_sprache.mjs` | **141 grün** (vorher 83) |
| `smoke_kanon_verteilen.mjs` | **35 grün** (vorher 25) |
| `gegenprobe_bau1617_sprache.sh` | **41 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `gegenprobe_kanon_verteilen.sh` | **13 gefangen · 0 durchgerutscht · 0 tote Anker** |

Beide Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. Vor jedem
Commit die **Dateiliste** angesehen, nicht nur der Diff.

### Die Zahlen davor, weil sie die Funde gemacht haben

- Sprach-Gegenprobe zuerst **40 gefangen · 1 toter Anker**; zwei Fälle fielen am
  **Nachbar**-Wächter statt an ihrem eigenen.
- Verteiler-Gegenprobe: zwei Sabotagen ließen das Werkzeug **abstürzen**, und
  dann meldete die erste Zusicherung des Laufs. `gkey` heißt seitdem so, damit
  der Eingriff eine Zeile ist.

---

## Die drei eigenen Fehler

| Was | Wie es sich zeigte |
|---|---|
| **`escapeHtmlText()` gibt es in Modul 15 nicht** | wäre beim ersten Öffnen abgestürzt. `node --check` prüft Syntax, nicht ob ein Name existiert |
| **Der Abschnitt maß beim ersten Lauf nichts** | ohne `#lamp-fremd` blieb das Fenster zu; zehn „auf Englisch nicht mehr da"-Zeilen waren **trivial grün**. Der Vorbedingungs-Wächter hat es gefangen |
| **`innerHTML` war im Stub eine Zeichenkette** | kein `<tbody>` zum Befüllen. Der Stub liest jetzt Markup; 16 und 17 blieben **gemessen** bei 99 grün |

Und ein vierter, vor allem anderen: **mein erstes Messwerkzeug hielt 39 Einträge
in Modul 16 für tot**, weil es nur `T("…")` als Literal suchte. Modul 16
übersetzt Daten an der Anzeige-Stelle. Der vorhandene Wächter deckt das ab.

---

## Der größere Fund: Modul 15 liegt netzweit in FÜNF Fassungen

Gemessen auf `origin/main`, nicht auf Arbeitsbäumen:

| sha | Zeilen | Träger |
|---|---|---|
| `f88b5d04bc08` (aktuell) | 1662 | 8 |
| `fbf9f42d8a27` | 1317 | 8 |
| `0f8a3f69de61` | 1314 | 2 |
| `33d6fe0c5057` | 1313 | 1 |
| `8a07567f98ce` | 1558 | 1 (family-project) |

**Zwölf Träger auf einer älteren Generation, bis zu 349 Zeilen zurück, in einem
Schutz-Modul.** Der Brief nannte family-project als „eine Generation zurück";
es sind zwölf, und family-project ist nicht das entfernteste.

⚠ **Und mein erster Vergleich war selbst falsch** — verschachtelte
Anführungszeichen in einer Subshell wanderten in den Vergleich, und jedes Repo
sah nach „alter Generation" aus. Aufgefallen an `'Alis-Moderaum'` **mit
Anführungszeichen** in der eigenen Ausgabe; nachgeprüft mit einem `diff`, der
byte-Gleichheit zeigte.

---

## Das stille Überspringen, mit gemessener Ursache

**BookLedgerPros Klon steht 302 Commits / drei Monate zurück** — als einziges
der 33 Repos. Sein Sitzungs-Zweig wurde aus dem alten Klon abgezweigt, der
Sitzungsstart-Hook fasst einen Nicht-Standard-Zweig zu Recht nicht an, und der
Verteiler liest den **Arbeitsbaum**.

Folge: „19 Repos tragen Kanon-Dateien", während auf `origin/main` **zwanzig**
eine Kopie tragen — **ohne dass eine Zeile darüber stand.**

⚠ Der Befund der Vorgängersitzung hält trotzdem, unabhängig nachgeprüft: kein
`sbkim-andock-wizard.js` auf `origin/main`, `siegel-inhalt.js` 479 Zeilen.

---

## Was NICHT getan wurde, und warum

**Der Rollout von Modul 15 ist nicht gefahren.** Acht Träger bekämen einen
reinen Nachtrag, **zwölf einen Generationen-Sprung in einem Schutz-Modul** —
und der braucht laut Verfassung einen Probenlauf im Ziel-Repo. Beides in einer
Bewegung wäre das Vermischen, vor dem die Tafel warnt. `--schreiben` kennt
keinen Repo-Filter, also ginge es nur ganz oder gar nicht. **Klaus entscheidet.**

**BookLedgerPros Klon wurde nicht aufgefrischt.** Ein Automat, der fremde
Arbeitsbäume bewegt, könnte ungepushte Arbeit überfahren.

---

## Benannte Grenzen

- **Klaus' Browser-Sichttest** — ob das Fenster auf einer englischen Seite
  wirklich englisch dasteht, sieht nur er. Headless ist die Logik belegt.
- Der T()-Deckungs-Wächter misst **zeilenweise**; eine Zuweisung, deren
  Zeichenketten erst auf den Folgezeilen stehen, sieht er nicht. Das ist eine
  alte benannte Grenze und gilt für Modul 15 genauso — der Tabellenkopf wird
  deshalb in **Abschnitt 5** am gerenderten Fenster gemessen, nicht hier.
- Der Veraltet-Wächter braucht **echte** Depots; im Wegwerf-Netz mit
  `.git`-Verzeichnis fällt er fail-soft durch.
