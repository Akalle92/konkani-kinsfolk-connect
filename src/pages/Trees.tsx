import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TreesHeader } from '@/components/trees/TreesHeader';
import { TreesLoading } from '@/components/trees/TreesLoading';
import { TreesError } from '@/components/trees/TreesError';
import { TreesList } from '@/components/trees/TreesList';

const Trees = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        toast({
          title: "Authentication Required",
          description: "Please sign in to view your family trees.",
          variant: "destructive"
        });
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const { data: trees, isLoading, error } = useQuery({
    queryKey: ['trees'],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user found in queryFn');
        throw new Error('User not authenticated');
      }
      
      console.log('Fetching trees for user:', user.id);
      
      const { data, error } = await supabase
        .from('family_trees')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched trees:', data);
      return data || [];
    },
    enabled: Boolean(user?.id),
  });

  if (!user) {
    console.log('No user in component render');
    return <TreesError />;
  }

  if (isLoading) {
    return <TreesLoading />;
  }

  if (error) {
    console.error('Error loading trees:', error);
    return <TreesError />;
  }

  return (
    <div className="container mx-auto p-6">
      <TreesHeader 
        userId={user.id} 
        isAdmin={userRole?.role === 'admin'} 
      />
      <TreesList trees={trees || []} />
    </div>
  );
};

export default Trees;