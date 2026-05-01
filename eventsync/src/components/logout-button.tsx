"use client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" })
    router.push("/events")
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-4 w-full text-left p-2 rounded hover:bg-gray-700 cursor-pointer"
    >
      Déconnexion
    </button>
  )
}
