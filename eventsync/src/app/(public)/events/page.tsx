"use client"

import { useEffect, useState } from "react"
import { EventCard } from "@/components/events/event-card"
import { EventCardSkeleton } from "@/components/events/event-card-skeleton"

interface ApiEvent {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  location: string | null
  sessions: { id: string }[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const eventsWithSessionCount = events.map((event) => ({
    ...event,
    sessionCount: event.sessions?.length ?? 0,
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Events</h1>
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      )}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}
      {!isLoading && !error && eventsWithSessionCount.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No events available
        </p>
      )}
      {!isLoading && !error && eventsWithSessionCount.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventsWithSessionCount.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              startDate={new Date(event.startDate)}
              endDate={new Date(event.endDate)}
              location={event.location}
              sessionCount={event.sessionCount}
            />
          ))}
        </div>
      )}
    </div>
  )
}