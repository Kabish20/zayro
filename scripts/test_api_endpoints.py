import os
import sys
import django
import json
import uuid
from datetime import timedelta

# Set settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zayro_backend.settings')
sys.path.insert(0, os.path.abspath('backend'))

django.setup()

from django.utils import timezone
from rest_framework.test import APIClient
from booking.models import SalonService, BookingRecord
from unittest.mock import patch

client = APIClient()

print("=" * 60)
print("  ZAYRO SALON - SALON360 API INTEGRATION ENDPOINT TEST")
print("=" * 60)

# 1. Health check
print("\n[TEST 1] GET /api/health/")
res1 = client.get('/api/health/')
print(f"Status: {res1.status_code}")
print("Response:", json.dumps(res1.data, indent=2))
assert res1.status_code == 200, "Health check failed"

# 2. Services list
print("\n[TEST 2] GET /api/salon360/services/")
res2 = client.get('/api/salon360/services/')
print(f"Status: {res2.status_code}")
print("Found Services count:", len(res2.data))
print("Sample service:", json.dumps(res2.data[0] if res2.data else {}, indent=2))
assert res2.status_code == 200, "Services list failed"
assert len(res2.data) > 0, "No services returned"

# 3. Availability validation
print("\n[TEST 3] POST /api/salon360/availability/ (Validation test with past date)")
yesterday = (timezone.localdate() - timedelta(days=1)).isoformat()
res3 = client.post('/api/salon360/availability/', {
    "service_id": "rate-haircut",
    "date": yesterday,
}, format='json')
print(f"Status: {res3.status_code} (Expected 400 Bad Request)")
print("Response:", json.dumps(res3.data, indent=2))
assert res3.status_code == 400, "Past date should be rejected"

# 4. Availability with mock Salon360 response
print("\n[TEST 4] POST /api/salon360/availability/ (Valid date & service)")
tomorrow = (timezone.localdate() + timedelta(days=2)).isoformat()
with patch('booking.views.salon360.check_availability') as mock_avail:
    mock_avail.return_value = (200, {
        "responseCode": 200,
        "responseMsg": "SUCCESS",
        "response": [
            {
                "date": tomorrow,
                "status": "AVAILABLE",
                "feasibleWindows": [
                    {"startTime": "10:00:00", "endTime": "10:30:00"},
                    {"startTime": "11:30:00", "endTime": "12:00:00"},
                    {"startTime": "14:00:00", "endTime": "14:30:00"},
                ]
            }
        ]
    })
    res4 = client.post('/api/salon360/availability/', {
        "service_id": "rate-haircut",
        "date": tomorrow,
    }, format='json')
    print(f"Status: {res4.status_code}")
    print("Response:", json.dumps(res4.data, indent=2))
    assert res4.status_code == 200, "Availability failed"

# 5. Create Booking - missing idempotency key
print("\n[TEST 5] POST /api/salon360/create/ (Missing Idempotency-Key header)")
res5 = client.post('/api/salon360/create/', {
    "service_id": "rate-haircut",
    "date": tomorrow,
    "start_time": "10:00:00",
    "name": "Arun Kumar",
    "mobile": "9876543210",
}, format='json')
print(f"Status: {res5.status_code} (Expected 400 Bad Request)")
print("Response:", json.dumps(res5.data, indent=2))
assert res5.status_code == 400, "Missing idempotency key should be rejected"

# 6. Create Booking - successful appointment confirmation
print("\n[TEST 6] POST /api/salon360/create/ (Confirmed Appointment Creation)")
test_uuid = str(uuid.uuid4())
with patch('booking.views.salon360.create_booking') as mock_create:
    mock_create.return_value = (201, {
        "responseCode": 201,
        "responseMsg": "APPOINTMENT_CONFIRMED",
        "response": {
            "success": True,
            "appointmentId": 89452,
            "customerId": 10421,
            "bookingReference": "ZAYRO-89452"
        }
    })
    res6 = client.post('/api/salon360/create/', {
        "service_id": "rate-haircut",
        "date": tomorrow,
        "start_time": "10:00:00",
        "name": "Karthik Raja",
        "mobile": "9876543210",
        "email": "karthik@example.com"
    }, format='json', HTTP_IDEMPOTENCY_KEY=test_uuid)
    print(f"Status: {res6.status_code}")
    print("Response:", json.dumps(res6.data, indent=2))
    assert res6.status_code == 201, "Booking creation failed"
    assert res6.data.get("confirmed") is True
    assert res6.data.get("appointmentId") == 89452

# 7. Create Booking - Idempotent replay
print("\n[TEST 7] POST /api/salon360/create/ (Idempotent Replay with same key)")
with patch('booking.views.salon360.create_booking') as mock_create:
    res7 = client.post('/api/salon360/create/', {
        "service_id": "rate-haircut",
        "date": tomorrow,
        "start_time": "10:00:00",
        "name": "Karthik Raja",
        "mobile": "9876543210",
        "email": "karthik@example.com"
    }, format='json', HTTP_IDEMPOTENCY_KEY=test_uuid)
    print(f"Status: {res7.status_code}")
    print("Response:", json.dumps(res7.data, indent=2))
    assert res7.status_code == 200, "Idempotent replay failed"
    assert res7.data.get("confirmed") is True
    mock_create.assert_not_called()
    print("Idempotency verified: upstream external API was not called again!")

# 8. Stored Bookings Record verification
print("\n[TEST 8] Local Database BookingRecord verification")
record = BookingRecord.objects.get(idempotency_key=test_uuid)
print(f"DB Record: Appointment ID #{record.appointment_id}, Status: {record.status}, Customer: {record.customer_name} ({record.customer_mobile})")
assert record.appointment_id == 89452
assert record.status == "CONFIRMED"

# 9. Admin protection on /api/bookings/
print("\n[TEST 9] GET /api/bookings/ Security verification")
res9_anon = client.get('/api/bookings/')
print(f"Anonymous access status: {res9_anon.status_code} (Expected 401 or 403)")
assert res9_anon.status_code in (401, 403), "Anonymous access must be blocked"

print("\n" + "=" * 60)
print("  ALL WORKFLOW TESTS COMPLETED SUCCESSFULLY!")
print("=" * 60)

