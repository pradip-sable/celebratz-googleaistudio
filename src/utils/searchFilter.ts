import { Listing, CategoryId, EventType } from '../types';
import { PUNE_LOCALITIES } from '../data/categories';

export interface ParsedSearchQuery {
  rawQuery: string;
  detectedCity?: string;
  detectedLocality?: string;
  detectedCategory?: CategoryId;
  detectedEventType?: EventType;
  detectedGuestCount?: number;
  keywords: string[];
  isParsed: boolean;
}

const STOP_WORDS = new Set([
  'in', 'at', 'for', 'near', 'the', 'and', 'of', 'a', 'an', 'with', 'to', 
  'best', 'top', 'all', 'luxury', 'budget', 'affordable', 'services', 'service',
  'pune', 'maharashtra', 'india', 'by', 'on', 'from'
]);

// Category keyword mappings
const CATEGORY_KEYWORD_MAP: Record<string, CategoryId> = {
  // Venues
  venue: 'venues',
  venues: 'venues',
  banquet: 'venues',
  banquets: 'venues',
  hall: 'venues',
  halls: 'venues',
  lawn: 'venues',
  lawns: 'venues',
  resort: 'venues',
  resorts: 'venues',
  farmhouse: 'venues',
  farmhouses: 'venues',
  ballroom: 'venues',
  terrace: 'venues',
  ground: 'venues',
  bhavan: 'venues',
  sanskrutik: 'venues',

  // Photography
  photo: 'photography',
  photos: 'photography',
  photography: 'photography',
  photographer: 'photography',
  photographers: 'photography',
  cinema: 'photography',
  cinematography: 'photography',
  cinematographer: 'photography',
  candid: 'photography',
  drone: 'photography',
  videography: 'photography',
  videographer: 'photography',
  shoot: 'photography',
  teaser: 'photography',
  album: 'photography',
  film: 'photography',
  filmmaker: 'photography',

  // Catering
  cater: 'catering',
  caterer: 'catering',
  caterers: 'catering',
  catering: 'catering',
  food: 'catering',
  buffet: 'catering',
  thali: 'catering',
  cook: 'catering',
  chef: 'catering',
  chaat: 'catering',
  jalebi: 'catering',
  sweets: 'catering',
  cateringservice: 'catering',
  kitchen: 'catering',

  // Decoration
  decor: 'decoration',
  decors: 'decoration',
  decorator: 'decoration',
  decorators: 'decoration',
  decoration: 'decoration',
  decorations: 'decoration',
  mandap: 'decoration',
  mandaps: 'decoration',
  floral: 'decoration',
  flowers: 'decoration',
  stage: 'decoration',
  lighting: 'decoration',
  balloon: 'decoration',
  backdrop: 'decoration',
  theme: 'decoration',
  themes: 'decoration',

  // DJ & Music
  dj: 'music_dj',
  djs: 'music_dj',
  music: 'music_dj',
  sound: 'music_dj',
  sounds: 'music_dj',
  soundworks: 'music_dj',
  dhol: 'music_dj',
  tasha: 'music_dj',
  audio: 'music_dj',
  speaker: 'music_dj',
  speakers: 'music_dj',
  band: 'music_dj',

  // Pandit / Priest
  pandit: 'pandit_priest',
  pandits: 'pandit_priest',
  priest: 'pandit_priest',
  priests: 'pandit_priest',
  guruji: 'pandit_priest',
  shastri: 'pandit_priest',
  acharya: 'pandit_priest',
  bhatji: 'pandit_priest',
  pooja: 'pandit_priest',
  puja: 'pandit_priest',
  havan: 'pandit_priest',
  vidhi: 'pandit_priest',
  vedic: 'pandit_priest',
  purohit: 'pandit_priest'
};

// Event types keyword mapping
const EVENT_KEYWORD_MAP: Record<string, EventType> = {
  wedding: 'Wedding',
  weddings: 'Wedding',
  vivah: 'Wedding',
  marriage: 'Wedding',
  shaadi: 'Wedding',
  sangeet: 'Wedding',
  mehendi: 'Wedding',
  haldi: 'Wedding',
  baraat: 'Wedding',
  baarat: 'Wedding',
  
  reception: 'Reception',
  receptions: 'Reception',

  engagement: 'Engagement',
  engagements: 'Engagement',
  sakharpuda: 'Engagement',
  ring: 'Engagement',
  roka: 'Engagement',

  birthday: 'Birthday',
  birthdays: 'Birthday',
  bday: 'Birthday',
  anniversary: 'Birthday',
  party: 'Birthday',

  naming: 'Naming Ceremony',
  barshe: 'Naming Ceremony',
  barse: 'Naming Ceremony',
  dohale: 'Naming Ceremony',
  jevan: 'Naming Ceremony',
  godhbharai: 'Naming Ceremony',
  babyshower: 'Naming Ceremony',

  corporate: 'Corporate',
  conference: 'Corporate',
  seminar: 'Corporate',
  annual: 'Corporate',
  offsite: 'Corporate'
};

