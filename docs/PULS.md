# PULS — lebender Status

**Format:** Jede Sitzung trägt unten einen Eintrag ein (neueste oben).
**Pflichtfelder pro Eintrag:** Datum · Sitzungs-Rolle · was getan · was offen · nächster sinnvoller Schritt.
**Begrenzung:** Diese Datei darf 3000 Zeilen nicht überschreiten. Älteres ins
`docs/sessions/archiv/`-Verzeichnis als Übergabeprotokoll auslagern.
**Schutz-Klausel (2026-05-17):** Die 3000-Zeilen-Grenze wurde bewusst hochgesetzt
(vorher 400) — Pflege-Sitzungen werden umfangreicher dokumentiert, weil
Architekturfunde und Diagnose-Routinen Platz brauchen. **Diese Grenze NICHT
wieder herabsetzen, auch nicht zum Token-Sparen.** Wenn 3000 Zeilen nahen,
auslagern statt kürzen.

---

## Modulstand heute

<!-- Pie-Block ab hier wird automatisch aus status.json generiert.
     Nicht von Hand bearbeiten. Erzeugen mit:
     python3 scripts/update_puls_pie.py
     Aufruf-Pflicht: nach jeder status.json-Änderung. Siehe CLAUDE.md. -->
```mermaid
pie showData
  title Modulstand 2026-05-17 (14 Module)
  "🟫 Schablone" : 4
  "🟧 In Werkstatt" : 0
  "🟨 Spec fertig" : 0
  "🟦 Code-Stub" : 7
  "🟩 Fertig" : 3
```

Farb-Mapping verbindlich in [INTERFACES.md §5](INTERFACES.md). Live-Bau-Puls
auf der [Sage-Page](../index.html) (Karte "Bau-Puls").

## Als nächstes ✨

Module mit Code-Stub, **Sichttest durch Klaus 2026-05-14 erledigt** —
ergab fünf reproduzierbare Cosinus-Messwerte (siehe Karte 04 Beleg-
Block), die in der Pflege-Sitzung 2026-05-14 zu `PROVIDER_MIN_MATCH`
0.55 → 0.80 geführt haben:

