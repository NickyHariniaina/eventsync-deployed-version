import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { corsHeaders, corsOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}

export async function GET(request: NextRequest) {
    const speakers = await prisma.speaker.findMany({
        include: { links: true },
        orderBy: { name: "asc" },
    })

    return NextResponse.json(speakers, {
        headers: {
            ...corsHeaders(request),
            "Content-Range": `speakers 0-${speakers.length}/${speakers.length}`,
        }
    })
}

export async function POST(request: NextRequest) {
    const body = await request.json()

    if (!body.name) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400, headers: corsHeaders(request) },
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

    return NextResponse.json(
        speaker,
        { status: 201, headers: corsHeaders(request) },
    )
}
