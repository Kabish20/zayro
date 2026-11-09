from django.core.management.base import BaseCommand
from booking.models import SalonService


class Command(BaseCommand):
    help = "Seeds initial Salon360 service mappings from Zayro website catalogue"

    def handle(self, *args, **options):
        initial_services = [
            {
                "website_service_id": "rate-haircut",
                "salon360_service_id": 102001,
                "name": "Precision Haircut",
                "duration_minutes": 30,
                "price": 99.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-beard-trim",
                "salon360_service_id": 102002,
                "name": "Beard Trim (Zero)",
                "duration_minutes": 20,
                "price": 69.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-shave",
                "salon360_service_id": 102003,
                "name": "Traditional Shave",
                "duration_minutes": 20,
                "price": 49.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-kids-cut",
                "salon360_service_id": 102004,
                "name": "Kids Haircut",
                "duration_minutes": 25,
                "price": 89.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-head-massage",
                "salon360_service_id": 102005,
                "name": "Relaxing Head Massage",
                "duration_minutes": 20,
                "price": 99.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-face-cleanup",
                "salon360_service_id": 102006,
                "name": "Express Face Cleanup",
                "duration_minutes": 30,
                "price": 199.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-de-tan",
                "salon360_service_id": 102007,
                "name": "Skin Brightening De-Tan",
                "duration_minutes": 30,
                "price": 249.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-hair-colour",
                "salon360_service_id": 102008,
                "name": "Natural Black Hair Colour",
                "duration_minutes": 35,
                "price": 149.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
        ]

        count = 0
        for s in initial_services:
            obj, created = SalonService.objects.update_or_create(
                website_service_id=s["website_service_id"],
                defaults=s,
            )
            count += 1
            status_text = "Created" if created else "Updated"
            self.stdout.write(f"{status_text}: {obj.name} ({obj.website_service_id} -> {obj.salon360_service_id})")

        self.stdout.write(self.style.SUCCESS(f"Successfully configured {count} service mappings."))

