import uuid
from datetime import datetime
from django.db import connection
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .salon360_client import salon360
from .models import SalonConfig, Staff, BookingRecord

class HealthCheckView(APIView):
    """
    Health check diagnostic verifying Django server, PostgreSQL, and Salon360 configuration.
    """
    def get(self, request):
        db_ok = False
        db_engine = "Unknown"
        try:
            connection.ensure_connection()
            db_ok = True
            db_engine = connection.vendor  # 'postgresql' or 'sqlite'
        except Exception as e:
            db_error = str(e)

        return Response({
            "status": "UP",
            "service": "zayro-django-backend",
            "database": {
                "connected": db_ok,
                "engine": db_engine,
            },
            "salon360": {
                "storeId": settings.SALON360_STORE_ID,
                "orgId": settings.SALON360_ORG_ID,
                "clientKeyConfigured": bool(settings.SALON360_CLIENT_KEY),
                "baseUrl": settings.SALON360_BASE_URL,
            },
            "timestamp": datetime.now().isoformat(),
        }, status=status.HTTP_200_OK)

class ConfigProxyView(APIView):
    """
    GET /config or /api/salon360/config
    Fetches store timezone, rounding, and tax configuration from Salon360.
    Caches the configuration in PostgreSQL.
    """
    def get(self, request):
        status_code, data = salon360.get_config()
        if status_code == 200 and isinstance(data, dict) and data.get('response'):
            res = data['response']
            try:
                SalonConfig.objects.update_or_create(
                    store_id=res.get('storeId', settings.SALON360_STORE_ID),
                    defaults={
                        'org_id': res.get('orgId', settings.SALON360_ORG_ID),
                        'time_zone': res.get('timeZoneStr', 'Asia/Kolkata'),
                        'is_amount_rounded_off': res.get('isAmountRoundedOff', True),
                        'configurations': res.get('configurations', {}),
                        'tax_master_list': res.get('taxMasterList'),
                        'tax_group_master_list': res.get('taxGroupMasterList'),
                    }
                )
            except Exception:
                pass
        return Response(data, status=status_code)

class StaffProxyView(APIView):
    """
    GET /staff or /api/salon360/staff
    Fetches eligible staff from Salon360 and syncs with PostgreSQL.
    """
    def get(self, request):
        status_code, data = salon360.get_staff()
        if status_code == 200 and isinstance(data, dict) and isinstance(data.get('response'), list):
            for s in data['response']:
                if isinstance(s, dict) and 'staffId' in s:
                    try:
                        Staff.objects.update_or_create(
                            staff_id=s['staffId'],
                            defaults={
                                'name': s.get('name', 'Staff'),
                                'designation': s.get('designation'),
                                'profile_image': s.get('profileImage'),
                            }
                        )
                    except Exception:
                        pass
        return Response(data, status=status_code)

class AvailabilityProxyView(APIView):
    """
    POST /availability or /api/salon360/availability
    Checks slot feasibility across requested dates from Salon360.
    """
    def post(self, request):
        status_code, data = salon360.check_availability(request.data or {})
        return Response(data, status=status_code)

class CreateBookingProxyView(APIView):
    """
    POST /create or /api/salon360/create
    Submits booking to Salon360 with Idempotency-Key and stores record in PostgreSQL.
    """
    def post(self, request):
        idempotency_key = request.headers.get('Idempotency-Key') or str(uuid.uuid4())
        status_code, data = salon360.create_booking(request.data or {}, idempotency_key=idempotency_key)

        # Record attempt / booking into PostgreSQL
        payload = request.data or {}
        cust = payload.get('customer', {})
        app_id = None
        cust_id = None
        is_success = False

        if status_code in (200, 201) and isinstance(data, dict):
            res_payload = data.get('response') or data
            if isinstance(res_payload, dict):
                app_id = res_payload.get('appointmentId')
                cust_id = res_payload.get('customerId')
                is_success = bool(res_payload.get('success', True))

        try:
            BookingRecord.objects.create(
                appointment_id=app_id,
                customer_id=cust_id,
                customer_name=cust.get('name', 'Customer'),
                customer_mobile=cust.get('mobile', ''),
                customer_email=cust.get('email'),
                booking_date=payload.get('date', datetime.today().strftime('%Y-%m-%d')),
                start_time=payload.get('startTime', '10:00:00'),
                staff_selection_mode=payload.get('staffSelectionMode', 'ANY'),
                status='CONFIRMED' if is_success else ('FAILED' if status_code >= 400 else 'PENDING'),
                line_items=payload.get('lineItems', []),
                appointment_notes=payload.get('appointmentNotes'),
                idempotency_key=idempotency_key,
                raw_response=data if isinstance(data, dict) else {},
            )
        except Exception:
            pass

        return Response(data, status=status_code)

class BookingListView(APIView):
    """
    GET /api/bookings/
    Lists bookings recorded in the PostgreSQL database.
    """
    def get(self, request):
        bookings = BookingRecord.objects.all()[:50]
        data = [
            {
                "id": b.id,
                "appointmentId": b.appointment_id,
                "customerId": b.customer_id,
                "customerName": b.customer_name,
                "customerMobile": b.customer_mobile,
                "customerEmail": b.customer_email,
                "bookingDate": str(b.booking_date),
                "startTime": str(b.start_time),
                "status": b.status,
                "createdAt": b.created_at.isoformat(),
            }
            for b in bookings
        ]
        return Response({"count": len(data), "results": data})

class Salon360RedirectView(APIView):
    """
    Direct redirect view for online booking.
    Redirects to Salon360's hosted online booking page.
    """
    def get(self, request):
        target_url = settings.SALON360_HOSTED_BOOKING_URL
        return redirect(target_url)

