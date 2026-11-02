import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Navigation, Share2, Check, 
  MessageSquare, Download, Eye, X, PhoneCall, ExternalLink,
  ArrowLeft, Copy
} from 'lucide-react';
import { VIEWS } from '@/constants/navigation';

const EVENT_DETAILS = {
  title: "Grand Opening Invitation • ZAYRO Men's Grooming Lounge KK Nagar, Trichy",
  time: "6:30 PM",
  dateNum: "05",
  dateMonthYear: "NOV, 2025",
  dayOfWeek: "THURSDAY",
  fullDate: "Thursday, 05 November 2025",
  addressLines: [
    "No. 115, Rajaram Road,",
    "Near KK Nagar Bus Terminus,",
    "Opp. Sumaiya Multi Shoping,",
    "KK Nagar, Trichy - 620021"
  ],
  fullAddressText: "No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaiya Multi Shoping, KK Nagar, Trichy - 620021",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=No.+115,+Rajaram+Road,+Near+KK+Nagar+Bus+Terminus,+Opp.+Sumaiya+Multi+Shoping,+KK+Nagar,+Trichy+-+620021",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=No.+115,+Rajaram+Road,+Near+KK+Nagar+Bus+Terminus,+Opp.+Sumaiya+Multi+Shoping,+KK+Nagar,+Trichy+-+620021",
  phone: "+91 91500 22115",
  whatsappRaw: "919150022115",
  founderTitle: "BRAND FOUNDER",
  founderName: "MOHAMED MUBARAK A | ZAYRO",
  franchiseLabel: "For Franchise: 72 002 79 002",
  franchisePhoneDisplay: "72 002 79 002",
  franchiseTelLink: "tel:+917200279002",
  cardImageUrl: "/images/kknagar-invite.jpg",
  pageUrl: "https://zayrosalon.com/kknagarinvite"
};

