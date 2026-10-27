"""Une page par commerce de Vice Bay, en français et en anglais : pub/<id>.html et en/pub/<id>.html (27/10/2026, Gabriel :
« on clique sur une société, ça ouvre une page » : histoire, patron, quartier, adresse, anecdotes).
Fiches : tools/pubs.json (rédigées avec Codex, à partir de la bible). Sans fiche, la page montre au moins la pub.
Usage : python3 tools/make_shops.py"""
import html, json
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
D = json.loads((RACINE / "data.js").read_text(encoding="utf-8").split("window.VBR=", 1)[1].rstrip().rstrip(";"))
FICHES = json.loads((RACINE / "tools" / "pubs.json").read_text(encoding="utf-8")) if (RACINE / "tools" / "pubs.json").exists() else {}
SITE = "https://vicebayradio.com"
GOAT = (RACINE / "index.html").read_text(encoding="utf-8").splitlines()[26]
e = html.escape

Q = {"beach": ("Plage", "Beach", "#1FB7A6"), "downtown": ("Centre-ville", "Downtown", "#E5B84B"), "highway": ("Autoroute", "Highway", "#FFA630"),
     "everglades": ("Marais", "Everglades", "#3E7C4F"), "skyline": ("Skyline", "Skyline", "#FF2E88")}
ST = {s["id"]: s for s in D["stations"]}
ADS = D["ads"]

TXT = {
    "fr": dict(retour="← Les 25 commerces", boss="Patron", since="Depuis", addr="Adresse", hours="Horaires", hist="Son histoire", anec="Anecdotes",
               pub="La pub", pub_n="Jouée au premier degré, sur ", know="À savoir", where="Où le trouver", neigh="Le voisin", same="Dans le même quartier",
               on="Écouter", sig="Le mot du patron", fiction="Commerce imaginaire de Vice Bay, 1986. Univers fictif et indépendant, une création OKALAM Studio.",
               to_station="Voir la station", pied="Vice Bay Radio, les radios de Vice Bay, 1986. Univers fictif et indépendant, sans lien avec Rockstar Games. Une création OKALAM Studio.",
               desc="{shop} : {q}, Vice Bay. Pub diffusée sur {st} {f} FM. Histoire, patron, adresse et anecdotes.", autre="Les autres commerces"),
    "en": dict(retour="← All 25 shops", boss="Owner", since="Since", addr="Address", hours="Opening hours", hist="Its story", anec="Anecdotes",
               pub="The ad", pub_n="Played completely straight, on ", know="Good to know", where="How to find it", neigh="The neighbour", same="In the same neighbourhood",
               on="Listen to", sig="The owner's motto", fiction="An imaginary shop in Vice Bay, 1986. A fictional, independent universe made by OKALAM Studio.",
               to_station="View the station", pied="Vice Bay Radio, the radio stations of Vice Bay, 1986. A fictional, independent universe, not affiliated with Rockstar Games. Made by OKALAM Studio.",
               desc="{shop}: {q}, Vice Bay. Ad broadcast on {st} {f} FM. Story, owner, address and anecdotes.", autre="More shops"),
}

