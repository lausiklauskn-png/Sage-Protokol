# 2026-10-14 · Die Antwort des Relais wird ausgewertet (05b und 23)

**Brief:** `docs/BRIEF_2026-10-15_relais-ok-antwort.md` · **Zweig:** `ccr-5dbc84c3-ojok7i`

## Was getan
1. **INTERFACES zuerst** (§11): `publish` gibt `{id, gesendetAn, antwort}` zurück. `antwort` ist ein Versprechen auf `{id, relais:[{relay, ergebnis, grund}], angenommen, abgelehnt, unbekannt}`.
2. **05b:** liest `["OK", id, bool, grund]` je Relais.
   - Drei Ausgänge: angenommen, abgelehnt mit Grund (höchstens 200 Zeichen), unbekannt.
   - Unbekannt heißt: keine Antwort binnen `okFristMs`, oder die Verbindung brach ab. Unbekannt wird nie als angenommen gezählt.
   - Es zählt nur die erste Antwort je Relais; ein OK zu einer fremden Kennung zählt nicht.
   - `okFristMs` ist 5000 (gewählt, nicht gemessen) und über `configure` einstellbar (100–60000).
3. **23:** `bestaetigungAus` liefert `stand` ja · nein · unbekannt.
   - Die Oberfläche (`imRaum`) zeigt „✓ Du bist im Raum“ nur bei `ja`.
   - Eine Ablehnung nennt Relais und Grund.
   - Ohne Antwort steht „angemeldet, Bestätigung fehlt“.
4. **Sage #1080** gemergt.
5. **Verteilt** mit `node tools/kanon-verteilen.mjs`: erst nachsehen, dann `--schreiben`. Der Herkunfts-Riegel fand nichts. 21 Träger, alle gemergt, auf jedem `main` nachgezählt:
   - Auslieferung-Pruefer #50 · BookLedgerPro #328 · Company-Brain #22 · Jasons-Tresor #185 · Kim-Bell #71
   - Kimboard #149 · Kimseek #90 · Mein-Mixarium #245 · Mein-Rezeptbuch #434 · Mein-Tresor #133
   - Mein-WorkFloh #263 · PWA-Toolpoint #165 · Privat-Brain #101 · SB-KIMTool-Point #183 · Sende-Pruefer #77
   - Tomys-Hub #242 · Workflow-Calculate #19 · Workflow-Needs #16 · Workflow-PDF #108
   - family-project #357 (ASSET_V 150→151) · Muttis-Rezeptbuch #238 (Cache v39→v40)

## Gemessen
- `smoke_relais_ok` gegen ein gestelltes Relais: 48 grün. Drei Lagen: OK true · OK false mit Grund · keine Antwort. Dazu gemischt, fremde Kennung, zweite Antwort, Abbruch, Relais geht nie auf.
- `gegenprobe_relais_ok` in einer Wegwerf-Kopie: 12 gefangen · 0 blind · 0 aus falschem Grund · 0 tote Anker. Darunter die zwei verlangten Fälle: die Auswertung ist entfernt, und eine fehlende Antwort zählt als angenommen.
- Sage `npm test`: 115 Proben, 114 grün · 0 rot · 1 nicht lauffähig (`vorrat_wirkung`, der Kuechenzettel-Klon fehlt), Rückgabe 0.
- Die Proben der Träger nach dem Verteilen:
  - grün, bis auf zwei Fälle.
  - Sende-Prüfer war unter paralleler Last 2 ROT, allein 675 grün · 0 ROT.
  - Workflow-Calculate und Workflow-Needs waren erst rot an CACHE. Nach `tools/cache-stand.mjs`, das der Verteiler nicht ruft, waren es 306 und 281 grün.

## Nicht gemessen
- Echte OK-Antworten von `relay.family-projekt.de`, `relay-intern` und fremden Relais.
- Das Tablet.
- Muttis-Rezeptbuch: dort bewacht keine Probe SBKIM.
- Die vollen Browser-Suiten von Workflow-PDF, family-project und Workflow-Needs.

## Offen / nächster Schritt
- Klaus' Sichttest: erscheint am Tablet „✓ Du bist im Raum“ oder „Bestätigung fehlt“? Was meldet das eigene Relais?
- Der Verteiler sollte `cache-stand.mjs` selbst rufen, wo es das gibt (benannt, nicht gebaut).
- Brief: `docs/BRIEF_2026-10-16_relais-antwort-sichttest.md`.

## Stundennachweis
- 06:40Z bis zum Merge dieses Eintrags, als Obergrenze. Die Zahl steht im Abschlussbrief.
- Beginn ist der Checkout auf den Zweig (06:39:27Z, aufgerundet).
- Pausen sind nicht abgezogen; die Anwesenheit darin ist Klaus' Auskunft.
