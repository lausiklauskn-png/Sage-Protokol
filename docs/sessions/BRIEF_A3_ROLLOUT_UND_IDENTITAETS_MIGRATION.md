# BRIEF — A3-Rollout (Modul 23 netzweit) + optionale Identitäts-Migration

> Stand: 2026-07-11. Freibrief gilt (CLAUDE.md § Freibrief: selbstständig bauen +
> eigene PRs mergen, wenn getestet/abgegrenzt/nicht zweifelhaft; im echten Zweifel
> erst Klaus fragen).

## Pflichtlektüre (in dieser Reihenfolge, VOR dem Bauen)
1. `CLAUDE.md` — Verfassung + § SITZUNGSSTART-PFLICHT (immer frisch von `origin/main`
   abzweigen, nie auf altem Klon urteilen).
2. `docs/PULS.md` — oberster Eintrag (2026-07-11 · A3 Identitäts-Wurzel) + Meilenstein.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A3 (jetzt `[~]`) + der ganze A/B-Stand.
4. `src/modules/23_rendezvous.js` — der neue Guard (`dbHasIdentity`,
   `cleanupSharedOrigin({deleteSharedDb})`, `repairAndReconnect` → `protectedIdentity`).
5. `tests/smoke_bau23c_identity_protect.mjs` — der 16/16-Beweis.

## Was 2026-07-11 erreicht wurde (schon auf `main`)
- **A3 Identitäts-Wurzel behoben (Weg A), Kern 01/02/05 unangetastet.** „🧹 Aufräumen &
  neu anmelden" (Modus B) ist identitäts-schonend: löscht den geteilten Topf `sbkim`
  NUR, wenn die eigene Schublade `sbkim_<suffix>` die Identität schon trägt (read-only
  Probe `dbHasIdentity`); sonst bleibt `sbkim` stehen → kein Identitätsverlust. Im Zweifel
  fail-safe nicht löschen. `newIdentity:true` = volle Reinigung. Rate-Limit (6/min) +
  Karten-TTL/newest-per-name waren schon live.
- **Tests grün + gemergt** (PR #585): `smoke_bau23c` 16/16, Regress-frei (bau23 58,
  bau23_ui 32, bau23b_query 23, bundle-drift 21). `sbkim-bundle/modules/23_rendezvous.js`
  byte-1:1 mitgezogen.

## Geplante Aufgabe — netzweiter byte-1:1-Rollout Modul 23
Das neue `src/modules/23_rendezvous.js` byte-gleich in JEDE Endknoten-PWA ziehen, die
Modul 23 trägt, + SW-Cache-Bump wo cache-first, + Drift-Guard-Hash nachziehen wo aufgezeichnet:

| Repo | Datei | SW-Bump | Drift-Guard |
|---|---|---|---|
| Kim-Bell | `modules/sbkim-rendezvous.js` | `sbkim-sw.js` CACHE_VERSION `kim-bell-v13`→v14 | `test/smoke.test.js` EXPECTED_SHA256 |
| Kimseek | `modules/23_rendezvous.js` | `sbkim-sw.js` `kimseek-v1`→v2 | `test/smoke.test.js` EXPECTED_SHA256 |
| Kimboard | `modules/23_rendezvous.js` | `sw.js` `kimboard-v1`→v2 | `test/smoke.test.js` EXPECTED_SHA256 |
| Mein-Mixarium | `sbkim/23_rendezvous.js` | app-sw prüfen | prüfen |
| Mein-Rezeptbuch | (Pfad prüfen) | prüfen | prüfen |
| family-project | `sbkim/23_rendezvous.js` | `sw.js` prüfen | `tests/` prüfen |
| Tomys-Hub | `sbkim/23_rendezvous.js` | prüfen | prüfen |
| BookLedgerPro · Jasons-Tresor · Mein-Tresor · SB-KIMTool-Point | Pfad je Repo prüfen | prüfen | prüfen |

**Vorgehen je Repo:** frisch von `origin/main` abzweigen → Datei byte-kopieren
(`raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/23_rendezvous.js`
ODER lokal aus Sage) → SW-CACHE_VERSION erhöhen wo cache-first → Drift-Guard-Hash im
Smoke aktualisieren → `npm test`/Smoke grün → commit + PR + selbst-mergen (Freibrief).

## Optionale Vertiefung (eigener, sicherheits-sensibler Durchgang)
- **Migration einer bereits im `sbkim` liegenden Alt-Identität** in die eigene Schublade
  (der Guard verhindert den Verlust, migriert aber nicht) — ODER **Modul-01-Härtung**, die
  einen nachträglichen `dbSuffix` noch greifen lässt, solange nichts geschrieben ist.
  Kern-Modul-Änderung → wipe-riskant über 10 Live-Repos → Klaus' Richtungsentscheid einholen.
- **NIP-09-Retraktion** eigener Alt-Präsenz-Karten (kind:5) beim Aufräumen.

## TABU (nicht brechen)
Kern 02/05/05b **und** 01 unangetastet · `PROVIDER_MIN_MATCH` (0.80) / `PROTOCOL_VERSION` /
`DB_VERSION` unberührt · kein PII · Empfangsmodus · jede Modul-Änderung byte-gleich +
Drift-Guard grün · SW-Cache-Bump wo cache-first.

## Akzeptanzkriterien
Pro Repo: Smoke/Drift grün + SW-Bump. Nach Rollout: alle 10 Endknoten tragen denselben
Modul-23-Byte-Stand wie Sage. Browser-Sichttest (wiederholtes „Aufräumen" behält EINE
Identität) durch Klaus.

## Abschluss-Befehl (Pflicht am Sitzungsende)
`PULS.md` + `PLAN_SEMANTIK_KRYPTO.md` + `docs/checkliste_semantik_krypto.html` fortschreiben
(Haken + Datum), neuen Brief anlegen, Pflichtlektüre + diesen Abschluss-Befehl darin
wiederholen, Brief als Codeblock im Chat ausgeben, aktualisierte Checkliste-HTML zum
Download anbieten.
