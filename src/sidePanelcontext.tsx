import { useState } from "react";
import { SidepanelContext } from "./useContext";

export const SidepanelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodeData, setNodeData] = useState({ id: "", label: "", description: "" });
  const [layout, setLayout] = useState("TB");
  return (
    <SidepanelContext.Provider
      value={{
        isOpen,
        setIsOpen,
        nodeData,
        setNodeData,
        layout,
        setLayout
      }}
    >
      {children}
    </SidepanelContext.Provider>
  );
};
