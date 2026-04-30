import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

interface EventCardProps {
  id: string
  title: string
  startDate: Date
  endDate: Date
  location: string | null
  sessionCount: number
}

export function EventCard({
  id,
  title,
  startDate,
  endDate,
  location,
  sessionCount,
}: EventCardProps) {
  const isLive = new Date() >= startDate && new Date() <= endDate

  return (
    <Link href={`/events/${id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            {isLive && <Badge variant="destructive">Live</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(startDate)} — {formatDate(endDate)}
          </p>
        </CardHeader>
        <CardContent>
          {location && (
            <p className="text-sm text-muted-foreground">{location}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {sessionCount} session{sessionCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
