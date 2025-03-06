
import { Clock, Plus, Edit, UserRoundPlus, TreePine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  type: 'create_tree' | 'add_member' | 'edit_member' | 'add_relationship';
  entityId: string;
  entityName: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create_tree':
        return <TreePine className="h-5 w-5" />;
      case 'add_member':
        return <UserRoundPlus className="h-5 w-5" />;
      case 'edit_member':
        return <Edit className="h-5 w-5" />;
      case 'add_relationship':
        return <Plus className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'create_tree':
        return `New family tree "${activity.entityName}" created`;
      case 'add_member':
        return `Added ${activity.entityName} to family tree`;
      case 'edit_member':
        return `Updated information for ${activity.entityName}`;
      case 'add_relationship':
        return `Added new relationship for ${activity.entityName}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{getActivityText(activity)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
