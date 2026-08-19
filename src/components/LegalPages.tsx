import React, { useState } from 'react';
import { ShieldCheck, Mail, MapPin, CheckCircle2, Send, HelpCircle, FileText } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 text-stone-800 text-left pb-24">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
          Legal & Trust &bull; Pune Launch
        </span>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500 mt-1">Last updated: August 2026</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-stone-700 font-light">
        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">1. Introduction & Role</h3>
          <p>
            Welcome to <strong>Celebratz</strong> ("we," "our," or "us"). Celebratz is an event venue and service discovery marketplace based in Pune, India. We connect event planners and families with vetted banquet halls, caterers, photographers, decorators, DJs, and Vedic pandits.
          </p>
        </section>

        <section className="space-y-2 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            2. Customer Contact Sharing with Vendors
          </h3>
          <p className="text-xs text-stone-800 font-medium">
            When you submit a <strong>"Request to Book"</strong> or <strong>"General Enquiry"</strong> form on Celebratz, you explicitly consent to sharing your full name, email address, event date requirements, and 10-digit mobile number directly with the specific vendor you are contacting.
          </p>
          <p className="text-xs text-stone-600">
            This information enables the vendor to follow up with you regarding walkthrough appointments, date availability, and final pricing outside the application. We never sell your personal details to third-party ad networks or unsolicited telemarketers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">3. Information We Collect</h3>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Account Details:</strong> Name, email address, profile avatar, and verified or double-entered phone numbers.</li>
            <li><strong>Event Specifics:</strong> Event type (Wedding, Engagement, Birthday, Naming Ceremony, Corporate), event dates, estimated guest count, and custom notes.</li>
            <li><strong>Vendor Data:</strong> Business name, Pune locality, capacity specs, pricing tiers, and calendar availability entries.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">4. Data Security</h3>
          <p>
            We implement strict access controls and encrypted communication protocols to safeguard all client and vendor data stored within our Pune marketplace infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">5. Contact Our Privacy Team</h3>
          <p>
            If you have questions about your stored data, account deletion, or vendor privacy protocols, reach out directly to our team at <a href="mailto:celebratzapp@gmail.com" className="text-teal-900 font-bold underline">celebratzapp@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsOfServiceView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 text-stone-800 text-left pb-24">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
          Legal & Trust &bull; Pune Launch
        </span>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">
          Terms of Service
        </h1>
        <p className="text-xs text-stone-500 mt-1">Last updated: August 2026</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-stone-700 font-light">
        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">1. Nature of the Marketplace Platform</h3>
          <p>
            Celebratz serves solely as an information, discovery, comparison, and lead transmission bridge between prospective event hosts and independent vendor businesses in Pune, India.
          </p>
        </section>

        <section className="space-y-2 p-4 bg-stone-100 border border-stone-300/80 rounded-2xl">
          <h3 className="font-bold text-base text-stone-900">
            2. No In-App Financial Transactions / Offline Contracting
          </h3>
          <p className="text-xs text-stone-800 font-medium">
            Celebratz does not process advance booking payments, security deposits, or digital payment checkouts for event venues or vendor services.
          </p>
          <p className="text-xs text-stone-600">
            All price negotiations, physical site inspections, service contracts, cancellation policies, and monetary exchanges occur directly and privately between the customer and the vendor outside the Celebratz web app.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">3. Availability Calendar Disclaimers</h3>
          <p>
            Availability statuses (Available, Tentative, Booked) and pricing tiers are maintained directly by registered vendors. Celebratz prominently displays a "Last updated X days ago" indicator and flags stale calendars to assist users, but cannot guarantee venue availability if vendor updates lag.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">4. User Conduct & Inquiries</h3>
          <p>
            Customers agree to provide genuine contact details and valid celebration requirements when requesting bookings or enquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-base text-stone-900">5. Support & Inquiries</h3>
          <p>
            For support inquiries or vendor onboarding assistance, please email <a href="mailto:celebratzapp@gmail.com" className="text-teal-900 font-bold underline">celebratzapp@gmail.com</a>.
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
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 text-stone-800 text-left pb-24">
      {/* Hero */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
          About Celebratz &bull; Pune
        </span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-stone-900">
          Making Pune Celebrations Joyful & Transparent
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light max-w-2xl leading-relaxed">
          Planning a wedding, milestone birthday, engagement, or naming ceremony should be about joy — not endless phone calls, hidden charges, or stressful weekend traffic across Pune. Celebratz brings Pune’s best celebration spaces and trusted service masters into one transparent comparison platform.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5 text-teal-800" />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">Rooted in Pune</h3>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            From the grand banquet lawns of Baner and Bavdhan to boutique riverside spaces in Koregaon Park and Kalyani Nagar, our data is tailored to Pune localities and real pricing standards.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">Direct & Unbiased</h3>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            No middleman fees, no inflated quotes. You connect directly with venue owners and vendors to visit in person and negotiate your contracts with complete peace of mind.
          </p>
        </div>
      </div>

      {/* Contact Form & Support Box */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200/80 space-y-6">
        <div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">Get in Touch with Celebratz</h2>
          <p className="text-xs text-stone-500">
            Have a question, feedback, or want to list your Pune business? Reach us at <strong className="text-stone-900">celebratzapp@gmail.com</strong>
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
            <p className="text-xs text-stone-600">Our Pune team will get back to you via email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Message / Question *</label>
              <textarea
                rows={3}
                required
                placeholder="How can our Pune team assist you? (e.g. Venue listing inquiry, custom event search...)"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-teal-900 hover:bg-teal-950 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
