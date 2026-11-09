from django.core.management.base import BaseCommand
from booking.models import SalonService


class Command(BaseCommand):
    help = "Seeds all Salon360 services, combo offers, and massage therapies from Zayro catalogue"

    def handle(self, *args, **options):
        all_services = [
            # ─── Combo Offers (10 Value Packages) ─────────────────────────
            {
                "website_service_id": "combo-1",
                "salon360_service_id": 103001,
                "name": "Combo 1: Haircut + Beard Trim + Oil Massage",
                "duration_minutes": 45,
                "price": 299.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-2",
                "salon360_service_id": 103002,
                "name": "Combo 2: Haircut + Beard Trim + De-Tan + Oil Massage",
                "duration_minutes": 60,
                "price": 399.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-3",
                "salon360_service_id": 103003,
                "name": "Combo 3: Haircut + Beard Trim + Any Cleanup",
                "duration_minutes": 60,
                "price": 499.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-4",
                "salon360_service_id": 103004,
                "name": "Combo 4: Haircut + Beard + Global Color + Face-Neck De-Tan",
                "duration_minutes": 75,
                "price": 599.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-5",
                "salon360_service_id": 103005,
                "name": "Combo 5: Haircut + Beard Trim + Gold/Diamond Facial",
                "duration_minutes": 75,
                "price": 699.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-6",
                "salon360_service_id": 103006,
                "name": "Combo 6: Haircut + Beard + Dandruff/Hairfall Therapy + Full Arms De-Tan",
                "duration_minutes": 90,
                "price": 799.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-7",
                "salon360_service_id": 103007,
                "name": "Combo 7: Haircut + Beard + Nourishing Protein Treatment + Face-Neck De-Tan",
                "duration_minutes": 90,
                "price": 899.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-8",
                "salon360_service_id": 103008,
                "name": "Combo 8: Haircut + Beard + Glo Vite Facial + 15-Min Oil Massage",
                "duration_minutes": 100,
                "price": 999.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-9",
                "salon360_service_id": 103009,
                "name": "Combo 9: Haircut + Beard + Face-Neck De-Tan + Detox Hair Spa",
                "duration_minutes": 110,
                "price": 1199.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "combo-10",
                "salon360_service_id": 103010,
                "name": "Combo 10: Haircut + Beard + Hair Spa (Dry/Repair) + Oxy Radiance Facial",
                "duration_minutes": 120,
                "price": 1499.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },

            # ─── Massages & Scalp Therapies ──────────────────────────────
            {
                "website_service_id": "rate-head-massage",
                "salon360_service_id": 102005,
                "name": "Relaxing Head Massage & Hair Wash (15 mins)",
                "duration_minutes": 20,
                "price": 199.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "botanical-scalp-spa",
                "salon360_service_id": 104001,
                "name": "Ayurvedic Botanical Scalp Spa & Head Massage",
                "duration_minutes": 60,
                "price": 500.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "intensive-anti-hairfall",
                "salon360_service_id": 104002,
                "name": "Intensive Follicular Anti-Hairfall Therapy",
                "duration_minutes": 50,
                "price": 600.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },

            # ─── Rate Card Services ──────────────────────────────────────
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
                "name": "Traditional Barber Shave",
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
                "price": 69.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-face-cleanup",
                "salon360_service_id": 102006,
                "name": "Deep Pore Face Cleanup",
                "duration_minutes": 35,
                "price": 299.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-de-tan",
                "salon360_service_id": 102007,
                "name": "Face & Neck De-Tan",
                "duration_minutes": 25,
                "price": 199.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "rate-hair-colour",
                "salon360_service_id": 102008,
                "name": "Global Hair Colour",
                "duration_minutes": 45,
                "price": 349.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },

            # ─── Premium & Signature Lounge Services ──────────────────────
            {
                "website_service_id": "asian-couture-cut",
                "salon360_service_id": 104003,
                "name": "ZAYRO Signature Couture Cut",
                "duration_minutes": 45,
                "price": 400.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "master-skin-fade",
                "salon360_service_id": 104004,
                "name": "Master Low/Mid Skin Fade & Crop",
                "duration_minutes": 50,
                "price": 500.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "royal-beard-sculpt",
                "salon360_service_id": 104005,
                "name": "Royal Hot Towel Beard Sculpt & Shave",
                "duration_minutes": 40,
                "price": 300.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "luxury-hydra-facial",
                "salon360_service_id": 104006,
                "name": "Gentleman's Charcoal Detox & Hydra-Facial",
                "duration_minutes": 60,
                "price": 700.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
            {
                "website_service_id": "royal-groom-experience",
                "salon360_service_id": 104007,
                "name": "The Royal Indian Groom's Wedding Lounge Ritual",
                "duration_minutes": 180,
                "price": 1200.00,
                "tax_id": 1,
                "tax_group_id": 1,
            },
        ]

        count = 0
        for s in all_services:
            obj, created = SalonService.objects.update_or_create(
                website_service_id=s["website_service_id"],
                defaults=s,
            )
            count += 1
            status_text = "Created" if created else "Updated"
            self.stdout.write(f"{status_text}: {obj.name} ({obj.website_service_id} -> {obj.salon360_service_id})")

        self.stdout.write(self.style.SUCCESS(f"Successfully configured {count} service mappings."))
