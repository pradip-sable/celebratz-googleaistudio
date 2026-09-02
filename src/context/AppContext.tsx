import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Listing, 
  Enquiry, 
  Review, 
  User, 
  NotificationItem, 
  DesignPreferences, 
  CategoryId, 
  PuneLocality, 
  EventType, 
  CalendarStatus,
  CustomerTab,
  VendorTab,
  AuthMode,
  AuthMethod,
  ComboPackage,
  PricingPackage
} from '../types';
import { INITIAL_LISTINGS, INITIAL_USERS, INITIAL_ENQUIRIES, INITIAL_REVIEWS, INITIAL_COMBO_PACKAGES } from '../data/seedData';
import { CityConfig, getCityById, DEFAULT_CITY_ID } from '../data/cities';
import { parseSearchQuery, matchesSearchQuery, ParsedSearchQuery } from '../utils/searchFilter';

export interface FilterState {
  city: string; // 'pune', 'mumbai', etc.
  searchQuery: string;
  category: CategoryId | 'all';
  locality: PuneLocality | 'all';
  eventType: EventType | 'all';
  date: string; // YYYY-MM-DD
  guestCount?: number;
  budgetMax: number;
  minCapacity: number;
  pureVegOnly: boolean;
  hasACOnly: boolean;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'reviews';
}

interface AppContextType {
  // User state
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  switchUserRole: (role: 'customer' | 'vendor' | 'admin') => void;
  
