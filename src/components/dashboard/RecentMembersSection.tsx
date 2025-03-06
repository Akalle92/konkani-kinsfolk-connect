
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface FamilyMember {
  id: string;
  name: string;
  photoUrl?: string;
  birthDate?: string;
  treeId: string;
  treeName: string;
  updatedAt: string;
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
                {member.photoUrl ? (
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{member.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {new Date(member.updatedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.birthDate ? `Born: ${new Date(member.birthDate).toLocaleDateString()}` : 'No birth date'}
                  </p>
                  <Link to={`/trees/${member.treeId}`} className="text-xs text-primary hover:underline mt-2">
                    {member.treeName}
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
