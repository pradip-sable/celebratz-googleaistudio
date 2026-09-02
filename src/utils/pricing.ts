import { Listing, Package, ComboPackage, ListingTier, PricingPackage } from '../types';

/**
 * Calculates the effective price of a listing.
 * - If 2+ active tiers exist, effective price = lowest active tier's price.
 * - Otherwise (0 tiers), effective price = listing.price_from (or startingPrice).
 * Untiered listings keep price_from as their single source of truth.
 */
export function getEffectivePrice(listing: Listing): number {
  // Check for formal listing_tiers (2+ required)
  const activeFormalTiers = (listing.listing_tiers || []).filter(
    t => t.is_active !== false && t.status !== 'rejected'
  );

  if (activeFormalTiers.length >= 2) {
    return Math.min(...activeFormalTiers.map(t => t.price));
  }

  // Fallback check for pricingPackages
  const activePricingPackages = (listing.pricingPackages || []).filter(
    p => p.status !== 'rejected'
  );
  if (activePricingPackages.length >= 2) {
    return Math.min(...activePricingPackages.map(p => p.price));
  }

  return listing.price_from ?? listing.startingPrice;
}

export interface PackagePriceCalculation {
  startingPrice: number;
  rawSum: number;
  discountAmount: number;
  discountPercentage: number;
  components: {
    listing: Listing;
    effectivePrice: number;
    priceUnit: string;
  }[];
}

/**
 * Computes package price at READ TIME (never stored).
 * Sums each component listing's effective price -> applies discount.
 */
export function calculatePackagePrice(
  pkg: Package | ComboPackage,
  allListings: Listing[]
): PackagePriceCalculation {
  const componentIds = 'listing_ids' in pkg ? pkg.listing_ids : pkg.includedListingIds;
  const componentsList: Listing[] = [];

  componentIds.forEach(id => {
    const l = allListings.find(item => item.id === id);
    if (l) componentsList.push(l);
  });

  const components = componentsList.map(listing => ({
    listing,
    effectivePrice: getEffectivePrice(listing),
    priceUnit: listing.pricingUnit || 'event'
  }));

  const rawSum = components.reduce((acc, c) => acc + c.effectivePrice, 0);

  let discountAmount = 0;
  let discountPercentage = 0;

  if ('discount_type' in pkg) {
    if (pkg.discount_type === 'percentage') {
      discountPercentage = pkg.discount_value;
      discountAmount = Math.round((rawSum * pkg.discount_value) / 100);
    } else {
      discountAmount = pkg.discount_value;
      discountPercentage = rawSum > 0 ? Math.round((discountAmount / rawSum) * 100) : 0;
    }
  } else if ('comboPrice' in pkg && pkg.comboPrice > 0) {
    // Legacy ComboPackage fallback
    discountAmount = Math.max(0, rawSum - pkg.comboPrice);
    discountPercentage = rawSum > 0 ? Math.round((discountAmount / rawSum) * 100) : 0;
  }

  const startingPrice = Math.max(0, rawSum - discountAmount);

  return {
    startingPrice,
    rawSum,
    discountAmount,
    discountPercentage,
    components
  };
}

export interface PackageAvailability {
  status: 'available' | 'tentative' | 'booked' | 'check_with_vendor';
  label: string;
  isStale: boolean;
  staleListingTitles: string[];
}

/**
 * Derives package availability from component listings.
 * Never manually set.
 * Rules:
 * 1. Any component stale (>30 days unupdated calendar) -> "Check with vendor"
 * 2. Any component Booked -> Booked
 * 3. All components Available -> Available
 * 4. Else -> Tentative
 */
export function getPackageAvailability(
  pkg: Package | ComboPackage,
  dateStr: string,
  allListings: Listing[]
): PackageAvailability {
  const componentIds = 'listing_ids' in pkg ? pkg.listing_ids : pkg.includedListingIds;
  const components = allListings.filter(l => componentIds.includes(l.id));

  if (components.length === 0) {
    return {
      status: 'check_with_vendor',
      label: 'Check with vendor',
      isStale: false,
      staleListingTitles: []
    };
  }

  const now = new Date();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const staleComponents: string[] = [];

  for (const comp of components) {
    if (comp.calendarLastUpdatedAt) {
      const updatedDate = new Date(comp.calendarLastUpdatedAt);
      if (now.getTime() - updatedDate.getTime() > thirtyDaysMs) {
        staleComponents.push(comp.title);
      }
    }
  }

  if (staleComponents.length > 0) {
    return {
      status: 'check_with_vendor',
      label: 'Check with vendor',
      isStale: true,
      staleListingTitles: staleComponents
    };
  }

  // Check booked status for the date
  const hasBooked = components.some(c => c.calendar && c.calendar[dateStr] === 'booked');
  if (hasBooked) {
    return {
      status: 'booked',
      label: 'Booked',
      isStale: false,
      staleListingTitles: []
    };
  }

  // Check if all available
  const allAvailable = components.every(
    c => c.calendar && (c.calendar[dateStr] === 'available' || !c.calendar[dateStr])
  );
  if (allAvailable) {
    return {
      status: 'available',
      label: 'Available',
      isStale: false,
      staleListingTitles: []
    };
  }

  return {
    status: 'tentative',
    label: 'Tentative',
    isStale: false,
    staleListingTitles: []
  };
}

