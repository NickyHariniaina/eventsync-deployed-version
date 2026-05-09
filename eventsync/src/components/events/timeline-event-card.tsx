"use client"

import { MapPin } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface TimelineEventCardProps {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  location: string | null
  sessionCount: number
}

const MONTHS = [
  "JAN", "FÉV", "MAR", "AVR", "MAI", "JUN",
  "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC",
]

export function TimelineEventCard({
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  sessionCount,
}: TimelineEventCardProps) {
  const now = new Date()
  const isLive = now >= startDate && now <= endDate
  const isPast = now > endDate

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  const duration = days <= 1 ? "1 jour" : `${days + 1} jours`

  return (
    <div className="group relative flex gap-5 pb-10 last:pb-0">
      {/* Date badge */}
      <div className="flex w-16 shrink-0 flex-col items-center pt-1">
        <span className="text-sm font-semibold uppercase tracking-wide text-foreground/55">
          {MONTHS[startDate.getMonth()]}
        </span>
        <span className="-mt-0.5 text-3xl font-bold leading-none text-foreground">
          {startDate.getDate()}
        </span>
      </div>

      {/* Dot + line */}
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={`z-10 size-3.5 rounded-full border-2 transition-all duration-300 ${
            isLive
              ? "border-primary bg-primary shadow-[0_0_10px] shadow-primary/60"
              : isPast
                ? "border-muted-foreground/30 bg-muted"
                : "border-primary bg-background group-hover:bg-primary/20"
          }`}
        />
        <div className="mt-0.5 h-full w-px bg-border" />
      </div>

      {/* Card */}
      <Link
        href={`/events/${id}`}
        className={`flex-1 rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
          isLive
            ? "border-primary/40 hover:border-primary"
            : "border-border hover:border-primary/30"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {title}
              {isLive && (
                <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  Live
                </span>
              )}
            </h3>
            {description && (
              <p className="mt-1 line-clamp-1 text-sm text-foreground/65">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/60">
          <span>
            {formatDate(startDate)} — {formatDate(endDate)}
          </span>
          <span className="text-foreground/20">·</span>
          <span>{duration}</span>
          {location && (
            <>
              <span className="text-foreground/20">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {location}
              </span>
            </>
          )}
          <span className="text-foreground/20">·</span>
          <span>
            {sessionCount} session{sessionCount !== 1 ? "s" : ""}
          </span>
        </div>
      </Link>
    </div>
  )
}
