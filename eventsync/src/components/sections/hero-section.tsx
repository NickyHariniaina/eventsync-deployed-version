import Link from "next/link"
import { HeroText } from "@/components/hero-text"
import { Sparkles, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 text-center max-w-2xl">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-foreground/55 backdrop-blur-sm">
        <Sparkles className="size-3.5 text-rust" />
        Plateforme de gestion d&apos;événements temps réel
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        EventSync
      </h1>
      <div className="text-lg text-foreground max-w-lg h-14 sm:h-10">
        <HeroText />
      </div>
      <Link
        href="/events"
        className="sunset-btn inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium text-white transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-[#a33b20]/30"
      >
        Explorer les événements
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
