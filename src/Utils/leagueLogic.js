import { simulateMatch } from './matchLogic';
import teams from '../../data/teams';

// Host cities (used for random assignment per matchday)
const hostCities = [
  'Paris', 'Boston', 'Berlin', 'Tokyo', 'São Paulo',
  'Copenhagen', 'Montréal', 'Los Angeles', 'Seoul',
  'Barcelona', 'London', 'Stockholm'
];

// ✅ Generate round-robin schedule
export function generateSchedule(regionTeams) {
  const teamsList = [...regionTeams];

  if (teamsList.length % 2 !== 0) {
    teamsList.push(null); // Add a dummy team for odd count
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

    // Rotate teams (skip the first one)
    const fixed = teamsList[0];
    const rotated = [fixed, ...teamsList.slice(-1), ...teamsList.slice(1, -1)];
    teamsList.splice(0, teamsList.length, ...rotated);

    schedule.push(matchday);
  }

  return schedule;
}

// ✅ Simulate one matchday (returns updated results + standings + host city)
export function simulateMatchday(region, matchdayIndex, currentResults = [], currentStandings = {}) {
  const regionTeams = Object.keys(teams).filter(
    (name) => teams[name].region === region
  );

  const schedule = generateSchedule(regionTeams);

  if (matchdayIndex >= schedule.length) {
    return { updatedResults: currentResults, matchdayDone: true };
  }

  const matches = schedule[matchdayIndex];

  // Randomly select host city
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];

  const newResults = matches.map(([teamA, teamB]) => {
    const result = simulateMatch(teams[teamA].players, teams[teamB].players);
    const { winnerName, score, mvp } = result;

    // Update standings
    const update = (team, win) => {
      if (!currentStandings[team]) {
        currentStandings[team] = { W: 0, L: 0, MP: 0, Points: 0 };
      }
      currentStandings[team].MP += 1;
      if (win) {
        currentStandings[team].W += 1;
        currentStandings[team].Points += 3;
      } else {
        currentStandings[team].L += 1;
      }
    };

    update(teamA, winnerName === teamA);
    update(teamB, winnerName === teamB);

    return {
      teamA,
      teamB,
      winner: winnerName,
      score,
      mvp,
      matchday: matchdayIndex + 1, // 1-based matchday
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
