import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockQuestion } from "../fixtures"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    question: { findUnique: vi.fn(), update: vi.fn() },
  },
}))

const { PATCH } = await import("@/app/api/questions/[id]/upvote/route")
const { prisma } = await import("@/lib/prisma")

describe("PATCH /api/questions/[id]/upvote", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should increment upvotes and return the updated question", async () => {
    vi.mocked(prisma.question.findUnique).mockResolvedValue(
      mockQuestion({ id: "q-123", upvotes: 3 }),
    )
    vi.mocked(prisma.question.update).mockResolvedValue(
      mockQuestion({ id: "q-123", upvotes: 4 }),
    )

    const request = new Request("http://localhost/api/questions/q-123/upvote", {
      method: "PATCH",
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: "q-123" }) })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual(
      expect.objectContaining({ id: "q-123", upvotes: 4 }),
    )
    expect(prisma.question.findUnique).toHaveBeenCalledWith({
      where: { id: "q-123" },
    })
    expect(prisma.question.update).toHaveBeenCalledWith({
      where: { id: "q-123" },
      data: { upvotes: 4 },
    })
  })

  it("should return 404 when question is not found", async () => {
    vi.mocked(prisma.question.findUnique).mockResolvedValue(null)

    const request = new Request("http://localhost/api/questions/nonexistent/upvote", {
      method: "PATCH",
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toEqual({ error: "Question not found" })
  })

  it("should return 500 on unexpected database error", async () => {
    vi.mocked(prisma.question.findUnique).mockRejectedValue(new Error("DB connection lost"))

    const request = new Request("http://localhost/api/questions/q-123/upvote", {
      method: "PATCH",
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: "q-123" }) })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: "Internal server error" })
  })
})
