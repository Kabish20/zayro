import React, { useState, useEffect, useCallback } from 'react';
import { Header, Footer, FloatingActions, ModalRoot } from '@/components';
import { ModalProvider } from '@/context';
import { useModal } from '@/hooks/useModal';
import { VIEWS } from '@/constants/navigation';
import {
  HomeView,
  BookingView,
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
    preselectedService,
    openServiceDetail,
    closeServiceDetail,
    openLightbox,
    closeLightbox,
    openFranchiseModal,
    closeFranchiseModal,
    openRateCard,
    closeRateCard,
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

  // When any button triggers booking, navigate cleanly to the dedicated booking portal
  const handleOpenBooking = useCallback((_service) => {
    closeBooking?.();
    closeServiceDetail?.();
    closeRateCard?.();
    closeLightbox?.();
    closeFranchiseModal?.();
    handleNavigate(VIEWS.BOOKING);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [closeBooking, closeServiceDetail, closeRateCard, closeLightbox, closeFranchiseModal, handleNavigate]);

  // If booking modal was ever opened via direct context call, navigate to booking portal
  useEffect(() => {
    if (bookingOpen) {
      closeBooking();
      handleNavigate(VIEWS.BOOKING);
    }
  }, [bookingOpen, closeBooking, handleNavigate]);

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
        return (
          <BookingView
            onBack={() => handleNavigate(VIEWS.HOME)}
            preselectedService={preselectedService}
          />
        );
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
