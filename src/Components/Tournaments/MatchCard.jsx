import React from 'react';

const MatchCard = ({ match, index, simulate, isActiveRound }) => {
  return (
    <div className="bg-[#1f2937] border border-gray-600 rounded-md p-3 w-[280px] mx-auto text-white shadow-md space-y-2 text-sm">
      <div className="flex justify-between items-center space-x-2">
        {/* Team A */}
        <div className="flex items-center space-x-1 w-[100px] overflow-hidden">
          <img src={`/assets/logos/${match.teamA.logo}`} alt={match.teamA.name} className="w-5 h-5 rounded bg-white shrink-0" />
          <span
            className={`truncate ${match.result?.winner?.name === match.teamA.name ? 'text-green-400 font-semibold' : ''}`}
            title={match.teamA.name}
          >
            {match.teamA.name}
          </span>
        </div>

        {/* Score */}
        <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">
          {match.result?.score || 'vs'}
        </span>

        {/* Team B */}
        {match.teamB ? (
          <div className="flex items-center space-x-1 w-[100px] overflow-hidden justify-end">
            <span
              className={`truncate text-right ${match.result?.winner?.name === match.teamB.name ? 'text-green-400 font-semibold' : ''}`}
              title={match.teamB.name}
            >
              {match.teamB.name}
            </span>
            <img src={`/assets/logos/${match.teamB.logo}`} alt={match.teamB.name} className="w-5 h-5 rounded bg-white shrink-0" />
          </div>
        ) : (
          <span className="italic text-gray-400 text-xs">Bye</span>
        )}
      </div>

      {/* Match Result Info */}
      {match.result && (
        <div className="text-gray-300 text-xs text-center pt-1">
           <span className="text-cyan-400">{match.result.mvp?.name}</span> | 
          {match.result.hostCity} | 
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
