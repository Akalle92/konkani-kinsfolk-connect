
import React, { useRef, useState, useEffect, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { FamilyMember, Relationship } from "@/types/family";

// Interface for graph node with position properties
interface GraphNode extends FamilyMember {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

// Interface for graph link with source/target
interface GraphLink {
  id: string;
  type: 'parent-child' | 'spouse' | 'sibling';
  source: string;
  target: string;
  metadata?: Record<string, any>;
  // Original properties for conversion
  from?: string;
  to?: string;
}

// Helper type for force graph node objects
interface NodeObject {
  id: string;
  [key: string]: any;
}

export interface FamilyTreeGraphProps {
  members: FamilyMember[];
  relationships: Relationship[];
  selectedMemberId?: string | null;
  className?: string;
  onNodeClick?: (node: GraphNode) => void;
  onBackgroundClick?: () => void;
}

export function FamilyTreeGraph({
  members,
  relationships,
  selectedMemberId,
  className = "",
  onNodeClick,
  onBackgroundClick
}: FamilyTreeGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
  const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<GraphLink>());

  // Convert the input data to graph format
  useEffect(() => {
    if (!Array.isArray(members) || members.length === 0) {
      console.log("FamilyTreeGraph: No members to display");
      setGraphData({ nodes: [], links: [] });
      return;
    }

    const nodes: GraphNode[] = members.map(member => ({
      ...member
    }));

    const links: GraphLink[] = Array.isArray(relationships) 
      ? relationships.map(rel => ({
          id: rel.id,
          type: rel.type,
          source: rel.from,
          target: rel.to,
          metadata: rel.metadata,
          from: rel.from,
          to: rel.to
        }))
      : [];

    setGraphData({ nodes, links });
  }, [members, relationships]);

  // Handle highlighting connected nodes on hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    if (!graphRef.current || !node) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }

    // Get connected nodes
    const connectedNodeIds = new Set<string>();
    const connectedLinks = new Set<GraphLink>();

    graphData.links.forEach(link => {
      // Skip links with null source or target
      if (link.source === null || link.target === null) return;
      
      let sourceId = '';
      let targetId = '';
      
      if (typeof link.source === 'object' && link.source) {
        // Cast to NodeObject to ensure TypeScript knows it has an id property
        const sourceObj = link.source as NodeObject;
        sourceId = sourceObj.id || '';
      } else if (typeof link.source === 'string') {
        sourceId = link.source;
      }
      
      if (typeof link.target === 'object' && link.target) {
        // Cast to NodeObject to ensure TypeScript knows it has an id property
        const targetObj = link.target as NodeObject;
        targetId = targetObj.id || '';
      } else if (typeof link.target === 'string') {
        targetId = link.target;
      }

      // Only add valid node IDs to the connected set
      if (sourceId && sourceId === node.id) {
        if (targetId) connectedNodeIds.add(targetId);
        connectedLinks.add(link);
      } else if (targetId && targetId === node.id) {
        if (sourceId) connectedNodeIds.add(sourceId);
        connectedLinks.add(link);
      }
    });

    // Always highlight the hovered node
    connectedNodeIds.add(node.id);
    setHighlightNodes(connectedNodeIds);
    setHighlightLinks(connectedLinks);
  }, [graphData]);

  // Handle node click event
  const handleNodeClick = useCallback((node: GraphNode) => {
    console.log("Node clicked:", node);
    
    // Fix node position on click
    node.fx = node.x;
    node.fy = node.y;
    
    // Call the parent component's handler if provided
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  // Handle node drag end event
  const handleNodeDragEnd = useCallback((node: GraphNode) => {
    // Fix node position
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  // Handle background click event
  const handleBackgroundClick = useCallback(() => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    
    if (onBackgroundClick) {
      onBackgroundClick();
    }
  }, [onBackgroundClick]);

  // Custom node renderer
  const renderNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { id, name, gender, isAlive } = node;
    const isHighlighted = selectedMemberId === id || highlightNodes.has(id);
    const size = isHighlighted ? 12 : 8;
    const fontSize = isHighlighted ? 14 / globalScale : 12 / globalScale;
    
    // Determine node color based on gender and alive status
    let color = '#999';
    if (gender === 'male') color = '#1E40AF'; // Blue
    if (gender === 'female') color = '#BE185D'; // Pink
    if (gender === 'other') color = '#047857'; // Green
    
    // Apply opacity for deceased members
    const opacity = isAlive ? 1 : 0.6;
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? '#F97316' : color; // Highlight in orange
    ctx.fill();
    ctx.strokeStyle = isHighlighted ? '#FFFFFF' : '#CCCCCC';
    ctx.lineWidth = isHighlighted ? 2 : 1;
    ctx.stroke();
    
    // Draw node label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = isHighlighted ? '#000000' : '#666666';
    ctx.fillText(name, node.x || 0, (node.y || 0) + size + 2);
    
  }, [selectedMemberId, highlightNodes]);

  // If we have no data, show a message
  if (!graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <p>No family members to display.</p>
          <p className="text-sm mt-2">Add members to start building your family tree.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <ForceGraph2D
        ref={graphRef as React.MutableRefObject<ForceGraphMethods>}
        graphData={graphData}
        nodeCanvasObject={renderNode}
        linkColor={(link) => highlightLinks.has(link as any) ? '#f97316' : '#999'}
        linkWidth={(link) => highlightLinks.has(link as any) ? 2 : 1}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) => highlightLinks.has(link as any) ? 4 : 0}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        onNodeDragEnd={handleNodeDragEnd}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
