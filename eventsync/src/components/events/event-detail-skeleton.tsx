import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EventDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-5 w-32 mb-6" />

      <div className="mb-8">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-9 w-2/3" />
        </div>
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-4" />
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      <div>
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">
                  <Skeleton className="h-5 w-3/4" />
                </CardTitle>
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}