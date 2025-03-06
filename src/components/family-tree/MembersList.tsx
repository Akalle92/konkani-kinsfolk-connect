
import { Card } from "@/components/ui/card";
import { FamilyMember } from "./types";

interface MembersListProps {
  members: FamilyMember[];
}

export function MembersList({ members }: MembersListProps) {
  // Safety check to ensure members is an array
  const validMembers = Array.isArray(members) ? members : [];
  
  if (validMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No family members added yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {validMembers.map((member) => (
        <Card
          key={member.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">
            {member.first_name}
            {member.middle_name && ` ${member.middle_name}`} {member.last_name}
          </h3>
          {member.birth_date && (
            <p className="text-sm text-gray-600">
              Born: {new Date(member.birth_date).toLocaleDateString()}
            </p>
          )}
          {member.birth_place && (
            <p className="text-sm text-gray-600">
              Place of Birth: {member.birth_place}
            </p>
          )}
          {member.gender && (
            <p className="text-sm text-gray-600">Gender: {member.gender}</p>
          )}
          {member.death_date && (
            <p className="text-sm text-gray-600">
              Died: {new Date(member.death_date).toLocaleDateString()}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
