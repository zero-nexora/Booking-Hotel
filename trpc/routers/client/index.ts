import { clientHotelRouter } from "./hotel";
import { clientBookingRouter } from "./booking";
import { clientReviewRouter } from "./review";
import { clientUserRouter } from "./user";
import { createTRPCRouter } from "@/trpc/init";

export const clientRouter = createTRPCRouter({
  hotel: clientHotelRouter,
  booking: clientBookingRouter,
  review: clientReviewRouter,
  user: clientUserRouter,
});
