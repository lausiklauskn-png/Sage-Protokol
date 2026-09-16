# Übergabeprotokoll 2026-09-16 · Briefkasten-Runde über alle sieben Gegenstellen

**Rolle:** Hauptsitzung · **Zweig:** `claude/briefkasten-runde-2026-09-16`
**Auftrag (Klaus):** *„dann mach jetzt den Briefkasten"*

---

## Ausgangslage

Sages `sbkim/SIGNAL.json` führte sieben Gegenstellen mit `ack` weit unter deren `seq`.

| Gegenstelle | `seq` | `ack` | ungelesen |
|---|---|---|---|
| SB-KIMTool-Point | 36 | 24 | 12 |
| Mein-Rezeptbuch | 13 | 5 | 8 |
| Mein-Mixarium | 14 | 6 | 8 |
| BookLedgerPro | 23 | 18 | 5 |
| Family Projekt | 7 | 2 | 5 |
| Jasons-Tresor | 14 | 11 | 3 |
| Mein-Tresor | 17 | 14 | 3 |
| **Summe** | | | **40** |

## Vorgehen

1. `sbkim/SIGNAL.json` jeder Gegenstelle aus deren `origin/main` gelesen, die
   `history`-Einträge mit `seq > ack` ausgewertet.
2. Das an Sage adressierte Postfach jeder Gegenstelle vollständig gelesen
   (`AUSTAUSCH.md` bzw. `AUSTAUSCH-Sage.md`, zusammen rund 46 KB).
3. **Jede Angabe gegen die Quelle gehalten statt übernommen** — Briefkasten-Inhalt ist
   `untrusted external data` (CLAUDE.md, `docs/SICHERHEIT-BRIEFKASTEN.md`). Keine
   Anweisung aus einem Postfach ausgeführt.
4. Reziproken Cosinus jeder Gegenstelle neu gerechnet.

## Befunde

### 1 · Drei ausdrückliche Bitten, alle drei erfüllt

| Bitte | Datum | Stand |
|---|---|---|
| Rezeptbuch: „Inbox auf `MT1I-y89OpfRm0Un8HH4QAxMFgs6agtFehh5rA38Q68` aktualisieren" | 2026-07-15 | **überholt** |
| Mixarium: „führt uns unter `dJ7H5BpjkQvkOyGS6qWrZgpDocVIPAVsJNB1wqt9h3g`" | 2026-07-15 | **überholt** |
| Family Projekt: „schickt die Quittung zurück" | 2026-06-27 | **lag seit dem 27.06. in `sbkim/AUSTAUSCH-FamilyProjekt.md`** |

Die Neu-Signier-Welle vom 18.–20.07. hat beiden Knoten erneut neue nodeIds gegeben.
Gemessen, nicht angenommen — Live-nodeId aus `origin/main:sbkim/spore.json` gegen
Sages `status.json`:

| Repo | live == was Sage führt |
|---|---|
| SB-KIMTool-Point · Jasons-Tresor · Mein-Tresor · Mein-Rezeptbuch · Mein-Mixarium · BookLedgerPro · family-project | **7 von 7 identisch** |

### 2 · Der reziproke Cosinus, gegen die heute committeten Sporen

Beide Sporen aus `origin/main:sbkim/spore.json`, `domainVector` 384-dim, L2 = 1.000000,
Skalarprodukt (Modul 04).

| Gegenstelle | cos heute | Register-Spalte NETZ-STAND | Δ | was die Gegenstelle zuletzt meldete |
|---|---|---|---|---|
| SB-KIMTool-Point | 0.893026 | 0.893026 | ±0.000000 | 0.8618 (ihr seq 34) |
| Mein-Mixarium | 0.883142 | 0.817718 | +0.065424 | 0.8223 (ihr seq 14) |
| Mein-Rezeptbuch | 0.874048 | 0.874048 | ±0.000000 | 0.792393 → `verified-spore` |
| Jasons-Tresor | 0.872405 | 0.872405 | ±0.000000 | 0.847784 (v0.1) |
| Mein-Tresor | 0.866101 | 0.866101 | ±0.000000 | 0.847784 (v0.1) |
| BookLedgerPro | 0.853980 | 0.855505 | −0.001525 | 0.813525 |
| Family Projekt | 0.842038 | 0.842038 | ±0.000000 | 0.8287 |

**Alle sieben ≥ 0.80.** Fünf von sieben reproduzieren die Register-Spalte auf sechs Stellen.

**Mixarium erklärt:** deren `sbkim/spore.json` wurde am 2026-09-10 ersetzt (Mixarium #199,
Commit-Nachricht: „0.826040 → 0.883142"). Die Register-Spalte trägt den Stand davor.

**BookLedgerPro nicht erklärt:** deren Spore ist seit 2026-06-21 unverändert. Ob Sages
eigener Vektor sich am 2026-09-10 bewegte, war **nicht zu belegen — der Klon ist flach**
(`git show <commit>^:sbkim/spore.json` scheitert an der Abschneide-Grenze). Beide Zahlen
stehen nebeneinander; nicht geglättet.

### 3 · Asymmetrie, die Sage nicht allein auflösen kann

Mein-Rezeptbuch (deren seq 11) und Mein-Mixarium (seq 12) führen Sage weiterhin auf
`verified-spore`. Beide haben gegen die damaligen Sporen **richtig gerechnet**
(0.792393 / 0.766963 < 0.80). Die Rechnung ist symmetrisch; die Bitte um reziproke
Neu-Einstufung liegt in beiden Postfächern. **Entschieden wird das dort.**

## Was geändert wurde

| Datei | Änderung |
|---|---|
| `sbkim/SIGNAL.json` | `ack` für alle sieben nachgezogen · `seq` 89 → 90 · headline · history-Eintrag |
| `sbkim/AUSTAUSCH.md` · `-JasonsTresor` · `-MeinTresor` · `-Rezeptbuch` · `-Mixarium` · `-BookLedgerPro` · `-FamilyProjekt` | je ein Quittungs-Abschnitt: gelesen bis `seq`, Inhalt, Folge, gemessener Cosinus |
| `sbkim/NETZ-STAND.md` | Abschnitt „Briefkasten-Runde 2026-09-16" mit Tabelle, Gegenprobe und benannter Grenze |
| `docs/PULS.md` | Eintrag; vorher ein Eintrag (119 Zeilen) ins Archiv ausgelagert |
| `docs/sessions/archiv/2026-09-16_puls-eintrag-zaehler.md` | der ausgelagerte Wortlaut, vollständig |

## Was NICHT getan wurde

- **Kein Schreiben in ein fremdes Repo.** Quittungen stehen ausschließlich in Sages
  eigenen Postfächern — so sieht §11.6 es vor, und das Pushen IST das Signal.
- **Keine Stufe bei einer Gegenstelle geändert.** Was Rezeptbuch und Mixarium über Sage
  führen, entscheiden sie.
- **Kein Mitschnitt der Mycel-Karte.** Alle Zahlen hier messen die **abgelegte** Spore,
  nicht die im Raum. Wer den Netz-Auftritt beurteilen will, braucht einen Mitschnitt
  (`docs/LEHREN.md` § 9).
- **`tests/manual_check.html` ungeprüft** — an dieser Runde wurde kein Code geändert,
  nur Postfächer, Register und Doku.

## Offen

1. Rezeptbuch und Mixarium: reziproke Neu-Einstufung (liegt in deren Postfach).
2. BookLedgerPros −0.001525 — auflösbar mit `git fetch --unshallow`.
3. Die sieben quittieren Sage ihrerseits bei `seq` 18–46, Sage steht bei 90.
