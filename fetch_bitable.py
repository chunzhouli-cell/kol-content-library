#!/usr/bin/env python3
"""Fetch ad rights fields from Feishu Bitable."""
import json, urllib.request, urllib.parse

APP_ID = "cli_a92c1bce91b9dcd6"
APP_SECRET = "0lNbRH8ODnCIOLk1ekCf9dnwxNZpLeoU"
APP_TOKEN = "Qi5ibQSQZa3kg2sThUjcK1vin6d"
TABLE_ID = "tblQnfeBvib8vPxk"

def api(method, url, data=None, token=None):
    headers = {"Content-Type": "application/json; charset=utf-8"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

# Step 1: Get tenant_access_token
token_resp = api("POST", "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
                 {"app_id": APP_ID, "app_secret": APP_SECRET})
token = token_resp["tenant_access_token"]
print(f"Got token: {token[:20]}...")

# Step 2: First, list fields to see all field names
fields_url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{TABLE_ID}/fields?page_size=100"
fields_resp = api("GET", fields_url, token=token)
print(f"\n=== ALL FIELDS ({len(fields_resp['data']['items'])}) ===")
for f in fields_resp["data"]["items"]:
    print(f"  [{f['type']}] {f['field_name']}")

# Step 3: Fetch all records
all_records = []
page_token = None
while True:
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{TABLE_ID}/records?page_size=500"
    if page_token:
        url += f"&page_token={page_token}"
    resp = api("GET", url, token=token)
    items = resp["data"].get("items", [])
    all_records.extend(items)
    print(f"Fetched {len(items)} records (total: {len(all_records)})")
    if not resp["data"].get("has_more"):
        break
    page_token = resp["data"]["page_token"]

# Step 4: Save raw data
with open("/Users/chunzhouli/Content/kol-content-library/bitable_raw.json", "w", encoding="utf-8") as f:
    json.dump(all_records, f, ensure_ascii=False, indent=2)

print(f"\nTotal records: {len(all_records)}")
print("Saved to bitable_raw.json")

# Show first record's fields as sample
if all_records:
    print("\n=== SAMPLE RECORD FIELDS ===")
    fields = all_records[0].get("fields", {})
    for k, v in fields.items():
        print(f"  {k}: {json.dumps(v, ensure_ascii=False)[:100]}")
