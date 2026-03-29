# Staywise

Nền tảng đặt phòng khách sạn full-stack xây dựng trên Next.js 15, tRPC, Prisma và Stripe — tích hợp trợ lý AI, tìm kiếm bản đồ thời gian thực, xác minh check-in bằng QR code, và hệ thống email tự động.

[View English README →](./README.md)

---

## Công nghệ sử dụng

| Tầng | Công nghệ |
|---|---|
| Framework | Next.js 15 (App Router) |
| API | tRPC v11 + TanStack Query |
| ORM | Prisma (PostgreSQL) |
| Xác thực | better-auth |
| Thanh toán | Stripe |
| Trợ lý AI | Google Gemini 1.5 Flash |
| Email | Resend + React Email |
| Upload file | uploadthing |
| Cron jobs | Upstash QStash |
| Bản đồ | react-leaflet + Carto Voyager tiles |
| URL state | nuqs |
| UI | shadcn/ui + Tailwind CSS |
| Animation | Framer motion |
| Form | react-hook-form + zod |
| Ngày giờ | date-fns |
| QR code | qrcode |

---

## Tính năng

### Trải nghiệm khách hàng
- Tìm kiếm khách sạn theo thành phố, ngày, số khách với cuộn vô hạn
- Ba chế độ xem: **Danh sách**, **Lưới**, và **Bản đồ** tương tác với marker giá và thẻ thông tin
- Bộ lọc: khoảng giá, hạng sao, tiện nghi, loại giường, loại phòng, đánh giá tối thiểu
- Trang chi tiết khách sạn: gallery ảnh với lightbox, danh sách tiện nghi, phòng trống theo ngày, bản đồ Leaflet, đánh giá khách hàng
- **Trang chi tiết phòng**: trang riêng cho từng phòng với gallery ảnh, tiện nghi đầy đủ, cấu hình giường, diện tích/tầng, sidebar đặt phòng
- Quy trình đặt phòng: chọn phòng → thông tin khách → thanh toán Stripe (đếm ngược 15 phút) → xác nhận với hiệu ứng pháo giấy
- Email xác nhận đặt phòng kèm **QR code** được tạo phía server
- **Trang xác minh QR** — nhân viên khách sạn quét QR để xem trạng thái đặt phòng ngay lập tức
- In phiếu đặt phòng — mở tab mới với HTML được thiết kế riêng
- Quản lý đặt phòng: xem lịch sử, huỷ với chính sách hoàn tiền theo bậc, viết đánh giá
- Tài khoản: tổng quan, lịch sử đặt phòng, lịch sử thanh toán, lịch sử đánh giá, chỉnh sửa hồ sơ với upload ảnh đại diện

### Trợ lý AI
- Widget chat nổi sử dụng **Google Gemini 1.5 Flash**
- Lưu toàn bộ lịch sử hội thoại trong phiên làm việc
- Phản hồi **streaming** theo từng token trong thời gian thực
- **Tự động nhận biết ngôn ngữ**: trả lời tiếng Việt khi người dùng viết tiếng Việt, tiếng Anh khi viết tiếng Anh — không bao giờ pha trộn
- Câu hỏi gợi ý khi mở lần đầu
- Nút dừng giữa chừng và xoá lịch sử
- Hiểu ngữ cảnh nền tảng: chính sách huỷ phòng, quy trình check-in QR, các tính năng tài khoản, các bậc hoàn tiền

### Xác thực
- Đăng ký email/mật khẩu với xác minh email
- Đăng nhập Google OAuth
- Quên mật khẩu và đặt lại mật khẩu
- Thanh đo độ mạnh mật khẩu theo thời gian thực
- Xác thực dựa trên session qua better-auth

### Quản trị (Admin)
- Quản lý khách sạn với **chọn toạ độ bằng bản đồ** (MapPicker Leaflet)
- Chọn nhiều tiện nghi với tìm kiếm
- Chuyển trạng thái đặt phòng với **hoàn tiền Stripe đầy đủ** khi admin huỷ (bỏ qua chính sách người dùng)
- Duyệt đánh giá

