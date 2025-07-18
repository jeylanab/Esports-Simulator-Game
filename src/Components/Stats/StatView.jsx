import React, { useState } from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import StatBoard from './StatBoard';
import AwardSection from './AwardSection';
import GoatLeaderboard from './GoatLeaderboard';
import RetiredList from './RetiredList';
import PlayerCards from './PlayerCards';

export default function StatView() {
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { key: 'stats', label: 'Team & Player Stats' },
    { key: 'awards', label: 'Awards' },
    { key: 'goat', label: 'GOAT Tracker' },
    { key: 'retired', label: 'Retired Players' },
    { key: 'cards', label: 'Player Cards' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'awards':
        return <AwardSection />;
      case 'goat':
        return <GoatLeaderboard />;
      case 'retired':
        return <RetiredList />;
      case 'cards':
        return <PlayerCards />;
      case 'stats':
      default:
        return <StatBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d111b] px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FiBarChart2 className="text-3xl text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
            Stats & Awards Hub
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render selected view */}
        <div className="bg-[#111827] p-4 rounded-xl shadow-xl">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
