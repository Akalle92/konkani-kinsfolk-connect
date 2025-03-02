
import { useState, useEffect } from "react";
import { GraphData, GraphNode, GraphLink } from "../types/graph-types";
import { GENDER_COLORS } from "../utils/graph-constants";

export function useGraphData(members: any[], relationships: any[], currentUserId?: string | null) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Transform data when members or relationships change
  useEffect(() => {
    if (!members || !relationships) return;
    
    console.log("Preparing graph data with:", { 
      members: members.length, 
      relationships: relationships.length,
      currentUserId
    });
    
    // Create nodes from members
    const nodes = members.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      gender: member.gender,
      color: member.gender ? GENDER_COLORS[member.gender] || GENDER_COLORS.default : GENDER_COLORS.default,
      photoUrl: member.photo_url,
      isCurrentUser: member.id === currentUserId
    }));
    
    // Create links from relationships
    const links = relationships.map(rel => ({
      source: rel.person1_id,
      target: rel.person2_id,
      type: rel.relationship_type,
      notes: rel.notes
    }));
    
    setGraphData({ nodes, links });
    setIsInitialRender(true);
  }, [members, relationships, currentUserId]);

  return { graphData, isInitialRender, setIsInitialRender };
}
