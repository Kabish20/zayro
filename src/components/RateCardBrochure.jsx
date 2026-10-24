import React, { useState } from 'react';
import { Calendar, MessageSquare, Sparkles, CheckCircle2, ChevronRight, Download, Share2 } from 'lucide-react';
import { rateCardServices, comboOffers } from '../data/packagesData';

export default function RateCardBrochure({ openBooking }) {
  const [activeTab, setActiveTab] = useState('both'); // 'both', 'page1', 'page2'

  return (
    <div className="w-full space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('both')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'both'
              ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          View Full Brochure (Both Pages)
        </button>
        <button
          onClick={() => setActiveTab('page1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'page1'
              ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Page 1: Standard Rate Card (From ₹50)
        </button>
        <button
          onClick={() => setActiveTab('page2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'page2'
              ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Page 2: 10 Combo Offers (From ₹299)
        </button>
      </div>

      {/* Brochure Display Container */}
      <div className={`grid gap-8 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
        
        {/* PAGE 1: Standard Rate Card */}
        {(activeTab === 'both' || activeTab === 'page1') && (
          <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-[#1b3424] via-[#1f3a29] to-[#122318] shadow-2xl border-4 border-[#C9943B]/80 text-[#F5ECDE] overflow-hidden group">
            {/* Fine Inner Gold Border */}
            <div className="border border-[#E6B25C]/50 rounded-2xl p-5 sm:p-8 flex flex-col justify-between min-h-[640px] relative z-10 backdrop-blur-xs">
              
              {/* Background luxury topographic subtle lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E6B25C_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Page 1 Header */}
              <div className="text-center space-y-2 pt-2 pb-6 border-b border-[#E6B25C]/30">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#E6B25C] block">
                  Official Rate Card
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                  ZAYRO
                </h2>
                <p className="text-[11px] sm:text-xs tracking-[0.25em] text-[#D8E6D7] uppercase font-semibold">
                  MEN'S GROOMING
                </p>
                <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#E6B25C]/15 border border-[#E6B25C]/40">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#E6B25C] font-semibold uppercase">
                    LUXURY MADE AFFORDABLE
                  </span>
                </div>
              </div>

              {/* Services List with Leader Lines */}
              <div className="py-6 space-y-4 sm:space-y-5">
                {rateCardServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => openBooking && openBooking(service.name + ` (${service.price})`)}
                    className="group/item flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200"
                    title={`Click to book ${service.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E6B25C] group-hover/item:scale-150 transition-transform"></span>
                      <span className="font-serif text-base sm:text-lg font-semibold text-white tracking-wide group-hover/item:text-[#E6B25C] transition-colors">
                        {service.name}
                      </span>
                    </div>

                    {/* Dotted leader line */}
                    <div className="flex-1 border-b border-dotted border-[#E6B25C]/40 mx-2 self-end mb-1.5"></div>

                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg sm:text-xl font-bold text-[#E6B25C] tracking-tight whitespace-nowrap">
                        {service.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openBooking && openBooking(service.name + ` (${service.price})`);
                        }}
                        className="opacity-0 group-hover/item:opacity-100 bg-[#E6B25C] text-[#1A2719] text-[10px] font-bold px-2 py-0.5 rounded transition-all"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Page 1 Footer */}
              <div className="pt-4 border-t border-[#E6B25C]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#C1D6BF]">
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.instagram.com/zayro.coming_soon?srtk=YWpzaXZpNWtiZGlr&utm_source=qr" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#E6B25C] hover:underline"
                  >
                    📸 @zayro.coming_soon
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E6B25C] font-medium">🌐 www.zayrosalon.com</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PAGE 2: Combo Offers */}
        {(activeTab === 'both' || activeTab === 'page2') && (
          <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-[#1b3424] via-[#1f3a29] to-[#122318] shadow-2xl border-4 border-[#C9943B]/80 text-[#F5ECDE] overflow-hidden group">
            {/* Fine Inner Gold Border */}
            <div className="border border-[#E6B25C]/50 rounded-2xl p-5 sm:p-8 flex flex-col justify-between min-h-[640px] relative z-10 backdrop-blur-xs">
              
              {/* Background luxury topographic subtle lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E6B25C_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Page 2 Header */}
              <div className="text-center space-y-2 pt-2 pb-5 border-b border-[#E6B25C]/30">
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                  ZAYRO
                </h2>
                <p className="text-[11px] sm:text-xs tracking-[0.25em] text-[#D8E6D7] uppercase font-semibold">
                  MEN'S GROOMING
                </p>
                <p className="text-[10px] tracking-[0.25em] text-[#E6B25C] font-semibold uppercase">
                  LUXURY MADE AFFORDABLE
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-[#E6B25C] text-[#1A2719] font-serif font-bold text-sm tracking-wider uppercase shadow-md">
                    COMBO OFFERS
                  </span>
                </div>
              </div>

              {/* Combo Offers List */}
              <div className="py-4 space-y-3 sm:space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
                {comboOffers.map((combo) => (
                  <div
                    key={combo.id}
                    onClick={() => openBooking && openBooking(`${combo.shortTitle}: ${combo.tagline} (${combo.price})`)}
                    className="group/combo p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#E6B25C]/20 hover:border-[#E6B25C]/60 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3"
                    title={`Click to reserve ${combo.shortTitle}`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#E6B25C] uppercase tracking-wider shrink-0">
                          {combo.shortTitle.toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold text-[#30452F] bg-[#E6B25C] px-1.5 py-0.2 rounded-full">
                          {combo.badge}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#E8EFE8] leading-snug line-clamp-2">
                        {combo.tagline}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-center pl-2">
                      <span className="font-serif text-base sm:text-lg font-bold text-[#E6B25C] whitespace-nowrap">
                        {combo.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openBooking && openBooking(`${combo.shortTitle} (${combo.price})`);
                        }}
                        className="text-[10px] font-bold text-[#30452F] bg-[#E6B25C] hover:bg-white px-2.5 py-0.5 rounded-lg transition-colors mt-1"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Page 2 Footer */}
              <div className="pt-4 border-t border-[#E6B25C]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#C1D6BF]">
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.instagram.com/zayro.coming_soon?srtk=YWpzaXZpNWtiZGlr&utm_source=qr" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#E6B25C] hover:underline"
                  >
                    📸 @zayro.coming_soon
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E6B25C] font-medium">🌐 www.zayrosalon.com</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Instant Action Bar */}
      <div className="p-4 sm:p-6 bg-white rounded-2xl border border-[#E8DCB8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#30452F] text-[#E6B25C] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#30452F]">
              Need a Custom Treatment or Immediate Slot?
            </h4>
            <p className="text-xs text-stone-600">
              WhatsApp our concierge desk for instant booking or personalized combination quotes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="https://wa.me/919150022115?text=Hi%20ZAYRO,%20I%20would%20like%20to%20book%20a%20slot%20from%20your%20Rate%20Card%20/%20Combo%20Menu."
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Book on WhatsApp</span>
          </a>
          <button
            onClick={() => openBooking && openBooking('ZAYRO Combo Special')}
            className="flex-1 sm:flex-none bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Online</span>
          </button>
        </div>
      </div>
    </div>
  );
}
