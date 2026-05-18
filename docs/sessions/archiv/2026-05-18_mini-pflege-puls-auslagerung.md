# Mini-Pflege 2026-05-18 — PULS-Auslagerung (8 ältere Sitzungs-Einträge)

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-puls-auslagerung`. Folge-Pflege direkt nach PR #86
(Anker 9 M04-Erweiterung) — Empfehlung aus PR #85 + PR #86 umgesetzt.

---

## 1. Was geschah

PULS stand nach PR #86-Merge bei **3256 Zeilen**, deutlich über der
3000er-Schutz-Klausel. Die letzten drei Mini-Pflegen (PR #84 Extension,
PR #85 Mini-Browser, PR #86 M04-Erweiterung) hatten jeweils zum Schluss
auf eine dezidierte Auslager-Sitzung verwiesen — diese hier holt das
nach.

## 2. Befund — Doppelung Body ↔ Archiv-Index

Die Schutzklausel-Konvention sagt: „Sitzungen in `docs/sessions/archiv/`
sind ausgelagert; der Archiv-Index darunter verlinkt jedes Übergabe-
protokoll. Neue Sitzungen tragen sich oben mit vollem Text ein und
verschieben den dann jeweils vorletzten in den Archiv-Index."

Über die Marathon-Welle 2026-05-16/17 war diese Konvention nicht
konsequent angewandt — viele ältere Sitzungs-Einträge standen
**gleichzeitig** als Vollband im Body **und** als Tabellenzeile im
Archiv-Index. Doppelung von ~988 Zeilen.

## 3. Ausgelagert (8 Einträge)

Alle bereits im Archiv-Index vorhanden, Übergabeprotokolle in
`docs/sessions/archiv/` unverändert:

1. 2026-05-17 · Pflege Modul 05/SW — Scope-Fix `isOwnEndpoint`
2. 2026-05-17 · Test-Erkenntnis A/B-Test PR #70
3. 2026-05-17 · Pflege Modul 05/SW — Phantom-Clients-Fix
4. 2026-05-17 · Mini-Pflege Score-Realität
5. 2026-05-17 · Mini-Pflege Rechtschreibung „Protokoll"
6. 2026-05-17 · Mini-Pflege Sage-Page — Live-Status
7. 2026-05-16 · Live-Andock — Cross-Knoten-Handshake etabliert
8. 2026-05-16 · Mini-Pflege Test-Panel — Knopf-7-pendingBackup-Reset

Schnitt-Marker: ab Beginn von „### 2026-05-17 · Pflege Modul 05/SW —
Scope-Fix `isOwnEndpoint`" bis kurz vor „## Archiv-Index (Sitzungen
vor dieser Pflege)". Separator `---\n\n` vor Archiv-Index wurde
erhalten.

## 4. Im Body verbliebene Einträge (10, inkl. dieser Pflege)

1. Diese Pflege (Top, 2026-05-18)
2. 2026-05-18 · M04-Erweiterung als neunter Anker (PR #86)
3. 2026-05-18 · Multi-Identität (PR #83)
4. 2026-05-17 · Königin-Relay (PR #82)
5. 2026-05-17 · Observatorium-Lehre 8 + 8. Galaxie
6. 2026-05-17 · Vision-Anker V1/V3/Universum
7. 2026-05-17 · Live-Channel-Handshake + Browser-Observatorium
8. 2026-05-17 · Bridge-Sichttest
9. 2026-05-17 · Bau-Sitzung Modul 05 BroadcastChannel-Bridge
10. 2026-05-17 · Spec-Sitzung Modul 05 BroadcastChannel-Bridge

Die Marathon-Welle 2026-05-17 (Vision-Anker + Modul-05-Live-Komplex)
bleibt zusammen sichtbar, weil thematisch verzahnt und der direkte
Kontext für V1-Sammelspec.

## 5. Was eingetragen

- **`docs/PULS.md` § Sitzungs-Einträge** um 8 Body-Einträge gekürzt
  (Python-Marker-Schnitt zwischen exakten Überschriften)
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag (diese Pflege)
- **Dieses Übergabeprotokoll** in `docs/sessions/archiv/`

## 6. Was NICHT angefasst

- Modul-Code (`src/modules/*`)
- `docs/INTERFACES.md`, Modul-Karten, Sage-Page
- `data/status.json` (kein Score-Wechsel, daher kein
  `update_puls_pie.py`-Aufruf)
- Archiv-Index — alle ausgelagerten Einträge standen bereits dort
- Übergabeprotokolle in `docs/sessions/archiv/` — unverändert

## 7. PULS-Zeilen-Status

- Sitzungsstart: **3256 Zeilen**
- Nach Auslagerung Body: 2268 Zeilen (−988)
- Nach Top-Eintrag (dieser): 2337 Zeilen (+69)
- Nach Übergabeprotokoll: keine PULS-Veränderung
- **Ende: 2337 Zeilen** — netto **−919 / −28 %**
- Puffer bis 3000er-Klausel: **663 Zeilen**

## 8. Konvention-Klärung für künftige Sitzungen

Künftig die Schutzklausel-Konvention konsequent umsetzen:

- Neue Sitzung trägt sich oben in PULS als Vollband-Eintrag ein
- Gleichzeitig wird der **vorherige Top-Eintrag** als Tabellenzeile
  in den Archiv-Index verschoben (Vollband-Text raus, Tabellenzeile
  mit Link rein)
- Übergabeprotokoll in `docs/sessions/archiv/` bleibt unverändert

Vorteil: Body bleibt schlank, Verlauf bleibt komplett auffindbar.

## 9. Nächster sinnvoller Schritt

V1-Sammelspec auslösen — der Großbrief liegt am Chat-Tab (von PR #86)
als Codeblock kopierbereit. Mehrtägig, nicht headless. Klaus kopiert
in eine neue Sitzung, wann er Zeit hat.

Alternativ: weitere Pause, V1-Sammelspec später.
