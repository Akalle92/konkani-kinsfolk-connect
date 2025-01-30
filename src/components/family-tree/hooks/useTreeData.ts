import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTreeData(treeId: string | undefined) {
  // Fetch tree details
  const { data: tree, isLoading: isTreeLoading, error: treeError } = useQuery({
    queryKey: ["tree", treeId],
    queryFn: async () => {
      console.log("Fetching tree details for ID:", treeId);
      const { data, error } = await supabase
        .from("family_trees")
        .select("*")
        .eq("id", treeId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching tree:", error);
        throw error;
      }
      if (!data) {
        throw new Error("Tree not found");
      }
      return data;
    },
    enabled: !!treeId,
  });

  // Fetch family members
  const { data: members, isLoading: isMembersLoading, error: membersError } = useQuery({
    queryKey: ["family_members", treeId],
    queryFn: async () => {
      console.log("Fetching members for tree ID:", treeId);
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("tree_id", treeId);

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!treeId,
  });

  // Fetch relationships
  const { data: relationships, isLoading: isRelationshipsLoading, error: relationshipsError } = useQuery({
    queryKey: ["relationships", treeId],
    queryFn: async () => {
      console.log("Fetching relationships for tree ID:", treeId);
      const { data, error } = await supabase
        .from("relationships")
        .select("*")
        .eq("tree_id", treeId);

      if (error) {
        console.error("Error fetching relationships:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!treeId,
  });

  const isLoading = isTreeLoading || isMembersLoading || isRelationshipsLoading;
  const error = treeError || membersError || relationshipsError;

  return { 
    tree, 
    members, 
    relationships,
    isLoading,
    error
  };
}