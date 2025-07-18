import React, { useState, useMemo } from 'react';
import SeasonStatsTable from './SeasonStatsTable';
import { useGame } from '../Game/GameContext';
import { useStats } from '../Game/StatContext';
import { FiTrendingUp, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function StatBoard() {
  const { teamData } = useGame(); // Team + Region metadata
  const { playerStats } = useStats(); // Player performance stats

  // 🧠 Lookup helper for team + region
  const getPlayerTeamMeta = (playerName) => {
    for (const regionTeams of Object.values(teamData)) {
      for (const team of regionTeams) {
        if (team.players.some((p) => p.name === playerName)) {
          return { team: team.name, region: team.region };
        }
      }
    }
    return { team: '', region: '' };
  };

  // 🔁 Merge stats with metadata
  const allPlayers = useMemo(() => {
    return Object.entries(playerStats).map(([name, stats]) => {
      const { team, region } = getPlayerTeamMeta(name);
      return {
        name,
        team,
        region,
        ...stats,
        kdRatio: stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : '∞',
      };
    });
  }, [playerStats, teamData]);

  // 🔍 Filters
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showStats, setShowStats] = useState(true);

  const regions = [...new Set(allPlayers.map((p) => p.region).filter(Boolean))];
  const teams = [...new Set(allPlayers.map((p) => p.team).filter(Boolean))];

  const filteredPlayers = useMemo(() => {
    return allPlayers.filter((p) =>
      (selectedRegion === '' || p.region === selectedRegion) &&
      (selectedTeam === '' || p.team === selectedTeam) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allPlayers, search, selectedRegion, selectedTeam]);

  // 📦 Expandable section UI
  const SectionCard = ({ icon, title, toggle, setToggle, children }) => (
    <div className="bg-[#141926] border border-cyan-700 rounded-xl shadow-md">
      <div
        onClick={() => setToggle(!toggle)}
        className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-[#1a1f2e] transition rounded-t-xl"
      >
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
          {icon}
          <span className="text-yellow-400">{title}</span>
        </div>
        {toggle ? <FiChevronUp /> : <FiChevronDown />}
      </div>
      {toggle && <div className="p-4">{children}</div>}
    </div>
  );

  return (
    <div className="p-6 bg-[#0d111b] text-white min-h-screen space-y-6 max-w-6xl mx-auto">
      <SectionCard
        icon={<FiTrendingUp />}
        title="Season Player Stats"
        toggle={showStats}
        setToggle={setShowStats}
      >
        {/* 🔧 Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0d111b] border border-cyan-700 text-white px-3 py-2 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#0d111b] border border-cyan-700 text-white px-3 py-2 rounded-md focus:outline-none"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-[#0d111b] border border-cyan-700 text-white px-3 py-2 rounded-md focus:outline-none"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* 📈 Stats Table */}
        <SeasonStatsTable players={filteredPlayers} />
      </SectionCard>
    </div>
  );
}
