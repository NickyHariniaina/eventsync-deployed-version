import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    const speaker = await prisma.speaker.findUnique({
        where: { id: params.id },
        include: {
            links: true,
            sessions: {
                include: {
                    session: {
                        include: {
                            room: true,
                            event: true,
                        },
                    },
                },
            },
        },
    })

    if (!speaker) {
        return NextResponse.json(
            { error: "Speaker not found" },
            { status: 404 }
        )
    }

    return NextResponse.json(speaker)
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await request.json()

    if (!body.name) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
        )
    }

    const speaker = await prisma.speaker.update({
        where: { id: params.id },
        data: {
            name: body.name,
            photo: body.photo || null,
            bio: body.bio || null,
            links: {
                deleteMany: {},
                create: body.links || [],
            },
        },
        include: { links: true },
    })

    return NextResponse.json(speaker)
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    await prisma.speaker.delete({
        where: { id: params.id },
    })

    return NextResponse.json({ message: "Intervenant supprimé" })
}