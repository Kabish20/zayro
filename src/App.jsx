import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import LightboxModal from './components/LightboxModal';
import FranchiseInquiryModal from './components/FranchiseInquiryModal';

import HomeView from './views/HomeView';
import ServicesView from './views/ServicesView';
import GalleryView from './views/GalleryView';
import FranchiseView from './views/FranchiseView';
import OffersView from './views/OffersView';
import LocationsView from './views/LocationsView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import FaqView from './views/FaqView';
import LegalView from './views/LegalView';

import { ArrowUp, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Modals state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);

  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [franchiseModalOpen, setFranchiseModalOpen] = useState(false);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleOpenBooking = (service = null) => {
    setPreselectedService(service);
    setBookingOpen(true);
  };

  const handleOpenServiceDetail = (service) => {
    setSelectedService(service);
    setServiceDetailOpen(true);
  };

  const handleOpenLightbox = (items, index) => {
    setLightboxItems(items);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenFranchise = () => {
    setFranchiseModalOpen(true);
  };

  // View Router
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            setCurrentView={setCurrentView}
            openBooking={handleOpenBooking}
            openServiceDetail={handleOpenServiceDetail}
            openLightbox={handleOpenLightbox}
            openFranchiseModal={handleOpenFranchise}
          />
        );
      case 'services':
        return (
          <ServicesView
            openBooking={handleOpenBooking}
            openServiceDetail={handleOpenServiceDetail}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            openLightbox={handleOpenLightbox}
            openBooking={handleOpenBooking}
          />
        );
      case 'franchise':
        return (
          <FranchiseView
            openFranchiseModal={handleOpenFranchise}
          />
        );
      case 'offers':
        return (
          <OffersView
            openBooking={handleOpenBooking}
          />
        );
      case 'locations':
        return (
          <LocationsView
            openBooking={handleOpenBooking}
          />
        );
      case 'about':
        return (
          <AboutView
            openBooking={handleOpenBooking}
            openFranchiseModal={handleOpenFranchise}
          />
        );
      case 'contact':
        return <ContactView />;
      case 'faq':
        return (
          <FaqView
            openBooking={handleOpenBooking}
            openFranchiseModal={handleOpenFranchise}
          />
        );
      case 'privacy':
        return <LegalView initialTab="privacy" />;
      case 'terms':
        return <LegalView initialTab="terms" />;
      default:
        return (
          <HomeView
            setCurrentView={setCurrentView}
            openBooking={handleOpenBooking}
            openServiceDetail={handleOpenServiceDetail}
            openLightbox={handleOpenLightbox}
            openFranchiseModal={handleOpenFranchise}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5ECDE] text-[#1F2E1E] font-sans antialiased">
      
      {/* Main Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        openBooking={handleOpenBooking}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Luxury Footer */}
      <Footer
        setCurrentView={setCurrentView}
        openBooking={handleOpenBooking}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3">
        {/* Floating WhatsApp Quick Concierge */}
        <a
          href="https://wa.me/919150022115?text=Hello%20ZAYRO%20Salon%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20an%20appointment%20or%20franchise."
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 p-2.5 sm:p-3 group border-2 border-white/50"
          title="Chat on WhatsApp"
          aria-label="WhatsApp"
        >
          <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="sr-only">WhatsApp</span>
        </a>

        {/* Back to top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#30452F] text-[#E6B25C] hover:bg-[#476346] hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 border border-[#E6B25C]/30"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Interactive Modals */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedService={preselectedService}
      />

      <ServiceDetailModal
        service={selectedService}
        isOpen={serviceDetailOpen}
        onClose={() => setServiceDetailOpen(false)}
        openBooking={handleOpenBooking}
      />

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
        openBooking={handleOpenBooking}
      />

      <FranchiseInquiryModal
        isOpen={franchiseModalOpen}
        onClose={() => setFranchiseModalOpen(false)}
      />

    </div>
  );
}
