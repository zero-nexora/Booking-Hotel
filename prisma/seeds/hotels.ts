import { HotelStatus } from "../generated/prisma/enums";
import { prisma } from "./client";

export async function seedHotels(
  addresses: { id: string }[],
  amenities: Record<string, { id: string }>,
) {
  const hotelsData = [
    // ── addrIdx: 0 ── Sofitel Legend Metropole Hanoi
    {
      addrIdx: 0,
      name: "Sofitel Legend Metropole Hanoi",
      slug: "sofitel-legend-metropole-hanoi",
      description:
        "A timeless French colonial masterpiece in the heart of Hanoi's Old Quarter. Since 1901, the Metropole has hosted royalty, artists, and world leaders. Impeccable service, legendary Le Beaulieu restaurant, and the famous wartime bunker make this Hanoi's most storied address.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+842438266919",
      email: "info@metropolehanoi.com",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
        "Airport Shuttle",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
          alt: "Hotel exterior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Hotel lobby",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Swimming pool",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          alt: "Deluxe room interior",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Restaurant dining",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 1 ── InterContinental Hanoi Westlake
    {
      addrIdx: 1,
      name: "InterContinental Hanoi Westlake",
      slug: "intercontinental-hanoi-westlake",
      description:
        "Perched on stilts over the serene West Lake, this iconic hotel offers breathtaking panoramic views and a peaceful retreat from the city buzz. Home to the award-winning Sunset Bar and overwater bungalow-style rooms.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+842462702888",
      email: "hanoi@ihg.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Airport Shuttle",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
          alt: "Over-water hotel exterior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
          alt: "West Lake panoramic view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          alt: "Overwater deluxe room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Swimming pool at sunset",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Sunset Bar",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 2 ── Park Hyatt Saigon
    {
      addrIdx: 2,
      name: "Park Hyatt Saigon",
      slug: "park-hyatt-saigon",
      description:
        "An elegant retreat on Lam Son Square, the Park Hyatt Saigon blends French colonial grandeur with Vietnamese craftsmanship. Steps from the Opera House, it offers the city's finest dining at Square One and a rooftop pool with skyline views.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+84838241234",
      email: "saigon.park@hyatt.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
          alt: "Hotel facade on Lam Son Square",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
          alt: "Rooftop pool deck",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Grand lobby",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Deluxe room interior",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Square One restaurant",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 3 ── Liberty Central Saigon Riverside
    {
      addrIdx: 3,
      name: "Liberty Central Saigon Riverside",
      slug: "liberty-central-saigon-riverside",
      description:
        "A sleek 4-star property along the Saigon River, offering modern rooms, a rooftop pool with river views, and easy access to Ben Thanh Market and District 1's vibrant street-food scene.",
      starRating: 4,
      status: HotelStatus.ACTIVE,
      phone: "+84838279999",
      email: "riverside@libertycentral.vn",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Restaurant",
        "Bar",
        "Parking",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
          alt: "Riverside hotel exterior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Rooftop pool with river view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          alt: "Modern standard room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Executive river view room",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
          alt: "Hotel bar",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 5 ── Fusion Maia Da Nang
    {
      addrIdx: 5,
      name: "Fusion Maia Da Nang",
      slug: "fusion-maia-da-nang",
      description:
        "An all-inclusive spa resort tucked between My Khe Beach and lush gardens. Every room has its own plunge pool, and unlimited spa treatments are included in every stay — a first in Vietnam. Perfect for romantic escapes.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+842363967999",
      email: "reservations@fusionmaiadanang.com",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Airport Shuttle",
        "Pet Friendly",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200",
          alt: "Private pool villa",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Beach pool",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          alt: "Garden villa exterior",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Spa treatment room",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
          alt: "Beachfront dining",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 6 ── Anantara Hoi An Resort
    {
      addrIdx: 6,
      name: "Anantara Hoi An Resort",
      slug: "anantara-hoi-an-resort",
      description:
        "A riverside sanctuary in Hoi An's UNESCO-listed Ancient Town, offering traditional Vietnamese villa-style accommodations, a cooking school, and sunset river cruises on a wooden junk boat.",
      starRating: 4,
      status: HotelStatus.ACTIVE,
      phone: "+842353914555",
      email: "hoian@anantara.com",
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Airport Shuttle",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          alt: "Resort pool and gardens",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Thu Bon riverside view",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          alt: "Traditional villa room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200",
          alt: "Lotus pond garden",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Cooking school class",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 7 ── Vinpearl Resort Nha Trang
    {
      addrIdx: 7,
      name: "Vinpearl Resort & Spa Nha Trang",
      slug: "vinpearl-resort-nha-trang",
      description:
        "Spread across a private island accessible by gondola, Vinpearl is Nha Trang's grandest destination. Features a water park, theme park, golf course, and 1km of pristine private beach — ideal for families.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+842583598899",
      email: "nhatrang@vinpearl.com",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Parking",
        "Pet Friendly",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200",
          alt: "Private island resort aerial view",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Infinity pool overlooking the sea",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200",
          alt: "Private beach",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          alt: "Family suite interior",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Waterpark facilities",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 8 ── Dalat Palace Heritage Hotel
    {
      addrIdx: 8,
      name: "Dalat Palace Heritage Hotel",
      slug: "dalat-palace-heritage-hotel",
      description:
        "A French-colonial palace built in 1922, perched above Xuan Huong Lake surrounded by pine forests. The hotel's 1920s charm — original fireplaces, hardwood floors, and antique furnishings — makes it Da Lat's most romantic stay.",
      starRating: 4,
      status: HotelStatus.ACTIVE,
      phone: "+842633825444",
      email: "reservations@dalatpalace.vn",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Parking",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
          alt: "French colonial palace exterior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Grand lobby with antique furnishings",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Lake view deluxe room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          alt: "Heritage room with fireplace",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
          alt: "Xuan Huong Lake view from terrace",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 9 ── The Plaza New York
    {
      addrIdx: 9,
      name: "The Plaza New York",
      slug: "the-plaza-new-york",
      description:
        "An American icon since 1907, The Plaza presides over Central Park South with unrivaled grandeur. Iconic rooms, the celebrated Palm Court for afternoon tea, and legendary service define this National Historic Landmark.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+12127595000",
      email: "reservations@theplaza.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
          alt: "The Plaza iconic exterior on 5th Avenue",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Grand lobby",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Deluxe Central Park view room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Palm Court afternoon tea",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Grand suite living room",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 10 ── Bellagio Las Vegas
    {
      addrIdx: 10,
      name: "Bellagio Las Vegas",
      slug: "bellagio-las-vegas",
      description:
        "Fronting the famous dancing fountains of Lake Bellagio, this legendary resort casino defines Las Vegas luxury. World-class restaurants by celebrity chefs, a botanical conservatory, and the finest gaming floor on the Strip.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+17028938000",
      email: "info@bellagio.com",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
        "Parking",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200",
          alt: "Bellagio fountains at night",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Botanical conservatory",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Pool complex",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Fountain view king room",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          alt: "Penthouse terrace view",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 11 ── 1 Hotel South Beach Miami
    {
      addrIdx: 11,
      name: "1 Hotel South Beach Miami",
      slug: "1-hotel-south-beach-miami",
      description:
        "A nature-inspired luxury resort on Miami's iconic South Beach where sustainability meets style. Living walls, reclaimed wood, and a sprawling oceanfront pool deck make this the coolest address on Collins Avenue.",
      starRating: 4,
      status: HotelStatus.ACTIVE,
      phone: "+13056047777",
      email: "southbeach@1hotels.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Pet Friendly",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
          alt: "Oceanfront hotel exterior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Oceanfront pool deck",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          alt: "Eco-luxury garden room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Sustainable restaurant interior",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
          alt: "Ocean suite balcony view",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 12 ── Hôtel Ritz Paris
    {
      addrIdx: 12,
      name: "Hôtel Ritz Paris",
      slug: "hotel-ritz-paris",
      description:
        "The very definition of Parisian luxury since 1898. César Ritz's masterpiece on Place Vendôme features 142 rooms and suites, the legendary Bar Hemingway, a subterranean pool, and the Michelin-starred L'Espadon restaurant.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+33143163030",
      email: "resa@ritzparis.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Airport Shuttle",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
          alt: "Ritz Paris facade on Place Vendôme",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Grand corridor",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Vendôme room interior",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200",
          alt: "Chopin Suite grand salon",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Subterranean swimming pool",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 13 ── The Peninsula Tokyo
    {
      addrIdx: 13,
      name: "The Peninsula Tokyo",
      slug: "the-peninsula-tokyo",
      description:
        "A striking tower rising above the Imperial Palace Gardens, the Peninsula Tokyo offers unparalleled views of the gardens and Tokyo skyline. Each room features high-tech amenities, Peninsula's signature bed, and a deep soaking bathtub.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+81352236000",
      email: "ptk@peninsula.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
        "Airport Shuttle",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=1200",
          alt: "Peninsula Tokyo tower exterior",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Grand lobby atrium",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Imperial Palace Garden view room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200",
          alt: "Tokyo Suite panoramic view",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Indoor swimming pool",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 15 ── Mandarin Oriental Bangkok
    {
      addrIdx: 15,
      name: "Mandarin Oriental Bangkok",
      slug: "mandarin-oriental-bangkok",
      description:
        "Bangkok's most storied hotel, sitting on the Chao Phraya River since 1876. The Authors' Wing has hosted literary legends from Somerset Maugham to Graham Greene. Legendary service, riverside dining, and a spa of world renown.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+6622599000",
      email: "mobkk-reservations@mohg.com",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Airport Shuttle",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Chao Phraya riverside hotel",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Authors' Wing lobby",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
          alt: "Riverside room view",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Outdoor swimming pool",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200",
          alt: "Oriental Spa",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 16 ── Sri Panwa Phuket
    {
      addrIdx: 16,
      name: "Sri Panwa Phuket",
      slug: "sri-panwa-phuket",
      description:
        "A private estate of 52 pool villas crowning the hills of Cape Panwa, with 360° views of the Andaman Sea. Each villa has its own infinity pool, and the Baba Nest rooftop bar is Phuket's most glamorous sunset spot.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+6676371000",
      email: "info@sripanwa.com",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Airport Shuttle",
        "Pet Friendly",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200",
          alt: "Hillside pool villa with Andaman Sea view",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          alt: "Private infinity pool",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Baba Nest rooftop bar",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Villa bedroom interior",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Cape Panwa coastline",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 17 ── Burj Al Arab Dubai
    {
      addrIdx: 17,
      name: "Burj Al Arab Jumeirah",
      slug: "burj-al-arab-jumeirah",
      description:
        "Standing on its own man-made island, the Burj Al Arab is the world's most luxurious hotel — a sail-shaped silhouette that defines Dubai's skyline. All-suite interiors, a helipad, and 24-hour butler service set the ultimate standard.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+97143017777",
      email: "baa@jumeirah.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Airport Shuttle",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200",
          alt: "Burj Al Arab sail silhouette",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "Atrium lobby interior",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
          alt: "Royal Suite duplex",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Private beach and pool",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Skyview restaurant",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 18 ── The Ritz London
    {
      addrIdx: 18,
      name: "The Ritz London",
      slug: "the-ritz-london",
      description:
        "Britain's most famous hotel, opening on Piccadilly in 1906. The Ritz Restaurant is one of London's most dazzling dining rooms, while the celebrated Afternoon Tea remains the gold standard. A royal warrant holder and global icon.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+442074938181",
      email: "enquire@theritzlondon.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
          alt: "The Ritz London Piccadilly facade",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "The Ritz Restaurant",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Deluxe Queen room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "William Kent Suite salon",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
          alt: "Afternoon Tea in The Palm Court",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 19 ── Marina Bay Sands Singapore
    {
      addrIdx: 19,
      name: "Marina Bay Sands Singapore",
      slug: "marina-bay-sands-singapore",
      description:
        "An architectural marvel comprising three towers topped by the iconic SkyPark and its 150m infinity pool. Singapore's most photographed hotel features the ArtScience Museum, celebrity restaurants, and a casino.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+6565888888",
      email: "mbshotelbooking@marinabaysands.com",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
        "Airport Shuttle",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200",
          alt: "Marina Bay Sands three towers",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Iconic SkyPark infinity pool",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Deluxe city view room",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Bay view suite",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "ArtScience Museum view",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },

    // ── addrIdx: 21 ── Park Hyatt Sydney
    {
      addrIdx: 21,
      name: "Park Hyatt Sydney",
      slug: "park-hyatt-sydney",
      description:
        "Occupying a prime position on Sydney Harbour directly opposite the Opera House, the Park Hyatt Sydney offers the finest harbour views in Australia. Rooftop pool, award-winning dining, and impeccable service in 155 rooms.",
      starRating: 5,
      status: HotelStatus.ACTIVE,
      phone: "+61292561234",
      email: "sydney.park@hyatt.com",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      amenityNames: [
        "Free WiFi",
        "Swimming Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Bar",
        "Room Service",
        "Concierge",
        "Business Center",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200",
          alt: "Hotel with Sydney Opera House backdrop",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
          alt: "Rooftop pool overlooking harbour",
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
          alt: "Opera House room interior",
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
          alt: "Harbour Suite dining area",
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
          alt: "The Dining Room restaurant",
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },
  ];

  const hotels: Record<string, { id: string; name: string; slug: string }> = {};

  for (const h of hotelsData) {
    const {
      addrIdx,
      amenityNames,
      images,
      checkInTime,
      checkOutTime,
      ...hotelFields
    } = h;

    const hotel = await prisma.hotel.create({
      data: {
        ...hotelFields,
        addressId: addresses[addrIdx].id,
        policy: {
          create: { checkInTime, checkOutTime },
        },
        images: { create: images },
        amenities: {
          create: amenityNames.map((name) => ({
            amenityId: amenities[name].id,
          })),
        },
      },
    });

    hotels[hotel.slug] = hotel;
  }

  console.log(`✅ ${Object.keys(hotels).length} hotels seeded`);
  return hotels;
}
