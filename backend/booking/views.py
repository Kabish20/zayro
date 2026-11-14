import uuid
from datetime import datetime, timedelta
from django.db import connection, transaction, IntegrityError
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser

from .salon360_client import salon360
from .models import SalonConfig, Staff, BookingRecord, SalonService
from .serializers import AvailabilitySerializer, BookingSerializer


class Salon360StatusTestView(APIView):
    """
    GET /api/salon360/status/ or /api/salon360/test/
    Live automated diagnostic verifying connection to Salon360 API and reporting status.
    """
    def get(self, request):
        cfg_status, cfg_data = salon360.get_config()
        staff_status, staff_data = salon360.get_staff()
        staff_count = (
            len(staff_data.get('response', []))
            if isinstance(staff_data, dict) and isinstance(staff_data.get('response'), list)
            else 0
        )

        today_str = datetime.now().strftime('%Y-%m-%d')
        first_service = SalonService.objects.filter(is_active=True).first()
        test_service_id = first_service.salon360_service_id if first_service else 102003

        avail_status, avail_data = salon360.check_availability({
            'startDate': today_str,
            'endDate': today_str,
            'slotIntervalMinutes': 30,
            'staffSelectionMode': 'ANY',
            'services': [{'serviceId': test_service_id, 'durationMinutes': 30}],
            'staffId': None,
            'serviceStaffAssignments': None,
        })

        is_connected = cfg_status == 200 and staff_status == 200

        return Response({
            "connected": is_connected,
            "status": "ONLINE" if is_connected else "DEGRADED",
            "storeId": settings.SALON360_STORE_ID,
            "orgId": settings.SALON360_ORG_ID,
            "apiKeyConfigured": bool(settings.SALON360_API_KEY),
            "endpoints": {
                "config": {
                    "status": cfg_status,
                    "ok": cfg_status == 200,
                    "timeZone": cfg_data.get('response', {}).get('timeZoneStr') if isinstance(cfg_data, dict) and isinstance(cfg_data.get('response'), dict) else None,
                },
                "staff": {
                    "status": staff_status,
                    "ok": staff_status == 200,
                    "count": staff_count,
                    "staffList": staff_data.get('response') if isinstance(staff_data, dict) else None,
                },
                "availability": {
                    "status": avail_status,
                    "ok": avail_status == 200,
                    "calendarStatus": (
                        avail_data.get('response', [{}])[0].get('status')
                        if isinstance(avail_data, dict) and isinstance(avail_data.get('response'), list) and len(avail_data.get('response', [])) > 0
                        else None
                    ),
                }
            },
            "timestamp": datetime.now().isoformat(),
        }, status=status.HTTP_200_OK if is_connected else status.HTTP_502_BAD_GATEWAY)


class HealthCheckView(APIView):
    """
    Health check diagnostic verifying Django server, Database, and Salon360 configuration.
    """
    def get(self, request):
        db_ok = False
        db_engine = "Unknown"
        try:
            connection.ensure_connection()
            db_ok = True
            db_engine = connection.vendor  # 'postgresql' or 'sqlite'
        except Exception:
            pass

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


class ServiceListView(APIView):
    """
    GET /api/salon360/services/
    Returns list of mapped active salon services.
    """
    def get(self, request):
        services = [
            {
                "website_service_id": s.website_service_id,
                "name": s.name,
                "duration_minutes": s.duration_minutes,
                "price": float(s.price),
            }
            for s in SalonService.objects.filter(is_active=True).order_by('salon360_service_id')
        ]
        return Response(services, status=status.HTTP_200_OK)


