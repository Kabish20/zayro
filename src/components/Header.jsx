import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, ChevronRight, Briefcase } from 'lucide-react';

export default function Header({ currentView, setCurrentView, openBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'packages', label: 'Packages' },
    { id: 'franchise', label: 'Franchise', badge: 'Hot' },
    { id: 'locations', label: 'Salons' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (viewId) => {
    // Map packages to offers view
    const target = viewId === 'packages' ? 'offers' : viewId;
    setCurrentView(target);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (id) => currentView === id || (id === 'packages' && currentView === 'offers');

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A2719] text-[#F5ECDE] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#30452F]">
        <div className="w-full px-1 sm:px-8 lg:px-14 xl:px-18 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E6B25C] animate-pulse shrink-0"></span>
            <span className="font-medium tracking-wide">
              ZAYRO Signature Experience • Complimentary Scalp & Hair Architecture Consultation
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold">
            <button 
              onClick={() => handleNavClick('franchise')}
              className="text-[#E6B25C] hover:text-white transition-colors flex items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Own a ZAYRO Franchise (ROI 38%)</span>
            </button>
            <span className="text-[#476346] hidden md:inline">|</span>
            <a 
              href="tel:+919150022115" 
              className="hover:text-[#E6B25C] transition-colors hidden md:flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#E6B25C]" />
              <span>Contact Number: +91 91500 22115</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1A2719]/95 backdrop-blur-md shadow-luxury py-2.5 border-b border-[#E6B25C]/35' 
          : 'bg-[#30452F] py-3.5 border-b border-[#476346] shadow-md'
      }`}>
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            id="nav-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none py-1 shrink-0 mr-2 sm:mr-8 xl:mr-12"
          >
            <img 
              src="/images/logo/Transparent Logo.png" 
              alt="ZAYRO Men's Grooming" 
              className="h-11 sm:h-15 lg:h-16 w-auto max-w-[160px] sm:max-w-[260px] lg:max-w-[280px] object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-md"
            />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navItems.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative text-[13px] font-semibold tracking-wide transition-colors py-1.5 ${
                    active 
                      ? 'text-[#E6B25C] font-bold' 
                      : 'text-[#F5ECDE]/90 hover:text-[#E6B25C]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-2 -right-4.5 bg-[#E6B25C] text-[#1F2E1E] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tight shadow-sm">
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
          <div className="hidden sm:flex items-center gap-3">
            <a
              id="nav-btn-concierge"
              href="https://wa.me/919150022115?text=Hi%20ZAYRO%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20a%20service."
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#F5ECDE] hover:text-[#E6B25C] px-3.5 py-2.5 rounded-xl border border-[#476346] hover:border-[#E6B25C] bg-[#1A2719]/50 transition-all flex items-center gap-2 shadow-sm"
              title="Chat with Salon Concierge"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              <span className="hidden xl:inline">WhatsApp Concierge</span>
              <span className="xl:hidden">Concierge</span>
            </a>

            <button
              id="nav-btn-book"
              onClick={() => openBooking()}
              className="bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#1F2E1E] text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl shadow-md hover:shadow-gold-glow transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-btn-book"
              onClick={() => openBooking()}
              className="bg-[#E6B25C] text-[#1F2E1E] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
            >
              Book
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5ECDE] hover:text-[#E6B25C] rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1A2719] border-b border-[#30452F] px-4 pt-3 pb-6 space-y-2 mt-2 shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                  isItemActive(item.id) 
                    ? 'bg-[#30452F] text-[#E6B25C] font-bold' 
                    : 'text-[#F5ECDE] hover:bg-[#30452F]/50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="bg-[#E6B25C] text-[#1F2E1E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#476346]" />
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-[#30452F] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking();
                }}
                className="w-full bg-gradient-to-r from-[#E6B25C] to-[#C9943B] text-[#1F2E1E] text-center font-bold text-sm py-3 rounded-lg shadow-md"
              >
                Book Appointment Online
              </button>
              <a
                href="tel:+919150022115"
                className="w-full text-center text-[#F5ECDE] hover:text-[#E6B25C] text-xs py-2 border border-[#476346] rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#E6B25C]" />
                Contact Number: +91 91500 22115
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
