import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { name: "asc" },
        })

        return NextResponse.json(rooms, {
            headers: {
                "Content-Range": `rooms 0-${rooms.length}/${rooms.length}`,
                "Access-Control-Expose-Headers": "Content-Range",
            }
        })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers
    })
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    try {
        const body = await request.json()

        if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
            return NextResponse.json(
                { error: "Le nom de la salle est requis" },
                { status: 400 }
            )
        }

        const room = await prisma.room.create({
            data: { name: body.name.trim() },
        })

        return NextResponse.json(room, { status: 201 })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}