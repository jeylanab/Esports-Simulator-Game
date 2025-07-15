import { useGame } from '../Game/GameContext';
import { useEffect, useRef } from 'react';

const InboxView = () => {
  const { inbox } = useGame();
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to top when new messages are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [inbox]);

  return (
    <div className="bg-[#101015] text-white p-6 rounded-xl max-w-3xl mx-auto mt-10 shadow-md border border-[#2c2c39]">
      <h2 className="text-xl font-bold mb-4 tracking-wide">📬 My Office Inbox</h2>

      {inbox.length === 0 ? (
        <p className="text-sm text-gray-400">No messages yet. Check back after events or actions.</p>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {inbox.map((msg, i) => (
            <div
              key={i}
              className="bg-[#1b1b28] p-4 rounded-lg border border-gray-700 shadow-sm hover:border-cyan-500 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-base font-semibold text-cyan-400">{msg.title}</p>
                <span className="text-xs text-gray-500">{msg.date}</span>
              </div>
              <p className="text-sm text-gray-300 leading-snug">{msg.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxView;
