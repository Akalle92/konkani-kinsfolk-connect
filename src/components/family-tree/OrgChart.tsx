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

interface MemberNode {
  member: FamilyMember;
  children: MemberNode[];
  spouse?: FamilyMember;
  siblings?: FamilyMember[];
}

export function OrgChart({ members, relationships }: OrgChartProps) {
  const buildHierarchy = (members: FamilyMember[], relationships: any[]) => {
    const hierarchy: { [key: string]: MemberNode } = {};
    const processedMembers = new Set<string>();
    
    // Find all parent-child relationships
    const parentChildRelations = relationships.filter(
      (r) => r.relationship_type === "parent" || r.relationship_type === "child"
    );
    
    // Find all spouse relationships
    const spouseRelations = relationships.filter(
      (r) => r.relationship_type === "spouse"
    );
    
    // Find all sibling relationships
    const siblingRelations = relationships.filter(
      (r) => r.relationship_type === "sibling"
    );
    
    // Process parent-child relationships first
    parentChildRelations.forEach((relation) => {
      const parentId = relation.relationship_type === "parent" ? relation.person1_id : relation.person2_id;
      const childId = relation.relationship_type === "parent" ? relation.person2_id : relation.person1_id;
      
      const parent = members.find((m) => m.id === parentId);
      const child = members.find((m) => m.id === childId);
      
      if (parent && child) {
        if (!hierarchy[parentId]) {
          hierarchy[parentId] = {
            member: parent,
            children: [],
          };
        }
        
        if (!hierarchy[childId]) {
          hierarchy[childId] = {
            member: child,
            children: [],
          };
        }
        
        hierarchy[parentId].children.push(hierarchy[childId]);
        processedMembers.add(childId);
      }
    });
    
    // Process spouse relationships
    spouseRelations.forEach((relation) => {
      const spouse1 = members.find((m) => m.id === relation.person1_id);
      const spouse2 = members.find((m) => m.id === relation.person2_id);
      
      if (spouse1 && spouse2) {
        if (hierarchy[relation.person1_id]) {
          hierarchy[relation.person1_id].spouse = spouse2;
        }
        if (hierarchy[relation.person2_id]) {
          hierarchy[relation.person2_id].spouse = spouse1;
        }
      }
    });
    
    // Process sibling relationships
    siblingRelations.forEach((relation) => {
      const sibling1 = members.find((m) => m.id === relation.person1_id);
      const sibling2 = members.find((m) => m.id === relation.person2_id);
      
      if (sibling1 && sibling2) {
        if (hierarchy[relation.person1_id]) {
          hierarchy[relation.person1_id].siblings = [
            ...(hierarchy[relation.person1_id].siblings || []),
            sibling2,
          ];
        }
        if (hierarchy[relation.person2_id]) {
          hierarchy[relation.person2_id].siblings = [
            ...(hierarchy[relation.person2_id].siblings || []),
            sibling1,
          ];
        }
      }
    });
    
    // Return only root nodes (members without parents)
    return Object.values(hierarchy).filter(
      (node) => !processedMembers.has(node.member.id)
    );
  };

  const renderMember = (member: FamilyMember) => (
    <div className="flex items-center space-x-4">
      {member.photo_url && (
        <img
          src={member.photo_url}
          alt={`${member.first_name} ${member.last_name}`}
          className="w-12 h-12 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="font-semibold">
          {member.first_name} {member.last_name}
        </h3>
        {member.birth_date && (
          <p className="text-sm text-gray-500">
            Born: {new Date(member.birth_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );

  const renderHierarchy = (node: MemberNode) => {
    return (
      <div className="flex flex-col items-center">
        <Card className="p-4 mb-4 w-64">
          <div className="space-y-4">
            {renderMember(node.member)}
            {node.spouse && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500 mb-2">Spouse</p>
                {renderMember(node.spouse)}
              </div>
            )}
          </div>
        </Card>
        {(node.children.length > 0 || (node.siblings && node.siblings.length > 0)) && (
          <div className="relative">
            <div className="absolute top-0 left-1/2 w-px h-8 bg-gray-300" />
            <div className="pt-8">
              {node.children.length > 0 && (
                <div className="flex gap-8">
                  {node.children.map((child) => (
                    <div key={child.member.id}>{renderHierarchy(child)}</div>
                  ))}
                </div>
              )}
              {node.siblings && node.siblings.length > 0 && (
                <div className="flex gap-8 mt-8">
                  {node.siblings.map((sibling) => (
                    <Card key={sibling.id} className="p-4 w-64">
                      {renderMember(sibling)}
                    </Card>
                  ))}
                </div>
              )}
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
        {hierarchy.map((root) => (
          <div key={root.member.id}>{renderHierarchy(root)}</div>
        ))}
      </div>
    </div>
  );
}