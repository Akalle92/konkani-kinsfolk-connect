
import { TreePine, UserRoundPlus, FileUp, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <TreePine className="h-5 w-5" />
            <span>Create Family Tree</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <UserRoundPlus className="h-5 w-5" />
            <span>Add Family Member</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <FileUp className="h-5 w-5" />
            <span>Upload Documents</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <Newspaper className="h-5 w-5" />
            <span>Share Updates</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
