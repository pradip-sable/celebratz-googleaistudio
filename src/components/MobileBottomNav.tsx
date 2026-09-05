import React from 'react';
import { Home, Search, CalendarCheck, Heart, User, Store, ShieldCheck, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    customerTab,
    navigateToCustomerTab,
    vendorTab,
    navigateToVendorTab,
    wishlist, 
    enquiries, 
    currentUser, 
    designPrefs 
  } = useApp();

  const myPendingRequests = enquiries.filter(e => e.customerId === currentUser.id).length;
  const vendorPendingLeads = enquiries.filter(e => (e.vendorId === currentUser.id || currentUser.role === 'admin' || e.vendorId === 'user_vendor_1') && e.vendorStatus === 'pending').length;

  const isRequestsActive = 
    (currentUser.role === 'vendor' && activeRoute === 'vendor-dashboard' && vendorTab === 'leads') ||
    (currentUser.role === 'admin' && activeRoute === 'admin-panel') ||
    (currentUser.role === 'customer' && activeRoute === 'customer-dashboard' && customerTab === 'requests');

  const isWishlistActive = activeRoute === 'customer-dashboard' && customerTab === 'wishlist';
  const isVendorListingsActive = currentUser.role === 'vendor' && activeRoute === 'vendor-dashboard' && vendorTab === 'listings';
  const isProfileActive = 
    (currentUser.role === 'customer' && activeRoute === 'customer-dashboard' && customerTab === 'profile') ||
    (currentUser.role === 'vendor' && activeRoute === 'vendor-dashboard' && vendorTab === 'overview');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-border py-1.5 px-2 md:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => setActiveRoute('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeRoute === 'home' 
              ? 'text-primary font-bold' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className={`w-5 h-5 ${activeRoute === 'home' ? 'stroke-[2.5] text-accent' : ''}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Search / Explore */}
        <button
          onClick={() => setActiveRoute('search')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeRoute === 'search' 
              ? 'text-primary font-bold' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Search className={`w-5 h-5 ${activeRoute === 'search' ? 'stroke-[2.5] text-accent' : ''}`} />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* 3. My Bookings / Enquiries / Leads */}
        <button
          onClick={() => {
            if (currentUser.role === 'vendor') navigateToVendorTab('leads');
            else if (currentUser.role === 'admin') setActiveRoute('admin-panel');
            else navigateToCustomerTab('requests');
          }}
          className={`relative flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors ${
            isRequestsActive
              ? 'text-primary font-bold' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {currentUser.role === 'vendor' ? (
            <CalendarCheck className={`w-5 h-5 ${isRequestsActive ? 'stroke-[2.5] text-accent' : ''}`} />
          ) : currentUser.role === 'admin' ? (
            <ShieldCheck className={`w-5 h-5 ${activeRoute === 'admin-panel' ? 'stroke-[2.5] text-rose' : ''}`} />
          ) : (
            <CalendarCheck className={`w-5 h-5 ${isRequestsActive ? 'stroke-[2.5] text-accent' : ''}`} />
          )}
          
          <span className="text-[10px] mt-0.5">
            {currentUser.role === 'vendor' ? 'Enquiries' : currentUser.role === 'admin' ? 'Admin' : 'Requests'}
          </span>

          {myPendingRequests > 0 && currentUser.role === 'customer' && (
            <span className="absolute top-0.5 right-3 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
              {myPendingRequests}
            </span>
          )}

          {vendorPendingLeads > 0 && currentUser.role === 'vendor' && (
            <span className="absolute top-0.5 right-3 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
              {vendorPendingLeads}
            </span>
          )}
        </button>

        {/* 4. Tab 4: Listings for Vendor / Wishlist for Customer */}
        {currentUser.role === 'vendor' ? (
          <button
            onClick={() => navigateToVendorTab('listings')}
            className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
              isVendorListingsActive
                ? 'text-secondary font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Store className={`w-5 h-5 ${isVendorListingsActive ? 'stroke-[2.5] text-accent' : 'text-accent'}`} />
            <span className="text-[10px] mt-0.5">Listings</span>
          </button>
        ) : (
          <button
            onClick={() => navigateToCustomerTab('wishlist')}
            className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
              isWishlistActive
                ? 'text-rose font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlistActive ? 'stroke-[2.5] fill-rose text-rose' : 'text-rose'}`} />
            <span className="text-[10px] mt-0.5">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-2 w-4 h-4 bg-rose text-rose-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
        )}

        {/* 5. Profile / Overview */}
        <button
          onClick={() => {
            if (currentUser.role === 'vendor') navigateToVendorTab('overview');
            else navigateToCustomerTab('profile');
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            isProfileActive 
              ? 'text-primary font-bold' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {currentUser.role === 'vendor' ? (
            <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5] text-accent' : ''}`} />
          ) : (
            <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5] text-accent' : ''}`} />
          )}
          <span className="text-[10px] mt-0.5">
            {currentUser.role === 'vendor' ? 'Overview' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};
