import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Heart, 
  Scale, 
  User as UserIcon, 
  ShieldCheck, 
  Store, 
  Palette, 
  Bell, 
  MapPin, 
  ChevronDown,
  Menu,
  X,
  LogIn,
  LogOut,
  UserPlus,
  Sparkles,
  ListOrdered
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PUNE_LOCALITIES, CATEGORIES } from '../data/categories';
import { BrandName } from './BrandName';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole, 
    openAuthModal,
    logout,
    wishlist, 
    comparisonList, 
    activeRoute, 
    setActiveRoute,
    customerTab,
    navigateToCustomerTab,
    vendorTab,
    navigateToVendorTab,
    setIsDesignSelectorOpen,
    isCitySelectorOpen,
    setIsCitySelectorOpen,
    activeCity,
    designPrefs,
    filters,
    setFilters,
    parsedSearchQuery,
    unreadCount
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBoxRef = React.useRef<HTMLDivElement>(null);

  // Close search popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice for Pune Launch & Quick Role Switcher */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-stone-800 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCitySelectorOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-90 bg-stone-800 hover:bg-stone-700/80 px-2 py-0.5 rounded-md border border-accent/30 transition-colors cursor-pointer"
            title="Switch city or view upcoming Indian cities"
          >
            <MapPin className="w-3 h-3 text-accent shrink-0" />
            <span>{activeCity?.name || 'Pune'}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-500/40">
              Live
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span className="hidden md:inline text-stone-400">
            {activeCity?.id === 'pune' ? 'Verified venues, transparent pricing & calendars' : `Exploring ${activeCity?.name} preview & vendor waitlist`}
          </span>
        </div>

        {/* Interactive Persona / Role Switcher for seamless testing */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsDesignSelectorOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-accent/20 text-accent hover:bg-accent/30 px-2 py-0.5 rounded border border-accent/30 transition-colors cursor-pointer"
            title="Choose Design Theme & Card Layout"
          >
            <Palette className="w-3 h-3" />
            <span className="hidden md:inline">Design Layouts</span>
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-stone-700"
            >
              <div className="w-4 h-4 rounded-full bg-primary text-accent font-bold flex items-center justify-center text-[10px]">
                {currentUser.fullName.charAt(0)}
              </div>
              <span className="font-semibold text-white max-w-[100px] sm:max-w-none truncate">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] uppercase font-bold text-accent hidden sm:inline">
                ({currentUser.role})
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-1.5 z-50 text-stone-800 text-xs animate-fade-in divide-y divide-stone-100">
                {/* User Header */}
                <div className="px-3.5 py-2.5 bg-stone-50">
                  <p className="font-serif font-bold text-stone-900 truncate">{currentUser.fullName}</p>
                  <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                  {currentUser.phoneNumber && (
                    <p className="text-[10px] text-stone-500">{currentUser.phoneNumber}</p>
                  )}
                </div>

                {/* Primary Auth Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-primary-subtle text-primary font-semibold cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-primary" />
                    <span>Sign In (Google / Mobile / Email)</span>
                  </button>

                  <button
                    onClick={() => {
                      openAuthModal('signup');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-accent-subtle text-accent-dark font-semibold cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-accent" />
                    <span>Create New Account</span>
                  </button>
                </div>

                {/* Demo Switch Personas */}
                <div className="py-1">
                  <div className="px-3.5 py-1 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                    Quick Switch Demo Persona
                  </div>
                  <button
                    onClick={() => {
                      switchUserRole('customer');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-stone-50 ${currentUser.role === 'customer' ? 'bg-accent-subtle font-semibold text-primary' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-primary" />
                      <span>Customer (Priya Sharma)</span>
                    </div>
                    {currentUser.role === 'customer' && <span className="text-primary text-xs font-bold">&bull; Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('vendor');
                      setIsRoleDropdownOpen(false);
                      setActiveRoute('vendor-dashboard');
                    }}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-stone-50 ${currentUser.role === 'vendor' ? 'bg-accent-subtle font-semibold text-primary' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-accent" />
                      <span>Vendor (Rajesh Patil)</span>
                    </div>
                    {currentUser.role === 'vendor' && <span className="text-accent text-xs font-bold">&bull; Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('admin');
                      setIsRoleDropdownOpen(false);
                      setActiveRoute('admin-panel');
                    }}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-stone-50 ${currentUser.role === 'admin' ? 'bg-accent-subtle font-semibold text-primary' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-destructive" />
                      <span>Admin (Pradip Sable)</span>
                    </div>
                    {currentUser.role === 'admin' && <span className="text-destructive text-xs font-bold">&bull; Active</span>}
                  </button>
                </div>

                {/* Sign out */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-destructive hover:bg-destructive/10 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & City Selection */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveRoute('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="navbar-brand"
          >
            <div className="w-9 h-9 rounded-xl bg-[#141C48] flex items-center justify-center text-white font-black text-lg shadow-sm border border-[#141C48]/20 group-hover:scale-105 transition-transform shrink-0" style={{ fontFamily: "'Agrandir Grand', 'Agrandir', sans-serif" }}>
              <span className="lowercase text-white">c</span>
              <span className="text-[#FF6565] -ml-0.5 text-xs font-black">&bull;</span>
            </div>
            <BrandName size="2xl" weight="black" showTagline={true} taglineText="A Celebration Marketplace" />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-stone-300 shrink-0" />

          {/* City Selection next to Brand */}
          <button
            onClick={() => setIsCitySelectorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-100/90 hover:bg-accent-subtle/80 text-stone-800 hover:text-primary border border-stone-200/90 hover:border-accent/50 transition-all cursor-pointer text-xs font-semibold shadow-2xs group"
            title="Change City"
          >
            <MapPin className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-bold text-xs text-stone-900 tracking-tight">{activeCity?.name || 'Pune'}</span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300/60 hidden xl:inline">
              Live
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors shrink-0" />
          </button>
        </div>

        {/* Quick Search / Locality pill on Desktop with Smart Keyword & Locality Autocomplete */}
        <div ref={searchBoxRef} className="relative hidden md:flex items-center flex-1 max-w-lg mx-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setIsSearchFocused(false);
              if (activeRoute !== 'search') setActiveRoute('search');
            }}
            className="w-full flex items-center bg-stone-100/90 rounded-full border border-stone-300/80 px-3.5 py-2 text-sm hover:border-stone-400 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder={`Search "${activeCity?.id === 'pune' ? 'Wedding venue in Baner' : 'Venues in ' + (activeCity?.name || 'Pune')}", catering, DJ...`}
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                if (activeRoute !== 'search') setActiveRoute('search');
              }}
              onFocus={() => {
                setIsSearchFocused(true);
                if (activeRoute !== 'search') setActiveRoute('search');
              }}
              className="bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 text-xs sm:text-sm w-full font-medium"
            />
            {filters.searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setFilters(prev => ({ ...prev, searchQuery: '' }));
                }}
                className="text-stone-400 hover:text-stone-600 p-0.5 ml-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Smart Search Suggestions & Intent Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 space-y-3">
              {/* Intent Preview if typed */}
              {filters.searchQuery.trim() && parsedSearchQuery?.isParsed && (
                <div className="p-2.5 bg-accent-subtle rounded-xl border border-accent/40 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-accent-dark tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" />
                    Recognized Search Intent
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {parsedSearchQuery.detectedLocality && (
                      <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground font-bold text-[11px] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-accent" />
                        Locality: {parsedSearchQuery.detectedLocality}
                      </span>
                    )}
                    {parsedSearchQuery.detectedCategory && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-900 text-accent font-bold text-[11px]">
                        🏢 Category: {CATEGORIES.find(c => c.id === parsedSearchQuery.detectedCategory)?.name || parsedSearchQuery.detectedCategory}
                      </span>
                    )}
                    {parsedSearchQuery.detectedEventType && (
                      <span className="px-2 py-0.5 rounded-md bg-destructive text-white font-bold text-[11px]">
                        💍 Celebration: {parsedSearchQuery.detectedEventType}
                      </span>
                    )}
                    {parsedSearchQuery.keywords.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[11px]">
                        Keywords: {parsedSearchQuery.keywords.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Popular Example Searches */}
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
                  Popular Searches in {activeCity?.name || 'Pune'}
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    'Wedding venue in Baner',
                    'Banquet hall in Kothrud',
                    'Wedding photographer in Kalyani Nagar',
                    'Pure veg catering in Hadapsar',
                    'Mandap decoration in Sinhagad Road',
                    'DJ in Baner'
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, searchQuery: phrase }));
                        setIsSearchFocused(false);
                        if (activeRoute !== 'search') setActiveRoute('search');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-primary-subtle hover:text-primary hover:border-primary/40 border border-stone-200 text-stone-700 text-left transition-colors cursor-pointer"
                    >
                      🔍 {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Locality Pills */}
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
                  Filter by Locality in {activeCity?.name || 'Pune'}
                </span>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {(activeCity?.localities?.slice(0, 8) || PUNE_LOCALITIES.slice(0, 8)).map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, searchQuery: `${loc} venues` }));
                        setIsSearchFocused(false);
                        if (activeRoute !== 'search') setActiveRoute('search');
                      }}
                      className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-accent-subtle text-stone-700 hover:text-accent-dark border border-stone-200 transition-colors cursor-pointer"
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button 
            onClick={() => setActiveRoute('search')} 
            className={`hover:text-primary transition-colors ${activeRoute === 'search' ? 'text-primary font-semibold border-b-2 border-accent pb-0.5' : ''}`}
          >
            Explore Vendors
          </button>
          
          <button 
            onClick={() => setActiveRoute('compare')} 
            className={`flex items-center gap-1 hover:text-primary transition-colors ${activeRoute === 'compare' ? 'text-primary font-semibold' : ''}`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare</span>
            {comparisonList.length > 0 && (
              <span className="bg-accent text-accent-foreground text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {comparisonList.length}
              </span>
            )}
          </button>

          {currentUser.role === 'vendor' ? (
            <button 
              onClick={() => navigateToVendorTab('listings')} 
              className={`flex items-center gap-1.5 hover:text-primary transition-colors ${activeRoute === 'vendor-dashboard' && vendorTab === 'listings' ? 'text-primary font-bold border-b-2 border-accent pb-0.5' : ''}`}
            >
              <Store className="w-4 h-4 text-accent" />
              <span>Listings</span>
            </button>
          ) : (
            <button 
              onClick={() => navigateToCustomerTab('wishlist')} 
              className={`flex items-center gap-1 hover:text-primary transition-colors ${activeRoute === 'customer-dashboard' && customerTab === 'wishlist' ? 'text-primary font-bold' : ''}`}
            >
              <Heart className={`w-4 h-4 ${activeRoute === 'customer-dashboard' && customerTab === 'wishlist' ? 'fill-rose-600 text-rose-600' : 'text-rose-600'}`} />
              <span>Wishlist ({wishlist.length})</span>
            </button>
          )}
        </nav>

        {/* Action Controls & Role Portals */}
        <div className="flex items-center gap-2.5">
          {/* Quick Design Switcher Button */}
          <button
            onClick={() => setIsDesignSelectorOpen(true)}
            className="p-2 text-stone-600 hover:text-primary hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            title="Design & Layout Selection"
          >
            <Palette className="w-5 h-5 text-accent" />
          </button>

          {/* Quick Sign In Button */}
          <button
            onClick={() => openAuthModal('login')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-all cursor-pointer shadow-xs"
            title="Sign in with Google, Mobile or Email"
          >
            <LogIn className="w-3.5 h-3.5 text-primary" />
            <span>Sign In</span>
          </button>

          {/* Role-Specific Portal Button */}
          {currentUser.role === 'customer' && (
            <button
              onClick={() => navigateToCustomerTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                activeRoute === 'customer-dashboard' && customerTab === 'profile'
                  ? 'bg-primary text-primary-foreground ring-2 ring-accent'
                  : 'bg-primary text-primary-foreground hover:bg-primary-hover'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Profile</span>
            </button>
          )}

          {currentUser.role === 'vendor' && (
            <button
              onClick={() => navigateToVendorTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                activeRoute === 'vendor-dashboard'
                  ? 'bg-accent-dark text-white ring-2 ring-accent'
                  : 'bg-accent text-accent-foreground hover:bg-accent-dark'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Studio</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveRoute('admin-panel')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-destructive text-white hover:opacity-90 shadow-sm transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-5 space-y-3">
          {/* Mobile Auth Banner */}
          <div className="p-3 bg-primary rounded-2xl text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-accent text-primary font-bold flex items-center justify-center text-sm font-serif">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-accent">{currentUser.fullName}</p>
                <p className="text-[10px] text-stone-300 capitalize">{currentUser.role} Account</p>
              </div>
            </div>
            <button
              onClick={() => {
                openAuthModal('login');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-accent hover:opacity-90 text-primary rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          </div>

          <div className="flex items-center bg-stone-100 rounded-lg p-2">
            <Search className="w-4 h-4 text-stone-400 mr-2" />
            <input
              type="text"
              placeholder="Search Pune venues or services..."
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                setActiveRoute('search');
              }}
              className="bg-transparent text-sm w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-2">
            <button
              onClick={() => { setActiveRoute('home'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800"
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setActiveRoute('search'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800"
            >
              🔍 Browse Listings
            </button>
            <button
              onClick={() => { setActiveRoute('compare'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800 flex items-center justify-between"
            >
              <span>⚖️ Compare</span>
              {comparisonList.length > 0 && (
                <span className="bg-accent text-accent-foreground rounded-full px-1.5 py-0.2 text-[10px]">
                  {comparisonList.length}
                </span>
              )}
            </button>
            {currentUser.role === 'vendor' ? (
              <>
                <button
                  onClick={() => { navigateToVendorTab('listings'); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                >
                  <span>🏪 My Listings</span>
                </button>
                <button
                  onClick={() => { navigateToVendorTab('leads'); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                >
                  <span>📥 Customer Enquiries</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigateToCustomerTab('profile'); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                >
                  <span>👤 My Profile</span>
                </button>
                <button
                  onClick={() => { navigateToCustomerTab('wishlist'); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                >
                  <span>❤️ Saved Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="bg-rose-600 text-white rounded-full px-1.5 py-0.2 text-[10px]">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-accent-subtle hover:bg-accent-subtle/80 text-accent-dark font-bold border border-accent/40"
            >
              ✨ Register Vendor
            </button>
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-600">
            <button 
              onClick={() => { setActiveRoute('about'); setIsMobileMenuOpen(false); }}
              className="hover:underline"
            >
              About Celebratz
            </button>
            <button 
              onClick={() => { setActiveRoute('contact'); setIsMobileMenuOpen(false); }}
              className="hover:underline"
            >
              Support (celebratzapp@gmail.com)
            </button>
            <button 
              onClick={() => { setIsDesignSelectorOpen(true); setIsMobileMenuOpen(false); }}
              className="text-accent font-semibold"
            >
              🎨 Theme & Layout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
