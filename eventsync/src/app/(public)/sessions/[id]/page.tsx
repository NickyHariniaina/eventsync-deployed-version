import Link from "next/link"
import { notFound } from "next/navigation"
import { SessionDetail } from "@/components/sessions/SessionDetail"
import { QuestionList } from "@/components/questions/QuestionList"
import { isSessionLive } from "@/lib/utils"

type Props = {
    params: Promise<{ id: string }>
}

export default async function SessionPage({ params }: Props) {
    const { id } = await params

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sessions/${id}`,
        {
            cache: "no-store",
        }
    )

    if (res.status === 404) notFound()
    if (!res.ok) throw new Error("Erreur lors de la récupération de la session")

    const session = await res.json()
    const live = isSessionLive(session.startTime, session.endTime)

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <Link
                href={`/events/${session.eventId}`}
                className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Retour à l&apos;événement
            </Link>
            <SessionDetail session={session} />

            {live ? (
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold">Questions & Réponses</h2>
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
        </main>
    )
}