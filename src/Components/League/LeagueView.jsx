import React, { useEffect, useState } from 'react';
import { simulateMatch } from '../../Utils/matchLogic';
import teamsData from '../../../data/teams'; // or .js if you're exporting JS

const regions = ['NA', 'EU', 'APAC', 'SA'];

const LeagueView = () => {
  const [activeRegion, setActiveRegion] = useState('NA');
  const [standings, setStandings] = useState({});

  // ✅ Initialize standings for each team
  useEffect(() => {
    const init = {};

    Object.entries(teamsData).forEach(([teamName, teamInfo]) => {
      if (!init[teamInfo.region]) init[teamInfo.region] = {};
      init[teamInfo.region][teamName] = {
        team: teamName,
        region: teamInfo.region,
        players: teamInfo.players,
        wins: 0,
        losses: 0,
        points: 0,
      };
    });

    setStandings(init);
  }, []);

  // ✅ Matchday Simulation
  const simulateMatchday = () => {
    const regionTeams = Object.values(standings[activeRegion] || {});

    // Shuffle for match pairing
    const shuffled = [...regionTeams].sort(() => Math.random() - 0.5);
    const updated = { ...standings };

    for (let i = 0; i < shuffled.length; i += 2) {
      const teamA = shuffled[i];
      const teamB = shuffled[i + 1];
      if (!teamB) continue;

      const result = simulateMatch(teamA.players, teamB.players);
      const winner = result.winnerName;
      const loser = result.loserName;

      // Update results
      if (updated[activeRegion][winner]) {
        updated[activeRegion][winner].wins += 1;
        updated[activeRegion][winner].points += 3;
      }

      if (updated[activeRegion][loser]) {
        updated[activeRegion][loser].losses += 1;
      }

      console.log(`${winner} defeated ${loser} (${result.score})`);
    }

    setStandings(updated);
  };

  const currentStandings = standings[activeRegion]
    ? Object.values(standings[activeRegion])
    : [];

  return (
    <div className="p-4 text-white">
      {/* 🌍 Region Tabs */}
      <div className="flex gap-4 mb-4">
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-4 py-2 rounded font-semibold ${
              activeRegion === region
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {region} League
          </button>
        ))}
      </div>

      {/* 🕹️ Simulate Button */}
      <button
        onClick={simulateMatchday}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded mb-4"
      >
        ▶️ Simulate Matchday
      </button>

      {/* 📊 League Table */}
      <h2 className="text-2xl font-bold mb-2">
        📈 {activeRegion} Regional League
      </h2>

      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Team</th>
            <th className="py-2 px-4">Wins</th>
            <th className="py-2 px-4">Losses</th>
            <th className="py-2 px-4">Points</th>
          </tr>
        </thead>
        <tbody>
          {currentStandings.map(team => (
            <tr key={team.team} className="border-t border-gray-700">
              <td className="py-2 px-4">{team.team}</td>
              <td className="py-2 px-4">{team.wins}</td>
              <td className="py-2 px-4">{team.losses}</td>
              <td className="py-2 px-4">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueView;
