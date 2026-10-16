import React from 'react';
import { X, Clock, Sparkles, Check, ArrowRight, ShieldCheck, Calendar, UserCheck } from 'lucide-react';

export default function ServiceDetailModal({ service, isOpen, onClose, openBooking }) {
  if (!isOpen || !service) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#F5ECDE] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E6B25C]/30 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Area */}
        <div className="relative h-48 sm:h-72 w-full overflow-hidden shrink-0">
          <img 
            src={service.image} 
            alt={service.name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2719] via-[#30452F]/60 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#E6B25C] text-white hover:text-[#30452F] flex items-center justify-center transition-colors border border-white/20"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 text-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block mb-1">
                ZAYRO Signature Protocol
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                {service.name}
              </h2>
              <p className="text-xs text-[#F5ECDE] italic mt-0.5">
                {service.tagline}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#1A2719]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#E6B25C]/40 text-right">
                <span className="text-[10px] uppercase text-[#E6B25C] block">Investment</span>
                <span className="text-lg font-bold text-white">{service.price}</span>
              </div>
              <div className="bg-[#1A2719]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6B25C]/40 flex items-center gap-1.5 text-xs text-[#F5ECDE]">
                <Clock className="w-3.5 h-3.5 text-[#E6B25C]" />
                <span>{service.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#30452F]">
          
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Service Overview
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Key Benefits */}
          {service.benefits && (
            <div className="bg-[#E8EFE8] p-4 rounded-xl border border-[#30452F]/20 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#30452F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#30452F]" />
                <span>Signature Benefits</span>
              </h4>
              <ul className="space-y-1.5">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <Check className="w-3.5 h-3.5 text-[#30452F] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatment Steps Walkthrough */}
          {service.steps && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#30452F] mb-3">
                5-Stage Treatment Protocol
              </h4>
              <div className="space-y-2.5">
                {service.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-[#30452F] text-[#E6B25C] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended For */}
          {service.recommendedFor && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F4EFEB] border border-[#E6B25C]/30 text-xs text-[#30452F]">
              <UserCheck className="w-4 h-4 text-[#C9943B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Recommended For:</span>
                <span className="text-gray-700">{service.recommendedFor}</span>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              * Includes scalp texture diagnosis & post-styling recommendation
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Back to Catalogue
              </button>
              <button
                onClick={() => {
                  onClose();
                  openBooking(service);
                }}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-[#30452F] to-[#1A2719] hover:from-[#476346] hover:to-[#30452F] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md border border-[#E6B25C]/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Service Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
