import { Star } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const mockFavorites = [
  { id: "1", title: "Introduction à Kubernetes", date: "16 Juin", time: "09:00" },
  { id: "2", title: "React Server Components", date: "16 Juin", time: "10:30" },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-medium text-rust">
      {children}
    </span>
  )
}

export function FeatureFavorites() {
  return (
    <AnimatedSection>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-last lg:order-first space-y-3">
          {mockFavorites.map((fav, i) => (
            <div
              key={fav.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-foreground">{fav.title}</h3>
                <p className="text-xs text-foreground/50">{fav.date} • {fav.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-first lg:order-last">
          <Badge>Favoris</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Favoris
          </h2>
          <p className="mt-2 text-foreground/55">
            Ajoutez vos sessions préférées à vos favoris pour ne rien manquer de votre programme. Accédez rapidement à votre sélection personnelle.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}
