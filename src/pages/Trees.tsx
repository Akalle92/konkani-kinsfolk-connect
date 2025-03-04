
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/auth/hooks";
import { useToast } from '@/hooks/use-toast';
import { TreesHeader } from '@/components/trees/TreesHeader';
import { TreesLoading } from '@/components/trees/TreesLoading';
import { TreesError } from '@/components/trees/TreesError';
import { TreesList } from '@/components/trees/TreesList';
import { Loader2 } from 'lucide-react';

const EmptyTreesState = () => (
  <div className="border border-dashed border-muted-foreground/30 rounded-lg p-12 text-center">
    <h3 className="text-xl font-semibold mb-3">No Family Trees Yet</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      Start preserving your family history by creating your first family tree. It's easy to begin!
    </p>
    <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/70"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
    <p className="text-sm text-muted-foreground">
      Click the "Create New Tree" button above to get started.
    </p>
  </div>
);

const Trees = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Only navigate away if auth check is complete and user is not logged in
    if (!authLoading && !user) {
      console.log('No authenticated user found, redirecting to auth page');
      navigate('/auth');
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your family trees.",
        variant: "destructive"
      });
    } else if (!authLoading) {
      // Auth check is complete and user is logged in
      setLocalLoading(false);
    }
  }, [authLoading, user, navigate, toast]);

  const { data: trees, isLoading: treesLoading, error, isFetching } = useQuery({
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
    enabled: !!user?.id, // Only run the query when user is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Show loading state during initial auth check or while fetching trees
  if (authLoading || localLoading) {
    console.log('Showing loading state because auth is loading or local loading is true');
    return <TreesLoading />;
  }

  // Show error if query failed
  if (error) {
    console.error('Error loading trees:', error);
    return <TreesError />;
  }

  return (
    <div className="container mx-auto p-6 animate-page-enter">
      <TreesHeader 
        userId={user?.id} 
        isAdmin={userRole?.role === 'admin'} 
      />
      
      {treesLoading ? (
        <TreesLoading />
      ) : (
        <div className="relative">
          {isFetching && !treesLoading && (
            <div className="absolute top-0 right-0 flex items-center gap-2 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm p-2 rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Refreshing</span>
            </div>
          )}
          
          {trees && trees.length > 0 ? (
            <TreesList trees={trees} />
          ) : (
            <EmptyTreesState />
          )}
        </div>
      )}
    </div>
  );
};

export default Trees;
