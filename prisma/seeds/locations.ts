import { prisma } from "./client";

export async function seedLocations() {
  const usa = await prisma.country.upsert({
    where: { name: "United States" },
    update: {},
    create: { name: "United States" },
  });

  const france = await prisma.country.upsert({
    where: { name: "France" },
    update: {},
    create: { name: "France" },
  });

  const japan = await prisma.country.upsert({
    where: { name: "Japan" },
    update: {},
    create: { name: "Japan" },
  });

  const newYork = await prisma.city.upsert({
    where: { name_countryId: { name: "New York", countryId: usa.id } },
    update: {},
    create: { name: "New York", countryId: usa.id },
  });

  const losAngeles = await prisma.city.upsert({
    where: { name_countryId: { name: "Los Angeles", countryId: usa.id } },
    update: {},
    create: { name: "Los Angeles", countryId: usa.id },
  });

  const paris = await prisma.city.upsert({
    where: { name_countryId: { name: "Paris", countryId: france.id } },
    update: {},
    create: { name: "Paris", countryId: france.id },
  });

  const tokyo = await prisma.city.upsert({
    where: { name_countryId: { name: "Tokyo", countryId: japan.id } },
    update: {},
    create: { name: "Tokyo", countryId: japan.id },
  });

  const addr1 = await prisma.address.create({
    data: {
      cityId: newYork.id,
      street: "123 5th Avenue",
      state: "NY",
      postalCode: "10001",
      latitude: 40.7484,
      longitude: -73.9967,
    },
  });

  const addr2 = await prisma.address.create({
    data: {
      cityId: losAngeles.id,
      street: "456 Sunset Blvd",
      state: "CA",
      postalCode: "90028",
      latitude: 34.0928,
      longitude: -118.3287,
    },
  });

  const addr3 = await prisma.address.create({
    data: {
      cityId: paris.id,
      street: "10 Rue de Rivoli",
      postalCode: "75001",
      latitude: 48.8566,
      longitude: 2.3522,
    },
  });

  const addr4 = await prisma.address.create({
    data: {
      cityId: tokyo.id,
      street: "2-1-1 Nihonbashi",
      postalCode: "103-0027",
      latitude: 35.6812,
      longitude: 139.7671,
    },
  });

  console.log("✅ Locations seeded");
  return { newYork, losAngeles, paris, tokyo, addr1, addr2, addr3, addr4 };
}
