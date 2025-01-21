import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RelationshipType = "parent" | "child" | "spouse" | "sibling";

export function useRelationshipMutations(treeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return { addRelationshipMutation };
}