import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SpeakerProfile from "@/components/speakers/SpeakerProfile"

export default async function SpeakerPage({
                                              params,
                                          }: {
    params: Promise<{ id: string }>
}) {
    const {id} = await params
    const speaker = await prisma.speaker.findUnique({
        where: { id: id },
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
        notFound()
    }

    const sessions = speaker.sessions.map(({ session }) => ({
        id: session.id,
        title: session.title,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        room: session.room.name,
        eventTitle: session.event.title,
    }))

    return (
        <main className="container mx-auto px-4">
            <SpeakerProfile
                name={speaker.name}
                photo={speaker.photo}
                bio={speaker.bio}
                links={speaker.links}
                sessions={sessions}
            />
        </main>
    )
}
