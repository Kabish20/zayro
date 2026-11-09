import requests
import json
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
load_dotenv('.env')

store_id = os.environ.get('SALON360_STORE_ID', '868')
org_id = os.environ.get('SALON360_ORG_ID', '555')
client_key = os.environ.get('SALON360_CLIENT_KEY', '')
client_secret = os.environ.get('SALON360_CLIENT_SECRET', '')
api_key = os.environ.get('SALON360_API_KEY', f"{client_key}:{client_secret}")
base_url = os.environ.get('SALON360_API_BASE', 'https://api.salon360app.com/api/online-booking/v1/external/booking').rstrip('/')

headers = {
    'x-api-key': api_key,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

print("=== SALON360 LIVE API PROBE ===")
print("Base URL:", base_url)
print("Store ID:", store_id, "| Org ID:", org_id)
print("API Key format:", f"{client_key[:8]}...:{client_secret[:8]}..." if client_key and client_secret else "MISSING")

endpoints = [
    ("GET", f"{base_url}/config?storeId={store_id}&orgId={org_id}", None),
    ("GET", f"{base_url}/staff?storeId={store_id}&orgId={org_id}", None),
]

for method, url, payload in endpoints:
    print(f"\n--- Testing: {method} {url} ---")
    try:
        resp = requests.request(method, url, headers=headers, json=payload, timeout=10)
        print("HTTP Status Code:", resp.status_code)
        print("Response Headers:", dict(resp.headers))
        try:
            print("Response Body JSON:", json.dumps(resp.json(), indent=2))
        except Exception:
            print("Response Body Text:", resp.text[:500])
    except Exception as e:
        print("Network/Connection Error:", str(e))

