
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        shimmer && "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      aria-hidden="true"
      aria-label="Loading"
      {...props}
    />
  )
}

function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton 
      className={cn("h-4 w-full", className)} 
      {...props} 
    />
  )
}

function SkeletonCircle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton 
      className={cn("h-10 w-10 rounded-full", className)} 
      {...props} 
    />
  )
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton 
      className={cn("h-40 w-full rounded-lg", className)} 
      {...props} 
    />
  )
}

export { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard }
