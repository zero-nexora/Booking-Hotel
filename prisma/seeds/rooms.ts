import { prisma } from "./client";

export async function seedRoomTypesAndBedTypes() {
  const roomTypes = ["Standard", "Deluxe", "Suite", "Penthouse", "Studio"].map(
    (name) =>
      prisma.roomType.upsert({ where: { name }, update: {}, create: { name } }),
  );

  const bedTypes = ["Single", "Double", "Queen", "King", "Twin"].map((name) =>
    prisma.bedType.upsert({ where: { name }, update: {}, create: { name } }),
  );

  const [rtStandard, rtDeluxe, rtSuite, rtPenthouse, rtStudio] =
    await Promise.all(roomTypes);
  const [btSingle, btDouble, btQueen, btKing, btTwin] =
    await Promise.all(bedTypes);

  console.log("✅ Room types & bed types seeded");
  return {
    roomTypes: { rtStandard, rtDeluxe, rtSuite, rtPenthouse, rtStudio },
    bedTypes: { btSingle, btDouble, btQueen, btKing, btTwin },
  };
}

export async function seedRooms(
  hotels: Record<string, { id: string }>,
  roomTypes: Record<string, { id: string }>,
  bedTypes: Record<string, { id: string }>,
  amenities: Record<string, { id: string }>,
) {
  const { grandNY, sunsetLA, palaisParis, tokyoInn } = hotels as any;
  const { rtStandard, rtDeluxe, rtSuite, rtPenthouse } = roomTypes as any;
  const { btDouble, btQueen, btKing, btTwin } = bedTypes as any;

  const roomsData = [
    {
      hotelId: grandNY.id,
      name: "Standard Room",
      slug: "standard-room",
      roomTypeId: rtStandard.id,
      description:
        "Comfortable standard room with city view, modern furnishings, and all essential amenities for a pleasant stay.",
      capacity: 2,
      sizeM2: 28,
      floor: 5,
      basePrice: 199.99,
      beds: [{ bedTypeId: btDouble.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
          alt: "Standard room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: grandNY.id,
      name: "Deluxe King Room",
      slug: "deluxe-king-room",
      roomTypeId: rtDeluxe.id,
      description:
        "Spacious deluxe room featuring a king-sized bed, panoramic skyline views, and premium bath amenities.",
      capacity: 2,
      sizeM2: 42,
      floor: 15,
      basePrice: 349.99,
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
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
          alt: "Deluxe king room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: grandNY.id,
      name: "Executive Suite",
      slug: "executive-suite",
      roomTypeId: rtSuite.id,
      description:
        "Our signature suite offers a separate living area, butler service, and unrivaled views of Central Park.",
      capacity: 4,
      sizeM2: 85,
      floor: 25,
      basePrice: 799.99,
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
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843",
          alt: "Executive suite",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: grandNY.id,
      name: "Penthouse",
      slug: "penthouse",
      roomTypeId: rtPenthouse.id,
      description:
        "The pinnacle of luxury — a two-story penthouse with a private terrace, hot tub, and 360° Manhattan views.",
      capacity: 6,
      sizeM2: 200,
      floor: 40,
      basePrice: 2999.99,
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
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
          alt: "Penthouse",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: sunsetLA.id,
      name: "California Standard",
      slug: "california-standard",
      roomTypeId: rtStandard.id,
      description:
        "Bright and airy room with California-inspired decor and a comfortable queen bed.",
      capacity: 2,
      sizeM2: 30,
      floor: 3,
      basePrice: 159.99,
      beds: [{ bedTypeId: btQueen.id, quantity: 1 }],
      amenityKeys: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Safe"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
          alt: "California standard room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: sunsetLA.id,
      name: "Poolside Deluxe",
      slug: "poolside-deluxe",
      roomTypeId: rtDeluxe.id,
      description:
        "Direct pool access from your private patio. The ultimate LA experience with style and comfort.",
      capacity: 3,
      sizeM2: 48,
      floor: 1,
      basePrice: 299.99,
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
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f",
          alt: "Poolside room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: palaisParis.id,
      name: "Chambre Classique",
      slug: "chambre-classique",
      roomTypeId: rtStandard.id,
      description:
        "Elegant Haussmann-style room with parquet floors, period furnishings, and views of a Parisian courtyard.",
      capacity: 2,
      sizeM2: 32,
      floor: 2,
      basePrice: 249.99,
      beds: [{ bedTypeId: btDouble.id, quantity: 1 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949",
          alt: "Classic room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: palaisParis.id,
      name: "Suite Prestige",
      slug: "suite-prestige",
      roomTypeId: rtSuite.id,
      description:
        "A grand Parisian suite with Eiffel Tower views, marble bathroom, and bespoke French furnishings.",
      capacity: 4,
      sizeM2: 95,
      floor: 6,
      basePrice: 999.99,
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
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
          alt: "Prestige suite",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: tokyoInn.id,
      name: "Wa Room",
      slug: "wa-room",
      roomTypeId: rtStandard.id,
      description:
        "Traditional Japanese room with tatami mats, futon bedding, and a serene garden view.",
      capacity: 2,
      sizeM2: 25,
      floor: 4,
      basePrice: 189.99,
      beds: [{ bedTypeId: btDouble.id, quantity: 1 }],
      amenityKeys: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Safe"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1553653924-39b70295f8da",
          alt: "Traditional wa room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      hotelId: tokyoInn.id,
      name: "Tokyo Deluxe Twin",
      slug: "tokyo-deluxe-twin",
      roomTypeId: rtDeluxe.id,
      description:
        "Modern deluxe room with two beds, city views, and Japanese minimalist design.",
      capacity: 2,
      sizeM2: 38,
      floor: 10,
      basePrice: 279.99,
      beds: [{ bedTypeId: btTwin.id, quantity: 2 }],
      amenityKeys: [
        "Free WiFi",
        "Air Conditioning",
        "Flat-screen TV",
        "Safe",
        "Minibar",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
          alt: "Deluxe twin room",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
  ];

  const rooms = [];
  for (const data of roomsData) {
    const { beds, amenityKeys, images, ...roomFields } = data;
    const room = await prisma.room.create({
      data: {
        ...roomFields,
        basePrice: roomFields.basePrice,
        beds: {
          create: beds,
        },
        amenities: {
          create: amenityKeys.map((k) => ({ amenityId: amenities[k].id })),
        },
        images: {
          create: images,
        },
      },
    });
    rooms.push(room);
  }

  console.log("✅ Rooms seeded");
  return rooms;
}
