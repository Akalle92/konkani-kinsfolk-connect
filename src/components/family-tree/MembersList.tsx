import { Card } from "@/components/ui/card";

interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  birth_place: string | null;
  gender: string | null;
}

interface MembersListProps {
  members: FamilyMember[];
}

export function MembersList({ members }: MembersListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No family members added yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <Card
          key={member.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">
            {member.first_name} {member.last_name}
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
        </Card>
      ))}
    </div>
  );
}