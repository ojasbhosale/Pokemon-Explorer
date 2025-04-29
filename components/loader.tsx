import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LoaderProps {
  count?: number
}

export function Loader({ count = 12 }: LoaderProps) {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 bg-muted/50 flex items-center justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
