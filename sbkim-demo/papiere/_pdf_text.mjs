// Liest den Text aus einem PDF — vollständig, oder gar nicht.
//
// ── WARUM DIESE DATEI EXISTIERT ─────────────────────────────────────────────
//
// Am 2026-08-15 wurde gemeldet, in den Papieren stehe ein bestimmter Name
// nicht mehr drin. Die Meldung war falsch, und zwar auf die gefährlichste
// Art: gesucht wurde in der Datei, nicht im Inhalt. PDF-Text liegt gepackt
// vor — ein grep findet dort grundsätzlich nichts, egal was drinsteht. Das
// „0 Treffer" war keine Aussage, sondern eine Blindstelle, die aussah wie
// eine Aussage. Nachgefragt wurde von Klaus; dann kamen 35 Treffer heraus.
//
// Der zweite Anlauf las die alten PDFs richtig — und scheiterte an den NEUEN.
// Die kommen aus Chromium und speichern Text nicht als lesbare `(Wort) Tj`,
// sondern als `<0044004100530053> Tj`: Glyph-Nummern eines eingebetteten
// Schrift-Ausschnitts. Wer die nur nach Buchstaben absucht, findet wieder
// nichts — und würde das wieder für ein Ergebnis halten. Zweimal derselbe
// Fehler in zwei Gestalten.
//
// Deshalb geht dieser Leser den vollen Weg: Seite → Schrift-Tabelle →
// ToUnicode-Zuordnung → Glyph-Nummern zurück in Buchstaben. Und er sagt
// dabei ausdrücklich, WIE VIEL er nicht lesen konnte. Eine Fundstelle-Suche
// darf sich nur auf ihn stützen, wenn diese Zahl null ist.
//
// Rückgabe: { text, seiten, ungeoeffneteStroeme, unlesbareZeichen }

import { inflateSync } from 'node:zlib';

// Objekt-Anfänge einsammeln. Die führende Ziffern-Sperre ist keine Zierde:
// ohne sie trifft die Suche nach „6 0 obj" auch das „16 0 obj" — beim ersten
// Anlauf hat genau das drei Schriften als „ohne Zuordnung" gemeldet, die eine
// hatten.
function objekte(roh) {
  const s = roh.toString('latin1');
  const karte = new Map();
  const re = /(?<![0-9])(\d+) 0 obj/g;
  let m;
  while ((m = re.exec(s)) !== null) karte.set(Number(m[1]), m.index + m[0].length);
  return { s, karte };
}

function koerper(s, ab) {
  const bis = s.indexOf('endobj', ab);
  return s.slice(ab, bis < 0 ? ab + 4000 : bis);
}

function strom(roh, s, ab) {
  const i = s.indexOf('stream', ab);
  if (i < 0) return null;
  let a = i + 6;
  if (s[a] === '\r') a++;
  if (s[a] === '\n') a++;
  const e = s.indexOf('endstream', a);
  if (e < 0) return null;
  let b = roh.subarray(a, e);
  while (b.length && (b[b.length - 1] === 10 || b[b.length - 1] === 13)) b = b.subarray(0, -1);
  try { return inflateSync(b); } catch { return null; }
}

// ToUnicode-Tabelle: Glyph-Nummer → Zeichen.
function cmap(text) {
  const karte = new Map();
  for (const blk of text.match(/beginbfchar([\s\S]*?)endbfchar/g) || []) {
    const re = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let m;
    while ((m = re.exec(blk)) !== null) {
      karte.set(parseInt(m[1], 16), hexZuText(m[2]));
    }
  }
  for (const blk of text.match(/beginbfrange([\s\S]*?)endbfrange/g) || []) {
    const re = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let m;
    while ((m = re.exec(blk)) !== null) {
      const von = parseInt(m[1], 16), bis = parseInt(m[2], 16), ziel = parseInt(m[3], 16);
      for (let i = von; i <= bis && i - von < 4096; i++) {
        karte.set(i, String.fromCodePoint(ziel + (i - von)));
      }
    }
  }
  return karte;
}

function hexZuText(h) {
  let t = '';
  for (let i = 0; i + 3 < h.length + 1; i += 4) t += String.fromCharCode(parseInt(h.substr(i, 4), 16));
  return t;
}

export function pdfText(roh) {
  const { s, karte } = objekte(roh);
  const body = n => (karte.has(n) ? koerper(s, karte.get(n)) : '');

  // Schrift → Zuordnungstabelle
  const tabellen = new Map();
  for (const n of karte.keys()) {
    const b = body(n);
    const tu = b.match(/\/ToUnicode (\d+) 0 R/);
    if (!tu) continue;
    const ziel = Number(tu[1]);
    if (!karte.has(ziel)) continue;
    const st = strom(roh, s, karte.get(ziel));
    if (st) tabellen.set(n, cmap(st.toString('latin1')));
  }

  let text = '', seiten = 0, zu = 0, unlesbar = 0;

  for (const n of karte.keys()) {
    const b = body(n);
    if (!/\/Type\s*\/Page(?![sA-Za-z])/.test(b)) continue;
    seiten++;

    // Name → Tabelle für genau diese Seite. Namen sind seitenweise vergeben;
    // eine seitenübergreifende Sammel-Tabelle würde Glyph-Nummern aus
    // verschiedenen Schrift-Ausschnitten vermischen und Kauderwelsch liefern.
    const namen = new Map();
    const fdict = b.match(/\/Font\s*<<([^>]*)>>/);
    if (fdict) {
      const re = /\/(F\d+)\s+(\d+) 0 R/g;
      let m;
      while ((m = re.exec(fdict[1])) !== null) namen.set(m[1], tabellen.get(Number(m[2])) || null);
    }

    const c = b.match(/\/Contents (\d+) 0 R/);
    if (!c || !karte.has(Number(c[1]))) { zu++; continue; }
    const inhalt = strom(roh, s, karte.get(Number(c[1])));
    if (!inhalt) { zu++; continue; }

    let aktuell = null;
    const re = /\/(F\d+)\s+[\d.]+\s+Tf|<([0-9A-Fa-f]+)>\s*(?:Tj|TJ)?|\(((?:\\.|[^\\()])*)\)\s*Tj|T\*|TD|Td/g;
    let m;
    const inh = inhalt.toString('latin1');
    while ((m = re.exec(inh)) !== null) {
      if (m[1]) { aktuell = namen.get(m[1]); continue; }
      if (m[2] !== undefined) {
        const h = m[2];
        if (!aktuell) { unlesbar += h.length / 4; continue; }
        for (let i = 0; i + 3 < h.length + 1; i += 4) {
          const g = parseInt(h.substr(i, 4), 16);
          const z = aktuell.get(g);
          if (z === undefined) unlesbar++; else text += z;
        }
        continue;
      }
      if (m[3] !== undefined) { text += m[3].replace(/\\([()\\])/g, '$1'); continue; }
      text += '\n';
    }
    text += '\n';
  }

  return { text, seiten, ungeoeffneteStroeme: zu, unlesbareZeichen: unlesbar };
}
