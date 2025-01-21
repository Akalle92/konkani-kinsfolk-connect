import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ForceGraph2D from 'react-force-graph-2d';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  death_date: string | null;
  birth_place: string | null;
  gender: string | null;
  photo_url: string | null;
  notes: string | null;
}

interface Relationship {
  id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: string;
}

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    type: string;
  }>;
}

const TreeView = () => {
  const { id: treeId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
  });

  // Fetch tree details
  const { data: tree } = useQuery({
    queryKey: ['tree', treeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_trees')
        .select('*')
        .eq('id', treeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!treeId,
  });

  // Fetch family members
  const { data: members } = useQuery({
    queryKey: ['family_members', treeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('tree_id', treeId);

      if (error) throw error;
      return data;
    },
    enabled: !!treeId,
  });

  // Fetch relationships
  const { data: relationships } = useQuery({
    queryKey: ['relationships', treeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('relationships')
        .select('*')
        .eq('tree_id', treeId);

      if (error) throw error;
      return data;
    },
    enabled: !!treeId,
  });

  // Prepare graph data
  const graphData = useMemo(() => {
    if (!members || !relationships) return { nodes: [], links: [] };

    const nodes = members.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      color: member.gender === 'Male' ? '#7393B3' : 
             member.gender === 'Female' ? '#E6A8D7' : 
             '#A9A9A9',
    }));

    const links = relationships.map(rel => ({
      source: rel.person1_id,
      target: rel.person2_id,
      type: rel.relationship_type,
    }));

    return { nodes, links };
  }, [members, relationships]);

  // Add family member mutation
  const addMemberMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('family_members')
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
      queryClient.invalidateQueries({ queryKey: ['family_members', treeId] });
      setIsAddMemberOpen(false);
      setNewMember({
        firstName: '',
        lastName: '',
        birthDate: '',
        birthPlace: '',
        gender: '',
      });
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
      console.error('Error adding family member:', error);
    },
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.firstName || !newMember.lastName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name and last name are required",
      });
      return;
    }
    addMemberMutation.mutate();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-playfair">{tree?.name}</h1>
          <p className="text-muted-foreground">{tree?.description}</p>
        </div>
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Enter the details of the family member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={newMember.birthDate}
                  onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="birthPlace">Birth Place</Label>
                <Input
                  id="birthPlace"
                  value={newMember.birthPlace}
                  onChange={(e) => setNewMember({ ...newMember, birthPlace: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={newMember.gender}
                  onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                  placeholder="Male/Female/Other"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddMemberOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addMemberMutation.isPending}>
                  Add Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-white">
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={node => node.color}
          linkLabel={link => link.type}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 16/globalScale;
            ctx.font = `${fontSize}px Inter`;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(label, node.x, node.y + 15);
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members?.map((member) => (
          <div
            key={member.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">
              {member.first_name} {member.last_name}
            </h3>
            {member.birth_date && (
              <p className="text-sm text-gray-600">
                Born: {new Date(member.birth_date).toLocaleDateString()}
              </p>
            )}
            {member.birth_place && (
              <p className="text-sm text-gray-600">
                Place of Birth: {member.birth_place}
              </p>
            )}
            {member.gender && (
              <p className="text-sm text-gray-600">
                Gender: {member.gender}
              </p>
            )}
          </div>
        ))}
      </div>

      {members?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No family members added yet.</p>
        </div>
      )}
    </div>
  );
};

export default TreeView;