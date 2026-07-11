# BRIEF — Voller Modul-Re-Sync: Kim-Bell + SB-KIMTool-Point (prä-A4 → Kanon)

> Freibrief gilt (Sage CLAUDE.md § Freibrief: selbstständig bauen + eigene PRs
> mergen, wenn getestet/abgegrenzt; im echten Zweifel erst Klaus fragen).
> ACHTUNG: **kein** reiner 01+23-Bump — das erzeugt einen Mischversions-Knoten.
> Diese beiden Repos brauchen einen **vollständigen** Modul-Re-Sync auf den
> aktuellen Sage-Kanon (`src/modules/*`), Datei für Datei, dann Klaus-Sichttest.

## Warum dieser eigene Durchgang (Stand 2026-07-11)

Der netzweite Identitäts-Isolierungs-Rollout (Sage PR #589) ist für **9 von 11
Endknoten** erledigt (byte-1:1 Modul 01 + 23, je eigener PR gemergt). Kim-Bell +
SB-KIMTool-Point wurden **bewusst ausgelassen**, weil:

- Ihr **Modul 01** (`sbkim-storage.js`) ist zwar exaktes Alt-Kanon-Delta
  (sauber updatebar), ABER
- ihr **Modul 23** (`sbkim-rendezvous.js`) liegt **~237–239 Zeilen hinter dem
  Kanon** — es fehlt u.a. die Bau-23.B-Korpus-Kopplung (`prepareCorpus` /
  `ensureAnswerCorpus`) und weitere Härtungen; es ist auf **prä-A4-Baseline**.
- Weitere Module (`sbkim-match.js`=04, `sbkim-spore.js`=02, `sbkim-anastomose.js`=05 …)
  **weichen ebenfalls vom Kanon ab** (Kim-Bell: ~9 von 13 Modulen älter).

Ein 01+23-only-Bump auf Kanon wäre ein 237-Zeilen-Multi-Versions-Sprung bei
Modul 23, während die anderen Module alt bleiben → **Mischversions-Knoten**
(die im PULS-A3-Eintrag benannte Falle). Deshalb: erst der ganze Modul-Satz auf
Kanon, in EINEM abgestimmten Durchgang je Repo.

## Repo-Layout (frisch geprüft 2026-07-11)

- **Kim-Bell** — Module unter `modules/` mit **Alt-Namen** (`sbkim-storage.js`,
  `sbkim-rendezvous.js`, `sbkim-rendezvous-ui.js`, `sbkim-anastomose.js`,
  `sbkim-nostr-relay.js`, `sbkim-match.js`, `sbkim-embedding.js`, `sbkim-spore.js`,
  `sbkim-apoptose.js`, `sbkim-membran.js`, `sbkim-siegel.js`, `sbkim-floating-widget.js`,
  `noble-secp256k1.js`). `assets/rendezvous-init.js`. `noble-secp256k1.js` == Kanon.
- **SB-KIMTool-Point** — Module unter `web/tools/` mit Alt-Namen
  (`sbkim-storage.js`, `sbkim-rendezvous.js`, `sbkim-rendezvous-ui.js`),
  `assets/sbkim-storage-init.js`. `web/tools/sbkim-storage.js` == Alt-Kanon.

**Namens-Mapping Alt→Kanon:** sbkim-storage→01_storage · sbkim-spore→02_spore ·
sbkim-embedding→03_embedding · sbkim-match→04_match · sbkim-anastomose→05_anastomose ·
sbkim-nostr-relay→05b_nostr_relay · sbkim-apoptose→07_apoptose · sbkim-membran→15_membran ·
sbkim-siegel→16_siegel · sbkim-floating-widget→17_floating_widget ·
sbkim-rendezvous→23_rendezvous · sbkim-rendezvous-ui→23_rendezvous_ui.

## Aufgabe (je Repo ein eigener Durchgang + PR)

1. **Fetch frisch** von `origin/main`, Branch `claude/<scope>` von `origin/main` abzweigen.
2. **Modul für Modul** den aktuellen Kanon (`Sage-Protokol/src/modules/<NN>_*.js`)
   in die Alt-Namen-Datei kopieren — **NUR** die Module, die das Repo wirklich
   lädt (index.html / Tool-HTML prüfen, welche `<script src>` es gibt; keine
   ungenutzten Module neu einschleppen). Kern-Verträge nicht brechen
   (PROTOCOL_VERSION/DB_VERSION/PROVIDER_MIN_MATCH unberührt).
3. **Andocker-/Init-Reihenfolge** prüfen (`assets/rendezvous-init.js` bzw.
   `sbkim-storage-init.js`): ruft er `SbkimStorage.init({dbSuffix})` VOR allem
   anderen? Mit der neuen Modul-01-Härtung ist ein nachträglicher Suffix zwar
   fail-soft re-pointbar (bei leerer DB), aber die saubere Reihenfolge bleibt
   Pflicht. Skill `saubere-netz-anmeldung` beachten.
4. **SW-Cache bumpen**, falls das Repo cache-first ist (Kim-Bell/SBK Service-
   Worker prüfen — Cache-Version erhöhen).
5. **Drift-Guard** (falls das Repo einen sha256-Guard hat) auf die neuen Kanon-
   sha256 nachziehen.
6. **Repo-Tests** grün (`npm test` / `node --test` / vorhandene Smokes).
7. Commit (deutsche Nachricht), Push, **Draft-PR** → `main`, dann Freibrief-Merge
   wenn getestet + abgegrenzt + nicht zweifelhaft.
8. **Klaus-Sichttest Pflicht** nach dem Re-Sync (voller Modul-Satz ist tiefer
   Eingriff): jede App EINE eigene stabile nodeId, Handshake „✓ etabliert".

## Akzeptanz

- Kim-Bell + SB-KIMTool-Point tragen den vollständigen aktuellen Modul-Satz
  (inkl. Identitäts-Isolierung Modul 01 Re-Point/`migrateIdentityFrom` + Modul 23
  Migration im Guard), Repo-Tests grün, kein Mischversions-Rest.
- Klaus-Browser-Sichttest grün (eigene stabile ID je App, kein geteilter Topf).

## TABU

Kern-Module-Verträge (02/05/05b) nicht abwandeln — 1:1 aus Kanon kopieren.
`PROVIDER_MIN_MATCH` (0.80)/`PROTOCOL_VERSION`/`DB_VERSION` unberührt · kein PII ·
privater Schlüssel nie ins Repo · Empfangsmodus · SW-Bump wo cache-first ·
Namens-Konvention des Ziel-Repos beibehalten (Alt-Namen bleiben Alt-Namen — nur
der INHALT wird Kanon).

## Pflichtlektüre (VOR dem Bauen, in dieser Reihenfolge)

1. `CLAUDE.md` — § SITZUNGSSTART-PFLICHT (immer frisch von origin/main abzweigen) + § Freibrief.
2. `docs/PULS.md` — oberster Eintrag (2026-07-11 · Identitäts-Isolierung, Rollout-Status 9/11).
3. Dieser Brief.
4. `src/modules/01_storage.js` + `src/modules/23_rendezvous.js` (der aktuelle Kanon).
5. Das Ziel-Repo: welche Module lädt es (index/Tool-HTML), welcher SW, welcher Drift-Guard.

## Abschluss-Befehl (Pflicht am Sitzungsende)

`docs/PULS.md` fortschreiben (Rollout-Status auf 11/11 heben, wenn erledigt) +
`docs/PLAN_SEMANTIK_KRYPTO.md` (A3) nachziehen. Neuen Brief anlegen, falls Rest
offen bleibt; Pflichtlektüre + diesen Abschluss-Befehl darin wiederholen; Brief
als Codeblock im Chat ausgeben (Klaus liest zuerst den Chat).
