// File: src/Utils/StatEngine.js

export function initializeSeasonStats(player) {
  return {
    kills: 0,
    deaths: 0,
    assists: 0,
    mvps: 0,
    matchRating: [], // Can be used for calculating average KDA or performance rating
    tournamentsPlayed: 0,
  };
}

export function updatePlayerStats(player, matchStats) {
  if (!player.seasonStats) {
    player.seasonStats = initializeSeasonStats(player);
  }

  player.seasonStats.kills += matchStats.kills;
  player.seasonStats.deaths += matchStats.deaths;
  player.seasonStats.assists += matchStats.assists;

  if (matchStats.mvp) {
    player.seasonStats.mvps += 1;
  }

  const kda = (matchStats.kills + matchStats.assists) / Math.max(1, matchStats.deaths);
  player.seasonStats.matchRating.push(kda.toFixed(2));
  player.seasonStats.tournamentsPlayed += 1;
}

export function getPlayerAverageKDA(player) {
  const { matchRating = [] } = player.seasonStats || {};
  if (matchRating.length === 0) return 0;
  return (
    matchRating.reduce((acc, val) => acc + parseFloat(val), 0) / matchRating.length
  ).toFixed(2);
}
