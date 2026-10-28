import React, { useState } from 'react';
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
} from '@/views';

/**
 * Inner application layout with view routing and global UI chrome
 */
function MainLayout() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const {
    openBooking,
    openServiceDetail,
    openLightbox,
    openFranchiseModal,
    openRateCard,
  } = useModal();

  // View Router
  const renderView = () => {
    switch (currentView) {
      case VIEWS.HOME:
        return (
          <HomeView
            setCurrentView={setCurrentView}
            openBooking={openBooking}
            openServiceDetail={openServiceDetail}
            openLightbox={openLightbox}
            openFranchiseModal={openFranchiseModal}
            openRateCard={openRateCard}
          />
        );
      case VIEWS.SERVICES:
        return (
          <ServicesView
            setCurrentView={setCurrentView}
            openBooking={openBooking}
            openServiceDetail={openServiceDetail}
            openRateCard={openRateCard}
          />
        );
      case VIEWS.GALLERY:
        return (
          <GalleryView
            openLightbox={openLightbox}
            openBooking={openBooking}
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
            openBooking={openBooking}
            openRateCard={openRateCard}
          />
        );
      case VIEWS.LOCATIONS:
        return (
          <LocationsView
            openBooking={openBooking}
          />
        );
      case VIEWS.ABOUT:
        return (
          <AboutView
            openBooking={openBooking}
            openFranchiseModal={openFranchiseModal}
          />
        );
      case VIEWS.CONTACT:
        return <ContactView />;
      case VIEWS.FAQ:
        return (
          <FaqView
            openBooking={openBooking}
            openFranchiseModal={openFranchiseModal}
          />
        );
      case VIEWS.PRIVACY:
        return <LegalView initialTab="privacy" />;
      case VIEWS.TERMS:
        return <LegalView initialTab="terms" />;
      default:
        return (
          <HomeView
            setCurrentView={setCurrentView}
            openBooking={openBooking}
            openServiceDetail={openServiceDetail}
            openLightbox={openLightbox}
            openFranchiseModal={openFranchiseModal}
            openRateCard={openRateCard}
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
        openBooking={openBooking}
        openRateCard={openRateCard}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Luxury Footer */}
      <Footer
        setCurrentView={setCurrentView}
        openBooking={openBooking}
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
