import React from 'react';
import { Play, FolderOpen } from 'lucide-react';

const HomeScreen = ({ onStart, onLoadSlot1, onLoadSlot2 }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000d0d] text-white p-6">
      <div className="bg-[#1c1c1c] border border-cyan-700 rounded-2xl shadow-lg p-10 w-full max-w-xl text-center space-y-6 transition-all">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 tracking-wide">
          Rainbow Six Siege
        </h1>
        
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white">
          Esports Manager
        </h2>

        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl text-lg font-semibold transition-all shadow-md w-full"
        >
          <Play className="w-5 h-5" />
          Start New Career
        </button>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onLoadSlot1}
            className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white px-5 py-2.5 rounded-xl transition-all shadow w-full sm:w-auto"
          >
            <FolderOpen className="w-5 h-5" />
            Load Slot 1
          </button>

          <button
            onClick={onLoadSlot2}
            className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white px-5 py-2.5 rounded-xl transition-all shadow w-full sm:w-auto"
          >
            <FolderOpen className="w-5 h-5" />
            Load Slot 2
          </button>
        </div>

        <p className="text-sm text-gray-400 pt-1">
          Build your legacy as an esports manager
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
