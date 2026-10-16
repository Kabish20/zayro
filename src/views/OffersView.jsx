import React from 'react';
import { Sparkles, CheckCircle2, Clock, Calendar, Gift, Star, ShieldCheck } from 'lucide-react';
import { packagesData } from '../data/packagesData';

export default function OffersView({ openBooking }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="bg-[#30452F] rounded-3xl p-8 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6B25C] block">
            Curated Experiences
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Packages & Seasonal Rituals
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Thoughtfully grouped services designed to deliver complete head-to-toe rejuvenation with bundled privileges up to 30% savings.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packagesData.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl p-8 border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#30452F] bg-[#E8EFE8] px-3 py-1 rounded-full">
                  {pkg.category}
                </span>
                <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                  {pkg.saveText}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#30452F] tracking-tight">
                  {pkg.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-[#F5ECDE] rounded-2xl border border-[#E8DCB8]/60 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-500 block font-semibold">Special Package Price</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif text-3xl font-bold text-[#30452F]">{pkg.price}</span>
                    <span className="text-xs text-stone-400 line-through">{pkg.originalPrice}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-stone-500 block font-semibold">Session Length</span>
                  <span className="text-xs font-bold text-[#30452F] flex items-center gap-1 justify-end mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pkg.duration}</span>
                  </span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#30452F]">
                  All Included Treatments:
                </h4>
                <ul className="space-y-2">
                  {pkg.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => openBooking(pkg.title)}
              className="w-full bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Package Slot</span>
            </button>
          </div>
        ))}
      </div>

      {/* ZAYRO Black Card Club / Annual Membership Banner */}
      <div className="bg-[#1A2719] text-white p-8 sm:p-12 rounded-3xl border border-[#E6B25C]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2 text-[#E6B25C]">
            <Gift className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">VIP Membership</span>
          </div>
          <h3 className="font-serif text-3xl font-bold">
            The ZAYRO Black Tier Concierge
          </h3>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Enroll for our annual privileged guest program. Enjoy 20% off all individual services year-round, priority booking with Master Creative Directors, and two complimentary scalp spa therapies.
          </p>
        </div>

        <button
          onClick={() => openBooking('ZAYRO Black VIP Membership')}
          className="bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg shrink-0 transition-transform hover:scale-105"
        >
          Inquire About Black Tier
        </button>
      </div>

    </div>
  );
}
