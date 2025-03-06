
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTreeData } from "@/components/family-tree/hooks/useTreeData";
import { useMemberMutations } from "@/components/family-tree/hooks/useMemberMutations";
import { useRelationshipMutations } from "@/components/family-tree/hooks/useRelationshipMutations";
import { useAuth } from "@/contexts/auth/hooks";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users, Filter, Settings, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { prepareGraphData } from "@/components/family-tree/utils/prepareGraphData";
import { FamilyTreeGraph } from "@/components/family-tree/components/FamilyTreeGraph";
import { TreeLegend } from "@/components/family-tree/components/TreeLegend";
import { MembersList } from "@/components/family-tree/MembersList";
import { Skeleton } from "@/components/ui/skeleton";

const TreeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/trees">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading tree:", error);
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Family Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              There was an error loading this family tree. Please try again later.
            </p>
            <Button asChild>
              <Link to="/trees">Back to Trees</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Tree Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The requested family tree could not be found.
            </p>
            <Button asChild>
              <Link to="/trees">Back to Trees</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasMembers = Array.isArray(members) && members.length > 0;
  const graphData = prepareGraphData(members, relationships, currentUserMemberId);

  return (
    <div className="container mx-auto py-8 animate-page-enter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/trees">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{tree.name}</h1>
            <p className="text-muted-foreground text-sm">{tree.description || 'No description'}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {!hasMembers ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Family Members Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your family tree by adding your first family member.
            </p>
            <Button>Add Family Member</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="visualization">Tree Visualization</TabsTrigger>
              <TabsTrigger value="list">Member List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualization" className="mt-4 space-y-6">
              <FamilyTreeGraph 
                data={graphData}
                currentUserId={currentUserMemberId}
                onAddRelative={handleAddRelative}
                onEditMember={handleEditMember}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About This Tree</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {tree.description || 'No description available for this family tree.'}
                      </p>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium">Members</p>
                          <p className="text-2xl font-bold">{members?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Relationships</p>
                          <p className="text-2xl font-bold">{relationships?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm">
                            {new Date(tree.created_at || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-sm">
                            {new Date(tree.updated_at || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-1">
                  <TreeLegend />
                </div>
              </div>
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
