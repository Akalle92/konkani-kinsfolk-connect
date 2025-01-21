import { useState } from "react";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type RelationshipType = "parent" | "child" | "spouse" | "sibling";

interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
}

interface AddRelationshipDialogProps {
  members: FamilyMember[];
  onAddRelationship: (relationship: {
    person1Id: string;
    person2Id: string;
    type: RelationshipType;
  }) => void;
  isLoading: boolean;
}

export function AddRelationshipDialog({
  members,
  onAddRelationship,
  isLoading,
}: AddRelationshipDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [relationship, setRelationship] = useState({
    person1Id: "",
    person2Id: "",
    type: "" as RelationshipType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship.person1Id || !relationship.person2Id || !relationship.type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }
    if (relationship.person1Id === relationship.person2Id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot create a relationship between the same person",
      });
      return;
    }
    onAddRelationship(relationship);
    setIsOpen(false);
    setRelationship({
      person1Id: "",
      person2Id: "",
      type: "" as RelationshipType,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link className="mr-2 h-4 w-4" />
          Add Relationship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Relationship</DialogTitle>
          <DialogDescription>
            Create a relationship between two family members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="person1">First Person</Label>
            <Select
              value={relationship.person1Id}
              onValueChange={(value) =>
                setRelationship({ ...relationship, person1Id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a person" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="relationshipType">Relationship Type</Label>
            <Select
              value={relationship.type}
              onValueChange={(value: RelationshipType) =>
                setRelationship({ ...relationship, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="person2">Second Person</Label>
            <Select
              value={relationship.person2Id}
              onValueChange={(value) =>
                setRelationship({ ...relationship, person2Id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a person" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Add Relationship
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}