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
  phoneDisplay: '+91 91500 22115',
  phoneRaw: '919150022115',
  telLink: 'tel:+919150022115',
  email: 'partner@zayroclub.com',
  mailLink: 'mailto:partner@zayroclub.com',
  hours: '10:00 AM – 9:30 PM (All 7 Days)',
  openingDays: 'Monday to Sunday',
  
  social: {
    instagram: {
      handle: '@zayro.coming_soon',
      url: 'https://www.instagram.com/zayro.coming_soon?srtk=YWpzaXZpNWtiZGlr&utm_source=qr',
    },
    facebook: {
      handle: '@zayro.saloon',
      url: 'https://www.facebook.com/share/1879j1nK1w/?mibextid=wwXIfr',
    },
  },
};

/**
 * Generate formatted WhatsApp link with prefilled text
 * @param {string} text Message body
 * @param {string} phone Raw phone number (digits only)
 * @returns {string} WhatsApp direct link
 */
export const getWhatsAppUrl = (
  text = 'Hello ZAYRO Salon Concierge, I would like to inquire about an appointment or franchise.',
  phone = CONTACT.phoneRaw
) => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

