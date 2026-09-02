# Übergabeprotokoll · 2026-08-23 · Forschungsförderung

**Rolle:** Recherche-Sitzung. Kein Modul-Code, keine Probe berührt.
**Zweig:** `claude/research-funding-next-steps-ib58w2` (frisch von `origin/main`, 4acaa1d).

> **Der Gegenstand dieser Sitzung ist Klaus' eigene Sache** und liegt nicht in
> diesem Depot. Was hier steht, ist das **Vorgehen**: wie recherchiert wurde, wo
> die Prüftiefe endet, welche Quellen gesperrt waren und was deshalb als
> Vermutung stehen bleibt. Einzelne Angaben sind darum neutral benannt.
>
> *Warum das Protokoll trotzdem hier liegt:* die Arbeitsweise ist der
> Untersuchungsgegenstand dieses Depots. Ein Protokoll herauszunehmen, weil sein
> Anlass privat war, nähme der Untersuchung ihre Daten. Die Regel steht in
> [`CLAUDE.md`](../../../CLAUDE.md) unter „Befund ins Dokument, Rat in den Chat".

## Auftrag

Gefragt war ein **abhakbarer Fahrplan**: Lassen sich für die Arbeit an diesem Netz
Forschungsgelder beantragen? Was sind die Voraussetzungen? Verein oder nicht? Wer
kann was tun?

Im Verlauf dazugekommen (jeweils eingearbeitet): Sachmittel und Personal · ein
**Institut für KI-Kompetenz im täglichen Gebrauch** · **Suchtpotenzial** ·
**psychische Wirkungen der KI-Nutzung** · Kooperationen mit Wissenschaftlern ·
die Frage zur Bezeichnung „Psychologe".

## Ergebnis

der Fahrplan (~900 Zeilen). Aufbau: kurze Antwort · Prüftiefe ·
was förderfähig ist (drei Forschungsstränge) · Rechtsform · das Institut ·
Lizenzlage · fünf Förderwege im Einzelnen · Hochschul- und Wissenschaftskontakte ·
Fahrplan in fünf Stufen · Aufgabenverteilung · offene Fragen · Adressen.

## Die zwei Funde, die nicht gesucht waren

**1 · Die Lizenzlage kann jeden Antrag kippen.** Über alle 33 Klone gemessen:
3 Repos mit MIT (`Sage-Protokol`, `SB-KIMTool-Point`, `mycel-karte`), 28 mit der
eigenen Nutzungslizenz samt Bezahl-Vorbehalt, 2 ohne jede Lizenz
(`BookLedgerPro`, `Meine-In-and-Out-Book`). Die geprüften Stellen
verlangen für das geförderte Ergebnis eine anerkannte freie Lizenz. **Daraus
folgt, ohne dass irgendetwas umlizenziert werden müsste: Sage-Protokol ist das
Antrags-Repo.**

**2 · Die Bidirektionalität ist die These.** Die Suche ist bidirektional. Beide
Seiten fragen, beide antworten. Die Beobachtung über Mensch und KI hat dieselbe
Figur: der Mensch prägt die KI über Grundsätze, die KI prägt den Menschen über
Gewöhnung. Das bindet die drei Stränge zu **einem** Vorhaben statt zu einer Liste.

## Eine verbreitete Annahme richtiggestellt

Die Annahme, „Psychologe" dürfe sich auch ohne Studium nennen, wer will:
**nachgesehen, stimmt nicht.** Geschützt über § 5 Abs. 2 Nr. 3 UWG, gerichtlich
bestätigt; der BDP hält zusätzlich § 132a Abs. 2 StGB für einschlägig, akademische
Grade fallen eindeutig darunter. Frei sind „psychologische Beratung", „Coach",
„Berater", vermutlich die Wahrheit hinter dem Irrtum, sie gilt aber der
Tätigkeit, nicht dem Titel. **Folgenlos für die Förderung:** verlangt wird eine
Methode, kein Titel.

## Prüftiefe: ehrlich

- `nlnet.nl` und `martinmeng.de` waren aus dieser Umgebung **nicht abrufbar**
  (Egress-Sperre). Was zu den Stundendeckeln im
  Dokument steht, stammt aus **Suchergebnis-Zusammenfassungen**, nicht aus den
  Originalseiten. Steht so auch im Dokument, Abschnitt 1.
