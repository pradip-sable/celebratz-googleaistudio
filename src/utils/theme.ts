import { DesignPalette } from '../types';

export const getThemeClasses = (palette: DesignPalette) => {
  switch (palette) {
    case 'rose_ruby':
      return {
        primary: 'bg-rose-900 text-amber-50 hover:bg-rose-950',
        primaryText: 'text-rose-950',
        accentText: 'text-amber-700',
        accentBg: 'bg-amber-100 text-amber-900 border-amber-300',
        borderAccent: 'border-rose-300 focus:border-rose-600',
        gradientHeader: 'from-rose-950 via-rose-900 to-amber-950 text-white',
        badgeBg: 'bg-rose-100 text-rose-900',
        cardBorder: 'border-rose-100/80',
        buttonPrimary: 'bg-rose-900 text-white hover:bg-rose-800 shadow-sm shadow-rose-950/20',
        buttonSecondary: 'bg-amber-50 text-rose-950 border border-amber-300 hover:bg-amber-100',
        ringFocus: 'focus:ring-rose-700'
      };
    case 'emerald_champagne':
      return {
        primary: 'bg-emerald-900 text-emerald-50 hover:bg-emerald-950',
        primaryText: 'text-emerald-950',
        accentText: 'text-amber-700',
        accentBg: 'bg-amber-100 text-amber-900 border-amber-300',
        borderAccent: 'border-emerald-300 focus:border-emerald-600',
        gradientHeader: 'from-emerald-950 via-emerald-900 to-amber-950 text-white',
        badgeBg: 'bg-emerald-100 text-emerald-900',
        cardBorder: 'border-emerald-100/80',
        buttonPrimary: 'bg-emerald-900 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-950/20',
        buttonSecondary: 'bg-amber-50 text-emerald-950 border border-amber-300 hover:bg-amber-100',
        ringFocus: 'focus:ring-emerald-700'
      };
    case 'teal_gold':
    default:
      return {
        primary: 'bg-teal-950 text-amber-100 hover:bg-teal-900',
        primaryText: 'text-teal-950',
        accentText: 'text-amber-600',
        accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
        borderAccent: 'border-teal-300 focus:border-teal-700',
        gradientHeader: 'from-teal-950 via-teal-900 to-slate-900 text-white',
        badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
        cardBorder: 'border-stone-200',
        buttonPrimary: 'bg-teal-900 text-amber-50 hover:bg-teal-800 shadow-sm shadow-teal-950/20',
        buttonSecondary: 'bg-stone-50 text-teal-950 border border-stone-300 hover:bg-stone-100',
        ringFocus: 'focus:ring-teal-700'
      };
  }
};

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
