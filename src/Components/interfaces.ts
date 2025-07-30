import type { Node, Edge } from "@xyflow/react";

export interface TreeViewProps {
  nodes: Node[];
  edges: Edge[];
  isOpen: boolean;
  onClose: () => void;
}

export interface TreeNode {
  id: string;
  label: string;
  description: string;
  children: TreeNode[];
}
