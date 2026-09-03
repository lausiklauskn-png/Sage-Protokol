# Übergabeprotokoll · fünf Sitzungen vom 2026-08-23

> **Ausgelagert aus `docs/PULS.md` am 2026-09-02, wortgleich.** Die Datei stand an
> ihrer 3000-Zeilen-Grenze; die Schutz-Klausel dort verlangt **auslagern statt
> kürzen**. Kein Satz ist verändert, gekürzt oder umformuliert. In `PULS.md`
> stehen an dieser Stelle jetzt fünf Tabellen-Zeilen, die hierher verweisen.

> **Zu den Verweisen im Wortlaut:** die Links wurden geschrieben, als der Text in
> `docs/PULS.md` stand, und sind deshalb relativ zu **`docs/`** gemeint. Aus diesem
> Verzeichnis lösen sie nicht auf. Wer einem folgen will, stellt `docs/` davor —
> ein Verweis auf `papers/…` meint `docs/papers/…`. Verweise auf `http…` und auf
> Nachbardateien in diesem Verzeichnis stimmen. **Der Wortlaut wurde dafür NICHT
> angefasst**: eine ausgelagerte Fassung, die sich vom Original unterscheidet, wäre
> keine Auslagerung mehr.

---

## Stand 2026-08-23 (Bau) — 📦 Antragsmappe: eine Datei, zwei Abteilungen

**Rolle:** Bausitzung. Zweig `claude/research-funding-paper-delivery-vuppnj`,
frisch von `origin/main`. Auftrag: Punkt 2 und 3 des Briefes vom 2026-08-23.

**Gebaut:** die Arbeits-Mappe (242 KB) aus neun Markdown-Quellen —
**Abteilung 1 privat** (Fahrplan Forschungsgelder), **Abteilung 2 einreichbar**
(Entstehung · Paper A · Forschungskorpus · Paper-Plan · die vier
Werkstatt-Unterlagen). Jede Abteilung hat einen eigenen Download- und
Druck-Knopf, einen eigenen Kopf mit Datum und Herkunft, und nimmt beim
Herausnehmen **nur sich selbst** mit.

Dazu `tools/antragsmappe-bauen.mjs` + `tools/markdown-mini.mjs`. **Die Mappe
wird erzeugt, nicht gepflegt** — sonst stünden dieselben Sätze zweimal im Depot
und liefen auseinander. Wer eine `.md` ändert, ruft
`node tools/antragsmappe-bauen.mjs`; die Probe schlägt sonst an.

