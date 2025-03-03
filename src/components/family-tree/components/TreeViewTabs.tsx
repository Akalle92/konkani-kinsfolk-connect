
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { FamilyTreeGraph } from "@/components/family-tree/FamilyTreeGraph";
import { MembersList } from "@/components/family-tree/MembersList";
import { useState } from "react";

interface TreeViewTabsProps {
  members: any[];
  relationships: any[];
  currentUserMemberId: string | null;
  isAddingMember: boolean;
  isAddingRelationship: boolean;
}

export function TreeViewTabs({
  members,
  relationships,
  currentUserMemberId,
  isAddingMember,
  isAddingRelationship
}: TreeViewTabsProps) {
  const [activeTab, setActiveTab] = useState("tree");
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="mb-4">
        <TabsTrigger value="tree">Tree Visualization</TabsTrigger>
        <TabsTrigger value="list">Members List</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tree" className="mt-4">
        <div className="rounded-lg bg-card p-1 border">
          {isAddingMember && (
            <div className="bg-background/80 backdrop-blur-sm text-sm text-muted-foreground py-2 px-3 rounded-md inline-flex items-center gap-2 mb-3">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Adding member...</span>
            </div>
          )}
          
          {isAddingRelationship && (
            <div className="bg-background/80 backdrop-blur-sm text-sm text-muted-foreground py-2 px-3 rounded-md inline-flex items-center gap-2 mb-3">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Adding relationship...</span>
            </div>
          )}
          
          <FamilyTreeGraph 
            members={members} 
            relationships={relationships} 
            currentUserId={currentUserMemberId}
            className="animate-fade-in"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="list" className="mt-4 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
        <MembersList members={members} />
      </TabsContent>
    </Tabs>
  );
}
