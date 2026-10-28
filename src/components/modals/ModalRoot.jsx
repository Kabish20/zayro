import React from 'react';
import { useModal } from '@/hooks/useModal';
import BookingModal from './BookingModal';
import ServiceDetailModal from './ServiceDetailModal';
import LightboxModal from './LightboxModal';
import FranchiseInquiryModal from './FranchiseInquiryModal';
import RateCardModal from './RateCardModal';

/**
 * ModalRoot renders all global application modals connected to ModalContext.
 * Placing this once at the app root eliminates manual modal wiring across pages.
 */
export default function ModalRoot() {
  const {
    bookingOpen,
    preselectedService,
    closeBooking,
    openBooking,

    serviceDetailOpen,
    selectedService,
    closeServiceDetail,

    lightboxOpen,
    lightboxItems,
    lightboxIndex,
    setLightboxIndex,
    closeLightbox,

    franchiseModalOpen,
    closeFranchiseModal,

    rateCardOpen,
    closeRateCard,
  } = useModal();

  return (
    <>
      <BookingModal
        isOpen={bookingOpen}
        onClose={closeBooking}
        preselectedService={preselectedService}
      />

      <ServiceDetailModal
        service={selectedService}
        isOpen={serviceDetailOpen}
        onClose={closeServiceDetail}
        openBooking={openBooking}
      />

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
        openBooking={openBooking}
      />

      <FranchiseInquiryModal
        isOpen={franchiseModalOpen}
        onClose={closeFranchiseModal}
      />

      <RateCardModal
        isOpen={rateCardOpen}
        onClose={closeRateCard}
        openBooking={openBooking}
      />
    </>
  );
}
