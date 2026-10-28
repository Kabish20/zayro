import React from 'react';
import { X, Sparkles } from 'lucide-react';
import RateCardBrochure from '../sections/RateCardBrochure';

export default function RateCardModal({ isOpen, onClose, openBooking }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-[#F5ECDE] w-full max-w-5xl rounded-3xl shadow-2xl border-2 border-[#E6B25C]/40 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-[#1A2719] text-white flex items-center justify-between border-b border-[#30452F]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#30452F] text-[#E6B25C] border border-[#E6B25C]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                ZAYRO Official Price Card & Combo Offers
              </h3>
              <p className="text-xs text-[#9BB899]">
                Official Menu Brochure — Luxury Made Affordable
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          <RateCardBrochure 
            openBooking={(service) => {
              onClose();
              openBooking?.(service);
            }} 
          />
        </div>
      </div>
    </div>
  );
}
