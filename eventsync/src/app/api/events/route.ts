import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createEventSchema } from "@/lib/validators"
import { corsHeaders, corsOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
      include: {
        sessions: { select: { id: true } }
      }
    })
    return NextResponse.json(events, {
      headers: {
        ...corsHeaders(request),
        "Content-Range": `events 0-${events.length}/${events.length}`,
      }
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  })
  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401, headers: corsHeaders(request) },
    )
  }

  try {
    const body = await request.json()
    const parsed = createEventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400, headers: corsHeaders(request) },
      )
    }
    const event = await prisma.event.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        location: parsed.data.location,
      }
    })
    return NextResponse.json(event, {
      status: 201,
      headers: corsHeaders(request),
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) },
    )
  }
}