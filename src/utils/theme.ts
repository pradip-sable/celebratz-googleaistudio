export const formatIndianCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const getDaysAgoText = (isoString: string): { text: string; isStale: boolean } => {
  const diffTime = Math.abs(Date.now() - new Date(isoString).getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return { text: 'Updated today', isStale: false };
  if (diffDays === 1) return { text: 'Updated yesterday', isStale: false };
  if (diffDays <= 30) return { text: `Updated ${diffDays} days ago`, isStale: false };
  
  return { text: `Updated ${diffDays} days ago`, isStale: true };
};
