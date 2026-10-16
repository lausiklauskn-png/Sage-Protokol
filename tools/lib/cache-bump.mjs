/* cache-bump.mjs — Cache-Bump für einen Träger, wenn eine Datei sich geändert hat.
 *
 * ⚠ KOPIE aus tools/kanon-verteilen.mjs (2026-10-16), Funktionen traegerDateien,
 * probenDateien, jsDateien, cacheBump, cacheStandNachziehen — wortgleich, nur mit
 * eigenem Zustand. Benannt in docs/PFLEGE-LISTE.md: wer die Riegel dort ändert, zieht
 * sie hier nach (oder baut kanon-verteilen auf diese Datei um). Genutzt von
 * tools/sicherheit-verteilen.mjs.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, basename, relative } from "node:path";
import { execFileSync } from "node:child_process";

const UEBERSPRINGEN = new Set(["node_modules", ".git", "docs", "tests", "test", "mitschnitt", "archiv"]);
const schonGebumpt = new Set();
export const cacheStandFehler = [];
let schreiben = true;
export function setzeSchreiben(w) { schreiben = !!w; }

function traegerDateien(wurzel, tiefe = 0) {
  const aus = [];
  if (tiefe > 4) return aus;
  let eintraege; try { eintraege = readdirSync(wurzel); } catch { return aus; }
  for (const e of eintraege) {
    if (UEBERSPRINGEN.has(e)) continue;
    const p = join(wurzel, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) aus.push(...traegerDateien(p, tiefe + 1));
    /* ⚠ DAS MANIFEST GEHOERT DAZU (Pflege-Liste § 18, viermal am 2026-10-15).
     * In-and-Out-Book haengt seine Symbole mit `?v=12` an die Cache-Nummer;
     * Seite und Vorrat zogen mit, das Manifest nicht — der Manifest-Waechter
     * der App wurde rot, viermal an einem Tag, jedes Mal von Hand geflickt.
     * Es gilt derselbe Riegel wie fuer Seiten: nur was VORHER auf der alten
     * Nummer stand. */
    else if ((/\.(js|html|webmanifest)$/.test(e) || e === "manifest.json") && st.size < 3_000_000) aus.push(p);
  }
  return aus;
}

function probenDateien(rp) {
  const aus = [];
  const geh = (d, tiefe) => {
    if (tiefe > 4) return;
    let eintraege; try { eintraege = readdirSync(d); } catch { return; }
    for (const e of eintraege) {
      if (e === "node_modules" || e === ".git") continue;
      const p = join(d, e);
      let st; try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) geh(p, tiefe + 1);
      /* ⚠ tests/cache-stand.json NICHT. Sie gehoert tools/cache-stand.mjs
       * (Pflege-Liste #13), und das Werkzeug VERLAESST sich darauf, dass ihre
       * Version noch die alte ist: „Vorrat geaendert, Version gleich" ist sein
       * Riegel. Zog dieser Lauf die Version vorher mit, hielt es den Stand fuer
       * ungueltig und brach ab — gefunden am 2026-10-16 von
       * tests/smoke_kanon_cachestand.mjs, nicht beim Bauen. */
      else if (e === "cache-stand.json") continue;
      else if (/\.(m?js|cjs|json)$/.test(e) && st.size < 3_000_000) aus.push(p);
    }
  };
  for (const t of ["tests", "test"]) geh(join(rp, t), 0);
  return aus;
}

function jsDateien(wurzel, tiefe = 0) {
  const aus = [];
  if (tiefe > 4) return aus;
  let eintraege; try { eintraege = readdirSync(wurzel); } catch { return aus; }
  for (const e of eintraege) {
    if (UEBERSPRINGEN.has(e)) continue;
    const p = join(wurzel, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) aus.push(...jsDateien(p, tiefe + 1));
    else if (e.endsWith(".js") && st.size < 3_000_000) aus.push(p);
  }
  return aus;
}

