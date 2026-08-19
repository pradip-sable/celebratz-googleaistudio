import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Sparkles, 
  Building2, 
  Users, 
  Inbox, 
  Star,
  MapPin,
  Clock,
  Layers,
  Globe2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { CITIES, getCityById } from '../data/cities';
import { formatIndianCurrency } from '../utils/theme';

export const AdminPanel: React.FC = () => {
  const { 
    listings, 
    approveListing, 
    rejectListing, 
    toggleFeatured, 
    enquiries, 
    reviews, 
    moderateReview,
    setSelectedListingId,
    activeCity 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'all_listings' | 'leads' | 'categories' | 'cities' | 'reviews'>('approvals');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');

  const pendingListings = listings.filter(l => l.status === 'pending_approval');
  const filteredDirectoryListings = listings.filter(l => {
    if (selectedCityFilter === 'all') return true;
    return (l.city || 'pune') === selectedCityFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 text-left">
      {/* Admin Header */}
      <div className="bg-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white">
              Platform Admin Console
            </span>
            <span className="text-xs text-rose-300">&bull; Pune Hub & Pan-India Expansion</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-50">
            Celebratz Operations & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-rose-200 font-light mt-1">
            Approve new venue listings, manage categories, monitor city rollout roadmaps, and audit verified reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-900/80 px-4 py-2 rounded-2xl border border-rose-800 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span className="font-bold">{pendingListings.length} Listings Awaiting Approval</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'approvals' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          ⏳ Approval Queue ({pendingListings.length})
        </button>
        <button
          onClick={() => setActiveTab('all_listings')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all_listings' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🏢 All Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'cities' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🌐 India Expansion ({CITIES.length} Cities)
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'leads' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          📬 Leads Log ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'reviews' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          ⭐ Verified Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'categories' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🗂️ Categories ({CATEGORIES.length})
        </button>
      </div>

      {/* 1. APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-stone-900">Vendor Listings Pending Approval</h2>
            <span className="text-xs text-stone-500">Every listing must be verified for plausible Pune pricing & valid contacts</span>
          </div>

          {pendingListings.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-stone-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-stone-900">Queue Clean!</h3>
              <p className="text-xs text-stone-500">All vendor submissions have been reviewed and approved.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map(listing => (
                <div key={listing.id} className="bg-white rounded-2xl border border-amber-300 p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex gap-3">
                    <img
                      src={listing.coverImage}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-900">
                          {listing.category}
                        </span>
                        <span className="text-xs text-stone-500">&bull; {listing.locality}, Pune</span>
                      </div>
                      <h4 className="font-bold text-base text-stone-900">{listing.title}</h4>
                      <p className="text-xs text-stone-600">
                        Vendor: <span className="font-semibold text-stone-800">{listing.vendorName}</span> ({listing.vendorPhone}) &bull; {formatIndianCurrency(listing.startingPrice)}/{(listing.pricingUnit || 'event').replace('per_', '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedListingId(listing.id)}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                    >
                      Audit Details
                    </button>
                    <button
                      onClick={() => rejectListing(listing.id)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveListing(listing.id)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Live</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. ALL LISTINGS DIRECTORY */}
      {activeTab === 'all_listings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Platform Listings Directory ({filteredDirectoryListings.length})
            </h2>
            
            {/* City Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-stone-600">Filter by City:</label>
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-900 outline-hidden"
              >
                <option value="all">All Cities ({listings.length})</option>
                {CITIES.map(c => {
                  const count = listings.filter(l => (l.city || 'pune') === c.id).length;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDirectoryListings.map(l => {
              const cityInfo = getCityById(l.city || 'pune');
              return (
                <div key={l.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-3 shadow-xs">
                  <img src={l.coverImage} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-stone-500">{l.category}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-stone-100 text-stone-700">
                          {cityInfo?.name || 'Pune'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        l.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 truncate">{l.title}</h4>
                    <p className="text-xs text-stone-500">{l.locality} &bull; {formatIndianCurrency(l.startingPrice)}</p>

                    <div className="pt-2 flex items-center gap-2 text-xs">
                      <button
                        onClick={() => toggleFeatured(l.id)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${l.isFeatured ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'}`}
                      >
                        {l.isFeatured ? '★ Featured on Home' : 'Set as Featured'}
                      </button>
                      <button
                        onClick={() => setSelectedListingId(l.id)}
                        className="text-teal-900 font-semibold hover:underline cursor-pointer"
                      >
                        View Live
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. INDIA EXPANSION ROADMAP */}
      {activeTab === 'cities' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-teal-800" />
                India Celebration Hubs Expansion Roadmap
              </h2>
              <p className="text-xs text-stone-500">
                Phase 1 is currently anchored in Pune with prepared schema and locality presets for high-demand metros and celebration capitals.
              </p>
            </div>
            <span className="px-3 py-1 bg-teal-100 text-teal-900 rounded-full text-xs font-bold">
              1 Live &bull; {CITIES.length - 1} Pre-Configured Expansion Cities
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CITIES.map(city => {
              const count = listings.filter(l => (l.city || 'pune') === city.id).length;
              return (
                <div 
                  key={city.id} 
                  className={`bg-white rounded-2xl border p-5 space-y-3 shadow-xs ${
                    city.status === 'active' ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-1.5">
                        <span>{city.name}</span>
                        <span className="text-xs font-normal text-stone-500">({city.state})</span>
                      </h3>
                      <span className="text-[11px] text-stone-400">{city.tagline}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      city.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {city.status === 'active' ? 'Live Launch' : 'Expansion Waitlist'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pre-configured Localities:</span>
                      <span className="font-bold text-stone-800">{city.localities.length} zones</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Registered Listings:</span>
                      <span className="font-bold text-teal-900">{count} listings</span>
                    </div>
                    {city.waitlistCount && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Customer Pre-Registrations:</span>
                        <span className="font-bold text-amber-700">{city.waitlistCount.toLocaleString()} planners</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Key Hubs
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {city.popularHubs.slice(0, 4).map(hub => (
                        <span key={hub} className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] text-stone-700 font-medium">
                          {hub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. GLOBAL LEADS SUPER-LOG */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Supervised Lead Flow ({enquiries.length})</h2>
          <div className="space-y-2">
            {enquiries.map(e => (
              <div key={e.id} className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <span className="font-bold text-stone-900">{e.customerName}</span> &bull; {e.customerPhone} &rarr; <span className="font-bold text-teal-950">{e.listingTitle}</span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {e.eventType} on {e.eventDate} &bull; Received {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                  e.vendorStatus === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {e.vendorStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VERIFIED REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Verified Reviews Moderation ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex justify-between items-start text-xs">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                    <span className="font-bold text-stone-800 ml-1">{r.title}</span>
                  </div>
                  <p className="text-stone-600">"{r.reviewText}"</p>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    By {r.customerName} &bull; Celebrated {r.eventType} ({r.eventDate})
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold uppercase">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SERVICE CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Phase 1 Service Categories</h2>
          <p className="text-xs text-stone-500">Structured data models allow adding more categories without rebuilding schema.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map(c => (
              <div key={c.id} className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
                <div className="font-bold text-sm text-stone-900">{c.name}</div>
                <p className="text-xs text-stone-500">{c.shortDescription}</p>
                <span className="text-[10px] font-bold text-teal-800 block pt-1">
                  Pricing unit: {c.defaultPricingUnit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
