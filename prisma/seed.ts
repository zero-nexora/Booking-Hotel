import "dotenv/config";
import { seedUsers } from "./seeds/users";
import { seedLocations } from "./seeds/locations";
import { seedAmenities } from "./seeds/amenities";
import { seedHotels } from "./seeds/hotels";
import { seedRoomTypesAndBedTypes, seedRooms } from "./seeds/rooms";
import { seedBookings } from "./seeds/bookings";
import { seedReviews } from "./seeds/reviews";
import { pool, prisma } from "./seeds/client";

async function main() {
  console.log("🌱 Starting seed...\n");

  const users = await seedUsers();
  const locations = await seedLocations();
  const amenities = await seedAmenities();

  const { addr1, addr2, addr3, addr4 } = locations;
  const hotels = await seedHotels({ addr1, addr2, addr3, addr4 }, amenities);

  const { roomTypes, bedTypes } = await seedRoomTypesAndBedTypes();
  const rooms = await seedRooms(hotels, roomTypes, bedTypes, amenities);

  const bookings = await seedBookings(users, hotels, rooms);
  await seedReviews(users, bookings);

  console.log("\n✨ Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });