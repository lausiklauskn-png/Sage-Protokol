#!/usr/bin/env python3
"""licht-film-bauen.py — macht aus einem Clip eine reine Licht-Schicht für ein Standbild.

Der Clip stammt aus dem Bild (Startbild), zeigt aber einen anderen Ausschnitt und ist
unschärfer als das Bild. Über das Bild gelegt, würde er es ersetzen. Stattdessen:

  1. ausrichten  — wo liegt das Bild im Clip (Maßstab und Versatz, gesucht, nicht angenommen)
  2. abziehen    — je Bildpunkt das Dunkelste über die Zeit abziehen: übrig bleibt nur,
                   was heller wird (Lichter, Funken), alles Ruhende wird schwarz
  3. einpassen   — auf den Ausschnitt, den der Rahmen der Seite vom Bild zeigt (object-fit: cover)
  4. Schleife    — hin und zurück, ohne Ton

Die Seite legt das Ergebnis mit `mix-blend-mode: screen` über das Bild: schwarz ändert nichts.

  python3 tools/licht-film-bauen.py <bild> <clip> <ziel.mp4> [--rahmen 4:3] [--breite 640]

Braucht numpy, Pillow und ffmpeg. Gibt die gefundene Lage und den Restfehler aus; ein hoher
Restfehler heißt, dass der Clip das Bild nicht mehr zeigt.
"""
import argparse
import subprocess
import sys

import numpy as np
from PIL import Image


def clip_lesen(pfad):
    info = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-of", "csv=p=0", pfad],
        capture_output=True, text=True, check=True).stdout.strip().split(",")
    w, h = int(info[0]), int(info[1])
    roh = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", pfad, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(roh, np.uint8).reshape(-1, h, w, 3)


