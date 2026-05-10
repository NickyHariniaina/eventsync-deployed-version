import { AnimatedSection } from "./animated-section"

const mockSpeakers = [
  { id: "1", name: "Marie Dubois", role: "DevOps Engineer", initials: "MD" },
  { id: "2", name: "Thomas Petit", role: "Frontend Lead", initials: "TP" },
  { id: "3", name: "Sophie Martin", role: "Backend Architect", initials: "SM" },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-medium text-rust">
      {children}
    </span>
  )
}

export function FeatureSpeakers() {
  return (
    <AnimatedSection>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge>Intervenants</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Intervenants
          </h2>
          <p className="mt-2 text-foreground/55">
            Découvrez les profils des speakers : photo, biographie et liste de leurs sessions. Cliquez sur un intervenant pour voir tous ses détails.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {mockSpeakers.map((speaker, i) => (
            <div
              key={speaker.id}
              className="flex flex-col items-center rounded-xl border border-border bg-background/60 p-4 text-center transition-all duration-500 hover:border-rust/20"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-rust/10 text-sm font-bold text-rust">
                {speaker.initials}
              </div>
              <p className="text-sm font-semibold text-foreground">{speaker.name}</p>
              <p className="text-[11px] text-foreground/45">{speaker.role}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
