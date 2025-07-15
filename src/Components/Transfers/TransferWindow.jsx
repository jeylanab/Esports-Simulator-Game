// src/Components/Transfers/TransferWindow.jsx
import React, { useEffect, useState } from 'react';
import freeAgentsData from '../../../data/freeAgents.json';
import FreeAgentCard from './FreeAgentCard';
import { useCalendar } from '../Calendar/CalendarContext';

const transferPhases = [
  'offseason_contracts',
  'mini_offseason',
  'midseason_off',
  'short_offseason',
  'end_season',
];

const TransferWindow = () => {
  const { currentPhase } = useCalendar();
  const [agents, setAgents] = useState([]);
  const isOpen = transferPhases.includes(currentPhase?.key);

  useEffect(() => {
    setAgents(freeAgentsData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">📋 Free Agent Market</h1>
          <p className="text-gray-400">Phase: <span className="text-cyan-400">{currentPhase?.phase}</span></p>
        </header>

        {!isOpen && (
          <div className="bg-yellow-800 text-yellow-200 p-4 rounded mb-6 text-center font-medium border border-yellow-600">
            ✋ Transfers are closed right now. Come back later!
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, idx) => (
            <FreeAgentCard key={idx} player={agent} canSign={isOpen} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransferWindow;
