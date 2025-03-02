
import React from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

export function EmptyGraphMessage() {
  return (
    <EmptyState
      title="No family members added yet"
      description="Add members using the button above to start building your family tree."
      icon={<Users className="w-12 h-12 opacity-70" />}
      className="h-full"
    />
  );
}
