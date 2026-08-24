/* historie-auslesen.mjs — liest die gesamte Git-Historie aller Depots aus.
 *
 * Aufruf:  node tools/historie-auslesen.mjs [wurzelverzeichnis]
 * Schreibt: docs/historie/historie.json
 *
 * ── WOZU ───────────────────────────────────────────────────────────────────
 *
 * Klaus am 2026-08-24: „Nimm bitte eine vollständige Dokumentation der
 * gesamten History vor. Auch der Repos, die wir zwischendurch bauen wollten,
 * wo mir Gedankensprünge gekommen sind. Auch da ist Zeit draufgegangen und ist
 * auch ein Lernprozess gewesen. Wir haben auch Repos gemacht, die sinnlos
 * waren. Gehört aber alles dazu."
 *
 * Der Beleg dafür, dass und wie über Monate zusammengearbeitet wurde, liegt
 * nicht in einem Text, den jemand darüber schreibt, sondern in den Zeitstempeln
 * selbst. Dieses Werkzeug holt sie heraus.
 *
 * ── WARUM DAS JETZT UND HIER PASSIERT ──────────────────────────────────────
 *
 * Die Klone in einem frischen Container sind FLACH: achtzehn der
 * dreiunddreißig trugen nur die letzten fünfzig Commits, mehrere zeigten
 * denselben Tag als ersten und letzten. Eine Aussage über „fünf Monate
 * Zusammenarbeit" auf so einem Klon wäre keine Messung, sondern eine
 * Behauptung mit Zahlen davor.
 *
 * Nachgeholt wurde mit `git fetch --unshallow`, und erst danach stimmen die
 * Zahlen: aus 4.750 wurden 5.823 Commits, aus 1.200 wurden 1.388 Zweige, und
 * der früheste Tag rutschte von einem willkürlichen Datum auf den 10.03.2026.
 *
 * **Der nächste Container fängt wieder flach an.** Deshalb wird das Ergebnis
 * als Datei abgelegt und nicht bei jedem Lauf neu geholt.
 *
 * ── NUR LESEN ──────────────────────────────────────────────────────────────
 *
 * Kein Commit, kein Zweig, kein Push, nichts wird angelegt. Klaus: „Kopieren,
 * nur klonen nichts, mach nichts zusätzlich dazu, nutze nur die Inhalte zur
 * Dokumentation."
 *
 * ── WAS EIN COMMIT HIER TRÄGT ──────────────────────────────────────────────
 *
 * Datum und Uhrzeit, Depot, Kennung, Betreff und Rumpf, geänderte Dateien,
 * hinzugefügte und entfernte Zeilen, und ob er auf `main` liegt oder nur in
 * einem Zweig. Der letzte Punkt ist der wichtigste für Klaus' Frage: ein Zweig,
 * dessen Arbeit nie in `main` ankam, ist eine **Sackgasse**, und Sackgassen
 * gehören in die Dokumentation, weil auch sie Zeit gekostet und etwas gelehrt
 * haben.
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const SAGE = resolve(HIER, '..');
const WURZEL = process.argv[2] ? resolve(process.argv[2]) : resolve(SAGE, '..');
const ZIEL_ORDNER = resolve(SAGE, 'docs/historie');
const ZIEL = join(ZIEL_ORDNER, 'historie.json');

/* Ein eigener Trenner, weil in Commit-Nachrichten alles vorkommt: Zeilen-
   umbrüche, Tabulatoren, Pipes, Anführungszeichen. Wer hier ein gewöhnliches
   Zeichen nimmt, zerlegt irgendwann eine Nachricht mitten im Satz. */
const F = '';   // zwischen den Feldern
const C = '';   // zwischen den Commits

function git(repo, args, still = false) {
  try {
    return execFileSync('git', ['-C', repo, ...args],
      { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 512,
        stdio: ['ignore', 'pipe', still ? 'ignore' : 'pipe'] });
  } catch (e) {
    if (!still) process.stderr.write('  (' + args[0] + ' fehlgeschlagen: '
      + String(e.message).split('\n')[0] + ')\n');
    return '';
  }
}

