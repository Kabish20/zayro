import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, ExternalLink } from 'lucide-react';

/**
 * Salon360 Online Booking Widget Modal
 *
 * Embeds the Salon360 hosted booking widget in an iframe.
 * Store: storeId 868 / orgId 555
 *
 * The ZAYRO custom form has been removed — Salon360 handles
 * all booking fields, slot selection, and confirmation natively.
 */

// ─── Salon360 widget configuration ────────────────────────────────────────────
const STORE_ID = 868;
const ORG_ID   = 555;

/**
 * Salon360 hosted widget URL for this store.
 * Format: https://app.salon360app.com/online-booking?storeId=868&orgId=555
 */
const SALON360_WIDGET_URL =
  `https://app.salon360app.com/online-booking?storeId=${STORE_ID}&orgId=${ORG_ID}`;

// ─── Loading states ────────────────────────────────────────────────────────────
const FRAME_STATUS = {
  LOADING: 'LOADING',
  READY:   'READY',
  ERROR:   'ERROR',
};

export default function BookingModal({ isOpen, onClose }) {
  const [frameStatus, setFrameStatus] = useState(FRAME_STATUS.LOADING);
  const iframeRef = useRef(null);

  // Reset to loading state each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setFrameStatus(FRAME_STATUS.LOADING);
    }
  }, [isOpen]);

  // Reload iframe when modal reopens
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      iframeRef.current.src = SALON360_WIDGET_URL;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoad = () => setFrameStatus(FRAME_STATUS.READY);
  const handleError = () => setFrameStatus(FRAME_STATUS.ERROR);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#F5ECDE] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E6B25C]/30 overflow-hidden flex flex-col"
        style={{ height: '90vh', maxHeight: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-[#30452F] text-white px-4 py-3 sm:px-6 sm:py-4 relative flex items-center justify-between border-b border-[#E6B25C]/30 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <img
                src="/images/logo/Transparent Logo.png"
                alt="ZAYRO Men's Grooming"
                className="h-9 sm:h-12 w-auto object-contain drop-shadow"
              />
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E6B25C] bg-[#1A2719] px-2.5 py-0.5 rounded-full border border-[#476346]">
                Private Concierge
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
              Book Your ZAYRO Experience
            </h3>
            <p className="text-[11px] text-[#9BB899] mt-0.5">
              Complimentary hair texture diagnosis &amp; botanical cleanse with every appointment.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2719] hover:bg-[#E6B25C] text-[#F5ECDE] hover:text-[#30452F] flex items-center justify-center transition-colors border border-[#476346] shrink-0 ml-3"
            aria-label="Close booking"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ── Salon360 Booking Widget Body ───────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden bg-white">

          {/* Loading overlay */}
          {frameStatus === FRAME_STATUS.LOADING && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F5ECDE] gap-4">
              <div className="relative">
                <img
                  src="/images/logo/Transparent Logo.png"
                  alt="ZAYRO"
                  className="h-14 w-auto object-contain opacity-80"
                />
              </div>
              <div className="flex items-center gap-2 text-[#30452F]">
                <Loader2 className="w-5 h-5 animate-spin text-[#E6B25C]" />
                <span className="text-sm font-semibold tracking-wide">Loading booking portal…</span>
              </div>
              <p className="text-[11px] text-gray-500 text-center px-6">
                Connecting to Salon360 — your live availability is being loaded.
              </p>
            </div>
          )}

          {/* Error state */}
          {frameStatus === FRAME_STATUS.ERROR && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F5ECDE] gap-4 px-6 text-center">
              <img
                src="/images/logo/Transparent Logo.png"
                alt="ZAYRO"
                className="h-14 w-auto object-contain opacity-70"
              />
              <div>
                <p className="font-semibold text-[#30452F] mb-1">Booking portal temporarily unavailable</p>
                <p className="text-xs text-gray-500 mb-4">
                  Please book directly via WhatsApp or try opening in a new tab.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <a
                  href="https://wa.me/919150022115"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Book via WhatsApp
                </a>
                <a
                  href={SALON360_WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#30452F] hover:bg-[#476346] text-[#E6B25C] font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
              </div>
            </div>
          )}

          {/* Salon360 iframe */}
          <iframe
            ref={iframeRef}
            src={SALON360_WIDGET_URL}
            title="ZAYRO — Salon360 Online Booking"
            allow="payment"
            className="w-full h-full border-0"
            style={{ display: frameStatus === FRAME_STATUS.ERROR ? 'none' : 'block' }}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>

        {/* ── Footer strip ───────────────────────────────────────────────── */}
        <div className="shrink-0 bg-[#30452F]/5 border-t border-[#E6B25C]/20 px-4 py-2 flex items-center justify-between gap-3">
          <p className="text-[10px] text-gray-500">
            Powered by{' '}
            <span className="font-semibold text-[#30452F]">Salon360</span>
            {' '}· Secure booking for ZAYRO KK Nagar Flagship
          </p>
          <a
            href={SALON360_WIDGET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-[#30452F] hover:text-[#E6B25C] font-semibold transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-3 h-3" />
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
