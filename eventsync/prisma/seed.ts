import "dotenv/config"
import { auth } from "../src/lib/auth"
import { prisma } from "../src/lib/prisma"

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@eventsync.com"
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.error("❌ ADMIN_PASSWORD must be set in environment")
    process.exit(1)
  }

  await auth.api.signUpEmail({
    body: {
      name: "Admin",
      email,
      password,
    }
  })
  console.log(`✅ Admin créé avec succès (${email})`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())