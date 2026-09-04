import React, { useState, useCallback } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  Users, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Phone,
  User as UserIcon,
  Mail,
  Package,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventType, PricingPackage, ComboPackage } from '../types';
import { EVENT_TYPES, formatEventType } from '../data/categories';
import { formatIndianCurrency } from '../utils/theme';
import { useModalScrollLock, forceUnlockBodyScroll } from '../hooks/useModalScrollLock';

export const RequestEnquireModal: React.FC = () => {
  const { 
    isEnquiryModalOpen, 
    setIsEnquiryModalOpen, 
    selectedListingId, 
    setSelectedListingId,
    getListingById, 
    currentUser, 
    createEnquiry,
    setActiveRoute,
    navigateToCustomerTab,
    prefillPackageData,
    setPrefillPackageData,
    getComboPackagesForListing
  } = useApp();

  const handleClose = useCallback(() => {
    setIsEnquiryModalOpen(false);
    setIsSubmitted(false);
    setErrorMessage(null);
    setPrefillPackageData(null);
  }, [setIsEnquiryModalOpen, setPrefillPackageData]);

  useModalScrollLock(isEnquiryModalOpen, handleClose);

  const listing = selectedListingId ? getListingById(selectedListingId) : null;
  const availableCombos = listing ? getComboPackagesForListing(listing.id) : [];
  const pricingPackages: PricingPackage[] = (listing?.pricingPackages || []).filter(
    p => p.status === 'active' || (!p.status && listing?.status === 'active')
  );
  const hasAvailablePackages = pricingPackages.length > 0 || availableCombos.length > 0;

  // Form State
  const [requestType, setRequestType] = useState<'request_to_book' | 'general_enquiry'>('request_to_book');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventDate, setEventDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number | ''>(listing?.category === 'venues' ? 300 : '');
  const [preferredVisitDate, setPreferredVisitDate] = useState<string>('');
  const [preferredVisitTimeSlot, setPreferredVisitTimeSlot] = useState<string>('04:00 PM - 06:00 PM (Evening)');
  const [message, setMessage] = useState<string>('');
  const [showPackagePicker, setShowPackagePicker] = useState<boolean>(true);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  
  // Package selection state (initialized from prefillPackageData if present)
  const [activePackageData, setActivePackageData] = useState<{
    packageName?: string;
    packagePrice?: number;
    comboPackageId?: string;
    comboPackageTitle?: string;
    comboPrice?: number;
  } | null>(() => {
    if (!prefillPackageData) return null;
    return {
      packageName: prefillPackageData.packageName,
      packagePrice: prefillPackageData.packagePrice,
      comboPackageId: prefillPackageData.comboId,
      comboPackageTitle: prefillPackageData.comboTitle,
      comboPrice: prefillPackageData.comboTitle ? prefillPackageData.packagePrice : undefined
    };
  });

  // Synchronize when prefillPackageData changes
  React.useEffect(() => {
    if (!isEnquiryModalOpen) return;
    if (prefillPackageData) {
      setActivePackageData({
        packageName: prefillPackageData.packageName,
        packagePrice: prefillPackageData.packagePrice,
        comboPackageId: prefillPackageData.comboId,
        comboPackageTitle: prefillPackageData.comboTitle,
        comboPrice: prefillPackageData.comboTitle ? prefillPackageData.packagePrice : undefined
      });
      if (prefillPackageData.comboTitle) {
        setMessage(`Hello, I am interested in booking the "${prefillPackageData.comboTitle}" all-in-one combo package. Please share details on availability and customisation.`);
      } else if (prefillPackageData.packageName) {
        setMessage(`Hello, I am interested in the "${prefillPackageData.packageName}" tier. Please confirm slot availability and payment terms.`);
      }
    }
  }, [prefillPackageData, isEnquiryModalOpen]);

  // Handlers for package selection and removal
  const handleSelectTierPackage = (pkg: PricingPackage) => {
    const isCurrentlySelected = activePackageData?.packageName === pkg.name && !activePackageData?.comboPackageId;
    if (isCurrentlySelected) {
      // Toggle off / remove
      handleRemovePackage();
      return;
    }

    const nextData = {
      packageName: pkg.name,
      packagePrice: pkg.price,
      comboPackageId: undefined,
      comboPackageTitle: undefined,
      comboPrice: undefined
    };
    setActivePackageData(nextData);
    setPrefillPackageData({
      packageName: pkg.name,
      packagePrice: pkg.price
    });
    setMessage(`Hello, I am interested in the "${pkg.name}" tier (${formatIndianCurrency(pkg.price)}). Please confirm slot availability and payment terms.`);
  };

  const handleSelectComboPackage = (combo: ComboPackage) => {
    const isCurrentlySelected = activePackageData?.comboPackageId === combo.id;
    if (isCurrentlySelected) {
      // Toggle off / remove
      handleRemovePackage();
      return;
    }

    const nextData = {
      packageName: combo.title,
      packagePrice: combo.comboPrice,
      comboPackageId: combo.id,
      comboPackageTitle: combo.title,
      comboPrice: combo.comboPrice
    };
    setActivePackageData(nextData);
    setPrefillPackageData({
      comboId: combo.id,
      comboTitle: combo.title,
      packageName: combo.title,
      packagePrice: combo.comboPrice
    });
    setMessage(`Hello, I am interested in booking the "${combo.title}" all-in-one combo package (${formatIndianCurrency(combo.comboPrice)}). Please share details on availability and customisation.`);
  };

  const handleRemovePackage = () => {
    setActivePackageData(null);
    setPrefillPackageData(null);
    setMessage(`Hello, I would like to inquire about availability and pricing for my upcoming ${eventType} celebration.`);
  };
  
  // Contact & Double-Entry Phone
  const [customerName, setCustomerName] = useState<string>(currentUser.fullName || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || '');
  const [phonePrimary, setPhonePrimary] = useState<string>(currentUser.phoneNumber?.replace('+91 ', '') || '');
  const [phoneConfirm, setPhoneConfirm] = useState<string>(currentUser.phoneNumber?.replace('+91 ', '') || '');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  
  // Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isEnquiryModalOpen || !listing) return null;

  const handlePhonePrimaryChange = (val: string) => {
    // Only allow numbers and max 10 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhonePrimary(cleaned);
  };

  const handlePhoneConfirmChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhoneConfirm(cleaned);
  };

  const isPhoneMatching = phonePrimary.length === 10 && phoneConfirm.length === 10 && phonePrimary === phoneConfirm;
  const isPhoneMismatch = phoneConfirm.length > 0 && phonePrimary !== phoneConfirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!eventDate) {
      setErrorMessage('Please pick an event date.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (phonePrimary.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (phonePrimary !== phoneConfirm) {
      setErrorMessage('Phone numbers do not match. Please verify double-entry.');
      return;
    }
    if (!consentGiven) {
      setErrorMessage('Please provide consent to share your contact details with the vendor.');
      return;
    }

    const fullPhone = `+91 ${phonePrimary.slice(0, 5)} ${phonePrimary.slice(5)}`;

    const isPackage = Boolean(activePackageData?.comboPackageId);
    let matchedTierId: string | null = null;
    if (!isPackage) {
      if (prefillPackageData?.tierId) {
        matchedTierId = prefillPackageData.tierId;
      } else if (activePackageData?.packageName) {
        const foundTier = (listing.listing_tiers || []).find(t => t.name === activePackageData.packageName)
          || (listing.pricingPackages || []).find(p => p.name === activePackageData.packageName);
        if (foundTier) matchedTierId = foundTier.id;
      }
    }

    const res = createEnquiry({
      kind: requestType === 'request_to_book' ? 'booking_request' : 'enquiry',
      package_id: isPackage ? (activePackageData?.comboPackageId || null) : null,
      listing_id: isPackage ? null : listing.id,
      selected_tier_id: isPackage ? null : matchedTierId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingCategory: listing.category,
      listingLocality: listing.locality,
      listingCoverImage: listing.coverImage,
      vendorId: listing.vendorId,
      vendorName: listing.vendorName,
      customerId: currentUser.id,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: fullPhone,
      requestType,
      eventType,
      eventDate,
      guestCount: guestCount ? Number(guestCount) : undefined,
      preferredVisitTime: preferredVisitDate 
        ? `${preferredVisitDate} (${preferredVisitTimeSlot})` 
        : (preferredVisitTimeSlot ? `Preferred Slot: ${preferredVisitTimeSlot}` : undefined),
      message: message.trim() || `Inquiry for ${eventType} on ${eventDate}`,
      selectedPackageName: activePackageData?.packageName,
      selectedPackagePrice: activePackageData?.packagePrice,
      comboPackageId: activePackageData?.comboPackageId,
      comboPackageTitle: activePackageData?.comboPackageTitle,
      consentGiven: true
    });

    if (res.success) {
      setIsSubmitted(true);
    }
  };

  return (
    <div 
      id="request-enquiry-dialog-overlay"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        id="request-enquiry-dialog"
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
              Direct Vendor Connect &bull; Pune
            </span>
            <h3 id="enquiry-modal-title" className="font-serif font-bold text-lg text-stone-900 leading-tight">
              {requestType === 'request_to_book' ? 'Request to Book / Venue Visit' : 'Send General Enquiry'}
            </h3>
          </div>

          <button
            id="close-enquiry-modal-button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-extrabold text-2xl text-stone-900">
              Request Sent to {listing.vendorName}!
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              We’ve dispatched your event details to the vendor management. They will review your dates and reach out to you via phone/WhatsApp at <span className="font-bold text-stone-900">+91 {phonePrimary}</span> to confirm visit slots and pricing.
            </p>
            {activePackageData && (activePackageData.packageName || activePackageData.comboPackageTitle) && (
              <div className="p-3 bg-primary-subtle rounded-xl border border-primary/20 text-xs text-primary max-w-sm mx-auto font-medium">
                Attached: <span className="font-bold">{activePackageData.comboPackageTitle || activePackageData.packageName}</span>
                {(activePackageData.comboPrice || activePackageData.packagePrice) && (
                  <span className="ml-1 font-bold">({formatIndianCurrency(activePackageData.comboPrice || activePackageData.packagePrice || 0)})</span>
                )}
              </div>
            )}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 max-w-sm mx-auto">
              You can track all status updates anytime in your <span className="font-semibold text-primary">Customer Dashboard</span>.
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                id="view-my-requests-button"
                onClick={() => {
                  handleClose();
                  setSelectedListingId(null);
                  forceUnlockBodyScroll();
                  navigateToCustomerTab('requests');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-md hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Go to My Requests
              </button>
              <button
                id="keep-browsing-button"
                onClick={() => {
                  handleClose();
                  setSelectedListingId(null);
                  forceUnlockBodyScroll();
                }}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        ) : (
          <form id="enquiry-form" onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-left">
            {/* Vendor Mini Card Summary */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-accent-subtle/50 border border-accent/40">
              <img
                src={listing.coverImage}
                alt=""
                className="w-12 h-12 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{listing.title}</h4>
                <p className="text-[11px] text-stone-500">{listing.locality}, Pune &bull; {listing.pricingNote || `From ${formatIndianCurrency(listing.startingPrice)}`}</p>
              </div>
            </div>

            {/* PACKAGE SELECTION & MANAGEMENT SECTION */}
            {hasAvailablePackages ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">
                        Package / Pricing Tier
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {activePackageData ? 'Customized package selected' : 'Choose a package or request custom pricing'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activePackageData && (
                      <button
                        type="button"
                        id="remove-selected-package-btn"
                        onClick={handleRemovePackage}
                        className="text-[11px] font-bold text-destructive hover:opacity-90 bg-destructive/10 hover:bg-destructive/15 border border-destructive/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Remove package and request general quote"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Package</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowPackagePicker(prev => !prev)}
                      className="text-stone-500 hover:text-stone-800 p-1 rounded-lg hover:bg-stone-200/60 cursor-pointer"
                      title={showPackagePicker ? 'Collapse packages' : 'Expand packages'}
                    >
                      {showPackagePicker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Active Package Banner (When Selected) */}
                {activePackageData && (activePackageData.packageName || activePackageData.comboPackageTitle) && (
                  <div className="p-3 bg-primary-subtle/80 rounded-xl border-2 border-primary/60 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-primary text-accent flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {activePackageData.comboPackageTitle ? '🌟' : '✓'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                            {activePackageData.comboPackageTitle ? 'All-in-One Multi-Service Combo' : 'Attached Package Tier'}
                          </span>
                          <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.2 rounded-full font-bold">
                            Selected
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {activePackageData.comboPackageTitle || activePackageData.packageName}
                          {(activePackageData.comboPrice || activePackageData.packagePrice) ? (
                            <span className="text-primary font-serif font-extrabold ml-1.5">
                              ({formatIndianCurrency(activePackageData.comboPrice || activePackageData.packagePrice || 0)})
                            </span>
                          ) : null}
                        </h5>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="clear-package-banner-btn"
                      onClick={handleRemovePackage}
                      className="text-stone-400 hover:text-destructive text-xs px-2 py-1 rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer font-semibold flex items-center gap-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                )}

                {/* Package Options Grid / List */}
                {showPackagePicker && (
                  <div className="space-y-2 pt-1">
                    {/* Option 0: No Package (Base Quote) */}
                    <div 
                      onClick={handleRemovePackage}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        !activePackageData 
                          ? 'bg-primary-subtle/60 border-primary ring-1 ring-primary shadow-2xs' 
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          !activePackageData ? 'border-primary bg-primary text-primary-foreground' : 'border-stone-300 bg-white'
                        }`}>
                          {!activePackageData && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div>
                          <h6 className="font-bold text-xs text-stone-900">General Inquiry / Custom Quote</h6>
                          <p className="text-[10px] text-stone-500">No specific package attached &bull; Request custom pricing based on requirements</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-600 shrink-0">
                        From {formatIndianCurrency(listing.startingPrice)}
                      </span>
                    </div>

                    {/* Listing Pricing Tier Packages */}
                    {pricingPackages.map((pkg, idx) => {
                      const isSelected = activePackageData?.packageName === pkg.name && !activePackageData?.comboPackageId;
                      const isExpanded = expandedPackageId === `tier_${idx}`;

                      return (
                        <div 
                          key={`tier_${idx}`}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            isSelected 
                              ? 'bg-accent-subtle/50 border-accent ring-1 ring-accent shadow-2xs' 
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div 
                            onClick={() => handleSelectTierPackage(pkg)}
                            className="p-3 cursor-pointer flex items-center justify-between gap-2"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-accent bg-accent text-accent-foreground' : 'border-stone-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h6 className="font-bold text-xs text-stone-900">{pkg.name}</h6>
                                  {pkg.badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-accent-subtle text-accent-dark border border-accent/40 rounded-full">
                                      {pkg.badge}
                                    </span>
                                  )}
                                  {pkg.isPopular && !pkg.badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-accent-subtle text-accent-dark border border-accent/40 rounded-full">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-stone-500 line-clamp-1">{pkg.description}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-2">
                              <div>
                                <span className="font-serif font-extrabold text-xs sm:text-sm text-primary block">
                                  {formatIndianCurrency(pkg.price)}
                                </span>
                                <span className="text-[9px] text-stone-500">
                                  /{(pkg.pricingUnit || listing.pricingUnit || 'event').replace('per_', '')}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPackageId(prev => prev === `tier_${idx}` ? null : `tier_${idx}`);
                                }}
                                className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 text-[10px]"
                                title="View inclusions"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Features List */}
                          {isExpanded && pkg.features && pkg.features.length > 0 && (
                            <div className="px-3 pb-3 pt-1 border-t border-stone-100 bg-stone-50/50 space-y-1">
                              <span className="text-[9px] font-bold uppercase text-stone-500 tracking-wider block">
                                Package Inclusions:
                              </span>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-stone-700">
                                {pkg.features.map((feat, fi) => (
                                  <li key={fi} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                                    <span className="truncate">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* All-in-One Multi-Service Combo Packages */}
                    {availableCombos.map((combo) => {
                      const isSelected = activePackageData?.comboPackageId === combo.id;
                      const isExpanded = expandedPackageId === `combo_${combo.id}`;

                      return (
                        <div 
                          key={`combo_${combo.id}`}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            isSelected 
                              ? 'bg-accent/10 border-accent ring-1 ring-accent shadow-2xs' 
                              : 'bg-white border-accent/30 hover:border-accent/60'
                          }`}
                        >
                          <div 
                            onClick={() => handleSelectComboPackage(combo)}
                            className="p-3 cursor-pointer flex items-center justify-between gap-2"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-accent bg-accent text-accent-foreground' : 'border-accent/40 bg-white'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-primary text-accent rounded-full flex items-center gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    Combo
                                  </span>
                                  <h6 className="font-bold text-xs text-stone-900">{combo.title}</h6>
                                  {combo.badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-accent-subtle text-accent-dark border border-accent/40 rounded-full">
                                      {combo.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-stone-500 line-clamp-1">{combo.description}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-2">
                              <div>
                                <div className="flex items-baseline gap-1 justify-end">
                                  <span className="font-serif font-extrabold text-xs sm:text-sm text-primary">
                                    {formatIndianCurrency(combo.comboPrice)}
                                  </span>
                                  <span className="text-[9px] text-stone-400 line-through">
                                    {formatIndianCurrency(combo.totalOriginalPrice)}
                                  </span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-700 block">
                                  Save {formatIndianCurrency(combo.savingsAmount)} ({combo.savingsPercentage}% OFF)
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPackageId(prev => prev === `combo_${combo.id}` ? null : `combo_${combo.id}`);
                                }}
                                className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 text-[10px]"
                                title="View bundled services"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Combo Inclusions */}
                          {isExpanded && combo.includedServices && combo.includedServices.length > 0 && (
                            <div className="px-3 pb-3 pt-1 border-t border-accent/20 bg-accent-subtle/40 space-y-1">
                              <span className="text-[9px] font-bold uppercase text-stone-500 tracking-wider block">
                                Included Services in this Combo:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {combo.includedServices.map((srv, si) => (
                                  <div 
                                    key={si}
                                    className="px-2 py-1 rounded-lg bg-white border border-accent/30 text-[10px] text-stone-800 flex items-center gap-1"
                                  >
                                    <span className="font-bold text-primary uppercase text-[9px]">{srv.category?.replace('_', ' ')}:</span>
                                    <span className="truncate max-w-[150px]">{srv.listingTitle}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            {/* Request Mode Toggle */}
            <div role="tablist" aria-label="Enquiry kind" className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                role="tab"
                id="request-to-book-tab"
                aria-selected={requestType === 'request_to_book'}
                onClick={() => setRequestType('request_to_book')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  requestType === 'request_to_book' ? 'bg-white text-primary shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📅 Request to Book / Visit
              </button>
              <button
                type="button"
                role="tab"
                id="general-enquiry-tab"
                aria-selected={requestType === 'general_enquiry'}
                onClick={() => setRequestType('general_enquiry')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  requestType === 'general_enquiry' ? 'bg-white text-primary shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                💬 General Enquiry
              </button>
            </div>

            {/* 1. Event Type & Event Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="enquiry-event-type" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Celebration Type *
                </label>
                <select
                  id="enquiry-event-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-primary outline-hidden"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type} value={type}>{formatEventType(type)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="enquiry-event-date" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Event Date *
                </label>
                <input
                  id="enquiry-event-date"
                  type="date"
                  required
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-primary outline-hidden"
                />
              </div>
            </div>

            {/* 2. Guest Count & Preferred Visit Slot */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="enquiry-guest-count" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                    Estimated Guests (Optional)
                  </label>
                  <input
                    id="enquiry-guest-count"
                    type="number"
                    placeholder="e.g. 500"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-primary outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-visit-date" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                    Preferred Visit / Call Date
                  </label>
                  <input
                    id="enquiry-visit-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredVisitDate}
                    onChange={(e) => setPreferredVisitDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              {/* Dedicated Time Slot Selection */}
              <div>
                <label htmlFor="enquiry-visit-slot" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Preferred Time Window *
                </label>
                <select
                  id="enquiry-visit-slot"
                  value={preferredVisitTimeSlot}
                  onChange={(e) => setPreferredVisitTimeSlot(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-primary outline-hidden"
                >
                  <option value="10:00 AM - 12:00 PM (Morning Slot)">☀️ Morning Slot (10:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 02:00 PM (Early Afternoon)">🌤️ Early Afternoon (12:00 PM - 02:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM (Late Afternoon)">⛅ Late Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="04:00 PM - 06:00 PM (Evening Slot)">🌇 Evening Slot (04:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM - 08:00 PM (Night Slot)">🌙 Night Slot (06:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            {/* 3. Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="enquiry-customer-name" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus-within:border-primary">
                  <UserIcon className="w-4 h-4 text-stone-400 mr-2" />
                  <input
                    id="enquiry-customer-name"
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-900 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enquiry-customer-email" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus-within:border-primary">
                  <Mail className="w-4 h-4 text-stone-400 mr-2" />
                  <input
                    id="enquiry-customer-email"
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-900 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 4. DOUBLE-ENTRY PHONE NUMBER VALIDATION (Phase 1 Typo Safeguard) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div>
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  Contact Mobile Number (Double-Entry Verification)
                </span>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  To ensure the vendor can reach you without SMS OTP delays, please enter your 10-digit number twice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Input 1 */}
                <div>
                  <label htmlFor="enquiry-phone-primary" className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Mobile Number (+91) *
                  </label>
                  <div className="flex items-center bg-white border border-stone-300 rounded-xl px-3 py-2 focus-within:border-primary">
                    <span className="text-xs font-bold text-stone-500 mr-1.5">+91</span>
                    <input
                      id="enquiry-phone-primary"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      pattern="[0-9]*"
                      maxLength={10}
                      required
                      placeholder="9823045678"
                      value={phonePrimary}
                      onChange={(e) => handlePhonePrimaryChange(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-stone-900 outline-hidden"
                    />
                  </div>
                </div>

                {/* Input 2 (Re-enter) */}
                <div>
                  <label htmlFor="enquiry-phone-confirm" className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Re-Enter Number to Confirm *
                  </label>
                  <div className={`flex items-center bg-white border rounded-xl px-3 py-2 transition-colors ${
                    isPhoneMatching 
                      ? 'border-emerald-500 bg-emerald-50/20' 
                      : isPhoneMismatch 
                      ? 'border-destructive/50 bg-destructive/10' 
                      : 'border-stone-300'
                  }`}>
                    <span className="text-xs font-bold text-stone-500 mr-1.5">+91</span>
                    <input
                      id="enquiry-phone-confirm"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      pattern="[0-9]*"
                      maxLength={10}
                      required
                      placeholder="Type again..."
                      value={phoneConfirm}
                      onChange={(e) => handlePhoneConfirmChange(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-stone-900 outline-hidden"
                    />
                    {isPhoneMatching && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                  </div>
                </div>
              </div>

              {isPhoneMismatch && (
                <div className="text-[11px] font-semibold text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Numbers do not match yet. Please double-check for typos.</span>
                </div>
              )}
            </div>

            {/* 5. Message Note */}
            <div>
              <label htmlFor="enquiry-message" className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                Custom Requirements or Message (Optional)
              </label>
              <textarea
                id="enquiry-message"
                rows={2}
                placeholder="e.g. Inquiring about stage decoration options and outside catering permission..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-primary outline-hidden resize-none"
              />
            </div>

            {/* 6. MANDATORY EXPLICIT CONSENT CLAUSE */}
            <div className="p-3.5 rounded-xl bg-accent-subtle/70 border border-accent/30 space-y-2">
              <label htmlFor="enquiry-consent-checkbox" className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="enquiry-consent-checkbox"
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 text-primary rounded-xs accent-primary mt-0.5"
                />
                <span className="text-[11px] text-stone-800 leading-snug font-medium">
                  I agree that my name and contact number (+91 {phonePrimary || 'XXXXXXXXXX'}) will be shared directly with <span className="font-bold text-stone-950">{listing.vendorName}</span> so they can contact me about this event request.
                </span>
              </label>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-enquiry-button"
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary-dark text-primary-foreground shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4 text-accent" />
                <span>Send Request to {listing.vendorName}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
