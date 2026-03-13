import "dotenv/config";
import { prisma, pool } from "./client";
import { seedUsers } from "./users";
import { seedLocations } from "./locations";
import { seedAmenities } from "./amenities";
import { seedHotels } from "./hotels";
import { seedRooms, seedRoomTypesAndBedTypes } from "./rooms";
import { seedBookings } from "./bookings";
import { seedReviews } from "./reviews";

async function main() {
  console.log("🌱 Starting database seed...\n");

  const users = await seedUsers();
  const { addresses } = await seedLocations();
  const amenities = await seedAmenities();
  const hotels = await seedHotels(addresses, amenities);
  const { roomTypes, bedTypes } = await seedRoomTypesAndBedTypes();
  const rooms = await seedRooms(hotels, roomTypes, bedTypes, amenities);
  const bookings = await seedBookings(users, hotels, rooms as any);
  await seedReviews(users, bookings as any, hotels, rooms as any);

  console.log("\n✅ All seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
