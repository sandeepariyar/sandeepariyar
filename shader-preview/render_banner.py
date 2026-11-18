"""Render a GitHub-safe animated preview of the interactive GLSL banner.

The original banner wording is preserved verbatim. This generated GIF does not
run scripts and remains purely decorative; HTML/GLSL handles real interaction.
"""
from pathlib import Path
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


OUT = Path(__file__).resolve().parent
W, H = 1200, 300
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def lettering(draw, at, message, font, fill, spacing=0):
    x, y = at
    for char in message:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + spacing


def background(t):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = xx / W, yy / H
    n = np.sin(xx * .021 + np.sin(yy * .039 + t * 1.3) * 1.6)
    n *= np.cos(yy * .014 + np.sin(xx * .013 - t * .9))
    flow = np.sin(v * 22 + u * 7 + n * 2.1 - t * 2.5)
    center = .54 + .08 * np.sin(u * 7 + t * .8) + .04 * n
    cloud = np.exp(-((v - center) * 4.4)**2)
    orb = np.exp(-(((u - .83) * 1.7)**2 + ((v - .44) * 1.4)**2) * 4)
    cyan = (cloud * (.52 + flow * .36) + orb * .34).clip(0, 1)
    pink = (cloud * (.16 + .53 * np.sin(u * 7 - t)**2)).clip(0, 1)
    band = np.exp(-((v - .7 - .13*np.sin(u*7+t)) * 12)**2)
    r = 5 + cyan * 12 + pink * 64 + band * 8
    g = 12 + cyan * 67 + pink * 4 + band * 13
    b = 20 + cyan * 94 + pink * 41 + band * 22
    pixels = np.stack((r, g, b), axis=2)
    return Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), "RGB")


def orbit(draw, t):
    cx, cy = 1010, 128
    for i, (rx, ry, color, tilt) in enumerate((
        (101, 27, (0, 229, 255, 115), -.26 + t * .12),
        (67, 73, (255, 46, 151, 92), .5 - t * .1),
        (88, 23, (150, 226, 255, 76), .6 + t * .14),
    )):
        pts = []
        for j in range(170):
            a = 2 * math.pi * j / 169
            x, y = rx * math.cos(a), ry * math.sin(a)
            pts.append((cx + x * math.cos(tilt) - y * math.sin(tilt),
                        cy + x * math.sin(tilt) + y * math.cos(tilt)))
        draw.line(pts, fill=color, width=2 if i == 0 else 1, joint="curve")
    draw.ellipse((1007,125,1013,131), fill=(0, 229, 255, 255))


def draw_frame(t):
    image = background(t).convert("RGBA")
    overlay = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(overlay)

    # Faint graticule and the neon corner accents echo the original SVG.
    for x in range(0, W, 32):
        d.line([(x, 0), (x, H)], fill=(100, 204, 230, 11))
    for y in range(0, H, 32):
        d.line([(0, y), (W, y)], fill=(100, 204, 230, 11))
    for y in range(6, H, 6):
        d.line([(0, y), (W, y)], fill=(100, 180, 210, 7))
    d.line([(18,40),(18,18),(40,18)], fill=(95,227,255,185),width=2)
    d.line([(1160,18),(1182,18),(1182,40)], fill=(95,227,255,185),width=2)
    d.line([(18,260),(18,282),(40,282)], fill=(95,227,255,185),width=2)
    d.line([(1160,282),(1182,282),(1182,260)], fill=(95,227,255,185),width=2)
    d.line([(300,22),(900,22)],fill=(85,182,221,65),width=1)
    orbit(d,t)

    tiny = ImageFont.truetype(FONT_MONO, 10)
    meta = ImageFont.truetype(FONT_MONO, 11)
    subtitle = ImageFont.truetype(FONT_REG, 23)
    title = ImageFont.truetype(FONT_BOLD, 54)
    lettering(d, (40,26), "SYS://QT.QML  C++  GLSL", meta, (127,219,255,230), .8)
    lettering(d, (831,26), "LAT 65.01 N / LON 25.47 E — OULU", tiny, (127,219,255,220), 0)
    lettering(d, (956,204), "◉ OULU 65.01°N", meta, (127,219,255,225), 0)
    lettering(d, (162,143), "Software Developer · Technical Artist", subtitle, (221,232,242,255), 1.3)
    lettering(d, (70,178), "QT/QML · C++ · EMBEDDED HMI · GAME DEV · SHADERS · 3D", meta, (152,187,219,235), 1.2)
    d.rectangle((70,150,126,152), fill=(0,229,255,255))
    d.rectangle((132,150,146,152), fill=(255,46,151,255))
    d.ellipse((40,264,48,272), fill=(0,255,156,255))
    lettering(d, (56,260), "STATUS: OPEN TO WORK", meta, (0,255,156,255), .8)
    lettering(d, (900,260), "SOFTWARE · GAMES · 3D — FINLAND", tiny, (127,219,255,195), 0)
    image=Image.alpha_composite(image,overlay)

    # Separate glow from crisp title, so text remains legible at small sizes.
    letters = Image.new("RGBA", (W,H))
    ld = ImageDraw.Draw(letters)
    lettering(ld,(70,83),"SANDEEP PARIYAR",title,(0,229,255,255),4.1)
    glow=letters.filter(ImageFilter.GaussianBlur(7))
    glow.putalpha(glow.getchannel("A").point(lambda a: int(a*.28)))
    image=Image.alpha_composite(image,glow)
    image=Image.alpha_composite(image,letters)
    return image.convert("RGB")


if __name__ == "__main__":
    frames=[draw_frame(2*math.pi*i/16) for i in range(16)]
    frames[0].save(OUT/"banner-shader-still.png",optimize=True)
    frames=[im.quantize(colors=128,method=Image.Quantize.FASTOCTREE) for im in frames]
    frames[0].save(OUT/"banner-shader-preview.gif",save_all=True,append_images=frames[1:],
                   duration=120,loop=0,optimize=True,disposal=2)
    print((OUT/"banner-shader-preview.gif").stat().st_size)
