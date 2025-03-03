
import { useState, useEffect } from "react";
import { GraphData, GraphNode, GraphLink } from "../types/graph-types";
import { GENDER_COLORS } from "../utils/graph-constants";

export function useGraphData(members: any[] = [], relationships: any[] = [], currentUserId?: string | null) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Transform data when members or relationships change
  useEffect(() => {
    // Ensure we have valid arrays
    const validMembers = Array.isArray(members) ? members : [];
    const validRelationships = Array.isArray(relationships) ? relationships : [];
    
    console.log("Preparing graph data with:", { 
      members: validMembers.length, 
      relationships: validRelationships.length,
      currentUserId
    });
    
    try {
      // Create nodes from members
      const nodes = validMembers.map(member => ({
        id: member.id,
        name: `${member.first_name || 'Unknown'} ${member.last_name || ''}`.trim(),
        gender: member.gender,
        color: member.gender ? GENDER_COLORS[member.gender] || GENDER_COLORS.default : GENDER_COLORS.default,
        photoUrl: member.photo_url,
        isCurrentUser: member.id === currentUserId
      }));
      
      // Create links from relationships
      const links = validRelationships.map(rel => ({
        source: rel.person1_id,
        target: rel.person2_id,
        type: rel.relationship_type,
        notes: rel.notes
      }));
      
      setGraphData({ nodes, links });
      setIsInitialRender(true);
    } catch (error) {
      console.error("Error processing graph data:", error);
      // Set empty data in case of error
      setGraphData({ nodes: [], links: [] });
    }
  }, [members, relationships, currentUserId]);

  return { graphData, isInitialRender, setIsInitialRender };
}
