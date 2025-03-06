
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTreeData(treeId: string | undefined) {
  console.log("useTreeData called with treeId:", treeId);

  // Fetch tree details
  const { data: tree, isLoading: isTreeLoading, error: treeError } = useQuery({
    queryKey: ["tree", treeId],
    queryFn: async () => {
      console.log("Fetching tree details for ID:", treeId);
      if (!treeId) throw new Error("Tree ID is required");
      
      try {
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
          console.error("No tree found with ID:", treeId);
          throw new Error("Tree not found");
        }
        
        console.log("Tree data received:", data);
        return data;
      } catch (error) {
        console.error("Error in tree fetch queryFn:", error);
        throw error;
      }
    },
    enabled: Boolean(treeId),
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch family members
  const { data: members, isLoading: isMembersLoading, error: membersError } = useQuery({
    queryKey: ["family_members", treeId],
    queryFn: async () => {
      console.log("Fetching members for tree ID:", treeId);
      if (!treeId) throw new Error("Tree ID is required");
      
      try {
        const { data, error } = await supabase
          .from("family_members")
          .select("*")
          .eq("tree_id", treeId);

        if (error) {
          console.error("Error fetching members:", error);
          throw error;
        }
        console.log("Members data received:", data?.length || 0, "members");
        return data || [];
      } catch (error) {
        console.error("Error in members fetch queryFn:", error);
        throw error;
      }
    },
    enabled: Boolean(treeId) && !treeError,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch relationships
  const { data: relationships, isLoading: isRelationshipsLoading, error: relationshipsError } = useQuery({
    queryKey: ["relationships", treeId],
    queryFn: async () => {
      console.log("Fetching relationships for tree ID:", treeId);
      if (!treeId) throw new Error("Tree ID is required");
      
      try {
        const { data, error } = await supabase
          .from("relationships")
          .select("*")
          .eq("tree_id", treeId);

        if (error) {
          console.error("Error fetching relationships:", error);
          throw error;
        }
        console.log("Relationships data received:", data?.length || 0, "relationships");
        return data || [];
      } catch (error) {
        console.error("Error in relationships fetch queryFn:", error);
        throw error;
      }
    },
    enabled: Boolean(treeId) && !treeError,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const isLoading = isTreeLoading || isMembersLoading || isRelationshipsLoading;
  const error = treeError || membersError || relationshipsError;

  console.log("useTreeData returning:", {
    tree: tree ? 'tree data present' : 'tree data missing',
    members: members ? `${members.length} members` : 'no members',
    relationships: relationships ? `${relationships.length} relationships` : 'no relationships',
    isLoading,
    error: error ? String(error) : 'no error',
  });

  return {
    tree,
    members: members || [],
    relationships: relationships || [],
    isLoading,
    error,
  };
}
