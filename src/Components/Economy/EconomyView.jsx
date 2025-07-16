import React from 'react';
import { useGame } from '../Game/GameContext';
import {
  FaMoneyBillWave,
  FaWallet,
  FaClock,
  FaFileContract,
} from 'react-icons/fa';

const EconomyView = () => {
  const { budget, userTeam } = useGame();

  return (
    <div className="p-4 sm:p-6 text-white max-w-6xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <FaMoneyBillWave className="text-yellow-400 text-2xl" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-yellow-400">
          Team Economy Overview
        </h1>
      </div>

      {/* Budget Summary */}
      <div className="bg-[#1a1a24] p-4 sm:p-5 rounded-xl mb-8 border border-yellow-500 shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <FaWallet className="text-yellow-300" />
          <p className="text-lg sm:text-xl font-semibold text-yellow-300">
            Current Budget: ${budget.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <FaClock className="text-gray-500" />
          <span>Next salary deduction: End of season</span>
        </div>
      </div>

      {/* Player Contracts Table */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaFileContract className="text-cyan-400 text-lg" />
          <h2 className="text-lg sm:text-xl font-semibold text-cyan-400">
            Active Player Contracts
          </h2>
        </div>

        <div className="w-full overflow-x-auto rounded-xl shadow-sm border border-[#2a2a3a]">
          <table className="min-w-[600px] w-full text-sm bg-[#111118] text-white">
            <thead className="bg-[#222230] text-gray-300 text-left">
              <tr>
                <th className="p-3">Player</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Contract Years</th>
                <th className="p-3">Yearly Salary</th>
                <th className="p-3">Expires</th>
              </tr>
            </thead>
            <tbody>
              {userTeam.map((player, i) => {
                const salary = Math.floor((player.rating ?? 70) * 1000);
                const years = player.contractYears || 2;
                return (
                  <tr
                    key={i}
                    className="border-t border-[#2d2d3d] hover:bg-[#1b1b2b] transition"
                  >
                    <td className="p-3 font-medium text-white">
                      {player.name}
                    </td>
                    <td className="p-3">{player.rating}</td>
                    <td className="p-3">{years}</td>
                    <td className="p-3 text-yellow-300">
                      ${salary.toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-400">202{6 + years}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EconomyView;
