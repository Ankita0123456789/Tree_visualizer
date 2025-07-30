import type { TreeNode, TreeViewProps } from "./interfaces";

const TreeView = ({ nodes, edges, isOpen, onClose }: TreeViewProps) => {
  const buildTree = (): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    nodes.forEach((node) => {
      const nodeData = node.data as { label: string; description?: string };
      nodeMap.set(node.id, {
        id: node.id,
        label: nodeData.label || "",
        description: nodeData.description || "",
        children: [],
      });
    });

    edges.forEach((edge) => {
      const parent = nodeMap.get(edge.source);
      const child = nodeMap.get(edge.target);
      if (parent && child) {
        parent.children.push(child);
      }
    });

    const hasIncomingEdge = new Set(edges.map((edge) => edge.target));
    nodes.forEach((node) => {
      if (!hasIncomingEdge.has(node.id)) {
        const rootNode = nodeMap.get(node.id);
        if (rootNode) {
          rootNodes.push(rootNode);
        }
      }
    });

    return rootNodes;
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    return (
      <div key={node.id} className="ml-4">
        <div className="flex items-center py-1">
          <div className="flex items-center">
            {node.children.length > 0 && (
              <span className="text-gray-400 mr-2">├─</span>
            )}
            {node.children.length === 0 && (
              <span className="text-gray-400 mr-2">└─</span>
            )}
            <span className="font-medium text-gray-800">{node.label}</span>
            {node.description && (
              <span className="text-sm text-gray-600 ml-2">
                ({node.description})
              </span>
            )}
          </div>
        </div>
        {node.children.map((child) => (
          <div key={child.id}>{renderTreeNode(child, level + 1)}</div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl border-l border-gray-200 z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Tree View</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600 mb-4">
              Tree Structure View ({nodes.length} nodes)
            </div>
            {buildTree().map((rootNode) => renderTreeNode(rootNode))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeView;
