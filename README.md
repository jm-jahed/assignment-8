# CommunityConnect — Social Development Events Platform (Client)

CommunityConnect is a modern, responsive web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**. The platform empowers local communities to organize, discover, and participate in grassroots social development initiatives—such as environmental cleanups, blood donation drives, tree plantations, youth literacy workshops, and public healthcare clinics.

---

## 🌐 Live URL & Repository Links

- **Live Application:** *[Planned Deployment on Vercel — Link Coming Soon]*
- **Client GitHub Repository:** [https://github.com/jm-jahed/assignment-8](https://github.com/jm-jahed/assignment-8)
- **Server API Repository:** *[Server GitHub URL to be configured]*

---

## ✨ Core Features (Minimum 5 Detailed Capabilities)

1. **Dynamic Homepage with MongoDB Limit (Limit 6):**
   - Displays real-time impact statistics (Active Volunteers, Drives Completed, Communities Impacted).
   - Dynamically showcases the six nearest upcoming social development initiatives fetched from the Express API with MongoDB `.find({ status: "Upcoming", date: { $gte: now } }).sort({ date: 1 }).limit(6)`.
   - Responsive hero banners with call-to-action buttons, cause exploration grid, community photo gallery, and newsletter engagement.

2. **Full Initiative Lifecycle Management (Organizer CRUD Dashboard):**
   - Protected event creation form with React Hook Form and Zod schema validation ensuring future dates, positive capacity limits, and image URLs.
   - Comprehensive organizer dashboard (`/manage-events`) displaying attendee turnout progress (`{joinedCount} / {capacity}`) in real-time.
   - Ownership-guarded update (`PATCH /api/v1/events/:id`) and delete (`DELETE /api/v1/events/:id`) workflows featuring double-confirmation modal dialogs.

3. **Concurrency-Safe Volunteer Participation (RSVP System):**
   - Dynamic event details view (`/events/[id]`) with live second-by-second kickoff countdown timer, interactive location pin, and category tags.
   - Concurrency-safe event RSVP leveraging MongoDB atomic operators (`$expr: { $lt: ["$joinedCount", "$capacity"] }`, `$inc: { joinedCount: 1 }`) and compound unique index `{ event: 1, user: 1 }` to prevent oversubscription and duplicate joins.
   - Dedicated volunteer schedule page (`/joined-events`) with one-click cancellation that atomically restores capacity spots.

4. **Debounced Search & Multi-Criteria Filtering Engine:**
   - Real-time keyword search optimized with a custom 300ms debounce hook (`useDebounce`) preventing redundant network queries.
   - Instant category filter pills (Environment, Healthcare, Education, Disaster Relief, Community Cleanliness, Animal Welfare).
   - Zero-layout-shift skeleton loading states (`EventCardSkeleton`) and friendly empty-state illustrations with clear reset filters.

5. **Security, Authentication & Edge Route Protection:**
   - Powered by Better Auth with MongoDB Adapter and EdDSA asymmetric JWT cryptography.
   - Password security validator strictly enforcing minimum 6 characters, at least 1 uppercase letter, and at least 1 lowercase letter.
   - Edge runtime middleware (`client/src/middleware.ts`) automatically guarding dashboard routes (`/create-event`, `/manage-events`, `/joined-events`, `/profile`) and redirecting guests to login with `callbackUrl`.

6. **Accessibility & Responsive Dark/Light Theming:**
   - Seamless Light and Dark theme switching powered by `next-themes` with no flash of unstyled content (FOUC).
   - Floating accessible "Back to Top" navigation button, mobile drawer menu with ARIA attributes, and custom branded 404 & global error boundaries.

---

## 🛠️ Technology Stack & Verified Versions

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.4.3` | React Server/Client Components, Routing & Edge Middleware |
| **UI Library** | React | `19.3.0` | Component Architecture & Hooks |
| **Language** | TypeScript | `5.x` | End-to-End Type Safety |
| **Styling** | Tailwind CSS | `v4` | Modern Utility-First Responsive Styling |
| **Components** | Shadcn UI Primitives | Latest | Accessible, headless UI building blocks |
| **Icons** | Lucide React | `1.66.0` | Semantic SVGs & UI indicators |
| **Notifications** | Sonner | `2.0.8` | Accessible toast alerts |
| **Validation** | Zod + React Hook Form | `^4.6.7` / `^7.91.0` | Strict client-side form schema enforcement |
| **Auth Client** | Better Auth SDK | `^1.7.15` | Session management, OAuth, and JWT cookies |

---

## 🔐 Environment Variables Configuration

Create a `.env.local` file in the `client/` root directory using the template below:

```env
# Client Base URL
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Express Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# MongoDB Atlas Database Connection (Shared with Better Auth Mongo Adapter)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.g2whair.mongodb.net/community_connect?retryWrites=true&w=majority

# Better Auth Secret (Min 32 characters random string)
BETTER_AUTH_SECRET=your_32_character_cryptographic_secret_here

# Google OAuth Provider (Optional - for social login)
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# GitHub OAuth Provider (Optional - for social login)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

> **Note:** Never commit `.env` or `.env.local` to Git. Both files are strictly ignored in `.gitignore`.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v20+ or v24+ recommended)
- npm (Use `npm.cmd` on Windows command line where necessary)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jm-jahed/assignment-8.git
   cd assignment-8/client
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `.env.local` following the template above.

4. **Run automated client verification tests:**
   ```bash
   npm run test
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧪 Testing Suite

CommunityConnect includes an automated client validation test suite verifying all mandatory assignment rules:
- Password security constraint: Min 6 characters (`PASS`)
- Password uppercase constraint: At least 1 uppercase letter (`PASS`)
- Password lowercase constraint: At least 1 lowercase letter (`PASS`)
- Password mismatch rejection (`PASS`)
- Login credential schema validation (`PASS`)

Run tests via:
```bash
npm run test
```

---

## 👤 Author
- **Developer:** Tanjim Hasan
- **Assignment:** Assignment 8 — Social Development Events Platform
