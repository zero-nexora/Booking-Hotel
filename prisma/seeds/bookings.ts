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
  rooms: { id: string; hotelId: string; basePrice: any }[],
) {
  const { customer1, customer2 } = users as any;
  const { grandNY, sunsetLA, palaisParis } = hotels as any;

  const today = toDate(new Date());
  const past30 = addDays(today, -30);
  const past20 = addDays(today, -20);
  const past15 = addDays(today, -15);
  const past5 = addDays(today, -5);
  const future10 = addDays(today, 10);
  const future15 = addDays(today, 15);
  const future20 = addDays(today, 20);
  const future25 = addDays(today, 25);

  const grandNYRooms = rooms.filter((r) => r.hotelId === grandNY.id);
  const sunsetLARooms = rooms.filter((r) => r.hotelId === sunsetLA.id);
  const palaisRooms = rooms.filter((r) => r.hotelId === palaisParis.id);

  const room1 = grandNYRooms[0];
  const room2 = grandNYRooms[1];
  const room3 = sunsetLARooms[0];
  const room4 = palaisRooms[0];

  const booking1 = await prisma.booking.create({
    data: {
      userId: customer1.id,
      hotelId: grandNY.id,
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      guestName: "John Doe",
      guestEmail: "john.doe@example.com",
      guestPhone: "+1987654321",
      specialRequests: "Late checkout if possible",
      checkIn: past30,
      checkOut: past20,
      totalAmount: room1.basePrice.times
        ? Number(room1.basePrice) * 10
        : Number(room1.basePrice) * 10,
      currency: "USD",
      items: {
        create: [
          {
            roomId: room1.id,
            checkIn: past30,
            checkOut: past20,
            nights: 10,
            adults: 2,
            children: 0,
            unitPrice: room1.basePrice,
            total: Number(room1.basePrice) * 10,
            currency: "USD",
            status: "CHECKED_OUT",
          },
        ],
      },
      payments: {
        create: [
          {
            userId: customer1.id,
            type: "CHARGE",
            status: "PAID",
            amount: Number(room1.basePrice) * 10,
            currency: "USD",
            stripePaymentIntentId: "pi_test_booking1_charge",
            paidAt: past30,
          },
        ],
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: customer1.id,
      hotelId: grandNY.id,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      guestName: "John Doe",
      guestEmail: "john.doe@example.com",
      checkIn: future10,
      checkOut: future15,
      totalAmount: Number(room2.basePrice) * 5,
      currency: "USD",
      items: {
        create: [
          {
            roomId: room2.id,
            checkIn: future10,
            checkOut: future15,
            nights: 5,
            adults: 2,
            children: 0,
            unitPrice: room2.basePrice,
            total: Number(room2.basePrice) * 5,
            currency: "USD",
            status: "CONFIRMED",
          },
        ],
      },
      payments: {
        create: [
          {
            userId: customer1.id,
            type: "CHARGE",
            status: "PAID",
            amount: Number(room2.basePrice) * 5,
            currency: "USD",
            stripePaymentIntentId: "pi_test_booking2_charge",
            paidAt: new Date(),
          },
        ],
      },
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      userId: customer2.id,
      hotelId: sunsetLA.id,
      status: "CHECKED_OUT",
      paymentStatus: "REFUNDED",
      guestName: "Jane Smith",
      guestEmail: "jane.smith@example.com",
      checkIn: past15,
      checkOut: past5,
      totalAmount: Number(room3.basePrice) * 10,
      currency: "USD",
      cancelledAt: past15,
      cancelReason: "Change of plans",
      items: {
        create: [
          {
            roomId: room3.id,
            checkIn: past15,
            checkOut: past5,
            nights: 10,
            adults: 1,
            children: 0,
            unitPrice: room3.basePrice,
            total: Number(room3.basePrice) * 10,
            currency: "USD",
            status: "CANCELLED",
          },
        ],
      },
      payments: {
        create: [
          {
            userId: customer2.id,
            type: "CHARGE",
            status: "REFUNDED",
            amount: Number(room3.basePrice) * 10,
            currency: "USD",
            stripePaymentIntentId: "pi_test_booking3_charge",
            paidAt: past15,
            refundedAt: past15,
          },
          {
            userId: customer2.id,
            type: "REFUND",
            status: "PAID",
            amount: Number(room3.basePrice) * 10,
            currency: "USD",
            stripeRefundId: "re_test_booking3_refund",
            paidAt: past15,
            refundedAt: past15,
          },
        ],
      },
    },
  });

  const booking4 = await prisma.booking.create({
    data: {
      userId: customer2.id,
      hotelId: palaisParis.id,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      guestName: "Jane Smith",
      guestEmail: "jane.smith@example.com",
      specialRequests: "Champagne and roses in room",
      checkIn: future20,
      checkOut: future25,
      totalAmount: Number(room4.basePrice) * 5,
      currency: "USD",
      items: {
        create: [
          {
            roomId: room4.id,
            checkIn: future20,
            checkOut: future25,
            nights: 5,
            adults: 2,
            children: 0,
            unitPrice: room4.basePrice,
            total: Number(room4.basePrice) * 5,
            currency: "USD",
            status: "CONFIRMED",
          },
        ],
      },
      payments: {
        create: [
          {
            userId: customer2.id,
            type: "CHARGE",
            status: "PAID",
            amount: Number(room4.basePrice) * 5,
            currency: "EUR",
            stripePaymentIntentId: "pi_test_booking4_charge",
            paidAt: new Date(),
          },
        ],
      },
    },
  });

  const allBookingItems = await prisma.bookingItem.findMany({
    where: {
      bookingId: { in: [booking1.id, booking2.id, booking3.id, booking4.id] },
    },
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

  console.log("✅ Bookings & availability seeded");
  return { booking1, booking2, booking3, booking4 };
}
