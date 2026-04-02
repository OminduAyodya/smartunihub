import { createContext, useState, useContext } from "react";

const CanteenContext = createContext();

export const CanteenProvider = ({ children }) => {
  const [selectedCanteen, setSelectedCanteen] = useState("anohana");

  const canteens = [
    { id: "anohana", name: "Anohana" },
    { id: "basement", name: "Basement" },
  ];

  return (
    <CanteenContext.Provider value={{ selectedCanteen, setSelectedCanteen, canteens }}>
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error("useCanteen must be used within CanteenProvider");
  }
  return context;
};
