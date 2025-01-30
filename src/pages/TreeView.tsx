import { useParams } from "react-router-dom";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { MembersList } from "@/components/family-tree/MembersList";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { OrgChart } from "@/components/family-tree/OrgChart";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TreeView = () => {
  const { id } = useParams();
  const { tree, members, relationships } = useTreeData(id);
  const { addMemberMutation } = useMemberMutations(id);
  const { addRelationshipMutation } = useRelationshipMutations(id);

  const handleAddMember = async (member: any) => {
    await addMemberMutation.mutateAsync(member);
  };

  const handleAddRelationship = async (relationship: {
    person1_id: string;
    person2_id: string;
    relationship_type: "parent" | "child" | "spouse" | "sibling";
  }) => {
    await addRelationshipMutation.mutateAsync(relationship);
  };

  if (!tree || !members) {
    return <div>Loading...</div>;
  }

  const graphNodes = members.map((member) => ({
    id: member.id,
    name: `${member.first_name} ${member.last_name}`,
    color: member.gender === "male" ? "#7CB9E8" : "#F4C2C2",
    photoUrl: member.photo_url,
  }));

  const graphLinks = relationships?.map((rel) => ({
    source: rel.person1_id,
    target: rel.person2_id,
    type: rel.relationship_type,
  })) || [];

  return (
    <div className="container mx-auto p-6">
      <TreeHeader
        treeName={tree.name}
        treeDescription={tree.description}
        members={members}
        onAddMember={handleAddMember}
        onAddRelationship={handleAddRelationship}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />

      <Tabs defaultValue="graph" className="mt-6">
        <TabsList>
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="org">Organization View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph" className="mt-4">
          <FamilyTreeGraph nodes={graphNodes} links={graphLinks} />
        </TabsContent>
        
        <TabsContent value="org" className="mt-4">
          <OrgChart members={members} relationships={relationships || []} />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <MembersList members={members} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreeView;