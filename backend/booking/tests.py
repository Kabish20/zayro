import uuid
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

from booking.models import SalonService, BookingRecord


class Salon360IntegrationTests(APITestCase):
    def setUp(self):
        # Create test admin user
        self.admin_user = User.objects.create_superuser(
            username='admin_test',
            email='admin@zayro.com',
            password='testpassword123'
        )

        # Seed test service
        self.service = SalonService.objects.create(
            website_service_id="rate-haircut",
            salon360_service_id=102001,
            name="Precision Haircut",
            duration_minutes=30,
            price=99.00,
            tax_id=1,
            tax_group_id=1,
            is_active=True,
        )

    def test_health_check(self):
        """GET /api/health/ returns 200 OK and status UP"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("status"), "UP")
        self.assertIn("database", response.data)
        self.assertIn("salon360", response.data)

    def test_service_list_view(self):
        """GET /api/salon360/services/ returns active mapped services"""
        response = self.client.get('/api/salon360/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        services = response.data
        self.assertTrue(any(s["website_service_id"] == "rate-haircut" for s in services))

    def test_availability_validation_errors(self):
        """POST /api/salon360/availability/ rejects invalid service or past date"""
        yesterday = (timezone.localdate() - timedelta(days=1)).isoformat()
        resp_past = self.client.post('/api/salon360/availability/', {
            "service_id": "rate-haircut",
            "date": yesterday,
        }, format='json')
        self.assertEqual(resp_past.status_code, status.HTTP_400_BAD_REQUEST)

        tomorrow = (timezone.localdate() + timedelta(days=1)).isoformat()
        resp_invalid_srv = self.client.post('/api/salon360/availability/', {
            "service_id": "non-existent-service",
            "date": tomorrow,
        }, format='json')
        self.assertEqual(resp_invalid_srv.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('booking.views.salon360.check_availability')
    def test_availability_success(self, mock_check_availability):
        """POST /api/salon360/availability/ proxies to Salon360 client successfully"""
        mock_check_availability.return_value = (200, {
            "responseCode": 200,
            "responseMsg": "SUCCESS",
            "response": [
                {
                    "date": "2026-11-10",
                    "status": "AVAILABLE",
                    "feasibleWindows": [{"startTime": "10:30:00", "endTime": "11:00:00"}],
                }
            ]
        })

        tomorrow = (timezone.localdate() + timedelta(days=1)).isoformat()
        response = self.client.post('/api/salon360/availability/', {
            "service_id": "rate-haircut",
            "date": tomorrow,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["responseCode"], 200)

    def test_create_booking_missing_or_invalid_idempotency_key(self):
        """POST /api/salon360/create/ requires valid UUID in Idempotency-Key header"""
        tomorrow = (timezone.localdate() + timedelta(days=1)).isoformat()
        payload = {
            "service_id": "rate-haircut",
            "date": tomorrow,
            "start_time": "10:30:00",
            "name": "Arun Kumar",
            "mobile": "9876543210",
        }

        # No header
        resp_no_key = self.client.post('/api/salon360/create/', payload, format='json')
        self.assertEqual(resp_no_key.status_code, status.HTTP_400_BAD_REQUEST)

        # Invalid UUID
        resp_bad_key = self.client.post('/api/salon360/create/', payload, format='json', HTTP_IDEMPOTENCY_KEY="not-a-uuid")
        self.assertEqual(resp_bad_key.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_booking_invalid_mobile(self):
        """POST /api/salon360/create/ validates Indian 10-digit mobile number"""
        key = str(uuid.uuid4())
        tomorrow = (timezone.localdate() + timedelta(days=1)).isoformat()
        payload = {
            "service_id": "rate-haircut",
            "date": tomorrow,
            "start_time": "10:30:00",
            "name": "Arun Kumar",
            "mobile": "12345",  # Invalid
        }
        resp = self.client.post('/api/salon360/create/', payload, format='json', HTTP_IDEMPOTENCY_KEY=key)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('booking.views.salon360.create_booking')
    def test_create_booking_success_and_idempotency(self, mock_create_booking):
        """Successful booking creation and idempotent replay without duplicate external call"""
        mock_create_booking.return_value = (200, {
            "responseCode": 200,
            "responseMsg": "SUCCESS",
            "response": {
                "success": True,
                "appointmentId": 98124,
                "customerId": 44321,
                "bookingReference": "ZAYRO-98124",
            }
        })

        key = str(uuid.uuid4())
        tomorrow = (timezone.localdate() + timedelta(days=1)).isoformat()
        payload = {
            "service_id": "rate-haircut",
            "date": tomorrow,
            "start_time": "10:30:00",
            "name": "Arun Kumar",
            "mobile": "9876543210",
            "email": "arun@example.com",
        }

        # 1. First submission
        resp = self.client.post('/api/salon360/create/', payload, format='json', HTTP_IDEMPOTENCY_KEY=key)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(resp.data.get("confirmed"))
        self.assertEqual(resp.data.get("appointmentId"), 98124)

        # Verify database record
        record = BookingRecord.objects.get(idempotency_key=key)
        self.assertEqual(record.status, "CONFIRMED")
        self.assertEqual(record.appointment_id, 98124)
        self.assertEqual(record.customer_mobile, "9876543210")

        # 2. Resubmit with identical Idempotency-Key
        mock_create_booking.reset_mock()
        resp_retry = self.client.post('/api/salon360/create/', payload, format='json', HTTP_IDEMPOTENCY_KEY=key)
        self.assertEqual(resp_retry.status_code, status.HTTP_200_OK)
        self.assertTrue(resp_retry.data.get("confirmed"))
        self.assertEqual(resp_retry.data.get("appointmentId"), 98124)
        # Upstream API should NOT have been called again!
        mock_create_booking.assert_not_called()

    @patch('booking.views.salon360.create_booking')
    def test_create_booking_slot_unavailable_conflict(self, mock_create_booking):
        """Slot conflict (409) is recorded as FAILED and not treated as confirmed"""
        mock_create_booking.return_value = (409, {
            "responseCode": 409,
            "responseMsg": "BOOKING_SLOT_UNAVAILABLE",
            "dynMsg": "Selected slot is no longer available",
            "response": None,
        })

        key = str(uuid.uuid4())
        tomorrow = (timezone.localdate() + timedelta(days=1)).isoformat()
        payload = {
            "service_id": "rate-haircut",
            "date": tomorrow,
            "start_time": "10:30:00",
            "name": "Arun Kumar",
            "mobile": "9876543210",
        }

        resp = self.client.post('/api/salon360/create/', payload, format='json', HTTP_IDEMPOTENCY_KEY=key)
        self.assertEqual(resp.status_code, status.HTTP_409_CONFLICT)
        self.assertFalse(resp.data.get("confirmed"))
        self.assertEqual(resp.data.get("status"), "FAILED")

        record = BookingRecord.objects.get(idempotency_key=key)
        self.assertEqual(record.status, "FAILED")

    def test_booking_list_admin_protection(self):
        """Anonymous access to /api/bookings/ is forbidden; admin access is allowed"""
        # Anonymous
        resp_anon = self.client.get('/api/bookings/')
        self.assertIn(resp_anon.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

        # Authenticated Admin
        self.client.force_authenticate(user=self.admin_user)
        resp_admin = self.client.get('/api/bookings/')
        self.assertEqual(resp_admin.status_code, status.HTTP_200_OK)
        self.assertIn("results", resp_admin.data)
