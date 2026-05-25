# Übergabeprotokoll — Sichttest Bau 15.B + Brief-Anlage Pflege Endknoten-Migration erweitern

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Mini-Pflege (Sichttest-Status-Nachzug + Brief-Anlage)
**Branch:** `claude/brief-pflege-endknoten-migration-erweitern`
**Anschluss:** Bau-Sitzung 15.B (PR #159, gemerged als `7547ced`).

---

## Anlass

Klaus hat im gleichen Tag den Bau-15.B-Sichttest **8/8 grün** in
DeX-Chrome auf Galaxy Tab S6 durchgezogen (Termux-`localhost:8000`-
Server, Hard-Reload nach Pull). Sichttest-Sequenz:

| Knopf | Status | Belegnis |
|---|---|---|
| Setup | ✓ | alle vier neuen `_meta`-Getter sichtbar (siegelAvailable:false, drei Cache-Counter 0) |
| 10 read() Schema | ✓ | snapshotByteLen=691, siegel:null wie erwartet |
| 11 Anti-PII | ✓ (mit Mini-Pflege) | Knopf-Fix nahm eigene nodeId vom Vergleich aus — False-Positive bei Selbst-Eintrag in sbkim_siblings |
| 12 sporeRef | ✓ | Cache-Count +1, decision:accepted |
| 13 query (04.C fehlt) | ✓ | ignored, Reply headless via Smoke verifiziert |
| 14 hint (14 fehlt) | ✓ | beide Pfade ignored, console.info-Drossel headless verifiziert |
| 15 Replay-Dedupe | ✓ | 1+1 ohne Doppel |
| 16 Allowlist fail-soft | ✓ | 3 warns, 2 Einträge übrig |
| 17 Rate-Limit-Hook | ✓ | throttled:true sichtbar |

**Sage-Page Bonus-Check grün:** vier Plaketten in der Navleiste
sichtbar (LEBT, VERKEHR, FREMD, SBKIM-Siegel-Badge). Bau 15.B hat
Sub (e) nicht regrediert.

Klaus tippte „Befehl schreiben" am Sitzungs-Ende — diese Mini-Pflege
zieht den Sichttest-Status auf main nach und legt den Brief für die
nächste Pflege-Sitzung an (Pipeline-Schritt 5 Vorbereitung).

---

## Was getan

### 1. Sichttest-Status-Nachzug

- **`docs/components/15_membran.md` § Bauzustand** neue Zeile
  „Sichttest Bau 15.B | geprüft 2026-05-25 (Klaus, DeX-Chrome auf
  Galaxy Tab S6)" mit voller Sichttest-Anmerkung (Setup-`_meta`-
  Output, alle acht Knöpfe 10–17 einzeln dokumentiert, Sage-Page
  Bonus, Mini-Pflege Knopf-11-Fix).
- **`docs/INTERFACES.md` § 1 Modul 15 Status** auf `stabil` gezogen
  (war `review`) — Klaus-Sichttest 8/8 grün ist der dritte und letzte
  Lifecycle-Schritt (Spec → Code → Sichttest). „Geprüft"-Zeile um
  2026-05-25-Sichttest-Eintrag erweitert.
- **`docs/PULS.md`** Tabellenzeile 15 auf „Fertig" mit
  Sichttest-Hinweis + Sitzungs-Eintrag oben mit voller Anlass-/
  Was-getan-/Nächster-Schritt-Spaltenstruktur.
- **`status.json`** `membranBacklog[0]`:
  - `score` auf `"fertig"` gezogen (war `"stub"`)
  - `siegel`-Text vorn um „Sichttest 8/8 grün 2026-05-25 (…) …
    Mini-Pflege Knopf-11 …" ergänzt
- **Pie-Skript aufgerufen** → Pie-Block in PULS.md aktualisiert
  (Modul-Stand 16 Module: 4 Schablone / 0 Werkstatt / 0 Spec /
  **8 Code-Stub / 4 Fertig**; vorher 9 / 3). Modul 15 von Stub →
  Fertig.

### 2. Brief-Anlage

- **`docs/sessions/BRIEF_PFLEGE_ENDKNOTEN_MIGRATION_ERWEITERN.md`**
  neu angelegt mit vollem Codeblock für die nächste Pflege-Sitzung.
  Inhalt:
  - **Karte 09 § Einbau-Anleitung um Schritt 10 + 11 erweitern:**
    - Schritt 10 (Membran-Allowlist + FREMD-Lampe + SW-Probe-
      Detektor) — Kopier-Anker für `src/modules/15_membran.js`,
      `:root --lamp-alert`, `.lamp.fremd-*`-CSS-Klassen, `#lamp-fremd`-
      DOM, `sbkim-init.js`-Init mit `allowedOrigins` +
      `lampSelector`. `allowedOrigins`-Default-Vorschlag pro Endknoten:
      `["https://lausiklauskn-png.github.io"]` (konservativ; wächst
      mit dem Mycel). `enableTestButton:true` NICHT bei Endknoten —
      nur Sage-Page (Karte 15 § Pflege Sage-Page-Sichttest-Knopf
      verbindlich).
    - Schritt 11 (SBKIM-Siegel-Badge) — Kopier-Anker für
      `src/modules/16_siegel.js`, vier `:root --siegel-*`-Variablen,
      `#sbkim-siegel-badge`-CSS-Block, `.lamps`-Container,
      `sbkim-init.js`-Init mit `badgeSelector:".lamps"` + `repoUrl`-
      Override pro Endknoten. Anti-Greenwashing-Hinweis: Badge
      erscheint NUR wenn alle sieben Pflicht-Module geladen sind.
  - **`BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` erweitern:**
    - Aufgabe g) Modul 15 einbauen — Schritt 10 ausführen +
      Erwartungs-Block (Selbstcheck-Zeile, FREMD-Lampe, Sub-(e)-
      Modal, SW-Probe-Detektor).
    - Aufgabe h) Modul 16 einbauen — Schritt 11 ausführen +
      Erwartungs-Block (Selbstcheck-Zeile, Badge in Navleiste,
      Modal-Render, Esc/Backdrop).
    - Punkt e) Sichttest um zwei neue Selbstcheck-Zeilen erweitern.

