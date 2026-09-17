# Brief an die nächste Sitzung — die KI-Schulung ins Regal stellen

**Geschrieben am 2026-09-17** von der Sitzung, die den Tag davor abgeschlossen hat.
Absender-Zweig: `claude/sage-modul-15-rollout-jmecb1`.

**AUFGABE:** Die fertige Schulungs-Unterlage zum **EU AI Act, Artikel 4** auf
**PWA Toolpoint** und **family-projekt.de** veröffentlichen — auf beiden Seiten
**hinter dem Auslieferungsprüfer**.

---

## 1 · Pflichtlektüre, bevor du etwas anfasst

1. `CLAUDE.md` dieses Depots — besonders die **Sitzungsstart-Pflicht** (frisch von
   `origin/main`) und den Abschnitt *„Befund ins Dokument, Rat in den Chat"*.
2. `docs/PULS.md` — der oberste Eintrag.
3. **Diesen Brief** zu Ende.
4. `docs/schulung/README.md` — was an der Unterlage gemessen ist.
5. Die `CLAUDE.md` der **beiden Ziel-Depots**. Sie sind lang; die Abschnitte, die
   hier zählen, sind unten namentlich genannt.
6. Skills, statt Wissen nachzubauen: **`seiten-bauregeln`** (vor jedem Bau einer
   Seite) und **`app-container-kompakt`** (PWA Toolpoint) bzw.
   **`app-container-schaufenster`** (family-project) für die Karte.

---

## 2 · Was andere Sitzungen gerade getan haben

**Der Grund, warum das hier oben steht:** beide Ziel-Depots haben sich am Abend
des 16.09. noch bewegt, und in PWA Toolpoint committet ein **täglicher Lauf**
von allein. Ein Klon im Behälter ist also mit Sicherheit alt.

| Depot | zuletzt auf `main` | was dazukam |
|---|---|---|
| **Sage-Protokol** | `7381767` · 17.09. 00:06 | #1020–#1033: Modul 15 in **zwanzig** Trägern · Herkunfts-Riegel im Verteiler (`--handarbeit-gesichert`) · Briefkasten `seq 91` · Abschlussbrief mit Stundennachweis · **`docs/PFLEGE-LISTE.md` neu angelegt** |
| **PWA-Toolpoint** | `954cf56` · 17.09. 08:49 | #117–#122 bis 16.09. 20:18 (Modul 15 spricht Englisch · Wizard-Zähler · **jede `?v=` trägt die Cache-Nummer** · eine Kennung, eine Spore). Der Commit von heute früh ist der **automatische Messwerte-Lauf** — kein Mensch, keine Absicht, aber ein bewegtes `main`. |
| **family-project** | `89c79a0` · 16.09. 21:06 | #303–#308 (Modul 15 auf Kanon-Stand, die eigene Wortkarte ist in den Glue umgezogen · `?v=` · Kennung/Spore) |

**Daraus folgt für dich:** in **beiden** Ziel-Depots vor der ersten Zeile

```bash
git fetch origin --quiet && git checkout -B <zweig> origin/main
```

und beim Veröffentlichen mit ausdrücklicher Refspec pushen — `checkout -B` hängt
den Upstream auf `main` um, und dann schiebt ein `git push -u` den **falschen**
Zweig:

```bash
git push -u origin refs/heads/<zweig>:refs/heads/<zweig>
git diff --stat origin/main origin/<zweig>     # leer = der PR wäre leer
```

**Neu und für dich nützlich:** `docs/PFLEGE-LISTE.md` ist der Ort, an dem ein Fund
landet, der **nicht** zu dieser Aufgabe gehört. Repariere ihn nicht nebenbei —
schreib ihn dort hin. Fünf Punkte stehen schon darin.

---

## 3 · Die Unterlage — sie liegt im Depot, du musst sie nicht erbitten

**`docs/schulung/EU_AI_Act_Art4_KI_Schulung.html`** (190 Zeilen, 31 480 Bytes,
`md5 cc9f4b2b7a7d0b6f3f69130cd7c7f795`).

> Klaus vermutete sie „auf Sage-Protokoll". **Sie war nicht dort** — er hat sie am
> 17.09. in den Chat geschickt. Damit die nächste Sitzung nicht wieder danach
> fragen muss, liegt sie jetzt hier. Ein Brief, der auf einen Chat-Anhang zeigt,
> ist beim Öffnen wertlos.

Eine einzige Datei, und sie trägt **vier** Dinge:

