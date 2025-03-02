
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type RelationshipType = Database["public"]["Enums"]["relationship_type"] | string;

export type NewRelationship = {
  person1_id: string;
  person2_id: string;
  relationship_type: RelationshipType;
  notes?: string;
};

export function useRelationshipMutations(treeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addRelationshipMutation = useMutation({
    mutationFn: async (newRelationship: NewRelationship) => {
      if (!treeId) throw new Error("Tree ID is required");

      const { data, error } = await supabase
        .from("relationships")
        .insert([
          {
            ...newRelationship,
            tree_id: treeId,
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
    onError: (error: Error) => {
      console.error("Error adding relationship:", error);
      toast({
        title: "Error",
        description: "Failed to add relationship. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    addRelationshipMutation,
  };
}