- 🟦 **[01 Storage](components/01_storage.md)** — geprüft 2026-05-14 (Klaus, im Browser); init/round-trip/Unknown-Store sauber, sechs Stores in DevTools sichtbar
- 🟦 **[02 Spore](components/02_spore.md)** — geprüft 2026-05-14 + 2026-05-16 (Klaus, im Browser); Identität deterministisch, Spore sortiert, Sign+Verify valide, Manipulation erkannt; **Bau 02.X Backup-Export Sichttest 2026-05-16 grün** — Knöpfe 6/7/7b alle drei Hauptpfade ohne Modul-Bug (Wrapper-Format `version:1` / `iterations:600000` / AES-GCM-256, `BackupOverwriteError`-Schutzpfad greift, force-Pfad funktioniert; siehe Karte 02 § Bauzustand-Zeile „Sichttest (Bau 02.X)"). Test-Panel-UX-Befund pendingBackup-Stash-Reset in Knopf 7 wurde in Folge-Mini-Pflege 2026-05-16 gefixt (Reset jetzt erst direkt vor `importBackup` statt am Handler-Anfang; Sichttest des Fix-Pfads ungeprüft, weil headless gebaut, wartet auf Klaus' Browser-Lauf).
- 🟦 **[03 Embedding](components/03_embedding.md)** — geprüft 2026-05-14 (Klaus, im Browser); L2-Norm 1.0, gleicher Inhalt ≈0.95, Baseline für unverwandte Begriffe ungewöhnlich hoch
- 🟦 **[04 Match](components/04_match.md)** — geprüft 2026-05-14 (Klaus, im Browser); 3/5 Tests grün, 2 zeigten Schwellen-Drift → Pflege-Sitzung 2026-05-14 hat `PROVIDER_MIN_MATCH` und Test-Schwellen kalibriert
- 🟦 **[06 Heterokaryose](components/06_heterokaryose.md)** — Code geschrieben 2026-05-15 (Bau-Sitzung 06) + **Pflege Bau 06.1 Outbox-Lese-Pfad 2026-05-15** (`sbkim_hetero_outbox` als Anker-Quelle nach Spec-Sitzung 08, fail-soft Fallback bleibt); **Sichttest 2026-05-16 rasch grob durchgeklickt** (Klaus, Chrome auf Galaxy Tab S6 + DeX): Panel 06 mit 14 Knöpfen — alle Selbstchecks grün, Hauptpfade ohne Modul-Bug; voller Test-1–9-Lauf inkl. Test 9 `HETERO_MAX_ANCHORS`-Begrenzung folgt bei Bedarf. Fünf-Funktionen-API, kanonischer Sign/Verify-Pfad als **vierter Pfad bewusst dupliziert** (Single-File-PWA-Stil), neuer Store `sbkim_hetero_inbox` (DB-Version 1→2 additiv, Bau 06), Service-Worker dritter fetch-Listener-Pfad `/sbkim/heterokaryosis`; Anker-Quelle nach Pflege Bau 06.1 = `sbkim_hetero_outbox` fail-soft mit Spore-Single-Anker-Fallback. **Test 6 in Panel 07 muss in einem Folge-Sichttest neu durchgespielt werden** (Cleanup löscht jetzt sechs Stores statt fünf).

Code-Stub frisch aus den Bau-Sitzungen 2026-05-14/15, **Sichttest ausstehend bzw. teilweise erledigt:**

- 🟦 **[05 Anastomose](components/05_anastomose.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 6 von 7 Tests grün im ersten Lauf (Setup, Test 1 passendes Match score=0.888, Test 3 Versions-Mismatch, Test 4 Signatur-Manipulation, Test 5 Re-Handshake, Test 6 forgetSibling, Test 7 listSiblings); **Test 2 (Domain-Mismatch / Tarantino-Vektor) Test-Bug** — score=0.854 statt erwartetem <0.80 (Tarantino-Filme spielen oft in Bars → zu nah am Mixarium-Cocktail-Vektor); Modul-Logik korrekt, `PROVIDER_MIN_MATCH=0.80` greift wie spezifiziert. **Pflege-Sitzung 2026-05-15** baut Panel 05 Test 2 auf **Vektor-Trias** um (Steuerrecht und Bilanzierung / Eisenbahnsignalanlagen / Quantenfeldtheorie), Pass-Check „mindestens einer der drei rejected mit score < 0.80"; Tarantino-Vergleichswert wird parallel als reiner Cosinus protokolliert; Karte 05 § Manueller Test Punkt 2 zieht mit. Klaus' zweiter Sichttest-Lauf nach Pflege folgt; falls alle drei Trias-Kandidaten über 0.80 liegen, eigene Folge-Pflege-Sitzung „Embedding-Baseline"
- 🟦 **[07 Apoptose](components/07_apoptose.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 7 von 8 Tests grün im ersten Lauf (Setup + Tests 1/2/3/4/5/7 + Selbstcheck); **Test 6 (Self-Apoptose) deckte echten Modul-Bug auf**: nach Cleanup `getNodeId_wirft_NoIdentityError:false` trotz `stores_alle_leer:true` — Modul 02's In-Memory-`identityCache` wurde nicht durch externes `storage.clear` invalidiert (Modul 07 wusste nichts vom Modul-02-Cache). Folgeschaden: Tests 1/2/3/8 nach Test 6 mit „Keine Identität in sbkim_keys[main]". **Pflege-Sitzung 2026-05-15** ergänzt Modul 02 um öffentliche `resetIdentityCache() → void` (sync, idempotent, leert nur Closure-Cache, kein Storage-Eingriff) und Modul 07's Cleanup ruft sie als letzten Schritt nach den `storage.clear`-Aufrufen — heilige Tafeln (INTERFACES.md §1 Modul 02 + §1 Modul 07 + §6 + Karten 02 + 07) ziehen mit. Re-Sichttest 2026-05-15 bestätigte den Cache-Fix: `getNodeId_wirft_NoIdentityError:true`. Modul 07 Sichttest 8/8 grün. **Pflege Cleanup-Reihenfolge Bau 06 (2026-05-15)** erweitert `CLEANUP_ORDER` additiv um `sbkim_hetero_inbox` (Position 4 zwischen `sbkim_legacy_inbox` und `sbkim_spore`); Test 6 muss in einem Folge-Sichttest neu durchgespielt werden (jetzt 6 statt 5 Stores zu prüfen).
- 🟦 **[00 Doku-Fenster](components/00_doku_fenster.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 5 von 6 Tests grün im ersten Lauf (Setup, Test 2 5-Klick-Simulation, Test 3 4-Klick + Timeout, Test 5 TTL-Sweep, Selbstcheck-Hinweis); **Test 4 Test-Bug** mit Mini-Werten 81/100 (freeBytes=19 Bytes ist trivial < 50 MiB → `warningLevel:"both"` statt erwartetem `"ratio"`) → **Pflege-Sitzung 2026-05-15** repariert mit GiB-Skalierung (`usage:8.1 GiB, quota:10 GiB` → freeBytes ≈ 1.9 GiB → `warningLevel:"ratio"` sauber); Modul-Vertrag und INTERFACES.md unangetastet

Spec frisch, **Bau ausstehend**:

- 🟨 **[09 Einbau-PWA](components/09_einbau_pwa.md)** — Karte vollständig 2026-05-14 (Spec-Sitzung; Anleitung, kein JS-Modul), **Pflege-Sitzung 2026-05-15 erweitert auf neun Schritte** (Schritt 9 neu: `SbkimApoptose.init()` + `SbkimDoku.init({searchIconSelector:...})` + optionaler TTL-Sweep nach Handshake); `<script>`-Reihenfolge in Schritt 2 zieht 07 + 00 nach (`01 → 02 → 03 → 04 → 05 → 07 → 00`); Sichtkontroll-Block jetzt vier Pflicht-Punkte (sieben Selbstcheck-Zeilen + sechs IndexedDB-Stores + zwei live-Endpunkte + 5-Klick-Geste am Such-Symbol); Datei-Pfad-Konvention (SW im Endknoten-Repo-Root, sieben JS-Module inline oder unter `sbkim/`); Spore-Endpunkt `/sbkim/spore.json` verbindlich; SW-Scope-Falle dokumentiert; `domainVector`-Pflicht-Frage **entschieden Variante A (Soft-Pflicht im Andock-Workflow, kein Hauptversions-Sprung)** — Modul 02 / §0 / §2 bleiben unverändert. **Bau-Sitzung 2026-05-15 vor Schritt 1 sauber abgebrochen** (Befund-Sitzung): beide Endknoten haben aktiven `app-sw.js` im Repo-Root (Mein-Mixarium Z. 12543, Mein-Rezeptbuch Z. 10453), Karte 09 antizipiert diesen Fall nicht; zusätzlich Karte 09 § Sichtkontrolle implizit auf Desktop-DevTools gemünzt — Klaus' Tablet (Galaxy Tab S6 + DeX) braucht Eruda-Pfad. **Vor erneuter Bau-Sitzung 09** zwei Karten-Lücken in einer Pflege-Sitzung Karte 09 zu schließen (Empfehlung Option α: Patch in bestehenden `app-sw.js`; plus Eruda-Pfad für Tablet-Sichtkontrolle). Details in [Übergabeprotokoll 2026-05-15 Bau-09-blockiert](sessions/archiv/2026-05-15_bau-09-blockiert-app-sw.md).

Letzter Bau frisch (Bau-Sitzung 2026-05-15), **Sichttest geprüft 2026-05-15:**

- 🟦 **[08 UI-Demo](components/08_ui_demo.md)** — Code geschrieben 2026-05-15 (Bau-Sitzung 08). Endknoten-Andocker-UI für die zwei Stellen, die Modul 06 (Heterokaryose) braucht, aber nicht selbst füllt: `sbkim_hetero_outbox` (Anker-Vorrat) und `sbkim_siblings[peerNodeId].heterokaryosisOptIn` (additives Opt-In-Flag pro Geschwister). Fünf-Funktionen-API (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`), sechs benannte Error-Klassen im Factory-Stil analog Modul 00, drei Test-Brücken (`_clearOutbox`, `_addPseudoSibling` ohne Opt-In-Flag, `_clearPseudoSiblings`), synchroner Selbstcheck. **Storage-only** (kein Netz, kein Embedding, keine Signatur — Vektor-Erzeugung ist Aufrufer-Pflicht). `addOutboxAnchor`-Check-Reihenfolge: (1) Label sync, (2) Vektor sync, (3) async-Voll-Check (`OutboxFullError` nur bei NEUEM Label); Überschreiben eines bekannten Labels bleibt erlaubt. `setSiblingHeteroOptIn` strikt boolean (`1`, `"true"` werfen `InvalidOptInArgError`); Co-Schreiber-Disziplin via `Object.assign`. Panel 08 in `tests/manual_check.html` mit acht Knöpfen (Setup + sechs Test-Punkte + Selbstcheck-Hinweis); Panel-Status von Werkstatt-Stub `idle` auf `ok "Code-Stub"`. **Self-Apoptose-Knopf bewusst NICHT in Panel 08** (Spec-Sitzung 08-Entscheidung respektiert). `node --check src/modules/08_ui_demo.js` grün, alle 10 Inline-`<script>`-Blöcke validiert. **Sichttest geprüft 2026-05-15 (Klaus, im Browser): 6/6 Test-Punkte grün** (Pflege-Sitzung Sichttest-Resultate 2026-05-15).

Empfehlung Hauptsitzung: **Klaus' Re-Andock beider Endknoten mit
PWA-Suffix**. Die Pflege-Sitzung 2026-05-16 „Karten 01 + 09 PWA-
Suffix" hat die Architektur-Erweiterung abgeschlossen (Modul 01 hat
jetzt `init({dbSuffix})`, Karten 01 + 09 und INTERFACES.md §1 Modul 01
sind nachgezogen, `PROTOCOL_VERSION` bleibt `"0.1"`, Modul 02 unangetastet).
Nächster Schritt liegt **in Klaus' Endknoten-Repos**:

1. In **beiden** Endknoten-Repos (`Mein-Mixarium`, `Mein-Rezeptbuch`)
   muss `sbkim/sbkim-init.js` erweitert werden: vor dem bestehenden
   `await SbkimAnastomose.init()` einen Aufruf
   `await SbkimStorage.init({ dbSuffix: "mixarium" })` (bzw.
   `"rezeptbuch"`) hinzufügen.
2. In beiden Tab-Sessions `__sbkimErzeugeSpore()` erneut triggern
   (Klaus in der jeweiligen Eruda-Konsole) → neue, getrennte nodeIds
   pro PWA.
3. Neue `spore.json` jeweils nach `~/<Endknoten>/sbkim/spore.json`
   verschieben + Commit + Push (überschreibt die alte Pages-Spore).
4. Erst nach Re-Andock kann eine Folge-Sitzung `status.json`
   `pingStatus` von `"blocked-origin-collision"` auf `"live"`
   wechseln (sobald Klaus den ersten Cross-Knoten-Handshake gefahren
   hat) und die `nodeId`-Werte in der Endknoten-Tabelle aktualisieren.

Andere offene Punkte (Mini-Pflege „Sushi-Kategorie sichtbar machen"
in Mein-Mixarium, INTERFACES.md §6 Tabellen-Bug) sind unverändert
offen. Details im [Übergabeprotokoll 2026-05-16 Pflege PWA-Suffix](sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md),
zur Andock-Hintergrund [Übergabeprotokoll 2026-05-16 Andock
Mein-Rezeptbuch](sessions/archiv/2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md)
und der zugehörigen [Mixarium-Andock-Übergabe](sessions/archiv/2026-05-16_andock-mein-mixarium-iteration-3-live.md).

---

## Schnellüberblick

| Modul | Spec | Code | Manueller Sichttest | Anmerkung |
|---|---|---|---|---|
| 00 doku_fenster | Spec fertig (2026-05-14) | Code-Stub (2026-05-14, Pflege Persistenz-Strategie verbinden 2026-05-16) | geprüft 2026-05-15 (Klaus) — 5/6 Tests grün im ersten Lauf, Test 4 Test-Bug in Pflege-Sitzung 2026-05-15 mit GiB-Skalierung repariert; **Pflege Persistenz-Strategie verbinden Sichttest 2026-05-16 grün** (Klaus, im Browser) — Drei-Setup-Probe aus § Manueller Test Punkt 7 alle drei Pfade ohne Auffälligkeit: Persist-Trigger-Stub, Quota-Trigger, Negativ-Fall | Sechs-Funktionen-API (`init/open/close/isOpen/getStatusSnapshot/recordSighttest`), reines Lese-/Trigger-Modul, alleiniger Schreiber `sbkim_doku_meta`, 5-Klick-Geste mit 3s-Zeitfenster, Modal mit Backdrop und MutationObserver-Mount, Quota-Doppel-Schwelle (80% / 50 MiB), Self-Apoptose bewusst NICHT in 00. **Pflege Persistenz-Strategie verbinden 2026-05-16** (additiv, kein Refactoring): `getStatusSnapshot()` um Feld `storagePersisted: boolean \| null` erweitert (Spiegelung Modul-01-Getter fail-soft); Modal zeigt zusätzliche „Backup empfohlen"-Tipp-Zeile (`DOKU_BACKUP_TIP_TEXT` modul-lokal), wenn `storagePersisted === false` ODER `quota.warningLevel !== "none"`. Hinweis-only, kein Direkt-Aufruf von `SbkimSpore.exportBackup` aus Modul 00 (Aufrufer-Pflicht-Trennung). |
| 01 storage | Spec fertig (2026-05-14) | Code-Stub (2026-05-14, Pflege PWA-Suffix + Pflege Storage-Persist 2026-05-16) | geprüft 2026-05-14 + 2026-05-16 (Klaus) — fünfter Knopf „Persist-Status zeigen" liefert `_meta.storagePersisted: true` (Chrome auto-bei-PWA) | IndexedDB-Wrapper |
| 02 spore | Spec fertig (2026-05-14, Pflege Stamm/Gast-Felder 2026-05-15, Pflege Spec Backup-Export Stufe 2 2026-05-16) | Code-Stub (2026-05-14, Pflege Cache-Invalidate 2026-05-15, Pflege Stamm/Gast-Durchreichung 2026-05-15, Bau 02.X Backup-Export 2026-05-16) | geprüft 2026-05-14 (Klaus) + 2026-05-15 (Cache-Invalidate-Pflege via Sichttest 07) + 2026-05-16 (Klaus, Bau 02.X Backup-Export Knöpfe 6/7/7b alle drei grün; Test-Panel-UX-Befund Knopf 7 pendingBackup-Stash-Reset offen als Mini-Pflege) | Ed25519-Identität, Singleton, base64url-sha256-rawpub; +`resetIdentityCache()` aus Pflege-Sitzung 2026-05-15 (Pflicht-Hook für Apoptose-Cleanup). **Spore-JSON Optionale Felder additiv erweitert** 2026-05-15 (Spec-Sitzung Stamm/Gast): `stammCategories: string[]` + `guestCategories: string[]`, signaturpflichtig wenn vorhanden, Disjunktheit als Hosting-Pflicht (kein Verify-Abbruch). Sign-/Verify-Pfad unverändert. **`generateOwnSpore` Code-Allow-List nachgezogen** 2026-05-15 (Bau 02 Stamm/Gast): zwei Zeilen analog zu `domainKeywords` — ohne diese Pflege würden Stamm/Gast-Felder beim Andock still ignoriert. **Spec Backup-Export Stufe 2 2026-05-16** (Identitäts-Persistenz Stufe 2): zwei neue Funktionen `exportBackup(password) → Promise<SbkimBackupBlob>` + `importBackup(blob, password, options?)` (PBKDF2-SHA256 600 000 + AES-GCM-256, Klartext-Payload = Identität + Geschwister, defensiv per Default — `BackupOverwriteError`); drei §0-Konstanten verankert (`BACKUP_FORMAT_VERSION=1` / `BACKUP_KDF_ITERATIONS=600000` / `BACKUP_PASSWORD_MIN_LEN=8`); fünf neue Error-Klassen (`InvalidBackupPasswordError` / `BackupDecryptError` / `BackupVersionMismatchError` / `BackupSchemaError` / `BackupOverwriteError`). KEIN Spore-Feld dazu (Backup-Schicht separat, `PROTOCOL_VERSION` bleibt `"0.1"`). **Bau-Sitzung 02.X ausstehend**, KEIN Code in `src/modules/02_spore.js`. |
| 03 embedding | Spec fertig (2026-05-14) | Code-Stub (2026-05-14) | geprüft 2026-05-14 (Klaus) | semantischer Vektor |
| 04 match | Spec fertig (2026-05-14, Pflege Stamm/Gast-Hinweis 2026-05-15) | Code-Stub (2026-05-14) | geprüft 2026-05-14 (Klaus) | Vektorvergleich, modus-frei; Pflege-Sitzung 2026-05-14 PROVIDER_MIN_MATCH 0.55→0.80. **Karte 04 § Stamm/Gast-Hinweis 2026-05-15** (Spec-Sitzung Stamm/Gast): Match bleibt unverändert; Stamm/Gast ist Klassifikations-Schicht auf Daten-Ebene, kein Vektor-Math; explizit kein Dämpfungsfaktor, keine zweite Schwelle. |
| 05 anastomose | Spec fertig (2026-05-14, Spec BroadcastChannel-Bridge 2026-05-17) | Code-Stub (2026-05-14, Bau BroadcastChannel-Bridge 2026-05-17) | geprüft 2026-05-15 (Klaus) — 6/7 Tests grün im ersten Lauf, Test 2 Test-Bug (Tarantino-Vektor zu nah an Cocktails 0.854) in Pflege-Sitzung 2026-05-15 als Vektor-Trias repariert (3 Kandidaten parallel, Pass = ≥ 1 unter 0.80); Klaus' zweiter Lauf nach Pflege folgt; **Bau BroadcastChannel-Bridge Sichttest 2026-05-17 grün** (Klaus, Browser im Termux-`python3 -m http.server 8000`-Setup auf Galaxy Tab S6 + DeX) — Knöpfe 9 / 9a / 9b / 9c alle vier ohne Modul-Befund (Test 9 established score 0.8881; Test 9a HandshakeTimeoutError nach 4005 ms; Test 9b MissingToNodeIdError synchron; Test 9c Auto-Fallback HTTP-404→Channel etabliert score 0.8881) | Handshake; Fünf-Funktionen-API, bidirektional, kanonisch signiert, Schwelle aus Modul 04; SW Variante A (Page-Hosted) + same-origin Fallback-Transport via `BroadcastChannel('sbkim')` aus Bau-Sitzung 2026-05-17 (additiv, `options.transport ∈ {"auto","http","channel"}` mit Default `"auto"` und einmaligem Auto-Fallback bei klaren HTTP-Defekt-Signalen) |
| 06 heterokaryose | Spec fertig (2026-05-15) | Code-Stub (2026-05-15, Pflege Bau 06.1 Outbox-Lese-Pfad 2026-05-15) | rasch grob durchgeklickt 2026-05-16 (Klaus, Tab S6 + DeX) — Panel 06 14 Knöpfe Selbstchecks + Hauptpfade grün; voller Test-1–9-Lauf folgt bei Bedarf | Datenaustausch unter Geschwistern; Fünf-Funktionen-API (`init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`), Pull-Pattern, Opt-In beidseits (additiv auf `sbkim_siblings`), kanonisch wie 05/07 (vierter Sign-Pfad bewusst dupliziert), neuer Store `sbkim_hetero_inbox` (Komposit-Schlüssel `peerNodeId\|ts`, DB-Version 1→2 additiv), SW Variante A mit drittem fetch-Listener `/sbkim/heterokaryosis` (Message-Typ `SBKIM_HETEROKARYOSIS_REQUEST`); Modul 07 Cleanup-Reihenfolge nachgezogen (`sbkim_hetero_inbox` zwischen `sbkim_legacy_inbox` und `sbkim_spore`). **Anker-Quelle nach Pflege Bau 06.1 (2026-05-15): voller Outbox-Lese-Pfad implementiert** — `sbkim_hetero_outbox` (Spec-Sitzung 08, v=3-Store) wird fail-soft gelesen, max. `HETERO_MAX_ANCHORS=5` Anker absteigend nach `addedAt`; Fallback auf Spore-Single-Anker bei leerer/fehlender Outbox bestehen geblieben. `src/modules/01_storage.js` `DB_VERSION` 2 → 3 (additive Migration v=3, `STORES_V3=["sbkim_hetero_outbox"]`); Panel 06 mit 14 Knöpfen; Test 9 (`HETERO_MAX_ANCHORS`-Begrenzung) voll abgedeckt (sechs Outbox-Einträge → Response liefert genau fünf, neueste zuerst). Sichttest ausstehend (headless gebaut, wartet auf Klaus' Browser) |
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
| Rezeptbuch | https://lausiklauskn-png.github.io/Mein-Rezeptbuch/ | Kochrezepte (Stamm 7) — Drinks + Snacks als Überraschungs-Plus (Gast 11) | **integriert 2026-05-16, eigene Identität live 2026-05-16, Re-Andock 2026-05-17** (DeX-Chrome-IndexedDB-Verlust nach PR #75-Pflege, siehe § Offene Querschnitts-Fragen „DeX vs. Tablet-Chrome") · **aktuelle `nodeId: BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY`** (frischer Ed25519-Schlüssel 2026-05-17 in eigener IndexedDB `sbkim_rezeptbuch` der DeX-Chrome-Instanz; alte Tablet-Chrome-Identität `RHhposP0…` archiviert in PULS-Historie) · Spore live unter `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json` (Commit `3bcc453`) mit `domainVector[384]` · App-SW Variante 3b · Modul-05-v2 mit BroadcastChannel-Bridge eingebaut (`sbkim/05_anastomose-v2.js`, Commit `a1b9ded`). **Cross-Knoten-Handshake 2026-05-17 via Channel-Pfad etabliert** (`outcome:"established"`, score 0.9544 bidirektional, kein localStorage-Bypass mehr nötig — siehe Sitzungs-Eintrag „Live-Channel-Handshake"). `pingStatus: "live-channel"`. |
| Mixarium | https://lausiklauskn-png.github.io/Mein-Mixarium/ | Cocktails / Drinks (Stamm 8) — Knabbereien / Fingerfood (Gast 2) | **integriert 2026-05-16, eigene Identität live 2026-05-16, Re-Andock 2026-05-17** (DeX-Chrome-IndexedDB-Verlust nach PR #75-Pflege) · **aktuelle `nodeId: JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY`** (frischer Ed25519-Schlüssel 2026-05-17 in eigener IndexedDB `sbkim_mixarium` der DeX-Chrome-Instanz; alte Tablet-Chrome-Identität `7xf0tt33_…` archiviert) · Spore live unter https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json (Commit `e9d0a45`) mit `domainVector[384]` · App-SW Variante 3b (`importScripts('./sbkim-sw.js')` im bestehenden `app-sw.js`) · Modul-05-v2 mit BroadcastChannel-Bridge eingebaut (`sbkim/05_anastomose-v2.js`, Commit `9d2f127`). **Cross-Knoten-Handshake 2026-05-17 via Channel-Pfad etabliert** (`outcome:"established"`, score 0.9544 bidirektional Mixarium → Rezeptbuch). `pingStatus: "live-channel"`. |

## Offene Querschnitts-Fragen

- **DeX-Chrome vs. Tablet-Chrome — zwei getrennte Browser-Instanzen**
  (eingetragen 2026-05-17, Mini-Pflege „Live-Channel-Handshake"). Auf
  Klaus' Galaxy Tab S6 mit Samsung DeX laufen Chrome am externen
  Monitor und Chrome am Tablet-Display als **faktisch zwei getrennte
  Browser-Instanzen** — eigene IndexedDB, eigene Service-Worker, eigene
  PWA-Liste. Eine in DeX angedockte Spore-Identität ist im Tablet-Modus
  nicht da; eine im Tablet installierte PWA bleibt nach DeX-
  Deinstallation weiter da. **Konsequenz für BroadcastChannel:** Channel-
  Bridge funktioniert nur, wenn beide Tabs in **derselben** Instanz
  laufen. Klaus' Endknoten-IndexedDB war am 2026-05-17 verloren
  (Ursache nicht abschließend geklärt — vermutlich Chrome-Update,
  versehentliches „Site-Daten löschen", oder Storage-Quota), beide
  Endknoten wurden in DeX-Chrome neu angedockt mit neuen nodeIds
  (`BSWxXm…` Rezeptbuch + `JOlHK3…` Mixarium). **Generalisierung:**
  dasselbe Phänomen tritt auf bei Chrome-Profil-Wechsel, Inkognito-
  Modus, Standalone-PWA vs. Tab-Modus. Tech-Note für Andocker /
  Programmierer in [`docs/OBSERVATORIUM_BROWSER.md`](OBSERVATORIUM_BROWSER.md)
  § Lehre 1. **Status:** dokumentiert, kein Code-Eingriff nötig —
  Workaround ist Single-Instance-Disziplin oder Backup-Import.

- **SW-Bridge-Phantom-Cache-Bug in Modul 05** (eingetragen 2026-05-16,
  Live-Andock-Sitzung Cross-Knoten-Handshake; **2026-05-17 vollständig
  aufgelöst — Status: Architektur-Grenze sauber benannt, Code-Eingriffe
  abgeschlossen, Endknoten-Pflege erledigt, Live-Cross-Knoten-Handshake
  via BroadcastChannel-Pfad bewiesen**). Beim
  Cross-Knoten-Handshake via `SbkimAnastomose.handshake(peerSpore,
  ownVec)` schickt Modul 05 einen POST an `peer.endpoint +
  "/sbkim/anastomosis"`. Der Phantom-Effekt — `outcome:"rejected",
  reason:"toNodeId stimmt nicht zum Empfänger"` trotz korrekter
  Identität im aktiven Tab — hatte **zwei Wurzeln**:
  1. **`clients.matchAll({includeUncontrolled:true})`** lieferte
     Pages, die der SW nicht kontrolliert (Phantom-Cache aus
     anderen Pfaden derselben Origin). → **gefixt in PR #70
     (2026-05-17 morgens, `bd895d3`)**: `includeUncontrolled:false`
     + Loop-Logik „alle controlled Clients der Reihe nach".
  2. **`isPathSuffix` scope-unbewusst** — fing JEDEN Pfad ab, der
     auf `/sbkim/<endpoint>` endet, also auch Cross-Scope-Pfade,
     wo ein Mein-Rezeptbuch-Tab `fetch('/Mein-Mixarium/sbkim/
     anastomosis')` macht und Mein-Rezeptbuchs SW (als Controller
     des Senders) abfängt statt durchzulassen. → **gefixt in
     Pflege 2026-05-17 (dieser Eintrag, Branch
     `claude/fix-sw-scope-paths-I70qE`)**: `isOwnEndpoint(...)`
     leitet erwarteten Pfad aus `self.registration.scope` ab,
     strikte Gleichheit; Cross-Scope-Fetches fallen durch
     (→ Network → 404).
  **Spec-Klarheit (Architektur-Grenze, kein Bug):** same-origin
  cross-PWA Handshake via SW-Bridge bleibt damit **konzeptuell
  unmöglich** — Subresource-Fetches gehen durch den SW des Senders,
  nicht des Empfängers. Für Klaus' heutiges Test-Setup (beide PWAs
  auf `lausiklauskn-png.github.io`) braucht es eine andere
  Architektur. **Empfehlung für Folge-Spec-Sitzung Modul 05:**
  BroadcastChannel-Bridge als Fallback-Pfad — Sender postet Request
  auf `BroadcastChannel('sbkim')`, Receiver lauscht. Brief-Skelett
  im Übergabeprotokoll [2026-05-17 Pflege Scope-Fix](sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fix.md)
  § 7. **Erledigt (Klaus-Sichttest 2026-05-17 nachmittags):**
  Endknoten-Pflege mit File-Rename in beiden Repos (Mein-Rezeptbuch
  `cbc2531` → `sbkim-sw-v2.js`, Mein-Mixarium `9b32dc7` →
  `sbkim-sw-v24.js` + SW_VERSION-Bump); Distinguishing-Test im
  Mein-Rezeptbuch-Tab lieferte **POST → HTTP 405** und **GET → HTTP
  404** direkt von GitHub Pages (nginx-Antworten, kein Bridge-JSON
  mehr). Architektur-Grenze von beiden Seiten bestätigt.
  **Vollständig erledigt 2026-05-17 abends (Mini-Pflege „Live-Channel-
  Handshake"):** Klaus hat in DeX-Chrome beide Endknoten neu angedockt
  und neue spore.json gepusht (Mein-Rezeptbuch `3bcc453` nodeId
  `BSWxXm…`, Mein-Mixarium `e9d0a45` nodeId `JOlHK3…`). Erster regulärer
  `SbkimAnastomose.handshake(peerSpore, ownVec)`-Aufruf zwischen den
  beiden Endknoten via Eruda — **`outcome:"established"`, score 0.9544
  in beide Richtungen, `sbkim_siblings` bidirektional gefüllt, kein
  localStorage-Bypass mehr nötig.** HTTP-Pfad scheitert weiterhin mit
  405/404 von Pages, Auto-Fallback in `handshake()` greift,
  Channel-Bridge routet zwischen den beiden DeX-Chrome-Tabs derselben
  Origin. Pflege-Kette PR #65 → #70 → #71 → #72 → #73 → #74 → #75 →
  #76 → diese Mini-Pflege vollständig geschlossen.

- **`domainKeywords`-Hartkodierung in Endknoten-`sbkim-init.js`**
  (eingetragen 2026-05-16). Klaus' Mein-Mixarium-`sbkim-init.js` hat
  `domainKeywords = ["Cocktail", "Drink", "Mocktail", "Limonade",
  "Smoothie", "Aperitif", "Sake"]` hartkodiert — die echten App-
  Kategorien sind aber `stammCategories = ["Cocktails", "Mocktails",
  "Alkfr. Cocktails", "Smoothies & Shakes", "Limonaden", "Tees &
  Kaffees", "Bowlen", "Sirup & Basis"]`. „Aperitif" und „Sake" sind
  in den `domainKeywords` aber nicht als App-Ordner präsent. Klaus'
  Beobachtung (Live-Andock-Sitzung) deckt eine Inkonsistenz auf:
  `domainKeywords` sollte aus den echten App-Kategorien abgeleitet
  werden, nicht aus einer alten Zwischen-Sitzung hartkodiert. Folge-
  Pflege Mein-Mixarium-/Mein-Rezeptbuch-`sbkim-init.js`: `domainKeywords`
  aus `stammCategories`/`guestCategories` zur Init-Zeit generieren
  (z.B. via App-DB-Lookup oder mindestens als konsistente Liste).
  **Konsequenz heute:** der semantische Embedding-Vektor ist robust
  genug, dass der Cross-Knoten-Handshake trotz Inkonsistenz mit
  `outcome:"established"` läuft — aber für saubere Match-Scores in
  einem wachsenden Netz wäre die Bereinigung wertvoll. Status:
  Folge-Pflege ausstehend, niedrig priorisiert.

- **Endknoten-Repo-Hygiene gegen parallele Auto-PRs** (eingetragen
  2026-05-16). Während der Live-Andock-Sitzung lief eine PARALLELE
  Claude-Sitzung mit Branch `claude/add-recipe-remove-scramble-5xx9Y`
  und hat PR #238 „Buchstabensalat-Fix im Rezept-hinzufügen-Button"
  in Mein-Rezeptbuch gemerged. Dieser PR hatte aber eine ältere
  Basis-Version der `index.html` genommen und dabei **alle 8 SBKIM-
  `<script>`-Tags + Eruda** still entfernt. Das hat den Handshake-
  Test in Mein-Rezeptbuch ~1 h lang blockiert (SBKIM-Module gar nicht
  geladen). Nachgepflegt durch Wieder-Einfügen vor `</body>` an Zeile
  14802. **Schutz-Vorschlag (Folge-Pflege):** SBKIM-Sentinel-File in
  jedem Endknoten-Repo (z.B. `sbkim/.sentinel`) und/oder GitHub-Action
  in beiden Endknoten-Repos, die prüft: (a) `grep -c "sbkim/" index.html
  >= 8`, (b) `sbkim/sbkim-init.js` enthält `SbkimStorage.init` UND
  `SbkimAnastomose.init`, (c) `sbkim/01_storage.js` enthält `dbSuffix`.
  Soll künftige Auto-PRs auf Endknoten verhindern, die die SBKIM-
  Andock-Schicht still wegfegen. Status: Folge-Pflege-Vorschlag,
  niedrig priorisiert.

- **Sichtbarkeits-Lampen in der Endknoten-PWA** (eingetragen
  2026-05-16, Klaus-Vorschlag nach Pflege PWA-Suffix). Idee von
  Klaus: zwei kleine Lampen oben rechts in der PWA, eine zeigt
  „Knoten lebt" (Identität geladen, Storage offen, Module geladen),
  die zweite blinkt kurz bei jedem Anastomose- oder Heterokaryose-
  Verkehr („gerade kommuniziert"). Soll für Endknoten-Nutzer und im
  Observatorium **sichtbar** machen, dass das Netz lebt — viel
  zugänglicher als das 5-Klick-Doku-Fenster oder Eruda. Setzt
  Modul 00 (Doku-Fenster) als Datenquelle voraus und braucht zwei
  bis drei CustomEvents in Modul 05/06 (`sbkim:handshake-start`/
  `sbkim:handshake-end`/`sbkim:hetero-pull-start`/…). **Status:**
  Spec ausstehend; eigene kleine Karte (vermutlich Karte 15 oder
  ein additiver Block in Karte 00). Spec-Sitzung sinnvoll, **nach**
  dem ersten erfolgreichen Cross-Knoten-Handshake — dann ist klar,
  was die zweite Lampe tatsächlich anzeigen soll. Geschätzt ~60 Min
  headless für Spec, ähnlich für Bau-Stub.

- **Andock-Bundle (`sbkim-bundle.js`)** als künftiger Ein-Datei-
  Andock-Pfad (eingetragen 2026-05-16, Klaus-Vorschlag nach
  Pflege PWA-Suffix). Heutiger Karte-09-Pfad (9 Schritte mit awk,
  Termux, Eruda, Spore-mv) ist Pionier-Tanz — funktioniert für
  Klaus, aber kein Nicht-Programmierer würde das nachmachen. Vision:
  Endknoten-Betreiber kopiert **eine** Datei (`sbkim-bundle.js`) +
  fügt **einen** `<script>`-Tag ein. Das Bundle erzeugt beim ersten
  Laden Identität, Domain-Vektor, Spore, klinkt sich beim Service-
  Worker ein und macht den Status sichtbar (s. Lampen oben). **Setzt
  voraus:** drei oder mehr Endknoten im Netz, damit der Aufwand
  spürbar wird (heute mit zwei reicht der Direkt-Pfad mit Klaus).
  **Status:** Spec ausstehend; eigene Karte (vermutlich Karte 16 oder
  09.2). Ist eine echte Architektur-Frage (Bundling-Strategie,
  Versions-Update-Pfad, wie liefert der Bundle die Andock-Konfig),
  keine reine Pflege.

- ~~**Identitäts-Persistenz**~~ — **final gelöst 2026-05-16 durch
  drei aufeinander folgende Sitzungen am selben Tag** (Pflege
  Storage-Persist, Spec+Bau Backup-Export, Pflege Persistenz-
  Strategie verbinden). Klaus' Befürchtung: tiefes Browserspeicher-
  Löschen tötet die nodeId. Drei Stufen, die zusammen die echte
  „Spur stirbt nicht"-Architektur ergeben — alle drei jetzt geschlossen:
  (1) ~~**`navigator.storage.persist()`** beim `Storage.init` — bittet
  den Browser, IndexedDB von normalem Aufräumen auszunehmen.
  Modul-01-Folge-Pflege, headless möglich, ~30 Min.~~ — **gelöst
  2026-05-16 durch Pflege-Sitzung „Storage-Persist".** Modul 01
  ruft nach erfolgreichem DB-Open `navigator.storage.persist()` an
  (fail-soft); `_meta.storagePersisted` zeigt `true`/`false`/`null`
  als Live-Zustand. Details im [Übergabeprotokoll 2026-05-16 Pflege
  Storage-Persist](sessions/archiv/2026-05-16_pflege-01-storage-persist.md).
  (2) ~~**Backup-Export passwort-verschlüsselt** in Modul 02 — Klaus
  speichert eine `*.sbkim-backup.json` woanders und kann sie bei
  Browser-Wechsel zurückimportieren. Modul-02-Folge-Spec, ~60 Min.~~
  — **gelöst 2026-05-16 durch Spec-Sitzung Backup-Export Stufe 2 + Bau
  02.X Backup-Export** (selbiger Tag): Spec verankerte `exportBackup` /
  `importBackup` + drei §0-Konstanten + fünf Error-Klassen
  (PBKDF2-SHA256 600 000 + AES-GCM-256, Backup-Inhalt = Identität +
  Geschwister Pflicht-Frage 1 Variante b, Import-Überschreibung
  defensiv Pflicht-Frage 3 Variante a). Bau 02.X zog den Code
  additiv in `src/modules/02_spore.js` nach (drei Helper-Reuse-
  Entscheidungen: bestehende kanonische Sort + base64url-Helper +
  `resetIdentityCache`-Hook werden wiederverwendet, KEIN Refactoring;
  Panel 02 in `tests/manual_check.html` um drei Knöpfe „Backup
  exportieren" / „Backup einlesen" / „Identität ersetzen —
  unwiderruflich" erweitert). Details im
  [Übergabeprotokoll 2026-05-16 Spec Backup-Export](sessions/archiv/2026-05-16_spec-02-backup-export.md)
  und [Bau 02.X Backup-Export](sessions/archiv/2026-05-16_bau-02x-backup-export.md).
  **Sichttest** durch Klaus im Browser steht aus (headless gebaut —
  Tab-S6-PBKDF2-Aufruf-Zeit, AES-GCM-Verhalten in Safari iOS).
  (3) ~~**Quota-Frühwarnung im Doku-Fenster** — schon spezifiziert
  (Modul 00, `DOKU_QUOTA_WARN_RATIO=0.80` / `…_BYTES=50 MiB`); zeigt
  Warnzeile, bevor der Browser aufräumt.~~ — **final gelöst
  2026-05-16 durch Pflege-Sitzung „Persistenz-Strategie verbinden".**
  Modul 00 zeigt jetzt zusätzlich eine deutschsprachige
  „Backup empfohlen"-Tipp-Zeile (`DOKU_BACKUP_TIP_TEXT` modul-lokal),
  wenn `SbkimStorage._meta.storagePersisted === false` ODER
  `quota.warningLevel !== "none"`. `getStatusSnapshot()` spiegelt
  `storagePersisted: boolean | null` als neues Feld (fail-soft mit
  `typeof`-Check; `null` und `true` triggern nicht, nur explizites
  `false`). Hinweis-only, kein Direkt-Aufruf von
  `SbkimSpore.exportBackup` aus Modul 00 — Aufrufer-Pflicht-Trennung
  (Modul 00 bleibt reines Lese-/Trigger-Modul). **Sichttest geprüft
  2026-05-16** (Klaus, im Browser) — Drei-Setup-Probe aus Karte 00 §
  Manueller Test Punkt 7 alle drei Pfade grün (Persist-Trigger,
  Quota-Trigger, Negativ-Fall). Details im
  [Übergabeprotokoll 2026-05-16 Pflege Persistenz-Strategie
  verbinden](sessions/archiv/2026-05-16_pflege-persistenz-strategie-verbinden.md).
  **Architektur-Anmerkung:** *Nicht* als Selbst-Heilung über
  hartcodierten Schlüssel (Sicherheits-Bruch — jeder Repo-Forker
  hätte die Identität). `getOrCreateIdentity` legt bei leerem
  Storage eine **neue** Identität an (neue nodeId); erhalten bleibt
  der alte Knoten nur über Backup-Restore. Die Tipp-Zeile macht den
  Restore-Pfad sichtbar, klickt aber den Panel-02-Knopf nicht
  automatisch.

- ~~**IndexedDB-Origin-Kollision bei GitHub-Pages-Project-Sites**~~ —
  **gelöst 2026-05-16 durch Pflege-Sitzung „Karten 01 + 09 PWA-
  Suffix".** Variante (a) aus dem ursprünglichen Eintrag (PWA-Suffix
  in Storage-DB-Name) umgesetzt: Modul 01 akzeptiert jetzt optional
  `init({ dbSuffix: "<wert>" })` und öffnet die DB unter dem Namen
  `sbkim_<dbSuffix>` statt der Default-DB `sbkim`. Pattern für
  Suffix: `^[a-z0-9_-]+$` (sonst synchroner `InvalidDbSuffixError`).
  Modul 02 unangetastet (`IDENTITY_KEY = "main"` weiterhin Singleton-
  Schlüssel innerhalb der jeweiligen DB — Trennung passiert eine
  Schicht tiefer, auf DB-Namen-Ebene). Modul 05 unangetastet
  (`SbkimAnastomose.init()` weiterhin ohne Optionen; Idempotenz von
  `Storage.init` macht den zwei-Aufruf-Pfad sauber). Karten 01 + 09
  + INTERFACES.md §1 Modul 01 + §6 nachgezogen. `PROTOCOL_VERSION`
  bleibt `"0.1"`. Klaus' Re-Andock beider Endknoten (in beiden
  `sbkim-init.js` `SbkimStorage.init({dbSuffix})` vor
  `SbkimAnastomose.init()` einfügen + `__sbkimErzeugeSpore()`
  triggern + neue Spore deployen) steht aus — danach wechselt
  `status.json` `pingStatus` von `"blocked-origin-collision"` auf
  `"live"` für beide Endknoten in einer Folge-Sitzung. Variante
  (b) (eigene Subdomain mit Custom Domain) bleibt als langfristige
  Option dokumentiert. Details im
  [Übergabeprotokoll 2026-05-16 Pflege PWA-Suffix](sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md);
  Reproduktion der ursprünglichen Kollision im
  [Übergabeprotokoll 2026-05-16 Andock Mein-Rezeptbuch](sessions/archiv/2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md).
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
- ~~**Spore-Persistenz-Strategie verteilt**~~ — **final gelöst
  2026-05-16 durch die vier aufeinander folgenden Sitzungen zur
  Identitäts-Persistenz** (Pflege Storage-Persist, Spec+Bau Backup-
  Export, Pflege Persistenz-Strategie verbinden). „Stille Löschung
  ohne Vermächtnis" (Karte 07 § Risiken) war nicht in einem
  einzelnen Modul lösbar — vier Stellen mussten beim Bauen
  zusammenpassen; alle vier stehen jetzt:
  - ~~**Modul 01 Storage:** `navigator.storage.persist()` beim `init()`
    + `navigator.storage.estimate()` für Quota-Frühwarnung —
    offen.~~ — **gelöst 2026-05-16** (Pflege Storage-Persist):
    `navigator.storage.persist()` fail-soft im Init-Pfad,
    `_meta.storagePersisted` als Live-Zustand-Getter. Quota-Estimate
    liegt seit Bau 00 (2026-05-14) in Modul 00.
  - **Modul 02 Spore:** Backup-Export (passwort-verschlüsselt) als
    Recovery-Pfad für Browser-Wechsel und manuelles Löschen —
    **Spec fertig 2026-05-16** (Spec-Sitzung Backup-Export Stufe 2):
    `SbkimBackupBlob`-Format (PBKDF2-SHA256 mit `BACKUP_KDF_ITERATIONS=600000`
    + AES-GCM-256), Klartext-Payload = Identität + bekannte Geschwister
    (Pflicht-Frage 1 Variante b), Import per Default defensiv
    (`BackupOverwriteError`, Pflicht-Frage 3 Variante a), drei
    §0-Konstanten verankert. **Code-Stub fertig 2026-05-16** (Bau 02.X
    Backup-Export, selbiger Tag): additiv in `src/modules/02_spore.js`
    — fünf Error-Klassen + drei modul-lokale Konstanten + drei §0-
    Konstanten gespiegelt + neuer Closure-Helper
    `derivePbkdf2AesGcmKey` (PBKDF2 → AES-GCM-256); drei Helper-Reuse-
    Entscheidungen (`canonicalize`/`canonicalJsonBytes`, `base64urlEncode`/
    `Decode`, `resetIdentityCache`) — kein Refactoring der bestehenden
    Funktionen. Panel 02 in `tests/manual_check.html` um drei Knöpfe
    erweitert (Export / Einlesen / Identität-ersetzen-force).
    Sichttest durch Klaus im Browser steht aus.
  - **Modul 00 Doku-Fenster:** stille Frühwarnung bei < X% Speicher
    (X als gemeinsame Konstante in §0) — **gelöst 2026-05-14 durch
    Spec-Sitzung 00:** `DOKU_QUOTA_WARN_RATIO = 0.80` UND
    `DOKU_QUOTA_WARN_BYTES = 52428800` (50 MiB) verbindlich in §0
    eingetragen (Doppel-Schwelle; Warnzeile bei Überschreitung einer
    der beiden). Konsistenter Schwellwert-Anker für Modul 01 und
    Modul 02. **Plus Pflege Persistenz-Strategie verbinden 2026-05-16:**
    Modul 00 zeigt jetzt zusätzlich eine deutschsprachige
    Backup-Tipp-Zeile (`DOKU_BACKUP_TIP_TEXT` modul-lokal), wenn
    `_meta.storagePersisted === false` ODER `quota.warningLevel !==
    "none"`. `getStatusSnapshot()` spiegelt `storagePersisted` als
    neues Feld (fail-soft). Hinweis-only, kein Direkt-Aufruf von
    `SbkimSpore.exportBackup` aus Modul 00.
  - **Modul 07 Apoptose:** Risiko-Vermerk „stille Löschung" (steht
    jetzt in Karte 07 § Risiken).

  **Die vier Stellen sind jetzt konsistent:** Quota-Schwellwert (zwei
  Zahlen in §0, Modul 00 Code-Befehl), Backup-Format (`SbkimBackupBlob`
  PBKDF2/AES-GCM, Modul 02 Code + Panel 02), Warntext (`DOKU_BACKUP_
  TIP_TEXT` deutsch, Modul 00), Risiko-Vermerk (Karte 07 § Risiken).
  Sichttest durch Klaus im Browser steht für Modul 02 + Modul 00 noch
  aus (beide headless gebaut).
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

## Vision-Anker (langfristig, kein Bau-Auftrag)

**Was ist das?** Visionen, die in Sitzungen aufgekommen sind und
nicht verloren gehen sollen, ohne dass sie sofort Spec oder Bau
auslösen. Sie warten auf eine Reifezeit oder einen passenden
Auslöser. Pflege-Disziplin: Vision wird hier festgehalten, mit
Datum + Sitzungs-Bezug + ungefährer Größenordnung. Wer sie ziehen
will, formuliert daraus einen Spec-Sitzungs-Brief.

### 2026-05-17 · Sage als Hybrid-Knoten (Variante I)

**Eingetragen:** Mini-Pflege „Vision-Anker" 2026-05-17 (Folge zu
Live-Channel-Handshake, PR #77 `7c08b88`). Klaus' Bild: die
Ameisenkönigin bleibt eine Ameise, auch wenn sie sich nicht vom
Fleck bewegt. Sage-Protokol kann Hub bleiben **und** zugleich ein
vollwertiger Endknoten werden — selbstreferenziell wie ein Mycel,
das seine eigene Karte ist.

**Was sich ändert (Spec-Sitzungs-Aufgabe, nicht jetzt umsetzen):**

- **CLAUDE.md** umschreiben — Satz „Es ist kein Endknoten" fällt;
  Sage wird als „Hub und Knoten zugleich" neu eingeführt.
- **INTERFACES.md § Endknoten-Liste** nimmt Sage als dritten Knoten
  auf, neben Mein-Rezeptbuch und Mein-Mixarium.
- **`status.json` § endknoten** bekommt einen `sage`-Eintrag mit
  eigener Domäne, nodeId (nach erstem Andocken), `pingStatus`.
- **Sage-Page (`index.html`)** muss alle SBKIM-Module mit voller
  `init()`-Kette laden (aktuell vermutlich nur Doku-Render). Modul
  03 Embedding (~30 MB) lädt erst beim ersten Andocken — UX-
  Vorwarnung in der Andock-Geste.
- **Sage's Domäne klären:** `domain` / `domainDescription` /
  `domainKeywords` / `domainVector`. Vorschläge im Spec-Brief:
  „Mycel-Bibliothek" / „SBKIM-Glossar" / „Sage-Observatorium".
  Stamm-/Gast-Kategorien? Brieferer Vorschlag: Stamm = Protokoll-
  Doku / Mycel-Vokabular; Gast = Glossar-Wartung / Schwesternetz-
  Beobachtungen.
- **IndexedDB-Suffix `sbkim_sage`** (analog `sbkim_rezeptbuch` /
  `sbkim_mixarium`).
- **App-SW-Variante 3a** (Standalone `sbkim-sw.js` im Sage-Page-
  Root, weil aktuell kein App-SW existiert).
- **Schwarz-Loch-Karte:** Klick könnte zukünftig nicht nur die
  Doku-md öffnen, sondern auch einen Andock-Wizard für Sage's
  Spore-Erzeugung anbieten (Hand in Hand mit Variante III unten).
- **Karte 09 § Schritt 1** wird neu eingefügt: „Sage-Observatorium
  selbst ist auch ein Endknoten — wer sich am Sage-Mycel andockt,
  bekommt es als Geschwister."

**Größenordnung:** Spec-Sitzung erster Aufgabe ~3-4 Stunden für
gründliche Klärung (kein Bau-Code, nur Verträge); danach Bau-
Sitzung ~2-3 Stunden für Sage-Page-Refactor + SW-Anlage + Andock-
Geste.

**Status:** **Strang 1 der V1-Sammelspec realisiert (2026-05-18, Brief
01 der V1-Sammelspec-Kaskade)** — Sage als dritter Endknoten in
INTERFACES §6 Endknoten-Liste + §6.1 Sage-Page-Architektur aufgenommen
(Domäne `Mycel-Bibliothek`, IndexedDB-Suffix `sbkim_sage`, App-SW
Variante 3a, volle init()-Kette mit lazy Modul-03, Andock-Geste an
Schwarz-Loch-Karte als Wizard-Hinweis). CLAUDE.md auf „Hub und Knoten
zugleich" umgeschrieben, Karte 09 § Schritt 1 erweitert, `status.json`
um `sage`-Endknoten-Eintrag (`pingStatus:"pending-first-andock"`,
`nodeId:null`) ergänzt. `PROTOCOL_VERSION` bleibt `"0.1"` (additiv).
Restliche Stränge laufen in Brief 02 (Plattform-Matrix), Brief 03
(M04-Erweiterung) und Brief 04 (Multi-Identität); Sage-Page-Refactor
(volle init()-Kette + Andock-Wizard in `index.html`) folgt als Bau-
Sitzung über `BRIEF_99_SAMMELSPEC_ABSCHLUSS`, sobald die Kaskade
schließt.

### 2026-05-17 · Niedrigeres Onboarding (Variante III-Ausbau)

**Eingetragen:** Mini-Pflege „Vision-Anker" 2026-05-17. Klaus'
Kritik trifft hart und stimmt: **Karte 09's 9 Schritte schrecken
ab.** Wer SBKIM ausprobieren will, ohne Klaus-Niveau zu haben,
scheitert vermutlich an Schritt 3 (Service-Worker) oder Schritt 5
(Embedding-Setup). Verbreitung steht im Konflikt mit Andock-Hürde.

**Drei Ausbau-Pfade als langfristiger Plan:**

1. **Andock-Wizard als Standalone-PWA.** Eine eigene Page (z.B.
   `https://lausiklauskn-png.github.io/Sage-Protokol/andock/`)
   führt durch alle 9 Schritte als geführte UI, mit Pre-Flight-
   Checks und Auto-Generierung der Endknoten-Repo-Dateien.
   Klaus' Worte: „klick hier und da, dann bekommst du Spore und
   Knoten".
2. **SBKIM-PWA-Distribution mit GitHub-Identität als Geschenk-
   Paket.** Eine GitHub-Action erzeugt für einen Nutzer
   automatisch ein Endknoten-Repo (Fork eines Templates), inkl.
   konfigurierter Spore-Identität, gebrandet auf den GitHub-User-
   Namen als Identitäts-Brücke. Wer „SBKIM-Knoten werden"
   klickt, hat 30 Sekunden später eine eigene Pages-PWA live.
3. **Eigener Browser-Wrapper (Fern-Vision).** Eine Electron- /
   Tauri- / Capacitor-PWA mit SBKIM eingebacken — eigener
   „agressiverer" Browser (Klaus' Wortwahl), der die Browser-
   Eigenheiten aus § Browser-Observatorium umgeht (keine
   IndexedDB-Reklamation, kein DeX/Tablet-Split, keine SW-
   Cache-Verwirrung). Sehr ambitioniert, vermutlich nur nach
   Variante 2-Reifezeit denkbar.

   > **2026-05-18 · Konkretisierung Mini-Browser-Pfad:** Realisierbar
   > mit **Tauri** (Rust + System-WebView, ~10-30 MB Binaries für
   > Windows/macOS/Linux aus einer Codebase) — schlanker als Electron
   > (~80-200 MB) und nicht „eigener Browser von Grund auf"
   > (Chromium-Code ~30 Mio Zeilen, unrealistisch). Liefert: eigene
   > IndexedDB im App-Daten-Verzeichnis (kein Browser-Reklamations-
   > Risiko, löst Lehre 1 + Spore-Verlust 2026-05-17), Tray-Icon-Modus
   > für Hintergrund-Empfang (Antwort auf Anker 4 Königin-Frage „wer
   > empfängt, wenn der Tab zu ist"), Doppelklick-Installer (`.msi` /
   > `.dmg` / `.AppImage`). **Onboarding-Bild:** 1 Klick Installer →
   > Tray-Icon → empfangsbereit, ~2 Minuten von Link bis Knoten.
   > **Mobile bleibt außen vor** — Tauri ist Desktop-only; für
   > Android/iOS bräuchte es Capacitor (separate Initiative). **Drei
   > gleichwertige Onboarding-Pfade** (Klaus 2026-05-18): Wizard
   > (Pfad 1, browserintern, ~5-8 Min), GitHub-Generator (Pfad 2,
   > eigene Pages-URL, ~10-15 Min), Mini-Browser (Pfad 3, Desktop-
   > App, ~2 Min) — Karte 09 zeigt alle drei, Interessent wählt selbst.
   > **Plattform-Architektur, Stack-Trade-offs, Verbindung zu V4/V5/V7
   > vertieft als eigener Vision-Anker 8** (Folge-Pflege 2026-05-18,
   > diese Notiz hält nur die Pfad-Optik fest).

**Verhältnis zu Modul 10/11/12:** Sobald SBKIM-Distribution für
Nicht-Klaus-Kreise relevant wird, werden die Schutz-Backlog-
Module **akut** (Reputation, Rate-Limit, Blocklist) — heute
schlummern sie als Stubs, weil das Netz klein und vertrauenswürdig
ist. Wer SBKIM in die Welt entlässt, muss diese drei vorher bauen.

**Größenordnung:** Variante 1 wäre ~10-15 Stunden (UX + Code +
Test). Variante 2 ~15-25 Stunden (GitHub-Action-Template + Repo-
Generator + Onboarding-Flow). Variante 3 ist eine eigene Bau-
Saison, nicht in Stunden messbar.

**Status:** Reif für Vor-Diskussion, aber nicht für Spec.

### 2026-05-17 · Browser-Observatorium-Universum (visuelle Variante)

**Eingetragen:** Mini-Pflege „Vision-Anker" 2026-05-17. Aus dem
Stil-Sitzungs-Gespräch zur Schwarz-Loch-Karte (PR #77): das
Browser-Observatorium kann nicht nur als Markdown-Doku in
`docs/OBSERVATORIUM_BROWSER.md` leben, sondern als **bildlich-
animiertes Mini-Universum** in der Sage-Page direkt.

**Konzept-Skizze:**

- **Eigener Screen `screen-observatorium`** in der Sage-Page,
  analog zu `screen-cycle`, `screen-module`, `screen-data`,
  `screen-warum`. Erreichbar durch Klick auf die Schwarz-Loch-
  Karte (anstelle der direkten GitHub-Navigation).
- **Sieben Sterne / Galaxien** für die sieben Lehren — jeder mit
  zartem Twinkling (CSS-Keyframes mit `opacity`-Pulse + leichter
  `box-shadow`-Atmung) und Parallax bei Maus-Bewegung
  (`requestAnimationFrame`-geglättet, Tiefen-Ebenen ähnlich wie
  in Mac-/Linux-Desktop-Hintergründen). Galaxien für die
  größeren Lehren (Browser-Instanzen, IndexedDB), Sterne für die
  schmaleren (Eruda, Termux). Label-Tags beim Hover.
- **Nebel-Hintergründe** als gestapelte `radial-gradient`s mit
  `mix-blend-mode: screen`, Sage-Theme-Farben (Cyan + Lila +
  Gold). Drift-Animation ~120 s, wirkt lebendig ohne Hektik.
- **Klick auf einen Stern** öffnet ein Lehre-Modal — gerenderter
  Text aus der `OBSERVATORIUM_BROWSER.md`, eingebettet in einen
  kleineren Nebel (Teleskop-Zoom-Effekt). Esc / Klick außerhalb
  schließt zurück zum Universum.
- **„Reiner Text"-Link** in einer Ecke des Universum-Screens als
  Wahl für Programmierer-Direktzugriff zur md.
- **Tablet-/Touch-tauglich:** Sterne klickbar, Parallax via
  `DeviceOrientationEvent` auf Mobile (subtile Neigungs-
  Sensitivität). `prefers-reduced-motion: reduce` respektiert.
- **Wahrheits-Quelle bleibt die md.** Universum liest die md
  clientseitig mit minimalem md-Parser (~80 Zeilen JS, keine
  externe Bibliothek wie `marked.js` — Single-File-PWA-Stil ist
  Konvention). Pflege geht in der md; jede neue Lehre dort wird
  automatisch zu einem neuen Stern.

**Pädagogischer Hintergrund:** Klaus' Beobachtung — komplexe
Themen durch Bilder zugänglich machen, ohne den Text-Pfad zu
verlieren. Spricht jüngere Leser und Bilder-Menschen an, die
sich von reinen Tech-Notes abschrecken lassen würden. Pflegt sich
automatisch, sobald die md-Quelle gepflegt wird.

**Größenordnung:** Eigene Bau-Sitzung „Browser-Observatorium-
Universum", ~6-10 Stunden für den initialen Bau (Layout + sieben
Sterne + Modal + minimaler md-Parser + Touch-Anpassung). Iteration
nötig — visueller Eindruck zeigt sich erst beim Testen.

**Status:** Reif für eigene Bau-Sitzung, jederzeit zwischen V1
und V3-Bau einschiebbar.

### 2026-05-17 · Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister

**Eingetragen:** Mini-Pflege „Vision-Anker Königin-Relay" 2026-05-17
(Folge zu Bau Browser-Observatorium-Universum, PR #79 + Lehre 8,
PR #80 + Cursor-Variante PR #81). Klaus' fundamentale Architektur-
Frage nach den Pages-Live-Tests: **„Was, wenn ich einmal Browser A
nehme und ein andermal Browser B? Ist die Spore nur zu finden, wenn
der Browser offen ist? Ist sie empfangsbereit, wenn der Browser
nicht geöffnet ist?"**

Ehrliche Antwort: aktuelle SBKIM-Architektur sagt **„Wer nicht da
ist, schweigt"** (Empfangsmodus-Prinzip aus dem SBKIM-Paper). Browser-
PWAs sind nicht für dauerhaft laufende Dienste gebaut — Pages leben
nur solange die Tabs offen sind, Service-Worker werden nach Stunden
suspendiert. Browser-Wechsel = neue Identität (IndexedDB ist pro
Browser-Instanz). Das ist konzeptuell sauber für ein peer-to-peer
Mycel, aber eine harte Grenze für Verbreitung.

Klaus' Bild: **Königin wie bei Bienen.** Eine Königin ist Bezugspunkt,
nicht Daten-Eigentümer. Übertragen auf SBKIM könnte das ein
**„Königin-Relay" als optionales neues Modul (13?)** sein.

### Modell

- Eine Königin ist eine **Mailbox** für Geschwister.
- Sie speichert **nicht** private Schlüssel — nur **verschlüsselte
  Handshake-Envelopes** (Public-Key-Verschlüsselung mit dem
  Empfänger-publicKey, sodass nur dieser sie öffnen kann).
- Wenn Knoten A handshaken will mit B, und B ist offline → A schickt
  verschlüsselten Envelope an die Königin → Königin hält ihn fest →
  B kommt nächstes Mal online → fragt bei der Königin „Post für
  mich?" → bekommt den Envelope → entschlüsselt mit eigenem privaten
  Schlüssel → antwortet.
- **Privacy gewahrt:** Königin sieht nur verschlüsselte Daten,
  nicht den Inhalt.
- **Optional:** Knoten ohne Königin-Anbindung funktionieren wie
  bisher (direkter Channel-Bridge, same-instance). Königin ist
  „kann", nicht „muss".
- **Mehrere Königinnen möglich** → kein Single Point of Failure.
  Knoten registriert sich bei `N` Königinnen seines Vertrauens.
- **Analogie:** E-Mail-Relay, Matrix-Server, Bluesky-Relay — alle
  privacy-wahrend, alle Mailbox-Buffer-Modelle.

### Implementations-Optionen

1. **Server-Königin:** Node.js / Python / Go-Server, klassische
   Backend-Architektur. Wer hostet? Klaus selbst auf einem Raspi,
   ein Verein, ein Hoster. Geld + Vertrauen erforderlich.
2. **PWA-Königin mit Push-API:** browserseitige Königin, läuft im
   Service-Worker mit WebPush-Notifications. Komplexer, aber
   serverlos auf manchen Hostern. Push-Triggers können den
   Receiver-Tab automatisch öffnen.
3. **Eigenes-Gerät-Königin:** Klaus' Raspi zuhause mit immer-online
   Status. Selbst-souverän, aber technisch anspruchsvoll.

### Anknüpfung an V1 (Sage als Hybrid)

V1 macht Sage zu einem Knoten — das ist ein **erster Schritt in
Königin-Richtung.** Wenn Sage selbst Mailbox-Funktion bekäme, wäre
sie die erste Königin. Aber Sage liegt auf GitHub Pages — statisch,
kann nicht aktiv empfangen. Eine echte Königin braucht einen aktiv
laufenden Prozess. V1 ist daher Vorbereitung, nicht selbst Königin.

### Was Königin-Relay LÖST

- Empfang ohne offene Tabs (Mailbox puffert)
- Browser-Wechsel-Problem (Identität bleibt portabel über `exportBackup`,
  Königin-Verbindung über die Identität)
- Reputation / Schutz-Backlog (Module 10/11/12) könnten am Königin-
  Layer leben

### Was Königin-Relay BEDINGT (Trade-offs)

- **Privacy-Annahmen:** Königin kann Metadaten sammeln (wer schreibt
  wann an wen). Kein perfektes Privacy-Modell, aber besser als zentraler
  Server mit Klartext.
- **Hosting-Frage:** wer betreibt Königin-Knoten? Vertrauen + Geld.
- **Single Point of Failure** nur wenn jemand sich auf nur eine
  Königin verlässt. Mit `N`-Königin-Strategie vermieden.
- **Implementations-Aufwand:** signifikant, vermutlich >50 Stunden
  für initiale Spec + Bau + Königin-Implementierung.

### Status

**Reif für Spec-Sitzung-Diskussion**, aber NICHT für sofortige
Spec-Sitzung. Wartezeit empfohlen, damit:

- V1 (Sage als Hybrid) erst spezifiziert + gebaut wird → Sage-als-
  Knoten-Erfahrung sammeln
- IndexedDB-Persist-Schutz (Mini-Pflege offen) ergibt Praxis-Daten
  über Identitäts-Stabilität
- Klaus' Klarheit über Königin-Vertrauen-Modell reift (wer betreibt?
  Wer vertraut wem? Mehrere Hosts oder einzeln?)

Spec-Sitzung-Aufgabe **nach** der V1-Sage-Hybrid-Spec, NICHT
parallel.

### 2026-05-17 · Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser

**Eingetragen:** Mini-Pflege „Vision-Anker Königin-Relay" 2026-05-17,
Folge-Frage Klaus: „und die mitgeführte eigene Mini-Browser-Version
geht wirklich nicht effektiv, oder sowas wie ein Rucksack oder Safe
oder Chipkarte mit der ich mich beim Aufwachen oder Anmelden neu
identifiziere?"

Die Antwort hat **vier Konzept-Pfade**, die SBKIM in unterschiedlichen
Tiefen erweitern könnten:

1. **Rucksack/Safe (Datei) — schon implementiert.** Modul 02 hat
   `SbkimSpore.exportBackup(password)` + `importBackup(blob, password)`
   seit Bau 02.X (PR mit dem Identitäts-Backup-Stufe-2-Modul). Der
   Backup-Blob ist eine `.json`-Datei, PBKDF2-SHA256-600.000-Runden +
   AES-GCM-256-verschlüsselt. Was fehlt: **UX-Konzept eines
   „Identitäts-Containers"** — der Backup-Blob als „digitaler
   Reisepass", den Klaus auf USB / Cloud / lokal trägt. Beim Anmelden
   in einem neuen Browser: Datei rein, Klaus ist wieder er selbst.
   **Mini-Pflege „Identitäts-Container-UX"** könnte das polieren:
   sprechender Dateiname (z.B. `klaus-spore-2026-05-17.json`),
   Hinweis-Pfad im Doku-Fenster („Backup machst du regelmäßig"), Datei-
   Schloss-Visualisierung.

2. **Chipkarte / Hardware-Wallet — Hardware-basiert.** WebAuthn /
   FIDO2 ist der Browser-Standard für Hardware-/Biometrie-basierte
   Authentifizierung. Der private Schlüssel liegt im Sicherheits-
   Modul des Geräts (Smartphone-Secure-Enclave, YubiKey, Trezor) und
   verlässt es nie. SBKIM-Identität könnte WebAuthn-basiert sein
   statt IndexedDB-basiert — Identität ist an Hardware gebunden,
   nicht an Browser. Aber: WebAuthn ist primär für Login-Auth, nicht
   für signierte Mycel-Nachrichten. Anpassung nötig. **Größere
   Spec-Initiative**, vermutlich Modul 14 oder höher.

3. **Mini-Browser (Variante III aus bestehendem Vision-Anker).**
   Native App-Wrapper (Tauri / Electron / Capacitor) mit
   eingebakkener Identität. App läuft im Hintergrund, persistent,
   empfängt auch bei „aufgewachtem" Gerät ohne offene Tabs. **Schon
   als Vision-Anker drin (Variante III-Ausbau, dritter Pfad).** Diese
   Frage bestärkt: Mini-Browser ist nicht nur Onboarding-Hilfe,
   sondern auch **Hintergrund-Empfänger** und **Identitäts-Container.**

4. **Passkey-Sync (modern).** Apple iCloud-Keychain, Google Password
   Manager, 1Password synchronisieren Passkeys plattformübergreifend.
   Wer in einem Browser angemeldet ist, hat dort automatisch Zugriff
   auf seine Identitäten. Wäre eine **plattform-abhängige** Lösung
   (Apple ↔ Apple, Google ↔ Google), kein peer-to-peer, aber sehr
   pragmatisch für die meisten Nutzer.

### Verbindung zu Königin-Relay (Anker oben)

Königin-Relay und Identitäts-Container lösen unterschiedliche
Probleme:

- **Königin-Relay:** **„Wie empfange ich, wenn der Browser nicht
  offen ist?"** → Mailbox-Modell, ein Knoten irgendwo ist online
  und puffert verschlüsselte Envelopes
- **Identitäts-Container:** **„Wie nehme ich meine Identität von
  Browser A zu Browser B mit?"** → Datei / Hardware / Sync

Sie können kombiniert werden: Klaus' Identität liegt als Backup-Datei
(Rucksack), er importiert sie bei jedem neuen Browser-Anmeldung, und
seine Königin (verschlüsselte Mailbox) hat die ausstehenden Handshakes
für ihn parat.

### Status

Pfad 1 (Rucksack-UX): **Mini-Pflege möglich** ohne große Architektur-
Änderung. Sinnvoller Folge-Schritt nach Storage-Persist-Schutz.

Pfade 2/3/4: **Spec-Sitzungs-Diskussionen**, jeweils signifikanter
Aufwand. Reihenfolge:
- Pfad 3 (Mini-Browser) zuerst — schon als V3-Ausbau-Vision drin,
  kombiniert mit dem Onboarding-Wizard.
- Pfad 4 (Passkey-Sync) als pragmatische Brücke — vermutlich
  zwischen V3-Mini-Browser-Spec und Königin-Relay-Spec.
- Pfad 2 (Hardware-Wallet) als ferne Vision — nur falls SBKIM in
  einem sicherheits-kritischen Kontext eingesetzt würde.

**Status:** Reif für Vor-Diskussion, **nicht** für Spec. Wartet auf:
- V1-Sage-Hybrid-Erfahrung
- Storage-Persist-Schutz-Praxis (Mini-Pflege offen)
- Klaus' Bauchgefühl, welcher Pfad sich am stimmigsten anfühlt

### 2026-05-18 · Multi-Identität in der IndexedDB (Modul 02 Erweiterung)

**Eingetragen:** Mini-Pflege „Vision-Anker Multi-Identität" 2026-05-18.
Klaus' Folge-Gedanke nach dem Schlaf, klar abgegrenzt zu Lehre 1
(Browser-Instanzen-Trennung). Worüber Lehre 1 als **Verlust-Risiko**
sprach (zwei Browser-Instanzen erzeugen ungewollt zwei separate
Identitäten), wird hier als **Feature** umgekehrt: **bewusst mehrere
Identitäten in derselben IndexedDB**.

Klaus' Bild: „mehrere Identitäten in mehreren Ebenen im Browser oder
auf dem Tablet oder im Rechner, je nach Arbeitsoberfläche."

### Konzept

- **Heute:** Modul 02 hat einen Singleton-Slot `sbkim_keys["main"]`.
  Eine PWA = eine Identität pro Browser-Instanz.
- **Vision:** Modul 02 unterstützt **mehrere Identitäten** in derselben
  IndexedDB:
  ```
  sbkim_keys["main"]       → Klaus' Default-Identität
  sbkim_keys["beruflich"]  → Klaus' berufliche Persona
  sbkim_keys["test"]       → Test-Knoten
  ```
  Plus aktive-Identität-Marker `sbkim_meta["active-identity"]`, der
  bestimmt, welche Identität Module 05/06/07 gerade nutzen.

### Schritte (Spec-Aufgabe — nicht jetzt umsetzen)

- **Modul 02 erweitern:**
  - `getOrCreateIdentity(key?)` (Default `"main"`)
  - `setActiveIdentity(key)` (wechselt aktive Identität)
  - `listIdentities()` (alle vorhandenen)
  - `removeIdentity(key)` (vorsichtig, mit Bestätigung)
- **Aktive Identität als Konvention:** Module 05/06/07 lesen
  `sbkim_meta["active-identity"]` und verwenden den entsprechenden
  Identitäts-Slot.
- **UI zum Wechseln:** im Doku-Fenster oder als eigener Identity-
  Picker; vielleicht im Universum als „Welche-Identität-bin-ich"-
  Bewegung in der Sage-Page.
- **Pages-`spore.json`:** kann nur eine Identität öffentlich
  darstellen. Optionen:
  - Nur aktive Identität in `spore.json`
  - Liste-Schema (mehrere Identitäten, peer findet die passende
    über `toNodeId`-Filter)
- **Geschwister-Netze pro Identität:** Modul 05 muss `sbkim_siblings`
  pro Identitäts-Slot verwalten — `sbkim_siblings_main`,
  `sbkim_siblings_beruflich` etc.

### Trade-offs

- **IndexedDB-Verlust löscht alle Identitäten gleichzeitig** — kein
  Backup-Schutz gegenüber Browser-Reklamation. Daher Vision-Anker 5
  (Identitäts-Container) als Backup-Strategie bleibt parallel sinnvoll.
- **Verwirrungs-Risiko:** welche Identität ist gerade aktiv? UI muss
  das klar machen.
- **Spec-Aufwand:** signifikant — Modul 02 grundlegend erweitert,
  Module 05/06/07 ziehen nach. ~3-5 Stunden Spec, ~10-15 Stunden Bau.

### Verbindung zu anderen Vision-Ankern

- **V1 (Sage als Hybrid-Knoten):** Sage selbst könnte mehrere
  Identitäten haben — Hub-Identität für Spec-Verträge, Endknoten-
  Identität für Mycel-Beziehungen, Glossar-Identität für
  Wörterbuch-Pflege.
- **V3 (Niedrigeres Onboarding):** Multi-Identität-Wahl als Teil
  des Andock-Wizards. Andocker entscheidet beim ersten Klick:
  „eine Identität oder mehrere Personae?"
- **V4 (Königin-Relay):** Königin muss pro-Identität-Mailboxes
  verwalten. Klaus' Königin sieht: „Post für `klaus-beruflich`",
  „Post für `klaus-test`".
- **V5 (Identitäts-Container):** jeder Backup-Container könnte
  mehrere Identitäten enthalten. „Klaus' kompletter Rucksack" =
  alle Identitäten in einer Datei.

### Status

**Strang 3 der V1-Sammelspec realisiert (2026-05-19, Brief 04 der V1-
Sammelspec-Kaskade).** INTERFACES.md § 9 „Identitäts-Map (Multi-
Identität, Brief 04)" als verbindliche Spec-Klausel (sieben Sub-§ von
Slot-Schema bis M04-Verbindung); Modul 02 um fünf neue / erweiterte
API-Funktionen erweitert (`getOrCreateIdentity(key?)`,
`setActiveIdentity(key)`, `getActiveIdentityKey()`, `listIdentities()`,
`removeIdentity(key, options?)`); identitäts-spezifische Stores pro
Persona (`sbkim_siblings_<key>`, `sbkim_anastomosis_log_<key>`,
`sbkim_legacy_inbox_<key>`, `sbkim_hetero_inbox_<key>`,
`sbkim_hetero_outbox_<key>`); Persona-Isolation als verbindliche
Klausel (ein Geschwister gehört einer Persona, nicht dem ganzen
Knoten); Strategie A für Pages-`spore.json` gewählt (nur aktive
Identität, `PROTOCOL_VERSION` bleibt `"0.1"`); Strategie B als Folge-
Spec-Option benannt (Bump auf 0.2, NICHT gewählt). Apoptose-Granularität
entschieden: `confirmSelfApoptose` global, per-Persona-Apoptose über
`SbkimSpore.removeIdentity(key, {force:true})` mit internem Hook
`_sendLegacyForIdentity` in Modul 07. Multi-Identitäts-Backup
„kompletter Rucksack" als Empfehlung verankert; `BACKUP_FORMAT_VERSION`-
Bump 1→2 für die Bau-Folge-Sitzung 02.Y vermerkt (KEIN
`PROTOCOL_VERSION`-Eingriff). BRIEF_99 (Sammelspec-Abschluss) als
Folge-Sitzung in der Kaskade. Bau-Folge-Sitzungen (01.Y, 02.Y, 05.Y,
06.Y, 07.Y) warten auf BRIEF_99-Abschluss.

### 2026-05-18 · SBKIM-Browser-Extension — „Lampe in der Toolbar"

**Eingetragen:** Mini-Pflege „Vision-Anker Extension" 2026-05-18.
Klaus' Folge-Vision parallel zur Multi-Identität-Idee (Anker 6),
gleicher Tag, gleicher Schlaf-Klarheit-Moment: ein **kleines Tool
oben in der Browser-Navigationsleiste**, das den SBKIM-Status
sichtbar macht.

### Konzept

Zwei Lampen am Toolbar-Icon:

1. **Status-Lampe:** zeigt, dass das Protokoll lebt — Spore
   existiert, Knoten empfangsbereit. Grün/grau (an/aus).
2. **Aktivitäts-Lampe:** zeigt Handshake-Aktivität — gelb beim
   Andocken, blinkt während Verbindung, grün bei established,
   rot bei Fehler.

Klaus' Bild: „kleines Tool, das jeder in seinem Browser oben in
der Navigationsleiste installiert. Status- und Aktivitäts-Lampe
direkt sichtbar, ohne die Sage-Page öffnen zu müssen."

### Antwort kompakt: Technisch möglich — aber Mobile-Browser außen vor

**Manifest V3** ist das richtige Werkzeug. Desktop-Browser
(Chrome, Firefox, Edge, Brave, Opera, Safari) unterstützen MV3-
Extensions vollständig. **Mobile-Browser unterstützen keine
Extensions** — Klaus' eigenes DeX-/Tablet-Chrome-Setup bleibt
außen vor (Workaround: Kiwi Browser auf Android, Chromium-fork
mit Extension-Support).

### Plattform-Tabelle

| Plattform | Extension möglich? |
|---|---|
| Desktop Chrome / Edge / Brave / Opera / Firefox | ✓ |
| Desktop Safari (macOS) | ✓ (Xcode + App Store nötig) |
| Mobile Chrome (Android) — Klaus' Setup | ❌ |
| DeX-Chrome — Klaus' Setup | ❌ |
| Mobile Safari (iOS) | ✓ (eigenes Format) |
| Mobile Firefox (Android) | (eingeschränkt) |
| Kiwi Browser (Android) | ✓ |

### Architektur-Skizze

- **Manifest V3** mit `action` (Toolbar-Icon),
  `background.service_worker`, `externally_connectable` für Sage-
  PWA-Origin
- **Toolbar-Icon-Varianten:** `icon-aus.png` / `icon-lebt.png` /
  `icon-andockt.png` / `icon-etabliert.png` / `icon-fehler.png`
- `chrome.action.setIcon()` wechselt Icon je nach SBKIM-Status
- **Kommunikation Sage-PWA ↔ Extension** via
  `chrome.runtime.sendMessage` (Manifest deklariert PWA-Origin als
  `externally_connectable`)
- **Modul 13 „Extension-Bridge"** (neu zu spezifizieren) — sendet
  Status-Updates an Extension, wenn vorhanden; degradiert sauber,
  wenn nicht installiert
- **Popup HTML** für detaillierte Ansicht: Geschwister-Liste,
  Handshake-Log, Backup-Export-Trigger, Identitäts-Wechsler
- **Storage:** `chrome.storage.local` für UX-State (keine
  Identitäts-Schlüssel — die bleiben in der PWA-IndexedDB; Extension
  ist Anzeige + Steuerung, nicht Identitäts-Träger)

### Verbindung zu anderen Vision-Ankern

- **V2 (Niedrigeres Onboarding):** Extension ist **eine** UX-
  Vereinfachung, ergänzt die drei gleichwertigen Pfade (Wizard /
  GitHub-Generator / Mini-Browser) — kein Ersatz für den Andock-
  Schritt, aber laufende Status-Sichtbarkeit
- **V4 (Königin-Relay):** Extension zeigt Königin-Status („Königin
  erreichbar, X Nachrichten warten")
- **V5 (Identitäts-Container):** Backup-Export-Button im Popup,
  Identitäts-Rucksack einen Klick weg
- **V6 (Multi-Identität):** Identitäts-Wechsler im Popup — bewusste
  Persona-Wahl per Mini-Dropdown am Toolbar

### Abgrenzung Extension ↔ Mini-Browser (Anker 2 Pfad 3)

Komplementär, nicht konkurrierend:

- **Extension:** für Nutzer, die ohnehin Desktop-Chrome/Firefox
  nutzen. Niedrige Hürde (Install in einer Minute), nutzt
  existierenden Browser. Identität bleibt in PWA-IndexedDB
  (Reklamations-Risiko bleibt).
- **Mini-Browser (V2 Pfad 3):** für Nutzer, die einen dedizierten
  Knoten wollen (immer-on, Tray-Icon, eigene IndexedDB). Löst das
  Reklamations-Risiko, ist aber Desktop-App-Installation.

Beide können denselben Modul-13-Status-Bridge nutzen.

### Größenordnung

- Spec ~3-5 Stunden
- Bau Chrome-Extension ~15-25 Stunden
- Cross-Browser-Anpassungen (Firefox/Edge/Safari) ~10-15 Stunden
- App-Store-Distribution: Chrome Web Store ($5 einmalig), Firefox
  AMO (gratis), Apple Developer ($99/Jahr für Safari/iOS)

### Status

**Reif für Spec-Diskussion nach V1** (Sage als Hybrid-Knoten) und
nach einer Konsolidierungsphase der Marathon-Resultate. Komplementär
zu Anker 8 (Mini-Browser): Extension bedient Browser-Nutzer,
Mini-Browser bedient dedizierte Knoten — beide nutzen denselben
Modul-13-Bridge. Anschluss auch an Anker 9 (M04-Erweiterung): die
drei Match-Schichten + Brücke werden im Lampen-Popup-Detail sichtbar
gemacht, sobald Stufe B vorliegt.

### 2026-05-18 · Eigener Mini-Browser — Tauri-App als dedizierter Knoten

**Eingetragen:** Mini-Pflege „Vision-Anker Mini-Browser" 2026-05-18,
Folge-Pflege am selben Tag (nach PR #84 Anker 7). Klaus' parallele
zweite Browser-Identifikations-Schicht-Vision — bei PR #84 zunächst
als Notiz an Anker 2 Pfad 3 angehängt, hier per Klaus' Folge-
Entscheidung **als eigenständiger achter Vision-Anker vertieft**.

Klaus' Bild: „eigener kleiner Browser, von dem aus die Kommunikation
startet — muss nicht groß oder komplex sein. Läuft im Hintergrund,
eigene IndexedDB, unabhängig von Chrome."

### Konzept

Standalone-Desktop-App, die nur die Sage-PWA hostet:

- **Eigene IndexedDB** im App-Daten-Verzeichnis (`%APPDATA%/sbkim-node`
  / `~/Library/Application Support/sbkim-node` / `~/.config/sbkim-node`)
  → kein Browser-Reklamations-Risiko mehr (Lehre 1 + Spore-Verlust
  2026-05-17 strukturell gelöst).
- **Tray-Icon-Modus** für Hintergrund-Empfang — Browser-Tab nicht nötig,
  Knoten bleibt empfangsbereit, solange der Computer läuft.
- **Doppelklick-Installer** (`.msi` Windows, `.dmg` macOS, `.AppImage`
  Linux) — Onboarding ~2 Minuten von Link bis empfangsbereit.
- **Klein, fokussiert** — keine Tabs, keine Adressleiste, kein
  Browser-Chrome-Drumherum. Hostet `index.html` + Sage-PWA, sonst nichts.

### Antwort kompakt: Tauri ist der richtige Stack

**Tauri** (Rust-Backend + System-WebView) liefert das, was Klaus will,
ohne „eigenen Browser von Grund auf bauen" (Chromium-Code ~30 Mio
Zeilen, unrealistisch):

- ~10-30 MB Binaries pro Plattform (vs. Electron ~80-200 MB, weil
  Electron Chromium komplett mitliefert; Tauri nutzt das OS-eigene
  WebView2 / WKWebView / WebKitGTK)
- Cross-Platform aus einer Rust-Codebase
- Native System-Tray-Integration eingebaut
- Auto-Update-Mechanismus (signed releases)
- Aktive Community, MIT-Lizenz, Mozilla-finanziert mitentwickelt

### Plattform-Tabelle

| Plattform | Mini-Browser möglich? |
|---|---|
| Windows Desktop | ✓ (`.msi` via Tauri, nutzt WebView2) |
| macOS Desktop | ✓ (`.dmg` via Tauri, nutzt WKWebView) |
| Linux Desktop | ✓ (`.AppImage` via Tauri, nutzt WebKitGTK) |
| Android — Klaus' Setup | ❌ (Tauri-Mobile-Support unreif; Capacitor wäre separate Initiative) |
| iOS | ❌ (siehe Android) |
| DeX-Chrome — Klaus' Setup | ❌ (kein Desktop-OS im Tauri-Sinn) |

### Architektur-Skizze

- **Tauri-App-Shell:** Rust-Backend, hostet `index.html` der Sage-PWA
  lokal aus dem App-Bundle (kein Web-Server nötig — `tauri://localhost`
  als interne Origin)
- **IndexedDB:** WebView nutzt eigene IndexedDB-Instanz im App-Daten-
  Verzeichnis, isoliert vom System-Browser
- **Tray-Icon:** identische Lampen-Zustände wie Anker 7 Extension
  (aus / lebt / andockt / etabliert / fehler) — Wiederverwendung der
  Icon-Assets
- **Tray-Menü:** „Sage öffnen" / „Backup exportieren" / „Identität
  wechseln" (V6-Verbindung) / „Knoten beenden"
- **Modul-13-Bridge:** dieselbe wie für die Extension — PWA sendet
  Status-Updates an Tauri-Backend via `window.__TAURI__.event.emit()`,
  Backend aktualisiert Tray-Icon und Menü-Status
- **System-Autostart:** Toggle in Tray-Menü („mit System starten ✓") —
  Tauri-Auto-Launch-Plugin
- **Update:** Tauri-Updater prüft GitHub-Releases-Endpoint, signiert
  mit Tauri-Private-Key, User klickt „Update installieren"

### Verbindung zu anderen Vision-Ankern

- **V2 (Niedrigeres Onboarding):** Mini-Browser IST Pfad 3 der drei
  gleichwertigen Onboarding-Pfade (Wizard / GitHub-Generator / Mini-
  Browser). V2 Pfad 3 ist die **Onboarding-Optik** („Wie kommt jemand
  rein?"), Anker 8 ist die **Plattform-Architektur** dahinter
  („Welcher Stack, welche Trade-offs, welche Bau-Schritte?").
- **V4 (Königin-Relay):** Mini-Browser ist der **wahrscheinlichste
  Hintergrund-Empfänger** für Königin-Mailbox-Polling. Browser-Tab kann
  geschlossen sein, Tauri-App läuft im Tray weiter, holt Nachrichten
  im 5-Minuten-Takt.
- **V5 (Identitäts-Container):** Mini-Browser ist der **wahrscheinlichste
  Träger** für File-System-basierte Backup-Verschlüsselung — Tauri
  hat Datei-System-Zugriff via Rust-Backend, kann verschlüsselte
  Identitäts-Container in eine `.sbkim`-Datei exportieren.
- **V6 (Multi-Identität):** Tray-Menü-Eintrag „Identität wechseln"
  zeigt Persona-Dropdown direkt am System-Tray.
- **V7 (Extension):** komplementär, nicht konkurrierend (siehe nächster
  Abschnitt).

### Abgrenzung zu Anker 7 (Extension)

| Aspekt | Extension (V7) | Mini-Browser (V8) |
|---|---|---|
| Zielgruppe | Nutzer mit existierendem Browser | Nutzer wollen dedizierten Knoten |
| Installation | Browser-Store, 1 Klick | Doppelklick-Installer |
| Identitäts-Speicher | Browser-IndexedDB (Reklamations-Risiko bleibt) | App-Daten-Verzeichnis (kein Risiko) |
| Hintergrund-Empfang | Nein (Tab muss offen sein) | Ja (Tray-Modus) |
| Mobile | Eingeschränkt (Kiwi-Workaround Android) | Nein (Desktop-only) |
| Bau-Aufwand | ~15-25 h MVP | ~30-50 h MVP |
| Stack-Lernen | Manifest V3 (JS, bekannt) | Tauri/Rust (neu für Klaus) |

Beide können denselben **Modul-13-Status-Bridge** nutzen — derselbe
PWA-Code spricht beide an, je nach Umgebung (Browser-Extension oder
Tauri-Window).

### Abgrenzung zu Anker 2 Pfad 3 Tauri-Notiz

Anker 2 Pfad 3 hält den Mini-Browser als **einen von drei gleichwertigen
Onboarding-Pfaden** fest (Wahl-Optik für Karte 09). Anker 8 ist die
**eigenständige Plattform-Vision** dahinter — Architektur, Verbindungen
zu V4/V5/V6/V7, eigene Spec-Reife. Beide bleiben parallel im Repo;
Pfad-3-Notiz verweist auf Anker 8 für die Tiefe.

### Größenordnung

- Spec ~5-8 Stunden (mehr als Extension, weil Plattform-Stack neu)
- Bau Tauri-App MVP ~30-50 Stunden (Rust-Lernkurve eingerechnet)
- Cross-Platform-Build (Windows + macOS + Linux) ~10-15 Stunden
  zusätzlich (CI-Setup, plattformspezifische Eigenheiten)
- **Code-Signing:**
  - Apple Developer Program ($99/Jahr) — sonst macOS Gatekeeper-Warnung
  - Windows Code-Signing-Zertifikat (~$200-400/Jahr) — optional, sonst
    SmartScreen-Warnung beim ersten Start
  - Linux: keine Signatur nötig
- **Distribution:** GitHub Releases (kostenlos) oder eigene Site;
  Tauri-Updater zeigt auf JSON-Manifest mit signierten Binaries

### Status

**Reif für Spec-Diskussion**, parallel zu V7 (Extension). Höhere
Bau-Hürde als Extension (Rust-Stack neu, Code-Signing-Kosten), aber
**langfristig stabilster Endknoten-Pfad** — strukturelle Antwort auf
Lehre 1, Spore-Verlust 2026-05-17 und Anker 4 Königin-Frage „wer
empfängt, wenn der Tab zu ist". Anschluss an Anker 9 (M04-Erweiterung):
Tray-Modus + User-API-Key-Pattern (aus der Plattform-Demo `index.html`)
machen den Mini-Browser zum natürlichen Träger der LLM-Stufe-B-Calls.
Neun Vision-Anker stehen jetzt parallel im Repo — V1 bleibt Klaus'
nächste Spec-Wahl, alle anderen reifen im Hintergrund.

### 2026-05-18 · M04-Erweiterung — drei Schichten + Brücke + doppelte Spore

**Eingetragen:** Mini-Pflege „Vision-Anker M04-Erweiterung" 2026-05-18,
am selben Tag wie Anker 7 + 8. Klaus' Brainstorming hat die **Brücke
zwischen SBKIM-Paper (Plattform-Form, Mai 2026) und Mycel-Form**
sichtbar gemacht: die strukturierten Match-Felder aus dem Paper sind
nie verworfen worden, sondern leben im Mycel-Sage in vereinfachter Form
weiter — Modul 04 matcht heute aber nur **einseitig per Cosinus** über
ein einzelnes Spore-Embedding, die drei Dimensionen + Brücke + volle
Bidirektionalität fehlen noch.

### Konzept

Modul 04 hat heute eine schlanke API:

```
match(queryVec, passageVec) -> number   // Cosinus-Ähnlichkeit
isAboveProviderThreshold(score) -> bool // PROVIDER_MIN_MATCH=0.80
```

Eine Spore (Modul 02) trägt **ein** Embedding. Das ist eine ehrliche
Vorauswahl, aber strukturarm: kein Aufschluss, warum etwas matcht,
keine Brücken-Vorschläge, kein Gegenseitigkeits-Test.

Die Erweiterung übernimmt drei Bausteine aus dem ursprünglichen
SBKIM-Paper für die Mycel-Form:

1. **Drei-Schichten-Bewertung** (statt Single-Score):
   - **Fachlich** (Domain) — was kannst du / was suchst du inhaltlich?
   - **Prozess** — wie arbeitest du? (Rhythmus, Methodik, Verbindlichkeit)
   - **Skalierung** — auf welcher Größenebene? (einzelner Knoten,
     Cluster, Netz)
   Die drei Schichten sind orthogonal; jede liefert einen eigenen Score
   plus Begründung.

2. **Brücken-Feld** — nicht nur „match oder nicht", sondern „was würde
   es vollständig machen". Wenn Knoten A in zwei Schichten matcht, in
   der dritten aber eine Lücke hat, schlägt das System einen
   **Brücken-Knoten C** vor (Anknüpfung an Modul 06 Heterokaryose:
   Brücken-Feld kann aktive Vermittlung anstoßen).

3. **Doppelte Spore** — `capabilities` **und** `needs` auf beiden Seiten.
   Modul 02 bekommt einen zweiten Embedding-Slot, Modul 04 prüft beide
   Richtungen (A-cap × B-needs und A-needs × B-cap). Volle Bidirektionalität
   war schon im ersten Paper-Pitch Kern, in Mycel heute noch reduziert.

### Match-Pipeline (Vision)

- **Stufe A — lokal, kostenlos** (heute schon da, leicht erweitert):
  WebGPU-Embedding → Cosinus-Vergleich. Score < `PROVIDER_MIN_MATCH` →
  Apoptose. Aufschlüsselung pro Schicht: `match()` läuft dreimal, je
  Spore-Achse, gibt `{ fachlich, prozess, skalierung }`-Vektor zurück
  statt einer Zahl.

- **Stufe B — optional, LLM, User-eigener API-Key** (neu): bei
  `Score ≥ Schwelle` läuft ein zweiter Pass über einen Claude-API-Call,
  der die drei Schichten **erklärt** und einen **Brücken-Vorschlag**
  liefert. Pattern übernimmt die Layer-1-Demo der SBKIM-Plattform-
  `index.html` (claude-sonnet-4, `max_tokens` ~1024, JSON-only-Output,
  strenge Validation). Stufe B ist **opt-in pro Knoten** — wer keinen
  Key hinterlegt, bleibt bei Stufe A.

### Architektur-Skizze

- **Modul 02 Spore-Schema:** zweites Embedding-Feld (`embeddingNeeds`
  parallel zu `embedding`). Additiv — alte Sporen bleiben gültig, alter
  Slot heißt dann implizit `embeddingCapabilities`. `PROTOCOL_VERSION`
  bleibt `0.1` solange das alte Feld weiter akzeptiert wird; sonst
  Minor-Bump.
- **Modul 04 API-Erweiterung:**
  - `match(query, passage) -> number` bleibt erhalten (alte Aufrufer)
  - `matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)
    -> { fachlich, prozess, skalierung, overall }` neu, additiv
  - `explainMatchLLM({…}, apiKey) -> Promise<{ schichten, bruecke,
    erklaerung }>` — Stufe B, optional, fehlertolerant
- **Sage-Page-Erweiterung:** Match-Karte zeigt drei Schicht-Lampen
  statt eines Scores; Brücken-Vorschlag-Slot, falls vorhanden.
- **Anti-Missbrauch:** Brücken-Vorschlag ist **lokal**, nicht im Netz
  geteilt — vermeidet Spore-Leakage auf Drittknoten.

### Verbindung zu anderen Vision-Ankern

- **V1 (Sage als Hybrid-Knoten):** die drei Schichten + Brücke gehören
  als integraler Teil in die V1-Spec, nicht als separate spätere
  Erweiterung. Hybrid-Knoten ist der natürliche Ort, an dem Stufe-B
  überhaupt aufgesetzt wird (Endknoten + Spec-Hub gleichzeitig).
- **V4 (Königin-Relay, Modul 13?):** der Brücken-Vorschlag könnte
  einen Knoten C **vermitteln** — Königin-Mailbox als Transport.
- **V5 (Identitäts-Container):** API-Key gehört in den verschlüsselten
  Container, nicht in plain IndexedDB.
- **V6 (Multi-Identität):** doppelte Spore (cap + needs) **pro Persona** —
  jede Persona hat eigene Schichten, eigene Schwelle, eigenen Key.
- **V7 (Extension):** Match-Details (drei Schichten + Brücke) im
  Popup-Detailfenster — Lampe färbt sich pro Schicht.
- **V8 (Mini-Browser):** natürlicher Träger der LLM-Stufe-B-Calls —
  Tray-Modus kann längere Match-Pässe im Hintergrund fahren, User-Key
  liegt in App-Daten-Verzeichnis (kein Browser-Reklamations-Risiko).
- **Modul 06 (Heterokaryose):** Brücken-Feld ist der Anlass für aktive
  Verbindungs-Vermittlung — heterokaryose-outbox bekommt einen neuen
  Eintrags-Typ „Brücken-Vorschlag".

### Historie — Paper ↔ Mycel

Der ursprüngliche SBKIM-Pitch (Frühjahr 2026, Plattform-Form) trug die
drei Schichten und das Brücken-Feld als **Kern-Innovation** (Paper
Section 3.3 „Bidirektionales Matching mit drei Dimensionen"). Beim
Pivot zur Mycel-Form (Mai 2026, Beginn dieses Repos) wurde Modul 04
bewusst **minimal** angelegt — einfacher Cosinus, eine Schwelle —, um
zuerst die Infrastruktur (Storage, Spore, Embedding, Anastomose,
Apoptose) tragfähig zu bekommen. Die strukturierte Tiefe blieb als
**implizite Vision** im Paper; Anker 9 macht sie explizit und nennt
sie als Bau-Ziel der V1-Sammelspec.

### Größenordnung

- Spec ~3-5 Stunden (Schema-Erweiterung Modul 02, API Modul 04,
  Stufe-B-Prompt-Design)
- Bau Stufe A erweitert (dimensions-Aufschlüsselung): ~2-3 Stunden
- Bau Stufe B (LLM-Call + JSON-Validation + Fehlerbehandlung): ~5-8 Stunden
- Sage-Page-Karten 04 + Match-Demo Erweiterung: ~3-5 Stunden
- Migrations-Pflege Spore-Schema (alte Sporen anpassen): ~2 Stunden

### Status

**Strang 2 der V1-Sammelspec realisiert (2026-05-19, Brief 03 der
V1-Sammelspec-Kaskade).** Spec-Sitzung 2026-05-19 hat die drei
Schichten + Brücken-Feld + doppelte Spore + Stufe-A/Stufe-B-Match-
Pipeline verbindlich in INTERFACES.md verankert (§0 drei neue
Konstanten `SCHICHT_MIN_MATCH=0.60` / `STUFE_B_DEFAULT_MODEL` /
`STUFE_B_MAX_TOKENS`; §1 Modul 02 Bietet-Block-Spore-Schema-
Erweiterungs-Hinweis; §1 Modul 04 zwei neue API-Funktionen
`matchDimensions` + `explainMatchLLM` + vier neue Sub-Blöcke; §2
Spore-JSON-Felder `embeddingCapabilities` + `embeddingNeeds`;
§7 LLM-Stufe-B-Ehrlichkeits-Klausel neu; §8 Anti-Missbrauch-Klausel
neu; §9 Änderungsprotokoll, war §7) plus Karten 02 / 04 / 06
nachgezogen. **PROTOCOL_VERSION bleibt `"0.1"`** — alle neuen Felder
und Funktionen sind additiv, alte Sporen ohne `embeddingNeeds` bleiben
gültig (signalisieren „nur Anbieter-Modus"). **Verbleibende Etappen
der V1-Sammelspec-Kaskade:** Brief 04 Multi-Identität (Strang 3 —
`sbkim_keys`-Multi-Slots + `active-identity`-Marker, doppelte Spore
pro Persona) folgt; BRIEF_99-Abschluss schließt die Kaskade. **Bau
folgt nach Kaskaden-Abschluss** in eigenen Bau-Sitzungen (Stufe A
erweitert ~2-3 h, Stufe B ~5-8 h, Sage-Page-Karte 04 ~3-5 h, Migrations-
Pflege Spore-Schema ~2 h — alle nicht in Brief 03).

### 2026-05-18 · Sonnen-Galaxie — Sage-Geschichts-Galerie

**Eingetragen:** Mini-Pflege „Vision-Anker Sonnen-Galaxie" 2026-05-18,
**mid-Pflege re-gerahmt** auf Klaus' Wunsch. Erstrahmung als
„wissenschaftliche Papers-Bibliothek" wurde verworfen; tatsächliches
Konzept: **Sage-Geschichts-Galerie** — Stationen der Entwicklung des
Protokolls und seiner Namensgebung, biographisch-erzählerisch. Klaus'
O-Ton: „eher in die Richtung was macht man, wenn man auf eine Antwort
wartet? Man macht sich selber an die Arbeit. Die Pflege der Dokumente
und der Bau neuer Galaxien kann getrennt von einem Automatismus
erfolgen. So wie jetzt auch." Das eingecheckte EN-Paper
(`docs/papers/sbkim-paper-en.html`) bleibt als **eine** Station unter
mehreren — wissenschaftlicher Niederschlag der Reise, nicht
Selbstzweck.

**Heilige Tafel — Privatheits-Klausel:** **Die Sonnen-Galaxie erwähnt
Everlast GmbH NICHT.** Klaus' Wunsch ausdrücklich. Stationen, die im
realen Werdegang einen kommerziellen Kontext hatten, werden in der
Galaxie ausschließlich in ihrer technisch-konzeptionellen Form
erzählt. Gilt heilig auch für Folge-Mini-Pflegen, die neue Galaxien
nachziehen.

### Konzept

**Sonnen-Karte** als optisches Pendant zur Schwarz-Loch-Karte, nur
invertiert. Wo dort ein dunkler Akkretionsstrudel das Chrome-Logo
verschluckt, leuchtet hier eine **wärme-goldene Korona** mit einem
**dunklen, pulsierenden Sonnenkern** in der Mitte — der Kern ist das
direkte Pendant zum schwarzen Loch (Klaus' Worte: „analog zum schwarzen
Loch von Chrome, aber in einer Art Sonne, nicht so'n komisches Loch in
der Mitte"). Auf der Sonnenscheibe wandern **Sonnenflecken** (dunkle
Punkte in unregelmäßiger Außenform), die eigenständig pulsieren und
driften. Mouse-Hover verstärkt alle Pulse — Korona schneller,
Sonnenflecken schneller, Sonnenscheibe heller. Karte sitzt **weiter
oben** auf der Sage-Page als die Schwarz-Loch-Karte (vor der Reading-
Karte, „Vision und für Neugierige").

**Klick auf die Sonne** öffnet ein neues Vollbild-Universum — analog zum
Observatorium-Screen, mit eigener `papers-screen`-Klasse und
geordneterer Choreographie:

- **Hintergrund:** warm-goldene Nebel statt magenta/cyan; Sterne via
  Canvas; Maus-Schweif erlaubt (Komet-Optik aus Observatorium
  übernehmen, gerne).
- **Galaxien-Bewegung — geordnet, nicht wandernd:** „nicht
  durcheinander, sondern schön im Kreis oder in einer Ellipsenform und
  sich selber noch mal innerhalb der Ellipsenform um sich selber
  drehen." Konkret: eine **gemeinsame Bahn-Ellipse** um ein zentrales
  Sonnen-Zentrum, alle Paper-Galaxien gleichmäßig phasen-verteilt
  (3 Papers → 0°/120°/240°), gleiche Umlaufzeit (~ 40–60 s). Zusätzlich
  dreht jede Galaxie um die **eigene Achse** (das existierende
  `@keyframes galaxy-spin` reicht). Variante als Ausbaustufe: jede
  Galaxie auf eigener Ellipse mit unterschiedlicher Neigung, damit die
  Konstellation einen leichten 3D-Eindruck bekommt.
- **Galaxien-Inhalt:** ein Eintrag pro Paper. Status-Klassen
  steuern die Optik:
  - `paper-galaxy.live`     — voller Glanz (publiziert)
  - `paper-galaxy.draft`    — gedämpft, leicht schwankende Helligkeit
    (in Arbeit)
  - `paper-galaxy.geplant`  — sehr dimm, fast nur Umriss (Platzhalter
    für künftige Papers)
- **Klick auf Galaxie:** Modal analog `universe-modal`, mit
  Paper-Titel, Kurzbeschreibung, Status-Badge, Link zur HTML-Ansicht
  (`docs/papers/<file>.html` als Tab-Öffner mit `target="_blank"`).
  Bei `geplant`-Galaxie: keine Datei, nur Erläuterungs-Text.

### Stationen-Inventar (Start-Konfiguration · 5 Galaxien)

| Galaxie | Station | Status | Anker-Datei (sofern vorhanden) |
|---|---|---|---|
| 1 | **SBKIM-Namensgebung** — woher der Name kam, was die einzelnen Buchstaben in der Reise getragen haben | text-nur, **inhaltlich gefüllt** | (Modal-Body-Text, Pflege 2026-05-18) |
| 2 | **Zwei Seiten einer Medaille** — das bidirektionale Match-Prinzip biographisch erzählt: wann und warum die Idee aufkam, Anbieter und Sucher zugleich zu denken | text-nur, **inhaltlich gefüllt** | (Modal-Body-Text, Pflege 2026-05-18) |
| 3 | **Sage-Protokol-Geburt** — der Pivot von Plattform-Form zu Mycel-Form, Geburt dieses Repos | text-nur, **inhaltlich gefüllt** | (Modal-Body-Text, Pflege 2026-05-18) |
| 4 | **Wissenschaftlicher Niederschlag — das englische SBKIM-Paper** | live | `docs/papers/sbkim-paper-en.html` |
| 5 | **Wissenschaftlicher Niederschlag — das deutsche SBKIM-Paper** | live | `docs/papers/sbkim-paper-de.html` |

**Wachstums-Disziplin:** Pflege der Stationen und Bau neuer Galaxien
laufen als **getrennte Mini-Pflegen**, nicht als Automatismus. Wie
bisher: Klaus liefert den nächsten Inhalt, eine Mini-Pflege schreibt
ihn ein, Bau-Sitzung rendert ihn. Wenn weitere Stationen dazukommen,
skaliert die Bahn-Ellipse ihre Phasen automatisch (`360° / n` pro
Galaxie). Stationen können **textuell** (nur Modal-Body) oder
**dokumentengestützt** (mit Datei-Anker wie das EN-Paper) sein —
beides gleichwertig in der Galaxie.

### Heute schon erledigt

- **Ordner `docs/papers/`** angelegt (trägt das EN-Paper als
  dokumentengestützte Station 4; weitere Stationen brauchen den
  Ordner nicht).
- **`docs/papers/sbkim-paper-en.html`** eingecheckt — Klaus' Upload des
  englischen SBKIM-Papers (23 KB, sieben Sektionen).
- **CSS-Skizze für Sonnen-Karte** in dieser Sitzung kurz angetestet,
  dann **bewusst zurückgerollt** — Klaus' Disziplin „Brief schreiben,
  Bau in eigener Sitzung" hat Vorrang.
- **Mid-Pflege Re-Framing:** Konzept von „Papers-Bibliothek" auf
  „Geschichts-Galerie" verschoben (Folge-Commit auf PR #88). Optik
  bleibt vollständig (Sonnen-Karte, Ellipsen-Bahn, Eigenrotation,
  Sonnenflecken); nur die Daten und die Sprache haben sich gewandelt.

### Architektur-Skizze (für Bau-Sitzung)

**`index.html` — sieben Eingriffe, alle additiv:**

1. **CSS-Block** „Sonnen-Galaxie · Papers-Bibliothek" vor dem
   `.blackhole-card`-Block (~Z. 403). Spezifika:
   - `.sun-card` als `radial-gradient`-Hintergrund mit warm-dunklem
     Boden (Pendant zu `.blackhole-card`'s lila-schwarz).
   - `.sun-stage` Grid wie `.blackhole-stage`, Hover-Scene-Scale.
   - `.sun-scene` mit drei gestapelten Schichten:
     `.sun-corona` (radial, pulsierend), `.sun-corona-2` (conic,
     rotierend), `.sun-disk` (dunkler Sonnenkern, pulsierend) und drei
     `.sun-spot.s1/.s2/.s3` (Sonnenflecken in unregelmäßigen Drift-
     Bahnen).
   - Vier Keyframes: `sun-corona-pulse`, `sun-corona-spin`,
     `sun-disk-pulse`, `sun-spot-drift-1/2/3`.
   - Hover: alle Animations-Dauern halbieren (analog Black-Hole-Card,
     `bh-chrome` 11s→5.5s).
   - `prefers-reduced-motion: reduce` schaltet alle Animationen ab.

2. **CSS-Block** „Papers-Galaxie-Screen" für den neuen Screen.
   `.papers-screen` analog `.observatorium-screen` aber warm-goldener
   Tonalität (Nebel `rgba(244,180,53,…)` statt `rgba(255,70,180,…)`).
   `.paper-galaxy` analog `.universe-galaxy` plus drei Status-Klassen
   (`.live`, `.draft`, `.geplant`).

3. **HTML-Block** Sonnen-Karte vor `.card.reading` (~Z. 751):
   ```html
   <article class="card span-12 sun-card" data-back-anchor="papers">
     <span class="card-tag">Wissenschaftliche Grundlage · Papers-Bibliothek</span>
     <a class="sun-stage" href="#papers"
        onclick="goScreen('papers', 'papers'); return false;"
        aria-label="Papers-Bibliothek öffnen — Sonnen-Galaxie">
       <div class="sun-scene" aria-hidden="true">
         <div class="sun-corona"></div>
         <div class="sun-corona-2"></div>
         <div class="sun-disk"></div>
         <div class="sun-spot s1"></div>
         <div class="sun-spot s2"></div>
         <div class="sun-spot s3"></div>
       </div>
       <div class="sun-caption">
         <h3>Auf welcher Grundlage Sage steht</h3>
         <p>Zwei wissenschaftliche Papers tragen die Form. Das englische
         beschreibt SBKIM als bidirektionales Matching-Protokoll mit drei
         Dimensionen. Das deutsche folgt. Ein drittes Paper stellt das
         Mycel-Prinzip dem SBKIM-Matching gegenüber.</p>
         <p class="sun-hint">Klicke in die Sonne → die Papers tanzen
         als Galaxien um sie herum.</p>
       </div>
     </a>
   </article>
   ```

4. **HTML-Block** Papers-Galaxie-Screen nach `</main>` von
   `screen-observatorium` (~Z. 1121), analog zum Observatorium-Screen,
   eigene IDs (`screen-papers`, `papers-stage`, `papers-galaxies`,
   `paper-modal`, …).

5. **`SCREENS`-Array** (Z. ~1179) um `'papers'` erweitern.

6. **`goScreen()`** (Z. ~1226): Aufruf `setupPapersGalaxy()` wenn
   `id === 'papers'`. **`applyHashScreen()`** (Z. ~2482): bei
   `h === 'papers'` zurück-Anker `'papers'` mitgeben.

7. **JS-Block** nach `closeUniverseModal()` (~Z. 2479):
   `STATIONS_DATA`-Array (s. Inventar oben), `setupSonnenGalaxie()` mit
   einmaliger Initialisierung-Schranke, Ellipsen-Bahnen-Rendering,
   `openStationModal(idx)`, `closeStationModal()`. Bewegungs-Mathe:
   ```
   const ANG_SPEED = (2 * Math.PI) / 50;   // 50 s Umlaufzeit
   const t = now / 1000;
   STATIONS_DATA.forEach((s, i) => {
     const phase = (i / STATIONS_DATA.length) * Math.PI * 2;
     const x01 = 50 + Math.cos(t * ANG_SPEED + phase) * 30;
     const y01 = 50 + Math.sin(t * ANG_SPEED + phase) * 18;
     // Eigenrotation läuft via CSS-@keyframes galaxy-spin
   });
   ```
   Station-Eintrag hat zwei Varianten:
   - **textuell:** `{ title, summary, status: 'text' }` — Modal zeigt
     nur den `summary`-Body, keinen Datei-Link.
   - **dokumentengestützt:** `{ title, summary, status: 'live', href }` —
     Modal zeigt Body + „Original-Dokument öffnen →"-Link auf `href`
     (z.B. `docs/papers/sbkim-paper-en.html`).

**`status.json` — optionaler Eintrag:** ein neues Feld `historie` mit
Liste der Stationen (Titel, Status, optional Datei). Pflege-frei, weil
selten geändert; macht die Geschichts-Galerie auch maschinen-lesbar.

**`docs/papers/README.md`** als Erklärung der Bibliothek (was das
EN-Paper hier soll: dokumentengestützte Station der Sonnen-Galaxie) +
Verweis auf Vision-Anker 10.

### Sonnenflecken-Pattern (Klaus' Wunsch konkret)

Klaus' Worte: „mit Sonnenflecken, die ebenfalls größer und kleiner mit
unregelmäßiger Außenform pulsieren". Drei `.sun-spot`-Elemente mit
unterschiedlichen Größen (18 / 12 / 9 % der Scene-Breite), an
unterschiedlichen Positionen (top:33%/48%/38%, left:30%/55%/50%), jede
mit eigener `@keyframes sun-spot-drift-X`-Animation (unterschiedliche
Dauern 11/9/13 s, unterschiedliche Translate-Vektoren, leichte
Skalierung 0.7–1.15). Bei Hover Dauer halbieren — passt visuell zum
Sonnen-Stress-Erlebnis (Klaus' Worte: „bei Mouseover stärkeres
Pulsieren").

### Verbindung zu anderen Vision-Ankern

- **Anker 1 (Sage als Hybrid-Knoten):** das Observatorium kann privat
  bleiben, weil die Sonnen-Galerie öffentlich die Geschichte des
  Protokolls erzählt — wer die Reise versteht, versteht auch, **warum**
  Sage als Hybrid-Knoten sinnvoll wird.
- **Anker 9 (M04-Erweiterung):** Station „Zwei Seiten einer Medaille"
  ist die biographische Quelle für die bidirektionale Match-Erweiterung
  (Anbieter ↔ Sucher, doppelte Spore). Reift Anker 9 in V1, dann zieht
  Station 2 als Erzähl-Anker mit.
- **Schwarz-Loch-Karte (`.blackhole-card`):** optisches Pendant der
  Sonnen-Karte. Beide sitzen in derselben Bento-Reihe, aber an
  gegenüberliegenden Positionen (Sonne weiter oben für „Wo das Protokoll
  herkam", Loch weiter unten für „Was wir auf dem Weg gelernt haben").
  Sie ergänzen sich choreographisch: Sonne ist hell und erzählerisch
  (Werdegang), Schwarzes Loch ist dunkel und wirbelnd (Bau-Lehren).

### Größenordnung

- Bau-Sitzung CSS + HTML + JS für Sonnen-Karte: ~2 Stunden
- Bau-Sitzung Papers-Galaxie-Screen + Modal + Bewegungs-Loop: ~2-3 Stunden
- Status.json-Erweiterung + papers/README.md: ~0.5 Stunden
- Manueller Sichttest (Klaus, Browser): ~0.5 Stunden
- **Insgesamt eine Bau-Sitzung: ~5-6 Stunden**

Aufteilbar in zwei Bau-Sitzungen, falls eine zu lang wird:
- **Bau-Sitzung 10a:** Sonnen-Karte + Status.json + README (~3 h)
- **Bau-Sitzung 10b:** Papers-Galaxie-Screen + Modal + Bewegungs-Loop (~3 h)

### Status

**Realisiert PR #90 (Bau) + Pflege PR #92 (Stationen 1–3
inhaltlich gefüllt) + Pflege 2026-05-18 (Station 5 · DE-Paper
ergänzt)**. Sonnen-Karte sitzt zwischen Andock-Karte und Reading-
Karte (`data-back-anchor="sonnen"`); Geschichts-Galerie-Screen lebt
unter `#sonnen` und zeigt **fünf Stationen** auf einer gemeinsamen
Ellipsen-Bahn (`ANG_SPEED = 2π/50` s, Ellipse 30 vw × 18 vh,
gleichmäßige Phasen-Verteilung über `STATIONS_DATA.length` — bei 5
sind das 72° pro Galaxie) mit Eigenrotation via `@keyframes
galaxy-spin`. **Alle fünf Stationen sind inhaltlich gefüllt:**
Station 1 (Namensgebung), Station 2 (Zwei Seiten einer Medaille —
biographische Quelle für Anker 9), Station 3 (Sage-Protokol-Geburt
— Pivot Plattform → Mycel) als textuelle Erzählung im Modal-Body;
Station 4 (EN-Paper, `status: 'live'`) zusätzlich mit `href` auf
`docs/papers/sbkim-paper-en.html`; Station 5 (DE-Paper, `galaxy-
quasar`, `status: 'live'`) zusätzlich mit `href` auf `docs/papers/
sbkim-paper-de.html`. Das Placeholder-Hint-Banner ist via expliziten
`placeholder`-Flag gesteuert — neue text-only-Stationen können beim
Anlegen `placeholder: true` setzen, gefüllte tragen den Flag nicht.
`docs/papers/README.md` führt jetzt beide Paper-Dateien.

**Pflege-Disziplin Everlast GmbH:** jede Folge-Mini-Pflege, die Inhalt
für Stationen 1–3 liefert, **prüft vor dem Commit**, dass der Text
keine Erwähnung von Everlast GmbH enthält. Die heilige Tafel ganz oben
in diesem Anker ist verbindlich.

---

## Sitzungs-Einträge

**Format:** Der jüngste Eintrag steht ausführlich oben. Alle älteren
Sitzungen sind in `docs/sessions/archiv/` abgelegt — der Index
darunter verlinkt jedes Übergabeprotokoll. Neue Sitzungen tragen
sich oben mit vollem Text ein und verschieben den dann jeweils
vorletzten in den Archiv-Index. Ziel: PULS.md bleibt unter 3000
Zeilen (Schutz-Klausel oben, 2026-05-17 — NICHT herabsetzen).

### 2026-05-19 · Spec — Multi-Identität (Brief 04 der V1-Sammelspec-Kaskade)

**Sitzungs-Rolle:** Spec-Sitzung, headless. Branch
`claude/spec-v1-multi-identitaet-Kwytf` (Harness-Suffix; gemeinte
Konvention `claude/spec-v1-multi-identitaet`). Vierte Etappe der
V1-Sammelspec-Brief-Kaskade nach Brief 01 (Spec V1 Sage-Hybrid, PR
#96 gemerged), Brief 02 (Spec Plattform-Matrix, PR #97 gemerged) und
Brief 03 (Spec M04-Erweiterung, PR #98 gemerged 2026-05-19, `main`
`27d6a19`). Quell-Spec: `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
§ STRANG 3; herausgeschnitten als
`docs/sessions/BRIEF_04_multi_identitaet.md`.

**Kern:** Strang 3 verankert die Multi-Identität in der IndexedDB als
verbindliche Spec-Klausel. Modul 02 (Spore) bekommt fünf neue / erweiterte
API-Funktionen (`getOrCreateIdentity(key?)`, `setActiveIdentity(key)`,
`getActiveIdentityKey()`, `listIdentities()`, `removeIdentity(key, options?)`;
`generateOwnSpore(meta, key?)` + `getOwnSpore(key?)` um optionalen
key-Parameter erweitert). Default-Slot `"main"` bleibt verbindlich
(Rückwärts-Kompat zum Singleton-Vertrag aus Spec-Sitzung 02
2026-05-14); zusätzliche Slots können beliebig viele weitere Schlüssel
tragen. Aktive Identität steht in `sbkim_meta["active-identity"]`
(Default `"main"`, falls fehlend). Module 05 / 06 / 07 lesen
`getActiveIdentityKey()` im `init()`-Pfad und cachen den Wert für die
Lebenszeit der Operation. Identitäts-spezifische Stores pro Persona:
`sbkim_siblings_<key>`, `sbkim_anastomosis_log_<key>`,
`sbkim_legacy_inbox_<key>`, `sbkim_hetero_inbox_<key>`,
`sbkim_hetero_outbox_<key>`. Persona-Isolation: ein Geschwister gehört
einer Persona, nicht dem ganzen Knoten. INTERFACES.md bekommt eine
neue § 9 „Identitäts-Map" als verbindliche Spec-Klausel (§9.1 Slot-
Schema bis §9.7 Verbindung zur M04-Erweiterung) und die Änderungsprotokoll-
Sektion wird auf § 10 nachnummeriert.

**PROTOCOL_VERSION bleibt `"0.1"`** — `sbkim_keys[key]` ist lokales
Storage-Schema, kein Spore-Feld; `sbkim_meta["active-identity"]` ist
ebenfalls lokal; alle neuen API-Funktionen additiv (alter Singleton-
Aufruf-Pfad bleibt wortwörtlich gültig, Default-Slot "main" hält
Rückwärts-Kompat). Strategie A für Pages-`spore.json` gewählt (nur die
zum Push-Zeitpunkt aktive Identität wird gehostet, Identitäts-Wechsel
= neuer Spore-Push) — kein Bump-Anlass. Strategie B (Liste-Schema
mit `identities[]`-Pflicht-Feld) als Option für eine Folge-Spec-Sitzung
benannt; Strategie B würde `PROTOCOL_VERSION` auf `"0.2"` bumpen und
alle bestehenden Empfänger brechen, deshalb nicht in Brief 04 gewählt.

**Sechs Punkte a–f umgesetzt:**

a) **`docs/INTERFACES.md` § 9 Identitäts-Map (neu eingefügt vor § 9
   Änderungsprotokoll, das auf § 10 nachnummeriert wird)** mit sieben
   Sub-§:
   - **§ 9.1 Slot-Schema** — `sbkim_keys["main"]` + beliebige weitere
     Slots; `sbkim_meta["active-identity"]` als String-Marker; keine
     Validierung der Schlüssel-Form in Modul 02; "main" ist Default,
     kein Magic-Wert.
   - **§ 9.2 Identitäts-spezifische Stores** — Pattern-Tabelle für
     fünf Stores (`sbkim_siblings_<key>`,
     `sbkim_anastomosis_log_<key>`, `sbkim_legacy_inbox_<key>`,
     `sbkim_hetero_inbox_<key>`, `sbkim_hetero_outbox_<key>`) plus
     Persona-Isolation-Klausel (verbindlich, Folge-Spec darf nur unter
     ausdrücklicher Trade-off-Verhandlung lockern).
   - **§ 9.3 `active-identity`-Marker** — Lese-Konvention für Module
     05/06/07 (im `init()` cachen, Mid-Operation-Wechsel NICHT
     spezifiziert), Schreib-Konvention (Modul 02 alleiniger Schreiber).
   - **§ 9.4 Receiver-Pfad** — eingehende Requests mit `toNodeId`
     werden gegen alle eigenen Identitäten geprüft (Map nodeId→key
     beim init()); getroffene Persona wird intern für die Operation
     als aktive Identität verwendet; kein Treffer → Response
     `outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger"`.
   - **§ 9.5 Migrations-Strategie** — Option A dynamische Store-
     Erzeugung via `SbkimStorage.ensureStore(name)` (Empfehlung) vs.
     Option B feste Slot-Tabelle (Spec-Alternative); Bau-Folge-Sitzung
     01.Y zieht den Pfad nach.
   - **§ 9.6 Trade-off-Klausel** — IndexedDB-Verlust löscht ALLE
     Identitäten (Anker 5 als Backup-Strategie sinnvoll); Multi-
     Identitäts-Backup-Strategie „kompletter Rucksack" empfohlen;
     Königin-Relay (Anker 4) muss pro-Identität-Mailboxes verwalten;
     Privatheit bleibt offen.
   - **§ 9.7 Verbindung zur M04-Erweiterung (Brief 03)** — doppelte
     Spore (`embeddingCapabilities` + `embeddingNeeds`) pro Identität;
     Match-Pipeline pro Persona; Sibling-Listen tragen Match-Cosinus
     zur spezifischen Persona, nicht zur globalen Sage-Identität.

b) **§ 1 Modul 02 API-Erweiterung** (in INTERFACES + Karte 02):
   - Bietet-Block um fünf neue / erweiterte Funktionen + Singleton-
     Klausel ersetzt durch Identitäts-Slot-Vertrag.
   - Storage-Block um `sbkim_meta["active-identity"]` erweitert.
   - Fehlerverhalten um `UnknownIdentityError` + `RemoveActiveIdentityError`
     erweitert.
   - Selbstcheck-Funktionsliste auf zwölf Funktionen erweitert.
   - Garantien-Block um Aktive-Identität-Lese-Konvention für 05/06/07
     erweitert.

c) **§ 1 Modul 05 Storage-Block + Karte 05**:
   - Stores auf `sbkim_siblings_<key>` / `sbkim_anastomosis_log_<key>`
     Pattern umgestellt (Pre-Brief-04-Singleton-Aufrufer treffen
     unverändert auf `_main`-Slots).
   - Identitäts-Cache-Konvention dokumentiert (init() liest
     `getActiveIdentityKey()`, cached für Operation; Mid-Operation-
     Wechsel NICHT spezifiziert).
   - Receiver-Pfad: `request.toNodeId` gegen Map nodeId→key, getroffene
     Persona für die eine Operation als aktive Identität.
   - Garantien-Block um Persona-Isolation-Klausel erweitert.
   - Karte 05 § Schnittstelle Hinweise + § Datenformate Multi-Identitäts-
     Hinweis-Block.

d) **§ 2 Spore-JSON + Karte 02 — Pages-`spore.json`-Strategien:**
   - **Strategie A (Default, gewählt — `PROTOCOL_VERSION` bleibt 0.1):**
     nur die aktive Identität in `spore.json`. Identitäts-Wechsel =
     neuer Spore-Push. Rückwärts-kompatibel zu allen heutigen
     Empfängern.
   - **Strategie B (Spore-Schema-Eingriff, `PROTOCOL_VERSION`-Bump auf
     0.2, NICHT in Brief 04 gewählt):** Liste-Schema mit `identities[]`-
     Pflicht-Feld. Würde alle bestehenden Empfänger brechen, deshalb
     für eine Folge-Spec-Sitzung benannt. Bump-Entscheidung gehört
     EXPLIZIT ins Änderungsprotokoll + PULS-Sitzungs-Eintrag — keine
     heimliche Edit.
   - INTERFACES.md § 2 Spore-JSON bekommt einen Hinweis-Block mit
     beiden Strategien und der A-Wahl als Default; Karte 02 erweitert
     den M04-Erweiterungs-Sub-Block um den Brief-04-Bezug.

e) **Verbindung zu Anker 9 (M04-Erweiterung, Brief 03) — doppelte
   Spore PRO PERSONA:**
   - Pro Identitäts-Slot in `sbkim_keys[key]` existiert ein eigener
     Eintrag in `sbkim_spore[key]` mit eigenen `embeddingCapabilities`
     + `embeddingNeeds`. `generateOwnSpore(meta, key?)` nimmt den
     optionalen key-Parameter und schreibt in den passenden Slot.
   - Match-Pipeline pro Persona: `matchDimensions` aus Brief 03
     konsumiert die Vektor-Slots **einer Persona** pro Aufruf —
     keine atomare Multi-Persona-Operation.
   - Karte 02 § M04-Erweiterungs-Sub-Block (Brief 03) hatte einen
     Verweis auf Brief 04 für die Persona-Mehrfachheit; Brief 04
     liefert die Auflösung jetzt.

f) **Trade-off-Klausel in INTERFACES (§ 9.6) + Karte 02 § Multi-
   Identität (Brief 04) § Trade-off-Klausel:**
   - IndexedDB-Verlust löscht ALLE Identitäten gleichzeitig — Anker 5
     (Identitäts-Container) bleibt parallel sinnvoll. Brief 04
     verweist; Container-Schema ist Anker 5's Spec.
   - **Multi-Identitäts-Backup-Strategie:** Spec-Empfehlung „ein
     Container mit allen Identitäten" (Klaus' „kompletter Rucksack"-
     Vision aus PULS § Vision-Anker 6). Bau-Folge-Sitzung 02.Y zieht
     das Backup-Schema additiv nach (`SbkimBackupBlob.payload.identities[]`
     pro Slot). **`BACKUP_FORMAT_VERSION` wird in der Bau-Folge-
     Sitzung von 1 auf 2 gebumpt** — additiver Bump des separaten
     Backup-Wrapper-Schemas; KEIN `PROTOCOL_VERSION`-Eingriff
     (Spore-Schema bleibt unverändert).
   - Königin-Relay (Anker 4) muss pro-Identität-Mailboxes verwalten,
     wenn Modul 13 gebaut wird — Brief 04 verankert die Konvention,
     das *Wie* ist Anker 4's Spec.
   - Verwirrungs-Risiko in der UI: Identitäts-Wechsler-UX ist nicht
     Brief-04-Sache; gehört in die Sage-Page-Refactor-Bau-Sitzung
     (BRIEF_99-Liste).

**Apoptose-Granularität entschieden (Brief 04):**

- **`confirmSelfApoptose` ist global** — alle Personae sterben
  gemeinsam, Vermächtnis-Versand pro Persona an deren jeweilige
  Geschwister, Cleanup iteriert über alle Slots. Nach Abschluss ist
  `listIdentities()` leer; `sbkim_meta["active-identity"]` ist
  gelöscht. Karte 07 § Multi-Identität (Brief 04) dokumentiert den
  Pfad in voller Reihenfolge.
- **`SbkimSpore.removeIdentity(key, {force:true})` ist die Single-
  Identitäts-Apoptose** — Modul 02 ist Owner, ruft Modul 07's
  internen Hook `_sendLegacyForIdentity(key, reason)` für den
  Vermächtnis-Versand pro Persona. Die anderen Personae leben weiter.
- **Receiver-Pfad in `receiveLegacy`** baut beim init() eine Map
  nodeId→key, prüft eingehendes `toNodeId` und schreibt in
  `sbkim_legacy_inbox_<hit-key>` — andere Personae bleiben unangetastet.

**Heilige Tafeln eingehalten:**

- **INTERFACES verbindlich.** Schnittstellen-Änderungen ZUERST in
  INTERFACES, dann in den Karten 02 / 05 / 06 / 07. § 1 Modul 02 +
  § 1 Modul 05 + § 1 Modul 06 + § 1 Modul 07 + § 2 Spore-JSON + § 9
  Identitäts-Map (neu) + § 10 Änderungsprotokoll (war § 9) alle
  verankert; Karten 02 / 05 / 06 / 07 nachgezogen.
- **PROTOCOL_VERSION-Disziplin geprüft, kein Bump.** Strategie A für
  `spore.json` gewählt (additiv, kein Spore-Schema-Eingriff); alle
  neuen API-Funktionen sind additiv (alter Singleton-Aufruf-Pfad
  bleibt wortwörtlich gültig); `sbkim_keys[key]` und
  `sbkim_meta["active-identity"]` sind lokales Storage-Schema, kein
  Spore-Feld. PROTOCOL_VERSION bleibt `"0.1"`.
- **`BACKUP_FORMAT_VERSION`-Bump-Vermerk** (Spec-Entscheidung in
  Brief 04, Code-Bump erfolgt in Bau-Folge-Sitzung 02.Y): von 1 auf
  2 für die Multi-Identitäts-Backup-Strategie „kompletter Rucksack".
  Das ist ein additiver Bump des separaten Backup-Wrapper-Schemas
  aus § 0; KEIN `PROTOCOL_VERSION`-Eingriff.
- **Anti-Vorgriff auf V4 Königin-Relay:** Brief 04 spezifiziert die
  Pro-Identität-Mailboxes-Pflicht; das *Wie* der Königin-Umsetzung
  bleibt Anker 4's Spec-Sitzung.
- **Anti-Vorgriff auf V5 Identitäts-Container:** Brief 04 erweitert
  Backup-Format implizit auf alle Identitäten („kompletter Rucksack"),
  spezifiziert den Container nicht (Anker 5 hat eigene Spec-Sitzung).
- **Persona-Isolation:** verbindliche Spec-Klausel in § 9.2 (Stores
  pro Persona getrennt; ein Peer gehört einer Persona, nicht dem
  ganzen Knoten); Folge-Spec darf die Klausel nur unter ausdrücklicher
  Trade-off-Verhandlung lockern.
- **Privatheit (Anker 9 § Sorge ums Freigeben):** bleibt offen —
  Brief 04 rührt die Lizenz-Frage nicht. Lizenz-Entscheidung wird
  beim Public-Schalten separat geklärt.
- **Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):**
  Fünf Punkte abgehakt — (1) Brief-03-PR #98 ist gemerged, `main`-
  Stand bei `27d6a19`; (2) INTERFACES § 0 / § 1 Modul 02 / § 1 Modul
  04 / § 2 / § 7 / § 8 / § 9 auf Brief-03-Stand; (3) M04-Erweiterung-
  Felder (`embeddingCapabilities` + `embeddingNeeds`) in der Multi-
  Identitäts-Spec gespiegelt (pro Identitäts-Slot eigener Spore-Eintrag
  mit eigenen Vektor-Slots); (4) Keine Korrekturen an Brief 01 / 02 /
  03 nötig; (5) PR #89 (Karte 15 Membran als Stub, Draft) bleibt
  unangetastet — Modul-15-Block liegt nach Modul 09 in INTERFACES,
  kollidiert nicht mit den Brief-04-Eingriffen in § 1 Modul 02 / 05 /
  06 / 07 / § 2 / § 9 / § 10 + Karten 02 / 05 / 06 / 07.

**BRIEF_99 angelegt:** `docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md`
als letzte Datei-Aktion (Kaskaden-Konvention 2). Inhalt: Zusammenfassung
aller vier Stränge (V1 Sage-Hybrid / Plattform-Matrix / M04-Erweiterung
/ Multi-Identität), Bau-Sitzungs-Brief-Liste nach Kaskaden-Abschluss
(Sage-Page-Refactor mit voller init()-Kette + Andock-Wizard +
Schichten-Lampen + Identitäts-Wechsler; Bau Stufe A erweitert; Bau
Stufe B; Bau Multi-Identitäts-Migration der Endknoten), Konsistenz-
Prüfungs-Pflicht (alle vier Strang-PRs gemerged), PROTOCOL_VERSION-
Status-Snapshot (bleibt `"0.1"`).

**Kaskaden-Konvention 6** (Auslöser-Befehl im Chat, nicht Brief-
Volltext) propagiert: BRIEF_99's „Pflicht am Ende" formuliert keine
Folge-Sitzung mehr (Kaskade schließt), aber benennt die Bau-Sitzungs-
Brief-Pipeline für die nächste Welle.

**Was NICHT angefasst:** Modul-Code in `src/` (Spec geht der
Implementierung voraus); Sage-Page `index.html` (Sage-Page-Refactor
ist Bau-Sitzung nach Kaskaden-Abschluss in der BRIEF_99-Liste); M04-
Erweiterung-Änderung (Brief 03 hat sie gesetzt); Plattform-Matrix
(Brief 02); CLAUDE.md (Brief 01 hat sie auf „Hub und Knoten zugleich"
umgeschrieben); Karte 09 (Brief 01 hat § Schritt 1 erweitert);
`status.json` (Brief 01 hat Sage als endknoten[]-Eintrag aufgenommen).
`update_puls_pie.py` NICHT aufgerufen (kein `status.json`-Score-
Wechsel). `tests/manual_check.html` unangetastet (Spec-Sitzung, kein
UI-Eingriff). Königin-Relay-Spec (V4 eigene Spec); Identitäts-
Container-Spec (V5 eigene Spec); Extension / Mini-Browser-Spec (V7 /
V8 eigene Specs).

**Vision-Anker 6 § Status nachgezogen** auf „Strang 3 der V1-
Sammelspec realisiert (2026-05-19, Brief 04 der V1-Sammelspec-
Kaskade)" mit Verweis auf BRIEF_99-Abschluss. Vision-Anker 1 / 4 /
5 / 7 / 8 / 9 **unangetastet** — Brief 04 ist Strang 3, ohne Bezug
zu deren Status-Blöcken.

**Paralleler offener PR:** PR #89 (Karte 15 Membran als Stub, Draft,
head `claude/browser-use-indexeddb-Jopiy`) bleibt unangetastet —
eigener Modul-15-Block nach Modul 09 in INTERFACES, kollidiert nicht
mit den Brief-04-Eingriffen.

**Manueller Sichttest:** **ungeprüft, weil reine Doku-Pflege** —
kein Modul-Code in `src/`, kein `tests/manual_check.html`-Eingriff,
keine Sage-Page-Änderung; `status.json` unverändert
(`update_puls_pie.py` nicht aufgerufen).

**Nächster sinnvoller Schritt:** Klaus mergt diese Spec-Sitzung (damit
INTERFACES § 9 + Karten 02 / 05 / 06 / 07 + BRIEF_99-Datei auf `main`
liegen) und startet die BRIEF_99-Abschluss-Sitzung über den Auslöser-
Befehl (Kaskaden-Konvention 6, siehe Chat-Antwort). BRIEF_99 setzt
diesen PR als gemerged voraus.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-19_spec-multi-identitaet.md](sessions/archiv/2026-05-19_spec-multi-identitaet.md).

---

### 2026-05-18 · Mini-Pflege — Sonnen-Galaxie um Station 5 (DE-Paper) erweitert

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/bau-vision-10-sonnen-galaxie-JxoIH` (Folge nach PR-#92-Merge,
auf aktuellem `origin/main` rebased). Klaus hat das deutsche
SBKIM-Paper als HTML hochgeladen und entschieden: **als 5. Station
mit eigener Galaxie**.

**Kern:** Die Sage-Geschichts-Galerie trägt jetzt **fünf** Stationen.
Station 5 ist das deutsche Pendant zum englischen SBKIM-Paper, mit
identischer Sieben-Sektionen-Struktur und derselben Print-zu-PDF-
Logik (`window.print()`-Button am unteren Rand). Galaxie-Form:
`galaxy-quasar` (Lichtstrahl-Beams, visuell auffällig — passt zum
wissenschaftlichen Niederschlag). Die Bahn-Ellipse skaliert
automatisch — fünf Phasen à 72°.

**Was eingebaut:**

- `docs/papers/sbkim-paper-de.html` eingecheckt (Klaus' Upload,
  vollständige deutsche Übersetzung des EN-Papers, eigener
  Print-Button — kein separates PDF nötig, gleiche Logik wie EN).
- `STATIONS_DATA` um fünften Eintrag erweitert (`idx: 4`,
  `status: 'live'`, `shape: 'galaxy-quasar'`, `size: 'large'`,
  `href: 'docs/papers/sbkim-paper-de.html'`). Bewegungs-Mathematik
  unverändert — Phasen-Verteilung erfolgt automatisch über
  `STATIONS_DATA.length`.
- PULS § Anker 10 § Stationen-Inventar um Zeile für Station 5
  ergänzt; Überschrift „Start-Konfiguration · 4 Galaxien" auf
  „5 Galaxien" angehoben.
- PULS § Anker 10 § Status um Station-5-Vermerk + Verweis auf
  72°-Phasen-Verteilung erweitert.
- `docs/papers/README.md` um Zeile für DE-Datei ergänzt;
  Einleitungstext von „eine Datei" auf „zwei Dateien" angehoben.

**Heilige Tafel — Privatheit:** Pre-Commit-`grep -i everlast` clean
auf `index.html`, `docs/papers/sbkim-paper-de.html`, PULS, README,
Session-Protokoll, Commit-Message. Das DE-Paper enthält **keinen**
kommerziellen Kontext — es ist der wissenschaftliche Niederschlag,
nicht der Werdegang. Klausel eingehalten.

**Format-Entscheidung „HTML statt PDF":** Das DE-Paper hat — wie
das EN-Paper — einen eingebauten „Als PDF speichern"-Knopf
(`window.print()`). On-demand-PDF aus dem Browser heraus, kein
separates PDF-File im Repo. Konsistent zum EN-Paper.

**Was NICHT angefasst:** Modul-Code, INTERFACES.md, Komponenten-
Karten, Optik der Sonnen-Karte, Bewegungs-Mathematik (skaliert sich
selbst), Observatorium-Screen, `status.json`.

**Manueller Sichttest:** ungeprüft headless — Klaus prüft im
Browser auf `localhost:8000/#sonnen` bzw. nach GitHub-Pages-Deploy,
dass (a) fünf Galaxien statt vier auf der Ellipse tanzen, (b) die
neue Quasar-Galaxie das DE-Paper-Modal mit „Original-Dokument
öffnen →"-Link öffnet, (c) der Print-Knopf im DE-Paper das PDF
on-demand erzeugt.

**Nächster sinnvoller Schritt:** Sichttest; danach entweder
Wachstum (sechste Station) oder Themen-Abschluss.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-18_pflege-sonnen-station-5-de-paper.md](sessions/archiv/2026-05-18_pflege-sonnen-station-5-de-paper.md).

---


### 2026-05-18 · Mini-Pflege — Vision-Anker M04-Erweiterung als neunter Anker

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-m04-erweiterung`. Brainstorming-Sitzung
mit zwei Strängen — Klaus hat die **Brücke zwischen SBKIM-Paper
(Plattform-Form) und Mycel-Form** sichtbar gemacht und parallel die
Sorge ums spätere Freigeben thematisiert.

**Kern:** Modul 04 macht heute nur einseitigen Cosinus-Vergleich; die
drei Schichten (fachlich / prozess / skalierung), das Brücken-Feld
und die doppelte Spore (capabilities + needs auf beiden Seiten) aus
dem ursprünglichen Paper-Pitch leben als implizite Vision weiter,
sind aber bislang nicht in PULS verankert. Anker 9 holt sie ein.

**Was eingetragen:**

- **PULS.md § Vision-Anker** um neunten Anker erweitert: „M04-
  Erweiterung — drei Schichten + Brücke + doppelte Spore" mit
  Konzept, Match-Pipeline (Stufe A lokal + Stufe B optional LLM),
  Architektur-Skizze, Verbindungen zu V1/V4/V5/V6/V7/V8 + Modul 06,
  Historie Paper ↔ Mycel, Größenordnung, Status.
- **PULS.md § Vision-Anker Anker 7 Status** ergänzt um Verweis
  „Anschluss an Anker 9".
- **PULS.md § Vision-Anker Anker 8 Status** ergänzt um Verweis
  „natürlicher Träger der LLM-Stufe-B-Calls" + Wechsel „Acht" →
  „Neun Vision-Anker".
- **PULS.md § Sitzungs-Einträge** neuer Top-Eintrag (dieser).
- **PR-#85-Sitzungs-Eintrag** (Mini-Browser, Anker 8) per Konvention
  ins Archiv-Index ausgelagert; Übergabeprotokoll bleibt unverändert.
- **Übergabeprotokoll** `docs/sessions/archiv/2026-05-18_mini-pflege-vision-anker-m04-erweiterung.md`.

**Neun Vision-Anker jetzt im Repo:**

1. V1 — Sage als Hybrid-Knoten (Klaus' nächste Spec-Wahl, jetzt im
   Großbrief erweitert um Anker 9 + Anker 6 + Plattform-Matrix)
2. V2-Ausbau — Niedrigeres Onboarding (drei gleichwertige Pfade)
3. Universum-Vision (umgesetzt PR #79 + #80)
4. Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister
5. Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser
6. Multi-Identität in der IndexedDB
7. SBKIM-Browser-Extension („Lampe in der Toolbar") — PR #84
8. Eigener Mini-Browser (Tauri-App) — PR #85
9. **M04-Erweiterung** (drei Schichten + Brücke + doppelte Spore) — neu

**Paper-↔-Mycel-Brücke:** der ursprüngliche SBKIM-Pitch trug drei
Schichten + Brücken-Feld als Kern-Innovation. Beim Pivot zur Mycel-
Form wurde Modul 04 bewusst minimal gehalten (Cosinus + Schwelle),
um die Infrastruktur zuerst tragfähig zu bekommen. Anker 9 macht die
zurückgestellte Tiefe explizit und nennt sie als Bau-Ziel der V1-
Sammelspec — kein eigener V1-paralleler Strang, sondern integraler
Teil.

**Sorge ums Freigeben (dokumentiert, nicht gehandelt):** Klaus hat
Bedenken vor späterem Public-Schalten — Lizenzwahl (CC-BY-NC vs AGPL
vs MIT) bleibt offen, Sage ist heute privat, kein Lecken. **Diese
Pflege ändert daran nichts.** Lizenz-Entscheidung wird beim Public-
Schalten separat geklärt.

**Was NICHT angefasst:** Modul-Code, INTERFACES.md, Modul-Karten,
Sage-Page, `status.json`. Vision lebt rein in PULS, kein Code-
Eingriff. `update_puls_pie.py` NICHT aufgerufen.

**Plattform-Ehrlichkeit:** Stufe B (LLM-Call) braucht User-eigenen
API-Key. Wer keinen hinterlegt, bleibt bei Stufe A — kein Knoten ist
gezwungen, einen Drittanbieter zu nutzen. Stufe A bleibt das
**rückgrat-tragende lokale Matching**, Stufe B ist Vertiefung.

**Großbrief vorbereitet:** Klaus möchte die V1-Sammelspec als mehr-
tägige Sitzung führen — Scope erweitert um Anker 9 (M04-Erweiterung),
Anker 6 (Multi-Identität / Mehrfach-Sporen-Identität) und die
**Plattform-Matrix** (Sporen-Verhalten in Desktop-Browser / DeX-
Tablet / PWA-installiert / Mini-Browser / Extension). Der Brief liegt
Klaus am Chat-Tab zur Auslösung vor, wann er Zeit hat — er läuft
NICHT automatisch.

**PULS-Zeilen-Status:** Sitzungsstart 3105 Zeilen, jetzt **3254 Zeilen**
(+149). Der neunte Vision-Anker selbst ist ~130 Zeilen dauerhafter
Eintrag (Konzept, Pipeline, Architektur, Verbindungen, Historie,
Größenordnung, Status); Sitzungs-Eintrag +78 minus PR-#85-Auslagerung
-75 ist nahezu neutral. Mit PR #85 + dieser Pflege liegt PULS jetzt
deutlich über der 3000er-Schutz-Klausel. **Dezidierte Auslager-Sitzung
mehrerer älterer Sitzungs-Einträge bleibt überfällig** und wandert in
die nächsten sinnvollen Schritte vor V1-Sammelspec.

**Nächster sinnvoller Schritt:** Klaus entscheidet — V1-Sammelspec
auslösen (mehrtägig, großer Brief in dieser Chat-Antwort als
Codeblock), oder mehrere alte Sitzungs-Einträge ins Archiv auslagern
(PULS unter 3000 bringen, eigene Mini-Pflege), oder Pause.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-18_mini-pflege-vision-anker-m04-erweiterung.md](sessions/archiv/2026-05-18_mini-pflege-vision-anker-m04-erweiterung.md).

### 2026-05-18 · Mini-Pflege — Vision-Anker Multi-Identität in der IndexedDB

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-multi-identitaet`. Folge zur Marathon-
Tag-Pflege vom Vortag (PR #75-#82). Klaus' Folge-Gedanke nach dem
Schlaf: präzisiert seine gestrige IndexedDB-Frage zum **sechsten
Vision-Anker**, klar abgegrenzt zu Lehre 1 (Browser-Instanzen-
Trennung).

**Kern:** Was Lehre 1 als Verlust-Risiko beschreibt — zwei Browser-
Instanzen erzeugen ungewollt zwei separate Identitäten — wird hier
als **Feature** umgekehrt: bewusst mehrere Identitäten in derselben
IndexedDB, plus aktive-Identität-Marker, plus UI zum Wechseln.
Persona-Trennung pro Arbeitsoberfläche (Tablet, Desktop, Browser-
Modus) als bewusste Wahl, nicht zufällige Konsequenz.

**Was eingetragen:**

- **PULS.md § Vision-Anker** um sechsten Anker erweitert: „Multi-
  Identität in der IndexedDB (Modul 02 Erweiterung)" mit Konzept-
  Beschreibung, Spec-Schritten, Trade-offs, Verbindungen zu V1/V3/
  V4/V5, Status (reif für Spec-Diskussion, wartet auf V1).
- **PULS.md § Sitzungs-Einträge** neuer Top-Eintrag (dieser).
- **Übergabeprotokoll** `docs/sessions/archiv/2026-05-18_mini-pflege-vision-anker-multi-identitaet.md`.

**Sechs Vision-Anker jetzt im Repo:**

1. V1 — Sage als Hybrid-Knoten (Klaus' nächste Spec-Wahl)
2. V3-Ausbau — Niedrigeres Onboarding
3. Universum-Vision (umgesetzt PR #79 + #80)
4. Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister
5. Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser
6. **Multi-Identität in der IndexedDB** — neuer Anker (dieses)

**Was NICHT angefasst:** Modul-Code, INTERFACES.md, Modul-Karten,
Sage-Page, `status.json`. Vision lebt rein in PULS, kein Code-
Eingriff. `update_puls_pie.py` NICHT aufgerufen.

**Nächster sinnvoller Schritt:** Klaus entscheidet — Storage-Persist-
Schutz-Mini-Pflege oder Spec-Sitzung V1 (Brief liegt fertig in gestrigen
Chat).

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-18_mini-pflege-vision-anker-multi-identitaet.md](sessions/archiv/2026-05-18_mini-pflege-vision-anker-multi-identitaet.md).

### 2026-05-17 · Mini-Pflege — Vision-Anker Königin-Relay (Modul 13?)

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-koenigin-relay`. Folge zur Cursor-Variante
(PR #81 `047294b`) und allen Universum-Sitzungen heute.

Klaus' fundamentale Architektur-Frage spät am Abend: **„Was, wenn ich
einmal einen Browser nehme und ein andermal einen anderen? Ist die
Spore nur zu finden, wenn der Browser offen ist? Ist sie empfangsbereit,
wenn der Browser nicht geöffnet ist?"**

Die ehrliche Antwort berührt das **Empfangsmodus-Prinzip des SBKIM-
Papers** („Wer nicht da ist, schweigt"). Browser-PWAs sind nicht für
dauerhaft laufende Dienste gebaut — Pages leben nur solange die Tabs
offen sind, Service-Worker werden nach Stunden suspendiert, IndexedDB
ist pro Browser-Instanz. Das ist konzeptuell sauber für ein peer-to-
peer Mycel, aber eine harte Grenze für Verbreitung außerhalb des
Klaus-Kreises.

Klaus' Bild als Mittelweg: **Königin wie bei Bienen** — Bezugspunkt,
nicht Daten-Eigentümer. Ein **„Königin-Relay" als optionales neues
Modul** (möglicherweise Modul 13). Privacy-wahrend (nur verschlüsselte
Envelopes, nicht private Schlüssel). Optional anbindbar (peer-to-peer-
Default bleibt). Mehrere Königinnen möglich (kein Single Point of
Failure).

**Was eingetragen:**

- **PULS.md § Vision-Anker** um vierten Anker erweitert:
  „Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister" mit
  Modell-Beschreibung, drei Implementations-Optionen (Server / PWA-
  mit-Push / Eigenes-Gerät), Anknüpfung an V1 (Sage als erster Schritt
  in Königin-Richtung), Trade-offs (Privacy-Annahmen, Hosting-Frage,
  Implementations-Aufwand), Status (reif für Spec-Diskussion **nach**
  V1).
- **PULS.md § Sitzungs-Einträge** neuer Top-Eintrag (dieser).
- **Übergabeprotokoll:** `docs/sessions/archiv/2026-05-17_mini-pflege-vision-anker-koenigin-relay.md`.

**Reihenfolge der Visionen jetzt:**

1. **V1 — Sage als Hybrid-Knoten** (Klaus' explizite nächste Spec-
   Wahl, eingetragen 2026-05-17 Vision-Anker-Pflege PR #78)
2. **V3-Ausbau — Niedrigeres Onboarding** (langfristiger Plan)
3. **Universum-Vision — Bildlich-animiertes Mini-Universum** (umgesetzt
   in PR #79 + Lehre 8 in #80)
4. **Königin-Relay (Modul 13?)** — neuer Anker (dieses), wartet auf
   V1-Erfahrung + IndexedDB-Persist-Schutz-Praxis
5. **Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser**
   — fünfter Anker (dieses), vier Konzept-Pfade (Datei-Backup-UX schon
   teilweise da, Hardware-Wallet/WebAuthn als Fern-Vision, Passkey-
   Sync als pragmatische Brücke, Mini-Browser kombiniert mit V3)

**Was NICHT angefasst:** Modul-Karten, INTERFACES.md, status.json,
Sage-Page (Vision lebt rein in PULS, kein Code-Eingriff).
`update_puls_pie.py` NICHT aufgerufen.

**Nächster sinnvoller Schritt:** Pause / Schlaf. Klaus hatte einen
Marathon-Tag (PR #75 → #76 → #77 → #78 → #79 → #80 → #81 → #82).
Diese Vision verdient frischen Kopf.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-17_mini-pflege-vision-anker-koenigin-relay.md](sessions/archiv/2026-05-17_mini-pflege-vision-anker-koenigin-relay.md).

### 2026-05-17 · Mini-Pflege — Observatorium-Lehre 8 + 8. Galaxie

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-observatorium-lehre-8`. Folge zur Bau-Sitzung
Browser-Observatorium-Universum (PR #79 `d9ac013`).

Klaus' Befund beim Universum-Sichttest auf Galaxy Tab S6 + Samsung
DeX: **DeX-Android zeichnet einen System-Cursor-Overlay**, der durch
keine CSS-`cursor`-Property überschreiben werden kann. Wir haben sieben
Cursor-Workaround-Varianten durchprobiert (`none`, `crosshair`, SVG-
Custom-Cursor, PNG-Custom-Cursor 1×1 und 32×32, …) — alle ignoriert. Nur
`cursor: pointer` für klickbare `<button>`-Elemente wird respektiert.

**Was eingetragen:**

- **`docs/OBSERVATORIUM_BROWSER.md`** um **Lehre 8 „DeX-Cursor-Overlay
  ist nicht überschreibbar"** erweitert (Beobachtung, Tabelle der sieben
  versuchten Workarounds, Konsequenzen, pragmatische Workarounds,
  Vorteile-Vermerk). Folgt der Pflege-Konvention dieser Datei (lebende
  Sammlung, neue Lehren bekommen eigenen Block).
- **`index.html`** um **achte Galaxie** im Universum erweitert:
  Shape `galaxy-edgeon`, eine taumelnde Disk-Galaxie. CSS-Keyframe
  `@keyframes galaxy-precess` rotiert sie um die eigene Achse (15s
  ease-in-out) und kippt sie zyklisch zwischen 8° und 74°
  `rotateX` — sie wirkt zyklisch flacher und runder wie eine Frisbee
  in Sicht-Drehung. Klaus' visuelle Erinnerung daran, dass nicht
  alles, was man festhalten will, sich festhalten lässt.
- Modal-Kurzfassung zur Galaxie 8 enthält die Workaround-Tabelle als
  knappe Variante + den philosophisch-poetischen Schlusssatz.

**Was NICHT angefasst:**

- Modul-Code, INTERFACES.md, status.json.
- Andere Galaxien des Universums (Phase 1 aus PR #79 final).
- IndexedDB-Persist-Schutz (`navigator.storage.persist()` in
  `SbkimStorage.init()`) — bleibt offene Folge-Mini-Pflege „Storage-
  Persist-Schutz", weil das ein Modul-01-Eingriff ist und nicht zum
  Observatorium-Bau gehört.

**`status.json`** unverändert. PULS unter 3000-Zeilen-Schutz.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-17_mini-pflege-observatorium-lehre-8.md](sessions/archiv/2026-05-17_mini-pflege-observatorium-lehre-8.md).

### 2026-05-17 · Mini-Pflege — Vision-Anker (V1 / V3 / Universum)

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker`. Folge zu Live-Channel-Handshake
(PR #77 `7c08b88`).

Klaus hat nach erfolgreichem Live-Cross-Knoten-Handshake drei
langfristige Visionen geäußert, die nicht verloren gehen sollen
ohne sofort Spec oder Bau auszulösen. Diese Pflege legt einen
neuen PULS-Block **§ Vision-Anker** an (parallel zu § Schutz-
Backlog und § Diffusion-Backlog) und trägt drei Visionen ein:

1. **Sage als Hybrid-Knoten (Variante I)** — Klaus' Ameisenkönigin-
   Bild: Sage kann Hub bleiben **und** zugleich vollwertiger
   Endknoten werden. CLAUDE.md / INTERFACES.md / status.json /
   Sage-Page müssen nachgezogen werden. Sage's Domäne ist offen
   (Mycel-Bibliothek / SBKIM-Glossar / Sage-Observatorium).
   **Status: reif für Spec-Sitzung, Klaus' nächste Wahl.**
2. **Niedrigeres Onboarding (Variante III-Ausbau)** — Karte 09's
   9 Schritte schrecken ab. Drei Pfade als langfristiger Plan:
   Andock-Wizard als Standalone-PWA, SBKIM-PWA-Distribution mit
   GitHub-Identität als Geschenk-Paket, eigener Browser-Wrapper
   (Electron/Tauri/Capacitor) als Fern-Vision. Verbreitung
   außerhalb Klaus-Kreis macht Schutz-Backlog-Module 10/11/12
   akut. **Status: reif für Vor-Diskussion, nicht für Spec.**
3. **Browser-Observatorium-Universum (visuelle Variante)** — die
   sieben Lehren der `OBSERVATORIUM_BROWSER.md` als animiertes
   Mini-Universum in der Sage-Page, jeder Stern eine Lehre, Klick
   öffnet Modal mit gerendertem md-Text. md bleibt Wahrheits-
   Quelle, Universum liest sie clientseitig (minimaler md-Parser
   ohne externe Library). **Status: reif für eigene Bau-Sitzung,
   jederzeit zwischen V1- und V3-Bau einschiebbar.**

**Was eingetragen:** PULS.md neuer Block § Vision-Anker (~120
Zeilen) mit drei Vision-Ankern in voller Tiefe. PULS § Sitzungs-
Einträge neuer Top-Eintrag (dieser). Übergabeprotokoll
`docs/sessions/archiv/2026-05-17_mini-pflege-vision-anker.md`.

**Was NICHT angefasst:** Modul-Karten, INTERFACES.md, `src/`-Code,
Sage-Page `index.html`. `status.json` unverändert — Visionen sind
keine Modul-Stände. `update_puls_pie.py` nicht aufgerufen.

**Nächster sinnvoller Schritt:** Spec-Sitzung „Sage als Hybrid-
Knoten (Variante I)" als nächste Phase. Eigener Brief, eigener
Branch. Klärt CLAUDE.md-Umschreibung, INTERFACES.md-Aufnahme,
Sage's Domäne, Module-Lade-Strategie, App-SW-Variante. **Kein
Bau-Code in der Spec-Sitzung** — nur Verträge.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-17_mini-pflege-vision-anker.md](sessions/archiv/2026-05-17_mini-pflege-vision-anker.md).

### 2026-05-17 · Mini-Pflege — Live-Channel-Handshake + Browser-Observatorium

**Sitzungs-Rolle:** Mini-Pflege (Folge zur Bau-Sitzung
BroadcastChannel-Bridge, PR #75 `b8c8f41`, und Mini-Pflege Bau-
Sichttest, PR #76 `8801896`). Branch
`claude/pflege-live-channel-handshake-observatorium`. Klaus hat
**den ersten regulären Cross-Knoten-Handshake im SBKIM-Netz ohne
localStorage-Bypass** über Eruda gefahren — das Ziel der gesamten
Sitzungskette PR #65 → #70 → #71 → #72 → #73 → #74 → #75 → #76 ist
erreicht.

**Ablauf (Klaus, Galaxy Tab S6 + Samsung DeX, Termux 0.118):**

1. **Endknoten-Pflege:** `src/modules/05_anastomose.js` aus
   Sage-Protokol-main (Commit `8801896`, mit BroadcastChannel-Bridge
   aus PR #75) in beide Endknoten kopiert als `sbkim/05_anastomose-v2.js`
   (File-Rename als Cache-Bust, Konvention aus PR #73). `<script>`-
   Referenz in `index.html` via `sed` umgestellt. Commits:
   Mein-Rezeptbuch `a1b9ded`, Mein-Mixarium `9d2f127`.
2. **Sichttest Stufe 1 (Bau-Tests im Browser):** Klaus hatte vorher
   `tests/manual_check.html` aus dem Sage-Protokol-Clone über lokalen
   `python3 -m http.server 8000` (Termux) im Tablet-Chrome aufgerufen
   und Panel 05 Knöpfe 9 / 9a / 9b / 9c durchgeklickt — vier von vier
   grün (siehe Mini-Pflege „Bau-Sichttest BroadcastChannel-Bridge grün"
   in PR #76).
3. **IndexedDB-Verlust-Befund:** beim Live-Test in DeX-Chrome zeigten
   beide Endknoten-Tabs „SBKIM-Andock bereit. Spore erzeugen mit
   `__sbkimErzeugeSpore()`" — die alten 2026-05-16-Identitäten waren
   weg. Ursache nicht abschließend geklärt: vermutlich Chrome-Update
   / Site-Daten-Löschung / Storage-Quota / PWA-Re-Install zwischen
   2026-05-16 und 2026-05-17.
4. **Re-Andock in DeX-Chrome:** in beiden Tabs `__sbkimErzeugeSpore()`
   ausgeführt, Embedding-Modell (~30 MB) erstmals vom CDN gezogen,
   Spore-JSON via Blob-Download nach `~/storage/downloads/`,
   `cp`-Befehl in Termux nach `~/Mein-{Rezeptbuch,Mixarium}/sbkim/
   spore.json`, Commit + Push. Neue nodeIds: Mein-Rezeptbuch
   `BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY` (Commit `3bcc453`),
   Mein-Mixarium `JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY`
   (Commit `e9d0a45`). Pages-Deploy abgewartet + via
   `curl ...?$(date +%s)` verifiziert (beide neue IDs live).
5. **Live-Handshake-Test:** in Mein-Rezeptbuch-Tab (DeX-Chrome,
   Multi-Window mit Mein-Mixarium nebeneinander) regulärer
   `SbkimAnastomose.handshake(peerSpore, ownVec)`-Aufruf via Eruda
   (kein expliziter `transport`-Override → Default `"auto"`).
   HTTP-POST gegen `Mein-Mixarium/sbkim/anastomosis` scheitert mit
   405 (Pages), Auto-Fallback greift, Channel-Pfad routet via
   `BroadcastChannel('sbkim')` zum Mein-Mixarium-Tab, Receiver
   filtert + ruft `receiveHandshake`, signiert Response kanonisch.
   **Resultat:**
   ```json
   {
     "outcome": "established",
     "peerNodeId": "JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY",
     "peerDomain": "lausiklauskn-png.github.io",
     "score": 0.9544261159927087
   }
   ```
6. **Gegenrichtung verifiziert:** im Mein-Mixarium-Tab denselben
   `handshake()` mit Rezeptbuch als Peer → `outcome:"established"`,
   `peerNodeId: BSWxXmXvxF8FUR_…`, identischer Score 0.9544
   (cosine ist symmetrisch, gleicher domainVector-Vergleich).
7. **Sibling-Persistenz:** `SbkimAnastomose.listSiblings()` in
   Mein-Rezeptbuch zeigt Mein-Mixarium als Geschwister-Eintrag in
   IndexedDB — Bidirektionalität bewiesen.

**Score-Beobachtung 0.9544:** Kochrezepte- und Cocktail-Domain liegen
semantisch sehr eng — weit über `PROVIDER_MIN_MATCH = 0.80`. Klaus'
Hypothese „Cocktails und Kochrezepte vielleicht zu unterschiedlich"
(aus 2026-05-16) ist nun zum zweiten Mal widerlegt.

**Browser-Observatorium-Lehren (Tech-Note für Andocker/Programmierer):**

Klaus' Auftrag „Vermerk im Observatorium über die Abgründe und Tiefen
eines Browsers" wurde umgesetzt:

- **Neue Doku-Datei** [`docs/OBSERVATORIUM_BROWSER.md`](OBSERVATORIUM_BROWSER.md)
  mit sieben Lehren aus dem 2026-05-17-Live-Betrieb: Browser-Instanzen-
  Trennung (DeX vs. Tablet), IndexedDB-Persistenz-Risiken,
  BroadcastChannel-Bedingungen, Service-Worker-Cache-Strategien,
  Eruda ≠ Chrome-DevTools, Termux + Android-Storage als Brücke, DeX
  als Test-Plattform. Pro Lehre Beobachtung + Phänomenologie +
  Konsequenz für SBKIM + Workarounds + Vorteile. Lebende Sammlung,
  Pflege-Konvention dokumentiert.
- **Sage-Page (`index.html`) neue Karte „Browser-Observatorium ·
  Anziehung ins Detail"** am Ende des Overview-Screens — ein
  simuliertes schwarzes Loch mit rotierendem Akkretionsscheiben-
  Gradient, schwarzem Ereignishorizont und einem verschwommenen
  Chrome-Icon, das durch CSS-Keyframes in Endlos-Schleife in den
  Kern gezogen wird. Hover beschleunigt die Animation und zieht
  die Szene leicht zum Cursor (subtile Sog-Geste via
  `requestAnimationFrame`, keine echte Cursor-Manipulation — die
  unterbindet der Browser aus Sicherheitsgründen). Klick öffnet die
  neue Doku-md auf GitHub. Tagline „Browser sind wie schwarze
  Löcher, neugierig?" (Klaus' Wortlaut). `prefers-reduced-motion`
  respektiert (keine Animation bei aktivierter Einstellung).

**`pingStatus`-Update:** Endknoten-Tabelle in PULS § Endknoten —
Mein-Rezeptbuch und Mein-Mixarium von `"live-direct"` (manueller
Bypass) auf `"live-channel"` (regulärer Handshake via Channel-Pfad).
Alte 2026-05-16-nodeIds (`RHhposP0…` / `7xf0tt33_…`) als
Historie-Vermerk in der Tabelle erwähnt; aktive nodeIds sind
`BSWxXm…` / `JOlHK3…`.

**Karte 05 § Bauzustand:** neue Zeile „In Endknoten eingebaut |
2026-05-17 | Klaus + Mini-Pflege Live-Channel-Handshake" mit Score-
Beleg und Verweis auf diesen Sitzungs-Eintrag.

**§ Offene Querschnitts-Fragen aktualisiert:**

- SW-Bridge-Phantom-Cache-Bug-Eintrag von „Architektur-Grenze sauber
  benannt, Klaus-Endknoten-Pflege offen" auf **vollständig erledigt**
  umgestellt — Pflege-Kette von PR #65 bis zu dieser Mini-Pflege
  zugeklappt.
- Neuer Eintrag **„DeX-Chrome vs. Tablet-Chrome — zwei getrennte
  Browser-Instanzen"** als Nebenbei-Befund mit Verweis auf das
  Observatorium § Lehre 1. Kein Code-Eingriff nötig — Workaround
  ist Single-Instance-Disziplin oder Backup-Import via Modul 02.

**Validierung headless:**

- Sage-Page `index.html` JS-Block per `node --check` validiert — grün.
- Markdown-Doku `OBSERVATORIUM_BROWSER.md` formal sauber (Header,
  sieben Lehren, Querverweise, Pflege-Konvention).
- PULS unter 3000-Zeilen-Schutz (aktuell ~2100).
- **Browser-Sichttest der Schwarz-Loch-Karte ausstehend** — Klaus
  prüft die Animation visuell beim nächsten Sage-Page-Aufruf. Falls
  Performance-/Layout-Probleme auf Mobile-Chrome auftreten, eigene
  Mini-Folge-Pflege.

**`status.json` nicht geändert** — keine Score-Bewegung
(Live-Test-Bestätigung). `update_puls_pie.py` nicht aufgerufen.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-17_live-channel-handshake.md](sessions/archiv/2026-05-17_live-channel-handshake.md).

### 2026-05-17 · Mini-Pflege — Bau-Sichttest BroadcastChannel-Bridge grün

**Sitzungs-Rolle:** Mini-Pflege (Folge-Eintrag zur Bau-Sitzung
BroadcastChannel-Bridge, PR #75 `b8c8f41`). Branch
`claude/pflege-bau-05-sichttest-gruen`. Klaus hat Panel 05 Knöpfe
9 / 9a / 9b / 9c im Browser durchgeklickt — **alle vier grün im
ersten Lauf**, keine Modul-Befunde.

**Setup:** Galaxy Tab S6 + DeX, Chrome auf Android, lokaler
`python3 -m http.server 8000` aus Termux gegen frischen
Sage-Protokol-Clone. Embedding-Modell `Xenova/multilingual-e5-small`
über CDN-Fallback (`cdn.jsdelivr.net`) — die `/models/...`-404er
vom Python-Server sind erwartet (`transformers.js` sucht zuerst
lokal, fällt dann ans CDN).

**Test-Ergebnisse (kopiert aus Panel-Output):**

- **Test 9 — Channel-Pfad established (alt → main, intra-tab)** ✓
  ```json
  {
    "response_outcome": "established",
    "response_score": 0.8880516027995051,
    "response_signatur_ok": true,
    "alt_als_sibling_eingetragen": true
  }
  ```
- **Test 9a — toNodeId-Mismatch-Timeout** ✓
  ```json
  {
    "fehler_name": "HandshakeTimeoutError",
    "fehler_message": "Channel-Reply > 4000 ms ausgeblieben.",
    "timeout_ms": 4005
  }
  ```
  Saubere `QUERY_TIMEOUT_MS`-Grenze (5 ms Overhead durch Event-Loop).
- **Test 9b — MissingToNodeIdError synchron** ✓
  ```json
  {
    "request_hat_toNodeId": false,
    "fehler_name": "MissingToNodeIdError"
  }
  ```
- **Test 9c — Auto-Fallback (HTTP 404 → Channel etabliert)** ✓
  ```json
  {
    "ergebnis": {
      "outcome": "established",
      "peerNodeId": "25IUGiGscRhvgYd_O4EqBttkm6XME8KXST1iX2MEbI4",
      "peerDomain": "mixarium.example.org",
      "score": 0.8880516027995051
    },
    "target_endpoint": "http://localhost:8000/nicht-vorhanden-fuer-test-9c/"
  }
  ```

**Beobachtung — Score-Stabilität:** Test 9 und Test 9c liefern
identischen Score 0.8881, weil in beiden Fällen die gleichen
Pseudo-Knoten-Vektoren (alt/main aus dem Setup-Knopf) genutzt
werden. Auto-Fallback funktioniert nicht nur transport-mäßig,
sondern liefert auch dasselbe semantische Ergebnis wie der reine
Channel-Pfad — wie spezifiziert (HandshakeRequest/Response-Schema
unverändert, Envelope nur Transport-Schicht).

**Was eingetragen:** Karte 05 § Bauzustand neue Zeile „Sichttest
BC-Bridge | 2026-05-17 | Klaus + Mini-Pflege Bau-Sichttest-grün" mit
allen vier Test-Outputs. PULS.md Schnellüberblick-Zeile Modul 05
von „Sichttest ausstehend" auf „2026-05-17 grün" umgestellt.

**Was offen bleibt (Klaus' nächster Schritt):**
**Endknoten-Pflege.** `src/modules/05_anastomose.js` aus
`Sage-Protokol` in `Mein-Mixarium/sbkim/` + `Mein-Rezeptbuch/sbkim/`
kopieren (Cache-Bust via File-Rename oder Query-Param), Commit +
Push in beiden Endknoten-Repos. Dann beide PWA-Tabs auf
`lausiklauskn-png.github.io` öffnen und über Eruda regulären
`SbkimAnastomose.handshake(peerSpore, ownVec)` aufrufen.
**Erwartet `outcome:"established"` über den Channel-Pfad** — erster
Cross-Knoten-Handshake **ohne** localStorage-Bypass.

**`status.json` nicht geändert** — Modul 05 bleibt `score:"fertig"`
(Sichttest-Bestätigung, kein Funktionalitäts-Verlust).

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-17_mini-pflege-bau-05-sichttest-gruen.md](sessions/archiv/2026-05-17_mini-pflege-bau-05-sichttest-gruen.md).

### 2026-05-17 · Bau-Sitzung Modul 05 — BroadcastChannel-Bridge implementiert

**Sitzungs-Rolle:** Bau-Sitzung, headless, EINE Phase. Branch
`claude/bau-05-broadcastchannel-bridge-xVjoF`. Direkte Folge zur
Spec-Sitzung BroadcastChannel-Bridge (PR #74, `a5bbd60`). Implementiert
den same-origin Fallback-Transport additiv in
`src/modules/05_anastomose.js` — der HTTP-Pfad bleibt unverändert,
der SW-Pfad (PR #72/#73) wird nicht angefasst, das HandshakeRequest/
Response-Schema bleibt verbindlich, `PROTOCOL_VERSION` bleibt `"0.1"`.

**Code-Eingriffe in `src/modules/05_anastomose.js` (additiv):**

- **Zwei neue Error-Klassen** im Factory-Stil:
  - `InvalidTransportError` (`options.transport` außerhalb Allow-List).
  - `MissingToNodeIdError` (Channel-Pfad ohne `toNodeId` — synchron
    vor dem Posten).
- **Drei neue Konstanten:** `ALLOWED_TRANSPORTS = ["auto","http","channel"]`,
  `BROADCAST_CHANNEL_NAME = "sbkim"`, `REPLY_CHANNEL_PREFIX = "sbkim:reply:"`.
  Außerdem `RESPONSE_REQUIRED_FIELDS`-Liste für den Auto-Fallback-
  Schema-Check (acht Pflichtfelder einer regulären HandshakeResponse).
- **Receiver-Closure `setupBroadcastChannelBridge()`** — eager in
  `init()` direkt nach `setupServiceWorkerBridge()` aufgerufen.
  Strukturanalog zu Letzterem: einmaliger Main-Channel-Listener pro
  Tab, Filter `event.data.type === "SBKIM_ANASTOMOSE_REQUEST"` +
  `payload.toNodeId === ownId` + `payload.fromNodeId !== ownId`
  (Self-Hit-Schutz, E7) + `replyChannelName.startsWith("sbkim:reply:")`
  (Plausibilität). Ruft `receiveHandshake(payload)` (unverändert),
  postet Response-Envelope auf dediziertem Reply-Channel, schließt
  ihn im `finally`. Defensiver `typeof BroadcastChannel === "undefined"`-
  Check für headless Node — kein Throw, kein Log-Spam.
- **Sender-Closure `postChannelEnvelope(request)`** — roher Channel-
  Transport. Prüft synchron `toNodeId` (sonst `MissingToNodeIdError`)
  + `nonce` (sonst `HandshakeNetworkError`). Öffnet Reply-Channel VOR
  dem Posten auf dem Main-Channel (verhindert Race), wartet mit
  `QUERY_TIMEOUT_MS` (4000 ms, keine neue Konstante), `nonceEcho`-
  Doppelt-Bindung gegen Cross-Talk, finally-Cleanup beider Channels.
- **Sender-Closure `sendViaChannel(targetSpore, request, preScore,
  httpCause)`** — vollständiger Channel-Pfad für `handshake()`. Ruft
  `postChannelEnvelope`, loggt `"timeout-channel"` bei Timeout,
  hängt einen optionalen HTTP-`cause` (aus dem Auto-Fallback) an die
  Fehler-Kette, konsumiert die Response via `consumeResponse`
  (verifyForeignSpore, verifyEnvelope, sibling-put, Log).
- **`parseTransport(options)`** — Allow-List-Check mit
  `InvalidTransportError`-Throw bei unbekanntem Wert oder falschem
  Container-Typ. Default kommt aus `transportDefault`-Closure (von
  `_setTransport` überschreibbar). Bei `options === undefined` →
  `transportDefault`.
- **`shouldAutoFallback(httpResponse, parsedJson)`** — Auto-Fallback-
  Entscheidung: HTTP 4xx/5xx ODER non-JSON-Content-Type ODER fehlende
  Pflichtfelder ODER `outcome` außerhalb `{"established","rejected"}`
  → Fallback. Bei Netz-/DNS-/Abort-Fehler ohne HTTP-Status (kein
  Response-Objekt) → **kein** Fallback (Karte 05 § Auto-Fallback-
  Punkt 3: Channel hilft nicht bei DNS-Defekt).
- **`handshake(targetSpore, ownDomainVector, options?)`** —
  Signatur um optionalen dritten Parameter erweitert. Schritte 1–5
  unverändert (Spore-Verify, Versions-Check, lokaler Vor-Check,
  Request-Build, kanonische Signatur). Schritt 5b: bei
  `transport === "channel"` direkt zu `sendViaChannel` ohne HTTP-
  Versuch. Schritt 6 verzichtet auf den `!response.ok`-Throw und
  parst Body immer; bei `transport === "auto"` und
  `shouldAutoFallback(...)` → `sendViaChannel` mit HTTP-`cause`. Bei
  `transport === "http"` bleibt das alte Verhalten (Throw bei 4xx/5xx
  oder defektem Body).
- **Drei neue Test-Brücken:** `_setTransport(t)` (Default-Transport-
  Setter, analog `_setOwnDomainVector`), `_clearChannelState()`
  (setzt Default zurück auf `"auto"`), `_postChannelEnvelope(request)`
  (roher Sender für Panel-Tests ohne `consumeResponse`/sibling-put).
  Vier neue `_meta`-Felder (`responseRequiredFields`,
  `allowedTransports`, `broadcastChannelName`, `replyChannelPrefix`).

**Was NICHT angefasst:** `receiveHandshake` bleibt unverändert (der
Channel-Receiver ruft denselben am Ende auf wie der SW-Bridge).
`HandshakeRequest`/`HandshakeResponse`-Schema unverändert.
`forgetSibling`/`listSiblings` unverändert. Kanonisches Sign/Verify
unverändert (keine zweite Implementation, keine Helper-Duplikation).
`PROTOCOL_VERSION = "0.1"`. `src/sbkim-sw.js` ist mit `isOwnEndpoint`
aus PR #72 abgeschlossen und wurde nicht angetastet.

**Karte 09 Andock-Hinweis erweitert (`docs/components/09_einbau_pwa.md`):**

- **§ Schritt 4 Sub-Block „Same-origin Cross-PWA-Handshake — Andock-
  Hinweis"** unter den Sichtkontroll-Punkt: bei zwei SBKIM-PWAs auf
  derselben Origin (Klaus' GitHub-Pages-Setup) wird der Channel-Pfad
  aktiv. **Beide PWA-Tabs müssen offen sein**, sonst Timeout nach
  4 s. HTTP-Pfad bleibt Standard mit einmaligem Auto-Fallback bei
  klaren Defekt-Signalen. Cross-domain bleibt unverändert HTTP-only.
  Architektur-Hintergrund (Sender-SW intercepted vor Receiver-SW)
  und Verweis auf Karte 05 § BroadcastChannel-Bridge.
- **§ Sichtkontrolle 5- auf 6-Punkt-Block:** neuer Punkt 6 „(Nur
  same-origin Test-Setup) BroadcastChannel-Bridge-Sichttest" — beide
  Tabs offen, BroadcastChannel-Selbstcheck-Knopf in jedem Tab
  klicken (oder Eruda-Console:
  `await SbkimAnastomose.handshake(peerSpore, ownVec, {transport:"channel"})`),
  Erwartung `outcome:"established"` + sibling-Eintrag im IndexedDB
  beider Tabs; Tab-zu-Standalone-Fall liefert dokumentierten
  `HandshakeTimeoutError`-Log `"timeout-channel"`.

**Panel 05 in `tests/manual_check.html`** um vier Knöpfe erweitert
(13 statt 9 — Setup + Tests 1-7 + Selbstcheck + Test 9 / 9a / 9b / 9c):

- **Test 9 „Channel-Pfad established (alt → main, intra-tab)":** Setup
  identisch zu Test 1 (Main in IndexedDB, Alt in-memory). `alt` baut
  signierten Request via `_buildSignedRequest`, postet via
  `_postChannelEnvelope` auf `BroadcastChannel('sbkim')`. mains
  Receiver-Listener (eager in `init()` registriert) filtert via
  `toNodeId`, ruft `receiveHandshake`, signiert die Response,
  postet sie auf dem Reply-Channel. Pass-Check: `outcome === "established"`
  + Response-Signatur valide + alt als sibling in `listSiblings()`.
- **Test 9a „Channel-Pfad — toNodeId-Mismatch-Timeout":** Request mit
  fremdem `toNodeId` (zufällige b64url-Zeichenkette). mains Receiver
  filtert raus, kein anderer Receiver in diesem Tab → Timeout nach
  ~4 s. Pass-Check: `HandshakeTimeoutError` + `dt >= 3500 ms`. Hinweis
  im Output: `_postChannelEnvelope` schreibt selbst keinen Log
  (`"timeout-channel"` schreibt nur `sendViaChannel` im
  handshake-Pfad).
- **Test 9b „Channel-Pfad — MissingToNodeIdError synchron":**
  `_buildSignedRequest(..., undefined)` baut einen Request OHNE
  `toNodeId`. Aufruf `_postChannelEnvelope(request)` wirft
  `MissingToNodeIdError`, bevor ein BroadcastChannel geöffnet wird.
- **Test 9c „Auto-Fallback-Beweis":** Startet einen Pseudo-Peer-Echo
  (kurzlebiger BroadcastChannel-Listener mit alt404-`nodeId`-Filter
  und kanonisch signierter Response-Antwort). `targetSpore.endpoint =
  location.origin + "/nicht-vorhanden-fuer-test-9c/"` (404 same-origin).
  `handshake(alt404Spore, mainVec, {transport:"auto"})` → HTTP scheitert,
  Auto-Fallback greift, Pseudo-Echo antwortet, `outcome:"established"`.
  Pass-Check: kein Throw + `outcome === "established"` + `peerNodeId
  === alt404NodeId`. Hinweis: Pseudo-Peer-Echo ist Test-Helfer — in
  Klaus' Live-Setup übernimmt diese Rolle das zweite Endknoten-Tab.

**Validierung headless:**

- `node --check src/modules/05_anastomose.js` grün.
- Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  per `node --check` einzeln validiert — grün.
- **Node-VM-Smoke-Test der Channel-Plumbing-Logik:**
  - `_setTransport('foobar')` → `InvalidTransportError` ✓
  - `_postChannelEnvelope({nonce:'xyz'})` (ohne `toNodeId`) →
    `MissingToNodeIdError` ✓
  - Round-Trip `_postChannelEnvelope` ↔ Test-Receiver via Node-18+
    `globalThis.BroadcastChannel` → `outcome:"established"` ✓
  - Timeout-Fall (nobody answers) → `HandshakeTimeoutError` nach
    ~4005 ms ✓
  - `nonceEcho`-Mismatch → `HandshakeSignatureInvalidError` ✓

**Was offen blieb (für Klaus-Sichttest):**

- Browser-Sichttest des Panels (Test 9 / 9a / 9b / 9c) — headless
  nicht durchführbar, weil Embedding-Modell (~30 MB) + IndexedDB +
  WebCrypto Ed25519 nötig sind. Wartet auf Klaus' Browser-Lauf nach
  Merge dieser Bau-PR (Klaus-Pflichtaufgaben unten).
- Live-Cross-Knoten-Handshake Mein-Rezeptbuch ↔ Mein-Mixarium über
  den Channel-Pfad — Endknoten-Pflege durch Klaus nach Merge
  notwendig (Modul-Datei in beide `sbkim/`-Verzeichnisse kopieren,
  beide PWA-Tabs öffnen, regulärer
  `SbkimAnastomose.handshake(peerSpore, ownVec)`-Aufruf statt
  localStorage-Bypass).
- Karte 09 § Eruda-Mapping ist um Punkt 6 (Channel-Bridge-Sichttest)
  noch **nicht** explizit erweitert — die Channel-Sichtkontrolle läuft
  über Console + IndexedDB, die schon im Eruda-Block stehen.
  Eigenständiges Tablet-Mapping kann in einer Mini-Pflege nachgezogen
  werden, falls Klaus' erster Tablet-Sichttest darauf stößt.

**Klaus-Pflichtaufgaben nach Merge dieser Bau-PR:**

1. **`src/modules/05_anastomose.js` in beide Endknoten kopieren**
   (`Mein-Mixarium/sbkim/` + `Mein-Rezeptbuch/sbkim/`). Cache-Bust
   via File-Rename oder Query-Param je nach SW-Setup. Commit + Push
   in beiden Endknoten-Repos.
2. **Beide PWA-Tabs öffnen** (Mein-Rezeptbuch + Mein-Mixarium auf
   `lausiklauskn-png.github.io`). `__sbkimErzeugeSpore()` nur, falls
   nötig.
3. **In einem Tab regulärer `SbkimAnastomose.handshake(peerSpore,
   ownVec)`-Aufruf** über Eruda (transport ohne expliziten Override
   = `"auto"`; HTTP scheitert auf GitHub Pages 405/404, Channel-
   Fallback greift). **Erwartet `outcome:"established"` über den
   Channel-Pfad** — das ist das eigentliche Ziel der gesamten Kette
   PR #65 → #74 → diese Bau-PR: erster Cross-Knoten-Handshake **ohne**
   localStorage-Bypass.
4. **Falls Timeout statt `established`:** Receiver-Tab-Pflicht prüfen
   (beide Tabs wirklich offen? Modul 05 geladen + `init()` durch?
   `SBKIM-Init grün` in beiden Konsolen sichtbar?). Bei verbleibenden
   Fragen Folge-Pflege-Sitzung.

**Vorgänger-PRs:** #65, #70, #71 (kein Code), #72, #73, #74.
**Repo-Stand main beim Sitzungsstart:** `a5bbd60` (Sage-Protokol nach
PR #74-Merge — Spec BroadcastChannel-Bridge live). **Endknoten-Stand
(unverändert ggü. PR #73-Sichttest):** Mein-Mixarium main `9b32dc7`
(`sbkim-sw-v24.js`), Mein-Rezeptbuch main `cbc2531` (`sbkim-sw-v2.js`).

**`status.json` NICHT geändert** — Modul 05 bleibt `score:"fertig"`
(additive Code-Erweiterung am bestehenden fertigen Modul, kein
Funktionalitäts-Verlust nach unten). `update_puls_pie.py` nicht
aufgerufen.

**Übergabeprotokoll:** [docs/sessions/archiv/2026-05-17_bau-05-broadcastchannel-bridge.md](sessions/archiv/2026-05-17_bau-05-broadcastchannel-bridge.md).

### 2026-05-17 · Spec-Sitzung Modul 05 — BroadcastChannel-Bridge als same-origin Fallback

**Sitzungs-Rolle:** Spec-Sitzung, headless, EINE Phase. Branch
`claude/spec-broadcastchannel-bridge-3HUAH`. Folge-Sitzung zur Pflege
Scope-Fix (PR #72 + Endknoten-Sichttest PR #73). Schließt die
Architektur-Lücke same-origin cross-PWA: die SW-Bridge ist dort
konzeptuell unmöglich (Sender-SW intercepted vor Receiver-SW),
deshalb braucht der Handshake einen alternativen Transport.

**Was geändert (additiv, kein Code in `src/`):**

- **`docs/INTERFACES.md` §1 Modul 05 Vertrag erweitert:**
  - Bietet-Block um optionalen dritten Parameter
    `options?: { transport?: "auto"|"http"|"channel" }` (Default `"auto"`).
    HandshakeRequest/Response-Schema **unverändert** — Channel ist
    Transport-Schicht.
  - Nutzt-Block um `BroadcastChannel('sbkim')` + Reply-Channel-Pfad
    ergänzt; Timeout aus bestehendem `QUERY_TIMEOUT_MS` (4000 ms),
    keine neue Konstante.
  - Fehlerverhalten um zwei Zeilen erweitert
    (`HandshakeTimeoutError` mit Log `"timeout-channel"` und Auto-
    Fallback-`cause`; Channel-Reply-Signatur ungültig →
    `HandshakeSignatureInvalidError`).
  - SW-Vertrag-Block um Architektur-Grenze-Hinweis ergänzt (Spec-
    Klarheit aus PR #72/#73: same-origin via SW-Bridge konzeptuell
    unmöglich).
  - Neuer Sub-Block „BroadcastChannel-Bridge" mit Channel-Name,
    Envelope-Schema, Receiver-Pflicht, Sender-Pfad,
    `toNodeId`-Pflichtschärfung, Self-Hit-Schutz, Cleanup,
    „Wer-nicht-da-ist-schweigt"-Konvention.
  - Geprüft-Zeile um 2026-05-17 (Spec-Sitzung BroadcastChannel-Bridge)
    erweitert.
- **`docs/INTERFACES.md` §3 Endpunkt-Pfade** um zweiten Sub-Block
  „Same-origin Fallback-Transport für Modul 05":
  - `channel-bridge: BroadcastChannel('sbkim')`
  - `reply-channel: BroadcastChannel('sbkim:reply:' + nonce)`
  - Verbindlich **nur** für Modul 05 — Heterokaryose (06) und Legacy
    (07) bleiben HTTP-only.
- **`docs/INTERFACES.md` §6 Änderungsprotokoll** neue Zeile am Ende.
- **`docs/components/05_anastomose.md`:**
  - § Schnittstelle: `handshake`-Signatur und Schritt-für-Schritt-
    Doc um Channel-Pfad + Auto-Fallback-Trigger erweitert.
  - § SW-Worker-Hinweis um Architektur-Grenze-Block (PR #72/#73-
    Beleg, Distinguishing-Test 405/404).
  - **Neue Hauptsektion „BroadcastChannel-Bridge (same-origin
    Fallback)"** mit Motivation, Vertrag, Auto-Fallback-Logik,
    E1–E7-Entscheidungstabelle (jede mit Begründung) und „Was
    diese Spec NICHT regelt"-Block.
  - § Fehlerverhalten um drei Zeilen (Channel-Timeout + Auto-
    Fallback-`cause`, `nonceEcho`-Mismatch, synchrones
    `MissingToNodeIdError`).
  - § Manueller Test um Punkt 9 (Channel-Pfad, Sub-Tests 9a/9b/9c
    inkl. Auto-Fallback-Beweis).
  - § Risiken um Receiver-Tab-Pflicht.
  - § Bauzustand-Zeile „Spec BroadcastChannel-Bridge".

**Sieben Entscheidungen (E1–E7), verbindlich:**

- **E1 Channel-Name:** `BroadcastChannel('sbkim')` — ein gemeinsamer
  Channel pro Origin, Filtern via `toNodeId`. Versionierung läuft
  über `payload.protocolVersion` (analog HTTP-Pfad), nicht über den
  Channel-Namen.
- **E2 Auto-Fallback:** α (Default `transport:"auto"`). HTTP zuerst,
  bei klaren Signalen (4xx/5xx, non-JSON, fehlende Pflichtfelder)
  Channel-Fallback. Cross-domain bleibt unverändert HTTP-only.
  Override `transport:"http"|"channel"` für Test/Diagnose.
- **E3 Receiver-Init:** Eager in `init()`. Konsistent zur SW-Bridge-
  Init und Karte-09-Andock-Pflicht.
- **E4 Timeout & Failure:** `QUERY_TIMEOUT_MS` (4000 ms) als Timeout,
  bei Timeout `HandshakeTimeoutError` (Throw, kein semantisches
  Outcome). Log-Zeile `"timeout-channel"`. Bei Auto-Fallback HTTP-
  Fehler als `cause`.
- **E5 Message-Format:** Wrapper-Envelope mit `replyChannelName` aus
  nonce; HandshakeRequest/Response-Schema **unverändert**. Envelope
  selbst NICHT signiert (nur das innere Schema, wie HTTP-Pfad).
- **E6 Cleanup:** Main-Channel über Tab-Lebensdauer; Reply-Channels
  pro Handshake, Close in `finally` (Sender + Receiver).
- **E7 Replay/Self-Hit:** `toNodeId` Pflicht im Channel-Pfad
  (HTTP-Pfad bleibt optional); Receiver-Filter `toNodeId === own.nodeId`
  + `fromNodeId !== own.nodeId`. Aktiver Replay-Schutz bleibt
  Schutz-Backlog Modul 11.

**Was NICHT angefasst:**

- `src/modules/05_anastomose.js` (Bau-Sitzung folgt).
- `src/sbkim-sw.js` (SW-Pfad ist mit `isOwnEndpoint` aus PR #72
  abgeschlossen).
- `receiveHandshake`-Signatur (Channel-Receiver ruft denselben am
  Ende auf).
- Andere Module (00/01/02/03/04/06/07/08/09).
- `docs/components/09_einbau_pwa.md` (Andock-Hinweis „Beide Tabs
  offen halten" folgt in Bau-Sitzung 05 — die Spec ohne Code zu
  paaren wäre verwirrend für den Andocker).
- `PROTOCOL_VERSION` bleibt `"0.1"`.
- `status.json` unverändert — Modul 05 bleibt `score:"fertig"`
  (additive Spec-Erweiterung am Vertrag, keine Funktionalitäts-
  Regression; Bau erst danach setzt den Fallback live). `update_puls_pie.py`
  NICHT aufgerufen.

**Validierung:**

- `docs/INTERFACES.md` und `docs/components/05_anastomose.md`
  manuell gegen das Schema gegengelesen — HandshakeRequest/Response-
  Pflichtfelder unverändert, nur Transport-Schicht additiv.
- Karte 05 § Manueller Test § Voraussetzungen explizit auf
  „zwei Tabs offen" erweitert (Sub-Test 9 Live-Pfad). Pseudo-Knoten-
  Variante für einen Tab dokumentiert.
- E1–E7-Entscheidungen alle mit ein-Satz-Begründung versehen, damit
  die Bau-Sitzung ohne Rückfrage starten kann.

**Was diesen Schritt NICHT löst:**

- Tatsächlicher Cross-Knoten-Handshake mit `outcome:"established"`
  ohne localStorage-Bypass — das ist Ziel der **nachfolgenden Bau-
  Sitzung Modul 05** (additiver Channel-Pfad in
  `src/modules/05_anastomose.js`) + Klaus' Sichttest.
- Karte 09 Andock-Hinweis — folgt in der Bau-Sitzung (gemeinsam mit
  dem Code-Eingriff, damit der Andocker nur einen vollständigen
  Schritt liest).

**Klaus' Pflicht nach Merge:** Keine Endknoten-Pflege nötig (Spec
ist kein Endknoten-Eingriff). Der Spec-Stand muss vor der nachfolgenden
Bau-Sitzung gemerged sein, damit die Bau-Sitzung gegen `main`
arbeiten kann.

**Übergabeprotokoll:** [→ Archiv](sessions/archiv/2026-05-17_spec-05-broadcastchannel-bridge.md)

---

## Archiv-Index (Sitzungen vor dieser Pflege)

Alle Sitzungen bis einschließlich Pflege PULS-Archivierung
(2026-05-15) sind ausgelagert. Neueste oben.

| Datum | Sitzung | Übergabeprotokoll |
|---|---|---|
| 2026-05-19 | Spec · M04-Erweiterung — Strang 2 (Brief 03) der V1-Sammelspec-Kaskade (Brief 03 · PR #98 gemerged 2026-05-19, `main` `27d6a19`; INTERFACES § 0 um drei §0-Konstanten erweitert (`SCHICHT_MIN_MATCH=0.60`, `STUFE_B_DEFAULT_MODEL="claude-sonnet-4"`, `STUFE_B_MAX_TOKENS=1024`), § 1 Modul 02 Bietet-Block-Spore-Schema-Erweiterungs-Hinweis (`embeddingCapabilities` Alias + `embeddingNeeds` neu), § 1 Modul 04 um zwei neue Funktionen + vier neue Sub-Blöcke (Drei-Schichten-Modell mit Mittelwert-vs-Min-Begründung, Brücken-Feld-Spec mit BridgeProposal, Schwellen-Vertrag mit 5 Auswertungs-Regeln, Stufe-B-Vertrag mit JSON-Schema und Beispiel-Output mit zwei Personas) + Fehlerverhalten-Tabelle um sieben neue Zeilen + Garantien um vier neue Punkte erweitert, § 2 Spore-JSON Optionale Felder um die zwei neuen Vektor-Felder erweitert, § 7 LLM-Stufe-B-Ehrlichkeits-Klausel (vier verbindliche Sätze: Stufe B opt-in, Stufe A rückgrat-tragend lokal, kein Knoten zu Drittanbieter gezwungen, Knoten ohne Stufe B = vollwertige Netz-Teilnehmer), § 8 Anti-Missbrauch-Klausel (drei verbindliche Sätze: Brücken-Vorschlag lokal, `candidateScope:"netz"` formal nicht aktivierbar bis Anker 10-12, Modul 06 filtert Outbox-Einträge), § 7 Änderungsprotokoll auf § 9 nachnummeriert; Karten 02 (M04-Sub-Block mit Migrations-Tabelle vier Spore-Zustände + Bauzustand-Hinweis für Bau-Folge-Sitzung) / 04 (vier neue Sub-Blöcke parallel zu INTERFACES + Stamm/Gast-Block unverändert) / 06 (Brücken-Vorschlag-Eintrags-Typ-Sub-Block + vier-stufige Filter-Logik) nachgezogen; PROTOCOL_VERSION bleibt `"0.1"` (additive Felder + additive Funktionen, kein altes Feld zur Pflicht erhoben); kein Modul-Code in `src/`, keine Sage-Page-Änderung; Brief 04 `docs/sessions/BRIEF_04_multi_identitaet.md` angelegt) | [→ Archiv](sessions/archiv/2026-05-19_spec-m04-erweiterung.md) |
| 2026-05-18 | Spec · Plattform-Matrix — Strang 2 der V1-Sammelspec-Kaskade (Brief 02 · PR #97 gemerged — `main` `69077db`; INTERFACES § 6.2 Plattform-Matrix mit fünf Profilen × sechs Spalten + Sage-Anmerkung, § 6.3 Plattform-Ehrlichkeits-Klausel als verbindliche Spec-Klausel mit Begründung aus Klaus' Lehre 1, § 6.4 Vision-Bezüge als Querverweis-Matrix mit sieben Ankern; § 6.1 Plattform-Matrix-Stub auf Verweis umgeschrieben; Anti-Vorgriff auf V4 / V5 / V7 / V8 / V9 / V6 streng eingehalten; `PROTOCOL_VERSION` bleibt `"0.1"`; CLAUDE.md / Karte 09 / `status.json` unangetastet — Brief 02 lebt rein in INTERFACES; Brief 03 `docs/sessions/BRIEF_03_m04_erweiterung.md` angelegt) | [→ Archiv](sessions/archiv/2026-05-18_spec-plattform-matrix.md) |
| 2026-05-18 | Spec · V1 Sage-Hybrid — Strang 1 der V1-Sammelspec-Kaskade (Brief 01 · PR #96 gemerged — `main` `a3e0072`; INTERFACES § 6 Endknoten-Liste neu mit Sage als drittem Endknoten + § 6.1 Sage-Page-Architektur mit IndexedDB-Suffix `sbkim_sage` / App-SW Variante 3a / volle init()-Kette / Andock-Geste an Schwarz-Loch-Karte; CLAUDE.md auf „Hub und Knoten zugleich"; Karte 09 § Schritt 1 erweitert; `status.json` § endknoten um sage-Eintrag mit `pingStatus:"pending-first-andock"`; Domäne „Mycel-Bibliothek" gewählt; `PROTOCOL_VERSION` bleibt `"0.1"`; Sage-Page-Refactor folgt als Bau-Sitzung in BRIEF_99-Liste; Brief 02 `docs/sessions/BRIEF_02_plattform_matrix.md` angelegt) | [→ Archiv](sessions/archiv/2026-05-18_spec-v1-sage-hybrid.md) |
| 2026-05-18 | Meta-Pflege · V1-Sammelspec als Brief-Kaskade sequenziert (PR #93 + Konvention-6-Refactor PR #95 — sechs heilige Tafeln: ein Strang = ein PR, Brief als Datei im Repo, einheitlicher Bauplan, BRIEF_99-Abschluss, verteilte Konsistenz-Prüfung, Auslöser-Befehl im Chat statt Brief-Volltext; Strang-Reihenfolge Brief 01 V1-Sage-Hybrid → Brief 02 Plattform-Matrix → Brief 03 M04-Erweiterung → Brief 04 Multi-Identität → BRIEF_99-Abschluss; Brief 01 `docs/sessions/BRIEF_01_v1_sage_hybrid.md` als erste Brief-Datei angelegt; PROTOCOL_VERSION bleibt `"0.1"` solange Stränge additiv; kein Modul-Code, kein INTERFACES-Eingriff in der Meta-Pflege selbst) | [→ Archiv](sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md) |
| 2026-05-18 | Mini-Pflege · Sonnen-Galaxie Stationen 1–3 inhaltlich gefüllt (PR #92 — drei Erzähl-Texte je 4 Absätze, basierend auf Hero-Claim/CLAUDE.md/PULS § Anker 9; `openStationModal()` jetzt 1:1 wie `openUniverseModal()` mit `|`-Splitting + Markdown-Parser; Placeholder-Hint-Logik auf expliziten `s.placeholder`-Flag umgestellt; Privatheits-Klausel eingehalten) | [→ Archiv](sessions/archiv/2026-05-18_pflege-sonnen-stationen-erzaehl-texte.md) |
| 2026-05-18 | Bau-Sitzung · Vision-Anker 10 Sonnen-Galaxie · Sage-Geschichts-Galerie (PR #90 — alle sieben Eingriffe aus PULS § Anker 10 § Architektur-Skizze additiv in `index.html` umgesetzt: CSS Sonnen-Karte mit Korona/Disk/12-Sommersprossen, CSS Geschichts-Galerie-Screen mit `#02020c`-BG und warm-goldenen Nebeln, HTML Sonnen-Karte vor `.card.reading`, HTML `#screen-sonnen` nach Observatorium, `SCREENS`-Array, `goScreen()` + `applyHashScreen()`, JS-Block mit `STATIONS_DATA` + `setupSonnenGalaxie()` 1:1 wie Observatorium für Stars/Maus/Komet-Schweif/Wake-Boost; Optik-Korrekturen mid-PR Klaus eingearbeitet — Kern verschwommen, 12 wabernde Sommersprossen statt 3 großer Flecken, dunkler statt brauner Hintergrund, Ring dreht sich nicht mehr sondern pulst nur bei Hover; `docs/papers/README.md` angelegt; Privatheits-Klausel eingehalten) | [→ Archiv](sessions/archiv/2026-05-18_bau-vision-10-sonnen-galaxie.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Sonnen-Galaxie als zehnter Anker (Geschichts-Galerie · PR #88 — Anker 10 in PULS § Vision-Anker eingefügt, mid-Pflege re-gerahmt von „Papers-Bibliothek" auf „Sage-Geschichts-Galerie"; heilige Privatheits-Klausel „Everlast GmbH NICHT erwähnen"; `docs/papers/sbkim-paper-en.html` als dokumentengestützte Station 4 eingecheckt; Brief für Bau-Sitzung in `docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` abgelegt und auf Geschichts-Galerie umgeschrieben; CSS-Probelauf testweise eingefügt und disziplin-konform zurückgerollt) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-10-sonnen-galaxie.md) |
| 2026-05-18 | Mini-Pflege · PULS-Auslagerung (8 ältere Sitzungs-Einträge aus dem Body in den Archiv-Index ausgelagert; Doppelung Body↔Index beseitigt; PULS 3256 → 2337 Zeilen netto −919; Konvention pro Sitzung wieder angewandt; reine Doku-Pflege, kein Modul-Code, kein `update_puls_pie.py`-Aufruf) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-puls-auslagerung.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Mini-Browser (Tauri-App) als achter Anker (PR #85 — eigener achter Anker für die dedizierte Desktop-App; Konzept Tauri-Stack ~10-30 MB, eigene IndexedDB im App-Daten-Verzeichnis, Tray-Icon-Modus für Hintergrund-Empfang, Doppelklick-Installer .msi/.dmg/.AppImage, Auto-Update via Tauri-Updater; Verbindungen zu V2-Pfad-3 / V4 Königin-Hintergrund / V5 Backup-Datei / V6 Identitäts-Wechsler im Tray / V7 gleiche Modul-13-Bridge; Abgrenzung zu V7 Extension; Desktop-only — Mobile/DeX außen vor; PR-#84-Sitzungs-Eintrag dort ins Archiv ausgelagert) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-anker-mini-browser.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Extension („Lampe in der Toolbar") + Mini-Browser-Konkretisierung Anker 2 Pfad 3 (PR #84 — siebter Vision-Anker; Manifest V3, Modul-13-Bridge, Plattform-Tabelle Desktop ja / Mobile nein, drei gleichwertige Onboarding-Pfade; Mini-Browser-Konkretisierung später per Folge-Pflege als eigener Anker 8 vertieft) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-anker-extension.md) |
| 2026-05-17 | Spec · Modul 05 BroadcastChannel-Bridge als same-origin Fallback (additiver Transport additiv zum HTTP-Pfad; `handshake(...)` um optionalen `options.transport`-Parameter erweitert mit Default `"auto"`; Wrapper-Envelope mit `replyChannelName` aus nonce; `BroadcastChannel('sbkim')` als gemeinsamer Channel pro Origin; `toNodeId` Pflicht im Channel-Pfad; Receiver-Tab muss offen sein, kein Wake-Lock; E1–E7-Entscheidungstabelle mit Begründungen; HandshakeRequest/Response-Schema unverändert; `PROTOCOL_VERSION` bleibt `"0.1"`; KEIN Code, KEIN Eingriff in Karte 09 — Bau-Sitzung folgt) | [→ Archiv](sessions/archiv/2026-05-17_spec-05-broadcastchannel-bridge.md) |
| 2026-05-17 | Pflege · Modul 05/SW Scope-Fix `isOwnEndpoint` (`sbkim-sw.js` `isPathSuffix` durch scope-bewusste `isOwnEndpoint` ersetzt — leitet erwarteten Pfad aus `self.registration.scope` ab, strikte Gleichheit; behebt falsch-positiven Cross-Scope-Intercept; Variante 3c bewusst nicht abgedeckt; Same-origin cross-PWA via SW-Bridge bleibt konzeptuell unmöglich, Folge-Spec Modul 05 BroadcastChannel-Bridge empfohlen; Klaus muss `sbkim-sw.js` mit Cache-Bust in beide Endknoten nachziehen) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fix.md) |
| 2026-05-17 | Test-Erkenntnis · A/B-Test PR #70 + Architekturfund `isPathSuffix` scope-unbewusst (kein PR; Befund: PR #70's `includeUncontrolled:false`-Fix korrekt für sein Szenario, aber irrelevant für same-origin cross-PWA, weil Sender-SW vor Receiver-SW intercepted; voller Cache-Eskalations-Trace inkl. File-Rename + chrome://serviceworker-internals/) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fund.md) |
| 2026-05-17 | Pflege · Modul 05/SW Phantom-Clients-Fix (`sbkim-sw.js` `clients.matchAll` von `includeUncontrolled:true` auf `false` umgestellt + neue Loop-Logik „alle controlled Clients der Reihe nach, erster der nicht ‚toNodeId stimmt nicht‘ sagt gewinnt"; behebt den SW-Bridge-Phantom-Cache-Bug aus Cross-Knoten-Handshake-Sitzung; Klaus muss neue `sbkim-sw.js` in beide Endknoten-Repos kopieren + pushen) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sw-phantom-clients-fix.md) |
| 2026-05-17 | Mini-Pflege · Score-Realität — Module 03/05/09 auf `fertig` hochgestuft (Live-Beweis Cross-Knoten-Handshake 2026-05-16); Endknoten-`pingStatus`-Bonus aktiviert (`live-direct` zählt 15 statt 8); Demo-Ring auf zwei Bögen umgestellt (grün-schimmernd wächst auf 85 %, bunt schrumpft auf 15 %); update_puls_pie.py aufgerufen | [→ Archiv](sessions/archiv/2026-05-17_pflege-score-realitaet.md) |
| 2026-05-17 | Mini-Pflege · Rechtschreibung „Protokoll" mit zwei L (deutsches Wort) — Eigenname „Sage-Protokol" (englisch) bleibt; `Mycel-Protokoll` + generisches `Protokoll` (Footer-Label, Card-Tag, Markdown) korrigiert; 7 Dateien; Repo-URLs unverändert; KEIN Modul-Code-Eingriff | [→ Archiv](sessions/archiv/2026-05-17_pflege-rechtschreibung-protokoll.md) |
| 2026-05-17 | Mini-Pflege · Sage-Page Live-Status für Topologie + Lebenszyklus (`isNextUp()`-Vakuum-Falle gefixt — nur Module mit `score:"spec"\|"werkstatt"` zählen als nextup; neue `renderCyclePhases()`-Funktion bindet Phase-Pills an Modul-02/03/05/04-Live-Status; automatisch sichtbar bei künftigen Modul-Status-Änderungen in `status.json`) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sage-page-live-status.md) |
| 2026-05-16 | Live-Andock · Cross-Knoten-Handshake etabliert (`outcome:"established"` zwischen Mein-Mixarium `7xf0tt33_…` und Mein-Rezeptbuch `RHhposP0…`; Origin-Kollision via dbSuffix aufgelöst; Modul 01 in Endknoten nachgezogen; PR #238-Schaden in Mein-Rezeptbuch-`index.html` repariert; Match-Score Cocktails↔Kochrezepte ≥ 0.8; SW-Bridge-Phantom-Cache-Bug umgangen via direktem `receiveHandshake`-Aufruf, Folge-Pflege offen) | [→ Archiv](sessions/archiv/2026-05-16_cross-knoten-handshake-etabliert.md) |
| 2026-05-16 | Pflege · Sage-Page Vollumbau / Redesign (Geist-Typografie, Force-Graph-Topologie ersetzt Pie-Doppelung, Lesematerial-Karte, Sichtbarkeits-Lampen-Demo-Anker, scroll-aware Lebenszyklus, neue Pflege-Konvention `docs/sage_page_pflege.md`) | [→ Archiv](sessions/archiv/2026-05-16_pflege-sage-page-redesign.md) |
| 2026-05-16 | Mini-Pflege · Test-Panel Knopf-7-pendingBackup-Reset (Reset-Zeile aus Handler-Anfang in `tests/manual_check.html` entfernt, `pendingBackup = null` jetzt direkt vor `importBackup`-Aufruf nach erfolgreicher File-Wahl; File-Picker-Cancel löst keine State-Änderung mehr aus, Stash überlebt doppelten Knopf-7-Klick ohne File-Wahl; KEIN Modul-Code-Eingriff, KEIN INTERFACES.md-Eingriff, KEIN Score-Wechsel) | [→ Archiv](sessions/archiv/2026-05-16_pflege-test-panel-knopf-7-pendingBackup.md) |
| 2026-05-16 | Pflege · Phase-1 Sichttest-Resultate Karten 02/06/01 (Klaus' Sichttest 2026-05-16: Bau-02.X-Knöpfe 6/7/7b grün + Panel 06 rasch grob + Panel 01 Knopf 5 `_meta.storagePersisted: true` in Karten 02/06/01 § Bauzustand + PULS Schnellüberblick nachgezogen; Test-Panel-UX-Befund Knopf 7 pendingBackup-Stash-Reset offen als Mini-Pflege) | [→ Archiv](sessions/archiv/2026-05-16_pflege-phase1-sichttest-karten-02-06-01.md) |
| 2026-05-16 | Pflege · Persistenz-Strategie verbinden (Identitäts-Persistenz Stufe 3 — Modul 00 „Backup empfohlen"-Tipp-Zeile bei `storagePersisted === false` ODER Quota-Warn; `getStatusSnapshot()` um `storagePersisted` erweitert, kein Direkt-Aufruf von Modul 02; alle drei Stufen final gelöst) | [→ Archiv](sessions/archiv/2026-05-16_pflege-persistenz-strategie-verbinden.md) |
| 2026-05-16 | Bau · Modul 02 Backup-Export Code-Stub (Bau 02.X — `exportBackup`/`importBackup` additiv in `src/modules/02_spore.js`, fünf Error-Klassen, drei Helper-Reuse-Entscheidungen, drei Panel-02-Knöpfe; Identitäts-Persistenz Stufe (2) damit gelöst) | [→ Archiv](sessions/archiv/2026-05-16_bau-02x-backup-export.md) |
| 2026-05-16 | Spec · Modul 02 Backup-Export (Identitäts-Persistenz Stufe 2 — `exportBackup`/`importBackup` passwort-verschlüsselt, PBKDF2 600 k + AES-GCM-256, drei §0-Konstanten, fünf neue Error-Klassen; Bau-Sitzung 02.X folgt) | [→ Archiv](sessions/archiv/2026-05-16_spec-02-backup-export.md) |
| 2026-05-16 | Pflege · Storage-Persist (Identitäts-Persistenz Stufe 1, `navigator.storage.persist()` fail-soft im Init-Pfad von Modul 01) | [→ Archiv](sessions/archiv/2026-05-16_pflege-01-storage-persist.md) |
| 2026-05-16 | Pflege · Karten 01 + 09 PWA-Suffix (IndexedDB-Origin-Kollision gelöst durch `SbkimStorage.init({dbSuffix})`) | [→ Archiv](sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md) |
| 2026-05-16 | Bau · 09 Iteration 3 — Mein-Rezeptbuch live angedockt + Architektur-Lücke entdeckt | [→ Archiv](sessions/archiv/2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md) |
| 2026-05-16 | Bau · 09 Iteration 3 — Mein-Mixarium live angedockt (status.json + PULS) | [→ Archiv](sessions/archiv/2026-05-16_andock-mein-mixarium-iteration-3-live.md) |
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
