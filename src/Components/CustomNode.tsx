import { Handle, Position } from "@xyflow/react";
import { useSidepanel } from "../useContext";
import { colors } from "../initialElements";

const CustomNode = (props: {
  id: string;
  data: { label: string; description?: string };
}) => {
  const { setIsOpen, setNodeData, layout } = useSidepanel();
  const handleClick = () => {
    setIsOpen(true);
    setNodeData({
      id: props.id,
      label: props.data.label,
      description: props.data.description || "",
    });
  };

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
      <div
        className={`w-[180px] flex flex-col items-center justify-center rounded-md text-white font-bold min-h-[60px]`}
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
        <div
          className={`flex flex-col items-center justify-center text-center`}
        >
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined">{icon()}</span>
            <label htmlFor="text">{props.data.description}</label>
          </div>
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