### Hệ thống & Tự động hoá
- **Stripe webhooks**:
  - `payment_intent.succeeded` → xác nhận đặt phòng, mở khoá phòng → BOOKED, tạo QR, gửi email xác nhận
  - `payment_intent.payment_failed` → thông báo khách qua email
  - `charge.refunded` → cập nhật trạng thái thanh toán
- **QStash cron jobs** (3 lịch trình):
  - Mỗi 5 phút: huỷ các đặt phòng chưa thanh toán quá 15 phút và giải phóng khoá phòng
  - Hàng ngày 8h: gửi email nhắc nhở check-in cho khách vào ngày mai
  - Hàng ngày 10h: gửi email yêu cầu đánh giá cho khách đã check-out hôm qua
- Khoá phòng an toàn tránh race condition qua bảng `RoomAvailability` (`AVAILABLE → LOCKED → BOOKED`)
- Hỗ trợ hoàn tiền một phần qua Stripe (bậc 50%)

---

## Chính sách hoàn tiền

| Thời điểm huỷ | Hoàn tiền |
|---|---|
| Trong vòng 24h sau khi đặt | 100% |
| Hơn 7 ngày trước ngày check-in | 100% |
| 3–7 ngày trước ngày check-in | 50% |
| Dưới 3 ngày trước ngày check-in | 0% |

Admin huỷ phòng luôn hoàn 100%, không phụ thuộc thời gian.

---

## Danh sách trang

```
/                                        Trang chủ
/hotels                                  Tìm kiếm (danh sách / lưới / bản đồ)
/hotels/[slug]                           Chi tiết khách sạn
/hotels/[slug]/[roomSlug]                Chi tiết phòng
/booking/[hotelSlug]/[roomSlug]          Quy trình đặt phòng
/booking/confirmation/[bookingRef]       Xác nhận đặt phòng + pháo giấy
/booking/verify/[bookingRef]             Xác minh QR code (công khai)
/account                                 Tổng quan tài khoản
/account/bookings                        Lịch sử đặt phòng
/account/bookings/[bookingRef]           Chi tiết đặt phòng + huỷ
/account/bookings/[bookingRef]/review    Viết đánh giá
/account/reviews                         Đánh giá của tôi
/account/profile                         Chỉnh sửa hồ sơ
/sign-in · /sign-up                      Đăng nhập / Đăng ký
/forgot-password · /reset-password       Quên / Đặt lại mật khẩu
/verify-email                            Xác minh email
/terms · /privacy                        Điều khoản / Chính sách bảo mật
/admin                                   Trang quản trị
```

---

## API Routes

```
POST /api/webhooks/stripe         Xử lý sự kiện Stripe
POST /api/cron/expire-bookings    Huỷ đặt phòng hết hạn (QStash)
POST /api/cron/checkin-reminder   Gửi email nhắc check-in (QStash)
POST /api/cron/review-request     Gửi email yêu cầu đánh giá (QStash)
POST /api/ai/chat                 Chat AI Gemini với streaming
```

---

## Cấu trúc thư mục

