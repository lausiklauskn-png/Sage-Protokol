# Übergabeprotokoll 2026-07-29 (tiefe Nacht) — Fix: Identitäts-Churn („database connection is closing")

**Rolle:** Bau-Sitzung (dieselbe Sitzung wie Stufe 0a/0c/0d/0e; Fix-Bau auf Klaus'
ausdrückliches „startet den Fixbau jetzt").
**Branch (netzweit):** `claude/stufe-0a-identitaetskennungen-78ulx5`.
**Berührte Repos (13):** Sage-Protokol + alle 12 Modul-01-Träger.

---

## Wie der Bug gefunden wurde

Klaus begann die 0a-Messung und reproduzierte den Identitätsverlust **live**: Mein-Tresor
wechselte die Kennung (`X0MalwVNjV…` → `11hoBLLRZ7…`), obwohl „Speicher dauerhaft: **ja**"
stand und nichts gelöscht wurde; die **alte** Kennung überlebte Hard-Reloads und stand nach
Reload wieder auf „Platz 1", die neue daneben. Seine Screenshots zeigen die Fehlermeldung:

> ✗ Fehler: (InvalidStateError) Failed to execute 'transaction' on 'IDBDatabase':
> **The database connection is closing.**

Analyse-Rekord `mycelanalyse20260729T191549.json` (19:10–19:15 UTC): Mein-Tresor mit
**drei** lebenden Kennungen gleichzeitig im Raum, Kimboard ×2; Handshakes an alte
Karten-Fächer scheiterten. Wichtig: „Speicher dauerhaft: ja" schützt hiervor **nicht** —
es ist kein Räum-Problem, sondern ein **Parallelzugriffs**-Problem.

## Ursache (im Code belegt)

`src/modules/01_storage.js`: Ist dieselbe App auf derselben Origin in **zwei Fenstern**
offen (bei Klaus: App-Tab + Brett-Fenster), feuert der Browser `onversionchange` →
`db.close()`. Modul 01 cached die Verbindung (`dbPromise`/`currentDb`) und gab die **tote**
Verbindung an `get`/`put`/`del`/`all`/`clear` weiter; `db.transaction()` wirft dann
**synchron** den InvalidStateError. Kaskade:

1. Handshake bricht mit genau diesem Fehler.
2. Ein fehlgeschlagener Identitäts-**Lese**vorgang wird stromaufwärts als „keine Identität"
   gelesen (`23_rendezvous.js` `ensureIdentity`: `catch → existed=false`;
   `02_spore.js` `loadIdentity`: `!stored → null`) → `getOrCreateIdentity` erzeugt eine
   **neue** Kennung. Das alte Fach bleibt liegen → Mehrfach-Fächer; nach Reload gewinnt
   der Default-Slot (alte Kennung „Platz 1").
3. Alte Visitenkarten spuken ~30 Min im Raum nach → Geister-Einträge, tote Handshake-Ziele.

## Fix (Modul 01 — bewusste Kern-Modul-Pflege auf Klaus' ausdrückliches Go)

Das ursprüngliche Stufe-0-TABU („Modul 01 nicht anfassen") war Scope-Disziplin des
0a-Auftrags; der Fix-Bau lief auf Klaus' ausdrückliches „startet den Fixbau jetzt" —
kein stiller Workaround (Tafel-Evolutions-Klausel eingehalten, Entscheid dokumentiert).

- Neuer interner Helfer **`beginTx(storeName, mode)`** mit genau **einem Reopen-Retry**:
  wirft `db.transaction()` den „connection is closing"-Fehler (`isConnectionClosing`),
  werden `dbPromise`/`currentDb` fallengelassen und **einmal** frisch geöffnet —
  `onversionchange` invalidierte die Caches schon immer, der Retry bekommt also die
  frische Verbindung.
- `get`/`put`/`del`/`all`/`clear` laufen durch `beginTx`.
- **Ehrlichkeit:** schlägt auch der Retry fehl → Fehler wird weitergereicht, **nie**
  stilles `undefined` (das war der Churn-Auslöser).
- **Kein** `DB_VERSION`-/Schema-/API-Bump; öffentliche Fläche unverändert; Module 02/23
  unangetastet.

## Beweis

- **Neu:** `tests/smoke_pflege_01_reopen_retry.mjs` **3/3** (fake-indexeddb; sabotiert
  `IDBDatabase.prototype.transaction`): (1) einmaliger „closing" → Selbstheilung, Wert
  kommt; (2) Retry hat gegriffen; (3) dauerhafter „closing" → ehrlicher Reject, nie
  stilles `undefined`.
- **Regress-frei:** `smoke_pflege_01_init_fail_soft` 11/11 · `_repoint_migrate` 21/21 ·
  `_versions_bump_race` 6/6 · `_shared_topf_isolation` 7/7 · `smoke_a14…` 4/4 ·
  `smoke_bau02y` 33/33 · `smoke_bau02_spore_v02` 17/17 · `smoke_bau23_rendezvous` 59/59 ·
  `smoke_bau23c` 16/16 · `smoke_bau23d` 22/22 · `smoke_bundle_connect` 21/21.

## Netzweiter Rollout (13 PRs, alle gemergt)

| Repo | PR | Anmerkung |
|---|---|---|
| Sage-Protokol | #748 | Kanon + sbkim-bundle + neuer Test |
| Mein-Tresor | #78 | 53/53 |
| Kimboard | #56 | 6/6, sha-Pin |
| BookLedgerPro | #284 | CI smoke-test grün |
| family-project | #121 | — |
| Jasons-Tresor | #136 | 59/59 |
| Mein-Rezeptbuch | #350 | `sbkim/`-Kopie, App-Code unberührt |
| Mein-Mixarium | #164 | dito |
| Muttis-Rezeptbuch | #163 | dito |
| Tomys-Hub | #127 | — |
| Kimseek | #46 | 11/11, sha-Pin |
| Company-Brain | #8 | Drift-Guard 8/8; e2e braucht playwright-core (Container-Grenze, vorbestehend) |
| Privat-Brain | #64 | Drift-Guard 15/15; e2e dito |

Kim-Bell + Mein-WorkFloh tragen **kein** Modul 01 → bewusst nicht angefasst.

## Ehrliche Grenzen / offen

- **Browser-Sichttest wartet auf Klaus:** dieselbe App in zwei Fenstern öffnen →
  Handshake ohne Fehler, Kennung bleibt stabil. Geister-Karten verschwinden ~30 Min
  nach dem letzten Anheften von selbst.
- **Aufräum-Weg für schon entstandene Mehrfach-Fächer** (aktive Kennung behalten, alte
  Fächer entfernen) ist **nicht** gebaut — gehört zu **0b** (nach Klaus' Messung), als
  Knopf im Panel, kein Konsolen-Befehl.
- Der Fix verhindert den Churn ab jetzt; er räumt Vergangenes nicht auf.

## Netz-Sync

Sage `sbkim/SIGNAL.json` **seq 48 → 49** (netzweiter Fix gemeldet, Rück-Quittung erbeten).
