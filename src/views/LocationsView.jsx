import React from 'react';
import { MapPin, Phone, Clock, Navigation, Check, Calendar, ArrowRight } from 'lucide-react';
import { salonLocations } from '@/data';
import { FRANCHISE_CONTACT } from '@/constants';

export default function LocationsView({ openBooking }) {
  const flagship = salonLocations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="bg-[#30452F] rounded-3xl p-8 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
            Flagship Grooming Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Salon Location & Directions
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Experience world-class men's grooming, acoustic serenity, and bespoke barbering rituals at our premier lounge in KK Nagar, Tiruchirappalli.
          </p>
        </div>
      </div>

      {/* Flagship Location Master Card */}
      <div className="bg-white rounded-3xl border border-[#E8DCB8] shadow-luxury overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Details Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] bg-[#30452F] px-3.5 py-1 rounded-full">
                  Primary Flagship
                </span>
                <span className="text-[11px] font-semibold text-[#967456] bg-[#F5ECDE] px-3 py-1 rounded-full border border-[#E8DCB8]">
                  Tiruchirappalli, Tamil Nadu
                </span>
              </div>

              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
                  {flagship.name}
                </h2>
                <span className="text-xs font-semibold text-[#967456] block mt-1">
                  {flagship.type} • {flagship.stations}
                </span>
              </div>

              {/* Exact Address Box */}
              <div className="bg-[#FBF7F0] p-6 rounded-2xl border border-[#E8DCB8] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#30452F] text-[#E6B25C] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#967456] block">
                      Full Postal Address
                    </span>
                    <p className="font-sans text-base sm:text-lg font-bold text-[#30452F] leading-snug">
                      {flagship.address}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DCB8]/60 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-stone-700">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#30452F] shrink-0" />
                    <span><strong>Operating Hours:</strong> {flagship.hours}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#30452F] shrink-0" />
                    <span><strong>Contact Number:</strong> {flagship.phone}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#30452F] block mb-3">
                  Salon Facilities & Guest Privileges:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {flagship.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700 bg-[#F5ECDE]/60 px-3 py-2 rounded-xl border border-[#E8DCB8]/60">
                      <Check className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <button
                onClick={() => openBooking(flagship.name)}
                className="w-full sm:w-auto bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
              </button>

              <a
                href={flagship.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white hover:bg-[#F5ECDE] text-[#30452F] border border-[#30452F]/40 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#E6B25C]" />
                <span>Open Google Maps Directions</span>
              </a>

              <a
                href={`tel:${flagship.whatsapp}`}
                className="w-full sm:w-auto bg-white hover:bg-[#F5ECDE] text-stone-700 border border-gray-300 font-semibold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#30452F]" />
                <span>Call Salon Desk</span>
              </a>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 relative min-h-[380px] bg-[#1A2719] overflow-hidden">
            <img
              src="/images/salon/interior.jpg"
              alt="ZAYRO Flagship Salon Interior Tiruchirappalli"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
            
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#30452F] border border-[#E6B25C]/40 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open 7 Days: 10:00 AM – 9:30 PM</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
              <span className="inline-block bg-[#E6B25C] text-[#1A2719] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                Key Landmark
              </span>
              <h3 className="font-serif text-2xl font-bold leading-tight">
                Opposite KK Nagar Bus Terminus
              </h3>
              <p className="text-xs text-[#F5ECDE]/90 leading-relaxed">
                Directly on Rajaram Road, opposite the bus terminus with easy access and dedicated parking facilities.
              </p>
              <div className="pt-2">
                <a
                  href={flagship.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E6B25C] font-semibold underline underline-offset-4 hover:text-white transition-colors"
                >
                  <span>Launch Google Navigation Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Expansion Info Banner */}
      <div className="bg-[#F5ECDE] p-8 rounded-3xl border border-[#E8DCB8] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#30452F]">
            Franchise Expansion
          </span>
          <h4 className="font-serif text-xl font-bold text-[#30452F]">
            Bringing ZAYRO to More Cities Across South India
          </h4>
          <p className="text-xs text-stone-600">
            Partner applications are currently open for franchise lounges in Chennai, Coimbatore, Madurai, and Bengaluru.
          </p>
        </div>
        <a
          href={FRANCHISE_CONTACT.telLink}
          className="shrink-0 bg-[#30452F] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-sm"
        >
          Franchise Inquiries: {FRANCHISE_CONTACT.phoneDisplay}
        </a>
      </div>

    </div>
  );
}
