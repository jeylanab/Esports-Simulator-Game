// src/utils/statUtils.js
export function calculateKDA(kills, assists, deaths) {
  return (kills + assists) / Math.max(1, deaths);
}

export function computeMVPs(players) {
  const scored = players.map(p => {
    const kda = calculateKDA(p.kills, p.assists, p.deaths);
    return {
      ...p,
      score: kda * (1 + getTeamBonus(p)) // Add playoff/final/win bonuses
    };
  });

  return scored.sort((a, b) => b.score - a.score)[0];
}

function getTeamBonus(player) {
  // Optional logic later
  return 0.25;
}
