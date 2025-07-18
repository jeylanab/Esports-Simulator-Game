import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../Game/GameContext';
import {
  FaInbox,
  FaInfoCircle,
  FaExclamationTriangle,
  FaNewspaper,
  FaBolt,
} from 'react-icons/fa';

// Icon selector
const getIconByType = (type = 'info') => {
  switch (type.toLowerCase()) {
    case 'alert':
      return <FaExclamationTriangle className="text-yellow-400 text-lg mr-2" />;
    case 'news':
      return <FaNewspaper className="text-cyan-400 text-lg mr-2" />;
    case 'system':
      return <FaBolt className="text-purple-400 text-lg mr-2" />;
    case 'info':
    default:
      return <FaInfoCircle className="text-blue-400 text-lg mr-2" />;
  }
};

const InboxView = () => {
  const { inbox } = useGame();
  const scrollRef = useRef(null);
  const [readMessages, setReadMessages] = useState(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [inbox]);

  const handleMarkRead = (key) => {
    setReadMessages((prev) => new Set(prev).add(key));
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6 text-white">
      <div className="flex items-center gap-4 mb-8">
        <FaInbox className="text-cyan-400 text-4xl drop-shadow" />
        <div>
          <h2 className="text-3xl text-start font-extrabold tracking-tight text-cyan-400">Team Inbox</h2>
          <p className="text-sm text-gray-400">
            Stay updated with alerts, reports, and system logs.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="bg-[#12121a] border border-[#2a2a39] rounded-3xl p-6 max-h-[550px] overflow-y-auto space-y-5 relative custom-scrollbar"
      >
        {inbox.length === 0 ? (
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <FaInfoCircle className="text-gray-500 text-lg" />
            Your inbox is currently empty. Updates will appear as your journey progresses.
          </div>
        ) : (
          inbox.map((msg, i) => {
            const isRead = readMessages.has(msg.key);
            return (
              <div
                key={i}
                className={`bg-[#1c1c29] rounded-xl p-5 border ${
                  isRead ? 'border-gray-700' : 'border-yellow-400'
                } hover:border-cyan-400 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer`}
                onClick={() => handleMarkRead(msg.key)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getIconByType(msg.type)}
                    <h4
                      className={`text-base font-semibold tracking-wide ${
                        isRead ? 'text-gray-400' : 'text-cyan-300'
                      }`}
                    >
                      {msg.title}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{msg.date}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{msg.body}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InboxView;
