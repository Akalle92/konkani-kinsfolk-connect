
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember, Relationship, FamilyTreeData } from "@/types/family";
import { FamilyTreeGraph } from "@/components/family-tree/components/FamilyTreeGraph";
import { TreeControls } from "@/components/family-tree/components/TreeControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, User, Plus, Settings, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function TreePage() {
  const { id: treeId } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState<string>("visualization");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<{
    name: string;
    description: string | null;
    createdAt: string;
  } | null>(null);
  const [familyData, setFamilyData] = useState<FamilyTreeData>({
    nodes: [],
    links: []
  });
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const graphRef = React.useRef<any>(null);

  // Fetch tree data
  const fetchTreeData = useCallback(async () => {
    if (!treeId) {
      setError("No tree ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch tree details
      const { data: treeData, error: treeError } = await supabase
        .from("family_trees")
        .select("*")
        .eq("id", treeId)
        .maybeSingle();

      if (treeError) {
        throw treeError;
      }

      if (!treeData) {
        setError("Tree not found");
        setIsLoading(false);
        return;
      }

      // Fetch family members
      const { data: membersData, error: membersError } = await supabase
        .from("family_members")
        .select("*")
        .eq("tree_id", treeId);

      if (membersError) {
        throw membersError;
      }

      // Fetch relationships
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from("relationships")
        .select("*")
        .eq("tree_id", treeId);

      if (relationshipsError) {
        throw relationshipsError;
      }

      // Transform data to our model
      const nodes: FamilyMember[] = membersData?.map(member => ({
        id: member.id,
        name: `${member.first_name} ${member.last_name}`,
        gender: (member.gender as 'male' | 'female' | 'other') || 'other',
        birthDate: member.birth_date || undefined,
        deathDate: member.death_date || undefined,
        imageUrl: member.photo_url || undefined,
        isAlive: !member.death_date,
        metadata: {
          birthPlace: member.birth_place,
          middleName: member.middle_name,
          notes: member.notes
        }
      })) || [];

      const links: Relationship[] = relationshipsData?.map(rel => ({
        id: rel.id,
        type: mapRelationshipType(rel.relationship_type),
        from: rel.person1_id,
        to: rel.person2_id,
        metadata: {}
      })) || [];

      setTreeData({
        name: treeData.name,
        description: treeData.description,
        createdAt: treeData.created_at
      });
      
      setFamilyData({
        nodes,
        links
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching tree data:", err);
      setError("Failed to load family tree data");
      setIsLoading(false);
    }
  }, [treeId]);

  // Map database relationship type to our model
  const mapRelationshipType = (type: string): 'parent-child' | 'spouse' | 'sibling' => {
    switch (type) {
      case 'parent':
      case 'child':
        return 'parent-child';
      case 'spouse':
        return 'spouse';
      case 'sibling':
        return 'sibling';
      default:
        return 'parent-child';
    }
  };

  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  // Graph control handlers
  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.2, 800);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.2, 800);
    }
  };

  const handleResetView = () => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
    }
  };

  const handleNodeClick = (node: FamilyMember) => {
    setSelectedMember(node);
    toast.info(`Selected: ${node.name}`);
  };

  const handleBackgroundClick = () => {
    setSelectedMember(null);
  };

  const handleEditMember = (id: string) => {
    toast.info("Edit member functionality coming soon");
  };

  const handleAddMember = () => {
    toast.info("Add member functionality coming soon");
  };

  // Render loading state
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
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Family Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link to="/trees">Back to Trees</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/trees">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{treeData?.name || "Family Tree"}</h1>
            <p className="text-muted-foreground text-sm">
              {treeData?.description || "No description"}
            </p>
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
          <Button size="sm" onClick={handleAddMember}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="visualization">Tree Visualization</TabsTrigger>
          <TabsTrigger value="list">Member List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="mt-4">
          <div className="space-y-4">
            {/* Graph Controls */}
            <div className="flex justify-between items-center">
              <TreeControls 
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
              />
              
              {selectedMember && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{selectedMember.name}</span>
                  <Button size="sm" variant="outline" onClick={() => handleEditMember(selectedMember.id)}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
            
            {/* Graph Visualization */}
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <FamilyTreeGraph
                members={familyData.nodes}
                relationships={familyData.links}
                selectedMemberId={selectedMember?.id}
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}
                className="h-[600px]"
              />
            </div>
            
            {/* Tree Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Members</p>
                    <p className="text-2xl font-bold">{familyData.nodes.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Relationships</p>
                    <p className="text-2xl font-bold">{familyData.links.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {treeData?.createdAt ? new Date(treeData.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyData.nodes.map(member => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
                        {member.birthDate && ` • Born ${new Date(member.birthDate).toLocaleDateString()}`}
                        {!member.isAlive && ' • Deceased'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
