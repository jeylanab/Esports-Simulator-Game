import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);

  return (
    <GameContext.Provider value={{ inbox, setInbox }}>
      {children}
    </GameContext.Provider>
  );
};
