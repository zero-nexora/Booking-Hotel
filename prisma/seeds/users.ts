import { prisma } from "./client";

export async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@staywise.com" },
    update: {},
    create: {
      email: "admin@staywise.com",
      name: "Admin User",
      emailVerified: true,
      role: "ADMIN",
      phone: "+84900000001",
    },
  });

  // Vietnamese customers
  const customer1 = await prisma.user.upsert({
    where: { email: "nguyenvanan@gmail.com" },
    update: {},
    create: {
      email: "nguyenvanan@gmail.com",
      name: "Nguyen Van An",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+84912345678",
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "tranthibich@gmail.com" },
    update: {},
    create: {
      email: "tranthibich@gmail.com",
      name: "Tran Thi Bich",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+84987654321",
    },
  });

  // International customers
  const customer3 = await prisma.user.upsert({
    where: { email: "david.chen@email.com" },
    update: {},
    create: {
      email: "david.chen@email.com",
      name: "David Chen",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+16505554321",
    },
  });

  const customer4 = await prisma.user.upsert({
    where: { email: "sophie.martin@email.fr" },
    update: {},
    create: {
      email: "sophie.martin@email.fr",
      name: "Sophie Martin",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+33612345678",
    },
  });

  const customer5 = await prisma.user.upsert({
    where: { email: "yuki.tanaka@mail.jp" },
    update: {},
    create: {
      email: "yuki.tanaka@mail.jp",
      name: "Yuki Tanaka",
      emailVerified: true,
      role: "CUSTOMER",
      phone: "+81312345678",
    },
  });

  // Unverified customer
  const customer6 = await prisma.user.upsert({
    where: { email: "alex.johnson@example.com" },
    update: {},
    create: {
      email: "alex.johnson@example.com",
      name: "Alex Johnson",
      emailVerified: false,
      role: "CUSTOMER",
      phone: "+14155551234",
    },
  });

  console.log("✅ Users seeded");
  return { admin, customer1, customer2, customer3, customer4, customer5, customer6 };
}