import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Info,
  Clock,
  Send,
  AlertCircle,
  HelpCircle,
  Percent
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePackages } from '../hooks/usePackages';
import { EventType, Package, ComboPackage } from '../types';
import { EVENT_TYPES, formatEventType } from '../data/categories';
import { formatIndianCurrency } from '../utils/theme';
import { calculatePackagePrice, getPackageAvailability, getPackageReviewRollup } from '../utils/pricing';
import { ComboPackageDetailModal } from './ComboPackageDetailModal';

export const PackagesBrowsePage: React.FC = () => {
  const { listings, openEnquiryForPackage, setActiveRoute } = useApp();
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'all'>('all');
  const [targetDate, setTargetDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [activeDetailCombo, setActiveDetailCombo] = useState<ComboPackage | null>(null);

  const { publicPackages, totalCount } = usePackages({
    eventType: selectedEventType
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-accent">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Multi-Service Bundles &bull; Pune Verified</span>
            </div>
            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight">
              Curated Vendor Packages
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Bundle 2+ services from a single verified vendor (e.g. Venue + Decor + Catering) for bundled discounts, unified event coordination, and guaranteed synchronized dates.
            </p>
          </div>

          {/* Quick Date Availability Check Bar */}
          <div className="bg-muted/40 p-3.5 sm:p-4 rounded-2xl border border-border/90 shrink-0 space-y-1.5 self-start md:self-auto w-full md:w-auto">
            <label htmlFor="package-check-date-input" className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Check Derived Availability:</span>
            </label>
            <input
              id="package-check-date-input"
              type="date"
              value={targetDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-white border border-border rounded-xl px-3 py-1.5 text-xs text-foreground font-bold focus:outline-hidden focus:border-primary shadow-2xs w-full cursor-pointer"
            />
            <p className="text-[10px] text-muted-foreground">
              Derives live status across all bundled services for this date
            </p>
          </div>
        </div>

        {/* Event Type Filter Pills */}
        <div className="pt-2 border-t border-border-subtle flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-muted-foreground shrink-0">Celebration:</span>
          <button
            type="button"
            onClick={() => setSelectedEventType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedEventType === 'all'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted text-foreground hover:bg-muted'
            }`}
          >
            All Celebrations
          </button>
          {EVENT_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedEventType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedEventType === type
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted text-foreground hover:bg-muted'
              }`}
            >
              {formatEventType(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Package Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong>{publicPackages.length}</strong> active bundled package{publicPackages.length === 1 ? '' : 's'}
        </span>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          Prices computed at read time &bull; Ratings rolled up from component services
        </span>
      </div>

      {/* Packages Grid */}
      {publicPackages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-accent-subtle text-accent flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="font-serif font-bold text-xl text-foreground">
            No Bundled Packages Found
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            There are currently no active packages for the selected celebration filter. Try selecting "All Celebrations" or explore individual vendor services.
          </p>
          <button
            type="button"
            onClick={() => setSelectedEventType('all')}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
          >
            View All Packages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {publicPackages.map(pkg => {
            const priceData = calculatePackagePrice(pkg, listings);
            const reviews = getPackageReviewRollup(pkg, listings);
            const availability = getPackageAvailability(pkg, targetDate, listings);

            // Fallback cover image if pkg doesn't have one: use first component listing's photo
            const displayCover = pkg.coverImage || priceData.components[0]?.listing.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80';

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group text-left"
              >
                <div>
                  {/* Hero Cover Image & Badges */}
                  <div className="relative h-56 w-full bg-primary-dark overflow-hidden">
                    <img
                      src={displayCover}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-accent text-accent-foreground shadow-sm">
                        {pkg.badge || `${priceData.discountPercentage}% OFF BUNDLE`}
                      </span>

                      {/* Component count tag */}
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-dark/80 text-white backdrop-blur-xs border border-white/20">
                        {priceData.components.length} Services Bundled
                      </span>
                    </div>

                    {/* Bottom overlay inside image */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white space-y-1">
                      <div className="flex items-center gap-2 text-xs text-accent font-semibold">
                        <span>{pkg.vendorName}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-destructive" />
                          {pkg.locality || 'Baner'}, Pune
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-lg sm:text-xl text-white leading-snug line-clamp-1">
                        {pkg.title}
                      </h2>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Review Rollup Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-border-subtle text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-accent">★ {reviews.avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviews.reviewCount} verified reviews)</span>
                        <span className="text-[10px] text-muted-foreground italic hidden sm:inline">&bull; Rolled up from component services</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success border border-success/20">
                        Verified Bundle
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Component Services Breakdown with Individual Effective Prices */}
                    <div className="space-y-2 bg-muted/90 rounded-2xl p-3.5 border border-border/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-foreground uppercase tracking-wider">
                        <span>Included Component Services:</span>
                        <span className="text-[10px] text-muted-foreground font-normal lowercase">prices shown per component</span>
                      </div>

                      <div className="space-y-1.5">
                        {priceData.components.map(({ listing, effectivePrice, priceUnit }) => (
                          <div 
                            key={listing.id}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-border/70"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-muted text-foreground">
                                {listing.category}
                              </span>
                              <span className="font-bold text-foreground truncate">
                                {listing.title}
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-primary shrink-0 ml-2">
                              {formatIndianCurrency(effectivePrice)}
                              <span className="text-[10px] font-normal text-muted-foreground">
                                /{priceUnit.replace('per_', '')}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Explicit Transparency Note */}
                      <p className="text-[10px] text-muted-foreground leading-tight pt-1 flex items-start gap-1">
                        <Info className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                        <span>
                          Component prices: {priceData.components.map(c => `${c.listing.category}: ${formatIndianCurrency(c.effectivePrice)}/${c.priceUnit.replace('per_', '')}`).join(' + ')}. Total is indicative and depends on guest count/customization.
                        </span>
                      </p>
                    </div>

                    {/* Derived Availability Status for Selected Date */}
                    <div className="p-3 rounded-2xl border flex items-center justify-between text-xs bg-white border-border shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          availability.status === 'available' 
                            ? 'bg-success ring-2 ring-success/20' 
                            : availability.status === 'booked'
                            ? 'bg-destructive'
                            : availability.status === 'check_with_vendor'
                            ? 'bg-accent'
                            : 'bg-accent'
                        }`} />
                        <div>
                          <span className="font-bold text-foreground">
                            {availability.status === 'available' && 'All components available'}
                            {availability.status === 'booked' && 'Booked on selected date'}
                            {availability.status === 'tentative' && 'Tentative availability'}
                            {availability.status === 'check_with_vendor' && 'Check with vendor (calendar unupdated)'}
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            Derived per date from {priceData.components.length} component calendars
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        availability.status === 'available'
                          ? 'bg-success-subtle text-success'
                          : availability.status === 'booked'
                          ? 'bg-destructive-subtle text-destructive'
                          : 'bg-accent-subtle text-accent-dark'
                      }`}>
                        {availability.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Starting From Price & Request Button */}
                <div className="p-5 sm:p-6 bg-muted/90 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Package starting from
                      </span>
                      {priceData.discountAmount > 0 && (
                        <span className="text-[10px] font-bold text-success bg-success-subtle px-1.5 py-0.2 rounded">
                          Save {formatIndianCurrency(priceData.discountAmount)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-extrabold text-2xl sm:text-3xl text-primary">
                        {formatIndianCurrency(priceData.startingPrice)}
                      </span>
                      {priceData.rawSum > priceData.startingPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatIndianCurrency(priceData.rawSum)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveDetailCombo(pkg)}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white hover:bg-muted text-foreground text-xs font-bold border border-border transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Open inquiry with package_id set and listing_id: null!
                        const primaryListingId = pkg.includedListingIds[0] || 'list_venue_1';
                        openEnquiryForPackage(primaryListingId, undefined, pkg);
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-accent" />
                      <span>Request Package</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Details Modal */}
      {activeDetailCombo && (
        <ComboPackageDetailModal
          combo={activeDetailCombo}
          isOpen={Boolean(activeDetailCombo)}
          onClose={() => setActiveDetailCombo(null)}
        />
      )}
    </div>
  );
};
