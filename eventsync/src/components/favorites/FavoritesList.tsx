"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, MapPin, Users, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { isSessionLive } from "@/lib/utils"

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

type Speaker = {
  id: string
  name: string
  photo: string | null
}

type Session = {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  capacity: number | null
  roomName: string
  speakers: Speaker[]
}

const FAVORITES_KEY = "favorites"

function getFavorites(): string[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
}

function SessionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}

export default function FavoritesList() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFavoriteIds(getFavorites())
  }, [])

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setLoading(false)
      return
    }

    setError(null)
    setLoading(true)

    fetch("/api/sessions")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement")
        return res.json()
      })
      .then((all: Session[]) => {
        setSessions(all.filter((s) => favoriteIds.includes(s.id)))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [favoriteIds])

  function removeFavorite(id: string) {
    const updated = favoriteIds.filter((fid) => fid !== id)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    setFavoriteIds(updated)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <SessionSkeleton />
        <SessionSkeleton />
        <SessionSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700 mb-3">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            setFavoriteIds(getFavorites())
          }}
        >
          Reessayer
        </Button>
      </div>
    )
  }

  if (favoriteIds.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          Vous n&apos;avez pas encore de favoris
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Ajoutez des sessions a vos favoris pour les retrouver ici
        </p>
        <Button asChild>
          <Link href="/events">Voir les evenements</Link>
        </Button>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          Ces sessions ne sont plus disponibles
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Les sessions que vous aviez ajoutees ont peut-etre ete supprimees
        </p>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify([]))
            setFavoriteIds([])
          }}
        >
          Effacer mes favoris
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const live = isSessionLive(session.startTime, session.endTime)
        return (
          <Card key={session.id}>
            <div className="flex items-start justify-between gap-4 p-4">
              <Link
                href={`/sessions/${session.id}`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base truncate">
                    {session.title}
                  </h3>
                  {live && <Badge variant="destructive">Live</Badge>}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {formatTime(new Date(session.startTime))} &mdash;{" "}
                    {formatTime(new Date(session.endTime))}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {session.roomName}
                  </span>
                </div>
                {session.speakers.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {session.speakers.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                )}
              </Link>
              <button
                onClick={() => removeFavorite(session.id)}
                className="shrink-0 p-2 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Retirer des favoris"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
