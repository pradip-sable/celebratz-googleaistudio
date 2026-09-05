import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Calendar as CalendarIcon, 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Edit3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Users,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Trash2,
  Link,
  Car,
  Utensils,
  Camera,
  Music,
  Flame,
  ShieldCheck,
  Check,
  Tag,
  X,
  Layers,
  Gift,
  Percent,
  IndianRupee,
  PackagePlus,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Package,
  MessageSquare,
  Globe,
  Lock,
  Unlock,
  Hourglass,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing, CategoryId, PuneLocality, EventType, CalendarStatus, CustomAttribute, ComboPackage, PricingPackage, PricingUnit, ListingTier } from '../types';
import { CATEGORIES, PUNE_LOCALITIES, EVENT_TYPES, formatEventType } from '../data/categories';
import { CITIES, getCityById } from '../data/cities';
import { formatIndianCurrency, getDaysAgoText, get24HourEditStatus, CooldownStatus } from '../utils/theme';
import { getEffectivePrice, getPackagePublicVisibility, isMaterialListingChange } from '../utils/pricing';
import { usePackages } from '../hooks/usePackages';
import { ComboBundleStudioModal } from './ComboBundleStudioModal';
import { ComboPackageDetailModal } from './ComboPackageDetailModal';
import { SubmissionConfirmationModal, SubmissionDetails } from './SubmissionConfirmationModal';

