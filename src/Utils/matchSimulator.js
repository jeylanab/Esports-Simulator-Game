export function simulateMatch(teamA, teamB) {
  // 1. Basic Ratings
  const ratingA = teamA.avgRating || 75;
  const ratingB = teamB.avgRating || 75;

  const chemA = teamA.chemistry || 1; // 1 = 100%
  const chemB = teamB.chemistry || 1;

  // 2. Upset factor
  const upset = Math.random() * 10 - 5; // ±5

  const scoreA = ratingA * chemA + upset;
  const scoreB = ratingB * chemB;

  // 3. Determine winner
  const teamAWins = scoreA > scoreB;

  const matchResult = {
    teamA: teamA.name,
    teamB: teamB.name,
    score: teamAWins ? "7–5" : "5–7",
    winner: teamAWins ? teamA.name : teamB.name,
    loser: teamAWins ? teamB.name : teamA.name,
    mvp: pickRandomPlayer(teamAWins ? teamA : teamB),
  };

  return matchResult;
}

function pickRandomPlayer(team) {
  if (!team.players || team.players.length === 0) return "Unknown";
  const player = team.players[Math.floor(Math.random() * team.players.length)];
  return player.Player || player.name || "Unnamed MVP";
}
