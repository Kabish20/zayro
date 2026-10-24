// ZAYRO Men's Grooming - Official Rate Card & Combo Offers Data
// Extracted from official brand brochure: "LUXURY MADE AFFORDABLE"
// Website: www.zayrosalon.com | Social: @zayro.coming_soon

export const rateCardServices = [
  {
    id: 'rate-haircut',
    name: 'Haircut',
    price: '₹99',
    numericPrice: 99,
    duration: '30 mins',
    tagline: 'Precision scissor and clipper cut crafted for your head shape',
    description: 'Clean architectural haircut tailored to individual South Asian hair texture and growth pattern. Includes styling consultation and clean hairline finish.'
  },
  {
    id: 'rate-shave',
    name: 'Shave',
    price: '₹50',
    numericPrice: 50,
    duration: '20 mins',
    tagline: 'Traditional warm lather razor shave & soothing finish',
    description: 'Classic barber shave with rich lather, sterilized razor blade, hot towel wrap, and soothing antiseptic balm to prevent razor burn.'
  },
  {
    id: 'rate-kids-cut',
    name: 'Kids Cut',
    price: '₹75',
    numericPrice: 75,
    duration: '25 mins',
    tagline: 'Gentle, patient scissor styling for junior gentlemen',
    description: 'Fun and gentle styling experience designed for boys. Patient master barbers ensure a neat, cool, and comfortable haircut.'
  },
  {
    id: 'rate-oil-massage',
    name: 'Oil Massage',
    price: '₹199',
    numericPrice: 199,
    duration: '15 mins',
    tagline: '15 mins invigorating scalp massage with clarifying hair wash',
    description: 'Therapeutic warm botanical oil infused into the scalp with acupressure finger work to relieve mental stress and stimulate follicles, followed by a refreshing hair wash.'
  },
  {
    id: 'rate-hair-colour',
    name: 'Hair Colour',
    price: '₹349',
    numericPrice: 349,
    duration: '45 mins',
    tagline: 'Global hair color & natural grey coverage',
    description: 'Gentle ammonia-free formulation delivering rich, long-lasting natural black or brown tones with smooth grey coverage and scalp protection.'
  },
  {
    id: 'rate-face-cleanup',
    name: 'Face Cleanup',
    price: '₹299',
    numericPrice: 299,
    duration: '35 mins',
    tagline: 'Deep pore clarifying cleanse and instant glow',
    description: 'Multi-stage facial cleanse removing trapped dust, excess sebum, and blackheads. Finished with an herbal cooling pack for fresh, radiant skin.'
  }
];

