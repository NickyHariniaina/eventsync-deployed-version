"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
        }
      }
    })
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full p-2 text-left rounded hover:bg-gray-700 text-red-400"
    >
      Se déconnecter
    </button>
  )
}