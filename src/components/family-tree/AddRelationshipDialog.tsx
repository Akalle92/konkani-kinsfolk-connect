
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StandardRelationshipType = "parent" | "child" | "spouse" | "sibling";

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
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [relationship, setRelationship] = useState({
    person1Id: "",
    person2Id: "",
    relationshipType: "",
    notes: "",
  });
  const [isCustomType, setIsCustomType] = useState(false);

  const handleRelationshipTypeChange = (value: string) => {
    if (value === "custom") {
      setIsCustomType(true);
      setRelationship({ ...relationship, relationshipType: "" });
    } else {
      setIsCustomType(false);
      setRelationship({ ...relationship, relationshipType: value });
    }
  };

  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelationship({ ...relationship, relationshipType: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship.person1Id || !relationship.person2Id || !relationship.relationshipType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
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

    // Map the relationship to the correct format with relationship_type
    onAddRelationship({
      person1_id: relationship.person1Id,
      person2_id: relationship.person2Id,
      relationship_type: relationship.relationshipType,
      notes: relationship.notes || undefined,
    });
    
    setIsOpen(false);
    setRelationship({
      person1Id: "",
      person2Id: "",
      relationshipType: "",
      notes: "",
    });
    setIsCustomType(false);
  };

  const isStandardType = (type: string): type is StandardRelationshipType => {
    return ["parent", "child", "spouse", "sibling"].includes(type);
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
              value={isCustomType ? "custom" : relationship.relationshipType}
              onValueChange={handleRelationshipTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
            
            {isCustomType && (
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Enter custom relationship type"
                  value={relationship.relationshipType}
                  onChange={handleCustomTypeChange}
                />
              </div>
            )}
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
          
          <div>
            <Label htmlFor="notes">Relationship Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add special details about this relationship"
              value={relationship.notes}
              onChange={(e) => setRelationship({ ...relationship, notes: e.target.value })}
              className="min-h-[80px]"
            />
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
