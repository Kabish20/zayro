import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Salon360Booking from '@/components/booking/Salon360Booking';

export default function BookingView({ preselectedService, onBack }) {
  const serviceText = typeof preselectedService === 'string' 
    ? preselectedService 
    : (preselectedService?.name ? `${preselectedService.name} (${preselectedService.price || ''})` : '');

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

        {/* Selected Service Callout if arrived with preselected service */}
        {serviceText && (
          <div className="p-4 rounded-2xl bg-[#182f20] border border-[#E6B25C]/40 text-xs sm:text-sm text-white flex items-center justify-between shadow-lg">
            <span className="text-stone-400">Selected Treatment:</span>
            <span className="font-bold text-[#E6B25C]">{serviceText}</span>
          </div>
        )}

        {/* Salon360 Direct Online Appointment System */}
        <Salon360Booking preselectedService={preselectedService} />

      </div>
    </div>
  );
}
