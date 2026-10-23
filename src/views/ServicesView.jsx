import React, { useState } from 'react';
import { Search, Clock, Sparkles, Filter, ChevronRight, Calendar, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { categories, services } from '../data/servicesData';
import { rateCardServices } from '../data/packagesData';

export default function ServicesView({ openBooking, openServiceDetail }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((svc) => {
    let matchesCategory = false;
    if (selectedCategory === 'all') {
      matchesCategory = true;
    } else if (selectedCategory === 'ratecard') {
      matchesCategory = svc.isRateCard === true;
    } else {
      matchesCategory = svc.category === selectedCategory;
    }

    const matchesSearch = 
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1A2719] via-[#30452F] to-[#1A2719] rounded-3xl p-6 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
            Couture Salon Menu & Rate Card
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            All ZAYRO Salon Services
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#E6B25C]">
            "Luxury Made Affordable"
          </p>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Every service is tailored around individual facial architecture and hair texture biology. Choose single services starting at just ₹50 or explore our 10 value combos.
          </p>
        </div>
      </div>

      {/* 2. Official Rate Card Showcase (Page 1 of Brochure) */}
      <section className="bg-gradient-to-br from-[#1b3424] via-[#1f3a29] to-[#14261a] rounded-3xl p-6 sm:p-10 border-2 border-[#E6B25C]/50 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#E6B25C_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6B25C]/30 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6B25C]/20 border border-[#E6B25C]/40 text-[#E6B25C] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Official Rate Card — Brochure Page 1</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Essential Salon Pricing
              </h2>
              <p className="text-xs text-[#9BB899] mt-1">
                Standard pricing honored across all ZAYRO branches. Hospital-grade hygiene & master barber care included.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#E6B25C] font-semibold">
                Looking for packages?
              </span>
              <a
                href="#services-filter"
                onClick={() => setSelectedCategory('ratecard')}
                className="bg-[#E6B25C] hover:bg-white text-[#1A2719] font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
              >
                View Rate Card Items
              </a>
            </div>
          </div>

          {/* 6 Rate Card Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {rateCardServices.map((svc) => (
              <div
                key={svc.id}
                onClick={() => openBooking(svc.name + ` (${svc.price})`)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#E6B25C]/30 hover:border-[#E6B25C] transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BB899] block">
                    {svc.duration}
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-[#E6B25C] transition-colors mt-0.5">
                    {svc.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#E6B25C]">
                    {svc.price}
                  </span>
                  <span className="text-[10px] font-bold text-[#E6B25C] group-hover:underline">
                    Book Now
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9BB899] border-t border-[#E6B25C]/20">
            <span>✨ Walk-ins welcome daily • Sanitized tools & single-use biodegradable towels</span>
            <span className="text-[#E6B25C] font-medium">📸 @zayro.saloon • 🌐 www.zayrosalon.com</span>
          </div>
        </div>
      </section>

      {/* 3. Filter and Search Bar */}
      <div id="services-filter" className="space-y-4 pt-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search grooming services (e.g. Haircut, Shave, Oil Massage, Facial)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">No services matched your search term "{searchQuery}".</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3 text-xs font-bold text-[#30452F] underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Banner */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#1A2719]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E6B25C] border border-[#E6B25C]/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{service.duration}</span>
                </div>
                {service.isRateCard && (
                  <div className="absolute top-3 right-3 bg-[#E6B25C] text-[#1A2719] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Rate Card
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-[#F5ECDE]/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#30452F] shadow-sm">
                  {service.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#30452F] group-hover:text-[#1A2719] transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#967456] mt-1 line-clamp-1">
                    {service.tagline}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="pt-2">
                  <ul className="space-y-1 text-xs text-stone-600">
                    {service.highlights.slice(0, 2).map((hl, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                        <span className="line-clamp-1">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => openServiceDetail(service)}
                    className="text-xs font-semibold text-[#30452F] hover:text-[#1A2719] flex items-center gap-1 transition-colors"
                  >
                    <span>Details & Steps</span>
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
      )}

      {/* 5. Combo Offers Banner Callout */}
      <div className="bg-[#1A2719] rounded-3xl p-6 sm:p-10 text-white border border-[#E6B25C]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6B25C] block">
            Maximum Value Bundle
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Looking for All-Inclusive Combos?
          </h3>
          <p className="text-xs sm:text-sm text-[#9BB899]">
            Save up to 43% with our 10 official Combo Offers featuring haircut, beard trim, face de-tan, oil massage, facial, or hair spa. Starting from just ₹299.
          </p>
        </div>

        <a
          href="/#offers"
          onClick={(e) => {
            e.preventDefault();
            // will navigate to offers
            window.location.hash = '#offers';
            window.dispatchEvent(new CustomEvent('nav-to-offers'));
          }}
          className="bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#1A2719] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <span>Explore 10 Combo Offers</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
