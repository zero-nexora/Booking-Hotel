import { adminHotelRouter } from "./hotel";
import { adminRoomRouter } from "./room";
import { adminBookingRouter } from "./booking";
import { adminReviewRouter } from "./review";
import { adminAmenityRouter } from "./amenity";
import { adminUserRouter } from "./user";
import { createTRPCRouter } from "@/trpc/init";
import { adminDashboardRouter } from "./dashboard";
import { adminLocationRouter } from "./location";
import { adminRoomTypeRouter } from "./room-type";
import { adminBedTypeRouter } from "./bed-type";

export const adminRouter = createTRPCRouter({
  dashboard: adminDashboardRouter,
  location: adminLocationRouter,
  hotel: adminHotelRouter,
  room: adminRoomRouter,
  booking: adminBookingRouter,
  review: adminReviewRouter,
  amenity: adminAmenityRouter,
  user: adminUserRouter,
  roomType: adminRoomTypeRouter,
  bedType: adminBedTypeRouter,
});
