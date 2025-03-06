
import { Card } from "@/components/ui/card";
import { FamilyTreeGraph } from "@/components/family-tree/components/FamilyTreeGraph";
import { TreeSummaryCard } from "./TreeSummaryCard";
import { TreeLegend } from "@/components/family-tree/components/TreeLegend";
import { GraphData } from "../types/graph-types";
import { FamilyMember, Relationship } from "@/types/family";

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
  // Convert GraphNode[] to FamilyMember[] and GraphLink[] to Relationship[]
  const members: FamilyMember[] = graphData.nodes.map(node => ({
    id: node.id,
    name: node.name,
    gender: (node.gender || 'other') as 'male' | 'female' | 'other',
    birthDate: node.birthDate,
    deathDate: node.deathDate,
    imageUrl: node.photoUrl,
    isAlive: node.isDeceased === true ? false : true,
    metadata: {}
  }));
  
  const relationships: Relationship[] = graphData.links.map(link => ({
    id: typeof link.source === 'object' && link.source ? link.source.id : (link.source as string),
    type: (link.type || 'parent-child') as 'parent-child' | 'spouse' | 'sibling',
    from: typeof link.source === 'object' && link.source ? link.source.id : (link.source as string),
    to: typeof link.target === 'object' && link.target ? link.target.id : (link.target as string),
    metadata: {}
  }));

  return (
    <div className="space-y-6">
      <FamilyTreeGraph 
        members={members} 
        relationships={relationships}
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
