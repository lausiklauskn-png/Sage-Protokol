# BRIEF — Saubere Netz-Anmeldung (Identitäts-Hygiene, drei Schritte)

Erstellt 2026-07-08 (Klaus' Auftrag). Bau-Sitzung(en), mehrere Repos.
Die HOW ist bereits mit Klaus festgelegt und als Skill gemergt
(`.claude/skills/saubere-netz-anmeldung/SKILL.md`, PR #553 → main).
Diese Sitzung SETZT die HOW UM, in der festgelegten Reihenfolge 1 → 2 → 3.

```
Du bist eine Bau-Sitzung für die SBKIM-Identitäts-Hygiene ("saubere
Netz-Anmeldung"). Ziel: Apps auf der geteilten GitHub-Pages-Adresse
lausiklauskn-png.github.io dürfen sich nicht mehr eine Identität teilen
(mehrere Apps zeigten dieselbe nodeId auf der Mycel-Karte).

PFLICHTLEKTÜRE (in dieser Reihenfolge, erst lesen, dann bauen):
1. Sage-Protokol CLAUDE.md — Verfassung + Freibrief (§ Freibrief gilt,
   Selbst-Merge netzweit; Grenze: echtes Zweifeln → erst Klaus fragen).
2. Die Skill .claude/skills/saubere-netz-anmeldung/SKILL.md — sie IST die
   festgelegte Reihenfolge (Modus A sanft/automatisch, Modus B Knopf).
3. docs/components/23_rendezvous.md + src/modules/23_rendezvous.js —
   das Werkzeug, das erweitert wird ("🌐 Mit dem Netz verbinden").
4. src/modules/01_storage.js (init/dbSuffix) + 02_spore.js
   (getOrCreateIdentity/loadIdentity/getOwnSpore) — nur die Flächen, die
   Schritt 2 benutzt. Diese Kern-Module werden BENUTZT, nicht umgebaut.

LEITPLANKEN (immer, unberührt):
- Empfangsmodus: Anmelden ist nutzer-ausgelöst, kein Dauer-Piepser,
  init() baut nichts ins offene Netz.
- Kein PII: nur nodeId / Schlüssel / Spore. Nie Klarnamen.
- TABU: PROVIDER_MIN_MATCH (0.80-Andock-Riegel), DB_VERSION,
  PROTOCOL_VERSION NICHT anfassen. Kern-Module 01/02/05/23 nicht umbauen,
  nur über ihre öffentlichen Flächen benutzen.
- Kopieren, nicht klonen: Modul byte-gleich in jede App, Drift-Guard im
  Smoke-Test.

DEINE AUFGABE — drei Schritte in dieser Reihenfolge:

SCHRITT 1 (zuerst, klein, sicher) — SB-KIMTool-Point bekommt einen eigenen
dbSuffix.
- Repo: lausiklauskn-png/SB-KIMTool-Point. Branch wie Session-Vorgabe.
- Befund: web/tools/mycelknoten.html ruft SbkimStorage.init(...) OHNE
  dbSuffix → nutzt die Default-DB "sbkim" → Kollisions-Quelle. (Vor dem
  Fix bestätigen: die Boot-Stelle in mycelknoten.html komplett aufmachen
  und prüfen, ob wirklich kein Suffix gesetzt ist — die 427-KB-Datei
  gezielt greppen, nicht ganz lesen.)
- Fix: SbkimStorage.init({ dbSuffix: "toolpoint" }) VOR Spore/Rendezvous,
  als Erstes. Gleiches Muster wie Mixarium ("mixarium") / Rezeptbuch
  ("rezeptbuch") / BookLedgerPro ("bookledgerpro").
- Rendezvous mit korrektem nodeName der App mounten.
- Verifikation: Boot-Reihenfolge stimmt (Storage-init zuerst); wenn ein
  Headless-Smoke existiert, grün. Draft-PR mit Verifikations-Sektion.

SCHRITT 2 (Bau-Sitzung, Plan-vor-Code) — Werkzeug "Mit dem Netz verbinden"
um die Hygiene erweitern.
- Erweiterung von Modul 23 (NICHT Neubau). Die Hygiene-Schritte kommen VOR
  das bestehende Anmelden. Gleiche Knopf-Familie wie Such-Tool/Pinnwand.
- Modus A (automatisch, bei init, NICHT zerstörend, idempotent):
  dbSuffix-Schublade sicherstellen → loadIdentity → wenn keine, EINMAL
  getOrCreateIdentity. Kein Löschen, kein Auto-Anmelden.
- Modus B (EIN Nutzer-Knopf, zerstörend, bewusst): 
  1) reinigen NUR eigene Origin: indexedDB.deleteDatabase("sbkim"),
     alle Service-Worker unregister(), alle caches.delete(...). Die eigene
     Schublade sbkim_<suffix> NICHT anfassen (außer Nutzer will explizit
     ganz neue Identität).
  2) neue Identität (getOrCreateIdentity) 3) Spore (getOwnSpore)
  4) im Netz anmelden (SbkimRendezvous.connectAndAnnounce)
  5) Hinweis "hart neu laden".
- Bauform: als Modul in jede PWA kopierbar + eigenes kleines Demo-/Vorlage-
  Repo (Muster wie such-tool/: index.html + manifest + sw + Icons + Modul-
  Kopien mit Drift-Guard). Das Werkzeug darf in der App versteckt/in der
  Ecke liegen.
- Headless-Smoke schreiben (Modus A idempotent; Modus B ruft die richtigen
  Reinigungs-/Anmelde-Flächen; fail-soft). Draft-PR.
- PLAN ZUERST kurz an Klaus zeigen (Plan-vor-Code), dann bauen — außer
  Klaus gibt einen Freibrief für diese Aufgabe.

SCHRITT 3 (nach 1+2) — einfache Tablet-Anleitung für Klaus.
- Kein Code. Eine ruhige Schritt-für-Schritt-Anleitung mit BENANNTEN
  KNÖPFEN (keine Konsolen-/Adressleisten-Befehle), wie Klaus in jeder App
  einmal den Reinigen-Knopf (Modus B) drückt, damit jede App frisch ihre
  eigene Identität anlegt und sich sauber anmeldet. Reihenfolge der Apps +
  Hard-Reload je App. Als Chat-Antwort (Klaus liest den Tab).

OPTIONAL/SPÄTER (Präsentation, nicht blockierend): Schwarzes-Loch-Karte in
der Sage-Page ("Browser als schwarzes Loch / Identitäts-Hygiene"). Eigene
Folge-Sitzung.

PFLICHT AM ENDE:
- docs/PULS.md fortschreiben (getan / offen / nächste Schritte).
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_<thema>.md.
- Draft-PR je Repo mit Verifikations-Sektion (auch was NICHT geprüft wurde;
  Browser-Sichttest bleibt "wartet auf Klaus").
- "Vorgeschlagene nächste Schritte"-Block direkt in der Chat-Antwort.
- Freibrief gilt (siehe CLAUDE.md § Freibrief): eigene, getestete,
  abgegrenzte PRs selbst mergen; bei echtem Zweifel erst Klaus fragen.
- Diesen Abschluss-Befehl im Folge-Brief wiederholen (die Kette reißt nie ab).

OFFENE FRAGEN AN KLAUS (nur wenn sie auftauchen):
- Name/Ort des Demo-Repos für das Werkzeug (Vorschlag folgt im Plan).
- Ob Schritt 2 in einer eigenen Sitzung nach Schritt 1 laufen soll.
```

## Akzeptanzkriterien

- **Schritt 1:** SB-KIMTool-Point öffnet `sbkim_toolpoint`, nicht mehr die
  Default-DB `sbkim`; Storage-init läuft als Erstes; PR gemergt.
- **Schritt 2:** Modul 23 kann Modus A (idempotent, nicht zerstörend) und
  Modus B (Nutzer-Knopf: reinigen → Identität → Spore → anmelden → Reload);
  Headless-Smoke grün; Demo-Repo steht; Kern-Module unangetastet.
- **Schritt 3:** einfache Knopf-Anleitung im Chat, keine Konsolen-Befehle.

## Reihenfolge / Abhängigkeiten

1 zuerst (klein, unblockt die Kollision sofort) → 2 (eigene Bau-Sitzung,
Plan-vor-Code) → 3 (setzt 1+2 voraus). Schwarzes-Loch-Karte optional danach.
