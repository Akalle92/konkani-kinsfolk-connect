
import { X, User, Calendar, MapPin, Edit, UserRoundPlus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GraphNode } from "../types/graph-types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

interface MemberDetailsPanelProps {
  member: GraphNode | null;
  open: boolean;
  onClose: () => void;
  onAddRelative?: (memberId: string) => void;
  onEditMember?: (memberId: string) => void;
}

export function MemberDetailsPanel({ 
  member, 
  open, 
  onClose,
  onAddRelative,
  onEditMember
}: MemberDetailsPanelProps) {
  if (!member) return null;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <div className="relative">
            <div className="h-36 bg-primary/10"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted flex items-center justify-center">
                {member.photoUrl ? (
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
          
          <SheetHeader className="mt-16 px-6">
            <SheetTitle className="text-center text-xl">{member.name}</SheetTitle>
            <SheetDescription className="text-center">
              {member.isDeceased ? (
                <Badge variant="outline" className="text-xs">Deceased</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Living</Badge>
              )}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Gender</p>
                      <p className="text-sm text-muted-foreground">{member.gender || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Birth Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(member.birthDate)}</p>
                    </div>
                  </div>
                  
                  {member.isDeceased && member.deathDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Death Date</p>
                        <p className="text-sm text-muted-foreground">{formatDate(member.deathDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Birth Place</p>
                      <p className="text-sm text-muted-foreground">Unknown</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Relationships</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Parents</p>
                    <p className="text-sm text-muted-foreground">No parents listed</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Spouse(s)</p>
                    <p className="text-sm text-muted-foreground">No spouses listed</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Children</p>
                    <p className="text-sm text-muted-foreground">No children listed</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Siblings</p>
                    <p className="text-sm text-muted-foreground">No siblings listed</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Additional Information</h3>
                <p className="text-sm text-muted-foreground">No additional information available</p>
              </div>
            </div>
          </ScrollArea>
          
          <SheetFooter className="px-6 py-4 border-t">
            <div className="w-full flex gap-2 justify-between">
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
              
              <div className="flex gap-2">
                {onAddRelative && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAddRelative(member.id)}
                  >
                    <UserRoundPlus className="mr-2 h-4 w-4" />
                    Add Relative
                  </Button>
                )}
                
                {onEditMember && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onEditMember(member.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
