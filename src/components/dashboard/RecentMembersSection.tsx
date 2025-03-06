
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface FamilyMember {
  id: string;
  name?: string;
  first_name: string;
  last_name: string;
  photoUrl?: string;
  photo_url?: string | null;
  birth_date?: string | null;
  birthDate?: string;
  treeId?: string;
  tree_id?: string;
  treeName?: string;
  updatedAt?: string;
  updated_at?: string | null;
}

interface RecentMembersSectionProps {
  members: FamilyMember[];
}

export function RecentMembersSection({ members }: RecentMembersSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recently Updated Members</h2>
        <Button variant="ghost" size="sm" className="gap-1">
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {members.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">No recently updated members</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/trees">Add a family member</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                {(member.photoUrl || member.photo_url) ? (
                  <img 
                    src={member.photoUrl || member.photo_url || ''} 
                    alt={member.name || `${member.first_name} ${member.last_name}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                    {(member.name || `${member.first_name}`).charAt(0)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{member.name || `${member.first_name} ${member.last_name}`}</h3>
                    <Badge variant="outline" className="text-xs">
                      {new Date(member.updatedAt || member.updated_at || Date.now()).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(member.birthDate || member.birth_date) ? 
                      `Born: ${new Date(member.birthDate || member.birth_date || '').toLocaleDateString()}` : 
                      'No birth date'}
                  </p>
                  <Link to={`/trees/${member.treeId || member.tree_id}`} className="text-xs text-primary hover:underline mt-2">
                    {member.treeName || 'View Tree'}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
