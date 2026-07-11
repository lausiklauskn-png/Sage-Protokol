# BRIEF — Identitäts-Isolierung: Modul-01-Härtung + Migration (Klaus' Entscheid 2026-07-11)

> Freibrief gilt. **Klaus hat den vollen Fix ausdrücklich gewählt** (AskUserQuestion
> 2026-07-11): „Vollen Fix bauen (Modul 01 + Migration)". Das ist ein **Kern-Modul-
> Umbau** (Modul 01 = Storage-Fundament) — sorgfältig headless beweisen, DANN netzweit.

## Warum (live bewiesen 2026-07-11, Klaus' Browser + Mycel-Karte-Analyse)
Der A3-Guard (PR #585) verhindert nur den **Verlust** der Identität, behebt die
**Kollision NICHT**. Klaus' aufgezeichnete Relais-Ereignisse zeigen das Problem live:
- **Eine Identität von zwei Apps geteilt:** nodeId `2zgB0bIf…` meldet sich als
  „Mixarium Klaus" UND wird von Sage als „Kimboard" gelistet → beide Apps lesen
  **dieselbe** Identität aus dem geteilten `sbkim`-Topf.
- **Identitäts-Wechsel:** Kimboard erscheint mit 3 IDs (`2zgB0…`,`sh1lj…`,`_3Ggw…`).
- **Handshakes abgelehnt:** „Request-Signatur ungültig" (echte, schnelle Ablehnung)
  — der Signier-Schlüssel passt nicht zur angemeldeten Karte, weil die Identität wackelt.
- **Guard-Nebenwirkung:** im Alt-Fall (Identität nur in `sbkim`) BREMST der Guard das
  „Aufräumen", das die Kollision beheben würde. Darum der volle Fix.

## Wurzel (aus dem Code, verifiziert)
Modul 01 `init()` ist **init-once**: ein späterer `init({dbSuffix})` mit abweichendem
Namen wird **abgewiesen** (`InvalidDbSuffixError`, in App-Inits per `catch` verschluckt).
Läuft irgendein `init()` ohne Suffix zuerst (altes gecachtes SW-Bundle, Modul-Reihenfolge),
landet die Identität im geteilten `sbkim`. Modul 02 schreibt ausschließlich über
`SbkimStorage` → folgt blind.

## Geplante Aufgabe (2 Teile, headless-first)

### Teil 1 — Modul-01-Härtung: nachträglicher dbSuffix greift, wenn sicher
`src/modules/01_storage.js` `init({dbSuffix})`: wenn `dbPromise` schon existiert und der
neue `dbSuffix` ABWEICHT, NICHT sofort rejecten, sondern:
- ist die aktuell offene DB **identitäts-LEER** (`sbkim_keys` count 0) → aktuelle
  Verbindung sauber schließen (`closeConnectionAndWait`), `dbPromise=null`, mit dem
  neuen Suffix neu öffnen (sicheres Re-Point, nichts verloren).
- trägt sie schon eine Identität → weiter fail-fast (Migration ist Teil 2, nicht init()).
- **TABU:** `DB_VERSION` unberührt, kein Schema-Bruch. Bestehendes Verhalten (gleicher
  Suffix / kein Suffix) byte-gleich. Sehr sorgfältig testen (Fundament!).

### Teil 2 — Migration: Alt-Identität aus `sbkim` in die eigene Schublade
Neue Fläche (Vorschlag `SbkimStorage.migrateIdentityFrom(oldDbName)` ODER Helfer in
Modul 23): kopiert `sbkim_keys` + `sbkim_spore` + identitäts-Stores aus `sbkim` in die
aktive `sbkim_<suffix>`-DB (nur Schlüssel, die dort noch fehlen — kein Überschreiben).
Danach ist die Identität **isoliert UND behalten**. Aufruf aus `repairAndReconnect`
(Modus B) + optional `ensureIdentity` (Modus A) beim Erst-Start, wenn `sbkim` eine
Identität trägt und `sbkim_<suffix>` leer ist. Raw-IndexedDB-Kopie ODER über Modul 02
`exportBackup`/`importBackup` mit RAM-Passwort (kein PII, kein Secret persistiert).

### Guard anpassen (Folge aus dem Live-Befund)
`repairAndReconnect`: statt im Alt-Fall nur zu SCHÜTZEN → **migrieren, dann geteilten
Topf löschen** (Kollision aufgelöst + Identität behalten). Der reine Schutz bleibt
Fallback, wenn Migration fehlschlägt.

## Akzeptanz
- Headless-Smokes: Modul-01-Re-Point (leer→re-point, mit-Identität→fail-fast, gleicher
  Suffix→idempotent), Migration (kopiert, kein Überschreiben, fail-soft), `repairAndReconnect`
  migriert+räumt. Regress-frei (alle bestehenden 01/02/23-Smokes grün).
- DANN netzweit byte-1:1 (Modul 01 + 23 + ggf. 02-Fläche) in die 10 Endknoten + SW-Bumps
  + Drift-Guards, je eigener PR. **Kim-Bell + SB-KIMTool-Point** brauchen ohnehin vollen
  Re-Sync (pre-A4).
- Klaus' Browser-Sichttest: jede App hat EINE eigene stabile ID, Handshake „✓ etabliert",
  keine geteilte nodeId mehr.

## Sofort-Entlastung für Klaus (ohne neuen Code, heute)
Pro App EINMAL bewusst eine **frische eigene** Identität erzwingen (Notfall-Pfad
`newIdentity:true` — „📌 Nur neu anmelden" bzw. der Notfall-Knopf), danach **hart neu
laden**. Das löst die aktuelle Kollision pro App, bis der volle Fix ausgerollt ist.

## Pflichtlektüre / TABU / Abschluss-Befehl
Wie in `BRIEF_A3_ROLLOUT_UND_IDENTITAETS_MIGRATION.md`. Zusätzlich: Modul 01 ist das
Fundament — jede Änderung headless dreifach absichern, nie ohne grüne 01/02/23-Regression
mergen. Kein PII, privater Schlüssel nie ins Repo. Abschluss: PULS + PLAN + Checkliste-HTML
fortschreiben, neuen Brief, Codeblock im Chat.
