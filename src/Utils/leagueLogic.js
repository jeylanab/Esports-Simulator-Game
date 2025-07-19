import teams from '../../data/teams';

// 🌍 List of available host cities
const hostCities = [
  'Paris', 'Boston', 'Berlin', 'Tokyo', 'São Paulo',
  'Copenhagen', 'Montréal', 'Los Angeles', 'Seoul',
  'Barcelona', 'London', 'Stockholm',
];

// 🔢 Average rating for a given team
const getTeamAverageRating = (teamName) => {
  const players = teams[teamName]?.players || [];
  return (
    players.reduce((sum, p) => sum + (p.rating || 1), 0) / players.length
  );
};

// 🧪 Team win chance = rating × chemistry
const getWinChance = (teamName, getTeamChemistry) => {
  const avgRating = getTeamAverageRating(teamName);
  const chemistry = getTeamChemistry(teamName);
  return avgRating * chemistry;
};

// 🏆 Randomized outcome using upset logic
const decideMatch = (teamA, teamB, getTeamChemistry) => {
  const chanceA = getWinChance(teamA, getTeamChemistry);
  const chanceB = getWinChance(teamB, getTeamChemistry);
  const total = chanceA + chanceB;

  const upsetFactor = (Math.random() - 0.5) * 0.2 * total; // ±10%
  const adjustedA = chanceA + upsetFactor;

  return Math.random() < adjustedA / total ? teamA : teamB;
};

// 📅 Round-robin matchday generator
export const generateSchedule = (regionTeams) => {
  const teamsList = [...regionTeams];
  if (teamsList.length % 2 !== 0) teamsList.push(null); // Bye team

  const schedule = [];
  const totalRounds = teamsList.length - 1;
  const half = teamsList.length / 2;

  for (let round = 0; round < totalRounds; round++) {
    const matchday = [];
    for (let i = 0; i < half; i++) {
      const home = teamsList[i];
      const away = teamsList[teamsList.length - 1 - i];
      if (home && away) matchday.push([home, away]);
    }

    // Rotate teams (except fixed first)
    const fixed = teamsList[0];
    const rotated = [fixed, ...teamsList.slice(-1), ...teamsList.slice(1, -1)];
    teamsList.splice(0, teamsList.length, ...rotated);

    schedule.push(matchday);
  }

  return schedule;
};

// ⚙️ Generate random per-player match stats
const generatePlayerStats = () => ({
  kills: Math.floor(Math.random() * 16),
  assists: Math.floor(Math.random() * 8),
  deaths: Math.floor(Math.random() * 12),
  rating: parseFloat((Math.random() * 2).toFixed(2)),
});

// 🧠 Simulate one full matchday
export const simulateMatchday = (
  region,
  matchdayIndex,
  currentResults = {},
  currentStandings = {},
  {
    getTeamChemistry,
    increaseTeamChemistry,
    updatePlayerMatchStats,
    determineMVP,
  }
) => {
  const regionTeams = Object.keys(teams).filter((t) => teams[t].region === region);
  const schedule = generateSchedule(regionTeams);

  if (matchdayIndex >= schedule.length) {
    return { updatedResults: currentResults, matchdayDone: true };
  }

  const matches = schedule[matchdayIndex];
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];
  const newResults = [];

  for (const [teamA, teamB] of matches) {
    const winner = decideMatch(teamA, teamB, getTeamChemistry);

    const score = winner === teamA
      ? `7-${Math.floor(Math.random() * 5) + 2}`
      : `${Math.floor(Math.random() * 5) + 2}-7`;

    const playersA = teams[teamA].players.map((p) => ({ name: p.name, ...generatePlayerStats() }));
    const playersB = teams[teamB].players.map((p) => ({ name: p.name, ...generatePlayerStats() }));
    const allPlayers = [...playersA, ...playersB];

    const mvp = determineMVP(allPlayers);

    allPlayers.forEach((p) => {
      updatePlayerMatchStats(p.name, {
        kills: p.kills,
        assists: p.assists,
        deaths: p.deaths,
        rating: p.rating,
        mvp: p.name === mvp,
      });
    });

    // ⬆️ Standings update
    [teamA, teamB].forEach((team) => {
      if (!currentStandings[team]) {
        currentStandings[team] = { W: 0, L: 0, MP: 0, Points: 0 };
      }
      currentStandings[team].MP += 1;
    });

    if (winner === teamA) {
      currentStandings[teamA].W += 1;
      currentStandings[teamA].Points += 3;
      currentStandings[teamB].L += 1;
    } else {
      currentStandings[teamB].W += 1;
      currentStandings[teamB].Points += 3;
      currentStandings[teamA].L += 1;
    }

    increaseTeamChemistry([teamA, teamB]);

    newResults.push({
      teamA,
      teamB,
      winner,
      score,
      mvp,
      matchday: matchdayIndex + 1,
      hostCity,
    });
  }

  return {
    updatedResults: {
      [region]: [...(currentResults[region] || []), ...newResults],
    },
    updatedStandings: {
      [region]: { ...currentStandings },
    },
    matchdayDone: false,
    hostCity,
  };
};

// 🕹️ Simulate a single match
export const simulateSingleMatch = (
  region,
  matchdayIndex,
  teamA,
  teamB,
  currentResults = [],
  currentStandings = {},
  {
    getTeamChemistry,
    increaseTeamChemistry,
    updatePlayerMatchStats,
    determineMVP,
  }
) => {
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];
  const winner = decideMatch(teamA, teamB, getTeamChemistry);

  const score = winner === teamA
    ? `7-${Math.floor(Math.random() * 5) + 2}`
    : `${Math.floor(Math.random() * 5) + 2}-7`;

  const playersA = teams[teamA].players.map((p) => ({ name: p.name, ...generatePlayerStats() }));
  const playersB = teams[teamB].players.map((p) => ({ name: p.name, ...generatePlayerStats() }));
  const allPlayers = [...playersA, ...playersB];

  const mvp = determineMVP(allPlayers);

  allPlayers.forEach((p) => {
    updatePlayerMatchStats(p.name, {
      kills: p.kills,
      assists: p.assists,
      deaths: p.deaths,
      rating: p.rating,
      mvp: p.name === mvp,
    });
  });

  // Standings logic
  [teamA, teamB].forEach((team) => {
    if (!currentStandings[team]) {
      currentStandings[team] = { W: 0, L: 0, MP: 0, Points: 0 };
    }
    currentStandings[team].MP += 1;
  });

  if (winner === teamA) {
    currentStandings[teamA].W += 1;
    currentStandings[teamA].Points += 3;
    currentStandings[teamB].L += 1;
  } else {
    currentStandings[teamB].W += 1;
    currentStandings[teamB].Points += 3;
    currentStandings[teamA].L += 1;
  }

  increaseTeamChemistry([teamA, teamB]);

  return {
    newMatchResult: {
      teamA,
      teamB,
      winner,
      score,
      mvp,
      matchday: matchdayIndex + 1,
      hostCity,
    },
    updatedStandings: { ...currentStandings },
  };
};
