// Gegenprobe sicherheit.html (2026-10-16) — jeder Riegel wird in einer WEGWERF-KOPIE
// der Seite einzeln gebrochen; tests/smoke_sicherheit_seite.mjs muss dann rot werden,
// und eine rote Zeile muss den Namen der Zusicherung tragen. Der echte Baum wird nie
// angefasst (LEHREN § 10).
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft.
// NUR_FALL="…" → nur Fälle, deren Name das enthält.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const QUELLE = readFileSync(join(root, "sicherheit.html"), "utf8");
const FAELLE = [
  { name: "noindex fehlt", alt: '<meta name="robots" content="noindex">\n', neu: "", rot: "A1" },
  { name: "ein Skript kommt von außen", alt: "<title>So funktioniert das Mycel</title>",
    neu: '<title>So funktioniert das Mycel</title><script src="https://cdn.example/x.js"></script>', rot: "A2" },
  { name: "ein App-Name steht in der Vorlage", alt: "Rezepte auf dem Tablet, Getränke auf dem Handy.",
    neu: "Mein Mixarium auf dem Tablet, Getränke auf dem Handy.", rot: "A3" },
  { name: "toter Sprung im deutschen Teil", alt: '<a class="w" href="#w-relais">Relais</a>.</li>',
    neu: '<a class="w" href="#w-relays">Relais</a>.</li>', rot: "A4b" },
  { name: "englischer Sprung landet im deutschen Teil", alt: '<a class="w" href="#en-w-relais">relay</a>',
    neu: '<a class="w" href="#w-relais">relay</a>', rot: "A4c" },
  { name: "englischer Abschnitt „Warum“ fehlt", alt: '<h2 id="en-warum">', neu: "<h2>", rot: "A5a" },
  { name: "Abschnitt „Warum es Schutz braucht“ fehlt", alt: '<h2 id="warum">', neu: "<h2>", rot: "A6a" },
  { name: "Schicht S4 fehlt", alt: '<tr id="s4">', neu: "<tr>", rot: "A6a" },
  { name: "der Name aus der Oberfläche ist umformuliert",
    alt: "<tr><td>· Bedeutung aus Inhalten, nicht nachprüfbar</td>", neu: "<tr><td>· Bedeutung stammt aus Inhalten</td>", rot: "A6b" },
  { name: "Verweis auf Paper S fehlt im deutschen Teil",
    alt: '<a href="https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/papers/sicherer-umgang-im-knotennetz.md" target="_blank" rel="noopener noreferrer">lesen ↗</a>',
    neu: "lesen", rot: "A7a" },
  { name: "ein Gedankenstrich als Trenner", alt: "Fällt eines aus, tragen die\n      anderen.",
    neu: "Fällt eines aus — dann tragen die\n      anderen.", rot: "A8" },
  { name: "Englisch steht beim Laden mit da",
    alt: '<div id="en" lang="en" data-sprache="en" hidden>', neu: '<div id="en" lang="en" data-sprache="en">', rot: "B10" },
  { name: "der Sprachknopf bleibt versteckt", alt: "    knoepfe[i].hidden = false;\n", neu: "", rot: "B1" },
  { name: "das Ziel wird nicht markiert", alt: '    ziel.classList.add("ziel");\n', neu: "", rot: "B2" },
  { name: "kein „↩ zurück“ am Ziel", alt: "    halter.appendChild(hierKnopf);\n", neu: "", rot: "B2" },
  { name: "zurück vergisst die Herkunft",
    alt: "    try { h.scrollIntoView({ block: \"center\" }); } catch (_e) { h.scrollIntoView(); }\n", neu: "", rot: "B3" },
  { name: "zweiter Tipp auf dasselbe Wort springt nur noch einmal hin",
    alt: "      if (zielEl === ziel && herkunft === a) { zurueck(); return; }   // second tap on the same word\n", neu: "", rot: "B4" },
  { name: "Tipp auf das erklärte Wort tut nichts",
    alt: "    if (zielEl && herkunft && ev.target && zielEl.contains(ev.target) && /^(DT|H2|H3|TD|STRONG)$/.test(ev.target.tagName)) {",
    neu: "    if (false) {", rot: "B5" },
  { name: "?lang=en wird überhört", alt: "      var q = /[?&]lang=(de|en)\\b/.exec(location.search);", neu: "      var q = null;", rot: "B6" },
  { name: "eingebettet: die Sprache der Seite drumherum zählt nicht",
    alt: "        if (pl === \"de\" || pl === \"en\") return pl;", neu: "", rot: "B7" },
  { name: "eingebettet: der Rückweg bleibt stehen",
    alt: "    for (var j = 0; j < zl.length; j++) zl[j].style.display = \"none\";", neu: "", rot: "B7" },
  { name: "der Sprach-Schlüssel der App wird überhört",
    alt: "      if (key) { var v = localStorage.getItem(key); if (v === \"de\" || v === \"en\") return v; }", neu: "", rot: "B9" },
  { name: "Tabellen ohne Rollbereich (Querlauf am Handy)", alt: "  .tabelle { overflow-x: auto; }", neu: "  .tabelle { }\n  table { min-width: 480px; }", rot: "B12" },
];

const nurAnker = process.env.NUR_ANKER === "1";
const filter = process.env.NUR_FALL || "";
let gefangen = 0, blind = 0, tot = 0, falsch = 0;
for (const f of FAELLE) {
  if (filter && !f.name.includes(filter)) continue;
  const n = QUELLE.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log(`✗ TOTER ANKER (${n}×): ${f.name}`); continue; }
  if (nurAnker) { console.log(`✓ Anker trifft 1×: ${f.name}`); continue; }
  const dir = mkdtempSync(join(tmpdir(), "gp-sicherheit-"));
  try {
    const p = join(dir, "sicherheit.html");
    writeFileSync(p, QUELLE.replace(f.alt, f.neu));
    const r = spawnSync(process.execPath, [join(root, "tests/smoke_sicherheit_seite.mjs"), p], { encoding: "utf8", timeout: 180000 });
    const rote = (r.stdout || "").split("\n").filter((z) => z.startsWith("✗ ROT:"));
    if (r.status === 0 || !rote.length) { blind++; console.log(`✗ BLIND: ${f.name}`); }
    else if (!rote.some((z) => z.startsWith("✗ ROT: " + f.rot + " "))) { falsch++; console.log(`✗ AUS FALSCHEM GRUND: ${f.name} → ${rote[0]}`); }
    else { gefangen++; console.log(`✓ schlägt an: ${f.name} → ${rote.find((z) => z.startsWith("✗ ROT: " + f.rot + " "))}`); }
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
console.log(`\n${gefangen} schlagen an · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker`);
process.exit(blind || falsch || tot ? 1 : 0);
