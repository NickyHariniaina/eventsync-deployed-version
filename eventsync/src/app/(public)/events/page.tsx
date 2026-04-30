import { EventCard } from "@/components/events/event-card"

const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2025",
    startDate: new Date("2025-06-15T09:00:00Z"),
    endDate: new Date("2025-06-17T18:00:00Z"),
    location: "Paris Convention Center",
    sessionCount: 24,
  },
  {
    id: "2",
    title: "Web3 Summit",
    startDate: new Date("2025-09-01T10:00:00Z"),
    endDate: new Date("2025-09-03T17:00:00Z"),
    location: "Berlin Arena",
    sessionCount: 18,
  },
  {
    id: "3",
    title: "AI & ML Workshop",
    startDate: new Date("2025-03-20T08:30:00Z"),
    endDate: new Date("2025-03-20T16:00:00Z"),
    location: "London Tech Hub",
    sessionCount: 6,
  },
  {
    id: "4",
    title: "Startup Pitch Day",
    startDate: new Date("2025-07-10T11:00:00Z"),
    endDate: new Date("2025-07-10T18:00:00Z"),
    location: "San Francisco Innovation Hub",
    sessionCount: 12,
  },
  {
    id: "5",
    title: "Design Thinking Bootcamp",
    startDate: new Date("2025-08-21T09:00:00Z"),
    endDate: new Date("2025-08-22T16:30:00Z"),
    location: "Amsterdam Creative Space",
    sessionCount: 9,
  },
  {
    id: "6",
    title: "Healthcare Tech Expo",
    startDate: new Date("2025-11-02T10:00:00Z"),
    endDate: new Date("2025-11-04T17:00:00Z"),
    location: "Tokyo International Forum",
    sessionCount: 21,
  },
]

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  )
}
