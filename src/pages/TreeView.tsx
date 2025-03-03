
import { useParams, useNavigate } from "react-router-dom";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { useAuth } from "@/contexts/auth/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TreeViewHeader } from "@/components/family-tree/components/TreeViewHeader";
import { TreeViewTabs } from "@/components/family-tree/components/TreeViewTabs";
import { EmptyMembersMessage } from "@/components/family-tree/components/EmptyMembersMessage";
import { TreeViewLoading } from "@/components/family-tree/components/TreeViewLoading";
import { TreeViewError } from "@/components/family-tree/components/TreeViewError";

type RelationshipData = {
  person1_id: string;
  person2_id: string;
  relationship_type: string;
  notes?: string;
};

const TreeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentUserMemberId, setCurrentUserMemberId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      toast("Authentication required", {
        description: "Please sign in to view family trees",
      });
    }
  }, [user, navigate]);

  console.log("TreeView rendered with id:", id);
  
  const { tree, members, relationships, isLoading, error } = useTreeData(id);
  const { addMemberMutation } = useMemberMutations(id);
  const { addRelationshipMutation } = useRelationshipMutations(id);

  console.log("TreeView data:", { 
    tree, 
    members: members && members.length, 
    relationships: relationships && relationships.length, 
    isLoading, 
    error: error ? 'Error fetching data' : null 
  });

  useEffect(() => {
    if (user && members && members.length > 0) {
      const userEmailPrefix = user.email?.split('@')[0] || '';
      
      const currentMember = members.find(member => 
        `${member.first_name}`.toLowerCase() === userEmailPrefix.toLowerCase() ||
        member.notes?.includes(user.email || '')
      );
      
      if (currentMember) {
        console.log("Current user found in family tree:", currentMember.id);
        setCurrentUserMemberId(currentMember.id);
      } else {
        console.log("Current user not found in this family tree");
        setCurrentUserMemberId(null);
      }
    }
  }, [user, members]);

  const handleAddMember = async (member: any) => {
    if (!id) return;
    try {
      await addMemberMutation.mutateAsync(member);
      toast.success("Family member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add family member");
    }
  };

  const handleAddRelationship = async (relationship: RelationshipData) => {
    if (!id) return;
    try {
      await addRelationshipMutation.mutateAsync({
        person1_id: relationship.person1_id,
        person2_id: relationship.person2_id,
        relationship_type: relationship.relationship_type,
        notes: relationship.notes
      });
      toast.success("Relationship added successfully");
    } catch (error) {
      console.error("Error adding relationship:", error);
      toast.error("Failed to add relationship");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="border rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view this family tree.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log("TreeView is loading");
    return <TreeViewLoading />;
  }

  if (error) {
    console.error("Error loading tree:", error);
    return <TreeViewError />;
  }

  if (!tree) {
    console.log("Tree data missing");
    return (
      <div className="container mx-auto p-6">
        <div className="border rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Tree Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested family tree could not be found.</p>
        </div>
      </div>
    );
  }

  console.log("Rendering TreeView with data:", {
    treeName: tree.name,
    memberCount: members?.length || 0,
    relationshipCount: relationships?.length || 0,
    currentUserMemberId
  });

  const hasMembers = members && members.length > 0;

  return (
    <div className="container mx-auto py-8 animate-page-enter">
      <TreeViewHeader 
        treeId={id}
        treeName={tree.name}
        treeDescription={tree.description || ""}
        members={members || []}
        onAddMember={handleAddMember}
        onAddRelationship={handleAddRelationship}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />

      {!hasMembers ? (
        <EmptyMembersMessage />
      ) : (
        <TreeViewTabs 
          members={members || []}
          relationships={relationships || []}
          currentUserMemberId={currentUserMemberId}
          isAddingMember={addMemberMutation.isPending}
          isAddingRelationship={addRelationshipMutation.isPending}
        />
      )}
    </div>
  );
};

export default TreeView;
