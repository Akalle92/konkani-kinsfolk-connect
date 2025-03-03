
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TreeHeader } from "@/components/family-tree/TreeHeader";

interface TreeViewHeaderProps {
  treeId: string | undefined;
  treeName: string;
  treeDescription: string;
  members: any[];
  onAddMember: (member: any) => Promise<void>;
  onAddRelationship: (relationship: any) => Promise<void>;
  isAddingMember: boolean;
  isAddingRelationship: boolean;
}

export function TreeViewHeader({
  treeId,
  treeName,
  treeDescription,
  members,
  onAddMember,
  onAddRelationship,
  isAddingMember,
  isAddingRelationship
}: TreeViewHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/trees')}
          className="mb-2"
          aria-label="Back to trees"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Trees
        </Button>
      </div>
      
      <TreeHeader
        treeName={treeName}
        treeDescription={treeDescription}
        members={members}
        onAddMember={onAddMember}
        onAddRelationship={onAddRelationship}
        isAddingMember={isAddingMember}
        isAddingRelationship={isAddingRelationship}
      />
    </>
  );
}
