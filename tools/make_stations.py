"""Une page par station, en français et en anglais : station/<id>.html et en/station/<id>.html (27/10/2026, Gabriel : chaque jour
sur X une station avec un lien direct vers elle ; version 2 retravaillée avec Codex Soso).
Lecteur intégré (écoute sans quitter la page), portrait HD, image de partage img/share_<id>.jpg (tools/make_share.py),
mesure GoatCounter (play, 30 s d'écoute, clic gtavifrance), hreflang, sitemap.xml.
Usage : python3 tools/make_share.py && python3 tools/make_stations.py"""
import datetime, html, json
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
D = json.loads((RACINE / "data.js").read_text(encoding="utf-8").split("window.VBR=", 1)[1].rstrip().rstrip(";"))
SITE = "https://vicebayradio.com"
GOAT = (RACINE / "index.html").read_text(encoding="utf-8").splitlines()[26]
e = html.escape

TXT = {
    "fr": dict(retour="← Toutes les stations", ecouter="Écouter", connexion="Connexion…", en_ecoute="En écoute", pause="En pause", reessayer="Réessayer",
               ouvrir="Ouvrir dans le lecteur complet", antenne="À l'antenne", jingle="Le jingle", programme="Au programme", morceaux="morceaux, voir la liste",
               autres="Les autres stations de Vice Bay", gta_t="Tu attends GTA VI ?", gta_p="Actus vérifiées, compte à rebours et guides en français sur GTA VI France.",
               gta_b="Aller sur gtavifrance.com", pied="Vice Bay Radio, les radios de Vice Bay, 1986. Univers fictif et indépendant, sans lien avec Rockstar Games. Une création OKALAM Studio, musiques sous licence libre, auteurs crédités.",
               desc="{name} {f} FM : {genre}, avec {host} au micro. {slogan} Écoute gratuite en direct sur Vice Bay Radio.", avec="avec", vol="Volume", live="EN DIRECT", direct_t="En direct, comme à la radio", direct_p="Pas de playlist à choisir : tu arrives au milieu de l'émission, jingles, voix des animateurs et pubs compris.", nx="À suivre", prec="Précédent", suiv="Suivant", prog_t="Sur l'antenne", prog_sub="Touche un titre pour l'écouter.", cred_t="Crédits et licences", bio_t="Qui est", a_savoir="À savoir", lien_t="À l'antenne, entre voisins", pubs_t="Les pubs de la station", pubs_sub="Les commerçants de Vice Bay qui passent sur {name}."),
    "en": dict(retour="← All stations", ecouter="Listen", connexion="Connecting…", en_ecoute="On air", pause="Paused", reessayer="Retry",
               ouvrir="Open in the full player", antenne="On air", jingle="The jingle (in French)", programme="Playlist", morceaux="tracks, see the list",
               autres="More Vice Bay stations", gta_t="Waiting for GTA VI?", gta_p="Verified news, countdown and guides on GTA VI France.",
               gta_b="Visit gtavifrance.com", pied="Vice Bay Radio, the radio stations of Vice Bay, 1986. A fictional, independent universe, not affiliated with Rockstar Games. Made by OKALAM Studio, royalty-free music, artists credited.",
               desc="{name} {f} FM: {genre}, hosted by {host}. {slogan} Free live radio on Vice Bay Radio.", avec="with", vol="Volume", live="LIVE", direct_t="Live, like real radio", direct_p="No playlist to pick from: you join the show already in progress, jingles, host voices and ads included.", nx="Up next", prec="Previous", suiv="Next", prog_t="On the air", prog_sub="Tap a track to play it.", cred_t="Credits and licences", bio_t="Who is", a_savoir="Good to know", lien_t="On air, between neighbours", pubs_t="Station ads", pubs_sub="Vice Bay shops advertising on {name}."),
}

BIOS = {}
_bp = RACINE / "tools" / "bios.json"
if _bp.exists():
    BIOS = json.loads(_bp.read_text(encoding="utf-8"))
PLAYER_JS = (RACINE / "tools" / "station_player.js").read_text(encoding="utf-8")

