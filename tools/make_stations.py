"""Une page par station : station/<id>.html (27/10/2026, Gabriel : chaque jour sur X, une station avec un lien direct vers elle).
Lit data.js, écrit des pages statiques sombres (titre, description, image de partage, animateur, jingles, morceaux)
avec un gros bouton « Écouter » qui ouvre le lecteur sur la station (/?tune=<id>).
Usage : python3 tools/make_stations.py"""
import html, json
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
D = json.loads((RACINE / "data.js").read_text(encoding="utf-8").split("window.VBR=", 1)[1].rstrip().rstrip(";"))
SITE = "https://vicebayradio.com"
e = html.escape

PAGE = """<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{name} {f} · Vice Bay Radio</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="music.radio_station"><meta property="og:title" content="{name} {f} · Vice Bay Radio">
<meta property="og:description" content="{desc}"><meta property="og:image" content="{SITE}/{img}"><meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#0b0b14">
<link rel="icon" href="../img/icon.png">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
<script type="application/ld+json">{ld}</script>
<style>
:root{{--c:{c};--bg:#0b0b14;--fg:#f2f0ff;--mu:#a9a6c4;--ca:#16162a}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 'DM Sans',system-ui,sans-serif}}
a{{color:var(--c)}}main{{max-width:760px;margin:0 auto;padding:24px 16px 60px}}
.top{{display:flex;justify-content:space-between;align-items:center;font-size:14px}}.top a{{color:var(--mu);text-decoration:none}}
.hero{{margin:28px 0;padding:28px;border-radius:20px;background:linear-gradient(135deg,color-mix(in srgb,var(--c) 35%,#0b0b14),#12122a);border:1px solid color-mix(in srgb,var(--c) 50%,transparent)}}
.hero img.logo{{width:120px;height:120px;object-fit:contain;border-radius:16px;background:#0006}}
h1{{font:900 clamp(32px,8vw,56px)/1.05 Orbitron,sans-serif;margin:16px 0 4px;color:#fff}}
.f{{font:700 22px Orbitron,sans-serif;color:var(--c)}}.g{{letter-spacing:.12em;font-size:13px;color:var(--mu);margin-top:6px}}
.slogan{{font-size:20px;margin:16px 0 22px}}
.play{{display:inline-block;padding:16px 30px;border-radius:999px;background:var(--c);color:#0b0b14;font:700 18px 'DM Sans';text-decoration:none}}
section{{background:var(--ca);border-radius:16px;padding:20px;margin:16px 0}}h2{{font:700 16px Orbitron,sans-serif;margin:0 0 12px;color:var(--c)}}
.host{{display:flex;gap:16px;align-items:center}}.host img{{width:84px;height:84px;border-radius:50%;object-fit:cover}}
blockquote{{margin:0 0 10px;padding-left:12px;border-left:3px solid var(--c);color:var(--mu);font-style:italic}}
ol{{margin:0;padding-left:22px;columns:2;column-gap:28px}}li{{break-inside:avoid;font-size:14px}}li span{{color:var(--mu)}}
.autres{{display:flex;flex-wrap:wrap;gap:8px}}.autres a{{padding:8px 14px;border-radius:999px;background:#ffffff10;text-decoration:none;font-size:14px}}
footer{{color:var(--mu);font-size:13px;text-align:center}}
@media(max-width:560px){{ol{{columns:1}}}}
</style></head><body><main>
<div class="top"><a href="../">← Vice Bay Radio</a><a href="https://gtavifrance.com/?utm_source=vicebayradio&utm_medium=station">gtavifrance.com</a></div>
<div class="hero">
<img class="logo" src="../{logo}" alt="Logo {name}">
<h1>{name}</h1><div class="f">{f} FM</div><div class="g">{genre}</div>
<p class="slogan">{slogan}</p>
<a class="play" href="../?tune={id}&utm_source=station">▶ Écouter {name} en direct</a>
</div>
<section><h2>À l'antenne</h2><div class="host"><img src="../img/host_{id}.jpg" alt="{host}"><div><strong>{host}</strong><br>{bio}</div></div></section>
<section><h2>Jingles</h2>{jingles}</section>
<section><h2>Au programme ({n} morceaux)</h2><ol>{titres}</ol></section>
<section><h2>Les autres stations de Vice Bay</h2><div class="autres">{autres}</div></section>
<footer>Vice Bay Radio, les radios de Vice Bay, 1986 · une création OKALAM Studio · musiques sous licence libre, auteurs crédités</footer>
</main></body></html>
"""

def main():
    (RACINE / "station").mkdir(exist_ok=True)
    S = D["stations"]
    for s in S:
        url = f"{SITE}/station/{s['id']}.html"
        desc = f"{s['name']} {s['f']} FM, la station {s['genre'].lower()} de Vice Bay Radio, animée par {s['host']}. {s['slogan']} Écoute gratuite en direct."
        ld = json.dumps({"@context": "https://schema.org", "@type": "RadioStation", "name": f"{s['name']} {s['f']}", "url": url, "description": desc,
                         "image": f"{SITE}/{s['logo']}", "parentOrganization": {"@type": "Organization", "name": "Vice Bay Radio", "url": SITE}}, ensure_ascii=False)
        page = PAGE.format(SITE=SITE, url=url, desc=e(desc), ld=ld, img=s["logo"], id=s["id"], name=e(s["name"]), f=s["f"], c=s["c"], logo=s["logo"],
            genre=e(s["genre"]), slogan=e(s["slogan"]), host=e(s["host"]), bio=e(s["bio"]),
            jingles="".join(f"<blockquote>« {e(j)} »</blockquote>" for j in s.get("jingles", [])),
            n=len(s.get("catalog", [])), titres="".join(f"<li>{e(t['t'])} <span>· {e(t['a'])}</span></li>" for t in s.get("catalog", [])),
            autres="".join(f'<a href="{o["id"]}.html" style="color:{o["c"]}">{e(o["name"])} {o["f"]}</a>' for o in S if o["id"] != s["id"]))
        (RACINE / "station" / f"{s['id']}.html").write_text(page, encoding="utf-8")
    print(len(S), "pages station/")

if __name__ == "__main__":
    main()
