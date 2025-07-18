import React, { useState } from 'react';
import { useCalendar } from '../Calendar/CalendarContext';
import { seasonCalendar2026 } from '../Calendar/seasonCalendar2026';
import { FaLock, FaPlay } from 'react-icons/fa';
import dayjs from 'dayjs';

import BracketView from './BracketView';
import LCQView from './LCQView';
import Stage1Major from './Stage1Major';
import SiegeX from './SiegeX';
import Stage2Major from './Stage2Major';
import SILCQView from './SILCQView';

const tournamentPhases = [
  'si_2025',
  'stage1_lcq',
  'stage1_major',
  'siege_x',
  'stage2_major',
  'si_lcq',
];

const TournamentCard = ({ phase, currentPhase, onClick }) => {
  const isActive = currentPhase?.key === phase.key;
  const formattedDate = phase.start && phase.end
    ? `${dayjs(phase.start).format('MMM D')} – ${dayjs(phase.end).format('MMM D, YYYY')}`
    : null;

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-md hover:shadow-cyan-500/10 transition-all duration-300" data-aos="fade-up">
      <h2 className="text-lg text-start font-bold text-yellow-400 mb-1">{phase.phase}</h2>
      {phase.meta && <p className="text-sm text-gray-300 mb-2">{phase.meta}</p>}
      {formattedDate && <p className="text-xs text-gray-500 mb-5">Dates: {formattedDate}</p>}

      {isActive ? (
        <button
          onClick={onClick}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow"
        >
          <FaPlay />
          Enter Tournament
        </button>
      ) : (
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mt-2">
          <FaLock />
          Locked – Advance Calendar
        </div>
      )}
    </div>
  );
};

const TournamentsHome = () => {
  const { currentPhase } = useCalendar();
  const [activeBracket, setActiveBracket] = useState(null);

  const tournaments = seasonCalendar2026.filter((phase) =>
    tournamentPhases.includes(phase.key)
  );

  if (activeBracket) {
    switch (activeBracket.key) {
      case 'stage1_lcq':
        return <LCQView title={activeBracket.phase} phaseKey={activeBracket.key} goBack={() => setActiveBracket(null)} />;
      case 'stage1_major':
        return <Stage1Major goBack={() => setActiveBracket(null)} />;
      case 'siege_x':
        return <SiegeX goBack={() => setActiveBracket(null)} />;
      case 'stage2_major':
        return <Stage2Major goBack={() => setActiveBracket(null)} />;
      case 'si_lcq':
        return <SILCQView goBack={() => setActiveBracket(null)} />;
      default:
        return <BracketView title={activeBracket.phase} phaseKey={activeBracket.key} goBack={() => setActiveBracket(null)} />;
    }
  }

  return (
    <div className="p-6 sm:p-10 bg-[#000d0d] min-h-screen text-white">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Tournaments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tournaments.map((phase) => (
          <TournamentCard
            key={phase.key}
            phase={phase}
            currentPhase={currentPhase}
            onClick={() => setActiveBracket(phase)}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentsHome;