def fehler(bild_g, clip_g, s, ox, oy):
    """Mittlerer Abstand zwischen Clip-Bild und dem Bild, das mit Maßstab s bei (ox, oy) liegt."""
    bw, bh = max(1, round(bild_g.width * s)), max(1, round(bild_g.height * s))
    cw, ch = clip_g.shape[1], clip_g.shape[0]
    x0, y0 = max(0, ox), max(0, oy)
    x1, y1 = min(cw, ox + bw), min(ch, oy + bh)
    if (x1 - x0) * (y1 - y0) < 0.45 * cw * ch:
        return None
    b = np.asarray(bild_g.resize((bw, bh), Image.BILINEAR), np.float32)
    a = b[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    c = clip_g[y0:y1, x0:x1]
    # brightness offset between clip and picture must not decide the position
    return float(np.mean(np.abs((a - a.mean()) - (c - c.mean()))))


def ausrichten(bild, erstes):
    """Sucht Maßstab und Versatz des Bildes im Clip, erst grob (verkleinert), dann fein."""
    best = None
    for teiler, schritt_s, schritt_p in ((8, 0.02, 2), (4, 0.008, 1), (2, 0.004, 1), (1, 0.002, 1)):
        cw, ch = erstes.width // teiler, erstes.height // teiler
        clip_g = np.asarray(erstes.convert("L").resize((cw, ch), Image.BILINEAR), np.float32)
        bild_g = bild.convert("L").resize((bild.width // teiler, bild.height // teiler), Image.BILINEAR)
        if best is None:
            s_min = 0.5 * cw / bild_g.width
            s_max = 1.8 * max(cw / bild_g.width, ch / bild_g.height)
            kandidaten = [(s, ox, oy)
                          for s in np.arange(s_min, s_max, schritt_s * s_min)
                          for ox in range(-int(bild_g.width * s), cw, schritt_p)
                          for oy in range(-int(bild_g.height * s), ch, schritt_p)]
        else:
            _, s0, ox0, oy0, t0 = best
            f = t0 / teiler
            kandidaten = [(s0 * (1 + ds * schritt_s), round(ox0 * f) + dx, round(oy0 * f) + dy)
                          for ds in range(-4, 5) for dx in range(-3, 4) for dy in range(-3, 4)]
        lauf = None
        for s, ox, oy in kandidaten:
            e = fehler(bild_g, clip_g, s, ox, oy)
            if e is not None and (lauf is None or e < lauf[0]):
                lauf = (e, s, ox, oy, teiler)
        if lauf is None:
            sys.exit("Ausrichten gescheitert: keine Lage mit genug Überdeckung gefunden.")
        best = lauf
    e, s, ox, oy, _ = best
    return e, s, ox, oy   # s: clip pixels per picture pixel; (ox, oy): picture origin in the clip


def main():
    p = argparse.ArgumentParser()
    p.add_argument("bild"), p.add_argument("clip"), p.add_argument("ziel")
    p.add_argument("--rahmen", default="4:3")
    p.add_argument("--breite", type=int, default=640)
    p.add_argument("--schwelle", type=int, default=10, help="Rauschen unter diesem Wert wird schwarz")
    p.add_argument("--staerke", type=float, default=1.6)
    p.add_argument("--vorschau", help="schreibt ein JPEG: Bild plus hellste Licht-Schicht")
    p.add_argument("--ohne-rueck", action="store_true", help="der Clip ist schon eine Hin-und-zurück-Schleife")
    a = p.parse_args()

    bild = Image.open(a.bild).convert("RGB")
    clip = clip_lesen(a.clip)
    e, s, ox, oy = ausrichten(bild, Image.fromarray(clip[0]))
    print(f"Lage: Maßstab {s:.4f}, Versatz ({ox}, {oy}), Restfehler {e:.1f} von 255, {len(clip)} Bilder")

    # light layer: what gets brighter than the darkest moment of each pixel
    dunkel = clip.min(axis=0).astype(np.int16)
    licht = np.clip((clip.astype(np.int16) - dunkel - a.schwelle) * a.staerke, 0, 255).astype(np.uint8)

    # the part of the picture the page frame shows (object-fit: cover, centred)
    rw_, rh_ = (int(x) for x in a.rahmen.split(":"))
    if bild.width / bild.height > rw_ / rh_:
        sh = bild.height; sw = sh * rw_ / rh_
    else:
        sw = bild.width; sh = sw * rh_ / rw_
    sx, sy = (bild.width - sw) / 2, (bild.height - sh) / 2
    W = a.breite; H = round(W * rh_ / rw_); H += H % 2
    k = W / sw                      # output pixels per picture pixel
    m = k / s                       # output pixels per clip pixel
    cw, ch = clip.shape[2], clip.shape[1]
    zw, zh = round(cw * m), round(ch * m)
    px, py = round((-ox / s - sx) * k), round((-oy / s - sy) * k)

    # soft edge where the clip ends inside the frame
    rand = max(4, round(0.06 * min(zw, zh)))
    mx = np.minimum(np.arange(zw), np.arange(zw)[::-1]).clip(0, rand) / rand
    my = np.minimum(np.arange(zh), np.arange(zh)[::-1]).clip(0, rand) / rand
    maske = (my[:, None] * mx[None, :])[:, :, None]

    aus = np.zeros((len(licht), H, W, 3), np.uint8)
    x0, y0, x1, y1 = max(0, px), max(0, py), min(W, px + zw), min(H, py + zh)
    for i, f in enumerate(licht):
        g = np.asarray(Image.fromarray(f).resize((zw, zh), Image.BILINEAR), np.float32) * maske
        aus[i, y0:y1, x0:x1] = g[y0 - py:y1 - py, x0 - px:x1 - px].astype(np.uint8)
    print(f"Rahmen {W}×{H}, Clip deckt {100 * (x1 - x0) * (y1 - y0) / (W * H):.0f} % davon")

    schleife = aus if a.ohne_rueck else np.concatenate([aus, aus[-2:0:-1]])
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
         "-r", "24", "-i", "-", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "30",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.ziel],
        input=schleife.tobytes(), check=True)

    if a.vorschau:
        hell = aus[int(np.argmax(aus.reshape(len(aus), -1).mean(axis=1)))].astype(np.float32)
        grund = np.asarray(bild.crop((round(sx), round(sy), round(sx + sw), round(sy + sh)))
                           .resize((W, H), Image.LANCZOS), np.float32)
        misch = 255 - (255 - grund) * (255 - hell) / 255          # screen
        Image.fromarray(np.concatenate([grund, misch], axis=1).astype(np.uint8)).save(a.vorschau, quality=85)


if __name__ == "__main__":
    main()
