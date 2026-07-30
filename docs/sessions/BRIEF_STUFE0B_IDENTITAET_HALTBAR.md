# BRIEF — Stufe 0b: die Identität reparierbar machen (Messung ist ERLEDIGT)

**Angelegt:** 2026-07-30 (ersetzt die erste 0b-Fassung) · **Stand:** ENTSPERRT, bereit zum Bau

---

## Start-Befehl für die neue Sitzung (kopieren)

```
Du bist eine Bau-Sitzung im SBKIM-Netz von Klaus.

Pflichtlektüre, in dieser Reihenfolge, VOR jeder Zeile Code:
1. Sage-Protokol/CLAUDE.md — § SITZUNGSSTART-PFLICHT und § Freibrief
2. Sage-Protokol/docs/PULS.md — die obersten ZWEI Einträge (2026-07-30 früh + 2026-07-29 tiefe Nacht)
3. Sage-Protokol/docs/sessions/BRIEF_STUFE0B_IDENTITAET_HALTBAR.md  ← dein Auftrag
4. Sage-Protokol/docs/sessions/archiv/2026-07-30_ursache-identitaetsverlust-loeschpfad.md

Klaus' 0a-Messung ist ERLEDIGT — nicht mehr darauf warten. Ergebnis:
die Kennung überlebt die Nacht NICHT, auch nicht bei "Speicher dauerhaft: ja".
Ursache gefunden und geheilt (eigener Lösch-Pfad in Modul 01, netzweit gemergt).

Deine Aufgabe (0b, drei Teile):
1. SICHERUNG anbieten: Hinweis "für diesen Knoten gibt es noch keine
   Sicherung" + ein Klick dorthin (exportBackup aus Modul 02 ist gebaut).
2. WIEDERHERSTELLEN ins Netz-Panel holen (importBackup existiert) —
   Gegenprobe: Sicherung einspielen -> ALTE Kennung ist zurück.
3. SCHLUSS MIT STUMMER NEU-ANLAGE: heute legt die App beim Öffnen wortlos
   eine neue Identität an, wenn die Schublade leer ist (ensureIdentity:true).
   Künftig sagt sie es: "Schublade leer — neu anlegen oder Sicherung
   einspielen?". Das ist die Stelle, an der aus einem Speicherproblem
   unbemerkt ein Identitätswechsel wurde.
Dazu: Aufräum-Weg für die schon entstandenen Mehrfach-Fächer (aktive
Kennung behalten, alte Fächer entfernen) — als KNOPF im Panel, kein
Konsolen-Befehl für Klaus.

Wichtig: je Repo zuerst `git fetch origin main`, dann von origin/main
abzweigen. Die UI-Datei 23_rendezvous_ui.js ist byte-1:1 in ALLEN Apps —
Änderung ZUERST im Sage-Kanon src/modules/, dann byte-kopieren und die
sha-Pins nachziehen (Kimboard/Kimseek test/smoke.test.js,
Company-/Privat-Brain tools/drift-guard.mjs).

Ehrliche Grenze, die in die Oberfläche gehört: eine Räumung lässt sich vom
Browser aus NICHT verhindern, nur unwahrscheinlicher machen (installieren)
und der Verlust REPARIERBAR halten (Sicherung). So muss es dastehen.

Freibrief gilt (CLAUDE.md § Freibrief): selbst mergen, wenn getestet und
abgegrenzt. Jeden Test mit GEGENPROBE führen (Bug ohne Fix reproduzieren) —
das ist in dieser Sitzungsreihe der Standard geworden.
```

---

## Stand (was schon liegt)

- **0a gebaut + gemergt:** Panel zeigt „Meine Kennung" + „Speicher dauerhaft".
- **0c/0d/0e gebaut + gemergt.**
- **Fix 1 (netzweit):** Modul 01 heilt „connection is closing" selbst (Reopen-Retry).
- **Fix 2 (netzweit, 13 PRs):** Modul 01 löscht **nie im Zweifel** (Gegenprobe vor
  jedem Selbst-Heilungs-Löschen). **Das war die Ursache** des Über-Nacht-Verlusts.
- **Messung beantwortet:** Kennung überlebt die Nacht nicht; „ja" schützt nicht.

## Akzeptanzkriterien

| Teil | Nachweis |
|---|---|
| Sicherung | Ohne Sicherung erscheint der Hinweis, mit Sicherung nicht |
| Wiederherstellen | Gegenprobe: einspielen → **alte** Kennung ist zurück |
| Keine stumme Anlage | Leere Schublade → **Frage**, nicht wortlos neue Kennung |
| Aufräumen | Mehrfach-Fächer entfernbar, aktive Kennung bleibt |
| immer | Test **mit Gegenprobe** (ohne Fix muss er fallen) + Drift-Guards grün |
| immer | **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht |

## Nicht in diesen Auftrag

- Alte Kennungen jagen (Klaus: Testphase, nichts verloren).
- Der stumme Antworter (Antworter-Tab muss vorn/wach sein) — eigenes Thema.
- Stufe 3–6 des Schutz-Plans.

## Pflicht am Abschluss

1. `docs/PULS.md` fortschreiben. 2. Übergabeprotokoll in `docs/sessions/archiv/`.
3. Neuen Brief + **vollständig als Codeblock im Chat**. 4. „Nächste Schritte" im Chat.
5. `sbkim/SIGNAL.json` seq +1.
