# Brief — Pflege-Sitzung „Sichttest 16 Sub e grün"

Folge-Pflege nach Klaus' Browser-Lauf der Panel-16-Knöpfe 9–12
(Bau-Sitzung 16 Sub (e) Bronze/Gold-Stufung, PR #<wird-eingetragen>).
Pfad analog PR #178 (Sichttest 04.C grün).

**Voraussetzungen:**

- Klaus hat die Pull-Anweisung bekommen, hat
  `claude/bau-16-sub-e-bronze-1UeT1` bzw. den gemergten `main`-
  Stand gezogen (Hard-Reload Strg+Shift+R wegen Service-Worker /
  HTTP-Cache).
- Klaus hat Panel 16 in `tests/manual_check.html` aufgerufen (z.B.
  via Termux `python3 -m http.server 8000` + Tablet-Chrome auf
  `http://localhost:8000/tests/manual_check.html`).
- Klaus hat Knöpfe 9, 10, 11, 12 (in dieser Reihenfolge) gedrückt
  und das Output protokolliert.

---

## Codeblock für die nächste Sitzung

```
Du bist eine Pflege-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Sichttest-Nachzug-Pflege „Sichttest 16 Sub e grün".
KEIN Modul-Code-Eingriff — reine Doku-Pflege nach Klaus' Live-
Probe der Panel-16-Knöpfe 9–12 aus Bau-Sitzung 16 Sub (e).

Branch: claude/sichttest-16-sub-e (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Pflicht am Sitzungsende + § „Sicherheits-Module
   pflegen Aspekte" (gilt nicht — diese Pflege ist Render-Schicht-
   Sichttest-Nachzug, KEIN neues Sicherheits-Modul).
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Bau-Sitzung 16 Sub (e)
   Bronze/Gold-Stufung".
3. docs/components/16_siegel.md § Sub (e) + § Bauzustand (letzte
   zwei Zeilen „Bau Sub (e) Bronze/Gold-Stufung" + „Sichttest Sub
   (e) — folgt").
4. tests/manual_check.html Panel 16 Knöpfe 9–12 (zur Erinnerung,
   welche Tests Klaus durchgeführt hat).
5. Klaus' Sichttest-Output (steckt im Chat-Prompt — Klaus pastet
   die JSON-Ausgaben der vier Knöpfe oder beschreibt Befunde).

Deine Aufgabe (Doku-Pflege):

A. Karte 16 § Bauzustand: neue Zeile „Sichttest Sub (e) — <Datum>"
   mit Klaus' Sichttest-Befund (4/4 grün ODER detaillierte Befunde,
   falls eine Probe rot war). Position: nach „Sichttest Sub (e) —
   folgt"-Zeile, alte „folgt"-Zeile ersetzen.

B. status.json Modul 16: `score`-Wechsel von `"stub"` auf passenden
   Wert (Konvention: nach Klaus' Sichttest „fertig" oder Code-Stub
   bleibt? — Klaus entscheiden lassen, oder Konvention aus
   04.C-Sichttest spiegeln: dort wechselte 04 von „stub" auf
   „fertig" nach 5/5 grün). `siegel`-Text aktualisieren mit
   Sichttest-Resultat. `python3 scripts/update_puls_pie.py`
   aufrufen.

C. INTERFACES.md § 1 Modul 16 Geprüft-Zeile um neuen Eintrag
   erweitern: „2026-XX-XX (Sichttest Bau 16 Sub (e) — Klaus, DeX-
   Chrome auf Galaxy Tab S6: Panel 16 Knöpfe 9–12 4/4 grün)".
   Status-Zeile ggf. von „entwurf" auf „stabil" wenn 04.C-Konvention
   übernommen wird.

D. INTERFACES.md § 10 Änderungsprotokoll: neue Tabellen-Zeile mit
   Sichttest-Datum + „Sichttest 16 Sub (e) grün" + voller Bericht.

E. PULS.md Schnellüberblick-Tabelle: Modul-16-Zeile aktualisieren
   („geprüft 2026-XX-XX (Klaus) — 4/4 grün …").

F. PULS.md neuer Sitzungs-Eintrag oben in § Sitzungs-Einträge.

G. Übergabeprotokoll docs/sessions/archiv/<Datum>_sichttest-16-sub-e-gruen.md.

H. Commit + Push + Draft-PR.

I. „Vorgeschlagene nächste Schritte"-Block im Chat (typisch
   Pipeline-Schritt 5e Re-Aktivierung MR/MM oder Bau Modul 18).

Heilige Tafeln dieser Sitzung:
- KEIN Modul-Code-Eingriff in src/modules/16_siegel.js (Sichttest-
  Pflege ist reine Doku).
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-Bump.
- KEINE Tafel-Umsortierung CLAUDE.md.
- Wenn eine Probe rot war: NICHT bug-fixen ohne Klaus' Diagnose-
  Anker; eigene Bau-Pflege-Sitzung mit eigenem Brief, nicht in
  diese Sichttest-Pflege quetschen.
```
