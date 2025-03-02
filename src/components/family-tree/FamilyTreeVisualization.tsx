
import React, { useEffect, useRef } from 'react';
import { processDataForD3 } from './utils/treeDataUtils';
import { renderTreeWithD3, handleZoom } from './d3/TreeRenderer';
import { TreeControls } from './components/TreeControls';
import { FamilyTreeVisualizationProps } from './types';
import './FamilyTreeVisualization.css';

export function FamilyTreeVisualization({ members, relationships }: FamilyTreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render the family tree
  useEffect(() => {
    const data = processDataForD3(members, relationships);
    if (data) {
      renderTreeWithD3(svgRef, data);
    }
  }, [members, relationships]);

  const handleZoomIn = () => {
    handleZoom(svgRef, 'in');
  };

  const handleZoomOut = () => {
    handleZoom(svgRef, 'out');
  };

  const handleResetView = () => {
    handleZoom(svgRef, 'reset');
  };

  return (
    <div className="mt-6" ref={containerRef}>
      <TreeControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />
      
      <div className="border rounded-lg overflow-hidden bg-white p-4">
        {members.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No family members added yet. Add members to see the visualization.</p>
          </div>
        ) : (
          <svg ref={svgRef} width="100%" height="600"></svg>
        )}
      </div>
    </div>
  );
}
