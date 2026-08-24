/* arbeitstage-rechnen.mjs — die EINE Quelle für die Arbeitszeit-Rechnung.
 *
 * Benutzt von `tools/arbeitstage-bauen.mjs` (das Blatt),
 * `tools/historie-bericht-bauen.mjs` (der Abschnitt darin)
 * und `tests/smoke_arbeitstage.mjs` (die Probe).
 *
 * ── WARUM SIE HIER STEHT UND NICHT DREIMAL ────────────────────────────────
 *
 * Dieselbe Lehre wie bei `historie-marken.mjs`: eine zweite Fassung der
 * Rechnung würde irgendwann etwas anderes zählen als das Blatt zeigt, und
 * **beide wären grün**. Eine Probe, die ihre eigene Rechnung mitbringt, prüft
 * ihre Rechnung, nicht die des Werkzeugs.
 *
 * ── DIE DREI REGELN ───────────────────────────────────────────────────────
 *
 * LUECKE_MIN   Abstände bis hierher zählen als Arbeit, längere als Pause.
 * VORLAUF_MIN  Zuschlag je Abschnitt, weil vor dem ersten gespeicherten Stand
 *              bereits gearbeitet wurde.
 * istAutomatik Zeitgesteuerte Läufe sind keine Arbeitszeit.
 *
 * Wer eine dieser Zahlen ändert, ändert sie hier. Das Blatt nennt sie DARAUS,
 * schreibt sie also nicht daneben, und kann deshalb nicht danebenliegen.
 */

export const LUECKE_MIN = 120;
export const VORLAUF_MIN = 30;

/* Der Dienst committet unter `github-actions[bot]`. Geprüft wird die
   Autoren-Kennung und NICHT der Betreff: ein Mensch darf einen Commit
   „Tägliche Aktualisierung" nennen, und dann ist es Arbeitszeit. */
export const istAutomatik = (c) => /\[bot\]/i.test(c.autor || '');

const minuten = (z) => { const [h, m] = z.split(':').map(Number); return h * 60 + m; };

/** Rechnet aus einer Commit-Liste die Tage samt Zeiten.
 *  Gibt { tage, summe } zurück; `tage` ist nach Datum sortiert.
 *
 *  `automatikZaehlt: true` lässt die zeitgesteuerten Läufe mitzählen. Das ist
 *  NICHT der Normalfall, sondern dient genau einem Zweck: das Blatt soll
 *  beziffern können, wie viel es ohne die Bereinigung zu viel auswiese. Eine
 *  fest hingeschriebene Zahl an dieser Stelle würde stumm veralten, sobald ein
 *  weiterer Lauf dazukommt. */
export function rechneTage(commits, { automatikZaehlt = false } = {}) {
  const proTag = new Map();
  for (const c of commits) {
    if (!proTag.has(c.datum)) proTag.set(c.datum, []);
    proTag.get(c.datum).push(c);
  }

  const tage = [...proTag.keys()].sort().map((datum) => {
    const alle = proTag.get(datum).slice()
      .sort((a, b) => a.zeit.localeCompare(b.zeit) || a.repo.localeCompare(b.repo));
    const liste = automatikZaehlt ? alle : alle.filter((c) => !istAutomatik(c));
    const automatik = alle.length - liste.length;

    /* Ein Tag ohne einen einzigen Eintrag von Hand hat keine Arbeitszeit. */
    if (liste.length === 0) {
      return {
        datum, erster: '', letzter: '', spanne: 0, aktiv: 0, abschnitte: 0,
        eintraege: 0, automatik, depots: 0, alle, liste, ohneArbeit: true,
      };
    }

    const z = liste.map((c) => minuten(c.zeit));
    const spanne = (z[z.length - 1] - z[0]) / 60;

    let aktivMin = VORLAUF_MIN;
    let abschnitte = 1;
    for (let i = 1; i < z.length; i++) {
      const l = z[i] - z[i - 1];
      if (l <= LUECKE_MIN) aktivMin += l;
      else { aktivMin += VORLAUF_MIN; abschnitte++; }
    }

    return {
      datum, erster: liste[0].zeit, letzter: liste[liste.length - 1].zeit,
      spanne, aktiv: aktivMin / 60, abschnitte,
      eintraege: liste.length, automatik,
      depots: new Set(liste.map((c) => c.repo)).size,
      alle, liste, ohneArbeit: false,
    };
  });

  const auf = (f) => tage.reduce((n, t) => n + f(t), 0);
  return {
    tage,
    summe: {
      arbeitstage: tage.filter((t) => !t.ohneArbeit).length,
      spanne: auf((t) => t.spanne),
      aktiv: auf((t) => t.aktiv),
      eintraege: auf((t) => t.eintraege),
      automatik: auf((t) => t.automatik),
    },
  };
}
