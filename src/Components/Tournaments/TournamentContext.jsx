// src/Components/Tournaments/TournamentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [stage1QualifiedTeams, setStage1QualifiedTeams] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("stage1QualifiedTeams");
    if (saved) {
      setStage1QualifiedTeams(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stage1QualifiedTeams", JSON.stringify(stage1QualifiedTeams));
  }, [stage1QualifiedTeams]);

  const updateStage1Qualifiers = (region, teams) => {
    setStage1QualifiedTeams(prev => ({
      ...prev,
      [region]: teams
    }));
  };

  return (
    <TournamentContext.Provider value={{ stage1QualifiedTeams, updateStage1Qualifiers }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = () => useContext(TournamentContext);