| Teil | Inhalt |
|---|---|
| Schulung | 10 Abschnitte — was ein KI-System ist · KI ist hilfreich, aber nicht automatisch richtig · Datenschutz · Urheberrecht · Diskriminierung · Transparenz · verbotene und Hochrisiko-Anwendungen · sicherer Umgang · betriebliche Regeln · Dokumentation |
| Wissenstest | **15 Fragen** mit Auswertung im Browser (`grade()`), Bestehens-Hinweis |
| Bescheinigung | eigene Druckseite, Felder für Teilnehmer · Unternehmen · Datum, übernimmt den Punktestand |
| Lösungsschlüssel | eigener Knopf — beim normalen Drucken **immer** aus |

Vier Knöpfe steuern den Druck (`printTraining`, `printCertificate`, `printBoth`,
`printSolution`) über `body.print-*`-Klassen und `@page size:A4`.

**Was daran schon in Ordnung ist** (gemessen, siehe `docs/schulung/README.md`):
keine Laufzeit-Abhängigkeit im Browser · kein Personenbezug · kein Geheimnis ·
zwei `<a href>` auf amtliche EU-Seiten · ein eigener Satz, dass die Vorlage keine
Einzelfallprüfung ersetzt.

⚠ **Dieser Satz wird beim Kopieren NICHT weggelassen, und die Karte verspricht
nichts darüber hinaus.** Eine Schulungs-Unterlage, die im Regal wie eine Zusage
von Rechtskonformität aussieht, ist die teuerste Sorte Beschriftung. „Vorlage für
die eigene Schulung" ist die Wahrheit; „macht dich AI-Act-konform" wäre es nicht.

---

## 4 · Wohin genau — zwei Seiten, zwei verschiedene Bauarten

Der Prüfer steht in beiden Märkten, aber **nicht auf dieselbe Weise**. Das ist der
Punkt, an dem eine Sitzung sonst das Falsche kopiert.

### PWA Toolpoint — eigene Seite an der Wurzel + Eintrag in der Zeitachse

| | |
|---|---|
| Vorbild | `auslieferungspruefer.html` liegt **an der Wurzel**, neben `index.html`, `knotenkarte.html`, `impressum.html`, `datenschutz.html` |
| Der Prüfer im Regal | `assets/config/listings.js`, `anchorId: "eigen-toolpoint-pruefer"`, `own: true`, mit `seit`, `sichttest`, `messung`, `eigenschaften` |
| Was du anlegst | die Seite an der Wurzel (Vorschlag: `ki-schulung.html`) + ihren Eintrag |
| Was mitzieht | `sw.js`: Datei in **`CORE`** eintragen **und** `CACHE_VERSION` erhöhen (steht auf `pwa-toolpoint-v58`) · `node tools/statische-listen.mjs` · `index.html` schreibt der Arbeitsablauf `.github/workflows/statische-liste.yml` nach dem Push auf `listings.js` selbst nach |

### family-projekt.de — Seite unter `werkzeuge/` + Karte in `werkzeuge.html`

| | |
|---|---|
| Vorbild | `werkzeuge/geschenkbox.html`, `werkzeuge/such-werkzeug.html`, `werkzeuge/andock-werkzeug.html`, `werkzeuge/knoten-werkzeug.html` |
| Der Prüfer hier | **nur** als Marktplatz-Eintrag in `assets/config/listings.js` (`anchorId: "markt-auslieferungspruefer"`), der auf `pwa-toolpoint.de` zeigt — es gibt hier **keine** eigene Prüfer-Seite |
| Was du anlegst | `werkzeuge/ki-schulung.html` + eine Karte in `werkzeuge.html` (`<a class="glass area" href="werkzeuge/…">` mit `.ico`, `<h2>`, `<p>`, `<span class="go">`) |
| Was mitzieht | `sw.js` (`family-projekt-v118`) · `sitemap.xml` (die vier Werkzeug-Seiten stehen dort namentlich) · die `?v=`-Anhänge |

⚠ **Die Karten-Liste in `werkzeuge.html` ist von Hand geordnet** — dort ist
„gleich hinter" wörtlich möglich. In `listings.js` von family-project steht der
Prüfer-Eintrag zwischen `pwa-toolpoint.de` und `Kim Hub Company`; auch dort
entscheidet die Datei-Reihenfolge, was der Besucher sieht.

---

## 5 · Sieben Fallen, jede schon einmal bezahlt

**1 · Die Liste in PWA Toolpoint ist eine ZEITACHSE, keine Rangliste.**
`tests/smoke.mjs` verlangt an **jedem** Eintrag ein `seit` im Format `YYYY-MM-DD`
und prüft die Sortierung. Klaus' Wort war *„gleich hinter dem
Auslieferungsprüfer"* — der Prüfer trägt `seit: "2026-08-20"`, eine heute
angelegte Unterlage trüge ein Datum von **jetzt** und landete damit **am Ende**,
nicht daneben. **Das ist ein echter Widerspruch, und er wird nicht stillschweigend
in eine Richtung aufgelöst.** Siehe die offene Frage 1 unten. In family-project
gibt es diese Regel nicht — dort geht „gleich hinter" ohne Umweg.