  // Auth state & actions
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthMode;
  setAuthModalMode: (mode: AuthMode) => void;
  authInitialMethod: AuthMethod;
  setAuthInitialMethod: (method: AuthMethod) => void;
  openAuthModal: (mode?: AuthMode, method?: AuthMethod) => void;
  closeAuthModal: () => void;
  loginWithGoogle: (email?: string, name?: string) => { success: boolean; error?: string };
  loginWithEmail: (email: string, password?: string) => { success: boolean; error?: string };
  loginWithMobile: (phone: string, passwordOrOtp?: string, isOtp?: boolean) => { success: boolean; error?: string };
  registerUser: (userData: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: 'customer' | 'vendor';
    businessName?: string;
    category?: CategoryId;
    locality?: string;
    city?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;

  // City & Multi-City Extension
  activeCity: CityConfig;
  switchCity: (cityId: string) => void;
  isCitySelectorOpen: boolean;
  setIsCitySelectorOpen: (open: boolean) => void;

  // Listings
  listings: Listing[];
  activeListings: Listing[];
  getListingById: (id: string) => Listing | undefined;
  addListing: (listingData: Omit<Listing, 'id' | 'createdAt' | 'avgRating' | 'reviewCount' | 'calendarLastUpdatedAt'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  toggleCalendarDate: (listingId: string, dateStr: string, nextStatus?: CalendarStatus) => void;
  approveListing: (id: string) => void;
  rejectListing: (id: string, reason?: string) => void;
  approveListingTier: (listingId: string, tierId?: string) => void;
  rejectListingTier: (listingId: string, tierId?: string, reason?: string) => void;
  toggleFeatured: (id: string) => void;

  // Combo Packages & Multi-Service Bundles
  comboPackages: ComboPackage[];
  addComboPackage: (pkgData: Omit<ComboPackage, 'id' | 'createdAt'>) => void;
  updateComboPackage: (id: string, updates: Partial<ComboPackage>) => void;
  deleteComboPackage: (id: string) => void;
  approveComboPackage: (id: string) => void;
  rejectComboPackage: (id: string, reason?: string) => void;
  getComboPackagesForListing: (listingId: string) => ComboPackage[];
  getComboPackagesForVendor: (vendorId: string) => ComboPackage[];
  selectedComboPackage: ComboPackage | null;
  setSelectedComboPackage: (pkg: ComboPackage | null) => void;
  isComboModalOpen: boolean;
  setIsComboModalOpen: (open: boolean) => void;
  prefillPackageData: {
    tierId?: string;
    packageName?: string;
    packagePrice?: number;
    comboId?: string;
    comboTitle?: string;
  } | null;
  setPrefillPackageData: (data: {
    tierId?: string;
    packageName?: string;
    packagePrice?: number;
    comboId?: string;
    comboTitle?: string;
  } | null) => void;
  openEnquiryForPackage: (listingId: string, pkg?: { id?: string; name: string; price: number }, combo?: ComboPackage) => void;

  // Search & Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredListings: Listing[];
  parsedSearchQuery: ParsedSearchQuery;

  // Enquiries & Leads
  enquiries: Enquiry[];
  createEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'vendorStatus'>) => { success: boolean; error?: string };
  updateEnquiryStatus: (id: string, status: 'accepted' | 'declined' | 'completed', note?: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  getListingReviews: (listingId: string) => Review[];
  isEligibleForReview: (listingId: string, customerId: string) => { eligible: boolean; enquiryId?: string; eventDate?: string; eventType?: EventType };
  moderateReview: (id: string, approve: boolean) => void;

  // Wishlist
  wishlist: string[]; // Listing IDs
  toggleWishlist: (listingId: string) => void;
  isInWishlist: (listingId: string) => boolean;

  // Comparison
  comparisonList: string[]; // Up to 3 listing IDs
  toggleComparison: (listingId: string) => void;
  clearComparison: () => void;

  // Design Layout Preferences
  designPrefs: DesignPreferences;
  updateDesignPrefs: (updates: Partial<DesignPreferences>) => void;

  // Navigation / Modal States
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  navigateToCustomerTab: (tab: CustomerTab) => void;
  vendorTab: VendorTab;
  setVendorTab: (tab: VendorTab) => void;
  navigateToVendorTab: (tab: VendorTab) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  isEnquiryModalOpen: boolean;
  setIsEnquiryModalOpen: (open: boolean) => void;
  isDesignSelectorOpen: boolean;
  setIsDesignSelectorOpen: (open: boolean) => void;
  isFiltersBottomSheetOpen: boolean;
  setIsFiltersBottomSheetOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const defaultFilters: FilterState = {
  city: DEFAULT_CITY_ID,
  searchQuery: '',
  category: 'all',
  locality: 'all',
  eventType: 'all',
  date: '',
  guestCount: 0,
  budgetMax: 500000,
  minCapacity: 0,
  pureVegOnly: false,
  hasACOnly: false,
  sortBy: 'recommended'
};

const defaultDesignPrefs: DesignPreferences = {
  palette: 'teal_gold', // Warm Gold & Deep Teal
  cardLayout: 'spacious_cards',
  heroStyle: 'celebratory_banner'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('celebratz_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('celebratz_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');
  const [authInitialMethod, setAuthInitialMethod] = useState<AuthMethod>('google');

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('celebratz_listings');
      const rawListings: Listing[] = saved ? JSON.parse(saved) : INITIAL_LISTINGS;
      return rawListings.map(l => ({
        ...l,
        pricingPackages: (l.pricingPackages || []).map((pkg, idx) => ({
          ...pkg,
          id: pkg.id || `pkg_${l.id}_${idx}`
        })),
        customAttributes: (l.customAttributes || []).map((attr, idx) => ({
          ...attr,
          id: (attr as any).id || `attr_${l.id}_${idx}`
        }))
      }));
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('celebratz_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('celebratz_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('celebratz_wishlist');
    return saved ? JSON.parse(saved) : ['list_venue_1', 'list_photo_1'];
  });

  const [comboPackages, setComboPackages] = useState<ComboPackage[]>(() => {
    const saved = localStorage.getItem('celebratz_combo_packages');
    return saved ? JSON.parse(saved) : INITIAL_COMBO_PACKAGES;
  });

  const [selectedComboPackage, setSelectedComboPackage] = useState<ComboPackage | null>(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState<boolean>(false);
  const [prefillPackageData, setPrefillPackageData] = useState<{
    packageName?: string;
    packagePrice?: number;
    comboId?: string;
    comboTitle?: string;
  } | null>(null);

  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [designPrefs, setDesignPrefs] = useState<DesignPreferences>(() => {
    try {
      const saved = localStorage.getItem('celebratz_design_prefs');
      if (!saved) return defaultDesignPrefs;
      const parsed = JSON.parse(saved);
      return {
        palette: parsed.palette || defaultDesignPrefs.palette,
        cardLayout: parsed.cardLayout || defaultDesignPrefs.cardLayout,
        heroStyle: parsed.heroStyle || defaultDesignPrefs.heroStyle
      };
    } catch {
      return defaultDesignPrefs;
    }
  });

  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('requests');
  const [vendorTab, setVendorTab] = useState<VendorTab>('overview');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [isDesignSelectorOpen, setIsDesignSelectorOpen] = useState<boolean>(false);
  const [isFiltersBottomSheetOpen, setIsFiltersBottomSheetOpen] = useState<boolean>(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      userId: 'user_cust_1',
      title: 'Request Accepted 🎉',
      message: 'The Royal Palace & Lawns accepted your wedding venue walkthrough inquiry for this Saturday.',
      type: 'lead_accepted',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Could not save users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_listings', JSON.stringify(listings));
    } catch (e) {
      console.warn('localStorage quota exceeded while saving listings. Sanitizing large image data...', e);
      try {
        // Fallback: strip heavy raw base64 data if quota is hit
        const sanitized = listings.map(l => ({
          ...l,
          coverImage: l.coverImage.startsWith('data:') ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80' : l.coverImage,
          galleryImages: l.galleryImages.map(img => img.startsWith('data:') ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80' : img)
        }));
        localStorage.setItem('celebratz_listings', JSON.stringify(sanitized));
      } catch (innerErr) {
        console.error('Failed to save listings to localStorage', innerErr);
      }
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_enquiries', JSON.stringify(enquiries));
    } catch (e) {
      console.warn('Could not save enquiries to localStorage', e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Could not save reviews to localStorage', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_design_prefs', JSON.stringify(designPrefs));
    } catch (e) {
      console.warn('Could not save design prefs to localStorage', e);
    }
  }, [designPrefs]);

  useEffect(() => {
    try {
      localStorage.setItem('celebratz_combo_packages', JSON.stringify(comboPackages));
    } catch (e) {
      console.warn('Could not save combo packages to localStorage', e);
    }
  }, [comboPackages]);

  const switchUserRole = (role: 'customer' | 'vendor' | 'admin') => {
    const target = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
  };

  const activeListings = listings.filter(l => l.status === 'active');

  const getListingById = (id: string) => listings.find(l => l.id === id);

  // Combo Packages & Multi-Service Bundles Methods
  const addComboPackage = (pkgData: Omit<ComboPackage, 'id' | 'createdAt'>) => {
    const newId = `combo_${Date.now()}`;
    const orig = pkgData.totalOriginalPrice || 0;
    const combo = pkgData.comboPrice || 0;
    const savings = Math.max(0, orig - combo);
    const percentage = orig > 0 ? Math.round((savings / orig) * 100) : 0;

    const newCombo: ComboPackage = {
      ...pkgData,
      id: newId,
      status: 'pending_approval', // Strictly pending admin approval
      savingsAmount: savings,
      savingsPercentage: percentage,
      createdAt: new Date().toISOString()
    };

    setComboPackages(prev => [newCombo, ...prev]);

    const adminNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'user_admin_1',
      title: 'New Combined Package Awaiting Approval ⏳',
      message: `"${newCombo.title}" submitted by ${newCombo.vendorName} combining ${newCombo.includedListingIds.length} services with ₹${savings.toLocaleString('en-IN')} savings. Requires admin review.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const updateComboPackage = (id: string, updates: Partial<ComboPackage>) => {
    setComboPackages(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { 
        ...p, 
        ...updates,
        // If updating content or resubmitting, ensure status requires review unless explicitly set by admin
        status: updates.status || (p.status === 'rejected' ? 'pending_approval' : p.status)
      };
      const orig = updated.totalOriginalPrice || 0;
      const combo = updated.comboPrice || 0;
      updated.savingsAmount = Math.max(0, orig - combo);
      updated.savingsPercentage = orig > 0 ? Math.round((updated.savingsAmount / orig) * 100) : 0;
      return updated;
    }));
  };

  const approveComboPackage = (id: string) => {
    setComboPackages(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, status: 'active', rejectionReason: undefined };
    }));

    const target = comboPackages.find(p => p.id === id);
    if (target) {
      const vendorNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.vendorId,
        title: 'Combined Package Approved & Live! 🎉',
        message: `Your combo bundle "${target.title}" has been approved by admin operations and is now live for customers.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [vendorNotif, ...prev]);
    }
  };

  const rejectComboPackage = (id: string, reason?: string) => {
    setComboPackages(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, status: 'rejected', rejectionReason: reason || 'Does not meet bundle quality guidelines' };
    }));

    const target = comboPackages.find(p => p.id === id);
    if (target) {
      const vendorNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.vendorId,
        title: 'Combined Package Review Update ⚠️',
        message: `Your combo bundle "${target.title}" was not approved.${reason ? ` Reason: "${reason}"` : ''} You can edit and resubmit.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [vendorNotif, ...prev]);
    }
  };

  const deleteComboPackage = (id: string) => {
    setComboPackages(prev => prev.filter(p => p.id !== id));
  };

  const getComboPackagesForListing = (listingId: string) => {
    return comboPackages.filter(p => p.status === 'active' && p.includedListingIds.includes(listingId));
  };

  const getComboPackagesForVendor = (vendorId: string) => {
    return comboPackages.filter(p => p.vendorId === vendorId || currentUser.role === 'admin' || (vendorId === 'user_vendor_1' && p.vendorId === 'user_vendor_1'));
  };

  const openEnquiryForPackage = (listingId: string, pkg?: { id?: string; name: string; price: number }, combo?: ComboPackage) => {
    setSelectedListingId(listingId);
    if (combo) {
      setPrefillPackageData({
        comboId: combo.id,
        comboTitle: combo.title,
        packageName: combo.title,
        packagePrice: combo.comboPrice
      });
    } else if (pkg) {
      setPrefillPackageData({
        tierId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price
      });
    } else {
      setPrefillPackageData(null);
    }
    setIsEnquiryModalOpen(true);
  };

  const addListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'avgRating' | 'reviewCount' | 'calendarLastUpdatedAt'>) => {
    const newId = `list_${Date.now()}`;
    const newListing: Listing = {
      ...listingData,
      id: newId,
      avgRating: 0,
      reviewCount: 0,
      calendarLastUpdatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'pending_approval' // Needs admin approval per requirement
    };
    setListings(prev => [newListing, ...prev]);

    // Notify Admin
    const adminNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'user_admin_1',
      title: 'New Listing Pending Approval',
      message: `"${newListing.title}" submitted by ${newListing.vendorName} is waiting for review.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const toggleCalendarDate = (listingId: string, dateStr: string, explicitStatus?: CalendarStatus) => {
    setListings(prev => prev.map(listing => {
      if (listing.id !== listingId) return listing;

      const currentStatus = listing.calendar[dateStr] || 'available';
      let next: CalendarStatus = explicitStatus || 'available';

      if (!explicitStatus) {
        if (currentStatus === 'available') next = 'tentative';
        else if (currentStatus === 'tentative') next = 'booked';
        else next = 'available';
      }

      return {
        ...listing,
        calendarLastUpdatedAt: new Date().toISOString(),
        calendar: {
          ...listing.calendar,
          [dateStr]: next
        }
      };
    }));
  };

  const approveListing = (id: string) => {
    setListings(prev => prev.map(l => {
      if (l.id !== id) return l;
      // When the listing is approved, all its included package tiers become active!
      const updatedPackages = (l.pricingPackages || []).map(pkg => ({
        ...pkg,
        status: 'active' as const
      }));
      const updatedTiers = (l.listing_tiers || []).map(tier => ({
        ...tier,
        is_active: true
      }));
      return { 
        ...l, 
        status: 'active',
        packageReviewStatus: 'approved',
        pricingPackages: updatedPackages,
        listing_tiers: updatedTiers.length > 0 ? updatedTiers : l.listing_tiers
      };
    }));

    const target = listings.find(l => l.id === id);
    if (target) {
      const vendorNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.vendorId,
        title: 'Listing & Packages Approved! 🎉',
        message: `Your listing "${target.title}" and its service packages have been approved by admin and are now live.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [vendorNotif, ...prev]);
    }
  };

  const rejectListing = (id: string, reason?: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));

    const target = listings.find(l => l.id === id);
    if (target) {
      const vendorNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.vendorId,
        title: 'Listing Submission Update ⚠️',
        message: `Your listing "${target.title}" was not approved.${reason ? ` Reason: "${reason}"` : ''}`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [vendorNotif, ...prev]);
    }
  };

  const approveListingTier = (listingId: string, tierId?: string) => {
    setListings(prev => prev.map(l => {
      if (l.id !== listingId) return l;
      const updatedPackages = (l.pricingPackages || []).map(pkg => {
        if (!tierId || pkg.id === tierId || (!pkg.id && pkg.status === 'pending_approval')) {
          return { ...pkg, status: 'active' as const };
        }
        return pkg;
      });

      const updatedListingTiers = (l.listing_tiers || []).map(t => {
        if (!tierId || t.id === tierId || t.name === (l.pricingPackages?.find(p => p.id === tierId)?.name)) {
          return { ...t, is_active: true };
        }
        return t;
      });

      const hasPendingTiers = updatedPackages.some(p => p.status === 'pending_approval');

      return {
        ...l,
        pricingPackages: updatedPackages,
        listing_tiers: updatedListingTiers.length > 0 ? updatedListingTiers : l.listing_tiers,
        packageReviewStatus: hasPendingTiers ? 'pending_approval' : 'approved'
      };
    }));

    const target = listings.find(l => l.id === listingId);
    if (target) {
      const vendorNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.vendorId,
        title: 'Package Tier Approved! ✨',
        message: `Your proposed package tier for "${target.title}" has been approved by admin and is now live for customers.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [vendorNotif, ...prev]);
    }
  };

  const rejectListingTier = (listingId: string, tierId?: string, reason?: string) => {
    setListings(prev => prev.map(l => {
      if (l.id !== listingId) return l;
      const updatedPackages = (l.pricingPackages || []).map(pkg => {
        if (!tierId || pkg.id === tierId) {
          return { ...pkg, status: 'rejected' as const };
        }
        return pkg;
      });

      const updatedListingTiers = (l.listing_tiers || []).map(t => {
        if (!tierId || t.id === tierId || t.name === (l.pricingPackages?.find(p => p.id === tierId)?.name)) {
          return { ...t, is_active: false };
        }
        return t;
      });

      const hasPendingTiers = updatedPackages.some(p => p.status === 'pending_approval');

      return {
        ...l,
        pricingPackages: updatedPackages,
        listing_tiers: updatedListingTiers.length > 0 ? updatedListingTiers : l.listing_tiers,
        packageReviewStatus: hasPendingTiers ? 'pending_approval' : 'none'
      };
    }));

    const target = listings.find(l => l.id === listingId);
    if (target) {
      const vendorNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.vendorId,
        title: 'Package Tier Review Update ⚠️',
        message: `Your proposed package tier for "${target.title}" was not approved.${reason ? ` Reason: "${reason}"` : ''}`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [vendorNotif, ...prev]);
    }
  };

  const toggleFeatured = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, isFeatured: !l.isFeatured } : l));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const activeCity = getCityById(filters.city || DEFAULT_CITY_ID);

  const switchCity = (cityId: string) => {
    setFilters(prev => ({
      ...prev,
      city: cityId,
      locality: 'all'
    }));
  };

  // Structured query parser for natural language searches (e.g. "Wedding venue in Baner")
  const parsedSearchQuery = React.useMemo(() => {
    const cityLocalities = activeCity?.localities || [];
    return parseSearchQuery(filters.searchQuery, cityLocalities);
  }, [filters.searchQuery, activeCity]);

  // Filtered listings computation
  const filteredListings = React.useMemo(() => {
    return listings.filter(item => {
      // Only show active listings on public search unless user is vendor/admin
      if (item.status !== 'active') return false;

      // Multi-city scoping: match city (defaulting item to pune if unspecified)
      const itemCity = item.city || 'pune';
      if (filters.city && filters.city !== 'all' && itemCity !== filters.city) return false;

      // Natural language keyword matching with locality, category & celebration extraction
      if (filters.searchQuery && filters.searchQuery.trim()) {
        if (!matchesSearchQuery(item, parsedSearchQuery, filters.city)) {
          return false;
        }
      }

      // Explicit UI Dropdown / Filter constraints
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.locality !== 'all' && item.locality !== filters.locality) return false;
      if (filters.eventType !== 'all' && !item.eventTypes.includes(filters.eventType)) return false;

      if (filters.budgetMax > 0 && item.startingPrice > filters.budgetMax) return false;

      // Guest count / capacity filtering (applies to venues and catering)
      const targetGuests = filters.guestCount || filters.minCapacity || 0;
      if (targetGuests > 0) {
        if (item.category === 'venues') {
          const attrs = item.categoryAttributes;
          if ((attrs.capacityMax || 0) < targetGuests) return false;
        } else if (item.category === 'catering') {
          const attrs = item.categoryAttributes;
          if (attrs.minGuestCount && attrs.minGuestCount > targetGuests) return false;
        }
      }

      // Category specific filters
      if (item.category === 'venues') {
        const attrs = item.categoryAttributes;
        if (filters.hasACOnly && !attrs.hasAC) return false;
      }

      if (item.category === 'catering') {
        const attrs = item.categoryAttributes;
        if (filters.pureVegOnly && attrs.vegType !== 'Pure Veg') return false;
      }

      // Date availability filter
      if (filters.date) {
        const calStatus = item.calendar[filters.date];
        if (calStatus === 'booked') return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.startingPrice - b.startingPrice;
      if (filters.sortBy === 'price_high') return b.startingPrice - a.startingPrice;
      if (filters.sortBy === 'rating') return b.avgRating - a.avgRating;
      if (filters.sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      // Recommended: featured first, then rating
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.avgRating - a.avgRating;
    });
  }, [listings, filters, parsedSearchQuery]);

  const createEnquiry = (data: Omit<Enquiry, 'id' | 'createdAt' | 'vendorStatus'>) => {
    const isPackage = Boolean(data.package_id || data.comboPackageId);
    const resolvedPackageId = isPackage ? (data.package_id || data.comboPackageId || null) : null;
    const resolvedListingId = isPackage ? null : (data.listing_id || data.listingId || null);
    const resolvedTierId = isPackage ? null : (data.selected_tier_id || null);

    const newEnquiry: Enquiry = {
      ...data,
      kind: data.kind || (data.requestType === 'request_to_book' ? 'booking_request' : 'enquiry'),
      package_id: resolvedPackageId,
      listing_id: resolvedListingId,
      selected_tier_id: resolvedTierId,
      id: `enq_${Date.now()}`,
      vendorStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    setEnquiries(prev => [newEnquiry, ...prev]);

    // Also update current user phone if missing
    if (!currentUser.phoneNumber && data.customerPhone) {
      setCurrentUser(prev => ({
        ...prev,
        phoneNumber: data.customerPhone,
        phoneVerified: false // Unverified in phase 1 as per design decision
      }));
    }

    // In-app notification for the vendor
    const vendorNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: data.vendorId,
      title: 'New Event Lead Received! 🔔',
      message: `${data.customerName} sent a ${data.requestType === 'request_to_book' ? 'Booking Request' : 'General Enquiry'} for ${data.eventType} on ${data.eventDate}.`,
      type: 'lead_new',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [vendorNotif, ...prev]);

    return { success: true };
  };

  const updateEnquiryStatus = (id: string, status: 'accepted' | 'declined' | 'completed', note?: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, vendorStatus: status, vendorResponseNote: note } : e));

    const targetEnquiry = enquiries.find(e => e.id === id);
    if (targetEnquiry) {
      const custNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: targetEnquiry.customerId,
        title: status === 'accepted' ? 'Request Accepted! 🎊' : 'Request Update',
        message: `${targetEnquiry.vendorName} ${status} your inquiry for ${targetEnquiry.eventType}.${note ? ` Note: "${note}"` : ''}`,
        type: status === 'accepted' ? 'lead_accepted' : 'lead_declined',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [custNotif, ...prev]);
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      status: 'published', // Published if through verified flow
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate listing rating
    setListings(prev => prev.map(l => {
      if (l.id !== reviewData.listingId) return l;
      const allReviewsForListing = [...reviews.filter(r => r.listingId === l.id), newReview];
      const avg = allReviewsForListing.reduce((acc, r) => acc + r.rating, 0) / allReviewsForListing.length;
      return {
        ...l,
        avgRating: Number(avg.toFixed(1)),
        reviewCount: allReviewsForListing.length
      };
    }));
  };

  const getListingReviews = (listingId: string) => {
    return reviews.filter(r => r.listingId === listingId && r.status === 'published');
  };

  // Eligibility check: User has an accepted enquiry for this listing, and event date is today or in the past
  const isEligibleForReview = (listingId: string, customerId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const match = enquiries.find(e => 
      e.listingId === listingId && 
      e.customerId === customerId && 
      e.vendorStatus === 'accepted' && 
      e.eventDate <= today
    );

    if (match) {
      // Check if already reviewed
      const alreadyReviewed = reviews.some(r => r.listingId === listingId && r.customerId === customerId);
      if (!alreadyReviewed) {
        return { eligible: true, enquiryId: match.id, eventDate: match.eventDate, eventType: match.eventType };
      }
    }
    return { eligible: false };
  };

  const moderateReview = (id: string, approve: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: approve ? 'published' : 'pending_moderation' } : r));
  };

  const toggleWishlist = (listingId: string) => {
    setWishlist(prev => 
      prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId]
    );
  };

  const isInWishlist = (listingId: string) => wishlist.includes(listingId);

  const toggleComparison = (listingId: string) => {
    setComparisonList(prev => {
      if (prev.includes(listingId)) {
        return prev.filter(id => id !== listingId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], listingId]; // Cap at 3
      }
      return [...prev, listingId];
    });
  };

  const clearComparison = () => setComparisonList([]);

  const updateDesignPrefs = (updates: Partial<DesignPreferences>) => {
    setDesignPrefs(prev => ({ ...prev, ...updates }));
  };

  const navigateToCustomerTab = (tab: CustomerTab) => {
    setCustomerTab(tab);
    setActiveRoute('customer-dashboard');
    setSelectedListingId(null);
    setIsEnquiryModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVendorTab = (tab: VendorTab) => {
    setVendorTab(tab);
    setActiveRoute('vendor-dashboard');
    setSelectedListingId(null);
    setIsEnquiryModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode: AuthMode = 'login', method: AuthMethod = 'google') => {
    setAuthModalMode(mode);
    setAuthInitialMethod(method);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = (email?: string, name?: string) => {
    const targetEmail = email || 'pradipsable43@gmail.com';
    const targetName = name || 'Pradip Sable';
    
    let existing = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (!existing) {
      const newUser: User = {
        id: `user_g_${Date.now()}`,
        email: targetEmail,
        fullName: targetName,
        phoneNumber: '+91 98230 11223',
        phoneVerified: true,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      existing = newUser;
    }
    setCurrentUser(existing);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginWithEmail = (email: string, password?: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    let existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!existing) {
      existing = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    }
    if (!existing) {
      const namePart = email.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const newUser: User = {
        id: `user_em_${Date.now()}`,
        email: email.trim(),
        fullName: formattedName,
        phoneNumber: '+91 98230 45678',
        phoneVerified: true,
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      existing = newUser;
    }
    setCurrentUser(existing);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginWithMobile = (phone: string, passwordOrOtp?: string, isOtp = true) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.replace(/[^0-9]/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '').slice(-10);
    let existing = users.find(u => u.phoneNumber && u.phoneNumber.replace(/[^0-9]/g, '').endsWith(digitsOnly));
    
    if (!existing) {
      const formattedPhone = cleanPhone.startsWith('+91') ? cleanPhone : `+91 ${digitsOnly}`;
      const newUser: User = {
        id: `user_ph_${Date.now()}`,
        email: `user_${digitsOnly.slice(-4)}@celebratz.in`,
        fullName: `User ${digitsOnly.slice(-4)}`,
        phoneNumber: formattedPhone,
        phoneVerified: true,
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      existing = newUser;
    } else {
      existing = { ...existing, phoneVerified: true };
      setUsers(prev => prev.map(u => u.id === existing!.id ? existing! : u));
    }
    setCurrentUser(existing);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const registerUser = (userData: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: 'customer' | 'vendor';
    businessName?: string;
    category?: CategoryId;
    locality?: string;
    city?: string;
  }) => {
    if (!userData.fullName.trim()) {
      return { success: false, error: 'Please provide your full name or business owner name.' };
    }
    if (!userData.email.trim() || !userData.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const cleanPhone = userData.phoneNumber ? userData.phoneNumber.replace(/[^0-9+]/g, '') : '';
    const formattedPhone = cleanPhone 
      ? (cleanPhone.startsWith('+91') ? cleanPhone : `+91 ${cleanPhone.replace(/[^0-9]/g, '').slice(-10)}`) 
      : undefined;

    const newUser: User = {
      id: `user_${userData.role}_${Date.now()}`,
      email: userData.email.trim(),
      fullName: userData.fullName.trim(),
      phoneNumber: formattedPhone,
      phoneVerified: true,
      role: userData.role,
      businessName: userData.businessName?.trim(),
      category: userData.category,
      locality: userData.locality,
      city: userData.city,
      avatar: userData.role === 'vendor' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    const welcomeNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: newUser.id,
      title: `Welcome to Celebratz, ${newUser.fullName}! 🎉`,
      message: newUser.role === 'vendor' 
        ? 'Your vendor account is active! You can now create and manage your service listings.'
        : 'Find and book the top venues, caterers, and decorators for your dream celebrations.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    if (newUser.role === 'vendor') {
      setActiveRoute('vendor-dashboard');
    } else {
      setActiveRoute('customer-dashboard');
      setCustomerTab('profile');
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(INITIAL_USERS[0]);
    setActiveRoute('home');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser.id).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        switchUserRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authInitialMethod,
        setAuthInitialMethod,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        loginWithMobile,
        registerUser,
        logout,
        activeCity,
        switchCity,
        isCitySelectorOpen,
        setIsCitySelectorOpen,
        listings,
        activeListings,
        getListingById,
        addListing,
        updateListing,
        toggleCalendarDate,
        approveListing,
        rejectListing,
        approveListingTier,
        rejectListingTier,
        toggleFeatured,
        comboPackages,
        addComboPackage,
        updateComboPackage,
        deleteComboPackage,
        approveComboPackage,
        rejectComboPackage,
        getComboPackagesForListing,
        getComboPackagesForVendor,
        selectedComboPackage,
        setSelectedComboPackage,
        isComboModalOpen,
        setIsComboModalOpen,
        prefillPackageData,
        setPrefillPackageData,
        openEnquiryForPackage,
        filters,
        setFilters,
        resetFilters,
        filteredListings,
        parsedSearchQuery,
        enquiries,
        createEnquiry,
        updateEnquiryStatus,
        reviews,
        addReview,
        getListingReviews,
        isEligibleForReview,
        moderateReview,
        wishlist,
        toggleWishlist,
        isInWishlist,
        comparisonList,
        toggleComparison,
        clearComparison,
        designPrefs,
        updateDesignPrefs,
        activeRoute,
        setActiveRoute,
        customerTab,
        setCustomerTab,
        navigateToCustomerTab,
        vendorTab,
        setVendorTab,
        navigateToVendorTab,
        selectedListingId,
        setSelectedListingId,
        isEnquiryModalOpen,
        setIsEnquiryModalOpen,
        isDesignSelectorOpen,
        setIsDesignSelectorOpen,
        isFiltersBottomSheetOpen,
        setIsFiltersBottomSheetOpen,
        notifications,
        markNotificationRead,
        unreadCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
