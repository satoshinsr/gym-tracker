"""
Generates placeholder brand assets (a simple emerald dumbbell on dark slate):
  assets/icon.png            1024x1024, opaque (App Store / home screen icon)
  assets/adaptive-icon.png   1024x1024, transparent foreground (Android adaptive icon)
  assets/splash-icon.png     1024x1024, transparent glyph shown centered on the splash screen

Replace these files with your own artwork at any time; keep the sizes and names.
Usage: python scripts/generate-brand-assets.py
"""
import os
from PIL import Image, ImageDraw

BG = (15, 23, 42)  # #0F172A
EMERALD = (16, 185, 129)  # #10B981
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets")
SIZE = 1024
SS = 2  # draw at 2x and downsample for smooth edges


def dumbbell(scale):
    """Transparent 1024px canvas with the dumbbell glyph; scale<1 keeps it inside Android's safe zone."""
    s = SIZE * SS
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = cy = s / 2
    u = s * scale / 100  # 1 unit = 1% of the glyph box

    def rrect(x0, y0, x1, y1, r):
        d.rounded_rectangle([cx + x0 * u, cy + y0 * u, cx + x1 * u, cy + y1 * u], radius=r * u, fill=EMERALD)

    rrect(-30, -4, 30, 4, 2)  # bar
    for sign in (-1, 1):
        a, b = sorted((sign * 20, sign * 30))
        rrect(a, -22, b, 22, 4)  # inner plate
        a, b = sorted((sign * 31, sign * 38))
        rrect(a, -14, b, 14, 3)  # outer plate
    return im.resize((SIZE, SIZE), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    icon = Image.new("RGB", (SIZE, SIZE), BG)
    icon.paste(dumbbell(0.80), (0, 0), dumbbell(0.80))
    icon.save(os.path.join(OUT, "icon.png"))
    dumbbell(0.60).save(os.path.join(OUT, "adaptive-icon.png"))
    dumbbell(0.90).save(os.path.join(OUT, "splash-icon.png"))
    print("wrote icon.png, adaptive-icon.png, splash-icon.png")


main()
