// src/Components/Transfers/FreeAgentCard.jsx
import React from 'react';
import { useGame } from '../Game/GameContext';
import { toast } from 'react-hot-toast';

const FreeAgentCard = ({ player, canSign }) => {
  const { signPlayer, userTeam } = useGame();

  const normalizedName = player.Player || player.name;
  const alreadySigned = userTeam.some(p => p.name === normalizedName);

  const handleSign = () => {
    if (!canSign) return toast.error('⚠️ Transfer window is closed.');
    if (alreadySigned) return toast.error(`${normalizedName} is already signed.`);
    signPlayer(player);
    toast.success(`${normalizedName} joined your team!`);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition">
      <h3 className="text-white text-lg font-semibold mb-2">{normalizedName}</h3>
      <p className="text-sm text-gray-400 mb-3">{player.Role} • {player.Country}</p>
      <div className="grid grid-cols-2 text-xs text-gray-300 mb-4">
        <span>Aim:</span><span>{player.Aim ?? player.aim}</span>
        <span>IQ:</span><span>{player.GameSense ?? player.iq}</span>
        <span>Mech:</span><span>{player.Mechanics ?? player.mechanics}</span>
        <span>Clutch:</span><span>{player.Clutch ?? player.clutch}</span>
        <span className="font-semibold text-cyan-400">Rating:</span>
        <span className="font-semibold text-cyan-400">{player.Overall ?? player.rating}</span>
      </div>
      <button
        disabled={!canSign || alreadySigned}
        onClick={handleSign}
        className={`w-full py-2 rounded font-bold tracking-wide transition 
          ${alreadySigned || !canSign
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}
      >
        {alreadySigned ? '✔ Signed' : '➕ Sign Player'}
      </button>
    </div>
  );
};

export default FreeAgentCard;
