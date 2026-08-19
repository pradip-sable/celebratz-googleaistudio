import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventType } from '../types';
import { EVENT_TYPES } from '../data/categories';

export const RequestEnquireModal: React.FC = () => {
  const { 
    isEnquiryModalOpen, 
    setIsEnquiryModalOpen, 
    selectedListingId, 
    getListingById, 
    currentUser, 
    createEnquiry,
    setActiveRoute 
  } = useApp();

  const listing = selectedListingId ? getListingById(selectedListingId) : null;

  // Form State
  const [requestType, setRequestType] = useState<'request_to_book' | 'general_enquiry'>('request_to_book');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventDate, setEventDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number | ''>(listing?.category === 'venues' ? 300 : '');
  const [preferredVisitTime, setPreferredVisitTime] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
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

    const res = createEnquiry({
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
      preferredVisitTime: preferredVisitTime.trim() || undefined,
      message: message.trim() || `Inquiry for ${eventType} on ${eventDate}`,
      consentGiven: true
    });

    if (res.success) {
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    setIsEnquiryModalOpen(false);
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Direct Vendor Connect &bull; Pune
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
              {requestType === 'request_to_book' ? 'Request to Book / Venue Visit' : 'Send General Enquiry'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
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
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 max-w-sm mx-auto">
              You can track all status updates anytime in your <span className="font-semibold text-teal-900">Customer Dashboard</span>.
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  handleClose();
                  setActiveRoute('customer-dashboard');
                }}
                className="px-5 py-2.5 bg-teal-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-950 transition-colors"
              >
                Go to My Requests
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-left">
            {/* Vendor Mini Card Summary */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <img
                src={listing.coverImage}
                alt=""
                className="w-12 h-12 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{listing.title}</h4>
                <p className="text-[11px] text-stone-500">{listing.locality}, Pune &bull; {listing.pricingNote || `From ₹${listing.startingPrice.toLocaleString('en-IN')}`}</p>
              </div>
            </div>

            {/* Request Mode Toggle */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRequestType('request_to_book')}
                className={`py-2 rounded-lg transition-all ${
                  requestType === 'request_to_book' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📅 Request to Book / Visit
              </button>
              <button
                type="button"
                onClick={() => setRequestType('general_enquiry')}
                className={`py-2 rounded-lg transition-all ${
                  requestType === 'general_enquiry' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                💬 General Enquiry
              </button>
            </div>

            {/* 1. Event Type & Event Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Celebration Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-teal-700 outline-hidden"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-teal-700 outline-hidden"
                />
              </div>
            </div>

            {/* 2. Guest Count & Preferred Visit Slot (for venues) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Estimated Guests (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-teal-700 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Preferred Visit / Call Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunday 4 PM or Evening Call"
                  value={preferredVisitTime}
                  onChange={(e) => setPreferredVisitTime(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-teal-700 outline-hidden"
                />
              </div>
            </div>

            {/* 3. Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus-within:border-teal-700">
                  <UserIcon className="w-4 h-4 text-stone-400 mr-2" />
                  <input
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
                <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 focus-within:border-teal-700">
                  <Mail className="w-4 h-4 text-stone-400 mr-2" />
                  <input
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
                  <Phone className="w-3.5 h-3.5 text-teal-800" />
                  Contact Mobile Number (Double-Entry Verification)
                </span>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  To ensure the vendor can reach you without SMS OTP delays, please enter your 10-digit number twice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Input 1 */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Mobile Number (+91) *
                  </label>
                  <div className="flex items-center bg-white border border-stone-300 rounded-xl px-3 py-2 focus-within:border-teal-700">
                    <span className="text-xs font-bold text-stone-500 mr-1.5">+91</span>
                    <input
                      type="tel"
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
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Re-Enter Number to Confirm *
                  </label>
                  <div className={`flex items-center bg-white border rounded-xl px-3 py-2 transition-colors ${
                    isPhoneMatching 
                      ? 'border-emerald-500 bg-emerald-50/20' 
                      : isPhoneMismatch 
                      ? 'border-rose-400 bg-rose-50/20' 
                      : 'border-stone-300'
                  }`}>
                    <span className="text-xs font-bold text-stone-500 mr-1.5">+91</span>
                    <input
                      type="tel"
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
                <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Numbers do not match yet. Please double-check for typos.</span>
                </div>
              )}
            </div>

            {/* 5. Message Note */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-stone-700 mb-1">
                Custom Requirements or Message (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Inquiring about stage decoration options and outside catering permission..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:border-teal-700 outline-hidden resize-none"
              />
            </div>

            {/* 6. MANDATORY EXPLICIT CONSENT CLAUSE */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 text-teal-800 rounded-xs accent-teal-800 mt-0.5"
                />
                <span className="text-[11px] text-stone-800 leading-snug font-medium">
                  I agree that my name and contact number (+91 {phonePrimary || 'XXXXXXXXXX'}) will be shared directly with <span className="font-bold text-stone-950">{listing.vendorName}</span> so they can contact me about this event request.
                </span>
              </label>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-900 hover:bg-teal-950 text-amber-50 shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Send Request to {listing.vendorName}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
