/* historie-marken.mjs — woran ein Commit erkannt wird.
 *
 * EINE Quelle fuer die Einordnung. Der Bericht
 * (`tools/historie-bericht-bauen.mjs`) und die Probe
 * (`tests/smoke_historie.mjs`) holen sie sich beide hier.
 *
 * Zwei Fassungen derselben Regel waeren eine Drift-Quelle mit Ansage: die
 * Probe wuerde irgendwann etwas anderes zaehlen als der Bericht zeigt, und
 * beide waeren gruen. Genau diese Bauart steht netzweit schon einmal
 * aufgeschrieben (PWA-Toolpoint, „eine Quelle fuer das Karten-Markup").
 *
 * JEDE MARKE TRAEGT IHRE WOERTER MIT. Sie stehen im Bericht selbst, damit ein
 * Leser die Einordnung nachpruefen und ihr widersprechen kann. Eine
 * Einordnung, deren Massstab man nicht sieht, ist eine Behauptung.
 */

export const MARKEN = [
  {
    id: 'fehler',
    name: 'Fehler gefunden und behoben',
    farbe: '#c0392b',
    was: 'Ein Fehler wird benannt und behoben. Das ist die häufigste Sorte '
      + 'Arbeit in diesem Netz und der Grund für fast jede Regel.',
    woerter: /\b(fehler|falsch|irrtum|kaputt|bricht|brach|defekt|bug|stolper|zerlegt|verdorben|verschluckt|verloren)\b/i,
  },
  {
    id: 'selbstkorrektur',
    name: 'Eigener Fehler, selbst zurückgenommen',
    farbe: '#8e44ad',
    was: 'Die Sitzung stellt eine eigene frühere Aussage oder Änderung richtig. '
      + 'Das ist der Kern dessen, was Klaus mit „voneinander gelernt" meint: '
      + 'nicht dass keine Fehler passierten, sondern dass sie benannt wurden.',
    woerter: /(zur[üu]ckgenommen|richtiggestellt|richtig gestellt|korrigiert|mein(en)? (eigener|eigenen) fehler|eigener fehler|eigene fehler|ich hatte|hier stand|stand hier falsch|war falsch|nachtrag|dabei irrte|geirrt)/i,
  },
  {
    id: 'waechter',
    name: 'Wächter: Probe oder Gegenprobe',
    farbe: '#1f7a4d',
    was: 'Eine Prüfung wird gebaut, repariert oder erweitert. Die Gegenprobe '
      + 'ist die Prüfung der Prüfung: sie baut absichtlich Fehler ein und '
      + 'besteht darauf, dass die Probe umfällt.',
    woerter: /\b(probe|proben|gegenprobe|w[äa]chter|smoke|test|tests|pr[üu]fung|pr[üu]fungen|blind)\b/i,
  },
  {
    id: 'regel',
    name: 'Regel oder Grundsatz',
    farbe: '#b8860b',
    was: 'Eine Regel, ein Grundsatz oder eine Tafel wird geschrieben, geändert '
      + 'oder ausdrücklich angewandt. Das ist die Spur, an der sich Paper A '
      + 'entlangschreibt.',
    woerter: /\b(regel|regeln|grundsatz|grunds[äa]tze|tafel|verfassung|CLAUDE\.md|NETZWEIT|LEHREN|freibrief|klausel)\b/,
  },
  {
    id: 'messung',
    name: 'Gemessen statt behauptet',
    farbe: '#1d6fa5',
    was: 'Eine Zahl wird gemessen, nachgezählt oder belegt. Der Gegensatz dazu '
      + 'ist die geratene Zahl, die genauso aussieht wie eine gemessene.',
    woerter: /\b(gemessen|messung|nachgez[äa]hlt|nachgesehen|belegt|beleg|gez[äa]hlt|nachgerechnet|nachgemessen)\b/i,
  },
  {
    id: 'klaus',
    name: 'Auf Klaus’ Wort',
    farbe: '#7a5230',
    was: 'Der Commit nennt Klaus ausdrücklich: eine Entscheidung, ein Befund '
      + 'von seinem Gerät, ein Widerspruch. Das ist die Spur seiner Seite der '
      + 'Zusammenarbeit.',
    woerter: /\bklaus\b/i,
  },
  {
    id: 'sicherheit',
    name: 'Schutz, Schlüssel, Sichtbarkeit',
    farbe: '#a5341d',
    was: 'Etwas lag offen oder hätte offenliegen können. Diese Commits sind '
      + 'die teuersten Lehren des Netzes.',
    woerter: /\b(schl[üu]ssel|geheim|privat|[öo]ffentlich|verschl[üu]ssel|sperr|offen ?gelegen|pii|token|passwort|sicherheit)\b/i,
  },
];

export function markenFuer(c) {
  const t = c.betreff + '\n' + c.koerper;
  const raus = [];
  for (const m of MARKEN) if (m.woerter.test(t)) raus.push(m.id);
  return raus;
}
