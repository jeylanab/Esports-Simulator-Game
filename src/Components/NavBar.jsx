// src/components/Layout/Sidebar.jsx

import React, { useState } from 'react';
import {
  CalendarDays, Mail, Users, Repeat, Gamepad2, BarChart3, Trophy,
  LineChart, Medal, LogOut, Menu
} from 'lucide-react';

const navItems = [
  { key: 'calendar', label: 'Calendar', icon: <CalendarDays size={20} /> },
  { key: 'inbox', label: 'Inbox', icon: <Mail size={20} /> },
  { key: 'team', label: 'My Team', icon: <Users size={20} /> },
  { key: 'transfers', label: 'Transfers', icon: <Repeat size={20} /> },
  { key: 'simulator', label: 'Match Sim', icon: <Gamepad2 size={20} /> },
  { key: 'league', label: 'League', icon: <BarChart3 size={20} /> },
  { key: 'tournaments', label: 'Tournaments', icon: <Trophy size={20} /> },
  { key: 'stats', label: 'Awards/Stats', icon: <LineChart size={20} /> },
  { key: 'goat', label: 'GOAT Meter', icon: <Medal size={20} /> },
];

const Sidebar = ({ setActiveView, setScreen }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex flex-col h-screen bg-black text-white transition-all duration-300 
      ${collapsed ? 'w-16' : 'w-56'} shadow-xl fixed top-0 left-0 z-20`}>

      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <span className="text-cyan-400 font-extrabold text-lg tracking-tight">
          {!collapsed ? 'R6S' : 'R6S'}
        </span>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto space-y-2 py-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-800 transition text-left"
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Exit Button */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          {!collapsed && <span>Exit</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