const repos = readdirSync(WURZEL)
  .filter((n) => {
    const p = join(WURZEL, n);
    try { return statSync(p).isDirectory() && existsSync(join(p, '.git')); }
    catch { return false; }
  })
  .sort();

console.log('Depots gefunden: ' + repos.length + ' unter ' + WURZEL);

const alleCommits = [];
let fussWeg = 0;
const repoInfo = [];

for (const name of repos) {
  const pfad = join(WURZEL, name);
  const flach = existsSync(join(pfad, '.git', 'shallow'));

  /* Der Vorgabe-Zweig heisst fast immer main, aber nicht ueberall. Gefragt
     wird, statt geraten. */
  let haupt = git(pfad, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], true)
    .trim().replace(/^origin\//, '');
  if (!haupt) haupt = git(pfad, ['rev-parse', '--verify', '--quiet', 'origin/main'], true).trim()
    ? 'main' : (git(pfad, ['rev-parse', '--verify', '--quiet', 'origin/master'], true).trim()
      ? 'master' : '');

  const zweige = git(pfad, ['for-each-ref', '--format=%(refname:short)%09%(committerdate:iso-strict)',
    'refs/remotes/origin'])
    .split('\n').filter(Boolean)
    .map((z) => {
      const [ref, datum] = z.split('\t');
      return { ref: ref.replace(/^origin\//, ''), letzteAenderung: (datum || '').slice(0, 10) };
    })
    .filter((z) => z.ref !== 'HEAD');

  /* Welche Commits liegen NUR in einem Zweig und nie auf main?
     Das ist die Frage nach den Sackgassen. */
  const nurImZweig = new Map();   // sha -> [zweig, …]
  if (haupt) {
    for (const z of zweige) {
      if (z.ref === haupt) continue;
      const eigen = git(pfad, ['rev-list', 'origin/' + haupt + '..origin/' + z.ref], true)
        .split('\n').filter(Boolean);
      z.eigeneCommits = eigen.length;
      for (const sha of eigen) {
        if (!nurImZweig.has(sha)) nurImZweig.set(sha, []);
        nurImZweig.get(sha).push(z.ref);
      }
    }
  }

  const aufMain = new Set(haupt
    ? git(pfad, ['rev-list', 'origin/' + haupt], true).split('\n').filter(Boolean)
    : []);

  /* DER TRENNER STEHT AM ANFANG, nicht am Ende. `--shortstat` haengt seine
     Zeile HINTER die formatierte Ausgabe eines Commits. Mit dem Trenner am
     Ende landete sie deshalb am Kopf des NAECHSTEN Stuecks und wurde dort als
     Kennung gelesen: jeder Commit ausser dem letzten je Depot trug „2 files c"
     statt seiner Pruefsumme. Gefunden beim Nachsehen in der fertigen Datei,
     nicht beim Schreiben.
     Merges bleiben drin und werden markiert. Sie sind die Spur der
     Pull-Requests und gehoeren zur Dokumentation. */
  const roh = git(pfad, ['log', '--all', '--date=iso-strict',
    '--pretty=format:' + C + '%H' + F + '%ad' + F + '%an' + F + '%P' + F + '%s' + F + '%b',
    '--shortstat']);

  let anzahl = 0;
  for (const stueck of roh.split(C)) {
    if (!stueck.trim()) continue;
    const felder = stueck.split(F);
    if (felder.length < 5) continue;
    const [sha, datum, autor, eltern, betreff] = felder;
    /* Der Rumpf ist das letzte Feld, und die Statistik haengt an SEINEM Ende. */
    const restlich = felder.slice(5).join(F);
    const stat = restlich.match(/\n\s*\d+ files? changed[^\n]*/);
    const statZeile = stat ? stat[0] : '';
    /* Der Fuss jeder von mir geschriebenen Nachricht ist immer derselbe
       (Co-Authored-By, Sitzungs-Adresse, der Generated-Hinweis). Er traegt
       nichts zur Sache bei und blaeht die Datei auf. Er faellt hier weg,
       NICHT aus der Historie: dort steht er weiter. Was wegfaellt, wird
       gezaehlt, damit die Kuerzung nicht stillschweigend geschieht. */
    let koerper = (stat ? restlich.slice(0, stat.index) : restlich).trim();
    const vorFuss = koerper.length;
    koerper = koerper
      .replace(/\n*(Co-Authored-By:[^\n]*\n?)+/gi, '\n')
      .replace(/\n*Claude-Session:[^\n]*/gi, '')
      .replace(/\n*🤖 Generated with[^\n]*/gi, '')
      .replace(/\n*Generated with \[Claude Code\][^\n]*/gi, '')
      .replace(/\n*_Generated by \[Claude Code\][^\n]*/gi, '')
      .trim();
    fussWeg += vorFuss - koerper.length;

    const dateien = +(statZeile.match(/(\d+) files? changed/) || [0, 0])[1];
    const plus = +(statZeile.match(/(\d+) insertions?/) || [0, 0])[1];
    const minus = +(statZeile.match(/(\d+) deletions?/) || [0, 0])[1];

    alleCommits.push({
      repo: name,
      sha: sha.slice(0, 9),
      datum: datum.slice(0, 10),
      zeit: datum.slice(11, 16),
      zone: datum.slice(19),
      autor,
      betreff,
      koerper,
      dateien, plus, minus,
      istMerge: eltern.trim().split(/\s+/).length > 1,
      aufMain: aufMain.has(sha),
      zweige: nurImZweig.get(sha) || [],
    });
    anzahl++;
  }

  const tage = [...new Set(alleCommits.filter((c) => c.repo === name).map((c) => c.datum))].sort();
  repoInfo.push({
    name,
    hauptzweig: haupt || '(keiner)',
    warFlach: flach,
    commits: anzahl,
    zweige: zweige.length,
    arbeitstage: tage.length,
    erst: tage[0] || '',
    letzt: tage[tage.length - 1] || '',
    zweigListe: zweige,
  });
  console.log('  ' + name.padEnd(26) + String(anzahl).padStart(5) + ' Commits, '
    + String(zweige.length).padStart(4) + ' Zweige, '
    + String(tage.length).padStart(3) + ' Arbeitstage');
}

alleCommits.sort((a, b) => (a.datum + a.zeit).localeCompare(b.datum + b.zeit) || a.repo.localeCompare(b.repo));

const tage = [...new Set(alleCommits.map((c) => c.datum))].sort();

const ergebnis = {
  erzeugt: new Date().toISOString().slice(0, 10),
  werkzeug: 'tools/historie-auslesen.mjs',
  hinweis: 'Nur gelesen. Kein Commit, kein Zweig, kein Push. Die Klone wurden '
    + 'vorher mit `git fetch --unshallow` vervollstaendigt; ohne das traegt ein '
    + 'frischer Container nur die letzten fuenfzig Commits je Depot.',
  summe: {
    depots: repoInfo.length,
    commits: alleCommits.length,
    zweige: repoInfo.reduce((n, r) => n + r.zweige, 0),
    arbeitstage: tage.length,
    erster: tage[0],
    letzter: tage[tage.length - 1],
    zeilenPlus: alleCommits.reduce((n, c) => n + c.plus, 0),
    zeilenMinus: alleCommits.reduce((n, c) => n + c.minus, 0),
    merges: alleCommits.filter((c) => c.istMerge).length,
    nurImZweig: alleCommits.filter((c) => !c.aufMain).length,
    fussZeichenEntfernt: fussWeg,
  },
  depots: repoInfo,
  commits: alleCommits,
};

mkdirSync(ZIEL_ORDNER, { recursive: true });
writeFileSync(ZIEL, JSON.stringify(ergebnis), 'utf-8');

const s = ergebnis.summe;
console.log('\ngeschrieben: docs/historie/historie.json ('
  + Math.round(statSync(ZIEL).size / 1024) + ' KB)');
console.log('  ' + s.depots + ' Depots, ' + s.commits + ' Commits, '
  + s.zweige + ' Zweige');
console.log('  ' + s.arbeitstage + ' Tage mit Arbeit, ' + s.erster + ' bis ' + s.letzter);
console.log('  ' + s.zeilenPlus.toLocaleString('de-DE') + ' Zeilen dazu, '
  + s.zeilenMinus.toLocaleString('de-DE') + ' entfernt');
