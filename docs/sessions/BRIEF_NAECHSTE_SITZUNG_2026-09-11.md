# Brief an die nächste Sitzung — 2026-09-11

**Rolle:** Haupt-Sitzung in Sage-Protokol · **Zweig:** steht im ersten Prompt,
**nicht** hier (bis 2026-08-22 stand in mehreren Repos ein festverdrahteter
Name, und wer ihm folgte, pushte ins Leere).

## Pflichtlektüre, in dieser Reihenfolge

1. `CLAUDE.md`
2. `docs/PULS.md` — ⚠ **steht bei exakt 3000 Zeilen**, siehe Aufgabe 1
3. `docs/sessions/archiv/2026-09-11_transport-stechuhr-auslieferungspruefer.md`
   — was zuletzt geschah, was gemessen wurde, was offen blieb
4. `docs/INTERFACES.md` — nur bei Querschnitts-Änderungen

## Stand

Sechzehn PRs in sechs Depots sind gemergt (2026-09-10 22:39 → 2026-09-11 00:54).
Alle Proben grün: Sage 100/100 · Kimhub 2223 · Toolpoint 772 + 216 ·
mycel-karte 63 + 71 + 7 · kim-hub-company 68 · Kimboard 31.

**Klaus' Browser-Sichttest steht für alles davon aus.** Er ist nicht ersetzbar;
solange er fehlt, heißt es „ungeprüft, wartet auf Klaus' Browser-Lauf" — nicht
„fertig".

## Aufgabe 1 (zuerst) — PULS auslagern, nicht kürzen

`docs/PULS.md` hat **3000 Zeilen**, und das ist die Grenze. Sie wird **nicht
herabgesetzt**. Der nächste Eintrag geht erst, wenn ein alter Block nach
`docs/sessions/archiv/` ausgelagert ist.

⚠ **DIE ARCHIV-DATEI IST NEU ANZULEGEN, NIE ZU ÜBERSCHREIBEN.** Am 2026-09-10 ist
beim Auslagern eine vorhandene Datei mit 228 Zeilen überschrieben worden;
gefangen hat es `git status`, zurückgeholt `git checkout --`. Vor dem Schreiben
mit `ls` nachsehen, und den Namen nach dem **Auslagerungs-Datum** wählen, nicht
nach dem Datum der Einträge.

⚠ **Der Pie-Block wird nie von Hand bearbeitet** — `python3 scripts/update_puls_pie.py`,
und nur nach einer Änderung an `status.json`.

## Aufgabe 2 — `smoke_pruefer.mjs` bekommt eine eigene Frist (PWA-Toolpoint)

`tests/smoke.mjs` startet ihn als Kindprozess **ohne eigene Frist** und meldet
rot, sobald der mit einem Fehler endet. Reicht die Frist unter Last nicht, steht
dort „eigene Probe grün: nein" — **eine Zeile, die nach einem Befund aussieht und
eine Zeitüberschreitung ist.** Gemessen am 2026-09-10, während anderes lief:
derselbe Baum, dreimal `node tests/smoke.mjs` → **737 · 737 · 738**; einzeln
aufgerufen war der Prüfer jedes Mal grün.

⚠ **Die Frist höherzudrehen ist die falsche Abhilfe** (dieselbe Falle wie „länger
warten statt auf die Bedingung warten"). Gebraucht wird eine **eigene Frist am
Kindprozess**, damit eine Zeitüberschreitung als solche dasteht.

⚠ **Und die Reparatur braucht ihre eigene Messung** — sonst ist sie eine
Behauptung. Eine Probe, die die Frist wirklich auslöst, gehört dazu.

## Aufgabe 3 — die fünf Knoten unter 0,80

Private Brain steht bei **0.800773**, vier weitere darunter. Der Hebel ist
gemessen: bei Mixarium hat eine Beschreibung, die **SBKIM, Mycel und Knoten**
nennt, 0.826040 → **0.883142** gebracht.

⚠ **LÄNGE ENTSCHEIDET NICHT.** Kim-Bell kommt mit **82 Zeichen** auf 0.874864,
Muster Werbetechnik mit **421** auf 0.793613. Entscheidend ist, dass vom
Protokoll die Rede ist.

⚠ **UND DER VEKTOR KOMMT NICHT ÜBERALL AUS DER BESCHREIBUNG.** Wo echte Inhalte
vorliegen, rechnet die stille Erst-Anmeldung aus dem **Inhalt**
(`embeddingSource: "content"`). Eine bessere Beschreibung wirkt dort **nur**,
wenn über das **Siegel** neu signiert wird — und das kann nur Klaus, im Browser.
Wer die Datei ändert und auf eine steigende Zahl wartet, wartet vergeblich.

## Aufgabe 4 — der Fall der PWA-Toolpoint-Startseite

In `PWA-Toolpoint/CLAUDE.md` steht für die Startseite **100 · 100 · 100 · CLS 0**
(2026-08-09). Gemessen am 2026-09-08 auf `origin/main`: **99 · 100 · 96 · 100 mit
CLS 0,062**. Die dokumentierte Zahl ist überholt **und die schmeichelhaftere** —
genau die Sorte, die niemand nachprüft. Woran es liegt, ist **nicht** untersucht.

## Was du NICHT tust

- **Keine Vorschau statt der echten Adresse ausgeben**, ohne dazuzuschreiben,
  woraus sie gebaut ist und was sie nicht beweist.
- **`docs/PULS.md` nicht kürzen** — auslagern.
- **Keine erfundene Spore ablegen.** Eine Datei, die aussieht wie eine
  Identität, ist schlimmer als keine.
- **Klaus' Impressum und die echten Studio-Daten nicht „aufräumen"** — sie sind
  gewollt und rechtlich nötig.

## Pflicht am Ende dieser Sitzung

1. `docs/PULS.md` fortschreiben (nach dem Auslagern).
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`.
3. `tests/manual_check.html` prüfen — oder begründet „ungeprüft, weil …".
4. Commit + Push auf den **vorgegebenen** Zweig, ein Commit je Aufgabe.
5. **„Vorgeschlagene nächste Schritte" direkt in der Chat-Antwort** — 2–4 Punkte,
   je ein Satz Begründung. Klaus liest die Chat-Antwort, nicht den Dateibrowser.
6. **Abschlussbrief mit Stundennachweis** (gemessene Spanne erster→letzter
   Commit, und der Satz, was sie NICHT enthält).
7. **Diesen Abschnitt im neuen Brief wiederholen** — die Kette reißt nie ab.
