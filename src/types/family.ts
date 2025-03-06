
export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  imageUrl?: string;
  isAlive: boolean;
  metadata?: Record<string, any>;
}

export interface Relationship {
  id: string;
  type: 'parent-child' | 'spouse' | 'sibling';
  from: string; // FamilyMember id
  to: string; // FamilyMember id
  metadata?: Record<string, any>;
}

export interface FamilyTreeData {
  nodes: FamilyMember[];
  links: Relationship[];
}
