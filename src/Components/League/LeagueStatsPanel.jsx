import React, { useState, useMemo } from 'react';
import { FaFilter, FaSearch, FaGlobe, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useStats } from '../Game/StatContext'; // ✅ Added for player-level stats
import teams from '../../../data/teams';

const LeagueStatsPanel = ({ results = {}, standings = {}, matchdayIndices = {} }) => {
  const { playerStats } = useStats(); // ✅ Get player stats

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMatchday, setSelectedMatchday] = useState('');

  const stages = Object.keys(results);

  const filteredStages = useMemo(() => {
    return stages.filter((stageKey) => {
      const region = stageKey.split('_')[1];
      const matches = results[stageKey] || [];

      if (selectedRegion && region !== selectedRegion) return false;

      if (selectedTeam || selectedMatchday) {
        return matches.some((match) => {
          const teamMatch = selectedTeam
            ? match.teamA === selectedTeam || match.teamB === selectedTeam
            : true;

          const matchdayMatch = selectedMatchday
            ? String(match.matchday) === selectedMatchday
            : true;

          return teamMatch && matchdayMatch;
        });
      }

      return true;
    });
  }, [selectedRegion, selectedTeam, selectedMatchday, results]);

  const uniqueRegions = [...new Set(stages.map((s) => s.split('_')[1]))];
  const allTeams = Object.keys(teams);
  const allMatchdays = [...new Set(stages.flatMap((stage) => results[stage]?.map((m) => m.matchday)))];

  return (
    <div className="text-white p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-4 text-yellow-400 flex items-center gap-3">
        <FaFilter className="text-yellow-400" /> League Results & Stats
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#181818] p-4 rounded-lg border border-gray-700 shadow-md">
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1">
            <FaGlobe className="inline mr-2" /> Filter by Region
          </label>
          <select
            className="w-full bg-[#2b2b2b] text-white p-2 rounded"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1">
            <FaUsers className="inline mr-2" /> Filter by Team
          </label>
          <select
            className="w-full bg-[#2b2b2b] text-white p-2 rounded"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">All Teams</option>
            {allTeams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1">
            <FaCalendarAlt className="inline mr-2" /> Filter by Matchday
          </label>
          <select
            className="w-full bg-[#2b2b2b] text-white p-2 rounded"
            value={selectedMatchday}
            onChange={(e) => setSelectedMatchday(e.target.value)}
          >
            <option value="">All Matchdays</option>
            {allMatchdays.map((md) => (
              <option key={md} value={String(md)}>Matchday {md}</option>
            ))}
          </select>
        </div>
      </div>

      {/* League Panels */}
      {filteredStages.length === 0 ? (
        <p className="text-center text-gray-400">No data matches the filter.</p>
      ) : (
        filteredStages.map((stageKey) => {
          const regionName = stageKey.split('_')[1];
          const matches = results[stageKey] || [];
          const totalMatchdays = matchdayIndices[stageKey] || 0;

          return (
            <div
              key={stageKey}
              className="bg-[#121212] border border-gray-800 rounded-xl mb-10 p-4 md:p-6 shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap mb-4">
                <h3 className="text-2xl font-bold text-cyan-400 uppercase">
                  {regionName} League
                </h3>
                <span className="text-sm text-gray-400">
                  Matchdays Simulated: {totalMatchdays}
                </span>
              </div>

              {/* Match Table */}
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm border border-gray-700">
                  <thead className="bg-[#1f1f1f] text-yellow-400">
                    <tr>
                      <th className="py-2 px-3 text-left">Matchday</th>
                      <th className="py-2 px-3 text-left">Match</th>
                      <th className="py-2 px-3 text-center">Score</th>
                      <th className="py-2 px-3 text-center">MVP</th>
                      <th className="py-2 px-3 text-center">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches
                      .filter((match) => {
                        if (selectedTeam && match.teamA !== selectedTeam && match.teamB !== selectedTeam)
                          return false;
                        if (selectedMatchday && String(match.matchday) !== selectedMatchday)
                          return false;
                        return true;
                      })
                      .map((match, idx) => (
                        <tr key={idx} className="border-t border-gray-700 hover:bg-[#2a2a2a] transition">
                          <td className="py-2 px-3">{match.matchday}</td>
                          <td className="py-2 px-3">{match.teamA} vs {match.teamB}</td>
                          <td className="py-2 px-3 text-center">{match.score}</td>
                          <td className="py-2 px-3 text-center text-yellow-400">{match.mvp}</td>
                          <td className="py-2 px-3 text-center text-gray-400">{match.hostCity}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Standings Table */}
              <div className="overflow-x-auto mb-10">
                <table className="min-w-full text-sm border border-gray-700">
                  <thead className="bg-[#1f1f1f] text-green-300">
                    <tr>
                      <th className="py-2 px-3 text-left">Team</th>
                      <th className="py-2 px-3 text-center">W</th>
                      <th className="py-2 px-3 text-center">L</th>
                      <th className="py-2 px-3 text-center">MP</th>
                      <th className="py-2 px-3 text-center">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(standings[stageKey] || {})
                      .sort((a, b) => b[1].Points - a[1].Points)
                      .map(([team, data]) => (
                        <tr key={team} className="border-t border-gray-700 hover:bg-[#222] transition">
                          <td className="py-2 px-3 flex items-center gap-2">
                            <img src={`/logos/${teams[team]?.logo || 'default.png'}`} className="w-5 h-5 object-contain" alt={team} />
                            {team}
                          </td>
                          <td className="py-2 px-3 text-center">{data.W}</td>
                          <td className="py-2 px-3 text-center">{data.L}</td>
                          <td className="py-2 px-3 text-center">{data.MP}</td>
                          <td className="py-2 px-3 text-center font-bold text-white">{data.Points}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Player Stats Table */}
              <div className="overflow-x-auto">
                <h4 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <FaUsers /> Player Stats
                </h4>
                <table className="min-w-full text-sm border border-gray-700">
                  <thead className="bg-[#1f1f1f] text-blue-300">
                    <tr>
                      <th className="py-2 px-3 text-left">Player</th>
                      <th className="py-2 px-3 text-center">K</th>
                      <th className="py-2 px-3 text-center">D</th>
                      <th className="py-2 px-3 text-center">A</th>
                      <th className="py-2 px-3 text-center">KDA</th>
                      <th className="py-2 px-3 text-center">MVPs</th>
                      <th className="py-2 px-3 text-center">Chem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(playerStats).map(([player, stat]) => (
                      <tr key={player} className="border-t border-gray-800 hover:bg-[#1f1f1f] transition">
                        <td className="py-2 px-3">{player}</td>
                        <td className="py-2 px-3 text-center">{stat.kills || 0}</td>
                        <td className="py-2 px-3 text-center">{stat.deaths || 0}</td>
                        <td className="py-2 px-3 text-center">{stat.assists || 0}</td>
                        <td className="py-2 px-3 text-center">
                          {stat.kills && stat.deaths ? (stat.kills / Math.max(1, stat.deaths)).toFixed(2) : '0.00'}
                        </td>
                        <td className="py-2 px-3 text-center text-yellow-400 font-semibold">{stat.mvps || 0}</td>
                        <td className="py-2 px-3 text-center">{stat.chemistry || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LeagueStatsPanel;
