
import { useState } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RelationshipForm } from "./relationship-form/RelationshipForm";

interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
}

interface AddRelationshipDialogProps {
  members: FamilyMember[];
  onAddRelationship: (relationship: {
    person1_id: string;
    person2_id: string;
    relationship_type: string;
    notes?: string;
  }) => void;
  isLoading: boolean;
}

export function AddRelationshipDialog({
  members,
  onAddRelationship,
  isLoading,
}: AddRelationshipDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddRelationship = (relationship: {
    person1_id: string;
    person2_id: string;
    relationship_type: string;
    notes?: string;
  }) => {
    onAddRelationship(relationship);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link className="mr-2 h-4 w-4" />
          Add Relationship
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Relationship</DialogTitle>
          <DialogDescription>
            Create a relationship between two family members.
          </DialogDescription>
        </DialogHeader>
        <RelationshipForm
          members={members}
          onAddRelationship={handleAddRelationship}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
