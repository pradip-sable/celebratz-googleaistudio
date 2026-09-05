import React from 'react';
import { Scale, X, ArrowRight, Star, Users, MapPin, Check, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency } from '../utils/theme';
import { formatEventType } from '../data/categories';

export const ComparisonBar: React.FC = () => {
  const { comparisonList, clearComparison, setActiveRoute, listings, toggleComparison } = useApp();

  if (comparisonList.length === 0) return null;

  const comparedItems = listings.filter(l => comparisonList.includes(l.id));

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black text-white rounded-2xl px-4 py-3 shadow-2xl border border-border flex items-center gap-3 sm:gap-6 max-w-xl w-[92%] sm:w-auto animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <Scale className="w-5 h-5 text-accent shrink-0" />
        <span className="text-xs font-bold text-muted-foreground hidden sm:inline">
          Compare ({comparisonList.length}/3):
        </span>
      </div>

      {/* Mini Thumbnails */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {comparedItems.map(item => (
          <div key={item.id} className="relative group shrink-0">
            <img
              src={item.coverImage}
              alt=""
              className="w-9 h-9 rounded-lg object-cover border border-border"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => toggleComparison(item.id)}
              className="absolute -top-1 -right-1 bg-primary-dark text-muted-foreground hover:text-white rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {comparisonList.length < 3 && (
          <div className="text-[11px] text-muted-foreground italic hidden md:block">
            + Select up to {3 - comparisonList.length} more
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={clearComparison}
          className="text-muted-foreground hover:text-muted-foreground text-xs px-2 py-1"
        >
          Clear
        </button>
        <button
          onClick={() => setActiveRoute('compare')}
          className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-accent-foreground rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ComparisonView: React.FC = () => {
  const { comparisonList, listings, toggleComparison, setSelectedListingId, setIsEnquiryModalOpen, setActiveRoute } = useApp();

  const comparedItems = listings.filter(l => comparisonList.includes(l.id));

  if (comparedItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-foreground">Your Comparison Tray is Empty</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Browse venues and services, then click the scale icon on any listing card to compare pricing, capacity, and features side-by-side.
        </p>
        <button
          onClick={() => setActiveRoute('search')}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl text-xs font-bold"
        >
          Explore Pune Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-foreground">
            Side-by-Side Comparison
          </h1>
          <p className="text-xs text-muted-foreground">
            Evaluating {comparedItems.length} shortlisted Pune vendors
          </p>
        </div>
        <button
          onClick={() => setActiveRoute('search')}
          className="text-xs font-semibold text-primary hover:underline"
        >
          &larr; Add more listings
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[700px]">
          {comparedItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-border p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleComparison(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-primary-dark/80 text-white rounded-full hover:bg-primary-dark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-dark/80 text-accent">
                    {item.locality}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-foreground">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="font-bold text-foreground">{item.avgRating || '4.8'}</span>
                  <span>({item.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Spec Comparison Matrix */}
              <div className="space-y-3 pt-3 border-t border-border-subtle text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Starting Rate</span>
                  <span className="font-serif font-extrabold text-lg text-primary">
                    {formatIndianCurrency(item.startingPrice)}
                  </span>
                  <span className="text-[10px] text-muted-foreground"> /{(item.pricingUnit || 'event').replace('per_', '')}</span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Service Category</span>
                  <span className="capitalize font-semibold text-foreground">{item.category}</span>
                </div>

                {item.category === 'venues' && (
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Guest Capacity</span>
                    <span className="font-semibold text-foreground">
                      {item.categoryAttributes.capacityMin} - {item.categoryAttributes.capacityMax} Guests
                    </span>
                  </div>
                )}

                {item.category === 'catering' && (
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Dietary Options</span>
                    <span className="font-semibold text-success">{item.categoryAttributes.vegType}</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Suitable For</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.eventTypes.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-muted rounded-md font-medium text-foreground">
                        {formatEventType(t)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border-subtle flex gap-2">
                <button
                  onClick={() => setSelectedListingId(item.id)}
                  className="flex-1 py-2 text-xs font-semibold bg-muted hover:bg-muted text-foreground rounded-xl"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedListingId(item.id);
                    setIsEnquiryModalOpen(true);
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl"
                >
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