```
├── app/
│   ├── (auth)/                   Đăng nhập, đăng ký, đặt lại mật khẩu, xác minh email
│   ├── (client)/
│   │   ├── hotels/               Tìm kiếm + chi tiết khách sạn + chi tiết phòng
│   │   ├── booking/              Quy trình đặt phòng + xác nhận + xác minh QR
│   │   ├── account/              Đặt phòng, đánh giá, hồ sơ
│   │   └── terms/ privacy/       Trang tĩnh pháp lý
│   ├── (admin)/                  Trang quản trị
│   └── api/
│       ├── webhooks/stripe/      Xử lý webhook Stripe
│       ├── cron/                 3 endpoint cron QStash
│       └── ai/chat/              Endpoint streaming Gemini
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
│   │   ├── hotel-detail/         ImageGallery, AvailableRooms, BookingSidebar, LocationMap, ReviewsSection
│   │   ├── room-detail/          RoomDetailClient, RoomImageGallery
│   │   ├── booking/              GuestInfoForm, PaymentSection, ConfirmationClient, BookingPrint, BookingVerifyClient, ExpiryTimer
│   │   ├── account/              BookingDetail, CancelSection, WriteReview, ProfileClient, StatusTimeline, PaymentHistory
│   │   └── layout/               ClientHeader, ClientFooter
│   ├── admin/                    HotelForm với MapPicker + AmenityMultiSelect
│   └── common/                   Logo, MapPicker, LocationMap (Leaflet, SSR-safe)
│
├── emails/                       7 template React Email (bộ thiết kế parchment)
│
├── lib/
│   ├── gemini.ts                 Gemini client + system prompt (quy tắc song ngữ)
│   ├── email.ts                  Hàm gửi email qua Resend
│   ├── qr.ts                     Tạo QR code phía server (output base64)
│   ├── qstash.ts                 Đăng ký lịch cron
│   └── utils/
│       ├── format.ts             formatDateShort/Full/Long/Range/Relative/Smart, formatCurrencyUSD, toDateParam
│       ├── booking.ts            calcNights, calcTotal, getDatesInRange, getBookingExpiresAt
│       ├── refund-policy.ts      calcRefundPolicy, calcRefundAmount (logic theo bậc)
│       └── amenity-icon.ts       getAmenityIcon (chuỗi slug → component Lucide)
│
└── hooks/client/
    ├── use-ai-chat.ts            Chat AI streaming với AbortController + lịch sử hội thoại
    ├── use-hotels.ts             Tìm kiếm (vô hạn) + chi tiết khách sạn + chi tiết phòng
    ├── use-booking.ts            Mutation và query đặt phòng
    ├── use-review.ts             CRUD đánh giá
    ├── use-user.ts               Quản lý hồ sơ và tài khoản
    ├── use-infinite-scroll.ts    Sentinel IntersectionObserver
    └── use-avatar-upload.ts      Tích hợp uploadthing với preview
```

---

## Schema cơ sở dữ liệu (các model chính)

```
User
Hotel           (slug, starRating, status: ACTIVE|INACTIVE|MAINTENANCE)
Room            (slug, basePrice, capacity, sizeM2, floor, isActive)
RoomAvailability (roomId, date, status: AVAILABLE|LOCKED|BOOKED|MAINTENANCE, lockToken, lockExpiresAt)
Booking         (bookingRef, status, paymentStatus, expiresAt, cancelReason, cancelledAt)
BookingItem     (roomId, nights, adults, children, unitPrice, total, status)
Payment         (type: CHARGE|REFUND, status, stripePaymentIntentId, stripeRefundId, paidAt, refundedAt)
Review          (overallRating, status: PENDING|APPROVED|REJECTED)
HotelImage      (url, isPrimary, sortOrder)
Amenity         (name, icon)  — dùng chung cho khách sạn và phòng
RoomBed         (roomId, bedTypeId, quantity)
Address         (street, cityId, latitude, longitude)
HotelPolicy     (checkInTime, checkOutTime)
```

---

## Quy trình đặt phòng (kỹ thuật)

