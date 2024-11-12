// BranchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BranchContextType {
  branchId: string | null;
  setBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branchId, setBranchId] = useState<string | null>(null);

  return (
    <BranchContext.Provider value={{ branchId, setBranchId }}>
      {children}
    </BranchContext.Provider>
  );
};

// Hook để sử dụng BranchContext
export const useBranch = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
};
