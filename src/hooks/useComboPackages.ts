import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ComboPackage, EventType } from '../types';

export interface UseComboPackagesFilters {
  city?: string;
  eventType?: EventType | 'all';
  searchQuery?: string;
}

export function useComboPackages(filters?: UseComboPackagesFilters) {
  const { comboPackages, addComboPackage, updateComboPackage, deleteComboPackage, approveComboPackage, rejectComboPackage } = useApp();

  const filteredCombos = useMemo(() => {
    if (!filters) return comboPackages;

    return comboPackages.filter(combo => {
      if (combo.status !== 'active') return false;
      if (filters.city && (combo.city || 'pune') !== filters.city) return false;
      if (filters.eventType && filters.eventType !== 'all' && !combo.eventTypes.includes(filters.eventType)) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = combo.title.toLowerCase().includes(q);
        const matchesDesc = combo.description.toLowerCase().includes(q);
        const matchesServices = combo.includedServices.some(s => s.listingTitle.toLowerCase().includes(q) || s.category.includes(q));
        return matchesTitle || matchesDesc || matchesServices;
      }
      return true;
    });
  }, [comboPackages, filters]);

  return {
    comboPackages,
    filteredCombos,
    totalCount: comboPackages.length,
    filteredCount: filteredCombos.length,
    addComboPackage,
    updateComboPackage,
    deleteComboPackage,
    approveComboPackage,
    rejectComboPackage
  };
}
