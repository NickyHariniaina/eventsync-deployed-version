import { Calendar, MapPin, ChevronRight } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const mockEvents = [
  { id: "1", title: "Conférence DevOps 2026", date: "15-17 Juin", location: "Paris", tag: "À venir" },
  { id: "2", title: "Web3 Summit", date: "22-24 Juin", location: "Lyon", tag: "En cours" },
  { id: "3", title: "UX Design Days", date: "1-3 Juillet", location: "Marseille", tag: "À venir" },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-medium text-rust">
      {children}
    </span>
  )
}

export function FeatureEvents() {
  return (
    <AnimatedSection>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge>Événements</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Liste des événements
          </h2>
          <p className="mt-2 text-foreground/55">
            Parcourez tous les événements à venir, en cours et passés. Filtrez par statut, recherchez par titre ou lieu, et trouvez celui qui vous intéresse en un clic.
          </p>
        </div>
        <div className="space-y-3">
          {mockEvents.map((event, i) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-background/60 p-4 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      event.tag === "En cours"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-rust/10 text-rust"
                    }`}>
                      {event.tag}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-foreground/50">
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{event.location}</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-foreground/20 transition-all group-hover:translate-x-0.5 group-hover:text-foreground/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
