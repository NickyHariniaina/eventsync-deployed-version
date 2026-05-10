import { Clock } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const mockSessions = [
  { id: "1", title: "Introduction à Kubernetes", time: "09:00", room: "Salle A", speaker: "Marie Dubois" },
  { id: "2", title: "React Server Components", time: "10:30", room: "Salle B", speaker: "Thomas Petit" },
  { id: "3", title: "API Design Patterns", time: "11:00", room: "Salle A", speaker: "Sophie Martin" },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-medium text-rust">
      {children}
    </span>
  )
}

export function FeatureSessions() {
  return (
    <AnimatedSection>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-last lg:order-first space-y-3">
          {mockSessions.map((session, i) => (
            <div
              key={session.id}
              className="rounded-xl border border-border bg-background/60 p-4 transition-all duration-500 hover:border-rust/20"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500/60" />
                    <h3 className="font-semibold text-foreground">{session.title}</h3>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-foreground/50">
                    <span className="flex items-center gap-1"><Clock className="size-3" />{session.time}</span>
                    <span>{session.room}</span>
                    <span>{session.speaker}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-first lg:order-last">
          <Badge>Sessions</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Sessions en direct
          </h2>
          <p className="mt-2 text-foreground/55">
            Suivez chaque session avec des détails complets : description, créneaux horaires, intervenants et salle. Repérez les sessions en cours grâce aux indicateurs en direct.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}
