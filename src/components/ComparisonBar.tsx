import React from 'react';
import { Scale, X, ArrowRight, Star, Users, MapPin, Check, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency } from '../utils/theme';

export const ComparisonBar: React.FC = () => {
  const { comparisonList, clearComparison, setActiveRoute, listings, toggleComparison } = useApp();

  if (comparisonList.length === 0) return null;

  const comparedItems = listings.filter(l => comparisonList.includes(l.id));

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-950 text-white rounded-2xl px-4 py-3 shadow-2xl border border-stone-800 flex items-center gap-3 sm:gap-6 max-w-xl w-[92%] sm:w-auto animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <Scale className="w-5 h-5 text-amber-400 shrink-0" />
        <span className="text-xs font-bold text-stone-100 hidden sm:inline">
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
              className="w-9 h-9 rounded-lg object-cover border border-stone-700"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => toggleComparison(item.id)}
              className="absolute -top-1 -right-1 bg-stone-900 text-stone-400 hover:text-white rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {comparisonList.length < 3 && (
          <div className="text-[11px] text-stone-400 italic hidden md:block">
            + Select up to {3 - comparisonList.length} more
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={clearComparison}
          className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1"
        >
          Clear
        </button>
        <button
          onClick={() => setActiveRoute('compare')}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
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
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-stone-900">Your Comparison Tray is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Browse venues and services, then click the scale icon on any listing card to compare pricing, capacity, and features side-by-side.
        </p>
        <button
          onClick={() => setActiveRoute('search')}
          className="px-5 py-2.5 bg-teal-900 text-white rounded-xl text-xs font-bold"
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
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900">
            Side-by-Side Comparison
          </h1>
          <p className="text-xs text-stone-500">
            Evaluating {comparedItems.length} shortlisted Pune vendors
          </p>
        </div>
        <button
          onClick={() => setActiveRoute('search')}
          className="text-xs font-semibold text-teal-900 hover:underline"
        >
          &larr; Add more listings
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[700px]">
          {comparedItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
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
                    className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-white rounded-full hover:bg-stone-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-900/80 text-amber-300">
                    {item.locality}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs text-stone-600 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-stone-900">{item.avgRating || '4.8'}</span>
                  <span>({item.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Spec Comparison Matrix */}
              <div className="space-y-3 pt-3 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Starting Rate</span>
                  <span className="font-serif font-extrabold text-lg text-teal-950">
                    {formatIndianCurrency(item.startingPrice)}
                  </span>
                  <span className="text-[10px] text-stone-500"> /{(item.pricingUnit || 'event').replace('per_', '')}</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Service Category</span>
                  <span className="capitalize font-semibold text-stone-800">{item.category}</span>
                </div>

                {item.category === 'venues' && (
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Guest Capacity</span>
                    <span className="font-semibold text-stone-800">
                      {item.categoryAttributes.capacityMin} - {item.categoryAttributes.capacityMax} Guests
                    </span>
                  </div>
                )}

                {item.category === 'catering' && (
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase block">Dietary Options</span>
                    <span className="font-semibold text-emerald-800">{item.categoryAttributes.vegType}</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Suitable For</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.eventTypes.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-stone-100 rounded-md font-medium text-stone-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <button
                  onClick={() => setSelectedListingId(item.id)}
                  className="flex-1 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedListingId(item.id);
                    setIsEnquiryModalOpen(true);
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-teal-900 hover:bg-teal-950 text-white rounded-xl"
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
