
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function EmptyTreeState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Family Members Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your family tree by adding your first family member.
        </p>
        <Button>Add Family Member</Button>
      </CardContent>
    </Card>
  );
}
