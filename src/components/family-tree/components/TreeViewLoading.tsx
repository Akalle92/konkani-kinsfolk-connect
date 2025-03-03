
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TreesLoading } from "@/components/trees/TreesLoading";

export function TreeViewLoading() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/trees')}
          className="mr-2"
          aria-label="Back to trees"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="w-3/4">
          <div className="h-8 bg-muted rounded animate-pulse mb-2 w-1/3"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
        </div>
      </div>
      <TreesLoading />
    </div>
  );
}
