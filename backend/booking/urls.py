from django.urls import path
from .views import (
    HealthCheckView,
    Salon360StatusTestView,
    ConfigProxyView,
    StaffProxyView,
    AvailabilityProxyView,
    CreateBookingProxyView,
    BookingListView,
    Salon360RedirectView,
    ServiceListView,
)

urlpatterns = [
    # Health and Diagnostic checks
    path('health', HealthCheckView.as_view(), name='health-no-slash'),
    path('health/', HealthCheckView.as_view(), name='health'),
    path('api/health/', HealthCheckView.as_view(), name='api-health'),
    path('api/salon360/status', Salon360StatusTestView.as_view(), name='salon360-status-no-slash'),
    path('api/salon360/status/', Salon360StatusTestView.as_view(), name='salon360-status'),
    path('api/salon360/test', Salon360StatusTestView.as_view(), name='salon360-test-no-slash'),
    path('api/salon360/test/', Salon360StatusTestView.as_view(), name='salon360-test'),

    # Direct Salon360 API Proxy Endpoints
    path('salon360-api/config', ConfigProxyView.as_view(), name='proxy-config-direct'),
    path('salon360-api/config/', ConfigProxyView.as_view(), name='proxy-config-direct-slash'),
    path('salon360-api/staff', StaffProxyView.as_view(), name='proxy-staff-direct'),
    path('salon360-api/staff/', StaffProxyView.as_view(), name='proxy-staff-direct-slash'),
    path('salon360-api/availability', AvailabilityProxyView.as_view(), name='proxy-avail-direct'),
    path('salon360-api/availability/', AvailabilityProxyView.as_view(), name='proxy-avail-direct-slash'),
    path('salon360-api/create', CreateBookingProxyView.as_view(), name='proxy-create-direct'),
    path('salon360-api/create/', CreateBookingProxyView.as_view(), name='proxy-create-direct-slash'),

    # Prefixed API routes
    path('api/salon360/config', ConfigProxyView.as_view(), name='api-config'),
    path('api/salon360/config/', ConfigProxyView.as_view(), name='api-config-slash'),
    path('api/salon360/staff', StaffProxyView.as_view(), name='api-staff'),
    path('api/salon360/staff/', StaffProxyView.as_view(), name='api-staff-slash'),
    path('api/salon360/services', ServiceListView.as_view(), name='api-services-no-slash'),
    path('api/salon360/services/', ServiceListView.as_view(), name='api-services'),
    path('api/salon360/availability', AvailabilityProxyView.as_view(), name='api-avail'),
    path('api/salon360/availability/', AvailabilityProxyView.as_view(), name='api-avail-slash'),
    path('api/salon360/create', CreateBookingProxyView.as_view(), name='api-create'),
    path('api/salon360/create/', CreateBookingProxyView.as_view(), name='api-create-slash'),

    # Stored Bookings Database (Admin protected)
    path('api/bookings/', BookingListView.as_view(), name='api-bookings-list'),

    # Direct Online Booking Redirect
    path('booking/redirect/', Salon360RedirectView.as_view(), name='booking-redirect'),
    path('online-booking/', Salon360RedirectView.as_view(), name='online-booking-redirect'),
]
