import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params

        const room = await prisma.room.findUnique({
            where: { id },
        })

        if (!room) {
            return NextResponse.json(
                { error: "Salle non trouvée" },
                { status: 404 }
            )
        }

        const sessions = await prisma.talkSession.findMany({
            where: { roomId: id },
            orderBy: { startTime: "asc" },
            include: {
                speakers: {
                    include: { speaker: true },
                },
            },
        })

        return NextResponse.json({
            id: room.id,
            name: room.name,
            sessions: sessions.map((s) => ({
                id: s.id,
                title: s.title,
                description: s.description,
                startTime: s.startTime,
                endTime: s.endTime,
                capacity: s.capacity,
                eventId: s.eventId,
                speakers: s.speakers.map((ss) => ({
                    id: ss.speaker.id,
                    name: ss.speaker.name,
                    photo: ss.speaker.photo,
                })),
            })),
        })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    const session = await auth.api.getSession({
        headers: request.headers
    })
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()

        if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
            return NextResponse.json(
                { error: "Le nom de la salle est requis" },
                { status: 400 }
            )
        }

        const existing = await prisma.room.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json(
                { error: "Salle non trouvée" },
                { status: 404 }
            )
        }

        const room = await prisma.room.update({
            where: { id },
            data: { name: body.name.trim() },
        })

        return NextResponse.json(room)
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const session = await auth.api.getSession({
        headers: request.headers
    })
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    try {
        const { id } = await params

        const existing = await prisma.room.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json(
                { error: "Salle non trouvée" },
                { status: 404 }
            )
        }

        await prisma.room.delete({ where: { id } })
        return NextResponse.json({ message: "Salle supprimée" })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}