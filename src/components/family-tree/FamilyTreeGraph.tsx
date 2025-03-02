
import { useCallback, useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GraphControls } from "./components/GraphControls";
import { EmptyGraphMessage } from "./components/EmptyGraphMessage";
import { nodeCanvasObject, linkCanvasObject } from "./renderers/GraphRenderers";
import { useGraphData } from "./hooks/useGraphData";
import { FamilyTreeGraphProps } from "./types/graph-types";

export function FamilyTreeGraph({ members, relationships, currentUserId, className = "" }: FamilyTreeGraphProps) {
  const graphRef = useRef<any>();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const { graphData, isInitialRender, setIsInitialRender } = useGraphData(members, relationships, currentUserId);
  
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
          const updatedNodes = graphNodes.map((node: any) => {
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
  }, [graphData, currentUserId, isInitialRender, setIsInitialRender]);

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
    const currentUserNode = nodes.find((node: any) => node.id === currentUserId);
    
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

  return (
    <div className={`relative w-full h-[600px] border rounded-lg overflow-hidden bg-white ${className}`}>
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCenter={handleCenter}
        onFocusUser={handleFocusOnUser}
        hasCurrentUser={Boolean(currentUserId)}
      />
      
      {(!members || members.length === 0) ? (
        <EmptyGraphMessage />
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
