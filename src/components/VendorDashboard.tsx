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
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Trash2,
  Link,
  Car,
  Utensils,
  Camera,
  Music,
  Flame,
  ShieldCheck,
  Check,
  Tag,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing, CategoryId, PuneLocality, EventType, CalendarStatus, CustomAttribute } from '../types';
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
  const [newEventTypes, setNewEventTypes] = useState<EventType[]>(['Wedding', 'Engagement']);

  // Photo management state (Cover + Multiple Gallery Photos)
  const [coverInputType, setCoverInputType] = useState<'upload' | 'url'>('upload');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80'
  ]);
  const [galleryUrlInput, setGalleryUrlInput] = useState<string>('');
  
  // Dynamic category-based attributes
  // Venues
  const [venueType, setVenueType] = useState<string>('Marriage Lawn & Garden');
  const [venueIndoorOutdoor, setVenueIndoorOutdoor] = useState<string>('Both Hall & Lawn');
  const [venueCapacityMin, setVenueCapacityMin] = useState<number>(200);
  const [venueCapacityMax, setVenueCapacityMax] = useState<number>(1000);
  const [venueParking, setVenueParking] = useState<number>(200);
  const [venueHasValet, setVenueHasValet] = useState<boolean>(true);
  const [venueHasAC, setVenueHasAC] = useState<boolean>(true);
  const [venueBridalRooms, setVenueBridalRooms] = useState<number>(2);
  const [venueCateringPolicy, setVenueCateringPolicy] = useState<string>('Both allowed');
  const [venueAlcoholPolicy, setVenueAlcoholPolicy] = useState<string>('Allowed with Permit');
  const [venuePowerBackup, setVenuePowerBackup] = useState<boolean>(true);

  // Photography
  const [photoTimeline, setPhotoTimeline] = useState<number>(21);
  const [photoTeamSize, setPhotoTeamSize] = useState<number>(4);
  const [photoCoverageTypes, setPhotoCoverageTypes] = useState<string[]>(['Candid Photography', 'Cinematic Wedding Film', '4K Drone Aerial']);
  const [photoDeliverables, setPhotoDeliverables] = useState<string>('Raw Photos + 400 Edited + Hardbound Silk Album + 4K Teaser & Full Film');
  const [photoEquipment, setPhotoEquipment] = useState<string>('Sony FX3 Cinema & A7S III, Ronin Gimbals, Godox Lighting Strobes');
  const [photoDroneAvailable, setPhotoDroneAvailable] = useState<boolean>(true);
  const [photoPreWedding, setPhotoPreWedding] = useState<boolean>(true);

  // Catering
  const [caterVegType, setCaterVegType] = useState<string>('Pure Veg');
  const [caterMinGuests, setCaterMinGuests] = useState<number>(50);
  const [caterCuisines, setCaterCuisines] = useState<string[]>(['Maharashtrian', 'North Indian', 'Chaat & Live Counters', 'Dessert & Mocktail Bar']);
  const [caterServiceStyle, setCaterServiceStyle] = useState<string>('Royal Buffet');
  const [caterCrockeryIncluded, setCaterCrockeryIncluded] = useState<boolean>(true);
  const [caterLiveCounters, setCaterLiveCounters] = useState<boolean>(true);
  const [caterWelcomeDrinks, setCaterWelcomeDrinks] = useState<boolean>(true);

  // Decoration
  const [decorStyles, setDecorStyles] = useState<string[]>(['Traditional Vedic Mandap', 'Floral Luxury & Exotic Blooms', 'Royal Peshwai / Maratha']);
  const [decorFlowerType, setDecorFlowerType] = useState<string>('Fresh Exotic & Desi Flowers');
  const [decorMandapCustom, setDecorMandapCustom] = useState<boolean>(true);
  const [decorLightingIncluded, setDecorLightingIncluded] = useState<boolean>(true);
  const [decorSetupHours, setDecorSetupHours] = useState<number>(6);

  // Music & DJ
  const [djWattage, setDjWattage] = useState<string>('10,000W RMS Line Array System');
  const [djGenres, setDjGenres] = useState<string[]>(['Bollywood', 'Marathi Zingaat & Kolhapuri', 'EDM & Commercial', 'Punjabi Beats']);
  const [djIncludesDholTasha, setDjIncludesDholTasha] = useState<boolean>(true);
  const [djVisualsLights, setDjVisualsLights] = useState<boolean>(true);
  const [djWirelessMics, setDjWirelessMics] = useState<number>(4);

  // Pandit / Priest
  const [panditExp, setPanditExp] = useState<number>(15);
  const [panditLanguages, setPanditLanguages] = useState<string[]>(['Marathi', 'Hindi', 'Sanskrit']);
  const [panditCeremonies, setPanditCeremonies] = useState<string[]>([
    'Vedic Vivah (Wedding)', 
    'Sakharpuda / Engagement', 
    'Griha Pravesh / Vastu', 
    'Satyanarayan Puja'
  ]);
  const [panditSamagriIncluded, setPanditSamagriIncluded] = useState<boolean>(true);
  const [panditMuhuratConsultation, setPanditMuhuratConsultation] = useState<boolean>(true);

  // Custom User Attributes (Key-Value pairs)
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([
    { label: 'Valet Parking', value: '10 Dedicated Chauffeurs Included' }
  ]);

  const [isListingCreated, setIsListingCreated] = useState<boolean>(false);

  // Handlers for Photo Uploads
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setNewCoverImage(result);
          setGalleryImages(prev => prev.includes(result) ? prev : [result, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: File[] = Array.from(e.target.files);
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setGalleryImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput.trim()) {
      setGalleryImages(prev => [...prev, galleryUrlInput.trim()]);
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setGalleryImages(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Handlers for Custom Attributes
  const handleAddCustomAttribute = () => {
    setCustomAttributes(prev => [...prev, { label: '', value: '' }]);
  };

  const handleUpdateCustomAttribute = (index: number, field: 'label' | 'value', value: string) => {
    setCustomAttributes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveCustomAttribute = (index: number) => {
    setCustomAttributes(prev => prev.filter((_, i) => i !== index));
  };

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

    // Build rich category attributes according to category
    let categoryAttrs: Record<string, any> = {};

    if (newCategory === 'venues') {
      categoryAttrs = {
        venueType,
        indoorOutdoor: venueIndoorOutdoor,
        capacityMin: Number(venueCapacityMin),
        capacityMax: Number(venueCapacityMax),
        parkingCapacity: Number(venueParking),
        hasValet: venueHasValet,
        hasAC: venueHasAC,
        roomCount: Number(venueBridalRooms),
        cateringPolicy: venueCateringPolicy,
        alcoholPolicy: venueAlcoholPolicy,
        powerBackup: venuePowerBackup
      };
    } else if (newCategory === 'photography') {
      categoryAttrs = {
        deliveryTimelineDays: Number(photoTimeline),
        teamSize: Number(photoTeamSize),
        coverageTypes: photoCoverageTypes,
        deliverables: [photoDeliverables],
        equipmentDetails: photoEquipment,
        droneAvailable: photoDroneAvailable,
        preWeddingAvailable: photoPreWedding
      };
    } else if (newCategory === 'catering') {
      categoryAttrs = {
        vegType: caterVegType,
        minGuestCount: Number(caterMinGuests),
        cuisines: caterCuisines,
        serviceStyle: caterServiceStyle,
        crockeryIncluded: caterCrockeryIncluded,
        liveCountersAvailable: caterLiveCounters,
        welcomeDrinksIncluded: caterWelcomeDrinks
      };
    } else if (newCategory === 'decoration') {
      categoryAttrs = {
        decorStyles,
        flowerType: decorFlowerType,
        mandapCustomization: decorMandapCustom,
        includesLighting: decorLightingIncluded,
        setupTimeHours: Number(decorSetupHours)
      };
    } else if (newCategory === 'music_dj') {
      categoryAttrs = {
        soundWattage: djWattage,
        genres: djGenres,
        includesDholTasha: djIncludesDholTasha,
        visualsAndLights: djVisualsLights,
        wirelessMicsCount: Number(djWirelessMics)
      };
    } else if (newCategory === 'pandit_priest') {
      categoryAttrs = {
        yearsExperience: Number(panditExp),
        languages: panditLanguages,
        ceremoniesSupported: panditCeremonies,
        samagriIncluded: panditSamagriIncluded,
        muhuratConsultation: panditMuhuratConsultation
      };
    }

    // Filter valid custom attributes
    const validCustomAttributes = customAttributes.filter(a => a.label.trim() && a.value.trim());

    // Ensure cover photo is part of gallery
    const finalGallery = galleryImages.length > 0 ? galleryImages : [newCoverImage];
    if (!finalGallery.includes(newCoverImage)) {
      finalGallery.unshift(newCoverImage);
    }

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
      categoryAttributes: categoryAttrs,
      customAttributes: validCustomAttributes,
      coverImage: newCoverImage,
      galleryImages: finalGallery,
      description: newDescription.trim() || `Premium ${newCategory} provider in ${selectedCityConfig?.name || 'Pune'}.`,
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

          {/* Month Navigation & Stats Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCalendarMonthOffset(prev => prev - 1)}
                  className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-serif font-bold text-base sm:text-lg text-stone-900 px-2 min-w-[140px] text-center">
                  {monthName}
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarMonthOffset(prev => prev + 1)}
                  className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {calendarMonthOffset !== 0 && (
                <button
                  type="button"
                  onClick={() => setCalendarMonthOffset(0)}
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 underline cursor-pointer"
                >
                  Current Month
                </button>
              )}
            </div>

            {/* Quick Summary Counts */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{calendarDays.filter(d => d.status === 'available').length} Available</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{calendarDays.filter(d => d.status === 'tentative').length} Tentative</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-950 border border-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>{calendarDays.filter(d => d.status === 'booked').length} Booked</span>
              </span>
            </div>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="p-1 sm:p-2 opacity-0 pointer-events-none" />
            ))}

            {calendarDays.map(({ dayNum, dateStr, status }) => {
              let btnStyle = 'bg-emerald-50/90 text-emerald-950 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100 shadow-2xs';
              let dotColor = 'bg-emerald-600';

              if (status === 'tentative') {
                btnStyle = 'bg-amber-100/90 text-amber-950 border-amber-400 hover:border-amber-600 hover:bg-amber-200 ring-1 ring-amber-400/50 shadow-xs';
                dotColor = 'bg-amber-500 ring-2 ring-amber-300';
              } else if (status === 'booked') {
                btnStyle = 'bg-rose-100 text-rose-950 border-rose-400 hover:border-rose-600 hover:bg-rose-200 ring-1 ring-rose-400/50 shadow-xs';
                dotColor = 'bg-rose-600 ring-2 ring-rose-300';
              }

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => currentListing && toggleCalendarDate(currentListing.id, dateStr)}
                  title={`${dateStr}: ${status.toUpperCase()} (Tap to toggle)`}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-h-[50px] sm:min-h-[58px] transition-all cursor-pointer select-none active:scale-95 ${btnStyle}`}
                >
                  <span className="font-serif font-extrabold text-xs sm:text-base leading-none">
                    {dayNum}
                  </span>
                  
                  {/* Solid Status Dot Indicator */}
                  <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${dotColor} shrink-0 transition-transform`} />
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

      {/* 5. CREATE NEW LISTING WITH DYNAMIC CATEGORY FIELDS & PHOTO UPLOADS */}
      {activeTab === 'new_listing' && (
        <form onSubmit={handleCreateListing} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-sm text-left">
          <div>
            <h2 className="font-serif font-bold text-2xl text-stone-900">List Your Venue or Service in {getCityById(newCity)?.name || 'Pune'}</h2>
            <p className="text-xs text-stone-500 mt-1">Upload high-resolution photos, configure category specifications, and add custom features for maximum booking enquiries.</p>
          </div>

          {isListingCreated ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 text-center rounded-2xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Listing Submitted for Approval!</h4>
              <p className="text-xs">Your listing has been created and placed in the admin approval queue.</p>
            </div>
          ) : (
            <div className="space-y-6">
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
                        newCategory === c.id ? 'bg-teal-900 text-white border-teal-900 shadow-xs' : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
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
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Pricing Unit
                  </label>
                  <input
                    type="text"
                    disabled
                    value={newCategory === 'catering' ? 'Per Plate (₹)' : 'Per Day / Event (₹)'}
                    className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-600 outline-hidden"
                  />
                </div>
              </div>

              {/* 📸 PHOTO UPLOAD SECTION (COVER PHOTO + MULTIPLE GALLERY PHOTOS) */}
              <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-700" />
                      Photos & Media Showcase
                    </h3>
                    <p className="text-xs text-stone-500">
                      Upload high-quality cover and gallery photos. Browse local files or paste image URLs.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/60 w-fit">
                    {galleryImages.length} Photo{galleryImages.length === 1 ? '' : 's'} in Gallery
                  </span>
                </div>

                {/* 1. Cover Photo Input */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-teal-800" />
                      Primary Cover Photo *
                    </label>
                    <div className="flex bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setCoverInputType('upload')}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          coverInputType === 'upload' ? 'bg-white shadow-xs text-teal-950 font-bold' : 'text-stone-600'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        Browse Device
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverInputType('url')}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          coverInputType === 'url' ? 'bg-white shadow-xs text-teal-950 font-bold' : 'text-stone-600'
                        }`}
                      >
                        <Link className="w-3 h-3" />
                        Image URL
                      </button>
                    </div>
                  </div>

                  {coverInputType === 'upload' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-teal-700 bg-stone-50 hover:bg-teal-50/40 rounded-xl p-4 cursor-pointer transition-colors text-center">
                        <Upload className="w-6 h-6 text-stone-400 mb-1" />
                        <span className="text-xs font-bold text-teal-900">Click to browse or drop local cover photo</span>
                        <span className="text-[10px] text-stone-500">Supports JPG, PNG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileUpload}
                          className="hidden"
                        />
                      </label>

                      {newCoverImage && (
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-stone-200 shadow-sm shrink-0">
                          <img
                            src={newCoverImage}
                            alt="Cover Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            Cover
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newCoverImage}
                        onChange={(e) => {
                          setNewCoverImage(e.target.value);
                          if (e.target.value && !galleryImages.includes(e.target.value)) {
                            setGalleryImages(prev => [e.target.value, ...prev]);
                          }
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                      />
                      {newCoverImage && (
                        <div className="w-32 h-20 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                          <img
                            src={newCoverImage}
                            alt="Cover Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Multiple Gallery Photos Input */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-700" />
                      Add Multiple Gallery Photos
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors self-start sm:self-auto">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse Local Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryFilesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or add via URL */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste additional image URL (e.g. banquet lawn, stage view)..."
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-900 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold shrink-0"
                    >
                      + Add URL
                    </button>
                  </div>

                  {/* Gallery Thumbnails List */}
                  {galleryImages.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                        Gallery Preview (Click trash to remove, primary cover has badge):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                        {galleryImages.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-4/3 bg-stone-100 shadow-xs">
                            <img
                              src={img}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {img === newCoverImage && (
                              <span className="absolute top-1 left-1 bg-teal-900/90 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md shadow-xs opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 🛠️ EXPANDED CATEGORY SPECIFIC ATTRIBUTES */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Default Specifications for {CATEGORIES.find(c => c.id === newCategory)?.name || newCategory}
                  </span>
                  <span className="text-[10px] text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                    Category Defaults
                  </span>
                </div>

                {/* 1. VENUES */}
                {newCategory === 'venues' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Venue Type</label>
                        <select
                          value={venueType}
                          onChange={(e) => setVenueType(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 font-medium"
                        >
                          <option value="Marriage Lawn & Garden">Marriage Lawn & Garden</option>
                          <option value="Banquet Hall">Banquet Hall</option>
                          <option value="Luxury Resort">Luxury Resort</option>
                          <option value="Hotel Ballroom">Hotel Ballroom</option>
                          <option value="Heritage Wada">Heritage Wada</option>
                          <option value="Terrace Villa">Terrace Villa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Setup Type</label>
                        <select
                          value={venueIndoorOutdoor}
                          onChange={(e) => setVenueIndoorOutdoor(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 font-medium"
                        >
                          <option value="Both Hall & Lawn">Both Indoor Hall & Open Lawn</option>
                          <option value="Indoor AC Hall">Indoor AC Hall Only</option>
                          <option value="Outdoor Lawn">Outdoor Lawn Only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Catering Policy</label>
                        <select
                          value={venueCateringPolicy}
                          onChange={(e) => setVenueCateringPolicy(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 font-medium"
                        >
                          <option value="Both allowed">In-house + Outside Allowed</option>
                          <option value="In-house only">In-house Catering Only</option>
                          <option value="Outside catering allowed">Outside Caterers Allowed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Min Guests (Pax)</label>
                        <input
                          type="number"
                          value={venueCapacityMin}
                          onChange={(e) => setVenueCapacityMin(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Max Guests (Pax)</label>
                        <input
                          type="number"
                          value={venueCapacityMax}
                          onChange={(e) => setVenueCapacityMax(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Parking Slots</label>
                        <input
                          type="number"
                          value={venueParking}
                          onChange={(e) => setVenueParking(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">AC Bridal Rooms</label>
                        <input
                          type="number"
                          value={venueBridalRooms}
                          onChange={(e) => setVenueBridalRooms(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                    </div>

                    {/* Checkbox Options */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={venueHasAC}
                          onChange={(e) => setVenueHasAC(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Central AC Banquet</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={venueHasValet}
                          onChange={(e) => setVenueHasValet(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Valet Parking</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={venuePowerBackup}
                          onChange={(e) => setVenuePowerBackup(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>100% DG Power Backup</span>
                      </label>
                      <div className="flex items-center p-2.5 bg-white rounded-xl border border-stone-200">
                        <select
                          value={venueAlcoholPolicy}
                          onChange={(e) => setVenueAlcoholPolicy(e.target.value)}
                          className="w-full bg-transparent outline-hidden font-medium text-stone-800"
                        >
                          <option value="Allowed with Permit">Alcohol: Permit Ok</option>
                          <option value="Strictly Not Allowed">Alcohol: Not Allowed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PHOTOGRAPHY */}
                {newCategory === 'photography' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Delivery Timeline (Days)</label>
                        <input
                          type="number"
                          value={photoTimeline}
                          onChange={(e) => setPhotoTimeline(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Team Crew Size</label>
                        <input
                          type="number"
                          value={photoTeamSize}
                          onChange={(e) => setPhotoTeamSize(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={photoDroneAvailable}
                            onChange={(e) => setPhotoDroneAvailable(e.target.checked)}
                            className="w-4 h-4 accent-teal-800"
                          />
                          <span>4K Drone Included</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={photoPreWedding}
                            onChange={(e) => setPhotoPreWedding(e.target.checked)}
                            className="w-4 h-4 accent-teal-800"
                          />
                          <span>Pre-Wedding Shoot</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Deliverables Package</label>
                      <input
                        type="text"
                        value={photoDeliverables}
                        onChange={(e) => setPhotoDeliverables(e.target.value)}
                        placeholder="Raw photos, 400 retouched, 40-page album, 4K film..."
                        className="w-full bg-white border border-stone-300 rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Camera & Lighting Equipment</label>
                      <input
                        type="text"
                        value={photoEquipment}
                        onChange={(e) => setPhotoEquipment(e.target.value)}
                        placeholder="Sony FX3 / A7S III, Ronin Gimbals, Godox Lighting..."
                        className="w-full bg-white border border-stone-300 rounded-xl p-2"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CATERING */}
                {newCategory === 'catering' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Food Category</label>
                        <select
                          value={caterVegType}
                          onChange={(e) => setCaterVegType(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 font-medium"
                        >
                          <option value="Pure Veg">Pure Veg Only (Jain Available)</option>
                          <option value="Veg & Non-Veg">Veg & Non-Veg (Separate Kitchens)</option>
                          <option value="Jain Options Available">Specialized Jain & Swaminarayan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Min Plates (Guests)</label>
                        <input
                          type="number"
                          value={caterMinGuests}
                          onChange={(e) => setCaterMinGuests(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Service Style</label>
                        <select
                          value={caterServiceStyle}
                          onChange={(e) => setCaterServiceStyle(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 font-medium"
                        >
                          <option value="Royal Buffet">Royal Buffet with Live Counters</option>
                          <option value="Sit-down Table Service">Traditional Sit-down Table Thali</option>
                          <option value="Interactive Live Counters">Live Street & Continental Counters</option>
                        </select>
                      </div>
                    </div>

                    {/* Cuisines Pills */}
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1.5">Cuisines Offered (Click to toggle)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Maharashtrian', 'North Indian', 'South Indian', 'Chaat & Live Counters', 'Continental & Italian', 'Dessert & Mocktail Bar', 'Mughlai & Biryani'].map(cuisine => {
                          const isSelected = caterCuisines.includes(cuisine);
                          return (
                            <button
                              key={cuisine}
                              type="button"
                              onClick={() => {
                                setCaterCuisines(prev => 
                                  isSelected ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-emerald-900 text-white border-emerald-900' 
                                  : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-700'
                              }`}
                            >
                              {cuisine} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={caterCrockeryIncluded}
                          onChange={(e) => setCaterCrockeryIncluded(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Bone China / Brass Crockery</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={caterLiveCounters}
                          onChange={(e) => setCaterLiveCounters(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Live Chaat / Dosa Stations</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={caterWelcomeDrinks}
                          onChange={(e) => setCaterWelcomeDrinks(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Welcome Mocktail Bar</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. DECORATION */}
                {newCategory === 'decoration' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Flower Sourcing</label>
                        <select
                          value={decorFlowerType}
                          onChange={(e) => setDecorFlowerType(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 font-medium"
                        >
                          <option value="Fresh Exotic & Desi Flowers">Fresh Exotic & Desi Flowers (Roses, Orchids, Marigold)</option>
                          <option value="Premium Artificial Silk">Premium High-grade Silk Flowers</option>
                          <option value="Hybrid (Fresh + Silk)">Hybrid (Fresh Mandap + Silk Backdrops)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Setup Duration Prior (Hours)</label>
                        <input
                          type="number"
                          value={decorSetupHours}
                          onChange={(e) => setDecorSetupHours(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1.5">Decoration Themes Supported</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Traditional Vedic Mandap', 'Royal Peshwai / Maratha', 'Floral Luxury & Exotic Blooms', 'Minimalist Boho / Pastel', 'Grand LED & Crystal', 'Outdoor Canopy'].map(theme => {
                          const isSelected = decorStyles.includes(theme);
                          return (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => {
                                setDecorStyles(prev => 
                                  isSelected ? prev.filter(t => t !== theme) : [...prev, theme]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-rose-900 text-white border-rose-900' 
                                  : 'bg-white text-stone-700 border-stone-300 hover:border-rose-700'
                              }`}
                            >
                              {theme} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={decorMandapCustom}
                          onChange={(e) => setDecorMandapCustom(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>100% Custom Mandap & Havan Kund Setup</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={decorLightingIncluded}
                          onChange={(e) => setDecorLightingIncluded(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Full Ambient LED, Focus Spotlights & Truss Setup</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 5. MUSIC & DJ */}
                {newCategory === 'music_dj' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Sound Wattage</label>
                        <input
                          type="text"
                          value={djWattage}
                          onChange={(e) => setDjWattage(e.target.value)}
                          placeholder="e.g. 10,000W RMS Line Array"
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Cordless Wireless Mics</label>
                        <input
                          type="number"
                          value={djWirelessMics}
                          onChange={(e) => setDjWirelessMics(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1.5">Music Genres</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Bollywood', 'Marathi Zingaat & Kolhapuri', 'EDM & Commercial', 'Punjabi Beats', 'Classical Shehnai / Fusion', 'English Pop'].map(g => {
                          const isSelected = djGenres.includes(g);
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setDjGenres(prev => 
                                  isSelected ? prev.filter(item => item !== g) : [...prev, g]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-purple-900 text-white border-purple-900' 
                                  : 'bg-white text-stone-700 border-stone-300'
                              }`}
                            >
                              {g} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={djIncludesDholTasha}
                          onChange={(e) => setDjIncludesDholTasha(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>Live Puneri Dhol Tasha Pathak Available</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={djVisualsLights}
                          onChange={(e) => setDjVisualsLights(e.target.checked)}
                          className="w-4 h-4 accent-teal-800"
                        />
                        <span>LED Video Wall, Sharpies & Fog Machines</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 6. PANDIT & PRIEST */}
                {newCategory === 'pandit_priest' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Years of Vedic Experience</label>
                        <input
                          type="number"
                          value={panditExp}
                          onChange={(e) => setPanditExp(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={panditSamagriIncluded}
                            onChange={(e) => setPanditSamagriIncluded(e.target.checked)}
                            className="w-4 h-4 accent-teal-800"
                          />
                          <span>Complete Havan & Puja Samagri Included</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={panditMuhuratConsultation}
                            onChange={(e) => setPanditMuhuratConsultation(e.target.checked)}
                            className="w-4 h-4 accent-teal-800"
                          />
                          <span>Kundali & Shubh Muhurat Consultation</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1.5">Rituals & Ceremonies Supported</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Vedic Vivah (Wedding)', 'Sakharpuda / Engagement', 'Griha Pravesh / Vastu', 'Satyanarayan Puja', 'Upanayan (Thread Ceremony)'].map(ceremony => {
                          const isSelected = panditCeremonies.includes(ceremony);
                          return (
                            <button
                              key={ceremony}
                              type="button"
                              onClick={() => {
                                setPanditCeremonies(prev => 
                                  isSelected ? prev.filter(c => c !== ceremony) : [...prev, ceremony]
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-orange-900 text-white border-orange-900' 
                                  : 'bg-white text-stone-700 border-stone-300'
                              }`}
                            >
                              {ceremony} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 🏷️ CUSTOM VENDOR ATTRIBUTES / HIGHLIGHTS BUILDER */}
              <div className="p-5 bg-teal-50/40 rounded-2xl border border-teal-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-teal-800" />
                      Custom Features & Highlights
                    </h3>
                    <p className="text-xs text-stone-500">
                      Add any custom key-value details unique to your service (e.g. "Chauffeur Service", "Sound Curfew", "Bridal Dressing Studio", "Eco-friendly Decor").
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomAttribute}
                    className="px-3 py-1.5 bg-teal-900 hover:bg-teal-950 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Feature</span>
                  </button>
                </div>

                {customAttributes.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">
                    No custom features added yet. Click &quot;Add Custom Feature&quot; above to add your own bullet points.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {customAttributes.map((attr, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                        <div className="w-1/3">
                          <input
                            type="text"
                            placeholder="Feature Name (e.g. Valet Parking)"
                            value={attr.label}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'label', e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-semibold outline-hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Feature Details (e.g. 10 Dedicated Drivers Included)"
                            value={attr.value}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'value', e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 outline-hidden"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomAttribute(idx)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove custom feature"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
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
