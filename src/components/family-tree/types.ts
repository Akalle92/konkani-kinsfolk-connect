
export interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string | null;
  middle_name?: string | null;
  birth_date?: string | null;
  birth_place?: string | null;
  photo_url?: string | null;
  notes?: string | null;
}

export interface Relationship {
  id: string;
  tree_id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: string;
  notes?: string | null;
}
