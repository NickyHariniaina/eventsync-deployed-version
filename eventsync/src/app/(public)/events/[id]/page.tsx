"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SessionCard } from "@/components/events/session-card"
import { EventDetailSkeleton } from "@/components/events/event-detail-skeleton"

interface ApiSession {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  capacity: number | null
  room: { id: string; name: string }
  speakers: { speaker: { id: string; name: string; photo: string | null } }[]
}

interface ApiEvent {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  location: string | null
  sessions: ApiSession[]
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<ApiEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventId = params?.id as string

  useEffect(() => {
    if (!eventId) return

    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("Event not found")
          } else {
            throw new Error("Failed to fetch event")
          }
          return
        }
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (isLoading) {
    return <EventDetailSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Events
        </Link>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-muted-foreground">Event not found</p>
      </div>
    )
  }

  const isLive = new Date() >= new Date(event.startDate) && new Date() <= new Date(event.endDate)

  const sessionsWithDetails = event.sessions.map((session) => ({
    id: session.id,
    title: session.title,
    description: session.description,
    startTime: new Date(session.startTime),
    endTime: new Date(session.endTime),
    capacity: session.capacity,
    roomName: session.room.name,
    speakers: session.speakers.map((s) => s.speaker),
    isLive: new Date() >= new Date(session.startTime) && new Date() <= new Date(session.endTime),
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Events
      </Link>

      <div className="mb-8">
        <div className="flex items-start gap-3 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          {isLive && <Badge variant="destructive" className="mt-1">Live</Badge>}
        </div>

        {event.description && (
          <p className="text-muted-foreground mb-4 max-w-3xl">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {formatDate(new Date(event.startDate))} — {formatDate(new Date(event.endDate))}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Sessions ({sessionsWithDetails.length})
        </h2>
        {sessionsWithDetails.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessionsWithDetails.map((session) => (
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No sessions scheduled yet.</p>
        )}
      </div>
    </div>
  )
}