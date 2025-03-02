
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RelationshipTypeSelector } from "./RelationshipTypeSelector";
import { FamilyMember } from "../types";

interface RelationshipFormProps {
  members: FamilyMember[];
  onAddRelationship: (relationship: {
    person1_id: string;
    person2_id: string;
    relationship_type: string;
    notes?: string;
  }) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function RelationshipForm({
  members,
  onAddRelationship,
  isLoading,
  onCancel,
}: RelationshipFormProps) {
  const { toast } = useToast();
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
  };

  return (
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
      
      <RelationshipTypeSelector 
        value={isCustomType ? "custom" : relationship.relationshipType}
        onValueChange={handleRelationshipTypeChange}
        isCustom={isCustomType}
        customValue={relationship.relationshipType}
        onCustomValueChange={handleCustomTypeChange}
      />
      
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          Add Relationship
        </Button>
      </div>
    </form>
  );
}
