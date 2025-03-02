
import { useParams, useNavigate } from "react-router-dom";
import { TreeHeader } from "@/components/family-tree/TreeHeader";
import { MembersList } from "@/components/family-tree/MembersList";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { TreesLoading } from "@/components/trees/TreesLoading";
import { TreesError } from "@/components/trees/TreesError";
import { toast } from "sonner";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyGraphMessage } from "@/components/family-tree/components/EmptyGraphMessage";
import { ChevronLeft, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [activeTab, setActiveTab] = useState("tree");
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

  console.log("TreeView data:", { tree, members, relationships, isLoading, error });

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
    return null;
  }

  if (isLoading) {
    console.log("TreeView is loading");
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/trees')}
            className="mr-2"
            aria-label="Back to trees"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="w-3/4">
            <div className="h-8 bg-muted rounded animate-pulse mb-2 w-1/3"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>
        </div>
        <TreesLoading />
      </div>
    );
  }

  if (error) {
    console.error("Error loading tree:", error);
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/trees')}
          className="mb-6"
          aria-label="Back to trees"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Trees
        </Button>
        <TreesError />
      </div>
    );
  }

  if (!tree) {
    console.log("Tree data missing");
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/trees')}
          className="mb-6"
          aria-label="Back to trees"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Trees
        </Button>
        <TreesError />
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
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/trees')}
          className="mb-2"
          aria-label="Back to trees"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Trees
        </Button>
      </div>
      
      <TreeHeader
        treeName={tree.name}
        treeDescription={tree.description || ""}
        members={members || []}
        onAddMember={handleAddMember}
        onAddRelationship={handleAddRelationship}
        isAddingMember={addMemberMutation.isPending}
        isAddingRelationship={addRelationshipMutation.isPending}
      />

      {!hasMembers ? (
        <div className="mt-8 p-10 border border-dashed border-muted-foreground/30 rounded-lg text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
          <h3 className="text-xl font-semibold mb-2">No Family Members Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start building your family tree by adding your first family member. Click the "Add Member" button above.
          </p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="tree">Tree Visualization</TabsTrigger>
            <TabsTrigger value="list">Members List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="mt-4">
            <div className="rounded-lg bg-card p-1 border">
              {addMemberMutation.isPending && (
                <div className="bg-background/80 backdrop-blur-sm text-sm text-muted-foreground py-2 px-3 rounded-md inline-flex items-center gap-2 mb-3">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Adding member...</span>
                </div>
              )}
              
              {addRelationshipMutation.isPending && (
                <div className="bg-background/80 backdrop-blur-sm text-sm text-muted-foreground py-2 px-3 rounded-md inline-flex items-center gap-2 mb-3">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Adding relationship...</span>
                </div>
              )}
              
              <FamilyTreeGraph 
                members={members || []} 
                relationships={relationships || []} 
                currentUserId={currentUserMemberId}
                className="animate-fade-in"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-4 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
            <MembersList members={members || []} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TreeView;
