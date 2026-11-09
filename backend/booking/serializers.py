from datetime import timedelta
from django.utils import timezone
from rest_framework import serializers
from .models import SalonService


class AvailabilitySerializer(serializers.Serializer):
    service_id = serializers.CharField()
    date = serializers.DateField()
    staff_id = serializers.IntegerField(required=False, allow_null=True)

    def validate_date(self, value):
        today = timezone.localdate()
        if not (today <= value <= today + timedelta(days=365)):
            raise serializers.ValidationError(
                "Choose a date within the next 365 days."
            )
        return value

    def validate_service_id(self, value):
        if not SalonService.objects.filter(
            website_service_id=value, is_active=True
        ).exists():
            raise serializers.ValidationError(
                "Service is unavailable."
            )
        return value


class BookingSerializer(AvailabilitySerializer):
    start_time = serializers.TimeField()
    name = serializers.CharField(max_length=255)
    mobile = serializers.RegexField(regex=r"^[6-9]\d{9}$")
    email = serializers.EmailField(required=False, allow_blank=True)

