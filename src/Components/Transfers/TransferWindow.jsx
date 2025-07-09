// src/Components/Transfers/TransferWindow.jsx
import React, { useEffect, useState } from 'react';
import freeAgentsData from '../../../data/freeAgents.json';
import FreeAgentCard from './FreeAgentCard';

const TransferWindow = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    setAgents(freeAgentsData); // ⬅️ Load on mount
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Free Agent Transfer Window</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, idx) => (
          <FreeAgentCard key={idx} player={agent} />
        ))}
      </div>
    </div>
  );
};

export default TransferWindow;
