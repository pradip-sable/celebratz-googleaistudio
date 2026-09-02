import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ComboPackage, Enquiry, User } from '../types';

export interface VendorProfileData {
  vendorUser?: User;
  vendorName: string;
  vendorPhone?: string;
  vendorEmail?: string;
  listings: Listing[];
  comboPackages: ComboPackage[];
  enquiries: Enquiry[];
  avgRating: number;
  totalReviews: number;
  activeListingsCount: number;
}

export function useVendorProfile(vendorId?: string): VendorProfileData {
  const { listings, comboPackages, enquiries, currentUser } = useApp();

  const effectiveVendorId = vendorId || currentUser?.id || 'user_vendor_1';

  return useMemo(() => {
    const vendorListings = listings.filter(l => l.vendorId === effectiveVendorId);
    const vendorCombos = comboPackages.filter(c => c.vendorId === effectiveVendorId);
    const vendorEnquiries = enquiries.filter(e => e.vendorId === effectiveVendorId);

    const totalReviews = vendorListings.reduce((sum, l) => sum + (l.reviewCount || 0), 0);
    const weightedRatingSum = vendorListings.reduce((sum, l) => sum + (l.avgRating || 0) * (l.reviewCount || 0), 0);
    const avgRating = totalReviews > 0 ? Number((weightedRatingSum / totalReviews).toFixed(1)) : 4.9;

    const firstListing = vendorListings[0];
    const vendorName = currentUser?.id === effectiveVendorId 
      ? (currentUser.businessName || currentUser.fullName || 'Verified Celebratz Vendor')
      : (firstListing?.vendorName || 'Verified Celebratz Vendor');

    const vendorPhone = currentUser?.id === effectiveVendorId 
      ? currentUser.phoneNumber 
      : firstListing?.vendorPhone;

    const vendorEmail = currentUser?.id === effectiveVendorId 
      ? currentUser.email 
      : firstListing?.vendorEmail;

    return {
      vendorUser: currentUser?.id === effectiveVendorId ? currentUser : undefined,
      vendorName,
      vendorPhone,
      vendorEmail,
      listings: vendorListings,
      comboPackages: vendorCombos,
      enquiries: vendorEnquiries,
      avgRating,
      totalReviews,
      activeListingsCount: vendorListings.filter(l => l.status === 'active').length
    };
  }, [effectiveVendorId, listings, comboPackages, enquiries, currentUser]);
}
