import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Clock, Navigation, Share2, Check, 
  MessageSquare, Copy, Sparkles, Scissors, Coffee, ShieldCheck,
  Download, Eye, X, PhoneCall, Award, ExternalLink
} from 'lucide-react';

const EVENT_DETAILS = {
  brandName: "ZAYRO",
  brandSubtitle: "MEN'S GROOMING",
  title: "ZAYRO Men's Grooming Lounge — Grand Opening",
  time: "6:30 PM",
  dateNum: "05",
  dateMonthYear: "NOV, 2025",
  dayOfWeek: "THURSDAY",
  fullDate: "Thursday, 05 November 2025",
  welcomeLine1: "A new grooming experience is arriving in",
  welcomeCity: "Trichy.",
  welcomeLine2: "Your presence will make our beginning even more special.",
  addressLines: [
    "NO. 115, RAJARAM ROAD,",
    "NEAR KK NAGAR BUS TERMINUS,",
    "OPP. SUMAIYA MULTI SHOPING",
    "KK NAGAR TRICHY - 620021"
  ],
  fullAddressText: "NO. 115, RAJARAM ROAD, NEAR KK NAGAR BUS TERMINUS, OPP. SUMAIYA MULTI SHOPING, KK NAGAR TRICHY - 620021",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=No.+115,+Rajaram+Road,+Near+KK+Nagar+Bus+Terminus,+Opp.+Sumaiya+Multi+Shoping,+KK+Nagar,+Trichy+-+620021",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=No.+115,+Rajaram+Road,+Near+KK+Nagar+Bus+Terminus,+Opp.+Sumaiya+Multi+Shoping,+KK+Nagar,+Trichy+-+620021",
  phone: "+91 91500 22115",
  whatsappRaw: "919150022115",
  tagline: "YOUR STYLE. YOUR IDENTITY.",
  taglineSub: "We look forward to welcoming you.",
  founderTitle: "BRAND FOUNDER",
  founderName: "MOHAMED MUBARAK A | ZAYRO",
  franchiseLabel: "For Franchise: 72 002 79 002",
  franchisePhoneDisplay: "72 002 79 002",
  franchiseTelLink: "tel:+917200279002",
  franchiseWhatsApp: "https://wa.me/917200279002?text=Hello%20ZAYRO%20Expansion%20Desk,%20I%20am%20interested%20in%20a%20ZAYRO%20Franchise%20Lounge.",
  cardImageUrl: "/images/kknagar-invite.jpg",
  pageUrl: "https://zayrosalon.com/kknagarinvite"
};

