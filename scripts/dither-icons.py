"""Generate the black + red favicon set (stone statue photo) and og media (robotic hand waving).

Run: python3 scripts/dither-icons.py   (needs Pillow, numpy, ffmpeg, macOS Menlo font)
Writes public/icon.svg, icon-32x32.png, apple-icon.png, og.png, og.mp4.
"""
import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

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


# ---------- favicon: stone statue with Fuji behind, flat black + red tones ----------

SOURCE = Path(__file__).resolve().parent / "assets" / "favicon-source.png"
STATUE_CROP = (95, 128, 305, 338)  # square around the statue, Fuji's peak along the top


def statue(n, levels=4):
    """Photo -> n x n grayscale -> `levels` flat tones of the site red (black .. full red)."""
    img = Image.open(SOURCE).convert("RGB").crop(STATUE_CROP)
    img = img.filter(ImageFilter.GaussianBlur(img.width / n * 0.07))
    g = ImageOps.autocontrast(img.convert("L"), cutoff=1).resize((n, n), Image.BOX)
    q = np.round(np.asarray(g, dtype=float) / 255 * (levels - 1))
    rgb = (q[..., None] / (levels - 1) * TINT).astype(np.uint8)
    return rgb, q


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


# ---------- og: robotic hand waving, name with a roving spotlight ----------

W, H, SCALE = 400, 210, 3  # dither grid, upscaled 3x -> 1200x630
FPS, SECONDS = 24, 2.5  # one wave per second
HAND_SCALE = 1.12
NAME_SIZE = 36


def ease(t):
    t = min(max(t, 0), 1)
    return t * t * (3 - 2 * t)


def window(t, a, b, c, d):
    """0 -> 1 between a..b, back to 0 between c..d."""
    return ease((t - a) / (b - a)) * (1 - ease((t - c) / (d - c)))


class Pen:
    """Tiny canvas-style 2D transform stack drawing filled shapes onto a supersampled mask."""

    def __init__(self, img):
        self.d = ImageDraw.Draw(img)
        self.m = np.eye(3)
        self.stack = []

    def save(self):
        self.stack.append(self.m.copy())

    def restore(self):
        self.m = self.stack.pop()

    def translate(self, x, y):
        self.m = self.m @ np.array([[1, 0, x], [0, 1, y], [0, 0, 1]])

    def rotate(self, rad):
        c, s = math.cos(rad), math.sin(rad)
        self.m = self.m @ np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

    def scale(self, k):
        self.m = self.m @ np.diag([k, k, 1])

    def _pts(self, pts):
        p = np.c_[np.asarray(pts, dtype=float), np.ones(len(pts))] @ self.m.T
        return [(x * SS, y * SS) for x, y, _ in p]

    def _unit(self):
        return math.hypot(self.m[0, 0], self.m[1, 0]) * SS

    def poly(self, pts, fill):
        self.d.polygon(self._pts(pts), fill=fill)

    def rrect(self, x, y, w, h, r, fill):
        r = r if isinstance(r, (list, tuple)) else [r] * 4  # tl, tr, br, bl
        r = [min(v, w / 2, h / 2) for v in r]
        pts = []
        for (cx, cy, rad, a0) in ((x + w - r[1], y + r[1], r[1], -90), (x + w - r[2], y + h - r[2], r[2], 0),
                                  (x + r[3], y + h - r[3], r[3], 90), (x + r[0], y + r[0], r[0], 180)):
            for k in range(7):
                a = math.radians(a0 + 15 * k)
                pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
        self.poly(pts, fill)

    def circle(self, x, y, r, fill):
        self.poly([(x + r * math.cos(a), y + r * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 16, endpoint=False)], fill)

    def line(self, pts, width, fill):
        self.d.line(self._pts(pts), fill=fill, width=max(1, round(width * self._unit())), joint="curve")


