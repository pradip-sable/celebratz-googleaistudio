import { useApp } from '../context/AppContext';
import { Listing } from '../types';

export function useComparison() {
  const { comparisonList, toggleComparison, clearComparison, listings } = useApp();

  const comparedListings: Listing[] = comparisonList
    .map(id => listings.find(l => l.id === id))
    .filter((l): l is Listing => Boolean(l));

  const isComparisonFull = comparisonList.length >= 3;
  const isCompared = (id: string) => comparisonList.includes(id);

  return {
    comparisonList,
    comparedListings,
    count: comparisonList.length,
    isComparisonFull,
    isCompared,
    toggleComparison,
    clearComparison
  };
}