- **Jede Frist ist eine Fundstelle vom 2026-08-23**, kein Versprechen. Der
  Fahrplan verlangt in Stufe A ausdrücklich, sie selbst nachzusehen.
- Alle Pfadangaben in Backticks wurden gegen das Dateisystem geprüft. Ein
  Fremd-Repo-Pfad (Kimhubs `schicht/grundsaetze.md`) wurde daraufhin aus den
  Backticks genommen, statt eine Datei zu behaupten, die es hier nicht gibt.
- **Nicht prüfbar aus einer Sitzung:** die persönlichen Voraussetzungen
  (steuerlicher Status, Hochschulabschluss, Bundesland, Arbeitsumfang) und die
  Weichenfrage, ob das Institut gemeinnützig sein soll. Abschnitt 9 des Dokuments
  nennt **nur, wofür jede Angabe gebraucht wird**, die Angaben selbst gehören
  ins Gespräch, nicht ins öffentliche Depot.

## Manual-Check

**Ungeprüft, weil nicht nötig:** diese Sitzung hat keinen Code angefasst.
`tests/manual_check.html` ist unverändert.

## Entscheidung zur Veröffentlichung

Sage-Protokol ist **öffentlich** (gemessen: `github.com/…` antwortet ohne
Anmeldung mit 200). Der erste Entwurf dieses Dokuments nannte die finanzielle
Lage, den steuerlichen Status und die Abschlussfrage des Antragstellers, auf
einer öffentlich lesbaren Seite. Auf Nachfrage entschieden: **neutral fassen,
dann mergen.**

Geblieben ist alles Sachliche: Förderwege, Fristen, Adressen, Rechtsformen, der
Lizenz-Befund, die Bidirektionalitäts-These. Herausgenommen sind die
persönlichen Verhältnisse; Abschnitt 9 nennt nur noch, **wofür** jede Angabe
gebraucht wird.

**Die Lehre daraus, netzweit anschlussfähig:** ein Rechercheergebnis über eine
Person gehört nicht automatisch dorthin, wo das Rechercheergebnis über eine
Software hingehört. Bei einem öffentlichen Depot ist „nützlich" nicht dasselbe
wie „veröffentlichbar", dieselbe Familie wie NETZWEIT § 6c.

## Nächste Schritte

1. Stufe A des Fahrplans (ORCID, der Termin, der Klaus’ Sache ist, Fristen nachsehen,
   Antrags-Repo festlegen), kostet nichts und macht alles Weitere möglich.
2. Die vier bis fünf offenen Fragen beantworten; ohne sie bleiben EXIST, die
   einiges Vermutung.
3. Stufe B, die Vorleistungs-Mappe: **Zenodo-DOI zuerst**, bestes Verhältnis von
   Aufwand zu Wirkung auf der ganzen Liste.
4. Stichtag: Prototype-Fund-Bewerbung **01.10.–30.11.2026**.

---

# Fortsetzung · 2026-08-23 · Der Forschungskorpus

**Auftrag von Klaus:** die Repos finden, die sich als offen lizenzierter Beleg
der Forschung eignen, und die drei öffentlichen zuerst umlizenzieren.

## Umlizenziert auf MIT

| Repo | PR | Proben | Historie geprüft |
|---|---|---|---|
| Kim-Bell | #52 | `npm test` 4/4 | 54 Commits, sauber |
| Kimseek | #70 | `npm test` 11/11 | 72 Commits, sauber |
| Kimboard | #128 | `node tests/alle.mjs` **31/31** | 128 Commits, sauber |

Je vier Stellen: `LICENSE`, `package.json`, `FP-COPYRIGHT`-Kopf in `index.html`,
`RECHTE.md`.

## Neu in diesem Repo

- das Korpus-Blatt, die benannte Kette aus sechs Repos
- `docs/werkstatt/`. Weg C für Kimhub: README (mit Prüfsummen),
  `grundsaetze.md` (byte-gleich), `WERKSTATTREGELN.md` (Auszug), `BEFUND.md`

## Vier Befunde, die nicht gesucht waren