CSS = """
:root{--c:%(c)s;--q:%(q)s;--bg:#0b0b14;--fg:#f2f0ff;--mu:#a9a6c4;--ca:#14142a}
*{box-sizing:border-box}html{background:var(--bg)}body{margin:0;background:radial-gradient(900px 600px at 0 0,color-mix(in srgb,var(--q) 22%%,transparent),transparent),var(--bg);color:var(--fg);font:16px/1.6 'DM Sans',system-ui,sans-serif}
a{color:var(--q)}main{max-width:960px;margin:0 auto;padding:16px 16px 56px}
.top{display:flex;justify-content:space-between;gap:12px;font-size:14px}.top a{color:var(--mu);text-decoration:none}
.hero{display:grid;grid-template-columns:260px 1fr;gap:28px;align-items:center;margin:22px 0 14px}
.logo{aspect-ratio:1;border-radius:22px;background:#06060d;border:1px solid color-mix(in srgb,var(--q) 50%%,transparent);box-shadow:0 20px 60px color-mix(in srgb,var(--q) 25%%,transparent);display:grid;place-items:center;overflow:hidden}
.logo img{width:100%%;height:100%%;object-fit:contain;padding:10px}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.tags a,.tags span{padding:4px 12px;border-radius:999px;font:700 11px 'Space Mono',monospace;letter-spacing:.08em;text-decoration:none;border:1px solid currentColor;text-transform:uppercase}
h1{font:900 clamp(32px,6vw,56px)/1.05 Orbitron,sans-serif;margin:6px 0 10px;color:#fff}
.sig{font-size:20px;font-style:italic;margin:0 0 14px}.sig small{display:block;font:12px 'Space Mono',monospace;color:var(--mu);font-style:normal;margin-top:4px}
.fiche{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:0;padding:0;list-style:none}
.fiche li{background:var(--ca);border:1px solid #ffffff12;border-radius:14px;padding:10px 14px;font-size:14px}.fiche b{display:block;font:700 11px 'Space Mono',monospace;letter-spacing:.1em;color:var(--q);text-transform:uppercase;margin-bottom:2px}
section{background:var(--ca);border-radius:18px;padding:22px;margin:16px 0}h2{font:700 15px Orbitron,sans-serif;margin:0 0 12px;color:var(--q);letter-spacing:.05em}
section p{margin:0 0 12px;max-width:70ch}section p:last-child{margin-bottom:0}
.anec{list-style:none;margin:0;padding:0;display:grid;gap:12px}.anec li{padding:12px 14px;border-left:3px solid var(--q);background:#ffffff08;border-radius:0 12px 12px 0}
blockquote{margin:0;padding-left:14px;border-left:3px solid var(--c);font-size:16px}.dir{color:var(--mu);font-style:italic}
.know{margin:0;padding-left:20px}.know li{margin:6px 0}
.cta{display:inline-block;margin-top:12px;padding:11px 18px;border-radius:999px;background:var(--c);color:#0b0b14;font-weight:700;text-decoration:none}
.neigh{display:flex;gap:14px;align-items:center;text-decoration:none;color:var(--fg)}.neigh img{width:84px;height:84px;object-fit:contain;background:#06060d;border-radius:14px;flex:none;padding:6px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{padding:8px 14px;border-radius:999px;background:#ffffff10;text-decoration:none;font-size:14px;color:var(--fg)}
footer{color:var(--mu);font-size:12px;text-align:center;max-width:640px;margin:24px auto 0}
@media(max-width:760px){.hero{grid-template-columns:1fr;gap:16px}.logo{max-width:240px}}
"""

PAGE = """<!doctype html>
<html lang="{lg}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{shop} · {qn} · Vice Bay Radio</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="fr" href="{url_fr}"><link rel="alternate" hreflang="en" href="{url_en}"><link rel="alternate" hreflang="x-default" href="{url_fr}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Vice Bay Radio"><meta property="og:title" content="{shop} · Vice Bay">
<meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/{logo}"><meta name="theme-color" content="#0b0b14">
<link rel="icon" href="{rel}img/icon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Orbitron:wght@700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
{goat}
<style>{css}</style></head><body><main>
<div class="top"><a href="{rel}#pubs">{retour}</a><a href="{lang_url}">{lang_lab}</a></div>
<div class="hero">
<div class="logo"><img src="{rel}{logo}" alt="{shop}" width="420" height="420"></div>
<div>
<div class="tags"><span style="color:{q}">{qn}</span><a href="{rel_st}" style="color:{c}">{st} {f} FM</a></div>
<h1>{shop}</h1>
{sig_html}
{fiche_html}
</div></div>
{histoire_html}
{anec_html}
<section><h2>{pub}</h2><p style="color:var(--mu);font-size:14px">{pub_n}{st} {f} FM.</p><blockquote>{pub_txt}</blockquote>
<a class="cta" href="{rel_st}">{on} {st} {f} FM →</a></section>
{know_html}
{neigh_html}
<section><h2>{autre}</h2><div class="chips">{chips}</div></section>
<footer>{pied}</footer>
</main></body></html>
"""


def script(t):
    out = []
    for l in t.split("\n"):
        h = e(l)
        import re
        h = re.sub(r"\(([^)]*)\)", r'<span class="dir">(\1)</span>', h)
        out.append(h or "&nbsp;")
    return "<br>".join(out)


