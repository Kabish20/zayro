import React from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { getWhatsAppUrl } from '@/constants/brand';

/**
 * FloatingActions renders fixed screen-corner controls:
 * 1. Direct WhatsApp concierge button
 * 2. Back-to-top smooth scroll trigger (visible after scrolling past threshold)
 */
export default function FloatingActions() {
  const { isScrolled, scrollToTop } = useScrollPosition(400);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3">
      {/* Floating WhatsApp Quick Concierge */}
      <a
        href={getWhatsAppUrl('Hello ZAYRO Salon Concierge, I would like to inquire about an appointment or franchise.')}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 p-2.5 sm:p-3 group border-2 border-white/50"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="sr-only">WhatsApp</span>
      </a>

      {/* Back to top button */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#30452F] text-[#E6B25C] hover:bg-[#476346] hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 border border-[#E6B25C]/30 animate-fade-in"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

