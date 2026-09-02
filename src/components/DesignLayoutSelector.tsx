import React from 'react';
import { Palette, Check, LayoutGrid, List, Layers, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DesignPalette, CardLayoutMode, HeroStyle } from '../types';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

export const DesignLayoutSelector: React.FC = () => {
  const { 
    isDesignSelectorOpen, 
    setIsDesignSelectorOpen, 
    designPrefs, 
    updateDesignPrefs 
  } = useApp();

  useModalScrollLock(isDesignSelectorOpen, () => setIsDesignSelectorOpen(false));

  if (!isDesignSelectorOpen) return null;

  const palettes: { id: DesignPalette; name: string; description: string; colors: string[] }[] = [
    {
      id: 'teal_gold',
      name: 'Deep Teal & Soft Gold',
      description: 'Sophisticated festive balance with deep forest teal and warm gold highlights.',
      colors: ['#0f3a38', '#d4af37', '#fdf2f0', '#ffffff']
    },
    {
      id: 'rose_ruby',
      name: 'Royal Rose & Ruby Gold',
      description: 'Opulent Indian wedding aesthetic with royal crimson, blush and warm champagne.',
      colors: ['#881337', '#e5c158', '#faf5ee', '#ffffff']
    },
    {
      id: 'emerald_champagne',
      name: 'Modern Emerald & Champagne',
      description: 'Fresh botanical garden vibe ideal for Pune outdoor lawns and contemporary receptions.',
      colors: ['#064e3b', '#f59e0b', '#f0fdf4', '#ffffff']
    }
  ];

  const cardLayouts: { id: CardLayoutMode; name: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'spacious_cards',
      name: 'Spacious Photo Cards',
      description: 'Generous photography with prominent pricing badges and spec tags (Recommended).',
      icon: <Layers className="w-5 h-5 text-teal-800" />
    },
    {
      id: 'compact_bento',
      name: 'Compact Bento Grid',
      description: 'Higher density multi-column layout for comparing many vendors quickly.',
      icon: <LayoutGrid className="w-5 h-5 text-amber-700" />
    },
    {
      id: 'detailed_list',
      name: 'Detailed List View',
      description: 'Horizontal rows showing calendar staleness, pricing units, and direct enquiry buttons.',
      icon: <List className="w-5 h-5 text-rose-800" />
    }
  ];

  const heroStyles: { id: HeroStyle; name: string; description: string }[] = [
    {
      id: 'celebratory_banner',
      name: 'Festive Celebratory Hero',
      description: 'Hero header with rich Pune landmark backdrop and quick category scroll.'
    },
    {
      id: 'pune_focus',
      name: 'Pune Neighborhood Focus',
      description: 'Prominently features Baner, KP, Kothrud, Wakad quick locality pills.'
    },
    {
      id: 'clean_minimal',
      name: 'Clean Centered Search',
      description: 'Minimalist high-contrast search box for fast direct queries.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Customize Design & Layout</h3>
              <p className="text-xs text-stone-500">Choose your preferred visual theme, card presentation, and search style</p>
            </div>
          </div>
          <button
            onClick={() => setIsDesignSelectorOpen(false)}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. Theme Palette Selection */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              1. Visual Theme & Color Palette
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {palettes.map(p => {
                const isSelected = designPrefs.palette === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => updateDesignPrefs({ palette: p.id })}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 ring-2 ring-amber-600/30 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 mb-2">
                      {p.colors.map((c, i) => (
                        <span 
                          key={i} 
                          className="w-4 h-4 rounded-full border border-stone-200 shadow-2xs" 
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="font-semibold text-xs text-stone-900">{p.name}</div>
                    <div className="text-[11px] text-stone-500 mt-1 leading-snug">{p.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Card Layout Mode */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-teal-800" />
              2. Vendor Card Presentation Mode
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cardLayouts.map(layout => {
                const isSelected = designPrefs.cardLayout === layout.id;
                return (
                  <button
                    key={layout.id}
                    onClick={() => updateDesignPrefs({ cardLayout: layout.id })}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-teal-800 bg-teal-50/40 ring-2 ring-teal-800/30 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-teal-800 text-white rounded-full flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="mb-2 p-1.5 bg-white w-fit rounded-lg border border-stone-200 shadow-2xs">
                      {layout.icon}
                    </div>
                    <div className="font-semibold text-xs text-stone-900">{layout.name}</div>
                    <div className="text-[11px] text-stone-500 mt-1 leading-snug">{layout.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Hero Header Style */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              3. Home Hero Experience
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {heroStyles.map(h => {
                const isSelected = designPrefs.heroStyle === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => updateDesignPrefs({ heroStyle: h.id })}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 ring-2 ring-amber-600/30 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="font-semibold text-xs text-stone-900">{h.name}</div>
                    <div className="text-[11px] text-stone-500 mt-1 leading-snug">{h.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            Selected: <span className="font-semibold text-stone-800 capitalize">{(designPrefs?.palette || 'teal_gold').replace('_', ' ')}</span> &bull; <span className="font-semibold text-stone-800 capitalize">{(designPrefs?.cardLayout || 'spacious_cards').replace('_', ' ')}</span>
          </p>
          <button
            onClick={() => setIsDesignSelectorOpen(false)}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
};
