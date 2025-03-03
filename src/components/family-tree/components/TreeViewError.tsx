
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TreesError } from "@/components/trees/TreesError";

export function TreeViewError() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/trees')}
        className="mb-6"
        aria-label="Back to trees"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Trees
      </Button>
      <TreesError />
    </div>
  );
}
