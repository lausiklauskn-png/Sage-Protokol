# Briefing-Vorlage

Kopiere den passenden Block in den ersten Prompt einer neuen Sitzung.
Lasse Klammer-Werte stehen, bis du sie eingetragen hast.

---

## A) Hauptsitzung — Koordination und Integration

```
Du bist eine Hauptsitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md
3. docs/INTERFACES.md
4. docs/ARCHITEKTUR.md (nur, wenn Querschnittsänderungen anstehen)

Deine Aufgabe heute:
<HIER EINFÜGEN — z.B. "Lies PULS, prüfe ob Modul 03-Spec fertig ist und
plane die Bau-Sitzung für Modul 03." oder "Integriere die Ergebnisse
der Spec-Sitzungen 01 und 03 in INTERFACES.md.">

Was du nicht tust:
- Kein Modul-Code, außer du integrierst etwas aus einer Bau-Sitzung.
- Keine Spec-Detailarbeit, das ist Sache der Spec-Sitzungen.

Pflicht am Ende:
- PULS.md aktualisieren.
- Übergabeprotokoll in docs/sessions/archiv/YYYY-MM-DD_<thema>.md.
- Commit + Push auf claude/semantic-agent-network-Y03Vg.
```

---

## B) Spec-Sitzung — eine Komponenten-Karte füllen

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (nur Schnellüberblick)
3. docs/ARCHITEKTUR.md
4. docs/INTERFACES.md
5. docs/components/<NN>_<NAME>.md   ← deine Karte
6. docs/GLOSSAR.md (bei unklaren Begriffen)

Deine Aufgabe:
- Fülle die Komponenten-Karte vollständig aus: Schnittstelle, Datenformate,
  Storage-Stores, Konfigurationswerte, manueller Test, Risiken.
- Spiegle die Schnittstelle in docs/INTERFACES.md.
- Schreibe KEINEN Code in src/.

Modul-Nummer: <NN>
Modul-Name:   <NAME>

Quellen, die du konsultieren darfst:
- /root/.claude/uploads/.../sbkim_integration.md (sofern verfügbar)
- sbkim_paper.pdf (sofern verfügbar)
- relevante andere Komponenten-Karten zur Konsistenzprüfung
  (aber nur Schnittstellen-Bereich, nicht den ganzen Inhalt)

Pflicht am Ende:
- Komponenten-Karte gefüllt
- INTERFACES.md gespiegelt
- PULS.md-Eintrag mit "Spec X gefüllt"
- Übergabeprotokoll
- Commit + Push
```

---

## C) Bau-Sitzung — ein Modul implementieren

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (nur Schnellüberblick)
3. docs/INTERFACES.md
4. docs/components/<NN>_<NAME>.md   ← deine Karte
5. (nur falls relevant) Komponenten-Karte deiner direkten Abhängigkeiten,
   aber NUR Schnittstellen-Abschnitt — nicht ganz lesen.

Deine Aufgabe:
- Implementiere src/modules/<NN>_<NAME>.js exakt nach Schnittstelle aus
  INTERFACES.md und Spec aus der Komponenten-Karte.
- Halte dich strikt an die festgelegten Funktionsnamen und Signaturen.
- Schreibe keinen Code anderer Module.
- Ergänze in tests/manual_check.html mindestens einen Knopf, der die
  Hauptfunktion auslöst und Ausgabe ins Log schreibt.

Modul-Nummer: <NN>
Modul-Name:   <NAME>

Wenn die Spec lückenhaft ist:
- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende und ende
  die Sitzung. Eine Spec-Klärung ist kein Bau-Job.

Pflicht am Ende:
- Modul-Datei in src/modules/<NN>_<NAME>.js
- Knopf in tests/manual_check.html
- Sichttest manuell durchgeführt (Browser geöffnet, geklickt, Ergebnis
  notiert) ODER explizit als "ungeprüft, weil ..." markiert
- Komponenten-Karte: "Code geschrieben"-Zeile mit Datum
- INTERFACES.md: Status auf "entwurf" oder "review"
- PULS.md-Eintrag
- Übergabeprotokoll
- Commit + Push
```

---

## D) Einbau-Sitzung — Modul in Endknoten-PWA übernehmen

```
Du bist eine Einbau-Sitzung. Du arbeitest NICHT in Sage-Protokol, sondern
im externen Repo des Endknotens (Rezeptbuch ODER Mixarium).

Pflichtleseliste (aus Sage-Protokol):
1. CLAUDE.md
2. docs/components/09_einbau_pwa.md
3. die Komponenten-Karte des einzubauenden Moduls
4. die zugehörige src/modules/<NN>.js

Deine Aufgabe:
- Übernimm das Modul in die Endknoten-PWA gemäß Anleitung 09.
- Integriere mit der bestehenden Suchfunktion (smartSearch-Wrapper).
- Setze den Such-Symbol-Selektor für Modul 00.
- Sichttest IN DER ENDKNOTEN-PWA, nicht in Sage-Protokol.

Endknoten: <Rezeptbuch | Mixarium>
Modul:     <NN>

Pflicht am Ende:
- Endknoten-Repo: Commit + Push (auf den dort üblichen Branch)
- Sage-Protokol-Repo: docs/PULS.md-Tabelle "Endknoten" aktualisieren,
  docs/components/09_einbau_pwa.md "Bauzustand"-Tabelle ergänzen
  (eigener Commit + Push)
```

---

## Hinweise zum Briefing-Stil

- **Eine Aufgabe pro Sitzung.** Nicht "Modul 01 und 02 und INTERFACES".
- **Klar absagen, wenn etwas außerhalb des Auftrags fällt** — die Sitzung
  soll dann pausieren und in PULS.md eine Frage hinterlassen.
- **Keine Vermutungen über andere Module.** Wenn die Schnittstelle nicht
  in INTERFACES.md steht, ist sie nicht festgelegt.