**2 · Ein eigener Eintrag sagt, ob KLAUS ihn gesehen hat.** Jeder Eintrag mit
`own: true` braucht `sichttest`; erlaubt sind ein Datum, `"vor-der-regel"` oder
`"ausstehend"` — und `"vor-der-regel"` gilt **nicht** für etwas, das es am
2026-08-21 noch nicht gab. Die Regel stammt genau vom Prüfer: er ging damals ins
Regal, **ohne dass Klaus ihn je gesehen hatte**, bei 621/621 grünen Prüfungen, und
sein erster eigener Lauf fand acht Dinge.

> **Daraus folgt die Reihenfolge deiner Arbeit:** erst die Seite bauen, dann
> **Klaus die Adresse im Chat hinlegen**, dann der Eintrag. Wer `"ausstehend"`
> setzt, darf das — dann steht es aber auf der Karte, und ein Wächter besteht
> darauf. Das ist Auskunft, keine Ausrede.

**3 · `eigen-…` holt seine Messwerte aus family-project.** Ein `anchorId`, das mit
`eigen-` beginnt, bezieht die Zahlen aus dessen `forschung/messziele.json`. Wer
hier etwas einträgt, das dort kein Ziel hat, bekommt **dauerhaft** „noch nicht
gemessen". Dann gehört das Ziel dort ergänzt — oder der Eintrag bekommt bewusst
kein `eigen-`-Präfix.

