
export type StandardRelationshipType = "parent" | "child" | "spouse" | "sibling";

export const STANDARD_RELATIONSHIP_TYPES: StandardRelationshipType[] = [
  "parent",
  "child",
  "spouse",
  "sibling"
];

export const isStandardType = (type: string): type is StandardRelationshipType => {
  return STANDARD_RELATIONSHIP_TYPES.includes(type as StandardRelationshipType);
};
