import React, { useState, useEffect, useCallback } from 'react';
import { Header, Footer, FloatingActions, ModalRoot } from '@/components';
import { ModalProvider } from '@/context';
import { useModal } from '@/hooks/useModal';
import { VIEWS } from '@/constants/navigation';
import {
  HomeView,
  ServicesView,
  GalleryView,
  FranchiseView,
  OffersView,
  LocationsView,
  AboutView,
  ContactView,
  FaqView,
  LegalView,
  KkNagarInviteView,
} from '@/views';

/**
 * Salon360 Direct Redirect Screen
 */
function Salon360Redirect() {
  const salon360Url =
    import.meta.env.VITE_SALON360_BOOKING_URL ||
    'https://api.salon360app.com/api/online-booking/v1/external/booking?storeId=868&orgId=555';

  useEffect(() => {
    window.location.href = salon360Url;
  }, [salon360Url]);

  return (
    <div className="min-h-screen bg-[#30452F] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-serif text-2xl font-bold mb-2 text-[#E6B25C]">Redirecting to Salon360…</h2>
      <p className="text-sm text-[#9BB899] mb-4">Please wait while we redirect you to the booking portal.</p>
      <a
        href={salon360Url}
        className="px-5 py-2.5 bg-[#E6B25C] text-[#1F2E1E] font-bold text-sm rounded-xl shadow-lg hover:brightness-105"
      >
        Click here if you are not redirected
      </a>
    </div>
  );
}

/**
 * Parses initial view from browser pathname or URL hash
 */
const getViewFromLocation = () => {
  if (typeof window === 'undefined') return VIEWS.HOME;
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();

  if (
    path === 'kknagarinvite' || 
    path === 'kknagarinvite/index.html' ||
    path.startsWith('kknagarinvite') ||
    path === 'kknagar-invite' || 
    path === 'kknagar' ||
    hash === 'kknagarinvite' || 
    hash === 'kknagar-invite' || 
    hash === 'kknagar'
  ) {
    return VIEWS.KKNAGAR_INVITE;
  }
  if (path === 'booking' || hash === 'booking') return VIEWS.BOOKING;
  if (path === 'services' || hash === 'services') return VIEWS.SERVICES;
  if (path === 'offers' || hash === 'offers') return VIEWS.OFFERS;
  if (path === 'gallery' || hash === 'gallery') return VIEWS.GALLERY;
  if (path === 'franchise' || hash === 'franchise') return VIEWS.FRANCHISE;
  if (path === 'locations' || hash === 'locations') return VIEWS.LOCATIONS;
  if (path === 'about' || hash === 'about') return VIEWS.ABOUT;
  if (path === 'contact' || hash === 'contact') return VIEWS.CONTACT;
  if (path === 'faq' || hash === 'faq') return VIEWS.FAQ;
  if (path === 'privacy' || hash === 'privacy') return VIEWS.PRIVACY;
  if (path === 'terms' || hash === 'terms') return VIEWS.TERMS;

  return VIEWS.HOME;
};

/**
 * Inner application layout with view routing and global UI chrome
 */
