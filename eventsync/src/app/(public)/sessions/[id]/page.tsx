import { notFound } from "next/navigation"
import { SessionDetail } from "@/components/sessions/SessionDetail"
import { QASection } from "@/components/questions/QASection"

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
            <QASection
                sessionId={session.id}
                startTime={session.startTime}
                endTime={session.endTime}
                initialQuestions={session.questions ?? []}
            />
        </main>
    )
}