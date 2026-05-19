export type Question = {
  id: string
  content: string
  author: string | null
  upvotes: number
  sessionId: string
  createdAt: Date
}

export type Speaker = {
    id: string
    name: string
    photo: string | null
    bio: string | null
    links?: SpeakerLink[]
}
export type SpeakerLink = {
    id: string
    label: string
    url: string
}

export type SerializedSession = {
    id: string
    title: string
    startTime: string
    endTime: string
    room: string
    eventTitle: string
}

export type Session = {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  capacity: number | null
  eventId: string
  roomId: string
  roomName: string
  speakers: Speaker[]
  createdAt: Date
  updatedAt: Date
}

export type Event = {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  location: string | null
  sessions?: Session[]
  createdAt: Date
  updatedAt: Date
}
