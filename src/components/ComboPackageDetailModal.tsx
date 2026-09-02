import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Calendar, 
  IndianRupee, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck,
  Send,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComboPackage } from '../types';
import { formatIndianCurrency } from '../utils/theme';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface ComboPackageDetailModalProps {
  combo: ComboPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComboPackageDetailModal: React.FC<ComboPackageDetailModalProps> = ({
  combo,
  isOpen,
  onClose
}) => {
  const { openEnquiryForPackage } = useApp();

  useModalScrollLock(isOpen && Boolean(combo), onClose);

  if (!isOpen || !combo) return null;

  const handleRequestQuote = () => {
    onClose();
    // Open inquiry modal for the primary listing with the combo preselected
    const primaryListingId = combo.includedListingIds[0] || 'list_venue_1';
    openEnquiryForPackage(primaryListingId, undefined, combo);
  };

  return (
    <div 
      id="combo-package-detail-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
    >
      <div 
        id="combo-package-detail-modal"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative text-left"
      >
        {/* Hero Header */}
        <div className="relative h-48 sm:h-56 bg-stone-900 overflow-hidden shrink-0">
          <img
            src={combo.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80'}
            alt={combo.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header text */}
          <div className="absolute bottom-4 left-5 right-5 text-white space-y-1.5">
            {combo.badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>{combo.badge}</span>
              </span>
            )}
            <h3 className="font-serif font-bold text-lg sm:text-2xl text-white leading-tight">
              {combo.title}
            </h3>
            <p className="text-xs text-stone-300">
              Offered exclusively by <span className="font-bold text-amber-300">{combo.vendorName}</span> &bull; {combo.locality || 'Pune'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-left">
          {/* Pricing Highlight Strip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-teal-50 to-emerald-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                All-in-One Package Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-extrabold text-2xl sm:text-3xl text-teal-950">
                  {formatIndianCurrency(combo.comboPrice)}
                </span>
                <span className="font-semibold text-sm text-stone-500 line-through">
                  {formatIndianCurrency(combo.totalOriginalPrice)}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold shrink-0">
              🎉 Instant Savings: {formatIndianCurrency(combo.savingsAmount)} ({combo.savingsPercentage}% OFF)
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-sm text-stone-900">About this All-in-One Bundle</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {combo.description}
            </p>
          </div>

          {/* Included Services Breakdown */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-800" />
              What’s Included in this Bundle ({(combo.includedServices?.length || 0)} Services Combined)
            </h4>

            <div className="space-y-2.5">
              {combo.includedServices && combo.includedServices.length > 0 ? (
                combo.includedServices.map((srv, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-100 text-teal-900 border border-teal-200">
                          {srv.category?.replace('_', ' ')}
                        </span>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900">{srv.listingTitle}</h5>
                      </div>
                      <span className="text-xs font-semibold text-stone-500">
                        Standard: {formatIndianCurrency(srv.originalPrice)}
                      </span>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {srv.serviceInclusions?.map((inc, i) => (
                        <li key={i} className="text-xs text-stone-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : null}
            </div>
          </div>

          {/* VIP Perks */}
          {combo.features && combo.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                All-in-One VIP Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {combo.features.map((feat, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs text-stone-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capacity & Event Suitability */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-500" />
              <div>
                <span className="text-stone-500 block text-[10px]">Guest Capacity</span>
                <span className="font-bold text-stone-900">{combo.minGuestCapacity || 0} - {combo.maxGuestCapacity || 0} Pax</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-500" />
              <div>
                <span className="text-stone-500 block text-[10px]">Best For</span>
                <span className="font-bold text-stone-900">{combo.eventTypes?.join(', ') || 'All Celebrations'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-500 block">Total Combo Price</span>
            <span className="font-serif font-extrabold text-lg sm:text-xl text-teal-950">
              {formatIndianCurrency(combo.comboPrice)}
            </span>
          </div>

          <button
            onClick={handleRequestQuote}
            className="px-6 py-2.5 bg-teal-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-950 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Request Combo Package Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
