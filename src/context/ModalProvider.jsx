import React, { useState, useCallback } from 'react';
import { ModalContext } from './modalContextDef';

/**
 * ModalProvider manages state and openers/closers for all application modals.
 * Allows triggering any modal from any component without prop-drilling.
 */
export function ModalProvider({ children }) {
  // 1. Booking Modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);

  // 2. Service Detail Modal
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // 3. Lightbox Modal
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 4. Franchise Inquiry Modal
  const [franchiseModalOpen, setFranchiseModalOpen] = useState(false);

  // 5. Rate Card Modal
  const [rateCardOpen, setRateCardOpen] = useState(false);

  // Booking handlers
  const openBooking = useCallback((service = null) => {
    setPreselectedService(service);
    setBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingOpen(false);
    setPreselectedService(null);
  }, []);

  // Service Detail handlers
  const openServiceDetail = useCallback((service) => {
    setSelectedService(service);
    setServiceDetailOpen(true);
  }, []);

  const closeServiceDetail = useCallback(() => {
    setServiceDetailOpen(false);
    setSelectedService(null);
  }, []);

  // Lightbox handlers
  const openLightbox = useCallback((items, index = 0) => {
    setLightboxItems(items || []);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Franchise Inquiry handlers
  const openFranchiseModal = useCallback(() => {
    setFranchiseModalOpen(true);
  }, []);

  const closeFranchiseModal = useCallback(() => {
    setFranchiseModalOpen(false);
  }, []);

  // Rate Card handlers
  const openRateCard = useCallback(() => {
    setRateCardOpen(true);
  }, []);

  const closeRateCard = useCallback(() => {
    setRateCardOpen(false);
  }, []);

  const value = {
    // Booking
    bookingOpen,
    preselectedService,
    openBooking,
    closeBooking,

    // Service Detail
    serviceDetailOpen,
    selectedService,
    openServiceDetail,
    closeServiceDetail,

    // Lightbox
    lightboxOpen,
    lightboxItems,
    lightboxIndex,
    setLightboxIndex,
    openLightbox,
    closeLightbox,

    // Franchise
    franchiseModalOpen,
    openFranchiseModal,
    closeFranchiseModal,

    // Rate Card
    rateCardOpen,
    openRateCard,
    closeRateCard,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;

