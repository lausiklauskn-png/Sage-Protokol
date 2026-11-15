#!/usr/bin/env node
/* smoke_licht_film_schwelle.mjs — `tools/licht-film-bauen.py` schreibt keinen Film, wenn der
 * Clip das Bild nicht zeigt.
 *
 * Anlass (Pflege-Liste 2026-11-15): der Mycel-Clip der Einladung zeigt ein anderes Motiv als das
 * Standbild. Das Werkzeug gab Restfehler 17,2 und 14 % Deckung aus und schrieb trotzdem.
 *
 *   node tests/smoke_licht_film_schwelle.mjs
 *   LICHT_WERKZEUG=/pfad/licht-film-bauen.py node tests/…     # prüft eine andere Fassung (Gegenprobe)
 *
 * Das Material wird hier erzeugt (zwei Zufallsbilder, je ein Clip daraus), klein gehalten, damit
 * die Suche Sekunden dauert. Braucht python3 mit numpy und Pillow sowie ffmpeg. Fehlt etwas davon:
 * nicht lauffähig, nicht rot.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WERKZEUG = process.env.LICHT_WERKZEUG
  || resolve(dirname(fileURLToPath(import.meta.url)), '..', 'tools', 'licht-film-bauen.py');
let gruen = 0, rot = 0;
const t = (name, ok, detail = '') => {
  if (ok) { gruen++; console.log('  ✓ ' + name); }
  else { rot++; console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
};

const da = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8' }); return !r.error && r.status === 0; };
if (!da('python3', ['-c', 'import numpy, PIL']) || !da('ffmpeg', ['-version']) || !da('ffprobe', ['-version'])) {
  console.log('⊘ nicht lauffähig: python3 mit numpy und Pillow oder ffmpeg fehlt');
  process.exit(0);
}

const ort = mkdtempSync(join(tmpdir(), 'licht-'));
try {
  // two unrelated pictures with strong, smooth structure
  const bilder = spawnSync('python3', ['-c', `
import sys, numpy as np
from PIL import Image
for i, name in enumerate(sys.argv[2:]):
    r = np.random.default_rng(7 + i)
    klein = Image.fromarray(r.integers(0, 256, (9, 16, 3), dtype=np.uint8))
    klein.resize((480, 270), Image.BICUBIC).save(sys.argv[1] + '/' + name)
`, ort, 'a.png', 'b.png'], { encoding: 'utf8' });
  t('Material: zwei Bilder erzeugt', bilder.status === 0, bilder.stderr);
  // a clip that shows the middle 80 % of its picture, a little softer and brighter
  for (const n of ['a', 'b']) {
    const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-loop', '1', '-i', join(ort, n + '.png'),
      '-vf', 'crop=iw*0.8:ih*0.8,scale=240:136,gblur=sigma=1,eq=brightness=0.04',
      '-t', '0.25', '-r', '24', '-pix_fmt', 'yuv420p', join(ort, n + '.mp4')], { encoding: 'utf8' });
    t(`Material: Clip aus Bild ${n} erzeugt`, r.status === 0, r.stderr);
  }
  const lauf = (bild, clip, ziel, mehr = []) => spawnSync('python3',
    [WERKZEUG, join(ort, bild), join(ort, clip), join(ort, ziel), '--rahmen', '16:9', '--breite', '160', ...mehr],
    { encoding: 'utf8' });
  const geschrieben = (ziel) => existsSync(join(ort, ziel)) && statSync(join(ort, ziel)).size > 0;

  const passt = lauf('a.png', 'a.mp4', 'passt.mp4');
  t('passender Clip: Rückgabewert 0', passt.status === 0, `Rückgabewert ${passt.status} · ${passt.stdout} ${passt.stderr}`);
  t('passender Clip: der Film ist geschrieben', geschrieben('passt.mp4'));

  const fremd = lauf('a.png', 'b.mp4', 'fremd.mp4');
  t('fremder Clip: Rückgabewert 2', fremd.status === 2, `Rückgabewert ${fremd.status} · ${fremd.stdout}`);
  t('fremder Clip: kein Film geschrieben', !geschrieben('fremd.mp4'));
  t('fremder Clip: die Meldung nennt den Grund', /Ausrichten gescheitert/.test(fremd.stderr), fremd.stderr);

  const dennoch = lauf('a.png', 'b.mp4', 'dennoch.mp4', ['--trotzdem']);
  t('fremder Clip mit --trotzdem: Rückgabewert 0 und Film geschrieben', dennoch.status === 0 && geschrieben('dennoch.mp4'),
    `Rückgabewert ${dennoch.status}`);
  t('fremder Clip mit --trotzdem: die Meldung steht trotzdem da', /Ausrichten gescheitert/.test(dennoch.stderr));
  console.log('    ' + passt.stdout.trim().split('\n').join(' · '));
  console.log('    ' + fremd.stdout.trim().split('\n').join(' · '));
} finally {
  rmSync(ort, { recursive: true, force: true });
}

console.log(`\n  ${gruen} grün · ${rot} rot`);
process.exit(rot ? 1 : 0);
