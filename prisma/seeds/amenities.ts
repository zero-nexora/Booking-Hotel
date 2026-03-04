import { prisma } from "./client";

const amenityData = [
  { name: "Free WiFi", icon: "wifi" },
  { name: "Swimming Pool", icon: "waves" },
  { name: "Gym", icon: "dumbbell" },
  { name: "Spa", icon: "sparkles" },
  { name: "Restaurant", icon: "utensils" },
  { name: "Bar", icon: "wine" },
  { name: "Parking", icon: "car" },
  { name: "Airport Shuttle", icon: "bus" },
  { name: "Room Service", icon: "bell" },
  { name: "Concierge", icon: "user-tie" },
  { name: "Business Center", icon: "briefcase" },
  { name: "Pet Friendly", icon: "paw-print" },
  { name: "Air Conditioning", icon: "wind" },
  { name: "Minibar", icon: "glass-water" },
  { name: "Safe", icon: "lock" },
  { name: "Flat-screen TV", icon: "tv" },
  { name: "Bathtub", icon: "bath" },
  { name: "Balcony", icon: "door-open" },
];

export async function seedAmenities() {
  const amenities: Record<string, { id: string; name: string; icon: string | null }> = {};

  for (const data of amenityData) {
    const amenity = await prisma.amenity.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    amenities[data.name] = amenity;
  }

  console.log("✅ Amenities seeded");
  return amenities;
}