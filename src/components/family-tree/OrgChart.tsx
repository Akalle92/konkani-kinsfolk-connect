import { Card } from "@/components/ui/card";

interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  birth_place: string | null;
  gender: string | null;
  photo_url: string | null;
}

interface OrgChartProps {
  members: FamilyMember[];
  relationships: Array<{
    person1_id: string;
    person2_id: string;
    relationship_type: string;
  }>;
}

export function OrgChart({ members, relationships }: OrgChartProps) {
  const buildHierarchy = (members: FamilyMember[], relationships: any[]) => {
    const hierarchy: { [key: string]: any } = {};
    
    // Find root nodes (members without parents)
    const childrenIds = new Set(
      relationships
        .filter((r) => r.relationship_type === "parent")
        .map((r) => r.person2_id)
    );
    
    const rootMembers = members.filter((m) => !childrenIds.has(m.id));
    
    // Build hierarchy for each root member
    rootMembers.forEach((member) => {
      hierarchy[member.id] = buildMemberHierarchy(member, members, relationships);
    });
    
    return hierarchy;
  };
  
  const buildMemberHierarchy = (
    member: FamilyMember,
    allMembers: FamilyMember[],
    relationships: any[]
  ) => {
    const children = relationships
      .filter(
        (r) =>
          r.relationship_type === "parent" && r.person1_id === member.id
      )
      .map((r) => {
        const childMember = allMembers.find((m) => m.id === r.person2_id);
        return childMember
          ? buildMemberHierarchy(childMember, allMembers, relationships)
          : null;
      })
      .filter(Boolean);
    
    return {
      member,
      children,
    };
  };

  const renderHierarchy = (hierarchy: any) => {
    return (
      <div className="flex flex-col items-center">
        <Card className="p-4 mb-4 w-64">
          <div className="flex items-center space-x-4">
            {hierarchy.member.photo_url && (
              <img
                src={hierarchy.member.photo_url}
                alt={`${hierarchy.member.first_name} ${hierarchy.member.last_name}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold">
                {hierarchy.member.first_name} {hierarchy.member.last_name}
              </h3>
              {hierarchy.member.birth_date && (
                <p className="text-sm text-gray-500">
                  Born: {new Date(hierarchy.member.birth_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Card>
        {hierarchy.children && hierarchy.children.length > 0 && (
          <div className="relative">
            <div className="absolute top-0 left-1/2 w-px h-8 bg-gray-300" />
            <div className="pt-8 flex gap-8">
              {hierarchy.children.map((child: any, index: number) => (
                <div key={child.member.id}>{renderHierarchy(child)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const hierarchy = buildHierarchy(members, relationships);

  return (
    <div className="p-8 overflow-x-auto">
      <div className="flex gap-8 justify-center">
        {Object.values(hierarchy).map((root: any) => renderHierarchy(root))}
      </div>
    </div>
  );
}