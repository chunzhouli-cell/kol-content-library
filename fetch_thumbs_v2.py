#!/usr/bin/env python3
"""Fetch missing thumbnails using oEmbed APIs and fallback services."""

import json, os, re, urllib.request, urllib.error, ssl, time

with open("alldata_enriched.json", "r") as f:
    data = json.load(f)

os.makedirs("thumbs", exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

def fetch_json(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        return json.loads(resp.read().decode("utf-8", errors="ignore"))
    except Exception as e:
        return None

def download_image(img_url, path):
    try:
        req = urllib.request.Request(img_url, headers=HEADERS)
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        content = resp.read()
        if len(content) < 1000:  # Too small, probably an error page
            return False
        with open(path, "wb") as f:
            f.write(content)
        return True
    except:
        return False

def try_tiktok_oembed(link):
    """TikTok oEmbed API - returns thumbnail_url"""
    # Normalize short URLs first
    if 'vm.tiktok.com' in link or 'vt.tiktok.com' in link:
        try:
            req = urllib.request.Request(link, headers=HEADERS)
            resp = urllib.request.urlopen(req, timeout=10, context=ctx)
            link = resp.url  # Follow redirect
        except:
            return None

    url = "https://www.tiktok.com/oembed?url=" + urllib.request.quote(link, safe='')
    data = fetch_json(url)
    if data and data.get("thumbnail_url"):
        return data["thumbnail_url"]
    return None

def try_instagram_oembed(link):
    """Instagram oEmbed (limited, may work for public posts)"""
    url = "https://graph.facebook.com/v18.0/instagram_oembed?url=" + urllib.request.quote(link, safe='') + "&access_token=DUMMY"
    # This won't work without a real token, but let's try the old endpoint
    url2 = "https://api.instagram.com/oembed/?url=" + urllib.request.quote(link, safe='')
    data = fetch_json(url2)
    if data and data.get("thumbnail_url"):
        return data["thumbnail_url"]
    return None

def try_twitter_syndication(link):
    """Twitter syndication API for tweet screenshots"""
    m = re.search(r'status/(\d+)', link)
    if not m:
        return None
    tweet_id = m.group(1)
    # Try Twitter's publish API
    url = "https://publish.twitter.com/oembed?url=" + urllib.request.quote(link, safe='')
    data = fetch_json(url)
    # Twitter oembed doesn't return images directly, but we can try syndication
    # Try nitter or other mirrors for thumbnail
    return None

def try_facebook_oembed(link):
    """Facebook oEmbed"""
    url = "https://graph.facebook.com/v18.0/oembed_video?url=" + urllib.request.quote(link, safe='') + "&access_token=DUMMY"
    data = fetch_json(url)
    if data and data.get("thumbnail_url"):
        return data["thumbnail_url"]
    return None

def try_microlink(link):
    """Microlink.io - free tier, renders JS and extracts og:image"""
    url = "https://api.microlink.io?url=" + urllib.request.quote(link, safe='')
    data = fetch_json(url)
    if data and data.get("status") == "success":
        img = data.get("data", {}).get("image", {})
        if img and img.get("url"):
            return img["url"]
        # Try video thumbnail
        vid = data.get("data", {}).get("video", {})
        if vid and vid.get("url"):
            return None  # Video URL, not thumbnail
    return None

missing = [item for item in data if not item.get("thumb")]
print(f"Found {len(missing)} items without thumbnails\n")

updated = 0
for item in missing:
    link = item.get("link", "")
    if not link:
        print(f"  [{item['id']}] {item['kol']} - no link, skipping")
        continue

    p = item.get("p", "")
    print(f"  [{item['id']}] {item['kol']} ({p}) - {link[:50]}...")

    thumb_url = None

    # Platform-specific oEmbed
    if "tiktok" in link.lower() or p == "tiktok":
        print(f"    Trying TikTok oEmbed...", end=" ")
        thumb_url = try_tiktok_oembed(link)
        if thumb_url: print("✓")
        else: print("✗")

    if not thumb_url and ("instagram" in link.lower() or p == "instagram"):
        print(f"    Trying Instagram oEmbed...", end=" ")
        thumb_url = try_instagram_oembed(link)
        if thumb_url: print("✓")
        else: print("✗")

    if not thumb_url and ("x.com" in link.lower() or "twitter" in link.lower() or p == "twitter"):
        print(f"    Trying Twitter syndication...", end=" ")
        thumb_url = try_twitter_syndication(link)
        if thumb_url: print("✓")
        else: print("✗")

    # Fallback: Microlink (works for most platforms, rate-limited)
    if not thumb_url:
        print(f"    Trying Microlink...", end=" ")
        thumb_url = try_microlink(link)
        if thumb_url: print("✓")
        else: print("✗")

    if thumb_url:
        ext = ".jpg"
        if ".png" in thumb_url.lower(): ext = ".png"
        elif ".webp" in thumb_url.lower(): ext = ".webp"

        thumb_path = f"thumbs/{item['id']}{ext}"
        if download_image(thumb_url, thumb_path):
            item["thumb"] = thumb_path
            updated += 1
            print(f"    → Saved to {thumb_path}")
        else:
            print(f"    → Download failed")
    else:
        print(f"    → No thumbnail found")

    time.sleep(1)  # Rate limiting

# Save
with open("alldata_enriched.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n{'='*50}")
print(f"Done! Updated {updated}/{len(missing)} items with thumbnails")
still_missing = len([i for i in data if not i.get("thumb")])
print(f"Still missing: {still_missing}")
