import React from 'react';

export default function SeasonStatsTable({ players }) {
  if (!Array.isArray(players)) return null;

  const sorted = [...players].sort((a, b) => (b.mvps || 0) - (a.mvps || 0)); // MVP sort

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
              <td className="px-3 py-2 text-center">{p.team || '—'}</td>
              <td className="px-3 py-2 text-center">{p.region || '—'}</td>
              <td className="px-3 py-2 text-center">{p.kdRatio || '—'}</td>
              <td className="px-3 py-2 text-center">{p.mvps ?? 0}</td>
              <td className="px-3 py-2 text-center">
                {Array.isArray(p.matchRating) && p.matchRating.length > 0
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
