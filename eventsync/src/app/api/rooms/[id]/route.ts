import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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