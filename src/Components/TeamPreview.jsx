import React from 'react';

const TeamPreview = ({ teamName, team }) => {
  if (!team) return null;

  return (
    <div className="bg-gray-900 text-white rounded-xl p-4 shadow-lg border border-gray-700">
      <img
        className="w-28 h-auto mx-auto mb-4"
        src={
          team.logo?.startsWith('data:image')
            ? team.logo
            : `/assets/logos/${team.logo}`
        }
        alt={`${teamName} logo`}
      />
      <h2 className="text-xl font-bold text-center mb-4">{teamName}</h2>
      <ul className="space-y-2">
        {team.players.map((player, idx) => (
          <li
            key={idx}
            className="border-b border-gray-700 pb-2 text-sm text-gray-200"
          >
            {player.name} <span className="text-cyan-400">(Rating: {player.rating})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamPreview;
