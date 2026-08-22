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
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PUNE_LOCALITIES } from '../data/categories';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole, 
    wishlist, 
    comparisonList, 
    activeRoute, 
    setActiveRoute,
    setIsDesignSelectorOpen,
    isCitySelectorOpen,
    setIsCitySelectorOpen,
    activeCity,
    designPrefs,
    filters,
    setFilters,
    unreadCount
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice for Pune Launch & Quick Role Switcher */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-stone-800 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCitySelectorOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-stone-800 hover:bg-stone-700/80 px-2 py-0.5 rounded-md border border-amber-500/30 transition-colors cursor-pointer"
            title="Switch city or view upcoming Indian cities"
          >
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
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
            className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded border border-amber-500/30 transition-colors"
            title="Choose Design Theme & Card Layout"
          >
            <Palette className="w-3 h-3" />
            <span className="hidden md:inline">Design Layouts</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-2 py-0.5 rounded transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="capitalize font-medium">Role: {currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-stone-200 py-1 z-50 text-stone-800 text-xs">
                <div className="px-3 py-1.5 font-semibold text-stone-500 border-b border-stone-100 uppercase tracking-wider text-[10px]">
                  Switch Role Persona
                </div>
                <button
                  onClick={() => {
                    switchUserRole('customer');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${currentUser.role === 'customer' ? 'bg-amber-50 font-semibold text-teal-950' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-teal-700" />
                    <span>Customer (Priya)</span>
                  </div>
                  {currentUser.role === 'customer' && <span className="text-teal-700 text-xs">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchUserRole('vendor');
                    setIsRoleDropdownOpen(false);
                    setActiveRoute('vendor-dashboard');
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${currentUser.role === 'vendor' ? 'bg-amber-50 font-semibold text-teal-950' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    <span>Vendor (Rajesh Patil)</span>
                  </div>
                  {currentUser.role === 'vendor' && <span className="text-amber-700 text-xs">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchUserRole('admin');
                    setIsRoleDropdownOpen(false);
                    setActiveRoute('admin-panel');
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${currentUser.role === 'admin' ? 'bg-amber-50 font-semibold text-teal-950' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
                    <span>Admin (Pradip Sable)</span>
                  </div>
                  {currentUser.role === 'admin' && <span className="text-rose-700 text-xs">Active</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveRoute('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-950 flex items-center justify-center text-amber-300 font-bold text-lg shadow-sm border border-amber-400/30 group-hover:scale-105 transition-transform">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-teal-950 tracking-tight font-serif">Celebratz</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCitySelectorOpen(true);
                }}
                className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80 flex items-center gap-0.5 transition-colors cursor-pointer"
                title="Change city"
              >
                <span>{activeCity?.name || 'Pune'}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>
            </div>
            <p className="text-[10px] text-stone-500 hidden sm:block">Venues & Services Discovery</p>
          </div>
        </div>

        {/* Quick Search / Locality pill on Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="w-full flex items-center bg-stone-100/90 rounded-full border border-stone-300/80 px-3 py-1.5 text-sm hover:border-stone-400 focus-within:border-teal-700 focus-within:bg-white transition-all shadow-inner">
            <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search Baner lawns, Kalyani Nagar photo, catering..."
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                if (activeRoute !== 'search') setActiveRoute('search');
              }}
              onFocus={() => {
                if (activeRoute !== 'search') setActiveRoute('search');
              }}
              className="bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 text-xs sm:text-sm w-full"
            />
            {filters.searchQuery && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button 
            onClick={() => setActiveRoute('search')} 
            className={`hover:text-teal-900 transition-colors ${activeRoute === 'search' ? 'text-teal-900 font-semibold border-b-2 border-amber-500 pb-0.5' : ''}`}
          >
            Explore Vendors
          </button>
          
          <button 
            onClick={() => setActiveRoute('compare')} 
            className={`flex items-center gap-1 hover:text-teal-900 transition-colors ${activeRoute === 'compare' ? 'text-teal-900 font-semibold' : ''}`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare</span>
            {comparisonList.length > 0 && (
              <span className="bg-amber-500 text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {comparisonList.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveRoute('customer-dashboard')} 
            className={`flex items-center gap-1 hover:text-teal-900 transition-colors ${activeRoute === 'customer-dashboard' ? 'text-teal-900 font-semibold' : ''}`}
          >
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </nav>

        {/* Action Controls & Role Portals */}
        <div className="flex items-center gap-3">
          {/* Quick Design Switcher Button */}
          <button
            onClick={() => setIsDesignSelectorOpen(true)}
            className="p-2 text-stone-600 hover:text-teal-950 hover:bg-stone-100 rounded-full transition-colors"
            title="Design & Layout Selection"
          >
            <Palette className="w-5 h-5 text-amber-700" />
          </button>

          {/* Role-Specific Portal Button */}
          {currentUser.role === 'customer' && (
            <button
              onClick={() => setActiveRoute('customer-dashboard')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Requests</span>
            </button>
          )}

          {currentUser.role === 'vendor' && (
            <button
              onClick={() => setActiveRoute('vendor-dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Studio</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveRoute('admin-panel')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-900 text-white hover:bg-rose-950 shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-5 space-y-3">
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
                <span className="bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[10px]">
                  {comparisonList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveRoute('customer-dashboard'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-stone-50 hover:bg-stone-100 text-stone-800"
            >
              ❤️ Wishlist & Requests
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
              className="text-amber-700 font-semibold"
            >
              🎨 Theme & Layout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
