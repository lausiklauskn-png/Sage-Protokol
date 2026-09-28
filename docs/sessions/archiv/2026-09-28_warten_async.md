# Übergabe 2026-09-28 · Warten mit Promise-Bedingung

**Anlass:** Brief aus Kimhub (#289, der `smoke_ansicht`-Flatterer).

**Befund:** Playwrights `waitForFunction` wartet ein Promise nicht ab.
Gemessen mit playwright-core 1.62.1: `async () => false` → 100 ms,
`() => Promise.resolve(false)` → 6 ms, `() => false` → Frist.

**Getan:**
- `tests/vorrat_wirkung.mjs`: sechs Wartepunkte (4× `async`, 2× `.then`) auf
  `warteBis()` umgestellt.
- `tests/smoke_warten_async.mjs`: Familien-Probe über `tests/`, `tools/`,
  `pinnwand/` — erstes Argument mit `async`, `.then(`, `Promise`, `await`.
- `tests/gegenprobe_warten_async.mjs`: 7 Fälle, Wegwerf-Kopie.
- Kimhub `tests/smoke_warten_async.mjs` auf dieselbe Erkennung gezogen
  (erkannte vorher nur `async`), zwei Gegenprobe-Fälle `WARTEN:`.

**Gemessen:** alt 3/3 + 4/4 unter Last grün (Wartepunkte überflüssig: Vorrat
lag beim Steuern schon vor); neu 3/3 grün; `run_alle.mjs` 109/0/0.

**Nicht gemessen:** ob eine App existiert, die ihren Vorrat erst nach dem
Aktivieren anlegt — dort hätten die alten Wartepunkte geschadet.

**Offen:** `PFLEGE-LISTE.md` § 11 (die Probe steht in keinem Läufer).
