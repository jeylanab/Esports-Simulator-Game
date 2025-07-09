// src/Components/Layout/NavBar.jsx (or wherever you keep it)

import React from 'react';

const NavBar = ({ setScreen, setActiveView }) => {
  const navItems = [
    { key: 'calendar', label: '📅 Calendar' },
    { key: 'inbox', label: '📨 Inbox' },
    { key: 'team', label: '🧑‍🤝‍🧑 My Team' },
    { key: 'transfers', label: '🔁 Transfers' },
    { key: 'simulator', label: '🕹 Match Sim' },      // Match Simulator
    { key: 'league', label: '📊 League' },            // ✅ NEW League View
    { key: 'tournaments', label: '🏆 Tournaments' },  // ✅ NEW Tournament View
    { key: 'stats', label: '📈 Awards/Stats' },       // ✅ NEW Stats / Awards View
  ];

  return (
    <nav className="bg-black text-white px-4 py-3 flex justify-between items-center shadow-lg border-b border-gray-700">
      {/* Left: App Title */}
      <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 tracking-tight">
        R6S Manager
      </div>

      {/* Right: Navigation Buttons */}
      <div className="space-x-3 text-sm sm:text-base flex flex-wrap items-center">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className="hover:text-cyan-300 transition duration-200"
          >
            {item.label}
          </button>
        ))}

        {/* Exit Button */}
        <button
          onClick={() => setScreen('home')}
          className="text-red-400 hover:text-red-300 font-semibold"
        >
          🚪 Exit
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
