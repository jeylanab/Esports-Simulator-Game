import React from 'react';
import { FaUser, FaVial, FaFileContract, FaDollarSign, FaStar, FaBolt } from 'react-icons/fa';
import { useGame } from '../Game/GameContext';

export default function PlayerCards({ players = null, title = 'Player Overview', showTeam = false }) {
  const { userTeam, userTeamName } = useGame();
  const dataToRender = players || userTeam;

  const getChemistryColor = (chemistry) => {
    if (chemistry >= 85) return 'text-green-400';
    if (chemistry >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaUser className="text-blue-400" />
        {title}
      </h3>

      {dataToRender.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dataToRender.map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              className="bg-[#2a2a3a] p-4 rounded-lg shadow-md space-y-2 border border-gray-700 hover:shadow-xl transition"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2 text-white">
                <FaUser className="text-gray-400" />
                {p.name}
              </h4>

              {showTeam && p.team && (
                <p className="text-sm text-cyan-300 font-semibold">Team: {p.team}</p>
              )}

              <p className="text-sm flex items-center gap-2">
                <FaVial className="text-purple-400" />
                Age: <span className="text-white font-medium">{p.Age || p.age || '-'}</span>
              </p>

              <p className="text-sm flex items-center gap-2">
                <FaBolt className="text-yellow-300" />
                Chemistry:{' '}
                <span className={`font-semibold ${getChemistryColor(p.chemistry ?? 70)}`}>
                  {p.chemistry ?? 70}
                </span>
              </p>

              {p.contract && (
                <p className="text-sm flex items-center gap-2">
                  <FaFileContract className="text-cyan-300" />
                  Contract: {p.contract.years}y @{' '}
                  <span className="text-green-400 font-medium flex items-center gap-1">
                    <FaDollarSign />
                    {p.contract.wage.toLocaleString()}
                  </span>
                </p>
              )}

              <p className="text-sm text-white">
                🧠 IQ: {p.iq} | 🎯 Aim: {p.aim} | 🕹️ Mechanics: {p.mechanics} | 🔥 Clutch: {p.clutch}
              </p>

              {p.isMVP && (
                <p className="text-sm text-yellow-400 flex items-center gap-2">
                  <FaStar className="text-yellow-300" /> Tournament MVP
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No players found.</p>
      )}
    </section>
  );
}
