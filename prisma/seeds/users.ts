import { prisma } from "./client";

export async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      email: "admin@hotel.com",
      name: "Admin User",
      emailVerified: true,
      role: "ADMIN",
      phone: "+1234567890",
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      name: "John Doe",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+1987654321",
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+1122334455",
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: "bob.wilson@example.com" },
    update: {},
    create: {
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      emailVerified: false,
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users seeded");
  return { admin, customer1, customer2, customer3 };
}
