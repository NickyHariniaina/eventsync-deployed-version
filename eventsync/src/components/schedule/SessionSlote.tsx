import { isSessionLive } from "@/lib/utils"
import Link from "next/link"

type Speaker = {
  speaker: { id: string; name: string }
}

type Session = {
  id: string
  title: string
  startTime: Date
  endTime: Date
  room: { id: string; name: string }
  speakers: Speaker[]
}

export default function SessionSlot({ session }: { session: Session }) {
  const live = isSessionLive(new Date(session.startTime), new Date(session.endTime))

  return (
    <Link
      href={`/sessions/${session.id}`}
      className="block p-3 border rounded-lg hover:shadow-md transition bg-white"
    >
      {live && (
        <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded-full mb-2">
          Live
        </span>
      )}

      <p className="font-semibold text-sm">{session.title}</p>

      <p className="text-xs text-gray-400 mt-1">
        {new Date(session.startTime).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" → "}
        {new Date(session.endTime).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {session.speakers.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {session.speakers.map((s) => s.speaker.name).join(", ")}
        </p>
      )}
    </Link>
  )
}