export default function KkNagarInviteView({ setCurrentView }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showFullPoster, setShowFullPoster] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = EVENT_DETAILS.title;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const setMetaTag = (selector, attribute, value) => {
      let el = document.querySelector(selector);
      const prevValue = el ? el.getAttribute(attribute) : null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) el.setAttribute('property', prop);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
      return () => {
        if (prevValue !== null) {
          el.setAttribute(attribute, prevValue);
        } else if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      };
    };

    const cleanupMeta = [
      setMetaTag('meta[name="description"]', 'content', 'A new grooming experience is arriving in Trichy. Cordially inviting you to the Grand Opening of ZAYRO KK Nagar on Thursday, 05 NOV 2025 at 6:30 PM. Tap to view invitation & GPS directions.'),
      setMetaTag('meta[property="og:title"]', 'content', EVENT_DETAILS.title),
      setMetaTag('meta[property="og:description"]', 'content', "A new grooming experience is arriving in Trichy. Thursday, 05 NOV 2025 at 6:30 PM. Venue: No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaiya Multi Shoping. Tap to view invitation & GPS directions."),
      setMetaTag('meta[property="og:image"]', 'content', "https://zayrosalon.com/images/kknagar-invite-og.jpg"),
      setMetaTag('meta[property="og:url"]', 'content', EVENT_DETAILS.pageUrl),
      setMetaTag('meta[name="twitter:title"]', 'content', EVENT_DETAILS.title),
      setMetaTag('meta[name="twitter:description"]', 'content', "A new grooming experience is arriving in Trichy. Thursday, 05 NOV 2025 at 6:30 PM. Venue: No. 115, Rajaram Road, Near KK Nagar Bus Terminus. Tap for directions & RSVP."),
      setMetaTag('meta[name="twitter:image"]', 'content', "https://zayrosalon.com/images/kknagar-invite-og.jpg"),
    ];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowFullPoster(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.title = prevTitle;
      window.removeEventListener('keydown', handleKeyDown);
      cleanupMeta.forEach((cleanup) => cleanup && cleanup());
    };
  }, []);

  const handleCopyAddress = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(EVENT_DETAILS.fullAddressText);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: EVENT_DETAILS.title,
      text: "A new grooming experience is arriving in Trichy. You are cordially invited to the Grand Opening of ZAYRO Men's Grooming Lounge at KK Nagar on Thursday, 05 NOV 2025 at 6:30 PM. 🌿✂️",
      url: EVENT_DETAILS.pageUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        copyPageLink();
      }
    } else {
      copyPageLink();
    }
  };

  const copyPageLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(EVENT_DETAILS.pageUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Google Calendar URL (05 NOV 2025 18:30 IST = 13:00 UTC)
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "ZAYRO KK Nagar Grand Opening Ceremony"
  )}&dates=20251105T130000Z/20251105T160000Z&details=${encodeURIComponent(
    `A new grooming experience is arriving in Trichy. Your presence will make our beginning even more special.\n\n` +
    `Venue: ${EVENT_DETAILS.fullAddressText}\n` +
    `Google Maps: ${EVENT_DETAILS.mapsUrl}\n` +
    `Brand Founder: ${EVENT_DETAILS.founderName}\n` +
    `For Franchise: ${EVENT_DETAILS.franchisePhoneDisplay}\n` +
    `Concierge Hotline: ${EVENT_DETAILS.phone}\n` +
    `Website: ${EVENT_DETAILS.pageUrl}`
  )}&location=${encodeURIComponent(EVENT_DETAILS.fullAddressText)}`;

  const whatsappRsvpUrl = `https://wa.me/${EVENT_DETAILS.whatsappRaw}?text=${encodeURIComponent(
    "Hello ZAYRO Team, I received the Grand Opening Invitation for the KK Nagar Flagship Lounge on Thursday, 05 Nov 2025 at 6:30 PM. I would like to RSVP and confirm my attendance! 🌿✨"
  )}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🌿 *Grand Opening Invitation — ZAYRO Men's Grooming Lounge, KK Nagar, Trichy* ✂️\n\n` +
    `A new grooming experience is arriving in Trichy! Your presence will make our beginning even more special.\n\n` +
    `📅 *Thursday, 05 November 2025 at 6:30 PM*\n` +
    `📍 *Venue:* ${EVENT_DETAILS.fullAddressText}\n\n` +
    `👑 *Brand Founder:* ${EVENT_DETAILS.founderName}\n` +
    `💼 *For Franchise:* ${EVENT_DETAILS.franchisePhoneDisplay}\n\n` +
    `🗺️ *Google Maps:* ${EVENT_DETAILS.mapsUrl}\n\n` +
    `✨ *View Official Invitation:*\n${EVENT_DETAILS.pageUrl}`
  )}`;

  return (
    <div className="relative min-h-screen bg-[#070F09] text-[#F5ECDE] selection:bg-[#E6B25C] selection:text-[#070F09] flex flex-col justify-between">
      
      {/* Background Ambience with Subtle Radial Glows */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5 filter blur-[2px] scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/images/salon/interior.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070F09] via-[#0B170E]/95 to-[#070F09] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#E6B25C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#E6B25C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar for Invitation */}
      <header className="relative z-20 w-full border-b border-[#E6B25C]/20 bg-[#09150C]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E6B25C] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#E6B25C] uppercase">
              Official Inauguration • Flagship Lounge
            </span>
          </div>

          {setCurrentView && (
            <button
              onClick={() => setCurrentView(VIEWS.HOME)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-[#E6B25C] transition-colors"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6B25C]" />
            </button>
          )}
        </div>
      </header>

      {/* Main Invitation Showcase */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 flex-1 flex flex-col items-center justify-center">
        
        {/* The Official Invitation Card Image (The Masterpiece) */}
        <div className="relative group w-full max-w-md sm:max-w-lg rounded-3xl overflow-hidden border-2 border-[#E6B25C] shadow-[0_0_50px_rgba(230,178,92,0.18)] bg-[#0C160E] transition-transform duration-300 hover:scale-[1.01]">
          
          <img
            src={EVENT_DETAILS.cardImageUrl}
            alt="ZAYRO Men's Grooming Lounge KK Nagar Grand Opening Official Invitation"
            className="w-full h-auto object-contain block cursor-pointer select-none"
            onClick={() => setShowFullPoster(true)}
          />

          {/* Quick Enlarge Hover Pill */}
          <button
            onClick={() => setShowFullPoster(true)}
            className="absolute top-4 right-4 bg-[#070F09]/80 hover:bg-[#070F09] border border-[#E6B25C]/60 text-[#E6B25C] text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Enlarge</span>
          </button>
        </div>

        {/* Primary Interactive Action Grid */}
        <div className="w-full max-w-md sm:max-w-lg grid grid-cols-2 gap-2.5 sm:gap-3">
          
          {/* Action 1: Google Maps */}
          <a
            href={EVENT_DETAILS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#E6B25C] via-[#F3CE7A] to-[#C9943B] text-[#0C160E] font-bold text-xs uppercase tracking-wider shadow-gold hover:brightness-110 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4 fill-current shrink-0" />
            <span>Google Maps</span>
          </a>

          {/* Action 2: WhatsApp RSVP */}
          <a
            href={whatsappRsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-2xl bg-[#25D366] text-[#070F09] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-current shrink-0" />
            <span>RSVP WhatsApp</span>
          </a>

          {/* Action 3: Add to Calendar */}
          <a
            href={gCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-2xl bg-[#132415] border border-[#E6B25C]/40 hover:border-[#E6B25C] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Add to Calendar</span>
          </a>

          {/* Action 4: Download HD Invitation */}
          <a
            href={EVENT_DETAILS.cardImageUrl}
            download="ZAYRO-KKNagar-Grand-Opening-Invitation.jpg"
            className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-2xl bg-[#132415] border border-[#E6B25C]/40 hover:border-[#E6B25C] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Save Card (HD)</span>
          </a>

        </div>

        {/* Share & Copy Address Strip */}
        <div className="w-full max-w-md sm:max-w-lg flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#0E1A11] border border-[#E6B25C]/25 text-xs">
          <button
            onClick={handleCopyAddress}
            type="button"
            className="text-stone-300 hover:text-[#E6B25C] flex items-center gap-1.5 transition-colors font-medium text-left truncate"
            title="Click to copy full address"
          >
            {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-[#E6B25C] shrink-0" />}
            <span className="truncate">{copiedAddress ? "Address Copied!" : "Copy Postal Address"}</span>
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Invite</span>
          </a>
        </div>

        {/* Event Quick Facts Badge */}
        <div className="w-full max-w-md sm:max-w-lg rounded-2xl bg-[#09150C] border border-[#E6B25C]/30 p-4 space-y-2 text-center text-xs">
          <div className="text-[#E6B25C] font-bold uppercase tracking-wider">
            {EVENT_DETAILS.fullDate} • {EVENT_DETAILS.time}
          </div>
          <div className="text-stone-300 font-medium leading-relaxed">
            {EVENT_DETAILS.fullAddressText}
          </div>
          <div className="pt-2 border-t border-[#E6B25C]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <span>{EVENT_DETAILS.founderTitle}: <strong className="text-white">{EVENT_DETAILS.founderName}</strong></span>
            <a 
              href={EVENT_DETAILS.franchiseTelLink} 
              className="text-[#E6B25C] hover:underline font-bold inline-flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{EVENT_DETAILS.franchiseLabel}</span>
            </a>
          </div>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full py-4 text-center text-[11px] text-stone-500 border-t border-[#E6B25C]/15 bg-[#070F09]">
        <p>© 2025 ZAYRO Men's Grooming Lounge • KK Nagar Flagship Inauguration</p>
      </footer>

      {/* Lightbox Modal for Enlarge View */}
      {showFullPoster && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowFullPoster(false)}
        >
          <div 
            className="relative max-w-xl w-full max-h-[94vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullPoster(false)}
              className="absolute -top-11 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden border-2 border-[#E6B25C] shadow-2xl max-h-[82vh] overflow-y-auto">
              <img
                src={EVENT_DETAILS.cardImageUrl}
                alt="ZAYRO Grand Opening Official Invitation"
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="mt-3 flex items-center gap-3">
              <a
                href={EVENT_DETAILS.cardImageUrl}
                download="ZAYRO-KKNagar-Grand-Opening-Invitation.jpg"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#0C160E] text-xs font-bold uppercase tracking-wider shadow-gold hover:brightness-110 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download (HD)</span>
              </a>
              <a
                href={EVENT_DETAILS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#132415] border border-[#E6B25C] text-[#E6B25C] hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>Open in Maps</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
