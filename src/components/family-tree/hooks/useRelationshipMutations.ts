import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type RelationshipType = Database["public"]["Enums"]["relationship_type"];

export type NewRelationship = {
  person1_id: string;
  person2_id: string;
  relationship_type: RelationshipType;
};

export function useRelationshipMutations(treeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addRelationshipMutation = useMutation({
    mutationFn: async (newRelationship: NewRelationship) => {
      const { data, error } = await supabase
        .from("relationships")
        .insert([
          {
            tree_id: treeId,
            person1_id: newRelationship.person1_id,
            person2_id: newRelationship.person2_id,
            relationship_type: newRelationship.relationship_type,
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

  return { addRelationshipMutation };
}