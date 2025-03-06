import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth/hooks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { RecentMembersSection } from "@/components/dashboard/RecentMembersSection";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { OnboardingOverlay } from "@/components/dashboard/OnboardingOverlay";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if user is a first-time visitor
    if (user?.id) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding-${user.id}`);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);
  
  const dismissOnboarding = () => {
    setShowOnboarding(false);
    if (user?.id) {
      localStorage.setItem(`onboarding-${user.id}`, 'true');
    }
  };

  // Fetch trees
  const { data: trees, isLoading: isLoadingTrees } = useQuery({
    queryKey: ['trees'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('family_trees')
        .select('*')
        .eq('owner_id', user.id);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  
  // Fetch members
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      if (!trees || trees.length === 0) return [];
      
      const treeIds = trees.map(tree => tree.id);
      
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .in('tree_id', treeIds)
        .order('updated_at', { ascending: false })
        .limit(8);
        
      if (error) throw error;
      
      // Map tree names to members
      return (data || []).map(member => {
        const tree = trees.find(t => t.id === member.tree_id);
        return {
          ...member,
          treeName: tree?.name || 'Unknown Tree',
          name: `${member.first_name} ${member.last_name}`,
          treeId: member.tree_id,
          updatedAt: member.updated_at,
          photoUrl: member.photo_url,
          birthDate: member.birth_date
        };
      });
    },
    enabled: !!trees && trees.length > 0
  });
  
  // Mock data for activity feed
  const activities = [
    {
      id: '1',
      type: 'add_member' as const,
      entityId: '123',
      entityName: 'John Doe',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'create_tree' as const,
      entityId: '456',
      entityName: 'Ancestral Roots',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  
  // Mock data for upcoming events
  const events = [
    {
      id: '1',
      personId: '123',
      personName: 'Maria Silva',
      type: 'birthday' as const,
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
    },
    {
      id: '2',
      personId: '456',
      personName: 'Carlos & Ana',
      type: 'anniversary' as const,
      date: new Date(Date.now() + 86400000 * 7).toISOString(),
    },
  ];

  const isLoading = isLoadingTrees || isLoadingMembers;

  // Calculate stats
  const totalMembers = members?.length || 0;
  const totalTrees = trees?.length || 0;
  const totalGenerations = 3; // Placeholder
  const totalDocuments = 12; // Placeholder

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in to view your dashboard</h1>
          <Button asChild className="mt-4">
            <Link to="/auth">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {showOnboarding && <OnboardingOverlay onDismiss={dismissOnboarding} />}
      
      <div className="container p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {user.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your family trees
            </p>
          </div>
          
          <Button asChild>
            <Link to="/trees">View Family Trees</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <StatisticsCards 
            totalMembers={totalMembers}
            totalTrees={totalTrees}
            totalGenerations={totalGenerations}
            totalDocuments={totalDocuments}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <RecentMembersSection members={members || []} />
            )}
          </div>
          
          <div className="space-y-6">
            <QuickActions />
            <UpcomingEvents events={events} />
          </div>
        </div>
        
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
