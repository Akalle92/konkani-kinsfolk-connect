
import { User } from "lucide-react";
import { GraphNode } from "../types/graph-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FamilyMemberCardProps {
  member: GraphNode;
  onClose: () => void;
  onViewDetails: () => void;
}

export function FamilyMemberCard({ member, onClose, onViewDetails }: FamilyMemberCardProps) {
  return (
    <Card className="w-64 shadow-lg animate-in fade-in zoom-in duration-200">
      <div className="relative">
        <div className="h-20 bg-primary/10 rounded-t-lg"></div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background shadow flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <div className="h-16 w-16 rounded-full border-4 border-background overflow-hidden bg-muted flex items-center justify-center">
            {member.photoUrl ? (
              <img 
                src={member.photoUrl} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="pt-10 pb-4 text-center space-y-2">
        <h3 className="font-semibold">{member.name}</h3>
        
        <div className="flex gap-2 justify-center">
          {member.gender && (
            <Badge variant="outline" className="text-xs">
              {member.gender}
            </Badge>
          )}
          
          {member.isDeceased && (
            <Badge variant="outline" className="text-xs">
              Deceased
            </Badge>
          )}
        </div>
        
        {member.birthDate && (
          <p className="text-xs text-muted-foreground">
            {member.isDeceased && member.deathDate 
              ? `${new Date(member.birthDate).getFullYear()} - ${new Date(member.deathDate).getFullYear()}`
              : `Born: ${new Date(member.birthDate).toLocaleDateString()}`
            }
          </p>
        )}
        
        <button
          onClick={onViewDetails}
          className="text-xs text-primary hover:underline mt-2"
        >
          View full details
        </button>
      </CardContent>
    </Card>
  );
}
