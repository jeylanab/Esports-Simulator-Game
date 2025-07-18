import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays, Mail, Users, Repeat, Gamepad2,
  BarChart3, Trophy, LineChart, Medal, LogOut, Menu, DollarSign, X
} from 'lucide-react';
import { useGame } from './Game/GameContext';

const navItems = [
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'inbox', label: 'Inbox', icon: Mail },
  { key: 'team', label: 'My Team', icon: Users },
  { key: 'transfers', label: 'Transfers', icon: Repeat },
  { key: 'simulator', label: 'Match Sim', icon: Gamepad2 },
  { key: 'league', label: 'League', icon: BarChart3 },
  { key: 'tournaments', label: 'Tournaments', icon: Trophy },
  { key: 'economy', label: 'Economy', icon: DollarSign },
  { key: 'stats', label: 'Awards / Stats', icon: LineChart },
  { key: 'goat', label: 'GOAT Meter', icon: Medal },
];

const Sidebar = ({ setActiveView = () => {}, setScreen = () => {} }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('calendar');
  const { inbox } = useGame();
  const sidebarRef = useRef(null);

  const unreadCount = inbox.filter(msg => !msg.read).length;

  // Handle screen resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Collapse sidebar on outside click in mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && !collapsed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, collapsed]);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const expandedWidth = 'w-44';
  const collapsedWidth = 'w-16';

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          aria-label="Toggle sidebar"
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#111] text-white z-40 shadow-lg transition-all duration-300 ease-in-out
          ${collapsed ? (isMobile ? '-translate-x-full' : collapsedWidth) : expandedWidth}
          ${isMobile ? 'w-64' : ''}`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-cyan-400 font-bold font-mono text-lg tracking-tight">
            {collapsed && !isMobile ? 'R6' : 'R6 Siege'}
          </span>
          {!isMobile && (
            <button
              aria-label="Collapse sidebar"
              className="text-gray-400 hover:text-white"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isInbox = key === 'inbox';
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setActiveView(key);
                  if (isMobile) setCollapsed(true);
                }}
                className={`flex items-center justify-between w-full px-4 py-2 transition text-left text-sm font-medium
                  ${isActive ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon and Label */}
                <span className="flex items-center gap-3">
                  <Icon size={20} />
                  {!collapsed || isMobile ? label : null}
                </span>

                {/* Inbox badge */}
                {isInbox && unreadCount > 0 && (
                  !collapsed || isMobile ? (
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  ) : (
                    <span className="w-2 h-2 bg-red-500 rounded-full ml-1" />
                  )
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Exit */}
        <div className="px-4 py-4 border-t border-gray-800">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
          >
            <LogOut size={20} />
            {!collapsed || isMobile ? <span>Exit</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
