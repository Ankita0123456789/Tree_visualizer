import { useEffect, useRef } from "react";
import { useSidepanel } from "../useContext";
import { colors } from "../initialElements";

const Sidepanel = ({
  isOpen,
  onDelete,
  onAddChild,
  allowedChildren,
  node,
  onAddRootNode,
  isRootNode,
  setIsRootNode,
}: {
  isOpen: boolean;
  onDelete: (id: string) => void;
  onAddChild: (id: string, childType: string, description?: string) => void;
  onAddRootNode: (type: string, description?: string) => void;
  allowedChildren: string[];
  node: {
    id: string;
    label: string;
    description?: string;
  };
  isRootNode: boolean;
  setIsRootNode: (isRootNode: boolean) => void;
}) => {
  const { setIsOpen, setNodeData, nodeData } = useSidepanel();
  const sidepanelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidepanelRef.current &&
        !sidepanelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setNodeData({ id: "", label: "", description: "" });
        setIsRootNode(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const input = () => {
    return (
      <input
        type="text"
        placeholder="Enter Node Name"
        className="w-full p-2 border border-gray-300 rounded-md dark:text-black"
        onChange={(e) =>
          setNodeData({ ...nodeData, description: e.target.value })
        }
      />
    );
  };

  return (
    <>
      {isOpen && (
        <div
          ref={sidepanelRef}
          className="fixed top-0 left-0 w-80 h-full shadow-xl border-r border-gray-200 z-50 p-4 overflow-y-auto bg-white"
        >
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Node Details
            </h3>
            <div className="w-12 h-1 bg-blue-500 rounded"></div>
          </div>

          {/* Node Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <span
                  className="text-sm font-semibold text-white bg-blue-100 px-3 py-1 rounded-full"
                  style={{
                    background: colors[node.label as keyof typeof colors],
                  }}
                >
                  {node.label}
                </span>
              </div>
              {node.id && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded">
                    {node.id}
                  </span>
                </div>
              )}
              {node.description && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Description:
                  </span>
                  <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded max-w-[200px] text-right">
                    {node.description}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add Child Section */}
          {isRootNode && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="material-symbols-outlined text-green-600">
                  add
                </span>
                Add Root Node
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {input()}

                <button
                  key={node.label}
                  onClick={() => onAddRootNode(node.label, node.description)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  style={{
                    background: colors[node.label as keyof typeof colors],
                  }}
                >
                  {node.label}
                </button>
              </div>
            </div>
          )}
          {allowedChildren.length > 0 && !isRootNode && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="material-symbols-outlined text-green-600">
                  add
                </span>
                Add Child
              </h4>

              <div className="grid grid-cols-1 gap-2">
                {input()}
                {allowedChildren.map((childType) => (
                  <button
                    key={childType}
                    onClick={() =>
                      onAddChild(childType, node.description ?? "", node.id)
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    style={{
                      background: colors[childType as keyof typeof colors],
                    }}
                  >
                    {childType}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions Section */}
          {node.id && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Actions
              </h4>

              <button
                onClick={() => onDelete(node.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">delete</span>
                Delete Node & Descendants
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidepanel;
