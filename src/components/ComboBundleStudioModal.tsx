import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  IndianRupee, 
  Percent, 
  HelpCircle,
  Building,
  Utensils,
  Camera,
  Music,
  Flame,
  Tag,
  Users,
  Calendar,
  AlertCircle,
  Lock,
  Hourglass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing, ComboPackage, BundleServiceItem, EventType, CategoryId } from '../types';
import { EVENT_TYPES } from '../data/categories';
import { formatIndianCurrency, get24HourEditStatus } from '../utils/theme';
import { SubmissionConfirmationModal, SubmissionDetails } from './SubmissionConfirmationModal';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface ComboBundleStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCombo?: ComboPackage | null;
}

export const ComboBundleStudioModal: React.FC<ComboBundleStudioModalProps> = ({
  isOpen,
  onClose,
  initialCombo
}) => {
  const { currentUser, listings, addComboPackage, updateComboPackage } = useApp();

  useModalScrollLock(isOpen, onClose);

  // Filter vendor's active and approved listings only
  const vendorListings = listings.filter(
    l => (l.vendorId === currentUser.id || currentUser.role === 'admin' || l.vendorId === 'user_vendor_1') && l.status === 'active'
  );

  // Check 24-hour edit cooldown if editing an existing combo
  const cooldownStatus = initialCombo?.lastEditedAt 
    ? get24HourEditStatus(initialCombo.lastEditedAt) 
    : { canEdit: true, remainingMs: 0, formattedRemaining: '', lastEditedText: '' };

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    details: SubmissionDetails;
    onConfirm: () => void;
  } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('🌟 Best Value Wedding Combo');
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [serviceCustomData, setServiceCustomData] = useState<Record<string, { price: number; inclusions: string[] }>>({});
  const [comboPrice, setComboPrice] = useState<number>(0);
  const [minGuestCapacity, setMinGuestCapacity] = useState<number>(300);
  const [maxGuestCapacity, setMaxGuestCapacity] = useState<number>(1000);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(['Wedding', 'Reception', 'Engagement']);
  const [features, setFeatures] = useState<string[]>([
    'Single Point of Contact — Zero vendor coordination headaches',
    'Dedicated On-Site Event Operations Manager throughout the day',
    'Complimentary 4 AC Bridal Dressing Rooms with vanity mirrors',
    'Guaranteed 100% DG Power Backup & Valet Parking Included'
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate data when editing or opening
  useEffect(() => {
    if (!isOpen) return;

    if (initialCombo) {
      setTitle(initialCombo.title);
      setDescription(initialCombo.description);
      setBadge(initialCombo.badge || '🌟 Best Value Wedding Combo');
      setSelectedListingIds(initialCombo.includedListingIds);
      
      const customMap: Record<string, { price: number; inclusions: string[] }> = {};
      initialCombo.includedServices.forEach(s => {
        customMap[s.listingId] = {
          price: s.originalPrice,
          inclusions: s.serviceInclusions
        };
      });
      setServiceCustomData(customMap);
      setComboPrice(initialCombo.comboPrice);
      setMinGuestCapacity(initialCombo.minGuestCapacity || 200);
      setMaxGuestCapacity(initialCombo.maxGuestCapacity || 1000);
      setSelectedEventTypes(initialCombo.eventTypes);
      setFeatures(initialCombo.features);
      setCoverImage(initialCombo.coverImage || '');
    } else {
      // Default to picking first 2 listings if available
      const defaultIds = vendorListings.slice(0, 2).map(l => l.id);
      setSelectedListingIds(defaultIds);
      
      const initialMap: Record<string, { price: number; inclusions: string[] }> = {};
      defaultIds.forEach(id => {
        const item = vendorListings.find(l => l.id === id) || listings.find(l => l.id === id);
        if (item) {
          initialMap[id] = {
            price: item.startingPrice || 0,
            inclusions: getDefaultInclusionsForCategory(item.category, item.title || '')
          };
        }
      });
      setServiceCustomData(initialMap);
      
      const totalOrig = Object.values(initialMap).reduce((acc, curr) => acc + (curr.price || 0), 0);
      setComboPrice(totalOrig > 0 ? Math.round(totalOrig * 0.85) : 0); // 15% discount default
      const firstTitle = vendorListings[0]?.title || listings[0]?.title || '';
      const secondTitle = vendorListings[1]?.title || listings[1]?.title || '';
      setTitle(defaultIds.length >= 2 && firstTitle && secondTitle ? `${firstTitle} & ${secondTitle} Combo` : (firstTitle ? `${firstTitle} Special Combo` : ''));
      setDescription('Combine our premier services into one bundled package for unmatched convenience and guaranteed discounted pricing.');
      setBadge('🌟 Best Value Wedding Combo');
      setCoverImage(vendorListings[0]?.coverImage || listings[0]?.coverImage || '');
    }
  }, [isOpen, initialCombo?.id]);

  if (!isOpen) return null;

  function getDefaultInclusionsForCategory(category: CategoryId, title: string): string[] {
    switch (category) {
      case 'venues':
        return ['Full AC Banquet Hall & Lawn for 24 Hours', '4 Deluxe AC Green Rooms', 'Valet Parking & Generator Backup'];
      case 'catering':
        return ['Grand Shahi Pure Veg Buffet Spread', 'Live Chaat & Jalebi Counters', 'Uniformed Staff & Mineral Water'];
      case 'decoration':
        return ['Custom Vedic 4-Pillar Floral Mandap', '25ft Entrance Tunnel Arch', 'Full Ambient LED Lighting'];
      case 'photography':
        return ['Traditional & Candid Photography', 'Cinematic Wedding Film & Teaser', 'Hardbound Deluxe Silk Album'];
      case 'music_dj':
        return ['10,000W RMS Line Array Audio Setup', 'Intelligent Moving Head Lights', 'Wireless Microphones for Rituals'];
      case 'pandit_priest':
        return ['Complete Vedic Vivah Vidhi & Muhurat Consultation', 'Explanations in Marathi / Hindi', 'Samagri List Provided'];
      default:
        return ['Full professional service execution', 'Dedicated supervisor on-site'];
    }
  }

  const handleToggleListing = (listingId: string) => {
    const isSelected = selectedListingIds.includes(listingId);
    let updatedIds: string[];
    if (isSelected) {
      updatedIds = selectedListingIds.filter(id => id !== listingId);
    } else {
      updatedIds = [...selectedListingIds, listingId];
    }
    setSelectedListingIds(updatedIds);

    // Initialize custom data if not present
    if (!isSelected && !serviceCustomData[listingId]) {
      const item = vendorListings.find(l => l.id === listingId) || listings.find(l => l.id === listingId);
      if (item) {
        setServiceCustomData(prev => ({
          ...prev,
          [listingId]: {
            price: item.startingPrice || 0,
            inclusions: getDefaultInclusionsForCategory(item.category, item.title || '')
          }
        }));
      }
    }
  };

  const handleUpdateServicePrice = (listingId: string, price: number) => {
    setServiceCustomData(prev => ({
      ...prev,
      [listingId]: {
        ...prev[listingId],
        price: Number(price) || 0
      }
    }));
  };

  const handleAddInclusion = (listingId: string, text: string) => {
    if (!text.trim()) return;
    setServiceCustomData(prev => {
      const current = prev[listingId]?.inclusions || [];
      return {
        ...prev,
        [listingId]: {
          ...prev[listingId],
          inclusions: [...current, text.trim()]
        }
      };
    });
  };

  const handleRemoveInclusion = (listingId: string, index: number) => {
    setServiceCustomData(prev => {
      const current = prev[listingId]?.inclusions || [];
      return {
        ...prev,
        [listingId]: {
          ...prev[listingId],
          inclusions: current.filter((_, i) => i !== index)
        }
      };
    });
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures(prev => [...prev, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  // Calculations
  const totalOriginalPrice = selectedListingIds.reduce((acc, id) => {
    return acc + (serviceCustomData[id]?.price || 0);
  }, 0);

  const savingsAmount = Math.max(0, totalOriginalPrice - comboPrice);
  const savingsPercentage = totalOriginalPrice > 0 ? Math.round((savingsAmount / totalOriginalPrice) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a compelling package name.');
      return;
    }
    if (selectedListingIds.length < 2) {
      setErrorMessage('A combo package must bundle at least 2 services/listings.');
      return;
    }
    if (comboPrice <= 0) {
      setErrorMessage('Please set a valid combo package price.');
      return;
    }
    if (comboPrice >= totalOriginalPrice) {
      setErrorMessage('Combo price should be lower than the standard combined total to offer customer savings.');
      return;
    }

    if (initialCombo && !cooldownStatus.canEdit) {
      setErrorMessage(`This combo package was edited ${cooldownStatus.lastEditedText}. Edits can only be submitted once every 24 hours. Next edit unlocks in ${cooldownStatus.formattedRemaining}.`);
      return;
    }

    const includedServices: BundleServiceItem[] = selectedListingIds.map(id => {
      const listing = vendorListings.find(l => l.id === id) || listings.find(l => l.id === id);
      const custom = serviceCustomData[id];
      return {
        listingId: id,
        listingTitle: listing?.title || 'Custom Included Service',
        category: listing?.category || 'venues',
        originalPrice: custom?.price ?? (listing?.startingPrice || 0),
        serviceInclusions: custom?.inclusions || []
      };
    });

    const payload = {
      vendorId: currentUser.id || 'user_vendor_1',
      vendorName: currentUser.businessName || currentUser.fullName || 'The Royal Palace & Lawns',
      vendorPhone: currentUser.phoneNumber || '+91 98811 22334',
      vendorEmail: currentUser.email || 'rajesh@royalpalacebaner.com',
      title: title.trim(),
      description: description.trim(),
      includedListingIds: selectedListingIds,
      includedServices,
      totalOriginalPrice,
      comboPrice,
      savingsAmount,
      savingsPercentage,
      badge: badge.trim() || '🌟 Special Combo Deal',
      eventTypes: selectedEventTypes,
      minGuestCapacity,
      maxGuestCapacity,
      coverImage: coverImage || vendorListings[0]?.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80',
      features,
      status: 'pending_approval' as const,
      lastEditedAt: new Date().toISOString(),
      city: vendorListings[0]?.city || 'pune',
      locality: vendorListings[0]?.locality || 'Baner'
    };

    // Open confirmation popup before submitting!
    setConfirmationModal({
      isOpen: true,
      details: {
        type: 'combo_package',
        title: title.trim(),
        price: comboPrice,
        packagesCount: selectedListingIds.length,
        customDetails: [
          { label: 'Services Included', value: `${selectedListingIds.length} listings (${includedServices.map(s => s.category).join(', ')})` },
          { label: 'Savings Provided', value: `₹${savingsAmount.toLocaleString('en-IN')} (${savingsPercentage}% OFF)` },
          { label: 'Moderation Status', value: 'Queued for Admin Approval' },
          { label: 'Edit Lock', value: '24-Hour Cooldown Activated' }
        ]
      },
      onConfirm: () => {
        if (initialCombo) {
          updateComboPackage(initialCombo.id, payload);
        } else {
          addComboPackage(payload);
        }
        setConfirmationModal(null);
        onClose();
      }
    });
  };

  return (
    <div 
      id="combo-bundle-studio-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div 
        id="combo-bundle-studio-modal"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative text-left"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-teal-900 to-teal-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Multi-Service Package Builder
              </span>
              <h3 className="font-serif font-bold text-lg text-white">
                {initialCombo ? 'Edit Multi-Service Combo Bundle' : 'Create New Multi-Service Combo Package'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-stone-300 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-left">
          {initialCombo && !cooldownStatus.canEdit && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-950">24-Hour Edit Restriction Active</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-950">
                    {cooldownStatus.formattedRemaining} left
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  This combo package was edited {cooldownStatus.lastEditedText}. Because package changes require verification before being republished, vendors are limited to 1 update per 24 hours.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SECTION 1: Package Title & Marketing Badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Combo Package Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Royal Vivah Grand Combo: Lawn + Mandap Decor + Shahi Feast"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-teal-700 focus:outline-none"
                required
              />
              <p className="text-[11px] text-stone-500">
                Highlight the bundled services in the title so customers immediately know what is included.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Highlight Tag / Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="e.g. 🌟 Best Value Wedding Combo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Package Description & Value Proposition
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain why choosing this combined package gives the customer peace of mind, premium quality, and massive savings..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>

          {/* SECTION 2: Select Vendor's Services to Combine */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-teal-800" />
                  Select Services to Combine (Min. 2 Services)
                </h4>
                <p className="text-xs text-stone-500">
                  Select 2 or more of your active listings. Customer will receive a single all-in-one quote.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-full">
                {selectedListingIds.length} Services Selected
              </span>
            </div>

            {vendorListings.length < 2 ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  ⚠️ Minimum 2 Active Listings Required
                </span>
                <p className="text-[11px] text-amber-900">
                  Vendors can create multi-service combo bundles only for <strong>approved and active listings</strong>. You currently have {vendorListings.length} active listing{vendorListings.length === 1 ? '' : 's'}. Please ensure at least 2 listings are approved and live before creating a combo bundle.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vendorListings.map(item => {
                  const isChecked = selectedListingIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleListing(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked 
                          ? 'bg-teal-50/70 border-teal-700 shadow-xs' 
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div click
                          className="mt-1 w-4 h-4 rounded text-teal-800 focus:ring-teal-700 cursor-pointer"
                        />
                        <img
                          src={item.coverImage}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                            {(item.category || '').toUpperCase().replace('_', ' ')}
                          </span>
                          <h5 className="font-bold text-xs text-stone-900 truncate">{item.title}</h5>
                          <p className="text-[11px] text-stone-500 font-medium">
                            Standard: {formatIndianCurrency(item.startingPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 3: Service-Specific Inclusions & Individual Values */}
          {selectedListingIds.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-stone-200">
              <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Customize Inclusions & Price Breakdown Per Service
              </h4>

              <div className="space-y-3">
                {selectedListingIds.map(id => {
                  const item = vendorListings.find(l => l.id === id);
                  if (!item) return null;
                  const data = serviceCustomData[id] || { price: item.startingPrice, inclusions: [] };

                  return (
                    <div key={id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-200 text-stone-800">
                            {item.category}
                          </span>
                          <h5 className="font-bold text-xs sm:text-sm text-stone-900">{item.title}</h5>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-stone-600">Standard Value:</label>
                          <div className="relative w-32">
                            <span className="absolute left-2.5 top-1.5 text-xs text-stone-500">₹</span>
                            <input
                              type="number"
                              placeholder="e.g. 50000"
                              value={data.price === 0 ? '' : data.price}
                              onChange={e => handleUpdateServicePrice(id, e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-full pl-6 pr-2 py-1 bg-white rounded-lg border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Inclusions Checklist */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-stone-700 block">
                          Included Deliverables for this Service:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {data.inclusions.map((inc, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-800"
                            >
                              <CheckCircle2 className="w-3 h-3 text-teal-700 shrink-0" />
                              <span>{inc}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveInclusion(id, i)}
                                className="ml-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add inclusion input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add specific inclusion (e.g. 500 plates, 4 deluxe rooms)..."
                            id={`add-inclusion-${id}`}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget;
                                handleAddInclusion(id, input.value);
                                input.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`add-inclusion-${id}`) as HTMLInputElement;
                              if (input && input.value) {
                                handleAddInclusion(id, input.value);
                                input.value = '';
                              }
                            }}
                            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: SMART PRICING & SAVINGS CALCULATION ENGINE */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-teal-50 to-stone-50 border border-amber-300/80 space-y-4">
            <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-teal-900" />
              Smart Package Pricing & Discount Engine
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Standalone Total Sum */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500 block">
                  Combined Standard Value
                </span>
                <div className="font-serif font-bold text-lg sm:text-xl text-stone-600 line-through">
                  {formatIndianCurrency(totalOriginalPrice)}
                </div>
                <span className="text-[11px] text-stone-500">Sum of individual prices</span>
              </div>

              {/* Combo Price Input */}
              <div className="p-3.5 bg-white rounded-xl border-2 border-teal-800 space-y-1">
                <label className="text-[10px] font-bold uppercase text-teal-950 block">
                  Special Combo Bundle Price <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-sm font-bold text-stone-600">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={comboPrice === 0 ? '' : comboPrice}
                    onChange={e => setComboPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-lg sm:text-xl font-bold font-serif text-teal-950 focus:outline-none"
                    required
                  />
                </div>
                <span className="text-[11px] text-teal-700 font-medium">All-in-one offer price</span>
              </div>

              {/* Instant Savings Badge */}
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                savingsAmount > 0 
                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950' 
                  : 'bg-stone-100 border-stone-300 text-stone-600'
              }`}>
                <span className="text-[10px] font-bold uppercase block tracking-wider">
                  Customer Instant Savings
                </span>
                <div className="font-serif font-extrabold text-lg sm:text-xl">
                  {savingsAmount > 0 ? `Save ${formatIndianCurrency(savingsAmount)}` : 'No Discount Set'}
                </div>
                <span className="text-[11px] font-semibold">
                  {savingsPercentage > 0 ? `🎯 ${savingsPercentage}% OFF standard price` : 'Set a lower price to show discount'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Capacity, Event Types & VIP Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
            {/* Guest Capacity */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-800" />
                Target Guest Capacity Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-stone-500">Min Guests</span>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={minGuestCapacity === 0 ? '' : minGuestCapacity}
                    onChange={e => setMinGuestCapacity(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500">Max Guests</span>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={maxGuestCapacity === 0 ? '' : maxGuestCapacity}
                    onChange={e => setMaxGuestCapacity(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Event Types */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-800" />
                Suitable Event Types
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_TYPES.map(type => {
                  const isSelected = selectedEventTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedEventTypes(prev => prev.filter(t => t !== type));
                        } else {
                          setSelectedEventTypes(prev => [...prev, type]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-900 text-white border-teal-900' 
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 6: Key Package Highlights & VIP Perks */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="text-xs font-bold text-stone-700 block">
              🌟 Key All-in-One Package Highlights & Perks
            </label>
            <div className="space-y-1.5">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <span className="flex items-center gap-2 text-stone-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                    <span>{feat}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add special perk (e.g. Free 4 AC Bridal Suites, Dedicated Coordinator)..."
                value={newFeatureInput}
                onChange={e => setNewFeatureInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-teal-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900 cursor-pointer"
              >
                Add Highlight
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={initialCombo ? !cooldownStatus.canEdit : false}
            className="px-6 py-2.5 bg-teal-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-950 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialCombo && !cooldownStatus.canEdit ? (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Locked ({cooldownStatus.formattedRemaining})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{initialCombo ? 'Review & Save Changes' : 'Review & Publish Combo'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Submission Confirmation Popup */}
      {confirmationModal && (
        <SubmissionConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={confirmationModal.onConfirm}
          details={confirmationModal.details}
        />
      )}
    </div>
  );
};
