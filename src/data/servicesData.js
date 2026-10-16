export const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'haircut', name: 'Haircuts & Tapers' },
  { id: 'grooming', name: 'Beard & Shaving' },
  { id: 'scalp', name: 'Scalp & Hair Therapy' },
  { id: 'skincare', name: 'Facial & De-Tan' },
  { id: 'wedding', name: "Royal Groom's Lounge" },
];

export const services = [
  {
    id: 'asian-couture-cut',
    category: 'haircut',
    name: 'ZAYRO Signature Couture Cut',
    tagline: 'Precision scissor & razor architecture for South Asian male hair textures',
    price: '₹400',
    duration: '45 mins',
    image: '/images/services/signature_cut.jpg',
    description: 'Bespoke precision scissor and razor technique tailored to South Asian male hair density, crown swirl patterns, facial bone structure, and natural growth. Includes deep botanical cleanse and signature styling.',
    highlights: ['Bespoke face contouring', 'Deep scalp clarifying wash', 'Matte clay styling finish'],
    benefits: [
      'Tailored layering designed specifically for thick and wavy Indian hair strands',
      'Effortless daily styling retention lasting up to 6-8 weeks',
      'Infused with scalp-nourishing botanicals for healthy root balance'
    ],
    steps: [
      'Personalized consultation & crown swirl diagnosis',
      'Clarifying botanical hair bath & tension-relief scalp massage',
      'Precision architectural sectioning & scissor cutting',
      'Dry texturizing for weightless volume and natural movement',
      'Luxury blow-dry and matte clay application'
    ],
    recommendedFor: 'Gentlemen seeking an architectural haircut that maintains structure and sharp edges effortlessly.'
  },
  {
    id: 'master-skin-fade',
    category: 'haircut',
    name: 'Master Low/Mid Skin Fade & Crop',
    tagline: 'Seamless razor taper with textured crown movement',
    price: '₹500',
    duration: '50 mins',
    image: '/images/services/skin_fade.jpg',
    description: 'High-precision clipper and foil-shaver skin fade transitioning seamlessly into a textured French crop or messy quiff. Finished with surgical razor-sharp hairline detailing and neck shave.',
    highlights: ['Zero-gap foil shaver fade', 'Surgical straight razor lineup', 'Crown texturizing cut'],
    benefits: [
      'Crisp surgical fade that stays clean and sharp for 3-4 weeks',
      'Eliminates puffiness from thick South Asian side hair profiles',
      'Finished with antiseptic cold mint tonic'
    ],
    steps: [
      'Head shape analysis and fade height mapping',
      'Graduated clipper tapering from zero to crown length',
      'Point-cutting and razor texturizing across crown',
      'Foil shaver buffing and straight-edge neck lineup',
      'Soothing witch hazel compress and sea salt spray finish'
    ],
    recommendedFor: 'Men wanting sharp, modern street-style fades with low daily maintenance.'
  },
  {
    id: 'royal-beard-sculpt',
    category: 'grooming',
    name: 'Royal Hot Towel Beard Sculpt & Shave',
    tagline: 'Traditional barber craftsmanship meets modern luxury',
    price: '₹300',
    duration: '40 mins',
    image: '/images/services/beard_shave.jpg',
    description: 'Full sensory grooming ritual with eucalyptus-steamed hot towels, warm sandalwood lather, precision straight-razor detailing, and cold stone pore sealing.',
    highlights: ['Dual-steam herbal infusion', 'Straight-edge razor definition', 'Beard cuticle nourishing balm'],
    benefits: [
      'Crisp, symmetrical cheek and neckline contours',
      'Exfoliates under-beard dead skin and prevents ingrown hairs',
      'Conditions coarse beard whiskers with organic argan and jojoba oils'
    ],
    steps: [
      'Beard length assessment and clipper contouring',
      'Pre-shave essential oil application & hot steamed towel wrap',
      'Warm foam straight razor lining and crisp detailing',
      'Cool mint towel compress to calm epidermis',
      'Sandalwood aftershave balm and beard butter massage'
    ],
    recommendedFor: 'Gentlemen seeking razor-sharp beard architecture and deep facial relaxation.'
  },
  {
    id: 'botanical-scalp-spa',
    category: 'scalp',
    name: 'Ayurvedic Botanical Scalp Spa & Head Massage',
    tagline: 'Holistic scalp renewal and follicular revitalization',
    price: '₹500',
    duration: '60 mins',
    image: '/images/services/spa.jpg',
    description: 'Therapeutic scalp detox utilizing micro-mist waterfall therapy, Indian head acupressure, and organic bhringraj-rosemary botanical elixirs to strengthen hair roots.',
    highlights: ['Micro-mist steam hydrotherapy', 'Acupressure meridian scalp massage', 'Deep follicular purifying scrub'],
    benefits: [
      'Clears sebum buildup, hard-water mineral residue, and environmental pollution',
      'Stimulates micro-circulation for thicker, healthier hair follicles',
      'Deeply eases mental fatigue, migraines, and screen stress'
    ],
    steps: [
      'High-resolution microscopic scalp pore analysis',
      'Botanical exfoliating scrub & gentle silicone bristle massage',
      'Warm herbal water cascade hydro-therapy wash',
      'Aromatherapy scalp acupressure & neck tension release',
      'Follicle-activating peptide serum infusion & blow-dry'
    ],
    recommendedFor: 'Clients suffering from scalp irritation, hair thinning, or corporate stress.'
  },
  {
    id: 'luxury-hydra-facial',
    category: 'skincare',
    name: 'Gentleman’s Charcoal Detox & Hydra-Facial',
    tagline: 'Deep pore vacuum extraction and instant matte radiance',
    price: '₹700',
    duration: '60 mins',
    image: '/images/services/facial.jpg',
    description: 'Multi-step clinical glow facial that extracts pollution impurities, removes tan, and drenches male skin in hyaluronic acid, niacinamide, and cooling peptide serums.',
    highlights: ['Non-invasive vortex extraction', 'Activated charcoal detox bath', 'Cryo-globe skin tightening'],
    benefits: [
      'Removes stubborn dirt, blackheads, and sun tan without redness or irritation',
      'Restores skin moisture barrier after pollution and shaving irritation',
      'Gives clear, non-greasy, healthy matte radiance'
    ],
    steps: [
      'Double cleanse with enzymatic charcoal foam',
      'Salicylic acid vortex exfoliation & painless blackhead extraction',
      'High-potency antioxidant serum infusion',
      'Cryo-globe lymphatic drainage and tightening',
      'Soothing peptide sheet mask under relaxing LED light'
    ],
    recommendedFor: 'Gentlemen looking to clear clogged pores, erase tanning, and revitalize tired skin.'
  },
  {
    id: 'royal-groom-experience',
    category: 'wedding',
    name: 'The Royal Indian Groom’s Wedding Lounge Ritual',
    tagline: 'Comprehensive bespoke grooming for the regal South Asian groom',
    price: '₹1,200',
    duration: '180 mins',
    image: '/images/services/groom_punjabi.jpg',
    description: 'An elite multi-hour private suite ritual crafted exclusively for the Indian groom before the wedding, reception, or sangeet. Includes signature haircut, royal beard sculpt, 24K gold glow facial, and ayurvedic head spa.',
    highlights: ['Private VIP Groom Lounge suite', '24K Gold radiance skin treatment', 'Turban/sehra tie styling assistance'],
    benefits: [
      'Flawless camera-ready skin and razor-sharp grooming for high-definition photography',
      'Relieves wedding-week anxiety through restorative head & neck acupressure',
      'Complete head-to-beard perfection tailored to traditional sherwani attire'
    ],
    steps: [
      'Groom style consultation & sherwani color harmonization',
      'ZAYRO Signature Couture Cut & hairline taper',
      'Royal hot towel sandalwood shave & beard sculpt',
      '24K Gold detan radiance facial with cryo-tightening',
      'Ayurvedic head, neck, and shoulder acupressure spa',
      'Complimentary gourmet coffee or herbal refreshment in VIP suite'
    ],
    recommendedFor: 'Grooms and groomsmen seeking head-to-toe regal wedding day perfection.'
  },
  {
    id: 'executive-beard-taper',
    category: 'grooming',
    name: 'Executive Beard Trim & Cuticle Conditioning',
    tagline: 'Precision clipper contouring with organic beard butter',
    price: '₹200',
    duration: '25 mins',
    image: '/images/gallery/beard_groom.jpg',
    description: 'Fast, meticulous beard shapeup with clipper fade blending into sideburns, crisp razor cheek lines, and nourishing organic cedarwood beard butter massage.',
    highlights: ['Seamless sideburn blend', 'Razor cheekbone line', 'Organic cedarwood butter'],
    benefits: [
      'Maintains neat professional beard geometry between big services',
      'Softens stiff beard prickles and eliminates itchiness',
      'Quick 25-minute executive lunch-break service'
    ],
    steps: [
      'Length adjustment and density graduation',
      'Precision razor cheek lineup',
      'Neck taper and clipper cleanup',
      'Warm towel press and beard balm application'
    ],
    recommendedFor: 'Busy professionals needing a fast, sharp weekly beard maintenance routine.'
  },
  {
    id: 'intensive-anti-hairfall',
    category: 'scalp',
    name: 'Intensive Follicular Anti-Hairfall Therapy',
    tagline: 'Clinical hair root fortification and micro-circulation',
    price: '₹600',
    duration: '50 mins',
    image: '/images/gallery/ayurveda_head.jpg',
    description: 'Targeted trichological treatment combining high-frequency ozone therapy, biotin-peptide micro-infusion, and herbal follicle stimulant massage to combat male pattern thinning.',
    highlights: ['High-frequency ozone stimulation', 'Biotin-caffeine peptide infusion', 'Root-anchoring herbal serum'],
    benefits: [
      'Strengthens weakened hair shafts at the dermal papilla',
      'Stimulates micro-capillary blood supply to sleepy follicles',
      'Reduces excessive shedding caused by hard water and stress'
    ],
    steps: [
      'Trichoscope root density mapping',
      'Gentle salicylic scalp clarifying cleanse',
      'High-frequency thermal ozone comb stimulation',
      'Acupressure meridian scalp and cervical massage',
      'Leave-in peptide growth serum infusion'
    ],
    recommendedFor: 'Men observing early crown thinning, receding hairline, or seasonal hair fall.'
  }
];