export const comboOffers = [
  {
    id: 'combo-1',
    comboNumber: 1,
    title: 'Combo 1: Essential Haircut, Beard & Oil Massage',
    shortTitle: 'Combo 1',
    price: '₹299',
    numericPrice: 299,
    originalPrice: '₹448',
    saveText: 'Save 33%',
    badge: 'Best Value Starter',
    category: 'Essential Grooming',
    tagline: 'Any Haircut + Beard Trim (Zero) + Oil Massage (15 mins Includes Massage & Hair Wash)',
    description: 'The ultimate affordable grooming foundation. Enjoy your choice of precision haircut, zero-gap beard trimming, and a 15-minute invigorating oil massage complete with hair wash.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Oil Massage (15 mins Includes Massage & Hair Wash)'
    ],
    duration: '45 mins',
    popular: true
  },
  {
    id: 'combo-2',
    comboNumber: 2,
    title: 'Combo 2: Haircut, Beard Trim, De-Tan & Oil Massage',
    shortTitle: 'Combo 2',
    price: '₹399',
    numericPrice: 399,
    originalPrice: '₹647',
    saveText: 'Save 38%',
    badge: 'Most Popular',
    category: 'Essential Grooming',
    tagline: 'Any Haircut + Beard Trim (Zero) + De-Tan + Oil Massage (15 mins Includes Massage & Hair Wash)',
    description: 'Erase sun tan and fatigue in one session. Full precision cut, zero beard trim, cooling herbal face de-tan pack, and a 15-minute tension-relieving oil massage with wash.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Herbal Face De-Tan Treatment',
      'Oil Massage (15 mins Includes Massage & Hair Wash)'
    ],
    duration: '60 mins',
    popular: true
  },
  {
    id: 'combo-3',
    comboNumber: 3,
    title: 'Combo 3: Haircut, Beard Trim & Any Cleanup',
    shortTitle: 'Combo 3',
    price: '₹499',
    numericPrice: 499,
    originalPrice: '₹748',
    saveText: 'Save 33%',
    badge: 'Customer Choice',
    category: 'Clean & Fresh',
    tagline: 'Any Haircut + Beard Trim (Zero) + Any Clean Up',
    description: 'Keep your face sharp and skin glowing. Pair your custom haircut and zero-gap beard shaping with any clarifying deep pore cleanup of your preference.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Any Clean Up (Deep pore clarifying & glow pack)'
    ],
    duration: '60 mins',
    popular: true
  },
  {
    id: 'combo-4',
    comboNumber: 4,
    title: 'Combo 4: Haircut, Beard, Global Hair Color & Face-Neck De-Tan',
    shortTitle: 'Combo 4',
    price: '₹599',
    numericPrice: 599,
    originalPrice: '₹947',
    saveText: 'Save 37%',
    badge: 'Youthful Reset',
    category: 'Color & Detan',
    tagline: 'Any Haircut + Beard Trim (Zero) + Global Hair Color* + Face & Neck De-Tan',
    description: 'Turn back the clock with rich, ammonia-free global hair color, clean razor beard contouring, bespoke haircut, and dual face and neck de-tan exfoliation.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Global Hair Color* (Ammonia-free formulation)',
      'Face & Neck De-Tan Therapy'
    ],
    duration: '75 mins',
    popular: false
  },
  {
    id: 'combo-5',
    comboNumber: 5,
    title: 'Combo 5: Haircut, Beard Trim & Gold / Diamond Facial',
    shortTitle: 'Combo 5',
    price: '₹699',
    numericPrice: 699,
    originalPrice: '₹1,198',
    saveText: 'Save 42%',
    badge: 'Radiant Glow',
    category: 'Facial Luxury',
    tagline: 'Any Haircut + Beard Trim (Zero) + Gold or Diamond Facial',
    description: 'Special occasion readiness with intense radiance. Precision haircut, zero beard trim, and your choice of 24K Gold or Diamond skin illumination facial.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Gold or Diamond Radiance Facial (Full 5-step protocol)'
    ],
    duration: '75 mins',
    popular: true
  },
  {
    id: 'combo-6',
    comboNumber: 6,
    title: 'Combo 6: Haircut, Beard, Dandruff/Hairfall Therapy & Full Arms De-Tan',
    shortTitle: 'Combo 6',
    price: '₹799',
    numericPrice: 799,
    originalPrice: '₹1,398',
    saveText: 'Save 43%',
    badge: 'Scalp Therapy',
    category: 'Clinical Care',
    tagline: 'Any Haircut + Beard Trim (Zero) + Dandruff or Hairfall Treatment + Full Arms De-Tan',
    description: 'Targeted scalp wellness meets comprehensive tanning removal. Treats chronic dandruff or root hairfall while exfoliating full arms, along with a precision haircut and beard trim.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Dandruff or Hairfall Treatment (Clinical follicular stimulation)',
      'Full Arms De-Tan Treatment'
    ],
    duration: '90 mins',
    popular: false
  },
  {
    id: 'combo-7',
    comboNumber: 7,
    title: 'Combo 7: Haircut, Beard, Nourishing Protein Treatment & Face-Neck De-Tan',
    shortTitle: 'Combo 7',
    price: '₹899',
    numericPrice: 899,
    originalPrice: '₹1,548',
    saveText: 'Save 42%',
    badge: 'Hair Repair',
    category: 'Hair Therapy',
    tagline: 'Any Haircut + Beard Trim (Zero) + Nourishing Protein Treatment + Face & Neck De-Tan',
    description: 'Deep keratin and botanical protein replenishment to strengthen dry, frizzy, or chemically treated strands. Combined with haircut, zero beard sculpt, and face & neck de-tan.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Nourishing Protein Treatment for Hair Follicles',
      'Face & Neck De-Tan Cleansing'
    ],
    duration: '90 mins',
    popular: false
  },
  {
    id: 'combo-8',
    comboNumber: 8,
    title: 'Combo 8: Haircut, Beard, Glo Vite Facial & 15-Min Oil Massage',
    shortTitle: 'Combo 8',
    price: '₹999',
    numericPrice: 999,
    originalPrice: '₹1,748',
    saveText: 'Save 43%',
    badge: 'Executive VIP',
    category: 'Facial Luxury',
    tagline: 'Any Haircut + Beard Trim (Zero) + Glo Vite Facial + Oil Massage (15 mins, Includes Massage & Hair Wash)',
    description: 'Comprehensive VIP pampering. Features high-performance Glo Vite dermatological skin lightening facial, signature haircut, zero beard sculpt, and 15-minute acupressure oil massage with hair wash.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Glo Vite Radiance Facial',
      'Oil Massage (15 mins, Includes Massage & Hair Wash)'
    ],
    duration: '100 mins',
    popular: true
  },
  {
    id: 'combo-9',
    comboNumber: 9,
    title: 'Combo 9: Haircut, Beard, Face-Neck De-Tan & Detox Hair Spa (Oil Shots)',
    shortTitle: 'Combo 9',
    price: '₹1199',
    numericPrice: 1199,
    originalPrice: '₹2,098',
    saveText: 'Save 43%',
    badge: 'Detox Spa',
    category: 'Spa & Wellness',
    tagline: 'Any Haircut + Beard Trim (Zero) + Face & Neck De-Tan + Detox Hair Spa (With Oil Shots)',
    description: 'Deep hair follicle detox with concentrated oil ampoule shots to eliminate pollution residue and balance sebum. Complemented by custom cut, beard zero trim, and face & neck de-tan.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Face & Neck De-Tan Exfoliation',
      'Detox Hair Spa (With Concentrated Oil Shots)'
    ],
    duration: '110 mins',
    popular: false
  },
  {
    id: 'combo-10',
    comboNumber: 10,
    title: 'Combo 10: Haircut, Beard, Hair Spa (Dry/Repair) & Oxy Radiance Facial',
    shortTitle: 'Combo 10',
    price: '₹1499',
    numericPrice: 1499,
    originalPrice: '₹2,598',
    saveText: 'Save 42%',
    badge: 'Grand Luxury Experience',
    category: 'Grand Luxury',
    tagline: 'Any Haircut + Beard Trim (Zero) + Hair Spa (Dry / Repair) + Oxy Radiance Facial',
    description: 'The pinnacle of ZAYRO grooming indulgence. Restores damaged cuticles with specialized Dry/Repair Hair Spa and recharges the skin with hyperbaric Oxy Radiance Facial, plus signature haircut and beard trim.',
    includes: [
      'Any Haircut of Choice',
      'Beard Trim (Zero finish)',
      'Hair Spa (Dry / Repair Intensive Therapy)',
      'Oxy Radiance Oxygen-Infusion Facial'
    ],
    duration: '120 mins',
    popular: true
  }
];

