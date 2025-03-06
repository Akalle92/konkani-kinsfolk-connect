
import { Card } from "@/components/ui/card";
import { FamilyTreeGraph } from "@/components/family-tree/components/FamilyTreeGraph";
import { TreeSummaryCard } from "./TreeSummaryCard";
import { TreeLegend } from "@/components/family-tree/components/TreeLegend";
import { GraphData } from "../types/graph-types";

interface TreeVisualTabProps {
  graphData: GraphData;
  currentUserId: string | null;
  treeDescription: string | null;
  membersCount: number;
  relationshipsCount: number;
  createdAt: string;
  updatedAt: string;
  onEditMember: (memberId: string) => void;
  onAddRelative: (memberId: string) => void;
}

export function TreeVisualTab({
  graphData,
  currentUserId,
  treeDescription,
  membersCount,
  relationshipsCount,
  createdAt,
  updatedAt,
  onEditMember,
  onAddRelative
}: TreeVisualTabProps) {
  return (
    <div className="space-y-6">
      <FamilyTreeGraph 
        members={graphData.nodes} 
        relationships={graphData.links}
        currentUserId={currentUserId}
        onNodeClick={(node) => console.log("Node clicked:", node)}
        onEditMember={onEditMember}
        onAddRelative={onAddRelative}
        className="h-[500px] border rounded-lg"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <TreeSummaryCard 
            description={treeDescription}
            membersCount={membersCount}
            relationshipsCount={relationshipsCount}
            createdAt={createdAt}
            updatedAt={updatedAt}
          />
        </div>
        
        <div className="md:col-span-1">
          <TreeLegend />
        </div>
      </div>
    </div>
  );
}
