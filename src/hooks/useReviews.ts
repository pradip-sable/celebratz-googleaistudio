import { useApp } from '../context/AppContext';
import { Review, EventType } from '../types';

export function useListingReviews(listingId: string | null | undefined) {
  const { reviews, getListingReviews, addReview, isEligibleForReview, currentUser } = useApp();

  const listingReviews: Review[] = listingId ? getListingReviews(listingId) : [];
  const publishedReviews = listingReviews.filter(r => r.status === 'published');
  
  const eligibility = listingId && currentUser.id 
    ? isEligibleForReview(listingId, currentUser.id)
    : { eligible: false };

  const submitReview = (data: {
    rating: number;
    title: string;
    reviewText: string;
    photos?: string[];
    eventDate: string;
    eventType: EventType;
    enquiryId?: string;
  }) => {
    if (!listingId) return;
    addReview({
      listingId,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerAvatar: currentUser.avatar,
      rating: data.rating,
      title: data.title,
      reviewText: data.reviewText,
      photos: data.photos,
      eventDate: data.eventDate,
      eventType: data.eventType,
      enquiryId: data.enquiryId
    });
  };

  return {
    reviews: publishedReviews,
    allReviews: listingReviews,
    totalReviews: publishedReviews.length,
    eligibility,
    submitReview
  };
}
