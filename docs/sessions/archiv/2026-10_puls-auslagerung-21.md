# PULS-Auslagerung 2026-10-15 — „Sechs Wartepunkte, die nie gewartet haben (`vorrat_wirkung.mjs`)“

**Ausgelagert am 2026-10-15**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3005 Zeilen nach dem Eintrag „S5 Bürgen, Teil 1“). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-09-28 · Sechs Wartepunkte, die nie gewartet haben (`vorrat_wirkung.mjs`)

**Rolle:** Pflege-Sitzung (Brief aus Kimhub, Stand `7aa6af6`).

**Getan.** `waitForFunction` wertet das Ergebnis der Bedingung aus, und ein
Promise ist immer wahr (gemessen: `async () => false` 100 ms,
`() => Promise.resolve(false)` 6 ms). In `tests/vorrat_wirkung.mjs` standen
**sechs** solche Stellen — vier `async`, zwei `.then` (der Brief nannte vier).
Ersetzt durch `warteBis()` (fragt per `evaluate` in Abständen). Neue
Familien-Probe `tests/smoke_warten_async.mjs` (12 Zusicherungen) + Gegenprobe
`tests/gegenprobe_warten_async.mjs` (**7 gefangen · 0 durchgerutscht · 0 aus
falschem Grund · 0 tote Anker**). `LEHREN.md` § 6: fünfte Art.

**Gemessen:** die alte Probe war 3/3 grün und unter Last 4/4 — der Vorrat
stand jedes Mal schon da, wenn der Worker steuerte (55–88 ms). Die Wartepunkte
waren blind **und** überflüssig. Neue Fassung 3/3 grün. `run_alle.mjs`:
**109 grün · 0 rot · 0 nicht lauffähig.** Netzweit auf `origin/main` von 17
Depots gesucht: diese sechs waren die einzigen.

**Offen:** `vorrat_wirkung.mjs` steht in keinem Läufer (`PFLEGE-LISTE.md` § 11).
`laufReparaturB` wartet weiter fest 1500 ms (Sorte B, gewollt — nicht angefasst).
