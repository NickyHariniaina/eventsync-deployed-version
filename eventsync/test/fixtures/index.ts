export function mockSession(overrides: Partial<MockSession> = {}): MockSession {
  const now = new Date()
  return {
    id: "session-default",
    title: "Test Session",
    description: null,
    startTime: new Date(now.getTime() - 3600000),
    endTime: new Date(now.getTime() + 3600000),
    capacity: null,
    eventId: "event-default",
    roomId: "room-default",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function mockQuestion(overrides: Partial<MockQuestion> = {}): MockQuestion {
  return {
    id: "question-default",
    content: "Test question?",
    author: null,
    upvotes: 0,
    sessionId: "session-default",
    createdAt: new Date(),
    ...overrides,
  }
}

export type MockSession = {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  capacity: number | null
  eventId: string
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type MockQuestion = {
  id: string
  content: string
  author: string | null
  upvotes: number
  sessionId: string
  createdAt: Date
}
