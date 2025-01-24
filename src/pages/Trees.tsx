import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreateTreeDialog } from '@/components/trees/CreateTreeDialog';
import { TreeCard } from '@/components/trees/TreeCard';

const Trees = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: trees, isLoading, error } = useQuery({
    queryKey: ['trees'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('family_trees')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading your family trees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 p-4 rounded-lg">
          <h1 className="text-xl font-semibold text-destructive mb-2">Error loading trees</h1>
          <p className="text-destructive">Please try refreshing the page.</p>
        </div>
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
        {user && <CreateTreeDialog userId={user.id} />}
      </div>

      {trees && trees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <TreeCard
              key={tree.id}
              id={tree.id}
              name={tree.name}
              description={tree.description}
              created_at={tree.created_at || ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-accent rounded-lg">
          <p className="text-accent-foreground">You haven't created any family trees yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click the "Create New Tree" button to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Trees;