function cacheBump(rp, zielPfad) {
  let gebumpt = false;
  const dateiname = basename(zielPfad);
  const ziel = zielPfad.replace(/\\/g, "/");
  /* ⚠ DER GELTUNGSBEREICH ENTSCHEIDET, NICHT DAS REPO. Ein Worker unter
   * bookledger/sw.js kann eine Datei unter sbkim/ gar nicht ausliefern — ihn
   * zu bumpen wirft den Vorrat einer FREMDEN Unter-App weg. Gemessen am
   * 2026-09-16: die erste Fassung dieser Regel bumpte in Tomys-Hub FUENF
   * Unter-Apps, von denen keine den Wizard je sieht. */
  for (const sw of jsDateien(rp).filter((p) => /(^|\/)[a-z-]*sw\.js$/.test(p.replace(/\\/g, "/")))) {
    if (schonGebumpt.has(sw)) continue;
    let s; try { s = readFileSync(sw, "utf8"); } catch { continue; }
    const bereich = dirname(sw).replace(/\\/g, "/") + "/";
    const imVorrat = new RegExp(`["'\`][^"'\`]*${dateiname.replace(/\./g, "\\.")}["'\`]`).test(s);
    /* ⚠ EIN fetch-LISTENER ALLEIN IST KEIN VORRAT. `sbkim/sbkim-sw.js` faengt
     * POSTs ab und leitet sie an die Seite weiter — es legt NICHTS ab. Ohne
     * diese Bedingung meldete der Automat dort dreimal „kein Bump moeglich":
     * eine Warnung, die immer kommt, verdeckt die eine, auf die es ankommt. */
    const faengtAb = ziel.startsWith(bereich)
      && /addEventListener\s*\(\s*["'`]fetch["'`]/.test(s)
      && /\bcaches\s*\./.test(s);
    if (!imVorrat && !faengtAb) continue;
    /* ⚠ SW_VERSION GEHOERT DAZU. Mein Mixarium nennt seine Nummer so — bis zum
     * 2026-09-16 meldete der Automat dort „kein Bump moeglich" und ging weiter.
     * Eine Meldung, die niemand liest, ist kein Bump. */
    const m = s.match(/(var|const|let)\s+(CACHE_VERSION|CACHE|SW_VERSION)\s*=\s*(['"`])([^'"`]*?)(\d+)\3/);
    if (!m) { console.log(`        ⚠ ${relative(rp, sw)}: kein Bump moeglich (Muster nicht gefunden)`); continue; }
    const neu = m[0].slice(0, -(m[5].length + 1)) + (Number(m[5]) + 1) + m[3];
    writeFileSync(sw, s.slice(0, m.index) + neu + s.slice(m.index + m[0].length));
    schonGebumpt.add(sw);
    gebumpt = true;
    console.log(`        ↳ Cache-Bump: ${relative(rp, sw)}  ${m[4]}${m[5]} → ${m[4]}${Number(m[5]) + 1}`);

    /* ── ⚠ UND DIE ?v= ZIEHEN MIT — aber NUR, wo sie VORHER schon passten ──
     *
     * GEMESSEN am 2026-09-16, und zwar an einem Schaden, den dieser Automat
     * selbst angerichtet hat: er hob `family-projekt-v116` auf `v117` und
     * `pwa-toolpoint-v56` auf `v57` — und liess die `?v=` stehen. Beide
     * Marktplaetze binden ihre Asset-Adressen aber an die Cache-Nummer, und
     * beide Baeume waren danach ROT. Eine Stunde zuvor war genau diese Luecke
     * in beiden von Hand geschlossen worden.
     *
     * ⚠ ES WIRD NICHT GERATEN, OB EIN ?v= DIE CACHE-NUMMER MEINT. Netzweit
     * gemessen (28 Repos) heisst es meistens etwas ANDERES: in Rezeptbuch,
     * Muttis und Mixarium ist es der ICON-Zaehler und steht bei `?v=1`,
     * waehrend die Cache-Nummer ganz woanders liegt. Wer dort mitzieht,
     * schreibt eine Zahl um, die eine andere Sache zaehlt.
     *
     * Der Riegel ist deshalb eine MESSUNG, keine Annahme: mitgezogen wird nur,
     * was vor dem Bump BUCHSTAEBLICH auf der alten Cache-Nummer stand. Stimmten
     * sie vorher ueberein, gehoeren sie zusammen; taten sie es nicht, bleibt
     * alles liegen. `ASSET_V` zaehlt mit — es ist die ausdrueckliche Erklaerung
     * einer Seite, dass ihre Adressen an der Cache-Nummer haengen. */
    const altN = m[5], neuN = String(Number(m[5]) + 1);
    const vMuster = new RegExp(`\\?v=${altN}(?!\\d)`, "g");
    const aMuster = new RegExp(`(ASSET_V\\s*=\\s*(['"\`]))${altN}\\2`, "g");
    let gezogen = 0, dateienGezogen = 0;
    for (const d of traegerDateien(rp)) {
      let t; try { t = readFileSync(d, "utf8"); } catch { continue; }
      const treffer = (t.match(vMuster) || []).length + (t.match(aMuster) || []).length;
      if (!treffer) continue;
      writeFileSync(d, t.replace(vMuster, `?v=${neuN}`).replace(aMuster, `$1${neuN}$2`));
      gezogen += treffer; dateienGezogen++;
    }
    /* Eine Meldung, die niemand liest, ist kein Bump — also steht auch hier
       die Zahl da, statt es still zu tun. */
    if (gezogen) {
      console.log(`        ↳ ?v= mitgezogen: ${gezogen} Stellen in ${dateienGezogen} Dateien  ${altN} → ${neuN}`);
    }

    /* ── ⚠ UND DIE PROBEN, DIE DIE CACHE-KENNUNG FESTNAGELN ──────────────
     *
     * Pflege-Liste § 18, viermal am 2026-10-15: Kim-sync prueft in
     * tests/smoke.mjs `CACHE ist kimsync-v19` — jeder Bump machte die Probe
     * rot, und jedes Mal wurde es von Hand nachgezogen.
     *
     * Gezogen wird NUR die VOLLE alte Kennung (`kimsync-v19`), nie eine
     * blosse Zahl: dieselbe Probe legt absichtlich einen Vorrat `kimsync-v4`
     * an, und der darf nicht wandern. Davor kein Wortzeichen, dahinter keine
     * Ziffer — `kimsync-v19` trifft nicht `kimsync-v190`. Und nur bei einer
     * Vorsilbe mit Buchstaben und mindestens drei Zeichen: eine Kennung wie
     * `v19` oder `19` stuende in jeder Probe fuer etwas anderes. */
    const altK = m[4] + altN, neuK = m[4] + neuN;
    if (m[4].length >= 3 && /[a-z]/i.test(m[4])) {
      const kMuster = new RegExp(`(?<![\\w-])${altK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d)`, "g");
      let proben = 0, probenDateienGezogen = 0;
      for (const d of probenDateien(rp)) {
        let t; try { t = readFileSync(d, "utf8"); } catch { continue; }
        const n = (t.match(kMuster) || []).length;
        if (!n) continue;
        writeFileSync(d, t.replace(kMuster, neuK));
        proben += n; probenDateienGezogen++;
      }
      if (proben) {
        console.log(`        ↳ Proben mitgezogen: ${proben} Stellen in ${probenDateienGezogen} Dateien  ${altK} → ${neuK}`);
      }
    }
  }
  return gebumpt;
}

function cacheStandNachziehen(rp, repo, gebumpt, offenHier) {
  const werkzeug = join(rp, "tools", "cache-stand.mjs");
  if (!existsSync(werkzeug)) return;
  if (!schreiben) {
    if (offenHier) console.log(`    ↳ beim Schreiben: nach dem Cache-Bump liefe hier tools/cache-stand.mjs (tests/cache-stand.json)`);
    return;
  }
  if (!gebumpt) return;
  try {
    const aus = execFileSync("node", [werkzeug], { cwd: rp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
    console.log(`        ↳ Cache-Stand nachgezogen: ${String(aus).trim().split("\n").pop()}`);
  } catch (e) {
    const grund = (String(e.stderr || "") + String(e.stdout || "")).trim().split("\n").pop() || e.message;
    cacheStandFehler.push({ repo, grund });
    console.error(`        ✗ CACHE-STAND GESCHEITERT in ${repo}: tools/cache-stand.mjs → ${grund}`);
    console.error(`          tests/cache-stand.json passt NICHT zur neuen CACHE_VERSION — der Waechter dort bleibt rot.`);
  }
}

export { cacheBump, cacheStandNachziehen };
