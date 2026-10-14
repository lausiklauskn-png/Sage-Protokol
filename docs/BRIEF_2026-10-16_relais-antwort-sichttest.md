# Brief · 2026-10-16 · Die Relais-Antwort am Tablet ansehen

## Pflichtlektüre
`CLAUDE.md` → `docs/PULS.md` (oberster Eintrag) → `docs/INTERFACES.md` §11 (Relais-Antwort) → `docs/sessions/archiv/2026-10-14_relais-antwort.md`.

## Stand
- 05b wertet die `OK`-Antwort je Relais aus (angenommen · abgelehnt mit Grund · unbekannt).
- 23 zeigt „✓ Du bist im Raum“ nur bei mindestens einem `true`.
- Das ist in 21 Trägern seit dem 2026-10-14.
- Gemessen ist das nur gegen ein gestelltes Relais.

## Was zu tun ist
1. **Klaus' Sichttest** (Tablet, Chrome):
   - In einer App „Mit dem Netz verbinden“ tippen, einmal öffentlich und einmal im Firmennetz.
   - Was steht da: „✓ Du bist im Raum“, eine Ablehnung mit Grund oder „angemeldet, Bestätigung fehlt“?
2. Steht „Bestätigung fehlt“: messen, ob das Relais überhaupt `OK` sendet.
   - Ein Skript in Termux (Tablet) sendet eine Testkarte und druckt die Antwortzeile.
   - Erst danach wird über die Frist (5 s, gewählt) entschieden.
3. Benannt, nicht gebaut: `kanon-verteilen` sollte nach dem Schreiben `tools/cache-stand.mjs` rufen, wo es das gibt (Workflow-Calculate, Workflow-Needs).
   - Ohne den Aufruf waren dort die kern-Proben rot.

## Regeln
- Der Netz-Code kommt nie ins Repo und nie in ein Ereignis.
- Kanon-Module bleiben byte-1:1 in den Trägern.
- Proben und Gegenproben laufen in einer Wegwerf-Kopie.
- Ein Befehl nennt immer seine Maschine.

## Abschluss
- PULS-Eintrag, Übergabe unter `docs/sessions/archiv/`, Kimhub-Forschungseintrag mit `arm`.
- Abschlussbrief mit gemessenem Stundennachweis (nur UTC), nächster Brief als Codeblock im Chat.