// Known Pune and general localities
const KNOWN_LOCALITIES: string[] = [
  'Koregaon Park',
  'Kalyani Nagar',
  'Viman Nagar',
  'Sinhagad Road',
  'Pimple Saudagar',
  'Senapati Bapat Road',
  'Magarpatta City',
  'Magarpatta',
  'Camp / MG Road',
  'MG Road',
  'Camp',
  'PCMC / Nigdi',
  'PCMC',
  'Nigdi',
  'Baner',
  'Kothrud',
  'Wakad',
  'Hadapsar',
  'Aundh',
  'Hinjewadi',
  'Bavdhan',
  'Shivajinagar',
  'Wagholi',
  'Kharadi',
  'Pashan',
  'Model Colony',
  'Erandwane',
  'Bibwewadi',
  'Katraj',
  'Dhankawadi',
  'Kondhwa',
  'Undri',
  'Wanowrie',
  'Dhanori',
  'Ravet',
  'Tathawade',
  'Punawale',
  'Moshi',
  'Chakan',
  'Talegaon',
  'Lonavala'
];

/**
 * Parses user search query into structured search intent:
 * - Detects locality (e.g., "Baner", "Koregaon Park", "Hadapsar")
 * - Detects category (e.g., "venue", "catering", "photography", "dj", "pandit")
 * - Detects celebration/event type (e.g., "wedding", "birthday", "engagement")
 * - Extracts clean search keywords for titles and descriptions
 */
