import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface TreeCardProps {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const TreeCard = ({ id, name, description, created_at }: TreeCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteTreeMutation = useMutation({
    mutationFn: async (treeId: string) => {
      const { error } = await supabase
        .from('family_trees')
        .delete()
        .eq('id', treeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      toast({
        title: "Success",
        description: "Family tree deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete family tree. Please try again.",
      });
      console.error('Error deleting tree:', error);
    },
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Created: {new Date(created_at || '').toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/trees/${id}`)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          View & Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this tree?')) {
              deleteTreeMutation.mutate(id);
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};