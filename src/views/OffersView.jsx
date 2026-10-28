import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Clock, Calendar, MessageSquare, Layers } from 'lucide-react';
import { comboOffers, rateCardServices } from '@/data';
import { RateCardBrochure, MembershipPlans } from '@/components';
import { getWhatsAppUrl } from '@/constants';

export default function OffersView({ openBooking }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'brochure'

  const filteredCombos = comboOffers.filter((combo) => {
    if (activeFilter === 'starter') return combo.numericPrice <= 499;
    if (activeFilter === 'mid') return combo.numericPrice >= 599 && combo.numericPrice <= 899;
    if (activeFilter === 'luxury') return combo.numericPrice >= 999;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1A2719] via-[#30452F] to-[#1A2719] rounded-3xl p-6 sm:p-12 text-white border border-[#E6B25C]/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(#E6B25C_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6B25C]/20 border border-[#E6B25C]/40">
            <span className="w-2 h-2 rounded-full bg-[#E6B25C] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#E6B25C]">
              Official Rate Card & Combos
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            10 Official Combo Offers & Single Services
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#E6B25C]">
            "Luxury Made Affordable"
          </p>

          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed max-w-2xl">
            Experience our complete grooming protocols engineered for South Asian men. Choose individual services starting at ₹50 or save up to 43% with our 10 curated combo rituals starting at ₹299.
          </p>

          {/* Quick Stats Banner */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-[10px] uppercase text-[#9BB899] font-semibold">Haircut From</span>
              <span className="font-sans text-xl sm:text-2xl font-bold text-[#E6B25C]">₹99</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-[10px] uppercase text-[#9BB899] font-semibold">Shave From</span>
              <span className="font-sans text-xl sm:text-2xl font-bold text-[#E6B25C]">₹50</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-[10px] uppercase text-[#9BB899] font-semibold">Combos From</span>
              <span className="font-sans text-xl sm:text-2xl font-bold text-[#E6B25C]">₹299</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-[10px] uppercase text-[#9BB899] font-semibold">Combo Savings</span>
              <span className="font-sans text-xl sm:text-2xl font-bold text-white">Up to 43%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Rate Card Quick-Strip (Page 1 from PDF) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCB8] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E8DCB8]/60 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#30452F] block">
              Official Rate Card (Brochure Page 1)
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#30452F]">
              Standard Single Services
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Walk-in & Advance Booking Honored Daily
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {rateCardServices.map((svc) => (
            <div
              key={svc.id}
              onClick={() => openBooking(svc.name + ` (${svc.price})`)}
              className="p-4 rounded-2xl bg-[#F5ECDE]/50 hover:bg-[#F5ECDE] border border-[#E8DCB8] hover:border-[#E6B25C] transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {svc.duration}
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#30452F] group-hover:text-[#1A2719]">
                  {svc.name}
                </h3>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="font-sans text-xl font-bold text-[#30452F]">
                  {svc.price}
                </span>
                <span className="text-[10px] font-bold text-[#30452F] underline group-hover:text-[#E6B25C]">
                  Book
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. View Switcher & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setActiveFilter('all'); setViewMode('grid'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all' && viewMode === 'grid'
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All 10 Combos
          </button>
          <button
            onClick={() => { setActiveFilter('starter'); setViewMode('grid'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'starter' && viewMode === 'grid'
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Budget Combos (₹299 – ₹499)
          </button>
          <button
            onClick={() => { setActiveFilter('mid'); setViewMode('grid'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'mid' && viewMode === 'grid'
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Detan, Color & Scalp (₹599 – ₹899)
          </button>
          <button
            onClick={() => { setActiveFilter('luxury'); setViewMode('grid'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'luxury' && viewMode === 'grid'
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            VIP Facials & Spa (₹999 – ₹1,499)
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#30452F] text-[#E6B25C]'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Cards</span>
          </button>
          <button
            onClick={() => setViewMode('brochure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'brochure'
                ? 'bg-[#30452F] text-[#E6B25C]'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Brochure View</span>
          </button>
        </div>
      </div>

      {/* 4. Display Content based on View Mode */}
      {viewMode === 'brochure' ? (
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30452F]">
              Authentic ZAYRO Brochure Card
            </h2>
            <p className="text-xs text-stone-600">
              Interactive digital replica of the official 2-page salon price card. Click any item to book instantly.
            </p>
          </div>
          <RateCardBrochure openBooking={openBooking} />
        </section>
      ) : (
        /* Combos Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCombos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between space-y-5 group relative"
            >
              {/* Card Header & Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#30452F] bg-[#E8EFE8] px-3 py-1 rounded-full border border-[#30452F]/20">
                    {combo.shortTitle}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      {combo.saveText}
                    </span>
                    <span className="text-[10px] font-bold text-[#30452F] bg-[#E6B25C]/20 border border-[#E6B25C]/40 px-2 py-0.5 rounded-full">
                      {combo.badge}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#30452F] tracking-tight group-hover:text-[#1A2719] transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {combo.description}
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="p-4 bg-[#F5ECDE] rounded-2xl border border-[#E8DCB8]/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-stone-500 block font-semibold">Special Combo Price</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-sans text-3xl font-bold text-[#30452F]">{combo.price}</span>
                      <span className="text-xs text-stone-400 line-through">{combo.originalPrice}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-stone-500 block font-semibold">Session Length</span>
                    <span className="text-xs font-bold text-[#30452F] flex items-center gap-1 justify-end mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{combo.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Inclusions List */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#30452F]">
                    All Included Treatments:
                  </h4>
                  <ul className="space-y-2">
                    {combo.includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                        <span className="leading-snug">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => openBooking(`${combo.shortTitle}: ${combo.tagline} (${combo.price})`)}
                  className="flex-1 bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve Combo</span>
                </button>
                <a
                  href={getWhatsAppUrl(`Hi ZAYRO, I would like to book ${combo.shortTitle} (${combo.price}) - ${combo.tagline}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-xl shadow-md transition-all flex items-center justify-center"
                  title="Book on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. ZAYRO SALON — MEMBERSHIP PLANS */}
      <MembershipPlans openBooking={openBooking} />

    </div>
  );
}
