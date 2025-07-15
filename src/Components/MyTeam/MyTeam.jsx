// src/Components/MyTeam/MyTeam.jsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../Game/GameContext';
import teams from '../../../data/teams';
import { FaUserCircle } from 'react-icons/fa';

const MyTeam = ({ teamName }) => {
  const { userTeam, budget, setUserTeam } = useGame();
  const [coach, setCoach] = useState('Coach');
  const [players, setPlayers] = useState([]);
  const [teamLogo, setTeamLogo] = useState(null);

  useEffect(() => {
    // Load career slot to get base team players if userTeam is empty
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
      
      // ✅ Only use base players if there's no signed team yet
      if (!userTeam || userTeam.length === 0) {
        setUserTeam(basePlayers); // push to GameContext
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
    <div className="bg-[#0c0c15] text-white p-6 min-h-screen">
      <div className="max-w-6xl mx-auto bg-[#1f1f2a] border border-[#333347] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {teamLogo ? (
              <img src={teamLogo} alt={`${teamName} Logo`} className="w-16 rounded shadow" />
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
          <div className="text-right">
            <p className="text-sm text-gray-400">Roster: <span className="text-white font-medium">{players.length}</span></p>
            <p className="text-sm text-gray-400">Budget: <span className="text-green-400 font-semibold">${budget.toLocaleString()}</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player, idx) => (
          <div key={idx} className="bg-[#1f1f2a] border border-gray-700 rounded-xl p-5 shadow hover:scale-[1.01] transition">
            <div className="flex items-center gap-3 mb-3">
              <FaUserCircle size={30} className="text-cyan-400" />
              <h3 className="text-base font-semibold truncate">{player.name || player.Player}</h3>
            </div>
            <div className="text-xs text-gray-300 grid grid-cols-2 gap-1">
              <span>Aim:</span><span>{player.aim ?? player.Aim}</span>
              <span>IQ:</span><span>{player.iq ?? player.GameSense}</span>
              <span>Mech:</span><span>{player.mechanics ?? player.Mechanics}</span>
              <span>Clutch:</span><span>{player.clutch ?? player.Clutch}</span>
              <span className="font-semibold text-cyan-400">Rating:</span>
              <span className="font-semibold text-cyan-400">{player.rating ?? player.Overall}</span>
              {/* {player.Role && <><span>Role:</span><span>{player.Role}</span></>}
              {player.Country && <><span>Country:</span><span>{player.Country}</span></>}
              {player.Age && <><span>Age:</span><span>{player.Age}</span></>} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
