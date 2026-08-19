import React from 'react';
import { Home, Search, CalendarCheck, Heart, User, Store, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThemeClasses } from '../utils/theme';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    wishlist, 
    enquiries, 
    currentUser, 
    designPrefs 
  } = useApp();

  const theme = getThemeClasses(designPrefs.palette);
  const myPendingRequests = enquiries.filter(e => e.customerId === currentUser.id).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-stone-200 py-1.5 px-2 md:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => setActiveRoute('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeRoute === 'home' 
              ? 'text-teal-950 font-bold' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className={`w-5 h-5 ${activeRoute === 'home' ? 'stroke-[2.5] text-amber-600' : ''}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Search / Explore */}
        <button
          onClick={() => setActiveRoute('search')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeRoute === 'search' 
              ? 'text-teal-950 font-bold' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Search className={`w-5 h-5 ${activeRoute === 'search' ? 'stroke-[2.5] text-amber-600' : ''}`} />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* 3. My Bookings / Enquiries */}
        <button
          onClick={() => {
            if (currentUser.role === 'vendor') setActiveRoute('vendor-dashboard');
            else if (currentUser.role === 'admin') setActiveRoute('admin-panel');
            else setActiveRoute('customer-dashboard');
          }}
          className={`relative flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors ${
            activeRoute === 'customer-dashboard' || activeRoute === 'vendor-dashboard' || activeRoute === 'admin-panel'
              ? 'text-teal-950 font-bold' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          {currentUser.role === 'vendor' ? (
            <Store className={`w-5 h-5 ${activeRoute === 'vendor-dashboard' ? 'stroke-[2.5] text-amber-600' : ''}`} />
          ) : currentUser.role === 'admin' ? (
            <ShieldCheck className={`w-5 h-5 ${activeRoute === 'admin-panel' ? 'stroke-[2.5] text-rose-600' : ''}`} />
          ) : (
            <CalendarCheck className={`w-5 h-5 ${activeRoute === 'customer-dashboard' ? 'stroke-[2.5] text-amber-600' : ''}`} />
          )}
          
          <span className="text-[10px] mt-0.5">
            {currentUser.role === 'vendor' ? 'Leads' : currentUser.role === 'admin' ? 'Admin' : 'Requests'}
          </span>

          {myPendingRequests > 0 && currentUser.role === 'customer' && (
            <span className="absolute top-0.5 right-3 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {myPendingRequests}
            </span>
          )}
        </button>

        {/* 4. Wishlist */}
        <button
          onClick={() => setActiveRoute('customer-dashboard')}
          className="relative flex flex-col items-center justify-center w-14 py-1 rounded-lg text-stone-500 hover:text-stone-900 transition-colors"
        >
          <Heart className="w-5 h-5 text-rose-500" />
          <span className="text-[10px] mt-0.5">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveRoute('customer-dashboard')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeRoute === 'customer-dashboard' 
              ? 'text-teal-950 font-bold' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
