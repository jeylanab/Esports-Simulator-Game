// src/Game/ChemistryContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ChemistryContext = createContext();

export function useChemistry() {
  return useContext(ChemistryContext);
}

const STORAGE_KEY = 'r6-chemistry';

export function ChemistryProvider({ children }) {
  const [chemistry, setChemistry] = useState({});

  // Load from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setChemistry(JSON.parse(stored));
  }, []);

  // Save on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chemistry));
  }, [chemistry]);

  const increaseChemistry = (teamName) => {
    setChemistry(prev => ({
      ...prev,
      [teamName]: Math.min(1, (prev[teamName] || 0.1) + 0.02),
    }));
  };

  const getChemistry = (teamName) => {
    return chemistry[teamName] || 0.1;
  };

  const resetChemistry = () => {
    setChemistry({});
  };

  const value = {
    chemistry,
    getChemistry,
    increaseChemistry,
    resetChemistry,
  };

  return (
    <ChemistryContext.Provider value={value}>
      {children}
    </ChemistryContext.Provider>
  );
}
