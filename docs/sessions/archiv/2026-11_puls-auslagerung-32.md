# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-13

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` mit dem Eintrag „Hochformat-Namen brechen um, Licht-Film-Werkzeug bricht ab“ über der
3000-Zeilen-Grenze gestanden hätte (2991 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-13 · Firmennetz am Tablet bestätigt, Workflow-PDF-Kopfzeile bei 481–499 px behoben

**Brief:** [`docs/BRIEF_2026-10-14_firmennetz-sichttest-2.md`](BRIEF_2026-10-14_firmennetz-sichttest-2.md). Übergabe: [`sessions/archiv/2026-10-13_firmennetz-sichttest-2.md`](sessions/archiv/2026-10-13_firmennetz-sichttest-2.md).

**Klaus' Sichttest im Firmennetz:**
- Am Anfang sah jedes Gerät nur sich selbst.
- Gemessen mit einem Skript in Termux (Tablet), das das eigene Relais nach Karten der eigenen Netz-Marke fragt: erst 1 Absender, danach 2.
- Die Ursache war, dass das zweite Gerät nicht im selben eigenen Netz stand. Am Relais lag es nicht.
- Danach sehen sich Handy (family-projekt.de) und Tablet (Sende-Prüfer) gegenseitig im Raum, „verbunden“ (Bilder von Klaus).
- Der Netz-Code steht in keinem Depot, keinem Commit und keinem Dokument.

**Gebaut:** Workflow-PDF #107 (Cache v82).
- Die 480er-Verdichtung der Kopfzeile gilt jetzt bis 520 px. Auf `main` schnitt sie bei 481 und 490 px ab: Schriftzug 133 px, Platz 120 px.
- `tests/bibliothek.mjs` misst 13 Breiten, auch 470/481/490/500/520.
- Ein neuer Gegenprobe-Fall prüft das; dazu kam der Filter `NUR_FALL`.

**Gemessen:**
- `bibliothek`: auf `main` 87 grün · 3 ROT, danach 90 grün · 0 ROT.
- Nachbarproben unverändert grün: knoten 126 · schieber 30 · sprache 49 · zuschneiden 17.
- Gegenprobe (Wegwerf-Kopie): 2 gefangen · 0 blind · `NUR_ANKER` 26 · 0 tot.

⚠ **Kanon-Befund, nicht gebaut:** 05b und 23 werten nur `EVENT` aus, nicht die Antwort `["OK", id, false, grund]` des Relais.
- „✓ Du bist im Raum“ belegt deshalb nur einen offenen Socket. Ob das Relais die Karte angenommen hat, belegt es nicht.
- Das ist der nächste Brief: [`BRIEF_2026-10-15_relais-ok-antwort.md`](BRIEF_2026-10-15_relais-ok-antwort.md).

⚠ **Nicht gemessen:** die Kopfzeile am Tablet · Fragen eines Firmennetzes in der Mycel-Karte am echten Relais.

⚠ **Sages `npm test` in diesem Behälter (ohne `npm install`): 87 grün · 2 ROT · 25 nicht lauffähig. Beide roten sind auch auf `main` ohne diese Doku-Änderung rot.**
- `smoke_netz_ui` meldet „⊘ nicht lauffähig: playwright-core fehlt“, zählt im Läufer aber als ROT. Die Probe gibt kein `stumm` zurück.
- `smoke_laeufer_nachbar` (7 grün · 4 ROT) misst die Lage „Nachbar fehlt“. Hier liegen die Nachbar-Klone daneben.
- Eingereiht, nicht nebenbei repariert.
