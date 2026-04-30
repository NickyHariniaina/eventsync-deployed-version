import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { mockEvent } from "../fixtures"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}))

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

const { GET, POST } = await import("@/app/api/events/route")
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost").toString(), init as NextRequest)
}

describe("GET /api/events", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return events ordered by startDate", async () => {
    const events = [
      mockEvent({ id: "e-1", title: "First Event", startDate: new Date("2025-01-01") }),
      mockEvent({ id: "e-2", title: "Second Event", startDate: new Date("2025-06-15") }),
    ]
    vi.mocked(prisma.event.findMany).mockResolvedValue(events)

    const response = await GET()

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveLength(2)
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      orderBy: { startDate: "asc" },
    })
  })

  it("should return empty array when no events exist", async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([])

    const response = await GET()

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual([])
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(prisma.event.findMany).mockRejectedValue(new Error("DB connection lost"))

    const response = await GET()

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})

describe("POST /api/events", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should create an event when authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-1", email: "admin@test.com", name: "Admin", emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "s-1", userId: "u-1", token: "abc", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    })
    vi.mocked(prisma.event.create).mockResolvedValue(
      mockEvent({
        id: "e-123",
        title: "New Conference",
        description: "A great event",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-09-03"),
        location: "Paris",
      }),
    )

    const request = makeRequest("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Conference",
        description: "A great event",
        startDate: "2025-09-01",
        endDate: "2025-09-03",
        location: "Paris",
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.title).toBe("New Conference")
    expect(prisma.event.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "New Conference",
        description: "A great event",
        location: "Paris",
      }),
    })
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const request = makeRequest("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Unauthorized Event" }),
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data).toEqual({ error: "Non autorisé" })
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-1", email: "admin@test.com", name: "Admin", emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "s-1", userId: "u-1", token: "abc", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    })
    vi.mocked(prisma.event.create).mockRejectedValue(new Error("DB connection lost"))

    const request = makeRequest("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Conference",
        description: "A great event",
        startDate: "2025-09-01",
        endDate: "2025-09-03",
        location: "Paris",
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})
