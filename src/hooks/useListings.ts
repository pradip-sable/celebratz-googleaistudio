import { useApp } from '../context/AppContext';
import { Listing, CategoryId, PuneLocality, EventType } from '../types';
import { parseSearchQuery, matchesSearchQuery } from '../utils/searchFilter';

export interface UseListingsFilters {
  city?: string;
  category?: CategoryId | 'all';
  locality?: PuneLocality | 'all';
  eventType?: EventType | 'all';
  searchQuery?: string;
}

export function useListings(customFilters?: UseListingsFilters) {
  const { listings, filteredListings, filters, setFilters, resetFilters } = useApp();

  // If custom filters are provided, calculate locally; otherwise return AppContext filtered listings
  if (!customFilters) {
    return {
      listings,
      filteredListings,
      totalCount: listings.length,
      filteredCount: filteredListings.length,
      filters,
      setFilters,
      resetFilters
    };
  }

  const parsedQuery = customFilters.searchQuery 
    ? parseSearchQuery(customFilters.searchQuery)
    : undefined;

  const result = listings.filter(item => {
    if (item.status !== 'active') return false;
    if (customFilters.city && (item.city || 'pune') !== customFilters.city) return false;
    if (customFilters.category && customFilters.category !== 'all' && item.category !== customFilters.category) return false;
    if (customFilters.locality && customFilters.locality !== 'all' && item.locality !== customFilters.locality) return false;
    if (customFilters.eventType && customFilters.eventType !== 'all' && !item.eventTypes.includes(customFilters.eventType)) return false;
    
    if (parsedQuery && parsedQuery.rawQuery) {
      return matchesSearchQuery(item, parsedQuery, customFilters.city || 'pune');
    }
    return true;
  });

  return {
    listings,
    filteredListings: result,
    totalCount: listings.length,
    filteredCount: result.length,
    filters,
    setFilters,
    resetFilters
  };
}

export function useFeaturedListings(city?: string) {
  const { listings } = useApp();
  const featured = listings.filter(l => {
    if (!l.isFeatured || l.status !== 'active') return false;
    if (city && (l.city || 'pune') !== city) return false;
    return true;
  });

  return {
    featuredListings: featured,
    count: featured.length
  };
}
