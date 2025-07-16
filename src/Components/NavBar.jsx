import React, { useState, useEffect } from 'react';
import {
  CalendarDays, Mail, Users, Repeat, Gamepad2,
  BarChart3, Trophy, LineChart, Medal, LogOut, Menu, DollarSign, X
} from 'lucide-react';

const navItems = [
  { key: 'calendar', label: 'Calendar', icon: <CalendarDays size={20} /> },
  { key: 'inbox', label: 'Inbox', icon: <Mail size={20} /> },
  { key: 'team', label: 'My Team', icon: <Users size={20} /> },
  { key: 'transfers', label: 'Transfers', icon: <Repeat size={20} /> },
  { key: 'simulator', label: 'Match Sim', icon: <Gamepad2 size={20} /> },
  { key: 'league', label: 'League', icon: <BarChart3 size={20} /> },
  { key: 'tournaments', label: 'Tournaments', icon: <Trophy size={20} /> },
  { key: 'economy', label: 'Economy', icon: <DollarSign size={20} /> },
  { key: 'stats', label: 'Awards / Stats', icon: <LineChart size={20} /> },
  { key: 'goat', label: 'GOAT Meter', icon: <Medal size={20} /> },
];

const Sidebar = ({ setActiveView = () => {}, setScreen = () => {} }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('calendar');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-40 bg-black p-2 rounded-full shadow-md text-white"
          onClick={toggleSidebar}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-black text-white fixed top-0 left-0 z-30 h-full shadow-md transition-all duration-300 ease-in-out 
          ${collapsed ? (isMobile ? '-translate-x-full' : 'w-16') : 'w-56'} 
          ${isMobile ? 'w-64' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className="text-cyan-400 font-extrabol font-mono text-lg tracking-tight">
            {!collapsed || isMobile ? 'R6S' : 'R6S'}
          </span>
          {!isMobile && (
            <button
              className="text-gray-400 hover:text-white"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setActiveView(item.key);
                if (isMobile) setCollapsed(true);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 transition text-left text-sm font-medium
                ${activeTab === item.key ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'}`}
            >
              {item.icon}
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Exit */}
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-3 text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            {(!collapsed || isMobile) && <span>Exit</span>}
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isMobile ? 'ml-0' : collapsed ? 'ml-16' : 'ml-56'
        }`}
      >
        <div className="p-4">
          {/* Main app content placeholder */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
