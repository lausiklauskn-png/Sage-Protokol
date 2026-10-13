# Übergabe · 2026-10-13 · Firmennetz: Fragen-Marke der Mycel-Karte, Privat-Brain-Siegelprobe

**Brief:** `docs/BRIEF_2026-10-14_firmennetz-sichttest.md`. **Nächster Brief:** `docs/BRIEF_2026-10-14_firmennetz-sichttest-2.md`.

## Getan

| Aufgabe | Ergebnis |
|---|---|
| 1 · Sichttest auswerten | **nicht möglich** — Klaus' Befunde lagen nicht vor. Wandert in den nächsten Brief |
| 2 · Fragen-Marke | mycel-karte #31: die Karte abonniert `sbkim-qry` mit und deutet `content.kind` um (`sbkim-query` → Frage, `sbkim-query-res` → Antwort, sonst verworfen), **vor** dem Mitschnitt. Kopie in Sage nachgezogen |
| 3 · Privat-Brain `e2e-siegel` | Privat-Brain #100: die Probe suchte `pb-*`-Kennungen, der Wizard heißt seit A18 `sbkim-si-*`. Code war richtig. Die drei Pinnwand-Proben laufen wieder |

**Welche Marke gilt:** beide. INTERFACES nennt `sbkim-query`/`-reply` für Modul 05 und `sbkim-qry` mit `kind` im Inhalt für Modul 23. Die Karte musste beide hören; keine Seite war „falsch".

## Regeln, eingehalten

- Kein Netz-Code im Repo oder in einem Ereignis; die Änderung fasst den Firmennetz-Weg nicht an.
- Keine Kanon-Datei berührt.
- Proben und Gegenproben in Wegwerf-Kopien.

## Gemessen

- mycel-karte: `browser_netz` 32 grün · `gegenprobe_netz` 14 gefangen · `gegenprobe_wiedergabe` 40/40 (Anker eindeutig gemacht, er traf seit #30 `netzEmpfang`).
- Sage-Kopie: `smoke_mycelkarte_kopie` 32 grün · `gegenprobe_mycelkarte_kopie` 18 gefangen · 0 blind · 0 tot.
- Privat-Brain: `e2e-siegel` 16 grün, `npm test` Rückgabe 0; Gegenprobe von Hand (ohne Wizard-Zeile 4 rot, ohne Semantik-Block nur dessen Zeile).

## Nicht gemessen

- Das Tablet, Klaus' Firmennetz mit mehreren Apps.
- Echter Modul-23-Fragenverkehr in der Karte (die Probe stellt ihn).
- Das echte interne Relais.

## Offen und benannt

- Workflow PDF: Kopfzeile bei 481 px abgeschnitten, auch auf `main`.
