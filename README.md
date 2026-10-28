# ZAYRO Men's Grooming Lounge & Franchise Network

> **"Luxury Made Affordable"**  
> An elite men's grooming brand and high-growth franchise collective delivering precision razor fades, bespoke beard architecture, traditional hot towel shaves, and clinical scalp therapy.

---

## 🌿 Brand Identity & Design System

ZAYRO's visual aesthetics blend traditional royal barber craftsmanship with a serene modern luxury atmosphere:

- **Warm Ivory**: `#F5ECDE` — Clean, warm contrast and architectural surfaces
- **Deep Sage Green**: `#30452F` — Heritage barbering authority, serenity, and depth
- **Golden Amber**: `#E6B25C` — Metallic accents, glowing badges, and warm luxury highlights
- **South Asian Men's Grooming Architecture**: Tailored protocols for dense Indian hair textures, sharp beard contours, Ayurvedic scalp restoration, and Royal Groom wedding preparation.

---

## 💎 Features & Architecture

1. **Editorial Homepage**:
   - Hero section featuring Asian models in signature dark green and gold salon setting
   - Real-time trust metrics (45+ salons, 250k+ clients, 38% franchise ROI)
   - 6 Signature Services with instant detail and booking triggers
   - Asian Trending Hairstyles preview
   - Franchise Opportunity Banner (Naturals & Green Trends scale model)
   - Salon interior ambience gallery (Indiranagar Flagship)
   - Packages preview and quick salon finder

