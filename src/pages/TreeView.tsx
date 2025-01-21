import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { MembersList } from "@/components/family-tree/MembersList";

const TreeView = () => {
  const { id: treeId } = useParams();
  const { tree, members, relationships } = useTreeData(treeId);
  const { addMemberMutation } = useMemberMutations(treeId);
  const { addRelationshipMutation } = useRelationshipMutations(treeId);

  // Prepare graph data
  const graphData = useMemo(() => {
    if (!members || !relationships) return { nodes: [], links: [] };

    const nodes = members.map((member) => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      color:
        member.gender === "Male"
          ? "#7393B3"
          : member.gender === "Female"
          ? "#E6A8D7"
          : "#A9A9A9",
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
      <TreeHeader
        treeName={tree.name}
        treeDescription={tree.description}
        members={members || []}
        onAddMember={addMemberMutation.mutate}
        onAddRelationship={addRelationshipMutation.mutate}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />
      <FamilyTreeGraph nodes={graphData.nodes} links={graphData.links} />
      <MembersList members={members || []} />
    </div>
  );
};

export default TreeView;