import { createContext, useContext } from "react";

export const SidepanelContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  nodeData: {
    id: string;
    label: string;
    description: string;
  };
  setNodeData: (nodeData: {
    id: string;
    label: string;
    description: string;
  }) => void;
  layout: string;
  setLayout: (layout: string) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  nodeData: {
    id: "",
    label: "",
    description: "",
  },
  setNodeData: () => {},
  layout: "TB",
  setLayout: () => {},
});

export const useSidepanel = () => {
  return useContext(SidepanelContext);
};
