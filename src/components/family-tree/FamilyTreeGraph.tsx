import { useState, useCallback, useMemo, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const graphRef = useRef<any>();
  const [centerX, setCenterX] = useState<number>(0);
  const [centerY, setCenterY] = useState<number>(0);

  const visibleLinks = useMemo(() => {
    return initialLinks.filter((link) => {
      const sourceNode = nodes.find((n) => n.id === link.source);
      return sourceNode && !sourceNode.collapsed;
    });
  }, [initialLinks, nodes, expandedNodes]);

  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.5, 400);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.5, 400);
    }
  };

  const handleCenter = () => {
    if (graphRef.current) {
      graphRef.current.centerAt(centerX, centerY, 1000);
      graphRef.current.zoom(1, 1000);
    }
  };

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

  console.log("Rendering graph with nodes:", nodes);
  console.log("And links:", visibleLinks);

  return (
    <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-white">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white/90 hover:bg-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white/90 hover:bg-white"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCenter}
          className="bg-white/90 hover:bg-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      {nodes.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No family members added yet. Add members using the button above.
        </div>
      ) : (
        <ForceGraph2D
          ref={graphRef}
          graphData={{ nodes, links: visibleLinks }}
          nodeLabel={(node) => ((node as GraphNode).name)}
          nodeColor={(node) => ((node as GraphNode).color || "#000")}
          linkLabel={(link) => ((link as GraphLink).type)}
          onEngineStop={() => {
            if (nodes[0]?.x && nodes[0]?.y) {
              setCenterX(nodes[0].x);
              setCenterY(nodes[0].y);
            }
          }}
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
      )}
    </div>
  );
}