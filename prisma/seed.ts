import "dotenv/config";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";

async function seedAdmin() {
  const email = "smmasrafi01@gmail.com";
  const password = "Masrafi6585#000#";
  const name = "S M Masrafi";

  console.log(`Checking if user ${email} already exists...`);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists in database.`);
    return;
  }

  console.log(`Seeding admin user ${email}...`);
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    console.log("Admin user created successfully!", res);
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
}

seedAdmin()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
