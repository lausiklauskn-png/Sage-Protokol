# Übergabeprotokoll · 2026-08-23 · Forschungsförderung

**Rolle:** Recherche-Sitzung. Kein Modul-Code, keine Probe berührt.
**Zweig:** `claude/research-funding-next-steps-ib58w2` (frisch von `origin/main`, 4acaa1d).

## Auftrag

Gefragt war ein **abhakbarer Fahrplan**: Lassen sich für die Arbeit an diesem Netz
Forschungsgelder beantragen? Was sind die Voraussetzungen? Verein oder nicht? Wer
kann was tun?

Im Verlauf dazugekommen (jeweils eingearbeitet): Sachmittel und Personal · ein
**Institut für KI-Kompetenz im täglichen Gebrauch** · **Suchtpotenzial** ·
**psychische Wirkungen der KI-Nutzung** · Kooperationen mit Wissenschaftlern ·
die Frage zur Bezeichnung „Psychologe".

## Ergebnis

`docs/FORSCHUNGSFOERDERUNG.md` (~900 Zeilen). Aufbau: kurze Antwort · Prüftiefe ·
was förderfähig ist (drei Forschungsstränge) · Rechtsform · das Institut ·
Lizenzlage · fünf Förderwege im Einzelnen · Hochschul- und Wissenschaftskontakte ·
Fahrplan in fünf Stufen · Aufgabenverteilung · offene Fragen · Adressen.

## Die zwei Funde, die nicht gesucht waren

**1 · Die Lizenzlage kann jeden Antrag kippen.** Über alle 33 Klone gemessen:
3 Repos mit MIT (`Sage-Protokol`, `SB-KIMTool-Point`, `mycel-karte`), 28 mit der
eigenen Nutzungslizenz samt Bezahl-Vorbehalt, 2 ohne jede Lizenz
(`BookLedgerPro`, `Meine-In-and-Out-Book`). Prototype Fund, NLnet und OTF
verlangen für das geförderte Ergebnis eine anerkannte freie Lizenz. **Daraus
folgt, ohne dass irgendetwas umlizenziert werden müsste: Sage-Protokol ist das
Antrags-Repo.**

**2 · Die Bidirektionalität ist die These.** Die Suche ist bidirektional — beide
Seiten fragen, beide antworten. Die Beobachtung über Mensch und KI hat dieselbe
Figur: der Mensch prägt die KI über Grundsätze, die KI prägt den Menschen über
Gewöhnung. Das bindet die drei Stränge zu **einem** Vorhaben statt zu einer Liste.

## Eine verbreitete Annahme richtiggestellt

Die Annahme, „Psychologe" dürfe sich auch ohne Studium nennen, wer will:
**nachgesehen, stimmt nicht.** Geschützt über § 5 Abs. 2 Nr. 3 UWG, gerichtlich
bestätigt; der BDP hält zusätzlich § 132a Abs. 2 StGB für einschlägig, akademische
Grade fallen eindeutig darunter. Frei sind „psychologische Beratung", „Coach",
„Berater" — vermutlich die Wahrheit hinter dem Irrtum, sie gilt aber der
Tätigkeit, nicht dem Titel. **Folgenlos für die Förderung:** verlangt wird eine
Methode, kein Titel.

## Prüftiefe — ehrlich

- `nlnet.nl` und `martinmeng.de` waren aus dieser Umgebung **nicht abrufbar**
  (Egress-Sperre). Was zu NLnet und zu den Stundendeckeln der Forschungszulage im
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
  nennt **nur, wofür jede Angabe gebraucht wird** — die Angaben selbst gehören
  ins Gespräch, nicht ins öffentliche Depot.

## Manual-Check

**Ungeprüft, weil nicht nötig:** diese Sitzung hat keinen Code angefasst.
`tests/manual_check.html` ist unverändert.

## Entscheidung zur Veröffentlichung

Sage-Protokol ist **öffentlich** (gemessen: `github.com/…` antwortet ohne
Anmeldung mit 200). Der erste Entwurf dieses Dokuments nannte die finanzielle
Lage, den steuerlichen Status und die Abschlussfrage des Antragstellers — auf
einer öffentlich lesbaren Seite. Auf Nachfrage entschieden: **neutral fassen,
dann mergen.**

Geblieben ist alles Sachliche — Förderwege, Fristen, Adressen, Rechtsformen, der
Lizenz-Befund, die Bidirektionalitäts-These. Herausgenommen sind die
persönlichen Verhältnisse; Abschnitt 9 nennt nur noch, **wofür** jede Angabe
gebraucht wird.

**Die Lehre daraus, netzweit anschlussfähig:** ein Rechercheergebnis über eine
Person gehört nicht automatisch dorthin, wo das Rechercheergebnis über eine
Software hingehört. Bei einem öffentlichen Depot ist „nützlich" nicht dasselbe
wie „veröffentlichbar" — dieselbe Familie wie NETZWEIT § 6c.

## Nächste Schritte

1. Stufe A des Fahrplans (ORCID, Steuerberater-Termin, Fristen nachsehen,
   Antrags-Repo festlegen) — kostet nichts und macht alles Weitere möglich.
2. Die vier bis fünf offenen Fragen beantworten; ohne sie bleiben EXIST, die
   Landesprogramme und die Forschungszulage Vermutung.
3. Stufe B, die Vorleistungs-Mappe — **Zenodo-DOI zuerst**, bestes Verhältnis von
   Aufwand zu Wirkung auf der ganzen Liste.
4. Stichtag: Prototype-Fund-Bewerbung **01.10.–30.11.2026**.
