
import { useRef } from "react";
import { useGraphData } from "./hooks/useGraphData";
import { useGraphControls } from "./hooks/useGraphControls";
import { GraphContainer } from "./components/GraphContainer";
import { FamilyTreeGraphProps } from "./types/graph-types";

export function FamilyTreeGraph({ members, relationships, currentUserId, className = "" }: FamilyTreeGraphProps) {
  // Ensure we have valid arrays before processing
  const validMembers = Array.isArray(members) ? members : [];
  const validRelationships = Array.isArray(relationships) ? relationships : [];
  
  console.log("FamilyTreeGraph rendering with:", {
    memberCount: validMembers.length,
    relationshipCount: validRelationships.length,
    currentUserId
  });
  
  // Create a ref for the graph
  const graphRef = useRef<any>(null);
  
  // Use custom hooks to manage graph state and controls
  const { graphData, isInitialRender, setIsInitialRender } = useGraphData(validMembers, validRelationships, currentUserId);
  const { handleZoomIn, handleZoomOut, handleCenter, handleFocusOnUser } = useGraphControls(graphRef);

  return (
    <GraphContainer
      graphData={graphData}
      graphRef={graphRef}
      isInitialRender={isInitialRender}
      setIsInitialRender={setIsInitialRender}
      currentUserId={currentUserId}
      handleZoomIn={handleZoomIn}
      handleZoomOut={handleZoomOut}
      handleCenter={handleCenter}
      handleFocusOnUser={() => handleFocusOnUser(currentUserId)}
      members={validMembers}
      className={className}
    />
  );
}
