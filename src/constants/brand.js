/**
 * ZAYRO Brand & Contact Constants
 * Single source of truth for brand metadata, communication channels, and social links.
 */

export const BRAND = {
  name: 'ZAYRO',
  fullName: "ZAYRO Men's Grooming Lounge",
  tagline: 'Luxury Made Affordable',
  subtitle: "Elite Men's Grooming Lounge & Franchise Collective",
  description:
    "ZAYRO is an elite men's grooming lounge delivering precision razor fades, bespoke beard architecture, traditional hot towel shaves, clinical scalp therapy, and high-margin salon franchise opportunities.",
  website: 'https://www.zayrosalon.com',
  domain: 'zayrosalon.com',
  logo: '/images/logo/Transparent Logo.png',
  favicon: '/favicon.svg',
};

export const CONTACT = {
  phoneDisplay: '+91 79042 42311',
  phoneRaw: '917904242311',
  telLink: 'tel:+917904242311',
  franchisePhone: '7200279002',
  franchisePhoneDisplay: '+91 72002 79002',
  franchisePhoneRaw: '917200279002',
  franchiseTelLink: 'tel:+917200279002',
  email: 'partner@zayroclub.com',
  mailLink: 'mailto:partner@zayroclub.com',
  hours: '7:00 AM – 9:00 PM (Monday - Sunday)',
  openingDays: 'Monday to Sunday',
  
  social: {
    instagram: {
      handle: '@zayro.saloon',
      url: 'https://www.instagram.com/zayro.saloon',
    },
    facebook: {
      handle: '@zayro.saloon',
      url: 'https://www.facebook.com/zayro.saloon',
    },
    youtube: {
      handle: '@zayro.saloon',
      url: 'https://www.youtube.com/@zayro.saloon',
    },
  },
};

export const FRANCHISE_CONTACT = {
  phone: '7200279002',
  phoneDisplay: '+91 72002 79002',
  phoneRaw: '917200279002',
  telLink: 'tel:+917200279002',
  email: 'partner@zayroclub.com',
  mailLink: 'mailto:partner@zayroclub.com',
  whatsappUrl: 'https://wa.me/917200279002',
};

/**
 * Generate formatted WhatsApp link with prefilled text
 * @param {string} text Message body
 * @param {string} phone Raw phone number (digits only)
 * @returns {string} WhatsApp direct link
 */
export const getWhatsAppUrl = (
  text = 'Hello ZAYRO Salon Concierge, I would like to inquire about an appointment or services.',
  phone = CONTACT.phoneRaw
) => {
  // Sanitize phone to digits only to prevent any parameter injection or protocol tampering
  const cleanPhone = String(phone || '').replace(/\D/g, '') || CONTACT.phoneRaw;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate formatted WhatsApp link for franchise inquiries
 * @param {string} text Message body
 * @returns {string} WhatsApp direct link
 */
export const getFranchiseWhatsAppUrl = (
  text = 'Hello ZAYRO Franchise Team, I am interested in a ZAYRO Salon Franchise Opportunity.'
) => {
  return `https://wa.me/${FRANCHISE_CONTACT.phoneRaw}?text=${encodeURIComponent(text)}`;
};

