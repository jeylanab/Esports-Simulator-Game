// ✅ FreeAgentCard.jsx
import React from 'react';
import { useGame } from '../Game/GameContext';

const FreeAgentCard = ({ player }) => {
  const { signPlayer, userTeam } = useGame();
  const alreadySigned = userTeam.some(p => p.Player === player.Player);

  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-1">{player.Player}</h3>
      <p className="text-sm text-gray-400 mb-2">
        {player.Role} • {player.Country} • Age {player.Age}
      </p>
      <ul className="text-sm text-gray-300 mb-3">
        <li>Aim: {player.Aim}</li>
        <li>GameSense: {player.GameSense}</li>
        <li>Mechanics: {player.Mechanics}</li>
        <li>Clutch: {player.Clutch}</li>
        <li>Overall: <span className="font-bold">{player.Overall}</span></li>
      </ul>

      {alreadySigned ? (
        <button disabled className="bg-gray-600 px-4 py-2 rounded text-sm text-white">
          Already Signed
        </button>
      ) : (
        <button
          className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-sm text-white"
          onClick={() => signPlayer(player)}
        >
          Sign Player
        </button>
      )}
    </div>
  );
};

export default FreeAgentCard;
