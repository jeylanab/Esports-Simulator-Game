import { useGame } from '../Game/GameContext';
import { useEffect, useRef } from 'react';
import {
  FaInbox,
  FaInfoCircle,
  FaExclamationTriangle,
  FaNewspaper,
} from 'react-icons/fa';

const getIconByType = (type = 'info') => {
  switch (type.toLowerCase()) {
    case 'alert':
      return <FaExclamationTriangle className="text-yellow-400 text-lg mr-2" />;
    case 'news':
      return <FaNewspaper className="text-cyan-400 text-lg mr-2" />;
    case 'info':
    default:
      return <FaInfoCircle className="text-blue-400 text-lg mr-2" />;
  }
};

const InboxView = () => {
  const { inbox } = useGame();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [inbox]);

  return (
    <div className="bg-[#0e0e14] text-white p-6 rounded-2xl max-w-3xl mx-auto mt-10 shadow-md border border-[#2c2c39]">
      {/* Header */}
      <header className="mb-6 flex items-center gap-3">
        <FaInbox className="text-cyan-400 text-2xl" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-cyan-400">Team Inbox</h2>
          <p className="text-sm text-gray-400">
            Stay updated with simulation news, alerts, and team messages.
          </p>
        </div>
      </header>

      {/* Empty Inbox */}
      {inbox.length === 0 ? (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <FaInfoCircle className="text-gray-500" />
          Your inbox is currently empty. New updates will appear here after events or key actions.
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          aria-label="Inbox Messages"
        >
          {inbox.map((msg, i) => (
            <div
              key={i}
              className="bg-[#181822] p-4 rounded-xl border border-gray-700 hover:border-cyan-500 transition duration-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getIconByType(msg.type)}
                  <p className="text-base font-semibold text-cyan-300">{msg.title}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{msg.date}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{msg.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxView;
