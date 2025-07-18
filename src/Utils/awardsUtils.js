export function calculateAdjustedKDA(playerStats, teamPlacement) {
  const baseKDA = (playerStats.kills + playerStats.assists) / Math.max(1, playerStats.deaths);

  let multiplier = 1;
  if (teamPlacement <= 8) multiplier += 0.1;
  if (teamPlacement <= 2) multiplier += 0.15;
  if (teamPlacement === 1) multiplier += 0.25;

  return baseKDA * multiplier;
}

export function calculateEventMVP(players, teamPlacements) {
  const scored = players.map(player => {
    const placement = teamPlacements[player.team] ?? 20;
    const adjKDA = calculateAdjustedKDA(player.stats, placement);
    return {
      ...player,
      adjustedKDA: adjKDA,
      tieBreak: {
        kills: player.stats.kills,
        roundsSurvived: player.stats.roundsSurvived || 0
      }
    };
  });

  // Sort MVPs
  scored.sort((a, b) => {
    if (b.adjustedKDA !== a.adjustedKDA) return b.adjustedKDA - a.adjustedKDA;
    if (b.tieBreak.kills !== a.tieBreak.kills) return b.tieBreak.kills - a.tieBreak.kills;
    return b.tieBreak.roundsSurvived - a.tieBreak.roundsSurvived;
  });

  return scored[0];
}

export function calculatePlayerOfYear(allPlayers) {
  const scored = allPlayers.map(player => {
    const totalKDA = player.stats.history.reduce((acc, event) => {
      return acc + event.adjustedKDA;
    }, 0);

    const mvpPoints = player.stats.mvps * 25;
    const trophyPoints = player.stats.trophiesWon * 5;

    return {
      ...player,
      poyScore: totalKDA + mvpPoints + trophyPoints
    };
  });

  scored.sort((a, b) => b.poyScore - a.poyScore);
  return scored[0];
}

export function calculateAllStars(players, excludePOY) {
  const filtered = players.filter(p => p.id !== excludePOY.id);

  return filtered
    .map(p => ({
      ...p,
      allStarScore: p.rating + ((p.stats.seasonKDA || 0) * 20) + (5 * p.stats.mvps) + (p.stats.wonSIorMajor ? 10 : 0)
    }))
    .sort((a, b) => b.allStarScore - a.allStarScore)
    .slice(0, 5);
}
