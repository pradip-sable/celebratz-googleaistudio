import React, { useState, useEffect } from 'react';
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
import { PackagesBrowsePage } from './components/PackagesBrowsePage';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicyView, TermsOfServiceView, AboutContactView } from './components/LegalPages';
import { DesignLayoutSelector } from './components/DesignLayoutSelector';
import { CitySelectorModal } from './components/CitySelectorModal';
import { AuthModal } from './components/AuthModal';
import { BrandName } from './components/BrandName';
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
  Users,
  X
} from 'lucide-react';
import { CATEGORIES, PUNE_LOCALITIES } from './data/categories';
import { PuneLocality } from './types';
import { forceUnlockBodyScroll } from './hooks';

const MainAppContent: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    filteredListings, 
    listings,
    filters, 
    setFilters, 
    resetFilters,
    parsedSearchQuery,
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

  // Scroll to top instantly whenever navigated to another route/page and ensure body scroll is unlocked
  useEffect(() => {
    forceUnlockBodyScroll();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeRoute]);

  return (
    <div 
      id="app-root" 
      data-theme={designPrefs?.palette || 'teal_gold'} 
      className="min-h-screen flex flex-col bg-muted text-foreground font-sans selection:bg-primary selection:text-accent-subtle"
    >
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
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Curated {activeCity?.name || 'Pune'} Selections</span>
                  </div>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-foreground">
                    Featured Venues & Vendors
                  </h2>
                </div>

                <button
                  onClick={() => {
                    resetFilters();
                    setActiveRoute('search');
                  }}
                  className="text-xs sm:text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 group"
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
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-serif font-bold text-xl text-foreground">
                    Explore by {activeCity?.name || 'Pune'} Locality
                  </h3>
                </div>
                <button
                  onClick={() => setIsCitySelectorOpen(true)}
                  className="text-xs font-bold text-accent-dark hover:underline"
                >
                  Switch City
                </button>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
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
                    className="px-3.5 py-2 rounded-xl bg-muted/40 hover:bg-primary-subtle hover:text-primary border border-border text-xs font-semibold text-foreground transition-all active:scale-95 cursor-pointer"
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            </section>

            {/* How Celebratz Works */}
            <section className="bg-primary-dark text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Direct & Transparent
                </span>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-accent-subtle">
                  How Celebratz Works for Pune Planners
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-light">
                  No hidden middleman markups. Discover spaces, check live dates, and meet directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-foreground/80 p-6 rounded-2xl border border-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent text-foreground font-serif font-extrabold text-lg flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Search & Filter</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    Filter by 6 core categories (Venues, Catering, Decor, Photo, DJ, Pandit), budget ranges, and Pune areas like Baner, Koregaon Park, Bavdhan, or Hadapsar.
                  </p>
                </div>

                <div className="bg-foreground/80 p-6 rounded-2xl border border-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-foreground font-serif font-extrabold text-lg flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Check Calendar & Compare</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    View color-coded vendor calendars (Green: Available, Amber: Tentative, Red: Booked) with live staleness indicators, and compare up to 3 listings side-by-side.
                  </p>
                </div>

                <div className="bg-foreground/80 p-6 rounded-2xl border border-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive text-foreground font-serif font-extrabold text-lg flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Request to Book / Visit</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
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
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-border shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search query input */}
                <div className="relative flex-1 w-full">
                  <SearchIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Search with phrases like "Wedding venue in Baner", "Kothrud banquet", "Catering in Hadapsar"...`}
                    value={filters.searchQuery || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2.5 bg-muted/40 border border-border rounded-2xl text-xs sm:text-sm text-foreground font-medium placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Trigger Button */}
                <button
                  onClick={() => setIsFiltersBottomSheetOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-primary hover:bg-primary-dark text-accent-subtle rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  <span>Filter Options</span>
                  {(filters.category !== 'all' || filters.locality !== 'all' || (filters.guestCount && filters.guestCount > 0) || filters.pureVegOnly || filters.hasACOnly) && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              </div>

              {/* Natural Query Detected Intent Chips */}
              {filters.searchQuery && filters.searchQuery.trim() && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-accent-subtle/70 border border-accent/80 rounded-2xl text-xs animate-in fade-in-50 duration-150">
                  <div className="flex items-center gap-1.5 text-accent-dark font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Search Filter:</span>
                  </div>

                  {parsedSearchQuery.detectedLocality && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-subtle font-bold text-xs">
                      <MapPin className="w-3 h-3 text-accent" />
                      Locality: {parsedSearchQuery.detectedLocality}
                    </span>
                  )}

                  {parsedSearchQuery.detectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-dark text-accent font-bold text-xs">
                      Category: {CATEGORIES.find(c => c.id === parsedSearchQuery.detectedCategory)?.name || parsedSearchQuery.detectedCategory}
                    </span>
                  )}

                  {parsedSearchQuery.detectedEventType && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive text-destructive-subtle font-bold text-xs">
                      💍 {parsedSearchQuery.detectedEventType}
                    </span>
                  )}

                  {parsedSearchQuery.detectedGuestCount && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success text-success-subtle font-bold text-xs">
                      <Users className="w-3 h-3 text-success" />
                      Guests: {parsedSearchQuery.detectedGuestCount}+ Pax
                    </span>
                  )}

                  {parsedSearchQuery.keywords.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground text-xs">
                      Keyword: "{parsedSearchQuery.keywords.join(' ')}"
                    </span>
                  )}

                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="ml-auto text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Clear query
                  </button>
                </div>
              )}

              {/* Category Quick Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filters.category === 'all'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-muted text-foreground hover:bg-muted'
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
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-foreground hover:bg-muted'
                      }`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Counter & Active Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-foreground font-bold">{filteredListings.length}</strong> {activeCity?.name || 'Pune'} venue & vendor listings
                  {filters.locality !== 'all' && (
                    <span className="ml-1 text-primary font-bold">in {filters.locality}</span>
                  )}
                </span>
                <button
                  onClick={() => setIsCitySelectorOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-muted hover:bg-border text-foreground text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Change City
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDesignSelectorOpen(true)}
                  className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1"
                >
                  <Palette className="w-3.5 h-3.5 text-accent" />
                  <span>Layout: {(designPrefs?.cardLayout || 'spacious_cards').replace('_', ' ')}</span>
                </button>

                {(filters.category !== 'all' || filters.locality !== 'all' || filters.eventType !== 'all' || filters.date || (filters.guestCount && filters.guestCount > 0) || filters.pureVegOnly || filters.hasACOnly || filters.searchQuery || (filters.city && filters.city !== 'pune')) && (
                  <button
                    onClick={resetFilters}
                    className="text-accent-dark hover:underline font-bold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid / List */}
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-border p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                  <SearchIcon className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground">
                  No matching {activeCity?.name || 'Pune'} listings found
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeCity?.id !== 'pune' 
                    ? `${activeCity?.name} is in our upcoming launch expansion phase. You can pre-register or switch to Pune for live booking.`
                    : 'Try adjusting your budget range, clearing locality filters, or searching for other event categories.'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  {activeCity?.id !== 'pune' && (
                    <button
                      onClick={() => setIsCitySelectorOpen(true)}
                      className="px-5 py-2.5 bg-accent text-foreground rounded-xl text-xs font-bold hover:bg-accent transition-colors cursor-pointer"
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

        {/* ROUTE 3.5: VENDOR PACKAGES & MULTI-SERVICE BUNDLES */}
        {activeRoute === 'packages' && <PackagesBrowsePage />}

        {/* ROUTE 4: CUSTOMER DASHBOARD (Requests, Wishlist, Reviews, Profile) */}
        {(activeRoute === 'customer-dashboard' || activeRoute === 'wishlist' || activeRoute === 'requests' || activeRoute === 'profile') && <CustomerDashboard />}

        {/* ROUTE 5: VENDOR DASHBOARD */}
        {activeRoute === 'vendor-dashboard' && <VendorDashboard />}

        {/* ROUTE 6: ADMIN PANEL */}
        {activeRoute === 'admin-panel' && <AdminPanel />}

        {/* ROUTE 7: LEGAL / PRIVACY / TERMS / ABOUT */}
        {activeRoute === 'privacy' && <PrivacyPolicyView />}
        {activeRoute === 'terms' && <TermsOfServiceView />}
        {activeRoute === 'about' && <AboutContactView />}

        {/* ROUTE 8: AUTHENTICATION FULL PAGE */}
        {(activeRoute === 'login' || activeRoute === 'signup') && <AuthModal asPage />}
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

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* Global Footer */}
      <footer className="bg-black text-muted-foreground pt-12 pb-24 sm:pb-12 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-2.5 py-1.5 rounded-xl bg-white flex items-center gap-2 shadow-sm border border-border">
                  <div className="w-8 h-8 rounded-lg bg-[#141C48] flex items-center justify-center text-white text-sm font-black shrink-0" style={{ fontFamily: "'Agrandir Grand', 'Agrandir', sans-serif" }}>
                    <span className="lowercase text-white">c</span>
                    <span className="text-[#FF6565] -ml-0.5 text-[9px] font-black">&bull;</span>
                  </div>
                  <BrandName size="xl" weight="black" />
                </div>
                <button
                  onClick={() => setIsCitySelectorOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-accent hover:bg-accent-subtle text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                  title="Switch city"
                >
                  <span>{activeCity?.name || 'Pune'}</span>
                  <span className="opacity-60 text-[9px]">&bull; Change</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Discover and compare venues, catering, decoration, photography, DJs, and Vedic pandits for weddings, birthdays, and celebrations across {activeCity?.name || 'Pune'}, {activeCity?.state || 'Maharashtra'}.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Support: <a href="mailto:celebratzapp@gmail.com" className="text-accent hover:underline">celebratzapp@gmail.com</a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-muted-foreground">Celebration Services</h4>
              <ul className="space-y-1.5 text-xs">
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: c.id }));
                        setActiveRoute('search');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-accent transition-colors"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Localities */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-muted-foreground">
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
                      className="hover:text-accent transition-colors"
                    >
                      Venues in {loc}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Trust, Design & Legal */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-muted-foreground">Trust & Legal</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => { setActiveRoute('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-accent">
                    About Celebratz & Contact
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveRoute('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-accent">
                    Privacy Policy (Data Consent)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveRoute('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-accent">
                    Terms of Service (Offline Booking)
                  </button>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => setIsDesignSelectorOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-primary-dark text-accent border border-border text-xs font-semibold hover:bg-foreground flex items-center gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Theme & Layout Customizer</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>&copy; 2026 Celebratz India. Crafted for Pune Celebrations.</p>
            <p className="text-[11px] text-muted-foreground">
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
