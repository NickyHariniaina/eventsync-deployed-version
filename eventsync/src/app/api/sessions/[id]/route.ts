import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { updateSessionSchema } from "@/lib/validators"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params

        const session = await prisma.talkSession.findUnique({
            where: { id },
            include: {
                room: true,
                speakers: {
                    include: { speaker: true },
                },
                questions: {
                    orderBy: { upvotes: "desc" },
                },
            },
        })

        if (!session) {
            return NextResponse.json(
                { error: "Session non trouvée" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            id: session.id,
            title: session.title,
            description: session.description,
            startTime: session.startTime,
            endTime: session.endTime,
            capacity: session.capacity,
            eventId: session.eventId,
            roomId: session.roomId,
            roomName: session.room.name,
            speakers: session.speakers.map((ss) => ({
                id: ss.speaker.id,
                name: ss.speaker.name,
                photo: ss.speaker.photo,
                bio: ss.speaker.bio,
            })),
            questions: session.questions,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        }, {
    headers: {
        "Content-Range": "sessions 0-1/1",
        "Access-Control-Expose-Headers": "Content-Range",
    }})
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const authSession = await auth.api.getSession({ headers: await headers() })
        if (!authSession) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const parsed = updateSessionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid request" },
                { status: 400 }
            )
        }

        const { title, description, startTime, endTime, capacity, roomId, speakerIds } = parsed.data

        const existing = await prisma.talkSession.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json(
                { error: "Session non trouvée" },
                { status: 404 }
            )
        }

        const updated = await prisma.talkSession.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(startTime !== undefined && { startTime: new Date(startTime) }),
                ...(endTime !== undefined && { endTime: new Date(endTime) }),
                ...(capacity !== undefined && { capacity }),
                ...(roomId !== undefined && { roomId }),
                ...(speakerIds !== undefined && {
                    speakers: {
                        deleteMany: {},
                        create: speakerIds.map((speakerId: string) => ({ speakerId })),
                    },
                }),
            },
            include: {
                room: true,
                speakers: {
                    include: { speaker: true },
                },
            },
        })

        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            description: updated.description,
            startTime: updated.startTime,
            endTime: updated.endTime,
            capacity: updated.capacity,
            eventId: updated.eventId,
            roomId: updated.roomId,
            roomName: updated.room.name,
            speakers: updated.speakers.map((ss) => ({
                id: ss.speaker.id,
                name: ss.speaker.name,
                photo: ss.speaker.photo,
                bio: ss.speaker.bio,
            })),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const authSession = await auth.api.getSession({ headers: await headers() })
        if (!authSession) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { id } = await params

        await prisma.talkSession.delete({ where: { id } })

        return NextResponse.json({ message: "Session supprimée" })
    } catch (err: unknown) {
        if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            (err as { code: string }).code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Session non trouvée" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}