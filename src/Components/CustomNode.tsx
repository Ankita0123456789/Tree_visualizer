import { Handle, Position } from "@xyflow/react";
import { useSidepanel } from "../useContext";
import { colors } from "../initialElements";
// import { useState } from "react";

const CustomNode = (props: { id: string; data: { label: string } }) => {
  const { setIsOpen, setNodeData, layout } = useSidepanel();
  const handleClick = () => {
    setIsOpen(true);
    setNodeData({ id: props.id, label: props.data.label });
  };
  console.log(layout);
  const icon = () => {
    if (props.data.label === "Collateral") {
      return "home";
    } else if (props.data.label === "Loan") {
      return "money_bag";
    } else {
      return "account_balance";
    }
  };
  return (
    <>
      {" "}
      <div
        className={`w-[150px] flex items-center justify-center py-2 px-4 rounded-md text-white font-bold `}
        style={{
          background: colors[props.data.label as keyof typeof colors],
        }}
        onClick={() => handleClick()}
      >
        <Handle
          type="target"
          position={
            ["TB", "BT"].includes(layout) ? Position.Top : Position.Left
          }
        />
        <div className={`flex items-center gap-1 justify-cente`}>
          <span className="material-symbols-outlined">{icon()}</span>
          <label htmlFor="text">{props.data.label}</label>
        </div>
        <Handle
          type="source"
          position={
            ["TB", "BT"].includes(layout) ? Position.Bottom : Position.Right
          }
        />
      </div>
    </>
  );
};

export default CustomNode;
