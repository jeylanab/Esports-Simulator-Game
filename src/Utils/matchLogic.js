// src/Utils/matchLogic.js

// ✅ Main simulation function
export function simulateMatch(teamA, teamB, teamAName = "Team A", teamBName = "Team B") {
  if (!Array.isArray(teamA) || teamA.length === 0 || !Array.isArray(teamB) || teamB.length === 0) {
    return {
      winnerName: "Unknown",
      loserName: "Unknown",
      score: "7-5",
      mvp: {
        Player: "Unknown",
        name: "Unknown",
        Team: "N/A",
        K: 0,
        D: 0,
        A: 0,
      },
      playersA: [],
      playersB: [],
      date: new Date().toISOString(),
    };
  }

  const scoreA = getScore(teamA);
  const scoreB = getScore(teamB);

  const isDraw = Math.abs(scoreA - scoreB) < 1.5;
  const userWins = scoreA >= scoreB;

  const winnerName = userWins ? teamAName : teamBName;
  const loserName = userWins ? teamBName : teamAName;

  const finalScore = `${7}-${isDraw ? 6 : Math.floor(Math.random() * 5 + 1)}`;
  const mvp = calculateMVP(userWins ? teamA : teamB);

  return {
    winnerName,
    loserName,
    score: finalScore,
    mvp,
    playersA: teamA.map(p => p.Player || p.name || "Unknown"),
    playersB: teamB.map(p => p.Player || p.name || "Unknown"),
    date: new Date().toISOString(),
  };
}

// ✅ Helper to calculate a random total score
function getScore(team) {
  const avgRating = getAvgRating(team);
  const chemistry = Math.random() * 10;      // Placeholder: Future team chemistry logic
  const upsetFactor = (Math.random() - 0.5) * 10;
  return avgRating + chemistry + upsetFactor;
}

// ✅ Get team average rating
function getAvgRating(team) {
  if (!Array.isArray(team) || team.length === 0) return 0;
  const total = team.reduce((sum, p) => sum + Number(p.Overall || p.rating || 60), 0);
  return total / team.length;
}

// ✅ Get MVP (random best player)
export function calculateMVP(team) {
  if (!Array.isArray(team) || team.length === 0) {
    return {
      Player: "Unknown",
      name: "Unknown",
      Team: "Unknown",
      K: 0,
      D: 0,
      A: 0,
    };
  }

  const player = team[Math.floor(Math.random() * team.length)];

  return {
    Player: player.Player || player.name || "Unknown",
    name: player.Player || player.name || "Unknown",
    Team: player.Team || player.team || "Unknown",
    K: Math.floor(Math.random() * 15) + 10,
    D: Math.floor(Math.random() * 10) + 5,
    A: Math.floor(Math.random() * 8) + 3,
  };
}
