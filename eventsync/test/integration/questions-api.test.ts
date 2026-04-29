import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockSession, mockQuestion } from "../fixtures"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    talkSession: { findUnique: vi.fn() },
    question: { create: vi.fn(), findMany: vi.fn() },
  },
}))

const { GET, POST } = await import("@/app/api/sessions/[id]/questions/route")
import { prisma } from "@/lib/prisma"

describe("POST /api/sessions/[id]/questions", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should create a question for a live session", async () => {
    vi.mocked(prisma.talkSession.findUnique).mockResolvedValue(mockSession({ id: "session-123" }))
    vi.mocked(prisma.question.create).mockResolvedValue(
      mockQuestion({
        id: "q-123",
        content: "When does this session end?",
        author: "Anonymous",
        sessionId: "session-123",
        createdAt: new Date("2026-04-29T10:00:00Z"),
      }),
    )

    const request = new Request("http://localhost/api/sessions/session-123/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "When does this session end?", author: "Anonymous" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data).toEqual({
      id: "q-123",
      content: "When does this session end?",
      author: "Anonymous",
      upvotes: 0,
      sessionId: "session-123",
      createdAt: "2026-04-29T10:00:00.000Z",
    })
  })

  it("should return 400 when content is empty", async () => {
    const request = new Request("http://localhost/api/sessions/session-123/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "", author: "Anonymous" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data).toEqual({ error: "Question cannot be empty" })
  })

  it("should return 400 when content is missing", async () => {
    const request = new Request("http://localhost/api/sessions/session-123/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "Anonymous" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBeDefined()
  })

  it("should return 404 when session is not found", async () => {
    vi.mocked(prisma.talkSession.findUnique).mockResolvedValue(null)

    const request = new Request("http://localhost/api/sessions/nonexistent/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Is anyone there?" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toEqual({ error: "Session not found" })
  })

  it("should return 400 when session is not live (in the future)", async () => {
    const now = new Date()
    vi.mocked(prisma.talkSession.findUnique).mockResolvedValue(
      mockSession({
        id: "session-123",
        title: "Future Session",
        startTime: new Date(now.getTime() + 3600000),
        endTime: new Date(now.getTime() + 7200000),
      }),
    )

    const request = new Request("http://localhost/api/sessions/session-123/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Too early!" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data).toEqual({ error: "Session is not live" })
  })

  it("should return 400 when session is not live (already ended)", async () => {
    const now = new Date()
    vi.mocked(prisma.talkSession.findUnique).mockResolvedValue(
      mockSession({
        id: "session-123",
        title: "Past Session",
        startTime: new Date(now.getTime() - 7200000),
        endTime: new Date(now.getTime() - 3600000),
      }),
    )

    const request = new Request("http://localhost/api/sessions/session-123/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Too late!" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data).toEqual({ error: "Session is not live" })
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(prisma.talkSession.findUnique).mockRejectedValue(new Error("DB connection lost"))

    const request = new Request("http://localhost/api/sessions/session-123/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Hello?" }),
    })

    const response = await POST(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})

describe("GET /api/sessions/[id]/questions", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return questions ordered by upvotes", async () => {
    vi.mocked(prisma.question.findMany).mockResolvedValue([
      mockQuestion({ id: "q-1", content: "Most upvoted?", upvotes: 5, sessionId: "session-123" }),
      mockQuestion({ id: "q-2", content: "Second?", upvotes: 2, sessionId: "session-123" }),
      mockQuestion({ id: "q-3", content: "No upvotes", upvotes: 0, sessionId: "session-123" }),
    ])

    const request = new Request("http://localhost/api/sessions/session-123/questions")
    const response = await GET(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveLength(3)
    expect(data[0].upvotes).toBe(5)
    expect(data[1].upvotes).toBe(2)
    expect(data[2].upvotes).toBe(0)
  })

  it("should return empty array when no questions exist", async () => {
    vi.mocked(prisma.question.findMany).mockResolvedValue([])

    const request = new Request("http://localhost/api/sessions/session-123/questions")
    const response = await GET(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual([])
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(prisma.question.findMany).mockRejectedValue(new Error("DB connection lost"))

    const request = new Request("http://localhost/api/sessions/session-123/questions")
    const response = await GET(request, { params: Promise.resolve({ id: "session-123" }) })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})
