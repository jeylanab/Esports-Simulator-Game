import React from 'react';
import { useCalendar } from '../Calendar/CalendarContext';
import { FaLock, FaPlay } from 'react-icons/fa';
import dayjs from 'dayjs'; // install this if needed

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

  const formattedDate = `${dayjs(phase.start).format('MMM D')} – ${dayjs(phase.end).format('MMM D, YYYY')}`;

  return (
    <div className="bg-[#1f1f2a] text-slate-200 p-6 rounded-xl shadow-lg w-full sm:w-[48%] border border-[#2c2c3d] transition-transform transform hover:scale-[1.02]">
      <h2 className="text-xl font-extrabold mb-1 text-start">{phase.title}</h2>
      <p className="text-sm text-gray-400 mb-2">{phase.description}</p>
      <p className="text-xs text-gray-500 mb-5">Stage Dates: {formattedDate}</p>

      {isActive ? (
        <button
          onClick={onClick}
          className="flex items-center gap-2 justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-5 py-2 rounded-full text-white text-sm font-semibold shadow-md transition-all duration-150"
        >
          <FaPlay className="text-white text-sm" />
          Start League Matches
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

const LeagueMenu = ({ setActiveView, setCurrentLeaguePhase }) => {
  const { currentPhase } = useCalendar();

  const handleEnter = (phaseKey) => {
    setCurrentLeaguePhase(phaseKey);
    setActiveView('leagueView');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-white mb-6 tracking-wide">
        Regional League Simulation
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-6">
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
