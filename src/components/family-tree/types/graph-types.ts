
export interface GraphNode {
  id: string;
  name: string;
  gender?: string;
  color?: string;
  x?: number;
  y?: number;
  photoUrl?: string;
  isCurrentUser?: boolean;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  notes?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface FamilyTreeGraphProps {
  members: any[];
  relationships: any[];
  currentUserId?: string | null;
  className?: string;
}
