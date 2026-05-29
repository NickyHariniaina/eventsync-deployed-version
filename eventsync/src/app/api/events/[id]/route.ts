import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createEventSchema } from "@/lib/validators"
import { corsHeaders, corsOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const event = await prisma.event.findUnique({
      where: { id },
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
      }
    })
    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404, headers: corsHeaders(request) },
      )
    }
    return NextResponse.json(event, {
      headers: {
        ...corsHeaders(request),
        "Content-Range": `events 0-1/1`,
      }
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        location: parsed.data.location,
      }
    })
    return NextResponse.json(event, {
      headers: corsHeaders(request),
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    await prisma.event.delete({
      where: { id }
    })
    return NextResponse.json(
      { message: "Événement supprimé" },
      { headers: corsHeaders(request) },
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) },
    )
  }
}