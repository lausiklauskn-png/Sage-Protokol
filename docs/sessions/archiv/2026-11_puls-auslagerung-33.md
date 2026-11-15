# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-14

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` mit dem Eintrag „Zwei Filme: Schlüssel in die Truhe, Tür als laufender Film“ über der
3000-Zeilen-Grenze gestanden hätte (2999 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-14 · Die Antwort des Relais wird ausgewertet (05b und 23), in alle 21 Träger

**Brief:** [`docs/BRIEF_2026-10-15_relais-ok-antwort.md`](BRIEF_2026-10-15_relais-ok-antwort.md). Übergabe: [`sessions/archiv/2026-10-14_relais-antwort.md`](sessions/archiv/2026-10-14_relais-antwort.md). Nächster Brief: [`docs/BRIEF_2026-10-16_relais-antwort-sichttest.md`](BRIEF_2026-10-16_relais-antwort-sichttest.md).

**Gebaut (#1080, INTERFACES zuerst):**
- 05b liest die `["OK", id, bool, grund]`-Zeile je Relais. Drei Ausgänge: angenommen · abgelehnt mit Grund · keine Antwort binnen Frist. Keine Antwort heißt `unbekannt`, nie angenommen.
- `publish` gibt dafür `antwort` zurück (ein Versprechen); Frist `okFristMs` 5000, gewählt, nicht gemessen.
- 23 zeigt „✓ Du bist im Raum“ nur, wenn mindestens ein Relais `true` geantwortet hat. Eine Ablehnung nennt Relais und Grund; ohne Antwort steht „angemeldet, Bestätigung fehlt“.

**Verteilt** mit `kanon-verteilen --schreiben` (Herkunfts-Riegel ohne Befund) in **21 Träger**, alle gemergt, auf jedem `main` nachgezählt.

**Gemessen:**
- `smoke_relais_ok` 48 grün gegen ein gestelltes Relais.
- `gegenprobe_relais_ok` (Kopie) 12 gefangen · 0 blind · 0 aus falschem Grund · 0 tote Anker, darunter die zwei verlangten Fälle (Auswertung weg · fehlende Antwort zählt als angenommen).
- Sage `npm test` 115 Proben: 114 grün · 0 rot · 1 nicht lauffähig (`vorrat_wirkung`, Kuechenzettel-Klon fehlt).
- Die Proben der Träger sind grün. Sende-Prüfer war unter paralleler Last einmal 2 ROT, allein 675 grün. Workflow-Calculate/-Needs brauchten `tools/cache-stand.mjs`, das der Verteiler nicht ruft.

**Nicht gemessen:** echte OK-Antworten von `relay.family-projekt.de`, `relay-intern` und fremden Relais · das Tablet · Muttis-Rezeptbuch (keine Probe dort bewacht SBKIM).