// ZAYRO Salon - Official Membership Plans (From Brand Assets)
export const membershipPlans = [
  {
    id: 'membership-silver',
    tier: 'SILVER',
    name: 'ZAYRO SILVER',
    duration: '02 MONTHS MEMBERSHIP',
    price: '₹259',
    numericPrice: 259,
    theme: 'light',
    tagline: 'Your everyday grooming membership.',
    badgeType: 'silver',
    bgColor: 'bg-[#F9F6F0]',
    borderColor: 'border-stone-300',
    titleColor: 'text-stone-800',
    priceColor: 'text-stone-900',
    textColor: 'text-stone-700',
    dividerColor: 'border-stone-300',
    quoteColor: 'text-stone-500',
    includes: [
      '3 Haircuts',
      '1 Beard Trim'
    ]
  },
  {
    id: 'membership-gold',
    tier: 'GOLD',
    name: 'ZAYRO GOLD',
    duration: '05 MONTHS MEMBERSHIP',
    price: '₹549',
    numericPrice: 549,
    theme: 'dark-green',
    tagline: 'More grooming. More value.',
    badgeType: 'gold',
    bgColor: 'bg-[#223928]',
    borderColor: 'border-[#E6B25C]/40',
    titleColor: 'text-[#E6B25C]',
    priceColor: 'text-white',
    textColor: 'text-[#E8EFE8]',
    dividerColor: 'border-white/15',
    quoteColor: 'text-[#E6B25C]',
    popular: true,
    includes: [
      '5 Haircuts',
      '3 Beard Trims',
      '1 Hair Wash',
      '10% off selected additional services'
    ]
  },
  {
    id: 'membership-platinum',
    tier: 'PLATINUM',
    name: 'ZAYRO PLATINUM',
    duration: '11 MONTHS MEMBERSHIP',
    price: '₹1,099',
    numericPrice: 1099,
    theme: 'light',
    tagline: 'Elevated grooming. Exceptional care.',
    badgeType: 'platinum',
    bgColor: 'bg-[#F9F6F0]',
    borderColor: 'border-stone-300',
    titleColor: 'text-stone-800',
    priceColor: 'text-stone-900',
    textColor: 'text-stone-700',
    dividerColor: 'border-stone-300',
    quoteColor: 'text-stone-500',
    includes: [
      '11 Haircuts',
      '5 Beard Trims',
      '3 Hair Washes',
      '1 Complimentary Oil Massage',
      '1 Clean-up',
      '15% off selected additional services'
    ]
  },
  {
    id: 'membership-diamond',
    tier: 'DIAMOND',
    name: 'ZAYRO DIAMOND',
    duration: '12 MONTHS MEMBERSHIP',
    price: '₹1,999',
    numericPrice: 1999,
    theme: 'deep-emerald',
    tagline: 'The ultimate ZAYRO grooming privilege.',
    badgeType: 'diamond',
    bgColor: 'bg-[#152619]',
    borderColor: 'border-[#E6B25C]/60',
    titleColor: 'text-[#E6B25C]',
    priceColor: 'text-white',
    textColor: 'text-[#E8EFE8]',
    dividerColor: 'border-[#E6B25C]/30',
    quoteColor: 'text-[#E6B25C]',
    isDiamond: true,
    includes: [
      'Unlimited Haircuts',
      'Unlimited Beard Trims',
      '4 Hair Washes',
      '3 Complimentary Oil Massages',
      '2 Clean-ups',
      '15% off selected additional services'
    ]
  }
];

