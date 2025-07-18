// src/Utils/tournamentLogic.js
import teams from '../../data/teams';

/**
 * Shuffle an array (Fisher-Yates algorithm).
 */
export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Simulate a tournament-style match using team names.
 */
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

/**
 * Simulate a full match between two team objects.
 * This is used in bracket views where objects are passed.
 */
export function simulateMatch(teamA, teamB, hostCities = []) {
  if (!teamA || !teamB || !Array.isArray(teamA.players) || !Array.isArray(teamB.players)) {
    return {
      teamA,
      teamB,
      winner: { name: "Invalid", players: [] },
      mvp: { name: "N/A" },
      score: "0-0",
      hostCity: hostCities[Math.floor(Math.random() * hostCities.length)] || "Unknown",
    };
  }

  const avgA = averageRating(teamA.players);
  const avgB = averageRating(teamB.players);

  const winner = Math.random() < avgA / (avgA + avgB) ? teamA : teamB;
  const mvp = pickMVP(winner.players);
  const score = `2-${Math.floor(Math.random() * 2)}`;
  const hostCity = hostCities.length ? hostCities[Math.floor(Math.random() * hostCities.length)] : "Virtual";

  return { teamA, teamB, winner, mvp, score, hostCity };
}

// Helper Functions

function averageRating(players) {
  return players.reduce((sum, p) => sum + p.rating, 0) / players.length;
}

function generateScore() {
  const team1 = 7;
  const team2 = Math.floor(Math.random() * 5) + 3; // 3–7
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
