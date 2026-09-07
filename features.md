# Celebratz — Feature Inventory & Implementation Status

This document provides a comprehensive inventory of all features implemented and developed in the **Celebratz** event-services marketplace application, along with an audit of features discussed, out-of-scope boundaries, and upcoming roadmap items.

---

## 1. Executive Summary

Celebratz is an event-services marketplace tailored for celebrations (Weddings, Receptions, Birthdays, Engagements, Naming Ceremonies, and Corporate events). The platform connects celebration hosts with verified vendors across 6 core service categories in Pune:
- **Venues** (Banquet halls, lawns, resorts, farmhouses, ballrooms)
- **Photography & Videography**
- **Catering** (Pure Veg, Veg & Non-Veg, Jain)
- **Decoration & Mandap Setup**
- **DJ & Live Music / Dhol Tasha**
- **Pandit & Priest Services**

The application is structured to easily port into a production stack (**React + TypeScript + Tailwind CSS v4 + shadcn/ui + TanStack Router/Query + Supabase**), adhering strictly to semantic CSS variable tokens, unified hook-based data layers, and production schema naming conventions.

---

## 2. Implemented & Developed Features

### A. Discovery, Search & Filtering
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Category Browsing** | Implemented | Dedicated filtering for 6 standardized categories (`venues`, `photography`, `catering`, `decoration`, `music_dj`, `pandit_priest`) with custom iconography and color identities. |
| **Event Type Filtering** | Implemented | Quick filters for `Wedding`, `Reception`, `Birthday`, `Engagement`, `Naming Ceremony`, and `Corporate`. |
| **Locality & City Selection** | Implemented | Pune-focused locality filters (Baner, Koregaon Park, Kothrud, Wakad, Kalyani Nagar, Hadapsar, Viman Nagar, Sinhagad Road, Aundh, Hinjewadi) plus multi-city selector (Pune, Mumbai, Goa). |
| **Guest Capacity Quick Filter** | Implemented | Capacity preset counter that instantly filters venues with matching hall/lawn capacity and caterers with compatible minimum guest counts. |
| **Filters Bottom Sheet** | Implemented | Slide-up modal on mobile/desktop with price range slider, pure veg/Jain toggles, indoor/outdoor preferences, and date availability picker. |
| **Active Filter Pills** | Implemented | High-visibility active chips for active search term, locality, event type, and guest count with single-click dismissal and "Clear All". |
| **3 Card Layout Modes** | Implemented | Dynamic switch between **Spacious Cards** (image-forward), **Compact Bento** (dense grid), and **Detailed List** (information-dense). |
| **Hero Style Switcher** | Implemented | Support for **Celebratory Banner**, **Clean Minimal**, and **Pune Focus** hero layouts. |

---

### B. Vendor Listings & Detail View
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Listing Presentation** | Implemented | Verified badges, locality tag, Google Maps navigation links, starting price, pricing units (`per_day`, `per_plate`, `per_event`, `per_hour`, `fixed_package`). |
| **Interactive Photo Gallery** | Implemented | Cover image display with full gallery thumbnails and enlarged photo view. |
| **Category-Specific Specs** | Implemented | Deep attribute rendering for each category: <br>• **Venues**: Guest capacity (min/max), indoor/outdoor, AC, parking, rooms, catering policy.<br>• **Catering**: Veg/Non-Veg/Jain, live counters, per-plate price, cuisines.<br>• **Photography**: Deliverables, timeline, equipment, team size, drone.<br>• **Decoration**: Mandap customization, themes, lighting, setup hours.<br>• **DJ/Music**: Wattage, genres, dhol tasha, performance hours, wireless mics.<br>• **Pandit**: Ceremonies, languages, samagri inclusions, experience. |
| **Live Interactive Calendar** | Implemented | Monthly calendar showing date availability (`available`, `tentative`, `booked`). Highlights fresh updates vs. stale calendar notice (>30 days since last update). |
| **Customer Reviews & Ratings** | Implemented | Verified customer review cards, star rating breakdown, review moderation status. |
| **Social Actions & Sharing** | Implemented | Add to wishlist with heart toggle, direct WhatsApp chat launcher, and native share dialog with URL copy fallback. |

---

### C. Phase 1 Feature 1: Vendor Packages (Multi-Service Bundling)
Vendors can bundle 2+ of their own live listings across different categories into a discounted package.

