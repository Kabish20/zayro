import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Award, Sparkles, MessageSquare } from 'lucide-react';

export default function Footer({ setCurrentView, openBooking, openRateCard }) {
  const handleNav = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A2719] text-[#F5ECDE] pt-16 pb-8 border-t border-[#30452F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#30452F]">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#30452F] text-[#E6B25C] border border-[#E6B25C]/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base">South Asian Hair Masters</h4>
              <p className="text-xs text-[#9BB899] mt-1 leading-relaxed">
                Precision scissor and texturizing cuts tailored specifically for Indian hair density and texture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#30452F] text-[#E6B25C] border border-[#E6B25C]/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base">Sterilized & Safe</h4>
              <p className="text-xs text-[#9BB899] mt-1 leading-relaxed">
                Single-use biodegradable towels, UV-sterilized tools & hospital-grade hygiene standards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#30452F] text-[#E6B25C] border border-[#E6B25C]/30 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base">Master Director Stylists</h4>
              <p className="text-xs text-[#9BB899] mt-1 leading-relaxed">
                Internationally trained artists with Toni&Guy and L'Oréal Academy certifications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#30452F] text-[#E6B25C] border border-[#E6B25C]/30 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base">Instant WhatsApp Desk</h4>
              <p className="text-xs text-[#9BB899] mt-1 leading-relaxed">
                15-minute confirmation for appointments and personalized stylist consultations.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo/Transparent Logo.png" 
                alt="ZAYRO Men's Grooming" 
                className="h-20 sm:h-24 lg:h-28 w-auto max-w-[320px] sm:max-w-[360px] object-contain drop-shadow-md"
              />
            </div>

            <p className="font-serif italic text-[#E6B25C] text-sm">
              "LUXURY MADE AFFORDABLE"
            </p>

            <p className="text-xs text-[#9BB899] leading-relaxed max-w-sm">
              ZAYRO is an elite men's grooming lounge delivering master razor fades, bespoke beard architecture, traditional hot towel shaves, and clinical scalp therapy. Haircuts from ₹99, Shaves from ₹50, and 10 Combos from ₹299.
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-[#E6B25C]">
              <p className="flex items-center gap-2">
                <span>📸 Social:</span>
                <a 
                  href="https://www.instagram.com/zayro.coming_soon?srtk=YWpzaXZpNWtiZGlr&utm_source=qr" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-semibold text-white hover:text-[#E6B25C] transition-colors"
                >
                  @zayro.coming_soon
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>🌐 Website:</span>
                <span className="font-semibold text-white">www.zayrosalon.com</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.instagram.com/zayro.coming_soon?srtk=YWpzaXZpNWtiZGlr&utm_source=qr" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#30452F] text-[#E6B25C] hover:bg-[#E6B25C] hover:text-[#1F2E1E] flex items-center justify-center transition-all"
                aria-label="Instagram @zayro.coming_soon"
                title="Instagram @zayro.coming_soon"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/zayro.saloon" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#30452F] text-[#E6B25C] hover:bg-[#E6B25C] hover:text-[#1F2E1E] flex items-center justify-center transition-all"
                aria-label="Facebook @zayro.saloon"
                title="Facebook @zayro.saloon"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/919150022115" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#30452F] text-[#E6B25C] hover:bg-[#E6B25C] hover:text-[#1F2E1E] flex items-center justify-center transition-all"
                aria-label="WhatsApp"
                title="WhatsApp Concierge"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-[#30452F] pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9BB899]">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#E6B25C] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => openRateCard && openRateCard()} className="text-[#E6B25C] font-semibold hover:underline flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Official Rate Card (PDF)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('offers')} className="hover:text-[#E6B25C] transition-colors">
                  10 Official Combo Offers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('offers')} className="text-[#E6B25C] font-semibold hover:underline flex items-center gap-1">
                  <span>Membership Plans (From ₹259)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  All Salon Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#E6B25C] transition-colors">
                  Indian Hairstyle Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('franchise')} className="text-[#E6B25C] font-semibold hover:underline flex items-center gap-1">
                  <span>Franchise Opportunity</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('offers')} className="hover:text-[#E6B25C] transition-colors">
                  Packages & Seasonal Offers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('locations')} className="hover:text-[#E6B25C] transition-colors">
                  Salon Location & Directions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#E6B25C] transition-colors">
                  About Our Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-[#30452F] pb-2">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9BB899]">
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  Couture Precision Haircuts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  Master Skin Fade & Crop
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  Textured Wave Styling
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  Royal Hot Towel Barbering
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  Botanical Scalp Head Spa
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  Gentleman’s Detox & Hydra-Facial
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#E6B25C] transition-colors">
                  The Royal Indian Groom's Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-[#30452F] pb-2">
              Head Office & Concierge
            </h4>
            <div className="space-y-3 text-xs text-[#9BB899]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6B25C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Head Office (Trichy, India 🇮🇳):</span>
                  <span>5, Crescent Park Apartment, Hazrath Sulaiman Street, Kaja Nagar, Trichy – 620020</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1.5 border-t border-[#30452F]">
                <MapPin className="w-4 h-4 text-[#E6B25C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Flagship Salon:</span>
                  <span>Door No. 115, Rajaram Rd, KK Nagar, Trichy – 620021</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#30452F]">
                <Phone className="w-4 h-4 text-[#E6B25C] shrink-0" />
                <a href="tel:+919150022115" className="hover:text-white transition-colors">
                  Contact Number: +91 91500 22115
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6B25C] shrink-0" />
                <a href="mailto:partner@zayroclub.com" className="hover:text-white transition-colors">
                  partner@zayroclub.com
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#E6B25C] shrink-0 mt-0.5" />
                <span>Mon – Sun: 10:00 AM – 09:30 PM (All 7 Days)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#30452F]">
              <button
                onClick={() => openBooking()}
                className="w-full bg-[#30452F] hover:bg-[#E6B25C] hover:text-[#1F2E1E] text-[#E6B25C] text-xs font-bold py-2 px-3 rounded-lg border border-[#E6B25C]/40 transition-all text-center"
              >
                Book Appointment Online
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-[#30452F] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#9BB899]">
          <p>© {new Date().getFullYear()} ZAYRO Men's Grooming Lounge Pvt Ltd. All rights reserved. Luxury Made Affordable.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('faq')} className="hover:text-[#E6B25C] transition-colors">
              FAQ
            </button>
            <button onClick={() => handleNav('privacy')} className="hover:text-[#E6B25C] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('terms')} className="hover:text-[#E6B25C] transition-colors">
              Terms & Conditions
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-[#9BB899]/70">
          Disclaimer: ZAYRO is an independent luxury men's grooming lounge and franchise provider inspired by international standards. All displayed service pricing, durations, and franchise projections represent illustrative models.
        </div>
      </div>
    </footer>
  );
}
