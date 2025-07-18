import React from 'react';
import { useCalendar } from '../Calendar/CalendarContext';
import { FaLock, FaPlay } from 'react-icons/fa';
import dayjs from 'dayjs';

const leaguePhases = [
  {
    title: "Stage 1: Regional League Play",
    key: "stage1_leagues",
    start: "2026-03-03",
    end: "2026-04-20",
    description: "4 regions × 10 teams · 9 matchdays · Single round-robin",
  },
  {
    title: "Stage 2: Regional League Play",
    key: "stage2_leagues",
    start: "2026-06-07",
    end: "2026-07-26",
    description: "Same format as Stage 1 · 4 regions × 10 teams",
  },
];

const LeagueCard = ({ phase, currentPhase, onClick }) => {
  const isActive = currentPhase?.key === phase.key;
  const date = `${dayjs(phase.start).format('MMM D')} – ${dayjs(phase.end).format('MMM D, YYYY')}`;

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-md hover:shadow-cyan-500/10 transition-all duration-300" data-aos="fade-up">
      <h2 className="text-lg font-bold text-start text-yellow-400 mb-1">{phase.title}</h2>
      <p className="text-sm text-gray-300 mb-2">{phase.description}</p>
      <p className="text-xs text-gray-500 mb-5">Dates: {date}</p>

      {isActive ? (
        <button
          onClick={onClick}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow"
        >
          <FaPlay />
          Start League Matches
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

const LeagueMenu = ({ setActiveView, setCurrentLeaguePhase }) => {
  const { currentPhase } = useCalendar();

  const handleEnter = (phaseKey) => {
    setCurrentLeaguePhase(phaseKey);
    setActiveView('leagueView');
  };

  return (
    <div className="p-6 sm:p-10 bg-[#000d0d] min-h-screen text-white">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Regional Leagues</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {leaguePhases.map((phase) => (
          <LeagueCard
            key={phase.key}
            phase={phase}
            currentPhase={currentPhase}
            onClick={() => handleEnter(phase.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default LeagueMenu;
