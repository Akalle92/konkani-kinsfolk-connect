
import { useParams } from "react-router-dom";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { MembersList } from "@/components/family-tree/MembersList";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TreesLoading } from "@/components/trees/TreesLoading";
import { TreesError } from "@/components/trees/TreesError";
import { toast } from "sonner";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TreeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tree");
  
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

  console.log("TreeView data:", { tree, members, relationships, isLoading, error });

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

  if (!tree) {
    console.log("Tree data missing");
    return <TreesError />;
  }

  console.log("Rendering TreeView with data:", {
    treeName: tree.name,
    memberCount: members?.length || 0,
    relationshipCount: relationships?.length || 0
  });

  return (
    <div className="container mx-auto py-8">
      <TreeHeader
        treeName={tree.name}
        treeDescription={tree.description || ""}
        members={members || []}
        onAddMember={handleAddMember}
        onAddRelationship={handleAddRelationship}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="tree">Tree Visualization</TabsTrigger>
          <TabsTrigger value="list">Members List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tree" className="mt-4">
          <div className="rounded-lg bg-card">
            <FamilyTreeGraph 
              members={members || []} 
              relationships={relationships || []} 
              className="animate-fade-in"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
          <MembersList members={members || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreeView;
