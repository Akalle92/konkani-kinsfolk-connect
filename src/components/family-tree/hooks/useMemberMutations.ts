import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMemberMutations(treeId: string | undefined) {
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: async (newMember: {
      first_name: string;
      middle_name?: string;
      last_name: string;
      birth_date?: string;
      birth_place?: string;
      gender?: string;
      photo_url?: string;
    }) => {
      console.log("Adding member with data:", {
        tree_id: treeId,
        first_name: newMember.first_name,
        middle_name: newMember.middle_name,
        last_name: newMember.last_name,
        birth_date: newMember.birth_date,
        birth_place: newMember.birth_place,
        gender: newMember.gender,
        photo_url: newMember.photo_url,
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
    },
  });

  return { addMemberMutation };
}