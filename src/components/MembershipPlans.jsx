import React from 'react';
import { Check, ShieldCheck, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { membershipPlans } from '../data/packagesData';

export default function MembershipPlans({ openBooking }) {
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
          Guaranteed priority bookings, complimentary services, and year-round grooming privileges.
        </p>
      </div>

      {/* 4 Membership Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipPlans.map((plan) => {
          const isDark = plan.theme === 'dark-green' || plan.theme === 'deep-emerald';

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                plan.bgColor
              } ${plan.borderColor} ${isDark ? 'text-white' : 'text-stone-900'}`}
            >
              <div className="space-y-4">
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
                  <div className="shrink-0">
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

                {/* Price Display */}
                <div className="pt-1">
                  <span className={`font-sans text-3xl sm:text-4xl font-bold tracking-tight ${plan.priceColor}`}>
                    {plan.price}
                  </span>
                </div>

                {/* Divider Line */}
                <div className={`border-b ${plan.dividerColor}`}></div>

                {/* Benefits List */}
                <ul className="space-y-2.5 pt-1 text-xs sm:text-sm">
                  {plan.includes.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isDark ? 'bg-[#E6B25C]' : 'bg-stone-700'}`}></span>
                      <span className={`leading-relaxed ${plan.textColor}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Quote & Action */}
              <div className="space-y-3 pt-3">
                <p className={`text-xs italic ${plan.quoteColor}`}>
                  {plan.tagline}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openBooking && openBooking(`${plan.name} (${plan.price})`)}
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
                    className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white transition-all shadow-sm flex items-center justify-center"
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
