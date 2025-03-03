
import { Users } from "lucide-react";

export function EmptyMembersMessage() {
  return (
    <div className="mt-8 p-10 border border-dashed border-muted-foreground/30 rounded-lg text-center">
      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
      <h3 className="text-xl font-semibold mb-2">No Family Members Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start building your family tree by adding your first family member. Click the "Add Member" button above.
      </p>
    </div>
  );
}
