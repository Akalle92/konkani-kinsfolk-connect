
// Gender-based node colors
export const GENDER_COLORS = {
  Male: "#0EA5E9",   // Ocean blue
  Female: "#D946EF", // Magenta pink
  Other: "#8B5CF6",  // Vivid purple
  default: "#64748B" // Slate gray for unknown
};

// Map relationship types to colors and styles
export const RELATIONSHIP_STYLES: Record<string, { color: string; dashed?: boolean; width: number }> = {
  parent: { color: "#555", width: 1 },
  child: { color: "#555", width: 1 },
  spouse: { color: "#E11D48", width: 2 },
  sibling: { color: "#3B82F6", width: 1 },
  "step-parent": { color: "#555", dashed: true, width: 1 },
  "step-child": { color: "#555", dashed: true, width: 1 },
  "in-law": { color: "#9333EA", dashed: true, width: 1 },
  default: { color: "#22C55E", dashed: true, width: 1.5 }
};

// Helper to get relationship style
export const getRelationshipStyle = (type: string) => {
  return RELATIONSHIP_STYLES[type] || RELATIONSHIP_STYLES.default;
};
