export function StatsSection() {
  return (
    <div className="mx-auto mb-12 grid grid-cols-3 gap-6 text-center">
      {[
        { value: "10+", label: "Événements" },
        { value: "50+", label: "Sessions" },
        { value: "100+", label: "Participants" },
      ].map((stat) => (
        <div key={stat.label}>
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="mt-1 text-sm text-foreground/55">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
