import React, { useState } from 'react';
import {
  FiAward, FiUsers, FiTrendingUp, FiUserX, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { useStats } from '../Game/StatContext';
import AwardSection from './AwardSection';
import GoatLeaderboard from './GoatLeaderboard';
import PlayerCards from './PlayerCards';
import RetiredList from './RetiredList';

export default function StatBoard() {
  const { awards, goatPoints, playerStats, retiredPlayers } = useStats();

  const [showAwards, setShowAwards] = useState(true);
  const [showGoat, setShowGoat] = useState(true);
  const [showPlayers, setShowPlayers] = useState(true);
  const [showRetired, setShowRetired] = useState(true);

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
    <div className="p-6 bg-[#0d111b] text-white min-h-screen space-y-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-3 mb-4">
        <FiTrendingUp className="text-cyan-400" />
        Stat Dashboard
      </h2>

      <SectionCard
        icon={<FiAward />}
        title="Season Awards"
        toggle={showAwards}
        setToggle={setShowAwards}
      >
        <AwardSection awards={awards} />
      </SectionCard>

      <SectionCard
        icon={<FiTrendingUp />}
        title="GOAT Leaderboard"
        toggle={showGoat}
        setToggle={setShowGoat}
      >
        <GoatLeaderboard goatPoints={goatPoints} />
      </SectionCard>

      <SectionCard
        icon={<FiUsers />}
        title="Player Overview"
        toggle={showPlayers}
        setToggle={setShowPlayers}
      >
        <PlayerCards playerStats={playerStats} />
      </SectionCard>

      {retiredPlayers?.length > 0 && (
        <SectionCard
          icon={<FiUserX />}
          title="Retired Players"
          toggle={showRetired}
          setToggle={setShowRetired}
        >
          <RetiredList retiredPlayers={retiredPlayers} />
        </SectionCard>
      )}
    </div>
  );
}
