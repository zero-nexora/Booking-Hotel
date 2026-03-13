import { prisma } from "./client";

export async function seedHotels(
  addresses: { id: string }[],
  amenities: Record<string, { id: string }>,
) {
  const hotelsData = [
    {
      addrIdx: 0,
      data: {
        name: "Sofitel Legend Metropole Hanoi",
        slug: "sofitel-legend-metropole-hanoi",
        description:
          "A timeless French colonial masterpiece in the heart of Hanoi's Old Quarter. Since 1901, the Metropole has hosted royalty, artists, and world leaders. Impeccable service, legendary Le Beaulieu restaurant, and the famous wartime bunker make this Hanoi's most storied address.",
        starRating: 5,
        status: "ACTIVE" as any,
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
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            alt: "Hotel exterior",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
            alt: "Hotel lobby",
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
            alt: "Swimming pool",
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
    },
    {
      addrIdx: 1,
      data: {
        name: "InterContinental Hanoi Westlake",
        slug: "intercontinental-hanoi-westlake",
        description:
          "Perched on stilts over the serene West Lake, this iconic hotel offers breathtaking panoramic views and a peaceful retreat from the city buzz. Home to the award-winning Sunset Bar and overwater bungalow-style rooms.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
            alt: "Over-water hotel",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
            alt: "Lake view",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
    },
    {
      addrIdx: 2,
      data: {
        name: "Park Hyatt Saigon",
        slug: "park-hyatt-saigon",
        description:
          "An elegant retreat on Lam Son Square, the Park Hyatt Saigon blends French colonial grandeur with Vietnamese craftsmanship. Steps from the Opera House, it offers the city's finest dining at Square One and a rooftop pool with skyline views.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
            alt: "Hotel facade",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
            alt: "Pool deck",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
    },
    {
      addrIdx: 3,
      data: {
        name: "Liberty Central Saigon Riverside",
        slug: "liberty-central-saigon-riverside",
        description:
          "A sleek 4-star property along the Saigon River, offering modern rooms, a rooftop pool with river views, and easy access to Ben Thanh Market and District 1's vibrant street-food scene.",
        starRating: 4,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
            alt: "Riverside hotel",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 5,
      data: {
        name: "Fusion Maia Da Nang",
        slug: "fusion-maia-da-nang",
        description:
          "An all-inclusive spa resort tucked between My Khe Beach and lush gardens. Every room has its own plunge pool, and unlimited spa treatments are included in every stay — a first in Vietnam. Perfect for romantic escapes.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f",
            alt: "Pool villa",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
            alt: "Beach pool",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
    },
    {
      addrIdx: 6,
      data: {
        name: "Anantara Hoi An Resort",
        slug: "anantara-hoi-an-resort",
        description:
          "A riverside sanctuary in Hoi An's UNESCO-listed Ancient Town, offering traditional Vietnamese villa-style accommodations, a cooking school, and sunset river cruises on a wooden junk boat.",
        starRating: 4,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
            alt: "Resort pool",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 7,
      data: {
        name: "Vinpearl Resort & Spa Nha Trang",
        slug: "vinpearl-resort-nha-trang",
        description:
          "Spread across a private island accessible by gondola, Vinpearl is Nha Trang's grandest destination. Features a water park, theme park, golf course, and 1km of pristine private beach — ideal for families.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
            alt: "Island resort",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 8,
      data: {
        name: "Dalat Palace Heritage Hotel",
        slug: "dalat-palace-heritage-hotel",
        description:
          "A French-colonial palace built in 1922, perched above Xuan Huong Lake surrounded by pine forests. The hotel's 1920s charm — original fireplaces, hardwood floors, and antique furnishings — makes it Da Lat's most romantic stay.",
        starRating: 4,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
            alt: "Colonial palace",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 9,
      data: {
        name: "The Plaza New York",
        slug: "the-plaza-new-york",
        description:
          "An American icon since 1907, The Plaza presides over Central Park South with unrivaled grandeur. Iconic rooms, the celebrated Palm Court for afternoon tea, and legendary service define this National Historic Landmark.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            alt: "The Plaza exterior",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
            alt: "Grand lobby",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
    },
    {
      addrIdx: 10,
      data: {
        name: "Bellagio Las Vegas",
        slug: "bellagio-las-vegas",
        description:
          "Fronting the famous dancing fountains of Lake Bellagio, this legendary resort casino defines Las Vegas luxury. World-class restaurants by celebrity chefs, a botanical conservatory, and the finest gaming floor on the Strip.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
            alt: "Bellagio fountains",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 11,
      data: {
        name: "1 Hotel South Beach Miami",
        slug: "1-hotel-south-beach-miami",
        description:
          "A nature-inspired luxury resort on Miami's iconic South Beach where sustainability meets style. Living walls, reclaimed wood, and a sprawling oceanfront pool deck make this the coolest address on Collins Avenue.",
        starRating: 4,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
            alt: "Beach hotel",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 12,
      data: {
        name: "Hôtel Ritz Paris",
        slug: "hotel-ritz-paris",
        description:
          "The very definition of Parisian luxury since 1898. César Ritz's masterpiece on Place Vendôme features 142 rooms and suites, the legendary Bar Hemingway, a subterranean pool, and the Michelin-starred L'Espadon restaurant.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
            alt: "Ritz Paris facade",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
            alt: "Grand suite",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
    },
    {
      addrIdx: 13,
      data: {
        name: "The Peninsula Tokyo",
        slug: "the-peninsula-tokyo",
        description:
          "A striking tower rising above the Imperial Palace Gardens, the Peninsula Tokyo offers unparalleled views of the gardens and Tokyo skyline. Each room features high-tech amenities, Peninsula's signature bed, and a deep soaking bathtub.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1553653924-39b70295f8da",
            alt: "Tokyo hotel",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 15,
      data: {
        name: "Mandarin Oriental Bangkok",
        slug: "mandarin-oriental-bangkok",
        description:
          "Bangkok's most storied hotel, sitting on the Chao Phraya River since 1876. The Authors' Wing has hosted literary legends from Somerset Maugham to Graham Greene. Legendary service, riverside dining, and a spa of world renown.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1591088398332-8a7791972843",
            alt: "Bangkok riverside hotel",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 16,
      data: {
        name: "Sri Panwa Phuket",
        slug: "sri-panwa-phuket",
        description:
          "A private estate of 52 pool villas crowning the hills of Cape Panwa, with 360° views of the Andaman Sea. Each villa has its own infinity pool, and the Baba Nest rooftop bar is Phuket's most glamorous sunset spot.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f",
            alt: "Phuket pool villa",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 17,
      data: {
        name: "Burj Al Arab Jumeirah",
        slug: "burj-al-arab-jumeirah",
        description:
          "Standing on its own man-made island, the Burj Al Arab is the world's most luxurious hotel — a sail-shaped silhouette that defines Dubai's skyline. All-suite interiors, a helipad, and 24-hour butler service set the ultimate standard.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
            alt: "Burj Al Arab",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 18,
      data: {
        name: "The Ritz London",
        slug: "the-ritz-london",
        description:
          "Britain's most famous hotel, opening on Piccadilly in 1906. The Ritz Restaurant is one of London's most dazzling dining rooms, while the celebrated Afternoon Tea remains the gold standard. A royal warrant holder and global icon.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            alt: "Ritz London facade",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 19,
      data: {
        name: "Marina Bay Sands Singapore",
        slug: "marina-bay-sands-singapore",
        description:
          "An architectural marvel comprising three towers topped by the iconic SkyPark and its 150m infinity pool. Singapore's most photographed hotel features the ArtScience Museum, celebrity restaurants, and a casino.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
            alt: "Marina Bay Sands",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
    {
      addrIdx: 21,
      data: {
        name: "Park Hyatt Sydney",
        slug: "park-hyatt-sydney",
        description:
          "Occupying a prime position on Sydney Harbour directly opposite the Opera House, the Park Hyatt Sydney offers the finest harbour views in Australia. Rooftop pool, award-winning dining, and impeccable service in 155 rooms.",
        starRating: 5,
        status: "ACTIVE",
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
            url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
            alt: "Sydney harbour hotel",
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    },
  ];

  const hotels: Record<string, { id: string; name: string; slug: string }> = {};

  for (const h of hotelsData) {
    const { amenityNames, images, checkInTime, checkOutTime, ...hotelFields } =
      h.data;
    const hotel = await prisma.hotel.create({
      data: {
        ...hotelFields,
        addressId: addresses[h.addrIdx].id,
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

  console.log("✅ Hotels seeded");
  return hotels;
}
