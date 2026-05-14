# WEGWEISER — Einstieg für neue Sitzungen und neue Mitarbeiter

> Wer hier zum ersten Mal landet — Mensch oder Sitzung — folgt diesen
> neun Schritten der Reihe nach. Danach weißt du, wo du bist, was läuft,
> und was sinnvoll ist als nächstes zu tun.

---

## Worum geht es überhaupt?

**SBKIM** ist ein Protokoll, mit dem kleine PWAs sich gegenseitig im
Netz finden — nicht über eine zentrale Liste, sondern über **Bedeutung**.
Eine App, die Kochrezepte kennt, und eine App, die Cocktails kennt,
können einander erkennen, weil ihre Themen-Beschreibungen geometrisch
nah liegen.

**Sage-Protokol** ist nicht das Netz selbst, sondern die **Werkstatt**,
in der die Bausteine entstehen, die später per Copy-Paste in die echten
Apps wandern (zur Zeit: *Rezeptbuch* und *Mixarium*).

Bild: das Mycel im Wald. Einzelne Pilze sind sichtbar, der Boden voller
Hyphen ist unsichtbar — aber er ist das eigentliche Wesen. Sage-Protokol
beschreibt, wie die Hyphen wachsen.

---

## Neun Schritte

- [ ] **1. Diese Datei zu Ende lesen.** Sie ist der Einstieg, sonst nichts.

- [ ] **2. `CLAUDE.md` lesen.** Die Sitzungs-Verfassung. Was eine Sitzung
       tun darf, was nicht, wie sie endet, welche Tonalität gilt.

- [ ] **3. `docs/PULS.md` lesen — aber nur den obersten Eintrag.**
       PULS ist die laufende Tagebuch-Datei. Alte Einträge stehen unten,
       der oberste sagt dir, was die letzte Sitzung getan hat und was
       jetzt sinnvoll wäre. Mehr brauchst du beim Einstieg nicht.

- [ ] **4. `docs/ARCHITEKTUR.md` überfliegen.** Das Gesamtbild und der
       Bau-DAG der dreizehn Module. Wer hängt an wem. Reicht zum
       Verstehen, du musst nichts auswendig können.

- [ ] **5. `docs/INTERFACES.md` lesen.** Die **heiligen Tafeln**. Hier
       stehen die verbindlichen Schnittstellen zwischen den Modulen.
       Wenn eine Funktion hier steht, ist sie verbindlich. Wenn nicht,
       ist sie nicht festgelegt.

- [ ] **6. Deine Rolle klären.** Der Nutzer (Klaus) sagt dir im ersten
       Prompt, welche Rolle du hast:
       - **Hauptsitzung** — koordiniert, integriert, schreibt PULS fort.
       - **Spec-Sitzung** — füllt eine Komponenten-Karte und spiegelt
         die Schnittstelle in INTERFACES.md. **Kein** Code unter `src/`.
       - **Bau-Sitzung** — implementiert ein Modul nach fertiger Spec.
       Im Zweifel **frag**, bevor du loslegst.

- [ ] **7. Genau die eine Komponenten-Karte lesen, an der du arbeitest.**
       Liegt unter `docs/components/<NN>_<name>.md`. Liest nicht alle 13
       — das ist Token-Verschwendung und macht den Blick unscharf.

- [ ] **8. Arbeit machen.** Spec füllen, Code schreiben, Karte
       aktualisieren — was immer dein Auftrag ist. Halte dich an die
       Schnittstellen aus Schritt 5. Wenn du eine Schnittstelle ändern
       musst, **erst INTERFACES.md nachziehen, dann den Code**.

