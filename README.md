# CommunityConnect — Social Development Events Platform (Client)

CommunityConnect is a responsive web application built with Next.js (App Router), TypeScript, Tailwind CSS, and Shadcn UI. The platform allows users to organize, discover, and join community initiatives such as cleanups, blood donation drives, tree plantations, literacy workshops, and health camps.

---

## Repository Links

- **Client Repository:** https://github.com/jm-jahed/assignment-8
- **Server Repository:** https://github.com/jm-jahed/assignment-8-server
- **Live Application:** https://assignment-8-eta-liart.vercel.app/

---

## Features

1. **Homepage with Recent Events (Limit 6):**
   - Impact summary statistics (Active Volunteers, Drives Completed, Communities Impacted).
   - Shows the six nearest upcoming events fetched from the Express API using MongoDB `.limit(6)`.
   - Hero banner, initiative categories, photo gallery, and newsletter subscription section (UI design).

2. **Event Management (Organizers):**
   - Create event form with validation for title, description, category, date, time, location, capacity, and image URL.
   - Rejects past dates so only future events can be created.
   - Organizer dashboard (`/manage-events`) to view created events and attendee count.
   - Update and delete actions protected so only the creator can edit or remove their events.

3. **Event Participation (RSVP System):**
   - Event details page (`/events/[id]`) with countdown timer, event info, and seat counter.
   - Join and leave events with capacity limits and duplicate join prevention.
   - Joined events page (`/joined-events`) showing events joined by the logged-in user, sorted by event date (earliest first).

4. **Search and Category Filtering:**
   - Search events by keyword with 300ms debounce.
   - Filter events by category (Environment, Healthcare, Education, Disaster Relief, Community Cleanliness, Animal Welfare).
   - Skeleton loading states and empty state messages.

5. **Authentication and Protected Routes:**
   - Email and password registration and login powered by Better Auth.
   - Password validation requiring minimum 6 characters, at least 1 uppercase letter, and at least 1 lowercase letter.
   - Protected routes (`/create-event`, `/manage-events`, `/joined-events`, `/profile`) automatically redirect unauthenticated users to the login page.

6. **Responsive Design and Theme Toggle:**
   - Optimized for desktop, tablet, and mobile screens.
   - Light and dark theme toggle.
   - Custom 404 page and modern X social logo in the footer.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Shadcn UI
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)
- **Validation:** Zod & React Hook Form
- **Authentication:** Better Auth

---

## Environment Variables

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Client Base URL
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Express Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Better Auth Secret
BETTER_AUTH_SECRET=your_auth_secret_key
JWT_AUDIENCE=community-connect-api

# Social Auth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## How to Run Locally

### Prerequisites
- Node.js (v20 or v24 recommended)
- npm

### Steps

1. **Clone the repository and navigate into it:**
   ```bash
   git clone https://github.com/jm-jahed/assignment-8.git
   cd assignment-8
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`:**
   Configure your environment variables as shown above.

4. **Run tests:**
   ```bash
   npm run test
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## Tests

Run the client-side validation tests:
```bash
npm run test
```

Verifies:
- Password minimum length (6 characters)
- Uppercase letter requirement
- Lowercase letter requirement
- Password confirmation match
- Login credentials validation

---

## Author

- **Name:** MD Jahedul Islam
- **Assignment:** Assignment 8 — Social Development Events Platform
