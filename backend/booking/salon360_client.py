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
        # Base URLs: active endpoint first, followed by external pending endpoint
        self.primary_url = 'https://api.salon360app.com/api/online-booking/v1/booking'
        self.external_url = 'https://api.salon360app.com/api/online-booking/v1/external/booking'
        # Respect settings if explicitly provided
        configured = (getattr(settings, 'SALON360_BASE_URL', None) or '').rstrip('/')
        if configured:
            self.urls = [configured, self.primary_url, self.external_url]
            # Deduplicate preserving order
            seen = set()
            self.urls = [u for u in self.urls if not (u in seen or seen.add(u))]
        else:
            self.urls = [self.primary_url, self.external_url]

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
        last_error = None
        last_status = 502
        last_data = None

        for url in self.urls:
            full_url = f"{url}{endpoint}"
            try:
                logger.info(f"[Salon360] {method} {full_url}")
                resp = requests.request(
                    method=method,
                    url=full_url,
                    headers=self._headers(idempotency_key),
                    params=params,
                    json=json_data,
                    timeout=timeout,
                )
                try:
                    data = resp.json()
                except Exception:
                    data = {"responseCode": resp.status_code, "responseMsg": resp.text, "response": None}

                # If current URL returns 401 or 404, try next candidate URL
                if resp.status_code in (401, 404) and url != self.urls[-1]:
                    last_status = resp.status_code
                    last_data = data
                    continue

                return resp.status_code, data
            except requests.RequestException as e:
                logger.warning(f"[Salon360] Error connecting to {full_url}: {e}")
                last_error = e

        if last_data:
            return last_status, last_data

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

