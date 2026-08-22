import { useApp } from '../context/AppContext';
import { Listing } from '../types';

export function useWishlist() {
  const { wishlist, toggleWishlist, isInWishlist, listings } = useApp();

  const wishlistListings: Listing[] = listings.filter(l => wishlist.includes(l.id));

  return {
    wishlistIds: wishlist,
    wishlistListings,
    count: wishlist.length,
    toggleWishlist,
    isInWishlist
  };
}
