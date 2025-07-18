import React, { createContext, useContext, useState } from 'react';

const StatContext = createContext();
export const useStats = () => useContext(StatContext);

export const StatProvider = ({ children }) => {
  const [playerStats, setPlayerStats] = useState({});
  const [goatPoints, setGoatPoints] = useState({});
  const [awards, setAwards] = useState([]);
  const [retiredPlayers, setRetiredPlayers] = useState([]);

  const generateBaseStats = (player) => ({
    kills: 0,
    assists: 0,
    deaths: 0,
    mvps: 0,
    matchRating: [],
    overallKDA: 0,
    chemistry: Math.floor(Math.random() * 40) + 60,
    age: player.age || Math.floor(Math.random() * 12) + 18,
    team: player.team || '',
    region: player.region || '',
    contract: {
      years: Math.floor(Math.random() * 3) + 1,
      wage: Math.floor(Math.random() * 100_000) + 50_000,
    },
    history: [],
    goatPoints: 0,
  });

  const initializePlayers = (players = []) => {
    const updated = { ...playerStats };
    players.forEach((p) => {
      if (!updated[p.name]) {
        updated[p.name] = generateBaseStats(p);
      }
    });
    setPlayerStats(updated);
  };

  const updatePlayerMatchStats = (
    name,
    { kills, assists, deaths, mvp = false, eventName, team, region, rating }
  ) => {
    const stats = playerStats[name];
    if (!stats) return;

    const kda = (kills + assists) / Math.max(1, deaths);
    const newRating = rating || kda;

    const totalKills = stats.kills + kills;
    const totalAssists = stats.assists + assists;
    const totalDeaths = stats.deaths + deaths;
    const overallKDA = totalDeaths === 0 ? totalKills + totalAssists : ((totalKills + totalAssists) / totalDeaths);

    const updated = {
      ...stats,
      kills: totalKills,
      assists: totalAssists,
      deaths: totalDeaths,
      mvps: mvp ? stats.mvps + 1 : stats.mvps,
      overallKDA: parseFloat(overallKDA.toFixed(2)),
      matchRating: [...(stats.matchRating || []), newRating],
      team: team || stats.team,
      region: region || stats.region,
      history: [...stats.history, { event: eventName, kda, mvp }],
    };

    setPlayerStats((prev) => ({ ...prev, [name]: updated }));
  };

  const increaseChemistry = (names = []) => {
    const updated = { ...playerStats };
    names.forEach((name) => {
      if (updated[name]) {
        updated[name].chemistry = Math.min(100, updated[name].chemistry + 1);
      }
    });
    setPlayerStats(updated);
  };

  const progressPlayerAges = () => {
    const updated = { ...playerStats };
    const retirees = [];

    Object.entries(updated).forEach(([name, data]) => {
      data.age += 1;

      if (data.age > 28) {
        data.chemistry = Math.max(50, data.chemistry - Math.floor(Math.random() * 3));
        data.overallKDA = parseFloat((data.overallKDA * 0.95).toFixed(2));
      }

      if (data.age >= 31 && Math.random() < 0.3) {
        retirees.push({ name, ...data });
        delete updated[name];
      }
    });

    setRetiredPlayers((prev) => [...prev, ...retirees]);
    setPlayerStats(updated);
  };

  const processYearlyContracts = () => {
    const updated = { ...playerStats };
    Object.values(updated).forEach((data) => {
      if (data.contract?.years > 0) {
        data.contract.years -= 1;
      }
    });
    setPlayerStats(updated);
  };

  const releaseExpiredContracts = () => {
    const updated = { ...playerStats };
    Object.entries(updated).forEach(([name, data]) => {
      if (data.contract?.years <= 0) {
        delete updated[name];
      }
    });
    setPlayerStats(updated);
  };

  const generateRookies = () => {
    const rookies = {};
    for (let i = 0; i < 10; i++) {
      const name = `Rookie_${Date.now()}_${i}`;
      rookies[name] = generateBaseStats({ age: 18, team: 'Free Agent', region: 'None' });
    }
    setPlayerStats((prev) => ({ ...prev, ...rookies }));
  };

  const calculateEventMVP = (eventName) => {
    let bestPlayer = null;
    let bestScore = -1;

    Object.entries(playerStats).forEach(([name, data]) => {
      const event = data.history.find((h) => h.event === eventName);
      if (!event) return;

      const score = event.kda * (event.mvp ? 1.25 : 1);
      if (score > bestScore) {
        bestScore = score;
        bestPlayer = name;
      }
    });

    if (bestPlayer) {
      setAwards((prev) => [...prev, { type: 'MVP', name: bestPlayer, event: eventName }]);
      setGoatPoints((prev) => ({
        ...prev,
        [bestPlayer]: (prev[bestPlayer] || 0) + 5,
      }));
    }
  };

  const awardGoatPoints = (teamName, playerNames = [], eventType) => {
    const eventValues = {
      League: 250,
      Major: 500,
      Invitational: 1000,
    };
    const teamPoints = eventValues[eventType] || 0;
    const perPlayer = Math.floor(teamPoints * 0.25);

    const updated = { ...goatPoints };
    playerNames.forEach((name) => {
      updated[name] = (updated[name] || 0) + perPlayer;
    });
    setGoatPoints(updated);
  };

  const calculateSeasonAwards = () => {
    const players = Object.entries(playerStats).map(([name, data]) => ({
      name,
      kda: data.overallKDA,
      mvps: data.mvps,
      totalKills: data.kills,
      score: data.mvps * 25 + data.kills * 0.1,
    }));

    players.sort((a, b) => b.score - a.score);

    const poy = players[0];
    const allStars = players.slice(1, 6);

    setAwards((prev) => [
      ...prev,
      { type: 'Player of the Year', name: poy.name },
      ...allStars.map((p) => ({ type: 'All-Star', name: p.name })),
    ]);

    const updated = { ...goatPoints };
    updated[poy.name] = (updated[poy.name] || 0) + 10;
    allStars.forEach((p) => {
      updated[p.name] = (updated[p.name] || 0) + 3;
    });

    setGoatPoints(updated);
  };

  const resetStats = () => {
    setPlayerStats({});
    setGoatPoints({});
    setAwards([]);
    setRetiredPlayers([]);
  };

  const getPlayerStatByName = (name) => {
    return playerStats[name] || null;
  };

  return (
    <StatContext.Provider
      value={{
        playerStats,
        initializePlayers,
        updatePlayerMatchStats,
        increaseChemistry,
        processYearlyContracts,
        releaseExpiredContracts,
        progressPlayerAges,
        generateRookies,
        calculateEventMVP,
        calculateSeasonAwards,
        awardGoatPoints,
        resetStats,
        getPlayerStatByName,
        goatPoints,
        awards,
        retiredPlayers,
      }}
    >
      {children}
    </StatContext.Provider>
  );
};