---

## Disziplin gehalten

- KEIN Modul-Code-Eingriff in `src/modules/*.js`.
- KEIN Eingriff in `index.html` / `sbkim-init.js` / `tests/manual_check.html`.
- KEINE Spec-Änderung an Karte 15 / Karte 16 / INTERFACES § 1 Modul
  15+16 — diese Pflege ist reiner Status-Nachzug + Brief-Anlage.
- KEINE Tafel-Umsortierung Pipeline.
- KEIN `PROTOCOL_VERSION`-Bump, KEIN `DB_VERSION`-Bump.

---

## Wichtige Beobachtungen

- **`storage.storagePersisted:false` im Klaus' Sichttest** — dies
  ist Klaus' lokale Browser-Realität auf DeX-Chrome (Modul 01 hat
  `navigator.storage.persist()` nicht durchsetzen können). Kein
  Bau-15.B-Bug; Modul 15 spiegelt den Wert nur fail-soft. Wenn Klaus
  Persistenz erzwingen will, müsste er das im Browser-Berechtigungs-
  Dialog tun — eigene Folge-Frage, nicht in dieser Pflege.
- **Klaus' lokales `sbkim_siblings` enthält einen Selbst-Eintrag**
  (alte Test-Daten, vermutlich aus Bau-05-BroadcastChannel-Selbst-
  Handshake). Modul 05 wirft seit der Bridge-Spec inzwischen einen
  Selbst-Handshake meist ab, aber alte Einträge bleiben bestehen.
  Aufräumen wäre optional eigene Mini-Pflege — die Mini-Pflege
  Knopf 11 macht diesen Eintrag im Sichttest jetzt sichtbar als
  „Selbst-Eintrag ignoriert" statt als „Leak gefunden".
- **Pie-Stand:** 4 Module fertig (00, 01, 02, **15**). Modul 16
  ist noch `"stub"` weil Klaus den vollen Panel-16-Sichttest noch
  nicht eigens gemacht hat — der Bonus-Check „Badge sichtbar in
  Sage-Page" ist nur Teil-Sichttest. Eigene Folge-Pflege.

---

## Was offen blieb

- **Pflege-Sitzung Endknoten-Migration-Brief erweitern** (Pipeline-
  Schritt 5 Vorbereitung) — Brief liegt fertig, eigene Sitzung in
  Sage-Protokol-Repo.
- **Externe Endknoten-Bau-Sitzungen** pro Endknoten-Repo —
  Pipeline-Schritt 5 voll.
- **Klaus' App-Freigabe** (Pipeline-Schritt 6).
- **PULS.md 3000-Zeilen-Grenze** weiterhin überschritten (pre-
  existing, eigene Auslagerungs-Pflege fällig — nicht blockierend).
- **Modul 16 Voll-Sichttest** (Panel 16 Knöpfe 1–6 in
  `tests/manual_check.html`) — Klaus hat nur Sage-Page-Bonus
  gemacht; voller Panel-16-Sichttest fällig vor App-Freigabe.

---

## Nächster sinnvoller Schritt

1. **PR aus dieser Mini-Pflege mergen** (Brief-Anlage + Status-
   Nachzug).
2. **Pflege-Sitzung Endknoten-Migration-Brief erweitern** — neue
   Sitzung in Sage-Protokol-Repo mit dem Brief als ersten Prompt.
   Erweitert Karte 09 + bestehenden Endknoten-Brief um Module 15+16.
3. **Externe Endknoten-Bau-Sitzungen** pro Endknoten-Repo (Mein-
   Rezeptbuch + Mein-Mixarium) mit dem erweiterten Brief.
4. **Klaus' App-Freigabe** Pipeline-Schritt 6.

Optional:
- **Modul 16 Voll-Sichttest** (Panel 16 Knöpfe 1–6) vor App-Freigabe.
- **Mini-Pflege Selbst-Eintrag in sbkim_siblings aufräumen** —
  Klaus' lokales Datenrest, kein blockierender Bug.
- **Auslagerungs-Pflege PULS.md** — alte 2026-05-1x-Einträge nach
  archiv schieben, um 3000-Zeilen-Grenze einzuhalten.

---

## Geänderte Dateien

- `docs/components/15_membran.md` — § Bauzustand neue Sichttest-Zeile.
- `docs/INTERFACES.md` — § 1 Modul 15 Status `review` → `stabil` +
  Geprüft-Datum 2026-05-25 Sichttest.
- `docs/PULS.md` — Tabellenzeile 15 auf „Fertig" + Pie-Block-Aktualisierung
  (4 Fertig, 8 Stub) + Sitzungs-Eintrag oben.
- `status.json` — `membranBacklog[0]` `score:"fertig"` + Siegel-Text
  Sichttest-Eintrag vorne.
- `docs/sessions/BRIEF_PFLEGE_ENDKNOTEN_MIGRATION_ERWEITERN.md` — neu
  angelegt, Brief-Codeblock für nächste Pflege-Sitzung.
- `docs/sessions/archiv/2026-05-25_sichttest-15b-brief-endknoten-migration.md`
  — dieses Protokoll.
