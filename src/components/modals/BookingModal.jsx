import { useEffect } from 'react';

/**
 * BookingModal Redirector
 *
 * Booking has been transitioned to the dedicated full-page booking experience (/booking).
 * If this modal is ever triggered, it safely closes and routes to /booking.
 */
export default function BookingModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      onClose?.();
      if (typeof window !== 'undefined') {
        const targetUrl = '/booking';
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ view: 'booking' }, '', targetUrl);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }
    }
  }, [isOpen, onClose]);

  return null;
}
