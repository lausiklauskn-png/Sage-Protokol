# Übergabe 2026-11-16 — zwei Proben melden „nicht lauffähig“, Gesamtlauf

**Rolle:** Hauptsitzung. **Zweig:** `ccr-f310ee0b-225ljg`, frisch von `origin/main` (#1192).

## Getan

- `tests/smoke_geraetename_netzweit.mjs`: „nichts geprüft“ → Rückgabewert 3 und `⊘ NACHBAR FEHLT: … —`.
- `tests/smoke_service_worker_parst.mjs`: gefundene Worker werden geparst (kaputt bleibt rot); unter zehn
  gefundenen danach Rückgabewert 3 und `⊘ NACHBAR FEHLT: … —`. Der leere Fall ist nicht mehr grün.
- PFLEGE-LISTE: Vermerk beim Eintrag vom 2026-11-16 (gilt auch für § 12 und § 26).
- PULS: neun Einträge vom 2026-10-15 in `2026-11_puls-auslagerung-40.md`, wortwörtlich.

## Gemessen

- Beide Proben einzeln: Rückgabewert 3. Im Läufer je „nicht lauffähig“. `smoke_laeufer_nachbar` grün.
- Von Hand: Wegwerf-Nachbar mit kaputtem `sw.js` → rot, Rückgabewert 1.
- Gesamtlauf: 140 Proben, 136 grün, 0 rot, 4 nicht lauffähig.
- Higgsfield: Guthaben 3,58; keine Buchung; keine fremde Buchung seit der Vorsitzung.

## Nicht gemessen

- Beide Proben mit allen Nachbar-Klonen; `tests/gegenprobe_geraetename_netzweit.mjs`.
- Klaus' Geräte (keine Seitenänderung in dieser Sitzung).

## Schiefgelaufen

Zu Beginn lief über mehrere Versuche kein Shell-Befehl und keine Higgsfield-Abfrage. Die zwei Proben
wurden geändert, bevor `origin/main` geholt war; der Abgleich wurde danach nachgeholt.

## Offen

Startbrief-Punkte 1 bis 5 und 9 (Klaus), Rest von 6, dazu 7 und 8, unverändert.
Forschungseintrag: Kimhub `forschung/`.
