import { createContext, useContext } from "react";

export const CanteenContext = createContext();

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error("useCanteen must be used within CanteenProvider");
  }
  return context;
};
