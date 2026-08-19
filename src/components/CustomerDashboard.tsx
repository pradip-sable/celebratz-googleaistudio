import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Heart, 
  Star, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { formatIndianCurrency } from '../utils/theme';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    enquiries, 
    listings, 
    wishlist, 
    reviews, 
    addReview, 
    setSelectedListingId,
    setActiveRoute 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'wishlist' | 'reviews' | 'profile'>('requests');

  // Review Form state
  const [reviewingEnquiryId, setReviewingEnquiryId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  const myEnquiries = enquiries.filter(e => e.customerId === currentUser.id);
  const myWishlistListings = listings.filter(l => wishlist.includes(l.id));
  const myReviews = reviews.filter(r => r.customerId === currentUser.id);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleReviewSubmit = (enquiry: typeof myEnquiries[0]) => {
    if (!reviewTitle.trim() || !reviewText.trim()) return;

    addReview({
      listingId: enquiry.listingId,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerAvatar: currentUser.avatar,
      enquiryId: enquiry.id,
      rating: reviewRating,
      title: reviewTitle.trim(),
      reviewText: reviewText.trim(),
      eventDate: enquiry.eventDate,
      eventType: enquiry.eventType
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewingEnquiryId(null);
      setReviewSuccess(false);
      setReviewTitle('');
      setReviewText('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">{currentUser.fullName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-900 border border-teal-200">
                Customer
              </span>
            </div>
            <p className="text-xs text-stone-500">{currentUser.email} &bull; {currentUser.phoneNumber || 'Mobile number entered on first enquiry'}</p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-2xl w-full sm:w-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'requests' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Requests ({myEnquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'wishlist' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Wishlist ({myWishlistListings.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'reviews' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Reviews ({myReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-white text-teal-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* 1. MY REQUESTS & BOOKINGS TAB */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-stone-900">Celebration Enquiries & Booking Requests</h2>
            <button
              onClick={() => setActiveRoute('search')}
              className="text-xs font-bold text-teal-900 hover:underline"
            >
              + Find another vendor
            </button>
          </div>

          {myEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <CalendarCheck className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-stone-900">No requests sent yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explore venues and vendors in Pune, check their availability calendar, and request a booking or walkthrough visit.
              </p>
              <button
                onClick={() => setActiveRoute('search')}
                className="px-4 py-2 bg-teal-900 text-white rounded-xl text-xs font-bold"
              >
                Browse Pune Vendors
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myEnquiries.map(enquiry => {
                const isEventPast = enquiry.eventDate <= todayStr;
                const isAccepted = enquiry.vendorStatus === 'accepted';
                const hasReviewed = reviews.some(r => r.enquiryId === enquiry.id || (r.listingId === enquiry.listingId && r.customerId === currentUser.id));

                return (
                  <div key={enquiry.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={enquiry.listingCoverImage}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 
                              onClick={() => setSelectedListingId(enquiry.listingId)}
                              className="font-serif font-bold text-base text-stone-900 hover:text-teal-900 cursor-pointer"
                            >
                              {enquiry.listingTitle}
                            </h3>
                          </div>
                          <p className="text-xs text-stone-500">
                            {enquiry.eventType} &bull; Date: <span className="font-semibold text-stone-800">{enquiry.eventDate}</span>
                            {enquiry.guestCount ? ` • ~${enquiry.guestCount} Guests` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {enquiry.vendorStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                            <Clock className="w-3.5 h-3.5" />
                            Pending Vendor Review
                          </span>
                        )}
                        {enquiry.vendorStatus === 'accepted' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Request Accepted 🎉
                          </span>
                        )}
                        {enquiry.vendorStatus === 'declined' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
                            <XCircle className="w-3.5 h-3.5" />
                            Declined by Vendor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer Message & Vendor Response note */}
                    <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs space-y-2">
                      <div className="text-stone-700">
                        <span className="font-bold text-stone-900">Your Message:</span> "{enquiry.message}"
                        {enquiry.preferredVisitTime && (
                          <span className="block text-[11px] text-stone-500 mt-0.5">
                            Preferred Visit/Call: {enquiry.preferredVisitTime}
                          </span>
                        )}
                      </div>

                      {enquiry.vendorResponseNote && (
                        <div className="pt-2 border-t border-stone-200/80 text-teal-950 font-medium">
                          <span className="font-bold text-stone-900">Vendor Reply:</span> "{enquiry.vendorResponseNote}"
                        </div>
                      )}
                    </div>

                    {/* Post-Event Review Trigger (if accepted and date has passed) */}
                    {isAccepted && isEventPast && !hasReviewed && (
                      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-stone-900">Your event date has passed!</span>
                            <p className="text-[11px] text-stone-600">How was your celebration with {enquiry.vendorName}? Leave a verified review.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setReviewingEnquiryId(enquiry.id)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                        >
                          Write Review
                        </button>
                      </div>
                    )}

                    {/* Review Form Dialog inline */}
                    {reviewingEnquiryId === enquiry.id && (
                      <div className="p-5 bg-white rounded-2xl border-2 border-amber-300 space-y-3 animate-in fade-in">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm text-stone-900">Review {enquiry.listingTitle}</h4>
                          <button onClick={() => setReviewingEnquiryId(null)} className="text-stone-400">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>

                        {reviewSuccess ? (
                          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Thank you! Your verified review has been published.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-1 text-amber-500">
                              <span className="text-xs font-semibold text-stone-700 mr-2">Rating:</span>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                >
                                  <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                                </button>
                              ))}
                            </div>

                            <input
                              type="text"
                              placeholder="Review Headline (e.g. Magnificent lawn for our 800 guests)"
                              value={reviewTitle}
                              onChange={(e) => setReviewTitle(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-hidden"
                            />

                            <textarea
                              rows={3}
                              placeholder="Tell other Pune families about the management, parking, hospitality, food, or photo quality..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs outline-hidden resize-none"
                            />

                            <button
                              onClick={() => handleReviewSubmit(enquiry)}
                              className="px-5 py-2.5 bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs"
                            >
                              Submit Verified Review
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Saved Venues & Vendors ({myWishlistListings.length})</h2>
          {myWishlistListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-stone-900">No saved favorites yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Tap the heart icon on any venue or vendor card to save it for quick comparison.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myWishlistListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MY REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">My Published Reviews ({myReviews.length})</h2>
          {myReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Star className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-stone-900">No reviews published yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Reviews become eligible once your event date has passed after vendor acceptance.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-amber-500' : 'text-stone-300'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-500">Submitted on {r.eventDate}</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">{r.title}</h4>
                  <p className="text-xs text-stone-600 font-light">{r.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-xl space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">Account Preferences</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={currentUser.fullName}
                onChange={(e) => setCurrentUser({ ...currentUser, fullName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-stone-100 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-500 font-medium outline-hidden cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Primary Phone Number (+91)
              </label>
              <input
                type="text"
                value={currentUser.phoneNumber || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, phoneNumber: e.target.value })}
                placeholder="+91 98230 45678"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-medium outline-hidden"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Note: In Phase 1 launch, double-entry verification is used. Real SMS OTP via DLT registration will be wired in Phase 2.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
