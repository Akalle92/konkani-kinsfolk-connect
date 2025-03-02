
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw, Plus } from "lucide-react";

interface FamilyMember {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender?: string | null;
  birth_date?: string | null;
}

interface Relationship {
  id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: "parent" | "child" | "spouse" | "sibling";
}

interface FamilyTreeVisualizationProps {
  members: FamilyMember[];
  relationships: Relationship[];
}

export function FamilyTreeVisualization({ members, relationships }: FamilyTreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Process the members and relationships into a hierarchical structure
  const processDataForD3 = () => {
    if (members.length === 0) return null;

    // Use the first member as the root
    const rootMember = members[0];
    
    const processedData = {
      name: `${rootMember.first_name} ${rootMember.last_name}`,
      gender: rootMember.gender || 'unknown',
      id: rootMember.id,
      children: []
    };

    // Find spouse relationships
    const spouseRelationships = relationships.filter(rel => 
      (rel.relationship_type === 'spouse' && 
      (rel.person1_id === rootMember.id || rel.person2_id === rootMember.id))
    );

    if (spouseRelationships.length > 0) {
      const spouseNode = {
        name: "Spouse",
        virtual: true,
        children: spouseRelationships.map(rel => {
          const spouseId = rel.person1_id === rootMember.id ? rel.person2_id : rel.person1_id;
          const spouse = members.find(m => m.id === spouseId);
          if (!spouse) return null;
          return {
            name: `${spouse.first_name} ${spouse.last_name}`,
            gender: spouse.gender || 'unknown',
            id: spouse.id,
            relationship: 'spouse'
          };
        }).filter(Boolean)
      };
      
      if (spouseNode.children.length > 0) {
        processedData.children.push(spouseNode);
      }
    }

    // Find children relationships
    const childRelationships = relationships.filter(rel => 
      rel.relationship_type === 'child' && rel.person1_id === rootMember.id
    );

    if (childRelationships.length > 0) {
      const childrenNode = {
        name: "Children",
        virtual: true,
        children: childRelationships.map(rel => {
          const child = members.find(m => m.id === rel.person2_id);
          if (!child) return null;
          return {
            name: `${child.first_name} ${child.last_name}`,
            gender: child.gender || 'unknown',
            id: child.id,
            relationship: 'child'
          };
        }).filter(Boolean)
      };
      
      if (childrenNode.children.length > 0) {
        processedData.children.push(childrenNode);
      }
    }

    // Find sibling relationships
    const siblingRelationships = relationships.filter(rel => 
      rel.relationship_type === 'sibling' && 
      (rel.person1_id === rootMember.id || rel.person2_id === rootMember.id)
    );

    if (siblingRelationships.length > 0) {
      const siblingsNode = {
        name: "Siblings",
        virtual: true,
        children: siblingRelationships.map(rel => {
          const siblingId = rel.person1_id === rootMember.id ? rel.person2_id : rel.person1_id;
          const sibling = members.find(m => m.id === siblingId);
          if (!sibling) return null;
          return {
            name: `${sibling.first_name} ${sibling.last_name}`,
            gender: sibling.gender || 'unknown',
            id: sibling.id,
            relationship: 'sibling'
          };
        }).filter(Boolean)
      };
      
      if (siblingsNode.children.length > 0) {
        processedData.children.push(siblingsNode);
      }
    }

    // Find parent relationships
    const parentRelationships = relationships.filter(rel => 
      rel.relationship_type === 'parent' && rel.person2_id === rootMember.id
    );

    if (parentRelationships.length > 0) {
      const parentsNode = {
        name: "Parents",
        virtual: true,
        children: parentRelationships.map(rel => {
          const parent = members.find(m => m.id === rel.person1_id);
          if (!parent) return null;
          return {
            name: `${parent.first_name} ${parent.last_name}`,
            gender: parent.gender || 'unknown',
            id: parent.id,
            relationship: 'parent'
          };
        }).filter(Boolean)
      };
      
      if (parentsNode.children.length > 0) {
        processedData.children.push(parentsNode);
      }
    }

    return processedData;
  };

  // Render the family tree
  useEffect(() => {
    const data = processDataForD3();
    if (!data || !svgRef.current) return;

    // Clear previous tree
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const margin = { top: 50, right: 120, bottom: 50, left: 120 };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create hierarchy
    const root = d3.hierarchy(data);

    // Create tree layout
    const tree = d3.tree().size([height, width]);

    // Compute layout
    tree(root);

    // Add links
    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', '1.5px');

    // Add nodes
    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.data.virtual ? 5 : 10)
      .style('fill', d => {
        if (d.data.virtual) return '#ccc';
        return d.data.gender === 'male' ? '#4682B4' : 
               d.data.gender === 'female' ? '#FF69B4' : '#9370DB';
      })
      .style('stroke', d => d.data.virtual ? '#ccc' : '#333')
      .style('stroke-width', '2px');

    // Add labels
    node.append('text')
      .attr('dy', '.35em')
      .attr('x', d => d.children ? -13 : 13)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name)
      .style('font-size', '12px');

    // Add zoom functionality
    const zoomHandler = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        svg.attr('transform', event.transform);
      });

    d3.select(svgRef.current)
      .call(zoomHandler)
      .call(
        zoomHandler.transform,
        d3.zoomIdentity.translate(margin.left, margin.top)
      );
    
  }, [members, relationships]);

  const handleZoomIn = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 1.2);
  };

  const handleZoomOut = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 0.8);
  };

  const handleResetView = () => {
    d3.select(svgRef.current)
      .transition()
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(120, 50)
      );
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Family Tree Visualization</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset View
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white">
        <svg ref={svgRef} width="100%" height="600"></svg>
      </div>
    </div>
  );
}
