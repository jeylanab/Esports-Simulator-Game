// src/Utils/tournamentLogic.js

import teams from '../../data/teams';

export function simulateTournamentMatch(teamA, teamB) {
  const teamAStats = teams[teamA];
  const teamBStats = teams[teamB];

  const ratingA = averageRating(teamAStats.players);
  const ratingB = averageRating(teamBStats.players);

  const winChance = ratingA / (ratingA + ratingB);
  const winner = Math.random() < winChance ? teamA : teamB;

  const score = generateScore();
  const mvp = pickMVP(teams[winner].players);

  return {
    teamA,
    teamB,
    winner,
    score,
    mvp
  };
}

function averageRating(players) {
  return (
    players.reduce((sum, p) => sum + p.rating, 0) / players.length
  );
}

function generateScore() {
  const team1 = 7;
  const team2 = Math.floor(Math.random() * 5) + 3; // Between 3–7
  return `${team1}-${team2}`;
}

function pickMVP(players) {
  const p = players[Math.floor(Math.random() * players.length)];
  return {
    name: p.name,
    K: Math.floor(Math.random() * 20),
    D: Math.floor(Math.random() * 15),
    A: Math.floor(Math.random() * 10),
  };
}