def seg(pen, st, en, w, core, tip):
    L = max(1, math.hypot(en[0] - st[0], en[1] - st[1]))
    pen.save()
    pen.translate(*st)
    pen.rotate(math.atan2(en[1] - st[1], en[0] - st[0]))
    if core:
        pen.rrect(-1.2, -w / 2 - 1.2, L + 2.4, w + 2.4, 2, 0)  # dark outline keeps segments apart
    rt = min(w / 2, 3.2)
    pen.rrect(0, -w / 2, L, w, [1, rt, rt, 1] if tip else 1.2, 255)
    pen.restore()


def finger(pen, base, ang, lens, curl, w, core, bends=(85, 100, 70)):
    """Segmented finger seen palm-on; curling foreshortens segments and folds them back down."""
    a = math.radians(ang)
    dx, dy = math.sin(a), -math.cos(a)
    g = 1.3 if core else 0  # half the gap between segments
    th, p, joints = 0.0, base, [base]
    for i, L in enumerate(lens):
        th += curl * bends[i]
        k = L * math.cos(math.radians(th))
        s = -1 if k < 0 else 1
        ln = max(3.6, abs(k))
        seg(pen, (p[0] + dx * s * g, p[1] + dy * s * g), (p[0] + dx * s * (ln - g), p[1] + dy * s * (ln - g)), w, core, i == len(lens) - 1)
        p = (p[0] + dx * s * ln, p[1] + dy * s * ln)
        joints.append(p)
    if core:  # slim axle bridging each gap
        for j in joints[1:-1]:
            pen.save(); pen.translate(*j); pen.rotate(a)
            pen.rrect(-w * 0.22, -g - 0.6, w * 0.44, 2 * g + 1.2, 0, 255)
            pen.restore()


PALM = [(-15, -22), (15, -22), (19, -26), (23, -58), (19, -62), (-19, -62), (-23, -58), (-19, -26)]


def draw_hand(pen, P, core):
    pen.save()
    pen.translate(P["cx"], P["cy"])
    pen.rotate(math.radians(P["rot"]))
    pen.scale(P["sc"])
    pen.rrect(-11, -4, 22, 70, 2, 255)  # forearm
    if core:
        pen.line([(-5, 4), (-5, 46)], 1, 0)
        pen.line([(5, 4), (5, 46)], 1, 0)
        pen.rrect(-15.5, -19.5, 31, 12, 3, 0)
    pen.rrect(-14, -18, 28, 9, 2.5, 255)  # wrist collar
    if core:
        pen.poly([(x * 1.07, y + (y + 42) * 0.03) for x, y in PALM], 0)
    pen.poly(PALM, 255)
    if core:
        inner = [(x * 0.62, -42 + (y + 42) * 0.62) for x, y in PALM]
        pen.line(inner + inner[:1], 1.1, 0)
        for x, y in ((-13, -28), (13, -28), (-15, -55), (15, -55)):
            pen.circle(x, y, 1, 0)
        pen.rrect(-24, -70.5, 48, 8, 2, 0)
    pen.rrect(-23, -69.5, 46, 6, 2, 255)  # knuckle bar
    xs, scales, L = (-16.5, -5.5, 5.5, 16.5), (1, 1.1, 1, 0.82), (19, 14, 11)
    curls, spread = P["curls"], P["spread"]
    order = sorted(range(4), key=lambda i: -curls[i])
    draw = lambda i: finger(pen, (xs[i], -70), spread[i], [l * scales[i] for l in L], curls[i], 8.4, core)
    for i in order:
        if curls[i] > 0.5:
            draw(i)
    finger(pen, (-21, -38), P["thumb_ang"], (14, 11), P["thumb_curl"], 9, core, (40, 50))
    for i in order:
        if curls[i] <= 0.5:
            draw(i)
    pen.restore()


