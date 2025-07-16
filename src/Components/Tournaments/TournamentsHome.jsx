import React, { useState } from 'react';
import { useCalendar } from '../Calendar/CalendarContext';
import { seasonCalendar2026 } from '../Calendar/seasonCalendar2026';
import { FaLock } from 'react-icons/fa';
import dayjs from 'dayjs';

import BracketView from './BracketView';
import LCQView from './LCQView';
import Stage1Major from './Stage1Major';
import SiegeX from './SiegeX'; // ✅ Import the new component

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
    <div className="bg-[#1f1f2a] text-slate-200 p-5 rounded-xl shadow-md w-full border border-[#2c2c3d] transition-transform hover:scale-[1.02] duration-200">
      <h2 className="text-base font-bold mb-1">{phase.phase}</h2>
      {phase.meta && (
        <p className="text-sm text-gray-400 mb-2">{phase.meta}</p>
      )}
      {formattedDate && (
        <p className="text-xs text-gray-500 mb-4">Stage Dates: {formattedDate}</p>
      )}

      {isActive ? (
        <button
          onClick={onClick}
          className="flex items-center gap-2 justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-4 py-2 rounded-full text-white text-xs font-semibold shadow-sm transition-all"
        >
          Enter Tournament
        </button>
      ) : (
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mt-1">
          <FaLock className="text-yellow-400" />
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

  // ✅ Handle different brackets
  if (activeBracket) {
    switch (activeBracket.key) {
      case 'stage1_lcq':
        return (
          <LCQView
            title={activeBracket.phase}
            phaseKey={activeBracket.key}
            goBack={() => setActiveBracket(null)}
          />
        );

      case 'stage1_major':
        return (
          <Stage1Major goBack={() => setActiveBracket(null)} />
        );

      case 'siege_x':
        return (
          <SiegeX goBack={() => setActiveBracket(null)} />
        );

      default:
        return (
          <BracketView
            title={activeBracket.phase}
            phaseKey={activeBracket.key}
            goBack={() => setActiveBracket(null)}
          />
        );
    }
  }

  return (
    <div className="p-6 min-h-screen bg-[#000d0d] text-white">
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        Tournaments
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tournaments.map((tourney) => (
          <TournamentCard
            key={tourney.key}
            phase={tourney}
            currentPhase={currentPhase}
            onClick={() => setActiveBracket(tourney)}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentsHome;
