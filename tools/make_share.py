"""Images de partage 1200x675 par station (img/share_<id>.jpg) + portraits HD (img/hostL_<id>.jpg), 27/10/2026.
Sources : portraits 768 px de l'app (VICE-BAY-RADIO-APP/VBR/Assets.xcassets), police Orbitron de l'app.
Usage : python3 tools/make_share.py"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RACINE = Path(__file__).resolve().parent.parent
APP = Path.home() / "Desktop/Projets épinglés/APPLICATION/VICE-BAY-RADIO-APP/VBR"
D = json.loads((RACINE / "data.js").read_text(encoding="utf-8").split("window.VBR=", 1)[1].rstrip().rstrip(";"))
ORB = str(APP / "Fonts/Orbitron.ttf")
DIN = "/System/Library/Fonts/Supplemental/DIN Alternate Bold.ttf"
W, H = 1200, 675

def rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def police(chemin, taille, poids=None):
    f = ImageFont.truetype(chemin, taille)
    if poids:
        try: f.set_variation_by_axes([poids])
        except Exception: pass
    return f

def ajuste(d, texte, chemin, taille, largeur, poids=None):
    while taille > 20:
        f = police(chemin, taille, poids)
        if d.textlength(texte, font=f) <= largeur: return f
        taille -= 4
    return police(chemin, taille, poids)

def main():
    for s in D["stations"]:
        c = rgb(s["c"])
        host = Image.open(APP / f"Assets.xcassets/host_{s['id']}.imageset/host_{s['id']}.jpg").convert("RGB")
        host.resize((600, 600), Image.LANCZOS).save(RACINE / f"img/hostL_{s['id']}.jpg", quality=84, optimize=True, progressive=True)
        im = Image.new("RGB", (W, H), (11, 11, 20))
        # fond : halo de la couleur de la station
        halo = Image.new("RGB", (W, H), (11, 11, 20)); hd = ImageDraw.Draw(halo)
        hd.ellipse((-300, -250, 700, 750), fill=tuple(int(x * .45) for x in c))
        im = Image.blend(im, halo.filter(ImageFilter.GaussianBlur(160)), 1)
        # portrait à droite, fondu vers la gauche
        p = host.resize((H, H), Image.LANCZOS)
        masque = Image.new("L", (H, H)); masque.putdata([min(255, int(x * 255 / 260)) for y in range(H) for x in range(H)])
        im.paste(p, (W - H, 0), masque)
        d = ImageDraw.Draw(im)
        x = 64
        d.text((x, 70), "VICE BAY RADIO  /  STATION DU JOUR", font=police(DIN, 26), fill=(200, 196, 230))
        f_nom = ajuste(d, s["name"], ORB, 104, 520, 900)
        d.text((x, 120), s["name"], font=f_nom, fill=(255, 255, 255))
        d.text((x, 250), f"{s['f']} FM", font=police(ORB, 64, 700), fill=c)
        g = s["genre"].replace(" · ", "  /  ")
        d.text((x, 345), g, font=ajuste(d, g, DIN, 30, 520), fill=(200, 196, 230))
        d.text((x, 395), f"avec {s['host']}", font=ajuste(d, f"avec {s['host']}", DIN, 36, 600), fill=(255, 255, 255))
        # bouton
        d.rounded_rectangle((x, 480, x + 330, 552), 36, fill=c)
        d.polygon([(x + 62, 500), (x + 62, 532), (x + 90, 516)], fill=(11, 11, 20))
        d.text((x + 190, 516), "ÉCOUTER", font=police(ORB, 30, 800), fill=(11, 11, 20), anchor="mm")
        d.text((x, 600), "vicebayradio.com    /    gtavifrance.com", font=police(DIN, 26), fill=(150, 146, 180))
        im.save(RACINE / f"img/share_{s['id']}.jpg", quality=86, optimize=True, progressive=True)
    print(len(D["stations"]), "images share_ + hostL_")

if __name__ == "__main__":
    main()
