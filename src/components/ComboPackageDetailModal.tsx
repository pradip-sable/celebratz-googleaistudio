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
import { formatEventType } from '../data/categories';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div 
        id="combo-package-detail-modal"
        className="bg-card rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-border overflow-hidden relative text-left"
      >
        {/* Hero Header */}
        <div className="relative h-48 sm:h-56 bg-primary-dark overflow-hidden shrink-0">
          <img
            src={combo.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&auto=format&fit=crop&q=80'}
            alt={combo.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-card/80 hover:bg-card text-foreground flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header text */}
          <div className="absolute bottom-4 left-5 right-5 text-white space-y-1.5">
            {combo.badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>{combo.badge}</span>
              </span>
            )}
            <h3 className="font-serif font-bold text-lg sm:text-2xl text-white leading-tight">
              {combo.title}
            </h3>
            <p className="text-xs text-white/80">
              Offered exclusively by <span className="font-bold text-accent">{combo.vendorName}</span> &bull; {combo.locality || 'Pune'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-left">
          {/* Pricing Highlight Strip */}
          <div className="p-4 rounded-2xl bg-accent-subtle/70 border border-accent/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                All-in-One Package Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-extrabold text-2xl sm:text-3xl text-primary">
                  {formatIndianCurrency(combo.comboPrice)}
                </span>
                <span className="font-semibold text-sm text-muted-foreground line-through">
                  {formatIndianCurrency(combo.totalOriginalPrice)}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-bold shrink-0">
              🎉 Instant Savings: {formatIndianCurrency(combo.savingsAmount)} ({combo.savingsPercentage}% OFF)
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-sm text-foreground">About this All-in-One Bundle</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {combo.description}
            </p>
          </div>

          {/* Included Services Breakdown */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              What’s Included in this Bundle ({(combo.includedServices?.length || 0)} Services Combined)
            </h4>

            <div className="space-y-2.5">
              {combo.includedServices && combo.includedServices.length > 0 ? (
                combo.includedServices.map((srv, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-subtle text-primary border border-border-subtle">
                          {srv.category?.replace('_', ' ')}
                        </span>
                        <h5 className="font-bold text-xs sm:text-sm text-foreground">{srv.listingTitle}</h5>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Standard: {formatIndianCurrency(srv.originalPrice)}
                      </span>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {srv.serviceInclusions?.map((inc, i) => (
                        <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
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
              <h4 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                All-in-One VIP Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {combo.features.map((feat, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-accent-subtle/50 border border-accent/30 text-xs text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capacity & Event Suitability */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-2xl border border-border text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Guest Capacity</span>
                <span className="font-bold text-foreground">{combo.minGuestCapacity || 0} - {combo.maxGuestCapacity || 0} Pax</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Best For</span>
                <span className="font-bold text-foreground">{combo.eventTypes?.map(formatEventType).join(', ') || 'All Celebrations'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-muted-foreground block">Total Combo Price</span>
            <span className="font-serif font-extrabold text-lg sm:text-xl text-primary">
              {formatIndianCurrency(combo.comboPrice)}
            </span>
          </div>

          <button
            onClick={handleRequestQuote}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-md hover:bg-primary-dark transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-accent" />
            <span>Request Combo Package Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
