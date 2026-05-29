import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { corsHeaders, corsOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const speaker = await prisma.speaker.findUnique({
        where: { id },
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
            { status: 404, headers: corsHeaders(request) },
        )
    }

    return NextResponse.json(speaker, {
        headers: corsHeaders(request),
    })
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const body = await request.json()

    if (!body.name) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400, headers: corsHeaders(request) },
        )
    }

    const speaker = await prisma.speaker.update({
        where: { id },
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

    return NextResponse.json(speaker, {
        headers: corsHeaders(request),
    })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    await prisma.speaker.delete({
        where: { id },
    })

    return NextResponse.json(
        { message: "Intervenant supprimé" },
        { headers: corsHeaders(request) },
    )
}