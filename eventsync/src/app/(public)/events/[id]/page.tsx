import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SessionCard } from "@/components/events/session-card"

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "A three-day deep dive into emerging technologies, featuring keynotes from industry leaders, hands-on workshops, and networking sessions.",
    startDate: new Date("2025-06-15T09:00:00Z"),
    endDate: new Date("2025-06-17T18:00:00Z"),
    location: "Paris Convention Center",
    sessions: [
      {
        id: "s1",
        title: "The Future of AI in Web Development",
        description: "Exploring how AI tools are reshaping the way we build and deploy web applications.",
        startTime: new Date("2025-06-15T09:30:00Z"),
        endTime: new Date("2025-06-15T10:30:00Z"),
        capacity: 200,
        roomName: "Main Hall",
        speakers: [
          { id: "sp1", name: "Sarah Chen", photo: null },
          { id: "sp2", name: "Marcus Webb", photo: null },
        ],
      },
      {
        id: "s2",
        title: "Building Scalable APIs with Next.js",
        description: "Best practices for designing APIs that handle millions of requests.",
        startTime: new Date("2025-06-15T11:00:00Z"),
        endTime: new Date("2025-06-15T12:00:00Z"),
        capacity: 150,
        roomName: "Room A",
        speakers: [
          { id: "sp3", name: "Alex Rivera", photo: null },
        ],
      },
      {
        id: "s3",
        title: "Web3 and Decentralized Identity",
        description: "How blockchain is enabling user-owned digital identities.",
        startTime: new Date("2025-06-15T14:00:00Z"),
        endTime: new Date("2025-06-15T15:30:00Z"),
        capacity: 100,
        roomName: "Room B",
        speakers: [
          { id: "sp4", name: "Jordan Park", photo: null },
          { id: "sp5", name: "Nina Kowalski", photo: null },
        ],
      },
      {
        id: "s4",
        title: "Design Systems at Scale",
        description: "Lessons learned from building and maintaining design systems across large organizations.",
        startTime: new Date("2025-06-16T09:00:00Z"),
        endTime: new Date("2025-06-16T10:00:00Z"),
        capacity: 120,
        roomName: "Main Hall",
        speakers: [
          { id: "sp6", name: "Emma Laurent", photo: null },
        ],
      },
      {
        id: "s5",
        title: "Edge Computing and Serverless",
        description: "Deploying closer to your users for lower latency and better performance.",
        startTime: new Date("2025-06-16T11:00:00Z"),
        endTime: new Date("2025-06-16T12:00:00Z"),
        capacity: 80,
        roomName: "Room A",
        speakers: [
          { id: "sp1", name: "Sarah Chen", photo: null },
        ],
      },
      {
        id: "s6",
        title: "Workshop: Build Your First AI Agent",
        description: "Hands-on session building a functional AI agent with modern tooling.",
        startTime: new Date("2025-06-16T14:00:00Z"),
        endTime: new Date("2025-06-16T17:00:00Z"),
        capacity: 40,
        roomName: "Workshop Room",
        speakers: [
          { id: "sp2", name: "Marcus Webb", photo: null },
          { id: "sp3", name: "Alex Rivera", photo: null },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Web3 Summit",
    description: "Connecting builders, creators, and innovators in the decentralized web.",
    startDate: new Date("2025-09-01T10:00:00Z"),
    endDate: new Date("2025-09-03T17:00:00Z"),
    location: "Berlin Arena",
    sessions: [
      {
        id: "s7",
        title: "State of DeFi 2025",
        description: "A comprehensive overview of the decentralized finance landscape.",
        startTime: new Date("2025-09-01T10:30:00Z"),
        endTime: new Date("2025-09-01T11:30:00Z"),
        capacity: 300,
        roomName: "Main Stage",
        speakers: [
          { id: "sp7", name: "Leo Zhang", photo: null },
        ],
      },
      {
        id: "s8",
        title: "Zero-Knowledge Proofs Explained",
        description: "Demystifying ZK tech and its practical applications.",
        startTime: new Date("2025-09-01T13:00:00Z"),
        endTime: new Date("2025-09-01T14:30:00Z"),
        capacity: 150,
        roomName: "Track 1",
        speakers: [
          { id: "sp4", name: "Jordan Park", photo: null },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "AI & ML Workshop",
    description: "Practical machine learning techniques for software engineers.",
    startDate: new Date("2025-03-20T08:30:00Z"),
    endDate: new Date("2025-03-20T16:00:00Z"),
    location: "London Tech Hub",
    sessions: [
      {
        id: "s9",
        title: "Introduction to Transformers",
        description: "Understanding the architecture behind modern language models.",
        startTime: new Date("2025-03-20T09:00:00Z"),
        endTime: new Date("2025-03-20T10:30:00Z"),
        capacity: 60,
        roomName: "Lab 1",
        speakers: [
          { id: "sp5", name: "Nina Kowalski", photo: null },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Startup Pitch Day",
    description: "Watch 12 startups pitch to top VCs in front of a live audience.",
    startDate: new Date("2025-07-10T11:00:00Z"),
    endDate: new Date("2025-07-10T18:00:00Z"),
    location: "San Francisco Innovation Hub",
    sessions: [
      {
        id: "s10",
        title: "Morning Pitch Block",
        description: "Startups 1-6 present their visions.",
        startTime: new Date("2025-07-10T11:00:00Z"),
        endTime: new Date("2025-07-10T13:30:00Z"),
        capacity: 250,
        roomName: "Auditorium",
        speakers: [],
      },
      {
        id: "s11",
        title: "Afternoon Pitch Block",
        description: "Startups 7-12 take the stage.",
        startTime: new Date("2025-07-10T14:30:00Z"),
        endTime: new Date("2025-07-10T17:00:00Z"),
        capacity: 250,
        roomName: "Auditorium",
        speakers: [],
      },
    ],
  },
  {
    id: "5",
    title: "Design Thinking Bootcamp",
    description: "Two days of collaborative design sprints and creative problem-solving.",
    startDate: new Date("2025-08-21T09:00:00Z"),
    endDate: new Date("2025-08-22T16:30:00Z"),
    location: "Amsterdam Creative Space",
    sessions: [
      {
        id: "s12",
        title: "Empathy Mapping Workshop",
        description: "Learn to understand user needs through structured empathy exercises.",
        startTime: new Date("2025-08-21T09:30:00Z"),
        endTime: new Date("2025-08-21T12:00:00Z"),
        capacity: 30,
        roomName: "Studio A",
        speakers: [
          { id: "sp6", name: "Emma Laurent", photo: null },
        ],
      },
      {
        id: "s13",
        title: "Prototyping Sprint",
        description: "From sketches to clickable prototypes in 4 hours.",
        startTime: new Date("2025-08-22T09:00:00Z"),
        endTime: new Date("2025-08-22T13:00:00Z"),
        capacity: 30,
        roomName: "Studio A",
        speakers: [
          { id: "sp6", name: "Emma Laurent", photo: null },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Healthcare Tech Expo",
    description: "Showcasing innovations in digital health, telemedicine, and medical AI.",
    startDate: new Date("2025-11-02T10:00:00Z"),
    endDate: new Date("2025-11-04T17:00:00Z"),
    location: "Tokyo International Forum",
    sessions: [
      {
        id: "s14",
        title: "AI-Assisted Diagnostics",
        description: "How machine learning is improving early detection of diseases.",
        startTime: new Date("2025-11-02T10:30:00Z"),
        endTime: new Date("2025-11-02T11:30:00Z"),
        capacity: 180,
        roomName: "Hall 1",
        speakers: [
          { id: "sp7", name: "Leo Zhang", photo: null },
          { id: "sp1", name: "Sarah Chen", photo: null },
        ],
      },
    ],
  },
]

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params
  const event = mockEvents.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  const isLive = new Date() >= event.startDate && new Date() <= event.endDate

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
            {formatDate(event.startDate)} — {formatDate(event.endDate)}
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
          Sessions ({event.sessions.length})
        </h2>
        {event.sessions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.sessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={session.title}
                description={session.description}
                startTime={session.startTime}
                endTime={session.endTime}
                capacity={session.capacity}
                roomName={session.roomName}
                speakers={session.speakers}
                isLive={
                  new Date() >= session.startTime &&
                  new Date() <= session.endTime
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No sessions scheduled yet.</p>
        )}
      </div>
    </div>
  )
}
