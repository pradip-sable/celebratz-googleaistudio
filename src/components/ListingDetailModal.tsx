import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar as CalendarIcon, 
  Users, 
  Check, 
  ShieldCheck, 
  Heart, 
  Scale, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Sparkles, 
  Car, 
  Utensils, 
  Camera, 
  Music, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  Share2,
  ChevronLeft,
  ChevronRight,
  Navigation,
  ExternalLink,
  Compass,
  Tag,
  Layers,
  Send,
  Gift,
  Globe,
  Copy,
  MessageSquare
} from 'lucide-react';
import { Listing, CalendarStatus, ComboPackage } from '../types';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency, getDaysAgoText } from '../utils/theme';
import { CATEGORIES } from '../data/categories';
import { getEffectivePrice } from '../utils/pricing';
import { getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl, openGoogleMaps } from '../utils/mapUtils';
import { ComboPackageDetailModal } from './ComboPackageDetailModal';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

export const ListingDetailModal: React.FC = () => {
  const { 
    selectedListingId, 
    setSelectedListingId, 
    setActiveRoute,
    getListingById, 
    toggleWishlist, 
    isInWishlist, 
    toggleComparison, 
    comparisonList, 
    setIsEnquiryModalOpen,
    getListingReviews,
    designPrefs,
    getComboPackagesForListing,
    openEnquiryForPackage
  } = useApp();

  // Safely lock background scrolling and restore scroll position without jumping to bottom
  useModalScrollLock(Boolean(selectedListingId), () => setSelectedListingId(null));

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);
  const [selectedComboForView, setSelectedComboForView] = useState<ComboPackage | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!selectedListingId) return null;
  const listing = getListingById(selectedListingId);
  if (!listing) return null;

  const isSaved = isInWishlist(listing.id);
  const isCompared = comparisonList.includes(listing.id);
  const categoryMeta = CATEGORIES.find(c => c.id === listing.category);
  const { text: daysAgoText, isStale } = getDaysAgoText(listing.calendarLastUpdatedAt);
  const reviews = getListingReviews(listing.id);
  const availableCombos = getComboPackagesForListing(listing.id);

  // Derive active package tiers (2+ required to be tiered, else flat pricing)
  const activeTiers = React.useMemo(() => {
    if (listing.listing_tiers && listing.listing_tiers.length >= 2) {
      return listing.listing_tiers.filter(t => t.is_active !== false && t.status !== 'rejected');
    }
    if (listing.pricingPackages && listing.pricingPackages.length >= 2) {
      return listing.pricingPackages
        .filter(p => p.status !== 'rejected')
        .map((p, idx) => ({
          id: p.id || `tier_${listing.id}_${idx}`,
          listing_id: listing.id,
          name: p.name,
          description: p.description,
          price: p.price,
          features: p.features || [],
          sort_order: idx + 1,
          is_active: p.status !== 'inactive',
          isPopular: p.isPopular,
          badge: p.badge
        }));
    }
    return [];
  }, [listing]);

  const hasTiers = activeTiers.length >= 2;
  const effectivePrice = getEffectivePrice(listing);

  // Generate calendar days for current view (anchor to 1st of month to avoid day-31 overflow bugs)
  const today = new Date();
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth() + selectedMonthOffset, 1);
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const status: CalendarStatus = listing.calendar[dateStr] || 'available';
    return { dayNum, dateStr, status };
  });

  const handleOpenEnquiry = () => {
    setIsEnquiryModalOpen(true);
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      const base = `${window.location.origin}${window.location.pathname}`;
      return `${base}?listing=${listing.id}`;
    }
    return `https://celebratz.com/listing/${listing.id}`;
  };

  const shareTitle = `${listing.title} | Celebratz Pune`;
  const shareText = `Check out ${listing.title} (${categoryMeta?.name || listing.category}) in ${listing.locality}, Pune on Celebratz! Starting from ${formatIndianCurrency(listing.startingPrice)}/${(listing.pricingUnit || 'event').replace('per_', '')}.`;

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('textarea');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url
        });
        return;
      } catch (e) {
        // Fallback to modal if cancelled or unsupported
      }
    }
    setIsShareModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative">
        {/* Sticky Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-900 border border-teal-200">
              {categoryMeta?.name || listing.category}
            </span>
            <span className="text-xs text-stone-500 hidden sm:inline">&bull; {listing.locality}, Pune</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNativeShare}
              className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-teal-900 border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline text-xs font-semibold">Share</span>
            </button>

            <button
              onClick={() => toggleComparison(listing.id)}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isCompared ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare Tray' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(listing.id)}
              className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-rose-600 border border-stone-200 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedListingId(null)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8">
          {/* 1. Photo Gallery Carousel / Mosaic */}
          <div className="space-y-3">
            <div className="h-64 sm:h-96 rounded-2xl overflow-hidden relative shadow-inner bg-stone-900">
              <img
                src={listing.galleryImages[activeImageIndex] || listing.coverImage}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                Photo {activeImageIndex + 1} of {listing.galleryImages.length || 1}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {listing.galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-teal-800 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Listing Title, Locality & Pricing Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-stone-200">
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                {listing.googleMapsUrl && listing.googleMapsUrl.trim().length > 0 ? (
                  <>
                    <a
                      href={getGoogleMapsDirectionsUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-teal-900 font-medium bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-lg transition-colors group cursor-pointer"
                      title="Open location in Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="underline-offset-2 group-hover:underline">{listing.address}</span>
                      <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-teal-900 shrink-0" />
                    </a>

                    <a
                      href={getGoogleMapsDirectionsUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 text-teal-700" />
                      <span>Navigate</span>
                    </a>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 font-medium bg-stone-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{listing.address}</span>
                  </div>
                )}
                {listing.websiteUrl && (
                  <a
                    href={listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-teal-900 hover:text-teal-950 font-semibold bg-teal-50/90 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors group cursor-pointer"
                    title="Visit Official Website"
                  >
                    <Globe className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="underline-offset-2 group-hover:underline">
                      {listing.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </span>
                    <ExternalLink className="w-3 h-3 text-teal-600 group-hover:text-teal-900 shrink-0" />
                  </a>
                )}
              </div>

              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 leading-snug">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <p className="text-xs text-stone-600 font-medium">
                  Managed by <span className="text-stone-900 font-bold">{listing.vendorName}</span> &bull; Verified Pune Vendor
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 font-medium">
                  <Clock className="w-3 h-3 text-teal-700" />
                  <span>Response time: Usually within 2 hours</span>
                </span>
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  title="Share this listing"
                >
                  <Share2 className="w-3 h-3 text-amber-700" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Price Box: Tiered comparison summary if tiers exist, else flat price block */}
            {hasTiers ? (
              <div className="bg-gradient-to-br from-amber-50 to-stone-50 p-4 rounded-2xl border border-amber-300 shrink-0 w-full sm:w-auto text-left sm:text-right shadow-2xs">
                <div className="flex items-center gap-1.5 sm:justify-end mb-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-900 px-2.5 py-0.5 rounded-full bg-amber-200/80 tracking-wider">
                    Tiered Pricing ({activeTiers.length} Options)
                  </span>
                </div>
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className="text-xs text-stone-500 font-medium mr-1">from</span>
                  <span className="font-extrabold text-2xl sm:text-3xl text-teal-950 font-serif">
                    {formatIndianCurrency(effectivePrice)}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    /{(listing.pricingUnit || 'event').replace('per_', '')}
                  </span>
                </div>
                <a 
                  href="#package-tiers"
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline mt-1 block"
                >
                  Compare All {activeTiers.length} Tiers Below &darr;
                </a>
              </div>
            ) : (
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 shrink-0 w-full sm:w-auto text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-stone-600 block tracking-wider">
                  Starting Pricing
                </span>
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className="font-extrabold text-2xl sm:text-3xl text-teal-950 font-serif">
                    {formatIndianCurrency(listing.price_from ?? listing.startingPrice)}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    /{(listing.pricingUnit || 'event').replace('per_', '')}
                  </span>
                </div>
                {listing.pricingNote && (
                  <p className="text-[11px] text-stone-500 mt-1 max-w-xs">{listing.pricingNote}</p>
                )}
              </div>
            )}
          </div>

          {/* 2.5. Events Catered & Celebrations Offered */}
          {listing.eventTypes && listing.eventTypes.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/70 via-stone-50 to-amber-50/60 border border-teal-200/90 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Celebrations & Event Types Offered</span>
                </h3>
                <span className="text-[10px] font-bold text-teal-900 bg-teal-100/90 px-2.5 py-0.5 rounded-full w-fit">
                  {listing.eventTypes.length} Event Formats Supported
                </span>
              </div>
              <p className="text-xs text-stone-600">
                This verified vendor is equipped and experienced in hosting the following celebrations:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {listing.eventTypes.map((type) => {
                  const getIcon = (t: string) => {
                    switch (t) {
                      case 'Wedding': return '💍';
                      case 'Birthday': return '🎂';
                      case 'Engagement': return '🥂';
                      case 'Naming Ceremony': return '👶';
                      case 'Corporate': return '🏢';
                      default: return '🎉';
                    }
                  };
                  return (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-teal-300/80 text-stone-800 text-xs font-semibold shadow-2xs hover:border-teal-600 transition-colors"
                    >
                      <span className="text-sm">{getIcon(type)}</span>
                      <span>{type}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Category-Specific Specs Matrix */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Venue & Service Highlights
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* VENUES SPEC TILES */}
              {listing.category === 'venues' && (
                <>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                      <Users className="w-4 h-4 text-teal-800" />
                      <span>Capacity</span>
                    </div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.capacityMin} - {listing.categoryAttributes.capacityMax} Pax
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                      <Car className="w-4 h-4 text-amber-700" />
                      <span>Parking</span>
                    </div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.parkingCapacity} Vehicles
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                      <Utensils className="w-4 h-4 text-emerald-700" />
                      <span>Catering Policy</span>
                    </div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.cateringPolicy}
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                      <Sparkles className="w-4 h-4 text-sky-700" />
                      <span>AC & Rooms</span>
                    </div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.hasAC ? 'AC Hall' : 'Air Cooled'} + {listing.categoryAttributes.roomCount} Rooms
                    </div>
                  </div>
                </>
              )}

              {/* PHOTOGRAPHY SPEC TILES */}
              {listing.category === 'photography' && (
                <>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">⚡ Deliverables Timeline</div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.deliveryTimelineDays} Days Retouched
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🎥 Drone Coverage</div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.droneAvailable ? 'Included / 4K' : 'On Request'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
                    <div className="text-stone-500 text-xs mb-1">📷 Gear Specs</div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.equipmentDetails}
                    </div>
                  </div>
                </>
              )}

              {/* CATERING SPEC TILES */}
              {listing.category === 'catering' && (
                <>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🥗 Veg / Non-Veg</div>
                    <div className="font-bold text-sm text-emerald-800">
                      {listing.categoryAttributes.vegType}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">👥 Min Guests</div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.minGuestCount} Plates
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
                    <div className="text-stone-500 text-xs mb-1">🍲 Cuisines</div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.cuisines?.join(', ')}
                    </div>
                  </div>
                </>
              )}

              {/* DECORATION SPEC TILES */}
              {listing.category === 'decoration' && (
                <>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🌸 Mandap Styling</div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.mandapCustomization ? 'Custom Vedic Mandap' : 'Standard'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">💡 Ambient Lighting</div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.includesLighting ? 'Full LED & Truss Included' : 'Basic'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
                    <div className="text-stone-500 text-xs mb-1">🎨 Styles Offered</div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.decorStyles?.join(' • ')}
                    </div>
                  </div>
                </>
              )}

              {/* DJ & MUSIC */}
              {listing.category === 'music_dj' && (
                <>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🔊 Sound Wattage</div>
                    <div className="font-bold text-sm text-purple-900">
                      {listing.categoryAttributes.soundWattage}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🥁 Dhol Tasha Entry</div>
                    <div className="font-bold text-sm text-stone-900">
                      {listing.categoryAttributes.includesDholTasha ? 'Live Troop Available' : 'No'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
                    <div className="text-stone-500 text-xs mb-1">🎵 Genres</div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.genres?.join(', ')}
                    </div>
                  </div>
                </>
              )}

              {/* PANDIT & PRIEST */}
              {listing.category === 'pandit_priest' && (
                <>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🕉️ Experience</div>
                    <div className="font-bold text-sm text-orange-900">
                      {listing.categoryAttributes.yearsExperience} Years in Pune
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-stone-500 text-xs mb-1">🗣️ Languages</div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.languages?.join(', ')}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
                    <div className="text-stone-500 text-xs mb-1">📜 Ceremonies</div>
                    <div className="font-bold text-xs text-stone-900">
                      {listing.categoryAttributes.ceremoniesSupported?.join(', ')}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">About this Venue / Service</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              {listing.description}
            </p>
          </div>

          {/* 4.1 Custom Highlights / Vendor Custom Attributes */}
          {listing.customAttributes && listing.customAttributes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-800" />
                Special Features & Vendor Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {listing.customAttributes.map((attr, idx) => (
                  <div key={idx} className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-200/80 space-y-1">
                    <div className="text-[10px] font-bold text-teal-900 uppercase tracking-wider">
                      {attr.label}
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-stone-900">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ALL-IN-ONE MULTI-SERVICE COMBO PACKAGES (Combined Services) */}
          {availableCombos.length > 0 && (
            <div className="space-y-3.5 p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-teal-50/70 to-emerald-50/50 border-2 border-amber-300 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    Exclusive Bundled Deals
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                    All-in-One Multi-Service Combo Packages
                  </h3>
                  <p className="text-xs text-stone-600">
                    Book complete venue, decor, and catering from <span className="font-semibold text-stone-900">{listing.vendorName}</span> for guaranteed savings and zero vendor coordination hassle.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedListingId(null);
                    setActiveRoute('packages');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse All /packages &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {availableCombos.map(combo => (
                  <div 
                    key={combo.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-xs space-y-3 hover:border-amber-400 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-stone-900">{combo.title}</h4>
                          {combo.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              {combo.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600">{combo.description}</p>
                      </div>

                      {/* Pricing block */}
                      <div className="sm:text-right shrink-0 bg-amber-50/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block">Bundle Price</span>
                        <div className="flex items-baseline gap-1.5 sm:justify-end">
                          <span className="font-serif font-extrabold text-xl sm:text-2xl text-teal-950">
                            {formatIndianCurrency(combo.comboPrice)}
                          </span>
                          <span className="text-xs text-stone-500 line-through">
                            {formatIndianCurrency(combo.totalOriginalPrice)}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 block">
                          Save {formatIndianCurrency(combo.savingsAmount)} ({combo.savingsPercentage}% OFF)
                        </span>
                      </div>
                    </div>

                    {/* Included Services Tags */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block">
                        Included in this All-in-One Package:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {combo.includedServices && combo.includedServices.length > 0 ? (
                          combo.includedServices.map((srv, idx) => (
                            <div 
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-center gap-1.5"
                            >
                              <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                              <span className="font-bold text-teal-950 uppercase text-[10px]">{srv.category?.replace('_', ' ')}:</span>
                              <span className="truncate max-w-[200px]">{srv.listingTitle}</span>
                            </div>
                          ))
                        ) : null}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>Suitable for {combo.minGuestCapacity || 0}–{combo.maxGuestCapacity || 0} Guests &bull; {combo.eventTypes?.slice(0, 2).join(', ') || 'All Celebrations'}</span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedComboForView(combo)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Inclusions
                        </button>
                        <button
                          onClick={() => openEnquiryForPackage(listing.id, undefined, combo)}
                          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>Request Combo Quote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5.1 Pricing Packages (Intra-Listing Tiers - Approved Only) */}
          {(() => {
            const activePricingPackages = (listing.pricingPackages || []).filter(
              pkg => pkg.status === 'active' || (!pkg.status && listing.status === 'active')
            );
            if (activePricingPackages.length === 0) return null;

            return (
              <div id="package-tiers" className="space-y-3 scroll-mt-20">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Package Tiers Comparison
                    </h3>
                    <p className="text-xs text-stone-500">
                      Compare inclusions across tiers. Each tier inherits the listing unit ({(listing.pricingUnit || 'event').replace('per_', '')}).
                    </p>
                  </div>
                  <span className="text-xs text-amber-900 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {activePricingPackages.length} Tiers Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activePricingPackages.map((pkg, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                        pkg.isPopular 
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs' 
                          : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            {pkg.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 inline-block mb-1">
                                {pkg.badge}
                              </span>
                            )}
                            <h4 className="font-bold text-sm text-stone-900">{pkg.name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="font-serif font-extrabold text-base sm:text-lg text-teal-950 block">
                              {formatIndianCurrency(pkg.price)}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              /{(pkg.pricingUnit || listing.pricingUnit || 'event').replace('per_', '')}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600">{pkg.description}</p>

                        <ul className="space-y-1.5 pt-2 border-t border-stone-200/80">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="text-xs text-stone-700 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => openEnquiryForPackage(listing.id, { id: pkg.id || pkg.name, name: pkg.name, price: pkg.price })}
                        className="w-full mt-2 py-2.5 px-3.5 rounded-xl bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
                      >
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Choose this tier</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 6. AVAILABILITY CALENDAR WITH STALENESS RADAR */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-teal-800" />
                  Availability Calendar
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time calendar maintained directly by the vendor management
                </p>
              </div>

              {/* Staleness Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border self-start sm:self-auto ${
                isStale 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{daysAgoText}</span>
              </div>
            </div>

            {/* If Stale (> 30 days old): Warning banner per approved design */}
            {isStale && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Availability updated more than 30 days ago.</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Dates may have changed since the last update. Please submit an enquiry to confirm exact current availability with the vendor.
                  </p>
                </div>
              </div>
            )}

            {/* Month Navigation & Legend Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMonthOffset(prev => prev - 1)}
                    className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-serif font-bold text-sm sm:text-base text-stone-900 px-2 min-w-[130px] text-center">
                    {monthName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedMonthOffset(prev => prev + 1)}
                    className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {selectedMonthOffset !== 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedMonthOffset(0)}
                    className="text-xs font-bold text-teal-800 hover:text-teal-950 underline cursor-pointer"
                  >
                    Current Month
                  </button>
                )}
              </div>

              {/* Calendar Legend Pills */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Available</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Tentative</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-950 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>Booked</span>
                </span>
              </div>
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1 sm:p-2 opacity-0 pointer-events-none" />
              ))}

              {calendarDays.map(({ dayNum, status, dateStr }) => {
                let statusClasses = 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200/90';
                let textColor = 'text-emerald-800';
                let label = 'Available';

                if (status === 'tentative') {
                  statusClasses = 'bg-amber-100 text-amber-950 hover:bg-amber-200';
                  textColor = 'text-amber-800';
                  label = 'Tentative';
                } else if (status === 'booked') {
                  statusClasses = 'bg-rose-100 text-rose-950 hover:bg-rose-200';
                  textColor = 'text-rose-800';
                  label = 'Booked';
                }

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${status.toUpperCase()}`}
                    className={`p-1 sm:p-2 rounded-xl sm:rounded-2xl font-medium text-xs flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[46px] sm:min-h-[52px] transition-all select-none overflow-hidden ${statusClasses}`}
                  >
                    <span className="font-sans font-bold text-xs sm:text-sm text-stone-800 leading-none">{dayNum}</span>
                    
                    {/* Status Text (compact, clean sans font style suited for small text) */}
                    <span className={`font-sans font-semibold text-[6.5px] sm:text-[8px] tracking-normal leading-tight whitespace-nowrap truncate w-full text-center block ${textColor}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. LOCATION & GOOGLE MAPS NAVIGATION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-600" />
                  Location & Driving Directions
                </h3>
                <p className="text-xs text-stone-500">
                  {listing.googleMapsUrl && listing.googleMapsUrl.trim().length > 0 
                    ? 'Navigate directly to the venue or vendor studio using Google Maps' 
                    : 'Physical address provided by the vendor'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-200/80 text-stone-800 self-start sm:self-auto">
                📍 {listing.locality}, {listing.city ? listing.city.toUpperCase() : 'PUNE'}
              </span>
            </div>

            {/* Visual Location Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">{listing.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {listing.address}
                  </p>
                  {listing.coordinates && (
                    <p className="text-[10px] text-stone-400 font-mono">
                      GPS: {listing.coordinates.lat.toFixed(4)}° N, {listing.coordinates.lng.toFixed(4)}° E
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons - Rendered only if Google Maps URL is provided */}
              {listing.googleMapsUrl && listing.googleMapsUrl.trim().length > 0 ? (
                <>
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2.5">
                    <a
                      href={getGoogleMapsDirectionsUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-950 text-amber-50 text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-amber-300" />
                      <span>Get Driving Directions</span>
                    </a>

                    <a
                      href={getGoogleMapsSearchUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                    </a>
                  </div>

                  <p className="text-[11px] text-stone-500 italic pt-1">
                    Tip: Tapping &quot;Get Driving Directions&quot; opens turn-by-turn navigation directly in your Google Maps app.
                  </p>
                </>
              ) : (
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Google Maps link has not been linked for this listing. Contact vendor for exact landmarks.</span>
                </div>
              )}

              {/* Business Website Card in Location & Credentials Section */}
              {listing.websiteUrl && (
                <div className="pt-3 border-t border-stone-100">
                  <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-teal-900 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-stone-900">Official Business Website</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-teal-950 font-medium truncate">
                          {listing.websiteUrl}
                        </p>
                      </div>
                    </div>

                    <a
                      href={listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3.5 py-2 bg-teal-900 hover:bg-teal-950 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs shrink-0 cursor-pointer"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 7. Customer Reviews & Ratings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  Verified Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Reviews are gated to verified customers whose event date has passed
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500 italic p-4 bg-stone-50 rounded-xl border border-stone-200">
                No reviews yet. Be the first to leave a review after your event celebration!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-900 text-amber-300 font-bold text-xs flex items-center justify-center">
                          {rev.customerName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-stone-900">{rev.customerName}</div>
                          <div className="text-[10px] text-stone-500">Celebrated {rev.eventType} &bull; {rev.eventDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-stone-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-stone-900">{rev.title}</h5>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">{rev.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20 shadow-lg">
          <div className="hidden sm:block">
            <span className="text-[10px] text-stone-600 uppercase font-semibold">Starting From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl text-stone-900 font-serif">
                {formatIndianCurrency(listing.startingPrice)}
              </span>
              <span className="text-xs text-stone-500">/{(listing.pricingUnit || 'event').replace('per_', '')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleNativeShare}
              className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4 text-stone-700" />
            </button>

            <button
              onClick={handleOpenEnquiry}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors"
            >
              General Enquiry
            </button>

            <button
              onClick={handleOpenEnquiry}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary-hover text-primary-foreground shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-accent" />
              <span>Request to Book / Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Combo Package Detail Modal */}
      <ComboPackageDetailModal
        combo={selectedComboForView}
        isOpen={!!selectedComboForView}
        onClose={() => setSelectedComboForView(null)}
      />

      {/* Share Listing Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-5 relative animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Share2 className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Share Celebration Listing</h3>
                  <p className="text-[11px] text-stone-500">Send to family, partner, or event planning groups</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Listing Preview Snippet */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3 items-center">
              <img
                src={listing.coverImage}
                alt={listing.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 space-y-0.5">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-100 text-teal-900">
                  {categoryMeta?.name || listing.category}
                </span>
                <h4 className="font-bold text-xs text-stone-900 truncate">{listing.title}</h4>
                <p className="text-[11px] text-stone-500 truncate">{listing.locality}, Pune &bull; {formatIndianCurrency(listing.startingPrice)}/{(listing.pricingUnit || 'event').replace('per_', '')}</p>
              </div>
            </div>

            {/* Direct Copy Link Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Direct Listing Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="w-full bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-800 select-all outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-900 hover:bg-teal-950 text-white'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick 1-Tap Sharing Channels */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Share via 1-Tap
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + getShareUrl())}`}
                  className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-stone-600" />
                  <span>Email</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>X (Twitter)</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
