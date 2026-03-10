import { createTRPCRouter } from "@/trpc/init";
import { hotelRouter } from "./hotel";
import { bookingRouter } from "./booking";
import { reviewRouter } from "./review";
import { userRouter } from "./user";

export const clientRouter = createTRPCRouter({
  hotel: hotelRouter,
  booking: bookingRouter,
  review: reviewRouter,
  user: userRouter,
});
