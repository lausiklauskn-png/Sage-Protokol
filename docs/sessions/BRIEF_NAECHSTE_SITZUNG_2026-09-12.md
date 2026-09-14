# Brief an die nächste Sitzung — 2026-09-12

**Rolle:** Haupt-Sitzung in Sage-Protokol · **Zweig:** steht im ersten Prompt,
**nicht** hier (bis 2026-08-22 stand in mehreren Repos ein festverdrahteter
Name, und wer ihm folgte, pushte ins Leere).

## Pflichtlektüre, in dieser Reihenfolge

1. `CLAUDE.md`
2. `docs/PULS.md` — steht bei **2.944 von 3.000**, also **56 Zeilen Luft**.
   Das reicht für einen normalen Eintrag, nicht für zwei. Siehe Aufgabe 0.
3. `docs/sessions/archiv/2026-09-11_frist-sprung-und-die-fuenf.md`
   — was zuletzt geschah, was gemessen wurde, was offen blieb
4. `docs/INTERFACES.md` — nur bei Querschnitts-Änderungen

## Stand

**Acht Draft-PRs sind offen und warten auf Klaus.** Keiner ist gemergt.

| Depot | PR | Inhalt |
|---|---|---|
| PWA-Toolpoint | [#106](https://github.com/lausiklauskn-png/PWA-Toolpoint/pull/106) | eigene Frist am Kindprozess · CLS der Startseite 0,062 → 0 |
| Perfect-Skin-Beauty | [#55](https://github.com/lausiklauskn-png/Perfect-Skin-Beauty/pull/55) | Beschreibung nennt das Protokoll |
| Perfect-Skin-Fashion | [#27](https://github.com/lausiklauskn-png/Perfect-Skin-Fashion/pull/27) | dito |
| Alis-Moderaum | [#54](https://github.com/lausiklauskn-png/Alis-Moderaum/pull/54) | dito |
| Mein-Workfloh-Page | [#20](https://github.com/lausiklauskn-png/Mein-Workfloh-Page/pull/20) | dito |
| Tomys-Hub | [#164](https://github.com/lausiklauskn-png/Tomys-Hub/pull/164) | dito |
| Privat-Brain | [#84](https://github.com/lausiklauskn-png/Privat-Brain/pull/84) | dito |
| Sage-Protokol | dieser Zweig | PULS ausgelagert, Protokoll, Brief |

**Proben:** Sage **100/100** · Toolpoint **784 grün, 0 ROT, 0 nicht
abgeschlossen** · Alis 54/54 · Perfect Skin Fashion 64 · Muster Werbetechnik 82
· Perfect Skin Beauty 25 · Private Brain grün · Tomys alle außer zweien
(beide rot **auch auf `origin/main`**, siehe „Was offen ist").

**Klaus' Browser-Sichttest steht für alles davon aus.** Er ist nicht ersetzbar;
solange er fehlt, heißt es „ungeprüft, wartet auf Klaus' Browser-Lauf" — nicht
„fertig".

## Aufgabe 0 — erst nachsehen, dann schreiben

`docs/PULS.md` hat **56 Zeilen Luft**. Ein normaler Eintrag passt; wer mehr
schreibt, **lagert vorher aus** — `docs/sessions/archiv/`, Datei **neu anlegen**,
vorher mit `ls` nachsehen, Name nach dem **Auslagerungs-Datum**. Danach mit
`diff` belegen, dass der ausgelagerte Text byte-gleich ist.

⚠ **Neun Zeilen Luft sind keine Luft.** Am 2026-09-11 stand die Datei nach dem
eigenen Eintrag bei 2.991 — es brauchte einen zweiten Griff. **Nicht kürzen,
nicht die Grenze senken.** Der Pie-Block nie von Hand:
`python3 scripts/update_puls_pie.py`, und nur nach einer `status.json`-Änderung.

## Aufgabe 1 — die sechs Knoten neu signieren lassen (nur Klaus kann das)

Die Beschreibungen sind gebaut und geprüft, aber **die Zahlen im Register bewegen
sich erst, wenn über das SIEGEL neu signiert wird** — im Browser, von Klaus.

**Was die Sitzung tun kann:** ihn darauf ansprechen, die sechs Adressen
hinlegen, und **nach** dem Signieren `status.json` nachziehen und die Zahlen
gegen die alten halten. Bei Mixarium war der Sprung 0.826040 → **0.883142**.

| Knoten | vorher |
|---|---|
| Perfect Skin Beauty | 0.783216 |
| Tomys Hub | 0.786371 |
| Perfect Skin Fashion | 0.79303 |
| Alis Moderaum | 0.793347 |
| Muster Werbetechnik | 0.793613 |
| Private Brain | 0.800773 |

⚠ **Wer die Datei ändert und auf eine steigende Zahl wartet, wartet vergeblich.**
Und: eine Zahl ohne Mitschnitt ist eine Behauptung — was ein Knoten im Raum
ankündigt, entsteht im Browser (`docs/LEHREN.md` § 9).

## Aufgabe 2 — der Rückgabewert bei ⊘ (Klaus entscheidet)

`PWA-Toolpoint/tests/smoke.mjs` wirft den Baum bei einer **nicht
abgeschlossenen** Messung nicht mehr um (Rückgabewert 0 statt 1). Das ist eine
**Abwägung**, keine Tatsache:

| dafür | dagegen |
|---|---|
| der Prüfer war einzeln **jedes Mal** grün — das Rot kam von der Maschine | ein wirklich hängender Prüfer bliebe unbemerkt |
| ein falsches Rot legt die **ganze Gegenprobe** still (sie bricht bei roter Ausgangslage ab) | |

Abgesichert ist es durch die dritte Spalte, die **immer** in der Schlusszeile
steht, auch als Null. **Klaus kann es überstimmen** — dann wird aus `⊘` wieder
ein roter Rückgabewert, und die Zeile bleibt trotzdem richtig beschriftet.

## Aufgabe 3 — `Tomys-Hub/tests/smoke-spore-download.cjs`

Sie ist rot, **auch auf `origin/main`** (gemessen, also nicht von der letzten
Sitzung). Sie wartet auf `[data-ty-spore-tool]`, und **diese Marke gibt es im
ganzen Depot nicht** — `grep` findet null Treffer außerhalb der Probe.

Zwei Möglichkeiten, und welche gilt, ist **nicht untersucht**: die Marke ist
beim Umbau verschwunden (dann fehlt Funktion), oder die Probe hat sie nie
gefunden (dann war sie von Anfang an blind). **Erst die Frage beantworten, dann
bauen** — `Mein-Rezeptbuch/CLAUDE.md` § „Vollbremsung vor der Fehlersuche":
*wann hat es zuletzt funktioniert, und was hat sich seitdem geändert?*

## Aufgabe 4 — die 45 abweichenden Modul-Kopien

Steht seit dem Lauf vom 2026-09-09 offen. Rezept: Skill
`netzweiter-modul-rollout`. ⚠ **Ein Drift-Guard sagt „unverändert", nicht
„aktuell"** — dieselbe Falle ist in einer Woche dreimal zugeschnappt.

## Was du NICHT tust

- **`docs/PULS.md` nicht kürzen** — auslagern.
- **Keine Archiv-Datei überschreiben.** Erst `ls`, dann schreiben, dann `diff`.
- **Keine erfundene Spore ablegen.** Eine Datei, die aussieht wie eine
  Identität, ist schlimmer als keine.
- **Klaus' Impressum und die echten Studio-Daten nicht „aufräumen"** — sie sind
  gewollt und rechtlich nötig.
- **Keine Vorschau statt der echten Adresse ausgeben**, ohne dazuzuschreiben,
  woraus sie gebaut ist und was sie nicht beweist.
- **Keine Lighthouse-Zahl ohne ihre Messbedingung melden.** In diesem Behälter
  sperrt der Ausgangs-Proxy `github.io` und `relay.family-projekt.de`; das kostet
  „Gute Praxis" Punkte und macht zwei Tomys-Proben rot, **ohne dass an der Seite
  etwas wäre**. Nachmessen mit `curl`, nicht annehmen.

## Pflicht am Ende dieser Sitzung

1. `docs/PULS.md` fortschreiben (nach dem Auslagern).
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`.
3. `tests/manual_check.html` prüfen — oder begründet „ungeprüft, weil …".
4. Commit + Push auf den **vorgegebenen** Zweig, ein Commit je Aufgabe.
5. **„Vorgeschlagene nächste Schritte" direkt in der Chat-Antwort** — 2–4 Punkte,
   je ein Satz Begründung. Klaus liest die Chat-Antwort, nicht den Dateibrowser.
6. **Abschlussbrief mit Stundennachweis** (gemessene Spanne erster → letzter
   Commit, und der Satz, was sie NICHT enthält).
7. **Diesen Abschnitt im neuen Brief wiederholen** — die Kette reißt nie ab.
