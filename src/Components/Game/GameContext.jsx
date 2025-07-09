// src/Components/Game/GameContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseDate, formatDate, getNextDate } from '../../Utils/dateUtils';

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
  const [userTeam, setUserTeam] = useState([]);
  const [budget, setBudget] = useState(1_000_000);

  // 🗓️ Simulation starts from Jan 1, 2026
  const [currentDate, setCurrentDate] = useState("2026-01-01");

  const advanceDay = () => {
    const next = getNextDate(currentDate);
    setCurrentDate(next);
  };

  // 🎯 Auto inbox triggers (dates must be in 'YYYY-MM-DD')
  useEffect(() => {
    const eventTriggers = {
      "2026-01-03": {
        title: "🏁 Transfer Window Opens",
        body: "You can now sign free agents. Keep an eye on your inbox.",
      },
      "2026-03-03": {
        title: "⚔️ Stage 1 Begins",
        body: "Your regional league starts today! Time to compete.",
      },
      "2026-05-05": {
        title: "🌍 Stage 1 Major Begins",
        body: "Top teams face off in the first international Major!",
      },
      "2026-08-05": {
        title: "🏆 Siege X Starts!",
        body: "The Esports World Cup is here with $2M prize pool!",
      },
      "2026-09-29": {
        title: "📦 Season Ending Soon",
        body: "Prepare for awards, retirements, and rookie draft.",
      },
    };

    if (eventTriggers[currentDate]) {
      const event = eventTriggers[currentDate];
      setInbox((prev) => [
        {
          key: `event_${currentDate}`,
          title: event.title,
          body: event.body,
          date: currentDate,
        },
        ...prev,
      ]);
    }
  }, [currentDate]);

  function signPlayer(player) {
    const alreadySigned = userTeam.some((p) => p.Player === player.Player);
    const cost = 250_000;

    if (alreadySigned) {
      alert(`${player.Player} is already on your team.`);
      return;
    }

    if (budget < cost) {
      alert(`You don’t have enough budget to sign ${player.Player}.`);
      return;
    }

    setUserTeam((prev) => [...prev, player]);
    setBudget((prev) => prev - cost);

    const message = {
      key: `signed_${player.Player}`,
      title: `📝 Player Signed: ${player.Player}`,
      body: `${player.Player} has joined your roster for $${cost.toLocaleString()}.`,
      date: currentDate,
    };
    setInbox((prev) => [message, ...prev]);
  }

  return (
    <GameContext.Provider
      value={{
        inbox,
        setInbox,
        userTeam,
        setUserTeam,
        budget,
        setBudget,
        signPlayer,
        currentDate,
        setCurrentDate,
        advanceDay,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
