/* gegenprobe_netz_ui.mjs — jeder Riegel der Einstellung „Netz" muss seine rote Zeile werfen.
 *
 * Lauf:  node tests/gegenprobe_netz_ui.mjs          (NUR_ANKER=1: nur die Anker, in Sekunden)
 * Arbeitet in einer Wegwerf-Kopie (src/ und tests/ kopiert, node_modules verwiesen),
 * nie im echten Baum. Gezählt wird nicht nur „rot", sondern ob die ERSTE rote Zeile
 * den erwarteten Namen trägt — sonst ist ein Fall „aus falschem Grund".
 */
import { mkdtempSync, cpSync, symlinkSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI = 'src/modules/23_rendezvous_ui.js';

const FAELLE = [
  { name: 'NETZ: eine kaputte Einstellung fällt still ins öffentliche Netz',
    an: '      weiter = r.applyNetwork(st.value || {}).then(function () { return null; });',
    zu: '      weiter = r.applyNetwork(null).then(function () { return null; });',
    rot: /NICHT auf öffentlich zurückgesetzt|„ungueltig"|ungültig — es wird nicht verbunden/ },
  { name: 'NETZ: im eigenen Netz wird beim Öffnen nicht verbunden',
    an: '        if (res.ok && st.setting.auto) onConnect({ auto: true });',
    zu: '        if (false) onConnect({ auto: true });',
    rot: /verbindet die App beim Öffnen von selbst/ },
  { name: 'NETZ: ein Link wird still übernommen statt gefragt',
    an: '    if (netBoxEl) netBoxEl.open = true;\n    show();',
    zu: '    if (netBoxEl) netBoxEl.open = true;\n    netzUebernehmen(setting);\n    show();',
    rot: /vor der Antwort wird nichts übernommen/ },
  { name: 'NETZ: die Adresse wird nicht geputzt',
    an: '    try { if (String(global.location.hash || "").indexOf(NETZ_LINK_MARKE) === 0) netzAdressePutzen(); } catch (_e) {}',
    zu: '',
    rot: /Adresse ist geputzt/ },
  { name: 'NETZ: „Zurück" löscht die Einstellung nicht',
    an: '    r.clearNetwork();\n    netGrund = null;',
    zu: '    netGrund = null;',
    rot: /löscht die Einstellung/ },
  { name: 'NETZ: der Knopf trägt die Lage nicht',
    an: '    if (btnEl) btnEl.setAttribute("data-sbkim-netz", z.lage);',
    zu: '',
    rot: /Knopf trägt data-sbkim-netz/ },
  { name: 'NETZ: der Link trägt den Code im Klartext',
    an: '    return basis + NETZ_LINK_MARKE + netzB64(JSON.stringify({ v: 1, n: setting.name, r: setting.relay, c: setting.code }));',
    zu: '    return basis + NETZ_LINK_MARKE + netzB64(JSON.stringify({ v: 1, n: setting.name, r: setting.relay, c: setting.code })) + "&c=" + setting.code;',
    rot: /nicht im Klartext im Link/ },
  { name: 'NETZ: ein Link einer anderen Fassung wird geraten',
    an: '      if (!o || o.v !== 1) return null;',
    zu: '      if (!o) return null;',
    rot: /anderen Fassung/ },
  { name: 'NETZ: der Beitritt fragt nur, ohne das Netz zu nennen',
    an: '    netJoinEl.appendChild(el("div", "color:#c7d2de", String(setting.name || "") + " · " + String(setting.relay || "")));',
    zu: '',
    rot: /nennt das Netz/ },
];

const nurAnker = !!process.env.NUR_ANKER;
const quelle = readFileSync(join(WURZEL, UI), 'utf8');
let tot = 0;
for (const f of FAELLE) {
  const n = quelle.split(f.an).length - 1;
  if (n !== 1) { tot++; console.log(`  ✗ TOTER ANKER (${n}×): ${f.name}`); }
}
if (nurAnker) { console.log(`${FAELLE.length} Anker · ${tot} tot`); process.exit(tot ? 1 : 0); }

let gefangen = 0, blind = 0, falsch = 0, uebersprungen = 0;
for (const f of FAELLE) {
  if (f.rot === null) { uebersprungen++; console.log(`  ⊘ benannte Grenze, nicht gefahren: ${f.name}`); continue; }
  if (quelle.split(f.an).length - 1 !== 1) continue;
  const kopie = mkdtempSync(join(tmpdir(), 'gp-netz-'));
  try {
    cpSync(join(WURZEL, 'src'), join(kopie, 'src'), { recursive: true });
    cpSync(join(WURZEL, 'tests'), join(kopie, 'tests'), { recursive: true });
    symlinkSync(join(WURZEL, 'node_modules'), join(kopie, 'node_modules'));
    writeFileSync(join(kopie, 'package.json'), readFileSync(join(WURZEL, 'package.json')));
    writeFileSync(join(kopie, UI), quelle.replace(f.an, f.zu));
    const r = spawnSync('node', ['tests/smoke_netz_ui.mjs'], { cwd: kopie, encoding: 'utf8', timeout: 240000 });
    const aus = (r.stdout || '') + (r.stderr || '');
    const ersteRot = (aus.split('\n').find((z) => /✗ ROT/.test(z)) || '').trim();
    if (r.status === 0) { blind++; console.log(`  ✗ BLIND: ${f.name}`); }
    else if (f.rot.test(ersteRot)) { gefangen++; console.log(`  ✓ gefangen: ${f.name}\n        → ${ersteRot}`); }
    else { falsch++; console.log(`  ✗ AUS FALSCHEM GRUND: ${f.name}\n        → ${ersteRot || aus.slice(-300)}`); }
  } finally { rmSync(kopie, { recursive: true, force: true }); }
}
console.log(`\n${gefangen} gefangen · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker · ${uebersprungen} benannte Grenze`);
process.exit(blind || falsch || tot ? 1 : 0);
