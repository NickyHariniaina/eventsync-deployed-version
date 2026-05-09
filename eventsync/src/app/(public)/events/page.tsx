"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { EventCard } from "@/components/events/event-card"

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
  const [query, setQuery] = useState("")

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

  const eventsWithSessionCount = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        sessionCount: event.sessions?.length ?? 0,
      })),
    [events],
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return eventsWithSessionCount
    const q = query.toLowerCase()
    return eventsWithSessionCount.filter(
      (event) =>
        event.title.toLowerCase().includes(q) ||
        (event.location && event.location.toLowerCase().includes(q)),
    )
  }, [eventsWithSessionCount, query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border-2 border-border bg-background py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        {query && (
          <p className="text-sm text-muted-foreground">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
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
        <div className="mx-auto mt-20 max-w-sm flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Chargement des événements...</span>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 rounded-full bg-primary progress-sweep" />
          </div>
        </div>
      )}
      {!isLoading && !error && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {query ? "Aucun événement trouvé" : "No events available"}
        </p>
      )}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
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