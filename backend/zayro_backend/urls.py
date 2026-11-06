"""
URL configuration for Zayro Backend.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Booking & Salon360 API routes
    path('', include('booking.urls')),
]

