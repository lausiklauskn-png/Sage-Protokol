/* Erzeugt das Symbol der SBKIM-Demo als PNG — ohne Bild-Bibliothek, nur mit
 * node:zlib. Motiv: zwei Knoten, die sich gegenseitig fragen (Doppelpfeil).
 * Kein SVG: der Marktplatz nimmt für Karten nur PNG/JPG/WebP. */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const BG = [0x0b, 0x11, 0x16];
const GOLD = [0xf2, 0xb5, 0x44];
const GRUEN = [0x4a, 0xde, 0x80];
const LINIE = [0x3a, 0x4a, 0x5e];

function bild(N) {
  const px = new Uint8Array(N * N * 3);
  const s = N / 512; // Entwurf in 512er-Maßen, dann skaliert
  const set = (i, f, a) => {
    for (let k = 0; k < 3; k++) px[i + k] = Math.round(px[i + k] * (1 - a) + f[k] * a);
  };
  // Grund
  for (let i = 0; i < px.length; i += 3) set(i, BG, 1);

  const kreise = [
    { x: 168 * s, y: 200 * s, r: 62 * s, f: GOLD },
    { x: 344 * s, y: 312 * s, r: 62 * s, f: GRUEN }
  ];
  // Verbindungslinie zwischen den Mittelpunkten (weich, mit Antialiasing)
  const [a, b] = kreise;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const dick = 13 * s;

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = (y * N + x) * 3;
      const px0 = x + 0.5, py0 = y + 0.5;
      // Abstand zur Strecke
      let t = ((px0 - a.x) * dx + (py0 - a.y) * dy) / (len * len);
      t = Math.max(0, Math.min(1, t));
      const dl = Math.hypot(px0 - (a.x + t * dx), py0 - (a.y + t * dy));
      /* Die Linie endet AM Ring, sie laeuft nicht durch die Knoten hindurch —
         sonst liegt bei kleiner Anzeige ein Strich quer im Kreis. */
      const imKnoten = kreise.some((k) => Math.hypot(px0 - k.x, py0 - k.y) < k.r + 4 * s);
      const alphaL = imKnoten ? 0 : Math.max(0, Math.min(1, (dick / 2 - dl) + 0.5));
      if (alphaL > 0) set(i, LINIE, alphaL);
      // Kreise (Ring, nicht gefüllt — das wirkt bei 64 px noch als Form)
      for (const k of kreise) {
        const d = Math.hypot(px0 - k.x, py0 - k.y);
        const ring = 15 * s;
        const alpha = Math.max(0, Math.min(1, (ring / 2 - Math.abs(d - k.r)) + 0.5));
        if (alpha > 0) set(i, k.f, alpha);
        const kern = Math.max(0, Math.min(1, (k.r - 30 * s - d) + 0.5));
        if (kern > 0) set(i, k.f, kern * 0.85);
      }
    }
  }
  return px;
}

function png(N, px) {
  const roh = Buffer.alloc(N * (N * 3 + 1));
  for (let y = 0; y < N; y++) {
    roh[y * (N * 3 + 1)] = 0;                       // Filter „none"
    Buffer.from(px.buffer, y * N * 3, N * 3).copy(roh, y * (N * 3 + 1) + 1);
  }
  const tab = [...Array(256)].map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = tab[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const stueck = (typ, daten) => {
    const l = Buffer.alloc(4); l.writeUInt32BE(daten.length);
    const k = Buffer.concat([Buffer.from(typ), daten]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(k));
    return Buffer.concat([l, k, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8 bit, Truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    stueck('IHDR', ihdr),
    stueck('IDAT', deflateSync(roh, { level: 9 })),
    stueck('IEND', Buffer.alloc(0))
  ]);
}

for (const N of [192, 512]) {
  const datei = `/home/user/Sage-Protokol/sbkim-demo/icon-${N}.png`;
  writeFileSync(datei, png(N, bild(N)));
  console.log(datei);
}