**4 · Stufe 1: kein Preis, kein Prozentsatz.** `tests/smoke.mjs` hat dafür einen
eigenen Wächter (*„kein Preis auf der Seite"*). Eine Schulungs-Unterlage für Firmen
ist genau die Sorte Sache, bei der einem ein „ab 49 €" in die Beschreibung
rutscht. **Gezeigt wird, nicht gehandelt** — alles andere braucht vorher die
Gewerbeanmeldung.

**5 · Die Cache-Nummer wird gegen `origin/main` geprüft, nicht gegen die eigene
Datei.** Zwei Sitzungen haben schon einmal dieselbe Nummer vergeben; für den
Browser ist das **dieselbe** Fassung (NETZWEIT § 3a). Und in PWA Toolpoint gilt
seit #120: **jede** `?v=` trägt die Zahl aus `CACHE_VERSION`, nicht nur die in
`index.html` — beim letzten Bump kam heraus, dass die Seiten mit `?v=47` holten,
während `sw.js` mit `?v=45` ablegte und Impressum und Datenschutz bei `?v=19`
standen. Der Offline-Vorrat hielt damit **keine einzige** Adresse, die eine Seite
anfragt.

**6 · Beide Seiten sprechen seit dem 14.09. Deutsch UND Englisch.** Der
Sprachriegel steht als Zeile im `<head>` und läuft vor dem ersten Anstrich; die
Texte liegen in `assets/i18n-*.js`. Die Unterlage ist **deutsch**. Zwei Wege sind
gangbar, und einer davon ist schon beschlossene Praxis: Impressum und Datenschutz
werden **ausdrücklich nicht** übersetzt, weil eine selbst gemachte englische
Fassung eines Rechtstextes verbindlich aussieht, ohne es zu sein — und die Seite
sagt das und nennt den Weg zum Browser-Übersetzer. **Ein Schulungstext zu einer
EU-Verordnung ist derselbe Fall.** Vorschlag: Deutsch, mit genau diesem Satz
daneben. Offene Frage 3.

**7 · Die neue Seite geht durch den Auslieferungsprüfer, bevor sie online geht.**
Sie stellt sich neben ihn ins Regal — dann soll sie seinen Befund auch aushalten.
**Zwei Funde sind vorhersehbar**, und beide sind harmlos, wenn man sie kennt:
die zwei `<a href>` auf die EU-Seiten (erlaubt: bewusste Nutzer-Aktion, seit dem
23.08. ausdrücklich aus der Fundliste genommen) und der Platzhalter
`placeholder="z. B. Musterfirma GmbH"` — der Prüfer sucht **vergessene Platzhalter
aus der Bauzeit**, und dieser ist ein gewollter. Schreib den Befund ins
Übergabeprotokoll, samt der Begründung, warum nichts davon ein Mangel ist.

---

## 6 · Woran du merkst, dass du fertig bist

- [ ] Die Seite liegt in **beiden** Depots und ist von der jeweiligen Übersicht
      aus erreichbar (`listings.js` bzw. `werkzeuge.html`), **hinter dem Prüfer**
      im Sinne der Antwort auf Frage 1.
- [ ] `sw.js` kennt sie, `CACHE_VERSION` ist erhöht, **gegen `origin/main`
      geprüft**, und alle `?v=` tragen dieselbe Zahl.
- [ ] `sitemap.xml` in family-project nennt sie.
- [ ] **PWA Toolpoint:** `npm test` grün (dazu `npm run drift`), und für jeden
      neuen Wächter steht ein Fall in `tests/gegenprobe.sh`, der wirklich umfällt.
      ⚠ Die Gegenprobe sabotiert den **echten** Baum — vorher festschreiben oder
      in einer Kopie laufen lassen, und **während** eines Laufs nicht committen.
- [ ] **family-project:** `node tests/smoke_all.mjs` **und** die übrigen
      `tests/smoke_*.mjs` einzeln. ⚠ `smoke_all` ruft sie **nicht** auf — genau
      dadurch stand am 16.09. `smoke_cache_version.mjs` rot, ohne dass es jemandem
      auffiel.
- [ ] Beide Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe.
- [ ] Der Auslieferungsprüfer ist über die neue Seite gelaufen, der Befund steht
      im Protokoll.
- [ ] **Klaus hat die Adresse im Chat bekommen** — unaufgefordert, in derselben
      Antwort, in der „fertig" steht.
- [ ] `docs/PULS.md`, Übergabeprotokoll unter `docs/sessions/archiv/`, und
      `sbkim/SIGNAL.json` `seq` +1, wenn du etwas gemeldet hast (Stand: **91**).

---

## 7 · Was du NICHT tust

- **Kein Preis, kein Prozentsatz, kein „jetzt buchen".** Stufe 1.
- **Keine echten Firmendaten** in die Felder — auch nicht als Beispiel. Eine
  ausgefüllte Bescheinigung kommt nie ins Depot.
- **Die Unterlage nicht in der Kopie abwandeln.** Reift sie, wird sie in
  `docs/schulung/` gepflegt und neu kopiert. Zwei Stände sehen gleich aus, bis
  einer falsch ist.
- **Kein Versprechen von Rechtskonformität** — weder auf der Seite noch auf der
  Karte.
- **Den Lösungsschlüssel nicht in den normalen Druck holen.**

---

## 8 · Offene Fragen an Klaus (die erste blockiert nichts, sie entscheidet nur die Reihenfolge)

1. **Wo genau „hinter dem Prüfer"?** In family-project geht es wörtlich. In PWA
   Toolpoint ist die Liste eine **Zeitachse nach Erscheinungsdatum** — dort landet
   etwas Neues am Ende. Soll die Zeitachse gelten (dann steht die Unterlage
   *nach* dem Prüfer, nur nicht neben ihm), oder soll sie für diesen einen
   Eintrag ausgesetzt werden? **Vorschlag: Zeitachse behalten** — sie ist die
   Aussage der Liste, und ein Eintrag, der sich daran vorbeidrängelt, nimmt ihr
   genau die.
2. **Eine Unterlage oder mehrere?** Klaus sprach von *„den Dokumenten oder dem
   Dokument"*. Angekommen ist **eines**. Kommen weitere, gehören sie in denselben
   Ordner und auf dieselbe Seite statt in je eine eigene.
3. **Deutsch allein oder zweisprachig?** Siehe Falle 6; Vorschlag ist Deutsch mit
   dem Hinweis auf den Browser-Übersetzer, wie bei Impressum und Datenschutz.
4. **Wie soll die Seite heißen?** Vorschlag `ki-schulung.html` auf beiden Seiten —
   gleicher Name, zwei Orte, leichter zu merken als zwei Namen.

---

## 9 · Abschluss-Befehl — die Kette reißt nie ab

Am Ende deiner Sitzung:

1. `docs/PULS.md` fortschreiben (Datum · was getan · was offen · was als Nächstes).
   Grenze 3000 Zeilen, **nicht herabsetzen** — bei Überschreiten ins Archiv
   auslagern, nicht kürzen. Stand beim Schreiben dieses Briefes: **2847**.
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`.
3. **„Vorgeschlagene nächste Schritte" direkt in der Chat-Antwort** — 2–4 Punkte,
   je ein Satz Begründung.
4. **Den nächsten Brief vollständig als Codeblock im Chat ausgeben**, damit Klaus
   ihn kopieren kann, ohne eine Datei zu öffnen.
5. Was du gefunden, aber nicht verfolgt hast, gehört in `docs/PFLEGE-LISTE.md` —
   nicht in eine Nebenbei-Reparatur.