**Paper A · die 47-%-Stelle aus der Zusammenfassung heraus** (Klaus' Befund).
Sie rechnete mit vier Begriffen, die bis dahin nirgends erklärt waren —
nachgezählt: **„Schicht" kam dort zum ersten Mal im ganzen Papier vor**, Zeile
50 von 1.833. Zahlen raus, der Rechenweg steht vollständig in § 3.8 (nachgesehen,
nicht angenommen). **Davor** steht jetzt ein Absatz, der das Werkzeug einführt —
samt der Unterscheidung *Dokumentation fünf Monate, Messung Tage*.

**Drei echte Fehler im Markdown-Leser**, alle von der Nachzählung gefunden
(jede der 2.799 Quellzeilen muss in der Ansicht wiederauftauchen): Kursiv brach
am Zeilenumbruch ab · Fett vertrug kein Kursiv darin · und der Code-Platzhalter
war „Leerzeichen + Zahl + Leerzeichen" — **jede nackte Zahl im Text** wäre
ersetzt oder gelöscht worden. Der dritte stand nur im eigenen Nachlesen.

**Und drei Fehler in den Wächtern selbst:** jedes Tag durch ein Leerzeichen zu
ersetzen meldete **320 Zeilen** als fehlend, die alle dastanden · der
Unterstrich als Auszeichnung zerlegte Dateinamen (70 weitere Fehlalarme) · und
„der Download enthält die andere Abteilung nicht" am **Wortlaut** geprüft wurde
rot, sobald der Fahrplan die Mappe selbst beschreibt. *Ein Wächter nagelt eine
Aussage fest, keine Wörter* — jetzt strukturell.

**Richtiggestellt:** `FORSCHUNGSFOERDERUNG.md` sagte, Kimhub führe „bereits" ein
Fahrtenbuch. Stimmt — **seit dem 22.08.2026**. Neben der Aussage „fünf Monate
Vorleistung" las sich das, als sei die ganze Zeit gestundet worden. § Weg 2, B3
und D2 nachgezogen: **dokumentierte Zeit und gemessene Zeit sind zwei Dinge**,
Älteres wird **rekonstruiert** und als solches gekennzeichnet.

**Gemessen:** 84 von 84 Proben grün, 0 rot, 0 nicht lauffähig · Gegenprobe
**17 von 17 gefangen**. Die Mappe im Browser: headless geöffnet, Drucken und
Herunterladen wirklich ausgelöst. **Klaus' Sichttest am Tablet steht aus** —
besonders der Download dort ist von hier aus ungeprüft.

**Offen, und es gehört besprochen:** Paper A sagt an vier Stellen, die Rollen
hätten **keine Werkzeuge**. Kimhubs Verfassung sagt seit dem 2026-08-23 das
Gegenteil, auf Klaus' Wort — und die Momentaufnahme in `docs/werkstatt/` ist
damit am Tag ihrer Anlage überholt. Für den beobachteten Zeitraum stimmt der
Satz, aber er steht im **Präsens**, und das Papier verlinkt das Depot. Drei
Wege stehen im Übergabeprotokoll; **Klaus entscheidet.**

**Nächster sinnvoller Schritt:** Sichttest der Mappe; dann den
Werkzeug-Widerspruch entscheiden, bevor das Papier eingereicht wird.

Protokoll: [`docs/sessions/archiv/2026-08-23_antragsmappe-und-paper-a-zusammenfassung.md`](sessions/archiv/2026-08-23_antragsmappe-und-paper-a-zusammenfassung.md)

---

## Stand 2026-08-23 (Bau) — 📄 Paper A geschrieben

**Rolle:** Fortsetzung derselben Sitzung. Zweig
`claude/research-funding-next-steps-ib58w2`.

**Gebaut:** `docs/papers/PAPER_A_regeln-und-grundsaetze.md` (553 Zeilen, Fassung 1)
— *„Regeln und Grundsätze: zwei Arten, ein KI-System zu lenken — und warum keine
allein genügt."*

**Der Beitrag, sauber abgegrenzt.** Die Literatur besetzt zwei Positionen:
Grundsätze zur **Trainingszeit** vom Modellanbieter (Constitutional AI, Bai et al.
2022) und Regeln zur **Ausführungszeit** vom Einsetzenden (NeMo Guardrails,
Rebedea et al. 2023). Dazu die Rechtsökonomie (Kaplow 1992, *rules versus
standards*) und deren Übertragung auf die KI-Regulierung (Schuett et al. 2024).
**Dünn besetzt ist die vierte Zelle: Grundsätze zur Ausführungszeit, gesetzt vom
Betreiber**, in einer Textdatei, die auch ein Nicht-Programmierer ändern kann.
Genau dort sitzt die Werkstatt. Alle vier Quellen recherchiert, nicht aus dem
Gedächtnis zitiert.

**Zwei eigene Beiträge über das Gerüst hinaus:**

1. **Die Sättigungsgrenze.** Regeln addieren sich, Grundsätze verdünnen sich —
   zwanzig wirken schlechter als fünf, weil Aufmerksamkeit begrenzt ist. Kaplow
   und Schuett et al. behandeln das nicht, weil auf ihrer Ebene kein
   Aufmerksamkeitsbudget im Spiel ist.
2. **Der Versuchsaufbau** — beides Klaus' Vorschläge vom selben Tag, und der
   zweite ist der wichtigere. **Drei Arme** (nur Regeln · nur Grundsätze ·
   beides) mal **drei Aufgabenarten** (eigene Idee · Vorlage · Bestehendes
   verbessern). Vorab festgelegte Fehlerkategorien, und ein Auswertungswerkzeug,
   das dem Bewertenden **verbirgt, aus welchem Arm ein Lauf stammt** — ohne diese
   Verblindung misst die Auswertung die Erwartung des Auswertenden, zumal er die
   Grundsätze selbst geschrieben hat.

   **Warum die zweite Achse den Unterschied macht:** eine bloße Rangfolge („R+G
   gewinnt") lässt sich aus fast jedem Ergebnis herauslesen. Ein **Verlauf über
   drei Stufen** nicht. Aus Kaplows Punkt folgt zwingend, dass der Vorteil der
   Grundsätze mit der Vorhersehbarkeit des Falls fallen muss — bei der offenen
   Aufgabe groß, bei der umrissenen klein oder umgekehrt. Läuft der Verlauf flach
   oder gegenläufig, ist die These widerlegt, unabhängig vom Gesamtsieger.
   Zusätzlich trennt Aufgabenart B endlich, was bisher vermischt war: ob die
   Truppe Vorhandenes vorschlägt, weil sie unaufmerksam ist oder weil sie den
   Bestand gar nicht sieht.

**Ein Fehler von mir, von der eigenen Gegenprobe gefunden.** Ich hatte „die acht
Regeln" geschrieben, an vier Stellen. **Es sind sechs.** Die Zahl war gesetzt,
nicht gezählt — genau die Falle, gegen die Grundsatz 4 geschrieben wurde („eine
geratene Zahl klingt genau wie eine gemessene"). Richtiggestellt im Paper, in
`werkstatt/BEFUND.md` und in `werkstatt/README.md`. **Wer eine Zahl über das
eigene Material schreibt, zählt sie ab.**

**Nächster sinnvoller Schritt:** Zenodo-DOI für die beiden vorhandenen Papers und
für dieses; parallel der der Termin, der Klaus’ Sache ist.

---

## Stand 2026-08-23 (Bau) — 🇩🇪 Hamburg nachgezogen, Paper-Plan angelegt

**Rolle:** Fortsetzung derselben Sitzung. Zweig
`claude/research-funding-next-steps-ib58w2`.

**Anlass:** Klaus hat das Bundesland genannt (**Hamburg**), nach dem Weg zur
Anmeldung gefragt (Gewerbe oder freiberuflich, online?) und drei Paper-Themen
umrissen.

**Gebaut:**

> *(Hier ist gekürzt.* **Was gemessen und getan wurde, steht oben; was daraus
> für Klaus' Lage folgt, gehört nicht in ein öffentliches Depot.** *Der Befund
> bleibt, der Rat ist heraus — die Regel dazu steht in `CLAUDE.md`.)*

eigener dritter Punkt: **beides leistet Verschiedenes und keins genügt allein.**
Steht so im Plan.

**Nächster sinnvoller Schritt:** der Termin, der Klaus’ Sache ist (Mitte der Woche) plus
der Behörden-Schritt parallel; danach Zenodo-DOI für die beiden vorhandenen Papers.

---

## Stand 2026-08-23 (Bau) — 🔓 Der Forschungskorpus steht

**Rolle:** Fortsetzung derselben Sitzung. Zweig
`claude/research-funding-next-steps-ib58w2`.

**Auftrag von Klaus:** die Repos suchen, die sich als offen lizenzierter Beleg
der Forschung eignen — und die drei öffentlichen zuerst umlizenzieren.

**Getan.** Drei Repos auf **MIT** gehoben, je vier Stellen (LICENSE,
`package.json`, der `FP-COPYRIGHT`-Kopf in `index.html`, `RECHTE.md`):

| Repo | PR | Proben |
|---|---|---|
| Kim-Bell | #52 | 4/4 grün |
| Kimseek | #70 | 11/11 grün |
| Kimboard | #128 | **31/31 grün** — `node tests/alle.mjs`, nicht `npm test` |

**Der Korpus steht damit auf sechs Repos:** Sage-Protokol · SB·KIMTool·Point ·
mycel-karte · Kim-Bell · Kimseek · Kimboard. Benannt in
[das Korpus-Blatt](FORSCHUNGSKORPUS.md).

**Dazu neu: [`docs/werkstatt/`](werkstatt/)** — der Forschungsteil aus Kimhub als
Momentaufnahme (Weg C, Klaus' Entscheidung). `grundsaetze.md` byte-gleich,
`WERKSTATTREGELN.md` als Auszug, beide mit der SHA-256 der Quelle festgehalten;
`BEFUND.md` sagt, was sich beobachten ließ **und was daraus nicht folgt** (keine
Kontrollgruppe, kein Maß, Fallzahl eins, nicht verblindet, Modellwechsel nicht
getrennt).

**Vier Befunde, die niemand gesucht hatte:**

1. **Kim-Bell stand im Widerspruch zu sich selbst.** README und CLAUDE.md nennen
   es eine „1:1-kopierbare Vorlage" — Ziffer 4 der alten Lizenz verbot
   Weitergabe, Veränderung und Verbreitung veränderter Fassungen. Eine Vorlage,
   die man nicht kopieren darf, ist keine. Seit Bestehen des Repos so drin.
2. **Ziffer 5 macht die frühere Zählung genauer.** Alle 28 eigenen
   Nutzungslizenzen stellen die SBKIM-Module unter MIT. Das Protokoll war also
   längst überall offen; zu war nur die App-Hülle. „Nur 3 von 33 sind Open
   Source" war zu grob.
3. **Die SBKIM-Demo musste gar nicht angefasst werden** — sie liegt unter
   `sbkim-demo/` in diesem Repo und ist damit seit jeher MIT.
4. **Kimhubs Historie trägt die Rechnungsdaten weiter.** `git rm` am 2026-08-22
   nahm sie aus dem Arbeitsbaum, nicht aus der Vergangenheit: 859 Zeilen, 75
   Belege, über den Commit davor abrufbar. Deshalb bleibt Kimhub privat.

**Vor jedem Push geprüft:** die Historien aller drei Repos vollständig entflacht
(54 · 72 · 128 Commits) und auf Schlüssel, Tokens, private Schlüssel und
Belegdateien durchsucht — **nichts gefunden**; die `sk-ant-api`-Treffer sind die
Testdaten des eigenen Wächters. Die Kastenbreite im `FP-COPYRIGHT`-Kopf wurde aus
der Datei gemessen (65), nicht geraten; `package.json` nach dem Schreiben mit
`json.loads` gegengelesen.

**Nächster sinnvoller Schritt:** Stufe A/B des Fahrplans — der Termin, der Klaus’ Sache ist,
ORCID, Zenodo-DOI. Der Korpus steht, die Papers sind noch nicht zitierfähig.

---

## Stand 2026-08-23 (Recherche) — eine Recherche-Sitzung

**Rolle:** Recherche, kein Modul-Code.

**Gebaut:** ein Arbeitspapier für Klaus. Der Inhalt betrifft seine eigene Lage
und liegt nicht in diesem Depot.

> *Was diese Sitzung methodisch beigetragen hat, steht in den Einträgen darüber:
> die Prüftiefe wird je Angabe genannt, gesperrte Quellen werden benannt statt
> umgangen, und was nur Vermutung ist, steht als Vermutung da.*

---

---
