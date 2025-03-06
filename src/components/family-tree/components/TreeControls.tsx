
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw, Focus, Users } from "lucide-react";

interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFocusSelected?: () => void;
  onToggleList?: () => void;
  className?: string;
}

export function TreeControls({ 
  onZoomIn, 
  onZoomOut, 
  onResetView, 
  onFocusSelected,
  onToggleList,
  className 
}: TreeControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button variant="outline" size="sm" onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onResetView} title="Reset View">
        <RefreshCw className="h-4 w-4" />
      </Button>
      {onFocusSelected && (
        <Button variant="outline" size="sm" onClick={onFocusSelected} title="Focus Selected">
          <Focus className="h-4 w-4" />
        </Button>
      )}
      {onToggleList && (
        <Button variant="outline" size="sm" onClick={onToggleList} title="Toggle List View">
          <Users className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
