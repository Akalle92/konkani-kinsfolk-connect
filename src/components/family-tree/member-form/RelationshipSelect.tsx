import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
}

export function RelationshipSelect({
  existingMembers,
  relationshipType,
  relatedMemberId,
  onRelationshipTypeChange,
  onRelatedMemberChange,
}: RelationshipSelectProps) {
  if (!existingMembers || existingMembers.length === 0) return null;

  return (
    <>
      <div>
        <Label htmlFor="relationshipType">Relationship Type</Label>
        <Select value={relationshipType} onValueChange={onRelationshipTypeChange}>
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
    </>
  );
}