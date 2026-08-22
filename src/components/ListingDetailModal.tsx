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
  Tag
} from 'lucide-react';
import { Listing, CalendarStatus } from '../types';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency, getDaysAgoText, getThemeClasses } from '../utils/theme';
import { CATEGORIES } from '../data/categories';
import { getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl, openGoogleMaps } from '../utils/mapUtils';

export const ListingDetailModal: React.FC = () => {
  const { 
    selectedListingId, 
    setSelectedListingId, 
    getListingById, 
    toggleWishlist, 
    isInWishlist, 
    toggleComparison, 
    comparisonList, 
    setIsEnquiryModalOpen,
    getListingReviews,
    designPrefs 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  if (!selectedListingId) return null;
  const listing = getListingById(selectedListingId);
  if (!listing) return null;

  const theme = getThemeClasses(designPrefs.palette);
  const isSaved = isInWishlist(listing.id);
  const isCompared = comparisonList.includes(listing.id);
  const categoryMeta = CATEGORIES.find(c => c.id === listing.category);
  const { text: daysAgoText, isStale } = getDaysAgoText(listing.calendarLastUpdatedAt);
  const reviews = getListingReviews(listing.id);

  // Generate calendar days for current view
  const currentMonthDate = new Date();
  currentMonthDate.setMonth(currentMonthDate.getMonth() + selectedMonthOffset);
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
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-teal-700" />
                  <span>Navigate</span>
                </a>
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
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 shrink-0 w-full sm:w-auto text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-stone-600 block tracking-wider">
                Starting Pricing
              </span>
              <div className="flex items-baseline gap-1 sm:justify-end">
                <span className="font-extrabold text-2xl sm:text-3xl text-teal-950 font-serif">
                  {formatIndianCurrency(listing.startingPrice)}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  /{(listing.pricingUnit || 'event').replace('per_', '')}
                </span>
              </div>
              {listing.pricingNote && (
                <p className="text-[11px] text-stone-500 mt-1 max-w-xs">{listing.pricingNote}</p>
              )}
            </div>
          </div>

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

          {/* 5. Pricing Packages (if defined) */}
          {listing.pricingPackages && listing.pricingPackages.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">Popular Packages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.pricingPackages.map((pkg, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-stone-900">{pkg.name}</h4>
                      <span className="font-serif font-extrabold text-sm text-teal-950">
                        {formatIndianCurrency(pkg.price)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">{pkg.description}</p>
                    <ul className="space-y-1 pt-2 border-t border-amber-200/60">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="text-[11px] text-stone-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. LOCATION & GOOGLE MAPS NAVIGATION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-600" />
                  Location & Driving Directions
                </h3>
                <p className="text-xs text-stone-500">
                  Navigate directly to the venue or vendor studio using Google Maps
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

              {/* Action Buttons */}
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
            </div>
          </div>

          {/* 7. AVAILABILITY CALENDAR WITH STALENESS RADAR */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
              <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${
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

            {/* Interactive Month Picker */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedMonthOffset(prev => prev - 1)}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-200 text-stone-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-xs sm:text-sm text-stone-900 uppercase tracking-wider">
                {monthName}
              </span>
              <button
                onClick={() => setSelectedMonthOffset(prev => prev + 1)}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-200 text-stone-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-stone-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Tentative / Enquiry
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Booked
              </span>
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[10px] font-bold text-stone-600 uppercase py-1">
                  {d}
                </div>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}

              {calendarDays.map(({ dayNum, status, dateStr }) => {
                let statusClasses = 'bg-emerald-50/90 text-emerald-950 border-emerald-300 hover:bg-emerald-100 shadow-2xs';
                let dotColor = 'bg-emerald-600';

                if (status === 'tentative') {
                  statusClasses = 'bg-amber-100/90 text-amber-950 border-amber-400 hover:bg-amber-200 ring-1 ring-amber-400/50 shadow-xs';
                  dotColor = 'bg-amber-500 ring-2 ring-amber-300';
                } else if (status === 'booked') {
                  statusClasses = 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200 ring-1 ring-rose-400/50 shadow-xs';
                  dotColor = 'bg-rose-600 ring-2 ring-rose-300';
                }

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${status.toUpperCase()}`}
                    className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-h-[48px] sm:min-h-[54px] transition-all select-none ${statusClasses}`}
                  >
                    <span className="font-serif font-extrabold text-xs sm:text-base leading-none">{dayNum}</span>
                    
                    {/* Solid Status Dot Indicator */}
                    <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${dotColor} shrink-0 transition-transform`} />
                  </div>
                );
              })}
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
              onClick={handleOpenEnquiry}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors"
            >
              General Enquiry
            </button>

            <button
              onClick={handleOpenEnquiry}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-teal-900 hover:bg-teal-950 text-amber-50 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CalendarIcon className="w-4 h-4 text-amber-300" />
              <span>Request to Book / Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
