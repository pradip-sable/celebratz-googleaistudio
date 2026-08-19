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
  CalendarStatus 
} from '../types';
import { INITIAL_LISTINGS, INITIAL_USERS, INITIAL_ENQUIRIES, INITIAL_REVIEWS } from '../data/seedData';
import { CityConfig, getCityById, DEFAULT_CITY_ID } from '../data/cities';

export interface FilterState {
  city: string; // 'pune', 'mumbai', etc.
  searchQuery: string;
  category: CategoryId | 'all';
  locality: PuneLocality | 'all';
  eventType: EventType | 'all';
  date: string; // YYYY-MM-DD
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
  switchUserRole: (role: 'customer' | 'vendor' | 'admin') => void;

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
  rejectListing: (id: string) => void;
  toggleFeatured: (id: string) => void;

  // Search & Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredListings: Listing[];

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
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('celebratz_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('celebratz_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('celebratz_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('celebratz_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('celebratz_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('celebratz_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('celebratz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('celebratz_design_prefs', JSON.stringify(designPrefs));
  }, [designPrefs]);

  const switchUserRole = (role: 'customer' | 'vendor' | 'admin') => {
    const target = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
  };

  const activeListings = listings.filter(l => l.status === 'active');

  const getListingById = (id: string) => listings.find(l => l.id === id);

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
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'active' } : l));
  };

  const rejectListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
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

  // Filtered listings computation
  const filteredListings = listings.filter(item => {
    // Only show active listings on public search unless user is vendor/admin
    if (item.status !== 'active') return false;

    // Multi-city scoping: match city (defaulting item to pune if unspecified)
    const itemCity = item.city || 'pune';
    if (filters.city && filters.city !== 'all' && itemCity !== filters.city) return false;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLocality = item.locality.toLowerCase().includes(q);
      const matchVendor = item.vendorName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLocality && !matchVendor && !matchDesc) return false;
    }

    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.locality !== 'all' && item.locality !== filters.locality) return false;
    if (filters.eventType !== 'all' && !item.eventTypes.includes(filters.eventType)) return false;

    if (filters.budgetMax > 0 && item.startingPrice > filters.budgetMax) return false;

    // Category specific filters
    if (item.category === 'venues') {
      const attrs = item.categoryAttributes;
      if (filters.minCapacity > 0 && (attrs.capacityMax || 0) < filters.minCapacity) return false;
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

  const createEnquiry = (data: Omit<Enquiry, 'id' | 'createdAt' | 'vendorStatus'>) => {
    const newEnquiry: Enquiry = {
      ...data,
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

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser.id).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
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
        toggleFeatured,
        filters,
        setFilters,
        resetFilters,
        filteredListings,
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
