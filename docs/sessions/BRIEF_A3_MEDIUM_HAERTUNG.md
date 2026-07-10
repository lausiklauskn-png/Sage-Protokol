# BRIEF für die nächste Sitzung — A3 Medium-Härtung + Identitäts-Wurzel

> **Stand: 2026-07-10 (Abend).** Freibrief gilt (siehe `CLAUDE.md` § Freibrief:
> selbstständig bauen + eigene PRs mergen, wenn getestet/abgegrenzt/nicht
> zweifelhaft; im echten Zweifel erst Klaus fragen).

## Pflichtlektüre (in dieser Reihenfolge, VOR dem Bauen)

1. `CLAUDE.md` — Verfassung + § SITZUNGSSTART-PFLICHT (**immer von `origin/main`
   frisch abzweigen**, nie auf altem Klon urteilen).
2. `docs/PULS.md` — oberster Eintrag (Meilenstein 10.07.) + A4-Eintrag.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — die Abhak-Liste A1–A10 / B1–B7.
4. `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` § 4 — was jetzt bewiesen ist.
5. Modul-Code der zugewiesenen Scheibe: `src/modules/23_rendezvous.js` +
   `src/modules/23_rendezvous_ui.js` (+ `05_anastomose` / `05b_nostr_relay`
   nur lesen — Kern bleibt unangetastet).

## Was diese Sitzung (10.07.) erreicht hat — Ausgangslage

- **⭐ MEILENSTEIN GESCHLOSSEN:** bidirektionale, server-lose Cross-Knoten-
  Bedeutungs-Suche **live beidseitig** bewiesen (Sage↔Mixarium, eigenes Relais).
- **A4 Teil 1** (Ausschluss-/Negations-Filter, Bau 04.I): „ohne X"/„alkoholfrei"/
  „allergisch gegen X" filtern deterministisch — netzweit auf 10 Knoten.
- **Rendezvous-Härtung + Flying-Widget + Auto-Nachfrage:** „Mit dem Netz
  verbinden" verschiebbar/minimierbar; Raum zeigt pro Knoten-Name nur die
  neueste Karte; „Antworten: an" heftet frische Karte unter der lauschenden ID;
  bei „Visitenkarte veraltet" liest die UI den Raum einmal neu + fragt einmal
  nach. Alles netzweit (10 Knoten), Kern 02/05/05b + 0.80-Riegel unberührt.
- **PR-Status:** alle Sitzungs-PRs gemergt (Sage #578–#582 + je 8–10 App-PRs).
  Keine offenen eigenen PRs.

## Geplante Aufgabe — A3 „Medium härten" + Identitäts-Wurzel

Zwei zusammenhängende Stränge (mit Klaus die Reihenfolge/Umfang abstimmen —
Plan-vor-Code, außer Freibrief für den Umfang):

1. **Identitäts-Wurzel abstellen (Ursache statt Symptom).** Heute ist die
   Identitäts-Flut nur *harmlos* gemacht (Raum zeigt neueste Karte). **Offen:**
   warum erzeugt „🧹 Aufräumen & neu anmelden" überhaupt eine neue Identität?
   - Hypothese aus der Analyse-JSON: die Identität lag mind. einmal in der
     geteilten DB `sbkim` (statt in der Schublade `sbkim_<suffix>`) und wurde
     von `cleanupSharedOrigin()` mitgelöscht → `connectAndAnnounce` erzeugte eine
     neue. **Prüfen:** wohin schreibt `getOrCreateIdentity`/`getOwnLiveSpore`
     tatsächlich, und ist `SbkimStorage.init({dbSuffix})` **vor** jedem
     Identitäts-Lesen aktiv? Ziel: „Aufräumen" behält die stabile Identität
     zuverlässig (neue nur auf ausdrückliches `newIdentity:true`).
2. **Nostr-Brett härten (A3 eigentlich).** Spam-Schutz (Rate-Limit auf
   eingehende Fragen — Modul 11-Keim gibt es schon in Modul 23 `underRateLimit`)
   + Haltbarkeits-/Frische-Garantie der Präsenz-Zettel (Karten-TTL, evtl.
   NIP-09-Löschung alter eigener Karten beim Aufräumen — der Skill
   `saubere-netz-anmeldung` beschreibt (c) best-effort-Löschung).

**Alternativ / parallel möglich** (falls A3 auf Klaus' Entscheid wartet):
- **A4 Teil 2 — KI-Richter B3** (Eignung/Sicherheit): opt-in/BYOK, Unsicheres
  herabstufen/Sicheres hochstufen (Hund-Katze-/Permethrin-Fall). `hybridMatch`
  existiert; hier als Sicherheits-Lens verdrahten.
- **Schnelle Haken ohne Bau (nur Tablet):** A7 (App-Integration Hybrid+Multi-
  Query), A8 („Wählen"-Umschalter), A9 („verwandt · KI"), B1 (Modul-20-Safe-UI).

## Datenverträge / TABU (nicht brechen)

- Kern-Module **02/05/05b bleiben unangetastet** (Modul 23 ist reiner Tool-Code
  über deren öffentliche Flächen).
- `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel) + `PROTOCOL_VERSION` + `DB_VERSION`
  **unberührt**. Kein PII. Empfangsmodus (kein Dauer-Piepser/Pulsation) — ein
  Präsenz-Herzschlag berührt diese Regel und braucht **erst Klaus' Wort**.
- Jede Modul-Änderung **byte-gleich** in `sbkim-bundle` + netzweit in die 10 Knoten
  ausrollen (SW-Cache-Bump wo cache-first: Kimboard/Kimseek/BLP). Drift-Guard grün.

## Akzeptanzkriterien

- Headless-Smoke grün (`smoke_bau23_rendezvous*`), Bundle-Drift grün.
- Bei Identitäts-Fix: nach wiederholtem „Aufräumen" bleibt **eine** stabile
  Identität (in der Analyse-JSON / Mycel-Karte sichtbar).
- Klaus' Browser-Sichttest am Tablet (nicht durch Headless ersetzbar).

## Abschluss-Befehl (Pflicht am Sitzungsende)

`PULS.md` + `PLAN_SEMANTIK_KRYPTO.md` + `checkliste_semantik_krypto.html`
fortschreiben (Haken + Datum), **neuen Brief** anlegen, Pflichtlektüre +
diesen Abschluss-Befehl darin wiederholen (die Kette reißt nie ab), den Brief
als Codeblock im Chat ausgeben, aktualisierte Checkliste-HTML zum Download
anbieten.
