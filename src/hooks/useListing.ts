import { useApp } from '../context/AppContext';
import { Listing } from '../types';

export function useListing(id: string | null | undefined): {
  listing: Listing | undefined;
  isLoading: boolean;
  reviewsCount: number;
  averageRating: number;
} {
  const { getListingById } = useApp();

  if (!id) {
    return {
      listing: undefined,
      isLoading: false,
      reviewsCount: 0,
      averageRating: 0
    };
  }

  const listing = getListingById(id);

  return {
    listing,
    isLoading: false,
    reviewsCount: listing?.reviewCount || 0,
    averageRating: listing?.avgRating || 0
  };
}
