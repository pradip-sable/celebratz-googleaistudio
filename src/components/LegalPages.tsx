import React, { useState } from 'react';
import { ShieldCheck, Mail, MapPin, CheckCircle2, Send, HelpCircle, FileText } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 text-foreground text-left pb-24">
      <div className="border-b border-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
          Legal & Trust &bull; Pune Launch
        </span>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-foreground mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Last updated: August 2026</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-foreground font-light">
        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">1. Introduction & Role</h3>
          <p>
            Welcome to <strong>Celebratz</strong> ("we," "our," or "us"). Celebratz is an event venue and service discovery marketplace based in Pune, India. We connect event planners and families with vetted banquet halls, caterers, photographers, decorators, DJs, and Vedic pandits.
          </p>
        </section>

        <section className="space-y-2 p-4 bg-accent-subtle/50 border border-accent/30 rounded-2xl">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            2. Customer Contact Sharing with Vendors
          </h3>
          <p className="text-xs text-foreground font-medium">
            When you submit a <strong>"Request to Book"</strong> or <strong>"General Enquiry"</strong> form on Celebratz, you explicitly consent to sharing your full name, email address, event date requirements, and 10-digit mobile number directly with the specific vendor you are contacting.
          </p>
          <p className="text-xs text-muted-foreground">
            This information enables the vendor to follow up with you regarding walkthrough appointments, date availability, and final pricing outside the application. We never sell your personal details to third-party ad networks or unsolicited telemarketers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">3. Information We Collect</h3>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Account Details:</strong> Name, email address, profile avatar, and verified or double-entered phone numbers.</li>
            <li><strong>Event Specifics:</strong> Event type (Wedding, Engagement, Birthday, Naming Ceremony, Corporate Event), event dates, estimated guest count, and custom notes.</li>
            <li><strong>Vendor Data:</strong> Business name, Pune locality, capacity specs, pricing tiers, and calendar availability entries.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">4. Data Security</h3>
          <p>
            We implement strict access controls and encrypted communication protocols to safeguard all client and vendor data stored within our Pune marketplace infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">5. Contact Our Privacy Team</h3>
          <p>
            If you have questions about your stored data, account deletion, or vendor privacy protocols, reach out directly to our team at <a href="mailto:celebratzapp@gmail.com" className="text-primary font-bold underline">celebratzapp@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsOfServiceView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 text-foreground text-left pb-24">
      <div className="border-b border-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
          Legal & Trust &bull; Pune Launch
        </span>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-foreground mt-1">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Last updated: August 2026</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-foreground font-light">
        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">1. Nature of the Marketplace Platform</h3>
          <p>
            Celebratz serves solely as an information, discovery, comparison, and lead transmission bridge between prospective event hosts and independent vendor businesses in Pune, India.
          </p>
        </section>

        <section className="space-y-2 p-4 bg-muted border border-border/80 rounded-2xl">
          <h3 className="font-bold text-base text-foreground">
            2. No In-App Financial Transactions / Offline Contracting
          </h3>
          <p className="text-xs text-foreground font-medium">
            Celebratz does not process advance booking payments, security deposits, or digital payment checkouts for event venues or vendor services.
          </p>
          <p className="text-xs text-muted-foreground">
            All price negotiations, physical site inspections, service contracts, cancellation policies, and monetary exchanges occur directly and privately between the customer and the vendor outside the Celebratz web app.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">3. Availability Calendar Disclaimers</h3>
          <p>
            Availability statuses (Available, Tentative, Booked) and pricing tiers are maintained directly by registered vendors. Celebratz prominently displays a "Last updated X days ago" indicator and flags stale calendars to assist users, but cannot guarantee venue availability if vendor updates lag.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">4. User Conduct & Inquiries</h3>
          <p>
            Customers agree to provide genuine contact details and valid celebration requirements when requesting bookings or enquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-foreground">5. Support & Inquiries</h3>
          <p>
            For support inquiries or vendor onboarding assistance, please email <a href="mailto:celebratzapp@gmail.com" className="text-primary font-bold underline">celebratzapp@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const AboutContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 text-foreground text-left pb-24">
      {/* Hero */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
          About Celebratz &bull; Pune
        </span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-foreground">
          Making Pune Celebrations Joyful & Transparent
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-2xl leading-relaxed">
          Planning a wedding, milestone birthday, engagement, or naming ceremony should be about joy — not endless phone calls, hidden charges, or stressful weekend traffic across Pune. Celebratz brings Pune’s best celebration spaces and trusted service masters into one transparent comparison platform.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-border space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif font-bold text-base text-foreground">Rooted in Pune</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            From the grand banquet lawns of Baner and Bavdhan to boutique riverside spaces in Koregaon Park and Kalyani Nagar, our data is tailored to Pune localities and real pricing standards.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-border space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-accent-subtle text-accent-dark flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-serif font-bold text-base text-foreground">Direct & Unbiased</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            No middleman fees, no inflated quotes. You connect directly with venue owners and vendors to visit in person and negotiate your contracts with complete peace of mind.
          </p>
        </div>
      </div>

      {/* Contact Form & Support Box */}
      <div className="bg-muted/40 rounded-3xl p-6 sm:p-8 border border-border/80 space-y-6">
        <div>
          <h2 className="font-serif font-bold text-2xl text-foreground">Get in Touch with Celebratz</h2>
          <p className="text-xs text-muted-foreground">
            Have a question, feedback, or want to list your Pune business? Reach us at <strong className="text-foreground">celebratzapp@gmail.com</strong>
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-success-subtle text-success rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
            <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
            <p className="text-xs text-muted-foreground">Our Pune team will get back to you via email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Message / Question *</label>
              <textarea
                rows={3}
                required
                placeholder="How can our Pune team assist you? (e.g. Venue listing inquiry, custom event search...)"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full bg-white border border-border rounded-xl p-2.5 text-xs text-foreground outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-accent" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
