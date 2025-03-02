import { useState, useCallback, useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface GraphNode {
  id: string;
  name: string;
  gender?: string;
  color?: string;
  x?: number;
  y?: number;
  photoUrl?: string;
  isCurrentUser?: boolean;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  notes?: string;
}

interface FamilyTreeGraphProps {
  members: any[];
  relationships: any[];
  currentUserId?: string | null;
  className?: string;
}

// Map relationship types to colors and styles
const RELATIONSHIP_STYLES: Record<string, { color: string; dashed?: boolean; width: number }> = {
  parent: { color: "#555", width: 1 },
  child: { color: "#555", width: 1 },
  spouse: { color: "#E11D48", width: 2 },
  sibling: { color: "#3B82F6", width: 1 },
  "step-parent": { color: "#555", dashed: true, width: 1 },
  "step-child": { color: "#555", dashed: true, width: 1 },
  "in-law": { color: "#9333EA", dashed: true, width: 1 },
  default: { color: "#22C55E", dashed: true, width: 1.5 }
};

// Helper to get relationship style
const getRelationshipStyle = (type: string) => {
  return RELATIONSHIP_STYLES[type] || RELATIONSHIP_STYLES.default;
};

// Gender-based node colors
const GENDER_COLORS = {
  Male: "#0EA5E9",   // Ocean blue
  Female: "#D946EF", // Magenta pink
  Other: "#8B5CF6",  // Vivid purple
  default: "#64748B" // Slate gray for unknown
};

export function FamilyTreeGraph({ members, relationships, currentUserId, className = "" }: FamilyTreeGraphProps) {
  const graphRef = useRef<any>();
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Transform data when members or relationships change
  useEffect(() => {
    if (!members || !relationships) return;
    
    console.log("Preparing graph data with:", { 
      members: members.length, 
      relationships: relationships.length,
      currentUserId
    });
    
    // Create nodes from members
    const nodes = members.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      gender: member.gender,
      color: member.gender ? GENDER_COLORS[member.gender] || GENDER_COLORS.default : GENDER_COLORS.default,
      photoUrl: member.photo_url,
      isCurrentUser: member.id === currentUserId
    }));
    
    // Create links from relationships
    const links = relationships.map(rel => ({
      source: rel.person1_id,
      target: rel.person2_id,
      type: rel.relationship_type,
      notes: rel.notes
    }));
    
    setGraphData({ nodes, links });
    setIsInitialRender(true);
  }, [members, relationships, currentUserId]);

  // Focus on current user node when graph data changes or component mounts
  useEffect(() => {
    if (isInitialRender && graphRef.current && graphData.nodes.length > 0 && currentUserId) {
      // Find the current user node
      const currentUserNode = graphData.nodes.find(node => node.id === currentUserId);
      
      if (currentUserNode) {
        console.log("Centering view on current user:", currentUserId);
        
        // Wait for the graph to initialize properly
        setTimeout(() => {
          // Center the graph on the current user's node
          graphRef.current.centerAt(
            currentUserNode.x || 0, 
            currentUserNode.y || 0, 
            1000
          );
          // Set zoom level to see immediate relationships
          graphRef.current.zoom(1.5, 1000);
          
          // Pin the current user's node at the center
          const graphNodes = graphRef.current.graphData().nodes;
          const updatedNodes = graphNodes.map((node: GraphNode) => {
            if (node.id === currentUserId) {
              return {
                ...node,
                fx: 0,  // Pin X at center
                fy: 0   // Pin Y at center
              };
            }
            return node;
          });
          
          // Update the graph with the modified nodes
          graphRef.current.graphData({
            nodes: updatedNodes,
            links: graphRef.current.graphData().links
          });
        }, 500);
        
        setIsInitialRender(false);
      }
    }
  }, [graphData, currentUserId, isInitialRender]);

  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.3, 400);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.3, 400);
    }
  }, []);

  const handleCenter = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
    }
  }, []);

  const handleFocusOnUser = useCallback(() => {
    if (!graphRef.current || !currentUserId) return;

    // Find current user node
    const nodes = graphRef.current.graphData().nodes;
    const currentUserNode = nodes.find((node: GraphNode) => node.id === currentUserId);
    
    if (currentUserNode) {
      // Center the view on the current user and zoom in slightly
      graphRef.current.centerAt(
        currentUserNode.x || 0, 
        currentUserNode.y || 0, 
        1000
      );
      graphRef.current.zoom(1.5, 1000);
    }
  }, [currentUserId]);

  // Custom node rendering function for the graph
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y, name, color, photoUrl, gender, isCurrentUser } = node;
    if (typeof x !== "number" || typeof y !== "number") return;

    // Make the current user's node slightly larger
    const baseSize = isCurrentUser ? 18 : 16;
    const size = baseSize / globalScale;
    const fontSize = 12 / globalScale;
    const nameYOffset = size + fontSize;

    // Draw highlight/glow for current user
    if (isCurrentUser) {
      ctx.beginPath();
      ctx.arc(x, y, size + 3 / globalScale, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 215, 0, 0.3)"; // Golden glow
      ctx.fill();
    }

    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color || GENDER_COLORS.default;
    ctx.fill();
    
    // Special border for current user
    if (isCurrentUser) {
      ctx.strokeStyle = "#FFD700"; // Gold border
      ctx.lineWidth = 2.5 / globalScale;
    } else {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5 / globalScale;
    }
    ctx.stroke();

    // Draw photo if available
    if (photoUrl) {
      try {
        const img = new Image();
        img.src = photoUrl;
        
        // Only draw the image if it's loaded
        if (img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, size - 1 / globalScale, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, x - size + 1 / globalScale, y - size + 1 / globalScale, 
                        (size - 1 / globalScale) * 2, (size - 1 / globalScale) * 2);
          ctx.restore();
        }
      } catch (e) {
        console.error("Error loading member photo:", e);
      }
    }

    // Draw "You" label for current user
    if (isCurrentUser) {
      const youLabel = "YOU";
      ctx.font = `bold ${fontSize}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Draw background for "You" label
      const labelWidth = ctx.measureText(youLabel).width;
      ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
      ctx.fillRect(x - labelWidth / 2 - 2, y - size - fontSize - 4, labelWidth + 4, fontSize + 2);
      
      // Draw "You" text
      ctx.fillStyle = "#000000";
      ctx.fillText(youLabel, x, y - size - fontSize / 2 - 3);
    }

    // Draw name
    ctx.font = `${fontSize}px Inter`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Draw text with white background for better readability
    const textWidth = ctx.measureText(name).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(x - textWidth / 2 - 2, y + size, textWidth + 4, fontSize + 2);
    
    ctx.fillStyle = "#000000";
    ctx.fillText(name, x, y + nameYOffset);
  }, []);

  // Custom link rendering with support for notes and custom relationships
  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { source, target, type, notes } = link;
    if (!source || !target || typeof source.x !== 'number' || typeof target.x !== 'number') return;

    const start = { x: source.x, y: source.y };
    const end = { x: target.x, y: target.y };
    
    // Get style based on relationship type
    const style = getRelationshipStyle(type);
    
    // Draw link
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    
    // Apply style
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width / globalScale;
    
    // Apply dashed line if needed
    if (style.dashed) {
      ctx.setLineDash([5 / globalScale, 5 / globalScale]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw relationship type text when zoomed in enough
    if (globalScale > 1.2 && type) {
      const textPos = {
        x: start.x + (end.x - start.x) * 0.5,
        y: start.y + (end.y - start.y) * 0.5
      };
      
      const fontSize = 10 / globalScale;
      ctx.font = `${fontSize}px Inter`;
      
      // Format the relationship text
      const displayType = type.charAt(0).toUpperCase() + type.slice(1);
      
      // Background for relationship type
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      const textWidth = ctx.measureText(displayType).width;
      ctx.fillRect(
        textPos.x - textWidth / 2 - 2,
        textPos.y - fontSize / 2 - 1,
        textWidth + 4,
        fontSize + 2
      );
      
      // Draw relationship type
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = style.color;
      ctx.fillText(displayType, textPos.x, textPos.y);
      
      // Show notes if present and zoom is sufficient
      if (notes && globalScale > 1.5) {
        const notePos = {
          x: textPos.x,
          y: textPos.y + fontSize + 2
        };
        
        const smallerFontSize = 8 / globalScale;
        ctx.font = `italic ${smallerFontSize}px Inter`;
        
        // Truncate long notes
        const noteText = notes.length > 20 ? `${notes.substring(0, 20)}...` : notes;
        const noteWidth = ctx.measureText(noteText).width;
        
        // Draw note background
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(
          notePos.x - noteWidth / 2 - 2,
          notePos.y - smallerFontSize / 2 - 1,
          noteWidth + 4,
          smallerFontSize + 2
        );
        
        // Draw note text
        ctx.fillStyle = "#666666";
        ctx.fillText(noteText, notePos.x, notePos.y);
      }
    }
  }, []);

  return (
    <div className={`relative w-full h-[600px] border rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white/90 hover:bg-white"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white/90 hover:bg-white"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCenter}
          className="bg-white/90 hover:bg-white"
          title="Center View"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        {currentUserId && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleFocusOnUser}
            className="bg-gold/10 hover:bg-gold/20 border-gold/50"
            title="Focus on You"
          >
            <RefreshCw className="h-4 w-4 text-amber-600" />
          </Button>
        )}
      </div>
      
      {(!members || members.length === 0) ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No family members added yet. Add members using the button above.
        </div>
      ) : (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeRelSize={6}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={100}
          cooldownTicks={100}
          width={isSmallScreen ? window.innerWidth - 32 : undefined}
          height={600}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          onNodeDragEnd={node => {
            // Pin the node after dragging
            node.fx = node.x;
            node.fy = node.y;
          }}
          onEngineStop={() => {
            // After initial rendering stabilizes, if this is the first render
            // and we have a current user, center on them
            if (isInitialRender && currentUserId && graphRef.current) {
              handleFocusOnUser();
              setIsInitialRender(false);
            }
          }}
        />
      )}
    </div>
  );
}
