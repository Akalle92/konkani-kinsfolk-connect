
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RelationshipSelectProps {
  existingMembers: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
  relationshipType: string;
  relatedMemberId: string;
  onRelationshipTypeChange: (value: string) => void;
  onRelatedMemberChange: (value: string) => void;
  relationshipNote?: string;
  onRelationshipNoteChange?: (value: string) => void;
}

export function RelationshipSelect({
  existingMembers,
  relationshipType,
  relatedMemberId,
  onRelationshipTypeChange,
  onRelatedMemberChange,
  relationshipNote = "",
  onRelationshipNoteChange,
}: RelationshipSelectProps) {
  const [isCustomType, setIsCustomType] = useState(
    !["parent", "child", "spouse", "sibling"].includes(relationshipType) && relationshipType !== ""
  );

  const handleRelationshipTypeChange = (value: string) => {
    if (value === "custom") {
      setIsCustomType(true);
      // Don't update the actual relationship type yet - wait for custom input
    } else {
      setIsCustomType(false);
      onRelationshipTypeChange(value);
    }
  };

  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRelationshipTypeChange(e.target.value);
  };

  if (!existingMembers || existingMembers.length === 0) return null;

  return (
    <>
      <div>
        <Label htmlFor="relationshipType">Relationship Type</Label>
        <Select 
          value={isCustomType ? "custom" : relationshipType} 
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
              value={relationshipType}
              onChange={handleCustomTypeChange}
            />
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="relatedMember">Related To</Label>
        <Select value={relatedMemberId} onValueChange={onRelatedMemberChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select family member" />
          </SelectTrigger>
          <SelectContent>
            {existingMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {onRelationshipNoteChange && (
        <div className="mt-2">
          <Label htmlFor="relationshipNote">Relationship Note (Optional)</Label>
          <Input
            type="text"
            id="relationshipNote"
            placeholder="Add special details about this relationship"
            value={relationshipNote}
            onChange={(e) => onRelationshipNoteChange(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
