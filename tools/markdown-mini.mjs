/* markdown-mini.mjs — ein bewusst KLEINER Markdown-Leser für die Antragsmappe.
 *
 * WARUM SELBSTGEBAUT: die Mappe muss offline und ohne Laufzeit-Abhängigkeit
 * entstehen (netzweite Regel: keine CDNs, keine Runtime-Deps). Ein fremder
 * Leser wäre eine Abhängigkeit; ein großer wäre mehr Fläche, als diese neun
 * Dateien brauchen.
 *
 * WAS ER KANN — und nur das, weil nur das in den Quellen vorkommt:
 *   Überschriften · Absätze · Trennlinien · Tabellen · Zitatblöcke ·
 *   Aufzählungen (auch verschachtelt, auch Häkchen) · Nummernlisten ·
 *   Code-Blöcke · fett · kursiv · Code · Verweise · nackte Adressen.
 *
 * DIE GEFAHR, GEGEN DIE ER GEPRÜFT WIRD: ein Leser, der etwas VERSCHLUCKT.
 * Eine Ansicht ist keine zweite Fassung — aber ein Leser, der eine Zeile
 * unterschlägt, macht sie dazu. `tests/smoke_antragsmappe.mjs` verlangt
 * deshalb, dass JEDE nicht-leere Quellzeile mit ihrem Klartext in der Ausgabe
 * wiederauftaucht. Nicht "sieht gut aus" — nachgezählt.
 */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);

/* ── Inline ────────────────────────────────────────────────────────────────
   Reihenfolge ist Absicht: Code zuerst herausnehmen, damit ein Sternchenpaar
   INNERHALB von Backticks nicht als fett gelesen wird. */
// Der Platzhalter MUSS ein Zeichen sein, das im Fliesstext nicht vorkommen
// kann. Eine erste Fassung nahm ein Leerzeichen plus laufende Nummer plus
// Leerzeichen -- und haette damit jede nackte Zahl im Text durch einen
// Code-Schnipsel ersetzt oder geloescht. Genau die Sorte Fehler, die eine
// Ansicht zur zweiten Fassung macht.
const MARKE = '\u0000';

