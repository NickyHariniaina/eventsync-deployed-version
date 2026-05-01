import "dotenv/config"
import { auth } from "../src/lib/auth"
import { prisma } from "../src/lib/prisma"

async function main() {
  await auth.api.signUpEmail({
    body: {
      name: "Admin",
      email: "admin@eventsync.com",
      password: "motdepasse123",
    }
  })
  console.log("✅ Admin créé avec succès")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())