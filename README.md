# Staywise

Full-stack hotel booking platform built with Next.js 15 App Router, tRPC, Prisma, and Stripe.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| API | tRPC v11 + TanStack Query |
| Database ORM | Prisma (PostgreSQL) |
| Auth | better-auth |
| Payments | Stripe |
| Email | Resend + React Email |
| File Upload | uploadthing |
| Background Jobs | Upstash QStash |
| Maps | react-leaflet + OpenStreetMap (Carto Voyager tiles) |
| URL State | nuqs |
| UI | shadcn/ui + Tailwind CSS |
| Forms | react-hook-form + zod |
| Date utils | date-fns |

---

## Features

### Guest
- Search hotels by city, date, guests with infinite scroll
- List / grid / map view toggle (Leaflet map with price markers)
- Hotel detail: image gallery with lightbox, amenities, available rooms, location map, reviews
- Full booking flow: room selection → guest info → Stripe payment → confirmation with confetti
- QR code verification ticket sent via email on booking confirmation
- Booking management: view, cancel (with tiered refund policy), write reviews
- Print booking voucher (custom HTML template)
- Account: profile, booking history, review history

### Auth
- Email/password sign-up with email verification
- Google OAuth
- Forgot/reset password flow
- Password strength indicator

### Admin
- Hotel management with map-picker for coordinates
- Booking status management with full refund on admin cancel

### System
- Stripe webhooks: payment confirmed/failed/refunded
- Cron jobs via QStash: expire unpaid bookings (every 5 min), check-in reminder (daily 8am), review request (daily 10am)
- Tiered refund policy: 100% within 24h or >7 days before check-in, 50% for 3–7 days, 0% for <3 days
- Race-condition-safe room locking via `RoomAvailability` table with `LOCKED → BOOKED` flow

---

## Project Structure

```
├── app/
│   ├── (auth)/                    # sign-in, sign-up, forgot-password, reset-password, verify-email
│   ├── (client)/
│   │   ├── page.tsx               # Home
│   │   ├── hotels/                # Search + hotel detail
│   │   ├── booking/               # Booking flow + confirmation + QR verify
│   │   ├── account/               # Bookings, reviews, profile
│   │   ├── terms/ privacy/        # Static pages
│   ├── (admin)/                   # Admin panel
│   ├── api/
│   │   ├── webhooks/stripe/       # Stripe webhook handler
│   │   └── cron/                  # expire-bookings, checkin-reminder, review-request
│   ├── error.tsx / not-found.tsx / loading.tsx / global-error.tsx
│
├── server/
│   └── routers/
│       ├── hotel.ts               # featured, search, detail, reviews, filterOptions
│       ├── booking.ts             # createIntent, confirmPayment, getConfirmation, myBookings, cancel
│       ├── review.ts              # create, myReviews, getForBooking
│       └── user.ts                # me, updateProfile, connectedAccounts, deleteAccount
│
├── components/
│   ├── client/
│   │   ├── home/                  # Hero, FeaturedHotels, PopularDestinations, HowItWorks...
│   │   ├── hotels/                # HotelCard, HotelsList, MapView, FilterSidebar...
│   │   ├── hotel-detail/          # ImageGallery, AvailableRooms, BookingSidebar, LocationMap...
│   │   ├── booking/               # GuestInfoForm, PaymentSection, ConfirmationClient, BookingPrint...
│   │   ├── account/               # BookingDetail, CancelSection, WriteReview, ProfileClient...
│   │   └── layout/                # ClientHeader, ClientFooter
│   ├── admin/
│   │   └── hotel-form.tsx         # Hotel form with MapPicker
│   └── common/                    # Logo, MapPicker, LocationMap, PasswordInput...
│
├── emails/
│   ├── booking-confirmation.tsx   # With embedded QR code
│   ├── booking-cancellation.tsx
│   ├── checkin-reminder.tsx
│   ├── review-request.tsx
│   ├── payment-failed.tsx
│   ├── email-verification.tsx
│   └── reset-password.tsx
│
├── lib/
│   ├── email.ts                   # Resend send helpers
│   ├── qr.ts                      # QR code generation (qrcode lib)
│   ├── qstash.ts                  # Cron schedule registration
│   ├── utils/
│   │   ├── format.ts              # formatDateShort, formatDateFull, formatCurrencyUSD, toDateParam...
│   │   ├── booking.ts             # calcNights, calcTotal, getDatesInRange, getBookingExpiresAt
│   │   └── refund-policy.ts       # calcRefundPolicy, calcRefundAmount
│   └── search-params/
│       ├── hotels.ts              # hotelSearchParsers (nuqs)
│       └── account-bookings.ts
│
└── hooks/
    └── client/
        ├── use-hotels.ts
        ├── use-booking.ts
        ├── use-review.ts
        ├── use-user.ts
        ├── use-infinite-scroll.ts
        └── use-avatar-upload.ts
```

