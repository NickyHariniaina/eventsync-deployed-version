import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "asc" }
  })
  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  })
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      location: body.location,
    }
  })
  return NextResponse.json(event, { status: 201 })
}