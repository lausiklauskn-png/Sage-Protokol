# Sichttest-Nachzug 2026-05-20 — Bau 08.Y slot-spezifische Outbox grün

**Sitzungs-Rolle:** Sichttest-Pflege-Sitzung (kein Code, kein Spec —
Doku-Nachzug nach Klaus' Browser-Sichttest). Branch
`claude/bau-08y-sichttest-nachzug-j6mJF`, vom main aus angelegt nach
Merge PR #117 (`main` `54bba18`).

---

## 1. Was geschah

Klaus hat unmittelbar nach dem Squash-Merge von PR #117 das Test-
Panel `tests/manual_check.html` lokal über Termux + `python3 -m
http.server 8000` auf seinem Galaxy Tab S6 + DeX-Chrome aufgerufen
und **alle acht Panels** durchgespielt — Panels 01–07 als Regression
nach Bau 08.Y, Panel 08 als Live-Beleg der slot-spezifischen Outbox.
**Alle Tests grün im ersten Lauf**, keine Modul-Befunde, keine
retroaktiven Pflege-Bedarfe.

Setup: Galaxy Tab S6 + DeX, Chrome auf Android, lokaler HTTP-Server
gegen frisch geklontes Sage-Protokol-Repo (Commit-Stand `54bba18`,
also `main` nach PR-#117-Merge).

---

## 2. Bau-08.Y-spezifische Belege (Panel 08)

### Setup ✓

```json
{
  "active_slot_key": "main",
  "outbox_store": "sbkim_hetero_outbox_main",
  "siblings_store": "sbkim_siblings_main",
  "db_version": 7,
  "max_entries": 5,
  "label_max_len": 64,
  "embedding_dim": 384,
  "hinweis": "Bau 08.Y: Modul 08 schreibt jetzt slot-spezifisch. HETERO_OUTBOX_MAX_ENTRIES (= 5) gilt PRO SLOT, nicht global. Modul 08 ist Storage-only — Vektor-Erzeugung ist Aufrufer-Pflicht. Panel 08 nutzt deterministische Pseudo-Vektoren statt SbkimEmbedding."
}
```

Bestätigt: `init()` cached `activeSlotKey = "main"` aus
`SbkimSpore.getActiveIdentityKey()`, `ensureSlotStores` legt
`sbkim_hetero_outbox_main` + `sbkim_siblings_main` an. Setup-Output-
Hinweistext enthält den Bau-08.Y-Block + „PRO SLOT, nicht global".

Nach späterem Test 6 in Panel 07 (Self-Apoptose, IRREVERSIBEL) stieg
`db_version` von 7 auf 17 — Self-Apoptose hat alle Stores resetted
und sie via `ensureStore`-Bumps neu erzeugt (Pflege-Modul-01
versions-fail-soft 2026-05-19 toleriert das ohne `VersionError`).
Beim Re-Setup zeigte Panel 08 dann `db_version:17` — konsistent.

### Test 1 — Outbox add + list ✓

```json
{
  "eintraege_anzahl": 3,
  "reihenfolge": ["Sauerteig", "Schwarzwald-Torte", "Hefeteig"],
  "neueste_zuerst": true,
  "schema_ok": true,
  "vektoren_in_list": false
}
```

Drei Anker in `sbkim_hetero_outbox_main` (slot-suffixed), absteigend
nach `addedAt`, keine Vektoren in `listOutbox`-Output.

### Test 2 — Outbox remove (idempotent) ✓

```json
{
  "nach_erstem_remove": 1,
  "zweiter_remove_warf": false,
  "nach_zweitem_remove": 1
}
```

Zweiter remove desselben Labels wirft nicht (Idempotenz wie in
Bau-08-Sichttest 2026-05-15).

### Test 3 — Outbox überschreiben ✓

```json
{
  "anzahl_vor": 2,
  "anzahl_nach": 2,
  "addedAt_vor": "2026-05-20T16:36:26.191Z",
  "addedAt_nach": "2026-05-20T16:36:26.215Z",
  "hefeteig_jetzt_oben": true
}
```

Überschreiben aktualisiert `addedAt`, Anzahl unverändert, Hefeteig
steht jetzt oben in `listOutbox`-Reihenfolge.

### Test 4 — `OutboxFullError` mit slot-spezifischer Message ✓

```json
{
  "voll_anzahl": 5,
  "sechster_fehler_name": "OutboxFullError",
  "sechster_fehler_message": "sbkim_hetero_outbox_main am Limit (5 Einträge pro Slot). Vor dem Anlegen eines NEUEN Labels einen alten Anker mit removeOutboxAnchor(label) entfernen.",
  "ueberschreiben_warf": false,
  "anzahl_nach_ueberschreiben": 5,
  "neuer_eintrag_nach_remove_da": true
}
```

**Das ist der entscheidende Bau-08.Y-Beleg:** Die Fehler-Message
zitiert live „sbkim_hetero_outbox_main am Limit (5 Einträge pro
Slot)" — sowohl der Slot-Suffix als auch der „pro Slot"-Wortlaut
sind im Live-Output, exakt wie im Code (08_ui_demo.js) implementiert.
Überschreiben eines bekannten Labels wirft nicht; nach `remove`
passt ein neuer durch. `HETERO_OUTBOX_MAX_ENTRIES = 5` gilt pro
Slot wie spezifiziert.

### Test 5 — Validierung (Label / Vektor) ✓

```json
{
  "checks": [
    {"fall": "InvalidAnchorLabelError", "message": "label muss ein nicht-leerer String sein."},
    {"fall": "InvalidAnchorLabelError", "message": "label muss ein nicht-leerer String sein."},
    {"fall": "InvalidAnchorLabelError", "message": "label überschreitet OUTBOX_LABEL_MAX_LEN = 64 Zeichen (label.length=65)."},
    {"fall": "InvalidAnchorVectorError", "message": "vector muss ein Array sein."},
    {"fall": "InvalidAnchorVectorError", "message": "vector.length muss EMBEDDING_DIM = 384 sein (erhalten: 383)."},
    {"fall": "InvalidAnchorVectorError", "message": "vector[7] ist nicht endlich (NaN / ±∞ / nicht-Zahl)."}
  ],
  "outbox_unveraendert": true
}
```

Alle sechs Fälle werfen den passenden Error-Namen synchron vor jedem
Schreib-Versuch; Outbox bleibt leer.

### Test 6 — `setSiblingHeteroOptIn` Co-Schreiber + strikt boolean ✓

```json
{
  "nach_true": {"optIn": true, "domain": "pseudo-optin.invalid"},
  "nach_false": {"optIn": false, "domain": "pseudo-optin.invalid"},
  "unbekannter_sibling_fehler": "UnknownSiblingError",
  "truthy_int_fehler": "InvalidOptInArgError",
  "truthy_string_fehler": "InvalidOptInArgError",
  "flag_nach_strenge": false
}
```

Co-Schreiber liest/schreibt slot-suffixed `sbkim_siblings_main`,
andere Felder bleiben (`domain: "pseudo-optin.invalid"` durchgereicht).
Strikt-boolean greift: `1` und `"true"` werfen
`InvalidOptInArgError`, das Flag bleibt unverändert (`false`).

---

## 3. Regression Panels 01–07 (im selben Lauf grün)

### Panel 01 — Storage

Storage-init zeigt die neuen Slot-Stores live in der Liste:

```json
{
  "dbName": "sbkim",
  "version": 7,
  "stores": [
    "sbkim_keys", "sbkim_spore", "sbkim_siblings",
    "sbkim_anastomosis_log", "sbkim_legacy_inbox", "sbkim_doku_meta",
    "sbkim_hetero_inbox", "sbkim_hetero_outbox", "sbkim_meta",
    "sbkim_hetero_outbox_main", "sbkim_siblings_main"
  ]
}
```

Non-suffixed `sbkim_hetero_outbox` + `sbkim_siblings` bleiben
unangetastet (Bau-08.Y-Spec: Modul 08 migriert keine alten Daten,
Aufrufer-Pflicht via Backup-Re-Import aus Bau 02.Y). Bau-01.Y
`ensureStore` happy-path + Idempotenz + InvalidStoreNameError +
Pflege-Modul-01 versions-fail-soft probe (`db_version_vor:7 →
nach_bump:8`) alle grün.

### Panel 02 — Spore

Identität deterministisch (`2GxX9mS8BC4KgZ-9-NcUWUu7LKleoDxDkdJ2-qcNn94`),
Spore generieren / Sign+Verify / Manipulation erkannt grün.
Multi-Persona: Wechsel main ↔ test grün, Persona-Apoptose mit
`force:true` Idempotenz grün, Multi-ID-Backup-Export
`payload.identities.length: 2` grün.

### Panel 03 — Embedding

Modell-Init `Xenova/multilingual-e5-small`, Dim 384, L2-Norm 1.0.
Query vs. Passage „Käsekuchen mit Quark" 0.9555. Batch zwei
Inhalte, Inter-Cosinus 0.8995.

### Panel 04 — Match

Ähnlich Käsekuchen vs. Käsetorte 0.9507 (>0.92), fern vs. Auspuffrohr
0.8967 (<0.90), Schwelle positiv Hefeteig vs. Kochrezepte 0.8312,
Schwelle negativ Tarantino vs. Kochrezepte 0.7737 (Apoptose-Trigger
greift sauber). Bau-04.A `matchDimensions`: drei Schichten gleich
-0.0084 (Stufe-A-Heuristik), Nur-Anbieter-Modus alle null +
`availableLanes:0`, `DimensionsAllNullError` synchron.

### Panel 05 — Anastomose

Test 1 Handshake established 0.8881 ✓, Test 2 Vektor-Trias (2/3
unter Schwelle: Eisenbahnsignalanlagen 0.7910, Quantenfeldtheorie
0.7968) ✓, Test 3 Versions-Mismatch ✓, Test 4 Signatur manipuliert
✓, Test 5 Re-Handshake mit `outcome:"re-handshake"`-Log ✓,
Test 6 forgetSibling ✓, Test 7 listSiblings ✓. **Test 9
Channel-Pfad established 0.8881 intra-tab ✓**, Test 9a
HandshakeTimeoutError nach 4005 ms ✓, Test 9b
MissingToNodeIdError synchron ✓, **Test 9c Auto-Fallback HTTP 404
→ Channel etabliert 0.8881 ✓**. Bau-BroadcastChannel-Bridge
2026-05-17 weiterhin grün.

### Panel 06 — Heterokaryose

Alle 12 Tests grün. **Test 9 `HETERO_MAX_ANCHORS = 5`-Begrenzung
voll geprüft:** 6 Outbox-Einträge → Response liefert 5 Anker,
„Nachtisch" zuerst (neueste), „Hefeteig" ausselektiert (älteste).
**Beachte:** Modul 06 liest hier weiter aus `sbkim_hetero_outbox`
(ohne Slot-Suffix) — das ist die in Bau-06.Y-Brief dokumentierte
bekannte Limitierung. Bau 06.Y (eigene Bau-Sitzung, Brief gemerged
PR #114) baut Modul 06's Lese-Pfad slot-suffixed um. Bau 08.Y
löst nur die Schreib-Seite (Modul 08). Beide zusammen schließen
die Bau-06.Y-Limitierung. Keine Test-Bug-Diskrepanz — Test 9
nutzt Modul 06's eigene Test-Brücke, die direkt in den
non-suffixed Store schreibt (deshalb funktioniert die Begrenzung
heute schon).

### Panel 07 — Apoptose

Alle 8 Tests grün. Test 1 receiveLegacy round-trip (Sender aus
Siblings entfernt), Test 2 Signatur-Manipulation, Test 3
Versions-Mismatch, Test 4 TTL-Cleanup `forgetExpiredSiblings`,
Test 5 `listLegacy` ohne `signature`-Feld, **Test 6 Self-Apoptose
IRREVERSIBEL** (`stores_alle_leer:true`,
`getNodeId_wirft_NoIdentityError:true`, Modul-02-Cache-Invalidate-
Fix aus Pflege 2026-05-15 weiterhin grün), Test 7 Token-Ablauf
nach 60 s → `InvalidApoptoseTokenError`, Test 8 `receiveLegacy`
mit unbekanntem Sender accepted ohne Throw bei `sibling.del`.

---

## 4. Sichttest-Zusammenfassung

| Panel | Knöpfe | Befund |
|---|---|---|
| 01 Storage | 9 | grün — inkl. `sbkim_hetero_outbox_main` / `sbkim_siblings_main` in Store-Liste |
| 02 Spore | 11 | grün — inkl. Multi-Persona / Multi-ID-Backup |
| 03 Embedding | 5 | grün — L2-Norm 1.0, Cosinus-Baselines wie erwartet |
| 04 Match | 9 | grün — inkl. Bau-04.A `matchDimensions` |
| 05 Anastomose | 12 | grün — inkl. Auto-Fallback HTTP 404 → Channel |
| 06 Heterokaryose | 13 | grün — Test 9 HETERO_MAX_ANCHORS-Begrenzung voll |
| 07 Apoptose | 9 | grün — inkl. Self-Apoptose IRREVERSIBEL |
| 08 UI-Demo | 8 | **grün — Bau-08.Y-Live-Beleg** |

**Gesamt:** 76 Knöpfe + Setup je Panel, alle ohne Modul-Befund.
Keine Bau-08.Y-Regression.

---

## 5. Was NICHT angefasst

- **Kein Code-Eingriff** — Bau 08.Y selbst war schon gemerged
  (PR #117, `main` `54bba18`).
- **Kein Spec-Eingriff** — INTERFACES.md unverändert.
- **Kein `status.json`-Eingriff** — Modul 08 bleibt `score:"fertig"`,
  `update_puls_pie.py` NICHT aufgerufen (Sichttest-Nachzug ist Doku).
- **Kein Modul-05/06/07-Eingriff** — die Bau-06.Y-Limitierung in
  Panel 06 Test 9 ist erwartetes Verhalten, wird durch eigene
  Bau-Sitzung 06.Y aufgelöst.

---

## 6. Tafel-Spannung

Keine. Die in Bau-06.Y-Brief dokumentierte „bekannte Limitierung"
ist bewusst noch aktiv, weil Bau 06.Y selbst noch nicht gebaut ist
— das ist Pipeline-Status, keine Tafel-Verletzung.

---

## 7. Vorgeschlagene nächste Schritte

1. **Bau-Sitzungen 05.Y / 06.Y / 07.Y schreiben** — die drei Briefe
   sind seit 2026-05-19 gemerged (PRs #113 / #114 / #115). Eigene
   Bau-Sitzungen je ~2-3 h, in beliebiger Reihenfolge (Modul 05
   ist Receiver-Map-Erstbau, 06 Heterokaryose-Receiver-Map +
   slot-suffixed Lese-Pfad, 07 Apoptose-Receiver-Map +
   `_sendLegacyForIdentity`-Hook). Nach diesen drei ist die in
   Bau-08.Y-Brief dokumentierte Pipeline der vier Konsumenten-
   Bauten vollständig.
2. **Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch)** — alle
   Bau-02.Y / 04.A / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
   Endknoten-Repo verfügbar machen (Multi-Persona-Pfad live; setzt
   Schritt 1 voraus, dass Bau 05.Y / 06.Y / 07.Y gebaut sind).
3. **Vision-Anker 5 Identitäts-Container Spec-Sitzung** (optional) —
   löst die User-Key-Test-Brücke aus Bau 04.B mit produktivem
   sicheren Pfad (steht parallel zur Konsumenten-Bauten-Pipeline).

---

## 8. PR-Stand

- **PR #117** „Bau 08.Y slot-spezifische Outbox in Modul 08 (UI-Demo)"
  gemerged 2026-05-20, `main` `54bba18`.
- **Dieser Sichttest-Nachzug:** Branch
  `claude/bau-08y-sichttest-nachzug-j6mJF`, Draft-PR
  „Bau 08.Y slot-spezifische Outbox — Sichttest-Nachzug" (Doku-only,
  kein Code).

---

**Sichttest-Disziplin:** Klaus' Browser-Lauf 2026-05-20 belegt
beide Hälften des Sichttest-Pakts:
1. **Bau-08.Y-Schreib-Pfad live** (Panel 08 mit slot-suffixed
   Store-Output + slot-spezifische OutboxFullError-Message).
2. **Volle Regression** der bisher gebauten sieben Module — keine
   Bau-08.Y-Regression in Modulen 01–07.

Beides war im Brief BAU_08Y_SLOT_SPEZIFISCHE_OUTBOX als
„Vorgeschlagener nächster Schritt 1" notiert. Damit ist die
Bau-Sitzung Bau 08.Y vollständig abgeschlossen.
