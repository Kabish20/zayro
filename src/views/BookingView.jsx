import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Scissors, ArrowRight, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SALON360_STORE_ID = 868;
const SALON360_ORG_ID = 555;

export default function BookingView({ onBack }) {
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const salon360BookingUrl =
    import.meta.env.VITE_SALON360_BOOKING_URL ||
    `https://api.salon360app.com/api/online-booking/v1/external/booking?storeId=${SALON360_STORE_ID}&orgId=${SALON360_ORG_ID}`;

  const handleLaunchSalon360 = () => {
    setRedirecting(true);
    window.location.href = salon360BookingUrl;
  };

  useEffect(() => {
    // Auto-redirect timer to connect seamlessly with Salon360
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLaunchSalon360();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1F2E1E] text-white pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#273826] border border-[#E6B25C]/25 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E6B25C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-[#E6B25C]/10 border border-[#E6B25C]/30 flex items-center justify-center mx-auto mb-6 text-[#E6B25C]">
          <Scissors className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E6B25C]/15 text-[#E6B25C] mb-4">
          <ShieldCheck className="w-4 h-4" /> Official Salon360 Online Booking
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#E6B25C] mb-3">
          ZAYRO Men's Grooming Lounge
        </h1>
        <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
          KK Nagar Flagship • Store #{SALON360_STORE_ID}
          <br />
          Connecting directly to our real-time Salon360 scheduling engine for appointment booking.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 text-left mb-8 bg-[#1F2E1E]/60 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-[#E6B25C] shrink-0" />
            <span>Live Stylist Availability</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-[#E6B25C] shrink-0" />
            <span>Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-[#E6B25C] shrink-0" />
            <span>Zero Booking Fees</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-[#E6B25C] shrink-0" />
            <span>Direct Store Sync</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLaunchSalon360}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#E6B25C] to-[#d49e47] text-[#1F2E1E] font-bold text-base rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 group"
        >
          <span>Continue to Salon360 Online Booking</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
          <span>Redirecting automatically in {countdown}s...</span>
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 text-xs text-gray-400 hover:text-white transition-colors underline"
          >
            ← Back to Zayro Website
          </button>
        )}
      </div>
    </div>
  );
}
