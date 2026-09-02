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
  Globe2,
  Package,
  ArrowRight,
  AlertTriangle,
  Tag,
  Check,
  Filter,
  Trash2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { CITIES, getCityById } from '../data/cities';
import { formatIndianCurrency } from '../utils/theme';
import { BrandName } from './BrandName';
import { ComboPackage, Listing, PricingPackage } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    listings, 
    approveListing, 
    rejectListing, 
    approveListingTier,
    rejectListingTier,
    toggleFeatured, 
    comboPackages,
    approveComboPackage,
    rejectComboPackage,
    deleteComboPackage,
    updateComboPackage,
    setSelectedComboPackage,
    setIsComboModalOpen,
    enquiries, 
    reviews, 
    moderateReview,
    setSelectedListingId,
    activeCity 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'packages' | 'all_listings' | 'leads' | 'categories' | 'cities' | 'reviews'>('approvals');
  const [approvalSubTab, setApprovalSubTab] = useState<'all' | 'combos' | 'tiers' | 'listings'>('all');
  const [packageStatusFilter, setPackageStatusFilter] = useState<'all' | 'active' | 'pending_approval' | 'paused' | 'rejected'>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');

  // Rejection modal state
  const [rejectModalData, setRejectModalData] = useState<{
    isOpen: boolean;
    type: 'listing' | 'combo' | 'tier';
    id: string;
    parentListingId?: string;
    title: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Pending counts
  const pendingListings = listings.filter(l => l.status === 'pending_approval');
  const pendingCombos = comboPackages.filter(p => p.status === 'pending_approval');
  
  // Collect all pending tiers across all listings
  const listingsWithPendingTiers = listings.filter(l => 
    l.pricingPackages && l.pricingPackages.some(pkg => pkg.status === 'pending_approval')
  );
  const pendingTiersTotalCount = listings.reduce((acc, l) => {
    return acc + (l.pricingPackages?.filter(p => p.status === 'pending_approval').length || 0);
  }, 0);

  const totalPendingQueueCount = pendingListings.length + pendingCombos.length + pendingTiersTotalCount;

  // Filtered lists
  const filteredDirectoryListings = listings.filter(l => {
    if (selectedCityFilter === 'all') return true;
    return (l.city || 'pune') === selectedCityFilter;
  });

  const filteredComboPackages = comboPackages.filter(pkg => {
    if (packageStatusFilter === 'all') return true;
    return pkg.status === packageStatusFilter;
  });

  const handleOpenRejectModal = (type: 'listing' | 'combo' | 'tier', id: string, title: string, parentListingId?: string) => {
    setRejectModalData({
      isOpen: true,
      type,
      id,
      parentListingId,
      title
    });
    setRejectionReason('');
  };

  const handleConfirmRejection = () => {
    if (!rejectModalData) return;
    const reason = rejectionReason.trim() || 'Submission does not meet quality and verification standards.';

    if (rejectModalData.type === 'listing') {
      rejectListing(rejectModalData.id, reason);
    } else if (rejectModalData.type === 'combo') {
      rejectComboPackage(rejectModalData.id, reason);
    } else if (rejectModalData.type === 'tier' && rejectModalData.parentListingId) {
      rejectListingTier(rejectModalData.parentListingId, rejectModalData.id, reason);
    }

    setRejectModalData(null);
    setRejectionReason('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 text-left">
      {/* Admin Header */}
      <div className="bg-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white">
              Platform Admin Console
            </span>
            <span className="text-xs text-rose-300">&bull; Pune Operations & Pan-India Expansion</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-50 flex items-center gap-2 flex-wrap">
            <span className="bg-white px-2.5 py-1.5 rounded-xl inline-flex items-center gap-2 shadow-xs">
              <span className="w-8 h-8 rounded-lg bg-[#141C48] flex items-center justify-center text-white text-sm font-black shrink-0" style={{ fontFamily: "'Agrandir Grand', 'Agrandir', sans-serif" }}>
                <span className="lowercase text-white">c</span>
                <span className="text-[#FF6565] -ml-0.5 text-[9px] font-black">&bull;</span>
              </span>
              <BrandName size="xl" weight="black" />
            </span>
            <span>Operations & Moderation</span>
          </h1>
          <p className="text-xs sm:text-sm text-rose-200 font-light mt-1">
            Moderate multi-service packages, approve vendor pricing tiers, inspect new listings, and audit verified marketplace transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-900/90 px-4 py-2.5 rounded-2xl border border-rose-800 text-xs shadow-inner">
            <span className={`w-2.5 h-2.5 rounded-full ${totalPendingQueueCount > 0 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="font-bold">
              {totalPendingQueueCount === 0 
                ? 'Queue Clear' 
                : `${totalPendingQueueCount} Items Awaiting Review`}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'approvals' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>⏳ Approval Queue</span>
          {totalPendingQueueCount > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-stone-950">
              {totalPendingQueueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'packages' ? 'bg-white text-rose-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-600" />
          <span>Packages Directory ({comboPackages.length})</span>
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

      {/* 1. APPROVAL QUEUE TAB */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Sub-navigation Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Moderation & Quality Assurance Queue
              </h2>
              <p className="text-xs text-stone-500">
                Combined packages and service pricing tiers require admin approval before becoming visible to customers.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setApprovalSubTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  approvalSubTab === 'all' ? 'bg-rose-950 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Pending ({totalPendingQueueCount})
              </button>
              <button
                onClick={() => setApprovalSubTab('combos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                  approvalSubTab === 'combos' ? 'bg-rose-950 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-amber-500" />
                <span>Combos ({pendingCombos.length})</span>
              </button>
              <button
                onClick={() => setApprovalSubTab('tiers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                  approvalSubTab === 'tiers' ? 'bg-rose-950 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Listing Tiers ({pendingTiersTotalCount})</span>
              </button>
              <button
                onClick={() => setApprovalSubTab('listings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                  approvalSubTab === 'listings' ? 'bg-rose-950 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-rose-600" />
                <span>New Listings ({pendingListings.length})</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {totalPendingQueueCount === 0 && (
            <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">All Queues Cleared!</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                There are no pending combo packages, pricing tiers, or vendor listings awaiting moderation right now.
              </p>
            </div>
          )}

          {/* SECTION A: PENDING COMBO PACKAGES */}
          {(approvalSubTab === 'all' || approvalSubTab === 'combos') && pendingCombos.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Combined Multi-Service Bundles ({pendingCombos.length})
                  </h3>
                </div>
                <span className="text-xs text-stone-500">Verify service synergy, discount calculation & inclusions</span>
              </div>

              <div className="space-y-4">
                {pendingCombos.map(pkg => (
                  <div 
                    key={pkg.id} 
                    className="bg-white rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm space-y-5"
                  >
                    <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                      {/* Left: Bundle info */}
                      <div className="flex gap-4 min-w-0">
                        <img
                          src={pkg.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'}
                          alt={pkg.title}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                              ⏳ Pending Package Review
                            </span>
                            {pkg.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 text-white">
                                {pkg.badge}
                              </span>
                            )}
                            <span className="text-xs text-stone-500">
                              &bull; {pkg.locality || 'Pune'} &bull; Max {pkg.guestCapacity} Guests
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-lg text-stone-900">{pkg.title}</h4>
                          
                          <p className="text-xs text-stone-600 line-clamp-2">
                            {pkg.description}
                          </p>

                          <div className="text-xs text-stone-600">
                            Vendor: <span className="font-bold text-stone-900">{pkg.vendorName}</span> ({pkg.vendorPhone} &bull; {pkg.vendorEmail})
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing calculation card */}
                      <div className="w-full md:w-64 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 shrink-0">
                        <div className="flex justify-between items-center text-xs text-stone-500">
                          <span>Original Sum:</span>
                          <span className="line-through">{formatIndianCurrency(pkg.totalOriginalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-stone-700">Combo Price:</span>
                          <span className="font-serif font-extrabold text-lg text-teal-950">
                            {formatIndianCurrency(pkg.comboPrice)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs font-bold text-emerald-700">
                          <span>Customer Savings:</span>
                          <span>{formatIndianCurrency(pkg.savingsAmount)} ({pkg.savingsPercentage}% OFF)</span>
                        </div>
                      </div>
                    </div>

                    {/* Component listings breakdown */}
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
                        Included Component Services ({pkg.includedServices?.length || pkg.includedListingIds?.length || 0}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {pkg.includedServices?.map((service, sIdx) => (
                          <div key={service.listingId ? `${pkg.id}_${service.listingId}_${sIdx}` : `srv_${pkg.id}_${sIdx}`} className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs space-y-1 shadow-2xs">
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-bold text-stone-900 line-clamp-1">{service.listingTitle}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700 shrink-0">
                                {service.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Standalone Price: <span className="font-semibold text-stone-800">{formatIndianCurrency(service.originalPrice)}</span>
                            </div>
                            {service.inclusions && service.inclusions.length > 0 && (
                              <p className="text-[10px] text-stone-600 italic line-clamp-1">
                                Inclusions: {service.inclusions.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-stone-200 flex flex-wrap justify-between items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedComboPackage(pkg);
                          setIsComboModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit Customer Preview</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenRejectModal('combo', pkg.id, pkg.title)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject with Reason</span>
                        </button>

                        <button
                          onClick={() => approveComboPackage(pkg.id)}
                          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Make Live</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: PENDING INTRA-LISTING TIERS */}
          {(approvalSubTab === 'all' || approvalSubTab === 'tiers') && listingsWithPendingTiers.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Listing Service Package Tiers ({pendingTiersTotalCount} tiers across {listingsWithPendingTiers.length} listings)
                  </h3>
                </div>
                <span className="text-xs text-stone-500">Auditing vendor-created packages inside single listings</span>
              </div>

              <div className="space-y-4">
                {listingsWithPendingTiers.map(listing => {
                  const pendingTiers = (listing.pricingPackages || []).filter(p => p.status === 'pending_approval');
                  if (pendingTiers.length === 0) return null;

                  return (
                    <div 
                      key={listing.id} 
                      className="bg-white rounded-3xl border-2 border-teal-300 p-5 sm:p-6 shadow-sm space-y-4"
                    >
                      {/* Parent Listing Summary Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.coverImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700">
                                {listing.category}
                              </span>
                              <span className="text-xs text-stone-500">&bull; {listing.locality}, Pune</span>
                            </div>
                            <h4 className="font-bold text-base text-stone-900">{listing.title}</h4>
                            <p className="text-xs text-stone-500">
                              Vendor: <span className="font-semibold text-stone-800">{listing.vendorName}</span> ({listing.vendorPhone})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedListingId(listing.id)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                          >
                            View Listing
                          </button>
                          <button
                            onClick={() => approveListingTier(listing.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                          >
                            Approve All Tiers
                          </button>
                        </div>
                      </div>

                      {/* Tiers List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {pendingTiers.map((tier, tIdx) => (
                          <div 
                            key={tier.id || tIdx} 
                            className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-200 text-amber-950 inline-block mb-1">
                                    ⏳ Tier Pending Review
                                  </span>
                                  <h5 className="font-bold text-sm text-stone-900">{tier.name}</h5>
                                </div>
                                <div className="text-right">
                                  <span className="font-serif font-extrabold text-base text-teal-950 block">
                                    {formatIndianCurrency(tier.price)}
                                  </span>
                                  <span className="text-[10px] text-stone-500">
                                    /{(tier.pricingUnit || listing.pricingUnit || 'event').replace('per_', '')}
                                  </span>
                                </div>
                              </div>

                              {tier.description && (
                                <p className="text-xs text-stone-600">{tier.description}</p>
                              )}

                              {tier.features && tier.features.length > 0 && (
                                <div className="space-y-1 pt-2 border-t border-teal-100">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                    Inclusions:
                                  </span>
                                  <ul className="space-y-1 text-xs text-stone-700">
                                    {tier.features.map((feat, fIdx) => (
                                      <li key={`${tier.id || tier.name || 't'}_f_${fIdx}_${feat}`} className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                                        <span>{feat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="pt-3 border-t border-teal-200/60 flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenRejectModal('tier', tier.id || `${tIdx}`, tier.name, listing.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer"
                              >
                                Reject Tier
                              </button>
                              <button
                                onClick={() => approveListingTier(listing.id, tier.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Tier</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION C: PENDING NEW LISTINGS */}
          {(approvalSubTab === 'all' || approvalSubTab === 'listings') && pendingListings.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    New Vendor Listings ({pendingListings.length})
                  </h3>
                </div>
                <span className="text-xs text-stone-500">Verify venue capacity, pricing and contact numbers</span>
              </div>

              <div className="space-y-4">
                {pendingListings.map(listing => (
                  <div 
                    key={listing.id} 
                    className="bg-white rounded-3xl border border-amber-300 p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                  >
                    <div className="flex gap-4">
                      <img
                        src={listing.coverImage}
                        alt=""
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-900">
                            {listing.category}
                          </span>
                          <span className="text-xs text-stone-500">&bull; {listing.locality}, Pune</span>
                          {listing.pricingPackages && listing.pricingPackages.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-900">
                              {listing.pricingPackages.length} Package Tiers Attached
                            </span>
                          )}
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
                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Audit Details
                      </button>
                      <button
                        onClick={() => handleOpenRejectModal('listing', listing.id, listing.title)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveListing(listing.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PACKAGES DIRECTORY TAB */}
      {activeTab === 'packages' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Combined Multi-Service Packages Directory ({filteredComboPackages.length})
              </h2>
              <p className="text-xs text-stone-500">
                All multi-vendor bundles created across Pune celebrations. Manage statuses, verify savings, and audit reviews.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-stone-600">Filter Status:</label>
              <select
                value={packageStatusFilter}
                onChange={(e) => setPackageStatusFilter(e.target.value as any)}
                className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-900 outline-hidden"
              >
                <option value="all">All Statuses ({comboPackages.length})</option>
                <option value="active">Live & Active ({comboPackages.filter(p => p.status === 'active').length})</option>
                <option value="pending_approval">Pending Approval ({comboPackages.filter(p => p.status === 'pending_approval').length})</option>
                <option value="paused">Paused ({comboPackages.filter(p => p.status === 'paused').length})</option>
                <option value="rejected">Rejected ({comboPackages.filter(p => p.status === 'rejected').length})</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComboPackages.map(pkg => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-3.5 items-start">
                    <img
                      src={pkg.coverImage}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          pkg.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : pkg.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : pkg.status === 'rejected'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-stone-200 text-stone-700'
                        }`}>
                          {pkg.status}
                        </span>

                        <span className="font-serif font-extrabold text-base text-teal-950">
                          {formatIndianCurrency(pkg.comboPrice)}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-stone-900 line-clamp-1">{pkg.title}</h4>
                      <p className="text-xs text-stone-500">
                        {pkg.vendorName} &bull; {pkg.locality || 'Pune'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2">{pkg.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                    {pkg.includedServices?.map((s, idx) => (
                      <span key={s.listingId ? `${pkg.id}_${s.listingId}_${idx}` : `srv_${pkg.id}_${idx}`} className="px-2 py-0.5 rounded-lg bg-stone-100 text-[10px] font-medium text-stone-700">
                        {s.category}: {s.listingTitle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedComboPackage(pkg);
                      setIsComboModalOpen(true);
                    }}
                    className="text-xs font-bold text-teal-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Preview Modal</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    {pkg.status === 'pending_approval' && (
                      <button
                        onClick={() => approveComboPackage(pkg.id)}
                        className="px-3 py-1 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Approve Live
                      </button>
                    )}

                    {pkg.status === 'active' && (
                      <button
                        onClick={() => updateComboPackage(pkg.id, { status: 'paused' })}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Pause
                      </button>
                    )}

                    {pkg.status === 'paused' && (
                      <button
                        onClick={() => updateComboPackage(pkg.id, { status: 'active' })}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Resume
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete combo "${pkg.title}" permanently?`)) {
                          deleteComboPackage(pkg.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete Combo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ALL LISTINGS DIRECTORY */}
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

      {/* 4. INDIA EXPANSION ROADMAP */}
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
                      {city.popularHubs.slice(0, 4).map((hub, hIdx) => (
                        <span key={`${city.id}_${hub}_${hIdx}`} className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] text-stone-700 font-medium">
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

      {/* 5. GLOBAL LEADS SUPER-LOG */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Supervised Lead Flow ({enquiries.length})</h2>
          <div className="space-y-2">
            {enquiries.map(e => (
              <div key={e.id} className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900">{e.customerName}</span> &bull; {e.customerPhone} &rarr; <span className="font-bold text-teal-950">{e.listingTitle}</span>
                    {(e.comboPackageTitle || e.selectedPackageName) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Package className="w-3 h-3 text-amber-700" />
                        <span>{e.comboPackageTitle || e.selectedPackageName}</span>
                        {e.selectedPackagePrice && (
                          <span className="text-teal-950 font-serif font-extrabold ml-0.5">
                            ({formatIndianCurrency(e.selectedPackagePrice)})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {e.eventType} on {e.eventDate} &bull; Received {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                  e.vendorStatus === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 
                  e.vendorStatus === 'declined' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {e.vendorStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VERIFIED REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Verified Reviews Moderation ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex justify-between items-start text-xs">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={`star_${r.id}_${i}`} className="w-3.5 h-3.5 fill-amber-500" />
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

      {/* 7. SERVICE CATEGORIES */}
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

      {/* REJECTION REASON DIALOG MODAL */}
      {rejectModalData?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Reject {rejectModalData.type === 'combo' ? 'Combined Package' : rejectModalData.type === 'tier' ? 'Pricing Tier' : 'Listing'}
              </h3>
            </div>

            <p className="text-xs text-stone-600">
              Please provide feedback for <span className="font-bold text-stone-900">"{rejectModalData.title}"</span>. The vendor will receive this note to fix and resubmit.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Feedback / Reason for Rejection:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Inaccurate pricing calculation, incomplete package inclusions, or phone number unverified."
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-stone-400 block w-full">Quick Preset Reasons:</span>
              {[
                'Missing component breakdown',
                'Discount calculation disparity',
                'Incomplete feature bullets',
                'Unverified vendor contacts'
              ].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRejectionReason(preset)}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-[10px] text-stone-700 rounded-lg cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
