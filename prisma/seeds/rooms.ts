import { Prisma } from "../generated/prisma/client";
import { prisma } from "./client";

type RoomData = {
  hotelSlug: string;
  name: string;
  slug: string;
  roomTypeId: string;
  description: string;
  capacity: number;
  sizeM2: number;
  floor: number;
  basePrice: number;
  isActive: boolean;
  beds: { bedTypeId: string; quantity: number }[];
  amenityKeys: string[];
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
};

export async function seedRoomTypesAndBedTypes() {
  const roomTypeNames = [
    "Standard",
    "Deluxe",
    "Suite",
    "Penthouse",
    "Studio",
    "Villa",
  ];
  const bedTypeNames = ["Single", "Double", "Queen", "King", "Twin", "Bunk"];

  const roomTypeRecords = await Promise.all(
    roomTypeNames.map((name) =>
      prisma.roomType.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  const bedTypeRecords = await Promise.all(
    bedTypeNames.map((name) =>
      prisma.bedType.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );

  const [rtStandard, rtDeluxe, rtSuite, rtPenthouse, rtStudio, rtVilla] =
    roomTypeRecords;
  const [btSingle, btDouble, btQueen, btKing, btTwin, btBunk] = bedTypeRecords;

  console.log("✅ Room types & bed types seeded");
  return {
    roomTypes: {
      rtStandard,
      rtDeluxe,
      rtSuite,
      rtPenthouse,
      rtStudio,
      rtVilla,
    },
    bedTypes: { btSingle, btDouble, btQueen, btKing, btTwin, btBunk },
  };
}

export async function seedRooms(
  hotels: Record<string, { id: string }>,
  roomTypes: Record<string, { id: string }>,
  bedTypes: Record<string, { id: string }>,
  amenities: Record<string, { id: string }>,
) {
  const { rtStandard, rtDeluxe, rtSuite, rtPenthouse, rtVilla } =
    roomTypes as any;
  const { btDouble, btQueen, btKing, btTwin } = bedTypes as any;

  const roomsData: RoomData[] = [
    // ── Sofitel Legend Metropole Hanoi ─────────────────────────────────────
    {
      hotelSlug: "sofitel-legend-metropole-hanoi",
      name: "Classic Room",
      slug: "classic-room",
      roomTypeId: rtStandard.id,
      description:
        "Elegantly appointed Classic Room in the Original Wing, featuring French colonial décor, hardwood floors, and garden or courtyard views.",
      capacity: 2,
      sizeM2: 32,
      floor: 2,
      basePrice: 220,
      isActive: true,
      beds: [{ bedTypeId: btQueen.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Classic room colonial décor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Bathroom with marble fittings",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Garden courtyard view",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "sofitel-legend-metropole-hanoi",
      name: "Prestige Room Pool Wing",
      slug: "prestige-room-pool-wing",
      roomTypeId: rtDeluxe.id,
      description:
        "Located in the Pool Wing, this spacious room combines contemporary comfort with a touch of Indochine style and direct pool access.",
      capacity: 2,
      sizeM2: 42,
      floor: 3,
      basePrice: 350,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Prestige room Indochine décor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
          alt: "Pool access from balcony",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble bathroom with bathtub",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "sofitel-legend-metropole-hanoi",
      name: "Grand Suite",
      slug: "grand-suite-metropole",
      roomTypeId: rtSuite.id,
      description:
        "Our Grand Suite in the Original Wing spans 75m² of French colonial elegance with a separate drawing room, butler service, and garden views.",
      capacity: 3,
      sizeM2: 75,
      floor: 4,
      basePrice: 680,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Grand suite drawing room",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Master bedroom with king bed",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Luxury en-suite bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── InterContinental Hanoi Westlake ───────────────────────────────────
    {
      hotelSlug: "intercontinental-hanoi-westlake",
      name: "Lake Wing Deluxe",
      slug: "lake-wing-deluxe",
      roomTypeId: rtDeluxe.id,
      description:
        "Overwater room on stilts above West Lake with floor-to-ceiling glass giving unobstructed panoramic lake views and magical sunsets.",
      capacity: 2,
      sizeM2: 45,
      floor: 1,
      basePrice: 280,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
          alt: "Overwater room with West Lake view",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "King bed facing panoramic glass",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Bathtub with lake view",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "intercontinental-hanoi-westlake",
      name: "Lake Wing Suite",
      slug: "lake-wing-suite",
      roomTypeId: rtSuite.id,
      description:
        "Overwater suite with a private terrace deck, living area, and 180° West Lake view — the most romantic room in Hanoi.",
      capacity: 2,
      sizeM2: 90,
      floor: 2,
      basePrice: 560,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          alt: "Suite private terrace over the lake",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Living area with 180° lake views",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Soaking tub overlooking the water",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "intercontinental-hanoi-westlake",
      name: "City Wing Standard",
      slug: "city-wing-standard",
      roomTypeId: rtStandard.id,
      description:
        "Contemporary room in the city-facing wing with modern furnishings, ideal for business travelers visiting Hanoi.",
      capacity: 2,
      sizeM2: 30,
      floor: 5,
      basePrice: 155,
      isActive: true,
      beds: [{ bedTypeId: btDouble.id, quantity: 1 }],
      amenityKeys: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Safe"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "City wing standard room",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
          alt: "Contemporary workspace",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Modern bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Park Hyatt Saigon ─────────────────────────────────────────────────
    {
      hotelSlug: "park-hyatt-saigon",
      name: "Park Room",
      slug: "park-room-saigon",
      roomTypeId: rtStandard.id,
      description:
        "Sophisticated room with Vietnamese silk artwork, marble bathroom, and views of Lam Son Square or the hotel's inner garden.",
      capacity: 2,
      sizeM2: 38,
      floor: 4,
      basePrice: 260,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Park room with Vietnamese silk décor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "View of Lam Son Square",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "park-hyatt-saigon",
      name: "Park Deluxe Twin",
      slug: "park-deluxe-twin",
      roomTypeId: rtDeluxe.id,
      description:
        "Spacious room with twin beds, ideal for colleagues or friends traveling together, with views of the opera house square.",
      capacity: 3,
      sizeM2: 42,
      floor: 6,
      basePrice: 310,
      isActive: true,
      beds: [{ bedTypeId: btTwin.id, quantity: 2 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Deluxe twin room layout",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Opera House square view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble bathroom with bathtub",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "park-hyatt-saigon",
      name: "Opera Suite",
      slug: "opera-suite",
      roomTypeId: rtSuite.id,
      description:
        "Corner suite overlooking the iconic Opera House with a wraparound balcony, separate living room, and bespoke Vietnamese lacquer furniture.",
      capacity: 3,
      sizeM2: 100,
      floor: 8,
      basePrice: 850,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Opera suite corner living room",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Wraparound balcony Opera House view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Luxury bathroom with soaking tub",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Liberty Central Saigon Riverside ──────────────────────────────────
    {
      hotelSlug: "liberty-central-saigon-riverside",
      name: "Riverside Standard",
      slug: "riverside-standard",
      roomTypeId: rtStandard.id,
      description:
        "Modern and comfortable room with partial river views, perfect for exploring District 1's attractions.",
      capacity: 2,
      sizeM2: 28,
      floor: 3,
      basePrice: 89,
      isActive: true,
      beds: [{ bedTypeId: btDouble.id, quantity: 1 }],
      amenityKeys: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Safe"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Modern standard room",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Partial Saigon River view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Clean modern bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "liberty-central-saigon-riverside",
      name: "Executive River View",
      slug: "executive-river-view",
      roomTypeId: rtDeluxe.id,
      description:
        "Upper-floor room with panoramic Saigon River views, upgraded bath amenities, and access to the rooftop pool.",
      capacity: 2,
      sizeM2: 35,
      floor: 10,
      basePrice: 149,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Balcony",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Executive room interior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Panoramic Saigon River view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
          alt: "Rooftop pool access",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Fusion Maia Da Nang ───────────────────────────────────────────────
    {
      hotelSlug: "fusion-maia-da-nang",
      name: "Garden Pool Villa",
      slug: "garden-pool-villa",
      roomTypeId: rtVilla.id,
      description:
        "Secluded villa nestled in tropical gardens with a private plunge pool, open-air bathroom, and all spa treatments included in your stay.",
      capacity: 2,
      sizeM2: 180,
      floor: 1,
      basePrice: 450,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800",
          alt: "Private plunge pool in tropical garden",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Open-plan villa bedroom",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Open-air garden bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "fusion-maia-da-nang",
      name: "Beach Pool Villa",
      slug: "beach-pool-villa",
      roomTypeId: rtVilla.id,
      description:
        "Beachfront villa with direct access to My Khe Beach, a private infinity pool, and sweeping South China Sea views from the open-air terrace.",
      capacity: 3,
      sizeM2: 240,
      floor: 1,
      basePrice: 750,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          alt: "Beachfront villa infinity pool",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Villa bedroom with sea view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Direct beach access terrace",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Anantara Hoi An ───────────────────────────────────────────────────
    {
      hotelSlug: "anantara-hoi-an-resort",
      name: "Deluxe Garden Room",
      slug: "deluxe-garden-hoi-an",
      roomTypeId: rtDeluxe.id,
      description:
        "Traditional Vietnamese-style room with terracotta tiles, rattan furniture, and a garden terrace overlooking lotus ponds.",
      capacity: 2,
      sizeM2: 40,
      floor: 1,
      basePrice: 175,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Balcony",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Vietnamese-style room with rattan décor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800",
          alt: "Garden terrace overlooking lotus pond",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Traditional bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "anantara-hoi-an-resort",
      name: "River Suite",
      slug: "river-suite-hoi-an",
      roomTypeId: rtSuite.id,
      description:
        "Generous suite with a private balcony directly over the Thu Bon River, a soaking tub, and a living area decorated with local silk and lacquerware.",
      capacity: 3,
      sizeM2: 85,
      floor: 2,
      basePrice: 380,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "River suite living area with silk décor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Private balcony over Thu Bon River",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Soaking tub with river view",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Vinpearl Nha Trang ────────────────────────────────────────────────
    {
      hotelSlug: "vinpearl-resort-nha-trang",
      name: "Ocean View Room",
      slug: "ocean-view-room",
      roomTypeId: rtStandard.id,
      description:
        "Bright room with floor-to-ceiling windows framing the turquoise waters of the East Sea, private island setting, and complimentary theme park access.",
      capacity: 2,
      sizeM2: 35,
      floor: 4,
      basePrice: 195,
      isActive: true,
      beds: [{ bedTypeId: btQueen.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
          alt: "Ocean view room with East Sea panorama",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Bright room interior",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Private island views",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "vinpearl-resort-nha-trang",
      name: "Family Suite",
      slug: "family-suite-vinpearl",
      roomTypeId: rtSuite.id,
      description:
        "Generously sized suite sleeping up to 5, with a kids' play corner, two bathrooms, and a wraparound balcony with water park views.",
      capacity: 5,
      sizeM2: 110,
      floor: 3,
      basePrice: 420,
      isActive: true,
      beds: [
        { bedTypeId: btKing.id, quantity: 1 },
        { bedTypeId: btTwin.id, quantity: 2 },
      ],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          alt: "Family suite spacious layout",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Kids play corner",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Balcony with water park views",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Dalat Palace ──────────────────────────────────────────────────────
    {
      hotelSlug: "dalat-palace-heritage-hotel",
      name: "Heritage Room",
      slug: "heritage-room-dalat",
      roomTypeId: rtStandard.id,
      description:
        "Warm and romantic room with original 1920s colonial furnishings, a working fireplace, and pinewood views — Da Lat's most atmospheric accommodation.",
      capacity: 2,
      sizeM2: 30,
      floor: 2,
      basePrice: 130,
      isActive: true,
      beds: [{ bedTypeId: btDouble.id, quantity: 1 }],
      amenityKeys: ["Free WiFi", "Flat-screen TV", "Safe"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          alt: "Heritage room with 1920s furnishings",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Working fireplace and hardwood floors",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Pine forest view from window",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "dalat-palace-heritage-hotel",
      name: "Lake View Deluxe",
      slug: "lake-view-deluxe-dalat",
      roomTypeId: rtDeluxe.id,
      description:
        "Upper-floor room with breathtaking views over Xuan Huong Lake and the surrounding pine hills — spectacular at sunrise and after rain.",
      capacity: 2,
      sizeM2: 38,
      floor: 3,
      basePrice: 200,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Balcony",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Deluxe room colonial style",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Xuan Huong Lake sunrise view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Classic tiled bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── The Plaza New York ────────────────────────────────────────────────
    {
      hotelSlug: "the-plaza-new-york",
      name: "Deluxe Central Park View",
      slug: "deluxe-central-park-view",
      roomTypeId: rtDeluxe.id,
      description:
        "Classic Plaza room with white-glove service, custom furnishings, and an iconic Central Park view — unchanged in character since 1907.",
      capacity: 2,
      sizeM2: 40,
      floor: 10,
      basePrice: 895,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Deluxe room with classic Plaza furnishings",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Central Park view from high floor",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "the-plaza-new-york",
      name: "Grand Suite",
      slug: "grand-suite-plaza",
      roomTypeId: rtSuite.id,
      description:
        "A palatial suite with separate living and dining rooms, butler service, and sweeping views of the Park and Midtown skyline.",
      capacity: 4,
      sizeM2: 130,
      floor: 15,
      basePrice: 2500,
      isActive: true,
      beds: [
        { bedTypeId: btKing.id, quantity: 1 },
        { bedTypeId: btDouble.id, quantity: 1 },
      ],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Grand suite palatial living room",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Central Park and Midtown skyline views",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Grand marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Bellagio Las Vegas ────────────────────────────────────────────────
    {
      hotelSlug: "bellagio-las-vegas",
      name: "Fountain View King",
      slug: "fountain-view-king",
      roomTypeId: rtDeluxe.id,
      description:
        "Watch the world-famous choreographed fountains dance from your window — the most sought-after view in Las Vegas.",
      capacity: 2,
      sizeM2: 50,
      floor: 20,
      basePrice: 449,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
          alt: "Fountain view from high floor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Deluxe king room interior",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "bellagio-las-vegas",
      name: "Penthouse Suite",
      slug: "penthouse-suite-bellagio",
      roomTypeId: rtPenthouse.id,
      description:
        "Two-bedroom penthouse with a private terrace over the fountains, a grand piano, and 24-hour butler service.",
      capacity: 4,
      sizeM2: 300,
      floor: 35,
      basePrice: 5500,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 2 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          alt: "Penthouse private terrace over fountains",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Grand penthouse living room with piano",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Luxury penthouse bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── 1 Hotel South Beach Miami ─────────────────────────────────────────
    {
      hotelSlug: "1-hotel-south-beach-miami",
      name: "Garden King Room",
      slug: "garden-king-miami",
      roomTypeId: rtStandard.id,
      description:
        "Eco-conscious room with reclaimed wood furniture, organic linens, and a private terrace with tropical garden views.",
      capacity: 2,
      sizeM2: 38,
      floor: 2,
      basePrice: 320,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Balcony",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Eco-conscious room with reclaimed wood",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800",
          alt: "Private terrace with tropical garden",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Sustainable bathroom with organic products",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "1-hotel-south-beach-miami",
      name: "Ocean Suite",
      slug: "ocean-suite-miami",
      roomTypeId: rtSuite.id,
      description:
        "Corner suite with wrap-around ocean views, a soaking tub on the balcony, and sustainable luxury finishes throughout.",
      capacity: 3,
      sizeM2: 95,
      floor: 8,
      basePrice: 780,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Ocean suite corner living area",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Wrap-around Atlantic Ocean view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Outdoor soaking tub on balcony",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Hôtel Ritz Paris ──────────────────────────────────────────────────
    {
      hotelSlug: "hotel-ritz-paris",
      name: "Vendôme Room",
      slug: "vendome-room",
      roomTypeId: rtDeluxe.id,
      description:
        "Magnificent room overlooking the legendary Place Vendôme with Empire-style furnishings, marble bathroom, and Ritz signature bedding.",
      capacity: 2,
      sizeM2: 45,
      floor: 2,
      basePrice: 1200,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Vendôme room Empire furnishings",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Place Vendôme view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble en-suite bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "hotel-ritz-paris",
      name: "Chopin Suite",
      slug: "chopin-suite",
      roomTypeId: rtSuite.id,
      description:
        "Named after the celebrated composer who frequented the Ritz, this sumptuous suite features a grand salon, antique grand piano, and garden terrace.",
      capacity: 3,
      sizeM2: 150,
      floor: 3,
      basePrice: 4500,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Chopin suite grand salon with piano",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Garden terrace view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Opulent marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── The Peninsula Tokyo ───────────────────────────────────────────────
    {
      hotelSlug: "the-peninsula-tokyo",
      name: "Deluxe Garden View",
      slug: "deluxe-garden-tokyo",
      roomTypeId: rtDeluxe.id,
      description:
        "Contemporary Japanese room overlooking the Imperial Palace Gardens with in-room technology, deep soaking tub, and Peninsula signature sleep experience.",
      capacity: 2,
      sizeM2: 47,
      floor: 6,
      basePrice: 700,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=800",
          alt: "Contemporary Japanese room design",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Imperial Palace Gardens view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Deep soaking tub",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "the-peninsula-tokyo",
      name: "Tokyo Suite",
      slug: "tokyo-suite-peninsula",
      roomTypeId: rtSuite.id,
      description:
        "Panoramic two-room suite with corner views over the palace gardens and Tokyo skyline, private dining area, and bespoke Yoshida lacquer finishes.",
      capacity: 3,
      sizeM2: 115,
      floor: 10,
      basePrice: 1800,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
          alt: "Tokyo suite with lacquer finishes",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Corner view Tokyo skyline and palace gardens",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Private dining area",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Mandarin Oriental Bangkok ─────────────────────────────────────────
    {
      hotelSlug: "mandarin-oriental-bangkok",
      name: "Riverside Room",
      slug: "riverside-room-bangkok",
      roomTypeId: rtStandard.id,
      description:
        "Classic Bangkok room overlooking the majestic Chao Phraya River with traditional Thai silk décor and legendary Oriental service.",
      capacity: 2,
      sizeM2: 38,
      floor: 5,
      basePrice: 380,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Chao Phraya River view",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Thai silk décor room interior",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Bathroom with Thai accents",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "mandarin-oriental-bangkok",
      name: "Authors' Suite",
      slug: "authors-suite",
      roomTypeId: rtSuite.id,
      description:
        "Named after the great writers who stayed here — each suite dedicated to a literary figure with custom bespoke décor, river views, and butler service.",
      capacity: 2,
      sizeM2: 95,
      floor: 7,
      basePrice: 1500,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Authors' suite bespoke literary décor",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "River view balcony",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Luxury bathroom with soaking tub",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Sri Panwa Phuket ──────────────────────────────────────────────────
    {
      hotelSlug: "sri-panwa-phuket",
      name: "2-Bedroom Pool Villa",
      slug: "2-bedroom-pool-villa-phuket",
      roomTypeId: rtVilla.id,
      description:
        "Hillside villa with a private infinity pool, two bedrooms, a living pavilion, and breathtaking 360° Andaman Sea views from Cape Panwa's summit.",
      capacity: 4,
      sizeM2: 280,
      floor: 1,
      basePrice: 1100,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 2 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800",
          alt: "Two-bedroom hillside villa infinity pool",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          alt: "360° Andaman Sea panorama",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Villa master bedroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "sri-panwa-phuket",
      name: "1-Bedroom Pool Villa",
      slug: "1-bedroom-pool-villa-phuket",
      roomTypeId: rtVilla.id,
      description:
        "Intimate villa for couples with a private plunge pool, outdoor rain shower, and full sea views from every vantage point.",
      capacity: 2,
      sizeM2: 160,
      floor: 1,
      basePrice: 750,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          alt: "Romantic one-bedroom villa plunge pool",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          alt: "Villa bedroom with sea views",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Outdoor rain shower",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Burj Al Arab Dubai ────────────────────────────────────────────────
    {
      hotelSlug: "burj-al-arab-jumeirah",
      name: "One Bedroom Suite",
      slug: "one-bedroom-suite-burj",
      roomTypeId: rtSuite.id,
      description:
        "The entry-level suite at the world's most luxurious hotel — a two-floor suite with a private cinema, dining room, and butler on call 24 hours.",
      capacity: 2,
      sizeM2: 170,
      floor: 10,
      basePrice: 3800,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
          alt: "Two-floor suite interior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Private cinema and dining room",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Gold-accented luxury bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "burj-al-arab-jumeirah",
      name: "Royal Suite",
      slug: "royal-suite-burj",
      roomTypeId: rtPenthouse.id,
      description:
        "The pinnacle of Arabian luxury: a 780m² duplex with a private cinema, revolving bed, and 180° views of the Arabian Gulf.",
      capacity: 6,
      sizeM2: 780,
      floor: 25,
      basePrice: 24000,
      isActive: true,
      beds: [
        { bedTypeId: btKing.id, quantity: 2 },
        { bedTypeId: btTwin.id, quantity: 2 },
      ],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          alt: "Royal suite 780m² duplex living area",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Private cinema room",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "180° Arabian Gulf view",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── The Ritz London ───────────────────────────────────────────────────
    {
      hotelSlug: "the-ritz-london",
      name: "Deluxe Queen",
      slug: "deluxe-queen-ritz-london",
      roomTypeId: rtDeluxe.id,
      description:
        "Louis XVI-inspired room with hand-painted ceilings, marble bathroom, and views over Piccadilly or the private garden.",
      capacity: 2,
      sizeM2: 40,
      floor: 3,
      basePrice: 950,
      isActive: true,
      beds: [{ bedTypeId: btQueen.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Louis XVI room with hand-painted ceiling",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Piccadilly or garden view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "the-ritz-london",
      name: "William Kent Suite",
      slug: "william-kent-suite",
      roomTypeId: rtSuite.id,
      description:
        "The most palatial suite at The Ritz, occupying a prime corner above Green Park with a grand salon, dining room, and personal butler service.",
      capacity: 4,
      sizeM2: 210,
      floor: 4,
      basePrice: 6500,
      isActive: true,
      beds: [
        { bedTypeId: btKing.id, quantity: 1 },
        { bedTypeId: btDouble.id, quantity: 1 },
      ],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "William Kent Suite grand salon",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Green Park corner view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Palatial marble bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Marina Bay Sands Singapore ────────────────────────────────────────
    {
      hotelSlug: "marina-bay-sands-singapore",
      name: "Deluxe Room City View",
      slug: "deluxe-city-view-mbs",
      roomTypeId: rtDeluxe.id,
      description:
        "Sweeping views of Singapore's glittering skyline from a high-floor room with floor-to-ceiling glass and clean contemporary design.",
      capacity: 2,
      sizeM2: 42,
      floor: 20,
      basePrice: 420,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
          alt: "Singapore skyline city view",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Contemporary room with floor-to-ceiling glass",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Modern bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "marina-bay-sands-singapore",
      name: "Bay View Suite",
      slug: "bay-view-suite-mbs",
      roomTypeId: rtSuite.id,
      description:
        "Corner suite with panoramic Marina Bay views, infinity pool access on the iconic SkyPark, and premium service by a dedicated guest relations officer.",
      capacity: 3,
      sizeM2: 105,
      floor: 35,
      basePrice: 1200,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
          alt: "Corner suite Marina Bay panorama",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Suite living area with bay views",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Luxury bathroom",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },

    // ── Park Hyatt Sydney ─────────────────────────────────────────────────
    {
      hotelSlug: "park-hyatt-sydney",
      name: "Opera House Room",
      slug: "opera-house-room-sydney",
      roomTypeId: rtDeluxe.id,
      description:
        "Arguably the best view in Australia — a room facing the Sydney Opera House across the sparkling harbour, with contemporary interiors and a deep soaking bath.",
      capacity: 2,
      sizeM2: 45,
      floor: 4,
      basePrice: 620,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
          alt: "Direct Sydney Opera House view",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          alt: "Contemporary room interior",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Deep soaking bath with harbour view",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      hotelSlug: "park-hyatt-sydney",
      name: "Harbour Suite",
      slug: "harbour-suite-sydney",
      roomTypeId: rtSuite.id,
      description:
        "Spectacular harbour-facing suite with a living room, dining area for 6, and a terrace overlooking the Opera House — perfect for milestone celebrations.",
      capacity: 4,
      sizeM2: 120,
      floor: 6,
      basePrice: 1850,
      isActive: true,
      beds: [{ bedTypeId: btKing.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
        "Bathtub",
        "Balcony",
        "Room Service",
        "Concierge",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
          alt: "Harbour suite living and dining area",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          alt: "Terrace with Opera House view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          alt: "Luxury bathroom with harbour outlook",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
  ];

  const rooms = [];
  for (const data of roomsData) {
    const { hotelSlug, beds, amenityKeys, images, ...roomFields } = data;
    const hotel = hotels[hotelSlug];
    if (!hotel) throw new Error(`Hotel not found: ${hotelSlug}`);

    const room = await prisma.room.create({
      data: {
        ...roomFields,
        hotelId: hotel.id,
        basePrice: new Prisma.Decimal(roomFields.basePrice),
        beds: { create: beds },
        amenities: {
          create: amenityKeys.map((k) => ({ amenityId: amenities[k].id })),
        },
        images: { create: images },
      },
    });
    rooms.push(room);
  }

  console.log(`✅ ${rooms.length} rooms seeded`);
  return rooms;
}
