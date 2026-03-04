import { prisma } from "./client";

export async function seedReviews(
  users: Record<string, { id: string }>,
  bookings: Record<string, { id: string; hotelId: string }>
) {
  const { customer1, customer2 } = users as any;
  const { booking1, booking3 } = bookings as any;

  const review1 = await prisma.review.create({
    data: {
      bookingId: booking1.id,
      hotelId: booking1.hotelId,
      userId: customer1.id,
      overallRating: 5,
      title: "Absolutely phenomenal stay!",
      comment:
        "The Grand New York exceeded every expectation. The staff was incredibly attentive, the room was immaculate, and the views of Manhattan were simply breathtaking. The rooftop pool was the highlight of our stay. We will definitely be returning for our anniversary next year.",
      status: "APPROVED",
    },
  });

  const review2 = await prisma.review.create({
    data: {
      bookingId: booking3.id,
      hotelId: booking3.hotelId,
      userId: customer2.id,
      overallRating: 3,
      title: "Good but room for improvement",
      comment:
        "The location on Sunset Boulevard is fantastic and the pool area is gorgeous. However, the check-in process took longer than expected and our room wasn't ready until 4pm despite a 2pm check-in policy. The staff was apologetic and offered complimentary drinks, which we appreciated. Would consider returning if these issues are addressed.",
      status: "APPROVED",
    },
  });

  console.log("✅ Reviews seeded");
  return { review1, review2 };
}