1. **Kim-Bell stand im Widerspruch zu sich selbst**. „1:1-kopierbare Vorlage"
   im README, Kopierverbot in Ziffer 4 der Lizenz. Seit Bestehen des Repos.
2. **Ziffer 5 aller 28 Nutzungslizenzen stellt die SBKIM-Module unter MIT.** Die
   frühere Zählung „nur 3 von 33 sind Open Source" war zu grob: das Protokoll war
   überall offen, zu war nur die App-Hülle. Im Chat richtiggestellt.
3. **Die SBKIM-Demo liegt unter `sbkim-demo/` in diesem Repo** und war damit
   immer schon MIT. Klaus hatte sie für ein eigenes Repo gehalten.
4. **Kimhubs Historie trägt die Rechnungsdaten weiter.** `git rm` am 2026-08-22
   nahm sie aus dem Arbeitsbaum, nicht aus der Vergangenheit: 859 Zeilen, 75
   Belege, über `0ee4640` abrufbar. Das ist der Grund für Weg C.

## Sorgfalt, die getan wurde

- Alle drei Historien **vollständig entflacht** (`git fetch --unshallow`) und auf
  API-Schlüssel, Tokens, private Schlüssel und Belegdateien durchsucht. Nichts
  gefunden. Die `sk-ant-api`-Treffer sind Testdaten des eigenen Wächters
  (`const SCHEIN = "sk-ant-api0…" + "x".repeat(90)`).
- **Ein Befund, kein Riegel:** in Kimseeks und Kimboards Historie steht an alten
  Stellen eine private E-Mail-Adresse; im aktuellen Stand ist sie ersetzt. Beide
  Repos sind ohnehin öffentlich, MIT ändert daran nichts. In den PRs genannt.
- Die **Kastenbreite** im `FP-COPYRIGHT`-Kopf wurde aus der Datei gemessen (65),
  nicht geraten. `package.json` nach dem Schreiben mit `json.loads` gegengelesen.
- Bei Kimboard **`node tests/alle.mjs`** statt `npm test`, genau die
  Unterscheidung, vor der die dortige Verfassung warnt. `npm test` hätte 6
  Prüfungen gemeldet und wie eine vollständige Auskunft ausgesehen.
- Alle Markdown-Verweise der neuen Dateien gegen das Dateisystem geprüft.

## Was NICHT im Korpus liegt, und warum

Die Geschäfts-Apps behalten ihre Nutzungslizenz. Kimhub bleibt privat. Kein
lauffähiger Code aus Kimhub wurde nach Sage kopiert: **eine Probe, die in keinem
Läufer steht, ist stumm**. Sie hier abzulegen hieße, grüne Haken vorzutäuschen,
die niemand einlöst.

## Manual-Check

**Ungeprüft, weil nicht nötig:** nur Doku und Lizenzdateien angefasst, kein
App-Code. In den drei umlizenzierten Repos liefen die vollen Proben grün.

---

# Fortsetzung · 2026-08-23 · Paper A

**Auftrag:** „Fang mit Paper A an."

## Gebaut

`docs/papers/PAPER_A_regeln-und-grundsaetze.md`, Fassung 1, 553 Zeilen.
*Regeln und Grundsätze: zwei Arten, ein KI-System zu lenken, und warum keine
allein genügt.*

## Der Beitrag, abgegrenzt statt behauptet

Vier Quellen recherchiert, keine aus dem Gedächtnis zitiert:

| Quelle | Was sie besetzt |
|---|---|
| Kaplow 1992, *Rules versus Standards* | die Unterscheidung in der Rechtsökonomie |
| Schuett et al. 2024, *From Principles to Rules* | dieselbe Abwägung für die KI-**Regulierung** |
| Bai et al. 2022, *Constitutional AI* | Grundsätze zur **Trainingszeit**, vom Modellanbieter |
| Rebedea et al. 2023, *NeMo Guardrails* | Regeln zur **Ausführungszeit**, vom Einsetzenden |

