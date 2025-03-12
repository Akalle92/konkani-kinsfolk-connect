
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { prepareGraphData } from "@/components/family-tree/utils/prepareGraphData";
import { MembersList } from "@/components/family-tree/MembersList";
import { TreeHeader } from "@/components/family-tree/components/TreeHeader";
import { EmptyTreeState } from "@/components/family-tree/components/EmptyTreeState";
import { TreeVisualTab } from "@/components/family-tree/components/TreeVisualTab";
import { TreeLoadingState } from "@/components/family-tree/components/TreeLoadingState";
import { TreeErrorState } from "@/components/family-tree/components/TreeErrorState";
import { TreeNotFoundState } from "@/components/family-tree/components/TreeNotFoundState";

const TreeView = () => {
  const { id } = useParams();
  const { userId, user } = useAuth();
  const [currentTab, setCurrentTab] = useState("visualization");
  const [currentUserMemberId, setCurrentUserMemberId] = useState<string | null>(null);
  
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
      const userEmailPrefix = user.primaryEmailAddress?.emailAddress?.split('@')[0] || '';
      
      const currentMember = members.find(member => 
        `${member.first_name}`.toLowerCase() === userEmailPrefix.toLowerCase() ||
        member.notes?.includes(user.primaryEmailAddress?.emailAddress || '')
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

  const handleAddRelationship = async (relationship: any) => {
    if (!id) return;
    try {
      await addRelationshipMutation.mutateAsync(relationship);
      toast.success("Relationship added successfully");
    } catch (error) {
      console.error("Error adding relationship:", error);
      toast.error("Failed to add relationship");
    }
  };
  
  const handleEditMember = (memberId: string) => {
    toast.info("Edit functionality coming soon");
  };
  
  const handleAddRelative = (memberId: string) => {
    toast.info("Add relative functionality coming soon");
  };

  if (isLoading) {
    return <TreeLoadingState />;
  }

  if (error) {
    console.error("Error loading tree:", error);
    return <TreeErrorState />;
  }

  if (!tree) {
    return <TreeNotFoundState />;
  }

  const hasMembers = Array.isArray(members) && members.length > 0;
  const graphData = prepareGraphData(members, relationships, currentUserMemberId);

  return (
    <div className="container mx-auto py-8 animate-page-enter">
      <TreeHeader 
        treeName={tree.name} 
        treeDescription={tree.description} 
      />

      {!hasMembers ? (
        <EmptyTreeState />
      ) : (
        <div className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="visualization">Tree Visualization</TabsTrigger>
              <TabsTrigger value="list">Member List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualization" className="mt-4">
              <TreeVisualTab 
                graphData={graphData}
                currentUserId={currentUserMemberId}
                treeDescription={tree.description}
                membersCount={members.length}
                relationshipsCount={relationships.length}
                createdAt={tree.created_at}
                updatedAt={tree.updated_at}
                onEditMember={handleEditMember}
                onAddRelative={handleAddRelative}
              />
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              <MembersList members={members} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default TreeView;
