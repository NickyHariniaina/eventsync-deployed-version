import Link from "next/link"
import { prisma } from "@/lib/prisma"

import DeleteButton from "./DeleteButton"


export default async function AdminSpeakersPage() {
    const speakers = await prisma.speaker.findMany({
        include: {
            _count: { select: { sessions: true } },
        },
        orderBy: { name: "asc" },
    })

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Intervenants</h1>
                <Link
                    href="/admin/speakers/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm text-center"
                >
                    + Nouvel intervenant
                </Link>
            </div>

            {speakers.length === 0 && (
                <p className="text-gray-500">Aucun intervenant pour l&apos;instant.</p>
            )}

            <ul className="space-y-2">
                {speakers.map((speaker: { id: string; name: string; photo: string | null; _count: { sessions: number } }) => (
                    <li
                        key={speaker.id}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border rounded-lg px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            {speaker.photo ? (
                                <img
                                    src={speaker.photo}
                                    alt={speaker.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                    {speaker.name[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-medium">{speaker.name}</p>
                                <p className="text-xs text-gray-400">
                                    {speaker._count.sessions} session
                                    {speaker._count.sessions !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>


                        <div className="flex gap-2">
                            <Link
                                href={`/admin/speakers/${speaker.id}`}
                                className="border px-3 py-1.5 rounded text-sm hover:bg-gray-100"
                            >
                                Modifier
                            </Link>
                            <DeleteButton id={speaker.id} name={speaker.name} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
