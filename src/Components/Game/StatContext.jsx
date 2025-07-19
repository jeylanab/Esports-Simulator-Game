import React, { createContext, useContext, useState, useEffect } from 'react';

const StatContext = createContext();
export const useStats = () => useContext(StatContext);

export const StatProvider = ({ children }) => {
  const [playerStats, setPlayerStats] = useState({});
  const [teamChemistry, setTeamChemistry] = useState({});
  const [results, setResults] = useState({});
  const [standings, setStandings] = useState({});

  // 🔁 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('esportsGameData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlayerStats(parsed.playerStats || {});
      setTeamChemistry(parsed.teamChemistry || {});
      setResults(parsed.results || {});
      setStandings(parsed.standings || {});
    }
  }, []);

  // 💾 Save to localStorage
  useEffect(() => {
    const gameData = {
      playerStats,
      teamChemistry,
      results,
      standings,
    };
    localStorage.setItem('esportsGameData', JSON.stringify(gameData));
  }, [playerStats, teamChemistry, results, standings]);

  // 🔁 Initialize player stats + chemistry
  const initializePlayers = (players, teamName = null) => {
    const newStats = {};
    const newChem = { ...teamChemistry };

    players.forEach((player) => {
      if (!playerStats[player.name]) {
        newStats[player.name] = {
          kills: 0,
          assists: 0,
          deaths: 0,
          rating: 0,
          matchesPlayed: 0,
          mvp: 0,
          roundsSurvived: 0,
        };
      }
    });

    if (teamName && !newChem[teamName]) {
      newChem[teamName] = parseFloat((Math.random() * 0.15 + 0.15).toFixed(2)); // 0.15 - 0.3
    }

    setPlayerStats((prev) => ({ ...prev, ...newStats }));
    setTeamChemistry(newChem);
  };

  // 🔼 Update per-match stats
  const updatePlayerMatchStats = (playerName, matchStats) => {
    setPlayerStats((prevStats) => {
      const prev = prevStats[playerName] || {};
      const updated = {
        ...prev,
        kills: (prev.kills || 0) + matchStats.kills,
        assists: (prev.assists || 0) + matchStats.assists,
        deaths: (prev.deaths || 0) + matchStats.deaths,
        roundsSurvived: (prev.roundsSurvived || 0) + (matchStats.roundsSurvived || 0),
        matchesPlayed: (prev.matchesPlayed || 0) + 1,
        rating: matchStats.rating || prev.rating,
        mvp: prev.mvp + (matchStats.mvp ? 1 : 0),
      };
      return { ...prevStats, [playerName]: updated };
    });
  };

  // ➕ Gradually increase team chemistry
  const increaseTeamChemistry = (teamNames = []) => {
    const newChem = { ...teamChemistry };
    teamNames.forEach((team) => {
      const current = newChem[team] ?? 0.3;
      const increment = current < 0.5 ? 0.03 : 0.015; // Slower growth after 0.5
      newChem[team] = Math.min(1.0, current + increment);
    });
    setTeamChemistry(newChem);
  };

  // 📈 Get chemistry value
  const getTeamChemistry = (teamName) => {
    return parseFloat((teamChemistry[teamName] ?? 0.4).toFixed(3));
  };

  // 🧮 Win probability = rating × chemistry
  const calculateWinChance = (avgRating, teamName) => {
    const chemistry = getTeamChemistry(teamName);
    return avgRating * chemistry;
  };

  // 🏆 MVP Calculation (adjusted KDA + weight)
  const determineMVP = (players, stage = 'group') => {
    let topPlayer = null;
    let topScore = -Infinity;

    players.forEach((player) => {
      const stats = playerStats[player.name];
      if (!stats) return;

      const kda = (stats.kills + stats.assists) / Math.max(1, stats.deaths);

      let multiplier = 1.0;
      if (stage === 'playoffs') multiplier += 0.10;
      else if (stage === 'grand_final') multiplier += 0.15;
      else if (stage === 'winner') multiplier += 0.25;

      const adjustedScore = kda * multiplier;

      const tieBreaker = (p1, p2) => {
        if (!p2) return 1;
        const s1 = playerStats[p1.name], s2 = playerStats[p2.name];
        if (s1.kills !== s2.kills) return s1.kills - s2.kills;
        if (s1.roundsSurvived !== s2.roundsSurvived) return s1.roundsSurvived - s2.roundsSurvived;
        return Math.random() < 0.5 ? 1 : -1;
      };

      if (
        adjustedScore > topScore ||
        (adjustedScore === topScore && tieBreaker(player, topPlayer) > 0)
      ) {
        topScore = adjustedScore;
        topPlayer = player;
      }
    });

    return topPlayer?.name || null;
  };

  return (
    <StatContext.Provider
      value={{
        playerStats,
        setPlayerStats,
        teamChemistry,
        setTeamChemistry,
        results,
        setResults,
        standings,
        setStandings,
        initializePlayers,
        updatePlayerMatchStats,
        increaseTeamChemistry,
        getTeamChemistry,
        calculateWinChance,
        determineMVP,
      }}
    >
      {children}
    </StatContext.Provider>
  );
};
