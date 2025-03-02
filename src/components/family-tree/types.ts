
export interface FamilyMember {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender?: string | null;
  birth_date?: string | null;
}

export interface Relationship {
  id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: "parent" | "child" | "spouse" | "sibling";
}

export interface FamilyTreeVisualizationProps {
  members: FamilyMember[];
  relationships: Relationship[];
}
