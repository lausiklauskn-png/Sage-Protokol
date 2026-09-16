/*
 * Modul 16b — der Andock-Wizard als KANON (A18, 2026-09-14).
 *
 * Bewacht die Tafel docs/INTERFACES.md §11.9: die Trennlinie zwischen Ablauf
 * und Identität, den Vertrag `window.SBKIM_SIEGEL_WIZ`, die Fail-soft-Zusage,
 * die drei Text-Wächter und die Merkmale, die beim Zusammenführen der zwanzig
 * Fassungen gewonnen wurden.
 *
 * ⚠ ZWEI HÄLFTEN, UND SIE MESSEN VERSCHIEDENES. Der Quelltext-Teil fragt, was
 * dasteht; der Browser-Teil fragt, was LÄUFT. Ein Wächter, der eine Datei liest,
 * misst nicht, ob sie sich ausführen lässt — deshalb wird sie wirklich geladen.
 *
 * Lauf: node tests/smoke_kanon_wizard.mjs
 */
import { readFileSync, existsSync, mkdtempSync, writeFileSync, copyFileSync, rmSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { literale, istAnzeigetext, durchT, istVergleich, AUSNAHMEN } from "./kanon_wizard_texte.mjs";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const KANON = join(WURZEL, "src/modules/16b_andock_wizard.js");
const KOPIE = join(WURZEL, "assets/sbkim-andock-wizard.js");
const src = readFileSync(KANON, "utf8");

const ergebnisse = [];
const ok = (was, wahr) => { ergebnisse.push({ was, wahr: !!wahr }); console.log(`  ${wahr ? "✓" : "✗ ROT:"} ${was}`); };

console.log("\nDie Marke — ohne sie findet kanon-verteilen.mjs die Datei nicht\n");

/* ⚠ ERKANNT WIRD AM INHALT, NICHT AM DATEINAMEN. Die Kopien heißen in jeder App
   anders; gefunden werden sie über diese Marke im Kopf. Fehlt sie, verteilt der
   Automat die Datei nie — und niemand sähe es, weil er dann einfach schweigt. */
ok("der Kopf trägt die Marke „SBKIM — Modul 16b —“",
  /SBKIM\s+—\s+Modul\s+16b\s*—/.test(src.slice(0, 400)));

console.log("\nDie Trennlinie — hier steht KEINE App-Identität\n");

/* ⚠ DER WICHTIGSTE WÄCHTER DER DATEI. Stünde hier ein nodeName oder eine
   domainDescription, bekäme beim nächsten Rollout JEDE App Sages Bedeutung —
   der Schaden vom 2026-08-16 in Alis Moderaum, nur zwanzigfach. */
const IDENT = ["nodeName", "domainDescription", "domainKeywords", "stammCategories",
  "guestCategories", "backupPrefix", "endpoint"];
for (const f of IDENT) {
  const zuweisung = new RegExp(`(^|[^.\\w])${f}\\s*:\\s*["'\\[]`, "m");
  ok(`kein eigener Wert für ${f}`, !zuweisung.test(src));
}
ok("keine App-Adresse im Kanon", !/https?:\/\/[a-z0-9.-]*(github\.io|\.de|\.com)/i.test(src));

console.log("\nDer Vertrag — die Konfiguration wird SPÄT gelesen\n");

/* ⚠ GEMESSEN, NICHT ANGENOMMEN: in Sages index.html steht siegel-inhalt.js vor
   sbkim-init.js. Wer den Wert beim Laden in eine Variable fängt, fängt dort
   `undefined`. Gemessen wird der Block der cfg-Funktion, nicht die Nachbarschaft. */
const iCfg = src.indexOf("function cfg()");
const iCfgEnde = src.indexOf("\n  }", iCfg);
const cfgBlock = iCfg >= 0 && iCfgEnde > iCfg ? src.slice(iCfg, iCfgEnde) : "";
ok("cfg() liest window.SBKIM_SIEGEL_WIZ bei jedem Aufruf",
  cfgBlock.includes("window.SBKIM_SIEGEL_WIZ"));
/* Die Gegenrichtung: NIRGENDS sonst darf der Wert eingefangen werden. */
/* ⚠ GEZÄHLT WIRD IM CODE, NICHT IN DER DATEI. Beim ersten Lauf wurde dieser
   Wächter rot, weil der ERKLÄR-KOMMENTAR im Kopf den Namen ebenfalls nennt —
   dieselbe Falle, die netzweit schon viermal zugeschnappt ist, nur andersherum:
   hier hat der Kommentar einen tadellosen Code angeklagt. */
const ohneKommentar = src
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
const ausserhalb = ohneKommentar.split("window.SBKIM_SIEGEL_WIZ").length - 1;
ok("… und nirgends sonst wird er eingefangen", ausserhalb === 1);

console.log("\nDie drei Text-Wächter\n");

/* Die Daten-Tafel aus dem Quelltext holen — sie ist die einzige Wahrheit
   darüber, welche Texte es gibt. */
const iTab = src.indexOf("var TEXTE_DE = [");
const iTabEnde = src.indexOf("\n  ];", iTab);
const tabelle = iTab >= 0 && iTabEnde > iTab ? src.slice(iTab, iTabEnde) : "";
const eintraege = literale(tabelle).map((l) => l.text);
ok(`TEXTE_DE ist eine Daten-Tafel mit Einträgen (${eintraege.length})`, eintraege.length > 40);

/* Die englische Tafel — sie ist Daten wie TEXTE_DE, kein Code. */
const iEn = src.indexOf("var TEXTE = { en: {");
const iEnEnde = src.indexOf("\n  } };", iEn);
const enBlock = iEn >= 0 && iEnEnde > iEn ? src.slice(iEn, iEnEnde + 7) : "";

/* Alle T()/Tf()-Argumente im Code (also ohne die zwei Tabellen selbst).
   ⚠ BEIDE müssen heraus. Nimmt man nur TEXTE_DE heraus, meldet Wächter 3
   die ganze englische Fassung als „geht nicht durch T()" — rot, ohne dass
   eine Zusicherung gefallen wäre. */
const code = (src.slice(0, iTab) + src.slice(iTabEnde)).replace(enBlock, " ");
const benutzt = literale(code).filter(durchT).map((l) => l.text);

/* WÄCHTER 1 — prüft, was da ist. */
const ohneEintrag = [...new Set(benutzt)].filter((t) => !eintraege.includes(t));
ok(`jedes T()-Argument steht in TEXTE_DE${ohneEintrag.length ? " — fehlt: " + JSON.stringify(ohneEintrag.slice(0, 3)) : ""}`,
  ohneEintrag.length === 0);

/* WÄCHTER 2 — fängt toten Text. */
const nieBenutzt = eintraege.filter((t) => !benutzt.includes(t));
ok(`jeder Eintrag aus TEXTE_DE wird benutzt${nieBenutzt.length ? " — tot: " + JSON.stringify(nieBenutzt.slice(0, 3)) : ""}`,
  nieBenutzt.length === 0);

/* ⚠ WÄCHTER 3 — DER WICHTIGSTE. Die ersten beiden können grün sein, während die
   halbe Oberfläche an der Tabelle vorbeiläuft: sie prüfen, was DA ist. Nur
   dieser prüft, was FEHLT. */
const vorbei = literale(code)
  .filter((l) => istAnzeigetext(l.text) && !durchT(l) && !istVergleich(l) && !AUSNAHMEN.includes(l.text))
  .map((l) => l.text);
/* ⚠ Eine Liste, die eine Prüfung steuert, lässt sich still verlängern: nichts
   wird rot, es fällt nur ein Text aus der Messung. Deshalb ist sie genagelt. */
ok("die Ausnahme-Liste trägt genau die eine benannte Ausnahme",
  AUSNAHMEN.length === 1 && AUSNAHMEN[0] === "use strict");
ok(`JEDER Anzeigetext geht durch T()${vorbei.length ? " — vorbei: " + JSON.stringify(vorbei.slice(0, 3)) : ""}`,
  vorbei.length === 0);

console.log("\nDie englische Fassung — eine halbe Tafel ist die schlimmere Sorte\n");

/* ⚠ TAFEL-EVOLUTIONS-KLAUSEL: bis zum 2026-09-16 lautete die Zusicherung
   „es gibt keine Tabelle, also bleibt überall Deutsch". Sie ist ERSETZT,
   nicht stillschweigend getauscht — was jetzt gilt, steht im Kopf des
   TEXTE-Blocks im Modul und wird hier und im Browser-Teil gemessen. */
const EN_AUSNAHMEN = ["nodeId: {0}"];   // Feldname, kein Satz
let EN_TAB = null;
try { EN_TAB = new Function("return (" + enBlock.replace("var TEXTE = ", "").replace(/;\s*$/, "") + ").en")(); }
catch (e) { EN_TAB = null; }
ok("die englische Tafel lässt sich lesen", !!EN_TAB && typeof EN_TAB === "object");

/* ⚠ DER WÄCHTER, AUF DEN ES ANKOMMT. Eine Tabelle mit 40 von 83 Einträgen
   sieht aus wie eine englische Oberfläche und streut deutsche Sätze
   dazwischen — schlimmer als gar keine Übersetzung, weil sie wie eine
   aussieht. */
const ohneEn = EN_TAB ? eintraege.filter((t) => typeof EN_TAB[t] !== "string" || !EN_TAB[t]) : eintraege;
ok(`jeder Eintrag aus TEXTE_DE hat eine englische Fassung (${eintraege.length - ohneEn.length}/${eintraege.length})${ohneEn.length ? " — fehlt: " + JSON.stringify(ohneEn.slice(0, 3)) : ""}`,
  ohneEn.length === 0);

/* ⚠ UND DIE ZWEITE HÄLFTE: ein hineinkopierter deutscher Satz erfüllt den
   Wächter darüber tadellos. Gemessen wird deshalb, dass die Fassung wirklich
   eine ANDERE ist. */
const wortgleich = EN_TAB
  ? eintraege.filter((t) => EN_TAB[t] === t && !EN_AUSNAHMEN.includes(t)) : [];
ok(`keine englische Fassung ist wortgleich mit der deutschen${wortgleich.length ? " — " + JSON.stringify(wortgleich.slice(0, 3)) : ""}`,
  wortgleich.length === 0);

/* Die Gegenrichtung: eine Übersetzung zu einem Satz, den es nicht mehr gibt,
   ist toter Text — dieselbe Frage wie Wächter 2, nur für die andere Tafel. */
const toteEn = EN_TAB ? Object.keys(EN_TAB).filter((t) => !eintraege.includes(t)) : [];
ok(`kein englischer Eintrag ohne deutsche Entsprechung${toteEn.length ? " — tot: " + JSON.stringify(toteEn.slice(0, 3)) : ""}`,
  toteEn.length === 0);

/* ⚠ Platzhalter sind ein VERTRAG, kein Text. Ein \{0}, das in der Übersetzung
   fehlt, verschluckt die nodeId — und das sieht aus wie ein leeres Feld. */
const platzKaputt = EN_TAB ? eintraege.filter((t) => {
  const z = (x) => [...String(x).matchAll(/\{(\d+)\}/g)].map((m) => m[1]).sort().join(",");
  return z(t) !== z(EN_TAB[t] || "");
}) : [];
ok(`die Platzhalter stimmen in beiden Fassungen überein${platzKaputt.length ? " — " + JSON.stringify(platzKaputt.slice(0, 2)) : ""}`,
  platzKaputt.length === 0);

console.log("\nWas beim Zusammenführen gewonnen wurde\n");

const merkmale = [
  /* ⚠ WORTGRENZE. Ohne sie zaehlte `refreshWizardIdentitiesAbgeschaltet` als
     vorhanden — ein Name, der der ANFANG eines anderen ist, misst nicht, was er
     zu messen glaubt. Genau daran ist dieser Waechter in der Gegenprobe
     durchgerutscht. */
  ["Baustein 5 — der Identitäts-Wechsler ist da",
    /function refreshWizardIdentities\s*\(/.test(src) && /function switchWizardIdentity\s*\(/.test(src)
    && /refreshWizardIdentities\s*\(\)\s*;/.test(src) && /sbwiz-idsel/.test(src)],
  ["der Backup-Name kommt aus der Konfiguration", /c\.backupPrefix/.test(src) && !/["'][a-z-]+-backup["']\s*\+/.test(src)],
  ["der Spore-Dateiname kommt aus der Konfiguration", /c\.nodeName\s*\|\|\s*"SBKIM"/.test(src)],
  ["die Wizard-Init-Heilung ist da (Schritt 2+3 sofort frei)", /listIdentities\(\)\.then\([\s\S]{0,400}?s3\.disabled = false/.test(src)],
  ["Schritt 5 wird nach Schritt 1 nachgezogen", (src.match(/refreshWizardIdentities\(\);/g) || []).length >= 6],
  ["die alte Fehlzeile aus Schritt 3 wird weggeräumt", /Keine Identit\/\.test/.test(src)],
  ["ein einziges ID-Präfix", !/\b(alm|kbd|ks|mwp|psb|psf|pb)wiz-/.test(src) && /sbwiz-s1/.test(src)],
];
for (const [was, wahr] of merkmale) ok(was, wahr);

/* ⚠ DIE HERKUNFTS-ZEILE STEHT ÜBER DEM FELD. Neunzehn von zwanzig Fassungen
   hatten sie darunter; das Feld wächst aber mit seinem Inhalt, und eine Zeile
   unter einem bildschirmhohen Feld findet nur, wer ohnehin sucht. */
const iH = src.indexOf("wrap.appendChild(herkunft)");
const iTa = src.indexOf("wrap.appendChild(ta)");
ok("die Herkunfts-Zeile hängt VOR dem Feld", iH > 0 && iTa > 0 && iH < iTa);

/* ⚠ DER MEMBRAN-SATZ HÄNGT AM MODUL, NICHT AN DER HOFFNUNG. */
ok("der Membran-Satz hängt an window.SbkimMembrane",
  /if \(window\.SbkimMembrane\)/.test(src) && /data-membran/.test(src));

console.log("\nDie Kopie in dieser App\n");

ok("assets/sbkim-andock-wizard.js liegt da", existsSync(KOPIE));
ok("… und ist byte-gleich mit dem Kanon",
  existsSync(KOPIE) && readFileSync(KOPIE, "utf8") === src);
const seite = readFileSync(join(WURZEL, "index.html"), "utf8");
ok("index.html lädt beides — erst die Konfiguration, dann den Kanon",
  seite.indexOf("assets/siegel-inhalt.js") < seite.indexOf("assets/sbkim-andock-wizard.js")
  && seite.includes("assets/sbkim-andock-wizard.js"));

/* ── Die zweite Hälfte: was LÄUFT ────────────────────────────────────────── */
function chrom() {
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    const o = readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n))
      .sort((x, y) => Number(y.split("-")[1]) - Number(x.split("-")[1]));
    for (const n of o) { const w = join(heim, n, "chrome-linux", "chrome"); if (existsSync(w)) return w; }
  } catch { /* kein Browser-Heim */ }
  return join(heim, "chromium", "chrome-linux", "chrome");
}

/* ⚠ Das schließende Skript-Tag wird zusammengesetzt. Stünde es am Stück in
   dieser Datei, beendete es beim Einbetten das umgebende Skript — dieselbe
   Falle wie ein gerades Anführungszeichen in einem Probentext. */
const ZU = "</" + "script>";
const skript = (inhalt) => "<script>" + inhalt + ZU;
const SEITE = (konfig, lang, membran) => [
  '<!doctype html><html lang="' + lang + '"><head><meta charset="utf-8"></head><body>',
  '<div id="sbkim-siegel-modal"><div role="dialog"><p id="alt">Siegel</p></div></div>',
  membran ? skript("window.SbkimMembrane = { da: true };") : "",
  konfig ? skript("window.SBKIM_SIEGEL_WIZ = " + JSON.stringify(konfig) + ";") : "",
  '<script src="wizard.js">' + ZU,
  "</body></html>",
].join("\n");

const KONFIG = {
  domain: "Prüfdomäne", endpoint: "https://beispiel.invalid/", nodeType: "hybrid",
  nodeName: "Prüfknoten", domainDescription: "Ein Knoten zum Messen.",
  domainKeywords: ["Messen"], stammCategories: ["A"], guestCategories: ["B"],
  backupPrefix: "pruef-backup",
};

async function browserTeil() {
  let chromium;
  try { ({ chromium } = await import("playwright-core")); }
  catch { return { aus: true, grund: "playwright-core fehlt (npm install)" }; }
  if (!existsSync(chrom())) return { aus: true, grund: "kein Chromium unter " + chrom() };

  const basis = mkdtempSync(join(tmpdir(), "kanonwiz-"));
  copyFileSync(KANON, join(basis, "wizard.js"));
  writeFileSync(join(basis, "ohne.html"), SEITE(null, "de", false));
  writeFileSync(join(basis, "mit.html"), SEITE(KONFIG, "de", false));
  writeFileSync(join(basis, "englisch.html"), SEITE(KONFIG, "en", false));
  writeFileSync(join(basis, "membran.html"), SEITE(KONFIG, "de", true));
  /* ⚠ DIE RANGFOLGE BRAUCHT EINE SEITE, AUF DER SICH BEIDE WIDERSPRECHEN.
     Bis zur Gegenprobe gab es nur `<html lang="en">` ohne cfg.lang — damit war
     die erste Stufe der Rangfolge (cfg.lang gewinnt) UNGEMESSEN, und ein
     Sabotage-Fall darauf blieb zu Recht gruen. */
  writeFileSync(join(basis, "rang.html"), SEITE(Object.assign({}, KONFIG, { lang: "en" }), "de", false));

  /* ⚠ EINE FUNKTION ÜBERLEBT JSON.stringify NICHT. `sampleContent` ist eine, also
     braucht der Inhalts-Weg eigene Seiten, auf denen die Konfiguration im Skript
     zusammengesetzt wird statt serialisiert. Ohne das misst der Wächter eine
     Konfiguration, in der das Feld gar nicht ankommt — grün aus dem falschen Grund. */
  const SEITE_INHALT = (rumpf, sporeStub) => [
    '<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body>',
    '<div id="sbkim-siegel-modal"><div role="dialog"><p id="alt">Siegel</p></div></div>',
    sporeStub ? skript(sporeStub) : "",
    skript("window.SBKIM_SIEGEL_WIZ = Object.assign(" + JSON.stringify(KONFIG) +
      ", { sampleContent: function () { " + rumpf + " } });"),
    '<script src="wizard.js">' + ZU,
    "</body></html>",
  ].join("\n");
  writeFileSync(join(basis, "inhalt.html"),
    SEITE_INHALT("return ['Kuchen Apfelkuchen','Sushi Maki','Suppe Linsen'];", null));
  writeFileSync(join(basis, "inhalt-leer.html"), SEITE_INHALT("return [];", null));
  writeFileSync(join(basis, "inhalt-wirft.html"),
    SEITE_INHALT("throw new Error('kaputt');", null));

  /* Wer im Textfeld gewinnt (Stufe 5c). Der Stub liefert eine Spore mit einem
     ANDEREN Text als die App — nur dann ist die Frage überhaupt gestellt. */
  const SPORE_STUB = "window.SbkimSpore = { getOwnSpore: function () {" +
    " return Promise.resolve({ domainDescription: 'Mein eigener Text ueber meine Kueche.' }); } };";
  const SEITE_TEXT = (flagge, proben) => [
    '<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body>',
    '<div id="sbkim-siegel-modal"><div role="dialog"><p id="alt">Siegel</p></div></div>',
    skript("try { localStorage.setItem('sbkim_eigener_text_pruef-backup', " + JSON.stringify(flagge) + "); } catch (e) {}"),
    skript(SPORE_STUB),
    skript("window.SBKIM_SIEGEL_WIZ = Object.assign(" + JSON.stringify(KONFIG) +
      (proben ? ", { sampleContent: function () { return " + JSON.stringify(proben) + "; } });"
              : ", {});")),
    '<script src="wizard.js">' + ZU,
    "</body></html>",
  ].join("\n");
  writeFileSync(join(basis, "text-eigener.html"), SEITE_TEXT("ja"));
  writeFileSync(join(basis, "text-app.html"), SEITE_TEXT("nein"));
  /* Eine Seite MIT eigenen Inhalten — nur dort zeichnet der Semantik-Block die
     Vektor-Zeile, und nur dort laesst sich messen, was sie WIRKLICH sagt. */
  writeFileSync(join(basis, "text-inhalt.html"),
    SEITE_TEXT("nein", ["Suppe Linsen", "Kuchen Apfel", "Fisch Lachs"]));

  /* Der Vermerk „Letzte Sicherung" (Klaus 2026-09-16). Beide Wege sichern ueber
     dasselbe `SbkimSpore.exportBackup`; der Vermerk hing aber an Modul 23. Die
     Seite stellt ein Modul 02 UND — in einer der beiden Fassungen — ein Modul 23,
     das nur mitschreibt, ob es gerufen wurde.
     ⚠ `window.prompt` wird gestellt, sonst haelt der Browser an und die Probe
     wartet auf etwas, das nie kommt. */
  const SPORE_FUER_BACKUP =
    "window.SbkimSpore = {" +
    "  exportBackup: function (pw) { window.__pw = pw; return Promise.resolve({ v: 2, ct: 'xx' }); }," +
    "  listIdentities: function () { return Promise.resolve(['main']); }," +
    "  getOrCreateIdentity: function () { return Promise.resolve({ nodeId: 'PRUEFKENNUNG123' }); }" +
    "};";
  const SEITE_STEMPEL = (mitModul23) => [
    '<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body>',
    '<div id="sbkim-siegel-modal"><div role="dialog"><p id="alt">Siegel</p></div></div>',
    skript("window.__gerufen = 0; window.prompt = function () { return 'geheim12345'; };"),
    skript(SPORE_FUER_BACKUP),
    mitModul23 ? skript("window.SbkimRendezvousUI = { markBackupMade: function () { window.__gerufen++; return true; } };") : "",
    skript("window.SBKIM_SIEGEL_WIZ = " + JSON.stringify(KONFIG) + ";"),
    '<script src="wizard.js">' + ZU,
    "</body></html>",
  ].join("\n");
  writeFileSync(join(basis, "stempel-mit23.html"), SEITE_STEMPEL(true));
  writeFileSync(join(basis, "stempel-ohne23.html"), SEITE_STEMPEL(false));

  /* ⚠ SCHRITT 2 — DIE ERST-SIGNATUR IM SIEGEL. Bis zum 2026-09-16 bettete sie
     ausschliesslich die App-Beschreibung ein, waehrend die stille Anmeldung und
     der Knopf „neu signieren" den INHALT nahmen. Beide Wege schreiben in
     dasselbe Fach — dieselbe Kennung, dieselbe Spore, aber je nach gedruecktem
     Knopf ein anderes Thema im Netz.
     ⚠ GEMESSEN WIRD, WAS `generateOwnSpore` WIRKLICH BEKOMMT. Ein Waechter auf
     „vektorFuerSpore steht in der Datei" waere auch dann gruen, wenn der Aufruf
     nie erreicht wird. Der Stub schreibt die uebergebenen Felder mit. */
  const STUBS_FUER_S2 =
    "window.__meta = null; window.__proben = 0; window.__altSpore = null;" +
    "window.SbkimSpore = {" +
    "  getActiveIdentityKey: function () { return Promise.resolve('main'); }," +
    /* ⚠ OHNE DIESEN STUB WAERE DIE RICHTUNG „zaehlt hoch" NICHT MESSBAR.
       `naechsteEmbeddingVersion` liest die alte Spore; fehlt die Funktion,
       faellt es in seinen fail-soft-Zweig und liefert IMMER 1 — der
       Waechter waere dann gruen, ohne je gezaehlt zu haben. */
    "  getOwnSpore: function () { return Promise.resolve(window.__altSpore); }," +
    "  getOrCreateIdentity: function () { return Promise.resolve({ nodeId: 'PRUEFKENNUNG123' }); }," +
    "  listIdentities: function () { return Promise.resolve(['main']); }," +
    "  generateOwnSpore: function (meta) { window.__meta = meta;" +
    "    return Promise.resolve({ id: 'PRUEFKENNUNG123' }); }" +
    "};" +
    "window.SbkimEmbedding = {" +
    "  init: function () { return Promise.resolve(); }," +
    "  embedPassage: function () { return Promise.resolve(new Float32Array(384)); }," +
    "  embedContentVector: function (p) { window.__proben = p.length;" +
    "    return Promise.resolve({ vector: new Float32Array(384) }); }," +
    "  embedSnippets: function () { return Promise.resolve([]); }" +
    "};";
  const SEITE_S2 = (rumpf) => [
    '<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body>',
    '<div id="sbkim-siegel-modal"><div role="dialog"><p id="alt">Siegel</p></div></div>',
    skript(STUBS_FUER_S2),
    skript("window.SBKIM_SIEGEL_WIZ = Object.assign(" + JSON.stringify(KONFIG) +
      ", { sampleContent: function () { " + rumpf + " } });"),
    '<script src="wizard.js">' + ZU,
    "</body></html>",
  ].join("\n");
  writeFileSync(join(basis, "s2-inhalt.html"),
    SEITE_S2("return ['Kuchen Apfelkuchen','Sushi Maki','Suppe Linsen'];"));
  writeFileSync(join(basis, "s2-ohne.html"), SEITE_S2("return [];"));

  const PORT = 8830 + (process.pid % 40);
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"],
    { cwd: basis, stdio: "ignore" });
  for (let i = 0; i < 160; i++) {
    try { const a = await fetch(`http://127.0.0.1:${PORT}/mit.html`); if (a.ok) break; } catch { /* noch nicht oben */ }
    await new Promise((r) => setTimeout(r, 50));
  }
  const browser = await chromium.launch({ executablePath: chrom() });
  const fehler = [];
  try {
    const hole = async (datei, fn) => {
      const s = await browser.newPage();
      s.on("pageerror", (e) => fehler.push(datei + ": " + String(e).slice(0, 120)));
      await s.goto(`http://127.0.0.1:${PORT}/${datei}`, { waitUntil: "load" });
      /* ⚠ Auf die BEDINGUNG warten, nicht auf die Uhr: die Datei hängt sich
         selbst ein, sobald sie geladen ist. */
      await s.waitForFunction(() => !!document.querySelector("#sbkim-si-open, #sbkim-si-ohne-konfig"), { timeout: 8000 })
        .catch(() => { /* der Aufrufer misst das Ergebnis, nicht die Frist */ });
      const r = await s.evaluate(fn);
      await s.close();
      return r;
    };

    console.log("\nOhne Konfiguration — kein toter Knopf\n");
    const a = await hole("ohne.html", () => ({
      knopf: !!document.getElementById("sbkim-si-open"),
      zeile: (document.getElementById("sbkim-si-ohne-konfig") || {}).textContent || "",
      wizard: !!document.getElementById("sbkim-si-wizard"),
    }));
    ok("ohne Konfiguration steht KEIN Knopf da", a.knopf === false);
    ok("… und auch kein Wizard-Fenster im Hintergrund", a.wizard === false);
    ok("… sondern eine Zeile, die den Grund nennt",
      /SBKIM_SIEGEL_WIZ/.test(a.zeile) && a.zeile.length > 40);

    console.log("\nMit Konfiguration — das Werkzeug ist vollständig\n");
    const b = await hole("mit.html", () => {
      const dlg = document.getElementById("sbkim-si-wizard");
      const feld = document.getElementById("sbkim-si-semantik-text");
      const herk = document.getElementById("sbkim-si-semantik-herkunft");
      return {
        knopf: (document.getElementById("sbkim-si-open") || {}).textContent || "",
        semantik: !!document.getElementById("sbkim-si-semantik-block"),
        schutz: !!document.getElementById("sbkim-si-schutz-block"),
        schritte: dlg ? [1, 2, 3, 4].filter((n) => dlg.querySelector("#sbwiz-s" + n)).length : 0,
        wechsler: !!(dlg && dlg.querySelector("#sbwiz-idsel")),
        feldText: feld ? feld.value : null,
        herkunftVorFeld: !!(herk && feld && (herk.compareDocumentPosition(feld) & Node.DOCUMENT_POSITION_FOLLOWING)),
        membran: (document.querySelector("[data-membran]") || {}).getAttribute
          ? document.querySelector("[data-membran]").getAttribute("data-membran") : null,
        schutzText: (document.querySelector("[data-membran]") || {}).textContent || "",
      };
    });
    ok("der Knopf steht da und trägt seinen deutschen Text", /Eigene Identität/.test(b.knopf));
    ok("Semantik-Block und Schutz-Block sind da", b.semantik && b.schutz);
    ok("der Wizard hat alle vier Knopf-Bausteine", b.schritte === 4);
    ok("… und Baustein 5, den Identitäts-Wechsler", b.wechsler === true);
    ok("das Feld zeigt den Vorschlag der App", b.feldText === KONFIG.domainDescription);
    ok("die Herkunfts-Zeile steht WIRKLICH über dem Feld", b.herkunftVorFeld === true);
    ok("ohne Modul 15 wird die Membran NICHT behauptet",
      b.membran === "nein" && !/Membran zeigt/.test(b.schutzText));

    console.log("\nDie Sprache — OHNE EINSTELLUNG ÄNDERT SICH NICHTS\n");
    const e = await hole("englisch.html", () => ({
      knopf: (document.getElementById("sbkim-si-open") || {}).textContent || "",
      sprache: window.SbkimSiegelTexte ? window.SbkimSiegelTexte.sprache() : null,
      probe: window.SbkimSiegelTexte ? window.SbkimSiegelTexte.T("Schließen") : null,
      erfunden: window.SbkimSiegelTexte ? window.SbkimSiegelTexte.T("Gibt es nicht") : null,
    }));
    ok("bei <html lang=\"en\"> wird die Sprache auch so gelesen", e.sprache === "en");
    /* ⚠ HIER STAND BIS ZUM 2026-09-16: „… und trotzdem steht überall Deutsch,
       weil es keine Tabelle gibt." Die Zusicherung war richtig, solange es
       keine gab. Sie ist ERSETZT, nicht gestrichen — gemessen wird jetzt,
       dass die Tabelle bei lang="en" WIRKLICH greift. */
    ok("bei lang=\"en\" steht die englische Fassung da",
      /own identity/i.test(e.knopf) && e.probe === "Close");
    /* ⚠ FAIL-SOFT IST DIE TRAGENDE HÄLFTE: ein Satz ohne Eintrag fällt auf
       Deutsch zurück, statt leer zu bleiben. Ohne diesen Wächter wäre eine
       Tabelle grün, die alles Unbekannte verschluckt. */
    ok("T() auf einen unbekannten Satz gibt ihn unverändert zurück", e.erfunden === "Gibt es nicht");

    const f = await hole("englisch.html", () => {
      window.SbkimSiegelTexte.TEXTE.en = { "Schließen": "Close" };
      return {
        mitTabelle: window.SbkimSiegelTexte.T("Schließen"),
        platzhalter: window.SbkimSiegelTexte.Tf("nodeId: {0}", "abc"),
      };
    });
    ok("liegt eine Tabelle vor, greift sie", f.mitTabelle === "Close");

    const r = await hole("rang.html", () => ({
      sprache: window.SbkimSiegelTexte ? window.SbkimSiegelTexte.sprache() : null,
      html: document.documentElement.getAttribute("lang"),
    }));
    ok("die Konfiguration gewinnt vor <html lang> (Rangfolge cfg.lang → html → de)",
      r.html === "de" && r.sprache === "en");
    ok("Platzhalter werden eingesetzt", f.platzhalter === "nodeId: abc");

    console.log("\nMit Modul 15 — dann darf der Satz stehen\n");
    const m = await hole("membran.html", () => ({
      membran: document.querySelector("[data-membran]").getAttribute("data-membran"),
      text: document.querySelector("[data-membran]").textContent,
    }));
    ok("mit Modul 15 steht die Membran-Zusage da",
      m.membran === "ja" && /Membran zeigt/.test(m.text));

    console.log("\nDer Vektor — INHALT schlägt Selbstbeschreibung (Stufe 5a)\n");
    const lies = () => {
      const z = document.getElementById("sbkim-si-semantik-vektorquelle");
      return {
        da: !!z, marke: z ? z.getAttribute("data-vektor") : null, text: z ? z.textContent : "",
        /* ⚠ DER BLOCK WIRD MITGEMESSEN, und das ist kein Beiwerk. Die Gegenprobe
           hat gezeigt: nimmt man das try/catch aus inhaltsSchnipsel heraus, wirft
           eine kaputte App-Funktion mitten im Bauen — der ganze Semantik-Block
           entsteht dann NICHT. Eine Prüfung, die nur „keine Vektor-Zeile" fragt,
           nennt genau das „fail-soft" und ist damit blind für den schlimmeren
           Fall. Gefunden beim Nachstellen von Hand, nicht beim Schreiben. */
        block: !!document.getElementById("sbkim-si-semantik-block"),
      };
    };
    const i1 = await hole("inhalt.html", lies);
    ok("liefert die App eigene Inhalte, steht die Vektor-Quelle da", i1.da === true);
    ok("… und sie ist als „content“ markiert", i1.marke === "content");
    /* ⚠ Die ZAHL wird mitgemessen, nicht nur die Anwesenheit der Zeile. Eine
       Zeile, die immer „0 Einträge" sagt, wäre von einer richtigen nicht zu
       unterscheiden — und sie stünde bei jedem Nutzer gleich falsch da. */
    ok("… und nennt die gemessene Anzahl (3)", /\b3\b/.test(i1.text));

    /* Die GEGENRICHTUNG. Ohne sie wäre der Wächter darüber auch dann grün, wenn
       die Zeile IMMER erschiene — also auch bei Apps ohne eigene Inhalte, wo der
       Satz schlicht gelogen wäre. */
    const i2 = await hole("inhalt-leer.html", lies);
    ok("ohne Inhalte steht KEINE Vektor-Quelle da", i2.da === false);
    const i3 = await hole("inhalt-wirft.html", lies);
    ok("wirft sampleContent, bleibt es still (fail-soft)", i3.da === false);
    ok("… und der Semantik-Block steht trotzdem da", i3.block === true);
    ok("… ebenso ohne Inhalte", i2.block === true);

    console.log("\nWer im Textfeld gewinnt (Stufe 5c)\n");
    const liesText = () => {
      const feld = document.getElementById("sbkim-si-semantik-text");
      const herk = document.getElementById("sbkim-si-semantik-herkunft");
      const knopf = document.getElementById("sbkim-si-semantik-eigener-text");
      /* ⚠ DIE ZEILE WIRD AN IHRER EIGENEN KENNUNG GELESEN, nicht aus einem
         Behaelter. Der erste Anlauf nahm `sbkim-si-wizard` — das gibt es, aber
         der Semantik-Block haengt im SIEGEL-Modal daneben. Drei Waechter waren
         dadurch rot, obwohl die Zeile tadellos dastand: rot aus dem falschen
         Grund, im Waechter. */
      const vz = document.getElementById("sbkim-si-semantik-vektorquelle");
      return {
        wert: feld ? feld.value : null,
        woher: herk ? herk.getAttribute("data-woher") : null,
        knopfText: (knopf && !knopf.hidden) ? knopf.textContent : "",
        sichtbar: vz ? vz.textContent : "",
      };
    };
    /* ⚠ Der Semantik-Block liest getOwnSpore ASYNCHRON. Auf die BEDINGUNG warten,
       nicht auf die Uhr — sonst misst die Probe den Zustand vor der Entscheidung
       und ist zufällig grün. */
    const holeText = async (datei, erwartetWoher) => {
      const s = await browser.newPage();
      s.on("pageerror", (e) => fehler.push(datei + ": " + String(e).slice(0, 120)));
      await s.goto(`http://127.0.0.1:${PORT}/${datei}`, { waitUntil: "load" });
      await s.waitForFunction((w) => {
        const h = document.getElementById("sbkim-si-semantik-herkunft");
        return !!h && h.getAttribute("data-woher") === w;
      }, erwartetWoher, { timeout: 8000 }).catch(() => { /* der Aufrufer urteilt */ });
      const r = await s.evaluate(liesText);
      await s.close();
      return r;
    };
    const t1 = await holeText("text-eigener.html", "spore");
    ok("hat der Nutzer selbst geschrieben, steht SEIN Text im Feld",
      t1.wert === "Mein eigener Text ueber meine Kueche." && t1.woher === "spore");
    ok("… und der App-Vorschlag steht hinter einem Knopf", /Vorschlag der App/.test(t1.knopfText));

    const t2 = await holeText("text-app.html", "app");
    ok("hat er den App-Text übernommen, gewinnt der App-Vorschlag weiter",
      t2.wert === KONFIG.domainDescription && t2.woher === "app");
    ok("… und SEIN Text steht hinter dem Knopf", /zuletzt signierten Text/.test(t2.knopfText));

    /* ── Eine Sicherung im SIEGEL vermerkt sich auch im PANEL ──────────────
       Klaus 2026-09-16: „Backup-Workflow und Sicherung-Workflow, ist das
       dasselbe?" Ja — beide rufen `SbkimSpore.exportBackup`. Bis dahin setzte
       aber nur das Panel den Vermerk „Letzte Sicherung"; wer hier sicherte, sah
       dort weiter das alte Datum. Eine Auskunft, die in die falsche Richtung
       zeigt, ist teurer als gar keine.
       ⚠ GEMESSEN WIRD DER GRIFF, NICHT DER QUELLTEXT: der Knopf wird wirklich
       gedrueckt. Ein Waechter auf „die Zeile steht in der Datei" waere auch dann
       gruen, wenn sie nie erreicht wird. */
    const stempel = async (datei) => {
      const s = await browser.newPage();
      s.on("pageerror", (e) => fehler.push(datei + ": " + String(e).slice(0, 120)));
      await s.goto(`http://127.0.0.1:${PORT}/${datei}`, { waitUntil: "load" });
      await s.waitForFunction(() => !!document.querySelector("#sbwiz-s3"), { timeout: 8000 })
        .catch(() => { /* der Aufrufer misst das Ergebnis, nicht die Frist */ });
      const r = await s.evaluate(async () => {
        const b = document.querySelector("#sbwiz-s3");
        if (!b) return { knopf: false };
        b.disabled = false;      // Schritt 3 haengt sonst an Schritt 1/2
        b.click();
        /* Auf die BEDINGUNG warten, nicht auf die Uhr: das Backup laeuft ueber
           zwei Promises, die Meldung steht erst danach. */
        for (let i = 0; i < 200; i++) {
          const t = (document.querySelector("#sbwiz-o3") || {}).textContent || "";
          if (/aufbewahren|Fehler/.test(t)) break;
          await new Promise((r2) => setTimeout(r2, 10));
        }
        return {
          knopf: true,
          gerufen: window.__gerufen,
          pw: window.__pw || null,
          meldung: (document.querySelector("#sbwiz-o3") || {}).textContent || "",
        };
      });
      await s.close();
      return r;
    };

    const stMit = await stempel("stempel-mit23.html");
    ok("der Backup-Knopf im Siegel ist da und laesst sich druecken", stMit.knopf === true);
    ok("… er sichert wirklich (Modul 02 bekommt das Passwort)", stMit.pw === "geheim12345");
    ok("… und meldet Erfolg statt eines Fehlers", /aufbewahren/.test(stMit.meldung));
    ok("… und vermerkt die Sicherung im Verbinden-Panel (genau einmal)", stMit.gerufen === 1);

    /* Die Gegenrichtung: ohne Modul 23 darf das Backup trotzdem entstehen.
       Ein fehlender Vermerk kostet kein Backup — und keinen Skript-Fehler. */
    const stOhne = await stempel("stempel-ohne23.html");
    ok("ohne Modul 23 sichert das Siegel trotzdem",
      stOhne.pw === "geheim12345" && /aufbewahren/.test(stOhne.meldung));
    ok("… und ruft nichts ins Leere", stOhne.gerufen === 0);

    console.log("\nSchritt 2 — der Inhalt schlaegt die Selbstbeschreibung\n");
    const schrittZwei = async (datei, altSpore) => {
      const s = await browser.newPage();
      s.on("pageerror", (e) => fehler.push(datei + ": " + String(e).slice(0, 120)));
      await s.goto(`http://127.0.0.1:${PORT}/${datei}`, { waitUntil: "load" });
      await s.waitForFunction(() => !!document.querySelector("#sbwiz-s2"), { timeout: 8000 })
        .catch(() => { /* der Aufrufer misst das Ergebnis, nicht die Frist */ });
      /* Die „alte" Spore wird VOR dem Klick gestellt — der Helfer liest sie erst
         beim Signieren, also genau dann, wie im echten Ablauf. */
      if (altSpore !== undefined) await s.evaluate((sp) => { window.__altSpore = sp; }, altSpore);
      const r = await s.evaluate(async () => {
        const b = document.querySelector("#sbwiz-s2");
        if (!b) return { knopf: false };
        b.disabled = false;      // Schritt 2 haengt sonst an Schritt 1
        b.click();
        /* Auf die BEDINGUNG warten, nicht auf die Uhr — der Weg laeuft ueber
           vier Promises, die Schlussmeldung steht erst danach. */
        for (let i = 0; i < 300; i++) {
          const t = (document.querySelector("#sbwiz-o2") || {}).textContent || "";
          if (/committen|Fehler/.test(t)) break;
          await new Promise((r2) => setTimeout(r2, 10));
        }
        const d = document.getElementById("sbkim-si-wizard");
        return {
          knopf: true,
          quelle: window.__meta ? window.__meta.embeddingSource : null,
          version: window.__meta ? window.__meta.embeddingVersion : null,
          proben: window.__proben,
          meldung: (document.querySelector("#sbwiz-o2") || {}).textContent || "",
          dialog: d ? d.textContent : "",
        };
      });
      await s.close();
      return r;
    };

    const s2a = await schrittZwei("s2-inhalt.html");
    ok("Schritt 2 laesst sich druecken", s2a.knopf === true);
    ok("… und signiert wirklich (Modul 02 bekommt die Felder)", s2a.quelle !== null);
    ok("… hat die App eigene Inhalte, kommt der Vektor DARAUS", s2a.quelle === "content");
    /* ⚠ Die ZAHL wird mitgemessen. Ein Weg, der `embedContentVector` mit einer
       LEEREN Liste ruft, traegt auch „content" ein und haette nichts gemessen. */
    ok("… und zwar aus allen drei Schnipseln", s2a.proben === 3);
    ok("… die Meldung nennt die Zahl", /\b3\b/.test(s2a.meldung));

    /* ⚠ DIE GEGENRICHTUNG, und sie ist hier die wichtigere: ohne sie waere der
       Waechter darueber auch dann gruen, wenn der Inhalts-Weg IMMER griffe —
       also auch in Buchhaltung und Firmen-Seiten, wo der Inhalt nichts ueber
       den Nutzer sagt. Genau das hat Klaus am 2026-09-16 ausgeschlossen. */
    const s2b = await schrittZwei("s2-ohne.html");
    ok("ohne eigene Inhalte bleibt es bei der Beschreibung", s2b.quelle === "description");
    ok("… und die Meldung behauptet dann keine eigenen Inhalte",
      /committen/.test(s2b.meldung) && !/eigenen Inhalten/.test(s2b.meldung));
    ok("… `embedContentVector` wird dabei gar nicht erst gerufen", s2b.proben === 0);

    /* ── embeddingVersion: der Zaehler „der wievielte Inhalts-Stand" ────────
     *
     * ⚠ DER BEFUND (Klaus 2026-09-16): das Feld FEHLTE in seiner echten Spore.
     * `generateOwnSpore` setzt es nur, wenn der Aufrufer es mitgibt — und der
     * Wizard tat das nicht. Gemessen wird deshalb, was Modul 02 WIRKLICH
     * bekommt, nicht ob der Name im Quelltext steht.
     *
     * DREI Faelle, und die zweite Richtung ist die wichtigere: ein Zaehler, der
     * bei jedem Signieren hochlaeuft, misst KLICKS statt Inhalten. */
    ok("die Spore traegt einen Inhalts-Zaehler", typeof s2a.version === "number");
    ok("… ohne Vorgaenger faengt er bei 1 an", s2a.version === 1);

    /* Der Stub bettet 384 Nullen ein; eine „alte" Spore mit demselben Vektor ist
       also wirklich unveraendert — die Zahl muss stehen bleiben. */
    const NULLEN = new Array(384).fill(0);
    const s2c = await schrittZwei("s2-inhalt.html",
      { embeddingVersion: 7, domainVector: NULLEN });
    ok("… gleicher Vektor ⇒ die Zahl bleibt stehen", s2c.version === 7,
      `bekommen: ${s2c.version}`);

    const s2d = await schrittZwei("s2-inhalt.html",
      { embeddingVersion: 7, domainVector: NULLEN.map((_x, i) => (i === 0 ? 0.5 : 0)) });
    ok("… anderer Vektor ⇒ die Zahl zaehlt hoch", s2d.version === 8,
      `bekommen: ${s2d.version}`);

    /* ── Der Satz sagt jetzt die GANZE Wahrheit (Klaus 2026-09-16) ─────────
     *
     * ⚠ DER BEFUND, an Klaus' echter Spore gemessen: `embeddingSource` stand auf
     * „content", und alle sechs `snippetVectors` waren trotzdem Saetze der
     * BESCHREIBUNG — `embedSnippets` bekommt den Text, nicht die Inhalte. Der
     * Satz „nicht aus dem Text oben" las sich wie eine Aussage ueber die ganze
     * Spore und stimmte nur fuer den domainVector.
     *
     * ⚠ GEMESSEN WIRD, WAS AUF DEM SCHIRM STEHT. Ein Waechter, der den
     * Quelltext liest, waere auch dann gruen, wenn die Zeile nie gezeichnet
     * wird — genau der Fehler, der in WorkFloh am selben Tag ein ganzes Geruest
     * an nichts haengen liess. Die Zeile entsteht nur MIT eigenen Inhalten. */
    const tv = await holeText("text-inhalt.html", "app");
    ok("mit eigenen Inhalten steht die Vektor-Zeile da",
      /Vektor kommt aus deinen eigenen Inhalten/.test(tv.sichtbar));
    ok("… sie nennt die Zahl der Inhalte", /\(3 Einträge\)/.test(tv.sichtbar));
    ok("… und sie sagt, dass die Satz-Schnipsel WEITER aus dem Text kommen",
      /Satz-Schnipsel für die Feinsuche kommen weiter aus dem Text/.test(tv.sichtbar));

    console.log("\nEinmal signieren, einmal sichern — es steht dran\n");
    /* ⚠ GEMESSEN WIRD DER TEXT IM FENSTER, nicht im Quelltext. Der Satz ist die
       ganze Lieferung; steht er nur in der Datei und nie auf dem Schirm, hat
       ihn niemand. */
    ok("Schritt 2 sagt, dass es dieselbe Spore wie im Verbinden-Fenster ist",
      /dieselbe Spore wie im Verbinden-Fenster/i.test(s2a.dialog));
    ok("… und dass einmal signieren genuegt",
      /hier ODER dort, nicht in beiden/.test(s2a.dialog));
    ok("Schritt 3 sagt, dass es dieselbe Sicherung ist",
      /dieselbe Sicherung wie im Verbinden-Fenster/i.test(s2a.dialog));
    ok("… und was zweimal druecken ergibt",
      /zwei Dateien mit gleichem Inhalt/.test(s2a.dialog));

    ok(`kein Skript-Fehler im Browser${fehler.length ? " — " + fehler[0] : ""}`, fehler.length === 0);
  } finally {
    await browser.close();
    server.kill();
    rmSync(basis, { recursive: true, force: true });
  }
  return { aus: false };
}

browserTeil().then((b) => {
  if (b.aus) console.log(`\n⊘ Browser-Teil nicht lauffähig: ${b.grund} — UNGEPRÜFT, nicht grün.\n`);
  const gruen = ergebnisse.filter((r) => r.wahr).length;
  const rot = ergebnisse.length - gruen;
  console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
  process.exit(rot ? 1 : 0);
}).catch((e) => { console.error("✗ Probe abgestürzt:", e); process.exit(1); });
