
// Gender-based node colors
export const GENDER_COLORS = {
  Male: "#0EA5E9",   // Ocean blue
  Female: "#D946EF", // Magenta pink
  Other: "#8B5CF6",  // Vivid purple
  default: "#64748B" // Slate gray for unknown
};

// Map relationship types to colors and styles
export const RELATIONSHIP_STYLES: Record<string, { color: string; dashed?: boolean; width: number }> = {
  parent: { color: "#3498DB", width: 1.5 },
  child: { color: "#3498DB", width: 1.5 },
  spouse: { color: "#E74C3C", width: 2 },
  sibling: { color: "#2ECC71", width: 1.5 },
  "step-parent": { color: "#999", dashed: true, width: 1 },
  "step-child": { color: "#999", dashed: true, width: 1 },
  "in-law": { color: "#999", dashed: true, width: 1 },
  default: { color: "#999", dashed: true, width: 1 }
};

// Helper to get relationship style
export const getRelationshipStyle = (type: string) => {
  return RELATIONSHIP_STYLES[type] || RELATIONSHIP_STYLES.default;
};
