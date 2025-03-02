
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STANDARD_RELATIONSHIP_TYPES } from "../utils/relationship-constants";

interface RelationshipTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  isCustom: boolean;
  customValue: string;
  onCustomValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RelationshipTypeSelector({
  value,
  onValueChange,
  isCustom,
  customValue,
  onCustomValueChange,
}: RelationshipTypeSelectorProps) {
  return (
    <div>
      <Label htmlFor="relationshipType">Relationship Type</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select relationship type" />
        </SelectTrigger>
        <SelectContent>
          {STANDARD_RELATIONSHIP_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom...</SelectItem>
        </SelectContent>
      </Select>
      
      {isCustom && (
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Enter custom relationship type"
            value={customValue}
            onChange={onCustomValueChange}
          />
        </div>
      )}
    </div>
  );
}
