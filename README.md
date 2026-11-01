# CommunityConnect — Social Development Events Platform (Client)

CommunityConnect is a modern, responsive web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**. The platform empowers local communities to organize, discover, and participate in grassroots social development initiatives—such as environmental cleanups, blood donation drives, tree plantations, literacy camps, and public health workshops.

---

## 🌐 Live URL & Repository Links

- **Live Application:** *[Planned Deployment on Vercel — Link Coming Soon]*
- **Server API Repository:** *[Server Repository Link Placeholder]*
- **Client GitHub Repository:** [https://github.com/jm-jahed/assignment-8](https://github.com/jm-jahed/assignment-8)

---

## ✨ Core Features

1. **Dynamic Homepage with MongoDB Limit (Limit 6):**
   - Live impact statistics counter (Volunteers, Events Organized, Communities Impacted).
   - Dynamically displays the six nearest upcoming social development events fetched from the Express API with MongoDB `.limit(6)` and date filtering (`date >= now`).
   - Engaging call-to-action banners, cause category exploration, and volunteer testimonials.

2. **Debounced Search & Multi-Criteria Filtering:**
   - Real-time search with a 300ms debounce to optimize network usage and avoid database overload.
   - Dynamic multi-filter engine allowing simultaneous filtering by cause category, date range, and event status.
   - Zero-layout-shift skeleton loading states and clean empty-state illustrations.

3. **Concurrency-Safe Event Participation (RSVP):**
   - Interactive event details view with live countdown timer, venue details, and capacity progress bar.
   - One-click event RSVP with database-level duplicate-join prevention (`compound unique index`) and atomic capacity oversubscription guards.

4. **Organizer Event Management Hub:**
   - Dedicated organizer dashboard allowing users to view all events they created.
   - Secure Edit and Delete operations protected by backend ownership authorization (only the creator can modify or remove their event).
   - Real-time attendee counter and double-confirmation modal before event cancellation.

5. **Volunteer Dashboard & User Profile Customization:**
   - Volunteer hub showing all registered initiatives sorted by event date, with a one-click "Leave Event" action that automatically restores spot availability.
   - Profile management with customizable bio, avatar preview, and personal impact metrics.

6. **Accessibility & Responsive Dark/Light Theming:**
   - Seamless Light and Dark theme switching powered by `next-themes` and CSS variables.
   - Fully responsive layouts tailored for mobile, tablet, and desktop viewports with accessible Radix UI primitives.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Primitives:** Shadcn UI (Radix UI)
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Form Handling & Validation:** React Hook Form + Zod
- **Authentication:** Better Auth (Client SDK with JWT plugin)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.18+ or v20+ recommended)
- npm or pnpm

### Installation

1. Clone the client repository:
   ```bash
   git clone https://github.com/jm-jahed/assignment-8.git
   cd assignment-8/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and configure the required variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the local development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Screenshots

*(Screenshots will be uploaded upon final deployment)*

---

## 👤 Author

- **GitHub:** [@jm-jahed](https://github.com/jm-jahed)