---

## Database Schema (Key Models)

```
User
Hotel         (slug, starRating, status, addressId)
Room          (slug, basePrice, isActive)
RoomAvailability (status: AVAILABLE|LOCKED|BOOKED|MAINTENANCE, lockToken, lockExpiresAt)
Booking       (bookingRef, status, paymentStatus, expiresAt, cancelReason, cancelledAt)
BookingItem
Payment       (stripePaymentIntentId, stripeRefundId, type: CHARGE|REFUND)
Review        (status: PENDING|APPROVED|REJECTED)
HotelImage    (isPrimary)
HotelAmenity
RoomBed
Address       (latitude, longitude)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Stripe account
- Resend account
- Upstash QStash account

### Install

```bash
npm install
```

### Environment Variables

```env
# Database
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth (better-auth)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com

# Uploadthing
UPLOADTHING_TOKEN=

# QStash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
QSTASH_URL=
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

### Database

```bash
npx prisma generate
npx prisma migrate dev
```

### Register Cron Jobs

```bash
# Run once to register all 3 cron schedules in QStash
npx tsx scripts/register-crons.ts
```

Or call `scheduleCrons()` from `lib/qstash.ts` manually.

### Development

```bash
npm run dev
```

### Stripe Webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Booking Flow

```
User selects room
  → createIntent mutation
      → Check availability (RoomAvailability status = AVAILABLE)
      → Create Booking (PENDING) + BookingItem + lock RoomAvailability (LOCKED)
      → Create Payment record (PENDING)
      → Create Stripe PaymentIntent
  → User completes Stripe payment
  → Stripe sends payment_intent.succeeded webhook
      → Payment → PAID
      → Booking → CONFIRMED
      → RoomAvailability → BOOKED
      → Send confirmation email with QR code
```

### Availability Locking

Room dates are locked via `RoomAvailability` rows with `status = LOCKED` during checkout. The `createMany` call uses a unique constraint on `(roomId, date)` — if a concurrent booking tries to lock the same date, it throws a Prisma unique constraint error caught as `CONFLICT`. Locks expire after 15 minutes; a QStash cron cleans up expired bookings every 5 minutes.

---

## Refund Policy

| When cancelled | Refund |
|---|---|
| Within 24h of booking | 100% |
| More than 7 days before check-in | 100% |
| 3–7 days before check-in | 50% |
| Less than 3 days before check-in | 0% |

Admin cancellations always refund 100% regardless of timing.

---

## Email Templates

All templates use React Email with Cormorant Garamond + Nunito Sans fonts and a warm parchment color palette (`#F5F0E8` / `#C9A96E`).

| Template | Trigger |
|---|---|
| `booking-confirmation` | Stripe `payment_intent.succeeded` — includes QR code |
| `booking-cancellation` | User or admin cancel — includes refund amount |
| `checkin-reminder` | Cron: 1 day before check-in |
| `review-request` | Cron: 1 day after check-out |
| `payment-failed` | Stripe `payment_intent.payment_failed` |
| `email-verification` | Sign-up |
| `reset-password` | Forgot password |

---

## Maps

Three Leaflet map components, all using **Carto Voyager** tiles (English labels, no API key required):

- `LocationMap` — read-only hotel location on hotel detail page
- `MapPicker` — click-to-pick coordinates in admin hotel form
- `HotelsMapView` — hotels search map view with custom price marker badges and popup cards

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/webhooks/stripe` | POST | Stripe event handler |
| `/api/cron/expire-bookings` | POST | Cancel expired unpaid bookings |
| `/api/cron/checkin-reminder` | POST | Send check-in reminder emails |
| `/api/cron/review-request` | POST | Send review request emails |

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npx prisma studio    # Database GUI
npx email dev        # React Email preview server
```