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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-lg text-muted-foreground">Loading family tree...</p>
          </div>
        </div>
      </div>
    </div>
  );
}