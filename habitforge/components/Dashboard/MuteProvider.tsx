"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface MuteContextType {
  muted: boolean;
  setMuted: (value: boolean) => void;
}

// Create context
const MuteContext = createContext<MuteContextType>({
  muted: false,
  setMuted: () => {},
});

// Create provider
export const MuteProvider = ({ children }: { children: ReactNode }) => {
  const [muted, setMuted] = useState(false);

  return (
    <MuteContext.Provider value={{ muted, setMuted }}>
      {children}
    </MuteContext.Provider>
  );
};

// Custom hook to consume the context
export const useMute = () => useContext(MuteContext);