export function inline(text, verweis = (u) => u) {
  const code = [];
  let s = String(text).replace(/`([^`]+)`/g, (_, c) => {
    code.push(c);
    return MARKE + (code.length - 1) + MARKE;
  });

  s = escape(s);

  // [Text](Ziel)
  s = s.replace(/\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^)]*&quot;)?\)/g,
    (_, t, u) => '<a href="' + escape(verweis(u)) + '">' + t + '</a>');
  // <https://…> — nackte Adresse (nach escape steht dort &lt;…&gt;)
  s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g,
    (_, u) => '<a href="' + u + '">' + u + '</a>');
  // **fett** vor *kursiv*, sonst frisst das Sternchen-Paar sich selbst
  // Fett darf KURSIV enthalten. Mit /[^*]+/ scheiterte
  // "**Zu *specification gaming* und *reward hacking*:**" ganz -- und die
  // rohen Sternchen standen auf dem Schirm. Zugelassen ist deshalb jedes
  // Sternchen, dem KEIN zweites folgt; nicht-gierig, damit die naechste
  // Fett-Stelle nicht mitgeschluckt wird.
  s = s.replace(/\*\*((?:[^*]|\*(?!\*))+?)\*\*/g, '<strong>$1</strong>');
  // Kursiv darf ueber einen Zeilenumbruch gehen: ein Absatz kommt hier als
  // EIN String mit \n an, und in den Quellen laeuft mehr als eine
  // Hervorhebung ueber den Zeilenrand. Mit /[^*\n]+/ blieb dort das rohe
  // Sternchen stehen -- sichtbare Auszeichnung auf dem Schirm.
  s = s.replace(/(^|[\s(„»—-])\*([^*]+)\*/g, '$1<em>$2</em>');

  return s.replace(new RegExp(MARKE + '(\\d+)' + MARKE, 'g'),
    (_, i) => '<code>' + escape(code[+i]) + '</code>');
}

/* ── Block ─────────────────────────────────────────────────────────────── */

const einzug = (z) => z.length - z.replace(/^\s*/, '').length;

function listeSchreiben(eintraege, geordnet, verweis) {
  const tag = geordnet ? 'ol' : 'ul';
  const teile = eintraege.map((e) => {
    const haken = e.haken === null ? ''
      : '<span class="haken">' + (e.haken ? '&#9745;' : '&#9744;') + '</span> ';
    let inhalt = bloecke(e.zeilen, verweis);
    // Ein einzelner Absatz in einem Listenpunkt bleibt ohne <p>, sonst
    // reißt die Liste optisch auseinander.
    const nurEinAbsatz = /^<p>[\s\S]*<\/p>$/.test(inhalt)
      && inhalt.indexOf('</p>') === inhalt.length - 4;
    if (nurEinAbsatz) inhalt = inhalt.slice(3, -4);
    return '<li>' + haken + inhalt + '</li>';
  });
  return '<' + tag + '>' + teile.join('') + '</' + tag + '>';
}

function tabelleSchreiben(zeilen, verweis) {
  const zerlegen = (z) => {
    let s = z.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|').map((c) => c.trim());
  };
  const kopf = zerlegen(zeilen[0]);
  const rest = zeilen.slice(2).map(zerlegen);
  const th = kopf.map((c) => '<th>' + inline(c, verweis) + '</th>').join('');
  const tr = rest.map((r) =>
    '<tr>' + r.map((c) => '<td>' + inline(c, verweis) + '</td>').join('') + '</tr>').join('');
  return '<div class="tabelle"><table><thead><tr>' + th
    + '</tr></thead><tbody>' + tr + '</tbody></table></div>';
}

export function bloecke(zeilen, verweis = (u) => u) {
  const aus = [];
  let i = 0;

  while (i < zeilen.length) {
    const z = zeilen[i];

    if (!z.trim()) { i++; continue; }

    // Code-Block
    if (/^\s*```/.test(z)) {
      const inhalt = [];
      i++;
      while (i < zeilen.length && !/^\s*```/.test(zeilen[i])) inhalt.push(zeilen[i++]);
      i++;
      aus.push('<pre><code>' + escape(inhalt.join('\n')) + '</code></pre>');
      continue;
    }

    // Trennlinie
    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(z)) { aus.push('<hr>'); i++; continue; }

    // Überschrift
    const u = z.match(/^(#{1,6})\s+(.*)$/);
    if (u) {
      const stufe = u[1].length;
      aus.push('<h' + stufe + '>' + inline(u[2].trim(), verweis) + '</h' + stufe + '>');
      i++;
      continue;
    }

    // Zitatblock
    if (/^\s*>/.test(z)) {
      const innen = [];
      while (i < zeilen.length && /^\s*>/.test(zeilen[i])) {
        innen.push(zeilen[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      aus.push('<blockquote>' + bloecke(innen, verweis) + '</blockquote>');
      continue;
    }

    // Tabelle: Kopfzeile + Trennzeile aus Strichen und Doppelpunkten
    if (/^\s*\|/.test(z) && i + 1 < zeilen.length
      && /^\s*\|[\s:|-]+\|?\s*$/.test(zeilen[i + 1])) {
      const t = [];
      while (i < zeilen.length && /^\s*\|/.test(zeilen[i])) t.push(zeilen[i++]);
      aus.push(tabelleSchreiben(t, verweis));
      continue;
    }

    // Aufzählung / Nummernliste
    if (/^(\s*)([-*+]|\d+\.)\s+/.test(z)) {
      const grund = einzug(z);
      const geordnet = /^\s*\d/.test(z);
      const eintraege = [];
      while (i < zeilen.length) {
        const p = zeilen[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
        if (p && einzug(zeilen[i]) === grund && (/\d/.test(p[2]) === geordnet)) {
          let text = p[3];
          let haken = null;
          const h = text.match(/^\[( |x|X)\]\s+(.*)$/);
          if (h) { haken = h[1].toLowerCase() === 'x'; text = h[2]; }
          const eigene = [text];
          i++;
          // Fortsetzungs- und Unterzeilen gehören zu diesem Punkt
          while (i < zeilen.length) {
            const f = zeilen[i];
            if (!f.trim()) {
              const naechste = zeilen[i + 1] || '';
              if (naechste.trim() && einzug(naechste) > grund) { eigene.push(''); i++; continue; }
              break;
            }
            if (einzug(f) > grund) { eigene.push(f.slice(grund + 2)); i++; continue; }
            break;
          }
          eintraege.push({ zeilen: eigene, haken });
          continue;
        }
        break;
      }
      aus.push(listeSchreiben(eintraege, geordnet, verweis));
      continue;
    }

    // Absatz
    const abs = [];
    while (i < zeilen.length && zeilen[i].trim()
      && !/^\s*(#{1,6}\s|>|```|\|)/.test(zeilen[i])
      && !/^\s*([-*+]|\d+\.)\s/.test(zeilen[i])
      && !/^\s*(---+|\*\*\*+|___+)\s*$/.test(zeilen[i])) {
      abs.push(zeilen[i++]);
    }
    if (abs.length) aus.push('<p>' + inline(abs.join('\n'), verweis) + '</p>');
    else i++;   // nichts erkannt: nicht hängenbleiben
  }

  return aus.join('\n');
}

export function markdown(text, verweis) {
  return bloecke(String(text).replace(/\r\n?/g, '\n').split('\n'), verweis);
}
