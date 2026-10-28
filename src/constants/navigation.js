/**
 * Navigation and View Constants
 * Central registry of all top-level views and main header navigation links.
 */

export const VIEWS = {
  HOME: 'home',
  SERVICES: 'services',
  OFFERS: 'offers',
  GALLERY: 'gallery',
  FRANCHISE: 'franchise',
  LOCATIONS: 'locations',
  ABOUT: 'about',
  CONTACT: 'contact',
  FAQ: 'faq',
  PRIVACY: 'privacy',
  TERMS: 'terms',
};

export const NAV_ITEMS = [
  { id: VIEWS.HOME, label: 'Home' },
  { id: VIEWS.SERVICES, label: 'Services' },
  { id: 'packages', targetView: VIEWS.OFFERS, label: 'Offers & Combos', badge: '10' },
  { id: VIEWS.GALLERY, label: 'Gallery' },
  { id: VIEWS.FRANCHISE, label: 'Franchise', badge: 'Hot' },
  { id: VIEWS.LOCATIONS, label: 'Salons' },
  { id: VIEWS.ABOUT, label: 'About' },
  { id: VIEWS.CONTACT, label: 'Contact' },
];

