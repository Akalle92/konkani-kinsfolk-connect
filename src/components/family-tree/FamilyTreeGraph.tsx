import ForceGraph2D from "react-force-graph-2d";

interface GraphNode {
  id: string;
  name: string;
  color?: string;
  x?: number;
  y?: number;
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

export function FamilyTreeGraph({ nodes, links }: FamilyTreeGraphProps) {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-white">
      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeLabel="name"
        nodeColor={(node) => (node as GraphNode).color}
        linkLabel={(link) => (link as GraphLink).type}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const { x, y, name, color } = node as GraphNode;
          if (typeof x !== "number" || typeof y !== "number") return;

          const fontSize = 16 / globalScale;
          ctx.font = `${fontSize}px Inter`;
          ctx.fillStyle = color || "#000";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(name, x, y + 15);
        }}
      />
    </div>
  );
}