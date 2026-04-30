import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface SessionCardProps {
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

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

export function SessionCard({
  id,
  title,
  description,
  startTime,
  endTime,
  capacity,
  roomName,
  speakers,
  isLive,
}: SessionCardProps) {
  return (
    <Link href={`/sessions/${id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:ring-1 hover:ring-foreground/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {isLive && <Badge variant="destructive">Live</Badge>}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatTime(startTime)} — {formatTime(endTime)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {roomName}
            </span>
          </div>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </CardContent>
        )}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            {speakers.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {speakers.map((s) => s.name).join(", ")}
                </span>
              </div>
            )}
            {capacity && (
              <span className="text-xs text-muted-foreground">
                Cap. {capacity}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