2. **Full Services Catalogue**:
   - Dynamic category filtering (Haircuts, Men's Grooming, Hair Colour, Hair Spa, Skincare, Bridal)
   - Instant search input by service name, tagline, or keyword
   - Detailed price cards, duration tags, and service highlight bullets

3. **Service Details Modal**:
   - 5-stage treatment walkthrough protocol
   - Hair biology benefits & recommended customer profiles
   - Direct booking trigger

4. **Hairstyle Gallery with Lightbox**:
   - Responsive grid of Asian cuts, drop fades, smoky balayage, Korean perms, and bridal updos
   - Full-screen Lightbox modal with keyboard arrow navigation (`←`, `→`, `Escape`)
   - Style tags and "Book This Exact Look" action

5. **Franchise Partner Portal**:
   - FOCO (Franchise Owned, Company Operated) — 100% passive investor model
   - FOFO (Franchise Owned, Franchise Operated) — Entrepreneurial owner-operator
   - ZAYRO Signature Luxe Lounge — Ultra-luxury metro flagship
   - **Interactive ROI & Revenue Simulator**: Dynamic sliders for daily footfall and ticket size calculating monthly EBITDA, payback period, and annual ROI percentage
   - 6 Pillars of Corporate Support (Turnkey 3D design, ZAYRO Academy, supply chain, localized SEO, cloud ERP, quality audits)
   - Partner application form with instant pre-filled WhatsApp dispatch

6. **Appointment Enquiry & WhatsApp Booking**:
   - Branch locator and stylist tier selector (Master Creative Director, Senior Stylist)
   - Client-side form validation (10-digit mobile, required fields)
   - One-click WhatsApp link generator encoding guest name, branch, service, stylist tier, and preferred date/time into a ready-to-send message

7. **Salons Directory**:
   - 5 Metropolitan Centers: Bengaluru (Indiranagar HQ), Hyderabad (Jubilee Hills), Mumbai (Bandra West), Chennai (Anna Nagar), New Delhi (Connaught Place)
   - Operating hours, amenities, phone lines, and Google Maps direction links

---

## 📁 Professional Project Structure

The project follows modern enterprise React conventions with path aliasing (`@/*`), centralized context state, modular component separation, and clean barrel exports:

```text
zayro/
├── public/                      # Static assets served directly (images, favicons, manifests)
│   ├── favicon.svg              # Brand vector favicon
│   ├── robots.txt               # SEO crawler policies
│   ├── sitemap.xml              # Search engine index sitemap
│   └── images/                  # Organized media assets (services, gallery, reviews, franchise)
│
├── src/
│   ├── components/              # Modular UI components
│   │   ├── common/              # Atomic reusable UI components (e.g. AnimatedCounter)
│   │   ├── layout/              # Application chrome (Header, Footer, FloatingActions)
│   │   ├── modals/              # Dialogs & overlays (BookingModal, ServiceDetailModal, ModalRoot)
│   │   ├── sections/            # Domain sections (MembershipPlans, RateCardBrochure)
│   │   └── index.js             # Central components barrel export
│   │
│   ├── constants/               # Single source of truth for global configuration & metadata
│   │   ├── brand.js             # Contact numbers, social handles, WhatsApp URLs, company info
│   │   ├── navigation.js        # View identifiers (VIEWS enum) and navigation items
│   │   └── index.js             # Central constants barrel export
│   │
│   ├── context/                 # Global state providers
│   │   ├── modalContextDef.js   # Fast-refresh isolated Context definition
│   │   ├── ModalProvider.jsx    # Centralized modal state manager
│   │   └── index.js             # Context barrel export
│   │
│   ├── data/                    # Static catalogs and business data
│   │   ├── franchiseData.js     # Franchise stats, tiers, and support pillars
│   │   ├── galleryData.js       # Editorial hair & beard lookbook items
│   │   ├── locationsData.js     # Salon branch details, maps, hours
│   │   ├── packagesData.js      # Official combos, rate card services, membership tiers
│   │   ├── reviewsData.js       # Verified customer testimonials
│   │   ├── servicesData.js      # Full service catalogue & pricing
│   │   └── index.js             # Unified data barrel export
│   │
│   ├── hooks/                   # Custom reusable React hooks
│   │   ├── useScrollPosition.js # Window scroll tracking hook
│   │   ├── useModal.js          # Direct modal controls hook
│   │   └── index.js             # Hooks barrel export
│   │
│   ├── services/                # External API integrations
│   │   ├── googleSheetsService.js # Google Apps Script lead capture endpoint
│   │   └── index.js             # Services barrel export
│   │
│   ├── utils/                   # Pure utility functions
│   │   ├── bookingPassGenerator.js # High-res VIP pass canvas generator
│   │   └── index.js             # Utils barrel export
│   │
│   ├── views/                   # Top-level page-level views
│   │   ├── AboutView.jsx        # Brand heritage & master barber story
│   │   ├── ContactView.jsx      # Contact form, direct phone, WhatsApp links
│   │   ├── FaqView.jsx          # Accordion FAQ guide
│   │   ├── FranchiseView.jsx    # Interactive ROI simulator & franchise deck
│   │   ├── GalleryView.jsx      # Filterable portfolio lookbook
│   │   ├── HomeView.jsx         # Signature homepage showcase
│   │   ├── LegalView.jsx        # Terms & Privacy legal notices
│   │   ├── LocationsView.jsx    # Flagship salon location & map
│   │   ├── OffersView.jsx       # 10 Combos & Rate card brochure
│   │   ├── ServicesView.jsx     # Searchable service catalog
│   │   └── index.js             # Unified views barrel export
│   │
│   ├── App.jsx                  # Root layout router & global modal provider
│   ├── index.css                # Global Tailwind CSS and design tokens
│   └── main.jsx                 # Application DOM bootstrap entry
│
├── jsconfig.json                # IDE path alias (@/*) IntelliSense configuration
├── vite.config.js               # Vite build config with path aliasing
└── tailwind.config.js           # Custom brand color palette & typography
```

---

## 🚀 Running Locally

```bash
# 1. Clone or open the repository
cd "d:\DCX PROJECTS\zayro"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start local development server
npm run dev

# The site is available at http://localhost:5173/
```

---

## 📦 Production Build & Deployment

```bash
# Build the production bundle
npm run build

# Preview production build locally
npm run preview
```

The output in `dist/` is completely static and ready for direct drag-and-drop deployment to **Netlify**, **Vercel**, **GitHub Pages**, **AWS S3 / CloudFront**, or standard static web hosting.