export const VendorDashboard: React.FC = () => {
  const { 
    currentUser, 
    listings, 
    addListing, 
    updateListing, 
    toggleCalendarDate, 
    enquiries, 
    updateEnquiryStatus, 
    setSelectedListingId,
    comboPackages,
    addComboPackage,
    updateComboPackage,
    deleteComboPackage,
    getComboPackagesForVendor,
    vendorTab,
    setVendorTab
  } = useApp();

  const activeTab = vendorTab;
  const setActiveTab = setVendorTab;
  
  // Multi-listing selection for this vendor
  const vendorListings = listings.filter(l => l.vendorId === currentUser.id || currentUser.role === 'admin' || l.vendorId === 'user_vendor_1');
  const [selectedListingForCalendar, setSelectedListingForCalendar] = useState<string>(vendorListings[0]?.id || '');

  // Vendor Packages hook for read-time pricing & component health computations
  const { vendorPackages, getPackageVisibility, getPackagePriceInfo, getPackageAvailability } = usePackages(currentUser.id || 'user_vendor_1');
  const vendorCombos = vendorPackages.length > 0 ? vendorPackages : getComboPackagesForVendor(currentUser.id || 'user_vendor_1');
  const [comboStudioOpen, setComboStudioOpen] = useState<boolean>(false);
  const [editingCombo, setEditingCombo] = useState<ComboPackage | null>(null);
  const [previewCombo, setPreviewCombo] = useState<ComboPackage | null>(null);

  // Listing Tiers state for the "Create / Edit Listing" form (0 = flat, 2+ = tiered, never 1)
  const [formListingTiers, setFormListingTiers] = useState<ListingTier[]>([]);
  
  // Packages Studio sub-tab
  const [packagesSubTab, setPackagesSubTab] = useState<'combos' | 'tiers'>('combos');
  const [selectedListingForTiers, setSelectedListingForTiers] = useState<string>(vendorListings[0]?.id || '');
  
  // Quick Tier Package Modal inside Packages Studio
  const [isAddingTierModal, setIsAddingTierModal] = useState<boolean>(false);
  const [newTierName, setNewTierName] = useState<string>('');
  const [newTierPrice, setNewTierPrice] = useState<number | ''>(50000);
  const [newTierPricingUnit, setNewTierPricingUnit] = useState<string>('per_event');
  const [newTierDesc, setNewTierDesc] = useState<string>('');
  const [newTierBadge, setNewTierBadge] = useState<string>('Most Popular');
  const [newTierIsPopular, setNewTierIsPopular] = useState<boolean>(true);
  const [newTierFeatures, setNewTierFeatures] = useState<{ id: string; text: string }[]>([
    { id: 'ntf_1', text: 'Full access with dedicated service team' },
    { id: 'ntf_2', text: 'Standard setup and sound support' },
    { id: 'ntf_3', text: 'Dedicated on-site coordinator' }
  ]);
  const [newTierFeatureInput, setNewTierFeatureInput] = useState<string>('');

  // Editing existing listing tracking
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  // Submission Confirmation Modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    details: SubmissionDetails;
    onConfirm: () => void;
  } | null>(null);

  // Cooldown Locked Notification Dialog state
  const [cooldownNoticeModal, setCooldownNoticeModal] = useState<{
    isOpen: boolean;
    title: string;
    formattedRemaining: string;
    lastEditedText: string;
  } | null>(null);

  // In-app success/warning banner state
  const [feedbackToast, setFeedbackToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  // Packages state for the "Create New Listing" form
  const [formPricingPackages, setFormPricingPackages] = useState<PricingPackage[]>([
    {
      id: 'pkg_new_1',
      name: 'Standard Package',
      price: 100000,
      pricingUnit: 'per_event',
      description: 'Standard single-day event booking with basic amenities and setup.',
      features: ['Full 12-Hour Venue Access', '2 AC Bridal Dressing Rooms', 'Standard Lighting & DG Backup'],
      isPopular: false
    },
    {
      id: 'pkg_new_2',
      name: 'Royal Vivah Grand Access',
      price: 180000,
      pricingUnit: 'per_event',
      description: 'Complete 24-hour access with premium bridal suites and priority coordination.',
      features: ['24-Hour Complete Hall & Lawn Access', '4 Deluxe AC Suites with Room Service', '100% DG Power Backup & Valet Parking', 'On-Site Operations Lead'],
      isPopular: true,
      badge: '👑 Recommended'
    }
  ]);

  // Leads Filtering & Response State
  const [selectedLeadListingFilter, setSelectedLeadListingFilter] = useState<string>('all');
  const [selectedLeadStatusFilter, setSelectedLeadStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [customReplyEnquiryId, setCustomReplyEnquiryId] = useState<string | null>(null);
  const [vendorReplyNote, setVendorReplyNote] = useState<string>('');

  // Total Leads Counts across all submissions
  const allEnquiries = enquiries;
  const pendingLeadsCount = allEnquiries.filter(e => e.vendorStatus === 'pending').length;
  const acceptedLeadsCount = allEnquiries.filter(e => e.vendorStatus === 'accepted').length;
  const declinedLeadsCount = allEnquiries.filter(e => e.vendorStatus === 'declined').length;
  const totalLeadsCount = allEnquiries.length;

  // Filtered leads displayed based on user selections
  const displayedVendorEnquiries = allEnquiries.filter(e => {
    if (selectedLeadListingFilter !== 'all') {
      if (e.listingId !== selectedLeadListingFilter && e.vendorId !== selectedLeadListingFilter) {
        return false;
      }
    }
    if (selectedLeadStatusFilter !== 'all') {
      if (e.vendorStatus !== selectedLeadStatusFilter) {
        return false;
      }
    }
    return true;
  });

  // Backward compatibility reference for Overview KPI
  const vendorEnquiries = displayedVendorEnquiries;
  
  // Calendar month state
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // New Listing Form State with multi-city extension
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('pune');
  const [newCategory, setNewCategory] = useState<CategoryId>('venues');
  const [newLocality, setNewLocality] = useState<string>('Baner');
  const [newAddress, setNewAddress] = useState('');
  const [newGoogleMapsUrl, setNewGoogleMapsUrl] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>(100000);
  const [newPricingUnit, setNewPricingUnit] = useState<PricingUnit>('per_day');
  const [newDescription, setNewDescription] = useState('');
  const [newEventTypes, setNewEventTypes] = useState<EventType[]>(['Wedding', 'Engagement']);

  // Unified Photo management state (Multiple Photos with selectable Cover)
  const [photoInputType, setPhotoInputType] = useState<'upload' | 'url'>('upload');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80'
  ]);
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<string | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  
  // Dynamic category-based attributes
  // Venues
  const [venueType, setVenueType] = useState<string>('Marriage Lawn & Garden');
  const [venueIndoorOutdoor, setVenueIndoorOutdoor] = useState<string>('Both Hall & Lawn');
  const [venueCapacityMin, setVenueCapacityMin] = useState<number | ''>(200);
  const [venueCapacityMax, setVenueCapacityMax] = useState<number | ''>(1000);
  const [venueParking, setVenueParking] = useState<number | ''>(200);
  const [venueHasValet, setVenueHasValet] = useState<boolean>(true);
  const [venueHasAC, setVenueHasAC] = useState<boolean>(true);
  const [venueBridalRooms, setVenueBridalRooms] = useState<number | ''>(2);
  const [venueCateringPolicy, setVenueCateringPolicy] = useState<string>('Both allowed');
  const [venueAlcoholPolicy, setVenueAlcoholPolicy] = useState<string>('Allowed with Permit');
  const [venuePowerBackup, setVenuePowerBackup] = useState<boolean>(true);

  // Photography
  const [photoTimeline, setPhotoTimeline] = useState<number | ''>(21);
  const [photoTeamSize, setPhotoTeamSize] = useState<number | ''>(4);
  const [photoCoverageTypes, setPhotoCoverageTypes] = useState<string[]>(['Candid Photography', 'Cinematic Wedding Film', '4K Drone Aerial']);
  const [photoDeliverables, setPhotoDeliverables] = useState<string>('Raw Photos + 400 Edited + Hardbound Silk Album + 4K Teaser & Full Film');
  const [photoEquipment, setPhotoEquipment] = useState<string>('Sony FX3 Cinema & A7S III, Ronin Gimbals, Godox Lighting Strobes');
  const [photoDroneAvailable, setPhotoDroneAvailable] = useState<boolean>(true);
  const [photoPreWedding, setPhotoPreWedding] = useState<boolean>(true);

  // Catering
  const [caterVegType, setCaterVegType] = useState<string>('Pure Veg');
  const [caterMinGuests, setCaterMinGuests] = useState<number | ''>(50);
  const [caterCuisines, setCaterCuisines] = useState<string[]>(['Maharashtrian', 'North Indian', 'Chaat & Live Counters', 'Dessert & Mocktail Bar']);
  const [caterServiceStyle, setCaterServiceStyle] = useState<string>('Royal Buffet');
  const [caterCrockeryIncluded, setCaterCrockeryIncluded] = useState<boolean>(true);
  const [caterLiveCounters, setCaterLiveCounters] = useState<boolean>(true);
  const [caterWelcomeDrinks, setCaterWelcomeDrinks] = useState<boolean>(true);

  // Decoration
  const [decorStyles, setDecorStyles] = useState<string[]>(['Traditional Vedic Mandap', 'Floral Luxury & Exotic Blooms', 'Royal Peshwai / Maratha']);
  const [decorFlowerType, setDecorFlowerType] = useState<string>('Fresh Exotic & Desi Flowers');
  const [decorMandapCustom, setDecorMandapCustom] = useState<boolean>(true);
  const [decorLightingIncluded, setDecorLightingIncluded] = useState<boolean>(true);
  const [decorSetupHours, setDecorSetupHours] = useState<number | ''>(6);

  // Music & DJ
  const [djWattage, setDjWattage] = useState<string>('10,000W RMS Line Array System');
  const [djGenres, setDjGenres] = useState<string[]>(['Bollywood', 'Marathi Zingaat & Kolhapuri', 'EDM & Commercial', 'Punjabi Beats']);
  const [djIncludesDholTasha, setDjIncludesDholTasha] = useState<boolean>(true);
  const [djVisualsLights, setDjVisualsLights] = useState<boolean>(true);
  const [djWirelessMics, setDjWirelessMics] = useState<number | ''>(4);

  // Pandit / Priest
  const [panditExp, setPanditExp] = useState<number | ''>(15);
  const [panditLanguages, setPanditLanguages] = useState<string[]>(['Marathi', 'Hindi', 'Sanskrit']);
  const [panditCeremonies, setPanditCeremonies] = useState<string[]>([
    'Vedic Vivah (Wedding)', 
    'Sakharpuda / Engagement', 
    'Griha Pravesh / Vastu', 
    'Satyanarayan Puja'
  ]);
  const [panditSamagriIncluded, setPanditSamagriIncluded] = useState<boolean>(true);
  const [panditMuhuratConsultation, setPanditMuhuratConsultation] = useState<boolean>(true);

  // Custom User Attributes (Key-Value pairs)
  const [customAttributes, setCustomAttributes] = useState<(CustomAttribute & { id: string })[]>([
    { id: 'attr_init_1', label: 'Valet Parking', value: '10 Dedicated Chauffeurs Included' }
  ]);

  const [isListingCreated, setIsListingCreated] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Handlers for Merged Photo Uploads with automatic compression to prevent storage errors
  const handleMultiplePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: File[] = Array.from(e.target.files);
    
    fileList.forEach(file => {
      // Create an image element to resize down to lightweight dimensions (max 1280px)
      const reader = new FileReader();
      reader.onload = (ev) => {
        const rawDataUrl = ev.target?.result as string;
        if (!rawDataUrl) return;

        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            setUploadedPhotos(prev => [...prev, compressedDataUrl]);
          } else {
            setUploadedPhotos(prev => [...prev, rawDataUrl]);
          }
        };
        img.onerror = () => {
          setUploadedPhotos(prev => [...prev, rawDataUrl]);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    });
    // Reset file input value to allow re-uploading the same file if needed
    e.target.value = '';
  };

  const handleAddPhotoUrl = () => {
    if (photoUrlInput.trim()) {
      setUploadedPhotos(prev => [...prev, photoUrlInput.trim()]);
      setPhotoUrlInput('');
    }
  };

  const handleRemovePhoto = (idxToRemove: number) => {
    const photoToRemove = uploadedPhotos[idxToRemove];
    setUploadedPhotos(prev => prev.filter((_, idx) => idx !== idxToRemove));
    if (selectedCoverUrl === photoToRemove) {
      setSelectedCoverUrl(null); // Will automatically fall back to the first photo
    }
  };

  const handleSelectCoverPhoto = (url: string) => {
    setSelectedCoverUrl(url);
  };

  // Handlers for Custom Attributes
  const handleAddCustomAttribute = () => {
    setCustomAttributes(prev => [
      ...prev, 
      { id: `attr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, label: '', value: '' }
    ]);
  };

  const handleUpdateCustomAttribute = (index: number, field: 'label' | 'value', value: string) => {
    setCustomAttributes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveCustomAttribute = (index: number) => {
    setCustomAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // Start editing existing listing
  const handleStartEditListing = (listing: Listing) => {
    const cooldown = get24HourEditStatus(listing.lastEditedAt);
    if (!cooldown.canEdit) {
      setCooldownNoticeModal({
        isOpen: true,
        title: listing.title,
        formattedRemaining: cooldown.formattedRemaining,
        lastEditedText: cooldown.lastEditedText
      });
      return;
    }

    setEditingListingId(listing.id);
    setNewTitle(listing.title);
    setNewCity(listing.city || 'pune');
    setNewCategory(listing.category);
    setNewLocality(listing.locality);
    setNewAddress(listing.address || '');
    setNewGoogleMapsUrl(listing.googleMapsUrl || '');
    setNewPrice(listing.startingPrice);
    setNewPricingUnit(listing.pricingUnit || 'per_day');
    setNewDescription(listing.description || '');
    setNewEventTypes(listing.eventTypes || ['Wedding', 'Engagement']);
    setUploadedPhotos(listing.galleryImages || [listing.coverImage]);
    setSelectedCoverUrl(listing.coverImage);
    setFormPricingPackages((listing.pricingPackages || []).map((pkg, idx) => ({
      ...pkg,
      id: pkg.id || `pkg_${listing.id}_${idx}`
    })));

    // Populate Listing Tiers (0 = flat, 2+ = tiered)
    if (listing.listing_tiers && listing.listing_tiers.length > 0) {
      setFormListingTiers(listing.listing_tiers);
    } else if (listing.pricingPackages && listing.pricingPackages.length >= 2) {
      setFormListingTiers(listing.pricingPackages.map((pkg, idx) => ({
        id: pkg.id || `tier_${listing.id}_${idx}`,
        listing_id: listing.id,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        features: pkg.features || [],
        sort_order: idx + 1,
        is_active: (pkg as any).status !== 'inactive'
      })));
    } else {
      setFormListingTiers([]);
    }
    setCustomAttributes((listing.customAttributes || []).map((attr, idx) => ({
      id: (attr as any).id || `attr_${listing.id}_${idx}_${Date.now()}`,
      label: attr.label,
      value: attr.value
    })));

    // Populate category specific attributes
    const catAttrs = listing.categoryAttributes || {};
    if (listing.category === 'venues') {
      setVenueType(catAttrs.venueType || 'Marriage Lawn & Garden');
      setVenueIndoorOutdoor(catAttrs.indoorOutdoor || 'Outdoor Lawn + AC Hall');
      setVenueCapacityMin(catAttrs.capacityMin || 300);
      setVenueCapacityMax(catAttrs.capacityMax || 1500);
      setVenueParking(catAttrs.parkingCapacity || 250);
      setVenueHasValet(catAttrs.hasValet ?? true);
      setVenueHasAC(catAttrs.hasAC ?? true);
      setVenueBridalRooms(catAttrs.roomCount || 4);
      setVenueCateringPolicy(catAttrs.cateringPolicy || 'Both In-House & Outside Allowed');
      setVenueAlcoholPolicy(catAttrs.alcoholPolicy || 'Allowed with One-Day Permit');
      setVenuePowerBackup(catAttrs.powerBackup || '100% DG Set Backup Available');
    } else if (listing.category === 'photography') {
      setPhotoTimeline(catAttrs.deliveryTimelineDays || 21);
      setPhotoTeamSize(catAttrs.teamSize || 4);
      setPhotoCoverageTypes(catAttrs.coverageTypes || ['Traditional', 'Candid', 'Cinematic Drone']);
      setPhotoDeliverables(catAttrs.deliverables?.[0] || 'Raw Photos + 400 Edited + Hardbound Silk Album + 4K Teaser & Full Film');
      setPhotoEquipment(catAttrs.equipmentDetails || 'Sony A7IV / FX3 + Prime G-Master Lenses + DJI Mavic 3 Cine');
      setPhotoDroneAvailable(catAttrs.droneAvailable ?? true);
      setPhotoPreWedding(catAttrs.preWeddingAvailable ?? true);
    } else if (listing.category === 'catering') {
      setCaterVegType(catAttrs.vegType || 'Pure Vegetarian & Jain Specialized');
      setCaterMinGuests(catAttrs.minGuestCount || 100);
      setCaterCuisines(catAttrs.cuisines || ['Authentic Maharashtrian', 'North Indian', 'Live Chaat', 'Continental Desserts']);
      setCaterServiceStyle(catAttrs.serviceStyle || 'Royal Buffet + Silver Service VIP Lounge');
      setCaterCrockeryIncluded(catAttrs.crockeryIncluded ?? true);
      setCaterLiveCounters(catAttrs.liveCountersAvailable ?? true);
      setCaterWelcomeDrinks(catAttrs.welcomeDrinksIncluded ?? true);
    } else if (listing.category === 'decoration') {
      setDecorStyles(catAttrs.decorStyles || ['Traditional Marigold & Brass', 'Royal Rajwada Mahal', 'Pastel Minimalist Floral']);
      setDecorFlowerType(catAttrs.flowerType || '100% Fresh Exotic Dutch Flowers + Traditional Tuberoses');
      setDecorMandapCustom(catAttrs.mandapCustomization || 'Bespoke 3D Carved Acrylic & Floral Dome Mandap');
      setDecorLightingIncluded(catAttrs.includesLighting ?? true);
      setDecorSetupHours(catAttrs.setupTimeHours || 8);
    } else if (listing.category === 'music_dj') {
      setDjWattage(catAttrs.soundWattage || '15,000W RCF Line Array with Dual 18" Subwoofers');
      setDjGenres(catAttrs.genres || ['Bollywood', 'Punjabi Dhol', 'Commercial EDM', 'Marathi Folk Hits']);
      setDjIncludesDholTasha(catAttrs.includesDholTasha ?? true);
      setDjVisualsLights(catAttrs.visualsAndLights || 'Sharpy Moving Heads + CO2 Jets + Pyro Guns + LED Pixel Wall');
      setDjWirelessMics(catAttrs.wirelessMicsCount || 4);
    } else if (listing.category === 'pandit_priest') {
      setPanditExp(catAttrs.yearsExperience || 22);
      setPanditLanguages(catAttrs.languages || ['Marathi', 'Hindi', 'Sanskrit']);
      setPanditCeremonies(catAttrs.ceremoniesSupported || ['Lagna Sanskar (Wedding)', 'Simant (Godh Bharai)', 'Vastu Shanti', 'Satyanarayan Puja']);
      setPanditSamagriIncluded(catAttrs.samagriIncluded ?? true);
      setPanditMuhuratConsultation(catAttrs.muhuratConsultation ?? true);
    }

    setActiveTab('new_listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditListing = () => {
    setEditingListingId(null);
    setNewTitle('');
    setNewPrice(100000);
    setNewDescription('');
    setFormListingTiers([]);
    setSubmissionError(null);
    setActiveTab('listings');
  };

  // Handlers for formListingTiers in Create / Edit Listing (0 = flat, 2+ = tiered, never 1)
  const handleAddFormTier = () => {
    const nextIdx = formListingTiers.length + 1;
    const defaultName = nextIdx === 1 ? 'Standard Package' : nextIdx === 2 ? 'Premium Package' : `Deluxe Tier ${nextIdx}`;
    const basePrice = Number(newPrice) || 50000;
    const tierPrice = nextIdx === 1 ? basePrice : Math.round(basePrice * (1 + (nextIdx - 1) * 0.4));

    setFormListingTiers(prev => [
      ...prev,
      {
        id: `tier_${Date.now()}_${nextIdx}`,
        listing_id: editingListingId || '',
        name: defaultName,
        price: tierPrice,
        description: `Comprehensive ${defaultName.toLowerCase()} with dedicated service coordination.`,
        features: ['Full service coverage with dedicated lead', 'All primary setup and essentials included'],
        sort_order: nextIdx,
        is_active: true
      }
    ]);
  };

  const handleRemoveFormTier = (index: number) => {
    setFormListingTiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFormTier = (index: number, field: keyof ListingTier, value: any) => {
    setFormListingTiers(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t));
  };

  const handleToggleFormTierActive = (index: number) => {
    setFormListingTiers(prev => prev.map((t, i) => i === index ? { ...t, is_active: t.is_active === false ? true : false } : t));
  };

  const handleAddFormTierFeature = (tierIndex: number) => {
    setFormListingTiers(prev => prev.map((t, i) => {
      if (i !== tierIndex) return t;
      return {
        ...t,
        features: [...(t.features || []), 'Custom inclusion feature']
      };
    }));
  };

  const handleUpdateFormTierFeature = (tierIndex: number, featIndex: number, text: string) => {
    setFormListingTiers(prev => prev.map((t, i) => {
      if (i !== tierIndex) return t;
      const updated = [...(t.features || [])];
      updated[featIndex] = text;
      return { ...t, features: updated };
    }));
  };

  const handleRemoveFormTierFeature = (tierIndex: number, featIndex: number) => {
    setFormListingTiers(prev => prev.map((t, i) => {
      if (i !== tierIndex) return t;
      return {
        ...t,
        features: (t.features || []).filter((_, fi) => fi !== featIndex)
      };
    }));
  };

  // Handlers for in-listing tier packages with 24-hour check & confirmation popup
  const handleAddTierToListing = () => {
    if (!newTierName.trim() || !newTierPrice || Number(newTierPrice) <= 0) return;
    const targetListing = listings.find(l => l.id === selectedListingForTiers);
    if (!targetListing) return;

    // Check 24-hour edit restriction
    const cooldown = get24HourEditStatus(targetListing.lastEditedAt);
    if (!cooldown.canEdit) {
      setCooldownNoticeModal({
        isOpen: true,
        title: targetListing.title,
        formattedRemaining: cooldown.formattedRemaining,
        lastEditedText: cooldown.lastEditedText
      });
      return;
    }

    // Open Confirmation Modal
    setConfirmationModal({
      isOpen: true,
      details: {
        type: 'add_tier',
        title: newTierName.trim(),
        price: Number(newTierPrice),
        pricingUnit: newTierPricingUnit || 'per_event',
        customDetails: [
          { label: 'Listing', value: targetListing.title },
          { label: 'Features Count', value: `${newTierFeatures.length} inclusions` },
          { label: 'Badge', value: newTierBadge || 'None' }
        ]
      },
      onConfirm: () => executeAddTier(targetListing)
    });
  };

  const executeAddTier = (targetListing: Listing) => {
    const newPkg: PricingPackage = {
      id: `pkg_${Date.now()}`,
      name: newTierName.trim(),
      price: Number(newTierPrice),
      pricingUnit: (newTierPricingUnit as PricingUnit) || 'per_event',
      description: newTierDesc.trim(),
      features: newTierFeatures.map(f => f.text),
      isPopular: newTierIsPopular,
      badge: newTierBadge.trim() || undefined,
      status: 'pending_approval'
    };

    const currentPackages = targetListing.pricingPackages || [];
    const updatedPackages = [...currentPackages, newPkg];
    
    // An active listing stays active in public directory while package tier is submitted for review
    updateListing(targetListing.id, { 
      pricingPackages: updatedPackages,
      status: targetListing.status === 'active' ? 'active' : 'pending_approval',
      packageReviewStatus: 'pending_approval',
      lastEditedAt: new Date().toISOString()
    });

    // Reset Form
    setNewTierName('');
    setNewTierPrice(50000);
    setNewTierDesc('');
    setNewTierBadge('Most Popular');
    setIsAddingTierModal(false);
    setConfirmationModal(null);

    setFeedbackToast({
      title: 'Package Tier Submitted for Approval',
      message: `Package "${newPkg.name}" submitted for review. "${targetListing.title}" remains active & discoverable in marketplace. Next edit available in 24 hours.`,
      type: 'success'
    });
  };

  const handleDeleteTierFromListing = (listingId: string, tierId: string) => {
    const targetListing = listings.find(l => l.id === listingId);
    if (!targetListing) return;

    // Packages can only be managed for active listings
    if (targetListing.status !== 'active') {
      setFeedbackToast({
        title: 'Action Restricted',
        message: 'Packages can only be created or modified for approved and active listings.',
        type: 'error'
      });
      return;
    }

    // Check 24-hour edit restriction
    const cooldown = get24HourEditStatus(targetListing.lastEditedAt);
    if (!cooldown.canEdit) {
      setCooldownNoticeModal({
        isOpen: true,
        title: targetListing.title,
        formattedRemaining: cooldown.formattedRemaining,
        lastEditedText: cooldown.lastEditedText
      });
      return;
    }

    const tierToDelete = (targetListing.pricingPackages || []).find(p => p.id === tierId);

    // Open Confirmation Modal
    setConfirmationModal({
      isOpen: true,
      details: {
        type: 'delete_tier',
        title: tierToDelete?.name || 'Package Tier',
        price: tierToDelete?.price,
        customDetails: [
          { label: 'Listing', value: targetListing.title },
          { label: 'Action', value: 'Remove Package Tier' }
        ]
      },
      onConfirm: () => executeDeleteTier(targetListing, tierId)
    });
  };

  const executeDeleteTier = (targetListing: Listing, tierId: string) => {
    const updatedPackages = (targetListing.pricingPackages || []).filter(p => p.id !== tierId);
    updateListing(targetListing.id, { 
      pricingPackages: updatedPackages,
      status: targetListing.status === 'active' ? 'active' : 'pending_approval',
      packageReviewStatus: 'pending_approval',
      lastEditedAt: new Date().toISOString()
    });
    setConfirmationModal(null);

    setFeedbackToast({
      title: 'Package Tier Removed',
      message: `Package tier removed from "${targetListing.title}". Listing remains active in marketplace. Next edit available in 24 hours.`,
      type: 'info'
    });
  };

  const currentListing = listings.find(l => l.id === selectedListingForCalendar) || vendorListings[0];

  // Calendar dates generation (anchor to 1st of month to avoid day-31 overflow bugs)
  const today = new Date();
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const status: CalendarStatus = (currentListing?.calendar && currentListing.calendar[dateStr]) || 'available';
    return { dayNum, dateStr, status };
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!newTitle.trim()) {
      setSubmissionError('Please enter a valid listing title.');
      return;
    }

    if (!newPrice || Number(newPrice) <= 0) {
      setSubmissionError('Please enter a valid starting price.');
      return;
    }

    // Check if editing existing listing and if it is under cooldown
    if (editingListingId) {
      const existingListing = listings.find(l => l.id === editingListingId);
      if (existingListing) {
        const cooldown = get24HourEditStatus(existingListing.lastEditedAt);
        if (!cooldown.canEdit) {
          setCooldownNoticeModal({
            isOpen: true,
            title: existingListing.title,
            formattedRemaining: cooldown.formattedRemaining,
            lastEditedText: cooldown.lastEditedText
          });
          return;
        }
      }
    }

    // PACKAGE TIERS VALIDATION: Never allow exactly 1 tier (0 = flat, 2+ = tiered)
    const activeTiers = formListingTiers.filter(t => t.is_active !== false);
    if (activeTiers.length === 1) {
      setSubmissionError('A listing must have either 0 tiers (flat pricing) or 2 or more tiers. Exactly 1 tier is not allowed. Please add a second tier or remove this tier to use flat pricing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const selectedCityConfig = getCityById(newCity);

    // Open Confirmation Modal before submitting!
    setConfirmationModal({
      isOpen: true,
      details: {
        type: editingListingId ? 'edit_listing' : 'new_listing',
        title: newTitle.trim(),
        category: CATEGORIES.find(c => c.id === newCategory)?.name || newCategory,
        locality: `${newLocality}, ${selectedCityConfig?.name || 'Pune'}`,
        price: Number(newPrice),
        pricingUnit: newPricingUnit,
        packagesCount: formListingTiers.length,
        photosCount: uploadedPhotos.length,
        customDetails: [
          { label: 'Event Types', value: newEventTypes.map(t => formatEventType(t)).join(', ') || 'Wedding' },
          { label: 'Pricing Structure', value: activeTiers.length >= 2 ? `${activeTiers.length} Active Tiers` : 'Flat Starting Price' },
          { label: 'Moderation Policy', value: 'Admin Verification / Instant Live (non-material)' },
          { label: 'Edit Lock', value: '24-Hour Cooldown Activated' }
        ]
      },
      onConfirm: () => executeSaveListing()
    });
  };

  const executeSaveListing = () => {
    try {
      const selectedCityConfig = getCityById(newCity);

      // Build rich category attributes according to category
      let categoryAttrs: Record<string, any> = {};

      if (newCategory === 'venues') {
        categoryAttrs = {
          venueType,
          indoorOutdoor: venueIndoorOutdoor,
          capacityMin: Number(venueCapacityMin) || 100,
          capacityMax: Number(venueCapacityMax) || 1000,
          parkingCapacity: Number(venueParking) || 50,
          hasValet: venueHasValet,
          hasAC: venueHasAC,
          roomCount: Number(venueBridalRooms) || 2,
          cateringPolicy: venueCateringPolicy,
          alcoholPolicy: venueAlcoholPolicy,
          powerBackup: venuePowerBackup
        };
      } else if (newCategory === 'photography') {
        categoryAttrs = {
          deliveryTimelineDays: Number(photoTimeline) || 21,
          teamSize: Number(photoTeamSize) || 3,
          coverageTypes: photoCoverageTypes,
          deliverables: [photoDeliverables],
          equipmentDetails: photoEquipment,
          droneAvailable: photoDroneAvailable,
          preWeddingAvailable: photoPreWedding
        };
      } else if (newCategory === 'catering') {
        categoryAttrs = {
          vegType: caterVegType,
          minGuestCount: Number(caterMinGuests) || 50,
          cuisines: caterCuisines,
          serviceStyle: caterServiceStyle,
          crockeryIncluded: caterCrockeryIncluded,
          liveCountersAvailable: caterLiveCounters,
          welcomeDrinksIncluded: caterWelcomeDrinks
        };
      } else if (newCategory === 'decoration') {
        categoryAttrs = {
          decorStyles,
          flowerType: decorFlowerType,
          mandapCustomization: decorMandapCustom,
          includesLighting: decorLightingIncluded,
          setupTimeHours: Number(decorSetupHours) || 6
        };
      } else if (newCategory === 'music_dj') {
        categoryAttrs = {
          soundWattage: djWattage,
          genres: djGenres,
          includesDholTasha: djIncludesDholTasha,
          visualsAndLights: djVisualsLights,
          wirelessMicsCount: Number(djWirelessMics) || 2
        };
      } else if (newCategory === 'pandit_priest') {
        categoryAttrs = {
          yearsExperience: Number(panditExp) || 15,
          languages: panditLanguages,
          ceremoniesSupported: panditCeremonies,
          samagriIncluded: panditSamagriIncluded,
          muhuratConsultation: panditMuhuratConsultation
        };
      }

      // Filter valid custom attributes
      const validCustomAttributes = customAttributes.filter(a => a.label.trim() && a.value.trim());

      // Determine effective cover photo (selected photo or first uploaded photo)
      const effectiveCover = (selectedCoverUrl && uploadedPhotos.includes(selectedCoverUrl))
        ? selectedCoverUrl
        : (uploadedPhotos[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80');

      // Ensure cover photo is part of gallery
      const finalGallery = uploadedPhotos.length > 0 ? uploadedPhotos : [effectiveCover];
      if (!finalGallery.includes(effectiveCover)) {
        finalGallery.unshift(effectiveCover);
      }

      const activeTiers = formListingTiers.filter(t => t.is_active !== false);

      const convertedPricingPackages: PricingPackage[] = formListingTiers.map((t, idx) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        pricingUnit: newPricingUnit,
        description: t.description,
        features: t.features,
        status: t.is_active === false ? 'inactive' : 'active',
        isPopular: idx === 1
      }));

      const existingListing = editingListingId ? listings.find(l => l.id === editingListingId) : null;

      // MODERATION RULE FOR LISTING EDITS (applies to both listing fields and tiers)
      // Only material changes — price, tiers, title, category — send a live listing back to pending for re-approval.
      // Description and photo edits stay live without re-review.
      const isMaterial = existingListing ? isMaterialListingChange(existingListing, {
        title: newTitle.trim(),
        category: newCategory,
        startingPrice: Number(newPrice),
        price_from: Number(newPrice),
        listing_tiers: formListingTiers,
        pricingPackages: convertedPricingPackages
      }) : true;

      const nextStatus = (existingListing?.status === 'active' && !isMaterial) ? 'active' : 'pending_approval';

      const listingData = {
        vendorId: currentUser.id || 'user_vendor_1',
        vendorName: currentUser.businessName || currentUser.fullName || 'Verified Vendor',
        vendorPhone: currentUser.phoneNumber || '+91 98811 22334',
        vendorEmail: currentUser.email || 'vendor@celebratz.com',
        title: newTitle.trim(),
        city: newCity,
        category: newCategory,
        eventTypes: newEventTypes.length > 0 ? newEventTypes : ['Wedding', 'Engagement'],
        locality: newLocality,
        address: newAddress.trim() || `${newLocality}, ${selectedCityConfig?.name || 'Pune'}`,
        googleMapsUrl: newGoogleMapsUrl.trim() || undefined,
        startingPrice: Number(newPrice),
        price_from: Number(newPrice),
        pricingUnit: newPricingUnit,
        categoryAttributes: categoryAttrs,
        customAttributes: validCustomAttributes,
        coverImage: effectiveCover,
        galleryImages: finalGallery,
        description: newDescription.trim() || `Premium ${newCategory} provider in ${selectedCityConfig?.name || 'Pune'}.`,
        listing_tiers: formListingTiers,
        pricingPackages: convertedPricingPackages,
        status: nextStatus as any,
        lastEditedAt: new Date().toISOString()
      };

      if (editingListingId) {
        updateListing(editingListingId, listingData);
        if (nextStatus === 'active') {
          setFeedbackToast({
            title: 'Listing Updated (Remains Live)',
            message: `Changes to photos and description for "${listingData.title}" were applied immediately without requiring admin re-approval.`,
            type: 'success'
          });
        } else {
          setFeedbackToast({
            title: 'Listing Submitted for Re-Approval',
            message: `"${listingData.title}" placed in Admin Approval queue due to material updates (price, tiers, title, or category). Next edit available in 24 hours.`,
            type: 'success'
          });
        }
      } else {
        addListing({
          ...listingData,
          isFeatured: false,
          calendar: {}
        });
        setFeedbackToast({
          title: 'New Listing Submitted for Approval',
          message: `"${listingData.title}" submitted to Admin for verification. Next edit available in 24 hours.`,
          type: 'success'
        });
      }

      setIsListingCreated(true);
      setConfirmationModal(null);
      // Immediately navigate smoothly to top of page so vendor sees their notification and status
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setIsListingCreated(false);
        setEditingListingId(null);
        setActiveTab('listings');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    } catch (err: any) {
      console.error('Error submitting listing:', err);
      setSubmissionError(err?.message || 'Failed to submit listing. Please verify the form and try again.');
      setConfirmationModal(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm animate-in fade-in ${
          feedbackToast.type === 'warning'
            ? 'bg-accent-subtle border border-accent/40 text-accent-dark'
            : feedbackToast.type === 'info'
            ? 'bg-primary-subtle border border-primary/40 text-primary-dark'
            : 'bg-success-subtle border border-success/30 text-success'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <div>
              <span className="font-bold">{feedbackToast.title}</span>
              {feedbackToast.message && (
                <span className="ml-1.5 font-normal text-foreground">{feedbackToast.message}</span>
              )}
            </div>
          </div>
          <button 
            onClick={() => setFeedbackToast(null)} 
            className="p-1 text-muted-foreground hover:text-foreground font-bold rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Vendor Top Banner */}
      <div className="bg-primary-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-foreground">
              Vendor Management Studio
            </span>
            <span className="text-xs text-muted-foreground">&bull; Pune Partner Hub</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-accent-subtle">
            {currentUser.businessName || currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
            Manage your availability calendar, incoming client leads, and Pune listing profiles.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('new_listing')}
          className="px-5 py-2.5 bg-accent hover:bg-accent text-foreground font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-muted rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-white text-primary-dark shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'leads' ? 'bg-white text-primary-dark shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📥 Leads & Enquiries ({totalLeadsCount})
          {pendingLeadsCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-accent text-foreground rounded-full text-[10px] font-bold">
              {pendingLeadsCount} New
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'calendar' ? 'bg-white text-primary-dark shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📅 Availability Calendar (Tap-to-Toggle)
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'listings' ? 'bg-white text-primary-dark shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🏢 My Listings ({vendorListings.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'packages' ? 'bg-white text-primary-dark shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🎁 Packages & Bundles ({vendorCombos.length})
        </button>
        <button
          onClick={() => setActiveTab('new_listing')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'new_listing' ? 'bg-white text-primary-dark shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          + Create Listing
        </button>
      </div>

      {/* 1. OVERVIEW KPI TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-border shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold">
                <span>Active Listings</span>
                <Store className="w-4 h-4 text-primary" />
              </div>
              <div className="font-serif font-extrabold text-3xl text-foreground">
                {vendorListings.filter(l => l.status === 'active').length}
              </div>
              <p className="text-[11px] text-muted-foreground">Live in search results</p>
            </div>

            <div 
              onClick={() => setActiveTab('leads')}
              className="p-5 bg-white rounded-2xl border border-border shadow-2xs space-y-2 cursor-pointer hover:border-accent transition-colors group"
            >
              <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold">
                <span>Total Leads Received</span>
                <Inbox className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif font-extrabold text-3xl text-foreground flex items-center gap-2">
                <span>{totalLeadsCount}</span>
                {pendingLeadsCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-subtle text-accent-dark border border-accent/40">
                    {pendingLeadsCount} Pending
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>{pendingLeadsCount} awaiting vendor action</span>
                <span className="text-primary font-bold group-hover:underline">Open &rarr;</span>
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-border shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold">
                <span>Calendar Staleness Radar</span>
                <Clock className="w-4 h-4 text-success" />
              </div>
              <div className="font-serif font-extrabold text-xl text-success">
                {currentListing ? getDaysAgoText(currentListing.calendarLastUpdatedAt).text : 'Up to Date'}
              </div>
              <p className="text-[11px] text-muted-foreground">Tap dates regularly to keep availability fresh</p>
            </div>
          </div>

          {/* Recent Leads Preview */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-foreground">Recent Inquiries & Booking Requests</h3>
              <button 
                onClick={() => setActiveTab('leads')} 
                className="text-xs font-bold text-primary hover:text-primary-dark hover:underline cursor-pointer"
              >
                View & Manage All ({totalLeadsCount}) &rarr;
              </button>
            </div>

            {allEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground bg-muted/40 rounded-xl border border-border">
                No customer inquiries submitted yet. Explore listings on Celebratz and send a test request!
              </div>
            ) : (
              <div className="space-y-2.5">
                {allEnquiries.slice(0, 5).map(enq => (
                  <div key={enq.id} className="p-3.5 bg-muted/40 hover:bg-muted/80 transition-colors rounded-xl border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground">{enq.customerName}</span>
                        <span className="text-muted-foreground">&bull; {enq.eventType} ({enq.eventDate}) &bull; {enq.customerPhone}</span>
                        <span className="text-foreground font-semibold">&rarr; {enq.listingTitle}</span>
                        {(enq.comboPackageTitle || enq.selectedPackageName) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-subtle text-accent-dark border border-accent/40">
                            <Package className="w-3 h-3 text-accent" />
                            <span>{enq.comboPackageTitle || enq.selectedPackageName}</span>
                            {enq.selectedPackagePrice && (
                              <span className="text-primary-dark font-serif font-extrabold ml-0.5">
                                ({formatIndianCurrency(enq.selectedPackagePrice)})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground italic">"{enq.message}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        enq.vendorStatus === 'accepted' ? 'bg-success-subtle text-success' : 
                        enq.vendorStatus === 'declined' ? 'bg-destructive-subtle text-destructive' : 'bg-accent-subtle text-accent-dark'
                      }`}>
                        {enq.vendorStatus}
                      </span>
                      {enq.vendorStatus === 'pending' && (
                        <button
                          onClick={() => {
                            setActiveTab('leads');
                            setSelectedLeadStatusFilter('pending');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-dark cursor-pointer shadow-2xs"
                        >
                          Review & Accept
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LEADS & ENQUIRIES INBOX */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Header & Filter Controls Bar */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                  <span>Client Inquiries & Booking Requests</span>
                  {pendingLeadsCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent-subtle text-accent-dark border border-accent/40">
                      {pendingLeadsCount} Pending Action
                    </span>
                  )}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review event dates, preferred visit slots, custom notes, and accept or decline incoming customer requests.
                </p>
              </div>

              {/* Listing / Service Selector Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="lead-listing-filter" className="text-xs font-semibold text-muted-foreground shrink-0">
                  Filter by Listing:
                </label>
                <select
                  id="lead-listing-filter"
                  value={selectedLeadListingFilter}
                  onChange={(e) => setSelectedLeadListingFilter(e.target.value)}
                  className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-foreground bg-muted/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  <option value="all">All Listings & Services ({totalLeadsCount} leads)</option>
                  {Array.from(new Set(allEnquiries.map(e => e.listingId).filter(Boolean))).map((lid, idx) => {
                    const lObj = listings.find(l => l.id === lid);
                    const lTitle = lObj?.title || allEnquiries.find(e => e.listingId === lid)?.listingTitle || lid;
                    const countForListing = allEnquiries.filter(e => e.listingId === lid).length;
                    return (
                      <option key={lid || `lid_${idx}`} value={lid}>
                        {lTitle} ({countForListing})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle">
              <span className="text-xs font-bold text-muted-foreground mr-1">Status:</span>
              <button
                onClick={() => setSelectedLeadStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedLeadStatusFilter === 'all'
                    ? 'bg-primary-dark text-white shadow-2xs'
                    : 'bg-muted text-foreground hover:bg-muted'
                }`}
              >
                All ({totalLeadsCount})
              </button>
              <button
                onClick={() => setSelectedLeadStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedLeadStatusFilter === 'pending'
                    ? 'bg-accent text-foreground shadow-2xs'
                    : 'bg-accent-subtle text-accent-dark hover:bg-accent-subtle border border-accent/30'
                }`}
              >
                <span>⏳ Awaiting Action</span>
                <span className="px-1.5 py-0.2 bg-accent text-white rounded-full text-[10px]">
                  {pendingLeadsCount}
                </span>
              </button>
              <button
                onClick={() => setSelectedLeadStatusFilter('accepted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedLeadStatusFilter === 'accepted'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-success-subtle text-success hover:bg-success-subtle border border-success/20'
                }`}
              >
                <span>✓ Accepted</span>
                <span className="px-1.5 py-0.2 bg-success-subtle text-success rounded-full text-[10px]">
                  {acceptedLeadsCount}
                </span>
              </button>
              <button
                onClick={() => setSelectedLeadStatusFilter('declined')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedLeadStatusFilter === 'declined'
                    ? 'bg-destructive text-white shadow-2xs'
                    : 'bg-destructive-subtle text-destructive hover:bg-destructive-subtle border border-destructive/20'
                }`}
              >
                <span>✕ Declined</span>
                <span className="px-1.5 py-0.2 bg-destructive-subtle text-destructive rounded-full text-[10px]">
                  {declinedLeadsCount}
                </span>
              </button>
            </div>
          </div>

          {/* Enquiries List */}
          {displayedVendorEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center text-xs text-muted-foreground space-y-2">
              <Inbox className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="font-semibold text-foreground text-sm">No inquiries match the selected filter.</p>
              <p className="text-muted-foreground">
                {selectedLeadStatusFilter !== 'all' || selectedLeadListingFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSelectedLeadStatusFilter('all');
                      setSelectedLeadListingFilter('all');
                    }}
                    className="text-primary font-bold underline cursor-pointer"
                  >
                    Clear filters to view all {totalLeadsCount} inquiries
                  </button>
                ) : (
                  'No leads received yet. Test submitting an inquiry from any listing on Celebratz!'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedVendorEnquiries.map(enq => {
                const matchedListing = listings.find(l => l.id === enq.listingId);
                const matchedCombo = enq.comboPackageId 
                  ? comboPackages.find(c => c.id === enq.comboPackageId) 
                  : comboPackages.find(c => c.title.toLowerCase() === enq.comboPackageTitle?.toLowerCase());
                const matchedTier = matchedListing?.pricingPackages?.find(p => p.name.toLowerCase() === enq.selectedPackageName?.toLowerCase());
                const hasAttachedPackage = Boolean(enq.comboPackageTitle || enq.selectedPackageName || enq.selectedPackagePrice);

                const cleanDigits = enq.customerPhone ? enq.customerPhone.replace(/\D/g, '').slice(-10) : '';
                const waMessage = encodeURIComponent(
                  `Hello ${enq.customerName}, this is ${enq.vendorName} regarding your Celebratz request for ${enq.eventType} on ${enq.eventDate}${enq.comboPackageTitle ? ` (${enq.comboPackageTitle} combo)` : enq.selectedPackageName ? ` (${enq.selectedPackageName} package)` : ''}. We have accepted your request and would love to coordinate next steps with you!`
                );

                return (
                  <div key={enq.id} className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3.5 hover:border-accent/40 transition-colors">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif font-bold text-base text-foreground">{enq.customerName}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-muted text-foreground">
                            {enq.requestType === 'request_to_book' ? 'Booking / Visit Request' : 'General Enquiry'}
                          </span>
                          {enq.guestCount && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted/40 text-muted-foreground border border-border">
                              👥 {enq.guestCount} Guests
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Listing: <span className="font-semibold text-foreground">{enq.listingTitle}</span> &bull; Received {new Date(enq.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          enq.vendorStatus === 'accepted' ? 'bg-success-subtle text-success border border-success/30' :
                          enq.vendorStatus === 'declined' ? 'bg-destructive-subtle text-destructive border border-destructive/30' : 
                          'bg-accent-subtle text-accent-dark border border-accent/40 animate-pulse'
                        }`}>
                          Status: {enq.vendorStatus === 'pending' ? 'Pending Action' : enq.vendorStatus}
                        </span>
                      </div>
                    </div>

                    {/* ATTACHED PACKAGE / COMBO CARD - HIGHLIGHTED FOR VENDOR */}
                    {hasAttachedPackage ? (
                      <div className="p-3.5 rounded-xl border bg-gradient-to-r from-accent-subtle/90 via-primary-subtle/40 to-muted/40 border-accent/90 space-y-2.5 shadow-2xs">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-primary text-accent flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-0.5">
                              {enq.comboPackageTitle || enq.comboPackageId ? '🌟' : '🎁'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-dark bg-primary-subtle/90 px-2 py-0.5 rounded-md">
                                  {enq.comboPackageTitle || enq.comboPackageId ? '🌟 All-in-One Multi-Service Combo' : 'Attached Pricing Tier'}
                                </span>
                                {matchedTier?.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-accent-subtle text-accent-dark border border-accent/40 rounded-full">
                                    {matchedTier.badge}
                                  </span>
                                )}
                                {matchedCombo?.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-accent-subtle text-accent-dark border border-accent/40 rounded-full">
                                    {matchedCombo.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-sm text-foreground mt-1 truncate">
                                {enq.comboPackageTitle || enq.selectedPackageName}
                              </h4>
                            </div>
                          </div>

                          <div className="text-left sm:text-right bg-white px-3 py-1.5 rounded-xl border border-accent/30 shadow-2xs shrink-0">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                              Selected Package Value
                            </span>
                            <span className="font-serif font-extrabold text-sm sm:text-base text-primary-dark">
                              {enq.selectedPackagePrice ? formatIndianCurrency(enq.selectedPackagePrice) : 'Custom Quote'}
                            </span>
                          </div>
                        </div>

                        {/* Bundled Services in Combo */}
                        {matchedCombo && matchedCombo.includedServices && matchedCombo.includedServices.length > 0 && (
                          <div className="pt-2 border-t border-accent/80 text-xs">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase text-primary-dark tracking-wider flex items-center gap-1">
                                <Layers className="w-3 h-3 text-primary" />
                                Bundled Inclusions ({matchedCombo.includedServices.length} Services):
                              </span>
                              {matchedCombo.savingsAmount > 0 && (
                                <span className="text-[10px] font-bold text-success bg-success-subtle px-1.5 py-0.2 rounded-md border border-success/20">
                                  Combo Savings: {formatIndianCurrency(matchedCombo.savingsAmount)} ({matchedCombo.savingsPercentage}% OFF)
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {matchedCombo.includedServices.map((srv, si) => (
                                <div key={`${enq.id}_srv_${srv.listingId || si}_${si}`} className="text-[11px] bg-white border border-accent/90 px-2 py-1 rounded-lg text-foreground flex items-center justify-between gap-1 shadow-2xs">
                                  <div className="truncate">
                                    <span className="font-bold text-primary uppercase text-[9px] mr-1">{srv.category.replace('_', ' ')}:</span>
                                    <span className="font-medium text-foreground">{srv.listingTitle}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-muted-foreground shrink-0 font-serif">
                                    {formatIndianCurrency(srv.originalPrice)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Features in Tier Package */}
                        {matchedTier && matchedTier.features && matchedTier.features.length > 0 && (
                          <div className="pt-2 border-t border-accent/80 text-xs">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                              Package Inclusions:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-foreground">
                              {matchedTier.features.map((feat, fi) => (
                                <li key={`${enq.id}_feat_${fi}_${feat}`} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-primary shrink-0" />
                                  <span className="truncate">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-3.5 py-2.5 bg-muted/40 rounded-xl border border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-bold text-foreground">General Inquiry / Custom Quote</span> &bull; No fixed package attached
                        </span>
                        {matchedListing && (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            Base Starting Price: <strong className="text-primary-dark font-serif">{formatIndianCurrency(matchedListing.startingPrice)}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Customer Contact & Event Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-muted/40 rounded-xl border border-border text-xs">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        <span className="font-bold text-foreground">{enq.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span className="text-foreground truncate">{enq.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-accent" />
                        <span className="font-semibold text-foreground">{enq.eventType} &bull; {enq.eventDate}</span>
                      </div>
                    </div>

                    {/* Notes & Visit Slot */}
                    <div className="text-xs text-foreground p-3.5 bg-white rounded-xl border border-border space-y-1.5">
                      <div>
                        <span className="font-bold text-foreground">Client Note:</span> "{enq.message}"
                      </div>
                      {enq.preferredVisitTime && (
                        <div className="text-foreground text-xs bg-accent-subtle/70 p-2 rounded-lg border border-accent/30 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span><strong>Preferred Visit / Call Slot:</strong> {enq.preferredVisitTime}</span>
                        </div>
                      )}
                      {enq.vendorResponseNote && (
                        <div className="pt-2 border-t border-border-subtle text-primary-dark font-medium bg-success-subtle/50 p-2 rounded-lg">
                          <strong className="text-success">Your Response Note:</strong> "{enq.vendorResponseNote}"
                        </div>
                      )}
                    </div>

                    {/* Custom Reply Box (when toggled) */}
                    {customReplyEnquiryId === enq.id && (
                      <div className="p-4 bg-muted/40 rounded-xl border border-accent/40 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-accent" />
                            <span>Add Personalized Note for {enq.customerName}:</span>
                          </label>
                          <button
                            onClick={() => {
                              setCustomReplyEnquiryId(null);
                              setVendorReplyNote('');
                            }}
                            className="text-muted-foreground hover:text-muted-foreground text-xs cursor-pointer font-bold"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                        <textarea
                          value={vendorReplyNote}
                          onChange={(e) => setVendorReplyNote(e.target.value)}
                          placeholder="e.g. We have blocked Saturday 4 PM for your venue walkthrough and catering tasting! Looking forward to meeting you."
                          rows={2}
                          className="w-full p-2.5 bg-white rounded-xl border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const note = vendorReplyNote.trim() || 'Thank you! We have accepted your request and will reach out shortly to coordinate details.';
                              updateEnquiryStatus(enq.id, 'accepted', note);
                              setCustomReplyEnquiryId(null);
                              setVendorReplyNote('');
                              setFeedbackToast({
                                title: 'Lead Accepted! 🎊',
                                message: `You accepted ${enq.customerName}'s inquiry with your custom response note.`,
                                type: 'success'
                              });
                            }}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span>Send Acceptance Note & Confirm</span>
                          </button>
                          <button
                            onClick={() => {
                              const note = vendorReplyNote.trim() || 'Unfortunately we are fully booked or unavailable on this date.';
                              updateEnquiryStatus(enq.id, 'declined', note);
                              setCustomReplyEnquiryId(null);
                              setVendorReplyNote('');
                              setFeedbackToast({
                                title: 'Inquiry Declined',
                                message: `You declined ${enq.customerName}'s inquiry with your note.`,
                                type: 'info'
                              });
                            }}
                            className="px-3.5 py-2 bg-muted hover:bg-border text-foreground rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Decline with Note
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions for Pending Enquiries */}
                    {enq.vendorStatus === 'pending' && customReplyEnquiryId !== enq.id && (
                      <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            updateEnquiryStatus(enq.id, 'accepted', 'Thank you! We have accepted your request and will reach out shortly to finalize details.');
                            setFeedbackToast({
                              title: 'Lead Accepted! 🎊',
                              message: `You accepted ${enq.customerName}'s request for ${enq.eventType}. Client phone number and WhatsApp direct chat are now available below.`,
                              type: 'success'
                            });
                          }}
                          className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span>Accept Request</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCustomReplyEnquiryId(enq.id);
                            setVendorReplyNote('Thank you for reaching out to us! We are available for your event date and would love to schedule a walkthrough.');
                          }}
                          className="px-3.5 py-2.5 bg-accent-subtle hover:bg-accent-subtle text-accent-dark border border-accent/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-accent" />
                          <span>Accept with Custom Note</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateEnquiryStatus(enq.id, 'declined', 'Unfortunately we are fully booked or unavailable on this date.');
                            setFeedbackToast({
                              title: 'Inquiry Declined',
                              message: `You declined ${enq.customerName}'s request for ${enq.eventType}.`,
                              type: 'info'
                            });
                          }}
                          className="px-3.5 py-2.5 bg-muted hover:bg-muted text-foreground rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-4 h-4 text-destructive" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {/* Post-Acceptance Quick Contact Actions for Vendor */}
                    {enq.vendorStatus === 'accepted' && (
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border-subtle">
                        <div className="flex items-center gap-2 flex-wrap">
                          {cleanDigits && (
                            <a
                              href={`tel:${cleanDigits}`}
                              className="px-3.5 py-2 bg-muted hover:bg-muted text-foreground rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-border cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-primary" />
                              <span>Call Client ({enq.customerPhone})</span>
                            </a>
                          )}

                          {cleanDigits && (
                            <a
                              href={`https://wa.me/91${cleanDigits}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-success hover:bg-success text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-success-subtle" />
                              <span>Chat on WhatsApp</span>
                            </a>
                          )}

                          <a
                            href={`mailto:${enq.customerEmail}?subject=Celebratz Booking Confirmation - ${enq.eventType}`}
                            className="px-3.5 py-2 bg-muted hover:bg-muted text-foreground rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-border"
                          >
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Email</span>
                          </a>
                        </div>

                        {customReplyEnquiryId !== enq.id && (
                          <button
                            onClick={() => {
                              setCustomReplyEnquiryId(enq.id);
                              setVendorReplyNote(enq.vendorResponseNote || '');
                            }}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 text-muted-foreground" />
                            <span>Update Note</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Post-Decline Actions for Vendor */}
                    {enq.vendorStatus === 'declined' && (
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs text-destructive bg-destructive-subtle/70 p-2.5 rounded-xl border border-destructive/20">
                        <span>This request was declined.</span>
                        <button
                          onClick={() => {
                            updateEnquiryStatus(enq.id, 'accepted', 'Re-evaluated schedule: we are delighted to accept your request!');
                            setFeedbackToast({
                              title: 'Status Updated to Accepted! 🎊',
                              message: `You accepted ${enq.customerName}'s request.`,
                              type: 'success'
                            });
                          }}
                          className="text-primary font-bold underline hover:text-primary-dark cursor-pointer"
                        >
                          Change to Accepted
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. TAP-TO-TOGGLE AVAILABILITY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-border p-6 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border-subtle">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Tap-to-Toggle Availability Manager
              </h2>
              <p className="text-xs text-muted-foreground">
                Click any calendar date to cycle: <span className="font-bold text-success">Available</span> ➔ <span className="font-bold text-accent">Tentative</span> ➔ <span className="font-bold text-destructive">Booked</span>. Updates your last-updated timestamp immediately.
              </p>
            </div>

            {/* Listing Switcher for Vendors with Multiple Listings */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-muted-foreground shrink-0">Listing:</label>
              <select
                value={selectedListingForCalendar}
                onChange={(e) => setSelectedListingForCalendar(e.target.value)}
                className="bg-muted/40 border border-border rounded-xl p-2 text-xs font-semibold text-foreground outline-hidden"
              >
                {vendorListings.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Month Navigation & Stats Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCalendarMonthOffset(prev => prev - 1)}
                  className="p-2 rounded-xl border border-border bg-white hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-serif font-bold text-base sm:text-lg text-foreground px-2 min-w-[140px] text-center">
                  {monthName}
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarMonthOffset(prev => prev + 1)}
                  className="p-2 rounded-xl border border-border bg-white hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {calendarMonthOffset !== 0 && (
                <button
                  type="button"
                  onClick={() => setCalendarMonthOffset(0)}
                  className="text-xs font-bold text-primary hover:text-primary-dark underline cursor-pointer"
                >
                  Current Month
                </button>
              )}
            </div>

            {/* Quick Summary Counts */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-subtle text-success font-bold">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>{calendarDays.filter(d => d.status === 'available').length} Available</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-subtle text-accent-dark font-bold">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>{calendarDays.filter(d => d.status === 'tentative').length} Tentative</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive-subtle text-destructive font-bold">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                <span>{calendarDays.filter(d => d.status === 'booked').length} Booked</span>
              </span>
            </div>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="p-1 sm:p-2 opacity-0 pointer-events-none" />
            ))}

            {calendarDays.map(({ dayNum, dateStr, status }) => {
              let btnStyle = 'bg-success-subtle text-success hover:bg-success-subtle/90';
              let textColor = 'text-success';
              let label = 'Available';

              if (status === 'tentative') {
                btnStyle = 'bg-accent-subtle text-accent-dark hover:bg-accent-subtle';
                textColor = 'text-accent-dark';
                label = 'Tentative';
              } else if (status === 'booked') {
                btnStyle = 'bg-destructive-subtle text-destructive hover:bg-destructive-subtle';
                textColor = 'text-destructive';
                label = 'Booked';
              }

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => currentListing && toggleCalendarDate(currentListing.id, dateStr)}
                  title={`${dateStr}: ${status.toUpperCase()} (Tap to toggle)`}
                  className={`p-1 sm:p-2 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[46px] sm:min-h-[52px] transition-all cursor-pointer select-none active:scale-95 overflow-hidden ${btnStyle}`}
                >
                  <span className="font-sans font-bold text-xs sm:text-sm text-foreground leading-none">
                    {dayNum}
                  </span>
                  
                  {/* Status Text (compact, clean sans font style suited for small text) */}
                  <span className={`font-sans font-semibold text-[6.5px] sm:text-[8px] tracking-normal leading-tight whitespace-nowrap truncate w-full text-center block ${textColor}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-muted/40 rounded-xl border border-border flex justify-between items-center text-xs text-muted-foreground">
            <span>Last Updated: <strong className="text-foreground">{currentListing ? getDaysAgoText(currentListing.calendarLastUpdatedAt).text : 'Now'}</strong></span>
            <span className="text-[11px] text-primary font-semibold">⚡ Auto-saved to live marketplace</span>
          </div>
        </div>
      )}

      {/* 4. MY LISTINGS DIRECTORY */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-foreground">Your Listed Venues & Services</h2>
            <button
              onClick={() => setActiveTab('new_listing')}
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendorListings.map(listing => {
              const cooldown = get24HourEditStatus(listing.lastEditedAt);
              return (
                <div key={listing.id} className="bg-white rounded-2xl border border-border p-4 flex flex-col justify-between shadow-xs gap-3">
                  <div className="flex gap-3">
                    <img
                      src={listing.coverImage}
                      alt=""
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-muted text-foreground">
                          {listing.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            listing.status === 'active' ? 'bg-success-subtle text-success' : 'bg-accent-subtle text-accent-dark'
                          }`}>
                            {(listing.status || 'active').replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-foreground truncate">{listing.title}</h4>
                      <p className="text-xs text-muted-foreground">{listing.locality} &bull; {formatIndianCurrency(listing.startingPrice)}/{(listing.pricingUnit || 'event').replace('per_', '')}</p>
                      
                      {/* 24-Hour Edit Restriction Pill */}
                      <div className="pt-1">
                        {!cooldown.canEdit ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-subtle text-accent-dark border border-accent/40">
                            <Lock className="w-2.5 h-2.5 text-accent" />
                            <span>Edit locked ({cooldown.formattedRemaining} left)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success border border-success/30">
                            <Unlock className="w-2.5 h-2.5 text-success" />
                            <span>Unlocked (24h window ready)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-border-subtle flex flex-wrap gap-2.5 items-center justify-between">
                    <div className="flex flex-wrap gap-2.5 items-center">
                      <button
                        onClick={() => handleStartEditListing(listing)}
                        className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                          !cooldown.canEdit 
                            ? 'text-accent-dark hover:text-accent-dark font-semibold' 
                            : 'text-primary hover:underline'
                        }`}
                        title={!cooldown.canEdit ? `Locked: Next edit unlocks in ${cooldown.formattedRemaining}` : 'Edit listing information'}
                      >
                        {!cooldown.canEdit ? <Lock className="w-3 h-3 text-accent" /> : <Edit3 className="w-3 h-3 text-primary" />}
                        <span>Edit Listing Details</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedListingForCalendar(listing.id);
                          setActiveTab('calendar');
                        }}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CalendarIcon className="w-3 h-3" />
                        Manage Calendar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedListingForTiers(listing.id);
                          setPackagesSubTab('tiers');
                          setActiveTab('packages');
                        }}
                        className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Gift className="w-3 h-3" />
                        Manage Packages ({listing.pricingPackages?.length || 0})
                      </button>
                    </div>

                    {listing.websiteUrl && (
                      <a
                        href={listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                        title="Visit Website"
                      >
                        <Globe className="w-3 h-3 text-primary" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.5 PACKAGES & COMBOS STUDIO */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary to-accent-dark text-white p-6 rounded-3xl shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-foreground">
                  Revenue Maximizer
                </span>
                <span className="text-xs text-accent-subtle">&bull; Transparent Pricing & Bundle Deals</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-accent-subtle">Packages & Bundled Deals Studio</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl font-light">
                Create tiered packages within individual listings or combine 2+ of your listings (e.g., Marriage Lawn + Decoration + Catering) into discounted All-in-One packages that win clients faster.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {vendorListings.filter(l => l.status === 'active').length < 2 ? (
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    disabled
                    title="Minimum 2 active, approved listings required to form a combo bundle"
                    className="px-4 py-2.5 bg-foreground/80 text-muted-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed opacity-70"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Create Multi-Service Combo</span>
                  </button>
                  <span className="text-[10px] text-accent font-medium">
                    (Requires 2+ active listings &bull; You have {vendorListings.filter(l => l.status === 'active').length})
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCombo(null);
                    setComboStudioOpen(true);
                  }}
                  className="px-4 py-2.5 bg-accent hover:bg-accent-subtle text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Create Multi-Service Combo</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex border-b border-border text-xs font-bold gap-6">
            <button
              type="button"
              onClick={() => setPackagesSubTab('combos')}
              className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer ${
                packagesSubTab === 'combos'
                  ? 'border-b-2 border-primary text-primary-dark font-extrabold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4 text-accent" />
              <span>Multi-Service Combo Packages ({vendorCombos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setPackagesSubTab('tiers')}
              className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer ${
                packagesSubTab === 'tiers'
                  ? 'border-b-2 border-primary text-primary-dark font-extrabold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Gift className="w-4 h-4 text-primary" />
              <span>Intra-Listing Tier Packages ({vendorListings.reduce((acc, l) => acc + (l.pricingPackages?.length || 0), 0)})</span>
            </button>
          </div>

          {/* SUB-TAB 1: MULTI-SERVICE COMBOS */}
          {packagesSubTab === 'combos' && (
            <div className="space-y-4">
              {vendorCombos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-border p-10 text-center space-y-4 shadow-xs max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-accent-subtle text-accent-dark flex items-center justify-center mx-auto text-2xl font-bold">
                    🎁
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground">No Multi-Service Combo Packages Yet</h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                      Combine two or more of your active listings (e.g. Lawn + Decor + Catering) into an irresistible discounted package. Clients love one-stop booking!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCombo(null);
                      setComboStudioOpen(true);
                    }}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    + Create Your First Multi-Service Combo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {vendorCombos.map(combo => {
                    const visibility = getPackageVisibility(combo);
                    const isComponentNotLive = !visibility.isPubliclyVisible && visibility.reason === 'INSUFFICIENT_LIVE_COMPONENTS';

                    return (
                    <div
                      key={combo.id}
                      className="bg-white rounded-3xl border border-border overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Image & Header */}
                        <div className="relative h-44 w-full bg-muted overflow-hidden">
                          <img
                            src={combo.coverImage}
                            alt={combo.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                            {combo.badge && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent text-foreground shadow-xs">
                                {combo.badge}
                              </span>
                            )}
                            {isComponentNotLive ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-accent text-accent-dark shadow-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-accent-dark" />
                                inactive — component not live
                              </span>
                            ) : (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs ${
                                combo.status === 'active' 
                                  ? 'bg-success text-white' 
                                  : combo.status === 'pending_approval'
                                  ? 'bg-accent text-accent-dark font-black'
                                  : combo.status === 'rejected'
                                  ? 'bg-destructive text-white'
                                  : 'bg-foreground/80 text-white'
                              }`}>
                                {combo.status === 'pending_approval' ? '⏳ Pending Approval' : combo.status === 'active' ? '🟢 Live' : combo.status === 'rejected' ? '🔴 Rejected' : '⏸️ Paused'}
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-accent block">
                              {(combo.includedServices?.length || combo.includedListingIds?.length || 0)} Services Bundled &bull; {combo.locality || 'Pune'}
                            </span>
                            <h3 className="font-serif font-bold text-lg leading-tight line-clamp-1">
                              {combo.title}
                            </h3>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5 space-y-4">
                          {/* Inactive Component Notice */}
                          {isComponentNotLive && (
                            <div className="p-3 bg-accent-subtle border border-accent/40 rounded-2xl text-xs text-accent-dark space-y-1">
                              <span className="font-bold flex items-center gap-1.5 text-accent-dark">
                                <AlertTriangle className="w-3.5 h-3.5 text-accent shrink-0" />
                                inactive — component not live
                              </span>
                              <p className="text-[11px] text-accent-dark leading-relaxed">
                                Only {visibility.liveComponentCount} of {visibility.totalComponentCount} component listings are live. This package is <strong>automatically hidden from public view</strong> without altering its stored status until at least 2 components are live.
                              </p>
                            </div>
                          )}

                          {combo.status === 'rejected' && combo.rejectionReason && (
                            <div className="p-3 bg-destructive-subtle border border-destructive/20 rounded-xl text-xs text-destructive space-y-1">
                              <span className="font-bold flex items-center gap-1 text-destructive">
                                ⚠️ Admin Feedback / Rejection Note:
                              </span>
                              <p className="text-[11px] text-destructive">{combo.rejectionReason}</p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {combo.description}
                          </p>

                          {/* Bundled Services Chips */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Included Service Listings:
                            </span>
                            <div className="space-y-1.5">
                              {combo.includedServices && combo.includedServices.length > 0 ? (
                                combo.includedServices.map((srv, idx) => (
                                  <div key={srv.listingId ? `${combo.id}_${srv.listingId}_${idx}` : `srv_${combo.id}_${idx}`} className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="w-5 h-5 rounded-md bg-primary-subtle text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                                        {idx + 1}
                                      </span>
                                      <span className="font-bold text-foreground truncate">{srv.listingTitle}</span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-muted text-foreground uppercase font-semibold">
                                        {srv.category}
                                      </span>
                                    </div>
                                    <span className="font-mono text-muted-foreground text-[11px] shrink-0">
                                      ₹{srv.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-muted-foreground italic">No bundled services listed</p>
                              )}
                            </div>
                          </div>

                          {/* Pricing & Discount Card */}
                          <div className="p-3.5 bg-gradient-to-r from-accent-subtle to-accent-subtle/40 rounded-2xl border border-accent/80 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground line-through">
                                  ₹{(combo.totalOriginalPrice || combo.comboPrice)?.toLocaleString('en-IN')}
                                </span>
                                <span className="px-2 py-0.5 bg-success-subtle text-success text-[10px] font-bold rounded-md">
                                  Save ₹{(combo.savingsAmount || 0)?.toLocaleString('en-IN')} ({combo.savingsPercentage || 0}% OFF)
                                </span>
                              </div>
                              <div className="font-serif font-extrabold text-xl text-primary-dark mt-0.5">
                                ₹{combo.comboPrice.toLocaleString('en-IN')}
                                <span className="text-[11px] font-normal text-muted-foreground font-sans ml-1">all-inclusive</span>
                              </div>
                            </div>

                            <span className="text-2xl font-serif">✨</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-5 py-3.5 bg-muted/40 border-t border-border-subtle flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewCombo(combo)}
                            className="px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-muted text-foreground text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCombo(combo);
                              setComboStudioOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary-subtle hover:bg-primary-subtle text-primary-dark text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {combo.status === 'pending_approval' ? (
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-accent-subtle text-accent-dark border border-accent/40 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent" />
                              <span>Under Admin Review</span>
                            </span>
                          ) : combo.status === 'rejected' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCombo(combo);
                                setComboStudioOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-destructive-subtle text-destructive border border-destructive/30 hover:bg-destructive-subtle cursor-pointer"
                            >
                              Edit & Resubmit
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateComboPackage(combo.id, { status: combo.status === 'active' ? 'paused' : 'active' })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                combo.status === 'active'
                                  ? 'bg-muted text-foreground hover:bg-border'
                                  : 'bg-success text-white hover:bg-success'
                              }`}
                            >
                              {combo.status === 'active' ? 'Pause' : 'Resume Live'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${combo.title}"?`)) {
                                deleteComboPackage(combo.id);
                              }
                            }}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive-subtle cursor-pointer"
                            title="Delete Combo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: INTRA-LISTING TIERED PACKAGES */}
          {packagesSubTab === 'tiers' && (
            <div className="space-y-6">
              {(() => {
                const activeL = listings.find(l => l.id === selectedListingForTiers) || vendorListings[0];
                const isSelectedListingActive = activeL?.status === 'active';

                return (
                  <>
                    {/* Listing Selector */}
                    <div className="p-4 bg-muted/40 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Select Listing to Manage:
                        </span>
                        <select
                          value={selectedListingForTiers}
                          onChange={(e) => setSelectedListingForTiers(e.target.value)}
                          className="bg-white border border-border rounded-xl px-3 py-1.5 text-xs text-foreground font-bold outline-hidden shadow-2xs"
                        >
                          {vendorListings.map(l => (
                            <option key={l.id} value={l.id}>
                              {l.title} ({l.category} - {l.locality}) [{l.status === 'active' ? 'Active' : 'Pending Review'}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        disabled={!isSelectedListingActive}
                        onClick={() => setIsAddingTierModal(true)}
                        title={!isSelectedListingActive ? 'Packages can only be added for approved and active listings' : 'Add new tier'}
                        className={`px-4 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-colors ${
                          isSelectedListingActive 
                            ? 'bg-primary hover:bg-primary-dark cursor-pointer' 
                            : 'bg-muted-foreground cursor-not-allowed opacity-75'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>+ Add New Package Tier</span>
                      </button>
                    </div>

                    {/* Current Listing Selected Details */}
                    {!activeL ? (
                      <div className="p-8 text-center text-xs text-muted-foreground">
                        No listing selected.
                      </div>
                    ) : (() => {
                      const tiers = activeL.pricingPackages || [];
                      const cooldown = get24HourEditStatus(activeL.lastEditedAt);

                      return (
                        <div className="space-y-4">
                          {/* Active Listing Policy Alert if Listing is Not Active */}
                          {!isSelectedListingActive && (
                            <div className="p-4 bg-accent-subtle border border-accent/40 rounded-2xl flex items-start gap-3 text-xs text-accent-dark shadow-2xs">
                              <span className="text-lg">⚠️</span>
                              <div className="space-y-0.5">
                                <span className="font-bold">Active Listing Requirement</span>
                                <p className="text-[11px] text-accent-dark leading-relaxed">
                                  Package tiers can only be configured for <strong>approved & active listings</strong>. This listing is currently <strong>{activeL.status === 'pending_approval' ? 'Pending Admin Approval' : activeL.status}</strong>. Once reviewed and approved by admin, you will be able to add and customize tiered packages.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* 24-Hour Cooldown Banner if locked */}
                          {isSelectedListingActive && !cooldown.canEdit && (
                            <div className="p-4 bg-accent-subtle border border-accent/40 rounded-2xl flex items-start sm:items-center justify-between gap-3 text-xs text-accent-dark shadow-2xs">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-accent-subtle border border-accent/40 flex items-center justify-center text-accent-dark shrink-0">
                                  <Lock className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-bold">24-Hour Edit Restriction Active</span>
                                  <p className="text-[11px] text-accent-dark">
                                    This listing was edited {cooldown.lastEditedText}. Adding or modifying package tiers requires administrative re-approval and is limited to once per 24 hours. Next edit unlocks in <strong>{cooldown.formattedRemaining}</strong>.
                                  </p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-accent-subtle text-accent-dark shrink-0">
                                Locked ({cooldown.formattedRemaining})
                              </span>
                            </div>
                          )}

                          {/* Selected Listing Summary Header */}
                          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-border shadow-2xs">
                            <img
                              src={activeL.coverImage}
                              alt=""
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-muted text-foreground">
                                  {activeL.category}
                                </span>
                                <span className="text-xs text-muted-foreground">&bull; {activeL.locality}, Pune</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  activeL.status === 'active' ? 'bg-success-subtle text-success' : 'bg-accent-subtle text-accent-dark'
                                }`}>
                                  {activeL.status === 'active' ? 'Active' : 'Pending Approval'}
                                </span>
                              </div>
                              <h3 className="font-bold text-sm text-foreground truncate">{activeL.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                Base starting price: <strong className="text-primary-dark">{formatIndianCurrency(activeL.startingPrice)}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Tiers List */}
                          {tiers.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
                              <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center mx-auto text-xl">
                                🏷️
                              </div>
                              <h4 className="font-serif font-bold text-base text-foreground">No Tiered Packages Defined for this Listing</h4>
                              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                Create 2-3 clear packages (e.g. "Standard Day Pass", "Deluxe Full Day", "Royal 24H Exclusive") with itemized features so customers know exactly what they get.
                              </p>
                              {isSelectedListingActive && (
                                <button
                                  type="button"
                                  onClick={() => setIsAddingTierModal(true)}
                                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                                >
                                  + Add First Package Tier
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {tiers.map((tier, tIdx) => (
                                <div
                                  key={tier.id || `tier_${activeL.id}_${tIdx}_${tier.name}`}
                                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs relative transition-all ${
                                    tier.isPopular ? 'border-accent ring-2 ring-accent/20' : 'border-border'
                                  }`}
                                >
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        {tier.badge && (
                                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-accent text-foreground inline-block mb-1">
                                            {tier.badge}
                                          </span>
                                        )}
                                        <h4 className="font-serif font-bold text-base text-foreground">{tier.name}</h4>
                                      </div>
                                      {isSelectedListingActive && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteTierFromListing(activeL.id, tier.id || '')}
                                          className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive-subtle cursor-pointer"
                                          title="Delete Package Tier"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>

                                    <div className="font-serif font-extrabold text-2xl text-primary-dark">
                                      ₹{tier.price.toLocaleString('en-IN')}
                                      <span className="text-xs font-normal text-muted-foreground font-sans ml-1">
                                        / {(tier.pricingUnit || 'per_event').replace('per_', '')}
                                      </span>
                                    </div>

                                    {tier.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {tier.description}
                                      </p>
                                    )}

                                    {/* Features checklist */}
                                    <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                        Included Features:
                                      </span>
                                      <ul className="space-y-1 text-xs text-foreground">
                                        {tier.features?.map((feat, fIdx) => (
                                          <li key={`${tier.id || tier.name || 'tier'}_f_${fIdx}_${feat}`} className="flex items-start gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-border-subtle flex justify-between items-center text-[11px]">
                                    <span className="text-muted-foreground">Marketplace Status</span>
                                    {tier.status === 'pending_approval' ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-subtle text-accent-dark border border-accent/40 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-accent" />
                                        Pending Admin Approval
                                      </span>
                                    ) : tier.status === 'rejected' ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive-subtle text-destructive border border-destructive/30">
                                        Rejected by Admin
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success border border-success/30 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-success" />
                                        Live in Marketplace
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </div>
          )}

          {/* Quick Add Tier Modal */}
          {isAddingTierModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border text-left my-8">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">
                      Add Tiered Service Package
                    </span>
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      New Package for {listings.find(l => l.id === selectedListingForTiers)?.title || vendorListings.find(l => l.id === selectedListingForTiers)?.title || vendorListings[0]?.title || 'Selected Listing'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingTierModal(false)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Vivah Full Day Access"
                      value={newTierName}
                      onChange={(e) => setNewTierName(e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Price (₹ INR) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 50000"
                        value={newTierPrice === '' ? '' : newTierPrice}
                        onChange={(e) => setNewTierPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Pricing Unit
                      </label>
                      <select
                        value={newTierPricingUnit}
                        onChange={(e) => setNewTierPricingUnit(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                      >
                        <option value="per_event">Per Event / Day</option>
                        <option value="per_plate">Per Plate / Guest</option>
                        <option value="per_hour">Per Hour</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Package Description & Scope
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short description of what this package is best suited for..."
                      value={newTierDesc}
                      onChange={(e) => setNewTierDesc(e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-xl p-2 text-xs text-foreground outline-hidden resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Badge (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 👑 Most Popular"
                        value={newTierBadge}
                        onChange={(e) => setNewTierBadge(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl p-2 text-xs text-foreground outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="isPop"
                        checked={newTierIsPopular}
                        onChange={(e) => setNewTierIsPopular(e.target.checked)}
                        className="w-4 h-4 rounded text-primary cursor-pointer"
                      />
                      <label htmlFor="isPop" className="text-xs font-bold text-foreground cursor-pointer">
                        Highlight as Most Popular
                      </label>
                    </div>
                  </div>

                  {/* Included features builder */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Included Package Features ({newTierFeatures.length})
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. 24-Hour AC Hall + Lawn Access"
                        value={newTierFeatureInput}
                        onChange={(e) => setNewTierFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newTierFeatureInput.trim()) {
                              setNewTierFeatures(prev => [
                                ...prev, 
                                { id: `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, text: newTierFeatureInput.trim() }
                              ]);
                              setNewTierFeatureInput('');
                            }
                          }
                        }}
                        className="flex-1 bg-muted/40 border border-border rounded-xl p-2 text-xs text-foreground outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTierFeatureInput.trim()) {
                            setNewTierFeatures(prev => [
                              ...prev, 
                              { id: `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, text: newTierFeatureInput.trim() }
                            ]);
                            setNewTierFeatureInput('');
                          }
                        }}
                        className="px-3 py-2 bg-foreground text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-1 max-h-36 overflow-y-auto p-2 bg-muted/40 rounded-xl border border-border">
                      {newTierFeatures.map((feat) => (
                        <div key={feat.id} className="flex items-center justify-between text-xs bg-white p-1.5 px-2.5 rounded-lg border border-border">
                          <span className="truncate">{feat.text}</span>
                          <button
                            type="button"
                            onClick={() => setNewTierFeatures(prev => prev.filter(f => f.id !== feat.id))}
                            className="text-muted-foreground hover:text-destructive font-bold ml-2 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddingTierModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!newTierName.trim() || !newTierPrice}
                    onClick={handleAddTierToListing}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    Save Package Tier to Listing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. CREATE / EDIT LISTING WITH DYNAMIC CATEGORY FIELDS & PHOTO UPLOADS */}
      {activeTab === 'new_listing' && (
        <form onSubmit={handleCreateListing} className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {editingListingId ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-accent text-foreground flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    Editing Listing Mode
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary text-white">
                    New Listing Creation
                  </span>
                )}
                <span className="text-xs text-muted-foreground">&bull; 24-Hour Approval Policy</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-foreground">
                {editingListingId ? `Edit Listing & Packages: ${newTitle}` : `List Your Venue or Service in ${getCityById(newCity)?.name || 'Pune'}`}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {editingListingId
                  ? 'Update your details, pricing, and package tiers. Edits will be submitted to admin for re-approval and locked for 24 hours.'
                  : 'Upload high-resolution photos, configure category specifications, and define tiered packages for maximum bookings.'}
              </p>
            </div>

            {editingListingId && (
              <button
                type="button"
                onClick={handleCancelEditListing}
                className="px-4 py-2 bg-muted hover:bg-muted text-foreground font-bold text-xs rounded-xl self-start sm:self-auto cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* 24-Hour Policy Notice Banner */}
          <div className="p-4 bg-primary-subtle border border-primary/30 rounded-2xl flex items-start gap-3 text-xs text-primary-dark">
            <div className="w-7 h-7 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ℹ️
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-primary-dark">Marketplace Integrity & Approval Policy</span>
              <p className="text-[11px] text-primary leading-relaxed">
                All listing changes and pricing updates undergo re-verification by Celebratz admin before going live. To prevent pricing fluctuations, vendors may submit listing & package edits <strong>only once every 24 hours</strong>. A confirmation modal will display prior to submission.
              </p>
            </div>
          </div>

          {submissionError && (
            <div className="p-4 bg-destructive-subtle border border-destructive/20 text-destructive rounded-2xl flex items-center justify-between text-xs font-semibold">
              <span>{submissionError}</span>
              <button
                type="button"
                onClick={() => setSubmissionError(null)}
                className="text-destructive hover:text-destructive font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {isListingCreated ? (
            <div className="p-6 bg-success-subtle text-success text-center rounded-2xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
              <h4 className="font-bold text-base">Listing Submitted for Approval!</h4>
              <p className="text-xs">Your listing has been created and placed in the admin approval queue.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Service Category *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => {
                    const isSelected = newCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setNewCategory(c.id);
                          setNewPricingUnit(c.defaultPricingUnit || (c.id === 'catering' ? 'per_plate' : 'per_day'));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-muted/40 text-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {c.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Listing Title (placed above City field) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Grand Heritage Lawns"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                />
              </div>

              {/* City & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    City (India) *
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      setNewCity(selectedCity);
                      const cityCfg = getCityById(selectedCity);
                      if (cityCfg && cityCfg.localities.length > 0) {
                        setNewLocality(cityCfg.localities[0]);
                      }
                    }}
                    className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden font-semibold"
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.state}) {c.status === 'active' ? '• Live' : '• Upcoming'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Locality / Area *
                  </label>
                  <select
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                  >
                    {(getCityById(newCity)?.localities || PUNE_LOCALITIES).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Supported Event Types */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Suitable Event Types (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map(eventType => {
                    const isSelected = newEventTypes.includes(eventType);
                    return (
                      <button
                        key={eventType}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (newEventTypes.length > 1) {
                              setNewEventTypes(prev => prev.filter(t => t !== eventType));
                            }
                          } else {
                            setNewEventTypes(prev => [...prev, eventType]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-muted/40 text-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {formatEventType(eventType)} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Address & Google Maps Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Full Venue / Studio Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Survey No. 42/1, Pancard Club Road, Baner"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Google Maps Link / Share URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://maps.app.goo.gl/... or https://goo.gl/maps/..."
                    value={newGoogleMapsUrl}
                    onChange={(e) => setNewGoogleMapsUrl(e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Paste Google Maps location link to enable 1-tap navigation
                  </span>
                </div>
              </div>

              {/* Pricing & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Starting Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 100000"
                    value={newPrice === '' ? '' : newPrice}
                    onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden font-semibold"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Base starting quotation or minimum package cost
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Pricing Unit *
                  </label>
                  <select
                    value={newPricingUnit}
                    onChange={(e) => setNewPricingUnit(e.target.value as PricingUnit)}
                    className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground font-semibold outline-hidden cursor-pointer"
                  >
                    <option value="per_day">Per Day (₹ / day — Venues, Studios, Lawns)</option>
                    <option value="per_plate">Per Plate (₹ / plate — Catering & Food Packages)</option>
                    <option value="per_event">Per Event / Ceremony (₹ / event — Decor, DJ, Pandits)</option>
                    <option value="per_hour">Per Hour (₹ / hr — Hourly Rentals & Music Sets)</option>
                    <option value="fixed_package">Fixed Package (₹ / package — All-inclusive bundle)</option>
                  </select>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Defines how your quotation is structured on cards & filters
                  </span>
                </div>
              </div>

              {/* 🏷️ PACKAGE TIERS SECTION (Optional for listings; 0 = flat pricing, 2+ = tiered) */}
              {editingListingId && (
                <div className="p-5 bg-muted/40 rounded-2xl border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        Package Tiers (Optional)
                      </h3>
                      {formListingTiers.filter(t => t.is_active !== false).length >= 2 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-subtle text-primary-dark border border-primary/30">
                          {formListingTiers.filter(t => t.is_active !== false).length} Tiers Active
                        </span>
                      ) : formListingTiers.filter(t => t.is_active !== false).length === 1 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/30">
                          ⚠️ 1 Tier Invalid
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                          Flat Pricing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                      Optionally define 2 or more named packages (e.g. Basic, Premium, Royal). Tiers inherit this listing's price unit ({newPricingUnit.replace('per_', '')}). Note: Exactly 1 tier is not allowed (0 = flat pricing, 2+ = tiered).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFormTier}
                    className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Package Tier</span>
                  </button>
                </div>

                {formListingTiers.length === 0 ? (
                  <div className="p-4 rounded-xl bg-card border border-dashed border-border text-center space-y-1">
                    <p className="text-xs font-semibold text-foreground">No package tiers configured</p>
                    <p className="text-[11px] text-muted-foreground">
                      Customers will see a single starting quotation at ₹{(Number(newPrice) || 0).toLocaleString('en-IN')} / {newPricingUnit.replace('per_', '')}. Click "+ Add Package Tier" to offer multiple package levels.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {formListingTiers.filter(t => t.is_active !== false).length === 1 && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Action Required: Exactly 1 tier is not allowed</strong>
                          <span>Add at least one more tier to offer comparison options, or delete this tier to return to flat starting pricing.</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {formListingTiers.map((tier, tIdx) => (
                        <div
                          key={tier.id || `ftier_${tIdx}`}
                          className={`p-4 rounded-xl border transition-all ${
                            tier.is_active === false
                              ? 'bg-muted/80 border-border opacity-70'
                              : 'bg-card border-border shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-border-subtle">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-primary-subtle text-primary-dark text-xs font-bold flex items-center justify-center shrink-0">
                                {tIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-foreground truncate">
                                {tier.name || `Tier ${tIdx + 1}`}
                              </span>
                              {tier.is_active === false && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                                  Soft-Deactivated
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                title={tier.is_active === false ? 'Re-activate Tier' : 'Soft-deactivate (hidden from customers but retained for past requests)'}
                                onClick={() => handleToggleFormTierActive(tIdx)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                  tier.is_active === false
                                    ? 'bg-accent-subtle text-accent-dark hover:bg-accent/20'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                {tier.is_active === false ? 'Activate' : 'Deactivate'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveFormTier(tIdx)}
                                className="p-1 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 cursor-pointer transition-colors"
                                title="Delete tier"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                  Tier Name *
                                </label>
                                <input
                                  type="text"
                                  value={tier.name}
                                  onChange={(e) => handleUpdateFormTier(tIdx, 'name', e.target.value)}
                                  placeholder="e.g. Standard Package"
                                  className="w-full bg-input/40 border border-input rounded-lg p-2 text-xs text-foreground font-semibold outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                  Price (₹ / {newPricingUnit.replace('per_', '')}) *
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={tier.price}
                                  onChange={(e) => handleUpdateFormTier(tIdx, 'price', Number(e.target.value))}
                                  className="w-full bg-input/40 border border-input rounded-lg p-2 text-xs text-foreground font-bold font-mono outline-hidden"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                Description
                              </label>
                              <input
                                type="text"
                                value={tier.description}
                                onChange={(e) => handleUpdateFormTier(tIdx, 'description', e.target.value)}
                                placeholder="Brief overview of what is included"
                                className="w-full bg-input/40 border border-input rounded-lg p-2 text-xs text-foreground outline-hidden"
                              />
                            </div>

                            {/* Features Checklist */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Included Features & Deliverables
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddFormTierFeature(tIdx)}
                                  className="text-[10px] text-primary hover:text-primary-dark font-bold cursor-pointer"
                                >
                                  + Add Feature
                                </button>
                              </div>
                              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {(tier.features || []).map((feat, fIdx) => (
                                  <div key={`feat_${tIdx}_${fIdx}`} className="flex items-center gap-1.5">
                                    <span className="text-success font-bold text-xs">✓</span>
                                    <input
                                      type="text"
                                      value={feat}
                                      onChange={(e) => handleUpdateFormTierFeature(tIdx, fIdx, e.target.value)}
                                      className="flex-1 bg-input/40 border border-border rounded-md px-2 py-1 text-[11px] text-foreground outline-hidden"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFormTierFeature(tIdx, fIdx)}
                                      className="p-1 text-muted-foreground hover:text-destructive rounded cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              )}

              {/* 📸 UNIFIED PHOTO UPLOAD SECTION (MULTIPLE PHOTOS + SELECTABLE COVER PHOTO) */}
              <div className="p-5 bg-accent-subtle/40 rounded-2xl border border-accent/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
                      <Camera className="w-4 h-4 text-accent" />
                      Photos & Media Showcase
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Upload multiple photos for your listing. You can select any photo as the cover photo; otherwise the first photo will be used automatically.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-accent-subtle text-accent-dark border border-accent/60 w-fit">
                      {uploadedPhotos.length} Photo{uploadedPhotos.length === 1 ? '' : 's'}
                    </span>
                    <div className="flex bg-muted p-0.5 rounded-lg text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setPhotoInputType('upload')}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                          photoInputType === 'upload' ? 'bg-white shadow-xs text-primary-dark font-bold' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        Browse Device
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoInputType('url')}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                          photoInputType === 'url' ? 'bg-white shadow-xs text-primary-dark font-bold' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Link className="w-3 h-3" />
                        Image URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Inputs */}
                <div className="p-4 bg-white rounded-xl border border-border space-y-4">
                  {photoInputType === 'upload' ? (
                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary bg-muted/40 hover:bg-primary-subtle/30 rounded-xl p-6 cursor-pointer transition-colors text-center group">
                      <div className="p-3 rounded-full bg-primary-subtle text-primary group-hover:scale-110 transition-transform mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-primary-dark mb-0.5">Click to browse or drop photos here</span>
                      <span className="text-xs text-muted-foreground">Select one or multiple images (JPG, PNG, WEBP)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultiplePhotosUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPhotoUrl();
                          }
                        }}
                        className="flex-1 bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoUrl}
                        className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shrink-0 shadow-xs cursor-pointer"
                      >
                        + Add Photo
                      </button>
                    </div>
                  )}

                  {/* Photo Showcase & Cover Selection Grid */}
                  {uploadedPhotos.length > 0 ? (
                    <div className="pt-2 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-1 pb-1 border-b border-border-subtle">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-accent" />
                          Listing Gallery ({uploadedPhotos.length})
                        </span>
                        <span className="text-[11px] text-muted-foreground italic">
                          Click &quot;Set as Cover&quot; on any photo to choose your main showcase image.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {uploadedPhotos.map((img, idx) => {
                          const isEffectiveCover = (selectedCoverUrl && uploadedPhotos.includes(selectedCoverUrl))
                            ? img === selectedCoverUrl
                            : idx === 0;

                          return (
                            <div 
                              key={`${img}-${idx}`} 
                              className={`relative group rounded-xl overflow-hidden aspect-4/3 bg-muted shadow-2xs transition-all ${
                                isEffectiveCover 
                                  ? 'ring-3 ring-accent border-2 border-accent shadow-md' 
                                  : 'border border-border hover:border-border'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Uploaded photo ${idx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />

                              {/* Cover Badge / Set Cover Button */}
                              {isEffectiveCover ? (
                                <span className="absolute top-1.5 left-1.5 bg-accent text-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 fill-foreground" />
                                  Cover Photo
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSelectCoverPhoto(img)}
                                  className="absolute top-1.5 left-1.5 bg-primary-dark/80 hover:bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs transition-colors opacity-90 hover:opacity-100 cursor-pointer"
                                  title="Make this the main cover photo"
                                >
                                  Set as Cover
                                </button>
                              )}

                              {/* Photo index indicator */}
                              <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                                #{idx + 1}
                              </span>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                className="absolute top-1.5 right-1.5 p-1.5 bg-destructive hover:bg-destructive text-white rounded-md shadow-xs opacity-90 hover:opacity-100 transition-all cursor-pointer"
                                title="Remove this photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-xs bg-muted/40 rounded-xl border border-border">
                      No photos added yet. Upload files or paste URLs above to showcase your business.
                    </div>
                  )}
                </div>
              </div>

              {/* 🛠️ EXPANDED CATEGORY SPECIFIC ATTRIBUTES */}
              <div className="p-5 bg-muted/40 rounded-2xl border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-dark flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Default Specifications for {CATEGORIES.find(c => c.id === newCategory)?.name || newCategory}
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-white px-2 py-0.5 rounded border border-border">
                    Category Defaults
                  </span>
                </div>

                {/* 1. VENUES */}
                {newCategory === 'venues' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Venue Type</label>
                        <select
                          value={venueType}
                          onChange={(e) => setVenueType(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-2 font-medium"
                        >
                          <option value="Marriage Lawn & Garden">Marriage Lawn & Garden</option>
                          <option value="Banquet Hall">Banquet Hall</option>
                          <option value="Luxury Resort">Luxury Resort</option>
                          <option value="Hotel Ballroom">Hotel Ballroom</option>
                          <option value="Heritage Wada">Heritage Wada</option>
                          <option value="Terrace Villa">Terrace Villa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Setup Type</label>
                        <select
                          value={venueIndoorOutdoor}
                          onChange={(e) => setVenueIndoorOutdoor(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-2 font-medium"
                        >
                          <option value="Both Hall & Lawn">Both Indoor Hall & Open Lawn</option>
                          <option value="Indoor AC Hall">Indoor AC Hall Only</option>
                          <option value="Outdoor Lawn">Outdoor Lawn Only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Catering Policy</label>
                        <select
                          value={venueCateringPolicy}
                          onChange={(e) => setVenueCateringPolicy(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-2 font-medium"
                        >
                          <option value="Both allowed">In-house + Outside Allowed</option>
                          <option value="In-house only">In-house Catering Only</option>
                          <option value="Outside catering allowed">Outside Caterers Allowed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Min Guests (Pax)</label>
                        <input
                          type="number"
                          placeholder="e.g. 200"
                          value={venueCapacityMin === '' ? '' : venueCapacityMin}
                          onChange={(e) => setVenueCapacityMin(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Max Guests (Pax)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1000"
                          value={venueCapacityMax === '' ? '' : venueCapacityMax}
                          onChange={(e) => setVenueCapacityMax(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Parking Slots</label>
                        <input
                          type="number"
                          placeholder="e.g. 200"
                          value={venueParking === '' ? '' : venueParking}
                          onChange={(e) => setVenueParking(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">AC Bridal Rooms</label>
                        <input
                          type="number"
                          placeholder="e.g. 2"
                          value={venueBridalRooms === '' ? '' : venueBridalRooms}
                          onChange={(e) => setVenueBridalRooms(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                    </div>

                    {/* Checkbox Options */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={venueHasAC}
                          onChange={(e) => setVenueHasAC(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Central AC Banquet</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={venueHasValet}
                          onChange={(e) => setVenueHasValet(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Valet Parking</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={venuePowerBackup}
                          onChange={(e) => setVenuePowerBackup(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>100% DG Power Backup</span>
                      </label>
                      <div className="flex items-center p-2.5 bg-white rounded-xl border border-border">
                        <select
                          value={venueAlcoholPolicy}
                          onChange={(e) => setVenueAlcoholPolicy(e.target.value)}
                          className="w-full bg-transparent outline-hidden font-medium text-foreground"
                        >
                          <option value="Allowed with Permit">Alcohol: Permit Ok</option>
                          <option value="Strictly Not Allowed">Alcohol: Not Allowed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PHOTOGRAPHY */}
                {newCategory === 'photography' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Delivery Timeline (Days)</label>
                        <input
                          type="number"
                          placeholder="e.g. 21"
                          value={photoTimeline === '' ? '' : photoTimeline}
                          onChange={(e) => setPhotoTimeline(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Team Crew Size</label>
                        <input
                          type="number"
                          placeholder="e.g. 4"
                          value={photoTeamSize === '' ? '' : photoTeamSize}
                          onChange={(e) => setPhotoTeamSize(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={photoDroneAvailable}
                            onChange={(e) => setPhotoDroneAvailable(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span>4K Drone Included</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={photoPreWedding}
                            onChange={(e) => setPhotoPreWedding(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span>Pre-Wedding Shoot</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Deliverables Package</label>
                      <input
                        type="text"
                        value={photoDeliverables}
                        onChange={(e) => setPhotoDeliverables(e.target.value)}
                        placeholder="Raw photos, 400 retouched, 40-page album, 4K film..."
                        className="w-full bg-white border border-border rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Camera & Lighting Equipment</label>
                      <input
                        type="text"
                        value={photoEquipment}
                        onChange={(e) => setPhotoEquipment(e.target.value)}
                        placeholder="Sony FX3 / A7S III, Ronin Gimbals, Godox Lighting..."
                        className="w-full bg-white border border-border rounded-xl p-2"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CATERING */}
                {newCategory === 'catering' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Food Category</label>
                        <select
                          value={caterVegType}
                          onChange={(e) => setCaterVegType(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-2 font-medium"
                        >
                          <option value="Pure Veg">Pure Veg Only (Jain Available)</option>
                          <option value="Veg & Non-Veg">Veg & Non-Veg (Separate Kitchens)</option>
                          <option value="Jain Options Available">Specialized Jain & Swaminarayan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Min Plates (Guests)</label>
                        <input
                          type="number"
                          placeholder="e.g. 50"
                          value={caterMinGuests === '' ? '' : caterMinGuests}
                          onChange={(e) => setCaterMinGuests(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Service Style</label>
                        <select
                          value={caterServiceStyle}
                          onChange={(e) => setCaterServiceStyle(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-2 font-medium"
                        >
                          <option value="Royal Buffet">Royal Buffet with Live Counters</option>
                          <option value="Sit-down Table Service">Traditional Sit-down Table Thali</option>
                          <option value="Interactive Live Counters">Live Street & Continental Counters</option>
                        </select>
                      </div>
                    </div>

                    {/* Cuisines Pills */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Cuisines Offered (Click to toggle)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Maharashtrian', 'North Indian', 'South Indian', 'Chaat & Live Counters', 'Continental & Italian', 'Dessert & Mocktail Bar', 'Mughlai & Biryani'].map(cuisine => {
                          const isSelected = caterCuisines.includes(cuisine);
                          return (
                            <button
                              key={cuisine}
                              type="button"
                              onClick={() => {
                                setCaterCuisines(prev => 
                                  isSelected ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-success text-white border-success' 
                                  : 'bg-white text-foreground border-border hover:border-success'
                              }`}
                            >
                              {cuisine} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={caterCrockeryIncluded}
                          onChange={(e) => setCaterCrockeryIncluded(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Bone China / Brass Crockery</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={caterLiveCounters}
                          onChange={(e) => setCaterLiveCounters(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Live Chaat / Dosa Stations</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={caterWelcomeDrinks}
                          onChange={(e) => setCaterWelcomeDrinks(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Welcome Mocktail Bar</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. DECORATION */}
                {newCategory === 'decoration' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Flower Sourcing</label>
                        <select
                          value={decorFlowerType}
                          onChange={(e) => setDecorFlowerType(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-2 font-medium"
                        >
                          <option value="Fresh Exotic & Desi Flowers">Fresh Exotic & Desi Flowers (Roses, Orchids, Marigold)</option>
                          <option value="Premium Artificial Silk">Premium High-grade Silk Flowers</option>
                          <option value="Hybrid (Fresh + Silk)">Hybrid (Fresh Mandap + Silk Backdrops)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Setup Duration Prior (Hours)</label>
                        <input
                          type="number"
                          placeholder="e.g. 6"
                          value={decorSetupHours === '' ? '' : decorSetupHours}
                          onChange={(e) => setDecorSetupHours(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Decoration Themes Supported</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Traditional Vedic Mandap', 'Royal Peshwai / Maratha', 'Floral Luxury & Exotic Blooms', 'Minimalist Boho / Pastel', 'Grand LED & Crystal', 'Outdoor Canopy'].map(theme => {
                          const isSelected = decorStyles.includes(theme);
                          return (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => {
                                setDecorStyles(prev => 
                                  isSelected ? prev.filter(t => t !== theme) : [...prev, theme]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-destructive text-white border-destructive' 
                                  : 'bg-white text-foreground border-border hover:border-destructive'
                              }`}
                            >
                              {theme} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={decorMandapCustom}
                          onChange={(e) => setDecorMandapCustom(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>100% Custom Mandap & Havan Kund Setup</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={decorLightingIncluded}
                          onChange={(e) => setDecorLightingIncluded(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Full Ambient LED, Focus Spotlights & Truss Setup</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 5. MUSIC & DJ */}
                {newCategory === 'music_dj' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Sound Wattage</label>
                        <input
                          type="text"
                          value={djWattage}
                          onChange={(e) => setDjWattage(e.target.value)}
                          placeholder="e.g. 10,000W RMS Line Array"
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Cordless Wireless Mics</label>
                        <input
                          type="number"
                          placeholder="e.g. 4"
                          value={djWirelessMics === '' ? '' : djWirelessMics}
                          onChange={(e) => setDjWirelessMics(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Music Genres</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Bollywood', 'Marathi Zingaat & Kolhapuri', 'EDM & Commercial', 'Punjabi Beats', 'Classical Shehnai / Fusion', 'English Pop'].map(g => {
                          const isSelected = djGenres.includes(g);
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setDjGenres(prev => 
                                  isSelected ? prev.filter(item => item !== g) : [...prev, g]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-purple-900 text-white border-purple-900' 
                                  : 'bg-white text-foreground border-border'
                              }`}
                            >
                              {g} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={djIncludesDholTasha}
                          onChange={(e) => setDjIncludesDholTasha(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Live Puneri Dhol Tasha Pathak Available</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-border cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={djVisualsLights}
                          onChange={(e) => setDjVisualsLights(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>LED Video Wall, Sharpies & Fog Machines</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 6. PANDIT & PRIEST */}
                {newCategory === 'pandit_priest' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Years of Vedic Experience</label>
                        <input
                          type="number"
                          placeholder="e.g. 15"
                          value={panditExp === '' ? '' : panditExp}
                          onChange={(e) => setPanditExp(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-border rounded-xl p-2"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={panditSamagriIncluded}
                            onChange={(e) => setPanditSamagriIncluded(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span>Complete Havan & Puja Samagri Included</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={panditMuhuratConsultation}
                            onChange={(e) => setPanditMuhuratConsultation(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span>Kundali & Shubh Muhurat Consultation</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Rituals & Ceremonies Supported</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Vedic Vivah (Wedding)', 'Sakharpuda / Engagement', 'Griha Pravesh / Vastu', 'Satyanarayan Puja', 'Upanayan (Thread Ceremony)'].map(ceremony => {
                          const isSelected = panditCeremonies.includes(ceremony);
                          return (
                            <button
                              key={ceremony}
                              type="button"
                              onClick={() => {
                                setPanditCeremonies(prev => 
                                  isSelected ? prev.filter(c => c !== ceremony) : [...prev, ceremony]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-orange-900 text-white border-orange-900' 
                                  : 'bg-white text-foreground border-border'
                              }`}
                            >
                              {ceremony} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 🏷️ CUSTOM VENDOR ATTRIBUTES / HIGHLIGHTS BUILDER */}
              <div className="p-5 bg-primary-subtle/40 rounded-2xl border border-primary/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Custom Features & Highlights
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Add any custom key-value details unique to your service (e.g. "Chauffeur Service", "Sound Curfew", "Bridal Dressing Studio", "Eco-friendly Decor").
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomAttribute}
                    className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Feature</span>
                  </button>
                </div>

                {customAttributes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">
                    No custom features added yet. Click &quot;Add Custom Feature&quot; above to add your own bullet points.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {customAttributes.map((attr, idx) => (
                      <div key={attr.id || `attr_${idx}_${attr.label}`} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-border shadow-2xs">
                        <div className="w-1/3">
                          <input
                            type="text"
                            placeholder="Feature Name (e.g. Valet Parking)"
                            value={attr.label}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'label', e.target.value)}
                            className="w-full bg-muted/40 border border-border rounded-lg p-2 text-xs text-foreground font-semibold outline-hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Feature Details (e.g. 10 Dedicated Drivers Included)"
                            value={attr.value}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'value', e.target.value)}
                            className="w-full bg-muted/40 border border-border rounded-lg p-2 text-xs text-foreground outline-hidden"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomAttribute(idx)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive-subtle rounded-lg transition-colors cursor-pointer"
                          title="Remove custom feature"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 🎁 PACKAGES & TIERS CREATION NOTICE (CREATION FOR ACTIVE LISTINGS ONLY) */}
              <div className="p-5 bg-gradient-to-r from-primary-subtle/70 via-muted/40 to-accent-subtle/50 rounded-2xl border border-primary/90 space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-serif font-bold text-sm text-foreground">
                    Packages & Pricing Tiers Policy
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To ensure quality compliance, vendors can create tiered packages and multi-service bundles for <strong>approved and active listings only</strong>. Once this new listing is reviewed and approved by the admin team, you can configure your custom package tiers anytime from the <strong>Packages Studio</strong>.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description & Highlights *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your venue layout, stage facilities, packages, or equipment..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>{editingListingId ? 'Review & Submit Listing Changes' : 'Review & Submit Listing for Approval'}</span>
              </button>
            </div>
          )}
        </form>
      )}

      {/* Combo Bundle Studio Modal */}
      {comboStudioOpen && (
        <ComboBundleStudioModal
          isOpen={comboStudioOpen}
          onClose={() => {
            setComboStudioOpen(false);
            setEditingCombo(null);
          }}
          initialCombo={editingCombo || undefined}
        />
      )}

      {/* Combo Package Preview Modal */}
      {previewCombo && (
        <ComboPackageDetailModal
          isOpen={!!previewCombo}
          onClose={() => setPreviewCombo(null)}
          combo={previewCombo}
        />
      )}

      {/* 24-Hour Cooldown Notice Dialog */}
      {cooldownNoticeModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-accent-subtle border border-accent/40 flex items-center justify-center text-accent-dark">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">24-Hour Edit Restriction</h3>
                  <span className="text-[11px] font-bold text-accent">Marketplace Verification Policy</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCooldownNoticeModal(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-accent-subtle rounded-2xl border border-accent/30 space-y-2 text-xs text-accent-dark">
              <div className="flex items-center justify-between font-bold">
                <span>{cooldownNoticeModal.listingTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-subtle text-[10px]">
                  {cooldownNoticeModal.formattedRemaining} Remaining
                </span>
              </div>
              <p className="text-[11px] text-accent-dark leading-relaxed">
                This listing or its packages were modified <strong>{cooldownNoticeModal.lastEditedText}</strong>. To ensure accurate pricing for active client enquiries, vendors can submit listing & package revisions only once every 24 hours.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCooldownNoticeModal(null)}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing / Package Submission Confirmation Modal */}
      {confirmationModal && (
        <SubmissionConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={confirmationModal.onConfirm}
          details={confirmationModal.details}
        />
      )}
    </div>
  );
};
