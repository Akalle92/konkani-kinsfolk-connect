
import { Skeleton } from "@/components/ui/skeleton";

export function TreesLoading() {
  return (
    <div className="container mx-auto py-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mt-6">
        <Skeleton className="h-8 w-60 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
