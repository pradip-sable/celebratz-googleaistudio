import React from 'react';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Building2, 
  Camera, 
  Utensils, 
  Music, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PUNE_LOCALITIES, EVENT_TYPES } from '../data/categories';
import { CategoryId, PuneLocality, EventType } from '../types';
import { getThemeClasses } from '../utils/theme';

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Building2': return <Building2 className="w-6 h-6 text-amber-600" />;
    case 'Camera': return <Camera className="w-6 h-6 text-sky-600" />;
    case 'Utensils': return <Utensils className="w-6 h-6 text-emerald-600" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-rose-600" />;
    case 'Music': return <Music className="w-6 h-6 text-purple-600" />;
    case 'Flame': return <Flame className="w-6 h-6 text-orange-600" />;
    default: return <Sparkles className="w-6 h-6 text-amber-600" />;
  }
};

export const HomeHero: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    setActiveRoute, 
    designPrefs, 
    activeCity,
    setIsCitySelectorOpen,
    listings 
  } = useApp();

  const theme = getThemeClasses(designPrefs.palette);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveRoute('search');
  };

  const handleCategoryClick = (catId: CategoryId) => {
    setFilters(prev => ({ ...prev, category: catId }));
    setActiveRoute('search');
  };

  const handleEventTypeClick = (eventType: EventType) => {
    setFilters(prev => ({ ...prev, eventType }));
    setActiveRoute('search');
  };

  const handleLocalityPillClick = (locality: string) => {
    setFilters(prev => ({ ...prev, locality }));
    setActiveRoute('search');
  };

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-950 via-slate-900 to-amber-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-amber-900/40">
        {/* Subtle decorative motif */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsCitySelectorOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{activeCity?.name || 'Pune'}’s Premier Celebration Marketplace</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/30 text-[10px] text-amber-200 font-bold">
                Switch City
              </span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-amber-50 leading-tight">
            Discover & Compare Top Venues & Event Services in {activeCity?.name || 'Pune'}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            {activeCity?.id === 'pune' 
              ? 'Directly connect with vetted banquet halls, caterers, photographers, decorators, DJs, and Vedic pandits. Check availability, compare transparent pricing, and request walk-throughs in minutes.'
              : `Explore upcoming venues, curated decorators, and celebration spaces across ${activeCity?.name || 'India'}. Currently operating live in Pune with multi-city expansion underway.`}
          </p>

          {/* Prominent Multi-Segment Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mt-8 bg-white/98 rounded-2xl sm:rounded-full p-2.5 sm:p-2 shadow-2xl border border-amber-200/60 max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-stone-800 text-left"
          >
            {/* 1. Locality Selector */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 sm:border-r border-stone-200">
              <MapPin className="w-4 h-4 text-teal-800 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600">
                  Location ({activeCity?.name || 'Pune'})
                </label>
                <select
                  value={filters.locality}
                  onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value as any }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 outline-hidden cursor-pointer"
                >
                  <option value="all">All {activeCity?.name || 'Pune'} Neighborhoods</option>
                  {(activeCity?.localities || PUNE_LOCALITIES).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Event Type Selector */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 sm:border-r border-stone-200">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600">
                  Event Type
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value as any }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 outline-hidden cursor-pointer"
                >
                  <option value="all">Any Celebration</option>
                  {EVENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Event Date Picker */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
              <CalendarIcon className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600">
                  Event Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-stone-950 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Locality Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-300">
            <span className="text-stone-400 font-medium">Popular {activeCity?.name || 'Pune'} Areas:</span>
            {(activeCity?.popularHubs || ['Baner', 'Koregaon Park', 'Kothrud', 'Wakad']).map(loc => (
              <button
                key={loc}
                onClick={() => handleLocalityPillClick(loc)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 transition-colors text-[11px] cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Service Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Browse by Celebration Services
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Handcrafted categories curated specifically for Indian family and corporate festivities
            </p>
          </div>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              setActiveRoute('search');
            }}
            className="text-xs sm:text-sm font-semibold text-teal-900 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group cursor-pointer bg-white rounded-2xl p-4 border border-stone-200 hover:border-amber-400/80 hover:shadow-lg transition-all text-center flex flex-col items-center justify-between space-y-2 hover:-translate-y-1 select-none"
            >
              <div className="p-3.5 rounded-2xl bg-stone-50 group-hover:bg-amber-50 transition-colors border border-stone-100 group-hover:border-amber-200">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-teal-950">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                  {cat.shortDescription}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/60">
                Starts {cat.unitLabel}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Browse By Event Types */}
      <section className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-3">
        <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          What are you celebrating?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {EVENT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleEventTypeClick(type)}
              className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-stone-800 hover:text-teal-950 font-semibold text-xs sm:text-sm transition-all shadow-2xs group"
            >
              <span>{type}</span>
              <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </section>

      {/* Why Celebratz - Transparency & Direct Vendor Connection */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-teal-800" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">Direct Vendor Connection</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            No middleman commission markups or hidden fees. Request a visit or enquiry and negotiate contracts directly with the venue management.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5 text-amber-700" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">Live Availability & Staleness Radar</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Easily see open, tentative, or booked dates with a clear "Last updated X days ago" timestamp before you reach out.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-rose-700" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">Strict Admin Curation</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every vendor profile and banquet space is manually verified in Pune for genuine pricing, capacity, and valid contacts.
          </p>
        </div>
      </section>
    </div>
  );
};
