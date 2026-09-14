/*
 * Der Text-Leser für Modul 16b — EINE Stelle, an der entschieden wird, was ein
 * Anzeigetext ist.
 *
 * ⚠ ER WIRD GETEILT, DAMIT ER NICHT ZWEIMAL EXISTIERT. Probe und Gegenprobe
 * fragen dasselbe; zwei Fassungen desselben Lesers liefen auseinander, und dann
 * misst die Gegenprobe etwas anderes als der Wächter, den sie prüft.
 *
 * Gelesen wird mit einem Zeichen-Automaten, nicht mit einem Regex: ein Regex
 * über JS-Zeichenketten stolpert über Anführungszeichen IN Anführungszeichen.
 */

/** Alle Zeichenketten-Literale samt Position und dem, was davor steht. */
export function literale(src) {
  const aus = [];
  let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "/") { while (i < n && src[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { i += 2; while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++; i += 2; continue; }
    if (c === '"' || c === "'") {
      const q = c; const start = i; i++; let s = "";
      while (i < n) {
        if (src[i] === "\\") { s += src[i + 1] === "n" ? "\n" : src[i + 1]; i += 2; continue; }
        if (src[i] === q) { i++; break; }
        s += src[i]; i++;
      }
      /* Was steht unmittelbar davor? Ein kurzes Stück Quelltext, nicht drei
       * geratene Zeichen — `SORT(` endet auch auf `T(`. */
      const davor = src.slice(Math.max(0, start - 24), start).replace(/\s+$/, "");
      aus.push({ text: s, start, davor });
      continue;
    }
    i++;
  }
  return aus;
}

/** Ist das ein Text, den ein Mensch auf dem Schirm liest? */
export function istAnzeigetext(roh) {
  /* Markup ist Gerüst, kein Text: Tags entfernen, der Rest ist Inhalt.
   * Ohne diesen Schritt rutschte `<b>Identität erzeugen</b>` durch, nur weil
   * es mit einer spitzen Klammer anfängt. */
  let s = roh.replace(/<[^>]*>/g, " ");
  /* ⚠ UND EIN LITERAL KANN MITTEN IN EINEM TAG ANFANGEN ODER AUFHÖREN. Das
     Markup wird zusammengesetzt, also steht `<button … style="` in der einen
     Zeichenkette und `">` in der nächsten. Wer nur vollständige Tags entfernt,
     hält `button type id style` für einen deutschen Satz — genau so ist dieser
     Wächter beim ersten Lauf rot geworden. */
  s = s.replace(/<[^<>]*$/, " ").replace(/^[^<>]*>/, " ");
  /* CSS-Deklarationen entfernen (`display:block;` und Geschwister). */
  s = s.replace(/[a-z-]+\s*:\s*[^;]*;/g, " ");
  s = s.replace(/\{\d+\}/g, " ").trim();
  if (!s) return false;
  if (/[äöüÄÖÜß]/.test(s)) return true;                       // deutscher Buchstabe
  if (/\b[A-ZÄÖÜ][a-zäöü]{2,}/.test(s)) return true;          // großgeschriebenes Wort
  if (/\b[A-Za-zÄÖÜäöü]{3,}\s+[A-Za-zÄÖÜäöü]{3,}\b/.test(s)) return true;  // Wortpaar
  return false;
}

/** Ein Literal, das VERGLICHEN wird, ist ein Wert und kein Anzeigetext —
 * `e.key === "Escape"` gehört nicht in eine Übersetzungstabelle. Gemessen wird
 * der Kontext, nicht eine Liste von Ausnahmen: eine Liste wächst still. */
export function istVergleich(l) {
  return /(===|!==|==|!=)$/.test(l.davor);
}

/** Die EINZIGE Ausnahme, und sie steht hier namentlich: die Direktive am
 * Datei-Anfang. Sie ist Sprache, kein Text. Wer eine zweite braucht, trägt sie
 * hier ein — und das steht dann im Verlauf. */
export const AUSNAHMEN = ["use strict"];

/** Steht das Literal direkt hinter `T(` oder `Tf(`?
 * ⚠ Die Wortgrenze davor ist Pflicht: ohne sie zählte `SORT("…")` als
 * übersetzt. Dieselbe Familie wie `.gitignore` statt `.git`. */
export function durchT(l) {
  return /(?:^|[^A-Za-z0-9_$.])(?:T|Tf)\($/.test(l.davor);
}
