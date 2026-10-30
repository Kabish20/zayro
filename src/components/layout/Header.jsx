import React, { useState } from 'react';
import { Menu, X, Phone, Calendar, ChevronRight, Briefcase, Sparkles } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { BRAND, CONTACT, getWhatsAppUrl, NAV_ITEMS, VIEWS } from '@/constants';

export default function Header({ currentView, setCurrentView, openBooking, openRateCard }) {
  const { isScrolled } = useScrollPosition(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (targetView) => {
    setCurrentView(targetView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (item) => {
    const target = item.targetView || item.id;
    return currentView === target;
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A2719] text-[#F5ECDE] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#30452F]">
        <div className="w-full px-1 sm:px-8 lg:px-14 xl:px-18 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E6B25C] animate-pulse shrink-0"></span>
            <span className="font-medium tracking-wide">
              <strong className="text-[#E6B25C]">LUXURY MADE AFFORDABLE:</strong> Haircuts ₹99 • Combos from ₹299 • Memberships from ₹259
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold">
            <button 
              onClick={() => openRateCard?.()}
              className="text-[#E6B25C] hover:text-white transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Official Rate Card (PDF)</span>
            </button>
            <span className="text-[#476346] hidden md:inline">|</span>
            <button 
              onClick={() => handleNavClick(VIEWS.FRANCHISE)}
              className="text-[#E6B25C] hover:text-white transition-colors flex items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Franchise (ROI 38%)</span>
            </button>
            <span className="text-[#476346] hidden md:inline">|</span>
            <a 
              href={CONTACT.telLink} 
              className="hover:text-[#E6B25C] transition-colors hidden md:flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#E6B25C]" />
              <span>{CONTACT.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1A2719]/95 backdrop-blur-md shadow-luxury py-2 sm:py-2.5 border-b border-[#E6B25C]/35' 
          : 'bg-[#30452F] py-2.5 sm:py-3.5 border-b border-[#476346] shadow-md'
      }`}>
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            id="nav-logo"
            onClick={() => handleNavClick(VIEWS.HOME)}
            className="flex items-center gap-2 text-left group focus:outline-none py-1 shrink-0 mr-2 sm:mr-6 xl:mr-8"
          >
            <img 
              src={BRAND.logo} 
              alt={BRAND.fullName} 
              className="h-10 sm:h-12 lg:h-14 xl:h-16 w-auto max-w-[160px] sm:max-w-[220px] lg:max-w-[260px] xl:max-w-[300px] object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-md"
            />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              const target = item.targetView || item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(target)}
                  className={`relative flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors py-1.5 ${
                    active 
                      ? 'text-[#E6B25C] font-bold' 
                      : 'text-[#F5ECDE]/90 hover:text-[#E6B25C]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-[#E6B25C] text-[#1F2E1E] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-sm leading-none shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E6B25C] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => openRateCard?.()}
              className="text-[11px] font-bold text-[#E6B25C] hover:text-white px-3 py-1.5 rounded-lg border border-[#E6B25C]/40 bg-[#1A2719]/50 hover:bg-[#E6B25C]/20 transition-all flex items-center gap-1.5 shadow-sm"
              title="View Official Rate Card & Offers"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6B25C]" />
              <span>Rate Card</span>
            </button>

            <a
              id="nav-btn-concierge"
              href={getWhatsAppUrl('Hi ZAYRO Concierge, I would like to inquire about a service.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-[#F5ECDE] hover:text-[#E6B25C] px-3 py-1.5 rounded-lg border border-[#476346] hover:border-[#E6B25C] bg-[#1A2719]/50 transition-all flex items-center gap-1.5 shadow-sm"
              title="Chat on WhatsApp"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
              <span>WhatsApp</span>
            </a>

            <button
              id="nav-btn-book"
              onClick={() => openBooking?.()}
              className="bg-gradient-to-r from-[#E6B25C] via-[#F3CE7A] to-[#C9943B] text-[#1F2E1E] font-bold text-xs px-4 py-2 rounded-lg shadow-gold hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openBooking?.()}
              className="sm:hidden bg-[#E6B25C] text-[#1F2E1E] font-bold text-[11px] px-2.5 py-1.5 rounded-md flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Book</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F5ECDE] hover:text-[#E6B25C] p-1.5 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1A2719] border-t border-[#30452F] px-4 py-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                const target = item.targetView || item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(target)}
                    className={`w-full flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#30452F] text-[#E6B25C] font-bold'
                        : 'text-[#F5ECDE] hover:bg-[#30452F]/60 hover:text-[#E6B25C]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-[#E6B25C] text-[#1F2E1E] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#476346]" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#30452F] space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking?.();
                }}
                className="w-full bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#1F2E1E] text-center font-bold text-sm py-3 rounded-lg shadow-md"
              >
                Book Appointment Online
              </button>
              <a
                href={CONTACT.telLink}
                className="w-full text-center text-[#F5ECDE] hover:text-[#E6B25C] text-xs py-2 border border-[#476346] rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#E6B25C]" />
                Contact Number: {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
