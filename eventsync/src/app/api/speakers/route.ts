import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const speakers = await prisma.speaker.findMany({
        include: { links: true },
        orderBy: { name: "asc" },
    })

    return NextResponse.json(speakers)
}

export async function POST(request: NextRequest) {
    const body = await request.json()

    if (!body.name) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
        )
    }

    const speaker = await prisma.speaker.create({
        data: {
            name: body.name,
            photo: body.photo || null,
            bio: body.bio || null,
            links: {
                create: body.links || [],
            },
        },
        include: { links: true },
    })

    return NextResponse.json(speaker, { status: 201 })
}
