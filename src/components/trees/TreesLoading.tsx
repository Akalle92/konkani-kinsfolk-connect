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

      {/* Tabs skeleton */}
      <div className="mb-6">
        <div className="border-b flex gap-4 pb-2">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      </div>

      {/* Family tree skeleton */}
      <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-white">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        
        {/* Center loading indicator */}
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-lg text-muted-foreground">Loading your family tree...</p>
          </div>
        </div>

        {/* Skeleton nodes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-24 w-48 rounded-lg mb-4" />
                <div className="w-px h-8 bg-gray-300" />
                <div className="flex gap-8 pt-8">
                  <Skeleton className="h-24 w-48 rounded-lg" />
                  <Skeleton className="h-24 w-48 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}