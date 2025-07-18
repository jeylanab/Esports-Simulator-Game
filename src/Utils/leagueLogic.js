import { simulateMatch } from './matchLogic';
import teams from '../../data/teams';

// 🔌 External context setter for player stat updates
let statContext = null;
export function setStatContext(context) {
  statContext = context;
}

// 🏙️ Predefined host cities
const hostCities = [
  'Paris', 'Boston', 'Berlin', 'Tokyo', 'São Paulo',
  'Copenhagen', 'Montréal', 'Los Angeles', 'Seoul',
  'Barcelona', 'London', 'Stockholm'
];

// 📅 Generate a round-robin schedule for teams
export function generateSchedule(regionTeams) {
  const teamsList = [...regionTeams];

  if (teamsList.length % 2 !== 0) {
    teamsList.push(null); // Add a dummy team for bye weeks
  }

  const schedule = [];
  const totalRounds = teamsList.length - 1;
  const half = teamsList.length / 2;

  for (let round = 0; round < totalRounds; round++) {
    const matchday = [];

    for (let i = 0; i < half; i++) {
      const home = teamsList[i];
      const away = teamsList[teamsList.length - 1 - i];
      if (home && away) {
        matchday.push([home, away]);
      }
    }

    const fixed = teamsList[0];
    const rotated = [fixed, ...teamsList.slice(-1), ...teamsList.slice(1, -1)];
    teamsList.splice(0, teamsList.length, ...rotated);

    schedule.push(matchday);
  }

  return schedule;
}

// 🧠 Simulate a full matchday, update results, standings, player stats
export function simulateMatchday(region, matchdayIndex, currentResults = {}, currentStandings = {}) {
  const regionTeams = Object.keys(teams).filter(t => teams[t].region === region);
  const schedule = generateSchedule(regionTeams);

  if (matchdayIndex >= schedule.length) {
    return { updatedResults: currentResults, matchdayDone: true };
  }

  const matches = schedule[matchdayIndex];
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];

  const newResults = matches.map(([teamA, teamB]) => {
    const result = simulateMatch(
      teams[teamA].players,
      teams[teamB].players,
      teamA,
      teamB
    );

    const { winnerName, score, mvp, playerStats } = result;

    // 🧩 Update player stats via StatContext
    if (statContext && statContext.updatePlayerMatchStats) {
      const allPlayers = [...teams[teamA].players, ...teams[teamB].players];

      allPlayers.forEach((player) => {
        const pStats = playerStats[player.name];
        if (pStats) {
          statContext.updatePlayerMatchStats(player.name, {
            kills: pStats.kills,
            assists: pStats.assists,
            deaths: pStats.deaths,
            rating: pStats.rating,
            team: winnerName,
            region: teams[teamA].region,
            mvp: mvp === player.name,
            eventName: `Matchday ${matchdayIndex + 1}`,
          });
        }
      });

      statContext.increaseChemistry(allPlayers.map(p => p.name));
    }

    // 🏆 Update standings
    [teamA, teamB].forEach(team => {
      if (!currentStandings[team]) {
        currentStandings[team] = { W: 0, L: 0, MP: 0, Points: 0 };
      }
      currentStandings[team].MP += 1;
    });

    if (winnerName === teamA) {
      currentStandings[teamA].W += 1;
      currentStandings[teamA].Points += 3;
      currentStandings[teamB].L += 1;
    } else if (winnerName === teamB) {
      currentStandings[teamB].W += 1;
      currentStandings[teamB].Points += 3;
      currentStandings[teamA].L += 1;
    }

    return {
      teamA,
      teamB,
      winner: winnerName,
      score,
      mvp,
      matchday: matchdayIndex + 1,
      hostCity,
    };
  });

  const updatedResults = {
    [region]: [...(currentResults[region] || []), ...newResults],
  };

  const updatedStandings = {
    [region]: { ...currentStandings },
  };

  return {
    updatedResults,
    updatedStandings,
    matchdayDone: false,
    hostCity,
  };
}

// 🕹️ Simulate a single exhibition match
export function simulateSingleMatch(region, matchdayIndex, teamA, teamB, currentResults = [], currentStandings = {}) {
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];

  const result = simulateMatch(
    teams[teamA].players,
    teams[teamB].players,
    teamA,
    teamB
  );

  const { winnerName, score, mvp, playerStats } = result;

  // 🧩 Update player stats
  if (statContext && statContext.updatePlayerMatchStats) {
    const allPlayers = [...teams[teamA].players, ...teams[teamB].players];

    allPlayers.forEach((player) => {
      const pStats = playerStats[player.name];
      if (pStats) {
        statContext.updatePlayerMatchStats(player.name, {
          kills: pStats.kills,
          assists: pStats.assists,
          deaths: pStats.deaths,
          rating: pStats.rating,
          team: winnerName,
          region: teams[teamA].region,
          mvp: mvp === player.name,
          eventName: `Friendly Matchday ${matchdayIndex + 1}`,
        });
      }
    });

    statContext.increaseChemistry(allPlayers.map(p => p.name));
  }

  // 🏆 Standings update
  [teamA, teamB].forEach(team => {
    if (!currentStandings[team]) {
      currentStandings[team] = { W: 0, L: 0, MP: 0, Points: 0 };
    }
    currentStandings[team].MP += 1;
  });

  if (winnerName === teamA) {
    currentStandings[teamA].W += 1;
    currentStandings[teamA].Points += 3;
    currentStandings[teamB].L += 1;
  } else if (winnerName === teamB) {
    currentStandings[teamB].W += 1;
    currentStandings[teamB].Points += 3;
    currentStandings[teamA].L += 1;
  }

  const newMatchResult = {
    teamA,
    teamB,
    winner: winnerName,
    score,
    mvp,
    matchday: matchdayIndex + 1,
    hostCity,
  };

  return {
    newMatchResult,
    updatedStandings: { ...currentStandings },
  };
}