function MainLayout() {
  const [currentView, setCurrentView] = useState(() => getViewFromLocation());
  const {
    closeBooking,
    openServiceDetail,
    openLightbox,
    openFranchiseModal,
    openRateCard,
    bookingOpen,
  } = useModal();

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((nextView) => {
    setCurrentView(nextView);
    if (typeof window !== 'undefined') {
      const urlMap = {
        [VIEWS.HOME]: '/',
        [VIEWS.SERVICES]: '/services',
        [VIEWS.OFFERS]: '/offers',
        [VIEWS.GALLERY]: '/gallery',
        [VIEWS.FRANCHISE]: '/franchise',
        [VIEWS.LOCATIONS]: '/locations',
        [VIEWS.ABOUT]: '/about',
        [VIEWS.CONTACT]: '/contact',
        [VIEWS.FAQ]: '/faq',
        [VIEWS.PRIVACY]: '/privacy',
        [VIEWS.TERMS]: '/terms',
        [VIEWS.KKNAGAR_INVITE]: '/kknagarinvite',
        [VIEWS.BOOKING]: '/booking',
      };
      const targetUrl = urlMap[nextView] || '/';
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ view: nextView }, '', targetUrl);
      }
    }
  }, []);

  // When any button triggers booking, redirect directly to Salon360
  const handleOpenBooking = useCallback(() => {
    const salon360Url =
      import.meta.env.VITE_SALON360_BOOKING_URL ||
      'https://api.salon360app.com/api/online-booking/v1/external/booking?storeId=868&orgId=555';
    if (typeof window !== 'undefined') {
      window.location.href = salon360Url;
    }
  }, []);

  // If booking modal was ever opened via direct context call, auto-redirect to Salon360
  useEffect(() => {
    if (bookingOpen) {
      closeBooking();
      const salon360Url =
        import.meta.env.VITE_SALON360_BOOKING_URL ||
        'https://api.salon360app.com/api/online-booking/v1/external/booking?storeId=868&orgId=555';
      window.location.href = salon360Url;
    }
  }, [bookingOpen, closeBooking]);

  // View Router
  const renderView = () => {
    switch (currentView) {
      case VIEWS.HOME:
        return (
          <HomeView
            setCurrentView={handleNavigate}
            openBooking={handleOpenBooking}
            openServiceDetail={openServiceDetail}
            openLightbox={openLightbox}
            openFranchiseModal={openFranchiseModal}
            openRateCard={openRateCard}
          />
        );
      case VIEWS.BOOKING:
        return <Salon360Redirect />;
      case VIEWS.SERVICES:
        return (
          <ServicesView
            setCurrentView={handleNavigate}
            openBooking={handleOpenBooking}
            openServiceDetail={openServiceDetail}
            openRateCard={openRateCard}
          />
        );
      case VIEWS.GALLERY:
        return (
          <GalleryView
            openLightbox={openLightbox}
            openBooking={handleOpenBooking}
          />
        );
      case VIEWS.FRANCHISE:
        return (
          <FranchiseView
            openFranchiseModal={openFranchiseModal}
          />
        );
      case VIEWS.OFFERS:
        return (
          <OffersView
            openBooking={handleOpenBooking}
            openRateCard={openRateCard}
          />
        );
      case VIEWS.LOCATIONS:
        return (
          <LocationsView
            openBooking={handleOpenBooking}
          />
        );
      case VIEWS.ABOUT:
        return (
          <AboutView
            openBooking={handleOpenBooking}
            openFranchiseModal={openFranchiseModal}
          />
        );
      case VIEWS.CONTACT:
        return <ContactView />;
      case VIEWS.FAQ:
        return (
          <FaqView
            openBooking={handleOpenBooking}
            openFranchiseModal={openFranchiseModal}
          />
        );
      case VIEWS.PRIVACY:
        return <LegalView initialTab="privacy" />;
      case VIEWS.TERMS:
        return <LegalView initialTab="terms" />;
      case VIEWS.KKNAGAR_INVITE:
        return (
          <KkNagarInviteView
            openBooking={handleOpenBooking}
            openRateCard={openRateCard}
          />
        );
      default:
        return (
          <HomeView
            setCurrentView={handleNavigate}
            openBooking={handleOpenBooking}
            openServiceDetail={openServiceDetail}
            openLightbox={openLightbox}
            openFranchiseModal={openFranchiseModal}
            openRateCard={openRateCard}
          />
        );
    }
  };

  // Standalone Layout for Grand Opening Invitation (Free from Website UI Chrome)
  if (currentView === VIEWS.KKNAGAR_INVITE) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070F09] text-[#F5ECDE] font-sans antialiased">
        <KkNagarInviteView setCurrentView={handleNavigate} openBooking={handleOpenBooking} />
        <ModalRoot />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5ECDE] text-[#1F2E1E] font-sans antialiased">
      {/* Main Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={handleNavigate}
        openBooking={handleOpenBooking}
        openRateCard={openRateCard}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Luxury Footer */}
      <Footer
        setCurrentView={handleNavigate}
        openBooking={handleOpenBooking}
        openRateCard={openRateCard}
      />

      {/* Floating Action Buttons (WhatsApp & ScrollToTop) */}
      <FloatingActions />

      {/* Global Modals Manager */}
      <ModalRoot />
    </div>
  );
}

/**
 * Root Application Component with global providers
 */
export default function App() {
  return (
    <ModalProvider>
      <MainLayout />
    </ModalProvider>
  );
}
