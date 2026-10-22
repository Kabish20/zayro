import React, { useState } from 'react';
import { 
  ArrowRight, Clock, MapPin, Calendar, Star, 
  CheckCircle, ChevronRight, Phone, Navigation,
  Briefcase, Scissors, Shield, Award, Eye,
  Pause, Play, Sparkles, Quote
} from 'lucide-react';
import { services } from '../data/servicesData';
import { galleryItems } from '../data/galleryData';
import { packagesData } from '../data/packagesData';
import { reviewsData } from '../data/reviewsData';

export default function HomeView({ 
  setCurrentView, 
  openBooking, 
  openServiceDetail, 
  openLightbox, 
  openFranchiseModal 
}) {
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);

  return (
    <div className="space-y-12 sm:space-y-14 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[72vh] lg:min-h-[78vh] bg-[#1A2719] flex items-center overflow-hidden">
        {/* Ambient Dark Green and Gold gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2719] via-[#30452F]/90 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 z-0">
          <img 
            src="/images/gallery/indian_haircut.jpg" 
            alt="ZAYRO Men's Grooming Signature Styling" 
            className="w-full h-full object-cover object-center scale-105 animate-gentle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2719] via-transparent to-transparent lg:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2719] via-[#1A2719]/30 to-[#1A2719]/50 hidden lg:block"></div>
        </div>

        <div className="relative z-20 w-full px-5 sm:px-8 lg:px-14 xl:px-16 py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl lg:max-w-2xl space-y-5 text-left">
            
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A2719]/80 border border-[#E6B25C]/40 backdrop-blur-md shadow-sm animate-float">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B25C] animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E6B25C]">
                  The Modern Gentleman's Grooming Lounge
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.14] text-balance">
              Precision Barbering. <br />
              <span className="gold-gradient-text italic font-normal">
                Timeless Distinction.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#F5ECDE]/90 font-light leading-relaxed max-w-xl text-balance">
              Master razor fades, bespoke beard architecture, traditional eucalyptus hot towel shaves, and follicular scalp therapy — engineered exclusively for South Asian male hair textures.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                id="hero-btn-book"
                onClick={() => openBooking()}
                className="w-full sm:w-auto bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F] font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-lg hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <button
                id="hero-btn-explore"
                onClick={() => {
                  setCurrentView('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-[#30452F]/80 hover:bg-[#476346] text-white border border-[#476346] hover:border-[#E6B25C] font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E6B25C]" />
              </button>

              <button
                id="hero-btn-franchise"
                onClick={() => openFranchiseModal()}
                className="w-full sm:w-auto text-xs text-[#E6B25C] hover:text-white underline underline-offset-4 font-semibold tracking-wide flex items-center justify-center sm:justify-start gap-1.5 transition-colors py-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Partner with ZAYRO (Franchise)</span>
              </button>
            </div>

            {/* Hero Trust Badges */}
            <div className="pt-8 border-t border-[#476346]/60 grid grid-cols-3 gap-3 sm:gap-6 text-white text-left">
              <div>
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#E6B25C] tracking-tight">45+</p>
                <p className="text-[10px] sm:text-[11px] text-[#9BB899] font-semibold uppercase tracking-wider mt-1">Flagship Lounges</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#E6B25C] tracking-tight">250k+</p>
                <p className="text-[10px] sm:text-[11px] text-[#9BB899] font-semibold uppercase tracking-wider mt-1">Gentlemen Styled</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#E6B25C] tracking-tight">38%</p>
                <p className="text-[10px] sm:text-[11px] text-[#9BB899] font-semibold uppercase tracking-wider mt-1">Franchise ROI</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SIGNATURE SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#30452F] block mb-2">
              Bespoke Men's Grooming Menu
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F] tracking-tight leading-tight">
              Signature Services
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
              From precision scissor fades and hot towel shaves to deep follicular scalp restoration, each service is performed by certified master barbers using hospital-grade hygiene.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold uppercase tracking-wider text-[#30452F] hover:text-[#1A2719] flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>View Full 24+ Service Catalogue</span>
            <ArrowRight className="w-4 h-4 text-[#E6B25C]" />
          </button>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm card-hover-lift flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#1A2719]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E6B25C] border border-[#E6B25C]/30">
                  {service.duration}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#F5ECDE]/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#30452F] shadow-sm">
                  {service.price}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#30452F] group-hover:text-[#30452F] transition-colors line-clamp-2 min-h-[3.25rem] flex items-center leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#967456] mt-1 line-clamp-1">
                    {service.tagline}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => openServiceDetail(service)}
                    className="text-xs font-semibold text-[#30452F] hover:text-[#1A2719] flex items-center gap-1 transition-colors"
                  >
                    <span>Treatment Steps</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#E6B25C]" />
                  </button>

                  <button
                    onClick={() => openBooking(service)}
                    className="bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE ZAYRO — BRAND EXCELLENCE */}
      <section className="bg-[#30452F] text-white py-20 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#30452F]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-[#E6B25C]/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
              The ZAYRO Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Why Discerning Clients Choose ZAYRO
            </h2>
            <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
              We bridge high-fashion editorial styling with meticulous scalp biology and welcoming hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A2719] p-8 rounded-2xl border border-[#476346] hover:border-[#E6B25C]/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#30452F] text-[#E6B25C] flex items-center justify-center border border-[#E6B25C]/30 shadow-inner">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                South Asian Men's Hair & Beard Architecture
              </h3>
              <p className="text-xs text-[#9BB899] leading-relaxed">
                Coarse, straight, or dense South Asian male hair and beard textures require specialized razor texturizing and clipper tapering to prevent blunt shapes and ensure razor-sharp structure.
              </p>
            </div>

            <div className="bg-[#1A2719] p-8 rounded-2xl border border-[#476346] hover:border-[#E6B25C]/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#30452F] text-[#E6B25C] flex items-center justify-center border border-[#E6B25C]/30 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Medical-Grade Hygiene
              </h3>
              <p className="text-xs text-[#9BB899] leading-relaxed">
                Every client receives fresh, single-use biodegradable styling capes, sealed autoclaved scissors, and skin-safe botanical antiseptics before any service begins.
              </p>
            </div>

            <div className="bg-[#1A2719] p-8 rounded-2xl border border-[#476346] hover:border-[#E6B25C]/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#30452F] text-[#E6B25C] flex items-center justify-center border border-[#E6B25C]/30 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Master Creative Directors
              </h3>
              <p className="text-xs text-[#9BB899] leading-relaxed">
                Our stylists undergo 250+ hours of continuous masterclass education at the ZAYRO Academy, certified across Toni&Guy, Vidal Sassoon, and L’Oréal standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASIAN TRENDING STYLES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block mb-2">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
              Trending Men's Hair & Grooming Styles
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg">
              Click any style to inspect high-definition details or directly request that look with your stylist.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold uppercase tracking-wider text-[#30452F] hover:text-[#30452F] flex items-center gap-1.5 transition-colors"
          >
            <span>Explore Full Gallery ({galleryItems.length} Looks)</span>
            <ArrowRight className="w-4 h-4 text-[#E6B25C]" />
          </button>
        </div>

        {/* 4 Gallery Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.slice(0, 4).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(galleryItems, idx)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-luxury transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2719] via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>
              
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-[#E6B25C]" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6B25C] block mb-1">
                  {item.categoryName}
                </span>
                <h4 className="font-serif text-lg font-bold">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#E8DCB8] line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FRANCHISE PARTNER SPOTLIGHT BANNER (Like Naturals / Green Trends / TONI&GUY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1A2719] via-[#30452F] to-[#476346] rounded-3xl p-8 sm:p-12 text-white border border-[#E6B25C]/30 shadow-luxury relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6B25C]/20 text-[#E6B25C] text-[10px] font-bold uppercase tracking-wider border border-[#E6B25C]/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Franchise Opportunity • Pan-India & Global Expansion</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Own a High-Margin <br />
                <span className="gold-gradient-text">ZAYRO Men's Grooming Lounge</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#E8DCB8] leading-relaxed max-w-xl">
                Leverage our celebrated brand equity, high-margin salon economics, turnkey architectural setup, and certified staff from ZAYRO Academy. Available in passive FOCO and entrepreneurial FOFO models.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#1A2719]/60 p-3 rounded-xl border border-[#476346]">
                  <span className="text-[10px] uppercase text-[#E6B25C] block font-semibold">Average ROI</span>
                  <span className="font-serif text-xl font-bold text-white">38% Per Annum</span>
                </div>
                <div className="bg-[#1A2719]/60 p-3 rounded-xl border border-[#476346]">
                  <span className="text-[10px] uppercase text-[#E6B25C] block font-semibold">Payback Period</span>
                  <span className="font-serif text-xl font-bold text-white">18 – 22 Months</span>
                </div>
                <div className="bg-[#1A2719]/60 p-3 rounded-xl border border-[#476346] col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-[#E6B25C] block font-semibold">Turnkey Model</span>
                  <span className="font-serif text-xl font-bold text-white">FOCO / FOFO</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openFranchiseModal()}
                  className="bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  Apply for Franchise
                </button>
                <button
                  onClick={() => {
                    setCurrentView('franchise');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-white hover:text-[#E6B25C] font-semibold underline underline-offset-4 transition-colors"
                >
                  View Franchise Models & ROI Projections
                </button>
              </div>
            </div>

            {/* Franchise Team / Flagship Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#E6B25C]/40 shadow-2xl">
                <img
                  src="/images/franchise/indian_flagship.jpg"
                  alt="ZAYRO Flagship Salon Operations Team"
                  className="w-full h-72 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white">
                  <p className="font-semibold text-[#E6B25C]">ZAYRO Master Stylists & Management</p>
                  <p className="text-[11px] text-[#F5ECDE]/80">Trained centrally at ZAYRO Academy for peerless service delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SALON EXPERIENCE & AMBIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
              Architectural Sanctuary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
              Designed for Serenity, <br />
              Tailored for Style
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Step into a soothing sanctuary of velvet sage green styling chairs, warm gold accents, and acoustic tranquility. At ZAYRO, we believe a salon visit should be your daily reset.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#30452F]/20 text-[#30452F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#30452F]">Japanese Waterfall Wash Bays</h4>
                  <p className="text-[11px] text-gray-500">Ergonomic zero-gravity basins with head rest support and warm steam mist.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#30452F]/20 text-[#30452F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#30452F]">Private VIP Royal Groom's Lounge</h4>
                  <p className="text-[11px] text-gray-500">Dedicated soundproof suites for royal Indian grooms, wedding parties, and executives.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#30452F]/20 text-[#30452F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#30452F]">Complimentary Artisanal Bar</h4>
                  <p className="text-[11px] text-gray-500">Enjoy cold-pressed juices, iced matcha lattes, and artisan espresso during your styling.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => openBooking()}
              className="bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md"
            >
              Reserve Your Salon Station
            </button>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-luxury border border-[#E8DCB8]">
            <img
              src="/images/salon/interior.jpg"
              alt="ZAYRO Luxury Salon Interior with Sage Green and Gold"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6B25C]">
                Flagship KK Nagar, Tiruchirappalli
              </span>
              <p className="font-serif text-xl font-bold mt-1">
                The Sage Green & Gold Styling Lounge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SPECIAL OFFERS & PACKAGES PREVIEW */}
      <section className="bg-[#F5ECDE] py-16 border-y border-[#E8DCB8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block mb-1">
                Curated Value
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#30452F]">
                Featured Packages & Rituals
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                All-inclusive salon packages offering up to 30% savings on signature services.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentView('offers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold uppercase tracking-wider text-[#30452F] hover:text-[#30452F] flex items-center gap-1.5 transition-colors"
            >
              <span>View All 5 Packages</span>
              <ArrowRight className="w-4 h-4 text-[#E6B25C]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packagesData.slice(0, 3).map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-2xl p-6 border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm card-hover-lift flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#30452F] bg-[#E8EFE8] px-2.5 py-0.5 rounded-full">
                      {pkg.category}
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                      {pkg.saveText}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#30452F]">
                    {pkg.title}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-serif text-2xl font-bold text-[#30452F]">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {pkg.originalPrice}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium ml-auto">
                      {pkg.duration}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {pkg.description}
                  </p>

                  <ul className="space-y-1.5 pt-2 text-xs text-gray-700">
                    {pkg.includes.slice(0, 3).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openBooking(pkg.title)}
                  className="w-full bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors text-center"
                >
                  Book Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GENTLEMEN'S PERSPECTIVES — VERIFIED TAMIL NADU GUEST ENDORSEMENTS (LEFT-TO-RIGHT MARQUEE) */}
      <section className="relative overflow-hidden py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8EFE8] border border-[#30452F]/20 text-[#30452F] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                <Sparkles className="w-3 h-3 text-[#E6B25C]" />
                <span>Tamil Nadu Client Testimonials</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30452F] tracking-tight leading-tight">
                Gentlemen’s Perspectives
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
                Real endorsements from corporate leaders, surgeons, tech founders, and royal Indian wedding grooms across Tamil Nadu who trust ZAYRO for their signature style.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              {/* Google Verified Rating Pill */}
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8DCB8] shadow-sm">
                <div className="flex text-[#E6B25C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#30452F]">4.9 / 5.0</span>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      100% Genuine
                    </span>
                  </div>
                  <p className="text-[9px] text-stone-500 font-medium">2,400+ Verified Tamil Nadu Guests</p>
                </div>
              </div>

              {/* Pause / Resume Flow Toggle */}
              <button
                type="button"
                onClick={() => setIsReviewsPaused(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all shadow-sm ${
                  isReviewsPaused
                    ? 'bg-[#30452F] text-white border-[#30452F]'
                    : 'bg-white border-[#E8DCB8] text-[#30452F] hover:bg-[#FAF5ED] hover:border-[#E6B25C]'
                }`}
                title={isReviewsPaused ? 'Click to resume moving' : 'Click to pause motion'}
              >
                {isReviewsPaused ? (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Resume Flow</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause Flow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stream Information Bar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500 border-t border-[#E8DCB8]/60 pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-[#30452F]">Flowing Left → Right</span>
              <span className="hidden sm:inline text-stone-400">• Hover over any card to pause & read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#967456] font-medium">Trichy Flagship • KK Nagar • Srirangam • Thillai Nagar</span>
            </div>
          </div>
        </div>

        {/* Continuous Left-to-Right Marquee Slider */}
        <div className="relative w-full overflow-hidden group py-2">
          {/* Edge Gradient Overlays for Smooth Fade In/Out */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F5ECDE] via-[#F5ECDE]/90 to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F5ECDE] via-[#F5ECDE]/90 to-transparent z-10"></div>

          {/* Marquee Track moving Left to Right */}
          <div
            className="animate-marquee-ltr flex gap-4 sm:gap-5 px-3"
            style={{
              animationPlayState: isReviewsPaused ? 'paused' : undefined,
            }}
          >
            {[...reviewsData, ...reviewsData].map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="w-[280px] sm:w-[320px] md:w-[340px] min-h-[250px] sm:min-h-[265px] shrink-0 bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group/card relative"
              >
                {/* Decorative Quote Mark */}
                <Quote className="absolute top-4 right-4 w-5 h-5 text-[#E8DCB8]/40 -scale-x-100 pointer-events-none" />

                <div className="space-y-2">
                  {/* Client Profile Header with Generated Tamil Nadu Photo */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-[#E6B25C]/70 shadow-sm"
                        loading="lazy"
                      />
                      <div
                        className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white p-0.5 rounded-full ring-1 ring-white"
                        title="Verified Guest"
                      >
                        <CheckCircle className="w-2.5 h-2.5 fill-emerald-600 text-white" />
                      </div>
                    </div>

                    <div className="min-w-0 pr-4">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#30452F] truncate">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-[#967456] font-medium truncate">
                        {review.role}
                      </p>
                      <div className="flex items-center gap-1 text-[9.5px] text-stone-500">
                        <MapPin className="w-2.5 h-2.5 text-[#30452F] shrink-0" />
                        <span className="truncate">{review.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-stone-100">
                    <div className="flex items-center gap-1">
                      <div className="flex text-[#E6B25C]">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#30452F]">5.0</span>
                    </div>
                    <span className="text-[9px] font-medium text-stone-400">
                      {review.date}
                    </span>
                  </div>

                  {/* Service Highlight Tag */}
                  <div className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#30452F] bg-[#FAF5ED] px-2 py-0.5 rounded-md border border-[#E8DCB8]/70 max-w-full">
                    <Scissors className="w-2.5 h-2.5 text-[#E6B25C] shrink-0" />
                    <span className="truncate">{review.service}</span>
                  </div>

                  {/* Review Content */}
                  <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed italic line-clamp-3 group-hover/card:line-clamp-none transition-all">
                    “{review.content}”
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200 text-[9px]">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600 fill-emerald-100" />
                    Google Verified
                  </span>
                  <span className="text-[9px] text-stone-500 font-medium">
                    KK Nagar Flagship
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SALON LOCATION — TIRUCHIRAPPALLI FLAGSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E8DCB8] shadow-luxury card-hover-lift overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Salon Details */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] bg-[#30452F] px-3.5 py-1 rounded-full">
                    Flagship Destination
                  </span>
                  <span className="text-[11px] font-semibold text-[#967456] bg-[#F5ECDE] px-3 py-1 rounded-full border border-[#E8DCB8]">
                    Tiruchirappalli, Tamil Nadu
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F] tracking-tight">
                    ZAYRO Men’s Grooming Lounge
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Step into an exclusive sanctuary of master razor fades, bespoke beard architecture, traditional hot towel shaves, and clinical scalp therapy.
                  </p>
                </div>

                {/* Primary Address Box */}
                <div className="bg-[#FBF7F0] p-5 sm:p-6 rounded-2xl border border-[#E8DCB8] space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#30452F] text-[#E6B25C] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#967456] block">
                        Salon Address
                      </span>
                      <p className="font-serif text-base sm:text-lg font-bold text-[#30452F] leading-snug">
                        Door No. 115, Rajaram Rd, K K Nagar, Tiruchirappalli, Tamil Nadu 620021
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8DCB8]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#30452F] shrink-0" />
                      <span><strong>Hours:</strong> 10:00 AM – 09:30 PM (Mon – Sun)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#30452F] shrink-0" />
                      <span><strong>Contact Number:</strong> +91 91500 22115</span>
                    </div>
                  </div>
                </div>

                {/* Key Salon Features */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                    <span>Opp. KK Nagar Bus Terminus</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                    <span>Valet & Covered Parking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                    <span>12 Luxury Styling Stations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                    <span>Japanese Head Spa Bays</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                    <span>Private Royal Groom Suite</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                    <span>Espresso & Tea Bar</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <button
                  onClick={() => openBooking("ZAYRO Men's Grooming Lounge — Flagship")}
                  className="w-full sm:w-auto bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Slot</span>
                </button>

                <a
                  href="https://maps.google.com/?q=Door+No+115+Rajaram+Rd+KK+Nagar+Tiruchirappalli+Tamil+Nadu+620021"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-white hover:bg-[#F5ECDE] text-[#30452F] border border-[#30452F]/40 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-[#E6B25C]" />
                  <span>Open Google Maps</span>
                </a>

                <a
                  href="tel:+919150022115"
                  className="w-full sm:w-auto bg-white hover:bg-[#F5ECDE] text-stone-700 border border-gray-300 font-semibold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#30452F]" />
                  <span>Call Salon</span>
                </a>
              </div>
            </div>

            {/* Visual Right Column */}
            <div className="lg:col-span-5 relative min-h-[340px] sm:min-h-[420px] bg-[#1A2719] overflow-hidden">
              <img
                src="/images/salon/interior.jpg"
                alt="ZAYRO Men's Grooming Lounge Flagship Salon Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#30452F] border border-[#E6B25C]/40 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Open Today: 10:00 AM – 9:30 PM</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-block bg-[#E6B25C] text-[#1A2719] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded">
                  Prime Landmark
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  Opposite KK Nagar Bus Terminus
                </h4>
                <p className="text-xs text-[#F5ECDE]/90 leading-relaxed">
                  Conveniently situated on Rajaram Road with dedicated valet arrival for our esteemed guests.
                </p>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Door+No+115+Rajaram+Rd+KK+Nagar+Tiruchirappalli+Tamil+Nadu+620021"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#E6B25C] font-semibold underline underline-offset-4 hover:text-white transition-colors"
                  >
                    <span>Get Turn-by-Turn GPS Directions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
