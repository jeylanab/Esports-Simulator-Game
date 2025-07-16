import React from 'react';
import { useGame } from '../Game/GameContext';
import { toast } from 'react-hot-toast';
import {
  FaLock,
  FaUserPlus,
  FaCheck,
  FaCrosshairs,
  FaBrain,
  FaCogs,
  FaDice,
} from 'react-icons/fa';

const FreeAgentCard = ({ player, canSign }) => {
  const { signPlayer, userTeam } = useGame();

  const normalizedName = player.Player || player.name;
  const alreadySigned = userTeam.some(p => p.name === normalizedName);

  const handleSign = () => {
    if (!canSign) {
      toast.error('Transfer window is currently closed.');
      return;
    }
    if (alreadySigned) {
      toast.error(`${normalizedName} is already signed.`);
      return;
    }
    signPlayer(player);
    toast.success(`${normalizedName} has joined your team.`);
  };

  // Text and button style based on signing state
  const textClass = !canSign || alreadySigned ? 'text-gray-500' : 'text-gray-300';
  const locked = !canSign;
  const signed = alreadySigned;

  return (
    <div className="bg-[#111118] border border-[#2e2e3e] rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-200">
      {/* Name + Lock */}
      <div className="flex items-center justify-between mb-1">
        <h3 className={`text-lg font-semibold ${locked ? 'text-gray-500' : 'text-white'}`}>
          {normalizedName}
        </h3>
        {locked && (
          <FaLock className="text-gray-500" title="Transfer window closed" />
        )}
      </div>

      {/* Role and Country */}
      <p className={`text-sm mb-3 ${textClass}`}>
        {player.Role} • {player.Country}
      </p>

      {/* Attributes */}
      <dl className={`grid grid-cols-2 gap-y-2 text-sm ${textClass} mb-4`}>
        <dt className="font-medium flex items-center gap-1">
          <FaCrosshairs className="text-cyan-500" /> Aim
        </dt>
        <dd>{player.Aim ?? player.aim}</dd>

        <dt className="font-medium flex items-center gap-1">
          <FaBrain className="text-cyan-500" /> IQ
        </dt>
        <dd>{player.GameSense ?? player.iq}</dd>

        <dt className="font-medium flex items-center gap-1">
          <FaCogs className="text-cyan-500" /> Mech
        </dt>
        <dd>{player.Mechanics ?? player.mechanics}</dd>

        <dt className="font-medium flex items-center gap-1">
          <FaDice className="text-yellow-400" /> Clutch
        </dt>
        <dd>{player.Clutch ?? player.clutch}</dd>

        <dt className="font-bold text-cyan-400">Rating</dt>
        <dd className="font-bold text-cyan-400">
          {player.Overall ?? player.rating}
        </dd>
      </dl>

      {/* Sign Button */}
      <button
        disabled={locked || signed}
        onClick={handleSign}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold tracking-wide transition
          ${
            signed || locked
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}
      >
        {signed ? (
          <>
            <FaCheck /> Signed
          </>
        ) : (
          <>
            <FaUserPlus /> Sign Player
          </>
        )}
      </button>
    </div>
  );
};

export default FreeAgentCard;
