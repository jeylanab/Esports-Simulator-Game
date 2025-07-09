// src/Components/MyTeam/MyTeam.jsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../Game/GameContext';
import teams from '../../../data/teams';

const MyTeam = ({ teamName }) => {
  const { userTeam } = useGame();
  const [coach, setCoach] = useState('Coach');

  const team = teams[teamName];
const logoPath = team?.logo ? `/logos/${team.logo}` : null;
  const players = userTeam?.length > 0 ? userTeam : team?.players;

  useEffect(() => {
    // Try to load the coach name from any existing career slot
    const slot1 = localStorage.getItem('career_slot_1');
    const slot2 = localStorage.getItem('career_slot_2');

    let loadedCoach = 'Coach';

    if (slot1 && JSON.parse(slot1).team === teamName) {
      loadedCoach = JSON.parse(slot1).coach;
    } else if (slot2 && JSON.parse(slot2).team === teamName) {
      loadedCoach = JSON.parse(slot2).coach;
    }

    setCoach(loadedCoach || 'Coach');
  }, [teamName]);

  if (!players || players.length === 0) {
    return (
      <div className="text-white text-center mt-10">
        <p className="text-xl">You haven't signed any players or chosen a team yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl max-w-5xl mx-auto shadow-lg mt-6">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold mb-2">My Team: {teamName}</h2>
        <p className="text-sm text-gray-400">Coach: <span className="font-medium text-cyan-400">{coach}</span></p>
{logoPath && (
  <img
    src={logoPath}
    alt={`${teamName} Logo`}
    className="w-36 h-auto mt-4 object-contain rounded shadow"
  />
)}

      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {players.map((player, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 p-4 rounded shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{player.name || player.Player}</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li> Aim: {player.aim ?? player.Aim}</li>
              <li>IQ: {player.iq ?? player.GameSense}</li>
              <li> Mechanics: {player.mechanics ?? player.Mechanics}</li>
              <li> Clutch: {player.clutch ?? player.Clutch}</li>
              <li>Rating: {player.rating ?? player.Overall}</li>
              {player.Role && <li> Role: {player.Role}</li>}
              {player.Country && <li> Country: {player.Country}</li>}
              {player.Age && <li> Age: {player.Age}</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
