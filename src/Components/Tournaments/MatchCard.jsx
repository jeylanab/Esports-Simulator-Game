// src/Components/Tournaments/MatchCard.jsx
import React from 'react';

const MatchCard = ({ match, index, simulate, isActiveRound, highlightTeam }) => {
  const teamA = match?.teamA;
  const teamB = match?.teamB;
  const result = match?.result;
  const isUserTeam = teamA?.name === highlightTeam || teamB?.name === highlightTeam;
  const winnerName = result?.winner?.name;

  return (
    <div
      className={`bg-[#1f2937] rounded-md p-4 w-[280px] text-white shadow-md space-y-2 text-sm border ${
        isUserTeam ? 'border-yellow-400' : 'border-gray-600'
      }`}
    >
      {/* Team Names and Logos */}
      <div className="flex justify-between items-center space-x-2">
        {/* Team A */}
        <div className="flex items-center space-x-1 w-[100px] overflow-hidden">
          <img
            src={`/assets/logos/${teamA?.logo || 'default.png'}`}
            alt={teamA?.name || 'Team A'}
            className="w-5 h-5 rounded bg-white shrink-0"
          />
          <span
            title={teamA?.name}
            className={`truncate ${
              winnerName === teamA?.name ? 'text-green-400 font-semibold' : ''
            }`}
          >
            {teamA?.name || 'TBD'}
          </span>
        </div>

        {/* Match Score */}
        <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">
          {result?.score || 'vs'}
        </span>

        {/* Team B or Bye */}
        {teamB ? (
          <div className="flex items-center space-x-1 w-[100px] overflow-hidden justify-end">
            <span
              title={teamB?.name}
              className={`truncate text-right ${
                winnerName === teamB?.name ? 'text-green-400 font-semibold' : ''
              }`}
            >
              {teamB?.name || 'TBD'}
            </span>
            <img
              src={`/assets/logos/${teamB?.logo || 'default.png'}`}
              alt={teamB?.name || 'Team B'}
              className="w-5 h-5 rounded bg-white shrink-0"
            />
          </div>
        ) : (
          <div className="w-[100px] text-right italic text-gray-400 text-xs">Bye</div>
        )}
      </div>

      {/* Match Result Details */}
      {result && (
        <div className="text-xs text-center text-gray-300 pt-1">
          <span className="text-cyan-400 font-medium">{result.mvp?.name || 'MVP'}</span>
          {` • ${result.hostCity || 'City'} • ${result.date || 'Date'}`}
        </div>
      )}

      {/* Simulate Button */}
      {!result && teamB && isActiveRound && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => simulate(index)}
            className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-1 rounded"
          >
            Sim
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
