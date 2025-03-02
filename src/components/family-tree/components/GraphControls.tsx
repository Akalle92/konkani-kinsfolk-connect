
import React from "react";
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
  onFocusUser: () => void;
  hasCurrentUser: boolean;
}

export function GraphControls({ 
  onZoomIn, 
  onZoomOut, 
  onCenter, 
  onFocusUser, 
  hasCurrentUser 
}: GraphControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="bg-white/90 hover:bg-white"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="bg-white/90 hover:bg-white"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onCenter}
        className="bg-white/90 hover:bg-white"
        title="Center View"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      {hasCurrentUser && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFocusUser}
          className="bg-gold/10 hover:bg-gold/20 border-gold/50"
          title="Focus on You"
        >
          <RefreshCw className="h-4 w-4 text-amber-600" />
        </Button>
      )}
    </div>
  );
}
