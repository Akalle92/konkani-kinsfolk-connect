import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTreeData(treeId: string | undefined) {
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

  return { tree, members, relationships };
}