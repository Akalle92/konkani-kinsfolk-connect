
import { useRef, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FamilyTreeControls } from "./FamilyTreeControls";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { MemberDetailsPanel } from "./MemberDetailsPanel";
import { GraphNode, GraphData } from "../types/graph-types";
import { GENDER_COLORS } from "../utils/graph-constants";

interface FamilyTreeGraphProps {
  data: GraphData;
  currentUserId?: string | null;
  onAddRelative?: (memberId: string) => void;
  onEditMember?: (memberId: string) => void;
}

export function FamilyTreeGraph({ 
  data, 
  currentUserId, 
  onAddRelative, 
  onEditMember 
}: FamilyTreeGraphProps) {
  const graphRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [detailsNode, setDetailsNode] = useState<GraphNode | null>(null);
  const [showImages, setShowImages] = useState(true);
  const [isCompactView, setIsCompactView] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  
  // Handle zoom
  const handleZoom = useCallback((factor: number) => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * factor, 400);
    }
  }, []);
  
  // Handle center
  const handleCenter = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 800);
      graphRef.current.zoom(1, 800);
    }
  }, []);
  
  // Handle focus on node
  const handleFocusNode = useCallback((nodeId: string) => {
    if (graphRef.current) {
      const node = data.nodes.find(n => n.id === nodeId);
      if (node) {
        graphRef.current.centerAt(node.x, node.y, 800);
        graphRef.current.zoom(1.5, 800);
      }
    }
  }, [data.nodes]);
  
  // Toggle show images
  const handleToggleShowImages = useCallback(() => {
    setShowImages(!showImages);
  }, [showImages]);
  
  // Toggle compact mode
  const handleToggleCompactMode = useCallback(() => {
    setIsCompactView(!isCompactView);
  }, [isCompactView]);
  
  // Handle node click for quick view
  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
  }, []);
  
  // Handle node double click for detailed view
  const handleNodeDoubleClick = useCallback((node: any) => {
    setSelectedNode(null);
    setDetailsNode(node);
  }, []);
  
  // Close quick view
  const handleCloseQuickView = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  // Open detailed view from quick view
  const handleOpenDetailedView = useCallback(() => {
    if (selectedNode) {
      setDetailsNode(selectedNode);
      setSelectedNode(null);
    }
  }, [selectedNode]);
  
  // Close detailed view
  const handleCloseDetailedView = useCallback(() => {
    setDetailsNode(null);
  }, []);
  
  // Custom node painting
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y, color = '#666', gender, photoUrl, name, isCurrentUser } = node;
    
    const nodeColor = color || (gender ? GENDER_COLORS[gender] || GENDER_COLORS.default : GENDER_COLORS.default);
    const size = isCompactView ? 8 : (isCurrentUser ? 16 : 12);
    const scaledSize = size / globalScale;
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, scaledSize, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor;
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = isCurrentUser ? '#FFD700' : '#ffffff';
    ctx.lineWidth = isCurrentUser ? 3 / globalScale : 1.5 / globalScale;
    ctx.stroke();
    
    // Draw image if available and enabled
    if (photoUrl && showImages && !isCompactView) {
      try {
        const img = new Image();
        img.src = photoUrl;
        
        if (img.complete) {
          const imgSize = scaledSize * 0.85;
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, imgSize, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, x - imgSize, y - imgSize, imgSize * 2, imgSize * 2);
          ctx.restore();
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    }
    
    // Draw name label if zoom is sufficient and not in compact mode
    if (!isCompactView && globalScale > 1.3) {
      ctx.font = `${10 / globalScale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(name, x, y + scaledSize + 8 / globalScale);
    }
    
    // Draw "YOU" indicator for current user
    if (isCurrentUser) {
      ctx.font = `bold ${9 / globalScale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('YOU', x, y - scaledSize - 5 / globalScale);
    }
  }, [isCompactView, showImages]);
  
  // Custom link painting
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!link.source || !link.target) return;
    
    const source = typeof link.source === 'object' ? link.source : { x: 0, y: 0 };
    const target = typeof link.target === 'object' ? link.target : { x: 0, y: 0 };
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    
    // Customize based on relationship type
    let lineColor = '#999';
    let lineWidth = 1;
    let isDashed = false;
    
    switch (link.type) {
      case 'spouse':
        lineColor = '#E74C3C';
        lineWidth = 2;
        break;
      case 'parent':
      case 'child':
        lineColor = '#3498DB';
        lineWidth = 1.5;
        break;
      case 'sibling':
        lineColor = '#2ECC71';
        lineWidth = 1.5;
        break;
      default:
        lineColor = '#999';
        isDashed = true;
    }
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth / globalScale;
    
    if (isDashed) {
      ctx.setLineDash([5 / globalScale, 5 / globalScale]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);
  
  // Controls
  const graphControls = {
    zoom: handleZoom,
    center: handleCenter,
    focusNode: handleFocusNode,
    toggleShowImages: handleToggleShowImages,
    toggleCompactMode: handleToggleCompactMode,
  };
  
  return (
    <div className="relative w-full h-[600px]">
      <FamilyTreeControls 
        controls={graphControls} 
        hasCurrentUser={!!currentUserId} 
        currentUserId={currentUserId}
      />
      
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        width={isSmallScreen ? window.innerWidth - 32 : undefined}
        height={600}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        warmupTicks={50}
        cooldownTicks={50}
        onNodeClick={handleNodeClick}
        onNodeDblClick={handleNodeDoubleClick}
        enableNodeDrag={true}
        onNodeDragEnd={(node: any) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
      />
      
      {/* Quick view card */}
      {selectedNode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <FamilyMemberCard 
            member={selectedNode} 
            onClose={handleCloseQuickView}
            onViewDetails={handleOpenDetailedView}
          />
        </div>
      )}
      
      {/* Detailed view panel */}
      <MemberDetailsPanel 
        member={detailsNode}
        open={!!detailsNode}
        onClose={handleCloseDetailedView}
        onAddRelative={onAddRelative}
        onEditMember={onEditMember}
      />
    </div>
  );
}
