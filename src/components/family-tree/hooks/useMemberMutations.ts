import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMemberMutations(treeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: async (newMember: {
      first_name: string;
      last_name: string;
      birth_date: string;
      birth_place: string;
      gender: string;
      photo_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("family_members")
        .insert([
          {
            tree_id: treeId,
            first_name: newMember.first_name,
            last_name: newMember.last_name,
            birth_date: newMember.birth_date || null,
            birth_place: newMember.birth_place || null,
            gender: newMember.gender || null,
            photo_url: newMember.photo_url || null,
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

  return { addMemberMutation };
}