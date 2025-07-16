import React, { useEffect, useState } from 'react';
import { useGame } from '../Game/GameContext';
import teams from '../../../data/teams';
import {
  FaUserCircle,
  FaMoneyBillWave,
  FaUsers,
  FaCrosshairs,
  FaBrain,
  FaCogs,
  FaDice,
  FaStar,
} from 'react-icons/fa';

const MyTeam = ({ teamName }) => {
  const { userTeam, budget, setUserTeam } = useGame();
  const [coach, setCoach] = useState('Coach');
  const [players, setPlayers] = useState([]);
  const [teamLogo, setTeamLogo] = useState(null);

  useEffect(() => {
    const slot1 = localStorage.getItem('career_slot_1');
    const slot2 = localStorage.getItem('career_slot_2');
    let selectedSlot = null;

    if (slot1 && JSON.parse(slot1).team === teamName) {
      selectedSlot = JSON.parse(slot1);
    } else if (slot2 && JSON.parse(slot2).team === teamName) {
      selectedSlot = JSON.parse(slot2);
    }

    if (selectedSlot) {
      setCoach(selectedSlot.coach);
      const basePlayers = teams[selectedSlot.team]?.players || [];

      if (!userTeam || userTeam.length === 0) {
        setUserTeam(basePlayers);
        localStorage.setItem('user_team', JSON.stringify(basePlayers));
        setPlayers(basePlayers);
      } else {
        setPlayers(userTeam);
      }

      const baseTeam = teams[selectedSlot.team];
      if (baseTeam?.logo) {
        setTeamLogo(`/logos/${baseTeam.logo}`);
      }
    }
  }, [teamName, userTeam, setUserTeam]);

  if (players.length === 0) {
    return (
      <div className="text-white text-center mt-10">
        <p className="text-xl font-medium">Your roster is empty. Sign players to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e12] text-white p-6 min-h-screen">
      {/* Team Header */}
      <div className="max-w-6xl mx-auto bg-[#1f1f2a] border border-[#333347] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {teamLogo ? (
              <img
                src={teamLogo}
                alt={`${teamName} Logo`}
                className="w-16 h-16 rounded-full shadow border border-gray-600"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-full text-2xl">🏆</div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{teamName}</h1>
              <p className="text-sm text-gray-400">
                Coach: <span className="text-cyan-400 font-semibold">{coach}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaUsers className="text-cyan-400" />
              Roster: <span className="text-white font-medium">{players.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-400" />
              Budget: <span className="text-green-400 font-semibold">${budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Player Cards */}
      <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player, idx) => (
          <div
            key={idx}
            className="bg-[#1f1f2a] border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg hover:scale-[1.01] transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaUserCircle size={28} className="text-cyan-400" />
              <h3 className="text-base font-semibold truncate">{player.name || player.Player}</h3>
            </div>
            <div className="text-xs text-gray-300 grid grid-cols-2 gap-y-1 gap-x-3">
              <div className="flex items-center gap-1">
                <  FaCrosshairs
 className="text-yellow-400" />
                Aim:
              </div>
              <span>{player.aim ?? player.Aim}</span>

              <div className="flex items-center gap-1">
                <FaBrain className="text-yellow-400" />
                IQ:
              </div>
              <span>{player.iq ?? player.GameSense}</span>

              <div className="flex items-center gap-1">
                <FaCogs className="text-yellow-400" />
                Mech:
              </div>
              <span>{player.mechanics ?? player.Mechanics}</span>

              <div className="flex items-center gap-1">
                <FaDice className="text-yellow-400" />
                Clutch:
              </div>
              <span>{player.clutch ?? player.Clutch}</span>

              <div className="flex items-center gap-1 font-semibold text-cyan-400">
                <FaStar />
                Rating:
              </div>
              <span className="font-semibold text-cyan-400">{player.rating ?? player.Overall}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
