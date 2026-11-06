import requests
import logging
import uuid
from django.conf import settings

logger = logging.getLogger('salon360')

class Salon360Client:
    """
    Dedicated client for Salon360 Online Booking API.
    Handles authentication, headers, error wrapping, and request forwarding.
    """

    def __init__(self):
        self.store_id = settings.SALON360_STORE_ID
        self.org_id = settings.SALON360_ORG_ID
        self.api_key = settings.SALON360_API_KEY
        # Base URLs (supports primary and fallback external path)
        self.base_url = settings.SALON360_BASE_URL.rstrip('/')
        self.fallback_base_url = 'https://api.salon360app.com/api/online-booking/v1/external/booking'

    def _headers(self, idempotency_key=None):
        headers = {
            'x-api-key': self.api_key,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        if idempotency_key:
            headers['Idempotency-Key'] = str(idempotency_key)
        return headers

    def _request(self, method, endpoint, params=None, json_data=None, idempotency_key=None, timeout=15):
        # Try primary base URL first
        urls = [f"{self.base_url}{endpoint}", f"{self.fallback_base_url}{endpoint}"]
        last_error = None

        for url in urls:
            try:
                logger.info(f"[Salon360] {method} {url}")
                resp = requests.request(
                    method=method,
                    url=url,
                    headers=self._headers(idempotency_key),
                    params=params,
                    json=json_data,
                    timeout=timeout,
                )
                try:
                    data = resp.json()
                except Exception:
                    data = {"responseCode": resp.status_code, "responseMsg": resp.text, "response": None}

                if resp.status_code == 404 and url != urls[-1]:
                    # Try fallback URL if 404
                    continue

                return resp.status_code, data
            except requests.RequestException as e:
                logger.warning(f"[Salon360] Error connecting to {url}: {e}")
                last_error = e

        return 502, {
            "responseCode": 502,
            "responseMsg": "GATEWAY_ERROR",
            "dynMsg": f"Failed to connect to Salon360: {last_error}",
            "response": None,
        }

    def get_config(self):
        """GET /config?storeId=868&orgId=555"""
        params = {'storeId': self.store_id, 'orgId': self.org_id}
        return self._request('GET', '/config', params=params)

    def get_staff(self):
        """GET /staff?storeId=868&orgId=555"""
        params = {'storeId': self.store_id, 'orgId': self.org_id}
        return self._request('GET', '/staff', params=params)

    def check_availability(self, payload):
        """POST /availability"""
        data = dict(payload)
        data.setdefault('storeId', self.store_id)
        data.setdefault('orgId', self.org_id)
        return self._request('POST', '/availability', json_data=data)

    def create_booking(self, payload, idempotency_key=None):
        """POST /create"""
        data = dict(payload)
        data.setdefault('storeId', self.store_id)
        data.setdefault('orgId', self.org_id)
        if not idempotency_key:
            idempotency_key = str(uuid.uuid4())
        return self._request('POST', '/create', json_data=data, idempotency_key=idempotency_key)

salon360 = Salon360Client()
