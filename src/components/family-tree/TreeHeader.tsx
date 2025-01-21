import { Button } from "@/components/ui/button";
import { AddMemberDialog } from "./AddMemberDialog";
import { AddRelationshipDialog } from "./AddRelationshipDialog";

interface TreeHeaderProps {
  treeName: string;
  treeDescription?: string;
  members: any[];
  onAddMember: (member: any) => void;
  onAddRelationship: (relationship: any) => void;
  isAddingMember: boolean;
  isAddingRelationship: boolean;
}

export function TreeHeader({
  treeName,
  treeDescription,
  members,
  onAddMember,
  onAddRelationship,
  isAddingMember,
  isAddingRelationship,
}: TreeHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-playfair">{treeName}</h1>
        <p className="text-muted-foreground">{treeDescription}</p>
      </div>
      <div className="flex gap-2">
        <AddMemberDialog
          onAddMember={onAddMember}
          isLoading={isAddingMember}
        />
        {members && members.length >= 2 && (
          <AddRelationshipDialog
            members={members}
            onAddRelationship={onAddRelationship}
            isLoading={isAddingRelationship}
          />
        )}
      </div>
    </div>
  );
}