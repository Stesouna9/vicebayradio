#!/usr/bin/env python3
"""catalog.json (lu par l'app iOS/Android) généré depuis data.js : URLs absolues, stations, crédits."""
import json, pathlib, re, time
root = pathlib.Path(__file__).resolve().parent.parent
raw = (root / "data.js").read_text()
d = json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
BASE = "https://vicebayradio.com/"
LIVE = "https://live.2-29-41-109.sslip.io/"
def absu(u): return u if u.startswith("http") else BASE + u
stations = []
for s in sorted(d["stations"], key=lambda s: s["f"]):
    stations.append({k: s.get(k, "") for k in ("id", "name", "f", "genre", "genre_en", "slogan", "slogan_en", "c", "host")}
                    | {"logo": absu(s["logo"]),
                       "tracks": [{"src": absu(t["src"]), "title": t["title"], "artist": t["artist"]} for t in s["live"] if t["type"] == "track"],
                       "jingles": s.get("jingles", []),
                       "stream": LIVE + s["id"]})
out = {"version": time.strftime("%Y%m%d%H%M"), "discord": "https://discord.gg/TSaxEnt2dG", "site": "https://vicebayradio.com/",
       "stations": stations, "credits": d.get("credits", {}), "licenses": d.get("licenses", {})}
(root / "catalog.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
print(len(stations), sum(len(s["tracks"]) for s in stations), "titres")
