import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Trees = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');
  const [newTreeDescription, setNewTreeDescription] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch trees
  const { data: trees, isLoading, error } = useQuery({
    queryKey: ['trees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_trees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trees:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  // Create tree mutation
  const createTreeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('family_trees')
        .insert([
          {
            name: newTreeName,
            description: newTreeDescription,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      setIsCreateDialogOpen(false);
      setNewTreeName('');
      setNewTreeDescription('');
      toast({
        title: "Success",
        description: "Family tree created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create family tree. Please try again.",
      });
      console.error('Error creating tree:', error);
    },
  });

  // Delete tree mutation
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

  const handleCreateTree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreeName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a tree name",
      });
      return;
    }
    createTreeMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-playfair mb-6">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-playfair mb-6">Error loading trees</h1>
        <p className="text-red-500">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-playfair">My Family Trees</h1>
          {userRole?.role === 'admin' && (
            <p className="text-sm text-muted-foreground">Admin Access</p>
          )}
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create New Tree
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Family Tree</DialogTitle>
              <DialogDescription>
                Enter the details for your new family tree.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTree} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Tree Name
                </label>
                <Input
                  id="name"
                  value={newTreeName}
                  onChange={(e) => setNewTreeName(e.target.value)}
                  placeholder="Enter tree name"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newTreeDescription}
                  onChange={(e) => setNewTreeDescription(e.target.value)}
                  placeholder="Enter tree description (optional)"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTreeMutation.isPending}>
                  Create Tree
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trees?.map((tree) => (
          <Card key={tree.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tree.name}</CardTitle>
              <CardDescription>{tree.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Created: {new Date(tree.created_at || '').toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/trees/${tree.id}`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                View & Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this tree?')) {
                    deleteTreeMutation.mutate(tree.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {trees?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't created any family trees yet.</p>
        </div>
      )}
    </div>
  );
};

export default Trees;