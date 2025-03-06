
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, Settings, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface TreeHeaderProps {
  treeName: string;
  treeDescription: string | null;
}

export function TreeHeader({ treeName, treeDescription }: TreeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/trees">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{treeName}</h1>
          <p className="text-muted-foreground text-sm">{treeDescription || 'No description'}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
    </div>
  );
}
