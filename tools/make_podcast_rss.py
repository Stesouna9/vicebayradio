#!/usr/bin/env python3
"""Génère podcast.xml (flux RSS Apple Podcasts / Spotify) à partir de podcast.json et des mp3 de audio/.
À relancer à chaque nouvel épisode : python3 tools/make_podcast_rss.py"""
import json, os, subprocess, datetime
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://vicebayradio.com"
pod = json.load(open(os.path.join(ROOT, "podcast.json"), encoding="utf-8"))

def dur(path):
    try:
        out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode().strip()
        s = int(float(out)); return f"{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}"
    except Exception:
        return "00:00:00"

items = []
for e in sorted(pod["episodes"], key=lambda x: x["n"], reverse=True):
    rel = e["audio"].replace(SITE + "/", "")
    path = os.path.join(ROOT, rel)
    size = os.path.getsize(path) if os.path.exists(path) else 0
    d = datetime.datetime.strptime(e["date"], "%Y-%m-%d").replace(hour=8 + 4 * (e["n"] - 1), tzinfo=datetime.timezone.utc)
    items.append(f"""    <item>
      <title>{escape(e['title'])}</title>
      <itunes:title>{escape(e['title'])}</itunes:title>
      <description>{escape(e['desc'])}</description>
      <itunes:summary>{escape(e['desc'])}</itunes:summary>
      <pubDate>{d.strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>
      <enclosure url="{escape(e['audio'])}" length="{size}" type="audio/mpeg"/>
      <guid isPermaLink="false">vicebay-podcast-{escape(e['id'])}</guid>
      <link>{SITE}/podcast.html#{escape(e['id'])}</link>
      <itunes:episode>{e['n']}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:duration>{dur(path)}</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="{SITE}/img/podcast_cover_1400.jpg"/>
    </item>""")

xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Vice Bay Podcast</title>
    <link>{SITE}/podcast.html</link>
    <atom:link href="{SITE}/podcast.xml" rel="self" type="application/rss+xml"/>
    <language>fr</language>
    <copyright>© OKALAM Studio</copyright>
    <description>{escape(pod['tagline'])}</description>
    <itunes:summary>{escape(pod['tagline'])}</itunes:summary>
    <itunes:author>OKALAM Studio</itunes:author>
    <itunes:owner><itunes:name>OKALAM Studio</itunes:name><itunes:email>support@okalamstudio.com</itunes:email></itunes:owner>
    <itunes:image href="{SITE}/img/podcast_cover_1400.jpg"/>
    <image><url>{SITE}/img/podcast_cover_1400.jpg</url><title>Vice Bay Podcast</title><link>{SITE}/podcast.html</link></image>
    <itunes:category text="Comedy"/>
    <itunes:category text="Arts"/>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
{chr(10).join(items)}
  </channel>
</rss>
"""
open(os.path.join(ROOT, "podcast.xml"), "w", encoding="utf-8").write(xml)
print("podcast.xml :", len(items), "épisode(s)")
