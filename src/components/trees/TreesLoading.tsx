export function TreesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-lg text-muted-foreground">Loading your family trees...</p>
      </div>
    </div>
  );
}