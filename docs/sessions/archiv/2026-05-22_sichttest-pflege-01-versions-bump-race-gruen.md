# Übergabeprotokoll — Sichttest Pflege Modul 01 Versions-Bump-Race in `openProbe` grün

**Datum:** 2026-05-22
**Sitzungs-Rolle:** Mini-Pflege (Doku-only — Sichttest-Vermerk nachgezogen).
**Branch:** `claude/pflege-01-sichttest-versions-bump-race-gruen`.
**Vorige Pflege:** PR #138 (gemerged 2026-05-22, `main` `b526fdc`) hatte
die Race-Auflösung gebaut + headless-Smoke 172/172 grün, aber den
Sichttest-Vermerk auf „ungeprüft, wartet auf Klaus' Browser-Lauf"
gelassen.

---

## Was getan wurde

Klaus' Live-Sichttest am Galaxy Tab S6 / DeX-Chrome lief direkt nach
PR-#138-Merge durch — alle 11 Knopf-Klicks aus der Brief-Sequenz grün.
Diese Mini-Pflege zieht den Sichttest-Vermerk in zwei Dateien nach,
KEIN Code-Eingriff, KEIN INTERFACES-Eingriff, KEIN Smoke-Test-Eingriff.

### Klaus' Sichttest-Sequenz (Galaxy Tab S6 / DeX-Chrome, Termux-`python3 -m http.server 8000`)

| Schritt | Knopf | Ergebnis |
|---|---|---|
| 1 | Panel 01 „Notfall-Reset: IndexedDB komplett löschen" | DB `sbkim` gelöscht, Status-Chip „DB gelöscht — JETZT Strg+Shift+R" |
| 2 | Strg+Shift+R Hard-Reload | Tab frisch, Panels 00–08 wieder bereit |
| 3 | Panel 06 „Setup: Identität + 2 Pseudo-Geschwister (einmalig)" | **KEIN `ensureStore Versions-Bump blockiert`-Throw** (zentraler Race-Auflösungs-Beweis); `eigene_node_id: UnvQCNPhthiUCfb3CX3nzi7yGHBqvvzRvC_fA0Va858`, beide Pseudo-Geschwister geschrieben |
| 4 | Panel 06 Test 1 (Lokaler Pull-Round-Trip) | `outcome:"shared"`, `anchor_count:1`, Signatur valide, Inbox hat Eintrag |
| 5 | Panel 06 Test 9 (HETERO_MAX_ANCHORS-Begrenzung) | 6 Outbox-Einträge → `anchor_count:5`, „Nachtisch" zuerst, „Hefeteig" aussortiert |
| 6 | Panel 06 Test 10 (listHeterokaryosis) | 4 Inbox-Einträge, Form korrekt, `anchors`-Inhalte UI-seitig weggelassen |
| 7 | Panel 06 Test 11 (forgetHeterokaryosis idempotent) | `vor_forget:1 → nach_forget:0`, zweiter Aufruf wirft nicht |
| 8 | Panel 07 Test 4 (TTL-Cleanup) | `entfernt_anzahl:1`, altOld weg, altYoung bleibt |
| 9 | Panel 07 Test 5 (listLegacy) | 3 Demo-Einträge ohne `signature`-Feld in der UI-Antwort |
| 10 | Panel 07 Test 6 (Self-Apoptose IRREVERSIBEL) | `outcome:"completed"`, `stores_alle_leer:true`, `getNodeId_wirft_NoIdentityError:true` (Pseudo-Endpoints in `recipients_failed` erwartet) |
| 11 | Panel 00 Test 5 (TTL-Sweep) | `entfernt_anzahl:2`, beide alten Siblings entfernt, Snapshot leer |

**Zentraler Beweis ist Schritt 3.** Vor der Pflege warf Panel 06 Setup
reproduzierbar `ensureStore('sbkim_meta') Versions-Bump blockiert —
ein anderer Tab haelt die DB offen und ignoriert onversionchange.`
Nach der Pflege geht der Knopf sauber durch, der `eigene_node_id`-Hash
erscheint im Log, beide Pseudo-Geschwister werden geschrieben.

### Was an Doku nachgezogen wurde

1. **`docs/PULS.md` § Sitzungs-Eintrag 2026-05-22 § Sichttest-Status**
   von „ungeprüft" auf „**grün geprüft 2026-05-22**" mit der vollen
   11-Knopf-Tabelle und Live-Outputs aktualisiert.
2. **`docs/PULS.md` § Schnellüberblick Modul-01-Zeile § Sichttest-Spalte**
   um Datum 2026-05-22 ergänzt + neuen Vermerk „Pflege „Versions-Bump-
   Race in `openProbe`" Sichttest 2026-05-22 grün (Klaus, DeX-Chrome
   auf Galaxy Tab S6, 11-Knopf-Sequenz alle grün)" eingetragen.
3. **`docs/components/01_storage.md` § Bauzustand Zeile „Sichttest
   Race-Auflösung"** von „ungeprüft" auf „**grün geprüft 2026-05-22**"
   mit der vollen 11-Knopf-Output-Liste.

### Browser-Quirk-Bestätigung

50-ms-Timeout-Fallback in `closeConnectionAndWait` greift auf Android-
Chrome (DeX-Chrome / Galaxy Tab S6) erwartungs-gemäß — `db.onclose`
feuert dort weniger zuverlässig als auf Desktop-Chrome. Klaus' Live-
Sichttest hat damit auch den Android-Quirk validiert (Headless-Smoke
hatte das auf fake-indexeddb gespiegelt, der `onclose`-Fallback war
dort auch dominant).

### Folge-Beweis: PR #130-Test-Bridge live

Die 84 Bridge-Stellen aus PR #130 (Test-Bridge slot-suffix-Nachzug
für Bau-Sitzungen 05.Y / 06.Y / 07.Y / 08.Y) waren vorher nur
statisch verifiziert (kein un-suffixed Slot-Store-Zugriff per `grep`),
aber nicht live durchgeklickt. Klaus' Sichttest hat jetzt Panels
06 / 07 / 00 (Test 4 / 5 / 6 + Test 1 / 9 / 10 / 11 + Test 5) live
durchgespielt — die Bridge-Logik ist damit auch live bestätigt.

---

## Was NICHT angefasst wurde

- **KEIN Modul-Code-Eingriff** in `src/modules/01_storage.js` oder
  irgendein anderes Modul. Die Pflege ist Doku-only.
- **KEIN INTERFACES-Eingriff.** § 1 Modul 01 / § 9.5 / § 10
  Änderungsprotokoll unverändert seit PR #138.
- **KEIN Smoke-Test-Eingriff.** `tests/smoke_pflege_01_versions_bump_race.mjs`
  unverändert.
- **KEINE `tests/manual_check.html`-Änderung.**
- **KEINE Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **`PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION` unverändert.**
- `update_puls_pie.py` NICHT aufgerufen (Modul 01 bleibt
  `score:"fertig"`, kein Score-Wechsel).

---

## Was offen bleibt

Aus den Folge-Sitzungs-Vorschlägen zur Vorgänger-Pflege:

1. **„Vollständiger Modul-06/07/00-Sichttest auf grüner DB" jetzt
   ebenfalls erledigt.** Die Bridge-Stellen aus PR #130 sind durch
   Klaus' Sichttest live bestätigt (siehe oben § Folge-Beweis). Punkt
   schließt mit dieser Mini-Pflege.

Keine offenen Punkte mehr für Modul 01.

---

## Nächster sinnvoller Schritt

Nichts dringendes auf Modul 01. Klaus entscheidet, welche Bau-Sitzung
als nächste dran ist — Endknoten-Migration Multi-Identität (Brief PR
#?, schon angelegt) ist die nächste in der Bau-99-Pipeline.

---

## Pflicht-Quellen

- **Brief der Vorgänger-Pflege:** PR #136 (gemerged 2026-05-21).
- **Vorgänger-Pflege:** PR #138 (gemerged 2026-05-22, `main` `b526fdc`).
- **Übergabeprotokoll der Vorgänger-Pflege:** `docs/sessions/archiv/2026-05-22_pflege-01-versions-bump-race.md`.
- **Vorige Sichttest-Sitzung mit Diagnose 2:** `docs/sessions/archiv/2026-05-21_bau-sage-page-refactor-sichttest.md`.
