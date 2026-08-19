import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PUNE_LOCALITIES, EVENT_TYPES } from '../data/categories';
import { formatIndianCurrency } from '../utils/theme';

export const SearchFiltersBottomSheet: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    activeCity,
    setIsCitySelectorOpen,
    isFiltersBottomSheetOpen, 
    setIsFiltersBottomSheetOpen,
    filteredListings 
  } = useApp();

  if (!isFiltersBottomSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 animate-in slide-in-from-bottom-8">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-teal-800" />
            <h3 className="font-serif font-bold text-base text-stone-900">Filters & Preferences</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsFiltersBottomSheetOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* City Selection Bar */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-xs font-bold text-stone-900">{activeCity?.name || 'Pune'}</span>
                <span className="text-[10px] text-stone-500 ml-1.5">({activeCity?.state || 'Maharashtra'})</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFiltersBottomSheetOpen(false);
                setIsCitySelectorOpen(true);
              }}
              className="text-xs text-amber-800 hover:underline font-bold cursor-pointer"
            >
              Switch City
            </button>
          </div>

          {/* 1. Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Service Category
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                  filters.category === 'all'
                    ? 'bg-teal-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                ✨ All Categories
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, category: c.id }))}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    filters.category === c.id
                      ? 'bg-teal-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Locality */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              {activeCity?.name || 'Pune'} Locality / Area
            </label>
            <select
              value={filters.locality}
              onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value as any }))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 font-medium focus:border-teal-700 outline-hidden"
            >
              <option value="all">All {activeCity?.name || 'Pune'} Neighborhoods</option>
              {(activeCity?.localities || PUNE_LOCALITIES).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* 3. Event Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Event Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, eventType: 'all' }))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filters.eventType === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                All Events
              </button>
              {EVENT_TYPES.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, eventType: e }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filters.eventType === e
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Event Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Event Date (Check Availability)
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 font-medium focus:border-teal-700 outline-hidden"
            />
          </div>

          {/* 5. Budget Cap Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Max Budget Cap
              </label>
              <span className="text-xs font-bold text-teal-900">
                {filters.budgetMax >= 500000 ? 'Any Budget' : formatIndianCurrency(filters.budgetMax)}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={filters.budgetMax}
              onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
              className="w-full accent-teal-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 mt-1">
              <span>₹5k</span>
              <span>₹1 Lakh</span>
              <span>₹3 Lakhs</span>
              <span>₹5 Lakhs+</span>
            </div>
          </div>

          {/* 6. Venue & Catering Specific Toggles */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Specialized Preferences
            </label>
            
            <label className="flex items-center gap-2.5 p-2 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.pureVegOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, pureVegOnly: e.target.checked }))}
                className="w-4 h-4 text-teal-800 rounded-xs accent-teal-800"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-900">Pure Veg Only (Catering)</span>
                <p className="text-[10px] text-stone-500">Filters catering to 100% vegetarian & Jain kitchen facilities</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasACOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, hasACOnly: e.target.checked }))}
                className="w-4 h-4 text-teal-800 rounded-xs accent-teal-800"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-900">Air Conditioned Halls Only (Venues)</span>
                <p className="text-[10px] text-stone-500">Requires central air conditioning in banquet spaces</p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between rounded-b-3xl sm:rounded-b-2xl">
          <p className="text-xs text-stone-500">
            Matching <span className="font-bold text-stone-900">{filteredListings.length}</span> listings in Pune
          </p>
          <button
            type="button"
            onClick={() => setIsFiltersBottomSheetOpen(false)}
            className="px-5 py-2.5 bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
};
