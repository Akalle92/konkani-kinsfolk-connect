import { BasicInfoFields } from "./BasicInfoFields";
import { RelationshipSelect } from "./RelationshipSelect";
import { PhotoUploadField } from "./PhotoUploadField";

interface MemberFormFieldsProps {
  newMember: {
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: string;
    birthPlace: string;
    gender: string;
    relationshipType: string;
    relatedMemberId: string;
  };
  onFieldChange: (field: string, value: string) => void;
  onPhotoUrlChange: (url: string) => void;
  existingMembers: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
}

export function MemberFormFields({
  newMember,
  onFieldChange,
  onPhotoUrlChange,
  existingMembers,
}: MemberFormFieldsProps) {
  return (
    <div className="space-y-4">
      <BasicInfoFields
        firstName={newMember.firstName}
        lastName={newMember.lastName}
        middleName={newMember.middleName}
        birthDate={newMember.birthDate}
        birthPlace={newMember.birthPlace}
        gender={newMember.gender}
        onFieldChange={onFieldChange}
      />
      <RelationshipSelect
        existingMembers={existingMembers}
        relationshipType={newMember.relationshipType}
        relatedMemberId={newMember.relatedMemberId}
        onRelationshipTypeChange={(value) =>
          onFieldChange("relationshipType", value)
        }
        onRelatedMemberChange={(value) =>
          onFieldChange("relatedMemberId", value)
        }
      />
      <PhotoUploadField onPhotoUrlChange={onPhotoUrlChange} />
    </div>
  );
}