| Sub-Feature | Status | Implementation Specifics |
| :--- | :--- | :--- |
| **Bundle Creation (`packages`)** | Implemented | Vendor combines 2+ own listings with name, slug, description, cover image, discount type (`fixed_amount` or `percentage`), and discount value. |
| **Read-Time Price Computation** | Implemented | Dynamically sums each component listing's *effective price*, applies discount, and shows "Package starting from ₹X". Never stores total statically. Displays breakdown of each component's individual rate. |
| **Read-Time Availability Rollup** | Implemented | Derived automatically per date across all component listings: <br>• Any component unupdated >30 days $\to$ **"Check with vendor"**<br>• Any component booked $\to$ **"Booked"**<br>• All components available $\to$ **"Available"**<br>• Otherwise $\to$ **"Tentative"** |
| **Weighted Rating Rollup** | Implemented | Computes weighted rating based on each component's verified review count, with clear customer disclosure that ratings roll up from individual services. |
| **Dedicated `/packages` Browse Page** | Implemented | Public browse view for multi-service bundles with celebration event filters and date availability checker. |
| **Listing Page Cross-Sell** | Implemented | Component listing detail modals showcase a *"Save with bundled packages from this vendor"* banner linking directly to the bundle. |
| **Minimum 2 Live Components Rule** | Implemented | Edge-case safety: If component listings drop below 2 active/live (due to vendor pause or admin rejection), the package is automatically hidden from public browse without altering stored status, showing an inactive alert to the vendor. |
| **Package Moderation Lifecycle** | Implemented | Pending $\to$ Live lifecycle. Any edit to a live package sends it back to `pending_approval`. |

---

### D. Phase 1 Feature 2: Package Tiers (Intra-Listing Pricing Tiers)
Vendors can optionally configure 2+ named tiers within a single listing.

| Sub-Feature | Status | Implementation Specifics |
| :--- | :--- | :--- |
| **Tier Data Structure (`listing_tiers`)** | Implemented | Stores `name`, `description`, `price`, `features: text[]`, `sort_order`, `is_active`. Tiers inherit the parent listing's pricing unit. |
| **0 or 2+ Tiers Rule** | Implemented | Enforces strict validation: either 0 tiers (flat `price_from`) or 2+ tiers (tiered pricing). Exactly 1 tier is forbidden. |
| **Effective Price Calculation** | Implemented | If 2+ active tiers exist, effective price is the lowest active tier's price. Untiered listings keep `price_from` as single source of truth. Used across directory filters and package bundles. |
| **Customer Tier Comparison UI** | Implemented | Replaces flat price block with side-by-side comparison cards, feature checklists, and a **"Choose this tier"** CTA. |
| **Pre-Selected Tier in Inquiries** | Implemented | Clicking "Choose this tier" opens the Request/Enquire modal with `selected_tier_id` and tier details pre-selected. |
| **Vendor Tier Editor** | Implemented | Integrated into listing creation/edit form: add, remove, and reorder tier rows, edit pricing, and configure bullet-point features. |
| **Tier Soft-Deactivation** | Implemented | Past requests preserve their historical tier reference via `is_active = false` instead of hard deletion. |
| **Material Change Moderation Rule** | Implemented | Material changes (price, tiers, title, category) revert a live listing to `pending_approval`. Non-material edits (photos, description) stay live. |

---

### E. Enquiry & Booking Request Workflow
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Standardized Field Naming** | Implemented | Uses `kind`: `"booking_request"` \| `"enquiry"`. Explicit single reference to `listing_id` (with optional `selected_tier_id`) OR `package_id`. |
| **Request / Enquire Modal** | Implemented | Captures event type, date, guest count, preferred visit time, custom message, customer contact details, and consent checkbox. |
| **Submission Confirmation Modal** | Implemented | Displays booking reference ID, summary card of requested service/tier/package, vendor SLA expectations, and direct link to Customer Dashboard. |
| **Direct WhatsApp Action** | Implemented | Pre-fills customized WhatsApp message with listing title, event type, date, and guest count. |

---

### F. Customer Dashboard
| Feature | Status | Details |
| :--- | :--- | :--- |
| **My Requests & Bookings Tab** | Implemented | Tracks requests by status (`pending`, `accepted`, `declined`, `completed`). Displays vendor notes, dates, and direct contact buttons. |
| **Wishlist Tab** | Implemented | Displays saved listings with instant "Enquire Now" and remove buttons. |
| **My Reviews Tab** | Implemented | Review history with status badges (`published` vs `pending_moderation`). |
| **Customer Profile Tab** | Implemented | Personal details, phone verification badge, and contact preferences. |

---

### G. Vendor Dashboard
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Business Overview** | Implemented | Metrics on live listings, active packages, pending leads, response rates, and calendar freshness. |
| **Listings Management** | Implemented | Status tags (`live`, `pending_approval`, `paused`, `rejected`), pause/resume toggle, edit listing, delete listing. |
| **Listing Creator & Editor** | Implemented | Comprehensive multi-step form covering basic details, category attributes, pricing, gallery photos, and package tiers manager. |
| **Packages Studio** | Implemented | Visual bundle creator: pick 2+ own listings, select discount type (% or fixed ₹), preview effective calculated price, and publish for moderation. |
| **Calendar Manager** | Implemented | Full interactive monthly calendar: set individual or bulk dates to `available`, `tentative`, or `booked`. Tracks calendar freshness. |
| **Leads & Enquiries Manager** | Implemented | Real-time lead inbox: view customer requirements, event type, date, guest count, requested tier or package; accept or decline with custom notes. |

