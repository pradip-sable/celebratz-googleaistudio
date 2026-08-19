export interface CityConfig {
  id: string;
  name: string;
  state: string;
  status: 'active' | 'upcoming';
  tagline: string;
  badge: string;
  popularHubs: string[];
  localities: string[];
  signatureSpecialties: string[];
  landmarkVenuesText: string;
  waitlistCount?: number;
}

export const CITIES: CityConfig[] = [
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    status: 'active',
    tagline: 'Cultural Capital & Celebration Hub of Maharashtra',
    badge: 'Live Marketplace',
    popularHubs: ['Baner', 'Koregaon Park', 'Kothrud', 'Wakad', 'Viman Nagar', 'Hinjewadi'],
    localities: [
      'Baner',
      'Koregaon Park',
      'Kothrud',
      'Wakad',
      'Kalyani Nagar',
      'Hadapsar',
      'Viman Nagar',
      'Sinhagad Road',
      'Aundh',
      'Hinjewadi',
      'Bavdhan',
      'Magarpatta City',
      'Pimple Saudagar',
      'Shivajinagar',
      'Camp / MG Road',
      'Senapati Bapat Road',
      'PCMC / Nigdi',
      'Wagholi',
      'Kharadi'
    ],
    signatureSpecialties: [
      'Peshwai & Maharashtrian Vedic Weddings',
      'Lush Hillside Lawns & Farmhouses',
      'Puneri Dhol Tasha & Shehnai Troupes',
      'Authentic Maharashtrian Ukadiche Modak Catering'
    ],
    landmarkVenuesText: 'Baner banquet lawns, Koregaon Park luxury spaces & Kothrud heritage halls'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    status: 'upcoming',
    tagline: 'Maximum City Luxury Banquets & Coastal Grandeur',
    badge: 'Coming Soon • Phase 2',
    popularHubs: ['Bandra', 'Juhu', 'Andheri West', 'Powai', 'South Mumbai'],
    localities: [
      'Bandra West',
      'Juhu',
      'Andheri West',
      'Powai',
      'South Mumbai / Colaba',
      'Lower Parel',
      'Worli Seaface',
      'Thane West',
      'Navi Mumbai / Vashi',
      'Goregaon East',
      'Borivali West',
      'Santacruz / BKC'
    ],
    signatureSpecialties: [
      'Sea-facing Rooftops & Five-Star Ballrooms',
      'Bollywood & High-Glamour Sangeet Productions',
      'Gourmet Multi-Cuisine Fusion Catering'
    ],
    landmarkVenuesText: 'Bandra seafront estates, Juhu beachfront ballrooms & BKC five-star conventions'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    status: 'upcoming',
    tagline: 'Silicon Valley Garden Weddings & Contemporary Banquets',
    badge: 'Coming Soon • Phase 2',
    popularHubs: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Hebbal'],
    localities: [
      'Indiranagar',
      'Koramangala',
      'Whitefield',
      'HSR Layout',
      'Jayanagar',
      'Hebbal & Palace Grounds',
      'Sarjapur Road',
      'MG Road / Central',
      'JP Nagar',
      'Malleshwaram',
      'Yelahanka'
    ],
    signatureSpecialties: [
      'Palace Grounds Royal Pavilions',
      'Contemporary Glasshouse & Lawn Weddings',
      'Traditional South Indian Muhurtham Mandaps'
    ],
    landmarkVenuesText: 'Palace Grounds royal lawns, Hebbal luxury resorts & Whitefield garden banquets'
  },
  {
    id: 'delhi_ncr',
    name: 'Delhi NCR',
    state: 'Delhi / NCR',
    status: 'upcoming',
    tagline: 'Grand Royal Celebrations & Lavish Farmhouse Weddings',
    badge: 'Coming Soon • Phase 3',
    popularHubs: ['Chattarpur Farms', 'South Delhi', 'Gurugram Golf Course', 'Noida Expressway'],
    localities: [
      'Chattarpur Farms',
      'South Delhi / Greater Kailash',
      'Gurugram Golf Course Rd',
      'Gurugram Cyber City',
      'Noida Sector 62 / Expressway',
      'Vasant Kunj',
      'Aerocity',
      'Connaught Place',
      'Dwarka',
      'Faridabad'
    ],
    signatureSpecialties: [
      'Extravagant Multi-Acre Farmhouse Mandaps',
      'Dilli-Style Royal Sufi & Bollywood DJ Nights',
      'Mughlai & Chaat Live Gourmet Counters'
    ],
    landmarkVenuesText: 'Chattarpur luxury farmhouses, Aerocity 5-star ballrooms & Gurugram estates'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    status: 'upcoming',
    tagline: 'Nizami Grandeur & High-Tech Convention Banquets',
    badge: 'Coming Soon • Phase 3',
    popularHubs: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Secunderabad'],
    localities: [
      'Banjara Hills',
      'Jubilee Hills',
      'Gachibowli',
      'Madhapur / Hitec City',
      'Secunderabad',
      'Financial District',
      'Kondapur',
      'Begumpet',
      'Kukatpally',
      'Shamshabad'
    ],
    signatureSpecialties: [
      'Royal Nizami Palace Courtyards',
      'Authentic Hyderabadi Dum Biryani & Mirchi Ka Salan',
      'Modern High-Capacity Convention Centers'
    ],
    landmarkVenuesText: 'Jubilee Hills lawns, Banjara Hills grand ballrooms & Hitec City mega conventions'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    status: 'upcoming',
    tagline: 'Royal Heritage Haveli & Destination Wedding Capital',
    badge: 'Destination Hub • Phase 3',
    popularHubs: ['Amer Road', 'C-Scheme', 'Mansarovar', 'Vaishali Nagar', 'Tonk Road'],
    localities: [
      'Amer Road Heritage Belt',
      'C-Scheme / Civil Lines',
      'Mansarovar',
      'Vaishali Nagar',
      'Tonk Road / Sitapura',
      'Kukas Royal Resort Belt',
      'Malviya Nagar',
      'Ajmer Highway Resorts'
    ],
    signatureSpecialties: [
      'Heritage Fort & Palace Destination Weddings',
      'Royal Rajasthani Rajwada Decor & Folk Troupes',
      'Dal Baati Churma & Shahi Royal Thali'
    ],
    landmarkVenuesText: 'Kukas royal resorts, Amer heritage palaces & Tonk road destination lawns'
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    status: 'upcoming',
    tagline: 'Sun-Kissed Beachfront & Portuguese Heritage Weddings',
    badge: 'Beach Destination • Phase 3',
    popularHubs: ['North Goa Beachside', 'South Goa 5-Star Resorts', 'Panaji / Mandovi', 'Candolim'],
    localities: [
      'North Goa / Candolim & Calangute',
      'South Goa / Cavelossim & Benaulim',
      'Panaji / Mandovi Riverfront',
      'Anjuna & Vagator',
      'Morjim & Ashwem',
      'Utorda & Majorda Beachfront'
    ],
    signatureSpecialties: [
      'Sunset Beach Altar Ceremonies',
      'Portuguese Colonial Courtyard Receptions',
      'Live Goan & International Acoustic Bands'
    ],
    landmarkVenuesText: 'South Goa beach resorts, North Goa boutique villas & Mandovi luxury catamarans'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    status: 'upcoming',
    tagline: 'Heritage Pol Spaces, Grand Party Plots & Garba Nights',
    badge: 'Coming Soon • Phase 4',
    popularHubs: ['SG Highway', 'Bodakdev', 'Sindhu Bhavan Road', 'Satellite'],
    localities: [
      'SG Highway Party Plots',
      'Sindhu Bhavan Road',
      'Bodakdev',
      'Satellite',
      'Prahlad Nagar',
      'Navrangpura',
      'Bopal / South Bopal',
      'Gandhinagar Highway'
    ],
    signatureSpecialties: [
      'Grand Open-Air Party Plots & Garba Lawns',
      '100% Pure Veg Royal Gujarati & Kathiyawadi Feasts',
      'Vibrant Mehendi & Sangeet Setup Designers'
    ],
    landmarkVenuesText: 'Sindhu Bhavan party plots, SG Highway mega lawns & Heritage Haveli courtyards'
  }
];

export const DEFAULT_CITY_ID = 'pune';

export const getCityById = (cityId: string = DEFAULT_CITY_ID): CityConfig => {
  return CITIES.find(c => c.id === cityId) || CITIES[0];
};

export const getLocalitiesForCity = (cityId: string = DEFAULT_CITY_ID): string[] => {
  const city = getCityById(cityId);
  return city ? city.localities : CITIES[0].localities;
};

export const getPopularHubsForCity = (cityId: string = DEFAULT_CITY_ID): string[] => {
  const city = getCityById(cityId);
  return city ? city.popularHubs : CITIES[0].popularHubs;
};
