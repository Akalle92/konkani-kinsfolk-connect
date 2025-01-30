import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { MembersList } from "@/components/family-tree/MembersList";
import { OrgChart } from "@/components/family-tree/OrgChart";
import { Button } from "@/components/ui/button";

const TreeView = () => {
  const { id: treeId } = useParams();
  const navigate = useNavigate();
  const { tree, members, relationships } = useTreeData(treeId);
  const { addMemberMutation } = useMemberMutations(treeId);
  const { addRelationshipMutation } = useRelationshipMutations(treeId);

  const handleAddMember = async (memberData: any) => {
    const result = await addMemberMutation.mutateAsync({
      first_name: memberData.first_name,
      last_name: memberData.last_name,
      middle_name: memberData.middle_name,
      birth_date: memberData.birth_date,
      birth_place: memberData.birth_place,
      gender: memberData.gender,
      photo_url: memberData.photo_url,
    });

    if (memberData.relationshipType && memberData.relatedMemberId) {
      await addRelationshipMutation.mutateAsync({
        person1_id: memberData.relatedMemberId,
        person2_id: result.id,
        relationship_type: memberData.relationshipType,
      });
    }
  };

  const graphData = useMemo(() => {
    if (!members || !relationships) return { nodes: [], links: [] };

    const nodes = members.map((member) => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`.trim(),
      color: member.gender === "Male" 
        ? "#7393B3" 
        : member.gender === "Female" 
        ? "#E6A8D7" 
        : "#A9A9A9",
      photoUrl: member.photo_url,
    }));

    const links = relationships.map((rel) => ({
      source: rel.person1_id,
      target: rel.person2_id,
      type: rel.relationship_type,
    }));

    return { nodes, links };
  }, [members, relationships]);

  if (!tree) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-playfair mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate("/trees")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-playfair">{tree.name}</h1>
      </div>

      <TreeHeader
        treeName={tree.name}
        treeDescription={tree.description}
        members={members || []}
        onAddMember={handleAddMember}
        onAddRelationship={addRelationshipMutation.mutate}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />

      <div className="space-y-8">
        <FamilyTreeGraph nodes={graphData.nodes} links={graphData.links} />
        <OrgChart members={members || []} relationships={relationships || []} />
        <MembersList members={members || []} />
      </div>
    </div>
  );
};

export default TreeView;