
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function TreeControls({ onZoomIn, onZoomOut, onResetView }: TreeControlsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">Family Tree Visualization</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4 mr-1" />
          Zoom In
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4 mr-1" />
          Zoom Out
        </Button>
        <Button variant="outline" size="sm" onClick={onResetView}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset View
        </Button>
      </div>
    </div>
  );
}
