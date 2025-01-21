import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMemberMutations(treeId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return { addMemberMutation };
}