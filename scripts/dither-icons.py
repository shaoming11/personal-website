"""Generate the dithered, glowing favicon set (smiley) and og media (robot hand peace sign).

Run: python3 scripts/dither-icons.py   (needs Pillow, numpy, ffmpeg, macOS Menlo font)
Writes public/icon.svg, icon-32x32.png, apple-icon.png, og.png, og.mp4.
"""
import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PUBLIC = Path(__file__).resolve().parent.parent / "public"
FONT = "/System/Library/Fonts/Menlo.ttc"  # index 1 = Bold
TINT = np.array([255, 64, 56], dtype=float)  # red
DIM = 0.42  # brightness of the middle dither level
SS = 4  # supersampling for anti-aliased shapes before dithering

BAYER = np.array([
    0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
    12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
    15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
]).reshape(8, 8)


def font(size):
    return ImageFont.truetype(FONT, size, index=1)


def glow(mask, big, small):
    """White-on-black mask -> luminance with a soft halo (like canvas shadowBlur)."""
    a = np.asarray(mask, dtype=float) / 255
    b1 = np.asarray(mask.filter(ImageFilter.GaussianBlur(big)), dtype=float) / 255
    b2 = np.asarray(mask.filter(ImageFilter.GaussianBlur(small)), dtype=float) / 255
    return np.clip(a + 1.6 * b1 + 0.8 * b2, 0, 1)


def halo(mask, sil, big, small):
    """Glow only outside the silhouette, so dark details inside the shape stay dark."""
    inside = np.asarray(sil, dtype=float) / 255
    a = np.asarray(mask, dtype=float) / 255
    return inside * a + (1 - inside) * glow(mask, big, small)


def dither(lum):
    """3-level ordered dither: off / dim / full, tinted."""
    h, w = lum.shape
    t = (BAYER[np.arange(h)[:, None] % 8, np.arange(w)[None, :] % 8] + 0.5) / 64
    v = lum ** 0.9 * 2
    base = np.floor(v)
    q = np.clip(base + ((v - base) > t), 0, 2)
    k = np.where(q == 2, 1.0, np.where(q == 1, DIM, 0.0))
    return (k[..., None] * TINT).astype(np.uint8), q


def canvas(w, h):
    """Supersampled drawing surface; call down() to get the grid-res mask."""
    img = Image.new("L", (w * SS, h * SS), 0)
    return img, ImageDraw.Draw(img)


def down(img):
    return img.resize((img.width // SS, img.height // SS), Image.BOX)


# ---------- favicon: smiley ----------

def smiley(n):
    """Filled glowing face with dark eyes and smile (reads at 16px)."""
    img, d = canvas(n, n)
    u = n * SS
    r, c = 0.4 * u, u / 2
    d.ellipse((c - r, c - r, c + r, c + r), fill=255)
    sil = down(img)
    ew, eh = max(1.3, 0.09 * n) * SS, max(2.2, 0.16 * n) * SS
    for ex in (0.37, 0.63):
        d.ellipse((ex * u - ew / 2, 0.4 * u - eh / 2, ex * u + ew / 2, 0.4 * u + eh / 2), fill=0)
    d.arc((0.27 * u, 0.24 * u, 0.73 * u, 0.73 * u), 30, 150, fill=0, width=round(max(1.4, n * 0.085) * SS))
    return dither(halo(down(img), sil, n * 0.12, n * 0.03))


def png(rgb, scale, path):
    img = Image.fromarray(rgb)
    img.resize((img.width * scale, img.height * scale), Image.NEAREST).save(path)


def svg(rgb, q, path):
    n = q.shape[0]
    rects = []
    for y in range(n):
        x = 0
        while x < n:
            if q[y, x] == 0:
                x += 1
                continue
            x0 = x
            while x < n and q[y, x] == q[y, x0]:
                x += 1
            r, g, b = rgb[y, x0]
            rects.append(f'<rect x="{x0}" y="{y}" width="{x - x0}" height="1" fill="#{r:02x}{g:02x}{b:02x}"/>')
    path.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" shape-rendering="crispEdges">'
        f'<rect width="{n}" height="{n}" rx="{n * 0.2:g}" fill="#000"/>{"".join(rects)}</svg>\n'
    )


# ---------- og: robot hand doing a peace sign ----------

W, H, SCALE = 400, 210, 3  # dither grid, upscaled 3x -> 1200x630
FPS, SECONDS = 24, 4


def ease(t):
    t = min(max(t, 0), 1)
    return t * t * (3 - 2 * t)


def capsule(d, a, b, w, fill):
    d.line((a, b), fill=fill, width=round(w))
    for x, y in (a, b):
        d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=fill)


