import { isSessionLive } from "@/lib/utils"
import SessionSlot from "./SessionSlote"

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

type Props = {
  sessions: Session[]
}

export default function ScheduleGrid({ sessions }: Props) {

  const rooms = Array.from(
    new Map(sessions.map((s) => [s.room.id, s.room])).values()
  )

  const hours = Array.from(
    new Set(
      sessions.map((s) =>
        new Date(s.startTime).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    )
  ).sort()

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `80px repeat(${rooms.length}, minmax(180px, 1fr))`,
          minWidth: `${80 + rooms.length * 180}px`,
        }}
      >
        <div />
        {rooms.map((room) => (
          <div
            key={room.id}
            className="text-center font-semibold text-sm py-3 border-b"
          >
            {room.name}
          </div>
        ))}

        {hours.map((hour) => (
          <>
            <div
              key={hour}
              className="text-right text-sm text-gray-400 pr-3 pt-3 border-r"
            >
              {hour}
            </div>

            {rooms.map((room) => {
              const session = sessions.find(
                (s) =>
                  s.room.id === room.id &&
                  new Date(s.startTime).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) === hour
              )

              return session ? (
                <SessionSlot key={session.id} session={session} />
              ) : (
                <div key={`empty-${room.id}-${hour}`} />
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}