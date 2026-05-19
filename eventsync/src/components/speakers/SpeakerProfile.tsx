import Link from "next/link"
import FavoriteButton from "@/components/speakers/FavoriteButton"

type SessionProp = {
    id: string
    title: string
    startTime: string
    endTime: string
    room: string
    eventTitle: string
}

type Link = { id: string; label: string; url: string }

type Props = {
    name: string
    photo: string | null
    bio: string | null
    links: Link[]
    sessions: SessionProp[]
}

export default function SpeakerProfile({ name, photo, bio, links, sessions }: Props) {
    const now = new Date()

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-6">

            <div className="flex items-center gap-4">
                {photo ? (
                    <img
                        src={photo}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                        {name[0].toUpperCase()}
                    </div>
                )}
                <h1 className="text-2xl font-bold">{name}</h1>
            </div>

            {bio && (
                <div>
                    <h2 className="font-semibold text-lg mb-1">Biographie</h2>
                    <p className="text-gray-600">{bio}</p>
                </div>
            )}

            {links.length > 0 && (
                <div>
                    <h2 className="font-semibold text-lg mb-2">Liens</h2>
                    <div className="flex flex-wrap gap-2">
                        {links.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border rounded-full px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {sessions.length > 0 && (
                <div>
                    <h2 className="font-semibold text-lg mb-2">Sessions</h2>
                    <ul className="space-y-2">
                        {sessions.map((session) => {
                            const start = new Date(session.startTime)
                            const end = new Date(session.endTime)
                            const isLive = now >= start && now <= end

                            return (
                                <li key={session.id}>
                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <Link
                                                href={`/sessions/${session.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {session.title}
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                {isLive && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                        Live
                                                    </span>
                                                )}


                                                <FavoriteButton sessionId={session.id} />
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            {session.eventTitle} · {session.room}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {start.toLocaleString("fr-FR")}
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
