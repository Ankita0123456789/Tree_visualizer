import { BaseEdge } from "@xyflow/react";
import { useSidepanel } from "../useContext";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) => {
  const { layout } = useSidepanel();

  const getEdgePath = () => {
    switch (layout) {
      case "TB": {
        // Top to Bottom
        const centerY = (targetY - sourceY) / 2 + sourceY;
        return `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;
      }

      case "BT": {
        // Bottom to Top
        const centerYBT = (sourceY - targetY) / 2 + targetY;
        return `M ${sourceX} ${sourceY} L ${sourceX} ${centerYBT} L ${targetX} ${centerYBT} L ${targetX} ${targetY}`;
      }

      case "LR": {
        // Left to Right
        const centerX = (targetX - sourceX) / 2 + sourceX;
        return `M ${sourceX} ${sourceY} L ${centerX} ${sourceY} L ${centerX} ${targetY} L ${targetX} ${targetY}`;
      }

      case "RL": {
        // Right to Left
        const centerXRL = (sourceX - targetX) / 2 + targetX;
        return `M ${sourceX} ${sourceY} L ${centerXRL} ${sourceY} L ${centerXRL} ${targetY} L ${targetX} ${targetY}`;
      }

      default: {
        // Default to TB layout
        const defaultCenterY = (targetY - sourceY) / 2 + sourceY;
        return `M ${sourceX} ${sourceY} L ${sourceX} ${defaultCenterY} L ${targetX} ${defaultCenterY} L ${targetX} ${targetY}`;
      }
    }
  };

  return (
    <BaseEdge id={id} path={getEdgePath()} stroke="#b1b1b7" strokeWidth={2} />
  );
};

export default CustomEdge;
