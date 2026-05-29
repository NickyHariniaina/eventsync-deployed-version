import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SpeakerForm from "../SpeakerForm"

export default async function EditSpeakerPage({
                                                  params,
                                              }: {
    params: { id: string }
}) {
    const speaker = await prisma.speaker.findUnique({
        where: { id: params.id },
        include: { links: true },
    })

    if (!speaker) {
        notFound()
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Modifier — {speaker.name}</h1>
            <SpeakerForm
                initialData={{
                    id: speaker.id,
                    name: speaker.name,
                    photo: speaker.photo,
                    bio: speaker.bio,
                    links: speaker.links.map((l: { label: string; url: string }) => ({ label: l.label, url: l.url })),
                }}
            />
        </div>
    )
}
