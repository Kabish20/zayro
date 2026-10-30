import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Award, Sparkles, MessageSquare } from 'lucide-react';
import { BRAND, CONTACT, getWhatsAppUrl, VIEWS } from '@/constants';

const CURRENT_YEAR = new Date().getFullYear();

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
                src={BRAND.logo} 
                alt={BRAND.fullName} 
                className="h-20 sm:h-24 lg:h-28 w-auto max-w-[320px] sm:max-w-[360px] object-contain drop-shadow-md"
              />
            </div>

            <p className="font-serif italic text-[#E6B25C] text-sm">
              "{BRAND.tagline.toUpperCase()}"
            </p>

            <p className="text-xs text-[#9BB899] leading-relaxed max-w-sm">
              {BRAND.description}
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-[#E6B25C]">
              <p className="flex items-center gap-2">
                <span>📸 Social:</span>
                <a 
                  href={CONTACT.social.instagram.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-[#E6B25C] transition-colors"
                >
                  {CONTACT.social.instagram.handle}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>🌐 Website:</span>
                <span className="font-semibold text-white">{BRAND.domain}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href={CONTACT.social.instagram.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#30452F] text-[#E6B25C] hover:bg-[#E6B25C] hover:text-[#1F2E1E] flex items-center justify-center transition-all"
                aria-label={`Instagram ${CONTACT.social.instagram.handle}`}
                title={`Instagram ${CONTACT.social.instagram.handle}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={CONTACT.social.facebook.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#30452F] text-[#E6B25C] hover:bg-[#E6B25C] hover:text-[#1F2E1E] flex items-center justify-center transition-all"
                aria-label={`Facebook ${CONTACT.social.facebook.handle}`}
                title={`Facebook ${CONTACT.social.facebook.handle}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a 
                href={getWhatsAppUrl('Hi ZAYRO Concierge, I would like to inquire about an appointment.')} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#30452F] text-[#E6B25C] hover:bg-[#E6B25C] hover:text-[#1F2E1E] flex items-center justify-center transition-all"
                aria-label="WhatsApp"
                title="WhatsApp Concierge"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#E6B25C] uppercase tracking-wider">
              Explore ZAYRO
            </h5>
            <ul className="space-y-2 text-xs text-[#9BB899]">
              <li>
                <button onClick={() => handleNav(VIEWS.HOME)} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(VIEWS.SERVICES)} className="hover:text-white transition-colors">
                  All Grooming Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(VIEWS.OFFERS)} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Offers & 10 Combos</span>
                  <span className="bg-[#E6B25C] text-[#1F2E1E] text-[9px] font-extrabold px-1 rounded">HOT</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openRateCard?.()} 
                  className="hover:text-white transition-colors text-[#E6B25C] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Price Card Brochure</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(VIEWS.GALLERY)} className="hover:text-white transition-colors">
                  Hairstyle Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(VIEWS.ABOUT)} className="hover:text-white transition-colors">
                  About Our Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(VIEWS.LOCATIONS)} className="hover:text-white transition-colors">
                  All Salon Locations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav(VIEWS.KKNAGAR_INVITE)} 
                  className="hover:text-white transition-colors text-[#E6B25C] font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#E6B25C]" />
                  <span>KK Nagar Grand Opening (04 Nov)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Services Menu */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#E6B25C] uppercase tracking-wider">
              Signature Treatments
            </h5>
            <ul className="space-y-2 text-xs text-[#9BB899]">
              <li>
                <button 
                  onClick={() => openBooking({ name: 'Executive Haircut', price: '₹99' })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Executive Haircut (₹99)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBooking({ name: 'Traditional Hot Towel Shave', price: '₹50' })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Hot Towel Shave (₹50)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBooking({ name: 'Skin Fade + Beard Sculpture', price: '₹299' })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Skin Fade + Beard (₹299)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBooking({ name: 'Head Massage + D-Tan Pack', price: '₹349' })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Scalp Spa + D-Tan (₹349)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBooking({ name: 'The Royal Groom Ritual', price: '₹999' })} 
                  className="hover:text-white transition-colors text-left text-[#E6B25C]"
                >
                  Royal Groom Ritual (₹999)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(VIEWS.FRANCHISE)} className="hover:text-[#E6B25C] transition-colors text-left font-semibold text-white">
                  Franchise Partnership (38% ROI)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#E6B25C] uppercase tracking-wider">
              Flagship Hub
            </h5>
            <div className="space-y-2 text-xs text-[#9BB899]">
              <div className="p-2.5 rounded-xl bg-[#30452F]/70 border border-[#476346] text-[#E6B25C] text-[11px] leading-tight">
                <strong>South India's Premier Men's Brand:</strong>
                <p className="text-[#9BB899] text-[10px] mt-0.5">Tiruchirappalli • Bengaluru • Chennai • Hyderabad</p>
              </div>

              <div className="flex items-start gap-2 pt-1.5 border-t border-[#30452F]">
                <MapPin className="w-4 h-4 text-[#E6B25C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Flagship Salon:</span>
                  <a 
                    href="https://maps.app.goo.gl/cm1jPer19fpYee2y7?g_st=awb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E6B25C] transition-colors"
                  >
                    No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaya Super Market, Trichy – 620021
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#30452F]">
                <Phone className="w-4 h-4 text-[#E6B25C] shrink-0" />
                <a href={CONTACT.telLink} className="hover:text-white transition-colors">
                  Contact Number: {CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6B25C] shrink-0" />
                <a href={CONTACT.mailLink} className="hover:text-white transition-colors">
                  {CONTACT.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#E6B25C] shrink-0 mt-0.5" />
                <span>{CONTACT.hours}</span>
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
          <p>© {CURRENT_YEAR} {BRAND.name} Men's Grooming Lounge Pvt Ltd. All rights reserved. {BRAND.tagline}.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav(VIEWS.FAQ)} className="hover:text-[#E6B25C] transition-colors">
              FAQ
            </button>
            <button onClick={() => handleNav(VIEWS.PRIVACY)} className="hover:text-[#E6B25C] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav(VIEWS.TERMS)} className="hover:text-[#E6B25C] transition-colors">
              Terms & Conditions
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-[#9BB899]/70">
          <p>
            ZAYRO is an independent luxury men's grooming salon brand and franchise network. Prices and combo menus subject to change without prior notice. Applicable government GST charged as per statutory guidelines.
          </p>
        </div>

      </div>
    </footer>
  );
}
