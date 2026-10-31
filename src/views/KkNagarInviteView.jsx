import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Clock, Navigation, Share2, Check, 
  MessageSquare, Copy, Sparkles, Scissors, Coffee, ShieldCheck 
} from 'lucide-react';

const EVENT_DETAILS = {
  title: "ZAYRO Men's Grooming Lounge — Grand Opening",
  time: "6:30 PM",
  dateNum: "04",
  dateMonthYear: "NOV, 2025",
  fullDate: "Wednesday, 04 November 2025",
  addressLines: [
    "No. 115, Rajaram Road,",
    "Near KK Nagar Bus Terminus,",
    "Opp. Sumaya Super Market,",
    "Tiruchirappalli - 620021."
  ],
  fullAddressText: "No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaya Super Market, Tiruchirappalli - 620021.",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=No.+115,+Rajaram+Road,+Near+KK+Nagar+Bus+Terminus,+Opp.+Sumaya+Super+Market,+Tiruchirappalli+-+620021",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=No.+115,+Rajaram+Road,+Near+KK+Nagar+Bus+Terminus,+Opp.+Sumaya+Super+Market,+Tiruchirappalli+-+620021",
  phone: "+91 91500 22115",
  whatsappRaw: "919150022115",
  pageUrl: "https://zayrosalon.com/kknagarinvite"
};

