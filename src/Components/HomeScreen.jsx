import React from 'react';

const HomeScreen = ({ onStart, onLoadSlot1, onLoadSlot2 }) => (
  <div className="flex flex-col items-center justify-center min-h-screen  text-white p-6">
    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
      🎮 R6S Esports Manager
    </h1>

    <button
      className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded text-white text-lg mb-6 transition"
      onClick={onStart}
    >
      🚀 Start New Career
    </button>

    <div className="flex flex-col sm:flex-row gap-4">
      <button
        className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded text-white"
        onClick={onLoadSlot1}
      >
        📂 Load Slot 1
      </button>
      <button
        className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded text-white"
        onClick={onLoadSlot2}
      >
        📂 Load Slot 2
      </button>
    </div>
  </div>
);

export default HomeScreen;
