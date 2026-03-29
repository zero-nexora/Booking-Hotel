# Staywise

A full-stack hotel booking platform built with Next.js 15, tRPC, Prisma, and Stripe — featuring an AI-powered concierge, real-time map search, QR check-in verification, and automated email workflows.

[Xem README tiếng Việt →](./README.vi.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| API | tRPC v11 + TanStack Query |
| Database ORM | Prisma (PostgreSQL) |
| Auth | better-auth |
| Payments | Stripe |
| AI Assistant | Google Gemini 1.5 Flash |
| Email | Resend + React Email |
| File upload | uploadthing |
| Background jobs | Upstash QStash |
| Maps | react-leaflet + Carto Voyager tiles |
| URL state | nuqs |
| UI | shadcn/ui + Tailwind CSS |
| Animation | Framer motion |
| Forms | react-hook-form + zod |
| Date utilities | date-fns |
| QR code | qrcode |

---

## Features

### Guest Experience
- Search hotels by city, dates, and guests with infinite scroll pagination
- Three view modes: **List**, **Grid**, and interactive **Map** with price marker badges and popup cards
- Filters: price range, star rating, amenities, bed type, room type, minimum rating
- Hotel detail: image gallery with lightbox, amenities grid, available rooms with date-based availability, interactive Leaflet location map, paginated reviews
- **Room detail page**: dedicated page per room with full image gallery, amenity list, bed configuration, size/floor info, and sticky booking sidebar
- Full booking flow: room selection → guest info → Stripe payment with 15-minute expiry countdown → confirmation with confetti animation
- Booking confirmation email with embedded **QR code** generated server-side
- **QR verify page** — hotel staff scan QR to instantly see booking status, guest name, dates, and room
- Print booking voucher — opens a styled HTML page in a new tab for printing
- Booking management: view history, cancel with tiered refund, write reviews with rating
- Account dashboard: booking overview, payment history, review history, profile editor with avatar upload

### AI Concierge
- Floating chat widget powered by **Google Gemini 1.5 Flash**
- Full conversation history maintained per session with multi-turn context
- Real-time **streaming** responses token by token
- **Auto language detection**: responds in Vietnamese when user writes Vietnamese, English when user writes English — never mixes
- Suggested quick-start questions on first open
- Stop mid-stream, clear history buttons
- Knows platform-specific context: cancellation policy, QR check-in flow, booking features, refund tiers, account management

### Authentication
- Email/password registration with email verification link
- Google OAuth sign-in
- Forgot password + reset password flow
- Password strength indicator (real-time)
- Session-based auth via better-auth

### Admin
- Hotel management form with **click-on-map coordinate picker** (Leaflet MapPicker)
- Amenity multi-select with search
- Booking status transitions with full **Stripe refund** on admin cancel (bypasses user refund policy)
- Review moderation

### System & Automation
- **Stripe webhooks**:
  - `payment_intent.succeeded` → confirm booking, release lock → BOOKED, generate QR, send confirmation email
  - `payment_intent.payment_failed` → notify guest by email
  - `charge.refunded` → update payment record and booking status
- **QStash cron jobs** (3 schedules):
  - Every 5 minutes: expire unpaid bookings past 15-minute window, release LOCKED room availability
  - Daily 8am: send check-in reminder email to guests checking in tomorrow
  - Daily 10am: send review request email to guests who checked out yesterday
- Race-condition-safe room locking via `RoomAvailability` table with `AVAILABLE → LOCKED → BOOKED` state machine
- Partial Stripe refund support for 50% refund tier

---

## Refund Policy

| When cancelled | Refund |
|---|---|
| Within 24 hours of booking | 100% |
| More than 7 days before check-in | 100% |
| 3–7 days before check-in | 50% |
| Less than 3 days before check-in | 0% |

Admin cancellations always issue a full 100% refund, regardless of timing.

---

## Page Routes

```
/                                        Home
/hotels                                  Search (list / grid / map)
/hotels/[slug]                           Hotel detail
/hotels/[slug]/[roomSlug]                Room detail
/booking/[hotelSlug]/[roomSlug]          Booking flow
/booking/confirmation/[bookingRef]       Confirmation + confetti
/booking/verify/[bookingRef]             QR code verification (public)
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
POST /api/webhooks/stripe         Stripe event handler
POST /api/cron/expire-bookings    Cancel expired bookings (QStash)
POST /api/cron/checkin-reminder   Send check-in reminders (QStash)
POST /api/cron/review-request     Send review requests (QStash)
POST /api/ai/chat                 Streaming Gemini AI chat endpoint
```

---

## Project Structure

```
├── app/
│   ├── (auth)/                   Sign-in, sign-up, password reset, email verify
│   ├── (client)/
│   │   ├── hotels/               Search + hotel detail + room detail
│   │   ├── booking/              Booking flow + confirmation + QR verify
│   │   ├── account/              Bookings, reviews, profile
│   │   └── terms/ privacy/       Static legal pages
│   ├── (admin)/                  Admin panel
│   └── api/
│       ├── webhooks/stripe/      Stripe webhook handler
│       ├── cron/                 3 QStash cron endpoints
│       └── ai/chat/              Gemini streaming endpoint
│
├── server/routers/
│   ├── hotel.ts                  featured, search, detail, roomDetail, reviews, filterOptions
│   ├── booking.ts                createIntent, confirmPayment, getConfirmation, myBookings, cancel, getVerification
│   ├── review.ts                 create, myReviews, getForBooking
│   └── user.ts                   me, updateProfile, connectedAccounts, deleteAccount
│
├── components/
│   ├── client/
│   │   ├── ai/                   AIChatWidget, AIChatMessage (streaming + markdown)
│   │   ├── home/                 Hero, FeaturedHotels, PopularDestinations, HowItWorks, TopAmenities, ReviewsHighlight
│   │   ├── hotels/               HotelCard, HotelsList, HotelsMapView, FilterSidebar, SortBar, MobileFilterDrawer
│   │   ├── hotel-detail/         ImageGallery, AvailableRooms (with Tooltip guard), BookingSidebar, LocationMap, ReviewsSection
│   │   ├── room-detail/          RoomDetailClient, RoomImageGallery
│   │   ├── booking/              GuestInfoForm, PaymentSection, ConfirmationClient (confetti), BookingPrint, BookingVerifyClient, ExpiryTimer
│   │   ├── account/              BookingDetail, CancelSection, WriteReview, ProfileClient, StatusTimeline, PaymentHistory
│   │   └── layout/               ClientHeader (sticky, responsive, active nav), ClientFooter
│   ├── admin/                    HotelForm with MapPicker + AmenityMultiSelect
│   └── common/                   Logo, MapPicker, LocationMap (all Leaflet, SSR-safe via dynamic import)
│
├── emails/                       7 React Email templates (parchment design system)
│
├── lib/
│   ├── gemini.ts                 Gemini client + system prompt (bilingual rules)
│   ├── email.ts                  Resend helper functions
│   ├── qr.ts                     Server-side QR code generation (qrcode lib, base64 output)
│   ├── qstash.ts                 Cron registration helpers
│   └── utils/
│       ├── format.ts             formatDateShort/Full/Long/Range/Relative/Smart, formatCurrencyUSD, toDateParam
│       ├── booking.ts            calcNights, calcTotal, getDatesInRange, getBookingExpiresAt
│       ├── refund-policy.ts      calcRefundPolicy, calcRefundAmount (tiered + partial Stripe)
│       └── amenity-icon.ts       getAmenityIcon (slug string → Lucide component)
│
└── hooks/client/
    ├── use-ai-chat.ts            Streaming AI with AbortController + session history
    ├── use-hotels.ts             Hotel search (infinite) + detail + roomDetail queries
    ├── use-booking.ts            Booking mutations and queries
    ├── use-review.ts             Review CRUD
    ├── use-user.ts               Profile and account management
    ├── use-infinite-scroll.ts    IntersectionObserver sentinel ref
    └── use-avatar-upload.ts      uploadthing integration with preview
```

---

## Booking Flow (Technical)

```
1.  User picks dates + guests → hotel detail page shows available rooms
2.  "Select Room" → room detail page or booking page
3.  createIntent mutation:
      a. Rate limit check
      b. Parallel fetch: hotel + room validation
      c. DB transaction:
           - Check RoomAvailability — no LOCKED/BOOKED rows in range
           - Create Booking (PENDING, UNPAID) + BookingItem
           - createMany RoomAvailability rows (LOCKED) — unique constraint prevents race conditions
           - Create Payment (PENDING)
      d. Create Stripe PaymentIntent outside transaction
      e. On Stripe failure → rollback: cancel Booking, release locks
4.  15-minute countdown timer shown in UI
5.  User submits Stripe payment
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
- PostgreSQL database
- [Stripe](https://stripe.com) account
- [Resend](https://resend.com) account
- [Google AI Studio](https://aistudio.google.com) (Gemini API key)
- [Upstash](https://upstash.com) account (QStash)
- [uploadthing](https://uploadthing.com) account

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/staywise

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth — better-auth
BETTER_AUTH_SECRET=your_secret_min_32_chars
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

# uploadthing
UPLOADTHING_TOKEN=

# Upstash QStash
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

### Setup & Run

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Register QStash cron jobs (run once)
npx tsx scripts/register-crons.ts

# Start development server
npm run dev

# In a separate terminal, forward Stripe webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Other Commands

```bash
npm run build          # Production build
npx prisma studio      # Database GUI
npx email dev          # React Email preview server (port 3001)
```

---

## Email Templates

All 7 templates share a warm **parchment design system**: `#F5F0E8` background, `#C9A96E` gold accent, Cormorant Garamond serif headings + Nunito Sans body text.

| Template | Trigger |
|---|---|
| `booking-confirmation` | `payment_intent.succeeded` webhook — includes QR code |
| `booking-cancellation` | User or admin cancel — shows refund amount |
| `checkin-reminder` | Cron daily 8am — sent 1 day before check-in |
| `review-request` | Cron daily 10am — sent 1 day after check-out |
| `payment-failed` | `payment_intent.payment_failed` webhook |
| `email-verification` | New user registration |
| `reset-password` | Forgot password request |

---

## Maps

Three Leaflet components, all using **Carto Voyager** tiles (English labels, free, no API key):

| Component | Location | Behavior |
|---|---|---|
| `LocationMap` | Hotel detail page | Read-only, hotel pin with name popup |
| `MapPicker` | Admin hotel form | Click to place pin, syncs lat/lng to form |
| `HotelsMapView` | `/hotels?view=map` | Price badge markers, popup with hotel info + "View hotel" button |

All imported via `dynamic(() => import(...), { ssr: false })` to avoid SSR conflicts with Leaflet's DOM dependency.

---

## License

MIT