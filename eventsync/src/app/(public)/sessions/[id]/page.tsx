import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SessionDetail } from "@/components/sessions/SessionDetail"

type Props = {
    params: Promise<{ id: string }>
}

export default async function SessionPage({ params }: Props) {
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

    if (!session) notFound()

    const sessionData = {
        id: session.id,
        title: session.title,
        description: session.description,
        startTime: session.startTime,
        endTime: session.endTime,
        capacity: session.capacity,
        roomId: session.roomId,
        roomName: session.room.name,
        speakers: session.speakers.map((ss) => ({
            id: ss.speaker.id,
            name: ss.speaker.name,
            photo: ss.speaker.photo,
            bio: ss.speaker.bio,
        })),
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <SessionDetail session={sessionData} />

            {/*
                TODO Personne D — brancher ici quand feat/questions est mergé :

                import { isSessionLive } from "@/lib/utils"
                import { QuestionForm } from "@/components/questions/QuestionForm"
                import { QuestionList } from "@/components/questions/QuestionList"

                const live = isSessionLive(session.startTime, session.endTime)

                {live ? (
                    <section className="mt-8">
                        <h2 className="mb-4 text-xl font-semibold">Questions & Réponses</h2>
                        <QuestionForm sessionId={session.id} />
                        <QuestionList
                            initialQuestions={session.questions}
                            sessionId={session.id}
                        />
                    </section>
                ) : (
                    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                        {new Date() < new Date(session.startTime)
                            ? "Les questions seront disponibles quand la session commence."
                            : "Cette session est terminée."}
                    </div>
                )}
            */}
        </main>
    )
}