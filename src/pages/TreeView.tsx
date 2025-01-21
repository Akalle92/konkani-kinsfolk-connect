import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddMemberDialog } from "@/components/family-tree/AddMemberDialog";
import { AddRelationshipDialog } from "@/components/family-tree/AddRelationshipDialog";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { MembersList } from "@/components/family-tree/MembersList";

type RelationshipType = "parent" | "child" | "spouse" | "sibling";

const TreeView = () => {
  const { id: treeId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tree details
  const { data: tree } = useQuery({
    queryKey: ["tree", treeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_trees")
        .select("*")
        .eq("id", treeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!treeId,
  });

  // Fetch family members
  const { data: members } = useQuery({
    queryKey: ["family_members", treeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("tree_id", treeId);

      if (error) throw error;
      return data;
    },
    enabled: !!treeId,
  });

  // Fetch relationships
  const { data: relationships } = useQuery({
    queryKey: ["relationships", treeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("relationships")
        .select("*")
        .eq("tree_id", treeId);

      if (error) throw error;
      return data;
    },
    enabled: !!treeId,
  });

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

  // Add family member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (newMember: {
      firstName: string;
      lastName: string;
      birthDate: string;
      birthPlace: string;
      gender: string;
    }) => {
      const { data, error } = await supabase
        .from("family_members")
        .insert([
          {
            tree_id: treeId,
            first_name: newMember.firstName,
            last_name: newMember.lastName,
            birth_date: newMember.birthDate || null,
            birth_place: newMember.birthPlace || null,
            gender: newMember.gender || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family_members", treeId] });
      toast({
        title: "Success",
        description: "Family member added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add family member. Please try again.",
      });
      console.error("Error adding family member:", error);
    },
  });

  // Add relationship mutation
  const addRelationshipMutation = useMutation({
    mutationFn: async (newRelationship: {
      person1Id: string;
      person2Id: string;
      type: RelationshipType;
    }) => {
      const { data, error } = await supabase
        .from("relationships")
        .insert([
          {
            tree_id: treeId,
            person1_id: newRelationship.person1Id,
            person2_id: newRelationship.person2Id,
            relationship_type: newRelationship.type,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships", treeId] });
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add relationship. Please try again.",
      });
      console.error("Error adding relationship:", error);
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-playfair">{tree?.name}</h1>
          <p className="text-muted-foreground">{tree?.description}</p>
        </div>
        <div className="flex gap-2">
          <AddMemberDialog
            onAddMember={addMemberMutation.mutate}
            isLoading={addMemberMutation.isPending}
          />
          {members && members.length >= 2 && (
            <AddRelationshipDialog
              members={members}
              onAddRelationship={addRelationshipMutation.mutate}
              isLoading={addRelationshipMutation.isPending}
            />
          )}
        </div>
      </div>

      <FamilyTreeGraph nodes={graphData.nodes} links={graphData.links} />
      <MembersList members={members || []} />
    </div>
  );
};

export default TreeView;