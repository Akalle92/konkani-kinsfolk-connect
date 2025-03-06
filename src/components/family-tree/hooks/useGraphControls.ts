
import { useCallback, RefObject } from "react";

export function useGraphControls(graphRef: RefObject<any>) {
  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.3, 400);
    }
  }, [graphRef]);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.3, 400);
    }
  }, [graphRef]);

  const handleCenter = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
    }
  }, [graphRef]);

  const handleFocusOnUser = useCallback((currentUserId?: string | null) => {
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
  }, []);

  return {
    graphRef,
    handleZoomIn,
    handleZoomOut,
    handleCenter,
    handleFocusOnUser
  };
}
