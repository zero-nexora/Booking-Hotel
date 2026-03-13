import { prisma } from "./client";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDate(date: Date): Date {
  return new Date(date.toISOString().split("T")[0]);
}

export async function seedBookings(
  users: Record<string, { id: string }>,
  hotels: Record<string, { id: string }>,
  rooms: { id: string; hotelId: string; basePrice: any; slug: string }[],
) {
  const { customer1, customer2, customer3, customer4, customer5 } =
    users as any;

  const today = toDate(new Date());

  const findRoom = (slug: string) => {
    const r = rooms.find((r) => r.slug === slug);
    if (!r) throw new Error(`Room slug not found: ${slug}`);
    return r;
  };

  const bookingDefs = [
    {
      userId: customer1.id,
      roomSlug: "classic-room",
      ciOffset: -60,
      coOffset: -55,
      nights: 5,
      adults: 2,
      children: 0,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      guestPhone: "+84912345678",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "High floor room if available",
    },
    {
      userId: customer2.id,
      roomSlug: "park-room-saigon",
      ciOffset: -45,
      coOffset: -42,
      nights: 3,
      adults: 2,
      children: 0,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      guestPhone: "+84987654321",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: null,
    },
    {
      userId: customer3.id,
      roomSlug: "fountain-view-king",
      ciOffset: -30,
      coOffset: -26,
      nights: 4,
      adults: 2,
      children: 0,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      guestPhone: "+16505554321",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "Champagne on arrival",
    },
    {
      userId: customer4.id,
      roomSlug: "vendome-room",
      ciOffset: -25,
      coOffset: -21,
      nights: 4,
      adults: 2,
      children: 0,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      guestPhone: "+33612345678",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "EUR",
      specialRequests: "Anniversary celebration — rose petals on bed",
    },
    {
      userId: customer5.id,
      roomSlug: "deluxe-garden-tokyo",
      ciOffset: -20,
      coOffset: -16,
      nights: 4,
      adults: 1,
      children: 0,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      guestPhone: "+81312345678",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "JPY",
      specialRequests: null,
    },
    {
      userId: customer1.id,
      roomSlug: "garden-pool-villa",
      ciOffset: -14,
      coOffset: -10,
      nights: 4,
      adults: 2,
      children: 0,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      guestPhone: "+84912345678",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "Honeymoon setup in villa",
    },
    {
      userId: customer2.id,
      roomSlug: "riverside-room-bangkok",
      ciOffset: -10,
      coOffset: -7,
      nights: 3,
      adults: 2,
      children: 1,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      guestPhone: "+84987654321",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "THB",
      specialRequests: "Baby cot required",
    },
    {
      userId: customer3.id,
      roomSlug: "ocean-view-room",
      ciOffset: -8,
      coOffset: -5,
      nights: 3,
      adults: 2,
      children: 2,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      guestPhone: "+16505554321",
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: null,
    },

    // ── CANCELLED / REFUNDED ──────────────────────────────────────────────────
    {
      userId: customer4.id,
      roomSlug: "prestige-room-pool-wing",
      ciOffset: -15,
      coOffset: -12,
      nights: 3,
      adults: 2,
      children: 0,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      guestPhone: "+33612345678",
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
      currency: "USD",
      specialRequests: null,
      cancelReason: "Change of travel plans",
    },
    {
      userId: customer5.id,
      roomSlug: "deluxe-queen-ritz-london",
      ciOffset: -5,
      coOffset: -2,
      nights: 3,
      adults: 2,
      children: 0,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      guestPhone: "+81312345678",
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
      currency: "GBP",
      specialRequests: null,
      cancelReason: "Medical emergency",
    },

    // ── CURRENT / CHECKED IN ──────────────────────────────────────────────────
    {
      userId: customer1.id,
      roomSlug: "riverside-standard",
      ciOffset: -2,
      coOffset: 2,
      nights: 4,
      adults: 1,
      children: 0,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      guestPhone: "+84912345678",
      status: "CHECKED_IN",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "Extra pillows",
    },
    {
      userId: customer2.id,
      roomSlug: "deluxe-city-view-mbs",
      ciOffset: -1,
      coOffset: 3,
      nights: 4,
      adults: 2,
      children: 0,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      guestPhone: "+84987654321",
      status: "CHECKED_IN",
      paymentStatus: "PAID",
      currency: "SGD",
      specialRequests: "Late checkout requested",
    },

    // ── UPCOMING / CONFIRMED ──────────────────────────────────────────────────
    {
      userId: customer1.id,
      roomSlug: "opera-suite",
      ciOffset: 5,
      coOffset: 9,
      nights: 4,
      adults: 2,
      children: 0,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      guestPhone: "+84912345678",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "Birthday surprise setup — cake and balloons",
    },
    {
      userId: customer3.id,
      roomSlug: "bay-view-suite-mbs",
      ciOffset: 7,
      coOffset: 12,
      nights: 5,
      adults: 2,
      children: 0,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      guestPhone: "+16505554321",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "SGD",
      specialRequests: null,
    },
    {
      userId: customer4.id,
      roomSlug: "beach-pool-villa",
      ciOffset: 10,
      coOffset: 15,
      nights: 5,
      adults: 2,
      children: 0,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      guestPhone: "+33612345678",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "In-villa dinner on arrival night",
    },
    {
      userId: customer5.id,
      roomSlug: "harbour-suite-sydney",
      ciOffset: 14,
      coOffset: 17,
      nights: 3,
      adults: 2,
      children: 0,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      guestPhone: "+81312345678",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "AUD",
      specialRequests: null,
    },
    {
      userId: customer2.id,
      roomSlug: "lake-view-deluxe-dalat",
      ciOffset: 20,
      coOffset: 23,
      nights: 3,
      adults: 2,
      children: 1,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      guestPhone: "+84987654321",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "VND",
      specialRequests: "Mountain biking tour recommendation",
    },
    {
      userId: customer1.id,
      roomSlug: "1-bedroom-pool-villa-phuket",
      ciOffset: 30,
      coOffset: 35,
      nights: 5,
      adults: 2,
      children: 0,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      guestPhone: "+84912345678",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "THB",
      specialRequests: "Vegan meal arrangements please",
    },
    {
      userId: customer3.id,
      roomSlug: "authors-suite",
      ciOffset: 40,
      coOffset: 44,
      nights: 4,
      adults: 2,
      children: 0,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      guestPhone: "+16505554321",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "THB",
      specialRequests: null,
    },
    {
      userId: customer4.id,
      roomSlug: "grand-suite-plaza",
      ciOffset: 45,
      coOffset: 50,
      nights: 5,
      adults: 2,
      children: 2,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      guestPhone: "+33612345678",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      currency: "USD",
      specialRequests: "Two extra beds for children",
    },

    {
      userId: customer5.id,
      roomSlug: "heritage-room-dalat",
      ciOffset: 60,
      coOffset: 63,
      nights: 3,
      adults: 1,
      children: 0,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      guestPhone: "+81312345678",
      status: "PENDING",
      paymentStatus: "UNPAID",
      currency: "VND",
      specialRequests: null,
    },
    {
      userId: customer1.id,
      roomSlug: "royal-suite-burj",
      ciOffset: 90,
      coOffset: 93,
      nights: 3,
      adults: 4,
      children: 0,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      guestPhone: "+84912345678",
      status: "PENDING",
      paymentStatus: "UNPAID",
      currency: "USD",
      specialRequests: "Helicopter airport transfer",
    },
  ];

  const bookings: Record<string, any> = {};

  for (let i = 0; i < bookingDefs.length; i++) {
    const def = bookingDefs[i];
    const room = findRoom(def.roomSlug);
    const checkIn = addDays(today, def.ciOffset);
    const checkOut = addDays(today, def.coOffset);
    const unitPrice = Number(room.basePrice);
    const total = unitPrice * def.nights;

    const isCancelled = def.status === "CANCELLED";
    const isPending = def.status === "PENDING";
    const itemStatus = isCancelled
      ? "CANCELLED"
      : def.status === "CHECKED_OUT"
        ? "CHECKED_OUT"
        : def.status === "CHECKED_IN"
          ? "CHECKED_IN"
          : "CONFIRMED";

    const paymentsCreate: any[] = [];
    if (!isPending) {
      paymentsCreate.push({
        userId: def.userId,
        type: "CHARGE",
        status: isCancelled ? "REFUNDED" : "PAID",
        amount: total,
        currency: def.currency,
        stripePaymentIntentId: `pi_test_booking_${i + 1}_charge`,
        paidAt: addDays(checkIn, -7),
        refundedAt: isCancelled ? addDays(checkIn, -1) : null,
      });
      if (isCancelled) {
        paymentsCreate.push({
          userId: def.userId,
          type: "REFUND",
          status: "PAID",
          amount: total,
          currency: def.currency,
          stripeRefundId: `re_test_booking_${i + 1}_refund`,
          paidAt: addDays(checkIn, -1),
          refundedAt: addDays(checkIn, -1),
        });
      }
    }

    const hotelId = room.hotelId;
    const booking = await prisma.booking.create({
      data: {
        userId: def.userId,
        hotelId,
        status: def.status as any,
        paymentStatus: def.paymentStatus as any,
        guestName: def.guestName,
        guestEmail: def.guestEmail,
        guestPhone: def.guestPhone ?? null,
        specialRequests: def.specialRequests ?? null,
        checkIn,
        checkOut,
        totalAmount: total,
        currency: def.currency,
        cancelledAt: isCancelled ? addDays(checkIn, -1) : null,
        cancelReason: (def as any).cancelReason ?? null,
        items: {
          create: [
            {
              roomId: room.id,
              checkIn,
              checkOut,
              nights: def.nights,
              adults: def.adults,
              children: def.children,
              unitPrice,
              total,
              currency: def.currency,
              status: itemStatus as any,
            },
          ],
        },
        payments: { create: paymentsCreate },
      },
    });

    bookings[`booking${i + 1}`] = { ...booking, hotelId };
  }

  const allBookingItems = await prisma.bookingItem.findMany({
    where: { bookingId: { in: Object.values(bookings).map((b: any) => b.id) } },
  });

  for (const item of allBookingItems) {
    const checkIn = new Date(item.checkIn);
    const checkOut = new Date(item.checkOut);
    const dates: Date[] = [];
    let cur = new Date(checkIn);
    while (cur < checkOut) {
      dates.push(new Date(cur));
      cur = addDays(cur, 1);
    }

    const isFuture = checkIn > today;
    const status =
      item.status === "CANCELLED"
        ? "AVAILABLE"
        : isFuture
          ? "BOOKED"
          : "AVAILABLE";

    for (const date of dates) {
      await prisma.roomAvailability.upsert({
        where: { roomId_date: { roomId: item.roomId, date } },
        update: { status, bookingItemId: status === "BOOKED" ? item.id : null },
        create: {
          roomId: item.roomId,
          date,
          status,
          bookingItemId: status === "BOOKED" ? item.id : null,
        },
      });
    }
  }

  console.log(
    `✅ ${Object.keys(bookings).length} bookings & availability seeded`,
  );
  return bookings;
}
