# BRIEF — Stufe 0b: die Identität haltbar machen (NACH Klaus' Messung)

**Angelegt:** 2026-07-29 (Nacht) · **Vorgänger:** Stufe 0a/0c/0d/0e gebaut (dieser Branch)
**Status:** ⛔ **blockiert bis Klaus' Messergebnis** — 0a-Anzeige ist gebaut, jetzt misst Klaus.

---

## Start-Befehl für die neue Sitzung (kopieren)

```
Du bist eine Bau-Sitzung im SBKIM-Netz von Klaus.

Pflichtlektüre, in dieser Reihenfolge, VOR jeder Zeile Code:
1. Sage-Protokol/CLAUDE.md — § SITZUNGSSTART-PFLICHT und § Freibrief
2. Sage-Protokol/docs/PULS.md — oberster Eintrag "Stand 2026-07-29 (Nacht)"
3. Sage-Protokol/docs/sessions/BRIEF_STUFE0B_IDENTITAET_HALTBAR.md  ← dein Auftrag
4. Sage-Protokol/docs/sessions/archiv/2026-07-29_stufe-0a-identitaetskennungen.md

Zuerst Klaus fragen: WAS hat die Nacht-Messung ergeben? Blieb die Kennung
nach Hard-Reload gleich? Und am nächsten Tag noch? Stand "Speicher dauerhaft"
auf ja / nein / unbekannt? Ohne diese Antwort NICHT mit 0b beginnen —
das Ergebnis entscheidet, was 0b tun muss.

Deine Aufgabe (0b, drei Hebel in dieser Reihenfolge):
1. Installations-Hinweis genau dann, wenn "Speicher dauerhaft: nein" — KEIN
   Code am Speicher, nur Anleitung im Panel (App auf Startbildschirm legen).
2. Sicherung anbieten, wenn für diesen Knoten noch keine existiert
   (exportBackup ist gebaut, Modul 02) — Hinweis + ein Klick dorthin.
3. Wiederherstellen (importBackup) ins Netz-Panel holen, nicht nur tief
   im Andock-Wizard.

Wichtig: je Repo zuerst `git fetch origin main`, dann von origin/main
abzweigen. Modul 23 / 01_storage / 02_spore NICHT anfassen (Drift-Guard
byte-1:1). Die UI-Datei 23_rendezvous_ui.js ist byte-1:1 in ALLEN Apps —
Änderung ZUERST im Sage-Kanon src/modules/23_rendezvous_ui.js, dann
byte-kopieren nach sbkim-bundle/ + BookLedgerPro + Mein-Tresor +
Jasons-Tresor + family-project + Kimboard, und Kimboards sha256-Pin in
test/smoke.test.js nachziehen. Alles gehört in app-eigenen Klebstoff/UI.

Freibrief gilt (CLAUDE.md § Freibrief): selbst mergen, wenn getestet und
abgegrenzt. Grenze bleibt echtes Zweifeln → Klaus fragen.
```

---

## Stand (was schon liegt)

- **0a ist gebaut** (dieser Branch): das Netz-Panel zeigt „Meine Kennung: …" (aus
  `getOwnSpore()`) und „Speicher dauerhaft: ja/nein/unbekannt" (aus
  `SbkimStorage._meta.storagePersisted`). Bei „nein" steht schon ein Satz, dass Installieren
  hilft. `refreshStatus()` in `23_rendezvous_ui.js` ist die Stelle, an der 0b andockt.
- **0c/0d/0e sind gebaut** (BLP-dbSuffix geheilt, Tresore unterscheidbar, Register ehrlich).
- Offene reale Gegenproben, die auf **Klaus' Browser** warten:
  - 0a-Sichttest: Panel-Zeilen sichtbar, Persistenz-Verlauf über Nacht.
  - 0d-Gegenprobe: echter e5-Cosinus der beiden Tresor-Live-Sporen **deutlich unter 1,0**
    (vorher exakt 1,000000). Headless nicht messbar (kein e5-Modell im Container).

## Der Auftrag (0b) — nur NACH Klaus' Messung

Drei Hebel (Brief `BRIEF_STUFE0_IDENTITAET_HALTBAR.md` § Stufe 0b):

1. **Installieren** — der einzige Hebel, der Chrome auf Android zu `persist()===true` bewegt.
   **Kein Code am Speicher**, nur Anleitung + Hinweis im Panel genau dann, wenn nicht persistiert
   wird. (Die „nein"-Zeile aus 0a ist der natürliche Ort.)
2. **Sicherung anbieten**, wenn für den Knoten noch keine existiert. `exportBackup` (Modul 02,
   PBKDF2-SHA256 600k + AES-GCM-256) ist gebaut und im Andock-Wizard verdrahtet — es fehlt nur
   „für diesen Knoten gibt es noch keine Sicherung" + ein Klick dorthin.
3. **Wiederherstellen sichtbar machen** — `importBackup` existiert; der Weg gehört ins Netz-Panel.

**Ehrliche Grenze in die Oberfläche:** Aus dem Browser lässt sich eine Räumung nicht *verhindern*,
nur *unwahrscheinlicher* machen (Installation) und der Verlust *reparierbar* halten (Sicherung).
Das muss so dastehen — es ist die Eigenschaft des Speichers, keine Fehlfunktion.

## Akzeptanzkriterien

| Stufe | Nachweis |
|---|---|
| 0b | Ohne Sicherung erscheint der Hinweis, mit Sicherung nicht |
| 0b | Gegenprobe: Sicherung einspielen → **alte** Kennung ist zurück |
| immer | Smoke-Suiten der berührten Repos + Drift-Guards grün |
| immer | **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht |

## Nicht in diesen Auftrag

- Der stumme Antworter (12 Anfragen, 3 Antworten) — eigenes Thema.
- Modul 23 / 01 / 02 anfassen — alles ist app-eigener Klebstoff und Anzeige.
- Stufe 3–6 des Schutz-Plans — kommen nach Stufe 0.

## Pflicht am Abschluss

1. `docs/PULS.md` fortschreiben. 2. Übergabeprotokoll in `docs/sessions/archiv/`.
3. Neuen Brief für die Folge-Sitzung + **vollständig als Codeblock im Chat**.
4. „Nächste Schritte"-Block in der Chat-Antwort. 5. `sbkim/SIGNAL.json` seq +1 bei Andock-Bezug.
