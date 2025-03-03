
import { useGraphData } from "./hooks/useGraphData";
import { useGraphControls } from "./hooks/useGraphControls";
import { GraphContainer } from "./components/GraphContainer";
import { FamilyTreeGraphProps } from "./types/graph-types";

export function FamilyTreeGraph({ members, relationships, currentUserId, className = "" }: FamilyTreeGraphProps) {
  // Use custom hooks to manage graph state and controls
  const { graphData, isInitialRender, setIsInitialRender } = useGraphData(members, relationships, currentUserId);
  const { graphRef, handleZoomIn, handleZoomOut, handleCenter, handleFocusOnUser } = useGraphControls(currentUserId);

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
      handleFocusOnUser={handleFocusOnUser}
      members={members}
      className={className}
    />
  );
}