- [ ] **9. Sitzung sauber beenden.** Pflicht-Häkchen vor `END`:
       - `docs/PULS.md` aktualisiert (neuer Eintrag oben: Datum, Rolle,
         getan, offen, nächster sinnvoller Schritt).
       - Übergabeprotokoll unter
         `docs/sessions/archiv/YYYY-MM-DD_<thema>.md` (Vorlage:
         `docs/sessions/BRIEFING_TEMPLATE.md`).
       - Wenn `status.json` angefasst wurde:
         `python3 scripts/update_puls_pie.py` laufen lassen — das
         regeneriert den Mermaid-Pie in PULS.md aus den Daten.
       - Code geändert? Manuell prüfen, dass `tests/manual_check.html`
         im Browser noch lädt — oder begründet als „ungeprüft, weil ..."
         markieren.
       - Stand-Block unten in dieser Datei um eine Zeile ergänzen
         (siehe Format darunter).
       - Commit + Push auf `claude/semantic-agent-network-Y03Vg`. Ein
         Commit pro abgegrenzter Aufgabe, sprechende Message.
       - Draft-PR prüfen, ggf. anlegen.

---

## Mini-Glossar in einfacher Sprache

- **Sitzung** — ein Lauf einer Claude-Instanz. Hat keinen Gedächtnis
  über den Lauf hinaus. PULS.md und Sitzungs-Archiv sind ihr Gedächtnis.
- **Modul** — ein abgegrenzter Baustein des Protokolls (z.B.
  „Storage", „Embedding"). Es gibt zehn aktive + drei Schutz-Backlog-
  Module.
- **Komponenten-Karte** — die Markdown-Datei, in der ein Modul
  spezifiziert wird. Liegt unter `docs/components/`.
- **Spec** — Spezifikation. Beschreibt, **was** ein Modul tut und
  **wie** seine Schnittstelle aussieht. Noch kein Code.
- **Code** — die JS-Datei unter `src/modules/`. Setzt eine fertige
  Spec um. Wird von einer Bau-Sitzung geschrieben, nie von einer
  Spec-Sitzung.
- **Embedding** — die Übersetzung eines Textes in eine Liste von 384
  Zahlen. Ähnlich bedeutender Text → ähnliche Zahlen. Grundlage des
  Findens-durch-Bedeutung.
- **Selbstcheck** — eine Konsolen-Meldung, mit der ein Modul beim
  Laden in der DevTools-Konsole sagt: „Ich bin da, hier sind meine
  Funktionen." Erleichtert das Andocken in der Endknoten-PWA.
- **Endknoten** — eine echte PWA des Betreibers, in die SBKIM
  eingebaut ist (z.B. Rezeptbuch). Sage-Protokol selbst ist **kein**
  Endknoten, sondern die Werkstatt davor.
- **Mycel** — die durchgängige biologische Metapher: das unsichtbare
  Geflecht im Boden, das die einzelnen Pilze verbindet. Steht für das
  Netz der untereinander verbundenen Endknoten.
- **Andocken** — der Vorgang, mit dem ein neues PWA Mitglied wird.
  Schrittweise: Module kopieren, Spore erzeugen, in Geschwisterliste
  einsortieren.
- **PULS.md** — das Tagebuch. Jede Sitzung trägt unten einen Eintrag
  ein. Oberster Eintrag = jüngster.
- **Bau-DAG** — der Abhängigkeits-Graph der Module: wer hängt an wem.
  Visualisiert in `ARCHITEKTUR.md` §0.
- **status.json** — die maschinenlesbare Quelle für den Stand aller
  Module. Wird von der Sage-Page und vom Pie-Skript gelesen.

---

## Stand

Jede Sitzung trägt am Sitzungs-Ende **eine Zeile** unten ein. Format:

```
- YYYY-MM-DD · <Rolle> · <was getan> · NÄCHSTES: <was sinnvoll wäre>
```

Neueste Zeile **unten**. (Anders als PULS.md, wo der neueste Eintrag
oben steht — der Stand-Block hier ist eine Wanderung, kein Stapel.)

- 2026-05-14 · Spec-Sitzung 01+03 · Karten 01 (Storage) und 03 (Embedding) gefüllt, erste Vertrag-Sektionen in INTERFACES.md, status.json auf `spec`, WEGWEISER.md angelegt, manual_check.html mit Stub-Knöpfen ergänzt · NÄCHSTES: Bau-Sitzung Modul 01 oder Modul 03 (parallel möglich; Spec-Sitzung Modul 09 Einbau-PWA bleibt anbietbar).
