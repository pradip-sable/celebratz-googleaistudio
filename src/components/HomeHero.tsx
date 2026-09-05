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
import { CATEGORIES, PUNE_LOCALITIES, EVENT_TYPES, formatEventType } from '../data/categories';
import { CategoryId, PuneLocality, EventType } from '../types';

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

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-dark via-black to-accent-dark text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-accent/40">
        {/* Subtle decorative motif */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsCitySelectorOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent-light text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{activeCity?.name || 'Pune'}’s Premier Celebration Marketplace</span>
              <span className="px-1.5 py-0.2 rounded bg-accent/30 text-[10px] text-accent-light font-bold">
                Switch City
              </span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-accent-light leading-tight">
            Discover & Compare Top Venues & Event Services in {activeCity?.name || 'Pune'}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            {activeCity?.id === 'pune' 
              ? 'Directly connect with vetted banquet halls, caterers, photographers, decorators, DJs, and Vedic pandits. Check availability, compare transparent pricing, and request walk-throughs in minutes.'
              : `Explore upcoming venues, curated decorators, and celebration spaces across ${activeCity?.name || 'India'}. Currently operating live in Pune with multi-city expansion underway.`}
          </p>

          {/* Prominent Multi-Segment Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mt-8 bg-white/98 rounded-3xl lg:rounded-full p-3 sm:p-4 lg:p-2 shadow-2xl border border-accent/40 max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center gap-2 text-foreground text-left"
          >
            {/* 1. Location Selector */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 lg:border-r border-border">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Location ({activeCity?.name || 'Pune'})
                </label>
                <select
                  value={filters.locality}
                  onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value as any }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground outline-hidden cursor-pointer"
                >
                  <option value="all">All {activeCity?.name || 'Pune'} Neighborhoods</option>
                  {(activeCity?.localities || PUNE_LOCALITIES).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Event Type Selector */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 lg:border-r border-border">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Event Type
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value as any }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground outline-hidden cursor-pointer"
                >
                  <option value="all">Any Celebration</option>
                  {EVENT_TYPES.map(type => (
                    <option key={type} value={type}>{formatEventType(type)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Service Category Selector */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 lg:border-r border-border">
              <Building2 className="w-4 h-4 text-primary shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Service Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground outline-hidden cursor-pointer"
                >
                  <option value="all">All Services</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Event Date Picker */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 lg:border-r border-border">
              <CalendarIcon className="w-4 h-4 text-secondary shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Event Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* 5. Optional Guest Count Filter */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Guests (Optional)
                  </label>
                  {filters.guestCount && filters.guestCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, guestCount: 0 }))}
                      className="text-[10px] text-muted-foreground hover:text-foreground font-bold"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <input
                  type="number"
                  min="0"
                  step="25"
                  placeholder="e.g. 250"
                  value={filters.guestCount ? filters.guestCount : ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, guestCount: e.target.value ? Math.max(0, Number(e.target.value)) : 0 }))}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-hidden"
                />
              </div>
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="bg-accent hover:bg-accent-dark text-accent-foreground font-bold px-6 py-3.5 rounded-2xl lg:rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* 6 Service Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
              Browse by Celebration Services
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Handcrafted categories curated specifically for Indian family and corporate festivities
            </p>
          </div>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              setActiveRoute('search');
            }}
            className="text-xs sm:text-sm font-semibold text-primary hover:text-accent flex items-center gap-1 transition-colors"
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
              className="group cursor-pointer bg-white rounded-2xl p-4 border border-border hover:border-accent/80 hover:shadow-lg transition-all text-center flex flex-col items-center justify-between space-y-2 hover:-translate-y-1 select-none"
            >
              <div className="p-3.5 rounded-2xl bg-muted/40 group-hover:bg-accent-subtle transition-colors border border-border-subtle group-hover:border-accent/30">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
                  {cat.shortDescription}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-accent-dark bg-accent-subtle/80 px-2 py-0.5 rounded-full border border-accent/40">
                Starts {cat.unitLabel}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Browse By Event Types */}
      <section className="bg-muted/40 rounded-2xl p-6 border border-border/80 space-y-3">
        <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          What are you celebrating?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {EVENT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleEventTypeClick(type)}
              className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-border hover:border-primary hover:bg-primary-subtle/40 text-foreground hover:text-primary font-semibold text-xs sm:text-sm transition-all shadow-2xs group"
            >
              <span>{formatEventType(type)}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </section>

      {/* Why Celebratz - Transparency & Direct Vendor Connection */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-sm text-foreground">Direct Vendor Connection</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No middleman commission markups or hidden fees. Request a visit or enquiry and negotiate contracts directly with the venue management.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-accent-subtle text-accent-dark flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5 text-accent" />
          </div>
          <h4 className="font-bold text-sm text-foreground">Live Availability & Staleness Radar</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Easily see open, tentative, or booked dates with a clear "Last updated X days ago" timestamp before you reach out.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-secondary-subtle text-secondary-dark flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-secondary" />
          </div>
          <h4 className="font-bold text-sm text-foreground">Strict Admin Curation</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every vendor profile and banquet space is manually verified in Pune for genuine pricing, capacity, and valid contacts.
          </p>
        </div>
      </section>
    </div>
  );
};
