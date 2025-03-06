
import { FamilyMember, Relationship } from "../types";
import { GraphData, GraphNode, GraphLink } from "../types/graph-types";
import { GENDER_COLORS } from "./graph-constants";

export function prepareGraphData(
  members: FamilyMember[] | undefined | null,
  relationships: Relationship[] | undefined | null,
  currentUserId?: string | null
): GraphData {
  if (!members || !Array.isArray(members) || members.length === 0) {
    console.log("No members provided to prepareGraphData");
    return { nodes: [], links: [] };
  }

  if (!relationships || !Array.isArray(relationships)) {
    console.log("No relationships provided to prepareGraphData");
    relationships = [];
  }

  console.log("Preparing graph data with", members.length, "members and", relationships.length, "relationships");

  const nodes: GraphNode[] = members.map((member) => {
    const isDeceased = member.death_date != null && member.death_date !== "";
    
    return {
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      gender: member.gender || "unknown",
      color: GENDER_COLORS[member.gender || "unknown"] || GENDER_COLORS.unknown,
      photoUrl: member.photo_url || undefined,
      isCurrentUser: member.id === currentUserId,
      isDeceased: isDeceased,
      birthDate: member.birth_date || undefined,
      deathDate: member.death_date || undefined,
    };
  });

  const links: GraphLink[] = relationships.map((rel) => ({
    source: rel.person1_id,
    target: rel.person2_id,
    type: rel.relationship_type,
    notes: rel.notes || undefined,
  }));

  console.log("Prepared graph data:", nodes.length, "nodes,", links.length, "links");
  return { nodes, links };
}
