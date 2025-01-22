import { useState, useCallback, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { ChevronDown, ChevronRight } from "lucide-react";

interface GraphNode {
  id: string;
  name: string;
  color?: string;
  x?: number;
  y?: number;
  photoUrl?: string;
  collapsed?: boolean;
  childLinks?: GraphLink[];
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

interface FamilyTreeGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function FamilyTreeGraph({ nodes: initialNodes, links: initialLinks }: FamilyTreeGraphProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const visibleLinks = useMemo(() => {
    return initialLinks.filter((link) => {
      const sourceNode = nodes.find((n) => n.id === link.source);
      return sourceNode && !sourceNode.collapsed;
    });
  }, [initialLinks, nodes, expandedNodes]);

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-white">
      <ForceGraph2D
        graphData={{ nodes, links: visibleLinks }}
        nodeLabel="name"
        nodeColor={(node) => (node as GraphNode).color}
        linkLabel={(link) => (link as GraphLink).type}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const { x, y, name, color, photoUrl } = node as GraphNode;
          if (typeof x !== "number" || typeof y !== "number") return;

          const size = 30;
          const fontSize = 16 / globalScale;

          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = color || "#000";
          ctx.fill();

          if (photoUrl) {
            const img = new Image();
            img.src = photoUrl;
            ctx.save();
            ctx.clip();
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            ctx.restore();
          }

          ctx.font = `${fontSize}px Inter`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(name, x, y + size);

          const isExpanded = expandedNodes.has(node.id);
          const hasChildren = initialLinks.some(link => link.source === node.id);
          
          if (hasChildren) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(x + size / 2, y, 8, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.fillStyle = "black";
            ctx.font = `${12 / globalScale}px Inter`;
            ctx.fillText(isExpanded ? "−" : "+", x + size / 2, y + 4);
          }
        }}
        onNodeClick={(node) => {
          toggleNode(node.id);
        }}
        linkColor={(link) => {
          return (link as GraphLink).type === "spouse" ? "#FF69B4" : "#999";
        }}
        linkWidth={(link) => {
          return (link as GraphLink).type === "spouse" ? 2 : 1;
        }}
      />
    </div>
  );
}