import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class Salon360Client:
    def __init__(self):
        self.base_url = settings.SALON360_BASE_URL.rstrip("/")
        self.store_id = settings.SALON360_STORE_ID
        self.org_id = settings.SALON360_ORG_ID

    def _headers(self, idempotency_key=None):
        if not settings.SALON360_API_KEY:
            raise RuntimeError("Salon360 credentials not configured")
        headers = {
            "x-api-key": settings.SALON360_API_KEY,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if idempotency_key:
            headers["Idempotency-Key"] = str(idempotency_key)
        return headers

    def _request(
        self, method, endpoint, params=None, payload=None, idempotency_key=None
    ):
        endpoint_clean = endpoint.lstrip("/")
        try:
            headers = self._headers(idempotency_key)
            response = requests.request(
                method=method,
                url=f"{self.base_url}/{endpoint_clean}",
                headers=headers,
                params=params,
                json=payload,
                timeout=(5, 25),
            )
            try:
                data = response.json()
            except ValueError:
                data = {
                    "responseCode": response.status_code,
                    "responseMsg": "INVALID_UPSTREAM_RESPONSE",
                    "response": None,
                }
            return response.status_code, data
        except RuntimeError as e:
            logger.error(f"Configuration error: {e}")
            return 500, {
                "responseCode": 500,
                "responseMsg": "CONFIGURATION_ERROR",
                "dynMsg": str(e),
                "response": None,
            }
        except requests.RequestException:
            logger.exception("Salon360 request failed")
            return 502, {
                "responseCode": 502,
                "responseMsg": "SALON360_CONNECTION_ERROR",
                "dynMsg": "Booking service temporarily unavailable",
                "response": None,
            }

    def get_config(self):
        return self._request(
            "GET",
            "config",
            params={
                "storeId": self.store_id,
                "orgId": self.org_id,
            },
        )

    def get_staff(self):
        return self._request(
            "GET",
            "staff",
            params={
                "storeId": self.store_id,
                "orgId": self.org_id,
            },
        )

    def check_availability(self, payload):
        return self._request(
            "POST",
            "availability",
            payload={
                **payload,
                "storeId": self.store_id,
                "orgId": self.org_id,
            },
        )

    def create_booking(self, payload, idempotency_key):
        return self._request(
            "POST",
            "create",
            payload={
                **payload,
                "storeId": self.store_id,
                "orgId": self.org_id,
            },
            idempotency_key=idempotency_key,
        )


salon360 = Salon360Client()
