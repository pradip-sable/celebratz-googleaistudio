import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Calendar as CalendarIcon, 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Edit3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Users,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing, CategoryId, PuneLocality, EventType, CalendarStatus } from '../types';
import { CATEGORIES, PUNE_LOCALITIES, EVENT_TYPES } from '../data/categories';
import { CITIES, getCityById } from '../data/cities';
import { formatIndianCurrency, getDaysAgoText } from '../utils/theme';

export const VendorDashboard: React.FC = () => {
  const { 
    currentUser, 
    listings, 
    addListing, 
    updateListing, 
    toggleCalendarDate, 
    enquiries, 
    updateEnquiryStatus, 
    setSelectedListingId 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'new_listing' | 'calendar' | 'leads'>('overview');
  
  // Multi-listing selection for this vendor
  const vendorListings = listings.filter(l => l.vendorId === currentUser.id || currentUser.role === 'admin' || l.vendorId === 'user_vendor_1');
  const [selectedListingForCalendar, setSelectedListingForCalendar] = useState<string>(vendorListings[0]?.id || '');

  // Leads for this vendor
  const vendorEnquiries = enquiries.filter(e => e.vendorId === currentUser.id || currentUser.role === 'admin' || e.vendorId === 'user_vendor_1');
  
  // Calendar month state
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // Vendor reply modal state
  const [respondingEnquiryId, setRespondingEnquiryId] = useState<string | null>(null);
  const [vendorReplyNote, setVendorReplyNote] = useState<string>('');

  // New Listing Form State with multi-city extension
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('pune');
  const [newCategory, setNewCategory] = useState<CategoryId>('venues');
  const [newLocality, setNewLocality] = useState<string>('Baner');
  const [newAddress, setNewAddress] = useState('');
  const [newGoogleMapsUrl, setNewGoogleMapsUrl] = useState('');
  const [newPrice, setNewPrice] = useState<number>(100000);
  const [newDescription, setNewDescription] = useState('');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80');
  const [newEventTypes, setNewEventTypes] = useState<EventType[]>(['Wedding', 'Engagement']);
  
  // Dynamic category attributes
  const [venueCapacityMax, setVenueCapacityMax] = useState<number>(800);
  const [venueParking, setVenueParking] = useState<number>(150);
  const [venueHasAC, setVenueHasAC] = useState<boolean>(true);
  const [caterVegType, setCaterVegType] = useState<string>('Pure Veg');
  const [photoTimeline, setPhotoTimeline] = useState<number>(21);
  const [isListingCreated, setIsListingCreated] = useState<boolean>(false);

  const currentListing = listings.find(l => l.id === selectedListingForCalendar) || vendorListings[0];

  // Calendar dates generation
  const currentMonthDate = new Date();
  currentMonthDate.setMonth(currentMonthDate.getMonth() + calendarMonthOffset);
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const status: CalendarStatus = currentListing?.calendar[dateStr] || 'available';
    return { dayNum, dateStr, status };
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedCityConfig = getCityById(newCity);

    addListing({
      vendorId: currentUser.id,
      vendorName: currentUser.businessName || currentUser.fullName,
      vendorPhone: currentUser.phoneNumber || '+91 98811 22334',
      vendorEmail: currentUser.email,
      title: newTitle.trim(),
      city: newCity,
      category: newCategory,
      eventTypes: newEventTypes,
      locality: newLocality,
      address: newAddress.trim() || `${newLocality}, ${selectedCityConfig?.name || 'Pune'}`,
      googleMapsUrl: newGoogleMapsUrl.trim() || undefined,
      startingPrice: Number(newPrice),
      pricingUnit: newCategory === 'catering' ? 'per_plate' : 'per_day',
      categoryAttributes: {
        capacityMax: venueCapacityMax,
        capacityMin: Math.round(venueCapacityMax / 3),
        parkingCapacity: venueParking,
        hasAC: venueHasAC,
        vegType: caterVegType,
        deliveryTimelineDays: photoTimeline
      },
      coverImage: newCoverImage,
      galleryImages: [newCoverImage],
      description: newDescription.trim() || `Premium service and venue provider in ${selectedCityConfig?.name || 'Pune'}.`,
      status: 'pending_approval',
      isFeatured: false,
      calendar: {}
    });

    setIsListingCreated(true);
    setTimeout(() => {
      setIsListingCreated(false);
      setActiveTab('listings');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Vendor Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950">
              Vendor Management Studio
            </span>
            <span className="text-xs text-stone-400">&bull; Pune Partner Hub</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-50">
            {currentUser.businessName || currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
            Manage your availability calendar, incoming client leads, and Pune listing profiles.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('new_listing')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-all relative ${
            activeTab === 'leads' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          📥 Leads & Enquiries ({vendorEnquiries.length})
          {vendorEnquiries.filter(e => e.vendorStatus === 'pending').length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-stone-950 rounded-full text-[10px] font-bold">
              {vendorEnquiries.filter(e => e.vendorStatus === 'pending').length} New
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'calendar' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          📅 Availability Calendar (Tap-to-Toggle)
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'listings' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🏢 My Listings ({vendorListings.length})
        </button>
        <button
          onClick={() => setActiveTab('new_listing')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'new_listing' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          + Create Listing
        </button>
      </div>

      {/* 1. OVERVIEW KPI TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold">
                <span>Active Listings</span>
                <Store className="w-4 h-4 text-teal-800" />
              </div>
              <div className="font-serif font-extrabold text-3xl text-stone-900">
                {vendorListings.filter(l => l.status === 'active').length}
              </div>
              <p className="text-[11px] text-stone-500">Live in Pune search results</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold">
                <span>Total Leads Received</span>
                <Inbox className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-serif font-extrabold text-3xl text-stone-900">
                {vendorEnquiries.length}
              </div>
              <p className="text-[11px] text-stone-500">
                {vendorEnquiries.filter(e => e.vendorStatus === 'pending').length} awaiting your action
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold">
                <span>Calendar Staleness Radar</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-serif font-extrabold text-xl text-emerald-800">
                {currentListing ? getDaysAgoText(currentListing.calendarLastUpdatedAt).text : 'Up to Date'}
              </div>
              <p className="text-[11px] text-stone-500">Tap dates regularly to prevent stale badge</p>
            </div>
          </div>

          {/* Recent Leads Preview */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-stone-900">Recent Inquiries</h3>
              <button onClick={() => setActiveTab('leads')} className="text-xs font-bold text-teal-900 hover:underline">
                View All Leads &rarr;
              </button>
            </div>

            {vendorEnquiries.slice(0, 3).map(enq => (
              <div key={enq.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <span className="font-bold text-stone-900">{enq.customerName}</span>
                  <span className="text-stone-500"> &bull; {enq.eventType} ({enq.eventDate}) &bull; {enq.customerPhone}</span>
                  <p className="text-[11px] text-stone-600 italic mt-0.5">"{enq.message}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    enq.vendorStatus === 'accepted' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {enq.vendorStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LEADS & ENQUIRIES INBOX */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-stone-900">Client Inquiries & Booking Requests</h2>
            <span className="text-xs text-stone-500">Contact verified directly by Celebratz double-entry validation</span>
          </div>

          {vendorEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              No leads received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {vendorEnquiries.map(enq => (
                <div key={enq.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-stone-900">{enq.customerName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                          {enq.requestType === 'request_to_book' ? 'Booking / Visit' : 'Enquiry'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Listing: <span className="font-semibold text-stone-800">{enq.listingTitle}</span> &bull; Received {new Date(enq.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        enq.vendorStatus === 'accepted' ? 'bg-emerald-100 text-emerald-900' :
                        enq.vendorStatus === 'declined' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        Status: {enq.vendorStatus}
                      </span>
                    </div>
                  </div>

                  {/* Customer Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-teal-800" />
                      <span className="font-bold text-stone-900">{enq.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-teal-800" />
                      <span className="text-stone-700">{enq.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-stone-900">{enq.eventType} &bull; {enq.eventDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 p-3 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900">Client Note:</span> "{enq.message}"
                    {enq.preferredVisitTime && (
                      <span className="block text-stone-500 text-[11px] mt-1">Preferred Time: {enq.preferredVisitTime}</span>
                    )}
                  </p>

                  {/* Actions for Vendor */}
                  {enq.vendorStatus === 'pending' && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          updateEnquiryStatus(enq.id, 'accepted', 'Thank you! We will reach out to finalize visit & pricing.');
                        }}
                        className="px-4 py-2 bg-teal-900 hover:bg-teal-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Accept & Send Direct Contact</span>
                      </button>

                      <button
                        onClick={() => {
                          updateEnquiryStatus(enq.id, 'declined', 'Unfortunately we are fully booked on this date.');
                        }}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. TAP-TO-TOGGLE AVAILABILITY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-800" />
                Tap-to-Toggle Availability Manager
              </h2>
              <p className="text-xs text-stone-500">
                Click any calendar date to cycle: <span className="font-bold text-emerald-700">Available</span> ➔ <span className="font-bold text-amber-700">Tentative</span> ➔ <span className="font-bold text-rose-700">Booked</span>. Updates your last-updated timestamp immediately.
              </p>
            </div>

            {/* Listing Switcher for Vendors with Multiple Listings */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-stone-600 shrink-0">Listing:</label>
              <select
                value={selectedListingForCalendar}
                onChange={(e) => setSelectedListingForCalendar(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-semibold text-stone-900 outline-hidden"
              >
                {vendorListings.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCalendarMonthOffset(prev => prev - 1)}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-serif font-bold text-base text-stone-900">{monthName}</span>
            <button
              onClick={() => setCalendarMonthOffset(prev => prev + 1)}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-[11px] font-bold text-stone-400 uppercase py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3" />
            ))}

            {calendarDays.map(({ dayNum, dateStr, status }) => {
              let btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-emerald-500';
              if (status === 'tentative') btnStyle = 'bg-amber-50 text-amber-900 border-amber-300 hover:border-amber-500';
              if (status === 'booked') btnStyle = 'bg-rose-50 text-rose-900 border-rose-300 hover:border-rose-500';

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => currentListing && toggleCalendarDate(currentListing.id, dateStr)}
                  className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-90 shadow-2xs ${btnStyle}`}
                >
                  <span>{dayNum}</span>
                  <span className="text-[9px] uppercase font-bold mt-1 tracking-wider">
                    {status}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs text-stone-600">
            <span>Last Updated: <strong className="text-stone-900">{currentListing ? getDaysAgoText(currentListing.calendarLastUpdatedAt).text : 'Now'}</strong></span>
            <span className="text-[11px] text-teal-900 font-semibold">⚡ Auto-saved to live marketplace</span>
          </div>
        </div>
      )}

      {/* 4. MY LISTINGS DIRECTORY */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-stone-900">Your Listed Venues & Services</h2>
            <button
              onClick={() => setActiveTab('new_listing')}
              className="px-4 py-2 bg-teal-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendorListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-3 shadow-xs">
                <img
                  src={listing.coverImage}
                  alt=""
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-800">
                      {listing.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      listing.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {(listing.status || 'active').replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 truncate">{listing.title}</h4>
                  <p className="text-xs text-stone-500">{listing.locality} &bull; {formatIndianCurrency(listing.startingPrice)}/{(listing.pricingUnit || 'event').replace('per_', '')}</p>
                  
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedListingForCalendar(listing.id);
                        setActiveTab('calendar');
                      }}
                      className="text-[11px] font-bold text-teal-900 hover:underline flex items-center gap-1"
                    >
                      <CalendarIcon className="w-3 h-3" />
                      Manage Calendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CREATE NEW LISTING WITH DYNAMIC CATEGORY FIELDS */}
      {activeTab === 'new_listing' && (
        <form onSubmit={handleCreateListing} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-sm text-left">
          <div>
            <h2 className="font-serif font-bold text-2xl text-stone-900">List Your Venue or Service in Pune</h2>
            <p className="text-xs text-stone-500">Every new submission is reviewed by the Celebratz admin team within 24 hours.</p>
          </div>

          {isListingCreated ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 text-center rounded-2xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Listing Submitted for Approval!</h4>
              <p className="text-xs">Your listing has been created and placed in the admin approval queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Service Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewCategory(c.id)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        newCategory === c.id ? 'bg-teal-900 text-white border-teal-900' : 'bg-stone-50 text-stone-800 border-stone-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* City, Title & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    City (India) *
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      setNewCity(selectedCity);
                      const cityCfg = getCityById(selectedCity);
                      if (cityCfg && cityCfg.localities.length > 0) {
                        setNewLocality(cityCfg.localities[0]);
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden font-semibold"
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.state}) {c.status === 'active' ? '• Live' : '• Upcoming'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Grand Heritage Lawns"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Locality / Area *
                  </label>
                  <select
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  >
                    {(getCityById(newCity)?.localities || PUNE_LOCALITIES).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Address & Google Maps Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Full Venue / Studio Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Survey No. 42/1, Pancard Club Road, Baner"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Google Maps Link / Share URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://maps.app.goo.gl/... or https://goo.gl/maps/..."
                    value={newGoogleMapsUrl}
                    onChange={(e) => setNewGoogleMapsUrl(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Paste your Google Maps location link to enable 1-tap navigation for clients
                  </span>
                </div>
              </div>

              {/* Pricing & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Starting Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Cover Photo URL
                  </label>
                  <input
                    type="url"
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  />
                </div>
              </div>

              {/* Dynamic Category Specifications */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Category Specific Attributes ({newCategory})
                </span>

                {newCategory === 'venues' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Max Guest Capacity</label>
                      <input
                        type="number"
                        value={venueCapacityMax}
                        onChange={(e) => setVenueCapacityMax(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Parking Slots</label>
                      <input
                        type="number"
                        value={venueParking}
                        onChange={(e) => setVenueParking(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl p-2"
                      />
                    </div>
                    <div className="flex items-center pt-4">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input
                          type="checkbox"
                          checked={venueHasAC}
                          onChange={(e) => setVenueHasAC(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Central AC Banquet</span>
                      </label>
                    </div>
                  </div>
                )}

                {newCategory === 'catering' && (
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Cuisine Type</label>
                    <select
                      value={caterVegType}
                      onChange={(e) => setCaterVegType(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs"
                    >
                      <option value="Pure Veg">Pure Veg Only (with Jain counters)</option>
                      <option value="Veg & Non-Veg">Veg & Non-Veg</option>
                    </select>
                  </div>
                )}

                {newCategory === 'photography' && (
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Delivery Timeline (Days)</label>
                    <input
                      type="number"
                      value={photoTimeline}
                      onChange={(e) => setPhotoTimeline(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Description & Highlights *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your venue layout, stage facilities, packages, or equipment..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-900 hover:bg-teal-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
              >
                Submit Listing for Admin Approval
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
