import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
    try {
        const sessions = await prisma.talkSession.findMany({
            include: {
                room: true,
                speakers: {
                    include: {
                        speaker: true,
                    },
                },
            },
            orderBy: { startTime: "asc" },
        })

        const formatted = sessions.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            startTime: s.startTime,
            endTime: s.endTime,
            capacity: s.capacity,
            eventId: s.eventId,
            roomId: s.roomId,
            roomName: s.room.name,
            speakers: s.speakers.map((ss) => ({
                id: ss.speaker.id,
                name: ss.speaker.name,
                photo: ss.speaker.photo,
                bio: ss.speaker.bio,
            })),
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        }))

        return NextResponse.json(formatted)
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const { title, description, startTime, endTime, capacity, eventId, roomId, speakerIds } = body

        if (!title || !startTime || !endTime || !eventId || !roomId) {
            return NextResponse.json(
                { error: "Champs requis manquants : title, startTime, endTime, eventId, roomId" },
                { status: 400 }
            )
        }

        const newSession = await prisma.talkSession.create({
            data: {
                title,
                description: description ?? null,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                capacity: capacity ?? null,
                eventId,
                roomId,
                ...(speakerIds && speakerIds.length > 0
                    ? {
                        speakers: {
                            create: speakerIds.map((speakerId: string) => ({ speakerId })),
                        },
                    }
                    : {}),
            },
            include: {
                room: true,
                speakers: {
                    include: { speaker: true },
                },
            },
        })

        return NextResponse.json(
            {
                id: newSession.id,
                title: newSession.title,
                description: newSession.description,
                startTime: newSession.startTime,
                endTime: newSession.endTime,
                capacity: newSession.capacity,
                eventId: newSession.eventId,
                roomId: newSession.roomId,
                roomName: newSession.room.name,
                speakers: newSession.speakers.map((ss) => ({
                    id: ss.speaker.id,
                    name: ss.speaker.name,
                    photo: ss.speaker.photo,
                    bio: ss.speaker.bio,
                })),
                createdAt: newSession.createdAt,
                updatedAt: newSession.updatedAt,
            },
            { status: 201 }
        )
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}