// Default packagesData export maps directly to all 10 Combos for backward compatibility and full showcase
export const packagesData = comboOffers;

export const faqList = [
  {
    category: 'Appointments',
    question: 'How do I book an appointment or Combo Offer at ZAYRO?',
    answer: 'You can book directly via our online enquiry form, choose any of our 10 official Combo Offers (starting from ₹299), or click "Book via WhatsApp" to instantly message our salon desk. Appointments are confirmed within 15 minutes.'
  },
  {
    category: 'Services',
    question: 'Are all 10 Combo Offers available at every ZAYRO location?',
    answer: 'Yes! All 10 Combo Offers (from Combo 1 at ₹299 to Combo 10 at ₹1,499) as well as our standard rate card services (Haircut ₹99, Shave ₹50, Kids Cut ₹75, Oil Massage ₹199, Hair Colour ₹349, Face Cleanup ₹299) are universally honored across all ZAYRO branches under our "Luxury Made Affordable" brand guarantee.'
  },
  {
    category: 'Services',
    question: 'What does "Any Haircut + Beard Trim (Zero)" in the Combos include?',
    answer: 'You can choose any haircut style (classic scissor taper, fade, textured crop, or pompadour) tailored by our master barbers, accompanied by a razor-sharp zero-gap clipper/razor beard trim and cheek line definition.'
  },
  {
    category: 'Services',
    question: 'What products are used for Hair Colour and Facials?',
    answer: 'We exclusively use premium, ammonia-free dermatologically tested color creams and gentle herbal skincare products (Oxy, Gold, Diamond, and Glo Vite) that protect South Asian skin from redness and prevent hair dryness.'
  },
  {
    category: 'Appointments',
    question: 'What is your cancellation or rescheduling policy?',
    answer: 'We appreciate at least 2 hours advance notice for rescheduling or cancellations so we can allocate that master barber slot to waitlisted gentlemen.'
  },
  {
    category: 'Franchise',
    question: 'What are the criteria to become a ZAYRO Men’s Grooming franchise partner?',
    answer: 'We seek passionate entrepreneurs or investors with suitable commercial real estate (800 to 2,000 sq.ft in high-street or premium residential zones) and capital between ₹28 to ₹55 Lakhs depending on the FOCO or FOFO model selected.'
  }
];
