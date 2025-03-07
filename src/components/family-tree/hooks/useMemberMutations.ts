import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewMember {
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date?: string;
  birth_place?: string;
  gender?: string;
  photo_url?: string;
}

export function useMemberMutations(treeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: async (newMember: NewMember) => {
      if (!treeId) {
        throw new Error("Tree ID is required");
      }

      console.log("Adding member with data:", {
        tree_id: treeId,
        ...newMember
      });

      const { data, error } = await supabase
        .from("family_members")
        .insert({
          tree_id: treeId,
          first_name: newMember.first_name,
          middle_name: newMember.middle_name,
          last_name: newMember.last_name,
          birth_date: newMember.birth_date,
          birth_place: newMember.birth_place,
          gender: newMember.gender,
          photo_url: newMember.photo_url,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding member:", error);
        throw error;
      }

      console.log("Successfully added member:", data);
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
      console.error("Error in mutation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add family member. Please try again.",
      });
    },
  });

  return { addMemberMutation };
}