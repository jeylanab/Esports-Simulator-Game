// src/Components/NavBar.jsx
import React from 'react';

const NavBar = ({ setScreen, setActiveView }) => {
  return (
    <nav className="bg-black text-white px-4 py-3 flex justify-between items-center shadow-md">
      <div className="text-xl text-cyan-400 font-bold">R6 Esports Manager</div>
      <div className="space-x-4 text-sm sm:text-base">
        <button onClick={() => setActiveView('calendar')} className="hover:text-blue-400">
          Calendar
        </button>
        <button onClick={() => setActiveView('inbox')} className="hover:text-blue-400">
          Inbox
        </button>
        <button onClick={() => setActiveView('career')} className="hover:text-blue-400">
          My Team
        </button>
        <button onClick={() => setActiveView('transfers')} className="hover:text-blue-400">
          Transfers
        </button>
        <button onClick={() => setActiveView('stats')} className="hover:text-blue-400">
          Stats
        </button>
        <button onClick={() => setScreen('home')} className="text-red-500 hover:text-red-400">
          Exit
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
