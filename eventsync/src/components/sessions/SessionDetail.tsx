import Link from "next/link"
import { LiveBadge } from "./LiveBadge"
import { isSessionLive } from "@/lib/utils"
import FavoriteButton from "@/components/favorites/FavoriteButton"

type Speaker = {
    id: string
    name: string
    photo: string | null
    bio: string | null
}

type Session = {
    id: string
    title: string
    description: string | null
    startTime: Date | string
    endTime: Date | string
    capacity: number | null
    roomId: string
    roomName: string
    speakers: Speaker[]
}

type Props = {
    session: Session
}

export function SessionDetail({ session }: Props) {
    const live = isSessionLive(session.startTime, session.endTime)

    return (
        <div>
            <div className="mb-6 flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold">{session.title}</h1>
                <div className="flex items-center gap-2 shrink-0">
                    <FavoriteButton sessionId={session.id} />
                    <LiveBadge isLive={live} />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                    🕐{" "}
                    {new Date(session.startTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(session.endTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
                <span>📍 {session.roomName}</span>
                {session.capacity && (
                    <span>👥 Capacité : {session.capacity}</span>
                )}
            </div>

            {session.description && (
                <p className="mb-8 text-gray-700">{session.description}</p>
            )}

            {session.speakers.length > 0 && (
                <section className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">Intervenants</h2>
                    <div className="flex flex-wrap gap-4">
                        {session.speakers.map((speaker) => (
                            <Link
                                key={speaker.id}
                                href={`/speakers/${speaker.id}`}
                                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                            >
                                {speaker.photo ? (
                                    <img
                                        src={speaker.photo}
                                        alt={speaker.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                                        {speaker.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="font-medium">{speaker.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}