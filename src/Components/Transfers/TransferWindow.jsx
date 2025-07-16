import React, { useEffect, useState } from 'react';
import freeAgentsData from '../../../data/freeAgents.json';
import FreeAgentCard from './FreeAgentCard';
import { useCalendar } from '../Calendar/CalendarContext';
import {
  FaUsers,
  FaLock,
  FaFilter,
  FaSearch,
  FaGlobe,
  FaStar,
} from 'react-icons/fa';

const transferPhases = [
  'offseason_contracts',
  'mini_offseason',
  'midseason_off',
  'short_offseason',
  'end_season',
];

const assignRegion = (country) => {
  if (['US', 'Canada', 'Mexico'].includes(country)) return 'NA';
  if (['Argentina', 'Brazil'].includes(country)) return 'SA';
  if (['Japan', 'South Korea', 'Australia'].includes(country)) return 'APAC';
  if (
    [
      'Saudi Arabia', 'UAE', 'Qatar', 'Morocco', 'Algeria', 'Tunisia',
      'Egypt', 'France', 'Belgium', 'Finland', 'Bosnia and Herzegovina',
    ].includes(country)
  ) return 'MENA';
  return 'Other';
};

const TransferWindow = () => {
  const { currentPhase } = useCalendar();
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [region, setRegion] = useState('');
  const [minRating, setMinRating] = useState('');

  const isOpen = transferPhases.includes(currentPhase?.key);

  useEffect(() => {
    const enriched = freeAgentsData.map((agent) => ({
      ...agent,
      name: agent.Player || agent.name || '',
      rating: agent.Overall || agent.rating || 0,
      Region: assignRegion(agent.Country),
    }));
    setAgents(enriched);
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const playerName = agent.name || '';
    const playerRating = agent.rating || 0;
    return (
      playerName.toLowerCase().includes(search.toLowerCase()) &&
      (role ? agent.Role === role : true) &&
      (region ? agent.Region === region : true) &&
      (minRating ? playerRating >= parseFloat(minRating) : true)
    );
  });

  return (
    <div className="min-h-screen bg-[#0e0e12] text-white px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 text-2xl sm:text-3xl font-bold text-cyan-400">
            <FaUsers />
            <h1>Transfer Market</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Current Phase:{' '}
            <span className="text-cyan-300 font-medium">
              {currentPhase?.phase || 'Unknown'}
            </span>
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search player"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white outline-none text-sm w-40 sm:w-60"
            />
          </div>

          {/* Role */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-sm text-white">
            <FaFilter className="text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-900 text-white outline-none"
            >
              <option value="">All Roles</option>
              <option value="Entry">Entry</option>
              <option value="Support">Support</option>
              <option value="IGL">IGL</option>
              <option value="Flex">Flex</option>
            </select>
          </div>

          {/* Region */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-sm text-white">
            <FaGlobe className="text-gray-400" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-gray-900 text-white outline-none"
            >
              <option value="">All Regions</option>
              <option value="NA">North America</option>
              <option value="SA">South America</option>
              <option value="MENA">MENA</option>
              <option value="APAC">Asia-Pacific</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Min Rating */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-sm text-white">
            <FaStar className="text-yellow-400" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-gray-900 text-white outline-none"
            >
              <option value="">Rating ≥</option>
              <option value="65">65</option>
              <option value="68">68</option>
              <option value="70">70</option>
              <option value="72">72</option>
              <option value="75">75</option>
            </select>
          </div>
        </div>

        {/* Transfer Window Closed */}
        {!isOpen && (
          <div className="border border-yellow-600 bg-yellow-900/30 text-yellow-200 p-4 rounded-xl mb-8 flex items-center gap-3">
            <FaLock className="text-yellow-400 text-lg" />
            <span className="text-sm font-medium">
              Transfers are currently closed. Check back when the window opens.
            </span>
          </div>
        )}

        {/* Free Agents Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent, idx) => (
              <FreeAgentCard key={idx} player={agent} canSign={isOpen} />
            ))
          ) : (
            <p className="text-gray-400 italic">
              No players match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferWindow;