class ConfigProxyView(APIView):
    """
    GET /api/salon360/config/
    Fetches store timezone, rounding, and tax configuration from Salon360.
    Caches configuration in local database.
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
    GET /api/salon360/staff/
    Fetches eligible staff from Salon360 and syncs with database.
    Falls back to cached Staff table if upstream is temporarily unavailable.
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

        # Fallback to locally cached Staff records
        db_staff = Staff.objects.all()
        if db_staff.exists():
            return Response({
                "responseCode": 200,
                "responseMsg": "SUCCESS",
                "response": [
                    {
                        "staffId": s.staff_id,
                        "name": s.name,
                        "designation": s.designation,
                        "profileImage": s.profile_image
                    }
                    for s in db_staff
                ]
            }, status=status.HTTP_200_OK)

        return Response(data, status=status_code)


class AvailabilityProxyView(APIView):
    """
    POST /api/salon360/availability/
    Checks slot feasibility from Salon360.
    """
    def post(self, request):
        serializer = AvailabilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        service = SalonService.objects.get(
            website_service_id=data["service_id"],
            is_active=True
        )
        staff_id = data.get("staff_id")
        selected_date = data["date"].isoformat()

        payload = {
            "startDate": selected_date,
            "endDate": selected_date,
            "slotIntervalMinutes": 30,
            "staffSelectionMode": (
                "SINGLE" if staff_id is not None else "ANY"
            ),
            "staffId": staff_id,
            "services": [{
                "serviceId": service.salon360_service_id,
                "durationMinutes": service.duration_minutes,
            }],
            "serviceStaffAssignments": None,
        }
        code, result = salon360.check_availability(payload)
        return Response(result, status=code)


class CreateBookingProxyView(APIView):
    """
    POST /api/salon360/create/
    Validates payload, creates pending booking reservation atomically with Idempotency-Key,
    calls Salon360 create endpoint, updates record, and returns confirmation status.
    """
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        service = SalonService.objects.get(
            website_service_id=data["service_id"],
            is_active=True
        )
        date = data["date"]
        start = data["start_time"]
        staff_id = data.get("staff_id")

        start_dt = datetime.combine(date, start)
        end_dt = start_dt + timedelta(minutes=service.duration_minutes)
        start_str = start_dt.strftime("%H:%M:%S")
        end_str = end_dt.strftime("%H:%M:%S")

        if end_dt.date() != date:
            return Response({"error": "Service crosses midnight"}, status=status.HTTP_400_BAD_REQUEST)

        mode = "SINGLE" if staff_id is not None else "ANY"
        line_item = {
            "id": service.salon360_service_id,
            "price": float(service.price),
            "taxId": service.tax_id,
            "taxGroupId": service.tax_group_id,
            "startTime": start_str,
            "endTime": end_str,
            "artistShares": (
                [{"empId": staff_id}] if staff_id is not None else []
            ),
        }

        payload = {
            "date": date.isoformat(),
            "startTime": start_str,
            "customer": {
                "name": data["name"],
                "mobile": data["mobile"],
                "email": data.get("email") or None,
            },
            "staffSelectionMode": mode,
            "lineItems": [line_item],
            "appointmentNotes": None,
        }

        # Request must include a stable attempt UUID.
        key = request.headers.get("Idempotency-Key")
        try:
            uuid.UUID(key or "")
        except (ValueError, TypeError):
            return Response(
                {"error": "Valid Idempotency-Key UUID header required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check existing booking for reconciliation or duplicate attempt
        existing = BookingRecord.objects.filter(idempotency_key=key).first()
        if existing:
            if existing.status == "CONFIRMED":
                return Response({
                    "confirmed": True,
                    "isSalon360Synced": True,
                    "status": "CONFIRMED",
                    "appointmentId": existing.appointment_id,
                    "bookingReference": f"ZAYRO-{existing.id}",
                    "message": "Appointment already confirmed with Salon360",
                }, status=status.HTTP_200_OK)
            return Response({
                "confirmed": False,
                "isSalon360Synced": False,
                "status": existing.status,
                "appointmentId": existing.appointment_id,
                "bookingReference": f"ZAYRO-{existing.id}",
                "message": "Booking attempt already registered",
            }, status=status.HTTP_200_OK if existing.status == "PENDING" else status.HTTP_409_CONFLICT)

        # Atomically reserve the idempotency key with a PENDING record
        try:
            with transaction.atomic():
                booking_record = BookingRecord.objects.create(
                    customer_name=data["name"],
                    customer_mobile=data["mobile"],
                    customer_email=data.get("email") or None,
                    booking_date=date,
                    start_time=start,
                    staff_selection_mode=mode,
                    status="PENDING",
                    line_items=[line_item],
                    idempotency_key=key,
                )
        except IntegrityError:
            return Response({
                "error": "Concurrent booking attempt detected",
                "status": "PENDING",
            }, status=status.HTTP_409_CONFLICT)

        # Call upstream Salon360 API
        code, result = salon360.create_booking(payload, idempotency_key=key)
        body = result.get("response") or result
        confirmed = (
            code in (200, 201)
            and isinstance(body, dict)
            and body.get("success") is True
            and body.get("appointmentId") is not None
        )

        if confirmed:
            booking_record.appointment_id = body.get("appointmentId")
            booking_record.customer_id = body.get("customerId")
            booking_record.status = "CONFIRMED"
            booking_record.raw_response = result if isinstance(result, dict) else {}
            booking_record.save()

            return Response({
                "confirmed": True,
                "isSalon360Synced": True,
                "status": "CONFIRMED",
                "appointmentId": booking_record.appointment_id,
                "bookingReference": f"ZAYRO-{booking_record.id}",
                "message": "Appointment confirmed and synced directly to your Salon360 Dashboard!",
            }, status=status.HTTP_201_CREATED)

        if code == 409 or (isinstance(result, dict) and result.get("responseMsg") == "BOOKING_SLOT_UNAVAILABLE"):
            # When Salon360 upstream shifts/roster are not yet published on calendar,
            # save reservation locally in database with a clear reference and pending status.
            booking_record.appointment_id = None
            booking_record.status = "PENDING"
            booking_record.raw_response = result if isinstance(result, dict) else {}
            booking_record.save()

            return Response({
                "confirmed": False,
                "isSalon360Synced": False,
                "status": "PENDING",
                "appointmentId": None,
                "bookingReference": f"ZAYRO-{booking_record.id}",
                "message": (
                    "Salon360 store calendar is currently marked as CLOSED or awaiting staff shift schedule "
                    "in your Salon360 dashboard. Your reservation is registered (#ZAYRO-"
                    f"{booking_record.id}). Please confirm on WhatsApp to lock your chair."
                ),
            }, status=status.HTTP_200_OK)

        state = "FAILED" if code in (400, 401, 422) else "PENDING"
        booking_record.status = state
        booking_record.raw_response = result if isinstance(result, dict) else {}
        booking_record.save()

        return Response({
            "confirmed": False,
            "isSalon360Synced": False,
            "status": state,
            "appointmentId": None,
            "bookingReference": f"ZAYRO-{booking_record.id}",
            "message": (result.get("dynMsg") or result.get("responseMsg") or "Booking not confirmed"),
        }, status=status.HTTP_400_BAD_REQUEST if code in (400, 422) else status.HTTP_502_BAD_GATEWAY)


class BookingListView(APIView):
    """
    GET /api/bookings/
    Lists bookings recorded in the local database.
    Allows access to staff users OR callers with store client key (x-api-key or ?api_key=).
    """
    def get(self, request):
        auth_key = request.headers.get("x-api-key") or request.query_params.get("api_key")
        is_key_valid = auth_key and (
            auth_key == settings.SALON360_CLIENT_KEY
            or auth_key == settings.SALON360_API_KEY
            or auth_key == settings.SALON360_CLIENT_SECRET
        )
        if not (request.user.is_staff or is_key_valid):
            return Response({"error": "Admin authentication or valid API key required"}, status=status.HTTP_401_UNAUTHORIZED)

        bookings = BookingRecord.objects.all()[:100]
        data = [
            {
                "id": b.id,
                "bookingReference": f"ZAYRO-{b.id}",
                "appointmentId": b.appointment_id,
                "isSalon360Synced": b.appointment_id is not None,
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
