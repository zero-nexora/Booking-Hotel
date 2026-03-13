import { prisma } from "./client";

export async function seedLocations() {
  // ── Countries ──────────────────────────────────────────────────────────────
  const [vietnam, usa, france, japan, thailand, uae, uk, singapore, italy, australia] =
    await Promise.all(
      [
        "Vietnam",
        "United States",
        "France",
        "Japan",
        "Thailand",
        "United Arab Emirates",
        "United Kingdom",
        "Singapore",
        "Italy",
        "Australia",
      ].map((name) =>
        prisma.country.upsert({ where: { name }, update: {}, create: { name } })
      )
    );

  // ── Cities ─────────────────────────────────────────────────────────────────
  const [
    hanoi, hochiminh, danang, hoian, nhatrang, dalat,
    newYork, lasVegas, miami,
    paris,
    tokyo, osaka,
    bangkok, phuket,
    dubai,
    london,
    singapore_city,
    rome,
    sydney,
  ] = await Promise.all([
    // Vietnam
    prisma.city.upsert({ where: { name_countryId: { name: "Hanoi", countryId: vietnam.id } }, update: {}, create: { name: "Hanoi", countryId: vietnam.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Ho Chi Minh City", countryId: vietnam.id } }, update: {}, create: { name: "Ho Chi Minh City", countryId: vietnam.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Da Nang", countryId: vietnam.id } }, update: {}, create: { name: "Da Nang", countryId: vietnam.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Hoi An", countryId: vietnam.id } }, update: {}, create: { name: "Hoi An", countryId: vietnam.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Nha Trang", countryId: vietnam.id } }, update: {}, create: { name: "Nha Trang", countryId: vietnam.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Da Lat", countryId: vietnam.id } }, update: {}, create: { name: "Da Lat", countryId: vietnam.id } }),
    // USA
    prisma.city.upsert({ where: { name_countryId: { name: "New York", countryId: usa.id } }, update: {}, create: { name: "New York", countryId: usa.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Las Vegas", countryId: usa.id } }, update: {}, create: { name: "Las Vegas", countryId: usa.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Miami", countryId: usa.id } }, update: {}, create: { name: "Miami", countryId: usa.id } }),
    // France
    prisma.city.upsert({ where: { name_countryId: { name: "Paris", countryId: france.id } }, update: {}, create: { name: "Paris", countryId: france.id } }),
    // Japan
    prisma.city.upsert({ where: { name_countryId: { name: "Tokyo", countryId: japan.id } }, update: {}, create: { name: "Tokyo", countryId: japan.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Osaka", countryId: japan.id } }, update: {}, create: { name: "Osaka", countryId: japan.id } }),
    // Thailand
    prisma.city.upsert({ where: { name_countryId: { name: "Bangkok", countryId: thailand.id } }, update: {}, create: { name: "Bangkok", countryId: thailand.id } }),
    prisma.city.upsert({ where: { name_countryId: { name: "Phuket", countryId: thailand.id } }, update: {}, create: { name: "Phuket", countryId: thailand.id } }),
    // UAE
    prisma.city.upsert({ where: { name_countryId: { name: "Dubai", countryId: uae.id } }, update: {}, create: { name: "Dubai", countryId: uae.id } }),
    // UK
    prisma.city.upsert({ where: { name_countryId: { name: "London", countryId: uk.id } }, update: {}, create: { name: "London", countryId: uk.id } }),
    // Singapore
    prisma.city.upsert({ where: { name_countryId: { name: "Singapore", countryId: singapore.id } }, update: {}, create: { name: "Singapore", countryId: singapore.id } }),
    // Italy
    prisma.city.upsert({ where: { name_countryId: { name: "Rome", countryId: italy.id } }, update: {}, create: { name: "Rome", countryId: italy.id } }),
    // Australia
    prisma.city.upsert({ where: { name_countryId: { name: "Sydney", countryId: australia.id } }, update: {}, create: { name: "Sydney", countryId: australia.id } }),
  ]);

  // ── Addresses ──────────────────────────────────────────────────────────────
  const addressRows = [
    { cityId: hanoi.id,        street: "1 Đinh Tiên Hoàng",      state: null,  postalCode: "100000", latitude: 21.0285, longitude: 105.8542 },
    { cityId: hanoi.id,        street: "58 Hàng Bài",             state: null,  postalCode: "100000", latitude: 21.0243, longitude: 105.8412 },
    { cityId: hochiminh.id,    street: "19-23 Lam Sơn Square",    state: null,  postalCode: "700000", latitude: 10.7769, longitude: 106.7009 },
    { cityId: hochiminh.id,    street: "76 Lê Lai",               state: null,  postalCode: "700000", latitude: 10.7717, longitude: 106.6953 },
    { cityId: danang.id,       street: "36 Bạch Đằng",            state: null,  postalCode: "550000", latitude: 16.0544, longitude: 108.2022 },
    { cityId: danang.id,       street: "Võ Nguyên Giáp Beach",    state: null,  postalCode: "550000", latitude: 16.0674, longitude: 108.2469 },
    { cityId: hoian.id,        street: "4 Trần Hưng Đạo",         state: null,  postalCode: "560000", latitude: 15.8800, longitude: 108.3350 },
    { cityId: nhatrang.id,     street: "32-34 Trần Phú",          state: null,  postalCode: "650000", latitude: 12.2388, longitude: 109.1967 },
    { cityId: dalat.id,        street: "12 Trần Phú",             state: null,  postalCode: "670000", latitude: 11.9404, longitude: 108.4583 },
    { cityId: newYork.id,      street: "768 5th Avenue",          state: "NY",  postalCode: "10019",  latitude: 40.7636, longitude: -73.9737 },
    { cityId: lasVegas.id,     street: "3570 Las Vegas Blvd S",   state: "NV",  postalCode: "89109",  latitude: 36.1147, longitude: -115.1728 },
    { cityId: miami.id,        street: "1601 Collins Ave",        state: "FL",  postalCode: "33139",  latitude: 25.7826, longitude: -80.1299 },
    { cityId: paris.id,        street: "15 Place Vendôme",        state: null,  postalCode: "75001",  latitude: 48.8677, longitude: 2.3293 },
    { cityId: tokyo.id,        street: "1-9-1 Uchisaiwaicho",     state: null,  postalCode: "100-0011",latitude: 35.6708, longitude: 139.7514 },
    { cityId: osaka.id,        street: "1-3-3 Umeda",             state: null,  postalCode: "530-0001",latitude: 34.7022, longitude: 135.4958 },
    { cityId: bangkok.id,      street: "48 Oriental Ave",         state: null,  postalCode: "10500",  latitude: 13.7236, longitude: 100.5127 },
    { cityId: phuket.id,       street: "118 Moo 3 Srisoonthorn",  state: null,  postalCode: "83110",  latitude: 7.9995,  longitude: 98.2982 },
    { cityId: dubai.id,        street: "Sheikh Zayed Road",       state: null,  postalCode: "00000",  latitude: 25.2048, longitude: 55.2708 },
    { cityId: london.id,       street: "150 Piccadilly",          state: null,  postalCode: "W1J 9BR",latitude: 51.5074, longitude: -0.1422 },
    { cityId: singapore_city.id, street: "1 Beach Road",          state: null,  postalCode: "189673", latitude: 1.2939,  longitude: 103.8565 },
    { cityId: rome.id,         street: "Via Veneto 125",          state: null,  postalCode: "00187",  latitude: 41.9067, longitude: 12.4897 },
    { cityId: sydney.id,       street: "199 George Street",       state: "NSW", postalCode: "2000",   latitude: -33.8688, longitude: 151.2093 },
  ];

  const addresses = await Promise.all(
    addressRows.map((d) => prisma.address.create({ data: d }))
  );

  console.log("✅ Locations seeded");
  return {
    cities: { hanoi, hochiminh, danang, hoian, nhatrang, dalat, newYork, lasVegas, miami, paris, tokyo, osaka, bangkok, phuket, dubai, london, singapore_city, rome, sydney },
    addresses,
  };
}