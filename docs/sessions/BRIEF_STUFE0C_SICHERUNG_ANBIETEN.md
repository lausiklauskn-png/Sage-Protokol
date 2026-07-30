# BRIEF — Stufe 0c: die Sicherung im richtigen Moment anbieten

**Angelegt:** 2026-07-30 (nach Stufe 0b) · **Stand:** bereit zum Bau

---

## Start-Befehl für die neue Sitzung (kopieren)

```
Du bist eine Bau-Sitzung im SBKIM-Netz von Klaus.

Pflichtlektüre, in dieser Reihenfolge, VOR jeder Zeile Code:
1. Sage-Protokol/CLAUDE.md — § SITZUNGSSTART-PFLICHT und § Freibrief
2. Sage-Protokol/docs/PULS.md — die obersten ZWEI Einträge
   (2026-07-30 Nachmittag + 2026-07-30 früh)
3. Sage-Protokol/docs/sessions/BRIEF_STUFE0C_SICHERUNG_ANBIETEN.md  ← dein Auftrag
4. Sage-Protokol/docs/sessions/archiv/2026-07-30_stufe-0b-identitaet-reparierbar.md

Stand: 0b ist gebaut und netzweit gemergt (6 PRs). Im Netz-Panel gibt es
jetzt "🪪 Kennung sichern": Sicherung anlegen / einspielen / Fächer
aufräumen, und bei leerer Schublade fragt "Mit dem Knotennetz verbinden"
erst, statt wortlos eine neue Kennung anzulegen.

Deine Aufgabe (0c, drei Teile):
1. IM RICHTIGEN MOMENT ANBIETEN: direkt nachdem eine Kennung ENTSTANDEN
   ist ("✓ Identität erzeugt: …"), gehört die Sicherung als nächster
   Schritt hin — nicht als Hinweis weiter oben, den man überliest.
   Ein Knopf direkt in der Erfolgsmeldung.
2. NICHT NERVEN: wer eine Sicherung hat, sieht das Angebot nicht mehr.
   Wer es wegklickt, sieht es diese Sitzung nicht wieder (nicht dauerhaft
   abstellen — der Verlust wäre sonst wieder unreparierbar).
3. NACH DEM VERLUST ERKENNEN: ändert sich die Kennung, OBWOHL es hier
   schon eine gab (localStorage merkt sich die zuletzt gesehene), sagt
   das Panel das deutlich: "Deine Kennung hat sich geändert — falls das
   nicht von dir kam, spiel deine Sicherung ein." Das ist die Stelle, an
   der Klaus den Verlust bisher erst aus einem Analyse-Rekord erfahren hat.

Wichtig: je Repo zuerst `git fetch origin main`, dann von origin/main
abzweigen. Die UI-Datei 23_rendezvous_ui.js ist byte-1:1 in Sage-Kanon
src/modules/ + sbkim-bundle/modules/ + Kimboard modules/ + BookLedgerPro/
Mein-Tresor/Jasons-Tresor/family-project sbkim/ — Änderung ZUERST im Kanon,
dann byte-kopieren und den sha-Pin in Kimboard test/smoke.test.js nachziehen.

Ehrliche Grenze, die in der Oberfläche bleiben MUSS: eine Räumung lässt sich
vom Browser aus NICHT verhindern, nur unwahrscheinlicher machen (installieren)
und der Verlust REPARIERBAR halten (Sicherung).

Freibrief gilt (CLAUDE.md § Freibrief): selbst mergen, wenn getestet und
abgegrenzt. Jeden Test mit GEGENPROBE führen (ohne den Fix muss er fallen) —
das ist in dieser Sitzungsreihe der Standard.
```

---

## Stand (was schon liegt)

- **0a:** Panel zeigt „Meine Kennung" + „Speicher dauerhaft".
- **0c/0d/0e** (die alten, gleichnamigen Punkte aus dem 0-Brief): gebaut + gemergt.
- **Fix 1:** Modul 01 heilt „connection is closing" selbst — **live bestätigt**
  am 2026-07-30 (Sage ⟷ Point, 5× `established`, Score 0.8635).
- **Fix 2:** Modul 01 löscht **nie im Zweifel**.
- **0b:** Sicherung anlegen / einspielen / Fächer aufräumen + kein stummes Anlegen.

**Offener Kern:** Kimboard verlor am 2026-07-30 erneut seine Kennung
(`XFi3xrd7…` → `e8UwgMlx…`). Ob die Härtung dort schon lief, ist **nicht**
entscheidbar (das Fenster war seit der Nacht offen und fuhr alten Code). Darum
liegt der Schwerpunkt weiter auf **Reparierbarkeit**, nicht auf weiterer
Ursachensuche.

## Akzeptanzkriterien

| Teil | Nachweis |
|---|---|
| Angebot im Moment | Nach „Identität erzeugt" erscheint der Sicherungs-Knopf direkt darunter |
| Nicht nerven | Mit vorhandener Sicherung erscheint es nicht; weggeklickt → diese Sitzung nicht wieder |
| Wechsel erkennen | Kennung ≠ zuletzt gesehene → deutlicher Hinweis mit Weg zur Wiederherstellung |
| immer | Test **mit Gegenprobe** (ohne Fix muss er fallen) + Drift-Guards grün |
| immer | **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht |

## Nicht in diesen Auftrag

- Alte Kennungen jagen (Klaus: Testphase, nichts verloren).
- Der stumme Antworter (Antworter-Tab muss vorn/wach sein) — eigenes Thema.
- PULS-Archivierung (7573 Zeilen gegen 3000er-Klausel) — eigene Pflege-Sitzung.
- Stufe 3–6 des Schutz-Plans.

## Pflicht am Abschluss

1. `docs/PULS.md` fortschreiben. 2. Übergabeprotokoll in `docs/sessions/archiv/`.
3. Neuen Brief + **vollständig als Codeblock im Chat**. 4. „Nächste Schritte" im Chat.
5. `sbkim/SIGNAL.json` seq +1.