EXTRA_CSS = r"""
.lecteur{background:var(--ca);border:1px solid color-mix(in srgb,var(--c) 30%,#ffffff14);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:0 10px 40px color-mix(in srgb,var(--c) 14%,transparent)}
.l-top{display:flex;gap:12px;align-items:center}.l-art{width:56px;height:56px;border-radius:12px;background:#000a;padding:3px;flex:none}
.lecteur .info{flex:1;min-width:0}
.l-bar{display:flex;align-items:center;gap:10px;font:12px 'DM Sans',sans-serif;color:var(--mu)}.l-bar time{min-width:34px;font-variant-numeric:tabular-nums}
.lecteur input[type=range]{width:100%;accent-color:var(--c);margin:0}
.l-ctl{display:flex;align-items:center;gap:14px}
.lecteur button{border:0;cursor:pointer;display:grid;place-items:center;color:#0b0b14;background:var(--c);border-radius:50%}
.lecteur button.big{width:64px;height:64px}.lecteur button.big svg{width:28px;height:28px}
.lecteur button.sm{width:42px;height:42px;background:#ffffff14;color:var(--fg)}.lecteur button.sm svg{width:18px;height:18px}
.lecteur button:focus-visible{outline:2px solid #fff;outline-offset:2px}
.l-vol{margin-left:auto;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mu);width:150px}.l-vol span{display:none}
.badge{display:inline-block;padding:1px 8px;border-radius:999px;background:#ff2e4d;color:#fff;font:700 11px 'Space Mono',monospace;letter-spacing:.1em;margin-right:6px;vertical-align:1px}
.l-next{font-size:12px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sub{margin:-6px 0 12px;color:var(--mu);font-size:14px}
.prog{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px}
.prog button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:baseline;padding:8px 10px;border-radius:10px;font-size:14px;color:var(--fg)}
.prog button:hover,.prog button:focus-visible{background:#ffffff10}
.prog button b{flex:none;width:22px;color:var(--c);font:700 12px 'Space Mono',monospace}
.prog button span{color:var(--mu)}.prog button.now{background:color-mix(in srgb,var(--c) 18%,transparent)}.prog button.now b::before{content:"\25B6\00a0"}
.bio .acc{font:700 clamp(20px,3vw,26px)/1.25 'DM Sans',sans-serif;color:#fff;margin:0 0 14px}
.bio p{margin:0 0 12px;max-width:68ch}.bio .cols{display:grid;grid-template-columns:1.2fr .8fr;gap:22px;margin-top:8px}
.faits{list-style:none;margin:0;padding:14px 16px;background:#ffffff08;border-radius:14px;border:1px solid #ffffff10}.faits li{font-size:14px;padding:6px 0;break-inside:auto}
.faits li+li{border-top:1px dashed #ffffff1c}.faits h3{margin:0 0 6px;font:700 12px Orbitron,sans-serif;color:var(--c);letter-spacing:.08em}
.bio .lien{font-size:14px;color:var(--mu);margin-top:14px}.bio .lien b{color:var(--fg)}
.pubs{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px}
.pubs a{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px;border-radius:14px;background:#ffffff08;border:1px solid #ffffff10;text-decoration:none;color:var(--fg);font-size:12px;text-align:center}
.pubs a:hover{border-color:var(--c)}.pubs img{width:72px;height:72px;object-fit:contain;border-radius:10px}
@media(max-width:760px){.prog{grid-template-columns:1fr}.bio .cols{grid-template-columns:1fr}.l-vol{width:110px}}
"""

