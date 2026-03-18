#!/usr/bin/env python3
"""Fetch KOL avatars from their profile pages."""
import os, re, json, time, hashlib, sys
import urllib.request
import urllib.error
from html.parser import HTMLParser

AVATAR_DIR = os.path.join(os.path.dirname(__file__), "avatars")
os.makedirs(AVATAR_DIR, exist_ok=True)

# Parse KOL data from the HTML
def extract_kols_from_html(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
    # Find allData JSON array
    match = re.search(r'const allData\s*=\s*(\[.*?\]);', content, re.DOTALL)
    if not match:
        print("ERROR: Could not find allData in HTML")
        return {}
    data = json.loads(match.group(1))
    kols = {}
    for item in data:
        name = item.get("kol", "")
        if name and name not in kols:
            kols[name] = {
                "profile": item.get("profile", ""),
                "platform": item.get("p", ""),
                "link": item.get("link", "")
            }
    return kols

def safe_filename(name):
    """Create a safe filename from KOL name."""
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    safe = re.sub(r'[^\w\-]', '_', name)[:30]
    return f"{safe}_{h}.jpg"

def fetch_url(url, timeout=10):
    """Fetch URL content with a browser-like User-Agent."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read(), resp.headers.get("Content-Type", "")

class MetaTagParser(HTMLParser):
    """Parse HTML to find og:image and other avatar-related meta tags."""
    def __init__(self):
        super().__init__()
        self.og_image = None
        self.twitter_image = None
        self.found_images = []

    def handle_starttag(self, tag, attrs):
        if tag != "meta":
            return
        d = dict(attrs)
        prop = d.get("property", "").lower()
        name = d.get("name", "").lower()
        content = d.get("content", "")
        if prop == "og:image" and content:
            self.og_image = content
        if name == "twitter:image" and content:
            self.twitter_image = content

def get_og_image(url):
    """Fetch a page and extract the og:image meta tag."""
    try:
        html_bytes, _ = fetch_url(url)
        html = html_bytes.decode("utf-8", errors="ignore")
        parser = MetaTagParser()
        parser.feed(html)
        return parser.og_image or parser.twitter_image
    except Exception as e:
        return None

def extract_username_ig(profile_url):
    """Extract Instagram username from profile URL."""
    m = re.search(r'instagram\.com/([^/?#]+)', profile_url)
    return m.group(1) if m else None

def extract_username_yt(profile_url):
    """Extract YouTube channel handle or ID from profile URL."""
    # @handle format
    m = re.search(r'youtube\.com/@([^/?#]+)', profile_url)
    if m:
        return m.group(1)
    # /channel/ID format
    m = re.search(r'youtube\.com/channel/([^/?#]+)', profile_url)
    if m:
        return m.group(1)
    return None

def extract_username_tt(profile_url):
    """Extract TikTok username from profile URL."""
    m = re.search(r'tiktok\.com/@([^/?#]+)', profile_url)
    return m.group(1) if m else None

def extract_username_tw(profile_url):
    """Extract Twitter/X username from profile URL."""
    m = re.search(r'(?:twitter\.com|x\.com)/([^/?#]+)', profile_url)
    return m.group(1) if m else None

def download_image(img_url, save_path):
    """Download an image and save it."""
    try:
        data, ctype = fetch_url(img_url)
        if len(data) < 500:  # too small, probably an error
            return False
        with open(save_path, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        return False

def fetch_avatar(kol_name, info):
    """Try to fetch avatar for a KOL. Returns local filename or None."""
    profile = info["profile"]
    platform = info["platform"]
    filename = safe_filename(kol_name)
    save_path = os.path.join(AVATAR_DIR, filename)

    # Skip if already downloaded
    if os.path.exists(save_path) and os.path.getsize(save_path) > 500:
        return filename

    if not profile:
        return None

    # Strategy 1: Try unavatar.io (works for many platforms)
    username = None
    unavatar_url = None

    if "instagram.com" in profile:
        username = extract_username_ig(profile)
        if username:
            unavatar_url = f"https://unavatar.io/instagram/{username}"
    elif "youtube.com" in profile:
        username = extract_username_yt(profile)
        if username:
            unavatar_url = f"https://unavatar.io/youtube/{username}"
    elif "tiktok.com" in profile:
        username = extract_username_tt(profile)
        # No unavatar for TikTok, try og:image
    elif "twitter.com" in profile or "x.com" in profile:
        username = extract_username_tw(profile)
        if username:
            unavatar_url = f"https://unavatar.io/twitter/{username}"
    elif "facebook.com" in profile:
        unavatar_url = None  # Facebook doesn't work well with unavatar
    elif "linkedin.com" in profile:
        unavatar_url = None

    # Try unavatar.io first
    if unavatar_url:
        if download_image(unavatar_url, save_path):
            return filename

    # Strategy 2: Try og:image from profile page
    og_img = get_og_image(profile)
    if og_img:
        if download_image(og_img, save_path):
            return filename

    # Strategy 3: For YouTube, try oembed
    if "youtube.com" in profile:
        try:
            oembed_url = f"https://www.youtube.com/oembed?url={urllib.request.quote(profile, safe='')}&format=json"
            data, _ = fetch_url(oembed_url)
            oembed = json.loads(data)
            thumb = oembed.get("thumbnail_url", "")
            if thumb:
                # YouTube oembed gives video thumb, not channel. Try channel avatar from page.
                pass
        except:
            pass

    return None

def main():
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    kols = extract_kols_from_html(html_path)
    print(f"Found {len(kols)} unique KOLs")

    results = {}
    success = 0
    failed = 0

    for i, (name, info) in enumerate(kols.items()):
        print(f"[{i+1}/{len(kols)}] {name} ({info['platform']})...", end=" ", flush=True)

        filename = fetch_avatar(name, info)
        if filename:
            results[name] = f"avatars/{filename}"
            print(f"✓ {filename}")
            success += 1
        else:
            print("✗ failed")
            failed += 1

        # Rate limiting
        time.sleep(0.3)

    # Save mapping
    mapping_path = os.path.join(os.path.dirname(__file__), "avatar_map.json")
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nDone! {success} avatars downloaded, {failed} failed")
    print(f"Mapping saved to {mapping_path}")

if __name__ == "__main__":
    main()
