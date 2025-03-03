
import React from "react";
import { GraphControls } from "./GraphControls";
import { EmptyGraphMessage } from "./EmptyGraphMessage";
import { ForceGraph } from "./ForceGraph";
import { GraphData } from "../types/graph-types";

interface GraphContainerProps {
  graphData: GraphData;
  graphRef: React.RefObject<any>;
  isInitialRender: boolean;
  setIsInitialRender: (value: boolean) => void;
  currentUserId?: string | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleCenter: () => void;
  handleFocusOnUser: () => void;
  members: any[];
  className?: string;
}

export function GraphContainer({
  graphData,
  graphRef,
  isInitialRender,
  setIsInitialRender,
  currentUserId,
  handleZoomIn,
  handleZoomOut,
  handleCenter,
  handleFocusOnUser,
  members,
  className = ""
}: GraphContainerProps) {
  // Check if members array is defined before rendering
  const hasMembers = Array.isArray(members) && members.length > 0;
  
  return (
    <div className={`relative w-full h-[600px] border rounded-lg overflow-hidden bg-white ${className}`}>
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCenter={handleCenter}
        onFocusUser={handleFocusOnUser}
        hasCurrentUser={Boolean(currentUserId)}
      />
      
      {!hasMembers ? (
        <EmptyGraphMessage />
      ) : (
        <ForceGraph
          graphRef={graphRef}
          graphData={graphData}
          currentUserId={currentUserId}
          isInitialRender={isInitialRender}
          setIsInitialRender={setIsInitialRender}
          handleFocusOnUser={handleFocusOnUser}
        />
      )}
    </div>
  );
}
