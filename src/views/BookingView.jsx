import React, { useEffect } from 'react';

const SALON360_URL =
  import.meta.env.VITE_SALON360_BOOKING_URL ||
  'https://api.salon360app.com/api/online-booking/v1/external/booking?storeId=868&orgId=555';

export default function BookingView() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = SALON360_URL;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1F2E1E] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#273826] border border-[#E6B25C]/30 rounded-3xl p-8 shadow-2xl">
        <h2 className="font-serif text-2xl font-bold mb-3 text-[#E6B25C]">Connecting to Salon360…</h2>
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          Redirecting you directly to the Salon360 Online Booking API.
        </p>
        <a
          href={SALON360_URL}
          className="inline-block w-full py-3.5 px-6 bg-gradient-to-r from-[#E6B25C] to-[#d49e47] text-[#1F2E1E] font-bold text-sm rounded-xl shadow-lg hover:brightness-105 transition-all"
        >
          Click here if you are not redirected
        </a>
      </div>
    </div>
  );
}
