import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Package, ComboPackage, EventType, Listing } from '../types';
import { 
  getEffectivePrice, 
  calculatePackagePrice, 
  getPackageAvailability, 
  getPackageReviewRollup, 
  getPackagePublicVisibility 
} from '../utils/pricing';

export interface UsePackagesFilters {
  city?: string;
  eventType?: EventType | 'all';
  searchQuery?: string;
  vendorId?: string;
}

export function usePackages(filtersOrVendorId?: UsePackagesFilters | string) {
  const filters: UsePackagesFilters | undefined = typeof filtersOrVendorId === 'string'
    ? { vendorId: filtersOrVendorId }
    : filtersOrVendorId;

  const { 
    comboPackages, 
    listings, 
    addComboPackage, 
    updateComboPackage, 
    deleteComboPackage, 
    approveComboPackage, 
    rejectComboPackage 
  } = useApp();

  const targetVendorId = filters?.vendorId;

  // Vendor's packages list (raw ComboPackage[])
  const vendorPackages = useMemo(() => {
    if (!targetVendorId) return [];
    return comboPackages.filter(p => p.vendorId === targetVendorId || (targetVendorId === 'user_vendor_1' && p.vendorId === 'user_vendor_1'));
  }, [comboPackages, targetVendorId]);

  // Packages that pass public visibility check:
  // Must be approved AND have at least 2 live component listings
  const publicPackages = useMemo(() => {
    return comboPackages.filter(pkg => {
      const visibility = getPackagePublicVisibility(pkg, listings);
      if (!visibility.isPubliclyVisible) return false;

      if (filters) {
        if (filters.city && (pkg.city || 'pune') !== filters.city) return false;
        if (filters.eventType && filters.eventType !== 'all' && !pkg.eventTypes.includes(filters.eventType)) return false;
        if (filters.vendorId && pkg.vendorId !== filters.vendorId) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = pkg.title.toLowerCase().includes(q);
          const matchesDesc = pkg.description.toLowerCase().includes(q);
          const matchesComponent = (pkg.includedServices || []).some(
            s => s.listingTitle.toLowerCase().includes(q) || s.category.includes(q)
          );
          if (!matchesTitle && !matchesDesc && !matchesComponent) return false;
        }
      }

      return true;
    });
  }, [comboPackages, listings, filters]);

  // Vendor's own packages with component health analysis
  const getVendorPackages = (vendorId: string) => {
    return comboPackages
      .filter(p => p.vendorId === vendorId || (vendorId === 'user_vendor_1' && p.vendorId === 'user_vendor_1'))
      .map(pkg => {
        const visibility = getPackagePublicVisibility(pkg, listings);
        const priceCalc = calculatePackagePrice(pkg, listings);
        const reviews = getPackageReviewRollup(pkg, listings);
        return {
          package: pkg,
          visibility,
          priceCalc,
          reviews
        };
      });
  };

  // Packages containing a specific listing as a component
  const getPackagesForListing = (listingId: string) => {
    return comboPackages.filter(pkg => {
      const isIncluded = pkg.includedListingIds.includes(listingId);
      if (!isIncluded) return false;
      const visibility = getPackagePublicVisibility(pkg, listings);
      return visibility.isPubliclyVisible;
    });
  };

  // Direct helper wrappers
  const getPackageVisibility = (pkg: ComboPackage) => getPackagePublicVisibility(pkg, listings);
  const getPackagePriceInfo = (pkg: ComboPackage) => calculatePackagePrice(pkg, listings);
  const getPackageAvailabilityStatus = (pkg: ComboPackage, checkDateStr?: string) =>
    getPackageAvailability(pkg, checkDateStr || new Date().toISOString().split('T')[0], listings);

  // Full detail helper for a single package
  const getPackageDetails = (packageId: string, checkDateStr?: string) => {
    const pkg = comboPackages.find(p => p.id === packageId);
    if (!pkg) return null;

    const priceCalc = calculatePackagePrice(pkg, listings);
    const reviews = getPackageReviewRollup(pkg, listings);
    const visibility = getPackagePublicVisibility(pkg, listings);
    const availability = getPackageAvailability(
      pkg, 
      checkDateStr || new Date().toISOString().split('T')[0], 
      listings
    );

    return {
      package: pkg,
      priceCalc,
      reviews,
      visibility,
      availability
    };
  };

  return {
    allPackages: comboPackages,
    publicPackages,
    vendorPackages,
    totalCount: comboPackages.length,
    publicCount: publicPackages.length,
    getVendorPackages,
    getPackagesForListing,
    getPackageDetails,
    getPackageVisibility,
    getPackagePriceInfo,
    getPackageAvailability: getPackageAvailabilityStatus,
    addPackage: addComboPackage,
    updatePackage: updateComboPackage,
    deletePackage: deleteComboPackage,
    approvePackage: approveComboPackage,
    rejectPackage: rejectComboPackage
  };
}
