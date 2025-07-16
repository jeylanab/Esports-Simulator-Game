// src/Components/Tournaments/TournamentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [stage1QualifiedTeams, setStage1QualifiedTeams] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("stage1QualifiedTeams");
    if (saved) {
      try {
        setStage1QualifiedTeams(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved LCQ teams", e);
        localStorage.removeItem("stage1QualifiedTeams");
      }
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    if (Object.keys(stage1QualifiedTeams).length === 4) {
      localStorage.setItem("stage1QualifiedTeams", JSON.stringify(stage1QualifiedTeams));
    }
  }, [stage1QualifiedTeams]);

  // Used from LCQView to update qualifiers
  const updateStage1Qualifiers = (region, teams) => {
    if (!region || !teams || teams.length !== 2) {
      console.warn("Invalid region or team list for qualifiers.");
      return;
    }

    setStage1QualifiedTeams(prev => ({
      ...prev,
      [region]: teams
    }));
  };

  const resetStage1Qualifiers = () => {
    setStage1QualifiedTeams({});
    localStorage.removeItem("stage1QualifiedTeams");
  };

  return (
    <TournamentContext.Provider value={{ 
      stage1QualifiedTeams, 
      updateStage1Qualifiers, 
      resetStage1Qualifiers 
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = () => useContext(TournamentContext);
