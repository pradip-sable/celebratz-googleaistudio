export type CategoryId = 
  | 'venues' 
  | 'photography' 
  | 'catering' 
  | 'decoration' 
  | 'music_dj' 
  | 'pandit_priest';

export type EventType = 
  | 'Wedding' 
  | 'Reception'
  | 'Birthday' 
  | 'Engagement' 
  | 'Naming Ceremony' 
  | 'Corporate';

export type PricingUnit = 
  | 'per_day' 
  | 'per_plate' 
  | 'per_event' 
  | 'per_hour' 
  | 'fixed_package';

export type CityLocality = string;
export type PuneLocality = 
  | 'Baner' 
  | 'Koregaon Park' 
  | 'Kothrud' 
  | 'Wakad' 
  | 'Kalyani Nagar' 
  | 'Hadapsar' 
  | 'Viman Nagar' 
  | 'Sinhagad Road' 
  | 'Aundh' 
  | 'Hinjewadi'
  | string;

export type CalendarStatus = 'available' | 'tentative' | 'booked';

export interface CategorySpec {
  id: CategoryId;
  name: string;
  shortDescription: string;
  iconName: string;
  defaultPricingUnit: PricingUnit;
  unitLabel: string;
  badgeColor: string;
}

export interface VenueAttributes {
  capacityMin: number;
  capacityMax: number;
  venueType: 'Banquet Hall' | 'Farmhouse' | 'Resort' | 'Marriage Garden' | 'Hotel Ballroom' | 'Terrace';
  indoorOutdoor: 'Indoor' | 'Outdoor Lawn' | 'Both Indoor & Lawn';
  parkingCapacity: number;
  cateringPolicy: 'In-house only' | 'Outside catering allowed' | 'Both allowed';
  hasAC: boolean;
  roomCount: number;
}

export interface PhotographyAttributes {
  coverageTypes: string[];
  deliverables: string[];
  deliveryTimelineDays: number;
  equipmentDetails: string;
  teamSize: number;
  droneAvailable: boolean;
}

export interface CateringAttributes {
  cuisines: string[];
  vegType: 'Pure Veg' | 'Veg & Non-Veg' | 'Jain Options Available';
  minGuestCount: number;
  perPlateVegPrice: number;
  perPlateNonVegPrice?: number;
  liveCountersAvailable: boolean;
}

export interface DecorationAttributes {
  decorStyles: string[];
  sampleThemes: string[];
  includesLighting: boolean;
  mandapCustomization: boolean;
  setupTimeHours: number;
}

export interface MusicDjAttributes {
  genres: string[];
  equipmentIncluded: string[];
  soundWattage: string;
  performanceHours: number;
  includesDholTasha: boolean;
  wirelessMicsCount: number;
}

export interface PanditPriestAttributes {
  ceremoniesSupported: string[];
  languages: string[];
  ritualsIncluded: string[];
  samagriIncluded: boolean;
  yearsExperience: number;
}

export type CategoryAttributes = 
  | VenueAttributes 
  | PhotographyAttributes 
  | CateringAttributes 
  | DecorationAttributes 
  | MusicDjAttributes 
  | PanditPriestAttributes;

export interface CustomAttribute {
  label: string;
  value: string;
}

export interface ListingTier {
  id: string;
  listing_id: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  sort_order: number;
  is_active: boolean;
  status?: 'active' | 'pending_approval' | 'rejected';
}

export interface PricingPackage {
  id?: string;
  name: string;
  price: number;
  pricingUnit?: PricingUnit | string;
  description: string;
  features: string[];
  isPopular?: boolean;
  badge?: string;
  status?: 'active' | 'pending_approval' | 'rejected';
}

export interface PackageListing {
  package_id: string;
  listing_id: string;
}

export interface Package {
  id: string;
  vendor_id: string;
  vendor_name?: string;
  vendor_phone?: string;
  vendor_email?: string;
  name: string;
  slug: string;
  description: string;
  cover_image?: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_value: number;
  status: 'pending' | 'live' | 'paused' | 'rejected';
  rejection_reason?: string;
  listing_ids: string[];
  badge?: string;
  event_types?: EventType[];
  min_guest_capacity?: number;
  max_guest_capacity?: number;
  features?: string[];
  created_at: string;
  updated_at?: string;
  last_edited_at?: string;
}