PAGE = """<!doctype html>
<html lang="{lg}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{name} {f} FM · {genre_t} · Vice Bay Radio</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="fr" href="{url_fr}"><link rel="alternate" hreflang="en" href="{url_en}"><link rel="alternate" hreflang="x-default" href="{url_fr}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Vice Bay Radio"><meta property="og:title" content="{name} {f} FM · Vice Bay Radio">
<meta property="og:description" content="{desc}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/img/share_{id}.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="675"><meta property="og:image:alt" content="{name} {f} FM, {host}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{SITE}/img/share_{id}.jpg"><meta name="theme-color" content="#0b0b14">
<link rel="icon" href="{rel}img/icon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
{goat}
<script type="application/ld+json">{ld}</script>
<style>
:root{{--c:{c};--bg:#0b0b14;--fg:#f2f0ff;--mu:#a9a6c4;--ca:#14142a}}
*{{box-sizing:border-box}}html{{background:var(--bg)}}body{{margin:0;background:radial-gradient(900px 600px at 0 0,color-mix(in srgb,var(--c) 22%,transparent),transparent),var(--bg);color:var(--fg);font:16px/1.55 'DM Sans',system-ui,sans-serif}}
a{{color:var(--c)}}main{{max-width:980px;margin:0 auto;padding:16px 16px 48px}}
.top{{display:flex;justify-content:space-between;gap:12px;font-size:14px}}.top a{{color:var(--mu);text-decoration:none}}
.hero{{display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center;margin:18px 0 8px}}
.portrait{{position:relative;border-radius:22px;overflow:hidden;aspect-ratio:1;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);box-shadow:0 20px 60px color-mix(in srgb,var(--c) 25%,transparent)}}
.portrait img{{width:100%;height:100%;object-fit:cover;display:block}}
.portrait .logo{{position:absolute;left:12px;bottom:12px;width:72px;height:72px;border-radius:14px;background:#000a;padding:4px}}
.k{{letter-spacing:.14em;font-size:12px;color:var(--mu);text-transform:uppercase}}
h1{{font:900 clamp(38px,8vw,72px)/1 Orbitron,sans-serif;margin:8px 0 6px;color:#fff}}
.f{{font:700 26px Orbitron,sans-serif;color:var(--c)}}.promesse{{font-size:20px;margin:14px 0 4px}}.host-l{{color:var(--mu);margin:0 0 18px}}
.etat{{font-weight:700}}.titre{{color:var(--mu);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
{extra_css}
.eq{{display:none;gap:3px;align-items:flex-end;height:16px;margin-left:8px}}.joue .eq{{display:inline-flex}}
.eq i{{width:3px;background:var(--c);animation:b 1s infinite ease-in-out}}.eq i:nth-child(2){{animation-delay:-.4s}}.eq i:nth-child(3){{animation-delay:-.7s}}
@keyframes b{{0%,100%{{height:4px}}50%{{height:16px}}}}
.sec{{font-size:14px;margin:10px 2px 0;display:block;color:var(--mu)}}
section{{background:var(--ca);border-radius:16px;padding:20px;margin:16px 0}}h2{{font:700 15px Orbitron,sans-serif;margin:0 0 12px;color:var(--c)}}
.duo{{display:grid;grid-template-columns:1fr 1fr;gap:16px}}.duo section{{margin:0}}
blockquote{{margin:0;padding-left:12px;border-left:3px solid var(--c);font-style:italic;font-size:18px}}
details summary{{cursor:pointer;font-weight:700}}ol{{margin:12px 0 0;padding-left:22px;columns:2;column-gap:28px}}li{{break-inside:avoid;font-size:14px}}li span{{color:var(--mu)}}
.gta{{display:flex;justify-content:space-between;align-items:center;gap:16px;border:1px solid #ffffff1a;background:linear-gradient(90deg,#ff3e9a22,#7a5cff22)}}
.gta p{{margin:4px 0 0;color:var(--mu)}}.btn{{flex:none;padding:12px 18px;border-radius:999px;background:#fff;color:#0b0b14;font-weight:700;text-decoration:none}}
.autres{{display:flex;flex-wrap:wrap;gap:8px}}.autres a{{padding:8px 14px;border-radius:999px;background:#ffffff10;text-decoration:none;font-size:14px}}
footer{{color:var(--mu);font-size:12px;text-align:center;max-width:640px;margin:24px auto 0}}
@media(max-width:760px){{.hero{{grid-template-columns:1fr;gap:16px}}.portrait{{aspect-ratio:16/11;order:-1}}.duo{{grid-template-columns:1fr}}ol{{columns:1}}.gta{{flex-direction:column;align-items:flex-start}}}}
</style></head><body><main>
<div class="top"><a href="{rel}">{retour}</a><a href="{lang_url}">{lang_lab}</a></div>
<div class="hero">
<div>
<div class="k">Vice Bay Radio · {genre}</div>
<h1>{name}</h1><div class="f">{f} FM</div>
<p class="promesse">{slogan}</p><p class="host-l">{avec} <strong>{host}</strong></p>
<div class="lecteur" id="lect">
<div class="l-top"><img class="l-art" src="{rel}{logo}" alt="" width="56" height="56">
<div class="info"><div class="etat"><span class="badge">{live}</span> <span id="etat">{ecouter} {name}</span><span class="eq"><i></i><i></i><i></i></span></div>
<div class="titre" id="titre">{genre}</div></div></div>
<div class="l-ctl"><button id="pp" class="big" aria-label="{ecouter} {name}"><svg viewBox="0 0 24 24" fill="currentColor"><path id="ico" d="M7 4v16l13-8z"/></svg></button>
<label class="l-vol"><span>{vol}</span><input id="vol" type="range" min="0" max="100" value="80" aria-label="{vol}"></label></div>
<div class="l-next">{direct_p}</div>
</div>
<a class="sec" href="{rel}?tune={id}">{ouvrir} →</a>
</div>
<div class="portrait"><img src="{rel}img/hostL_{id}.jpg" alt="{host}, {name} {f} FM" width="600" height="600"><img class="logo" src="{rel}{logo}" alt="Logo {name}"></div>
</div>
{bio_html}
<section><h2>{jingle}</h2><blockquote>« {jingle_txt} »</blockquote></section>
<section><h2>{programme}</h2><details><summary>{n} {morceaux}</summary><ol>{titres}</ol></details></section>
{pubs_html}
<section class="gta"><div><h2 style="margin:0">{gta_t}</h2><p>{gta_p}</p></div><a class="btn" id="gta" href="https://gtavifrance.com/{gta_lg}?utm_source=vicebayradio&utm_medium=station&utm_campaign={id}">{gta_b} →</a></section>
<section><h2>{autres}</h2><div class="autres">{autres_l}</div></section>
<footer>{pied}</footer>
</main>
<script>
{player}
</script></body></html>
"""

def main():
    S = D["stations"]
    urls = []
    for lg in ("fr", "en"):
        t = TXT[lg]; dossier = RACINE / ("station" if lg == "fr" else "en/station"); dossier.mkdir(parents=True, exist_ok=True)
        rel = "../" if lg == "fr" else "../../"
        for s in S:
            g = s["genre"] if lg == "fr" else s.get("genre_en", s["genre"])
            slogan = s["slogan"] if lg == "fr" else s.get("slogan_en", s["slogan"])
            bio = s["bio"] if lg == "fr" else s.get("bio_en", s["bio"])
            url_fr, url_en = f"{SITE}/station/{s['id']}.html", f"{SITE}/en/station/{s['id']}.html"
            url = url_fr if lg == "fr" else url_en
            desc = t["desc"].format(name=s["name"], f=s["f"], genre=g.lower(), host=s["host"], slogan=slogan)
            ld = json.dumps({"@context": "https://schema.org", "@type": "RadioStation", "name": f"{s['name']} {s['f']} FM", "url": url, "description": desc,
                             "image": f"{SITE}/img/share_{s['id']}.jpg", "inLanguage": lg, "parentOrganization": {"@type": "Organization", "name": "Vice Bay Radio", "url": SITE}}, ensure_ascii=False)
            def abs_src(u):
                return u if u.startswith("http") else SITE + "/" + u.lstrip("/")
            live = [{"src": abs_src(x["src"]), "title": x.get("title", ""), "artist": x.get("artist", ""), "type": x.get("type", "track")} for x in s.get("live", [])]
            prog_l = "".join(f'<button type="button" data-i="{k}"><b>{n_:02d}</b>{e(x["title"])} <span>{("· " + e(x["artist"])) if x["artist"] else ""}</span></button>'
                             for n_, (k, x) in enumerate(((k, x) for k, x in enumerate(live) if x["type"] != "link"), 1))
            tj = json.dumps({"c": t["connexion"], "on": t["en_ecoute"], "p": t["pause"], "r": t["reessayer"], "live": t["live"]}, ensure_ascii=False)
            player = (PLAYER_JS.replace("%%LIVE%%", json.dumps(live, ensure_ascii=False)).replace("%%ID%%", s["id"]).replace("%%T%%", tj)
                      .replace("%%NAME%%", s["name"]).replace("%%F%%", str(s["f"])).replace("%%ART%%", f"{SITE}/img/hostL_{s['id']}.jpg"))
            b = (BIOS.get(s["id"]) or {}).get(lg)
            if b:
                bio_html = (f'<section class="bio"><h2>{t["bio_t"]} {e(s["host"])} ?</h2><p class="acc">{e(b["accroche"])}</p><div class="cols"><div>'
                            + "".join(f"<p>{e(x)}</p>" for x in b["paras"]) + '</div><div>'
                            + f'<ul class="faits"><h3>{t["a_savoir"].upper()}</h3>' + "".join(f"<li>{e(x)}</li>" for x in b["faits"]) + '</ul>'
                            + f'<blockquote style="margin-top:16px">« {e(b["citation"])} »</blockquote></div></div>'
                            + (f'<p class="lien"><b>{t["lien_t"]}.</b> {e(b["lien"])}</p>' if b.get("lien") else "") + '</section>')
            else:
                bio_html = f'<section><h2>{t["antenne"]}</h2><strong>{e(s["host"])}</strong><br><span style="color:var(--mu)">{e(bio)}</span></section>'
            ads = [x for x in D.get("ads", []) if x.get("station") == s["id"]]
            pubs_html = ("" if not ads else f'<section><h2>{t["pubs_t"]}</h2><p class="sub">{t["pubs_sub"].replace("{name}", s["name"])}</p><div class="pubs">'
                         + "".join(f'<a href="{rel}#pub-{x["id"]}"><img src="{rel}{x["logo"]}" alt="" loading="lazy" width="72" height="72">{e(x["shop"])}</a>' for x in ads) + '</div></section>')
            page = PAGE.format(
                lg=lg, SITE=SITE, url=url, url_fr=url_fr, url_en=url_en, rel=rel,
                lang_url=url_en if lg == "fr" else url_fr, lang_lab="English" if lg == "fr" else "Français",
                desc=e(desc), ld=ld, goat=GOAT, id=s["id"], name=e(s["name"]), f=s["f"], c=s["c"], logo=s["logo"],
                genre=e(g), genre_t=e(g.title()), slogan=e(slogan), host=e(s["host"]), bio=e(bio),
                jingle_txt=e((s.get("jingles") or [slogan])[0]), n=len(s.get("catalog", [])),
                titres="".join(f"<li>{e(x['t'])} <span>· {e(x['a'])}</span></li>" for x in s.get("catalog", [])),
                autres_l="".join(f'<a href="{o["id"]}.html" style="color:{o["c"]}">{e(o["name"])} {o["f"]}</a>' for o in S if o["id"] != s["id"]),
                player=player, extra_css=EXTRA_CSS, bio_html=bio_html, pubs_html=pubs_html, prog_l=prog_l, gta_lg="" if lg == "fr" else "en/", **{k: v for k, v in t.items() if k != "desc"})
            (dossier / f"{s['id']}.html").write_text(page, encoding="utf-8")
            urls.append(url)
    jour = datetime.date.today().isoformat()
    (RACINE / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"<url><loc>{u}</loc><lastmod>{jour}</lastmod></url>\n" for u in [SITE + "/", SITE + "/podcast.html"] + urls) + "</urlset>\n", encoding="utf-8")
    print(len(urls), "pages station + sitemap.xml")

if __name__ == "__main__":
    main()
