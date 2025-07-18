export function enhancePlayer(player, teamName, index) {
  return {
    id: `${teamName}_${player.name}_${index}`,
    name: player.name || player.Player || 'Unknown',
    rating: player.rating ?? player.Overall ?? 70,
    iq: player.iq ?? player.GameSense ?? 70,
    aim: player.aim ?? player.Aim ?? 70,
    mechanics: player.mechanics ?? player.Mechanics ?? 70,
    clutch: player.clutch ?? player.Clutch ?? 70,
    role: player.Role || 'Flex',
    country: player.Country || 'Unknown',
    age: player.Age || 18 + Math.floor(Math.random() * 12), // 18–30
    contract: {
      years: Math.floor(Math.random() * 3) + 1,
      wage: Math.floor(Math.random() * 100000) + 50000,
    },
    stats: {
      kills: 0,
      assists: 0,
      deaths: 0,
      mvps: 0,
      eventsPlayed: [],
      history: []
    },
    chemistry: Math.floor(Math.random() * 51) + 50 // 50–100
  };
}
