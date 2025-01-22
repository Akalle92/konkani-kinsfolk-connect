import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoFieldsProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  onFieldChange: (field: string, value: string) => void;
}

export function BasicInfoFields({
  firstName,
  lastName,
  birthDate,
  birthPlace,
  gender,
  onFieldChange,
}: BasicInfoFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFieldChange("firstName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => onFieldChange("lastName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => onFieldChange("birthDate", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="birthPlace">Birth Place</Label>
        <Input
          id="birthPlace"
          value={birthPlace}
          onChange={(e) => onFieldChange("birthPlace", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={gender}
          onValueChange={(value) => onFieldChange("gender", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}