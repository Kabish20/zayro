from django.contrib import admin
from .models import SalonConfig, Staff, BookingRecord, SalonService


@admin.register(SalonConfig)
class SalonConfigAdmin(admin.ModelAdmin):
    list_display = ('store_id', 'org_id', 'time_zone', 'is_amount_rounded_off', 'updated_at')
    readonly_fields = ('updated_at',)


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('staff_id', 'name', 'designation', 'updated_at')
    search_fields = ('name', 'designation')


@admin.register(SalonService)
class SalonServiceAdmin(admin.ModelAdmin):
    list_display = ('website_service_id', 'salon360_service_id', 'name', 'duration_minutes', 'price', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('website_service_id', 'name', 'salon360_service_id')


@admin.register(BookingRecord)
class BookingRecordAdmin(admin.ModelAdmin):
    list_display = ('appointment_id', 'customer_name', 'customer_mobile', 'booking_date', 'start_time', 'status', 'created_at')
    list_filter = ('status', 'booking_date')
    search_fields = ('customer_name', 'customer_mobile', 'appointment_id', 'idempotency_key')
    readonly_fields = ('created_at',)
