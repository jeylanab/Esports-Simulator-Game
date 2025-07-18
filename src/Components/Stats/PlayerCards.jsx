import React from 'react';
import { FaUser, FaVial, FaFileContract, FaDollarSign } from 'react-icons/fa';

export default function PlayerCards({ playerStats }) {
  const getChemistryColor = (chemistry) => {
    if (chemistry >= 85) return 'text-green-400';
    if (chemistry >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <FaUser className="text-blue-400" />
        Player Overview
      </h3>

      {Object.keys(playerStats || {}).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(playerStats).map(([name, p]) => (
            <div
              key={name}
              className="bg-[#2a2a3a] p-4 rounded-lg shadow-sm space-y-2 border border-gray-700 hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FaUser className="text-gray-400" /> {name}
              </h4>
              <p className="text-sm flex items-center gap-2">
                <FaVial className="text-purple-400" />
                Age: <span className="text-white font-medium">{p.age}</span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <FaVial className="text-yellow-400" />
                Chemistry:{' '}
                <span className={`font-semibold ${getChemistryColor(p.chemistry)}`}>
                  {p.chemistry}
                </span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <FaFileContract className="text-cyan-300" />
                Contract: {p.contract?.years}y @{' '}
                <span className="text-green-400 font-medium flex items-center gap-1">
                  <FaDollarSign />{p.contract?.wage?.toLocaleString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No active players available.</p>
      )}
    </section>
  );
}