export default function KkNagarInviteView({ openBooking, openRateCard }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Dynamic page title and SEO meta for social cards and invitees
    const prevTitle = document.title;
    document.title = "Grand Opening Invitation • ZAYRO Men's Grooming Lounge KK Nagar, Trichy";
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Dynamic meta tag updater
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
      setMetaTag('meta[name="description"]', 'content', 'A new grooming experience is arriving in Trichy. Cordially inviting you to the Grand Opening of ZAYRO KK Nagar on Wednesday, 04 NOV 2025 at 6:30 PM. Tap to view invitation & GPS directions.'),
      setMetaTag('meta[property="og:title"]', 'content', "Grand Opening Invitation • ZAYRO KK Nagar, Trichy"),
      setMetaTag('meta[property="og:description"]', 'content', "A new grooming experience is arriving in Trichy. Wednesday, 04 NOV 2025 at 6:30 PM. Venue: No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaya Super Market. Tap to view invitation & GPS directions."),
      setMetaTag('meta[property="og:image"]', 'content', "https://zayrosalon.com/images/kknagar-invite-og.jpg"),
      setMetaTag('meta[property="og:url"]', 'content', EVENT_DETAILS.pageUrl),
      setMetaTag('meta[name="twitter:title"]', 'content', "Grand Opening Invitation • ZAYRO KK Nagar, Trichy"),
      setMetaTag('meta[name="twitter:description"]', 'content', "A new grooming experience is arriving in Trichy. Wednesday, 04 NOV 2025 at 6:30 PM. Venue: No. 115, Rajaram Road, Near KK Nagar Bus Terminus. Tap for directions & RSVP."),
      setMetaTag('meta[name="twitter:image"]', 'content', "https://zayrosalon.com/images/kknagar-invite-og.jpg"),
    ];

    return () => {
      document.title = prevTitle;
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
      title: "Grand Opening Invitation • ZAYRO KK Nagar, Trichy",
      text: "A new grooming experience is arriving in Trichy. You are cordially invited to the Grand Opening of ZAYRO Men's Grooming Lounge at KK Nagar on Wednesday, 04 NOV 2025 at 6:30 PM. 🌿✂️",
      url: EVENT_DETAILS.pageUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to copy link
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

  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "ZAYRO KK Nagar Grand Opening Ceremony"
  )}&dates=20251104T130000Z/20251104T160000Z&details=${encodeURIComponent(
    `A new grooming experience is arriving in Trichy. Your presence will make our beginning even more special.\n\n` +
    `Venue: ${EVENT_DETAILS.fullAddressText}\n` +
    `Google Maps: ${EVENT_DETAILS.mapsUrl}\n` +
    `Concierge Hotline: ${EVENT_DETAILS.phone}\n` +
    `Website: ${EVENT_DETAILS.pageUrl}`
  )}&location=${encodeURIComponent(EVENT_DETAILS.fullAddressText)}`;

  const whatsappRsvpUrl = `https://wa.me/${EVENT_DETAILS.whatsappRaw}?text=${encodeURIComponent(
    "Hello ZAYRO Team, I received the Grand Opening Invitation for the KK Nagar Flagship Lounge on 04 Nov at 6:30 PM. I would like to RSVP and confirm my attendance! 🌿✨"
  )}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🌿 *Grand Opening Invitation — ZAYRO Men's Grooming Lounge, KK Nagar, Trichy* ✂️\n\n` +
    `A new grooming experience is arriving in Trichy! You are cordially invited to our Grand Opening on *Wednesday, 04 November 2025 at 6:30 PM*.\n\n` +
    `📍 *Venue:* ${EVENT_DETAILS.fullAddressText}\n` +
    `🗺️ *Google Maps:* ${EVENT_DETAILS.mapsUrl}\n\n` +
    `✨ *View Invitation Card & Preview:*\n${EVENT_DETAILS.pageUrl}`
  )}`;

  return (
    <div className="relative min-h-screen bg-[#070F09] text-[#F5ECDE] overflow-hidden selection:bg-[#E6B25C] selection:text-[#070F09]">
      
      {/* Background Ambience Layer with Salon Interior and Subtle Radial Glows */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-[1px] scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/images/salon/interior.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070F09] via-[#0C160E]/95 to-[#070F09] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#E6B25C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#30452F]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#E6B25C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        
        {/* Top Floating Pill Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162719] border border-[#E6B25C]/40 shadow-gold backdrop-blur-md text-[11px] font-bold tracking-[0.2em] text-[#E6B25C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#E6B25C] animate-pulse" />
            <span>Official Inauguration • Flagship Lounge</span>
          </div>
        </div>

        {/* The Luxury Invitation Card (Modeled after the Official Physical Invitation) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#132415] via-[#101F12] to-[#0A160C] border-2 border-[#E6B25C] shadow-2xl p-6 sm:p-12 md:p-14 overflow-hidden">
          
          {/* Inner Ornamental Double Frame */}
          <div className="absolute inset-3 sm:inset-4 border border-[#E6B25C]/35 rounded-2xl pointer-events-none" />
          
          {/* Corner Ornamental Diamond Motifs */}
          <div className="absolute top-5 left-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />
          <div className="absolute top-5 right-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />
          <div className="absolute bottom-5 left-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />
          <div className="absolute bottom-5 right-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />

          {/* Invitation Content Header */}
          <div className="text-center space-y-4 sm:space-y-6 pt-2">
            
            {/* Logo and Brand */}
            <div className="flex flex-col items-center justify-center">
              <img 
                src="/images/logo/Transparent Logo.png" 
                alt="ZAYRO Men's Grooming" 
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-md mx-auto"
              />
            </div>

            {/* Grand Opening Typography (Artistic Calligraphy + Metallic Caps) */}
            <div className="pt-2 sm:pt-4 space-y-1 sm:space-y-2">
              <div className="font-serif italic text-4xl sm:text-6xl md:text-7xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F7E1B5] via-[#E6B25C] to-[#C9943B] leading-none drop-shadow">
                Grand
              </div>
              <div className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase drop-shadow">
                Opening
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-light tracking-[0.15em] text-[#E6B25C] pt-1">
                Invitation
              </div>
            </div>

            {/* Warm Welcome Message */}
            <div className="max-w-xl mx-auto pt-2 space-y-2 text-stone-300 text-xs sm:text-sm sm:leading-relaxed">
              <p className="font-medium text-white/95 text-sm sm:text-base">
                A new grooming experience is arriving in Trichy.
              </p>
              <p className="text-stone-300 font-light">
                Your presence will make our beginning even more special.
              </p>
            </div>

            {/* Golden Divider Line with Center Diamond */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#E6B25C]/60 to-transparent" />
              <div className="absolute w-2.5 h-2.5 bg-[#E6B25C] rotate-45" />
            </div>

            {/* The Date & Location Highlight Card (Mirroring PDF Box) */}
            <div className="relative max-w-2xl mx-auto rounded-2xl bg-[#0F1C11]/90 border-2 border-[#E6B25C] p-5 sm:p-7 shadow-xl">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left Column: Time & Big 04 Date */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-[#E6B25C]/35">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#E6B25C] flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-[#E6B25C]" />
                    <span>{EVENT_DETAILS.time}</span>
                  </span>
                  
                  <div className="font-sans font-black text-6xl sm:text-7xl text-white tracking-tight leading-none my-1">
                    {EVENT_DETAILS.dateNum}
                  </div>
                  
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#E6B25C] bg-[#162719] px-3 py-1 rounded-full border border-[#E6B25C]/40 mt-1">
                    {EVENT_DETAILS.dateMonthYear}
                  </div>
                </div>

                {/* Right Column: Pin & Address */}
                <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                  
                  {/* Glowing Location Pin Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#E6B25C] text-[#0C160E] flex items-center justify-center shadow-gold">
                    <MapPin className="w-6 h-6 fill-current text-[#0C160E]" />
                  </div>

                  {/* Address lines */}
                  <div className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                    {EVENT_DETAILS.addressLines.map((line, idx) => (
                      <div key={idx} className={idx === 0 ? "font-bold text-white text-sm sm:text-base" : ""}>
                        {line}
                      </div>
                    ))}
                  </div>

                  {/* Primary Google Maps Navigation Link & WhatsApp Share with Preview */}
                  <div className="pt-1 w-full flex flex-wrap gap-2.5">
                    <a
                      href={EVENT_DETAILS.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-gradient-to-r from-[#E6B25C] via-[#F3CE7A] to-[#C9943B] text-[#0C160E] font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-gold hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Navigation className="w-4 h-4 fill-current" />
                      <span>Open in Google Maps</span>
                    </a>
                    <a
                      href={EVENT_DETAILS.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-[#132415] border border-[#E6B25C]/40 hover:border-[#E6B25C] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>GPS Directions</span>
                    </a>
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-[#25D366] text-[#070F09] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Share2 className="w-4 h-4 text-[#070F09]" />
                      <span>Share Preview</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>

            {/* Closing Brand Motto */}
            <div className="pt-4 space-y-1 text-center">
              <div className="font-sans font-bold text-xs sm:text-sm tracking-[0.3em] text-white uppercase">
                YOUR STYLE. YOUR IDENTITY.
              </div>
              <div className="text-xs text-stone-400 font-light">
                We look forward to welcoming you.
              </div>
            </div>

          </div>

        </div>

        {/* Interactive Quick-Action Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Action 1: Google Maps Direct */}
          <a
            href={EVENT_DETAILS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#132415] border border-[#E6B25C]/30 hover:border-[#E6B25C] hover:bg-[#1A2E1D] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6B25C]/15 text-[#E6B25C] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Navigation className="w-5 h-5 text-[#E6B25C]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#E6B25C] tracking-wider block">GPS Direction</span>
              <span className="text-xs font-bold text-white">Google Maps Pin</span>
            </div>
          </a>

          {/* Action 2: WhatsApp RSVP */}
          <a
            href={whatsappRsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#132415] border border-[#25D366]/40 hover:border-[#25D366] hover:bg-[#162B1A] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#25D366] tracking-wider block">Confirm Attendance</span>
              <span className="text-xs font-bold text-white">RSVP on WhatsApp</span>
            </div>
          </a>

          {/* Action 3: Add to Google Calendar */}
          <a
            href={gCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#132415] border border-[#E6B25C]/30 hover:border-[#E6B25C] hover:bg-[#1A2E1D] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6B25C]/15 text-[#E6B25C] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-[#E6B25C]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#E6B25C] tracking-wider block">Save Event</span>
              <span className="text-xs font-bold text-white">Add to Calendar</span>
            </div>
          </a>

          {/* Action 4: Share Invitation */}
          <button
            onClick={handleShare}
            type="button"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#132415] border border-[#E6B25C]/30 hover:border-[#E6B25C] hover:bg-[#1A2E1D] transition-all group text-left w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E6B25C]/15 text-[#E6B25C] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5 text-[#E6B25C]" />}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#E6B25C] tracking-wider block">
                {copiedLink ? "Link Copied!" : "Invite Friends"}
              </span>
              <span className="text-xs font-bold text-white">Share Invitation</span>
            </div>
          </button>

        </div>

        {/* Flagship Lounge Features & Highlights */}
        <div className="rounded-3xl bg-[#112013] border border-[#E6B25C]/25 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E6B25C] block">
              Redefining Men's Grooming in Trichy
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              The KK Nagar Flagship Experience
            </h3>
            <p className="text-xs text-stone-300">
              An architectural lounge built for men who value precision, privacy, and authentic luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            
            <div className="p-4 rounded-xl bg-[#0D180F] border border-[#E6B25C]/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B25C]/10 text-[#E6B25C] shrink-0">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">12 Luxury Barber Stations</h4>
                <p className="text-[11px] text-stone-400">Master barbers specializing in precision skin fades & beard architecture.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D180F] border border-[#E6B25C]/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B25C]/10 text-[#E6B25C] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Japanese Waterfall Head Spa</h4>
                <p className="text-[11px] text-stone-400">Ayurvedic botanical therapy & soothing scalp detox relaxation bays.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D180F] border border-[#E6B25C]/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B25C]/10 text-[#E6B25C] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">VIP Royal Groom Suite</h4>
                <p className="text-[11px] text-stone-400">Private suite dedicated to wedding preparation and executive grooming.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D180F] border border-[#E6B25C]/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B25C]/10 text-[#E6B25C] shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Artisan Refreshment Bar</h4>
                <p className="text-[11px] text-stone-400">Complimentary handcrafted espresso & herbal refreshments for every guest.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D180F] border border-[#E6B25C]/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B25C]/10 text-[#E6B25C] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Prime Landmark Location</h4>
                <p className="text-[11px] text-stone-400">Right on Rajaram Road, near KK Nagar Bus Terminus & Opp. Sumaya Super Market.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D180F] border border-[#E6B25C]/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B25C]/10 text-[#E6B25C] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Zero-Waiting Concierge</h4>
                <p className="text-[11px] text-stone-400">Priority reserved seating system with hospital-grade tool sterilization.</p>
              </div>
            </div>

          </div>

          {/* Action CTAs in card */}
          <div className="pt-4 border-t border-[#E6B25C]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAddress}
                type="button"
                className="text-xs font-bold text-[#E6B25C] hover:text-white flex items-center gap-1.5 transition-colors underline"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? "Address Copied to Clipboard!" : "Copy Full Postal Address"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {openRateCard && (
                <button
                  onClick={() => openRateCard()}
                  type="button"
                  className="flex-1 sm:flex-initial text-xs font-bold text-[#E6B25C] hover:text-white border border-[#E6B25C]/40 px-4 py-2.5 rounded-xl hover:bg-[#E6B25C]/10 transition-all"
                >
                  View Rate Card
                </button>
              )}
              {openBooking && (
                <button
                  onClick={() => openBooking()}
                  type="button"
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#0C160E] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-gold hover:brightness-110 active:scale-95 transition-all"
                >
                  Book Appointment
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

