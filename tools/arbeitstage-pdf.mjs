/* arbeitstage-pdf.mjs — druckt die tägliche Dokumentation in ein PDF.
 *
 * Aufruf:   node tools/arbeitstage-pdf.mjs
 * Schreibt: docs/historie/arbeitstage.pdf
 *
 * ── NUR NOCH EIN AUFRUF ───────────────────────────────────────────────────
 *
 * Die eigentliche Arbeit macht `tools/html-zu-pdf.mjs`. Bis zum 2026-08-26
 * stand sie hier ein zweites Mal, weil es damals nur ein Blatt zu drucken gab.
 * Mit dem zweiten wären zwei Fassungen desselben Drucks entstanden, und die
 * eine hätte irgendwann Seitenzahlen gehabt und die andere nicht.
 *
 * Diese Datei bleibt, weil PULS und Übergabeprotokoll sie beim Namen nennen.
 * Ein Zeiger, der ins Leere geht, kostet die nächste Sitzung eine Suche.
 */

import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
execFileSync(process.execPath, [
  resolve(HIER, 'html-zu-pdf.mjs'),
  'docs/historie/arbeitstage.html',
  '--warte', 'tfoot [data-summe="spanne"]',
], { cwd: resolve(HIER, '..'), stdio: 'inherit' });
