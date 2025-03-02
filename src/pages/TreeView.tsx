
import { useParams } from "react-router-dom";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { MembersList } from "@/components/family-tree/MembersList";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TreesLoading } from "@/components/trees/TreesLoading";
import { TreesError } from "@/components/trees/TreesError";

const TreeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  console.log("TreeView rendered with id:", id);
  
  const { tree, members, relationships, isLoading, error } = useTreeData(id);
  const { addMemberMutation } = useMemberMutations(id);
  const { addRelationshipMutation } = useRelationshipMutations(id);

  console.log("TreeView data:", { tree, members, relationships, isLoading, error });

  const handleAddMember = async (member: any) => {
    if (!id) return;
    await addMemberMutation.mutateAsync(member);
  };

  const handleAddRelationship = async (relationship: any) => {
    if (!id) return;
    await addRelationshipMutation.mutateAsync(relationship);
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    console.log("TreeView is loading");
    return <TreesLoading />;
  }

  if (error) {
    console.error("Error loading tree:", error);
    return <TreesError />;
  }

  if (!tree || !members) {
    console.log("Tree or members data missing:", { tree, members });
    return <TreesError />;
  }

  console.log("Rendering TreeView with data:", {
    treeName: tree.name,
    memberCount: members.length,
    relationshipCount: relationships?.length
  });

  return (
    <div className="container mx-auto py-8">
      <TreeHeader
        treeName={tree.name}
        treeDescription={tree.description || ""}
        members={members}
        onAddMember={handleAddMember}
        onAddRelationship={handleAddRelationship}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
        <MembersList members={members} />
      </div>
    </div>
  );
};

export default TreeView;
