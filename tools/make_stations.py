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
               desc="{name} {f} FM : {genre}, avec {host} au micro. {slogan} Écoute gratuite en direct sur Vice Bay Radio.", avec="avec", vol="Volume"),
    "en": dict(retour="← All stations", ecouter="Listen", connexion="Connecting…", en_ecoute="On air", pause="Paused", reessayer="Retry",
               ouvrir="Open in the full player", antenne="On air", jingle="The jingle (in French)", programme="Playlist", morceaux="tracks, see the list",
               autres="More Vice Bay stations", gta_t="Waiting for GTA VI?", gta_p="Verified news, countdown and guides on GTA VI France.",
               gta_b="Visit gtavifrance.com", pied="Vice Bay Radio, the radio stations of Vice Bay, 1986. A fictional, independent universe, not affiliated with Rockstar Games. Made by OKALAM Studio, royalty-free music, artists credited.",
               desc="{name} {f} FM: {genre}, hosted by {host}. {slogan} Free live radio on Vice Bay Radio.", avec="with", vol="Volume"),
}

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
.lecteur{{background:var(--ca);border:1px solid #ffffff14;border-radius:18px;padding:14px;display:flex;gap:14px;align-items:center}}
.lecteur button{{flex:none;width:64px;height:64px;border-radius:50%;border:0;background:var(--c);color:#0b0b14;cursor:pointer;display:grid;place-items:center}}
.lecteur button svg{{width:26px;height:26px}}.lecteur .info{{flex:1;min-width:0}}
.etat{{font-weight:700}}.titre{{color:var(--mu);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.lecteur input{{width:100%;accent-color:var(--c);margin-top:6px}}
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
<button id="pp" aria-label="{ecouter} {name}"><svg viewBox="0 0 24 24" fill="currentColor"><path id="ico" d="M7 4v16l13-8z"/></svg></button>
<div class="info"><div class="etat"><span id="etat">{ecouter} {name}</span><span class="eq"><i></i><i></i><i></i></span></div>
<div class="titre" id="titre">{genre}</div>
<input id="vol" type="range" min="0" max="100" value="80" aria-label="{vol}"></div>
</div>
<a class="sec" href="{rel}?tune={id}">{ouvrir} →</a>
</div>
<div class="portrait"><img src="{rel}img/hostL_{id}.jpg" alt="{host}, {name} {f} FM" width="600" height="600"><img class="logo" src="{rel}{logo}" alt="Logo {name}"></div>
</div>
<div class="duo">
<section><h2>{antenne}</h2><strong>{host}</strong><br><span style="color:var(--mu)">{bio}</span></section>
<section><h2>{jingle}</h2><blockquote>« {jingle_txt} »</blockquote></section>
</div>
<section><h2>{programme}</h2><details><summary>{n} {morceaux}</summary><ol>{titres}</ol></details></section>
<section class="gta"><div><h2 style="margin:0">{gta_t}</h2><p>{gta_p}</p></div><a class="btn" id="gta" href="https://gtavifrance.com/{gta_lg}?utm_source=vicebayradio&utm_medium=station&utm_campaign={id}">{gta_b} →</a></section>
<section><h2>{autres}</h2><div class="autres">{autres_l}</div></section>
<footer>{pied}</footer>
</main>
<script>
(()=>{{const L={live},id="{id}",T={{c:"{connexion}",on:"{en_ecoute}",p:"{pause}",r:"{reessayer}"}};
const a=new Audio();a.preload="none";let i=Math.max(0,L.findIndex(t=>t.type!=="link")),ok=false,cumul=0,t0=0,compte30=false;
const $=x=>document.getElementById(x),ev=n=>{{try{{window.goatcounter&&goatcounter.count&&goatcounter.count({{path:"ecoute/"+n+"/"+id,title:n,event:true}})}}catch(e){{}}}};
const ico=p=>$("ico").setAttribute("d",p?"M6 4h4v16H6zM14 4h4v16h-4z":"M7 4v16l13-8z");
const charge=()=>{{const t=L[i];a.src=t.src;$("titre").textContent=t.type==="link"?"Vice Bay DJ":(t.title+(t.artist?" · "+t.artist:""))}};
const joue=()=>{{if(!a.src)charge();a.volume=0;$("etat").textContent=T.c;a.play().catch(()=>{{$("etat").textContent=T.r;ico(false)}});ico(true)}};
a.addEventListener("playing",()=>{{$("etat").textContent=T.on;$("lect").classList.add("joue");t0=Date.now();if(!ok){{ok=true;ev("play")}};
 const v=$("vol").value/100;let k=0;const f=setInterval(()=>{{k++;a.volume=Math.min(v,v*k/8);if(k>=8)clearInterval(f)}},60)}});
a.addEventListener("pause",()=>{{$("lect").classList.remove("joue");if(t0){{cumul+=Date.now()-t0;t0=0}};$("etat").textContent=T.p;ico(false)}});
a.addEventListener("ended",()=>{{i=(i+1)%L.length;charge();a.play()}});
a.addEventListener("error",()=>{{$("etat").textContent=T.r;ico(false)}});
setInterval(()=>{{if(!compte30&&cumul+(t0?Date.now()-t0:0)>30000){{compte30=true;ev("30s")}}}},5000);
$("pp").onclick=()=>a.paused?joue():a.pause();$("vol").oninput=e=>a.volume=e.target.value/100;
$("gta").addEventListener("click",()=>ev("gtavifrance"));
if("mediaSession" in navigator)navigator.mediaSession.metadata=new MediaMetadata({{title:"{name} {f} FM",artist:"Vice Bay Radio",artwork:[{{src:"{rel}img/hostL_{id}.jpg",sizes:"600x600",type:"image/jpeg"}}]}});
}})();
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
            live = [{"src": x["src"], "title": x.get("title", ""), "artist": x.get("artist", ""), "type": x.get("type", "track")} for x in s.get("live", [])]
            page = PAGE.format(
                lg=lg, SITE=SITE, url=url, url_fr=url_fr, url_en=url_en, rel=rel,
                lang_url=url_en if lg == "fr" else url_fr, lang_lab="English" if lg == "fr" else "Français",
                desc=e(desc), ld=ld, goat=GOAT, id=s["id"], name=e(s["name"]), f=s["f"], c=s["c"], logo=s["logo"],
                genre=e(g), genre_t=e(g.title()), slogan=e(slogan), host=e(s["host"]), bio=e(bio),
                jingle_txt=e((s.get("jingles") or [slogan])[0]), n=len(s.get("catalog", [])),
                titres="".join(f"<li>{e(x['t'])} <span>· {e(x['a'])}</span></li>" for x in s.get("catalog", [])),
                autres_l="".join(f'<a href="{o["id"]}.html" style="color:{o["c"]}">{e(o["name"])} {o["f"]}</a>' for o in S if o["id"] != s["id"]),
                live=json.dumps(live, ensure_ascii=False), gta_lg="" if lg == "fr" else "en/", **{k: v for k, v in t.items() if k != "desc"})
            (dossier / f"{s['id']}.html").write_text(page, encoding="utf-8")
            urls.append(url)
    jour = datetime.date.today().isoformat()
    (RACINE / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"<url><loc>{u}</loc><lastmod>{jour}</lastmod></url>\n" for u in [SITE + "/", SITE + "/podcast.html"] + urls) + "</urlset>\n", encoding="utf-8")
    print(len(urls), "pages station + sitemap.xml")

if __name__ == "__main__":
    main()