---

### H. Admin Moderation Panel
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Approvals Queue** | Implemented | Unified queue for pending listings, pending listing tiers, and pending package bundles. |
| **Detailed Moderation Actions** | Implemented | One-click approval or rejection with mandatory rejection reason modal (visible to vendor upon rejection). |
| **Featured Listing Toggle** | Implemented | Mark listings as featured for homepage prominence. |
| **Directory Management** | Implemented | Filter and browse all live, paused, or pending listings across Pune and other cities. |
| **Review Moderation** | Implemented | Approve or flag customer reviews before publication. |

---

### I. Comparison System
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Sticky Comparison Bar** | Implemented | Floating dock displaying selected listings (up to 4) across categories with quick remove and counter. |
| **Comparison Modal / Matrix** | Implemented | Comprehensive side-by-side comparison table: prices, price units, venue capacity, catering veg options, amenities, and direct "Book" buttons. |

---

### J. Theming, Styling & Design System
| Feature | Status | Details |
| :--- | :--- | :--- |
| **CSS Variable Architecture** | Implemented | 100% semantic color classes (`bg-primary`, `bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, etc.). No hardcoded brand palette colors. |
| **3 Swappable Palettes** | Implemented | Toggled seamlessly via `data-theme` attribute on root HTML element: <br>1. **Royal Teal & Gold** (`teal_gold`)<br>2. **Rose & Ruby** (`rose_ruby`)<br>3. **Emerald & Champagne** (`emerald_champagne`) |
| **Design Preferences Modal** | Implemented | Accessible from navbar: switches themes, card layouts, and hero layouts in real time. |
| **Full Responsive Design** | Implemented | Optimized for desktop, tablet, and mobile with sticky bottom navigation. |

---

### K. Authentication & Demo Controls
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Multi-Method Auth Modal** | Implemented | Supports Email + Password, Mobile + OTP simulation, and Google OAuth simulation. |
| **Role-Based Demo Switcher** | Implemented | Instant 1-click toggle between **Customer**, **Vendor**, and **Admin** personas for complete testing. |

---

## 3. Discussed & Planned Features (Next Phases)

The following items were discussed during design reviews or identified as part of the production roadmap, but are currently intentionally separated from the Phase 1 UI scope:

| Feature / Area | Status | Notes & Roadmap |
| :--- | :--- | :--- |
| **Production Supabase Integration** | Planned (Phase 2) | Port existing mock data hooks (`useListings`, `usePackages`, `useEnquiries`) to TanStack Query + Supabase client with Postgres row-level security (RLS). The data models and types in `src/types.ts` already match the target schema. |
| **Filtering by Tier Features** | Out of Scope for Phase 1 | Per instructions, tier features are display-only bullets for now, not structured search filters. |
| **Tier Selection inside Bundles** | Out of Scope for Phase 1 | Bundles reference whole listings at their lowest effective tier, not an arbitrary customer-chosen tier. |
| **Separate Review System for Bundles** | Out of Scope for Phase 1 | Reviews roll up from component listings with weighted scores; no standalone review system for bundles. |
| **Online Payment Gateway / Token Escrow** | Planned (Phase 2) | Integration with Razorpay / Cashfree for booking token deposits (e.g. ₹5,000 reservation advance) held in escrow until vendor confirmation. |
| **In-App Real-Time Messaging** | Planned (Phase 2) | Direct chat between customer and vendor inside the dashboard (currently handled via WhatsApp + vendor enquiry response notes). |
| **SMS & WhatsApp Gateway (Twilio / Gupshup)** | Planned (Phase 2) | Real SMS OTP verification and automated transactional WhatsApp updates when a vendor accepts a lead. |
| **Multi-City Database Rollout** | Planned (Phase 2) | Adding dedicated verified vendor databases for Mumbai, Bengaluru, and Goa (currently Pune is primary; city selector UI is ready). |
| **Customer Self-Cancellation / Reschedule Flow** | Planned (Phase 2) | Structured UI allowing customers to request date changes or cancel confirmed bookings with policy terms. |

---

## 4. Verification & Health Summary
- **Type Safety**: TypeScript strict mode enabled (`tsc --noEmit` passing with 0 errors).
- **Compilation**: Clean production build via Vite.
- **Theme Compliance**: All brand and layout styling binds strictly to CSS variables in `index.css`.
