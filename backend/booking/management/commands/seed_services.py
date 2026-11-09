from django.core.management.base import BaseCommand
from booking.models import SalonService


class Command(BaseCommand):
    help = "Seeds strictly the official ZAYRO Rate Card services (Page 1 Standard Rate Card + Page 2 Combo Offers)"

    def handle(self, *args, **options):
        # 1. Deactivate non-rate card services
        SalonService.objects.exclude(
            website_service_id__in=[
                "rate-haircut",
                "rate-beard-trim",
                "rate-shave",
                "rate-kids-cut",
                "rate-head-massage",
                "rate-de-tan",
                "rate-face-cleanup",
                "rate-hair-colour",
                "combo-1",
                "combo-2",
                "combo-3",
                "combo-4",
                "combo-5",
                "combo-6",
                "combo-7",
                "combo-8",
                "combo-9",
                "combo-10",
            ]
        ).update(is_active=False)

        # 2. Official Rate Card Services (Page 1) + Combo Offers (Page 2)
        rate_card_catalogue = [
            # ─── Page 1: Standard Rate Card Services ─────────────────────
            {
                "website_service_id": "rate-haircut",
                "salon360_service_id": 102001,
                "name": "Haircut",
                "duration_minutes": 30,
                "price": 99.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-beard-trim",
                "salon360_service_id": 102002,
                "name": "Beard Trim",
                "duration_minutes": 20,
                "price": 69.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-shave",
                "salon360_service_id": 102003,
                "name": "Shave",
                "duration_minutes": 20,
                "price": 49.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-kids-cut",
                "salon360_service_id": 102004,
                "name": "Kids Cut",
                "duration_minutes": 25,
                "price": 69.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-head-massage",
                "salon360_service_id": 102005,
                "name": "Head Massage",
                "duration_minutes": 15,
                "price": 199.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-de-tan",
                "salon360_service_id": 102007,
                "name": "De-Tan",
                "duration_minutes": 25,
                "price": 199.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-face-cleanup",
                "salon360_service_id": 102006,
                "name": "Face Cleanup",
                "duration_minutes": 35,
                "price": 299.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "rate-hair-colour",
                "salon360_service_id": 102008,
                "name": "Hair Colour",
                "duration_minutes": 45,
                "price": 349.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },

            # ─── Page 2: 10 Official Combo Offers ─────────────────────────
            {
                "website_service_id": "combo-1",
                "salon360_service_id": 103001,
                "name": "Combo 1: Haircut + Beard Trim + Oil Massage",
                "duration_minutes": 45,
                "price": 299.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-2",
                "salon360_service_id": 103002,
                "name": "Combo 2: Haircut + Beard Trim + De-Tan + Oil Massage",
                "duration_minutes": 60,
                "price": 399.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-3",
                "salon360_service_id": 103003,
                "name": "Combo 3: Haircut + Beard Trim + Any Cleanup",
                "duration_minutes": 60,
                "price": 499.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-4",
                "salon360_service_id": 103004,
                "name": "Combo 4: Haircut + Beard + Global Color + Face-Neck De-Tan",
                "duration_minutes": 75,
                "price": 599.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-5",
                "salon360_service_id": 103005,
                "name": "Combo 5: Haircut + Beard Trim + Gold/Diamond Facial",
                "duration_minutes": 75,
                "price": 699.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-6",
                "salon360_service_id": 103006,
                "name": "Combo 6: Haircut + Beard + Dandruff/Hairfall Therapy + Full Arms De-Tan",
                "duration_minutes": 90,
                "price": 799.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-7",
                "salon360_service_id": 103007,
                "name": "Combo 7: Haircut + Beard + Nourishing Protein Treatment + Face-Neck De-Tan",
                "duration_minutes": 90,
                "price": 899.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-8",
                "salon360_service_id": 103008,
                "name": "Combo 8: Haircut + Beard + Glo Vite Facial + 15-Min Oil Massage",
                "duration_minutes": 100,
                "price": 999.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-9",
                "salon360_service_id": 103009,
                "name": "Combo 9: Haircut + Beard + Face-Neck De-Tan + Detox Hair Spa",
                "duration_minutes": 110,
                "price": 1199.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
            {
                "website_service_id": "combo-10",
                "salon360_service_id": 103010,
                "name": "Combo 10: Haircut + Beard + Hair Spa (Dry/Repair) + Oxy Radiance Facial",
                "duration_minutes": 120,
                "price": 1499.00,
                "tax_id": 1,
                "tax_group_id": 1,
                "is_active": True,
            },
        ]

        count = 0
        for s in rate_card_catalogue:
            obj, created = SalonService.objects.update_or_create(
                website_service_id=s["website_service_id"],
                defaults=s,
            )
            count += 1
            status_text = "Created" if created else "Updated"
            self.stdout.write(f"{status_text}: {obj.name} ({obj.website_service_id} -> {obj.salon360_service_id})")

        self.stdout.write(self.style.SUCCESS(f"Successfully configured {count} official Rate Card services."))
