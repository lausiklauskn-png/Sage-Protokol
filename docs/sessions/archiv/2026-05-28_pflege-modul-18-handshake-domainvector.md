# Übergabeprotokoll · 2026-05-28 · Pflege Modul 18 Sub (a) Handshake — ownDomainVector

**Branch:** `claude/pflege-modul-18-handshake-domainvector`
**Sitzungs-Rolle:** Pflege-Sitzung. Folge-Wurzel-Fix zur Match-Embed-
Pflege (PR #199). Wizard-Schritt 4 (Handshake) wirft Float32Array-
Pflicht-Fehler.
**Auslöser:** Klaus' Live-Sichttest 2026-05-28. Schritt 3 (Match) jetzt
grün (Sage-Page 86 %, Mein-Mixarium 85 %, je Drei-Bars), aber Schritt 4
(Handshake) wirft auf Sage-Page UND Mein-Mixarium:
„Handshake fehlgeschlagen — ownDomainVector muss Float32Array(384) sein
— Aufruf von handshake."

---

## Wurzel-Diagnose (Bug-Kette)

1. `triggerStepFourHandshake` in `src/modules/18_tool_pwa.js` rief
   `anaMod.handshake(foreignSporeCache)` mit nur **einem** Argument.
2. Modul 05 `handshake(targetSpore, ownDomainVector, options?)`
   (`src/modules/05_anastomose.js` Z. 662 + Vertrag INTERFACES § 1
   Modul 05 Z. 1285) erwartet als **2. Argument** einen eigenen
   Domain-Vektor `Float32Array(384)`.
3. `_doHandshake` Z. 683 prüft `ownDomainVector instanceof Float32Array
   && length === EMBEDDING_DIM` → bei `undefined` → wirft
   `AnastomoseDependenciesError` mit genau Klaus' Fehlertext.

Gleiche Bug-Klasse wie der Match-Schritt (PR #199): eine Vektor-
erwartende API bekam Nicht-Vektor-Input. Reproduzierbar auf Sage-Page
→ Wurzel im Sage-Quellcode, nicht im Endknoten.

---

## Was getan

### Eingriff — `src/modules/18_tool_pwa.js` `triggerStepFourHandshake`

- **Verfügbarkeits-Check:** fehlt `SbkimEmbedding.embedPassage` →
  Fehlermeldung + return.
- **Leere-Stichworte-Guard:** keine `domainKeywords` → klare
  Fehlermeldung statt Vektor-Fehler.
- **Kanonische Domain-Vektor-Ableitung:**
  `SbkimEmbedding.embedPassage(domainKeywords.join(", "))` → analog zur
  Spore-`domainVector`-Erzeugung (Beleg: `tests/manual_check.html`
  `mainVec` Z. 1423 nutzt exakt `embedPassage(domainKeywords.join(", "))`).
- Vektor als **2. Argument** an `handshake(foreignSporeCache,
  ownDomainVector)` gereicht. Default-Transport `"auto"` unverändert
  (Modul 05 § `transportDefault`), daher kein options-Objekt nötig.
- Bestehender Erfolgs- + catch-Block (auto-close, Fehler-Hints)
  unverändert.

### Test — `tests/smoke_bau18_sub_a_vorab.mjs`

Probe 18 NEU: treibt headless bis Schritt 4 (openAndockTab → step2-next
→ step3-Match → step3-next → step4-Handshake), Mock `SbkimAnastomose.
handshake` prüft Arg 2 `instanceof Float32Array && length === 384`,
Mock `embedPassage` prüft String-Input. **18/18 grün.**

### Doku — `docs/components/18_tool_pwa.md`

- § Sub (a) Schritt 4: Handshake-Signatur + embedPassage-Pflicht
  verankert.
- § Bauzustand: neue Zeile „Pflege Handshake-ownDomainVector —
  2026-05-28".

---

## Tests

- `node --check src/modules/18_tool_pwa.js` → grün.
- `node --check src/modules/05_anastomose.js` → grün (Regression).
- `tests/smoke_bau18_sub_a_vorab.mjs` → 18/18 grün (Probe 18 neu).

---

## Strikte Tabus eingehalten

- KEIN Eingriff in Modul 03 (Embedding-Surface unverändert).
- KEIN Eingriff in Modul 05 (Anastomose-Surface unverändert — die
  Float32Array-Pflicht ist korrekt, der Bug war Modul-18-seitig).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege).
- KEIN externer Repo-Eingriff (MR + MM Sync-Sitzung nach Sichttest grün).
- KEIN Refactoring anderer Modul-18-Funktionen.

---

## Sichttest-Status

**Ungeprüft — wartet auf Klaus' Galaxy-Tab-S6-Browser-Lauf.** Erwartet:
Schritt 4 (Handshake) läuft durch („Handshake erfolgreich — Geschwister-
Knoten verbunden") statt Float32Array-Fehler, Wizard schließt automatisch.

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest** Schritt 4 — Andock-Wizard bis Handshake durch.
   Nicht headless. Blockiert die MR/MM-Sync.
2. **MR + MM Sync** — die neue Modul-18-Datei (jetzt inkl. Match-Fix
   PR #199 + Handshake-Fix) 1:1 in die Endknoten ziehen, NACH Sichttest
   grün.
