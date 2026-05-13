import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnimatedSection } from "./animated-section"

export function CtaSection() {
  return (
    <AnimatedSection>
      <div className="text-center">
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-background/40 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-foreground">
            Prêt à découvrir ?
          </h2>
          <p className="mt-2 text-sm text-foreground/55">
            Explorez les événements, sessions et intervenants en temps réel.
          </p>
          <Link
            href="/events"
            className="sunset-btn mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium text-white transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-[#a33b20]/30"
          >
            Commencer
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
}
