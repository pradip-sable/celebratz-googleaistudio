import React from 'react';
import { 
  Heart, 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Scale, 
  Sparkles, 
  Check, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency, getDaysAgoText, getThemeClasses } from '../utils/theme';
import { CATEGORIES } from '../data/categories';
import { getGoogleMapsDirectionsUrl } from '../utils/mapUtils';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  if (!listing) return null;

  const { 
    setSelectedListingId, 
    toggleWishlist, 
    isInWishlist, 
    comparisonList, 
    toggleComparison, 
    designPrefs,
    setIsEnquiryModalOpen 
  } = useApp();

  const theme = getThemeClasses(designPrefs.palette);
  const isSaved = isInWishlist(listing.id);
  const isCompared = comparisonList.includes(listing.id);
  const categoryMeta = CATEGORIES.find(c => c.id === listing.category);
  const { text: daysAgoText, isStale } = getDaysAgoText(listing.calendarLastUpdatedAt);

  const handleCardClick = () => {
    setSelectedListingId(listing.id);
  };

  const handleDirectEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedListingId(listing.id);
    setIsEnquiryModalOpen(true);
  };

  // 1. HORIZONTAL DETAILED LIST VIEW MODE
  if (designPrefs.cardLayout === 'detailed_list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all p-4 cursor-pointer flex flex-col sm:flex-row gap-4 relative select-none"
      >
        {/* Thumbnail Image */}
        <div className="sm:w-64 h-48 sm:h-auto rounded-xl overflow-hidden relative shrink-0">
          <img
            src={listing.coverImage}
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-900/80 text-amber-300 backdrop-blur-xs">
              {categoryMeta?.name || listing.category}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(listing.id);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-stone-700 hover:text-rose-600 backdrop-blur-xs shadow-xs transition-colors"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-0.5">
                  <a
                    href={getGoogleMapsDirectionsUrl(listing)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 hover:text-teal-900 transition-colors group/loc"
                    title="Open in Google Maps"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-800 shrink-0 group-hover/loc:text-rose-600" />
                    <span className="group-hover/loc:underline">{listing.locality}, Pune</span>
                  </a>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-teal-950">
                  {listing.title}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-stone-900">{listing.avgRating || '4.8'}</span>
                <span className="text-[10px] text-stone-500">({listing.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
              {listing.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {listing.eventTypes.slice(0, 3).map(et => (
                <span key={et} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                  {et}
                </span>
              ))}
              {listing.category === 'venues' && listing.categoryAttributes.capacityMax && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Up to {listing.categoryAttributes.capacityMax} guests
                </span>
              )}
            </div>

            {/* Response Time Badge */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-teal-900 bg-teal-50/90 px-2.5 py-0.5 rounded-full border border-teal-200/70 font-medium">
              <Clock className="w-3 h-3 text-teal-700 shrink-0" />
              <span>Response time: Usually within 2 hours</span>
            </div>
          </div>

          {/* Footer with Staleness Badge & Pricing */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-stone-600 block uppercase font-semibold">Starting From</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-base text-stone-900 font-serif">
                    {formatIndianCurrency(listing.startingPrice)}
                  </span>
                  <span className="text-xs text-stone-500">/{(listing.pricingUnit || 'event').replace('per_', '')}</span>
                </div>
              </div>

              {/* Staleness radar */}
              <div className="hidden md:flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-200">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{daysAgoText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComparison(listing.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
                  isCompared 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Compared' : 'Compare'}</span>
              </button>

              <button
                onClick={handleDirectEnquire}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-900 hover:bg-teal-950 text-amber-50 shadow-xs transition-all"
              >
                Enquire / Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT BENTO GRID VIEW MODE
  if (designPrefs.cardLayout === 'compact_bento') {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all p-3 cursor-pointer flex flex-col justify-between space-y-2 select-none"
      >
        <div className="h-36 rounded-lg overflow-hidden relative">
          <img
            src={listing.coverImage}
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-stone-900/80 text-amber-300 backdrop-blur-xs">
            {listing.locality}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(listing.id);
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 text-stone-700 hover:text-rose-600 shadow-xs"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-0.5">
            <span className="capitalize">{categoryMeta?.name || listing.category}</span>
            <div className="flex items-center gap-0.5 font-bold text-stone-800">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{listing.avgRating || '4.8'}</span>
            </div>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 group-hover:text-teal-950">
            {listing.title}
          </h4>
          
          {/* Subtle Response Time Badge */}
          <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-teal-900 bg-teal-50/90 px-2 py-0.5 rounded-md border border-teal-200/60 font-medium">
            <Clock className="w-2.5 h-2.5 text-teal-700 shrink-0" />
            <span>Responds within 2 hrs</span>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-stone-600 block">From</span>
            <span className="font-bold text-xs text-stone-900 font-serif">
              {formatIndianCurrency(listing.startingPrice)}
            </span>
          </div>
          <button
            onClick={handleDirectEnquire}
            className="text-[11px] font-bold text-teal-900 hover:text-amber-700 flex items-center gap-0.5"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // 3. SPACIOUS CARDS (DEFAULT HIGH VISUAL LUXURY)
  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-400/80 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between relative select-none"
    >
      {/* Top Media Banner */}
      <div className="h-56 relative overflow-hidden">
        <img
          src={listing.coverImage}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-950/90 text-amber-300 border border-amber-400/30 backdrop-blur-xs shadow-xs">
            {categoryMeta?.name || listing.category}
          </span>
          {listing.isFeatured && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(listing.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 backdrop-blur-xs shadow-md transition-transform active:scale-90"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom Locality & Staleness info over image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <a
            href={getGoogleMapsDirectionsUrl(listing)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 drop-shadow-sm font-medium hover:text-amber-300 transition-colors group/pin"
            title="Open in Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover/pin:scale-110 transition-transform" />
            <span className="group-hover/pin:underline">{listing.locality}, Pune</span>
          </a>

          <div className={`px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-xs ${
            isStale ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40' : 'bg-black/50 text-stone-200'
          }`}>
            {daysAgoText}
          </div>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-teal-950 transition-colors leading-snug">
              {listing.title}
            </h3>
            {/* Star Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-stone-900">{listing.avgRating || '4.8'}</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
            {listing.description}
          </p>

          {/* Quick Specifications */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.category === 'venues' && listing.categoryAttributes.capacityMax && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 flex items-center gap-1">
                <Users className="w-3 h-3 text-stone-500" />
                {listing.categoryAttributes.capacityMin}-{listing.categoryAttributes.capacityMax} Guests
              </span>
            )}

            {listing.category === 'catering' && listing.categoryAttributes.vegType && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {listing.categoryAttributes.vegType}
              </span>
            )}

            {listing.category === 'photography' && listing.categoryAttributes.deliveryTimelineDays && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                ⚡ {listing.categoryAttributes.deliveryTimelineDays} Days Delivery
              </span>
            )}

            {listing.category === 'decoration' && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                ✨ Custom Mandap
              </span>
            )}

            {listing.category === 'music_dj' && listing.categoryAttributes.soundWattage && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                🔊 {listing.categoryAttributes.soundWattage}
              </span>
            )}

            {listing.category === 'pandit_priest' && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                🔥 Vedic Vivah & Rituals
              </span>
            )}
          </div>

          {/* Subtle Response Time Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-teal-900 bg-teal-50/90 px-2.5 py-0.5 rounded-full border border-teal-200/70 font-medium">
            <Clock className="w-3 h-3 text-teal-700 shrink-0" />
            <span>Response time: Usually within 2 hours</span>
          </div>
        </div>

        {/* Card Footer: Pricing & Compare Button */}
        <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-600 block tracking-wider">
              Starting Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-base sm:text-lg text-stone-900 font-serif">
                {formatIndianCurrency(listing.startingPrice)}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                /{(listing.pricingUnit || 'event').replace('per_', '')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComparison(listing.id);
              }}
              title="Add to side-by-side comparison"
              className={`p-2 rounded-xl text-xs border transition-colors ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={handleDirectEnquire}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-900 hover:bg-teal-950 text-amber-50 shadow-xs transition-all flex items-center gap-1"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
