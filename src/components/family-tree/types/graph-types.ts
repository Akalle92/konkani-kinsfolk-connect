
export interface GraphNode {
  id: string;
  name: string;
  gender?: string;
  color?: string;
  x?: number;
  y?: number;
  photoUrl?: string;
  isCurrentUser?: boolean;
  isDeceased?: boolean;
  birthDate?: string;
  deathDate?: string;
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

export type NodeClickHandler = (node: GraphNode) => void;

export interface FamilyTreeGraphProps {
  members: GraphNode[];
  relationships: GraphLink[];
  currentUserId?: string | null;
  className?: string;
  onNodeClick?: NodeClickHandler;
  onEditMember?: (memberId: string) => void;
  onAddRelative?: (memberId: string) => void;
}

export interface GraphControls {
  zoom: (factor: number) => void;
  center: () => void;
  focusNode: (nodeId: string) => void;
  filterByGender?: (gender: string | null) => void;
  filterByGeneration?: (generation: number | null) => void;
  toggleShowImages?: () => void;
  toggleCompactMode?: () => void;
}