export function parseSearchQuery(
  rawQuery: string,
  extraLocalities: string[] = []
): ParsedSearchQuery {
  if (!rawQuery || !rawQuery.trim()) {
    return {
      rawQuery: '',
      keywords: [],
      isParsed: false
    };
  }

  const cleanedQuery = rawQuery.toLowerCase().trim();
  let remainingText = cleanedQuery;

  // 1. Detect Locality (Sort longer multi-word names first to prevent partial collision)
  let detectedLocality: string | undefined = undefined;
  const allLocalities = Array.from(new Set([...extraLocalities, ...KNOWN_LOCALITIES, ...PUNE_LOCALITIES]));
  allLocalities.sort((a, b) => b.length - a.length);

  for (const loc of allLocalities) {
    const locLower = loc.toLowerCase();
    // Check if the query contains this locality as a whole word or phrase
    const regex = new RegExp(`\\b${locLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(remainingText)) {
      detectedLocality = loc;
      remainingText = remainingText.replace(regex, ' ');
      break;
    }
  }

  // 2. Detect Category
  let detectedCategory: CategoryId | undefined = undefined;
  // Multi-word category phrases first
  const multiWordCategories: [RegExp, CategoryId][] = [
    [/\b(banquet hall|hotel ballroom|marriage lawn|wedding lawn|wedding venue|party lawn|farm house|marriage garden)\b/gi, 'venues'],
    [/\b(wedding photography|candid photo|candid photography|drone shoot|wedding cinema|pre wedding)\b/gi, 'photography'],
    [/\b(pure veg catering|veg catering|non veg catering|catering service|live counter|buffet feast)\b/gi, 'catering'],
    [/\b(mandap decor|floral decor|theme decor|stage decoration|balloon decoration|flower decoration)\b/gi, 'decoration'],
    [/\b(dhol tasha|dj sound|sound system|dj music|live band)\b/gi, 'music_dj'],
    [/\b(vedic vivah|naming ceremony|griha pravesh|vastu shanti|satyanarayan pooja)\b/gi, 'pandit_priest']
  ];

  for (const [pattern, cat] of multiWordCategories) {
    if (pattern.test(remainingText)) {
      detectedCategory = cat;
      remainingText = remainingText.replace(pattern, ' ');
      break;
    }
  }

  // Single word categories
  const words = remainingText.split(/[\s,+/&|]+/).filter(Boolean);
  const leftoverWords: string[] = [];

  for (const word of words) {
    const normalized = word.toLowerCase();
    if (!detectedCategory && CATEGORY_KEYWORD_MAP[normalized]) {
      detectedCategory = CATEGORY_KEYWORD_MAP[normalized];
      continue;
    }

    if (STOP_WORDS.has(normalized)) {
      continue;
    }

    leftoverWords.push(normalized);
  }

  // 3. Detect Event Type from original query or words
  let detectedEventType: EventType | undefined = undefined;
  for (const [key, eventType] of Object.entries(EVENT_KEYWORD_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(cleanedQuery)) {
      detectedEventType = eventType;
      break;
    }
  }

  // 4. Detect Guest Count (e.g., "300 guests", "500 people", "100 pax", "250 person")
  let detectedGuestCount: number | undefined = undefined;
  const guestCountMatch = remainingText.match(/\b(\d{2,5})\s*(?:guests?|people|pax|persons?|invitees?|members?)\b/i);
  if (guestCountMatch) {
    detectedGuestCount = parseInt(guestCountMatch[1], 10);
    remainingText = remainingText.replace(guestCountMatch[0], ' ');
  }

  // Clean keywords
  const keywords = leftoverWords.filter(w => {
    if (STOP_WORDS.has(w)) return false;
    if (detectedLocality && detectedLocality.toLowerCase().includes(w)) return false;
    if (detectedCategory && CATEGORY_KEYWORD_MAP[w] === detectedCategory) return false;
    if (detectedEventType && EVENT_KEYWORD_MAP[w] === detectedEventType) return false;
    if (/^\d+$/.test(w)) return false; // filter plain numbers already matched
    return w.length > 1;
  });

  return {
    rawQuery,
    detectedLocality,
    detectedCategory,
    detectedEventType,
    detectedGuestCount,
    keywords,
    isParsed: Boolean(detectedLocality || detectedCategory || detectedEventType || detectedGuestCount || keywords.length > 0)
  };
}

/**
 * Matches a listing against a user's search query and parsed intent.
 */
export function matchesSearchQuery(
  item: Listing,
  parsed: ParsedSearchQuery,
  activeCityId: string = 'pune'
): boolean {
  if (!parsed.isParsed && !parsed.rawQuery) {
    return true;
  }

  // 1. Scoping by Locality if detected in the search phrase (e.g., "Baner", "Kothrud")
  if (parsed.detectedLocality) {
    const queryLoc = parsed.detectedLocality.toLowerCase();
    const itemLoc = (item.locality || '').toLowerCase();
    const itemAddr = (item.address || '').toLowerCase();
    const itemTitle = (item.title || '').toLowerCase();

    const matchesLocality = 
      itemLoc.includes(queryLoc) || 
      queryLoc.includes(itemLoc) || 
      itemAddr.includes(queryLoc) || 
      itemTitle.includes(queryLoc);

    if (!matchesLocality) {
      return false;
    }
  }

  // 2. Scoping by Category if detected in the search phrase (e.g., "venue", "catering", "photographer")
  if (parsed.detectedCategory) {
    if (item.category !== parsed.detectedCategory) {
      // Allow sister matching if title explicitly includes category keyword
      const itemTitle = (item.title || '').toLowerCase();
      const itemDesc = (item.description || '').toLowerCase();
      const catWord = parsed.detectedCategory.replace('_', ' ');
      if (!itemTitle.includes(catWord) && !itemDesc.includes(catWord)) {
        return false;
      }
    }
  }

  // 3. Scoping by Event Type if detected in search phrase (e.g., "wedding", "birthday", "engagement")
  if (parsed.detectedEventType) {
    const itemEvents = item.eventTypes || [];
    const itemTitle = (item.title || '').toLowerCase();
    const itemDesc = (item.description || '').toLowerCase();
    const eventWord = parsed.detectedEventType.toLowerCase();

    const matchesEvent = 
      itemEvents.includes(parsed.detectedEventType) ||
      itemTitle.includes(eventWord) ||
      itemDesc.includes(eventWord);

    if (!matchesEvent) {
      return false;
    }
  }

  // 4. Scoping by Guest Count if detected in search phrase (e.g., "300 guests")
  if (parsed.detectedGuestCount && parsed.detectedGuestCount > 0) {
    if (item.category === 'venues') {
      const venueAttrs = item.categoryAttributes as any;
      if (venueAttrs?.capacityMax && venueAttrs.capacityMax < parsed.detectedGuestCount) {
        return false;
      }
    } else if (item.category === 'catering') {
      const cateringAttrs = item.categoryAttributes as any;
      if (cateringAttrs?.minGuestCount && cateringAttrs.minGuestCount > parsed.detectedGuestCount) {
        return false;
      }
    }
  }

  // 5. Free-form text matching for any remaining keywords (e.g., "AC", "lawn", "drone", "pure veg", specific vendor names)
  if (parsed.keywords.length > 0) {
    const searchableBlob = [
      item.title || '',
      item.vendorName || '',
      item.locality || '',
      item.address || '',
      item.description || '',
      item.pricingNote || '',
      item.category || '',
      ...(item.eventTypes || []),
      ...(item.pricingPackages?.filter(p => p.status === 'active' || (!p.status && item.status === 'active')).flatMap(p => [p.name, p.description || '', ...(p.features || [])]) || []),
      JSON.stringify(item.categoryAttributes || {})
    ].join(' ').toLowerCase();

    // Every remaining keyword must match in the searchable text
    const allKeywordsMatch = parsed.keywords.every(kw => searchableBlob.includes(kw));
    if (!allKeywordsMatch) {
      // Fallback: If rawQuery is typed literally as substring in title/vendor
      const rawLower = parsed.rawQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(rawLower) && !item.vendorName.toLowerCase().includes(rawLower)) {
        return false;
      }
    }
  }

  return true;
}