export interface ReviewRollup {
  avgRating: number;
  reviewCount: number;
}

/**
 * Computes a rating rollup weighted by each component's review count.
 * Note: Ratings come from individual services; packages do not have separate review systems.
 */
export function getPackageReviewRollup(
  pkg: Package | ComboPackage,
  allListings: Listing[]
): ReviewRollup {
  const componentIds = 'listing_ids' in pkg ? pkg.listing_ids : pkg.includedListingIds;
  const components = allListings.filter(l => componentIds.includes(l.id));

  let totalWeight = 0;
  let weightedScore = 0;

  for (const comp of components) {
    const count = comp.reviewCount || 0;
    const rating = comp.avgRating || 0;
    if (count > 0 && rating > 0) {
      weightedScore += rating * count;
      totalWeight += count;
    }
  }

  if (totalWeight > 0) {
    const avg = Math.round((weightedScore / totalWeight) * 10) / 10;
    return { avgRating: avg, reviewCount: totalWeight };
  }

  // Default fallback if no reviews yet
  return { avgRating: 4.8, reviewCount: 0 };
}

export interface PackagePublicVisibility {
  isPubliclyVisible: boolean;
  liveComponentCount: number;
  totalComponentCount: number;
  inactiveComponents: Listing[];
  reason?: string;
}

/**
 * Evaluates public visibility edge cases.
 * If a package drops below 2 live components (vendor pauses one, or admin rejects one),
 * auto-hide it from public view without changing its stored status, and show the vendor an
 * "inactive — component not live" notice.
 */
export function getPackagePublicVisibility(
  pkg: Package | ComboPackage,
  allListings: Listing[]
): PackagePublicVisibility {
  const componentIds = 'listing_ids' in pkg ? pkg.listing_ids : pkg.includedListingIds;
  const components = allListings.filter(l => componentIds.includes(l.id));
  
  const liveComponents = components.filter(
    l => l.status === 'active'
  );
  const inactiveComponents = components.filter(
    l => l.status !== 'active'
  );

  const status = 'status' in pkg ? pkg.status : 'active';
  const isApproved = status === 'live' || status === 'active';
  const hasMinComponents = liveComponents.length >= 2;

  const isPubliclyVisible = isApproved && hasMinComponents;

  let reason: string | undefined;
  if (!isApproved) {
    reason = status === 'pending' || status === 'pending_approval'
      ? 'Under moderation review'
      : status === 'paused'
      ? 'Paused by vendor'
      : 'Rejected by admin';
  } else if (!hasMinComponents) {
    reason = 'inactive — component not live';
  }

  return {
    isPubliclyVisible,
    liveComponentCount: liveComponents.length,
    totalComponentCount: components.length,
    inactiveComponents,
    reason
  };
}

/**
 * Determines whether listing edits constitute a material change.
 * Rule: Only material changes — price, tiers, title, category — send a live listing
 * back to pending for re-approval. Description and photo edits stay live without re-review.
 */
export function isMaterialListingChange(
  current: Listing,
  updated: Partial<Listing>
): boolean {
  // Check price
  if (updated.startingPrice !== undefined && updated.startingPrice !== current.startingPrice) {
    return true;
  }
  if (updated.price_from !== undefined && updated.price_from !== current.price_from) {
    return true;
  }

  // Check title
  if (updated.title !== undefined && updated.title.trim() !== current.title.trim()) {
    return true;
  }

  // Check category
  if (updated.category !== undefined && updated.category !== current.category) {
    return true;
  }

  // Check tiers change
  if (updated.listing_tiers !== undefined) {
    const currTiers = current.listing_tiers || [];
    if (currTiers.length !== updated.listing_tiers.length) return true;
    for (let i = 0; i < currTiers.length; i++) {
      const c = currTiers[i];
      const u = updated.listing_tiers[i];
      if (c.name !== u.name || c.price !== u.price || c.is_active !== u.is_active) {
        return true;
      }
    }
  }

  // Check legacy pricingPackages change
  if (updated.pricingPackages !== undefined) {
    const currPkgs = current.pricingPackages || [];
    if (currPkgs.length !== updated.pricingPackages.length) return true;
    for (let i = 0; i < currPkgs.length; i++) {
      const c = currPkgs[i];
      const u = updated.pricingPackages[i];
      if (c.name !== u.name || c.price !== u.price) {
        return true;
      }
    }
  }

  return false;
}
