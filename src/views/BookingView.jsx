import React from 'react';
import { 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Navigation, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { BRAND, CONTACT } from '@/constants/brand';

export default function BookingView({ preselectedService, onBack }) {
  const serviceText = typeof preselectedService === 'string' 
    ? preselectedService 
    : (preselectedService?.name ? `${preselectedService.name} (${preselectedService.price || ''})` : '');

  const whatsAppMessage = serviceText
    ? `Hello ZAYRO Salon Concierge, I would like to book an appointment for: ${serviceText}.`
    : 'Hello ZAYRO Salon Concierge, I would like to book an appointment.';

  const whatsAppUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="min-h-screen bg-[#112015] text-[#F5ECDE] pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Navigation Back button if onBack provided */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6B25C] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Main Concierge Booking Card (No Form) */}
        <div className="bg-[#182f20] border-2 border-[#E6B25C]/40 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6B25C]/15 border border-[#E6B25C]/40 text-[#E6B25C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Salon Booking</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Book Your Appointment
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
              Skip the forms. Book your grooming slot instantly by connecting directly with our salon concierge at the KK Nagar Flagship.
            </p>
          </div>

          {/* Selected Service Callout (if navigated with a service) */}
          {serviceText && (
            <div className="p-3.5 rounded-2xl bg-black/30 border border-[#E6B25C]/30 text-xs sm:text-sm text-white flex items-center justify-between">
              <span className="text-stone-400">Selected Treatment:</span>
              <span className="font-bold text-[#E6B25C]">{serviceText}</span>
            </div>
          )}

          {/* Direct Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary Action: Instant WhatsApp */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Book Instantly on WhatsApp ({CONTACT.phoneDisplay})</span>
            </a>

            {/* Secondary Action: Direct Phone Call */}
            <a
              href={CONTACT.telLink}
              className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 border border-white/15"
            >
              <Phone className="w-4 h-4 text-[#E6B25C]" />
              <span>Call Salon Desk: {CONTACT.phoneDisplay}</span>
            </a>
          </div>

          {/* Key Salon Details Grid */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs text-stone-300">
            <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#E6B25C] font-bold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Operating Hours</span>
              </div>
              <p className="text-white font-medium">
                {CONTACT.hours}
              </p>
              <p className="text-[11px] text-stone-400">
                Walk-ins & reservations welcome daily
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#E6B25C] font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Flagship Lounge</span>
              </div>
              <p className="text-white font-medium line-clamp-1">
                Opp. KK Nagar Bus Terminus
              </p>
              <a
                href="https://maps.google.com/?q=Door+No+115+Rajaram+Rd+KK+Nagar+Tiruchirappalli+Tamil+Nadu+620021"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#E6B25C] hover:underline flex items-center gap-1 font-semibold"
              >
                <Navigation className="w-3 h-3" />
                <span>Open Google Maps</span>
              </a>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-2 text-center">
            <div className="inline-flex items-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-[#E6B25C]" />
              <span>Confirmed Within 5 Minutes • No Advance Payment Required</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
