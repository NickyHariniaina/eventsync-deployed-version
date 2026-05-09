"use client"

import { Users } from "lucide-react"
import Link from "next/link"

interface TimelineSessionCardProps {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  capacity: number | null
  roomName: string
  speakers: { id: string; name: string; photo: string | null }[]
  isLive?: boolean
}

const MONTHS_SHORT = [
  "JAN", "FÉV", "MAR", "AVR", "MAI", "JUN",
  "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC",
]

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

function formatDuration(start: Date, end: Date): string {
  const diff = end.getTime() - start.getTime()
  const min = Math.round(diff / 60000)
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h${m}` : `${h}h`
}

export function TimelineSessionCard({
  id,
  title,
  description,
  startTime,
  endTime,
  capacity,
  roomName,
  speakers,
  isLive,
}: TimelineSessionCardProps) {
  return (
    <div className="group relative flex gap-5 pb-8 last:pb-0">
      {/* Time badge */}
      <div className="flex w-16 shrink-0 flex-col items-center pt-0.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
          {MONTHS_SHORT[startTime.getMonth()]}
        </span>
        <span className="-mt-0.5 text-lg font-bold leading-none text-foreground">
          {startTime.getDate()}
        </span>
        <span className="mt-0.5 text-sm font-bold leading-none text-foreground">
          {formatTime(startTime)}
        </span>
        <span className="mt-0.5 text-[11px] text-foreground/40">
          {formatDuration(startTime, endTime)}
        </span>
      </div>

      {/* Dot + line */}
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={`z-10 size-3 rounded-full border-2 transition-all duration-300 ${
            isLive
              ? "border-primary bg-primary shadow-[0_0_8px] shadow-primary/60"
              : "border-border bg-background group-hover:border-primary/40"
          }`}
        />
        <div className="mt-0.5 h-full w-px bg-border" />
      </div>

      {/* Card */}
      <Link
        href={`/sessions/${id}`}
        className="flex-1 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground">
              {title}
              {isLive && (
                <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  Live
                </span>
              )}
            </h3>
            {description && (
              <p className="mt-1 line-clamp-1 text-sm text-foreground/60">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/55">
          <span>{roomName}</span>
          {speakers.length > 0 && (
            <>
              <span className="text-foreground/20">·</span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3" />
                {speakers.map((s) => s.name).join(", ")}
              </span>
            </>
          )}
          {capacity && (
            <>
              <span className="text-foreground/20">·</span>
              <span>Cap. {capacity}</span>
            </>
          )}
        </div>
      </Link>
    </div>
  )
}
