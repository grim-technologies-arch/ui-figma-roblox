"""Bake stud overlays for Roblox (Roblox has no Overlay blend mode).

1. stud_tile.png  — 256x256 (4x4 studs) from kek_stud.png, converted so pixels lighter than the
   mid-grey base become white with alpha and darker ones become black with alpha. Drawn with normal
   blending this approximates Figma's Overlay on any fill colour. Use as ImageLabel ScaleType=Tile,
   TileSize=96x96 (24 px studs), ImageTransparency ~0.3.
2. studs_*.png    — the same pattern with the fade baked into alpha. In this session UIGradient did
   not visibly fade a tiled ImageLabel, nor a CanvasGroup wrapping it, so fades are baked instead.
   Use as ImageLabel ScaleType=Stretch, Size=1,1 on the face.

Run: python -I bake_roblox_studs.py <path-to-kek_stud.png> <out-dir>
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

grey = Image.open(src).convert('L').crop((0, 0, 256, 256))  # stud pitch is exactly 64 px -> seamless
px = list(grey.getdata())
base, lo, hi = sorted(px)[len(px) // 2], min(px), max(px)
tile = Image.new('RGBA', grey.size)
tile.putdata([(255, 255, 255, min(255, int((v - base) / (hi - base + 1) * 255))) if v >= base
              else (0, 0, 0, min(255, int((base - v) / (base - lo + 1) * 255))) for v in px])
tile.save(out / 'stud_tile.png')


def bake(name, w, h, res, strength, direction, end):
    """w,h = design size of the face; res = pixel multiplier (keep <= 1024 px wide);
    direction 'down' = opaque at top, 'up' = opaque at bottom; end = fraction where alpha reaches 0."""
    W, H = round(w * res), round(h * res)
    t = tile.resize((round(96 * res), round(96 * res)), Image.LANCZOS)
    img = Image.new('RGBA', (W, H))
    for x in range(0, W, t.width):
        for y in range(0, H, t.height):
            img.alpha_composite(t, (x, y))
    mask = Image.new('L', (W, H))
    m = mask.load()
    for y in range(H):
        f = y / (H - 1)
        if direction == 'up':
            f = 1 - f
        v = int(255 * max(0.0, 1 - f / end) * strength)
        for x in range(W):
            m[x, y] = v
    img.putalpha(ImageChops.multiply(img.split()[3], mask))
    img.save(out / name)


bake('studs_card.png', 260, 310, 2, 0.7, 'down', 0.8)       # blue product cards
bake('studs_bundle.png', 820, 260, 1.2, 0.55, 'up', 0.75)   # gold bundle card
bake('studs_btn_big.png', 280, 64, 2, 0.3, 'up', 0.9)       # bundle buy button
bake('studs_btn_small.png', 220, 50, 2, 0.3, 'up', 0.9)     # card buy buttons
