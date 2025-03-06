
import { FamilyMember, Relationship } from "../types";
import { GraphData, GraphNode, GraphLink } from "../types/graph-types";
import { GENDER_COLORS } from "./graph-constants";

export function prepareGraphData(
  members: FamilyMember[] = [],
  relationships: Relationship[] = [],
  currentUserId?: string | null
): GraphData {
  // Guard against invalid inputs
  const validMembers = Array.isArray(members) ? members : [];
  const validRelationships = Array.isArray(relationships) ? relationships : [];
  
  try {
    // Create nodes from members
    const nodes: GraphNode[] = validMembers.map(member => ({
      id: member.id,
      name: `${member.first_name || 'Unknown'} ${member.last_name || ''}`.trim(),
      gender: member.gender || undefined,
      color: member.gender ? GENDER_COLORS[member.gender as keyof typeof GENDER_COLORS] || GENDER_COLORS.default : GENDER_COLORS.default,
      photoUrl: member.photo_url || undefined,
      isCurrentUser: member.id === currentUserId,
      birthDate: member.birth_date,
      deathDate: member.death_date,
      isDeceased: !!member.death_date
    }));
    
    // Create links from relationships
    const links: GraphLink[] = validRelationships.map(rel => ({
      source: rel.person1_id,
      target: rel.person2_id,
      type: rel.relationship_type,
      notes: rel.notes || undefined
    }));
    
    return { nodes, links };
  } catch (error) {
    console.error("Error preparing graph data:", error);
    return { nodes: [], links: [] };
  }
}
