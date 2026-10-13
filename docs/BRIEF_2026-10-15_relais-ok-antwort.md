# Brief · 2026-10-15 · Die Antwort des Relais auswerten (05b und 23)

## Pflichtlektüre
`CLAUDE.md` → `docs/PULS.md` (oberster Eintrag) → `docs/INTERFACES.md` §11 → die Komponenten-Karten zu 05b und 23 → `src/modules/05b*.js`, `src/modules/23_rendezvous.js`, `src/modules/23_rendezvous_ui.js`.

## Stand
- Das Firmennetz trägt: zwei Geräte sehen sich (Klaus' Sichttest vom 2026-10-13).
- Gelesen: `05b` wertet in `ws.onmessage` nur `EVENT` aus. Antwortet ein Relais auf eine veröffentlichte Karte mit `["OK", id, false, "grund"]` (abgelehnt), erfährt die App nichts.
- „✓ Du bist im Raum“ steht trotzdem da. Es belegt nur einen offenen Socket.

## Was gebaut werden soll
1. 05b sammelt je veröffentlichtem Ereignis die `OK`-Antwort jedes Relais. Drei Ausgänge:
   - angenommen
   - abgelehnt, samt Grund
   - keine Antwort binnen Frist (= unbekannt, nie „angenommen“)
2. 23 nimmt das auf:
   - „✓ Du bist im Raum“ steht nur, wenn mindestens ein Relais `true` gemeldet hat.
   - Wurde abgelehnt, nennt die Meldung Relais und Grund.
   - Gab es keine Antwort, heißt es „angemeldet, Bestätigung fehlt“.
3. INTERFACES zuerst nachziehen, dann der Code. Die Kanon-Verteilung läuft über `node tools/kanon-verteilen.mjs`; damit ändern sich Pins und Cache-Bump in allen Trägern.

## Akzeptanz
- Proben gegen ein gestelltes Relais in drei Lagen: OK true · OK false mit Grund · gar keine OK-Antwort.
- Gegenprobe-Fälle: die Auswertung wird entfernt, und eine fehlende Antwort zählt als angenommen. Beide Fälle müssen rot werden.
- Bestehende Proben von 23/23-UI bleiben grün.

## Regeln
- Der Netz-Code kommt nie ins Repo und nie in ein Ereignis.
- Ein ungültiger Code fällt nie still ins öffentliche Netz.
- Kanon-Module bleiben byte-1:1 in den Trägern.
- Proben und Gegenproben laufen in einer Wegwerf-Kopie.
- Ein Befehl nennt immer seine Maschine.

## Offene Fragen an Klaus
- Wie lang soll die Frist für eine OK-Antwort sein? Vorschlag: 5 s, gewählt, nicht gemessen.

## Abschluss
PULS, Übergabeprotokoll, Kimhub-Forschungseintrag (arm Pflicht), Abschlussbrief mit Stundennachweis, nächster Brief als Codeblock im Chat.
