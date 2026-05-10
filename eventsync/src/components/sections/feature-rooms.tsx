import { MapPin } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const mockRooms = [
  { id: "1", name: "Salle A", sessions: ["Kubernetes", "API Design"] },
  { id: "2", name: "Salle B", sessions: ["RSC", "Testing"] },
  { id: "3", name: "Salle C", sessions: ["CI/CD"] },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-medium text-rust">
      {children}
    </span>
  )
}

export function FeatureRooms() {
  return (
    <AnimatedSection>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-last lg:order-first space-y-3">
          {mockRooms.map((room, i) => (
            <div
              key={room.id}
              className="rounded-xl border border-border bg-background/60 p-4 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-4 text-rust" />
                <h3 className="font-semibold text-foreground">{room.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {room.sessions.map((s) => (
                  <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/60">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="order-first lg:order-last">
          <Badge>Salles</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Vue par salle
          </h2>
          <p className="mt-2 text-foreground/55">
            Visualisez les sessions organisées par salle pour vous repérer facilement sur place. Chaque salle affiche ses sessions avec leurs créneaux.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}
