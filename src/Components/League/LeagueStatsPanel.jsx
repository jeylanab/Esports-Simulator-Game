// src/Components/League/LeagueStatsPanel.jsx

import React from 'react';
import { useStats } from '../Game/StatContext';

const LeagueStatsPanel = () => {
  const { playerStats, awards, goatPoints } = useStats();

  const topPlayers = Object.entries(playerStats)
    .map(([name, stat]) => ({
      name,
      kda: isNaN(stat.overallKDA) ? 0 : parseFloat(stat.overallKDA.toFixed(2)),
      mvps: stat.mvps || 0,
      chem: stat.chemistry || 0,
    }))
    .sort((a, b) => b.kda - a.kda)
    .slice(0, 5);

  const goatLeaders = Object.entries(goatPoints || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-[#0e0e0e] text-white p-4 rounded-xl shadow-lg border border-[#2a2a2a]">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">📊 League Stats</h2>

      {/* 🏅 Top Players */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-2">🏅 Top 5 Players by KDA</h3>
        {topPlayers.length === 0 ? (
          <p className="text-gray-400 text-sm">No player stats yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {topPlayers.map((p, i) => (
              <li
                key={i}
                className={`${
                  i === 0 ? 'text-green-400 font-bold' : ''
                } flex justify-between`}
              >
                <span title="Player Name">{p.name}</span>
                <span title="Kills/Deaths/Assists Ratio">KDA: {p.kda}</span>
                <span title="Match MVPs">MVPs: {p.mvps}</span>
                <span title="Team Chemistry">Chem: {p.chem}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🏆 Awards */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-2">🏆 Award History</h3>
        {awards?.length === 0 ? (
          <p className="text-gray-400 text-sm">No awards yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {awards.map((award, index) => (
              <li key={index}>
                {award.type} —{' '}
                <span className="font-bold text-white">{award.name}</span>{' '}
                {award.event && <span className="text-gray-400">({award.event})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🐐 GOAT Leaderboard */}
      <div>
        <h3 className="text-lg font-semibold text-orange-400 mb-2">🐐 GOAT Leaderboard</h3>
        {goatLeaders.length === 0 ? (
          <p className="text-gray-400 text-sm">No GOAT points yet.</p>
        ) : (
          <ul className="text-sm space-y-1 text-green-300">
            {goatLeaders.map(([name, pts], i) => (
              <li key={i}>
                {i + 1}. <span className="font-bold text-white">{name}</span> — {pts} pts
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeagueStatsPanel;
