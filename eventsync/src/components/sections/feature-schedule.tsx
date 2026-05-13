import { AnimatedSection } from "./animated-section"

const mockSchedule = [
  { time: "09:00", track1: "Kubernetes", track2: "RSC", track3: "CI/CD" },
  { time: "10:30", track1: "API Design", track2: "Testing", track3: "Docker" },
  { time: "11:00", track1: "GraphQL", track2: "Next.js", track3: "Terraform" },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-medium text-rust">
      {children}
    </span>
  )
}

export function FeatureSchedule() {
  return (
    <AnimatedSection>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge>Planning</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Planning multi-track
          </h2>
          <p className="mt-2 text-foreground/55">
            Grille temporelle complète avec toutes les sessions simultanées, par salle et par créneau. Ne manquez aucune session grâce à une vue d&apos;ensemble claire.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-background/60">
          <div className="grid grid-cols-4 gap-px bg-border/50 text-xs">
            <div className="bg-background/80 p-2 font-semibold text-foreground">Horaire</div>
            <div className="bg-background/80 p-2 font-semibold text-foreground">Salle A</div>
            <div className="bg-background/80 p-2 font-semibold text-foreground">Salle B</div>
            <div className="bg-background/80 p-2 font-semibold text-foreground">Salle C</div>
            {mockSchedule.map((row) => (
              <div key={row.time} className="col-span-4 grid grid-cols-4 gap-px">
                <div className="flex items-center bg-background/60 p-2 text-foreground/60">{row.time}</div>
                <div className="bg-background/60 p-2 text-foreground">{row.track1}</div>
                <div className="bg-background/60 p-2 text-foreground">{row.track2}</div>
                <div className="bg-background/60 p-2 text-foreground">{row.track3}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
