import React, { createContext, useContext, useState } from "react";

type SuggestionSwitchContextType = {
  suggestionEnabled: boolean;
  setSuggestionEnabled: (value: boolean) => void;
};

const SuggestionSwitchContext = createContext<SuggestionSwitchContextType | undefined>(undefined);

export const SuggestionSwitchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suggestionEnabled, setSuggestionEnabled] = useState(false);

  return (
    <SuggestionSwitchContext.Provider value={{ suggestionEnabled, setSuggestionEnabled }}>
      {children}
    </SuggestionSwitchContext.Provider>
  );
};

export function useSuggestionSwitch() {
  const context = useContext(SuggestionSwitchContext);
  if (!context) throw new Error("useSuggestionSwitch must be used within SuggestionSwitchProvider");
  return context;
}