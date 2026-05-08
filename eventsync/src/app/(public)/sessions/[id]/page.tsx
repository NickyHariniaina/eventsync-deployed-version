import { notFound } from "next/navigation"
import { SessionDetail } from "@/components/sessions/SessionDetail"

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

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <SessionDetail session={session} />

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