def wave_pose(t):
    """t in [0, 1): relax -> open and wave -> relax, seamless loop."""
    o = window(t, 0.05, 0.15, 0.85, 0.95)
    return {
        "curls": [c + (1 - o) * 0.7 for c in (0.15 * (1 - o), 0, 0, 0.1)],
        "spread": [s * o for s in (-6, -2, 2, 7)],
        "thumb_ang": -35 * o + 40 * (1 - o),
        "thumb_curl": 0.1,
        "rot": 16 * math.sin(t * math.pi * 2 * 2.5) * o,
        "sc": HAND_SCALE,
    }


def layout():
    """Hand slot + name block, centred together horizontally."""
    f = font(NAME_SIZE)
    name_w = max(f.getlength(s) for s in ("Shaoming", "Wu"))
    palm, gap = 48 * HAND_SCALE, 40  # centre on the hand's body, not its swing
    left = (W - (palm + gap + name_w)) / 2
    return {"hand_cx": left + palm / 2, "name_x": left + palm + gap, "name_w": name_w}


def hand_masks(t, lay):
    P = dict(wave_pose(t), cx=lay["hand_cx"], cy=H - 30)
    out = []
    for core in (True, False):
        img, _ = canvas(W, H)
        draw_hand(Pen(img), P, core)
        out.append(down(img))
    return out  # core (with gaps), silhouette (gaps closed)


def name_layers(lay):
    f = font(NAME_SIZE)
    x = lay["name_x"]
    gap, sub_gap = NAME_SIZE * 1.05, 30
    y1 = H / 2 - (NAME_SIZE * 0.73 + gap + sub_gap) / 2 + NAME_SIZE * 0.73
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    d.text((x, y1), "Shaoming", fill=255, font=f, anchor="ls")
    d.text((x, y1 + gap), "Wu", fill=255, font=f, anchor="ls")
    sub = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sub).text((x + 1, y1 + gap + sub_gap), "shaomingwu.com", fill=255, font=font(13), anchor="ls")
    centre = (x + lay["name_w"] / 2, y1 - NAME_SIZE * 0.36 + gap / 2)
    return m, np.asarray(sub, dtype=float) / 255 * 0.55, centre


def spotlight(t, centre):
    """Soft light drifting under the name on a figure-eight, one full loop per video loop."""
    X = centre[0] + 64 * math.sin(2 * math.pi * t)
    Y = centre[1] + 14 * math.sin(4 * math.pi * t)
    yy, xx = np.mgrid[0:H, 0:W]
    return 0.55 * np.clip(1 - np.hypot(xx - X, yy - Y) / 40, 0, 1)


def og_frame(t, lay, name):
    """t in [0, 1)."""
    text, sub, centre = name
    core, sil = hand_masks(t, lay)
    a = np.asarray(text, dtype=float) / 255
    words = np.where(a > 0.5, a, np.maximum(glow(text, 4.5, 1.3), spotlight(t, centre)))
    lum = np.maximum.reduce([halo(core, sil, 5.5, 1.6), words, sub])
    rgb, _ = dither(lum)
    return Image.fromarray(rgb).resize((W * SCALE, H * SCALE), Image.NEAREST)


def og(png_path, mp4_path):
    lay = layout()
    name = name_layers(lay)
    og_frame(0.4, lay, name).save(png_path)  # hand open and upright
    n = round(FPS * SECONDS)
    with tempfile.TemporaryDirectory() as tmp:
        for i in range(n):
            og_frame(i / n, lay, name).save(f"{tmp}/f{i:03d}.png")
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{tmp}/f%03d.png",
             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow",
             "-movflags", "+faststart", str(mp4_path)],
            check=True,
        )


if __name__ == "__main__":
    rgb32, q32 = statue(32)
    svg(rgb32, q32, PUBLIC / "icon.svg")
    png(rgb32, 1, PUBLIC / "icon-32x32.png")
    png(statue(45)[0], 4, PUBLIC / "apple-icon.png")  # 180x180
    og(PUBLIC / "og.png", PUBLIC / "og.mp4")
    print("wrote icon.svg, icon-32x32.png, apple-icon.png, og.png, og.mp4")