export interface BundleServiceItem {
  listingId: string;
  listingTitle: string;
  category: CategoryId;
  serviceInclusions: string[];
  originalPrice: number;
}

export interface ComboPackage {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorEmail: string;
  title: string;
  description: string;
  includedListingIds: string[];
  includedServices: BundleServiceItem[];
  totalOriginalPrice: number;
  comboPrice: number;
  savingsAmount: number;
  savingsPercentage: number;
  badge?: string;
  eventTypes: EventType[];
  minGuestCapacity?: number;
  maxGuestCapacity?: number;
  coverImage?: string;
  features: string[];
  status: 'active' | 'pending_approval' | 'paused';
  lastEditedAt?: string;
  city?: string;
  locality?: PuneLocality;
  createdAt: string;
}

export interface Listing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorEmail: string;
  title: string;
  category: CategoryId;
  eventTypes: EventType[];
  city?: string; // e.g. 'pune', 'mumbai', etc. Defaults to 'pune'
  locality: PuneLocality;
  address: string;
  websiteUrl?: string;
  googleMapsUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  startingPrice: number;
  price_from?: number; // Single source of truth for untiered listings
  pricingUnit: PricingUnit;
  pricingNote?: string;
  pricingPackages?: PricingPackage[];
  listing_tiers?: ListingTier[]; // 2+ tiers or 0 tiers
  packageReviewStatus?: 'pending_approval' | 'approved' | 'none';
  categoryAttributes: Record<string, any>;
  customAttributes?: CustomAttribute[];
  coverImage: string;
  galleryImages: string[];
  description: string;
  status: 'active' | 'pending_approval' | 'paused' | 'rejected';
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  lastEditedAt?: string; // ISO date string tracking the last edit/package modification
  calendarLastUpdatedAt: string; // ISO date string
  calendar: Record<string, CalendarStatus>; // 'YYYY-MM-DD' -> status
  createdAt: string;
}

export type RequestKind = 'booking_request' | 'enquiry';

export interface Enquiry {
  id: string;
  kind?: RequestKind;
  listing_id?: string | null;
  package_id?: string | null;
  selected_tier_id?: string | null;
  listingId: string;
  listingTitle: string;
  listingCategory: CategoryId;
  listingCity?: string;
  listingLocality: PuneLocality;
  listingCoverImage: string;
  vendorId: string;
  vendorName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestType?: 'request_to_book' | 'general_enquiry';
  eventType: EventType;
  eventDate: string;
  guestCount?: number;
  preferredVisitTime?: string;
  message: string;
  consentGiven: boolean;
  selectedPackageName?: string;
  selectedPackagePrice?: number;
  comboPackageId?: string;
  comboPackageTitle?: string;
  vendorStatus: 'pending' | 'accepted' | 'declined' | 'completed';
  vendorResponseNote?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  enquiryId?: string;
  rating: number;
  title: string;
  reviewText: string;
  photos?: string[];
  eventDate: string;
  eventType: EventType;
  status: 'published' | 'pending_moderation';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  role: 'customer' | 'vendor' | 'admin';
  avatar?: string;
  businessName?: string;
  category?: CategoryId;
  locality?: string;
  city?: string;
  createdAt?: string;
}

export type AuthMode = 'login' | 'signup' | 'forgot_password';
export type AuthMethod = 'google' | 'email_password' | 'mobile_password' | 'mobile_otp';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'lead_new' | 'lead_accepted' | 'lead_declined' | 'listing_approved' | 'review_prompt' | 'system';
  linkTarget?: string;
  read: boolean;
  createdAt: string;
}

export type DesignPalette = 'teal_gold' | 'rose_ruby' | 'emerald_champagne';
export type CardLayoutMode = 'spacious_cards' | 'compact_bento' | 'detailed_list';
export type HeroStyle = 'celebratory_banner' | 'clean_minimal' | 'pune_focus';

export interface DesignPreferences {
  palette: DesignPalette;
  cardLayout: CardLayoutMode;
  heroStyle: HeroStyle;
}

export type CustomerTab = 'requests' | 'wishlist' | 'reviews' | 'profile';
export type VendorTab = 'overview' | 'listings' | 'packages' | 'new_listing' | 'calendar' | 'leads';
