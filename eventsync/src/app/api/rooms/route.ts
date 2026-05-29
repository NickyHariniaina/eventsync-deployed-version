import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { corsHeaders, corsOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}

export async function GET(request: NextRequest) {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { name: "asc" },
        })

        return NextResponse.json(rooms, {
            headers: {
                ...corsHeaders(request),
                "Content-Range": `rooms 0-${rooms.length}/${rooms.length}`,
            }
        })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: corsHeaders(request) },
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

        if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
            return NextResponse.json(
                { error: "Le nom de la salle est requis" },
                { status: 400, headers: corsHeaders(request) },
            )
        }

        const room = await prisma.room.create({
            data: { name: body.name.trim() },
        })

        return NextResponse.json(room,
            { status: 201, headers: corsHeaders(request) },
        )
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: corsHeaders(request) },
        )
    }
}
