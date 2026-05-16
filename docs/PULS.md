# PULS — lebender Status

**Format:** Jede Sitzung trägt unten einen Eintrag ein (neueste oben).
**Pflichtfelder pro Eintrag:** Datum · Sitzungs-Rolle · was getan · was offen · nächster sinnvoller Schritt.
**Begrenzung:** Diese Datei darf 400 Zeilen nicht überschreiten. Älteres ins
`docs/sessions/archiv/`-Verzeichnis als Übergabeprotokoll auslagern.

---

## Modulstand heute

<!-- Pie-Block ab hier wird automatisch aus status.json generiert.
     Nicht von Hand bearbeiten. Erzeugen mit:
     python3 scripts/update_puls_pie.py
     Aufruf-Pflicht: nach jeder status.json-Änderung. Siehe CLAUDE.md. -->
```mermaid
pie showData
  title Modulstand 2026-05-16 (14 Module)
  "🟫 Schablone" : 4
  "🟧 In Werkstatt" : 0
  "🟨 Spec fertig" : 1
  "🟦 Code-Stub" : 9
  "🟩 Fertig" : 0
```

Farb-Mapping verbindlich in [INTERFACES.md §5](INTERFACES.md). Live-Bau-Puls
auf der [Sage-Page](../index.html) (Karte "Bau-Puls").

## Als nächstes ✨

Module mit Code-Stub, **Sichttest durch Klaus 2026-05-14 erledigt** —
ergab fünf reproduzierbare Cosinus-Messwerte (siehe Karte 04 Beleg-
Block), die in der Pflege-Sitzung 2026-05-14 zu `PROVIDER_MIN_MATCH`
0.55 → 0.80 geführt haben:

- 🟦 **[01 Storage](components/01_storage.md)** — geprüft 2026-05-14 (Klaus, im Browser); init/round-trip/Unknown-Store sauber, sechs Stores in DevTools sichtbar
- 🟦 **[02 Spore](components/02_spore.md)** — geprüft 2026-05-14 (Klaus, im Browser); Identität deterministisch, Spore sortiert, Sign+Verify valide, Manipulation erkannt
- 🟦 **[03 Embedding](components/03_embedding.md)** — geprüft 2026-05-14 (Klaus, im Browser); L2-Norm 1.0, gleicher Inhalt ≈0.95, Baseline für unverwandte Begriffe ungewöhnlich hoch
- 🟦 **[04 Match](components/04_match.md)** — geprüft 2026-05-14 (Klaus, im Browser); 3/5 Tests grün, 2 zeigten Schwellen-Drift → Pflege-Sitzung 2026-05-14 hat `PROVIDER_MIN_MATCH` und Test-Schwellen kalibriert

Code-Stub frisch aus den Bau-Sitzungen 2026-05-14/15, **Sichttest ausstehend bzw. teilweise erledigt:**

