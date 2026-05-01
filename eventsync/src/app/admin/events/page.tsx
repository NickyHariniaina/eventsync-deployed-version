import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "asc" }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Événements</h1>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Nouvel événement
        </Link>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h2 className="font-bold">{event.title}</h2>
              <p className="text-gray-500">{event.location}</p>
            </div>
            <Link
              href={`/admin/events/${event.id}`}
              className="text-blue-500 hover:underline"
            >
              Modifier
            </Link>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Aucun événement pour le moment
          </p>
        )}
      </div>
    </div>
  )
}