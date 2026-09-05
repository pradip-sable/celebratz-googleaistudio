import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  X, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CITIES, CityConfig } from '../data/cities';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

export const CitySelectorModal: React.FC = () => {
  const { 
    isCitySelectorOpen, 
    setIsCitySelectorOpen, 
    filters, 
    switchCity, 
    activeCity,
    currentUser
  } = useApp();

  useModalScrollLock(isCitySelectorOpen, () => setIsCitySelectorOpen(false));

  const [searchQuery, setSearchQuery] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState(currentUser?.email || '');
  const [selectedUpcomingCity, setSelectedUpcomingCity] = useState<CityConfig | null>(null);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  if (!isCitySelectorOpen) return null;

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.localities.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCitiesList = filteredCities.filter(c => c.status === 'active');
  const upcomingCitiesList = filteredCities.filter(c => c.status === 'upcoming');

  const handleSelectCity = (city: CityConfig) => {
    switchCity(city.id);
    if (city.status === 'active') {
      setIsCitySelectorOpen(false);
    } else {
      setSelectedUpcomingCity(city);
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSubmitted(true);
    setTimeout(() => {
      setWaitlistSubmitted(false);
      setSelectedUpcomingCity(null);
      setIsCitySelectorOpen(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-primary-dark text-white flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Select Your Celebration City
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Currently live in <strong className="text-accent">Pune</strong> & expanding across India
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsCitySelectorOpen(false)}
            className="p-1.5 rounded-full hover:bg-foreground text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Notice */}
        <div className="p-4 sm:px-6 bg-muted/40 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by city (e.g. Pune, Mumbai, Bengaluru, Jaipur) or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm text-foreground font-medium placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Active Live Operational Market */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Live Operational Cities (Full Marketplace)
              </span>
              <span className="text-[11px] text-muted-foreground">Verified contacts & calendars</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {activeCitiesList.map(city => {
                const isSelected = (filters.city || 'pune') === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className={`text-left p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-success bg-success-subtle/70 ring-2 ring-success/30' 
                        : 'border-border bg-white hover:border-success/30 hover:bg-muted/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-foreground">{city.name}</span>
                        <span className="text-xs text-muted-foreground">&bull; {city.state}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success border border-success/30">
                          {city.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">{city.tagline}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">Top Hubs:</span>
                        {city.popularHubs.slice(0, 5).map(hub => (
                          <span key={hub} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
                            {hub}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <div className="px-3 py-1.5 rounded-xl bg-success text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Market</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-muted hover:bg-success-subtle text-foreground hover:text-success text-xs font-bold transition-colors">
                          Switch to Pune
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Cities (Future Indian Expansion) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Upcoming Indian Cities (Expansion Roadmap)
              </span>
              <span className="text-[11px] text-muted-foreground">Pre-register your venue or get notified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcomingCitiesList.map(city => {
                const isSelected = (filters.city || 'pune') === city.id;
                return (
                  <div
                    key={city.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-accent bg-accent-subtle/60 ring-2 ring-accent/20'
                        : 'border-border bg-white hover:border-accent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-serif font-bold text-sm text-foreground">{city.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
                          {city.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{city.state}</div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">{city.tagline}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {city.popularHubs.slice(0, 3).map(h => (
                          <span key={h} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/40 border border-border text-muted-foreground">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedUpcomingCity(city)}
                        className="text-[11px] text-accent hover:text-foreground font-bold flex items-center gap-1"
                      >
                        <span>Notify me at launch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleSelectCity(city)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-muted hover:bg-muted text-foreground font-semibold"
                      >
                        Preview Mode
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Waitlist Drawer / Modal Section */}
          {selectedUpcomingCity && (
            <div className="p-4 bg-accent-subtle/50 border border-accent/30 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="font-bold text-xs text-foreground">
                    Get Early Access for {selectedUpcomingCity.name} ({selectedUpcomingCity.state})
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedUpcomingCity(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-foreground leading-relaxed">
                We are actively onboarding verified banquet halls, caterers, decorators, and photographers in {selectedUpcomingCity.name}. Enter your email to receive early host discounts and direct booking links on launch day.
              </p>

              {waitlistSubmitted ? (
                <div className="p-3 bg-success-subtle text-success border border-success/30 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>You are on the early access priority list for {selectedUpcomingCity.name}!</span>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Join {selectedUpcomingCity.name} Waitlist</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* India-Wide Vendor Onboarding Card */}
          <div className="p-4 rounded-2xl bg-primary-dark text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                <span className="font-serif font-bold text-sm text-white">
                  Are you a Vendor or Banquet Owner in Mumbai, Bengaluru, or Delhi?
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                Pre-list your venue or service profile today. Pre-registered Indian vendors receive a free "Verified Founding Partner" badge upon city rollout.
              </p>
            </div>
            <button
              onClick={() => {
                setIsCitySelectorOpen(false);
                switchCity('pune');
              }}
              className="px-3.5 py-2 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Continue in Pune (Live)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Active City: <strong className="text-foreground font-bold">{activeCity?.name || 'Pune'}</strong></span>
          </div>
          <button
            onClick={() => setIsCitySelectorOpen(false)}
            className="px-4 py-1.5 bg-primary-dark text-white rounded-xl text-xs font-semibold hover:bg-foreground transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