def main():
    n = 0
    for lg in ("fr", "en"):
        t = TXT[lg]
        dossier = RACINE / ("pub" if lg == "fr" else "en/pub"); dossier.mkdir(parents=True, exist_ok=True)
        rel = "../" if lg == "fr" else "../../"
        for a in ADS:
            s = ST[a["station"]]; qfr, qen, qc = Q[a["q"]]; qn = qfr if lg == "fr" else qen
            fi = FICHES.get(a["id"]) or {}; f = fi.get(lg) or {}
            url_fr, url_en = f"{SITE}/pub/{a['id']}.html", f"{SITE}/en/pub/{a['id']}.html"
            desc = t["desc"].format(shop=a["shop"], q=qn, st=s["name"], f=s["f"])
            sig_html = f'<p class="sig">« {e(f["phrase_signature"])} »<small>{t["sig"]} · {e(fi.get("patron", ""))}</small></p>' if f.get("phrase_signature") else ""
            items = []
            if fi.get("patron"): items.append((t["boss"], e(fi["patron"])))
            if fi.get("annee_creation"): items.append((t["since"], str(fi["annee_creation"])))
            if fi.get("adresse"): items.append((t["addr"], e(fi["adresse"]) + (f"<br><span style='color:var(--mu)'>{e(f['quartier_phrase'])}</span>" if f.get("quartier_phrase") else "")))
            if f.get("horaires"): items.append((t["hours"], e(f["horaires"])))
            fiche_html = '<ul class="fiche">' + "".join(f"<li><b>{k}</b>{v}</li>" for k, v in items) + "</ul>" if items else ""
            histoire_html = f'<section><h2>{t["hist"]}</h2>' + "".join(f"<p>{e(p)}</p>" for p in f["histoire"]) + "</section>" if f.get("histoire") else ""
            anec_html = f'<section><h2>{t["anec"]}</h2><ul class="anec">' + "".join(f"<li>{e(x)}</li>" for x in f["anecdotes"]) + "</ul></section>" if f.get("anecdotes") else ""
            know_html = f'<section><h2>{t["know"]}</h2><ul class="know">' + "".join(f"<li>{e(x)}</li>" for x in f["a_savoir"]) + "</ul></section>" if f.get("a_savoir") else ""
            neigh_html = ""
            v = f.get("voisin") or {}
            va = next((x for x in ADS if x["id"] == v.get("id")), None)
            if va:
                neigh_html = (f'<section><h2>{t["neigh"]}</h2><a class="neigh" href="{va["id"]}.html"><img src="{rel}{va["logo"]}" alt="" loading="lazy" width="84" height="84">'
                              f'<span><b>{e(va["shop"])}</b><br>{e(v.get("texte", ""))}</span></a></section>')
            same = [x for x in ADS if x["q"] == a["q"] and x["id"] != a["id"]] or [x for x in ADS if x["id"] != a["id"]][:8]
            chips = "".join(f'<a href="{x["id"]}.html">{e(x["shop"])}</a>' for x in same)
            page = PAGE.format(lg=lg, SITE=SITE, url=url_fr if lg == "fr" else url_en, url_fr=url_fr, url_en=url_en, rel=rel, goat=GOAT,
                               lang_url=(url_en if lg == "fr" else url_fr), lang_lab="English" if lg == "fr" else "Français", desc=e(desc),
                               css=CSS % {"c": s["c"], "q": qc}, shop=e(a["shop"]), qn=qn, q=qc, c=s["c"], st=e(s["name"]), f=s["f"], logo=a["logo"],
                               rel_st=f"{rel}{'' if lg == 'fr' else 'en/'}station/{s['id']}.html", sig_html=sig_html, fiche_html=fiche_html,
                               histoire_html=histoire_html, anec_html=anec_html, know_html=know_html, neigh_html=neigh_html, chips=chips,
                               pub_txt=script(a["text"]), **{k: v_ for k, v_ in t.items() if k != "desc"})
            (dossier / f"{a['id']}.html").write_text(page, encoding="utf-8")
            n += 1
    # sitemap : ajoute les pages commerce
    sm = RACINE / "sitemap.xml"
    txt = sm.read_text(encoding="utf-8")
    import re, datetime
    txt = re.sub(r"<url><loc>[^<]*/(en/)?pub/[^<]*</loc>[^\n]*\n", "", txt)
    jour = datetime.date.today().isoformat()
    add = "".join(f"<url><loc>{SITE}/{p}pub/{a['id']}.html</loc><lastmod>{jour}</lastmod></url>\n" for p in ("", "en/") for a in ADS)
    sm.write_text(txt.replace("</urlset>", add + "</urlset>"), encoding="utf-8")
    print(n, "pages commerce")


if __name__ == "__main__":
    main()
