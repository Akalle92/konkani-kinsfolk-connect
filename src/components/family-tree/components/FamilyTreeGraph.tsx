
import React, { useRef, useState, useEffect, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { GraphData, GraphNode, FamilyTreeGraphProps } from "../types/graph-types";
import { useGraphControls } from "../hooks/useGraphControls";
import { nodeCanvasObject } from "../renderers/GraphRenderers";
import { NodeClickHandler } from "../types/graph-types";

export function FamilyTreeGraph({
  members,
  relationships,
  currentUserId,
  className,
  onNodeClick,
}: FamilyTreeGraphProps) {
  const graphRef = useRef<any>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [showImages, setShowImages] = useState(true);
  const controls = useGraphControls(graphRef);

  // Convert the input data to graph format
  useEffect(() => {
    if (!Array.isArray(members) || members.length === 0) {
      console.log("FamilyTreeGraph: No members to display");
      setGraphData({ nodes: [], links: [] });
      return;
    }

    const rels = Array.isArray(relationships) ? relationships : [];
    console.log(`FamilyTreeGraph: Processing ${members.length} members and ${rels.length} relationships`);

    // Create nodes from family members
    const nodes = members.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      gender: member.gender || 'unknown',
      photoUrl: member.photo_url,
      isCurrentUser: member.id === currentUserId,
      birthDate: member.birth_date,
      deathDate: member.death_date,
      isDeceased: Boolean(member.death_date)
    }));

    // Create links from relationships
    const links = rels.map(rel => ({
      source: rel.person1_id,
      target: rel.person2_id,
      type: rel.relationship_type,
      id: rel.id
    }));

    setGraphData({ nodes, links });
  }, [members, relationships, currentUserId]);

  // Handle highlighting connected nodes on hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    if (!graphRef.current || !node) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }

    // Get connected nodes
    const graphLinks = graphData.links || [];
    const connectedNodeIds = new Set<string>();
    const connectedLinks = new Set();

    graphLinks.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;

      if (sourceId === node.id) {
        connectedNodeIds.add(targetId as string);
        connectedLinks.add(link);
      } else if (targetId === node.id) {
        connectedNodeIds.add(sourceId as string);
        connectedLinks.add(link);
      }
    });

    // Always highlight the hovered node
    connectedNodeIds.add(node.id);
    setHighlightNodes(connectedNodeIds);
    setHighlightLinks(connectedLinks);
  }, [graphData]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    console.log("Node clicked:", node);
    setSelectedNode(node);
    
    // Call the parent component's handler if provided
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  const handleNodeDragEnd = useCallback((node: any) => {
    // Fix node position
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  // If we have no data, show a message
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
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
        ref={graphRef}
        graphData={graphData}
        nodeCanvasObject={(node, ctx, globalScale) => 
          nodeCanvasObject(node, ctx, globalScale, highlightNodes, showImages)
        }
        linkColor={(link) => highlightLinks.has(link) ? '#f97316' : '#999'}
        linkWidth={(link) => highlightLinks.has(link) ? 2 : 1}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) => highlightLinks.has(link) ? 4 : 0}
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
