import Link from "next/link"
import LogoutButton from "@/components/logout-button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-8">EventSync Admin</h1>
        <nav className="space-y-2 flex-1">
          <Link href="/admin/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/events" className="block p-2 rounded hover:bg-gray-700">
            Événements
          </Link>
          <Link href="/admin/speakers" className="block p-2 rounded hover:bg-gray-700">
            Intervenants
          </Link>
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}