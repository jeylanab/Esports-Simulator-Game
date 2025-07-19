import React, { useMemo } from 'react';
import { useStats } from '../Game/StatContext';
import teams from '../../../data/teams';

export default function SeasonStatsTable() {
  const { playerStats } = useStats();

  // 🧠 Combine stat data with team/region and K/D calculations
  const enrichedPlayers = useMemo(() => {
    return Object.entries(playerStats).map(([name, stats]) => {
      const teamEntry = Object.entries(teams).find(([_, team]) =>
        team.players.some((p) => p.name === name)
      );

      const teamName = teamEntry?.[0] || '—';
      const region = teamEntry?.[1]?.region || '—';
      const deaths = stats.deaths || 1; // avoid div-by-zero
      const kdRatio = ((stats.kills + stats.assists) / deaths).toFixed(2);
      const matchRating = Array.isArray(stats.matchRating)
        ? stats.matchRating
        : [stats.rating || 0];

      return {
        name,
        team: teamName,
        region,
        kdRatio,
        mvps: stats.mvp || 0,
        matchRating,
      };
    });
  }, [playerStats]);

  // MVP sort descending
  const sorted = [...enrichedPlayers].sort((a, b) => b.mvps - a.mvps);

  return (
    <div className="overflow-x-auto rounded-lg border border-cyan-700">
      <table className="min-w-full text-sm text-white">
        <thead className="bg-[#202a3c] text-cyan-300 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Player</th>
            <th className="px-3 py-3 text-center">Team</th>
            <th className="px-3 py-3 text-center">Region</th>
            <th className="px-3 py-3 text-center">K/D</th>
            <th className="px-3 py-3 text-center">MVPs</th>
            <th className="px-3 py-3 text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, idx) => (
            <tr
              key={`${p.name}-${idx}`}
              className={idx % 2 === 0 ? 'bg-[#1b1b1b]' : 'bg-[#111]'}
            >
              <td className="px-4 py-2 font-medium">{p.name}</td>
              <td className="px-3 py-2 text-center">{p.team}</td>
              <td className="px-3 py-2 text-center">{p.region}</td>
              <td className="px-3 py-2 text-center">{p.kdRatio}</td>
              <td className="px-3 py-2 text-center">{p.mvps}</td>
              <td className="px-3 py-2 text-center">
                {p.matchRating && p.matchRating.length > 0
                  ? (
                      p.matchRating.reduce((a, b) => a + b, 0) /
                      p.matchRating.length
                    ).toFixed(2)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