```
1.  Người dùng chọn ngày + số khách → trang chi tiết khách sạn hiển thị phòng trống
2.  Nhấn "Chọn phòng" → trang chi tiết phòng hoặc trang đặt phòng
3.  Mutation createIntent:
      a. Kiểm tra rate limit
      b. Fetch song song: xác thực khách sạn + phòng
      c. DB transaction:
           - Kiểm tra RoomAvailability — không có dòng LOCKED/BOOKED trong khoảng ngày
           - Tạo Booking (PENDING, UNPAID) + BookingItem
           - createMany RoomAvailability (LOCKED) — ràng buộc unique ngăn race condition
           - Tạo Payment (PENDING)
      d. Tạo Stripe PaymentIntent bên ngoài transaction
      e. Nếu Stripe lỗi → rollback: huỷ Booking, giải phóng khoá
4.  Đồng hồ đếm ngược 15 phút hiển thị trên giao diện
5.  Người dùng hoàn tất thanh toán Stripe
6.  Stripe gửi webhook payment_intent.succeeded:
      a. Transaction tuần tự: Payment(PAID) + Booking(CONFIRMED) + Items(CONFIRMED) + Availability(BOOKED)
      b. Tạo QR phía server: qrcode.toDataURL(verifyUrl)
      c. Gửi email xác nhận (React Email + Resend) với QR nhúng dưới dạng base64 <img>
7.  Người dùng xem /booking/confirmation/[ref] với hiệu ứng pháo giấy
8.  Nhân viên khách sạn quét QR → /booking/verify/[ref] (công khai, không cần đăng nhập)
```

---

## Bắt đầu

### Yêu cầu hệ thống

- Node.js 20+
- PostgreSQL
- Tài khoản [Stripe](https://stripe.com)
- Tài khoản [Resend](https://resend.com)
- [Google AI Studio](https://aistudio.google.com) (Gemini API key)
- Tài khoản [Upstash](https://upstash.com) (QStash)
- Tài khoản [uploadthing](https://uploadthing.com)

### Cài đặt

```bash
npm install
```

### Biến môi trường

Tạo file `.env.local`:

```env
# Cơ sở dữ liệu
DATABASE_URL=postgresql://user:password@localhost:5432/staywise

# URL ứng dụng
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Xác thực — better-auth
BETTER_AUTH_SECRET=chuoi_bi_mat_toi_thieu_32_ky_tu
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

### Cài đặt & Chạy

```bash
# Tạo Prisma client
npx prisma generate

# Chạy migration
npx prisma migrate dev

# Đăng ký cron jobs QStash (chạy một lần)
npx tsx scripts/register-crons.ts

# Khởi động server phát triển
npm run dev

# Terminal riêng: chuyển tiếp webhook Stripe
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Các lệnh khác

```bash
npm run build          # Build production
npx prisma studio      # Giao diện quản lý database
npx email dev          # Xem trước template email (cổng 3001)
```

---

## Template Email

Tất cả 7 template dùng **hệ thiết kế parchment**: nền `#F5F0E8`, điểm nhấn vàng `#C9A96E`, tiêu đề font Cormorant Garamond + thân font Nunito Sans.

| Template | Khi nào gửi |
|---|---|
| `booking-confirmation` | Webhook `payment_intent.succeeded` — kèm QR code |
| `booking-cancellation` | Huỷ đặt phòng (người dùng hoặc admin) — hiển thị số tiền hoàn |
| `checkin-reminder` | Cron hàng ngày 8h — 1 ngày trước check-in |
| `review-request` | Cron hàng ngày 10h — 1 ngày sau check-out |
| `payment-failed` | Webhook `payment_intent.payment_failed` |
| `email-verification` | Đăng ký tài khoản mới |
| `reset-password` | Yêu cầu đặt lại mật khẩu |

---

## Bản đồ

Ba component Leaflet, tất cả dùng tile **Carto Voyager** (nhãn tiếng Anh, miễn phí, không cần API key):

| Component | Vị trí | Chức năng |
|---|---|---|
| `LocationMap` | Trang chi tiết khách sạn | Chỉ đọc, hiển thị vị trí khách sạn với popup tên |
| `MapPicker` | Form quản trị khách sạn | Click để đặt marker, đồng bộ lat/lng vào form |
| `HotelsMapView` | `/hotels?view=map` | Marker giá, click mở popup thông tin + nút "Xem khách sạn" |

Tất cả import qua `dynamic(() => import(...), { ssr: false })` để tránh lỗi SSR do Leaflet phụ thuộc vào `window`.

---

## Giấy phép

MIT