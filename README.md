# Staywise

A full-stack hotel booking platform built with **Next.js 16**, **tRPC**, **Prisma**, and **Stripe** — featuring an AI-powered concierge, real-time map search, QR check-in verification, and automated email workflows.

[Xem README tiếng Việt →](./README.vi.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| API | tRPC v11 + TanStack Query v5 |
| Database ORM | Prisma 7 (PostgreSQL) |
| Auth | better-auth |
| Payments | Stripe |
| AI Assistant | Google Gemini (`@google/genai`) |
| Email | Resend + React Email |
| File Upload | UploadThing |
| Background Jobs | Upstash QStash |
| Rate Limiting | Upstash Redis + `@upstash/ratelimit` |
| Maps | react-leaflet + Carto Voyager tiles |
| URL State | nuqs |
| UI | shadcn/ui + Tailwind CSS v4 |
| State Management | Zustand |
| Animation | Framer Motion |
| Charts | Recharts |
| Forms | react-hook-form + zod v4 |
| Date Utilities | date-fns v4 |
| QR Code | qrcode |

---

## Features

### Guest Experience
- Search hotels by city, dates, and guests with **infinite scroll** pagination
- Three view modes: **List**, **Grid**, and interactive **Map** with price marker badges and popup cards
- Filters: price range, star rating, amenities, bed type, room type, minimum rating
- Hotel detail: image gallery with lightbox, amenities grid, available rooms with date-based availability, interactive Leaflet location map, paginated reviews
- **Room detail page**: dedicated page per room with full image gallery, amenity list, bed configuration, size/floor info, and sticky booking sidebar
- Full booking flow: room selection → guest info → Stripe payment with **15-minute expiry countdown** → confirmation with confetti animation
- Booking confirmation email with embedded **QR code** generated server-side
- **QR verify page** — hotel staff scan QR to instantly see booking status, guest name, dates, and room
- Print booking voucher — opens a styled HTML page in a new tab for printing
- Booking management: view history, cancel with tiered refund, write reviews with rating
- Account dashboard: booking overview, payment history, review history, profile editor with avatar upload

### AI Concierge
- Floating chat widget powered by **Google Gemini**
- Full conversation history maintained per session with multi-turn context
- Real-time **streaming** responses token by token
- **Auto language detection**: responds in Vietnamese when user writes Vietnamese, English otherwise — never mixes languages
- Suggested quick-start questions on first open
- Stop mid-stream and clear history buttons
- Knows platform-specific context: cancellation policy, QR check-in flow, booking features, refund tiers, account management

### Authentication
- Email/password registration with email verification link
- Google OAuth sign-in
- Forgot password + reset password flow
- Password strength indicator (real-time)
- Session-based auth via better-auth

### Admin
- Hotel management form with **click-on-map coordinate picker** (Leaflet `MapPicker`)
- Amenity multi-select with search
- Booking status transitions with full **Stripe refund** on admin cancel (bypasses user refund policy)
- Review moderation

### System & Automation
- **Stripe webhooks**:
  - `payment_intent.succeeded` → confirm booking, release lock → `BOOKED`, generate QR, send confirmation email
  - `payment_intent.payment_failed` → notify guest by email
  - `charge.refunded` → update payment record and booking status
- **QStash cron jobs** (3 schedules):
  - Every 5 minutes: expire unpaid bookings past 15-minute window, release `LOCKED` room availability
  - Daily 8 AM: send check-in reminder email to guests checking in tomorrow
  - Daily 10 AM: send review request email to guests who checked out yesterday
- Race-condition-safe room locking via `RoomAvailability` table with `AVAILABLE → LOCKED → BOOKED` state machine
- Partial Stripe refund support (50% refund tier)

---

## Refund Policy

| When Cancelled | Refund |
|---|---|
| Within 24 hours of booking | 100% |
| More than 7 days before check-in | 100% |
| 3–7 days before check-in | 50% |
| Less than 3 days before check-in | 0% |

Admin cancellations always issue a full **100% refund**, regardless of timing.

---

## Page Routes

```
/                                        Home
/hotels                                  Search (list / grid / map)
/hotels/[slug]                           Hotel detail
/hotels/[slug]/[roomSlug]                Room detail
/booking/[hotelSlug]/[roomSlug]          Booking flow
/booking/confirmation/[bookingRef]       Confirmation + confetti
/booking/verify/[bookingRef]             QR code verification (public, no auth)
/account                                 Dashboard overview
/account/bookings                        Booking history
/account/bookings/[bookingRef]           Booking detail + cancel
/account/bookings/[bookingRef]/review    Write review
/account/reviews                         My reviews
/account/profile                         Edit profile
/sign-in · /sign-up                      Auth
/forgot-password · /reset-password       Password recovery
/verify-email                            Email verification
/terms · /privacy                        Legal pages
/admin                                   Admin panel
```

---

## API Routes

```
POST /api/trpc/[trpc]              tRPC batch handler
POST /api/webhooks/stripe          Stripe event handler
POST /api/cron/expire-bookings     Cancel expired bookings (QStash)
POST /api/cron/checkin-reminder    Send check-in reminders (QStash)
POST /api/cron/review-request      Send review requests (QStash)
GET  /api/cron/setup-crons         Register QStash cron schedules (run once)
POST /api/ai/chat                  Streaming Gemini AI chat endpoint
POST /api/uploadthing              File upload handler (UploadThing)
```

---

## Project Structure

```
├── app/
│   ├── (auth)/                   Sign-in, sign-up, password reset, email verify
│   ├── (client)/
│   │   ├── page.tsx              Home page
│   │   ├── hotels/               Search + hotel detail + room detail
│   │   ├── booking/              Booking flow + confirmation + QR verify
│   │   ├── account/              Bookings, reviews, profile
│   │   └── terms/ privacy/       Static legal pages
│   ├── admin/                    Admin panel
│   └── api/
│       ├── webhooks/stripe/      Stripe webhook handler
│       ├── cron/                 4 QStash cron endpoints (incl. setup-crons)
│       ├── ai/chat/              Gemini streaming endpoint
│       ├── trpc/                 tRPC HTTP handler
│       ├── uploadthing/          UploadThing file handler
│       └── auth/                 better-auth handler
│
├── trpc/
│   ├── routers/
│   │   ├── client/
│   │   │   ├── hotels.ts         featured, search, detail, roomDetail, reviews, filterOptions
│   │   │   ├── booking.ts        createIntent, confirmPayment, getConfirmation, myBookings, cancel, getVerification
│   │   │   ├── review.ts         create, myReviews, getForBooking
│   │   │   └── user.ts           me, updateProfile, connectedAccounts, deleteAccount
│   │   └── admin/                Admin-only routers
│   ├── init.ts                   tRPC initialization + context
│   ├── server.tsx                Server-side caller
│   └── client.tsx                Client-side tRPC + TanStack Query setup
│
├── components/
│   ├── client/
│   │   ├── ai/                   AIChatWidget, AIChatMessage (streaming + markdown)
│   │   ├── home/                 Hero, FeaturedHotels, PopularDestinations, HowItWorks, TopAmenities, ReviewsHighlight
│   │   ├── hotels/               HotelCard, HotelsList, HotelsMapView, FilterSidebar, SortBar, MobileFilterDrawer
│   │   ├── hotel-detail/         ImageGallery, AvailableRooms, BookingSidebar, LocationMap, ReviewsSection
│   │   ├── room-detail/          RoomDetailClient, RoomImageGallery
│   │   ├── booking/              GuestInfoForm, PaymentSection, ConfirmationClient (confetti), BookingPrint, BookingVerifyClient, ExpiryTimer
│   │   ├── account/              BookingDetail, CancelSection, WriteReview, ProfileClient, StatusTimeline, PaymentHistory
│   │   └── layout/               ClientHeader (sticky, responsive), ClientFooter
│   ├── admin/                    HotelForm with MapPicker + AmenityMultiSelect
│   └── common/                   Logo, MapPicker, LocationMap (Leaflet, SSR-safe via dynamic import)
│
├── emails/                       8 React Email templates (parchment design system)
│
├── lib/
│   ├── gemini.ts                 Gemini client + system prompt (bilingual rules)
│   ├── email.ts                  Resend helper functions
│   ├── qr.ts                     Server-side QR code generation (base64 output)
│   ├── qstash.ts                 QStash client + cron registration helpers
│   └── utils/
│       ├── format.ts             formatDateShort/Full/Range/Relative/Smart, formatCurrencyUSD, toDateParam
│       ├── booking.ts            calcNights, calcTotal, getDatesInRange, getBookingExpiresAt
│       ├── refund-policy.ts      calcRefundPolicy, calcRefundAmount (tiered + partial Stripe)
│       └── amenity-icon.ts       getAmenityIcon (slug → Lucide component)
│
├── hooks/client/
│   ├── use-ai-chat.ts            Streaming AI with AbortController + session history
│   ├── use-hotels.ts             Hotel search (infinite) + detail + roomDetail queries
│   ├── use-booking.ts            Booking mutations and queries
│   ├── use-review.ts             Review CRUD
│   ├── use-user.ts               Profile and account management
│   ├── use-infinite-scroll.ts    IntersectionObserver sentinel ref
│   └── use-avatar-upload.ts      UploadThing integration with preview
│
└── store/                        Zustand global state stores
```

---

## Database Schema

Key models and their relationships:

```
User ──< Booking ──< BookingItem ──> Room ──< RoomAvailability
                 └─< Payment
                 └── Review ──> Hotel ──< HotelImage
                               Hotel ──< HotelAmenity ──> Amenity
                                         Room ──< RoomImage
                                         Room ──< RoomBed ──> BedType
                                         Room ──< RoomAmenity ──> Amenity
```

| Enum | Values |
|---|---|
| `BookingStatus` | `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`, `NO_SHOW` |
| `AvailabilityStatus` | `AVAILABLE`, `LOCKED`, `BOOKED`, `MAINTENANCE` |
| `PaymentStatus` | `UNPAID`, `PENDING`, `PAID`, `REFUNDED`, `FAILED`, `CANCELLED` |
| `ReviewStatus` | `PENDING`, `APPROVED`, `REJECTED` |

---

## Booking Flow (Technical)

```
1.  User picks dates + guests → hotel detail page shows available rooms
2.  "Select Room" → room detail page → booking page
3.  createIntent mutation:
      a. Rate limit check (Upstash Redis)
      b. Parallel fetch: hotel + room validation
      c. DB transaction:
           - Check RoomAvailability — no LOCKED/BOOKED rows in date range
           - Create Booking (PENDING, UNPAID) + BookingItem
           - createMany RoomAvailability rows (LOCKED) — unique constraint prevents races
           - Create Payment (PENDING)
      d. Create Stripe PaymentIntent outside transaction
      e. On Stripe failure → rollback: cancel Booking, release locks
4.  15-minute countdown timer shown in UI (ExpiryTimer component)
5.  User submits card details via Stripe Elements
6.  Stripe fires payment_intent.succeeded webhook:
      a. Sequential DB transaction: Payment(PAID) + Booking(CONFIRMED) + Items(CONFIRMED) + Availability(BOOKED)
      b. Generate QR code server-side: qrcode.toDataURL(verifyUrl)
      c. Send confirmation email (React Email + Resend) with QR embedded as base64 <img>
7.  User sees /booking/confirmation/[ref] with confetti
8.  Hotel staff scans QR → /booking/verify/[ref] (public, no auth) → sees booking status
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech))
- [Stripe](https://stripe.com) account + Stripe CLI
- [Resend](https://resend.com) account
- [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- [Upstash](https://upstash.com) account (QStash + Redis)
- [UploadThing](https://uploadthing.com) account

### Install

```bash
npm install
```

> `postinstall` automatically runs `prisma generate` after install.

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/staywise

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth — better-auth
BETTER_AUTH_SECRET=         # min 32 chars — generate with: npm run gen:secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=Staywise <noreply@yourdomain.com>

# Google Gemini
GEMINI_API_KEY=

# UploadThing
UPLOADTHING_TOKEN=

# Upstash QStash
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cron security
CRON_SECRET=                # generate with: npm run gen:secret
```

### Setup & Run

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed

# Start development server
npm run dev

# In a separate terminal, forward Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Register QStash cron schedules (run once after deployment)
npm run cron:setup
```

### All NPM Scripts

```bash
npm run dev               # Next.js dev server
npm run build             # Production build
npm run start             # Start production server
npm run lint              # ESLint

npm run db:generate       # Generate Prisma client
npm run db:migrate        # Run migrations (dev)
npm run db:push           # Push schema without migration (prototype)
npm run db:reset          # Reset database + re-run migrations
npm run db:seed           # Seed database with sample data
npm run db:studio         # Open Prisma Studio GUI

npm run gen:secret        # Generate a random 32-byte hex secret
npm run cron:setup        # Register QStash cron jobs via HTTP
```

### Other Tools

```bash
npx prisma studio         # Database GUI (alternative)
npx email dev             # React Email preview server (port 3001)
```

---

## Email Templates

All 8 templates share a warm **parchment design system**: `#F5F0E8` background, `#C9A96E` gold accent, Cormorant Garamond serif headings + Nunito Sans body text.

| Template | Trigger |
|---|---|
| `booking-confirmation` | `payment_intent.succeeded` webhook — includes embedded QR code |
| `booking-cancellation` | User or admin cancel — shows refund amount |
| `checkin-reminder` | Cron daily 8 AM — sent 1 day before check-in |
| `review-request` | Cron daily 10 AM — sent 1 day after check-out |
| `payment-failed` | `payment_intent.payment_failed` webhook |
| `refund-failed` | Failed refund notification |
| `email-verification` | New user registration |
| `reset-password-email` | Forgot password request |

---

## Maps

Three Leaflet components, all using **Carto Voyager** tiles (English labels, free, no API key required):

| Component | Location | Behavior |
|---|---|---|
| `LocationMap` | Hotel detail page | Read-only, hotel pin with name popup |
| `MapPicker` | Admin hotel form | Click to place pin, syncs lat/lng to form state |
| `HotelsMapView` | `/hotels?view=map` | Price badge markers, popup with hotel info + "View hotel" button |

All components are imported via `dynamic(() => import(...), { ssr: false })` to avoid SSR conflicts with Leaflet's DOM dependency.

---

## License

MIT