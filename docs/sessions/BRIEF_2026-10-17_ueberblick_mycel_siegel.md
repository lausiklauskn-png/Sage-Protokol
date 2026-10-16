# Brief: Überblick „Mit dem Mycel verbinden“ und Siegel (Stand 2026-10-16)

Klaus 2026-10-16: *„einen Brief für die Nachfolgesitzung mit dem Auftrag für das Myzel mit
dem Knotennetz verbinden und dem Siegel eine umfangreiche Erklärung dazu, was es ist, wofür
es da ist, was es beinhaltet, wie geschützt wird … eine Art Handbuch oder besser gesagt
Überblick, aber mit Stichworten, so dass nicht viele Texte gelesen werden müssen … dass es ein
normaler Nutzer versteht … in der Lage sein, es zu bedienen und auch sinnvoll anzuwenden in
eigenen Netzwerken … ein Verweis auf die Papers.“*

## Was es schon gibt (gemessen am 2026-10-16, nicht vermutet)

- `sicherheit.html` an Sages Wurzel: „So funktioniert das Mycel“. Das Siegel öffnet sie über
  den Knopf **„Ausführlich erklärt“** (Modul 16b, `iframe.src = "sicherheit.html"`).
  Abschnitte: Was ist das · Was nützt mir das · Eigenes, abgeschirmtes Netz · Schritt für
  Schritt · Drei Wände · Die eine Regel · Herr über den Knoten · Was bedeutet das Siegel ·
  Wörterbuch.
- **Sie ist veraltet.** Letzte Änderung 2026-10-13 (#1071), also **vor** S1–S5b. Fragen
  unterschreiben, Vektor nachrechnen, Rechenaufwand, Sperrliste, Empfehlen und die
  Netz-Verwaltung (Modul 23b) kommen darin nicht vor (ein einziger Treffer für die Begriffe).
- Sie liegt in **rund 22 Trägern** als Kopie, **kein Kanon, kein Drift-Guard**; Regeln dazu:
  `docs/PFLICHT_MODULE.md` § „Und eine Seite daneben: sicherheit.html“.
- family-project trägt sie zweisprachig (DE/EN über `data-i18n`).
- Fachliche Quellen für den Inhalt: `docs/papers/sicherer-umgang-im-knotennetz.md` (Paper S,
  Fassung 2, im Gegenlesen), `docs/PLAN_MYCEL_SCHICHTEN.md`, `docs/INTERFACES.md` Modul 23,
  das SBKIM-Paper (`docs/papers/sbkim-paper-de.html`, DOI 10.5281/zenodo.22277738).

## Der Auftrag

Ein **Überblick in Stichworten** für normale Nutzer, nicht für Programmierer. Wenig
Fließtext, viele kurze Punkte, Tabellen wo sie helfen. Inhalt:

1. **Was ist das Mycel / das Knotennetz?** Apps finden einander ohne zentralen Dienst; das
   Relais ist eine Poststelle (Paper S 1.1, „Was ohne Server hier heißt“).
2. **Wofür ist es da?** Nutzen und Beispiele (Firma, eigene Geräte, Verein).
3. **Das Fenster „Mit dem Netz verbinden“** (Modul 23-UI): was jeder Knopf tut, was die
   Karten im Raum zeigen (echt · unbestätigt · Namensvetter · passt nicht · nicht
   nachprüfbar · empfohlen · gesperrt), Gerätename.
4. **Das Siegel**: was es bedeutet, was darin ist (Andock-Wizard, eigene Identität und Spore,
   Sicherung und Wiederherstellen, Beschreibung neu signieren, Schutz-Block,
   Empfehlungen/Ablauf), die Lampen-Leiste (lebt · verkehr · fremd).
5. **Wie geschützt wird**, je Schicht ein Stichpunkt in Alltagssprache: Echtheit der Karten,
   Antworten unterschrieben, Fragen unterschrieben (S1), Vektor nachrechnen (S2),
   Rechenaufwand gegen Fluten (S3), Sperrliste (S4), Empfehlen statt Zählen (S5/S5b),
   fremder Text nur als Text, Prüfliste vor dem KI-Richter, Membran und Abschirmung.
6. **Eigenes Netz einrichten und benutzen**: eigenes Relais oder eigene Netz-Marke,
   Netzadmin, Empfehlen, Sperren, was man selbst tun muss.
7. **Woran noch gearbeitet wird / was nicht geht** (ehrlich, aus Paper S § 12): Browser-KI
   liest die Seite, gesperrte Kennung lässt sich ersetzen, Tablet nicht gemessen usw.
8. **Mehr lesen**: Verweise auf Paper S und das SBKIM-Paper für Einzelheiten.

## Vorgehen

0. Startprüfung wie im Sammel-Brief (Sitzungsliste, offene PRs, frisch von `origin/main`).
1. **Klaus zuerst fragen**, bevor gebaut wird:
   - `sicherheit.html` **erweitern** (Empfehlung: eine Quelle, der Knopf im Siegel führt
     schon hin) oder eine **neue** Seite daneben?
   - Deutsch allein oder Deutsch und Englisch?
2. Inhalt **aus dem Code und den Papers belegen**, nicht aus dem Gedächtnis. Jeder
   Knopf- und Lampenname wie er in Modul 23-UI / 16 / 16b / 17 wirklich steht.
3. Stil: Klaus' Vorgaben vom 2026-10-16 — Hervorhebung fett, keine Gedankenstriche als
   Trenner, vollständige Sätze mit Artikeln, „wir“ statt „der Betreiber“, Sichtweisen
   neutral. Skill `menschlich-schreiben`.
4. Probe: die Seite lädt, jeder Verweis zeigt auf etwas, das es gibt, kein fremder Abruf,
   `noindex` bleibt, kein App-Name in der neutralen Vorlage. Gegenprobe dazu.
5. Verteilen in alle Träger, die `iframe.src = "sicherheit.html"` tragen (Liste
   **gefunden**, nicht gepflegt; `PFLICHT_MODULE.md` nennt den Befehl). family-project:
   die zweisprachige Fassung mitziehen.
6. Auf `main` nachzählen, dann PULS, Übergabe, Forschungseintrag in Kimhub.

## Nicht

- Kein Modul-Code ändern (das ist eine Erklär-Aufgabe).
- Die veröffentlichten Papers nicht ändern; Paper S steht im Gegenlesen bei Klaus.
- Nichts behaupten, was nicht gemessen ist; „am Tablet nicht gemessen“ so benennen.

## Der Brief zum Kopieren

```
Du bist eine Hauptsitzung in Sage-Protokol. Auftrag:
docs/sessions/BRIEF_2026-10-17_ueberblick_mycel_siegel.md

Startprüfung: bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh",
Sitzungsliste (list_sessions) und offene PRs ansehen, frisch von origin/main abzweigen.
Pflichtleseliste: CLAUDE.md, docs/PULS.md (ab 2026-10-16), der Brief oben,
docs/PFLICHT_MODULE.md (Abschnitt sicherheit.html), sicherheit.html,
docs/papers/sicherer-umgang-im-knotennetz.md, docs/PLAN_MYCEL_SCHICHTEN.md.
Skills: menschlich-schreiben, status-leiste-siegel, saubere-netz-anmeldung.

Zuerst Klaus die zwei Fragen aus dem Brief stellen (erweitern oder neue Seite; DE oder DE+EN),
dann bauen, prüfen (Probe und Gegenprobe), in alle Träger verteilen, auf main nachzählen.
Am Ende: PULS, Übergabe, Forschungseintrag in Kimhub, Brief für die nächste Sitzung im Chat.
```
