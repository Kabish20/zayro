import React from 'react';
import { Scissors, ShieldCheck, Award, Heart } from 'lucide-react';
import { AnimatedCounter } from '@/components';

export default function AboutView({ openBooking, openFranchiseModal }) {
  return (
    <div className="space-y-16 py-12">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#30452F] rounded-2xl sm:rounded-3xl p-6 sm:p-14 text-white border border-[#E6B25C]/30 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
              Our Philosophy & Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              The Story Behind ZAYRO
            </h1>
            <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
              Founded on the belief that men's grooming is an art form of personal confidence and rejuvenation, ZAYRO Men's Grooming Lounge combines architectural haircutting, master razor fades, and bespoke beard craftsmanship with a tranquil luxury environment.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Manifesto Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
              Architectural Men's Grooming
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
              Crafted for Your Face, <br />
              Engineered for Your Style
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              For decades, mainstream barbershops and salons treated men with rushed 10-minute haircuts, harsh chemical dyes, and substandard products. ZAYRO was created to elevate men's grooming into a genuine luxury ritual.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Our creative team developed our proprietary <span className="font-bold text-[#30452F]">South Asian Barbering & Grooming Architecture</span> — specialized sectioning, clipper-over-comb tapering, and Ayurvedic botanical beard oils that work harmoniously with coarse cuticles and natural beard growth patterns.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#E8DCB8]">
                <span className="font-sans text-2xl font-bold text-[#30452F]">
                  <AnimatedCounter value="100%" duration={1600} />
                </span>
                <p className="text-[11px] text-gray-500 mt-1">Sulfate-Free & Ammonia-Free Grooming</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E8DCB8]">
                <span className="font-sans text-2xl font-bold text-[#30452F]">
                  <AnimatedCounter value="250+" duration={1800} />
                </span>
                <p className="text-[11px] text-gray-500 mt-1">Barber Academy Masterclass Hours</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-luxury border border-[#E8DCB8]">
            <img
              src="/images/gallery/indian_haircut.jpg"
              alt="ZAYRO Master Barbers at Work"
              className="w-full h-[440px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values / 4 Pillars */}
      <section className="bg-[#F5ECDE] py-16 border-y border-[#E8DCB8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
              Guiding Principles
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#30452F]">
              The ZAYRO Pillars of Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE8] text-[#30452F] flex items-center justify-center">
                <Scissors className="w-5 h-5 text-[#30452F]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#30452F]">Bespoke Consultation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We never begin with scissors in hand. We begin with a mirror dialogue, understanding your morning routine, bone structure, and style ambition.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE8] text-[#30452F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#30452F]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#30452F]">Hospital-Grade Hygiene</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                UV-C sterilization chambers, single-use biodegradable gowns, and medical-grade sanitization between every client interaction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE8] text-[#30452F] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#30452F]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#30452F]">Global Certification</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Certified across Toni&Guy, Vidal Sassoon, and Japanese head spa academies, our team leads seasonal hair collections.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE8] text-[#30452F] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#30452F]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#30452F]">Sensory Sanctuary</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Acoustic sound dampening, sage green velvet seating, custom aromatherapy, and artisanal matcha teas create an oasis of calm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academy & Franchise Expansion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A2719] rounded-3xl p-8 sm:p-12 text-white border border-[#E6B25C]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
              ZAYRO Academy & Franchise
            </span>
            <h3 className="font-serif text-3xl font-bold">
              Empowering the Next Generation of Salon Leaders
            </h3>
            <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
              Our central academy trains over 300 artists annually while supporting franchise partners with certified teams, streamlined supply chains, and strong business returns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => openBooking()}
              className="bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#30452F] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-transform hover:scale-105"
            >
              Book an Experience
            </button>
            <button
              onClick={openFranchiseModal}
              className="px-6 py-3.5 rounded-xl border border-[#E6B25C]/40 text-xs font-bold text-[#E6B25C] hover:bg-[#30452F] transition-colors"
            >
              Partner as Franchisee
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
