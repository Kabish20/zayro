from django.db import models

class SalonConfig(models.Model):
    store_id = models.IntegerField(default=868, unique=True)
    org_id = models.IntegerField(default=555)
    time_zone = models.CharField(max_length=64, default='Asia/Kolkata')
    is_amount_rounded_off = models.BooleanField(default=True)
    configurations = models.JSONField(default=dict, blank=True)
    tax_master_list = models.JSONField(default=list, blank=True, null=True)
    tax_group_master_list = models.JSONField(default=list, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Store {self.store_id} / Org {self.org_id} Config"

class Staff(models.Model):
    staff_id = models.IntegerField(unique=True, db_index=True)
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.URLField(max_length=500, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} (ID: {self.staff_id})"

class BookingRecord(models.Model):
    STATUS_CHOICES = [
        ('CONFIRMED', 'Confirmed'),
        ('PENDING', 'Pending'),
        ('CANCELLED', 'Cancelled'),
        ('FAILED', 'Failed'),
    ]

    appointment_id = models.IntegerField(null=True, blank=True, db_index=True)
    customer_id = models.IntegerField(null=True, blank=True)
    customer_name = models.CharField(max_length=255)
    customer_mobile = models.CharField(max_length=20)
    customer_email = models.EmailField(null=True, blank=True)
    booking_date = models.DateField(db_index=True)
    start_time = models.TimeField()
    staff_selection_mode = models.CharField(max_length=50, default='ANY')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='CONFIRMED')
    line_items = models.JSONField(default=list)
    appointment_notes = models.TextField(null=True, blank=True)
    idempotency_key = models.CharField(max_length=128, db_index=True)
    raw_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.appointment_id or 'NEW'} - {self.customer_name} ({self.booking_date} {self.start_time})"