export default function KkNagarInviteView({ openBooking, openRateCard }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'poster'
  const [showFullPoster, setShowFullPoster] = useState(false);

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
      setMetaTag('meta[name="description"]', 'content', 'A new grooming experience is arriving in Trichy. Cordially inviting you to the Grand Opening of ZAYRO KK Nagar on Thursday, 05 NOV 2025 at 6:30 PM. Tap to view invitation & GPS directions.'),
      setMetaTag('meta[property="og:title"]', 'content', "Grand Opening Invitation • ZAYRO KK Nagar, Trichy"),
      setMetaTag('meta[property="og:description"]', 'content', "A new grooming experience is arriving in Trichy. Thursday, 05 NOV 2025 at 6:30 PM. Venue: No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaiya Multi Shoping. Tap to view invitation & GPS directions."),
      setMetaTag('meta[property="og:image"]', 'content', "https://zayrosalon.com/images/kknagar-invite-og.jpg"),
      setMetaTag('meta[property="og:url"]', 'content', EVENT_DETAILS.pageUrl),
      setMetaTag('meta[name="twitter:title"]', 'content', "Grand Opening Invitation • ZAYRO KK Nagar, Trichy"),
      setMetaTag('meta[name="twitter:description"]', 'content', "A new grooming experience is arriving in Trichy. Thursday, 05 NOV 2025 at 6:30 PM. Venue: No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaiya Multi Shoping. Tap for directions & RSVP."),
      setMetaTag('meta[name="twitter:image"]', 'content', "https://zayrosalon.com/images/kknagar-invite-og.jpg"),
    ];

    // Escape listener for poster lightbox
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
      title: "Grand Opening Invitation • ZAYRO KK Nagar, Trichy",
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
    `✨ *View Official Invitation Card:*\n${EVENT_DETAILS.pageUrl}`
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 sm:space-y-10">
        
        {/* Top Header Pill Badge & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162719] border border-[#E6B25C]/40 shadow-gold backdrop-blur-md text-[11px] font-bold tracking-[0.2em] text-[#E6B25C] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#E6B25C] animate-pulse" />
            <span>Official Inauguration • KK Nagar Trichy</span>
          </div>

          {/* Tab Selector: Interactive Card vs Official Invite Poster */}
          <div className="inline-flex items-center bg-[#0F1C11] p-1 rounded-full border border-[#E6B25C]/30 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('card')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'card'
                  ? 'bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#0C160E] font-bold shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Interactive Invitation
            </button>
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'poster'
                  ? 'bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#0C160E] font-bold shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>Official Poster</span>
              <span className="text-[10px] bg-[#E6B25C]/20 text-[#E6B25C] px-1.5 py-0.2 rounded-full border border-[#E6B25C]/40">
                Original
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Luxury Invitation Card (Faithfully modeled after Official Flyer) */}
        {activeTab === 'card' && (
          <div className="relative rounded-3xl bg-gradient-to-b from-[#142A17] via-[#0E1F12] to-[#08130B] border-2 border-[#E6B25C] shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden transition-all">
            
            {/* Inner Ornamental Double Frame */}
            <div className="absolute inset-3 sm:inset-4 border border-[#E6B25C]/35 rounded-2xl pointer-events-none" />
            
            {/* Corner Ornamental Diamond Motifs */}
            <div className="absolute top-5 left-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />
            <div className="absolute top-5 right-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />
            <div className="absolute bottom-5 left-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />
            <div className="absolute bottom-5 right-5 w-2 h-2 bg-[#E6B25C] rotate-45 pointer-events-none" />

            {/* Invitation Content Header */}
            <div className="text-center space-y-4 sm:space-y-6 pt-2">
              
              {/* Brand Logo & Name */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <img 
                  src="/images/logo/Transparent Logo.png" 
                  alt="ZAYRO Men's Grooming" 
                  className="h-14 sm:h-18 w-auto object-contain drop-shadow-md mx-auto"
                />
                <h1 className="font-serif tracking-[0.25em] text-3xl sm:text-4xl text-[#F5ECDE] font-bold uppercase drop-shadow">
                  {EVENT_DETAILS.brandName}
                </h1>
                <p className="tracking-[0.35em] text-[10px] sm:text-xs text-[#E6B25C] font-semibold uppercase">
                  {EVENT_DETAILS.brandSubtitle}
                </p>
              </div>

              {/* Grand Opening Typography (Artistic Calligraphy + Metallic Caps) */}
              <div className="pt-2 sm:pt-4 space-y-0.5">
                <div 
                  className="text-6xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#F7E1B5] via-[#E6B25C] to-[#C9943B] leading-none drop-shadow font-normal"
                  style={{ fontFamily: "'Alex Brush', 'Playfair Display', cursive" }}
                >
                  Grand
                </div>
                <div className="font-sans font-black text-3xl sm:text-5xl md:text-6xl tracking-[0.2em] sm:tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5DC] via-[#E6B25C] to-[#B37E26] uppercase drop-shadow">
                  OPENING
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-light tracking-[0.15em] text-[#E6B25C] pt-1">
                  Invitation
                </div>
              </div>

              {/* Warm Welcome Message */}
              <div className="max-w-xl mx-auto pt-2 space-y-1.5 text-stone-300 text-xs sm:text-sm sm:leading-relaxed">
                <p className="font-medium text-white/95 text-sm sm:text-base">
                  {EVENT_DETAILS.welcomeLine1}{' '}
                  <span className="text-[#E6B25C] font-bold">{EVENT_DETAILS.welcomeCity}</span>
                </p>
                <p className="text-stone-300 font-light">
                  {EVENT_DETAILS.welcomeLine2}
                </p>
              </div>

              {/* The Date & Location Highlight Card (Exact replica of the golden box with pin badge) */}
              <div className="relative max-w-2xl mx-auto mt-6 rounded-2xl bg-[#09150C]/90 border-2 border-[#E6B25C] p-6 sm:p-8 shadow-xl">
                
                {/* Glowing Circular Location Pin Icon Centered on the top border */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#E6B25C] text-[#070F09] flex items-center justify-center shadow-gold border-2 border-[#09150C]">
                  <MapPin className="w-5 h-5 fill-current text-[#070F09]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                  
                  {/* Left Column: Time, Big 05 Date, Month Year, Day */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center text-center pb-5 md:pb-0 border-b md:border-b-0 md:border-r border-[#E6B25C]/35">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#E6B25C] mb-1">
                      {EVENT_DETAILS.time}
                    </span>
                    
                    <div className="font-sans font-black text-6xl sm:text-7xl md:text-8xl text-white tracking-tight leading-none my-1 drop-shadow">
                      {EVENT_DETAILS.dateNum}
                    </div>
                    
                    <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#E6B25C] mt-1">
                      {EVENT_DETAILS.dateMonthYear}
                    </div>

                    <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#E6B25C]">
                      {EVENT_DETAILS.dayOfWeek}
                    </div>
                  </div>

                  {/* Right Column: Address in all-caps uppercase */}
                  <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                    
                    {/* Address lines mirroring flyer */}
                    <div className="text-xs sm:text-sm text-stone-200 leading-relaxed font-semibold uppercase tracking-wider space-y-0.5">
                      <div>{EVENT_DETAILS.addressLines[0]}</div>
                      <div>{EVENT_DETAILS.addressLines[1]}</div>
                      <div>{EVENT_DETAILS.addressLines[2]}</div>
                      <div className="text-[#E6B25C] font-bold text-sm sm:text-base pt-0.5">
                        {EVENT_DETAILS.addressLines[3]}
                      </div>
                    </div>

                    {/* Navigation Buttons inside box */}
                    <div className="pt-2 w-full flex flex-wrap gap-2">
                      <a
                        href={EVENT_DETAILS.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 flex-1 bg-gradient-to-r from-[#E6B25C] via-[#F3CE7A] to-[#C9943B] text-[#0C160E] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-gold hover:brightness-110 active:scale-95 transition-all"
                      >
                        <Navigation className="w-4 h-4 fill-current" />
                        <span>Google Maps</span>
                      </a>
                      <a
                        href={EVENT_DETAILS.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 flex-1 bg-[#132415] border border-[#E6B25C]/50 hover:border-[#E6B25C] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Directions</span>
                      </a>
                    </div>

                  </div>

                </div>

              </div>

              {/* Tagline Motto */}
              <div className="pt-4 space-y-1 text-center">
                <div className="font-sans font-bold text-xs sm:text-sm tracking-[0.3em] text-white uppercase">
                  {EVENT_DETAILS.tagline}
                </div>
                <div className="text-xs text-stone-400 font-light">
                  {EVENT_DETAILS.taglineSub}
                </div>
              </div>

              {/* Golden Divider Line with Center Diamond */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#E6B25C]/60 to-transparent" />
                <div className="absolute w-2.5 h-2.5 bg-[#E6B25C] rotate-45" />
              </div>

              {/* Brand Founder Section (Exact match from the flyer) */}
              <div className="text-center space-y-0.5 pt-1">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E6B25C] block">
                  {EVENT_DETAILS.founderTitle}
                </span>
                <span className="text-sm sm:text-base font-bold text-white tracking-wider block">
                  {EVENT_DETAILS.founderName}
                </span>
              </div>

              {/* Franchise Pill Bar (Clickable telephone & WhatsApp inquiry) */}
              <div className="pt-3 flex justify-center">
                <a
                  href={EVENT_DETAILS.franchiseTelLink}
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#0D180F] border border-[#E6B25C]/60 hover:border-[#E6B25C] text-white text-xs sm:text-sm font-bold tracking-wider hover:bg-[#152B19] shadow-gold transition-all group"
                  title="Call ZAYRO Franchise Desk"
                >
                  <PhoneCall className="w-4 h-4 text-[#E6B25C] group-hover:scale-110 transition-transform" />
                  <span className="text-[#E6B25C]">{EVENT_DETAILS.franchiseLabel}</span>
                </a>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Authentic Official Invitation Poster View */}
        {activeTab === 'poster' && (
          <div className="space-y-6">
            <div className="relative rounded-3xl bg-[#0F1C11] border-2 border-[#E6B25C] p-4 sm:p-8 shadow-2xl flex flex-col items-center">
              
              {/* Top Banner inside poster view */}
              <div className="w-full flex items-center justify-between pb-4 border-b border-[#E6B25C]/30 text-xs">
                <span className="font-bold text-[#E6B25C] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#E6B25C]" />
                  <span>Official Printed Invitation Card</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFullPoster(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#162719] border border-[#E6B25C]/40 text-[#E6B25C] hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Enlarge</span>
                  </button>
                  <a
                    href={EVENT_DETAILS.cardImageUrl}
                    download="ZAYRO-KKNagar-Grand-Opening-Invitation.jpg"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#0C160E] text-xs font-bold shadow hover:brightness-110 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* The Invitation Image */}
              <div 
                onClick={() => setShowFullPoster(true)}
                className="cursor-pointer group relative mt-4 max-w-lg rounded-2xl overflow-hidden border-2 border-[#E6B25C]/60 shadow-2xl transition-transform hover:scale-[1.01]"
              >
                <img
                  src={EVENT_DETAILS.cardImageUrl}
                  alt="ZAYRO Men's Grooming Lounge KK Nagar Grand Opening Official Invitation"
                  className="w-full h-auto object-contain block"
                />
                <div className="absolute inset-0 bg-[#070F09]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0C160E]/90 border border-[#E6B25C] text-[#E6B25C] text-xs font-bold uppercase tracking-wider">
                    <Eye className="w-4 h-4" />
                    <span>Click to view Full HD</span>
                  </span>
                </div>
              </div>

              {/* Caption */}
              <p className="text-xs text-stone-400 mt-4 text-center">
                Official Grand Opening Card for ZAYRO KK Nagar Flagship Lounge. Tap image to view in full resolution or download.
              </p>
            </div>
          </div>
        )}

        {/* Quick Action Bar (Google Maps, WhatsApp RSVP, Add to Calendar, Share) */}
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

        {/* Official Invitation Highlights & Details Card */}
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
                <p className="text-[11px] text-stone-400">No. 115, Rajaram Road, Near KK Nagar Bus Terminus, Opp. Sumaiya Multi Shoping.</p>
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
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyAddress}
                type="button"
                className="text-xs font-bold text-[#E6B25C] hover:text-white flex items-center gap-1.5 transition-colors underline"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? "Address Copied!" : "Copy Postal Address"}</span>
              </button>

              <span className="text-stone-600">•</span>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp Invite</span>
              </a>
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

      {/* Full-Screen Lightbox Modal for Official Poster */}
      {showFullPoster && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowFullPoster(false)}
        >
          <div 
            className="relative max-w-xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullPoster(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-2xl overflow-hidden border-2 border-[#E6B25C] shadow-2xl max-h-[80vh] overflow-y-auto">
              <img
                src={EVENT_DETAILS.cardImageUrl}
                alt="ZAYRO Grand Opening Official Invitation"
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <a
                href={EVENT_DETAILS.cardImageUrl}
                download="ZAYRO-KKNagar-Grand-Opening-Invitation.jpg"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#0C160E] text-xs font-bold uppercase tracking-wider shadow-gold hover:brightness-110 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Invitation (HD)</span>
              </a>
              <a
                href={EVENT_DETAILS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#132415] border border-[#E6B25C] text-[#E6B25C] hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Maps</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
