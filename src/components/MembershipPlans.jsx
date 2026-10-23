import React, { useState } from 'react';
import { Check, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { membershipPlans } from '../data/packagesData';

export default function MembershipPlans({ openBooking }) {
  const [activePlanId, setActivePlanId] = useState(null);

  return (
    <section id="membership-plans" className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#30452F]/20 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
            Exclusive Lounge Access
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#30452F] tracking-tight">
            ZAYRO SALON — MEMBERSHIP PLANS
          </h2>
        </div>
        <p className="text-xs text-stone-600 sm:text-right max-w-sm">
          Guaranteed priority bookings, complimentary services, and year-round grooming privileges. Move cursor over any plan to reveal full inclusions.
        </p>
      </div>

      {/* 4 Membership Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipPlans.map((plan) => {
          const isDark = plan.theme === 'dark-green' || plan.theme === 'deep-emerald';
          const isPopupOpen = activePlanId === plan.id;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setActivePlanId(plan.id)}
              onMouseLeave={() => setActivePlanId(null)}
              onClick={() => setActivePlanId(isPopupOpen ? null : plan.id)}
              className={`group relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between min-h-[430px] sm:min-h-[450px] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer overflow-hidden ${
                plan.bgColor
              } ${plan.borderColor} ${isDark ? 'text-white' : 'text-stone-900'}`}
            >
              {/* DEFAULT CARD CONTENT: Keep Price Alone + Plan Identity */}
              <div className={`h-full flex flex-col justify-between transition-all duration-200 ${
                isPopupOpen ? 'invisible opacity-0' : 'group-hover:invisible group-hover:opacity-0 visible opacity-100'
              }`}>
                {/* Header: Title + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`font-sans font-bold text-base sm:text-lg tracking-wider uppercase ${plan.titleColor}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? 'text-stone-300' : 'text-stone-500'}`}>
                      {plan.duration}
                    </p>
                  </div>

                  {/* Metallic Badge from Image */}
                  <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {plan.badgeType === 'diamond' ? (
                      <div className="w-12 h-12 rounded-2xl bg-[#0F1B12] border-2 border-[#E6B25C] flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-[#E6B25C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                          <path d="M11 3l-3 6 4 12" />
                          <path d="M13 3l3 6-4 12" />
                          <path d="M2 9h20" />
                        </svg>
                      </div>
                    ) : plan.badgeType === 'gold' ? (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E6B25C] via-[#F3CF8A] to-[#B38029] shadow-md border border-[#F3CF8A]/60 flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full bg-white/30 backdrop-blur-xs"></span>
                      </div>
                    ) : plan.badgeType === 'platinum' ? (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-200 via-gray-100 to-slate-400 shadow-md border border-slate-300 flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full bg-black/10 backdrop-blur-xs"></span>
                      </div>
                    ) : (
                      /* Silver Badge */
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400 shadow-md border border-gray-300 flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full bg-white/40 backdrop-blur-xs"></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* THE PRICE ALONE (Centered with generous breathing space) */}
                <div className="py-6 my-auto text-left">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-stone-300' : 'text-stone-500'}`}>
                    Membership Plan Fee
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-sans text-4xl sm:text-5xl font-black tracking-tight ${plan.priceColor}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-stone-300' : 'text-stone-500'}`}>
                      / {plan.duration}
                    </span>
                  </div>

                  {/* Interactive Cursor Trigger Cue */}
                  <div className="pt-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6B25C]/40 text-xs font-bold tracking-wide shadow-xs transition-colors ${
                      isDark 
                        ? 'bg-white/10 text-[#E6B25C] group-hover:bg-[#E6B25C] group-hover:text-[#1A2719]' 
                        : 'bg-[#30452F]/10 text-[#30452F] group-hover:bg-[#30452F] group-hover:text-[#E6B25C]'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#E6B25C]" />
                      <span>Move cursor for inclusions</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Default Action Buttons */}
                <div className="pt-4 border-t border-stone-200/50 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openBooking && openBooking(`${plan.name} (${plan.price})`);
                    }}
                    className={`flex-1 font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5 ${
                      isDark
                        ? 'bg-[#E6B25C] hover:bg-white text-[#152619]'
                        : 'bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C]'
                    }`}
                  >
                    <span>Get Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/919150022115?text=${encodeURIComponent(`Hi ZAYRO Salon, I would like to purchase the ${plan.name} (${plan.price} - ${plan.duration}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white transition-all shadow-sm flex items-center justify-center shrink-0"
                    title="Inquire via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* POP-UP DETAILS UI (Pops up when cursor/mouse moves over the card) */}
              <div 
                style={{ backgroundColor: '#132317' }}
                className={`absolute inset-0 z-30 rounded-2xl p-5 sm:p-6 text-white border-2 border-[#E6B25C] shadow-2xl flex flex-col justify-between transition-all duration-300 ease-out ${
                  isPopupOpen 
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible' 
                    : 'opacity-0 translate-y-2 scale-95 pointer-events-none invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto group-hover:visible'
                }`}
              >
                <div className="space-y-3">
                  {/* Pop-up Header */}
                  <div className="flex items-center justify-between border-b border-[#E6B25C]/30 pb-2.5">
                    <div>
                      <span className="text-[9.5px] uppercase font-extrabold tracking-widest text-[#E6B25C] block">
                        Privilege Inclusions
                      </span>
                      <h4 className="font-sans font-bold text-base text-white uppercase tracking-wider">
                        {plan.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-xl font-black text-[#E6B25C]">
                        {plan.price}
                      </span>
                      <span className="block text-[9px] text-stone-300">
                        {plan.duration}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Inclusions List */}
                  <div className="space-y-2 py-1">
                    {plan.includes.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-[#E6B25C] shrink-0 mt-0.5" />
                        <span className="text-[#F5ECDE] font-medium leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tagline Quote */}
                  <p className="text-[11px] italic text-[#E6B25C]/90 pt-1 border-t border-white/10">
                    "{plan.tagline}"
                  </p>
                </div>

                {/* Pop-up Action Buttons (Properly contained inside the card) */}
                <div className="pt-3 border-t border-[#E6B25C]/30 flex items-center gap-2 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openBooking && openBooking(`${plan.name} (${plan.price})`);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#152418] font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Reserve Privilege</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/919150022115?text=${encodeURIComponent(`Hi ZAYRO Salon, I would like to purchase the ${plan.name} (${plan.price} - ${plan.duration}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white transition-all shadow-md flex items-center justify-center shrink-0"
                    title="Inquire via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
