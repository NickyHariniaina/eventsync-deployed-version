import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { mockEvent } from "../fixtures"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}))

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

const { GET, PUT, DELETE } = await import("@/app/api/events/[id]/route")
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost").toString(), init as NextRequest)
}

describe("GET /api/events/[id]", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return an event with its sessions", async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      ...mockEvent({ id: "e-123", title: "Tech Conference" }),
      sessions: [
        {
          id: "s-1",
          title: "Opening Keynote",
          description: null,
          startTime: new Date(),
          endTime: new Date(),
          capacity: null,
          eventId: "e-123",
          roomId: "room-1",
          room: { id: "room-1", name: "Main Hall" },
          speakers: [
            { sessionId: "s-1", speakerId: "sp-1", speaker: { id: "sp-1", name: "John Doe", photo: null, bio: null } }
          ],
        },
        {
          id: "s-2",
          title: "Closing Remarks",
          description: null,
          startTime: new Date(),
          endTime: new Date(),
          capacity: null,
          eventId: "e-123",
          roomId: "room-1",
          room: { id: "room-1", name: "Main Hall" },
          speakers: [],
        },
      ],
    })

    const response = await GET(
      makeRequest("/api/events/e-123"),
      { params: { id: "e-123" } }
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.title).toBe("Tech Conference")
    expect(data.sessions).toHaveLength(2)
    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: "e-123" },
      include: {
        sessions: {
          include: {
            room: true,
            speakers: {
              include: {
                speaker: true
              }
            }
          }
        }
      },
    })
  })

  it("should return 404 when event is not found", async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)

    const response = await GET(
      makeRequest("/api/events/nonexistent"),
      { params: { id: "nonexistent" } }
    )

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toEqual({ error: "Événement non trouvé" })
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(prisma.event.findUnique).mockRejectedValue(new Error("DB connection lost"))

    const response = await GET(
      makeRequest("/api/events/e-123"),
      { params: { id: "e-123" } }
    )

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})

describe("PUT /api/events/[id]", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should update an event when authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-1", email: "admin@test.com", name: "Admin", emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "s-1", userId: "u-1", token: "abc", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    })
    vi.mocked(prisma.event.update).mockResolvedValue(
      mockEvent({
        id: "e-123",
        title: "Updated Conference",
        description: "Updated description",
        startDate: new Date("2025-12-01"),
        endDate: new Date("2025-12-03"),
        location: "London",
      }),
    )

    const request = makeRequest("/api/events/e-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Conference",
        description: "Updated description",
        startDate: "2025-12-01",
        endDate: "2025-12-03",
        location: "London",
      }),
    })

    const response = await PUT(request, { params: { id: "e-123" } })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.title).toBe("Updated Conference")
    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: "e-123" },
      data: expect.objectContaining({
        title: "Updated Conference",
        description: "Updated description",
        location: "London",
      }),
    })
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const request = makeRequest("/api/events/e-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Should fail" }),
    })

    const response = await PUT(request, { params: { id: "e-123" } })

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data).toEqual({ error: "Non autorisé" })
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-1", email: "admin@test.com", name: "Admin", emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "s-1", userId: "u-1", token: "abc", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    })
    vi.mocked(prisma.event.update).mockRejectedValue(new Error("DB connection lost"))

    const request = makeRequest("/api/events/e-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated Conference" }),
    })

    const response = await PUT(request, { params: { id: "e-123" } })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})

describe("DELETE /api/events/[id]", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should delete an event when authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-1", email: "admin@test.com", name: "Admin", emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "s-1", userId: "u-1", token: "abc", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    })
    vi.mocked(prisma.event.delete).mockResolvedValue(mockEvent({ id: "e-123" }))

    const request = makeRequest("/api/events/e-123", {
      method: "DELETE",
    })

    const response = await DELETE(request, { params: { id: "e-123" } })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual({ message: "Événement supprimé" })
    expect(prisma.event.delete).toHaveBeenCalledWith({
      where: { id: "e-123" },
    })
  })

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const request = makeRequest("/api/events/e-123", {
      method: "DELETE",
    })

    const response = await DELETE(request, { params: { id: "e-123" } })

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data).toEqual({ error: "Non autorisé" })
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-1", email: "admin@test.com", name: "Admin", emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "s-1", userId: "u-1", token: "abc", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    })
    vi.mocked(prisma.event.delete).mockRejectedValue(new Error("DB connection lost"))

    const request = makeRequest("/api/events/e-123", {
      method: "DELETE",
    })

    const response = await DELETE(request, { params: { id: "e-123" } })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})
