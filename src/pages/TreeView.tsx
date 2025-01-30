import { useParams } from "react-router-dom";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { MembersList } from "@/components/family-tree/MembersList";
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

      <Tabs defaultValue="org" className="mt-6">
        <TabsList>
          <TabsTrigger value="org">Tree View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
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