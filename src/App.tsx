import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeHero } from './components/HomeHero';
import { ListingCard } from './components/ListingCard';
import { SearchFiltersBottomSheet } from './components/SearchFiltersBottomSheet';
import { ListingDetailModal } from './components/ListingDetailModal';
import { RequestEnquireModal } from './components/RequestEnquireModal';
import { ComparisonBar, ComparisonView } from './components/ComparisonBar';
import { CustomerDashboard } from './components/CustomerDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicyView, TermsOfServiceView, AboutContactView } from './components/LegalPages';
import { DesignLayoutSelector } from './components/DesignLayoutSelector';
import { CitySelectorModal } from './components/CitySelectorModal';
import { 
  Filter, 
  Sparkles, 
  MapPin, 
  Search as SearchIcon, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  SlidersHorizontal,
  Calendar,
  Layers,
  Palette,
  X
} from 'lucide-react';
import { CATEGORIES, PUNE_LOCALITIES } from './data/categories';
import { PuneLocality } from './types';

const MainAppContent: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    filteredListings, 
    listings,
    filters, 
    setFilters, 
    resetFilters,
    activeCity,
    setIsCitySelectorOpen,
    isFiltersBottomSheetOpen, 
    setIsFiltersBottomSheetOpen,
    designPrefs,
    isDesignSelectorOpen,
    setIsDesignSelectorOpen
  } = useApp();

  const featuredListings = listings.filter(l => l.isFeatured && l.status === 'active');

  const activeCategoryMeta = CATEGORIES.find(c => c.id === filters.category);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-teal-900 selection:text-amber-200">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ROUTE 1: HOME */}
        {activeRoute === 'home' && (
          <div className="space-y-12">
            {/* Hero Search & Category Quick Links */}
            <HomeHero />

            {/* Featured Celebrations Section */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Curated {activeCity?.name || 'Pune'} Selections</span>
                  </div>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900">
                    Featured Venues & Vendors
                  </h2>
                </div>

                <button
                  onClick={() => {
                    resetFilters();
                    setActiveRoute('search');
                  }}
                  className="text-xs sm:text-sm font-bold text-teal-900 hover:text-teal-950 flex items-center gap-1 group"
                >
                  <span>Explore all {activeCity?.name || 'Pune'} listings</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredListings.slice(0, 6).map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </section>

            {/* Popular Localities in City */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-800" />
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    Explore by {activeCity?.name || 'Pune'} Locality
                  </h3>
                </div>
                <button
                  onClick={() => setIsCitySelectorOpen(true)}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  Switch City
                </button>
              </div>
              <p className="text-xs text-stone-500 max-w-xl">
                Browse celebration venues, banquet lawns, and verified service experts close to your event location in {activeCity?.name || 'Pune'}.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {(activeCity?.localities || PUNE_LOCALITIES).map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, locality: loc }));
                      setActiveRoute('search');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-teal-50 hover:text-teal-900 border border-stone-200 text-xs font-semibold text-stone-700 transition-all active:scale-95 cursor-pointer"
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            </section>

            {/* How Celebratz Works */}
            <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Direct & Transparent
                </span>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-amber-50">
                  How Celebratz Works for Pune Planners
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-light">
                  No hidden middleman markups. Discover spaces, check live dates, and meet directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-serif font-extrabold text-lg flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Search & Filter</h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    Filter by 6 core categories (Venues, Catering, Decor, Photo, DJ, Pandit), budget ranges, and Pune areas like Baner, Koregaon Park, Bavdhan, or Hadapsar.
                  </p>
                </div>

                <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-stone-950 font-serif font-extrabold text-lg flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Check Calendar & Compare</h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    View color-coded vendor calendars (Green: Available, Amber: Tentative, Red: Booked) with live staleness indicators, and compare up to 3 listings side-by-side.
                  </p>
                </div>

                <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-400 text-stone-950 font-serif font-extrabold text-lg flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Request to Book / Visit</h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    Submit a walkthrough request with double-entry phone verification. The vendor contacts you directly to negotiate, tour, and finalize your celebration contract!
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ROUTE 2: SEARCH / MARKETPLACE EXPLORER */}
        {activeRoute === 'search' && (
          <div className="space-y-6 pb-16">
            {/* Search Header Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search query input */}
                <div className="relative flex-1 w-full">
                  <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, lawn, veg catering, AC banquet..."
                    value={filters.searchQuery || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium placeholder:text-stone-400 focus:outline-hidden focus:border-teal-700 transition-colors"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Trigger Button */}
                <button
                  onClick={() => setIsFiltersBottomSheetOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-teal-900 hover:bg-teal-950 text-amber-50 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-300" />
                  <span>Filter Options</span>
                  {(filters.category !== 'all' || filters.locality !== 'all' || filters.pureVegOnly) && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              </div>

              {/* Category Quick Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filters.category === 'all'
                      ? 'bg-teal-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  ✨ All Categories ({listings.length})
                </button>
                {CATEGORIES.map(c => {
                  const count = listings.filter(l => l.category === c.id && l.status === 'active').length;
                  const isSelected = filters.category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setFilters(prev => ({ ...prev, category: c.id }))}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-teal-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Counter & Active Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-stone-900 font-bold">{filteredListings.length}</strong> {activeCity?.name || 'Pune'} venue & vendor listings
                  {filters.locality !== 'all' && (
                    <span className="ml-1 text-teal-900 font-bold">in {filters.locality}</span>
                  )}
                </span>
                <button
                  onClick={() => setIsCitySelectorOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Change City
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDesignSelectorOpen(true)}
                  className="text-stone-600 hover:text-stone-950 font-semibold flex items-center gap-1"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  <span>Layout: {(designPrefs?.cardLayout || 'spacious_cards').replace('_', ' ')}</span>
                </button>

                {(filters.category !== 'all' || filters.locality !== 'all' || filters.searchQuery || (filters.city && filters.city !== 'pune')) && (
                  <button
                    onClick={resetFilters}
                    className="text-amber-800 hover:underline font-bold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid / List */}
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <SearchIcon className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  No matching {activeCity?.name || 'Pune'} listings found
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {activeCity?.id !== 'pune' 
                    ? `${activeCity?.name} is in our upcoming launch expansion phase. You can pre-register or switch to Pune for live booking.`
                    : 'Try adjusting your budget range, clearing locality filters, or searching for other event categories.'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-teal-900 text-white rounded-xl text-xs font-bold hover:bg-teal-950 transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  {activeCity?.id !== 'pune' && (
                    <button
                      onClick={() => setIsCitySelectorOpen(true)}
                      className="px-5 py-2.5 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Explore Cities
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`grid gap-5 ${
                designPrefs?.cardLayout === 'detailed_list' 
                  ? 'grid-cols-1' 
                  : designPrefs?.cardLayout === 'compact_bento'
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ROUTE 3: SIDE-BY-SIDE COMPARISON */}
        {activeRoute === 'compare' && <ComparisonView />}

        {/* ROUTE 4: CUSTOMER DASHBOARD */}
        {activeRoute === 'customer-dashboard' && <CustomerDashboard />}

        {/* ROUTE 5: VENDOR DASHBOARD */}
        {activeRoute === 'vendor-dashboard' && <VendorDashboard />}

        {/* ROUTE 6: ADMIN PANEL */}
        {activeRoute === 'admin-panel' && <AdminPanel />}

        {/* ROUTE 7: LEGAL / PRIVACY / TERMS / ABOUT */}
        {activeRoute === 'privacy' && <PrivacyPolicyView />}
        {activeRoute === 'terms' && <TermsOfServiceView />}
        {activeRoute === 'about' && <AboutContactView />}
      </main>

      {/* Persistent Bottom Comparison Bar (when items selected) */}
      <ComparisonBar />

      {/* Dynamic Filter Bottom Sheet */}
      <SearchFiltersBottomSheet />

      {/* Detailed Full Listing Modal */}
      <ListingDetailModal />

      {/* Request to Book / Enquire Flow Modal */}
      <RequestEnquireModal />

      {/* Design Layout & Palette Selector Modal */}
      <DesignLayoutSelector />

      {/* Multi-City Selection & Expansion Modal */}
      <CitySelectorModal />

      {/* Global Footer */}
      <footer className="bg-stone-950 text-stone-400 pt-12 pb-24 sm:pb-12 border-t border-stone-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-teal-800 text-amber-300 font-serif font-black text-lg flex items-center justify-center shadow-xs">
                  C
                </span>
                <span className="font-serif font-black text-xl text-white tracking-tight">
                  Celebratz
                </span>
                <button
                  onClick={() => setIsCitySelectorOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Switch city"
                >
                  <span>{activeCity?.name || 'Pune'}</span>
                  <span className="opacity-60 text-[9px]">&bull; Change</span>
                </button>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Discover and compare venues, catering, decoration, photography, DJs, and Vedic pandits for weddings, birthdays, and celebrations across {activeCity?.name || 'Pune'}, {activeCity?.state || 'Maharashtra'}.
              </p>
              <div className="text-[11px] text-stone-500 pt-1">
                Support: <a href="mailto:celebratzapp@gmail.com" className="text-amber-400 hover:underline">celebratzapp@gmail.com</a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-stone-200">Celebration Services</h4>
              <ul className="space-y-1.5 text-xs">
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: c.id }));
                        setActiveRoute('search');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-300 transition-colors"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Localities */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-stone-200">
                Popular {activeCity?.name || 'Pune'} Hubs
              </h4>
              <ul className="space-y-1.5 text-xs">
                {(activeCity?.popularHubs || ['Baner', 'Koregaon Park', 'Bavdhan', 'Wakad']).map(loc => (
                  <li key={loc}>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, locality: loc }));
                        setActiveRoute('search');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-300 transition-colors"
                    >
                      Venues in {loc}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Trust, Design & Legal */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-stone-200">Trust & Legal</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => { setActiveRoute('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">
                    About Celebratz & Contact
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveRoute('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">
                    Privacy Policy (Data Consent)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveRoute('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">
                    Terms of Service (Offline Booking)
                  </button>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => setIsDesignSelectorOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 text-amber-400 border border-stone-800 text-xs font-semibold hover:bg-stone-800 flex items-center gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Theme & Layout Customizer</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <p>&copy; 2026 Celebratz India. Crafted for Pune Celebrations.</p>
            <p className="text-[11px] text-stone-400">
              Celebratz is a discovery platform. Contracts and payments occur directly with vendors.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Bar for App-like navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
