#!/usr/bin/env python3
"""Fetch missing thumbnails from video URLs using og:image meta tags."""

import json, os, re, urllib.request, urllib.error, ssl, time

# Load data
with open("alldata_enriched.json", "r") as f:
    data = json.load(f)

os.makedirs("thumbs", exist_ok=True)

# SSL context that doesn't verify (for simplicity)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_og_image(url):
    """Try to extract og:image from a URL's HTML."""
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        })
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        html = resp.read().decode("utf-8", errors="ignore")[:50000]

        # Look for og:image
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.IGNORECASE)
        if m:
            return m.group(1)
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
    return None

def download_image(img_url, path):
    """Download an image to local path."""
    try:
        req = urllib.request.Request(img_url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        })
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        with open(path, "wb") as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"  Download error: {e}")
        return False

missing = [item for item in data if not item.get("thumb")]
print(f"Found {len(missing)} items without thumbnails")

updated = 0
for item in missing:
    link = item.get("link", "")
    if not link:
        print(f"  [{item['id']}] {item['kol']} - no link, skipping")
        continue

    print(f"  [{item['id']}] {item['kol']} ({item['p']}) - {link[:60]}...")

    og_img = fetch_og_image(link)
    if og_img:
        ext = ".jpg"
        if ".png" in og_img.lower():
            ext = ".png"
        elif ".webp" in og_img.lower():
            ext = ".webp"

        thumb_path = f"thumbs/{item['id']}{ext}"
        if download_image(og_img, thumb_path):
            item["thumb"] = thumb_path
            updated += 1
            print(f"    ✓ Saved to {thumb_path}")
        else:
            print(f"    ✗ Failed to download og:image")
    else:
        print(f"    ✗ No og:image found")

    time.sleep(0.5)  # Be polite

# Save updated data
with open("alldata_enriched.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nDone! Updated {updated}/{len(missing)} items with thumbnails")