def finger(d, base, angle, lengths, curl, width):
    """Segmented robot finger seen palm-on. Curling foreshortens and folds segments down."""
    s = SS
    dx, dy = math.sin(math.radians(angle)), -math.cos(math.radians(angle))
    bends = (85, 100, 70)
    theta, p = 0.0, base
    for L, bend in zip(lengths, bends):
        theta += curl * bend
        k = L * math.cos(math.radians(theta))
        q = (p[0] + dx * k, p[1] + dy * k)
        # joint gap: shrink each segment a little at both ends
        g = 1.6 if abs(k) > 3.2 else 0
        u = (q[0] - p[0], q[1] - p[1])
        n = math.hypot(*u) or 1
        a = (p[0] + u[0] / n * g, p[1] + u[1] / n * g)
        b = (q[0] - u[0] / n * g, q[1] - u[1] / n * g)
        capsule(d, (a[0] * s, a[1] * s), (b[0] * s, b[1] * s), (width + 3) * s, 0)  # dark outline
        capsule(d, (a[0] * s, a[1] * s), (b[0] * s, b[1] * s), width * s, 255)
        p = q


def hand(t):
    """Hand mask at time t (seconds) on the W x H grid."""
    # timeline: fist -> peace (pop) -> hold + bounce -> fist
    up = ease((t - 0.5) / 0.45)
    downc = ease((t - 3.05) / 0.45)
    open_ = up * (1 - downc)
    bounce = math.sin((t - 1.0) * 2 * math.pi * 1.25) * (1 if 1.0 < t < 2.95 else 0) * open_
    tilt = -7 * open_ + 1.5 * bounce

    img, d = canvas(W, H)
    s = SS
    cx = 100
    # wrist: stacked bands
    for i, (y0, y1) in enumerate(((171, 183), (186, 198), (201, 214))):
        d.rounded_rectangle(((cx - 22 + i) * s, y0 * s, (cx + 22 - i) * s, y1 * s), radius=3 * s, fill=255)
    # palm with a bolt
    d.rounded_rectangle(((cx - 38) * s, 108 * s, (cx + 38) * s, 168 * s), radius=12 * s, fill=255)
    d.ellipse(((cx - 6) * s, 132 * s, (cx + 6) * s, 144 * s), fill=0)
    d.ellipse(((cx - 3) * s, 135 * s, (cx + 3) * s, 141 * s), fill=255)

    fw = 14
    spread = 11 * open_ + 3 * bounce
    curls = (1 - open_, 1 - open_, 1, 1)  # index, middle, ring, pinky
    xs = (cx - 28, cx - 9.5, cx + 9.5, cx + 28)
    scales = (1.0, 1.1, 0.95, 0.8)
    angles = (-spread, spread, 4, 8)
    # curled fingers first, then the thumb over them, then the raised two on top
    for i in (2, 3):
        finger(d, (xs[i], 110), angles[i], [L * scales[i] for L in (30, 22, 17)], curls[i], fw)
    th = 62 + 6 * (1 - open_)  # thumb folded across the palm
    finger(d, (cx - 34, 150), th, (22, 17), 0.15, fw + 1)
    for i in (0, 1):
        finger(d, (xs[i], 110), angles[i], [L * scales[i] for L in (30, 22, 17)], curls[i], fw)

    img = img.rotate(tilt, resample=Image.BICUBIC, center=(cx * s, 200 * s))
    img = img.transform(img.size, Image.AFFINE, (1, 0, 0, 0, 1, 10 * s))  # nudge up
    m = down(img)
    sil = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))  # close joint gaps
    return m, sil


def text_layer():
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    left, right = 206, W - 24
    size = 80
    while size > 10:
        f = font(size)
        if max(d.textlength(t, font=f) for t in ("Shaoming", "Wu")) <= right - left:
            break
        size -= 1
    gap, sub_gap = size * 1.05, 30
    y1 = H / 2 - (size * 0.73 + gap + sub_gap) / 2 + size * 0.73
    d.text((left, y1), "Shaoming", fill=255, font=f, anchor="ls")
    d.text((left, y1 + gap), "Wu", fill=255, font=f, anchor="ls")
    lum = glow(m, 3.5, 1)
    sub = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sub).text((left + 1, y1 + gap + sub_gap), "shaomingwu.com", fill=255, font=font(15), anchor="ls")
    return np.maximum(lum, np.asarray(sub, dtype=float) / 255 * 0.55)


def og_frame(t, text):
    rgb, _ = dither(np.maximum(halo(*hand(t), 6, 1.5), text))
    return Image.fromarray(rgb).resize((W * SCALE, H * SCALE), Image.NEAREST)


def og(png_path, mp4_path):
    text = text_layer()
    og_frame(2.0, text).save(png_path)
    with tempfile.TemporaryDirectory() as tmp:
        for i in range(FPS * SECONDS):
            og_frame(i / FPS, text).save(f"{tmp}/f{i:03d}.png")
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{tmp}/f%03d.png",
             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow",
             "-movflags", "+faststart", str(mp4_path)],
            check=True,
        )


if __name__ == "__main__":
    rgb32, q32 = smiley(32)
    svg(rgb32, q32, PUBLIC / "icon.svg")
    png(rgb32, 1, PUBLIC / "icon-32x32.png")
    png(smiley(45)[0], 4, PUBLIC / "apple-icon.png")  # 180x180
    og(PUBLIC / "og.png", PUBLIC / "og.mp4")
    print("wrote icon.svg, icon-32x32.png, apple-icon.png, og.png, og.mp4")