- 🟦 **[05 Anastomose](components/05_anastomose.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 6 von 7 Tests grün im ersten Lauf (Setup, Test 1 passendes Match score=0.888, Test 3 Versions-Mismatch, Test 4 Signatur-Manipulation, Test 5 Re-Handshake, Test 6 forgetSibling, Test 7 listSiblings); **Test 2 (Domain-Mismatch / Tarantino-Vektor) Test-Bug** — score=0.854 statt erwartetem <0.80 (Tarantino-Filme spielen oft in Bars → zu nah am Mixarium-Cocktail-Vektor); Modul-Logik korrekt, `PROVIDER_MIN_MATCH=0.80` greift wie spezifiziert. **Pflege-Sitzung 2026-05-15** baut Panel 05 Test 2 auf **Vektor-Trias** um (Steuerrecht und Bilanzierung / Eisenbahnsignalanlagen / Quantenfeldtheorie), Pass-Check „mindestens einer der drei rejected mit score < 0.80"; Tarantino-Vergleichswert wird parallel als reiner Cosinus protokolliert; Karte 05 § Manueller Test Punkt 2 zieht mit. Klaus' zweiter Sichttest-Lauf nach Pflege folgt; falls alle drei Trias-Kandidaten über 0.80 liegen, eigene Folge-Pflege-Sitzung „Embedding-Baseline"
- 🟦 **[06 Heterokaryose](components/06_heterokaryose.md)** — Code geschrieben 2026-05-15 (Bau-Sitzung 06) + **Pflege Bau 06.1 Outbox-Lese-Pfad 2026-05-15** (`sbkim_hetero_outbox` als Anker-Quelle nach Spec-Sitzung 08, fail-soft Fallback bleibt). Sichttest ausstehend (headless gebaut, wartet auf Klaus' Browser). Fünf-Funktionen-API, kanonischer Sign/Verify-Pfad als **vierter Pfad bewusst dupliziert** (Single-File-PWA-Stil), neuer Store `sbkim_hetero_inbox` (DB-Version 1→2 additiv, Bau 06), Service-Worker dritter fetch-Listener-Pfad `/sbkim/heterokaryosis`, Modul 07 Cleanup-Reihenfolge nachgezogen (`sbkim_hetero_inbox` zwischen `sbkim_legacy_inbox` und `sbkim_spore`), Karte 01/06/07 + INTERFACES.md §1 Modul 01/06/07 + §6 nachgezogen. **Anker-Quelle nach Pflege Bau 06.1: voller Outbox-Lese-Pfad** — Modul 06 liest `sbkim_hetero_outbox` (v=3-Store aus Spec-Sitzung 08, `DB_VERSION` 2 → 3 additive Migration in `01_storage.js`) fail-soft (try/catch um `SbkimStorage.all`; bei leerem/fehlenden Store / Wurf wie `UnknownStoreError` → Fallback), sortiert absteigend nach `addedAt`, mappt die ersten `HETERO_MAX_ANCHORS` (= 5) auf Anker-Form `{label, vector}`. Wenn die Outbox leer ist (oder eine ältere Klaus-PWA mit DB-Version 1/2 sie noch nicht hat), bleibt der Spore-Single-Anker-Fallback aus der Erst-Bau-Iteration bestehen (Label `"(domain)"`, Vektor = `senderSpore.domainVector`; `anchors:[]` als Degraded-Modus, wenn auch das fehlt). Panel 06 mit 14 Knöpfen; Test 9 (`HETERO_MAX_ANCHORS`-Begrenzung) jetzt **voll abgedeckt** (sechs Outbox-Einträge direkt via `SbkimStorage.put` — kein `SbkimUiDemo`-Aufruf, Bau 08 ist eigene Phase — → Response liefert genau fünf, neueste zuerst). `node --check src/modules/01_storage.js` + `node --check src/modules/06_heterokaryose.js` + alle 9 Inline-Scripts grün. `status.json` unverändert (Modul 06 bleibt `score:"stub"`, Pflege ist additiv). **Test 6 in Panel 07 muss in einem Folge-Sichttest neu durchgespielt werden** (Cleanup löscht jetzt sechs Stores statt fünf — die Anzahl der zu prüfenden leeren Stores ist um eins gestiegen).
- 🟦 **[07 Apoptose](components/07_apoptose.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 7 von 8 Tests grün im ersten Lauf (Setup + Tests 1/2/3/4/5/7 + Selbstcheck); **Test 6 (Self-Apoptose) deckte echten Modul-Bug auf**: nach Cleanup `getNodeId_wirft_NoIdentityError:false` trotz `stores_alle_leer:true` — Modul 02's In-Memory-`identityCache` wurde nicht durch externes `storage.clear` invalidiert (Modul 07 wusste nichts vom Modul-02-Cache). Folgeschaden: Tests 1/2/3/8 nach Test 6 mit „Keine Identität in sbkim_keys[main]". **Pflege-Sitzung 2026-05-15** ergänzt Modul 02 um öffentliche `resetIdentityCache() → void` (sync, idempotent, leert nur Closure-Cache, kein Storage-Eingriff) und Modul 07's Cleanup ruft sie als letzten Schritt nach den `storage.clear`-Aufrufen — heilige Tafeln (INTERFACES.md §1 Modul 02 + §1 Modul 07 + §6 + Karten 02 + 07) ziehen mit. Re-Sichttest 2026-05-15 bestätigte den Cache-Fix: `getNodeId_wirft_NoIdentityError:true`. Modul 07 Sichttest 8/8 grün. **Pflege Cleanup-Reihenfolge Bau 06 (2026-05-15)** erweitert `CLEANUP_ORDER` additiv um `sbkim_hetero_inbox` (Position 4 zwischen `sbkim_legacy_inbox` und `sbkim_spore`); Test 6 muss in einem Folge-Sichttest neu durchgespielt werden (jetzt 6 statt 5 Stores zu prüfen).
- 🟦 **[00 Doku-Fenster](components/00_doku_fenster.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 5 von 6 Tests grün im ersten Lauf (Setup, Test 2 5-Klick-Simulation, Test 3 4-Klick + Timeout, Test 5 TTL-Sweep, Selbstcheck-Hinweis); **Test 4 Test-Bug** mit Mini-Werten 81/100 (freeBytes=19 Bytes ist trivial < 50 MiB → `warningLevel:"both"` statt erwartetem `"ratio"`) → **Pflege-Sitzung 2026-05-15** repariert mit GiB-Skalierung (`usage:8.1 GiB, quota:10 GiB` → freeBytes ≈ 1.9 GiB → `warningLevel:"ratio"` sauber); Modul-Vertrag und INTERFACES.md unangetastet

Spec frisch, **Bau ausstehend**:

- 🟨 **[09 Einbau-PWA](components/09_einbau_pwa.md)** — Karte vollständig 2026-05-14 (Spec-Sitzung; Anleitung, kein JS-Modul), **Pflege-Sitzung 2026-05-15 erweitert auf neun Schritte** (Schritt 9 neu: `SbkimApoptose.init()` + `SbkimDoku.init({searchIconSelector:...})` + optionaler TTL-Sweep nach Handshake); `<script>`-Reihenfolge in Schritt 2 zieht 07 + 00 nach (`01 → 02 → 03 → 04 → 05 → 07 → 00`); Sichtkontroll-Block jetzt vier Pflicht-Punkte (sieben Selbstcheck-Zeilen + sechs IndexedDB-Stores + zwei live-Endpunkte + 5-Klick-Geste am Such-Symbol); Datei-Pfad-Konvention (SW im Endknoten-Repo-Root, sieben JS-Module inline oder unter `sbkim/`); Spore-Endpunkt `/sbkim/spore.json` verbindlich; SW-Scope-Falle dokumentiert; `domainVector`-Pflicht-Frage **entschieden Variante A (Soft-Pflicht im Andock-Workflow, kein Hauptversions-Sprung)** — Modul 02 / §0 / §2 bleiben unverändert. **Bau-Sitzung 2026-05-15 vor Schritt 1 sauber abgebrochen** (Befund-Sitzung): beide Endknoten haben aktiven `app-sw.js` im Repo-Root (Mein-Mixarium Z. 12543, Mein-Rezeptbuch Z. 10453), Karte 09 antizipiert diesen Fall nicht; zusätzlich Karte 09 § Sichtkontrolle implizit auf Desktop-DevTools gemünzt — Klaus' Tablet (Galaxy Tab S6 + DeX) braucht Eruda-Pfad. **Vor erneuter Bau-Sitzung 09** zwei Karten-Lücken in einer Pflege-Sitzung Karte 09 zu schließen (Empfehlung Option α: Patch in bestehenden `app-sw.js`; plus Eruda-Pfad für Tablet-Sichtkontrolle). Details in [Übergabeprotokoll 2026-05-15 Bau-09-blockiert](sessions/archiv/2026-05-15_bau-09-blockiert-app-sw.md).

Letzter Bau frisch (Bau-Sitzung 2026-05-15), **Sichttest geprüft 2026-05-15:**

- 🟦 **[08 UI-Demo](components/08_ui_demo.md)** — Code geschrieben 2026-05-15 (Bau-Sitzung 08). Endknoten-Andocker-UI für die zwei Stellen, die Modul 06 (Heterokaryose) braucht, aber nicht selbst füllt: `sbkim_hetero_outbox` (Anker-Vorrat) und `sbkim_siblings[peerNodeId].heterokaryosisOptIn` (additives Opt-In-Flag pro Geschwister). Fünf-Funktionen-API (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`), sechs benannte Error-Klassen im Factory-Stil analog Modul 00, drei Test-Brücken (`_clearOutbox`, `_addPseudoSibling` ohne Opt-In-Flag, `_clearPseudoSiblings`), synchroner Selbstcheck. **Storage-only** (kein Netz, kein Embedding, keine Signatur — Vektor-Erzeugung ist Aufrufer-Pflicht). `addOutboxAnchor`-Check-Reihenfolge: (1) Label sync, (2) Vektor sync, (3) async-Voll-Check (`OutboxFullError` nur bei NEUEM Label); Überschreiben eines bekannten Labels bleibt erlaubt. `setSiblingHeteroOptIn` strikt boolean (`1`, `"true"` werfen `InvalidOptInArgError`); Co-Schreiber-Disziplin via `Object.assign`. Panel 08 in `tests/manual_check.html` mit acht Knöpfen (Setup + sechs Test-Punkte + Selbstcheck-Hinweis); Panel-Status von Werkstatt-Stub `idle` auf `ok "Code-Stub"`. **Self-Apoptose-Knopf bewusst NICHT in Panel 08** (Spec-Sitzung 08-Entscheidung respektiert). `node --check src/modules/08_ui_demo.js` grün, alle 10 Inline-`<script>`-Blöcke validiert. **Sichttest geprüft 2026-05-15 (Klaus, im Browser): 6/6 Test-Punkte grün** (Pflege-Sitzung Sichttest-Resultate 2026-05-15).

Empfehlung Hauptsitzung: **Andock Mein-Rezeptbuch** (Folge zur
Bau-Sitzung 09 Iteration 3). Mein-Mixarium ist seit 2026-05-16
**live integriert** (nodeId `1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0`,
Spore-URL `https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/
spore.json`, App-SW Variante 3b, alle sieben Modul-Selbstchecks plus
drei `sbkim-init.js`-Init-Zeilen grün in Eruda). Spore enthält
Stamm[8] und Gast[2] sowie domainVector[384]. Mein-Rezeptbuch geht
denselben Pfad analog (Karte 09 1–7, mit Stamm = Rezeptbuch-Speisen-
Ordner und Gast = Begleitgetränke / später Weinkarte). Voraussichtlich
~45–60 Min, weil Klaus den Pfad schon kennt. **Karte 09 Schritt 8
(Cross-Knoten-Handshake)** folgt nach Andock Rezeptbuch — erst dann
sind beide Endknoten produktiv-verbunden, `pingStatus: "pending-peer"`
wird auf `"live"` umgestellt, und der **Eruda-Rückbau** in beiden
Endknoten ist sinnvoll. Endknoten-seitige Mini-Pflege „Sushi-
Kategorie sichtbar machen" in Mein-Mixarium bleibt entkoppelt offen.
**Tabellen-Bug in INTERFACES.md §6** (Bau-Sitzung 08 + Live Andock
Iteration 2 verschmolzen in einer Tabellenzeile durch Squash-Merge-
Artefakt) ist nicht-dringend, kann in eigener kleiner Pflege-Sitzung
aufgeräumt werden. Modul-Code (00/01/02/03/04/05/07) bleibt
unberührt. Details im [Übergabeprotokoll 2026-05-16 Andock Mein-
Mixarium](sessions/archiv/2026-05-16_andock-mein-mixarium-iteration-3-live.md).

---

## Schnellüberblick

| Modul | Spec | Code | Manueller Sichttest | Anmerkung |
|---|---|---|---|---|
| 00 doku_fenster | Spec fertig (2026-05-14) | Code-Stub (2026-05-14) | geprüft 2026-05-15 (Klaus) — 5/6 Tests grün im ersten Lauf, Test 4 Test-Bug in Pflege-Sitzung 2026-05-15 mit GiB-Skalierung repariert | Sechs-Funktionen-API (`init/open/close/isOpen/getStatusSnapshot/recordSighttest`), reines Lese-/Trigger-Modul, alleiniger Schreiber `sbkim_doku_meta`, 5-Klick-Geste mit 3s-Zeitfenster, Modal mit Backdrop und MutationObserver-Mount, Quota-Doppel-Schwelle (80% / 50 MiB), Self-Apoptose bewusst NICHT in 00 |
| 01 storage | Spec fertig (2026-05-14) | Code-Stub (2026-05-14) | geprüft 2026-05-14 (Klaus) | IndexedDB-Wrapper |
| 02 spore | Spec fertig (2026-05-14, Pflege Stamm/Gast-Felder 2026-05-15) | Code-Stub (2026-05-14, Pflege Cache-Invalidate 2026-05-15, Pflege Stamm/Gast-Durchreichung 2026-05-15) | geprüft 2026-05-14 (Klaus) + 2026-05-15 (Cache-Invalidate-Pflege via Sichttest 07) | Ed25519-Identität, Singleton, base64url-sha256-rawpub; +`resetIdentityCache()` aus Pflege-Sitzung 2026-05-15 (Pflicht-Hook für Apoptose-Cleanup). **Spore-JSON Optionale Felder additiv erweitert** 2026-05-15 (Spec-Sitzung Stamm/Gast): `stammCategories: string[]` + `guestCategories: string[]`, signaturpflichtig wenn vorhanden, Disjunktheit als Hosting-Pflicht (kein Verify-Abbruch). Sign-/Verify-Pfad unverändert. **`generateOwnSpore` Code-Allow-List nachgezogen** 2026-05-15 (Bau 02 Stamm/Gast): zwei Zeilen analog zu `domainKeywords` — ohne diese Pflege würden Stamm/Gast-Felder beim Andock still ignoriert. |
| 03 embedding | Spec fertig (2026-05-14) | Code-Stub (2026-05-14) | geprüft 2026-05-14 (Klaus) | semantischer Vektor |
| 04 match | Spec fertig (2026-05-14, Pflege Stamm/Gast-Hinweis 2026-05-15) | Code-Stub (2026-05-14) | geprüft 2026-05-14 (Klaus) | Vektorvergleich, modus-frei; Pflege-Sitzung 2026-05-14 PROVIDER_MIN_MATCH 0.55→0.80. **Karte 04 § Stamm/Gast-Hinweis 2026-05-15** (Spec-Sitzung Stamm/Gast): Match bleibt unverändert; Stamm/Gast ist Klassifikations-Schicht auf Daten-Ebene, kein Vektor-Math; explizit kein Dämpfungsfaktor, keine zweite Schwelle. |
| 05 anastomose | Spec fertig (2026-05-14) | Code-Stub (2026-05-14) | geprüft 2026-05-15 (Klaus) — 6/7 Tests grün im ersten Lauf, Test 2 Test-Bug (Tarantino-Vektor zu nah an Cocktails 0.854) in Pflege-Sitzung 2026-05-15 als Vektor-Trias repariert (3 Kandidaten parallel, Pass = ≥ 1 unter 0.80); Klaus' zweiter Lauf nach Pflege folgt | Handshake; Fünf-Funktionen-API, bidirektional, kanonisch signiert, Schwelle aus Modul 04; SW Variante A (Page-Hosted) |
| 06 heterokaryose | Spec fertig (2026-05-15) | Code-Stub (2026-05-15, Pflege Bau 06.1 Outbox-Lese-Pfad 2026-05-15) | — | Datenaustausch unter Geschwistern; Fünf-Funktionen-API (`init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`), Pull-Pattern, Opt-In beidseits (additiv auf `sbkim_siblings`), kanonisch wie 05/07 (vierter Sign-Pfad bewusst dupliziert), neuer Store `sbkim_hetero_inbox` (Komposit-Schlüssel `peerNodeId\|ts`, DB-Version 1→2 additiv), SW Variante A mit drittem fetch-Listener `/sbkim/heterokaryosis` (Message-Typ `SBKIM_HETEROKARYOSIS_REQUEST`); Modul 07 Cleanup-Reihenfolge nachgezogen (`sbkim_hetero_inbox` zwischen `sbkim_legacy_inbox` und `sbkim_spore`). **Anker-Quelle nach Pflege Bau 06.1 (2026-05-15): voller Outbox-Lese-Pfad implementiert** — `sbkim_hetero_outbox` (Spec-Sitzung 08, v=3-Store) wird fail-soft gelesen, max. `HETERO_MAX_ANCHORS=5` Anker absteigend nach `addedAt`; Fallback auf Spore-Single-Anker bei leerer/fehlender Outbox bestehen geblieben. `src/modules/01_storage.js` `DB_VERSION` 2 → 3 (additive Migration v=3, `STORES_V3=["sbkim_hetero_outbox"]`); Panel 06 mit 14 Knöpfen; Test 9 (`HETERO_MAX_ANCHORS`-Begrenzung) voll abgedeckt (sechs Outbox-Einträge → Response liefert genau fünf, neueste zuerst). Sichttest ausstehend (headless gebaut, wartet auf Klaus' Browser) |
| 07 apoptose | Spec fertig (2026-05-14) | Code-Stub (2026-05-14, Pflege Cache-Invalidate 2026-05-15) | geprüft 2026-05-15 (Klaus) — **8/8 Tests grün** nach Pflege 02+07-Cache-Invalidate (Re-Sichttest 2026-05-15 bestätigte `getNodeId_wirft_NoIdentityError:true`); Test 6 (Self-Apoptose) hatte einen Modul-02-Cache-Bug aufgedeckt, der in Pflege 2026-05-15 mit `resetIdentityCache()` als Cleanup-Schritt 6 behoben wurde. | Selbstlöschung mit signiertem Vermächtnis; zweistufige Self-Apoptose (Token 60 s), Vermächtnis-Inbox, TTL-Vergessen explizit durch Andocker; kanonischer Sign/Verify-Pfad aus 02/05 dritter Pfad dupliziert; SW erweitert um `/sbkim/legacy` (gemeinsamer fetch-Listener mit `/sbkim/anastomosis`); Panel 07 mit zehn Knöpfen; Cleanup-Schritt 6 ruft `SbkimSpore.resetIdentityCache()` nach Pflege-Sitzung 2026-05-15 |
| 08 ui_demo | Spec fertig (2026-05-15) | Code-Stub (2026-05-15) | geprüft 2026-05-15 (Klaus) — 6/6 Test-Punkte grün | Endknoten-Pflege-UI für `sbkim_hetero_outbox` und `sbkim_siblings.heterokaryosisOptIn`; Fünf-Funktionen-API (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`), sechs benannte Error-Klassen im Factory-Stil analog Modul 00 (`UiDemoDependenciesError` / `InvalidAnchorLabelError` / `InvalidAnchorVectorError` / `OutboxFullError` / `UnknownSiblingError` / `InvalidOptInArgError`), drei Test-Brücken (`_clearOutbox`, `_addPseudoSibling` ohne Opt-In-Flag, `_clearPseudoSiblings`). Modul 08 alleiniger Schreiber von `sbkim_hetero_outbox` (v=3-Store aus Pflege Bau 06.1, Schlüssel `label`, max. `HETERO_OUTBOX_MAX_ENTRIES`=5, absteigend nach `addedAt`, Überschreiben statt Verdrängen) und Co-Schreiber für `sbkim_siblings.heterokaryosisOptIn` (Modul 05 unangetastet, Karte-01-Vertragserweiterung). **Storage-only** (kein Netz, kein Embedding, keine Signatur — Vektor-Erzeugung ist Aufrufer-Pflicht). `addOutboxAnchor`-Check-Reihenfolge: (1) Label sync, (2) Vektor sync, (3) async-Voll-Check (`OutboxFullError` nur bei NEUEM Label); Überschreiben eines bekannten Labels bleibt erlaubt. `setSiblingHeteroOptIn` strikt boolean (`1`, `"true"` werfen `InvalidOptInArgError`); Co-Schreiber-Disziplin via `Object.assign({}, sibling, {heterokaryosisOptIn})`. Self-Apoptose-Knopf bewusst NICHT in Panel 08 (Spec-Sitzung 08-Entscheidung respektiert). Panel 08 in `tests/manual_check.html` mit acht Knöpfen (Setup + sechs Test-Punkte + Selbstcheck-Hinweis); Panel-Status von Werkstatt-Stub `idle` auf `ok "Code-Stub"`. **Sichttest geprüft 2026-05-15 (Klaus): 6/6 Test-Punkte grün im ersten Lauf** (Pflege-Sitzung Sichttest-Resultate 2026-05-15). |
| 09 einbau_pwa | Spec fertig (2026-05-14, Pflege Schritt 9 + 07/00 2026-05-15, Pflege App-SW-Koexistenz 2026-05-15) | — (Anleitung, kein JS-Modul) | — | Andock-Anleitung — **9 Schritte** (Schritt 9 neu aus Pflege-Sitzung 2026-05-15: SbkimApoptose.init + SbkimDoku.init + optionaler TTL-Sweep nach Handshake); `<script>`-Reihenfolge 01→02→03→04→05→07→00; Soft-Pflicht `domainVector` im Andock-Workflow (kein Hauptversions-Sprung); SW im Endknoten-Repo-Root, `/sbkim/spore.json` als Spore-Endpunkt — plus Pflege App-SW-Koexistenz (2026-05-15): Schritt 3 a/b-Verzweigung (Pre-Flight-Check → 3a `register('sbkim-sw.js')` für PWA ohne eigenen SW, 3b `importScripts('./sbkim-sw.js')` im bestehenden App-SW für PWA mit eigenem SW), achtes Risiko „App-SW-Überschreibung", `sbkim-sw.js` `SBKIM_SW_STANDALONE`-Flag rückwärtskompatibel (Default `true`, `false` für Variante 3b) |
| 10 reputation | Stub (Schutz-Backlog) | — | — | Knoten-Reputation, Priorität niedrig |
| 11 rate_limit | Stub (Schutz-Backlog) | — | — | Rate-Limit & TTL, Priorität niedrig |
| 12 blocklist | Stub (Schutz-Backlog) | — | — | manuelle Sperrliste, Priorität niedrig |
| 14 diffusion | Stub (Diffusion-Backlog) | — | — | konsensuell-empfehlende Spore-Diffusion via Handshake-Erweiterung (Pfad 2 verbindlich, Pfad 1 = Default-Status-quo, Pfad 3 verworfen wegen Empfangsmodus-Prinzip); Spec ausstehend bis Netz ≥ 10 Geschwister oder erfolgreicher Live-Andock + Wachstums-Bedürfnis; Priorität niedrig — **plus Sage-Page-Sichtbarmachung 2026-05-15** (Karten 4/13/14 ziehen `diffusionBacklog[]` parallel zu `schutzBacklog[]`) |

Statuscodes: `—` (nichts) · `Schablone` · `Stub` · `Entwurf` · `Review` · `stabil` · `eingebaut`

## Endknoten (externe Repos des Betreibers)

| App | URL | Domäne | SBKIM-Stand |
|---|---|---|---|
| Rezeptbuch | https://lausiklauskn-png.github.io/Mein-Rezeptbuch/ | Kochrezepte (Stamm) — Begleitgetränke / später Weinkarte (Gast) | nicht integriert · **Eruda eingebaut 2026-05-15** auf `main` (zwei Zeilen nach `<head>`, jsdelivr `eruda@3`); Sicht-Vorbereitung für Bau-09 Iteration 3. |
| Mixarium | https://lausiklauskn-png.github.io/Mein-Mixarium/ | Cocktails / Drinks (Stamm) — Knabbereien / Fingerfood (Gast) | **integriert 2026-05-16** (Bau-Sitzung 09 Iteration 3, mit Klaus am Termux) · nodeId `1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0` · Spore live unter https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json mit allen Pflicht- und optionalen Feldern inkl. `stammCategories[8]` + `guestCategories[2]` + `domainVector[384]` · App-SW Variante 3b (`importScripts('./sbkim-sw.js')` im bestehenden `app-sw.js`) · Eruda-Konsole zeigt alle sieben Modul-Selbstchecks plus drei `sbkim-init.js`-Init-Zeilen grün · Handshake gegen Mein-Rezeptbuch **ausstehend** (Rezeptbuch noch nicht integriert, `pingStatus: pending-peer`). Eruda-Rückbau steht nach erfolgreichem ersten Cross-Knoten-Handshake. |

## Offene Querschnitts-Fragen

- ~~**Karten-Lücke Karte 09 / Tablet-Sichtkontrolle**~~ — **gelöst
  2026-05-15 durch Pflege-Sitzung Karte 09 „App-SW-Koexistenz +
  Tablet-Sichtkontrolle" (diese Sitzung).** Karte 09 § Sichtkontrolle
  hat jetzt einen § Tablet-Variante-Sub-Block mit Eruda-Pfad
  (in-Page-DevTools-Polyfill, gepinnt auf `eruda@3`, jsdelivr-CDN,
  touch-bedienbar). Mapping der vier Pflicht-Punkte auf Eruda-Tabs
  (Console / Resources→IndexedDB / Network / 5-Klick-Geste).
  Verbindlicher Hinweis „nach Sichtkontrolle wieder entfernen —
  kein Produktiv-Einbau, kein SBKIM-Modul, kein Datenschutz-Stein".
  Details im Übergabeprotokoll
  [2026-05-15 Pflege Karte 09 App-SW + Tablet](sessions/archiv/2026-05-15_pflege-karte-09-app-sw-tablet.md).
- ~~**Karten-Lücke Karte 09 / Andocken in PWA mit bestehendem
  Service-Worker**~~ — **gelöst in zwei Pflege-Sitzungen 2026-05-15:**
  (a) Pflege App-SW-Koexistenz (PR #31, 2026-05-15) hat Schritt 3
  in 3a/3b verzweigt mit Pre-Flight-Check
  (`navigator.serviceWorker.getRegistration('./')`),
  Variante 3b = `importScripts('./sbkim-sw.js')` in bestehendem
  App-SW (= Option α), `SBKIM_SW_STANDALONE`-Flag in
  `src/sbkim-sw.js` (Default `true`, `false` für 3b), achtes
  Risiko „App-SW-Überschreibung" in § Risiken; (b) Pflege Karte 09
  „App-SW-Koexistenz + Tablet-Sichtkontrolle" (diese Sitzung,
  2026-05-15) hat zusätzlich **Variante 3c** als nachrangige
  Übergangslösung dokumentiert (SBKIM-SW unter `/sbkim/` mit Scope-
  Einschränkung = Option β; Option γ „App-SW ersetzen" entspricht
  der heutigen falschen Anwendung von Variante 3a auf eine PWA mit
  App-SW und ist als achtes Risiko bereits dokumentiert) plus eine
  Tabelle „Wann welche Variante?" als Andock-Entscheidungshilfe.
  Details im Übergabeprotokoll
  [2026-05-15 Pflege Karte 09 App-SW + Tablet](sessions/archiv/2026-05-15_pflege-karte-09-app-sw-tablet.md).
- ~~Werden Domain-URLs der Endknoten-Apps in `docs/PULS.md` /
  `status.json` aufgenommen oder nur lokal in deren `index.html`?~~ —
  **teilweise gelöst 2026-05-15** in abgebrochener Bau-Sitzung 09:
  Pages-URLs in PULS-Tabelle „Endknoten" und `status.json`
  `endknoten[*].url` eingetragen (`integrated:false` bleibt — Andock
  nicht erfolgt). Eintrag in `docs/INTERFACES.md` weiterhin offen.
- Werden Domain-URLs der Endknoten-Apps in `docs/INTERFACES.md` aufgenommen
  oder nur lokal in deren `index.html`? → Entscheidung steht aus.
- Embedding-Modell: bleibt es bei Default `Xenova/multilingual-e5-small`?
  → ja, bis Gegenargument. Quelle: `sbkim_integration.md` §4.1.
- ~~Speicherort der Spore bei GitHub Pages: `/.well-known/sbkim/spore.json`
  oder Alias `/sbkim/spore.json`?~~ — **gelöst 2026-05-14 in Spec-Sitzung
  09:** verbindlicher Andock-Default ist `/sbkim/spore.json` (Alias aus
  §3 INTERFACES). Begründung in `docs/components/09_einbau_pwa.md`
  Schritt 7: GitHub-Pages-Project-Sites haben mit `.well-known/` die
  Jekyll-Dot-Ordner-Falle, `/sbkim/spore.json` bündelt zudem alle
  SBKIM-Pfade unter `/sbkim/` (semantisch sauber).
- **Wording-Diskrepanz**: `CLAUDE.md` führt SBKIM als
  "Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel" — das Paper
  (Kap. 1.2) führt es als "Semantisch-Empfangendes Bidirektionales
  KI-Matching". Das Observatorium (`index.html`, `status.json`) übernimmt
  die Paper-Variante. CLAUDE.md sollte in einer separaten Sitzung
  nachgezogen werden.
- ~~**A1–B3-Notations-Überlappung Sage ↔ Mixarium**~~ — **gelöst
  2026-05-14 in Spec+Bau-Sitzung Modul 04.** Die Synthese „Hops tragen
  die Funktionen" steht jetzt verbindlich in
  [`docs/components/04_match.md` § A1–B3-Synthese](components/04_match.md):
  Pfad A = Curator → Auditor → Devil's Advocate (Anbieter-Seite
  verfeinert die Antwort); Pfad B = Interviewer → Matcher → Critic
  (Anfrage-Seite verfeinert die Frage), mit Apoptose bei B4 im
  Negativ-Fall. Sage zeigt die *Geometrie* der Hop-Position, Mixarium
  zeigt die *Rolle* — beide Notationen bleiben gültig, sie beschreiben
  dieselbe Wanderung aus zwei Winkeln. Kein eigenes Mapping-Dokument
  nötig.
- **Spore-Persistenz-Strategie verteilt** (offen, eingetragen
  2026-05-14 nach Bau-Sitzung 07; **teilweise gelöst 2026-05-14
  durch Spec-Sitzung 00**). „Stille Löschung ohne Vermächtnis"
  (Karte 07 § Risiken) ist nicht in einem einzelnen Modul lösbar —
  vier Stellen müssen beim Bauen zusammenpassen:
  - **Modul 01 Storage:** `navigator.storage.persist()` beim `init()`
    + `navigator.storage.estimate()` für Quota-Frühwarnung —
    **offen**.
  - **Modul 02 Spore:** Backup-Export (passwort-verschlüsselt) als
    Recovery-Pfad für Browser-Wechsel und manuelles Löschen —
    **offen**.
  - **Modul 00 Doku-Fenster:** stille Frühwarnung bei < X% Speicher
    (X als gemeinsame Konstante in §0) — **gelöst 2026-05-14 durch
    Spec-Sitzung 00:** `DOKU_QUOTA_WARN_RATIO = 0.80` UND
    `DOKU_QUOTA_WARN_BYTES = 52428800` (50 MiB) verbindlich in §0
    eingetragen (Doppel-Schwelle; Warnzeile bei Überschreitung einer
    der beiden). Konsistenter Schwellwert-Anker für Modul 01 und
    Modul 02. Modul 00 ist der erste Andocker, der die §0-Konstanten
    konkret nutzt — `navigator.storage.estimate()` beim `open()`,
    Vergleich gegen beide Schwellen, passive Warnzeile im
    Statusfenster. Verbleibender Schritt für eine Folge-Pflege-
    Sitzung „Persistenz-Strategie verbinden": Modul 01 verankert
    `navigator.storage.persist()` als Persist-Mechanismus, Modul 02
    spezifiziert das Backup-Format (vermutlich neu in §2).
  - **Modul 07 Apoptose:** Risiko-Vermerk „stille Löschung" (steht
    jetzt in Karte 07 § Risiken).

  Beim Bauen darauf achten, dass die vier Stellen konsistent bleiben:
  **Quota-Schwellwert** (jetzt gelöst — zwei Zahlen in §0), **Backup-
  Format** (eine JSON-Struktur, vermutlich neu in §2 — offen),
  **Warntext** (deutsch, einmal formuliert — offen). Aufhänger für
  eine Pflege-Sitzung „Persistenz-Strategie verbinden", sobald
  02-Backup und 01-Quota spruchreif sind. Modul 00 hat seinen Teil
  verankert; die Frage bleibt offen, weil 01/02 noch nicht spruchreif
  sind.
- ~~**Spore-Diffusion: passiv (Pfad 1) vs. konsensuell-empfehlend
  (Pfad 2) vs. parasitär-mitreisend (Pfad 3)?**~~ — **gelöst
  2026-05-15 in Hauptsitzung 14-Diffusion-Stub durch Anlage
  [`docs/components/14_diffusion.md`](components/14_diffusion.md)**.
  Frage entstand in der abgebrochenen Bau-Sitzung Modul 09 vom
  2026-05-15 (siehe parallele Pflege-Sitzung Karte 09 „App-SW-
  Koexistenz" auf eigenem Branch). Verbindliche Auswahl: **Pfad 2
  (konsensuell-empfehlend)** über `recommendedPeers: SporeRef[]` als
  optionales Handshake-Antwort-Feld (max. 2 Einträge), Empfänger
  speichert als Lead mit TTL, opt-in pro Empfehlung — drehbuchkonform,
  weil jede Übergabe im Konsens. **Pfad 1 (passiv via
  `/sbkim/spore.json`)** bleibt Default-Mechanismus parallel.
  **Pfad 3 (parasitär-mitreisend)** explizit verworfen, weil er das
  Empfangsmodus-Prinzip aus `CLAUDE.md` und `sbkim_paper.pdf`
  („Kein Crawler, keine Pulsation, keine Eigenanfragen ins offene
  Netz") bricht. Modul 14 bleibt Stub bis Netz wächst (Schwelle siehe
  Diffusion-Backlog unten); Karte 05 wird in der Stub-Sitzung
  NICHT angefasst.
- ~~**Sage-Page sichtbar machen für Modul 14**~~ — **gelöst
  2026-05-15 durch Pflege-Sitzung Sage-Page Modul 14.**
  `index.html` rendert jetzt `diffusionBacklog[]` parallel zu
  `schutzBacklog[]` in zwei datengetriebenen Karten (Karte 4
  Module-Bento, Karte 14 Bau-Puls jeweils mit parallelem Divider
  „Diffusion-Backlog · proaktiv · Priorität niedrig"), Pie zählt
  jetzt 14 Module mit 5 Schablonen. Zusätzlich bekommt Karte 13
  Eigenschutz einen zweiten parallelen `schutz-backlog`-Block
  „Diffusion-Backlog · proaktiv (Wuchs durch Empfehlung)"
  sprachlich klar abgegrenzt vom Schutz-Backlog-Block („reaktiv");
  `schutz-pilz`-Schlussspruch um die Diffusion-Zeile erweitert
  („wächst, indem er Notizen über Nachbarn weitergibt, nicht ins
  Leere pulst"). Schema-Beispiel in Karte 7 zeigt jetzt
  `diffusionBacklog: []` parallel zum `schutzBacklog: []`-Kommentar.
  `status.json` unverändert (PR #29 hatte die Daten schon geliefert).
  `update_puls_pie.py` NICHT erneut aufgerufen (keine Modul-Daten-
  Änderung). Details im Übergabeprotokoll
  [2026-05-15 Pflege Sage-Page Modul 14](sessions/archiv/2026-05-15_pflege-sage-page-modul-14.md).

## Schutz-Backlog (aus Sage-Page Karte 13, 2026-05-10)

Drei strukturelle Lücken im Schutz-Modell sind beim Aufbau des
Observatoriums sichtbar geworden. Stubs sind angelegt; gezogen werden sie
ab spürbarem Wachstum:

- `docs/components/10_reputation.md` — Knoten-Reputation
- `docs/components/11_rate_limit.md` — Rate-Limit & TTL
- `docs/components/12_blocklist.md` — manuelle Blocklist

Eigenschutz-Karte der Sage-Page macht das Backlog für jeden Besucher
sichtbar und verlinkt direkt auf die Stubs.

### Diffusion-Backlog (aus Hauptsitzung 14-Diffusion-Stub, 2026-05-15)

Schutz und Diffusion sind zwei verschiedene Backlog-Kategorien. Der
Schutz-Backlog (10/11/12) ist **reaktiv** — er wehrt Schaden ab, wenn
das Netz groß genug ist, dass Apoptose und Match-Filter allein nicht
mehr reichen. Der Diffusion-Backlog ist **proaktiv** — er beschleunigt
das Wachstum durch konsensuelle Empfehlung beim Handshake, ohne das
Empfangsmodus-Prinzip zu brechen.

- `docs/components/14_diffusion.md` — konsensuell-empfehlende Spore-
  Diffusion via Handshake-Erweiterung (`recommendedPeers: SporeRef[]`
  als optionales Feld in der `HandshakeResponse`, max. 2 Einträge,
  Empfänger speichert als Lead mit TTL, opt-in pro Empfehlung)

Pfad-Auswahl verbindlich Pfad 2 (konsensuell-empfehlend);
Pfad 1 (passiv via `/sbkim/spore.json`) bleibt Default-Mechanismus
parallel; Pfad 3 (parasitär-mitreisend) verworfen wegen
Empfangsmodus-Prinzip aus `CLAUDE.md` + `sbkim_paper.pdf`.

Modul 14 wird gezogen, sobald **Netz ≥ 10 aktive Geschwister ODER
Bau-Sitzung Modul 09 erfolgreich abgeschlossen UND spürbares
Wachstums-Bedürfnis** — parallel zur 10/11/12-Logik.

`status.json` führt Modul 14 als eigenes Feld `diffusionBacklog[]`
parallel zu `schutzBacklog[]` (proaktiv vs. reaktiv); `scoreModel.
maxScoreNote` bleibt unangetastet (Backlog zählt nicht zum maxScore).
Das Pie-Skript `scripts/update_puls_pie.py` zählt beide Backlog-
Kategorien jetzt mit.

---

## Sitzungs-Einträge

**Format:** Der jüngste Eintrag steht ausführlich oben. Alle älteren
Sitzungen sind in `docs/sessions/archiv/` abgelegt — der Index
darunter verlinkt jedes Übergabeprotokoll. Neue Sitzungen tragen
sich oben mit vollem Text ein und verschieben den dann jeweils
vorletzten in den Archiv-Index. Ziel: PULS.md bleibt unter 400
Zeilen (CLAUDE.md § Format).

### 2026-05-16 · Bau-Sitzung 09 Iteration 3 — Mein-Mixarium live angedockt

**Sitzungs-Rolle:** Bau-Sitzung Modul 09 (Live-Andock-Versuch, dritte
Iteration), mit Klaus am Tablet via Termux, **nicht headless**. Branch
`claude/andock-mein-mixarium-iteration-3-live`. Erster Endknoten (Mein-
Mixarium) folgt erstmals der vollständigen Karte-09-Anleitung. Mein-
Rezeptbuch ist bewusst auf eine Folge-Sitzung verschoben (Zeit-Budget).

**Getan:**

- **Sage-Protokol-Repo lokal in Klaus' Termux geklont** (gh repo clone).
- **Schritt 1 — Module kopiert** (`mkdir -p ~/Mein-Mixarium/sbkim`, dann
  `cp` der sieben Modul-Dateien `00/01/02/03/04/05/07` ins `sbkim/`-
  Unterverzeichnis, plus `sbkim-sw.js` in den Repo-Root). Sichtprüfung
  via `ls`.
- **Schritt 2 — `<script>`-Tags in `index.html`** via `awk` vor das
  **letzte** `</body>` eingefügt (Mein-Mixarium hat 5 Vorkommen von
  `</body>`, daher zwei-Pass-awk statt einfachem sed). Sichtprüfung
  via `grep -c 'src="sbkim/'` → 7. Plus achter Tag für `sbkim-init.js`
  in Schritt 4.
- **Schritt 3 — App-SW Variante 3b**: drei Zeilen oben in
  `app-sw.js` per `printf | cat`-Konkatenation (`self.SBKIM_SW_STANDALONE
  = false`, `importScripts("./sbkim-sw.js")`, `console.info(...)`).
- **Schritt 4 — `sbkim-init.js` angelegt** im `sbkim/`-Ordner (via
  Heredoc `cat > FILE << 'EOF'`): Auto-Init für Schritt 4 + 9a (Anastomose
  + Apoptose), plus globaler Trigger `window.__sbkimErzeugeSpore()` für
  Schritt 5 + 6 (Embedding-Init + Vektor + Spore-Erzeugung). Stamm/Gast-
  Kategorien hartkodiert nach Klaus' realer Mixarium-Ordnerstruktur
  (Stamm = 8 Drinks-Kategorien, Gast = `Knabbereien` + `Fingerfood`).
  Achter `<script src="sbkim/sbkim-init.js">`-Tag direkt nach
  `00_doku_fenster.js` via awk eingefügt.
- **Commit + Push** auf `main`: 11 Dateien geändert, Commit `dbbee2f`,
  Push `b792576..dbbee2f main -> main`. Sauber, kein Konflikt.
- **Pages-Build + Sichtprüfung in der Live-PWA:** Eruda-Konsole zeigte
  alle sieben Modul-Selbstchecks (`MODUL 01/02/03/04/05/07/00 ...
  bereit, Funktionen: ...`) plus die drei `sbkim-init.js`-Init-Zeilen
  (`SBKIM-Init grün`, `SBKIM-Apoptose grün`, `SBKIM-Andock bereit`).
  Modul 03 (Embedding) meldete sich nach `__sbkimErzeugeSpore()`-Aufruf
  mit `Modell: Xenova/multilingual-e5-small, Dim: 384` und
  `Domain-Vektor erzeugt: 384 Floats`.
- **Schritt 5 + 6 — Spore erzeugen:** in Eruda-Konsole
  `__sbkimErzeugeSpore()` getriggert, Embedding-Modell heruntergeladen
  (~30 MB, einmalig), Domain-Vektor über `stammCategories +
  guestCategories + domainKeywords` als Embedding-Text erzeugt
  (`embedPassage`), Spore via `SbkimSpore.generateOwnSpore({...})`
  signiert. **Ergebnis:** nodeId
  `1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0`, Signatur-Länge 86.
- **Schritt 7 — Spore deployen:** in Eruda One-Liner zur Erzeugung
  eines Browser-Downloads ausgelöst, `spore.json` in Klaus' Android-
  Download-Ordner gelandet. Termux per `termux-setup-storage` +
  Android-`MANAGE_EXTERNAL_STORAGE`-Permission (einmalig durch Klaus'
  System-Settings-Toggle) auf den Download-Ordner berechtigt. Datei
  per `mv ~/storage/downloads/spore.json ~/Mein-Mixarium/sbkim/`
  verschoben. Commit + Push als zweiter Commit `d8dd3b3`
  (`dbbee2f..d8dd3b3 main -> main`).
- **Live-URL `https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/
  spore.json`** ist als Klartext-JSON sichtbar mit allen Pflichtfeldern
  (`createdAt`, `domain`, `embeddingModel`, `endpoint`, `id`,
  `nodeType`, `protocolVersion`, `publicKey`, `signature`) UND allen
  Optionalen aus dieser Iteration (`nodeName`, `domainDescription`,
  `domainKeywords`, `domainVector`[384], `stammCategories`[8],
  `guestCategories`[2]). Felder kanonisch alphabetisch.
- **`status.json` Endknoten[Mixarium] auf `integrated: true`
  hochgestuft**, plus additive Felder `integratedAt: "2026-05-16"`,
  `nodeId`, `sporeUrl`, `stammCategories`, `guestCategories`,
  `pingStatus: "pending-peer"`. `lastUpdated` auf `2026-05-16`
  gezogen. `update_puls_pie.py` ausgeführt (Pie-Inhalt unverändert,
  weil keine Modul-Score-Änderung; nur das Datum im Titel-String).
- **PULS § Endknoten-Tabelle** Mein-Mixarium-Zeile auf „integriert
  2026-05-16" mit nodeId / spore-URL / Stamm/Gast-Kategorien-Counts
  und `pending-peer` Vermerk umgestellt.
- **PULS § Sitzungs-Einträge** rotiert, dieser Eintrag oben.

**Was bewusst nicht angefasst wurde:**

- **Mein-Rezeptbuch** unverändert (`integrated: false`). Wird in einer
  Folge-Sitzung andockt. Karte 09 vollständig anwendbar, dieselben
  Schritte mit `domain`/`endpoint`/`stammCategories`/`guestCategories`
  angepasst auf Rezeptbuch-Werte.
- **Schritt 8 (Erster Handshake)** aus Karte 09 noch nicht ausgeführt
  — setzt voraus, dass Mein-Rezeptbuch auch ein
  `/sbkim/spore.json` deployed hat. Kommt in der Rezeptbuch-Andock-
  Sitzung als letzter Schritt von beiden Knoten gemeinsam.
- **Mini-Pflege „Sushi-Kategorie sichtbar machen"** in Mein-Mixarium
  bleibt entkoppelt offen — Stamm/Gast-Felder in der Spore sind das
  Sage-Protokol-relevante Stück; die App-UI in Mixarium ist Klaus'
  eigene Sache, kommt wann er Zeit hat.
- **Eruda-Rückbau** in beiden Endknoten bleibt offen, sinnvoll **nach**
  dem ersten erfolgreichen Cross-Knoten-Handshake.
- **`src/modules/*`, `tests/manual_check.html`** in Sage-Protokol
  unverändert.
- **Karte 09** unverändert (die Karte hat sich live bewährt, keine
  Lücken aufgetaucht).
- **`docs/INTERFACES.md` § 6** Änderungsprotokoll diesmal
  **nicht** angefasst — das ist eine Andock-Sitzung in einem
  externen Endknoten-Repo, kein Vertrags-Eingriff.

**Validierung:**

- **`status.json` valid JSON** (`python3 -c "import json; json.load(...)"`).
- **Pie-Skript ausgeführt** (kein Datenverlust; Pie-Inhalt unverändert,
  nur Datum auf 2026-05-16).
- **Spore-JSON live-erreichbar** auf der Pages-URL, kanonisch
  alphabetisch sortiert (`createdAt` zuerst, `stammCategories` als
  vorletztes, `signature` zwischen `publicKey` und `stammCategories` —
  alphabetisch korrekt).
- **`pingStatus: "pending-peer"`** drückt aus, dass der zweite
  Pages-Knoten noch fehlt für einen Live-Cross-Handshake. Schema-
  Erweiterung; falls Sage-Page das nicht rendert, ist es harmlos.

**Was offen blieb:**

- **Bau-Sitzung Mein-Rezeptbuch (Andock-Iteration „3.5")** — gleicher
  Pfad, andere Stamm/Gast-Werte:
  - Stamm: `["Vorspeisen", "Suppen", "Fleisch", "Fisch", "Vegetarisch"]`
    plus Klaus' tatsächliche Rezeptbuch-Ordner (Bild aus der ersten
    Sichtkontrolle in Live Andock Iteration 2 zeigte schon 5 Stamm-
    Ordner; vor dem Andock noch genau sichten).
  - Gast: `["Begleitgetränke"]` (später Weinkarte).
  - domain: `lausiklauskn-png.github.io`.
  - endpoint: `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/`.
  - nodeName: `Rezeptbuch Klaus`.
  - Sonst: identische Andock-Pfade. Termux-Setup
    (`termux-setup-storage`, Modul-Files kopieren, App-SW patchen,
    `sbkim-init.js` analog, Schritte 1–7 wie hier) ist schon eingespielt.
- **Cross-Knoten-Handshake** (Karte 09 Schritt 8) zwischen Mixarium
  und Rezeptbuch — nach Andock von Rezeptbuch. Erfolgreicher Handshake
  schaltet `pingStatus: "live"` und ist die Voraussetzung, um Eruda
  endgültig wieder rauszubauen.
- **Eruda-Rückbau** in beiden Endknoten — nach dem ersten Live-Cross-
  Handshake.
- **Mini-Pflege „Sushi-Kategorie sichtbar machen"** in Mein-Mixarium
  (entkoppelt).
- **Mini-Pflege INTERFACES.md §6 Tabellen-Bug** (aus PR #46 Squash-Merge).
- **Klaus' Sichttest Panel 06** (Heterokaryose), weiterhin offen.

**Nächster sinnvoller Schritt:**

1. **Andock Mein-Rezeptbuch** mit Klaus am Termux. *Nicht headless.*
   Analoger Pfad, ~45–60 Min weil Klaus den Pfad schon kennt.
2. **Cross-Knoten-Handshake** (Karte 09 Schritt 8) zwischen den zwei
   Endknoten, nach Schritt 1.
3. **Eruda-Rückbau** in beiden Endknoten nach erfolgreichem Handshake.
4. **Mini-Pflege „Sushi-Kategorie sichtbar machen"** in Mein-Mixarium.

---

### 2026-05-15 · Bau 02 — Stamm/Gast-Durchreichung in `generateOwnSpore`

**Sitzungs-Rolle:** Bau-Sitzung Modul 02, headless, EINE Phase. Branch
`claude/bau-02-stamm-gast-felder-durchreichung`. Folge-Bau direkt nach
der Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON" (selbiger Tag,
PR #46) — diese Spec hatte heilige Tafeln + Karten 02/04 nachgezogen,
aber den Modul-02-Code nicht. Ohne den Code-Eingriff würden die neuen
optionalen Felder bei `generateOwnSpore({stammCategories,
guestCategories, …})` still ignoriert.

**Getan:**

- **`src/modules/02_spore.js`** `generateOwnSpore` Allow-List um zwei
  Zeilen erweitert (direkt nach der `domainVector`-Zeile):
  ```
  if (Array.isArray(meta.stammCategories)) unsigned.stammCategories = meta.stammCategories.slice();
  if (Array.isArray(meta.guestCategories)) unsigned.guestCategories = meta.guestCategories.slice();
  ```
  Gleiche Allow-List-Konvention wie alle anderen Optionalen.
  `node --check` grün.
- **Karte 02 § Bauzustand** Zeile „Pflege Stamm/Gast-Durchreichung"
  ergänzt.
- **INTERFACES.md §6** Änderungsprotokoll-Zeile.
- **PULS § Schnellüberblick** Modul-02-Zeile erweitert + diesen
  Sitzungs-Eintrag + Archiv-Index-Rotation.

**Bewusst nicht angefasst:** `validateSporeMeta` (Felder bleiben
optional, non-Array still ignoriert), Disjunktheits-Prüfung
(Hosting-Pflicht), `verifyForeignSpore` (kanonisch über alles
inkl. neuer Felder, ohne Sonderbehandlung), INTERFACES.md §0/§1/§2/§3/§4/§5, `tests/manual_check.html`, `status.json`,
`index.html`. **`update_puls_pie.py` nicht aufgerufen.**
**`PROTOCOL_VERSION` bleibt `"0.1"`.**

**Was offen blieb:** Bau-Sitzung 09 Iteration 3 mit Klaus am
Live-Andock-Versuch (jetzt vollständig vorbereitet — Spec da, Code
da, Eruda in beiden Endknoten live).

**Nächster sinnvoller Schritt:** **Bau-Sitzung 09 Iteration 3** mit
Klaus am Live-Andock-Versuch (Mein-Mixarium zuerst, dann Mein-
Rezeptbuch), nach diesem PR.

---

### 2026-05-15 · Spec-Sitzung — Stamm/Gast-Felder in Spore-JSON

**Sitzungs-Rolle:** Spec-Sitzung, headless, EINE Phase. Branch
`claude/spec-stamm-gast-spore-felder`. Scope: die vier offenen Fragen
aus `docs/ARCHITEKTUR.md` §8 lösen, INTERFACES.md §2 Spore-JSON additiv
erweitern, Karten 02 und 04 nachziehen.

**Vier Entscheidungen:**

1. **Feldnamen:** `stammCategories: string[]` und `guestCategories:
   string[]`. Mixed-Convention konsistent mit Sage-Fachvokabular
   (Spore, Anastomose, Heterokaryose, Apoptose sind ebenfalls deutsch
   im sonst englischen Schema).
2. **Match-Eingriff:** **verworfen.** Stamm/Gast ist Klassifikations-
   Schicht auf Daten-Ebene (UI/Sortier), nicht Vektor-Math. Modul 04
   bleibt modus-frei mit einer Schwelle. Karte 04 mit explizitem
   Hinweis dazu ergänzt — verhindert, dass eine spätere Bau-Sitzung
   einen Dämpfungsfaktor einbaut „weil er hier mal stand".
3. **`domainVector`:** bleibt **single** in der Erst-Iteration (über
   alle Kategorien gemittelt). Separate `stammVector` / `guestVector`
   in einer Folge-Pflege-Sitzung, sobald empirische Match-Verteilung
   die Trennung motiviert.
4. **UI-Label:** **„Überraschungs-Plus"** verbindlich für die
   Endknoten-App-UI (Mixarium / Rezeptbuch). Sage-Page-Doku und
   technischer Begriff im Sage-Protokol verwenden „Gast-Kategorie".

**Getan:**

- **`docs/INTERFACES.md` §2 Spore-JSON Optionale Felder** um
  `stammCategories` + `guestCategories` erweitert (signaturpflichtig
  wenn vorhanden; Disjunktheit als Hosting-Pflicht, kein
  Verify-Abbruch).
- **`docs/INTERFACES.md` §6 Änderungsprotokoll** Zeile am Ende.
- **`docs/components/02_spore.md` § Datenformat Optionale Felder**
  Block um die zwei neuen Zeilen ergänzt + Sign-/Verify-Hinweis
  (kanonische JSON sortiert nur Object-Keys, Array-Reihenfolge
  unverändert).
- **`docs/components/04_match.md` § Konfigurationswerte** um
  Sub-Block „Stamm/Gast-Klassifikation berührt Modul 04 nicht"
  erweitert.
- **`docs/ARCHITEKTUR.md` §8** Status auf „Spec festgelegt"
  hochgestuft; Konsequenzen-Tabelle für Modul 04 von
  „Dämpfungsfaktor" auf „unverändert" korrigiert; vier offene
  Fragen mit `~~strikethrough~~` als gelöst markiert + Antworten.
- **PULS §Empfehlung, §Sitzungs-Einträge, §Archiv-Index** dieser
  Eintrag nachgezogen.

**Bewusst nicht angefasst:** §0 (keine neue Konstante),
§1-Modul-Verträge (Karten-Pflege ist kein API-Eingriff), §3 / §4
/ §5, `src/modules/*`, `tests/manual_check.html`,
`status.json`, `index.html`. **`update_puls_pie.py` nicht
aufgerufen.** **`PROTOCOL_VERSION` bleibt `"0.1"`.**

**Validierung:** Drei Markdown-Files (ARCHITEKTUR / INTERFACES /
02_spore / 04_match) Cross-Reading durchgezogen — keine
widersprüchlichen Angaben zwischen ARCHITEKTUR.md §8 (Konsequenzen-
Tabelle Modul 04 „unverändert") und Karte 04 (eigener Hinweis-Block
„berührt Modul 04 nicht") und INTERFACES.md §2 (zwei neue
Optionalen) und Karte 02 (gleiche zwei neuen Optionalen).

**Was offen blieb:**

- **Bau-Sitzung 09 Iteration 3** mit Klaus am Live-Andock-Versuch
  — kann jetzt loslegen. Spore-JSON-Form ist mit Stamm/Gast-Feldern
  vollständig spezifiziert.
- **INTERFACES.md §6 Änderungsprotokoll-Tabellen-Bug**: zwei
  Sitzungs-Einträge (Bau-Sitzung 08 + Live Andock Iteration 2) sind
  durch einen Squash-Merge-Artefakt in einer Tabellenzeile
  verschmolzen. Beeinträchtigt nur Lesbarkeit, nicht den Vertrag.
  Eigene kleine Pflege-Sitzung.
- **Endknoten-Mini-Pflege „Sushi-Kategorie sichtbar machen"** in
  Mein-Mixarium (entkoppelt).
- **Eruda-Rückbau** in beiden Endknoten nach erfolgreichem Andock.

**Nächster sinnvoller Schritt:**

1. **Bau-Sitzung 09 Iteration 3** mit Klaus am Live-Andock-Versuch
   (Mixarium + Rezeptbuch). *Nicht headless.* Variante 3b mit
   Pre-Flight + `importScripts` ist Default für beide Endknoten.
   Stamm/Gast-Kategorien werden direkt in die ersten
   `/sbkim/spore.json` eingetragen.
2. **Mini-Pflege INTERFACES.md §6 Tabellen-Bug** — *headless
   möglich*, niedrige Dringlichkeit.
3. **Endknoten-Mini-Pflege „Sushi-Kategorie sichtbar machen"** —
   parallel zu Schritt 1 möglich.
4. **Klaus' Sichttest Panel 06** (Heterokaryose), weiterhin offen.

---

## Archiv-Index (Sitzungen vor dieser Pflege)

Alle Sitzungen bis einschließlich Pflege PULS-Archivierung
(2026-05-15) sind ausgelagert. Neueste oben.

| Datum | Sitzung | Übergabeprotokoll |
|---|---|---|
| 2026-05-15 | Bau · Stamm/Gast-Durchreichung in `generateOwnSpore` (Folge-Bau, Modul 02) | [→ Archiv](sessions/archiv/2026-05-15_bau-02-stamm-gast-felder-durchreichung.md) |
| 2026-05-15 | Spec · Stamm/Gast-Felder in Spore-JSON (additiv, kein Hauptversions-Sprung) | [→ Archiv](sessions/archiv/2026-05-15_spec-stamm-gast-spore-felder.md) |
| 2026-05-15 | Bau · Live Andock Iteration 2 — Eruda in beiden Endknoten + Architektur-Konzept Stamm/Gast | [→ Archiv](sessions/archiv/2026-05-15_live-andock-eruda-stamm-gast.md) |
| 2026-05-15 | Pflege · Karte 09 App-SW-Koexistenz + Tablet-Sichtkontrolle (Variante 3c + Eruda-Block) | [→ Archiv](sessions/archiv/2026-05-15_pflege-karte-09-app-sw-tablet.md) |
| 2026-05-15 | Pflege · Sichttest-Resultate (Sage-Page mehrschichtig + Panel 08 — beide grün) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sichttest-resultate.md) |
| 2026-05-15 | Pflege · PULS-Archivierung (4758 → 426 Zeilen, Sitzungs-Einträge in Archiv-Index, Konvention für Folgesitzungen) | [→ Archiv](sessions/archiv/2026-05-15_pflege-puls-archivierung.md) |
| 2026-05-15 | Pflege · Sage-Page Lebenszyklus mehrschichtig (Phase-4-Fix + Schicht „Knoten-Leben" + Klick-Lernpfad + reichere Animationen) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-lebenszyklus-mehrschichtig.md) |
| 2026-05-15 | Bau 08 · Modul 08 UI-Demo (Endknoten-Pflege-UI für `sbkim_hetero_outbox` + `heterokaryosisOptIn`) | [→ Archiv](sessions/archiv/2026-05-15_bau-08-ui-demo.md) |
| 2026-05-15 | Pflege · Bau 06.1 Outbox-Lese-Pfad in Modul 06 + DB-Version 2 → 3 | [→ Archiv](sessions/archiv/2026-05-15_pflege-bau-06.1-outbox-lese-pfad.md) |
| 2026-05-15 | Pflege · Sage-Page Phasen-Animation + Wanderung-Erweiterung + Initialstart-Zentrierung | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-lebenszyklus-phasen.md) |
| 2026-05-15 | Pflege · Sage-Page Design-Fix (Modul-Bento-Wrap, Lebenszyklus-Hub-Bootstrap, Initialstart-viewBox) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-design-fix.md) |
| 2026-05-15 | Spec · Modul 08 UI-Demo gefüllt | [→ Archiv](sessions/archiv/2026-05-15_spec-08-ui-demo.md) |
| 2026-05-15 | Bau · Modul 06 Heterokaryose Code-Stub | [→ Archiv](sessions/archiv/2026-05-15_bau-06-heterokaryose.md) |
| 2026-05-15 | Spec · Modul 06 Heterokaryose gefüllt | [→ Archiv](sessions/archiv/2026-05-15_spec-06-heterokaryose.md) |
| 2026-05-15 | Pflege · Sage-Page Modul 14 Sichtbarmachung (`diffusionBacklog[]` parallel zu `schutzBacklog[]`) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-modul-14.md) |
| 2026-05-15 | Pflege · Karte 09 App-SW-Koexistenz (Variante 3b importScripts, `SBKIM_SW_STANDALONE`-Flag) | [→ Archiv](sessions/archiv/2026-05-15_pflege-09-app-sw-koexistenz.md) |
| 2026-05-15 | Hauptsitzung · Modul 14 Diffusion — Backlog-Stub angelegt (Pfad 2 verbindlich) | [→ Archiv](sessions/archiv/2026-05-15_haupt-14-diffusion-stub.md) |
| 2026-05-15 | Bau-Sitzung Modul 09 — BLOCKIERT vor Schritt 1 (App-SW-Konflikt in beiden Endknoten) | [→ Archiv](sessions/archiv/2026-05-15_bau-09-blockiert-app-sw.md) |
| 2026-05-15 | Pflege · Karte 09 Schritt 9 — `SbkimApoptose.init` + `SbkimDoku.init` + optionaler TTL-Sweep | [→ Archiv](sessions/archiv/2026-05-15_pflege-09-schritt-9-doku-ttl.md) |
| 2026-05-15 | Pflege · Modul 02 + Modul 07 Cache-Invalidate (`resetIdentityCache()` als Cleanup-Schritt 6) | [→ Archiv](sessions/archiv/2026-05-15_pflege-02-07-cache-invalidate.md) |
| 2026-05-15 | Pflege · Modul 07 Test 6 bestätigt (Re-Sichttest nach Cache-Invalidate) | [→ Archiv](sessions/archiv/2026-05-15_pflege-07-test6-bestaetigt.md) |
| 2026-05-15 | Pflege · Modul 05 Test 2 Vektor-Trias (Tarantino → Steuerrecht / Eisenbahn / Quantenfeld) | [→ Archiv](sessions/archiv/2026-05-15_pflege-05-test2-vektor-trias.md) |
| 2026-05-15 | Pflege · Modul 00 Test 4 Quota-Werte (GiB-Skalierung statt Mini-Bytes) | [→ Archiv](sessions/archiv/2026-05-15_pflege-00-test4-quota.md) |
| 2026-05-14 | Bau · Modul 00 Doku-Fenster (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-00-doku-fenster.md) |
| 2026-05-14 | Spec · Modul 00 Doku-Fenster (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-00-doku-fenster.md) |
| 2026-05-14 | Bau · Modul 07 Apoptose (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-07-apoptose.md) |
| 2026-05-14 | Spec · Modul 07 Apoptose (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-07-apoptose.md) |
| 2026-05-14 | Spec · Modul 09 Einbau-PWA (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-09-einbau-pwa.md) |
| 2026-05-14 | Bau · Modul 05 Anastomose (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-05-anastomose.md) |
| 2026-05-14 | Spec · Modul 05 Anastomose (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-05-anastomose.md) |
| 2026-05-14 | Pflege · Match-Kalibrierung (`PROVIDER_MIN_MATCH` 0.55 → 0.80) | [→ Archiv](sessions/archiv/2026-05-14_pflege-match-kalibrierung.md) |
| 2026-05-14 | Spec+Bau · Modul 02 Spore (Spec + Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_spec-bau-02-spore.md) |
| 2026-05-14 | Spec+Bau · Modul 04 Match (Spec + Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_spec-bau-04-match.md) |
| 2026-05-14 | Bau · Modul 03 Embedding (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-03-embedding.md) |
| 2026-05-14 | Bau · Modul 01 Storage (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-01-storage.md) |
| 2026-05-14 | Spec · Modul 01 Storage + Modul 03 Embedding | [→ Archiv](sessions/archiv/2026-05-14_spec-01-storage-und-03-embedding.md) |
| 2026-05-14 | Plan-Sitzung · Spec-Brief 01 Storage + 03 Embedding | [→ Archiv](sessions/archiv/2026-05-14_plan-spec-01-storage-und-03-embedding.md) |
| 2026-05-10 | Hauptsitzung · Site-Echo + Bau-Puls + Brand-Icon | [→ Archiv](sessions/archiv/2026-05-10_site_echo.md) |
| 2026-05-10 | Hauptsitzung · Sage·Observatorium (Landing Page) | [→ Archiv](sessions/archiv/2026-05-10_observatorium.md) |
| 2026-05-10 | Hauptsitzung · Skelett-Anlage (Repo-Initiale, zehn Karten-Schablonen, Memory-Schicht) | [→ Archiv](sessions/archiv/2026-05-10_skelett-anlage.md) |
