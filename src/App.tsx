/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  Position,
} from "@xyflow/react";
import { v4 as uuid } from "uuid";
import dagre from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";

import CustomNode from "./Components/CustomNode";
import CustomEdge from "./Components/CustomEdge";
import Sidepanel from "./Components/Sidepanel";
import { useSidepanel } from "./useContext";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  [],
  []
);
const Flow = () => {
  const { isOpen, nodeData, setLayout } = useSidepanel();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layoutedNodes.map((node) => ({
      ...node,
      sourcePosition: node.sourcePosition as Position,
      targetPosition: node.targetPosition as Position,
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds: Edge[]) =>
        addEdge({ ...params, type: "custom-edge", animated: true }, eds)
      ),
    []
  );

  const onLayout = useCallback(
    (direction: "TB" | "LR" | "RL" | "BT") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes(
        layoutedNodes.map((node) => ({
          ...node,
          sourcePosition: node.sourcePosition as Position,
          targetPosition: node.targetPosition as Position,
        }))
      );
      setLayout(direction);
      setEdges(layoutedEdges);
    },
    [nodes, edges]
  );

  const deleteNodeWithChildren = (nodeId: string) => {
    const toDelete = new Set();
    const collectDescendants = (id: string) => {
      toDelete.add(id);
      edges.forEach((edge) => {
        if (edge.source === id) {
          collectDescendants(edge.target);
        }
      });
    };
    collectDescendants(nodeId);

    const remainingNodes = nodes.filter((n) => !toDelete.has(n.id));
    const remainingEdges = edges.filter(
      (e) => !toDelete.has(e.source) && !toDelete.has(e.target)
    );

    const layouted = getLayoutedElements(remainingNodes, remainingEdges);
    setNodes(
      layouted.nodes.map((node) => ({
        ...node,
        sourcePosition: node.sourcePosition as Position,
        targetPosition: node.targetPosition as Position,
      }))
    );
    setEdges(layouted.edges);
  };

  const addChildNode = (type: string, parentId: string) => {
    const newId = uuid();
    const newNode = {
      id: newId,
      type: "custom",
      position: { x: 0, y: 0 }, // Will be auto-laid out
      data: {
        label: type,
        type,
        id: newId,
      },
    };
    const newEdge = {
      id: `e-${parentId}-${newId}`,
      source: parentId,
      target: newId,
      type: "custom-edge",
    };

    const layouted = getLayoutedElements(
      [...nodes, newNode],
      [...edges, newEdge]
    );
    setNodes(
      layouted.nodes.map((node) => ({
        ...node,
        sourcePosition: node.sourcePosition as Position,
        targetPosition: node.targetPosition as Position,
      }))
    );
    setEdges(layouted.edges);
  };

  const allowedChildren = () => {
    if (nodeData.label === "Account") {
      return ["Collateral", "Loan"];
    } else if (nodeData.label === "Loan") {
      return ["Collateral"];
    }
    return [];
  };
  const addRootNode = (type: string) => {
    if (!["Account", "Loan"].includes(type)) return;
    const id = uuid();
    const newNode = {
      id,
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        label: type,
        type,
        id,
      },
    };
    const layouted = getLayoutedElements([...nodes, newNode], edges);
    setNodes(
      layouted.nodes.map((node) => ({
        ...node,
        sourcePosition: node.sourcePosition as Position,
        targetPosition: node.targetPosition as Position,
      }))
    );
    setEdges(layouted.edges);
  };

  return (
    <div className="w-full h-screen">
      <Sidepanel
        isOpen={isOpen}
        node={nodeData}
        onDelete={() => deleteNodeWithChildren(nodeData.id)}
        onAddChild={(childType) => addChildNode(childType, nodeData.id)}
        allowedChildren={allowedChildren()}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ custom: CustomNode }}
        edgeTypes={{ "custom-edge": CustomEdge }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesDraggable={false}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        {nodes.length > 0 && (
          <Panel position="top-right" className="flex items-center">
            <button
              className="bg-blue-500 text-white p-2 px-3 rounded-md mr-2"
              onClick={() => onLayout("TB")}
            >
              <span className="flex items-center">
                Down
                <span className="material-symbols-outlined">
                  arrow_downward
                </span>
              </span>
            </button>
            <button
              className="bg-blue-500 text-white p-2 px-3 rounded-md mr-2"
              onClick={() => onLayout("BT")}
            >
              <span className="flex items-center">
                <span className="material-symbols-outlined">arrow_upward</span>
                Up
              </span>
            </button>
            <button
              className="bg-blue-500 text-white p-2 px-3 rounded-md mr-2"
              onClick={() => onLayout("LR")}
            >
              <span className="flex items-center">
                Right
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </button>
            <button
              className="bg-blue-500 text-white p-2 px-3 rounded-md"
              onClick={() => onLayout("RL")}
            >
              <span className="flex items-center">
                <span className="material-symbols-outlined">arrow_back</span>
                Left
              </span>
            </button>
          </Panel>
        )}

        <Panel position="top-center">
          <p className="text-[#008080] text-center text-5xl font-bold my-3 mb-10">
            Tree Visualizer
          </p>
          <p className="text-gray-700 text-center text-2xl font-bold my-3 mb-10">
            Add Root Node
          </p>
          <div className="flex items-center gap-2 mt-5">
            <button
              className="bg-[#0077cc] text-white p-3 px-3 rounded-md z-10 text-xl w-[180px]"
              onClick={() => addRootNode("Account")}
            >
              <span className="flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">
                  account_balance
                </span>
                Add Account
              </span>
            </button>
            <span className="text-gray-700 mx-4 text-xl">OR</span>
            <button
              className="bg-[#cc4444] text-white p-3 px-3 rounded-md z-10 text-xl w-[180px]"
              onClick={() => addRootNode("Loan")}
            >
              <span className="flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">
                  money_bag
                </span>
                Add Loan
              </span>
            </button>
          </div>
        </Panel>

        <Background />
      </ReactFlow>
    </div>
  );
};

export function App() {
  return <Flow />;
}
