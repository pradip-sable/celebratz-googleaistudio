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
import { CATEGORIES, formatEventType } from '../data/categories';
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

  const listing = selectedListingId ? getListingById(selectedListingId) : undefined;

  // Derive active package tiers (2+ required to be tiered, else flat pricing)
  const activeTiers = React.useMemo(() => {
    if (!listing) return [];
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

  if (!selectedListingId || !listing) return null;

  const isSaved = isInWishlist(listing.id);
  const isCompared = comparisonList.includes(listing.id);
  const categoryMeta = CATEGORIES.find(c => c.id === listing.category);
  const { text: daysAgoText, isStale } = getDaysAgoText(listing.calendarLastUpdatedAt);
  const reviews = getListingReviews(listing.id);
  const availableCombos = getComboPackagesForListing(listing.id);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-border overflow-hidden relative">
        {/* Sticky Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-subtle text-primary border border-border-subtle">
              {categoryMeta?.name || listing.category}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">&bull; {listing.locality}, Pune</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNativeShare}
              className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-foreground hover:text-primary border border-border transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline text-xs font-semibold">Share</span>
            </button>

            <button
              onClick={() => toggleComparison(listing.id)}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isCompared ? 'bg-gold-light text-gold-dark border-gold' : 'bg-muted/40 hover:bg-muted text-foreground border-border'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare Tray' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(listing.id)}
              className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-foreground hover:text-destructive border border-border transition-colors"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-destructive text-destructive' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedListingId(null)}
              className="p-2 rounded-xl bg-muted hover:bg-muted text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8">
          {/* 1. Photo Gallery Carousel / Mosaic */}
          <div className="space-y-3">
            <div className="h-64 sm:h-96 rounded-2xl overflow-hidden relative shadow-inner bg-primary-dark">
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
                      activeImageIndex === idx ? 'border-primary scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Listing Title, Locality & Pricing Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                {listing.googleMapsUrl && listing.googleMapsUrl.trim().length > 0 ? (
                  <>
                    <a
                      href={getGoogleMapsDirectionsUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-medium bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-lg transition-colors group cursor-pointer"
                      title="Open location in Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-destructive shrink-0" />
                      <span className="underline-offset-2 group-hover:underline">{listing.address}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                    </a>

                    <a
                      href={getGoogleMapsDirectionsUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-subtle text-primary border border-border-subtle hover:bg-primary-light transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 text-primary" />
                      <span>Navigate</span>
                    </a>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-destructive shrink-0" />
                    <span>{listing.address}</span>
                  </div>
                )}
                {listing.websiteUrl && (
                  <a
                    href={listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-semibold bg-primary-subtle/90 hover:bg-primary-light border border-border-subtle px-2.5 py-1 rounded-lg transition-colors group cursor-pointer"
                    title="Visit Official Website"
                  >
                    <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="underline-offset-2 group-hover:underline">
                      {listing.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </span>
                    <ExternalLink className="w-3 h-3 text-primary group-hover:text-primary-dark shrink-0" />
                  </a>
                )}
              </div>

              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-foreground leading-snug">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Managed by <span className="text-foreground font-bold">{listing.vendorName}</span> &bull; Verified Pune Vendor
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-primary bg-primary-subtle px-2 py-0.5 rounded-md border border-border-subtle font-medium">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>Response time: Usually within 2 hours</span>
                </span>
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-dark bg-accent-subtle hover:bg-gold-light border border-gold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  title="Share this listing"
                >
                  <Share2 className="w-3 h-3 text-accent" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Price Box: Tiered comparison summary if tiers exist, else flat price block */}
            {hasTiers ? (
              <div className="bg-gradient-to-br from-accent-subtle to-muted/40 p-4 rounded-2xl border border-accent shrink-0 w-full sm:w-auto text-left sm:text-right shadow-2xs">
                <div className="flex items-center gap-1.5 sm:justify-end mb-0.5">
                  <span className="text-[10px] uppercase font-bold text-accent-dark px-2.5 py-0.5 rounded-full bg-accent-subtle tracking-wider">
                    Tiered Pricing ({activeTiers.length} Options)
                  </span>
                </div>
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className="text-xs text-muted-foreground font-medium mr-1">from</span>
                  <span className="font-extrabold text-2xl sm:text-3xl text-primary font-serif">
                    {formatIndianCurrency(effectivePrice)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    /{(listing.pricingUnit || 'event').replace('per_', '')}
                  </span>
                </div>
                <a 
                  href="#package-tiers"
                  className="text-[11px] font-bold text-accent-dark hover:text-accent underline mt-1 block"
                >
                  Compare All {activeTiers.length} Tiers Below &darr;
                </a>
              </div>
            ) : (
              <div className="bg-muted/40 p-4 rounded-2xl border border-border/80 shrink-0 w-full sm:w-auto text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                  Starting Pricing
                </span>
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className="font-extrabold text-2xl sm:text-3xl text-primary font-serif">
                    {formatIndianCurrency(listing.price_from ?? listing.startingPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    /{(listing.pricingUnit || 'event').replace('per_', '')}
                  </span>
                </div>
                {listing.pricingNote && (
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">{listing.pricingNote}</p>
                )}
              </div>
            )}
          </div>

          {/* 2.5. Events Catered & Celebrations Offered */}
          {listing.eventTypes && listing.eventTypes.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary-subtle/70 via-muted/40 to-accent-subtle/60 border border-border-subtle space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h3 className="font-serif font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent shrink-0" />
                  <span>Celebrations & Event Types Offered</span>
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full w-fit">
                  {listing.eventTypes.length} Event Formats Supported
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-border text-foreground text-xs font-semibold shadow-2xs hover:border-primary transition-colors"
                    >
                      <span className="text-sm">{getIcon(type)}</span>
                      <span>{formatEventType(type)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Category-Specific Specs Matrix */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Venue & Service Highlights
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* VENUES SPEC TILES */}
              {listing.category === 'venues' && (
                <>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Capacity</span>
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.capacityMin} - {listing.categoryAttributes.capacityMax} Pax
                    </div>
                  </div>

                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                      <Car className="w-4 h-4 text-secondary" />
                      <span>Parking</span>
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.parkingCapacity} Vehicles
                    </div>
                  </div>

                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                      <Utensils className="w-4 h-4 text-success" />
                      <span>Catering Policy</span>
                    </div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.cateringPolicy}
                    </div>
                  </div>

                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>AC & Rooms</span>
                    </div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.hasAC ? 'AC Hall' : 'Air Cooled'} + {listing.categoryAttributes.roomCount} Rooms
                    </div>
                  </div>
                </>
              )}

              {/* PHOTOGRAPHY SPEC TILES */}
              {listing.category === 'photography' && (
                <>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">⚡ Deliverables Timeline</div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.deliveryTimelineDays} Days Retouched
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🎥 Drone Coverage</div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.droneAvailable ? 'Included / 4K' : 'On Request'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border col-span-2">
                    <div className="text-muted-foreground text-xs mb-1">📷 Gear Specs</div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.equipmentDetails}
                    </div>
                  </div>
                </>
              )}

              {/* CATERING SPEC TILES */}
              {listing.category === 'catering' && (
                <>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🥗 Veg / Non-Veg</div>
                    <div className="font-bold text-sm text-success">
                      {listing.categoryAttributes.vegType}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">👥 Min Guests</div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.minGuestCount} Plates
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border col-span-2">
                    <div className="text-muted-foreground text-xs mb-1">🍲 Cuisines</div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.cuisines?.join(', ')}
                    </div>
                  </div>
                </>
              )}

              {/* DECORATION SPEC TILES */}
              {listing.category === 'decoration' && (
                <>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🌸 Mandap Styling</div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.mandapCustomization ? 'Custom Vedic Mandap' : 'Standard'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">💡 Ambient Lighting</div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.includesLighting ? 'Full LED & Truss Included' : 'Basic'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border col-span-2">
                    <div className="text-muted-foreground text-xs mb-1">🎨 Styles Offered</div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.decorStyles?.join(' • ')}
                    </div>
                  </div>
                </>
              )}

              {/* DJ & MUSIC */}
              {listing.category === 'music_dj' && (
                <>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🔊 Sound Wattage</div>
                    <div className="font-bold text-sm text-purple-900">
                      {listing.categoryAttributes.soundWattage}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🥁 Dhol Tasha Entry</div>
                    <div className="font-bold text-sm text-foreground">
                      {listing.categoryAttributes.includesDholTasha ? 'Live Troop Available' : 'No'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border col-span-2">
                    <div className="text-muted-foreground text-xs mb-1">🎵 Genres</div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.genres?.join(', ')}
                    </div>
                  </div>
                </>
              )}

              {/* PANDIT & PRIEST */}
              {listing.category === 'pandit_priest' && (
                <>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🕉️ Experience</div>
                    <div className="font-bold text-sm text-orange-900">
                      {listing.categoryAttributes.yearsExperience} Years in Pune
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                    <div className="text-muted-foreground text-xs mb-1">🗣️ Languages</div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.languages?.join(', ')}
                    </div>
                  </div>
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border col-span-2">
                    <div className="text-muted-foreground text-xs mb-1">📜 Ceremonies</div>
                    <div className="font-bold text-xs text-foreground">
                      {listing.categoryAttributes.ceremoniesSupported?.join(', ')}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-foreground">About this Venue / Service</h3>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed font-light">
              {listing.description}
            </p>
          </div>

          {/* 4.1 Custom Highlights / Vendor Custom Attributes */}
          {listing.customAttributes && listing.customAttributes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Special Features & Vendor Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {listing.customAttributes.map((attr, idx) => (
                  <div key={idx} className="p-3.5 bg-primary-subtle/50 rounded-xl border border-border-subtle space-y-1">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {attr.label}
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-foreground">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ALL-IN-ONE MULTI-SERVICE COMBO PACKAGES (Combined Services) */}
          {availableCombos.length > 0 && (
            <div className="space-y-3.5 p-5 rounded-3xl bg-gradient-to-br from-accent-subtle via-primary-subtle to-secondary-subtle border-2 border-accent shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark bg-accent-subtle px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" />
                    Exclusive Bundled Deals
                  </span>
                  <h3 className="font-serif font-bold text-lg text-foreground mt-1">
                    All-in-One Multi-Service Combo Packages
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Book complete venue, decor, and catering from <span className="font-semibold text-foreground">{listing.vendorName}</span> for guaranteed savings and zero vendor coordination hassle.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedListingId(null);
                    setActiveRoute('packages');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse All /packages &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {availableCombos.map(combo => (
                  <div 
                    key={combo.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-accent/30 shadow-xs space-y-3 hover:border-accent transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-foreground">{combo.title}</h4>
                          {combo.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-light text-gold-dark border border-gold">
                              {combo.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{combo.description}</p>
                      </div>

                      {/* Pricing block */}
                      <div className="sm:text-right shrink-0 bg-accent-subtle/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">Bundle Price</span>
                        <div className="flex items-baseline gap-1.5 sm:justify-end">
                          <span className="font-serif font-extrabold text-xl sm:text-2xl text-primary">
                            {formatIndianCurrency(combo.comboPrice)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatIndianCurrency(combo.totalOriginalPrice)}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-success block">
                          Save {formatIndianCurrency(combo.savingsAmount)} ({combo.savingsPercentage}% OFF)
                        </span>
                      </div>
                    </div>

                    {/* Included Services Tags */}
                    <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                        Included in this All-in-One Package:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {combo.includedServices && combo.includedServices.length > 0 ? (
                          combo.includedServices.map((srv, idx) => (
                            <div 
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground flex items-center gap-1.5"
                            >
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              <span className="font-bold text-primary uppercase text-[10px]">{srv.category?.replace('_', ' ')}:</span>
                              <span className="truncate max-w-[200px]">{srv.listingTitle}</span>
                            </div>
                          ))
                        ) : null}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border-subtle">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Suitable for {combo.minGuestCapacity || 0}–{combo.maxGuestCapacity || 0} Guests &bull; {combo.eventTypes?.slice(0, 2).map(formatEventType).join(', ') || 'All Celebrations'}</span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedComboForView(combo)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-muted hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Inclusions
                        </button>
                        <button
                          onClick={() => openEnquiryForPackage(listing.id, undefined, combo)}
                          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-accent" />
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
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      Package Tiers Comparison
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Compare inclusions across tiers. Each tier inherits the listing unit ({(listing.pricingUnit || 'event').replace('per_', '')}).
                    </p>
                  </div>
                  <span className="text-xs text-gold-dark font-bold bg-gold-light px-2.5 py-0.5 rounded-full border border-gold">
                    {activePricingPackages.length} Tiers Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activePricingPackages.map((pkg, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                        pkg.isPopular 
                          ? 'bg-accent-subtle/50 border-accent shadow-xs' 
                          : 'bg-muted/70 border-border hover:border-border'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            {pkg.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-subtle text-accent-dark inline-block mb-1">
                                {pkg.badge}
                              </span>
                            )}
                            <h4 className="font-bold text-sm text-foreground">{pkg.name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="font-serif font-extrabold text-base sm:text-lg text-primary block">
                              {formatIndianCurrency(pkg.price)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              /{(pkg.pricingUnit || listing.pricingUnit || 'event').replace('per_', '')}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">{pkg.description}</p>

                        <ul className="space-y-1.5 pt-2 border-t border-border/80">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => openEnquiryForPackage(listing.id, { id: pkg.id || pkg.name, name: pkg.name, price: pkg.price })}
                        className="w-full mt-2 py-2.5 px-3.5 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
                      >
                        <Check className="w-3.5 h-3.5 text-accent" />
                        <span>Choose this tier</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 6. AVAILABILITY CALENDAR WITH STALENESS RADAR */}
          <div className="bg-white rounded-3xl border border-border p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Availability Calendar
                </h3>
                <p className="text-xs text-muted-foreground">
                  Real-time calendar maintained directly by the vendor management
                </p>
              </div>

              {/* Staleness Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border self-start sm:self-auto ${
                isStale 
                  ? 'bg-gold-light text-gold-dark border-gold' 
                  : 'bg-success-subtle text-success border-success/30'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{daysAgoText}</span>
              </div>
            </div>

            {/* If Stale (> 30 days old): Warning banner per approved design */}
            {isStale && (
              <div className="p-3 bg-gold-light/40 border border-gold rounded-xl flex items-start gap-2.5 text-xs text-gold-dark">
                <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Availability updated more than 30 days ago.</span>
                  <p className="text-[11px] text-gold-dark mt-0.5">
                    Dates may have changed since the last update. Please submit an enquiry to confirm exact current availability with the vendor.
                  </p>
                </div>
              </div>
            )}

            {/* Month Navigation & Legend Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMonthOffset(prev => prev - 1)}
                    className="p-2 rounded-xl border border-border bg-white hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-serif font-bold text-sm sm:text-base text-foreground px-2 min-w-[130px] text-center">
                    {monthName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedMonthOffset(prev => prev + 1)}
                    className="p-2 rounded-xl border border-border bg-white hover:bg-muted text-foreground transition-colors shadow-2xs cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {selectedMonthOffset !== 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedMonthOffset(0)}
                    className="text-xs font-bold text-primary hover:text-primary-dark underline cursor-pointer"
                  >
                    Current Month
                  </button>
                )}
              </div>

              {/* Calendar Legend Pills */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-subtle text-success font-bold">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span>Available</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-subtle text-accent-dark font-bold">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>Tentative</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive-subtle text-destructive font-bold">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span>Booked</span>
                </span>
              </div>
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1 sm:p-2 opacity-0 pointer-events-none" />
              ))}

              {calendarDays.map(({ dayNum, status, dateStr }) => {
                let statusClasses = 'bg-success-subtle text-success hover:bg-success-subtle/90';
                let textColor = 'text-success';
                let label = 'Available';

                if (status === 'tentative') {
                  statusClasses = 'bg-accent-subtle text-accent-dark hover:bg-accent-subtle';
                  textColor = 'text-accent-dark';
                  label = 'Tentative';
                } else if (status === 'booked') {
                  statusClasses = 'bg-destructive-subtle text-destructive hover:bg-destructive-subtle';
                  textColor = 'text-destructive';
                  label = 'Booked';
                }

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${status.toUpperCase()}`}
                    className={`p-1 sm:p-2 rounded-xl sm:rounded-2xl font-medium text-xs flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[46px] sm:min-h-[52px] transition-all select-none overflow-hidden ${statusClasses}`}
                  >
                    <span className="font-sans font-bold text-xs sm:text-sm text-foreground leading-none">{dayNum}</span>
                    
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
          <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                  <Compass className="w-5 h-5 text-destructive" />
                  Location & Driving Directions
                </h3>
                <p className="text-xs text-muted-foreground">
                  {listing.googleMapsUrl && listing.googleMapsUrl.trim().length > 0 
                    ? 'Navigate directly to the venue or vendor studio using Google Maps' 
                    : 'Physical address provided by the vendor'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-muted/80 text-foreground self-start sm:self-auto">
                📍 {listing.locality}, {listing.city ? listing.city.toUpperCase() : 'PUNE'}
              </span>
            </div>

            {/* Visual Location Card */}
            <div className="bg-white rounded-xl border border-border p-4 space-y-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-destructive-subtle text-destructive shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground">{listing.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                    {listing.address}
                  </p>
                  {listing.coordinates && (
                    <p className="text-[10px] text-muted-foreground font-mono">
                      GPS: {listing.coordinates.lat.toFixed(4)}° N, {listing.coordinates.lng.toFixed(4)}° E
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons - Rendered only if Google Maps URL is provided */}
              {listing.googleMapsUrl && listing.googleMapsUrl.trim().length > 0 ? (
                <>
                  <div className="pt-2 border-t border-border-subtle flex flex-wrap gap-2.5">
                    <a
                      href={getGoogleMapsDirectionsUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-gold-light" />
                      <span>Get Driving Directions</span>
                    </a>

                    <a
                      href={getGoogleMapsSearchUrl(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  </div>

                  <p className="text-[11px] text-muted-foreground italic pt-1">
                    Tip: Tapping &quot;Get Driving Directions&quot; opens turn-by-turn navigation directly in your Google Maps app.
                  </p>
                </>
              ) : (
                <div className="pt-2 border-t border-border-subtle text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>Google Maps link has not been linked for this listing. Contact vendor for exact landmarks.</span>
                </div>
              )}

              {/* Business Website Card in Location & Credentials Section */}
              {listing.websiteUrl && (
                <div className="pt-3 border-t border-border-subtle">
                  <div className="p-3.5 bg-primary-subtle/70 rounded-xl border border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary text-gold-light flex items-center justify-center shrink-0 shadow-2xs">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-foreground">Official Business Website</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-success-subtle text-success border border-success/30">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-primary font-medium truncate">
                          {listing.websiteUrl}
                        </p>
                      </div>
                    </div>

                    <a
                      href={listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3.5 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs shrink-0 cursor-pointer"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold-light" />
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
                <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  Verified Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Reviews are gated to verified customers whose event date has passed
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 bg-muted/40 rounded-xl border border-border">
                No reviews yet. Be the first to leave a review after your event celebration!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary text-gold-light font-bold text-xs flex items-center justify-center">
                          {rev.customerName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-foreground">{rev.customerName}</div>
                          <div className="text-[10px] text-muted-foreground">Celebrated {rev.eventType} &bull; {rev.eventDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-accent">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-accent' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-foreground">{rev.title}</h5>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">{rev.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20 shadow-lg">
          <div className="hidden sm:block">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Starting From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl text-foreground font-serif">
                {formatIndianCurrency(listing.startingPrice)}
              </span>
              <span className="text-xs text-muted-foreground">/{(listing.pricingUnit || 'event').replace('per_', '')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleNativeShare}
              className="p-3 rounded-xl bg-muted hover:bg-muted text-foreground border border-border transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4 text-foreground" />
            </button>

            <button
              onClick={handleOpenEnquiry}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-semibold bg-muted hover:bg-muted text-foreground border border-border transition-colors"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-border space-y-5 relative animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gold-light text-gold-dark">
                  <Share2 className="w-4 h-4 text-accent-dark" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">Share Celebration Listing</h3>
                  <p className="text-[11px] text-muted-foreground">Send to family, partner, or event planning groups</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl bg-muted hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Listing Preview Snippet */}
            <div className="p-3 bg-muted/40 rounded-2xl border border-border flex gap-3 items-center">
              <img
                src={listing.coverImage}
                alt={listing.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 space-y-0.5">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-primary-subtle text-primary">
                  {categoryMeta?.name || listing.category}
                </span>
                <h4 className="font-bold text-xs text-foreground truncate">{listing.title}</h4>
                <p className="text-[11px] text-muted-foreground truncate">{listing.locality}, Pune &bull; {formatIndianCurrency(listing.startingPrice)}/{(listing.pricingUnit || 'event').replace('per_', '')}</p>
              </div>
            </div>

            {/* Direct Copy Link Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Direct Listing Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground select-all outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                    copiedLink
                      ? 'bg-success text-white'
                      : 'bg-primary hover:bg-primary-dark text-primary-foreground'
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
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Share via 1-Tap
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-success-subtle hover:bg-success-subtle border border-success/30 text-success text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-success" />
                  <span>WhatsApp</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + getShareUrl())}`}
                  className="p-2.5 rounded-xl bg-muted hover:bg-muted border border-border text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>Email</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-primary-dark hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-accent" />
                  <span>X (Twitter)</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-info-subtle hover:bg-info/20 border border-info/30 text-info text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-info" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2.5 bg-muted hover:bg-muted text-foreground rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
