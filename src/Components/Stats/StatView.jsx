import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import StatBoard from './StatBoard';

export default function StatView() {
  return (
    <div className="min-h-screen bg-[#0d111b] px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FiBarChart2 className="text-3xl text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">
            Team & Player Stats
          </h1>
        </div>

        <StatBoard />
      </div>
    </div>
  );
}