**Dünn besetzt bleibt die vierte Zelle:** Grundsätze zur Ausführungszeit, gesetzt
vom **Betreiber**, in einer Textdatei ohne Programmierkenntnisse änderbar. Die
Literatur kennt die Stelle, behandelt sie aber als **Risiko** („der Betreiber kann
den Systemprompt ändern") statt als Instrument. Dort sitzt die Werkstatt.

## Zwei eigene Beiträge

1. **Sättigungsgrenze.** Regeln addieren sich, Grundsätze verdünnen sich. Die
   Sieben-Grenze in `grundsaetze.md` ist damit keine Marotte, sondern eine
   Eigenschaft des Kanals, und in der zitierten Literatur nicht behandelt, weil
   auf deren Ebene kein Aufmerksamkeitsbudget im Spiel ist.
2. **Dreiarmiger Versuch** (Klaus, 2026-08-23): R · G · R+G. Macht die These
   widerlegbar. Drei Ergebnisse würden sie umwerfen, alle drei stehen im Paper.
   das schwerste: wenn R und G **dieselben** Fehler machen, nur verschieden
   viele, ist die Trennung Beschreibung und keine Erklärung.
   Dazu die Anforderung, die über allem steht: **das Analysewerkzeug darf dem
   Bewertenden nicht zeigen, aus welchem Arm ein Lauf stammt.**

## Ein Fehler von mir, von der eigenen Gegenprobe gefunden

Ich schrieb „die acht Regeln", an vier Stellen. **Es sind sechs**, nachgezählt an
`WERKSTATTREGELN.md`. Die Zahl war gesetzt, nicht gezählt: genau die Falle, gegen
die Grundsatz 4 geschrieben wurde. Richtiggestellt in `PAPER_A`, `BEFUND.md` und
`werkstatt/README.md`; die Gegenprobe darauf läuft jetzt gegen den Wortlaut der
Regelliste, nicht gegen eine Erinnerung.

**Merksatz, netzweit anschlussfähig:** wer eine Zahl über das eigene Material
schreibt, zählt sie ab. Auch, und gerade, wenn er das Material selbst angelegt hat.

## Geprüft

- Alle Zitate gegen die Quelldateien geprüft: „verschieben einen Schnitt",
  „Sten hat den Code durchlaufen lassen", die −1,15, „Höchstens sieben".
- Zahl der Regeln (6) und der Grundsätze (5) **gezählt**, nicht geschätzt.
- Alle Markdown-Verweise in `docs/papers/` gegen das Dateisystem geprüft.

## Manual-Check

**Ungeprüft, weil nicht nötig:** nur Doku angefasst, kein App-Code.

### Nachtrag am selben Tag: die zweite Achse

Klaus' zweiter Vorschlag, **drei Aufgabenarten** neben den drei Armen: eigene
Idee (E) · Vorlage vom Vorgänger (V) · Bestehendes verbessern (B).

**Das ist die wichtigere der beiden Ergänzungen.** Eine Rangfolge („R+G gewinnt")
lässt sich aus fast jedem Ergebnis herauslesen; ein **Verlauf über drei Stufen**
nicht. Und der Verlauf folgt zwingend aus Kaplows Punkt: wenn eine Regel genau den
Fall abdeckt, für den sie geschrieben wurde, muss ihr Vorteil mit der
Vorhersehbarkeit des Falls **steigen**, und der Vorteil der Grundsätze fallen.
Läuft es flach oder gegenläufig, ist die These widerlegt, egal wer insgesamt vorn
liegt.

Zweiter Gewinn: Aufgabenart B legt der Truppe den Bestand **vor**. Damit trennt
sich, was in der Feldbeobachtung vermischt war, schlägt sie Vorhandenes vor,
weil sie unaufmerksam ist (dort greifen Grundsätze), oder weil sie den Bestand
nicht sieht (dann war es nie ein Lenkungsproblem, sondern eines des Zugangs)?

Daraus folgte eine Korrektur an den Fehlerkategorien: **„Wiederholung" ist nur
bei Art B aussagekräftig.** Wer sie über alle Arten zusammenzählt, mischt
fehlenden Zugang mit fehlender Aufmerksamkeit zu einer Zahl.

Der Preis ist benannt: neun Bedingungen statt zwei, jede mehrfach. Zwei Auswege
stehen im Paper, beide **vorher** zu entscheiden: stufenweise fahren, oder die
Wiederholungszahl senken und hinschreiben, dass die Aussage schwächer wird. Was
nicht geht: unterwegs kürzen und das Ergebnis vollständig aussehen lassen.
