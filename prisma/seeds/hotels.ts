import { prisma } from "./client";

export async function seedHotels(
  addresses: { addr1: { id: string }; addr2: { id: string }; addr3: { id: string }; addr4: { id: string } },
  amenities: Record<string, { id: string }>
) {
  const { addr1, addr2, addr3, addr4 } = addresses;

  const grandNY = await prisma.hotel.create({
    data: {
      name: "The Grand New York",
      slug: "the-grand-new-york",
      description:
        "A luxurious 5-star hotel in the heart of Manhattan with breathtaking views of the city skyline. Perfect for business and leisure travelers seeking world-class amenities.",
      starRating: 5,
      status: "ACTIVE",
      phone: "+12125550101",
      email: "info@grandnewyork.com",
      addressId: addr1.id,
      policy: {
        create: { checkInTime: "15:00", checkOutTime: "11:00" },
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945", alt: "Hotel exterior", isPrimary: true, sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd", alt: "Hotel lobby", isPrimary: false, sortOrder: 1 },
          { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7", alt: "Swimming pool", isPrimary: false, sortOrder: 2 },
        ],
      },
      amenities: {
        create: [
          "Free WiFi", "Swimming Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking", "Room Service", "Concierge", "Business Center",
        ].map((name) => ({ amenityId: amenities[name].id })),
      },
    },
  });

  const sunsetLA = await prisma.hotel.create({
    data: {
      name: "Sunset Boulevard Hotel",
      slug: "sunset-boulevard-hotel",
      description:
        "Experience the magic of Los Angeles from our boutique hotel on the iconic Sunset Boulevard. Modern design meets California hospitality.",
      starRating: 4,
      status: "ACTIVE",
      phone: "+13105550202",
      email: "stay@sunsetboulevard.com",
      addressId: addr2.id,
      policy: {
        create: { checkInTime: "14:00", checkOutTime: "12:00" },
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", alt: "Hotel exterior", isPrimary: true, sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461", alt: "Hotel pool", isPrimary: false, sortOrder: 1 },
        ],
      },
      amenities: {
        create: [
          "Free WiFi", "Swimming Pool", "Gym", "Restaurant", "Bar", "Parking", "Pet Friendly",
        ].map((name) => ({ amenityId: amenities[name].id })),
      },
    },
  });

  const palaisParis = await prisma.hotel.create({
    data: {
      name: "Palais de Paris",
      slug: "palais-de-paris",
      description:
        "Nestled along the Seine, Palais de Paris offers an unmatched blend of French elegance and modern luxury. Steps away from the Louvre and Notre-Dame.",
      starRating: 5,
      status: "ACTIVE",
      phone: "+33145550303",
      email: "bonjour@palaisdeparis.fr",
      addressId: addr3.id,
      policy: {
        create: { checkInTime: "15:00", checkOutTime: "12:00" },
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", alt: "Hotel facade", isPrimary: true, sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", alt: "Luxury suite", isPrimary: false, sortOrder: 1 },
        ],
      },
      amenities: {
        create: [
          "Free WiFi", "Spa", "Restaurant", "Bar", "Room Service", "Concierge", "Airport Shuttle",
        ].map((name) => ({ amenityId: amenities[name].id })),
      },
    },
  });

  const tokyoInn = await prisma.hotel.create({
    data: {
      name: "Tokyo Serenity Inn",
      slug: "tokyo-serenity-inn",
      description:
        "A harmonious blend of traditional Japanese aesthetics and contemporary comfort in the vibrant heart of Tokyo's financial district.",
      starRating: 4,
      status: "ACTIVE",
      phone: "+81335550404",
      email: "hello@tokyoserenity.jp",
      addressId: addr4.id,
      policy: {
        create: { checkInTime: "14:00", checkOutTime: "11:00" },
      },
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", alt: "Hotel exterior", isPrimary: true, sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427", alt: "Traditional room", isPrimary: false, sortOrder: 1 },
        ],
      },
      amenities: {
        create: [
          "Free WiFi", "Gym", "Spa", "Restaurant", "Business Center", "Airport Shuttle",
        ].map((name) => ({ amenityId: amenities[name].id })),
      },
    },
  });

  console.log("✅ Hotels seeded");
  return { grandNY, sunsetLA, palaisParis, tokyoInn };
}