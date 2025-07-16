import React from 'react';

const MatchCard = ({ match, index, simulate, isActiveRound, highlightTeam }) => {
  const isUserTeam =
    match.teamA?.name === highlightTeam || match.teamB?.name === highlightTeam;

  const winnerName = match.result?.winner?.name;

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
            src={`/assets/logos/${match.teamA.logo}`}
            alt={match.teamA.name}
            className="w-5 h-5 rounded bg-white shrink-0"
          />
          <span
            title={match.teamA.name}
            className={`truncate ${
              winnerName === match.teamA.name ? 'text-green-400 font-semibold' : ''
            }`}
          >
            {match.teamA.name}
          </span>
        </div>

        {/* Match Score */}
        <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">
          {match.result?.score || 'vs'}
        </span>

        {/* Team B or Bye */}
        {match.teamB ? (
          <div className="flex items-center space-x-1 w-[100px] overflow-hidden justify-end">
            <span
              title={match.teamB.name}
              className={`truncate text-right ${
                winnerName === match.teamB.name ? 'text-green-400 font-semibold' : ''
              }`}
            >
              {match.teamB.name}
            </span>
            <img
              src={`/assets/logos/${match.teamB.logo}`}
              alt={match.teamB.name}
              className="w-5 h-5 rounded bg-white shrink-0"
            />
          </div>
        ) : (
          <div className="w-[100px] text-right italic text-gray-400 text-xs">Bye</div>
        )}
      </div>

      {/* Match Result Details */}
      {match.result && (
        <div className="text-xs text-center text-gray-300 pt-1">
          <span className="text-cyan-400 font-medium">{match.result.mvp?.name}</span>
          {` • ${match.result.hostCity} • ${match.result.date}`}
        </div>
      )}

      {/* Simulate Button */}
      {!match.result && match.teamB && isActiveRound && (
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
