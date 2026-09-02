import { Listing, User, Enquiry, Review } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_1',
    email: 'priya.sharma@example.com',
    fullName: 'Priya Sharma',
    phoneNumber: '+91 98230 45678',
    phoneVerified: false, // In phase 1 dev-mode, tracked as unverified until real SMS OTP
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_vendor_1',
    email: 'rajesh@royalpalacebaner.com',
    fullName: 'Rajesh Patil',
    phoneNumber: '+91 98811 22334',
    phoneVerified: false,
    role: 'vendor',
    businessName: 'The Royal Palace & Lawns',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_admin_1',
    email: 'celebratzapp@gmail.com',
    fullName: 'Celebratz Admin Team',
    phoneNumber: '+91 91234 56789',
    phoneVerified: true,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

// Helper to generate dynamic recent & future calendar dates
const getOffsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_LISTINGS: Listing[] = [
  // 1. VENUE: Royal Palace Baner
  {
    id: 'list_venue_1',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    vendorPhone: '+91 98811 22334',
    vendorEmail: 'rajesh@royalpalacebaner.com',
    title: 'The Royal Palace & Lawns',
    category: 'venues',
    eventTypes: ['Wedding', 'Engagement', 'Corporate', 'Birthday'],
    locality: 'Baner',
    address: 'Survey 48/2, Mumbai-Bangalore Highway, Near Pashan Exit, Baner, Pune 411045',
    websiteUrl: 'https://theroyalpalacebaner.com',
    googleMapsUrl: 'https://maps.google.com/?q=The+Royal+Palace+Baner+Pune',
    coordinates: { lat: 18.5590, lng: 73.7868 },
    startingPrice: 150000,
    pricingUnit: 'per_day',
    pricingNote: 'Includes AC Grand Hall + 25,000 sq ft Lush Lawn + 4 AC Bridal Suites',
    pricingPackages: [
      {
        id: 'pkg_rp_1',
        name: 'Standard Day Lawn + Hall',
        price: 150000,
        description: 'Complete access from 7 AM to 11 PM',
        features: ['Up to 1200 Guests', 'AC Banquet Hall (400 pax)', 'Open Lawn (800 pax)', '200 Car Parking', '4 AC Green Rooms', 'Backup Generator'],
        status: 'active'
      },
      {
        id: 'pkg_rp_2',
        name: 'Full Weekend Wedding Package',
        price: 275000,
        description: '2-day access for Sangeet + Wedding + Reception',
        features: ['Full Lawn + Banquet', '6 AC Rooms for Family', 'Bridal Suite with Dressing Lights', 'Valet Parking Team', 'Lawn Stage Setup Base'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      capacityMin: 300,
      capacityMax: 1500,
      venueType: 'Banquet Hall',
      indoorOutdoor: 'Both Indoor & Lawn',
      parkingCapacity: 250,
      cateringPolicy: 'Both allowed',
      hasAC: true,
      roomCount: 6
    },
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'The Royal Palace & Lawns in Baner is one of Western Pune’s premier celebration destinations. Offering an expansive pillarless air-conditioned banquet hall seamlessly connected to a manicured outdoor lawn, it easily accommodates grand weddings, stylish receptions, and corporate galas. Located right off the highway with ample valet parking.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.8,
    reviewCount: 28,
    calendarLastUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (Fresh)
    calendar: {
      [getOffsetDate(2)]: 'booked',
      [getOffsetDate(5)]: 'tentative',
      [getOffsetDate(6)]: 'booked',
      [getOffsetDate(10)]: 'available',
      [getOffsetDate(12)]: 'booked',
      [getOffsetDate(15)]: 'available',
      [getOffsetDate(20)]: 'tentative',
      [getOffsetDate(25)]: 'available'
    },
    createdAt: '2026-06-10T10:00:00Z'
  },

  // 2. VENUE: Koregaon Heritage Club (Stale Calendar demo > 30 days)
  {
    id: 'list_venue_2',
    vendorId: 'user_vendor_2',
    vendorName: 'Koregaon Heritage Club & Lawns',
    vendorPhone: '+91 99220 11445',
    vendorEmail: 'events@koregaonheritage.com',
    title: 'Koregaon Heritage Poolside Lawns',
    category: 'venues',
    eventTypes: ['Engagement', 'Birthday', 'Corporate', 'Wedding'],
    locality: 'Koregaon Park',
    address: 'Lane 7, Near North Main Road, Koregaon Park, Pune 411001',
    websiteUrl: 'https://koregaonheritageclub.com',
    googleMapsUrl: 'https://maps.google.com/?q=Lane+7+Koregaon+Park+Pune',
    coordinates: { lat: 18.5362, lng: 73.8940 },
    startingPrice: 95000,
    pricingUnit: 'per_day',
    pricingNote: 'Boutique greenery venue with heritage canopy & poolside dining',
    pricingPackages: [
      {
        id: 'pkg_khc_1',
        name: 'Boutique Lawn & Deck',
        price: 95000,
        description: 'Ideal for 200 to 450 guests intimate celebrations',
        features: ['Poolside Cabanas', 'Boutique Lawn with Banyan Tree Canopy', 'Sound Limiter compliant till 10 PM', '80 Car Parking Space'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      capacityMin: 100,
      capacityMax: 450,
      venueType: 'Resort',
      indoorOutdoor: 'Outdoor Lawn',
      parkingCapacity: 80,
      cateringPolicy: 'In-house only',
      hasAC: true,
      roomCount: 4
    },
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'An oasis in the heart of KP, surrounded by lush trees, ambient fairy lighting, and serene poolside settings. Designed for chic cocktail nights, mehendi brunches, and fairy-tale engagement celebrations.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.7,
    reviewCount: 19,
    calendarLastUpdatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(), // 38 days ago (STALE DEMO)
    calendar: {
      [getOffsetDate(3)]: 'available',
      [getOffsetDate(7)]: 'booked'
    },
    createdAt: '2026-05-15T08:30:00Z'
  },

  // 3. VENUE: Siddhivinayak Hall Kothrud (Affordable traditional)
  {
    id: 'list_venue_3',
    vendorId: 'user_vendor_3',
    vendorName: 'Siddhivinayak Sanskrutik Bhavan',
    vendorPhone: '+91 94220 88990',
    vendorEmail: 'siddhivinayak.kothrud@gmail.com',
    title: 'Siddhivinayak Sanskrutik Bhavan',
    category: 'venues',
    eventTypes: ['Wedding', 'Engagement', 'Naming Ceremony', 'Birthday'],
    locality: 'Kothrud',
    address: 'Near Karve Statue, Paud Road, Kothrud, Pune 411038',
    websiteUrl: 'https://siddhivinayaksanskrutik.org',
    googleMapsUrl: 'https://maps.google.com/?q=Siddhivinayak+Sanskrutik+Bhavan+Kothrud+Pune',
    coordinates: { lat: 18.5074, lng: 73.8077 },
    startingPrice: 45000,
    pricingUnit: 'per_day',
    pricingNote: 'Air-cooled 2-tier hall with dedicated dining floor and pooja stage',
    categoryAttributes: {
      capacityMin: 150,
      capacityMax: 500,
      venueType: 'Banquet Hall',
      indoorOutdoor: 'Indoor',
      parkingCapacity: 60,
      cateringPolicy: 'Outside catering allowed',
      hasAC: false,
      roomCount: 4
    },
    coverImage: 'https://images.unsplash.com/photo-1544078741-7ea0e0cb8ce8?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544078741-7ea0e0cb8ce8?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'A traditional favorite in Kothrud for Marathi vivah, engagement ceremonies, and naming rituals. Includes separate dining hall on ground floor and stage hall on the first floor.',
    status: 'active',
    isFeatured: false,
    avgRating: 4.5,
    reviewCount: 42,
    calendarLastUpdatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(1)]: 'booked',
      [getOffsetDate(4)]: 'booked',
      [getOffsetDate(8)]: 'available',
      [getOffsetDate(11)]: 'tentative'
    },
    createdAt: '2026-06-01T09:00:00Z'
  },

  // 3B. VENUE: Baner Pavilion Grand Lawns & AC Banquet (Second Baner venue for multi-result testing)
  {
    id: 'list_venue_baner_2',
    vendorId: 'user_vendor_1',
    vendorName: 'Baner Pavilion Hospitality Group',
    vendorPhone: '+91 98223 99881',
    vendorEmail: 'events@banerpavilion.com',
    title: 'Baner Pavilion Grand Lawns & AC Banquet',
    category: 'venues',
    eventTypes: ['Wedding', 'Reception', 'Engagement', 'Corporate'],
    locality: 'Baner',
    address: 'Near Balewadi High Street Link Road, Baner, Pune 411045',
    websiteUrl: 'https://banerpavilion.com',
    googleMapsUrl: 'https://maps.google.com/?q=Baner+High+Street+Pune',
    coordinates: { lat: 18.5635, lng: 73.7780 },
    startingPrice: 120000,
    pricingUnit: 'per_day',
    pricingNote: 'Contemporary AC banquet hall + 18,000 sq ft amphitheater open lawn',
    pricingPackages: [
      {
        id: 'pkg_bp_1',
        name: 'Grand Wedding & Reception Day Package',
        price: 120000,
        description: 'Complete 16-hour rental with AC ballroom & lawn stage',
        features: ['Up to 900 Guests', 'AC Banquet Hall (350 pax)', 'Open Lawn (600 pax)', '150 Car Parking', '3 AC Bridal Suites', 'Sound Limiter till 10 PM'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      capacityMin: 200,
      capacityMax: 900,
      venueType: 'Banquet Hall',
      indoorOutdoor: 'Both Indoor & Lawn',
      parkingCapacity: 150,
      cateringPolicy: 'Both allowed',
      hasAC: true,
      roomCount: 4
    },
    coverImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'Situated near the vibrant Baner high street, Baner Pavilion features an air-conditioned pillarless hall connected to an landscaped lawn with illuminated stone gazebos and modern dressing rooms for bride and groom.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.9,
    reviewCount: 31,
    calendarLastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(2)]: 'available',
      [getOffsetDate(6)]: 'booked',
      [getOffsetDate(14)]: 'available'
    },
    createdAt: '2026-06-15T09:00:00Z'
  },

  // 3C. VENUE: Viman Nagar Skyview Ballroom
  {
    id: 'list_venue_viman_1',
    vendorId: 'user_vendor_2',
    vendorName: 'Skyview Celebrations Viman Nagar',
    vendorPhone: '+91 97654 11223',
    vendorEmail: 'bookings@skyviewviman.com',
    title: 'Skyview Grand Ballroom & Rooftop Lounge',
    category: 'venues',
    eventTypes: ['Wedding', 'Engagement', 'Birthday', 'Corporate'],
    locality: 'Viman Nagar',
    address: 'Near Phoenix Market City, Viman Nagar, Pune 411014',
    websiteUrl: 'https://skyviewballroompune.com',
    googleMapsUrl: 'https://maps.google.com/?q=Viman+Nagar+Pune',
    coordinates: { lat: 18.5679, lng: 73.9143 },
    startingPrice: 110000,
    pricingUnit: 'per_day',
    pricingNote: 'Air-conditioned luxury ballroom + open starry sky terrace deck',
    categoryAttributes: {
      capacityMin: 150,
      capacityMax: 600,
      venueType: 'Hotel Ballroom',
      indoorOutdoor: 'Both Indoor & Lawn',
      parkingCapacity: 120,
      cateringPolicy: 'In-house only',
      hasAC: true,
      roomCount: 5
    },
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'A stylish 5-star standard celebration space in East Pune, ideal for destination weddings, cocktail evenings, and ring ceremonies with valet parking and gourmet catering.',
    status: 'active',
    isFeatured: false,
    avgRating: 4.7,
    reviewCount: 24,
    calendarLastUpdatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(3)]: 'available',
      [getOffsetDate(9)]: 'booked'
    },
    createdAt: '2026-06-20T10:00:00Z'
  },

  // 4. PHOTOGRAPHY: Utsav Moments Kalyani Nagar
  {
    id: 'list_photo_1',
    vendorId: 'user_vendor_4',
    vendorName: 'Utsav Moments Photography',
    vendorPhone: '+91 97650 33221',
    vendorEmail: 'contact@utsavmoments.in',
    title: 'Utsav Moments Wedding Cinema & Photography',
    category: 'photography',
    eventTypes: ['Wedding', 'Engagement', 'Birthday', 'Naming Ceremony'],
    locality: 'Kalyani Nagar',
    address: 'East Avenue, Kalyani Nagar, Pune 411006',
    websiteUrl: 'https://utsavmoments.in',
    startingPrice: 40000,
    pricingUnit: 'per_day',
    pricingNote: '2 Candid Photographers + 1 Cinematographer + 4K Teaser Video',
    pricingPackages: [
      {
        id: 'pkg_um_1',
        name: 'Full Day Wedding Cinema Package',
        price: 55000,
        description: 'Complete coverage from morning rituals to reception',
        features: ['2 Candid Photographers', '1 Traditional Photographer', '1 4K Drone Specialist', '350 Retouched Photos', '3-5 Min Teaser Video + 30 Min Film', 'Deluxe Hardbound Photobook (40 sheets)'],
        status: 'active'
      },
      {
        id: 'pkg_um_2',
        name: 'Single Event Candid + Teaser',
        price: 40000,
        description: 'Ideal for Engagements, Sangeet or Naming Ceremonies',
        features: ['1 Candid Photographer', '1 Cinematographer', '150 Edited Photos', '2-Min Reel / Teaser'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      coverageTypes: ['Candid Photography', 'Cinematic Wedding Film', 'Traditional Photo & Video', '4K Drone Aerial'],
      deliverables: ['High-Res Digital Album', '4K Cinematic Teaser (3 min)', 'Traditional Long Video (45 min)', 'Custom Wedding Album'],
      deliveryTimelineDays: 21,
      equipmentDetails: 'Sony FX3 + Sony A7IV + DJI Mavic 3 Cine + Prime GM Lenses',
      teamSize: 4,
      droneAvailable: true
    },
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'We believe celebrations are made of unscripted joy and genuine laughter. With over 8 years filming luxury weddings across Pune, Mahabaleshwar, and Goa, our Kalyani Nagar team crafts timeless heirloom films and photographs.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.9,
    reviewCount: 34,
    calendarLastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(3)]: 'tentative',
      [getOffsetDate(7)]: 'booked',
      [getOffsetDate(14)]: 'available',
      [getOffsetDate(21)]: 'available'
    },
    createdAt: '2026-06-20T11:00:00Z'
  },

  // 5. CATERING: Maharaja Authentic Caterers Hadapsar
  {
    id: 'list_cater_1',
    vendorId: 'user_vendor_5',
    vendorName: 'Maharaja Authentic Caterers',
    vendorPhone: '+91 98900 55667',
    vendorEmail: 'order@maharajacatererspune.com',
    title: 'Maharaja Royal Marathi & North Indian Catering',
    category: 'catering',
    eventTypes: ['Wedding', 'Engagement', 'Naming Ceremony', 'Corporate'],
    locality: 'Hadapsar',
    address: 'Magarpatta Road, Hadapsar, Pune 411028',
    websiteUrl: 'https://maharajacatererspune.com',
    startingPrice: 650,
    pricingUnit: 'per_plate',
    pricingNote: 'Pure Veg & Jain Grand Thali buffet with live chaat, jalebi & kulfi stations',
    pricingPackages: [
      {
        id: 'pkg_mc_1',
        name: 'Shahi Maharashtrian & North Indian Buffet',
        price: 650,
        description: 'Pure Veg feast with 4 Starters + 3 Sabzis + 2 Sweets + Live Chaat',
        features: ['Puran Poli / Shrikhand', 'Paneer Butter Masala & Bharli Vangi', 'Live Dahi Puri & Sev Puri', 'Basundi & Jalebi Rabdi Counter', 'Mineral Water & Mocktails'],
        status: 'active'
      },
      {
        id: 'pkg_mc_2',
        name: 'Royal Premium Veg & Jain Extravaganza',
        price: 850,
        description: 'Multi-cuisine grand spread with live woodfire pizza & pasta',
        features: ['5 Starters (including Tandoori Broccoli & Crispy Corn)', 'Live Pasta & Wood-fired Pizza Counter', 'Avadhi Dum Biryani & Dal Makhani', 'Exotic Fruit Display & Cold Stone Ice Creams'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      cuisines: ['Maharashtrian', 'North Indian', 'Rajasthani', 'South Indian', 'Live Street Food / Chaat', 'Continental Counters'],
      vegType: 'Pure Veg',
      minGuestCount: 100,
      perPlateVegPrice: 650,
      liveCountersAvailable: true
    },
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'Renowned for hygienic presentation, impeccable uniformed service staff, and unmatched authenticity in traditional flavors. Serving family celebrations in Pune for more than 15 years.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.8,
    reviewCount: 52,
    calendarLastUpdatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(2)]: 'booked',
      [getOffsetDate(9)]: 'available',
      [getOffsetDate(16)]: 'tentative'
    },
    createdAt: '2026-06-05T07:45:00Z'
  },

  // 6. CATERING: Spice Symphony Wakad (Veg & Non-Veg)
  {
    id: 'list_cater_2',
    vendorId: 'user_vendor_6',
    vendorName: 'Spice Symphony Gourmet Caterers',
    vendorPhone: '+91 98224 77889',
    vendorEmail: 'events@spicesymphony.in',
    title: 'Spice Symphony Global & Mughlai Catering',
    category: 'catering',
    eventTypes: ['Corporate', 'Wedding', 'Birthday'],
    locality: 'Wakad',
    address: 'Dutta Mandir Road, Wakad, Pune 411057',
    websiteUrl: 'https://spicesymphonycaterers.in',
    startingPrice: 850,
    pricingUnit: 'per_plate',
    pricingNote: 'Premium Veg & Non-Veg BBQ grills, Biryanis and Asian Dim Sum counters',
    categoryAttributes: {
      cuisines: ['Mughlai', 'Pan Asian', 'Barbeque Grills', 'North Indian', 'Continental'],
      vegType: 'Veg & Non-Veg',
      minGuestCount: 75,
      perPlateVegPrice: 850,
      perPlateNonVegPrice: 1100,
      liveCountersAvailable: true
    },
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'Specializing in corporate offsites, high-energy sangeet parties, and non-veg delicacies such as Dum Biryani, Mutton Rara, and live skewered kebabs.',
    status: 'active',
    isFeatured: false,
    avgRating: 4.6,
    reviewCount: 22,
    calendarLastUpdatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(5)]: 'available'
    },
    createdAt: '2026-06-12T14:00:00Z'
  },

  // 7. DECORATION: Aura Mandap Sinhagad Road
  {
    id: 'list_decor_1',
    vendorId: 'user_vendor_7',
    vendorName: 'Aura Mandap & Floral Decorators',
    vendorPhone: '+91 97300 12340',
    vendorEmail: 'aura.decor.pune@gmail.com',
    title: 'Aura Premium Floral Mandap & Theme Decor',
    category: 'decoration',
    eventTypes: ['Wedding', 'Engagement', 'Naming Ceremony', 'Birthday'],
    locality: 'Sinhagad Road',
    address: 'Near Anand Nagar, Sinhagad Road, Pune 411051',
    websiteUrl: 'https://auramandapdecor.in',
    startingPrice: 35000,
    pricingUnit: 'per_event',
    pricingNote: 'Custom fresh flower mandap + LED truss + Entrance Floral Archway',
    pricingPackages: [
      {
        id: 'pkg_aura_1',
        name: 'Vedic Royal Floral Mandap',
        price: 45000,
        description: 'Exotic marigold, rose & tuberose dome with brass bells',
        features: ['4-Pillar Floral Mandap', 'Grand 20ft Entrance Tunnel', 'Stage Backdrop with Fairy Light Net', 'Carpet Flooring & 2 Bride/Groom Chairs'],
        status: 'active'
      },
      {
        id: 'pkg_aura_2',
        name: 'Pastel Boho Engagement Theme',
        price: 35000,
        description: 'Pampas grass, baby’s breath & customized neon name board',
        features: ['Geometric Arch Backdrop', 'Pampas & Hydrangea Floral Clusters', 'Custom Neon Signboard', 'Warm Edison Lighting setup'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      decorStyles: ['Vedic Traditional Floral', 'Pastel Boho', 'Modern Minimalist', 'Royal Rajasthani Mandap', 'Balloon Garland & Kid Themes'],
      sampleThemes: ['Royal Crimson & Gold', 'Lavender Dreams', 'Forest Green Botanical'],
      includesLighting: true,
      mandapCustomization: true,
      setupTimeHours: 6
    },
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'Transforming plain banquet halls and lawns into awe-inspiring fairytale settings. We source fresh blooms directly from Talegaon and Bangalore markets.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.9,
    reviewCount: 41,
    calendarLastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(2)]: 'available',
      [getOffsetDate(6)]: 'booked'
    },
    createdAt: '2026-06-18T10:15:00Z'
  },

  // 8. DJ & MUSIC: Pune Beats DJ & Dhol Tasha Baner
  {
    id: 'list_dj_1',
    vendorId: 'user_vendor_8',
    vendorName: 'Pune Beats Live & Soundworks',
    vendorPhone: '+91 99755 44112',
    vendorEmail: 'bookings@punebeats.com',
    title: 'DJ Rocky & Pune Beats Sound Extravaganza',
    category: 'music_dj',
    eventTypes: ['Birthday', 'Engagement', 'Wedding', 'Corporate'],
    locality: 'Baner',
    address: 'High Street, Baner, Pune 411045',
    websiteUrl: 'https://punebeatslive.com',
    startingPrice: 22000,
    pricingUnit: 'per_event',
    pricingNote: '5000W RCF Sound + Intelligent Moving Head Lights + 4 Hours DJ Set',
    pricingPackages: [
      {
        id: 'pkg_pb_1',
        name: 'Club Sound & Sangeet DJ Setup',
        price: 22000,
        description: 'Complete 4-hour performance for Sangeet or Birthday',
        features: ['5000W RCF Sound Setup', 'DJ Console + 2 Wireless Shure Mics', '4 Moving Heads + Laser Show', 'Smoke Machine & CO2 Jet Blast'],
        status: 'active'
      },
      {
        id: 'pkg_pb_2',
        name: 'Wedding Grand Combo with Live Puneri Dhol Tasha',
        price: 38000,
        description: 'DJ Night + 8-Member Traditional Dhol Tasha Baarat Entry',
        features: ['Full DJ & Lighting setup', '8-member Dhol Tasha troop for Baraat', 'Tasha Solo + Traditional Nashik Dhol beats'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      genres: ['Bollywood Hits', 'Puneri Marathi EDM', 'Punjabi Bhangra', 'Commercial House', '90s Retro Classics'],
      equipmentIncluded: ['RCF Line Array System', 'Pioneer Nexus Console', 'Shure Wireless Mics', 'Moving Heads Truss', 'Dry Ice Low Smoke'],
      soundWattage: '6000 Watts',
      performanceHours: 4,
      includesDholTasha: true,
      wirelessMicsCount: 4
    },
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'Keep your guests on the dance floor all night long with DJ Rocky and our high-octane live sound engineers. Clean track selections with crowd-pleasing Marathi and Bollywood anthems.',
    status: 'active',
    isFeatured: false,
    avgRating: 4.8,
    reviewCount: 37,
    calendarLastUpdatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(4)]: 'available',
      [getOffsetDate(11)]: 'booked'
    },
    createdAt: '2026-06-11T16:20:00Z'
  },

  // 9. PANDIT / PRIEST: Pandit Vidyadhar Shastri Kothrud
  {
    id: 'list_pandit_1',
    vendorId: 'user_vendor_9',
    vendorName: 'Acharya Vidyadhar Shastri',
    vendorPhone: '+91 94230 66778',
    vendorEmail: 'shastri.vidyadhar@gmail.com',
    title: 'Acharya Vidyadhar Shastri (Vedic Rituals & Vivah)',
    category: 'pandit_priest',
    eventTypes: ['Wedding', 'Engagement', 'Naming Ceremony'],
    locality: 'Kothrud',
    address: 'Near Vedbhavan, Kothrud, Pune 411038',
    websiteUrl: 'https://acharyavidyadharvedic.in',
    startingPrice: 7500,
    pricingUnit: 'per_event',
    pricingNote: 'Vedic Vivah Vidhi / Gruha Pravesh with complete explanations in Marathi or Hindi',
    categoryAttributes: {
      ceremoniesSupported: ['Vedic Vivah (Wedding)', 'Simantonnayan / Dohale Jevan', 'Barshe (Naming Ceremony)', 'Gruhapravesh & Vastu Shanti', 'Satyanarayan Pooja'],
      languages: ['Marathi', 'Hindi', 'Sanskrit', 'English'],
      ritualsIncluded: ['Kanyadaan', 'Saptapadi with Mantra Explanations', 'Laja Homa', 'Mangalashtak Recitation'],
      samagriIncluded: false,
      yearsExperience: 22
    },
    coverImage: 'https://images.unsplash.com/photo-1609137144822-0a4ec998394e?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609137144822-0a4ec998394e?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'With 22+ years of Vedic study and ceremony conduction in Pune, Guruji conducts ceremonies with spiritual warmth and clear contextual translations for modern families and couples.',
    status: 'active',
    isFeatured: true,
    avgRating: 5.0,
    reviewCount: 46,
    calendarLastUpdatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(1)]: 'booked',
      [getOffsetDate(3)]: 'available',
      [getOffsetDate(8)]: 'booked',
      [getOffsetDate(15)]: 'available'
    },
    createdAt: '2026-06-02T12:00:00Z'
  },

  // 10. SISTER LISTING: The Royal Shahi Caterers (Owned by Rajesh Patil / The Royal Palace)
  {
    id: 'list_cater_royal',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    vendorPhone: '+91 98811 22334',
    vendorEmail: 'rajesh@royalpalacebaner.com',
    title: 'The Royal Shahi Caterers & Live Feast Counters',
    category: 'catering',
    eventTypes: ['Wedding', 'Engagement', 'Corporate', 'Birthday'],
    locality: 'Baner',
    address: 'Survey 48/2, Mumbai-Bangalore Highway, Baner, Pune 411045',
    websiteUrl: 'https://theroyalpalacebaner.com/catering',
    startingPrice: 700,
    pricingUnit: 'per_plate',
    pricingNote: 'Grand royal Maharashtrian & Awadhi feast with live jalebi, chaat & mocktails',
    pricingPackages: [
      {
        id: 'pkg_rc_1',
        name: 'Royal Marathi Shahi Thali Buffet',
        price: 700,
        description: 'Authentic pure veg feast with 4 starters, 3 sabzis, 2 sweets & chaat counter',
        features: ['Fresh Puran Poli & Basundi Rabdi', 'Paneer Pasanda & Bharli Vangi', 'Live Dahi Puri Counter', 'Full Mineral Water & Uniformed Waitstaff'],
        status: 'active'
      },
      {
        id: 'pkg_rc_2',
        name: 'Grand Vivah Multi-Cuisine Extravaganza',
        price: 900,
        description: 'Pan-Indian feast with live woodfired pizza, pasta & ice cream teppanyaki',
        features: ['6 Starters + 4 Main Courses', 'Live Italian & Chaat Station', 'Dessert Island with Hot Gulab Jamun & Kulfi', 'Separate Jain & Swaminarayan Counters'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      cuisines: ['Maharashtrian', 'North Indian', 'Chaat & Live Counters', 'Dessert & Mocktail Bar'],
      vegType: 'Pure Veg',
      minGuestCount: 150,
      perPlateVegPrice: 700,
      liveCountersAvailable: true
    },
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'The Royal in-house kitchen brings 15 years of gourmet excellence directly into your event with certified hygienic chefs and live cooking artistry.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.9,
    reviewCount: 38,
    calendarLastUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(2)]: 'booked',
      [getOffsetDate(10)]: 'available'
    },
    createdAt: '2026-06-15T10:00:00Z'
  },

  // 11. SISTER LISTING: The Royal Peshwai & Floral Decor (Owned by Rajesh Patil / The Royal Palace)
  {
    id: 'list_decor_royal',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    vendorPhone: '+91 98811 22334',
    vendorEmail: 'rajesh@royalpalacebaner.com',
    title: 'The Royal Peshwai & Exotic Floral Mandap Decor',
    category: 'decoration',
    eventTypes: ['Wedding', 'Engagement', 'Reception'],
    locality: 'Baner',
    address: 'Survey 48/2, Baner, Pune 411045',
    websiteUrl: 'https://theroyalpalacebaner.com/decor',
    startingPrice: 45000,
    pricingUnit: 'per_event',
    pricingNote: 'Custom Vedic floral mandap, grand entrance tunnel & complete LED ambient lighting',
    pricingPackages: [
      {
        id: 'pkg_rd_1',
        name: 'Royal Peshwai Vedic Mandap',
        price: 45000,
        description: 'Authentic 4-pillar brass bell mandap with fresh Talegaon marigolds and orchids',
        features: ['4-Pillar Grand Vedic Mandap', '25ft Floral Entrance Archway', 'Full LED Truss & Wash Lighting', 'Bridal Walkway Carpet & Floral Pillars'],
        status: 'active'
      },
      {
        id: 'pkg_rd_2',
        name: 'Luxury Crystal & Pastel Floral Dream',
        price: 75000,
        description: 'Imported baby breath, hydrangeas, crystal chandeliers & customized neon backdrop',
        features: ['Giant 30ft Stage Crystal Backdrop', 'Exotic Pastel Floral Structures', 'Intelligent Moving Head Lighting', 'Photo Booth with Personalized Neon Board'],
        status: 'active'
      }
    ],
    categoryAttributes: {
      decorStyles: ['Traditional Vedic Mandap', 'Royal Peshwai / Maratha', 'Floral Luxury & Exotic Blooms'],
      includesLighting: true,
      mandapCustomization: true,
      setupTimeHours: 6
    },
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'Our in-house floral artisans transform the Royal Palace lawn and banquet hall into ethereal celebrations with fresh daily flower deliveries.',
    status: 'active',
    isFeatured: true,
    avgRating: 4.8,
    reviewCount: 29,
    calendarLastUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    calendar: {
      [getOffsetDate(2)]: 'booked',
      [getOffsetDate(6)]: 'booked',
      [getOffsetDate(10)]: 'available'
    },
    createdAt: '2026-06-15T11:00:00Z'
  },

  // 12. PENDING APPROVAL LISTING (For Admin queue testing)
  {
    id: 'list_pending_1',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    vendorPhone: '+91 98811 22334',
    vendorEmail: 'rajesh@royalpalacebaner.com',
    title: 'The Royal Terrace Lounge & Sunset Deck',
    category: 'venues',
    eventTypes: ['Birthday', 'Corporate', 'Engagement'],
    locality: 'Baner',
    address: 'Survey 48/2, Baner, Pune 411045',
    startingPrice: 60000,
    pricingUnit: 'per_day',
    pricingNote: 'Rooftop party deck overlooking Baner hills',
    categoryAttributes: {
      capacityMin: 50,
      capacityMax: 200,
      venueType: 'Terrace',
      indoorOutdoor: 'Both Indoor & Lawn',
      parkingCapacity: 100,
      cateringPolicy: 'Both allowed',
      hasAC: true,
      roomCount: 2
    },
    coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80'
    ],
    description: 'A cozy scenic rooftop venue ideal for sundowner parties, engagement cocktails, and corporate networking in West Pune.',
    status: 'pending_approval',
    isFeatured: false,
    avgRating: 0,
    reviewCount: 0,
    calendarLastUpdatedAt: new Date().toISOString(),
    calendar: {},
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_COMBO_PACKAGES: import('../types').ComboPackage[] = [
  {
    id: 'combo_royal_vivah_1',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    vendorPhone: '+91 98811 22334',
    vendorEmail: 'rajesh@royalpalacebaner.com',
    title: 'Royal Vivah Grand All-in-One Marriage Combo',
    description: 'Complete hassle-free wedding package combining West Pune’s iconic Royal Lawns, authentic Peshwai fresh floral mandap decor, and 500-plate royal Marathi buffet feast from a single verified vendor.',
    includedListingIds: ['list_venue_1', 'list_decor_royal', 'list_cater_royal'],
    includedServices: [
      {
        listingId: 'list_venue_1',
        listingTitle: 'The Royal Palace & Lawns',
        category: 'venues',
        originalPrice: 150000,
        serviceInclusions: [
          'Full AC Banquet Hall + 25,000 sq ft Lush Lawn for 24 hours',
          '4 Deluxe AC Bridal & Family Green Rooms',
          '200-Car Dedicated Valet Parking Team & Backup Generator'
        ]
      },
      {
        listingId: 'list_decor_royal',
        listingTitle: 'The Royal Peshwai & Floral Mandap Decor',
        category: 'decoration',
        originalPrice: 45000,
        serviceInclusions: [
          '4-Pillar Vedic Mandap with Fresh Talegaon Marigolds & Brass Bells',
          'Grand 25ft Entrance Tunnel Archway with Fairy Lights',
          'Full Ambient LED Truss & Spotlight Illumination'
        ]
      },
      {
        listingId: 'list_cater_royal',
        listingTitle: 'The Royal Shahi Caterers & Live Feast',
        category: 'catering',
        originalPrice: 350000,
        serviceInclusions: [
          '500 Plates Pure Veg Royal Buffet Feast',
          'Live Hot Jalebi Rabdi & Pune Chaat Counters',
          'Uniformed Royal Service Staff, Cutlery & Welcome Drinks'
        ]
      }
    ],
    totalOriginalPrice: 545000,
    comboPrice: 465000,
    savingsAmount: 80000,
    savingsPercentage: 15,
    badge: '🌟 Best Value Wedding Combo (Save ₹80,000)',
    eventTypes: ['Wedding', 'Reception', 'Engagement'],
    minGuestCapacity: 300,
    maxGuestCapacity: 1200,
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80',
    features: [
      'Single Point of Contact — Zero vendor coordination headaches',
      'Dedicated On-Site Event Operations Manager throughout the day',
      'Free 4 AC Bridal Dressing Rooms with makeup mirror lighting',
      'Complimentary Welcome Fresh Coconut Water & Mocktails bar',
      'Guaranteed 100% DG Power Backup & Valet Chauffeurs'
    ],
    status: 'active',
    city: 'pune',
    locality: 'Baner',
    createdAt: '2026-06-25T10:00:00Z'
  },
  {
    id: 'combo_engagement_deluxe_1',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    vendorPhone: '+91 98811 22334',
    vendorEmail: 'rajesh@royalpalacebaner.com',
    title: 'Royal Sakharpuda (Engagement & Sangeet) Combo',
    description: 'Perfect celebration package for engagements, sakharpuda and sangeet parties with banquet hall access, pastel floral backdrop, and 200-plate royal spread.',
    includedListingIds: ['list_venue_1', 'list_decor_royal', 'list_cater_royal'],
    includedServices: [
      {
        listingId: 'list_venue_1',
        listingTitle: 'The Royal Palace & Lawns',
        category: 'venues',
        originalPrice: 100000,
        serviceInclusions: ['AC Banquet Hall for 8 Hours', '2 AC Bridal Suites', 'Ample Parking']
      },
      {
        listingId: 'list_decor_royal',
        listingTitle: 'The Royal Peshwai & Floral Mandap Decor',
        category: 'decoration',
        originalPrice: 35000,
        serviceInclusions: ['Pastel Arch Backdrop with Neon Ring Sign', 'Stage Lighting & Ring Ceremony Pedestal']
      },
      {
        listingId: 'list_cater_royal',
        listingTitle: 'The Royal Shahi Caterers',
        category: 'catering',
        originalPrice: 140000,
        serviceInclusions: ['200 Plates Gourmet Buffet with Live Chaat Station', 'Dessert Counter']
      }
    ],
    totalOriginalPrice: 275000,
    comboPrice: 235000,
    savingsAmount: 40000,
    savingsPercentage: 15,
    badge: '💍 Sakharpuda Special Combo',
    eventTypes: ['Engagement', 'Birthday', 'Naming Ceremony'],
    minGuestCapacity: 100,
    maxGuestCapacity: 350,
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
    features: [
      'Zero coordination stress with 1 trusted vendor team',
      'Personalized neon couple name board included',
      'DJ Sound console & wireless microphones included for ring ceremony'
    ],
    status: 'active',
    city: 'pune',
    locality: 'Baner',
    createdAt: '2026-06-28T14:00:00Z'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq_101',
    kind: 'booking_request',
    listingId: 'list_venue_1',
    listingTitle: 'The Royal Palace & Lawns',
    listingCategory: 'venues',
    listingLocality: 'Baner',
    listingCoverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&auto=format&fit=crop&q=80',
    vendorId: 'user_vendor_1',
    vendorName: 'The Royal Palace & Lawns',
    customerId: 'user_cust_1',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98230 45678',
    requestType: 'request_to_book',
    eventType: 'Wedding',
    eventDate: getOffsetDate(45), // Future date
    guestCount: 650,
    preferredVisitTime: 'Saturday 4:00 PM for lawn inspection',
    message: 'Looking to book the lawn and AC banquet hall for my brother’s wedding reception. We would like to visit the premises this weekend to discuss custom stage setup and catering options.',
    consentGiven: true,
    vendorStatus: 'accepted',
    vendorResponseNote: 'Thank you Priya! We have tentatively blocked this date. Looking forward to welcoming you this Saturday at 4 PM.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'enq_102',
    kind: 'enquiry',
    listingId: 'list_photo_1',
    listingTitle: 'Utsav Moments Wedding Cinema & Photography',
    listingCategory: 'photography',
    listingLocality: 'Kalyani Nagar',
    listingCoverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&auto=format&fit=crop&q=80',
    vendorId: 'user_vendor_4',
    vendorName: 'Utsav Moments Photography',
    customerId: 'user_cust_1',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98230 45678',
    requestType: 'general_enquiry',
    eventType: 'Engagement',
    eventDate: getOffsetDate(-10), // PAST date (Eligible for Review!)
    guestCount: 150,
    message: 'Enquiring about your engagement package and whether drone footage is included for an outdoor lawn evening.',
    consentGiven: true,
    vendorStatus: 'accepted',
    vendorResponseNote: 'Great connecting over phone! We completed the event coverage wonderfully.',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    listingId: 'list_venue_1',
    customerId: 'user_cust_2',
    customerName: 'Amol Deshmukh',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Outstanding experience for our 800-guest wedding',
    reviewText: 'We booked the full lawn and AC hall for our wedding in Baner. The management was extremely cooperative, parking was smoothly managed by their team, and the bridal suites were spotless.',
    eventDate: '2026-05-18',
    eventType: 'Wedding',
    status: 'published',
    createdAt: '2026-05-22T10:00:00Z'
  },
  {
    id: 'rev_2',
    listingId: 'list_photo_1',
    customerId: 'user_cust_3',
    customerName: 'Sneha & Rohan Kulkarni',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Captured the emotions of our sangeet so beautifully!',
    reviewText: 'Utsav Moments team was punctual, polite, and worked unobtrusively during rituals. The teaser video was delivered in 6 days and brought tears of joy to our parents.',
    eventDate: '2026-04-12',
    eventType: 'Engagement',
    status: 'published',
    createdAt: '2026-04-20T14:30:00Z'
  }
];
