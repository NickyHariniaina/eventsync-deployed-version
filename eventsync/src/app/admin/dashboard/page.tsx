import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const eventsCount = await prisma.event.count()
  const sessionsCount = await prisma.talkSession.count()
  const speakersCount = await prisma.speaker.count()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 border rounded-lg">
          <p className="text-gray-500">Événements</p>
          <p className="text-4xl font-bold">{eventsCount}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-gray-500">Sessions</p>
          <p className="text-4xl font-bold">{sessionsCount}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-gray-500">Intervenants</p>
          <p className="text-4xl font-bold">{speakersCount}</p>
        </div>
      </div>
    </div>
  )
}