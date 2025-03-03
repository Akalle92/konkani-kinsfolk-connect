
import { useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useMediaQuery } from "@/hooks/use-media-query";
import { nodeCanvasObject, linkCanvasObject } from "../renderers/GraphRenderers";
import { GraphData } from "../types/graph-types";

interface ForceGraphProps {
  graphRef: React.RefObject<any>;
  graphData: GraphData;
  currentUserId?: string | null;
  isInitialRender: boolean;
  setIsInitialRender: (value: boolean) => void;
  handleFocusOnUser: () => void;
}

export function ForceGraph({
  graphRef,
  graphData,
  currentUserId,
  isInitialRender,
  setIsInitialRender,
  handleFocusOnUser
}: ForceGraphProps) {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  
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
  }, [graphData, currentUserId, isInitialRender, setIsInitialRender, graphRef]);

  return (
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
  );
}
