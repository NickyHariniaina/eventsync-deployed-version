import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">EventSync</h1>
        <p className="text-muted-foreground max-w-md">
          Real-time event management and participant engagement platform.
        </p>
        <Link
          href="/events"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Browse Events
        </Link>
      </div>
    </div>
  )
}
